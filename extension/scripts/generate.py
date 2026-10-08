#!/usr/bin/env python3
"""
Lennar Payload Generator — Phase 1 CLI

Reads a Cognito Form 17 entry by ID, joins it against the Lennar Payload
Rules + Community Reference DB in Airtable, and emits a payload matching
Lennar_Payload_Examples.md shape.

Phase 1 scope: standalone CLI. Phase 2 wraps this as an endpoint; Phase 3
triggers from a Cognito submission webhook. Scaffold is intentionally
shaped to make the Phase 2 wrap trivial.

See extension/scripts/README.md for setup and usage.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv


# -------- CLI --------

def parse_entry_id(raw: str) -> int:
    """Accept either a bare integer or a Cognito entry URL. Return int."""
    raw = raw.strip()
    if raw.isdigit():
        return int(raw)
    # Match a trailing integer in a Cognito entry URL,
    # e.g. https://www.cognitoforms.com/Shared/Form_17/42
    match = re.search(r"/(\d+)/?$", raw)
    if match:
        return int(match.group(1))
    raise argparse.ArgumentTypeError(
        f"Could not parse an entry ID from {raw!r}. "
        f"Pass an integer or a Cognito entry URL ending in /<id>."
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="generate.py",
        description=(
            "Generate a Lennar listing payload from a Cognito Form 17 entry."
        ),
    )
    parser.add_argument(
        "--entry-id",
        type=parse_entry_id,
        required=True,
        help="Cognito entry ID (integer) or a pasted Cognito entry URL.",
    )
    output = parser.add_mutually_exclusive_group()
    output.add_argument(
        "--clipboard",
        action="store_true",
        help="Copy the generated payload to the macOS clipboard (pbcopy).",
    )
    output.add_argument(
        "--out",
        type=Path,
        metavar="PATH",
        help="Write the generated payload to this file.",
    )
    return parser


# -------- Env loading & validation --------

REQUIRED_ENV_VARS = (
    "AIRTABLE_PAT",
    "AIRTABLE_LENNAR_BASE_ID",
    "AIRTABLE_CVRMLS_BASE_ID",
    "COGNITO_API_KEY",
    "COGNITO_FORM_ID",
)


def load_env() -> dict[str, str]:
    """Load .env next to this script. Return a dict of required vars."""
    script_dir = Path(__file__).resolve().parent
    load_dotenv(script_dir / ".env")

    missing = [v for v in REQUIRED_ENV_VARS if not os.getenv(v)]
    if missing:
        sys.exit(
            f"Missing required environment variables: {', '.join(missing)}.\n"
            f"Copy .env.example to .env and fill in values."
        )

    return {v: os.environ[v] for v in REQUIRED_ENV_VARS}


# -------- Output --------

def emit(payload: str, args: argparse.Namespace) -> None:
    """Route the generated payload to stdout, clipboard, or file."""
    if args.clipboard:
        subprocess.run(["pbcopy"], input=payload, text=True, check=True)
        print("Payload copied to clipboard.", file=sys.stderr)
    elif args.out:
        args.out.write_text(payload)
        print(f"Payload written to {args.out}", file=sys.stderr)
    else:
        print(payload)


# -------- Payload generation: Phase 1 pipeline --------
#
# Replaces the Phase 1 scaffold placeholder with the real pipeline:
#   1. Fetch Cognito Form 17 entry → 2. resolve community →
#   3. fetch Rules + Cognito Fields + Source Types + Community DB from
#   Airtable → 4. dispatch per Source Type → 5. assemble payload matching
#   Lennar_Payload_Examples.md.
#
# Per HANDOFF-2026-10-05-phase-1-pipeline-build.md.

# ---------------------------------------------------------------------------
# Airtable base + table identifiers (resolved 2026-10-05)
# ---------------------------------------------------------------------------

LENNAR_BASE_ID = os.getenv("AIRTABLE_LENNAR_BASE_ID", "app78fMUwDNBHUZ6r")

PAYLOAD_RULES_TABLE_ID    = "tbletiuyEdhVwcwGw"
COGNITO_FIELDS_TABLE_ID   = "tbl9LWfHDEuYtgFvv"
SOURCE_TYPES_TABLE_ID     = "tblpwaJswUvNpYOyY"
COMMUNITY_DB_TABLE_ID     = "tbleMbM1WgY8Si2t7"

AIRTABLE_API_BASE = "https://api.airtable.com/v0"
COGNITO_API_BASE  = "https://www.cognitoforms.com/api"


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def _airtable_headers() -> dict:
    pat = os.environ["AIRTABLE_PAT"]
    return {"Authorization": f"Bearer {pat}"}


def _cognito_headers() -> dict:
    key = os.environ["COGNITO_API_KEY"]
    # Cognito accepts API key via Authorization: Bearer header
    return {"Authorization": f"Bearer {key}"}


def _airtable_list_all(table_id: str) -> list:
    """Fetch every record from an Airtable table, handling pagination."""
    url = f"{AIRTABLE_API_BASE}/{LENNAR_BASE_ID}/{table_id}"
    records = []
    offset = None
    while True:
        params = {"pageSize": 100}
        if offset:
            params["offset"] = offset
        resp = requests.get(url, headers=_airtable_headers(), params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        records.extend(data.get("records", []))
        offset = data.get("offset")
        if not offset:
            break
    return records


def _cognito_fetch_entry(form_id: str, entry_id) -> dict:
    """Fetch one Cognito form entry by ID. Raises on 404 or auth failure."""
    url = f"{COGNITO_API_BASE}/forms/{form_id}/entries/{entry_id}"
    resp = requests.get(url, headers=_cognito_headers(), timeout=30)
    if resp.status_code == 404:
        raise RuntimeError(f"Cognito entry {entry_id} not found on form {form_id}")
    if resp.status_code == 401 or resp.status_code == 403:
        raise RuntimeError(
            f"Cognito auth failed ({resp.status_code}) fetching entry {entry_id}. "
            "Check COGNITO_API_KEY in .env."
        )
    resp.raise_for_status()
    return resp.json()


# ---------------------------------------------------------------------------
# Cognito field access — dotted path → nested dict lookup
# ---------------------------------------------------------------------------

def _cognito_get(entry: dict, dotted_path: str):
    """
    Read a Cognito field by its dotted path from a nested entry dict.

    The Cognito API returns entries as a nested object matching the form's
    section structure. 'PropertyBasics.PropertyType' walks entry["PropertyBasics"]["PropertyType"].

    Returns None if any path segment is missing. Returns the raw value otherwise
    (which may itself be None if the field is unset).

    Note: Cognito multi-select fields come back as comma-joined strings
    (e.g. "Electric Cooking,Disposal,Dishwasher"), not arrays. Callers that
    need a list should split on comma and strip.
    """
    node = entry
    for segment in dotted_path.split("."):
        if not isinstance(node, dict):
            return None
        node = node.get(segment)
        if node is None:
            return None
    return node


def _cognito_multiselect_list(entry: dict, dotted_path: str) -> list:
    """Read a Cognito multi-select field as a list of trimmed option strings."""
    raw = _cognito_get(entry, dotted_path)
    if not raw:
        return []
    if isinstance(raw, list):
        return [str(x).strip() for x in raw if str(x).strip()]
    # Cognito's standard shape: comma-joined string
    return [part.strip() for part in str(raw).split(",") if part.strip()]


def _cognito_yesno(entry: dict, dotted_path: str) -> str:
    """
    Read a Cognito Yes/No-type field and normalize to "Yes"/"No" strings.

    Cognito's YesNo field type returns boolean (True/False) on the single-entry
    API, while a Choice field with Yes/No options returns the string ("Yes"/"No").
    Dispatcher branches comparing against literal "Yes"/"No" silently fail on
    YesNo fields (False != "No", True != "Yes"). This helper collapses both
    shapes to the string form so dispatcher comparisons do not have to care
    which Cognito field type was used. Returns "" when the field is unset.

    As of 2026-10-07 the only YesNo-type field read by the dispatcher is
    BuildFeatures.Basement.Basement (Rules 111 and 114). Garage1 and Pool Y/N
    are Choice/DB-text and continue to work with plain string comparison.
    """
    raw = _cognito_get(entry, dotted_path)
    if raw is None:
        return ""
    if isinstance(raw, bool):
        return "Yes" if raw else "No"
    if isinstance(raw, str):
        return raw
    return str(raw)


# ---------------------------------------------------------------------------
# Community resolution — convention #6
# ---------------------------------------------------------------------------

PROPERTY_TYPE_SUFFIX = {
    "Single Family": "SF",
    "Townhouse": "TH",
}


def _resolve_community_key(entry: dict) -> str:
    """
    Build the Community Reference DB lookup key from Form 17's Intake.Community
    + PropertyBasics.PropertyType per convention #6.

    'Harpers Mill' + 'Townhouse' → 'Harpers Mill TH'.
    """
    community = _cognito_get(entry, "Intake.Community")
    prop_type = _cognito_get(entry, "PropertyBasics.PropertyType")
    if not community or not prop_type:
        raise RuntimeError(
            f"Community resolution requires both Intake.Community ({community!r}) "
            f"and PropertyBasics.PropertyType ({prop_type!r}); one or both are missing."
        )
    suffix = PROPERTY_TYPE_SUFFIX.get(prop_type)
    if not suffix:
        raise RuntimeError(
            f"Unknown PropertyType {prop_type!r}; expected 'Single Family' or 'Townhouse'."
        )
    return f"{community} {suffix}"


def _find_community_row(community_rows: list, community_key: str) -> dict:
    """
    Hard-fail lookup against the Community Reference DB per convention #6.
    No fuzzy match, no default, no silent omission.
    """
    for row in community_rows:
        if row.get("fields", {}).get("Community") == community_key:
            return row["fields"]
    valid = sorted({r.get("fields", {}).get("Community") for r in community_rows if r.get("fields", {}).get("Community")})
    raise RuntimeError(
        f"Community lookup failed: {community_key!r} has no row in the Community Reference DB. "
        f"Valid communities currently: {valid}. "
        "Per Payload_Rules_Conventions #6 this is a hard error — fix the NHC's Form 17 "
        "Intake.Community + PropertyBasics.PropertyType selection, don't guess here."
    )


# ---------------------------------------------------------------------------
# Rule-table lookups — resolve link columns from referenced records
# ---------------------------------------------------------------------------

def _build_record_index(records: list, field_name: str) -> dict:
    """Index records by their primary field name for linked-record resolution."""
    return {r["id"]: r.get("fields", {}).get(field_name) for r in records}


# ---------------------------------------------------------------------------
# Output-key routing — Matrix Input ID → envelope section + payload key
# ---------------------------------------------------------------------------
#
# The Rules table doesn't carry the final payload key explicitly — rules name
# the Matrix Input ID and the Matrix field label, but the payload shape (which
# section the key lives in, what the key is called) is defined by
# Lennar_Payload_Examples.md.
#
# This map codifies the example's shape. Each entry maps an Input ID to:
#   (section, key)
#
# Keys that live at the top level of a section use (section, key).
# Bath Info uses (section, sub_object, sub_key) three-tuples because bath
# levels are nested one layer deeper.

OUTPUT_MAP = {
    # Owner Info
    "Input_118": ("owner", "owner_name"),
    "Input_119": ("owner", "occupant_name"),
    "Input_120": ("owner", "owned_by"),
    "Input_121": ("owner", "possession"),
    "Input_124": ("owner", "owner_agent"),
    "Input_606": ("owner", "occupied_by"),
    "Input_707": ("owner", "agent_related"),

    # Agent/Office Info
    "Input_163": ("agent_office", "type"),
    "Input_164": ("agent_office", "limited_rep"),

    # Internet Display Info — Rules exist but extension hardcodes without a
    # payload key (per v0.7 decision). Rules are present for completeness but
    # are intentionally dropped from the payload. See _is_internal_only_rule().

    # Showing Instructions
    "Input_136": ("showing", "showing_instr_2"),
    "Input_138": ("showing", "additional_instructions"),
    "Input_722": ("showing", "_showing_flags"),  # see _emit_showing_flags()

    # Virtual Tour Info
    "Input_610": ("_virtual_tour", "url"),  # see tab-skip logic below

    # Bath Info — three-tuple ("bath", level, sub_key)
    "Input_57":  ("bath", "basement", "desc"),
    "Input_58":  ("bath", "level1",   "desc"),
    "Input_59":  ("bath", "level2",   "desc"),
    "Input_60":  ("bath", "level3",   "desc"),
    "Input_61":  ("bath", "basement", "full"),
    "Input_62":  ("bath", "level1",   "full"),
    "Input_63":  ("bath", "level2",   "full"),
    "Input_64":  ("bath", "level3",   "full"),
    "Input_65":  ("bath", "basement", "half"),
    "Input_66":  ("bath", "level1",   "half"),
    "Input_67":  ("bath", "level2",   "half"),
    "Input_68":  ("bath", "level3",   "half"),

    # General Info
    "Input_94":  ("general", "waterfront"),
    "Input_95":  ("listing", "acres"),  # new-path only
    "Input_100": ("listing", "legal_description"),  # new-path only
    "Input_102": ("general", "disclosures"),
    "Input_103": ("general", "lead_disclosure"),
    "Input_246": ("listing", "tax_year"),  # new-path only
    "Input_248": ("general", "assd_improvement"),
    "Input_249": ("general", "model_available"),

    # Fee Info
    "Input_109": ("fee", "hoa_condo"),
    "Input_110": ("fee", "fee_amount"),
    "Input_111": ("fee", "fee_desc"),
    "Input_112": ("fee", "membership_required"),
    "Input_113": ("fee", "fee_period"),
    "Input_115": ("fee", "addl_fee_amount"),
    "Input_117": ("fee", "addl_fee_desc"),
    "Input_576": ("fee", "fee_includes"),
    "Input_705": ("fee", "management_firm"),
    "Input_719": ("fee", "addl_hoa"),

    # Remarks
    "Input_107": ("remarks", "remarks"),
    "Input_108": ("remarks", "agent_comments"),
    "Input_662": ("remarks", "copyright_agreement"),

    # Listing Info
    "Input_29":  ("listing", "county_city"),
    "Input_30":  ("listing", "area"),
    "Input_31":  ("listing", "list_price"),
    "Input_32":  ("listing", "delayed_show"),
    "Input_34":  ("listing", "street_number"),  # new-path only
    "Input_36":  ("listing", "street_name"),    # new-path only
    "Input_41":  ("listing", "post_office"),
    "Input_42":  ("listing", "new_resale"),
    "Input_44":  ("listing", "year_built"),
    "Input_45":  ("listing", "year_built_desc"),
    "Input_47":  ("listing", "bedrooms"),
    "Input_48":  ("listing", "rooms"),
    "Input_49":  ("listing", "levels"),
    "Input_51":  ("listing", "elementary"),
    "Input_52":  ("listing", "high"),
    "Input_53":  ("listing", "middle"),
    "Input_99":  ("listing", "pid"),  # new-path only
    "Input_160": ("listing", "list_date"),
    "Input_162": ("listing", "expire_date"),
    "Input_236": ("listing", "neighborhood"),
    "Input_259": ("listing", "subdivision"),
    "Input_622": ("listing", "lot"),  # new-path only
    "Input_635": ("listing", "zip"),
    "Input_849": ("listing", "type"),
    "Input_850": ("listing", "attached_yn"),
    "Input_879": ("listing", "sqft_above_finished"),
    "Input_880": ("listing", "sqft_above_unfinished"),
    "Input_882": ("listing", "sqft_below_finished"),
    "Input_883": ("listing", "sqft_below_unfinished"),
    "Input_97":  ("listing", "sqft_source"),

    # Features — features_a vs features_b per the example's grouping
    "Input_70":  ("features_a", "structure"),
    "Input_71":  ("features_a", "siding"),
    "Input_72":  ("features_a", "roof"),
    "Input_73":  ("features_a", "flooring"),
    "Input_90":  ("features_a", "fireplace"),
    "Input_150": ("features_a", "garage_yn"),
    "Input_152": ("features_a", "num_fp"),
    "Input_153": ("features_a", "basement_yn"),
    "Input_226": ("features_a", "num_cars"),
    "Input_241": ("features_a", "attic"),
    "Input_519": ("features_a", "parking"),
    "Input_539": ("features_a", "garage"),
    "Input_541": ("features_a", "style"),
    "Input_568": ("features_a", "interior"),
    "Input_569": ("features_a", "basement_foundation"),
    "Input_570": ("features_a", "exterior"),
    "Input_670": ("features_a", "sewer"),
    "Input_676": ("features_a", "water"),
    "Input_693": ("features_a", "golf_frontage_yn"),

    "Input_81":  ("features_b", "appl_equip"),
    "Input_86":  ("features_b", "heating"),
    "Input_87":  ("features_b", "heat_fuel"),
    "Input_88":  ("features_b", "cooling"),
    "Input_91":  ("features_b", "pool_desc"),
    "Input_92":  ("features_b", "porch"),
    "Input_244": ("features_b", "pool_yn"),
    "Input_254": ("features_b", "wall_type"),
    "Input_534": ("features_b", "community_amenities"),
    "Input_571": ("features_b", "water_heater"),
    "Input_657": ("features_b", "unit_placement"),
}

# Input IDs on the Rules table that are intentionally not emitted (extension
# hardcodes them with no payload key). Per v0.7 decision — rows exist in Rules
# so the tab is represented, but the payload omits them.
INTERNET_DISPLAY_INPUT_IDS = {"Input_227", "Input_228", "Input_229", "Input_230"}


# ---------------------------------------------------------------------------
# Features-tab prefixing — resolves the bare-code vs. full-Input-ID shape gap
# (option A from 2026-10-05 pipeline-build decision)
# ---------------------------------------------------------------------------
#
# The Rules table stores Features-tab checkbox outputs as bare suffix codes
# (e.g. STATIC "[\"03\"]" for Structure, Transform producing "01","13" for
# Interior). The known-good example payload requires full Input_XX_YY IDs for
# every Features-tab checkbox group. This function prefixes bare codes with
# the rule's Matrix Input ID at output time, for Features-tab checkbox-group
# rules only.
#
# Non-Features checkbox groups (Disclosures, Lead Disclosure, Owned By,
# Possession, Fee Includes, Fee Desc, Showing Flags) stay as bare codes.
#
# Heating / Heat Fuel are COMMUNITY_DB rules whose DB columns already store
# full Input IDs ("Input_86_08", "Input_87_02"), so they pass through
# unchanged by this function — the codes are already prefixed.
#
# When this convention proves out across more communities and gets codified,
# it becomes Payload_Rules_Conventions #10.

def _prefix_features_codes(input_id: str, codes: list, tab: str) -> list:
    """
    For Features-tab checkbox groups: prefix each bare code with the
    Matrix Input ID. Codes that already start with "Input_" pass through
    unchanged (handles the Heating / Heat Fuel case).

    For any other tab: return codes unchanged.
    """
    if tab != "Features":
        return codes
    out = []
    for code in codes:
        s = str(code)
        if s.startswith("Input_"):
            out.append(s)
        else:
            out.append(f"{input_id}_{s}")
    return out


# ---------------------------------------------------------------------------
# Transform executors — per Source Type
# ---------------------------------------------------------------------------

def _parse_static_value(static_value: str, input_id: str, tab: str):
    """
    STATIC rule output. Static Value is stored as a Python/JSON-ish string.
    JSON-array-shaped strings ("[...]") parse to lists; everything else is
    returned as the raw string (including an empty string, which is a
    deliberate empty write per convention #4).
    """
    if static_value is None:
        # STATIC with null Static Value = empty string per convention #4
        return ""
    s = static_value.strip()
    if s.startswith("[") and s.endswith("]"):
        try:
            parsed = json.loads(s)
            if isinstance(parsed, list):
                return _prefix_features_codes(input_id, parsed, tab)
        except json.JSONDecodeError:
            pass
    return s


# ---- COGNITO handlers ------------------------------------------------------

def _handle_cognito(rule: dict, entry: dict, cognito_field_paths: list) -> object:
    """
    COGNITO source: read the first linked Cognito field. Apply Transform if
    present. Null/empty → "0" for numeric Matrix TEXT fields handled by the
    caller via convention #1.
    """
    if not cognito_field_paths:
        return None
    field_path = cognito_field_paths[0]
    raw = _cognito_get(entry, field_path)
    transform = rule.get("Transform / Logic")
    input_id = rule.get("Matrix Input ID", "")
    tab = rule.get("Tab", "")

    # Rule-specific Transforms. Keyed by Matrix Input ID.
    if transform:
        return _apply_cognito_transform(input_id, raw, entry, tab)

    # No Transform — verbatim passthrough.
    if raw is None:
        return _cognito_null_default(input_id)
    # Numbers → strings; non-strings → str()
    if isinstance(raw, bool):
        return "1" if raw else "0"
    if isinstance(raw, (int, float)):
        # Preserve ints as ints-in-str; floats passthrough as-is
        if isinstance(raw, float) and raw.is_integer():
            return str(int(raw))
        return str(raw)
    return raw


def _cognito_null_default(input_id: str) -> str:
    """
    Convention #1: null/missing/empty for numeric Matrix TEXT fields → "0".
    Non-numeric TEXT fields → "". Convention #1 applies to count-shaped TEXT
    fields; the Rules table's existing coverage is explicit about which fields
    are counts.
    """
    # Numeric-count Matrix TEXT fields that get "0" on null per convention #1.
    numeric_text_fields = {
        # Bath counts
        "Input_57", "Input_58", "Input_59", "Input_60",
        "Input_61", "Input_62", "Input_63", "Input_64",
        "Input_65", "Input_66", "Input_67", "Input_68",
        # Bedrooms, Levels, Rooms
        "Input_47", "Input_48", "Input_49",
        # SqFt family
        "Input_879", "Input_880", "Input_882", "Input_883",
        # Fireplace count
        "Input_152",
    }
    if input_id in numeric_text_fields:
        return "0"
    return ""


def _apply_cognito_transform(input_id: str, raw, entry: dict, tab: str):
    """
    Dispatch rule-specific Transforms by Matrix Input ID. Each case
    implements the Transform text verbatim per convention #3.

    This dispatcher mirrors the Transform / Logic column from the Rules
    table. When a new rule with a Transform is added to the base, extend
    this function; the Rules table remains the authoring surface.
    """

    # --- Listing Info ---
    if input_id == "Input_849":  # Type: SF→SFR, TH→TOWN
        return {"Single Family": "SFR", "Townhouse": "TOWN"}.get(raw, "")

    if input_id == "Input_850":  # Attached Y/N: TH→1, SF→0
        return {"Townhouse": "1", "Single Family": "0"}.get(raw, "")

    if input_id == "Input_31":  # List Price — currency → string
        if raw is None:
            return ""
        if isinstance(raw, float) and raw.is_integer():
            return str(int(raw))
        return str(raw)

    # --- General Info ---
    if input_id == "Input_95":  # Acres — decimal or blank
        if raw is None or raw == "":
            return ""
        return str(raw)

    # --- Features: Garage Y/N ---
    if input_id == "Input_150":  # Garage Y/N: Yes→1, No→0
        return {"Yes": "1", "No": "0"}.get(raw, "")

    # --- Features: Num Cars ---
    if input_id == "Input_226":
        # Integer 0-10, with 4+ collapsing to "4plus"
        if raw is None or raw == "" or raw == 0:
            return ""
        try:
            n = int(raw)
        except (ValueError, TypeError):
            return ""
        if n <= 0:
            return ""
        if n in (1, 2, 3):
            return str(n)
        return "4plus"

    # --- Features: Unit Placement (TH only) ---
    if input_id == "Input_657":
        mapping = {"End Unit": "03", "Interior Unit": "04"}
        code = mapping.get(raw)
        return _prefix_features_codes(input_id, [code], tab) if code else []

    # --- Features: Style (SF only) ---
    if input_id == "Input_541":
        mapping = {"Ranch": "18", "2 Story": "27", "Custom": "06"}
        code = mapping.get(raw)
        return _prefix_features_codes(input_id, [code], tab) if code else []

    # --- Features crosswalks — multiselect Cognito → multi-code output ---
    if input_id == "Input_81":  # Appl/Equip
        crosswalk = {
            "Electric Cooking": "09", "Gas Cooking": "13", "Disposal": "06",
            "Dishwasher": "05", "Double Oven": "33", "Microwave": "18",
            "Refrigerator": "19", "Stove (Range with Oven)": "23",
            "Stove Hood": "24", "EV Charger": "39", "Washer": "27", "Dryer": "08",
        }
        selections = _cognito_multiselect_list(entry, "BuildFeatures.KitchenAndAppliances.SelectAllThatApply")
        codes = [crosswalk[s] for s in selections if s in crosswalk]
        return _prefix_features_codes(input_id, codes, tab)

    if input_id == "Input_568":  # Interior
        crosswalk = {
            "1st Floor Primary Bedroom": "50", "1st Floor Bedroom": "19",
            "9ft Ceilings": "01", "Bay Window": "03", "Ceiling Fans": "11",
            "Dining Area": "13", "Double Vanity": "14", "Island": "25",
            "Loft": "26", "Pantry": "28", "Recessed Lighting": "29",
            "Rough-in Bath": "30", "Walk-in Closets": "39",
        }
        selections = _cognito_multiselect_list(entry, "BuildFeatures.InteriorFeatures.SelectAllThatApply")
        codes = [crosswalk[s] for s in selections if s in crosswalk]
        return _prefix_features_codes(input_id, codes, tab)

    if input_id == "Input_73":  # Flooring
        crosswalk = {"Luxury Vinyl Plank (LVP)": "17", "Tile": "08"}
        selections = _cognito_multiselect_list(entry, "BuildFeatures.InteriorFeatures.Flooring")
        codes = [crosswalk[s] for s in selections if s in crosswalk]
        return _prefix_features_codes(input_id, codes, tab)

    if input_id == "Input_71":  # Siding
        crosswalk = {"Vinyl": "22", "Hardiplank": "25", "Brick": "05",
                     "Brick Veneer": "06", "Stone": "18"}
        selections = _cognito_multiselect_list(entry, "BuildFeatures.ExteriorFeatures.SidingPickNoMoreThan2")
        codes = [crosswalk[s] for s in selections if s in crosswalk]
        return _prefix_features_codes(input_id, codes, tab)

    if input_id == "Input_570":  # Exterior
        crosswalk = {"Deck": "43", "Irrigation System": "31",
                     "Cul-de-sac Lot": "35", "Covered Porch": "44"}
        selections = _cognito_multiselect_list(entry, "BuildFeatures.ExteriorFeatures.Features")
        codes = [crosswalk[s] for s in selections if s in crosswalk]
        return _prefix_features_codes(input_id, codes, tab)

    # Transform specified but no dispatcher case — surface so we can fix.
    raise RuntimeError(
        f"No Transform dispatcher for Input ID {input_id}. "
        f"Rule has Transform text but no corresponding handler in "
        f"_apply_cognito_transform. Add a case."
    )


# ---- COMMUNITY_DB handlers -------------------------------------------------

def _handle_community_db(rule: dict, community_row: dict) -> object:
    """
    COMMUNITY_DB: read the Community DB Column from the resolved community
    row. Apply Transform if present (convention #9: otherwise verbatim).
    """
    db_column = rule.get("Community DB Column")
    if not db_column:
        return ""
    raw = community_row.get(db_column, "")
    transform = rule.get("Transform / Logic")
    input_id = rule.get("Matrix Input ID", "")
    tab = rule.get("Tab", "")

    if not transform:
        # Verbatim passthrough per convention #9.
        return raw if raw is not None else ""

    return _apply_community_db_transform(input_id, raw, community_row, tab)


def _apply_community_db_transform(input_id: str, raw, community_row: dict, tab: str):
    """Dispatch COMMUNITY_DB-specific Transforms by Matrix Input ID."""

    # Fee Amount — strip "$" and "/ <Period>" from "$800.00 / Yearly"
    if input_id == "Input_110":
        if not raw:
            return ""
        # Expected shape: "$800.00 / Yearly"
        m = re.match(r"\s*\$?\s*([\d.,]+)\s*(?:/.*)?$", str(raw))
        if m:
            return m.group(1).replace(",", "")
        return ""

    # Fee Period — map period word to code
    if input_id == "Input_113":
        if not raw:
            return ""
        period_map = {"Monthly": "MO", "Quarterly": "QU", "Yearly": "YR"}
        m = re.search(r"/\s*(\w+)\s*$", str(raw))
        if m:
            return period_map.get(m.group(1), "")
        return ""

    # Fee Description — map display to code (bare, not full Input ID)
    if input_id == "Input_111":
        mapping = {"Community Association": "01", "Condo Association": "02"}
        code = mapping.get(str(raw).strip())
        return [code] if code else []

    # Fee Includes — DB stores '["01","25","14"]' JSON string → native array
    if input_id == "Input_576":
        if not raw:
            return []
        try:
            parsed = json.loads(str(raw))
            return parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            return []

    # Additional Fee Amount — same parse pattern as Fee Amount
    if input_id == "Input_115":
        if not raw:
            return ""
        m = re.match(r"\s*\$?\s*([\d.,]+)\s*(?:/.*)?$", str(raw))
        if m:
            return m.group(1).replace(",", "")
        return ""

    # Heating / Heat Fuel — DB stores comma-separated FULL Input IDs
    # ("Input_86_08"); split on comma and wrap. _prefix_features_codes
    # is a no-op because codes already start with "Input_".
    if input_id in ("Input_86", "Input_87"):
        if not raw:
            return []
        parts = [p.strip() for p in str(raw).split(",") if p.strip()]
        return _prefix_features_codes(input_id, parts, tab)

    # Pool Y/N — "Yes" → "1", "No" → "0"
    if input_id == "Input_244":
        return {"Yes": "1", "No": "0"}.get(str(raw).strip(), "")

    # Community Amenities — DB stores comma-separated BARE suffixes
    # ("01,04,46,22"); split, then prefix via Features convention.
    if input_id == "Input_534":
        if not raw:
            return []
        parts = [p.strip() for p in str(raw).split(",") if p.strip()]
        return _prefix_features_codes(input_id, parts, tab)

    raise RuntimeError(
        f"No COMMUNITY_DB Transform dispatcher for Input ID {input_id}. "
        f"Rule has Transform text but no handler in "
        f"_apply_community_db_transform. Add a case."
    )


# ---- DERIVED handlers ------------------------------------------------------

def _handle_derived(rule: dict, entry: dict, community_row: dict) -> object:
    """
    DERIVED: compute per the rule's Transform text. Dispatched by Matrix
    Input ID. All DERIVED Transforms are listed below.
    """
    input_id = rule.get("Matrix Input ID", "")
    tab = rule.get("Tab", "")

    # --- Bath descriptions: "TS" when FullBath > 0, else "" ---
    bath_desc_sources = {
        "Input_57": "BedsBathsLevels.Section.Basement.FullBath",
        "Input_58": "BedsBathsLevels.Section.Level1.FullBath",
        "Input_59": "BedsBathsLevels.Section.Level2.FullBath",
        "Input_60": "BedsBathsLevels.Section.Level3.FullBath",
    }
    if input_id in bath_desc_sources:
        val = _cognito_get(entry, bath_desc_sources[input_id]) or 0
        try:
            n = int(val)
        except (ValueError, TypeError):
            n = 0
        return "TS" if n > 0 else ""

    # --- Tax Year: current calendar year ---
    if input_id == "Input_246":
        return str(datetime.now().year)

    # --- List Date: today, MM/DD/YYYY (no zero-padding) ---
    if input_id == "Input_160":
        # strftime("%-m/%-d/%Y") on POSIX; use manual format for portability
        now = datetime.now()
        return f"{now.month}/{now.day}/{now.year}"

    # --- Year Built: current calendar year ---
    if input_id == "Input_44":
        return str(datetime.now().year)

    # --- Rooms: PropertyType → "10" (SF) or "8" (TH) ---
    if input_id == "Input_48":
        prop_type = _cognito_get(entry, "PropertyBasics.PropertyType")
        return {"Single Family": "10", "Townhouse": "8"}.get(prop_type, "")

    # --- Add'l HOA Y/N: Additional Fee populated → "1", else "0" ---
    if input_id == "Input_719":
        return "1" if community_row.get("Additional Fee") else "0"

    # --- Pool Description: DB Pool Y/N = "Yes" → ["02"] (Community/Off Site), else [] ---
    if input_id == "Input_91":
        if str(community_row.get("Pool Y/N", "")).strip() == "Yes":
            return _prefix_features_codes(input_id, ["02"], tab)
        return []

    # --- Garage: Garage1 = "Yes" → [02, 03, 05] (Attached + Auto Door Opener + Direct Entry) ---
    if input_id == "Input_539":
        if _cognito_get(entry, "BuildFeatures.Garage.Garage1") == "Yes":
            return _prefix_features_codes(input_id, ["02", "03", "05"], tab)
        return []

    # --- Basement/Foundation: PropertyType + Basement + FinishedStatus ---
    if input_id == "Input_569":
        prop_type = _cognito_get(entry, "PropertyBasics.PropertyType")
        basement  = _cognito_yesno(entry, "BuildFeatures.Basement.Basement")
        finished  = _cognito_get(entry, "BuildFeatures.Basement.FinishedStatus")
        if prop_type == "Townhouse":
            return _prefix_features_codes(input_id, ["12"], tab)  # Slab
        if prop_type == "Single Family":
            if basement == "No":
                return _prefix_features_codes(input_id, ["03"], tab)  # Crawl Space
            if basement == "Yes":
                code = {"Finished": "05", "Part Finished": "06", "Unfinished": "13"}.get(finished, "13")
                return _prefix_features_codes(input_id, [code], tab)
        return []

    # --- Basement Y/N: TH → "0", SF → Basement Y/N passthrough ---
    if input_id == "Input_153":
        prop_type = _cognito_get(entry, "PropertyBasics.PropertyType")
        if prop_type == "Townhouse":
            return "0"
        if prop_type == "Single Family":
            basement = _cognito_yesno(entry, "BuildFeatures.Basement.Basement")
            return "1" if basement == "Yes" else "0"
        return "0"

    raise RuntimeError(
        f"No DERIVED dispatcher for Input ID {input_id}. "
        f"Add a case in _handle_derived."
    )


# ---------------------------------------------------------------------------
# Rule scoping — Property Type + Path
# ---------------------------------------------------------------------------

def _rule_applies(rule: dict, property_type: str, path: str) -> bool:
    """
    Returns True if the rule's Property Type and Path scopes include this
    listing's values. Blank/null scope = applies to all.

    property_type: "SF" or "TH" (not the Cognito form value).
    path: "new" or "taxid".
    """
    prop_scope = rule.get("Property Type")
    if prop_scope and property_type not in prop_scope:
        return False
    path_scope = rule.get("Path")
    if path_scope and path not in path_scope:
        return False
    return True


# ---------------------------------------------------------------------------
# Payload assembly — route each (rule, value) into the envelope sections
# ---------------------------------------------------------------------------

def _emit_showing_flags(payload: dict, static_value_list: list) -> None:
    """
    Showing flags (Input_722) is a checkbox group that maps to two separate
    boolean payload keys per the example:
        AR → showing.appt_required = true
        AS → showing.accompany_show = true

    Both default to false if not in the static list.
    """
    flags = set(static_value_list or [])
    payload.setdefault("showing", {})
    payload["showing"]["accompany_show"] = ("AS" in flags)
    payload["showing"]["appt_required"]  = ("AR" in flags)


def _route_rule_output(payload: dict, input_id: str, value) -> None:
    """
    Put the rule's output value into the right section/key of the payload
    based on OUTPUT_MAP. Three-tuple entries nest one layer deeper (Bath Info).
    """
    if input_id in INTERNET_DISPLAY_INPUT_IDS:
        return  # extension-hardcoded; no payload key

    if input_id == "Input_722":
        _emit_showing_flags(payload, value if isinstance(value, list) else [])
        return

    if input_id == "Input_610":
        # Virtual tour URL — see tab-skip handling in generate_payload
        payload.setdefault("_virtual_tour_url", value)
        return

    route = OUTPUT_MAP.get(input_id)
    if not route:
        # Rule exists but we haven't mapped it — surface rather than drop.
        raise RuntimeError(
            f"No OUTPUT_MAP entry for Matrix Input ID {input_id}. "
            f"Extend OUTPUT_MAP with the correct (section, key) tuple."
        )

    if len(route) == 2:
        section, key = route
        payload.setdefault(section, {})[key] = value
    elif len(route) == 3:
        section, sub, key = route
        payload.setdefault(section, {}).setdefault(sub, {})[key] = value


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def _build_payload(entry_id) -> dict:
    """
    Phase 1 pipeline — Harpers Mill TH / Creekside Run TH happy path.

    1. Fetch Cognito Form 17 entry.
    2. Resolve community from Intake.Community + PropertyBasics.PropertyType.
    3. Fetch Payload Rules, Cognito Fields, Source Types, Community Reference
       DB rows from Airtable.
    4. Resolve the community row (hard-fail on miss per convention #6).
    5. For each rule, honor Property Type + Path scoping, then dispatch by
       Source Type, then route the output into the payload envelope.
    6. Return the assembled payload matching Lennar_Payload_Examples.md.
    """
    form_id = os.environ["COGNITO_FORM_ID"]

    # --- 1. Fetch Cognito entry ---
    entry = _cognito_fetch_entry(form_id, entry_id)

    # --- 2. Resolve community key ---
    community_key = _resolve_community_key(entry)
    prop_type_cognito = _cognito_get(entry, "PropertyBasics.PropertyType")
    property_type = PROPERTY_TYPE_SUFFIX[prop_type_cognito]  # "SF" or "TH"

    # --- 3. Fetch all four Airtable tables ---
    rules_records       = _airtable_list_all(PAYLOAD_RULES_TABLE_ID)
    cognito_records     = _airtable_list_all(COGNITO_FIELDS_TABLE_ID)
    source_type_records = _airtable_list_all(SOURCE_TYPES_TABLE_ID)
    community_records   = _airtable_list_all(COMMUNITY_DB_TABLE_ID)

    # --- 4. Resolve community row + derive path ---
    community_row = _find_community_row(community_records, community_key)
    path = community_row.get("Path")
    if not path:
        raise RuntimeError(
            f"Community row {community_key!r} is missing a Path value. "
            "Set Path to 'new' or 'taxid' in the Community Reference DB."
        )

    # --- 5. Build link-resolution indices ---
    source_type_by_id = _build_record_index(source_type_records, "Source Type")
    cognito_path_by_id = _build_record_index(cognito_records, "Field Path")

    # --- 6. Flatten each rule into a plain dict with linked values inlined ---
    rules = []
    for rec in rules_records:
        f = rec.get("fields", {})
        source_type_ids = f.get("Source Type") or []
        cognito_field_ids = f.get("Cognito Field") or []
        rules.append({
            "Rule":                 f.get("Rule"),
            "Matrix Input ID":      f.get("Matrix Input ID"),
            "Matrix Field Label":   f.get("Matrix Field Label"),
            "Tab":                  f.get("Tab"),
            "Path":                 f.get("Path"),
            "Property Type":        f.get("Property Type"),
            "Static Value":         f.get("Static Value"),
            "Community DB Column":  f.get("Community DB Column"),
            "Transform / Logic":    f.get("Transform / Logic"),
            "Notes":                f.get("Notes"),
            # Resolved link values
            "Source Type":          source_type_by_id.get(source_type_ids[0]) if source_type_ids else None,
            "Cognito Field Paths":  [cognito_path_by_id.get(cid) for cid in cognito_field_ids if cognito_path_by_id.get(cid)],
        })

    # --- 7. Iterate rules, dispatch by Source Type, route output ---
    payload = {
        "mls":       "cvrmls",
        "builder":   "lennar",
        "path":      path,
        "community": community_key,
    }

    for rule in rules:
        if not _rule_applies(rule, property_type, path):
            continue

        source_type = rule["Source Type"]
        input_id = rule["Matrix Input ID"]
        tab = rule.get("Tab", "")

        if source_type == "STATIC":
            value = _parse_static_value(rule["Static Value"], input_id, tab)

        elif source_type == "COGNITO":
            value = _handle_cognito(rule, entry, rule["Cognito Field Paths"])

        elif source_type == "COMMUNITY_DB":
            value = _handle_community_db(rule, community_row)

        elif source_type == "DERIVED":
            value = _handle_derived(rule, entry, community_row)

        elif source_type == "MANUAL_ENTRY":
            continue  # operator fills in Matrix

        else:
            raise RuntimeError(
                f"Rule {rule['Rule']} has unknown Source Type {source_type!r}."
            )

        _route_rule_output(payload, input_id, value)

    # --- 8. Virtual Tour tab-skip ---
    # If the Cognito VirtualTourLink is blank/missing, drop the entire
    # virtual_tour section (per Rule 17 Notes / Schema §4.10 payload-level
    # omit rule). We route Input_610 to a sentinel key during iteration,
    # then promote or drop it here.
    vt_url = payload.pop("_virtual_tour_url", None)
    if vt_url:
        payload["virtual_tour"] = {"url": vt_url}

    # --- 9. Ensure every expected section exists even if empty ---
    # (Prevents the payload from losing keys because every rule in a section
    # was path-scoped out, etc. The example payload always has every section
    # present. Not strictly required by the extension, but matches the
    # known-good shape.)
    for section in ("listing", "bath", "features_a", "features_b", "general",
                    "remarks", "fee", "owner", "agent_office", "showing"):
        payload.setdefault(section, {})

    # Matrix's Bath Info tab requires every level sub-object to exist in the
    # payload, even when the Rules table has no rules firing for a given level
    # (Rule 44 deliberately excludes Level 4 — no Form 17 source). Fill in any
    # missing bath sub-objects with Matrix's required empty-but-present shape.
    # setdefault means levels populated by rules keep their rule-driven values.
    for level in ("basement", "level1", "level2", "level3", "level4"):
        payload["bath"].setdefault(level, {"desc": "", "full": "0", "half": "0"})

    return payload


# ---------------------------------------------------------------------------
# Recent-entries lookup — Phase 2 extension picker
#
# Note on implementation: Cognito's plain REST API only exposes GetEntry
# (by ID) and CreateEntry — there is no "list entries" REST verb. Listing a
# view's entries is a documented OData operation instead:
#   GET /api/odata/Forms({form})/Views({viewId})/Entries
# which supports $select but not a server-side "take"/$top limit per
# Cognito's published API reference. So this fetches just the ordered entry
# IDs via $select=Id (cheap — no full field payloads over the wire), then
# reuses the already-proven _cognito_fetch_entry() single-entry call for
# each of the first `limit` IDs to get full field data in the same nested
# shape generate_payload() already depends on (Intake.StreetNumber, etc.).
#
# The Submitted view ("17-3") is already sorted by Entry.Number descending
# per Lennar_New_Listing_Protocol.md, so the first `limit` IDs returned are
# the most recent submissions.
# ---------------------------------------------------------------------------

SUBMITTED_VIEW_ID = "17-3"


def _cognito_fetch_view_entry_ids(form_id: str, view_id: str, take: int) -> list:
    """
    Fetch entry IDs from a Cognito entry view via the OData API, in the
    view's configured sort order. Raises on auth failure, same as
    _cognito_fetch_entry.
    """
    url = f"{COGNITO_API_BASE}/odata/Forms({form_id})/Views({view_id})/Entries"
    resp = requests.get(
        url, headers=_cognito_headers(), params={"$select": "Id"}, timeout=30
    )
    if resp.status_code in (401, 403):
        raise RuntimeError(
            f"Cognito auth failed ({resp.status_code}) fetching view {view_id}. "
            "Check COGNITO_API_KEY in .env."
        )
    resp.raise_for_status()
    data = resp.json()
    # OData wraps results in {"value": [...]}; be defensive in case the
    # response is ever a bare list instead.
    rows = data.get("value", []) if isinstance(data, dict) else data
    ids = [row["Id"] if isinstance(row, dict) else row for row in rows]
    return ids[:take]


def fetch_recent_entries(limit: int = 5) -> list[dict]:
    """
    Fetch the N most recent Form 17 submissions for the extension picker.

    Returns a list of dicts: {"entry_id": int, "address": str, "submitted_at": str}
    sorted by submission time, newest first (inherited from the Submitted
    view's configured sort — see _cognito_fetch_view_entry_ids).

    Entries missing either StreetNumber or StreetName fall back to a
    "(address unknown — Entry #N)" label so the picker always has something
    to display. If a given entry ID 404s between the view lookup and the
    detail fetch (e.g. deleted), it is skipped rather than failing the whole
    request.
    """
    form_id = os.environ["COGNITO_FORM_ID"]
    entry_ids = _cognito_fetch_view_entry_ids(form_id, SUBMITTED_VIEW_ID, limit)

    entries = []
    for entry_id in entry_ids:
        try:
            entry = _cognito_fetch_entry(form_id, entry_id)
        except RuntimeError:
            continue

        street_number = _cognito_get(entry, "Intake.StreetNumber")
        street_name = _cognito_get(entry, "Intake.StreetName")
        if street_number and street_name:
            address = f"{street_number} {street_name}"
        else:
            address = f"(address unknown — Entry #{entry_id})"

        submitted_at = (
            _cognito_get(entry, "Entry.DateSubmitted")
            or _cognito_get(entry, "Entry.DateCreated")
            or ""
        )

        entries.append(
            {"entry_id": entry_id, "address": address, "submitted_at": submitted_at}
        )

    return entries


def generate_payload(entry_id: int, env: dict[str, str]) -> str:
    """
    Build the payload for the given Cognito entry and return it as a JSON
    string, per the CLI's existing output contract.

    `env` is unused directly here — the pipeline helpers read credentials
    from `os.environ`, which `load_env()` has already populated via
    `load_dotenv()`. It's kept in the signature so callers (and the Phase 2
    wrap) don't need to change.
    """
    payload = _build_payload(entry_id)
    return json.dumps(payload, indent=2, ensure_ascii=False)


# -------- Main --------

def main() -> int:
    args = build_parser().parse_args()
    env = load_env()
    payload = generate_payload(args.entry_id, env)
    emit(payload, args)
    return 0


if __name__ == "__main__":
    sys.exit(main())

# HANDOFF-2026-10-15-workstream-a-builder-registry

**Author:** Claude session, 2026-10-15
**Protocol:** CURSOR-HANDOFF-PROTOCOL-001 v1.1
**Scope:** Workstream A — multi-builder architecture (session 1 of 2–3)

## Override: Batched multi-file change

This handoff touches **9 files** in one apply. The default pattern is one file per handoff; the override is invoked because the changes form a single coherent feature — a per-builder registry on the server plus a builder dropdown in the extension — and a partial apply ships a broken UI (dropdown rendered but server rejects the new `builder` parameter, or vice versa). The seventh batched-override handoff in this project; same pattern as v0.14 (pipeline build), v0.16 (FastAPI wrapper), v0.17 (extension picker), v0.18 (Phase 3a), v0.19 (Phase 3a.1).

Apply all 9 changes in one Cursor pass. Each file's changes are expressed as literal Find/Replace blocks against the current repo state (commit at HEAD, read live by the authoring Claude session). All existing Lennar behavior is preserved — the registry has `"lennar"` as its only key, every endpoint defaults the `builder` parameter to `"lennar"`, the extension always sends `builder: "lennar"` from 0.5.0 forward.

## Context

Workstream A kickoff landed 7 shape decisions (see Phase Tracker v0.20). This handoff is session 1's deliverable: extract Lennar's currently-hardcoded config into a `BUILDERS` registry, thread a `builder` parameter through the three endpoints, and add a builder dropdown to the extension side panel. Session 2+ validates against a real or hypothetical second builder.

Deploy order is Railway-first (as always); the server defaults `builder` to `"lennar"` so the 0.4.0 extension continues working during the brief window between Railway redeploy and the operator reloading the 0.5.0 extension. No coordination required.

Env var migration (per yesterday's D1 decision): base IDs, form IDs, folder IDs, and sheet IDs move out of Railway Variables and into `extension/scripts/builders.py` as plain data. Shared secrets (Airtable PAT, Cognito API key, GCP tokens, API shared secret) stay in Railway. The four moved env vars can stay set in Railway (unused, no harm); operator removes them at leisure once this deploy is confirmed working.

---

## Change 1 — NEW FILE: `extension/scripts/builders.py`

Create `extension/scripts/builders.py` with the following content:

```python
"""Builder registry — per-builder configuration for the Workstream A multi-builder architecture.

Each key in BUILDERS maps a short lowercase slug (used in URL params and request bodies)
to a config dict for one builder. The script dispatcher reads from BUILDERS[builder]
instead of pulling base IDs, form IDs, folder IDs, and sheet IDs from the environment.

What belongs here:
  - Per-builder, non-secret config: Airtable base + table IDs, Cognito form + view IDs,
    Drive folder ID, Google Sheet ID + tab ID + target row, display name, MLS tag, and
    the key naming which community resolver to use.

What stays in Railway Variables (shared secrets):
  - AIRTABLE_PAT, COGNITO_API_KEY, GCP_CLIENT_ID/SECRET/REFRESH_TOKEN, API_SHARED_SECRET.

Adding a new builder: add a new top-level key to BUILDERS. See the Workstream B
onboarding runbook (when it lands) for the data-gathering checklist that precedes
this step.
"""

from __future__ import annotations

BUILDERS: dict = {
    "lennar": {
        "display_name": "Lennar",
        "mls_tag": "cvrmls",
        "cognito_form_id": "17",
        "submitted_view_id": 3,
        "airtable_base_id": "app78fMUwDNBHUZ6r",
        "airtable_tables": {
            "payload_rules": "tbletiuyEdhVwcwGw",
            "cognito_fields": "tbl9LWfHDEuYtgFvv",
            "source_types": "tblpwaJswUvNpYOyY",
            "community_db": "tbleMbM1WgY8Si2t7",
        },
        "drive_properties_folder_id": "1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B",
        "sheet_id": "1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME",
        "sheet_tab_id": 206940732,
        "sheet_target_row": 45,
        "community_resolver": "lennar_default",
    },
}

DEFAULT_BUILDER = "lennar"


def get_builder_config(builder: str | None) -> dict:
    """Return the registry entry for `builder`, defaulting to DEFAULT_BUILDER when None/empty.

    Hard-fails with a clear error if the key is unknown — do not silently fall back.
    Lowercases + strips the input so URL/body variants of case don't matter.
    """
    key = (builder or DEFAULT_BUILDER).strip().lower()
    if key not in BUILDERS:
        valid = ", ".join(sorted(BUILDERS.keys()))
        raise RuntimeError(
            f"Unknown builder {key!r}. Valid builders: {valid}. "
            "Add a new entry to extension/scripts/builders.py to onboard a new builder."
        )
    return BUILDERS[key]
```

---

## Change 2 — `extension/scripts/generate.py` (several surgical blocks)

### 2a. Add builders import

**Find:**
```python
import requests
from dotenv import load_dotenv


# -------- CLI --------
```

**Replace:**
```python
import requests
from dotenv import load_dotenv

from builders import BUILDERS, DEFAULT_BUILDER, get_builder_config


# -------- CLI --------
```

### 2b. Add `--builder` CLI flag

**Find:**
```python
    output.add_argument(
        "--out",
        type=Path,
        metavar="PATH",
        help="Write the generated payload to this file.",
    )
    return parser
```

**Replace:**
```python
    output.add_argument(
        "--out",
        type=Path,
        metavar="PATH",
        help="Write the generated payload to this file.",
    )
    parser.add_argument(
        "--builder",
        type=str,
        default=DEFAULT_BUILDER,
        choices=sorted(BUILDERS.keys()),
        help=f"Builder slug (default: {DEFAULT_BUILDER!r}).",
    )
    return parser
```

### 2c. Shrink `REQUIRED_ENV_VARS` to shared secrets only

**Find:**
```python
REQUIRED_ENV_VARS = (
    "AIRTABLE_PAT",
    "AIRTABLE_LENNAR_BASE_ID",
    "AIRTABLE_CVRMLS_BASE_ID",
    "COGNITO_API_KEY",
    "COGNITO_FORM_ID",
)
```

**Replace:**
```python
# Workstream A — base IDs, form IDs, folder IDs, and sheet IDs all moved to
# builders.py (plain non-secret data). Only true shared secrets remain here.
# CVRMLS base ID stays as an env var for now — Cascade Options authoring work
# still reads it; migrates to a shared MLS registry if a second CVRMLS builder
# gets added.
REQUIRED_ENV_VARS = (
    "AIRTABLE_PAT",
    "AIRTABLE_CVRMLS_BASE_ID",
    "COGNITO_API_KEY",
)
```

### 2d. Remove module-level Lennar constants; drop `LENNAR_BASE_ID` and the four table-ID constants

**Find:**
```python
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
```

**Replace:**
```python
# ---------------------------------------------------------------------------
# Airtable + Cognito API bases
# ---------------------------------------------------------------------------
# Workstream A — per-builder base IDs and table IDs now live in builders.py.
# The HTTP helpers below take base_id as a parameter so the dispatcher can
# resolve the right builder's base at call time.

AIRTABLE_API_BASE = "https://api.airtable.com/v0"
COGNITO_API_BASE  = "https://www.cognitoforms.com/api"
```

### 2e. Update `_airtable_list_all` to accept `base_id`

**Find:**
```python
def _airtable_list_all(table_id: str) -> list:
    """Fetch every record from an Airtable table, handling pagination."""
    url = f"{AIRTABLE_API_BASE}/{LENNAR_BASE_ID}/{table_id}"
    records = []
```

**Replace:**
```python
def _airtable_list_all(base_id: str, table_id: str) -> list:
    """Fetch every record from an Airtable table, handling pagination.

    Workstream A — base_id is now a required parameter (previously the Lennar
    base was hardcoded at module level).
    """
    url = f"{AIRTABLE_API_BASE}/{base_id}/{table_id}"
    records = []
```

### 2f. Replace Lennar-specific `_resolve_community_key` with per-builder resolver dispatch

**Find:**
```python
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
```

**Replace:**
```python
def _resolve_community_lennar_default(entry: dict) -> str:
    """Lennar's resolver: Intake.Community + PropertyType suffix.

    'Harpers Mill' + 'Townhouse' → 'Harpers Mill TH'. Named 'lennar_default'
    in the registry; builders whose intake forms match this shape reuse it
    as-is. Builders whose forms differ get a new named resolver added below.
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


COMMUNITY_RESOLVERS = {
    "lennar_default": _resolve_community_lennar_default,
}


def _resolve_community_key(entry: dict, builder: str = DEFAULT_BUILDER) -> str:
    """Dispatch to the per-builder community resolver named in builders.py.

    Workstream A — public signature now takes an optional `builder`. Callers
    that don't pass one get Lennar (DEFAULT_BUILDER), preserving backward compat
    with app.py's existing import and any CLI callers.
    """
    config = get_builder_config(builder)
    resolver_key = config.get("community_resolver", "lennar_default")
    resolver = COMMUNITY_RESOLVERS.get(resolver_key)
    if not resolver:
        raise RuntimeError(
            f"Unknown community resolver {resolver_key!r} for builder {builder!r}. "
            f"Valid resolvers: {', '.join(sorted(COMMUNITY_RESOLVERS.keys()))}."
        )
    return resolver(entry)
```

### 2g. Update `_build_payload` to accept `builder` and read from the registry

**Find:**
```python
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
```

**Replace:**
```python
def _build_payload(entry_id, builder: str = DEFAULT_BUILDER) -> dict:
    """
    Payload-build pipeline (Workstream A — now builder-aware).

    1. Resolve builder config (form ID, Airtable base ID, table IDs).
    2. Fetch Cognito entry.
    3. Resolve community via the builder's community resolver.
    4. Fetch Payload Rules, Cognito Fields, Source Types, Community Reference
       DB rows from the builder's Airtable base.
    5. Resolve the community row (hard-fail on miss per convention #6).
    6. For each rule, honor Property Type + Path scoping, then dispatch by
       Source Type, then route the output into the payload envelope.
    7. Return the assembled payload with the builder-tagged envelope.
    """
    config = get_builder_config(builder)
    form_id = config["cognito_form_id"]
    base_id = config["airtable_base_id"]
    tables = config["airtable_tables"]

    # --- 1. Fetch Cognito entry ---
    entry = _cognito_fetch_entry(form_id, entry_id)

    # --- 2. Resolve community key ---
    community_key = _resolve_community_key(entry, builder)
    prop_type_cognito = _cognito_get(entry, "PropertyBasics.PropertyType")
    property_type = PROPERTY_TYPE_SUFFIX[prop_type_cognito]  # "SF" or "TH"

    # --- 3. Fetch all four Airtable tables ---
    rules_records       = _airtable_list_all(base_id, tables["payload_rules"])
    cognito_records     = _airtable_list_all(base_id, tables["cognito_fields"])
    source_type_records = _airtable_list_all(base_id, tables["source_types"])
    community_records   = _airtable_list_all(base_id, tables["community_db"])
```

### 2h. Update the payload envelope to source `mls` + `builder` from registry

**Find:**
```python
    # --- 7. Iterate rules, dispatch by Source Type, route output ---
    payload = {
        "mls":       "cvrmls",
        "builder":   "lennar",
        "path":      path,
        "community": community_key,
    }
```

**Replace:**
```python
    # --- 7. Iterate rules, dispatch by Source Type, route output ---
    payload = {
        "mls":       config["mls_tag"],
        "builder":   builder,
        "path":      path,
        "community": community_key,
    }
```

### 2i. Remove the module-level `SUBMITTED_VIEW_ID` constant

**Find:**
```python
SUBMITTED_VIEW_ID = 3  # Form 17's "Submitted" view — OData Int32 view ID.


def _cognito_fetch_view_entries(form_id: str, view_id: int, take: int) -> list:
```

**Replace:**
```python
# Workstream A — the Submitted view ID is now per-builder config
# (builders.py submitted_view_id). Each builder's form has its own view.


def _cognito_fetch_view_entries(form_id: str, view_id: int, take: int) -> list:
```

### 2j. Update `fetch_recent_entries` to accept `builder` and read config

**Find:**
```python
def fetch_recent_entries(limit: int = 5) -> list[dict]:
    """
    Fetch the N most recent Form 17 submissions for the extension picker.

    Returns a list of dicts: {"entry_id": int, "address": str, "submitted_at": str}
    sorted by submission time, newest first (inherited from the Submitted
    view's configured sort — see _cognito_fetch_view_entries).

    Entries missing either StreetNumber or StreetName fall back to a
    "(address unknown — Entry #N)" label so the picker always has something
    to display.
    """
    form_id = os.environ["COGNITO_FORM_ID"]
    rows = _cognito_fetch_view_entries(form_id, SUBMITTED_VIEW_ID, limit)
```

**Replace:**
```python
def fetch_recent_entries(limit: int = 5, builder: str = DEFAULT_BUILDER) -> list[dict]:
    """
    Fetch the N most recent form submissions for the extension picker.

    Workstream A — now builder-aware. Reads the builder's Cognito form ID and
    Submitted view ID from builders.py.

    Returns a list of dicts: {"entry_id": int, "address": str, "submitted_at": str}
    sorted by submission time, newest first (inherited from the Submitted
    view's configured sort — see _cognito_fetch_view_entries).

    Entries missing either StreetNumber or StreetName fall back to a
    "(address unknown — Entry #N)" label so the picker always has something
    to display.
    """
    config = get_builder_config(builder)
    form_id = config["cognito_form_id"]
    view_id = config["submitted_view_id"]
    rows = _cognito_fetch_view_entries(form_id, view_id, limit)
```

### 2k. Thread `builder` through `generate_payload` and `main`

**Find:**
```python
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
```

**Replace:**
```python
def generate_payload(entry_id: int, env: dict[str, str], builder: str = DEFAULT_BUILDER) -> str:
    """
    Build the payload for the given Cognito entry and return it as a JSON
    string, per the CLI's existing output contract.

    Workstream A — now builder-aware. `env` remains in the signature for
    boot-time secret validation; the pipeline helpers still read credentials
    from `os.environ`. `builder` defaults to DEFAULT_BUILDER so Phase 2
    callers that haven't been updated still work.
    """
    payload = _build_payload(entry_id, builder)
    return json.dumps(payload, indent=2, ensure_ascii=False)


# -------- Main --------

def main() -> int:
    args = build_parser().parse_args()
    env = load_env()
    payload = generate_payload(args.entry_id, env, args.builder)
    emit(payload, args)
    return 0
```

---

## Change 3 — `extension/scripts/app.py`

### 3a. Update imports — add `BUILDERS`/`DEFAULT_BUILDER`, drop unused `_resolve_community_key` plumbing from imports (keep import — still used in /prepare-listing)

**Find:**
```python
from generate import generate_payload, fetch_recent_entries, load_env, _cognito_fetch_entry, _resolve_community_key
from google_services import drive_service, gmail_service, sheets_service, find_or_create_folder, send_html_email
from prep_email import build_prep_email
from sheets_services import build_listing_row, write_listing_row
```

**Replace:**
```python
from generate import generate_payload, fetch_recent_entries, load_env, _cognito_fetch_entry, _resolve_community_key
from google_services import drive_service, gmail_service, sheets_service, find_or_create_folder, send_html_email
from prep_email import build_prep_email
from sheets_services import build_listing_row, write_listing_row
from builders import DEFAULT_BUILDER, get_builder_config
```

### 3b. Update `GenerateRequest` to accept optional `builder`

**Find:**
```python
class GenerateRequest(BaseModel):
    entry_id: int
```

**Replace:**
```python
class GenerateRequest(BaseModel):
    entry_id: int
    builder: Optional[str] = None  # defaults to DEFAULT_BUILDER server-side
```

### 3c. Update `/recent-entries` to accept `builder` query param

**Find:**
```python
@app.get("/recent-entries")
def recent_entries(x_api_key: Optional[str] = Header(None, alias="X-API-Key")):
    """
    Return the last 5 Form 17 submissions for the extension picker.

    Response shape:
      {"status": "ok", "entries": [{"entry_id": int, "address": str, "submitted_at": str}, ...]}

    On error:
      {"status": "error", "message": str}
    """
    _check_api_key(x_api_key)
    try:
        entries = fetch_recent_entries(limit=5)
        logger.info("recent-entries returned %d entries", len(entries))
        return {"status": "ok", "entries": entries}
    except Exception as e:
        logger.exception("recent-entries failed")
        return {"status": "error", "message": str(e)}
```

**Replace:**
```python
@app.get("/recent-entries")
def recent_entries(
    builder: Optional[str] = None,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
):
    """
    Return the last 5 form submissions for the extension picker.

    Query params:
      builder: optional builder slug. Defaults to DEFAULT_BUILDER ("lennar")
               when omitted so pre-Workstream-A clients keep working.

    Response shape:
      {"status": "ok", "entries": [{"entry_id": int, "address": str, "submitted_at": str}, ...]}

    On error:
      {"status": "error", "message": str}
    """
    _check_api_key(x_api_key)
    try:
        resolved_builder = (builder or DEFAULT_BUILDER)
        entries = fetch_recent_entries(limit=5, builder=resolved_builder)
        logger.info("recent-entries builder=%s returned %d entries", resolved_builder, len(entries))
        return {"status": "ok", "entries": entries}
    except Exception as e:
        logger.exception("recent-entries failed")
        return {"status": "error", "message": str(e)}
```

### 3d. Update `/generate` to use `builder` from request

**Find:**
```python
    _check_api_key(x_api_key)
    try:
        # generate_payload returns a JSON string (its existing CLI output
        # contract) — parse it back to a dict for the response body.
        payload_json = generate_payload(body.entry_id, _ENV)
        payload = json.loads(payload_json)
        logger.info("generate succeeded for entry_id=%s", body.entry_id)
        return {"status": "ok", "payload": payload, "warnings": []}
    except Exception as e:
        logger.exception("generate failed for entry_id=%s", body.entry_id)
        return {"status": "error", "message": str(e)}
```

**Replace:**
```python
    _check_api_key(x_api_key)
    try:
        resolved_builder = (body.builder or DEFAULT_BUILDER)
        # generate_payload returns a JSON string (its existing CLI output
        # contract) — parse it back to a dict for the response body.
        payload_json = generate_payload(body.entry_id, _ENV, resolved_builder)
        payload = json.loads(payload_json)
        logger.info("generate succeeded builder=%s entry_id=%s", resolved_builder, body.entry_id)
        return {"status": "ok", "payload": payload, "warnings": []}
    except Exception as e:
        logger.exception("generate failed for entry_id=%s", body.entry_id)
        return {"status": "error", "message": str(e)}
```

### 3e. Update `PrepareListingRequest` + handler to accept `builder` and source IDs from registry

**Find:**
```python
class PrepareListingRequest(BaseModel):
    entry_id: int
```

**Replace:**
```python
class PrepareListingRequest(BaseModel):
    entry_id: int
    builder: Optional[str] = None  # defaults to DEFAULT_BUILDER server-side
```

### 3f. Update `/prepare-listing` body to read builder config

**Find:**
```python
    _check_api_key(x_api_key)
    try:
        warnings = []

        form_id = os.environ["COGNITO_FORM_ID"]
        entry = _cognito_fetch_entry(form_id, body.entry_id)
        intake = entry.get("Intake", {})
        property_basics = entry.get("PropertyBasics", {})

        street_number = str(intake.get("StreetNumber", "")).strip()
        street_name_raw = str(intake.get("StreetName", "")).strip()
        community = str(intake.get("Community", "")).strip()
        list_price = property_basics.get("ListPrice") or 0

        if not street_number or not street_name_raw:
            return {
                "status": "error",
                "message": f"Entry {body.entry_id} is missing StreetNumber or StreetName; cannot build folder name.",
            }

        folder_name = _build_folder_name(street_number, street_name_raw)
        address = folder_name  # abbreviated form is also what we show throughout

        parent_folder_id = os.environ["LENNAR_PROPERTIES_FOLDER_ID"]

        drive = drive_service()
        listing_folder_id, listing_folder_url, folder_reused = find_or_create_folder(
            drive, parent_folder_id, folder_name
        )
        # Nest a Photos subfolder; reuse-safe via the same helper.
        find_or_create_folder(drive, listing_folder_id, "Photos")

        subject, html = build_prep_email(
            address=address,
            list_price=list_price,
            community=community,
            folder_name=folder_name,
            folder_url=listing_folder_url,
            folder_reused=folder_reused,
            entry_id=body.entry_id,
        )
```

**Replace:**
```python
    _check_api_key(x_api_key)
    try:
        warnings = []

        resolved_builder = (body.builder or DEFAULT_BUILDER)
        config = get_builder_config(resolved_builder)

        form_id = config["cognito_form_id"]
        entry = _cognito_fetch_entry(form_id, body.entry_id)
        intake = entry.get("Intake", {})
        property_basics = entry.get("PropertyBasics", {})

        street_number = str(intake.get("StreetNumber", "")).strip()
        street_name_raw = str(intake.get("StreetName", "")).strip()
        community = str(intake.get("Community", "")).strip()
        list_price = property_basics.get("ListPrice") or 0

        if not street_number or not street_name_raw:
            return {
                "status": "error",
                "message": f"Entry {body.entry_id} is missing StreetNumber or StreetName; cannot build folder name.",
            }

        folder_name = _build_folder_name(street_number, street_name_raw)
        address = folder_name  # abbreviated form is also what we show throughout

        parent_folder_id = config["drive_properties_folder_id"]

        drive = drive_service()
        listing_folder_id, listing_folder_url, folder_reused = find_or_create_folder(
            drive, parent_folder_id, folder_name
        )
        # Nest a Photos subfolder; reuse-safe via the same helper.
        find_or_create_folder(drive, listing_folder_id, "Photos")

        subject, html = build_prep_email(
            address=address,
            list_price=list_price,
            community=community,
            folder_name=folder_name,
            folder_url=listing_folder_url,
            folder_reused=folder_reused,
            entry_id=body.entry_id,
            builder_display_name=config["display_name"],
        )
```

### 3g. Update the Sheet-write block to use registry-sourced sheet ID + resolver + tab/row params

**Find:**
```python
        # Phase 3a.1 — Lennar Listings sheet row write
        try:
            sheet_id = os.getenv("GOOGLE_SHEET_ID")
            if not sheet_id:
                raise RuntimeError("GOOGLE_SHEET_ID env var not set")
            community_display_name = _resolve_community_key(entry)
            sheets = sheets_service()
            # Pass the already-abbreviated address so the Sheet row A
            # matches the Drive folder name and the email body. The
            # handler's local `address` is set from _build_folder_name()
            # above (line ~230).
            row = build_listing_row(entry, community_display_name, address=address)
            write_listing_row(sheets, sheet_id, row)
            logger.info("Sheet row written for entry_id=%s", body.entry_id)
        except Exception:
            logger.exception("Sheet row write failed for entry_id=%s", body.entry_id)
            warnings.append("Sheet row write failed — see Railway logs")
```

**Replace:**
```python
        # Listings sheet row write (per-builder sheet ID + tab + target row
        # from the registry).
        try:
            sheet_id = config["sheet_id"]
            tab_id = config["sheet_tab_id"]
            target_row = config["sheet_target_row"]
            community_display_name = _resolve_community_key(entry, resolved_builder)
            sheets = sheets_service()
            # Pass the already-abbreviated address so the Sheet row A
            # matches the Drive folder name and the email body. The
            # handler's local `address` is set from _build_folder_name()
            # above.
            row = build_listing_row(entry, community_display_name, address=address)
            write_listing_row(sheets, sheet_id, row, tab_id=tab_id, target_row=target_row)
            logger.info("Sheet row written builder=%s entry_id=%s", resolved_builder, body.entry_id)
        except Exception:
            logger.exception("Sheet row write failed for entry_id=%s", body.entry_id)
            warnings.append("Sheet row write failed — see Railway logs")
```

---

## Change 4 — `extension/scripts/sheets_services.py`

### 4a. Drop module-level `LENNAR_LISTINGS_TAB_ID` and `TARGET_ROW` constants (now registry-sourced)

**Find:**
```python
from __future__ import annotations

import logging

logger = logging.getLogger(__name__)

LENNAR_LISTINGS_TAB_ID = 206940732
TARGET_ROW = 45
STATUS_AT_INTAKE = "Input in progress"
```

**Replace:**
```python
from __future__ import annotations

import logging

logger = logging.getLogger(__name__)

# Workstream A — the listings-tab ID and target-row index now come from the
# per-builder registry (builders.py) and are passed into write_listing_row
# as parameters. STATUS_AT_INTAKE is still MLS-wide — a listing is "Input in
# progress" the moment the Matrix fill starts, regardless of builder.
STATUS_AT_INTAKE = "Input in progress"
```

### 4b. Update `write_listing_row` signature to take `tab_id` + `target_row`

**Find:**
```python
def write_listing_row(sheets_service, spreadsheet_id, row_values):
    """
    Insert an empty row at TARGET_ROW (1-based) and populate A..T.
    """
    insert_body = {
        "requests": [
            {
                "insertDimension": {
                    "range": {
                        "sheetId": LENNAR_LISTINGS_TAB_ID,
                        "dimension": "ROWS",
                        "startIndex": TARGET_ROW - 1,
                        "endIndex": TARGET_ROW,
                    },
                    "inheritFromBefore": True,
                }
            }
        ]
    }
    sheets_service.spreadsheets().batchUpdate(
        spreadsheetId=spreadsheet_id, body=insert_body
    ).execute()

    sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range=f"'Lennar Listings'!A{TARGET_ROW}:T{TARGET_ROW}",
        valueInputOption="USER_ENTERED",
        body={"values": [row_values]},
    ).execute()

    logger.info("Wrote Lennar Listings row at A%d:T%d", TARGET_ROW, TARGET_ROW)
```

**Replace:**
```python
def write_listing_row(sheets_service, spreadsheet_id, row_values, *, tab_id, target_row):
    """
    Insert an empty row at `target_row` (1-based) and populate A..T.

    Workstream A — tab_id and target_row are now per-builder (passed in from
    builders.py via app.py). Note the keyword-only star: callers must name
    these args so the two integer parameters can't be swapped silently.

    The sheet-name in the A1 range is kept as 'Lennar Listings' here because
    builder #2's sheet will have its own tab name (likely the builder's name)
    and the right fix at that point is to derive the sheet-name from the tab
    via the Sheets API or pass it alongside tab_id. Not blocking today — one
    builder, one tab name.
    """
    insert_body = {
        "requests": [
            {
                "insertDimension": {
                    "range": {
                        "sheetId": tab_id,
                        "dimension": "ROWS",
                        "startIndex": target_row - 1,
                        "endIndex": target_row,
                    },
                    "inheritFromBefore": True,
                }
            }
        ]
    }
    sheets_service.spreadsheets().batchUpdate(
        spreadsheetId=spreadsheet_id, body=insert_body
    ).execute()

    sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range=f"'Lennar Listings'!A{target_row}:T{target_row}",
        valueInputOption="USER_ENTERED",
        body={"values": [row_values]},
    ).execute()

    logger.info("Wrote listings row at A%d:T%d (tab_id=%s)", target_row, target_row, tab_id)
```

---

## Change 5 — `extension/scripts/prep_email.py`

### 5a. Interpolate builder display name into the email body (per Q7 kickoff decision)

**Find:**
```python
def build_prep_email(
    *,
    address: str,
    list_price,
    community: str,
    folder_name: str,
    folder_url: str,
    folder_reused: bool,
    entry_id: int,
) -> tuple[str, str]:
    """Return (subject, html_body) for the prep email."""
    subject = f"Listing prep: {address}"
    price_str = _format_price(list_price)
    composed_clause = build_composed_clause(address, list_price, community)
    reuse_note = (
        '<p style="color:#8a6d3b;font-size:13px;margin:12px 0 0;">'
        f'Note: the Drive folder for {address} already existed and was reused.'
        '</p>'
    ) if folder_reused else ""

    html = f"""\
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#212529;max-width:560px;">
  <p>Listing prep is ready for <strong>{address}</strong>.</p>
```

**Replace:**
```python
def build_prep_email(
    *,
    address: str,
    list_price,
    community: str,
    folder_name: str,
    folder_url: str,
    folder_reused: bool,
    entry_id: int,
    builder_display_name: str = "Lennar",
) -> tuple[str, str]:
    """Return (subject, html_body) for the prep email.

    Workstream A — `builder_display_name` is interpolated into the subject
    and body so a prep email the operator opens for Builder X reads as a
    Builder X listing. Defaults to "Lennar" for callers that haven't been
    updated.
    """
    subject = f"Listing prep: {address} ({builder_display_name})"
    price_str = _format_price(list_price)
    composed_clause = build_composed_clause(address, list_price, community)
    reuse_note = (
        '<p style="color:#8a6d3b;font-size:13px;margin:12px 0 0;">'
        f'Note: the Drive folder for {address} already existed and was reused.'
        '</p>'
    ) if folder_reused else ""

    html = f"""\
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#212529;max-width:560px;">
  <p>Listing prep is ready for <strong>{address}</strong> — <strong>{builder_display_name}</strong>.</p>
```

---

## Change 6 — `extension/manifest.json`

### 6a. Bump version

**Find:**
```json
  "manifest_version": 3,
  "name": "Lennar CVRMLS Matrix Filler (POC)",
  "version": "0.4.0",
  "description": "Side panel that detects the active CVRMLS Matrix tab and fills it from a Cognito-entry payload (via Railway) or a pasted JSON payload. Lennar/CVRMLS scoped POC.",
```

**Replace:**
```json
  "manifest_version": 3,
  "name": "CVRMLS Matrix Filler",
  "version": "0.5.0",
  "description": "Side panel that detects the active CVRMLS Matrix tab and fills it from a Cognito-entry payload (via Railway) or a pasted JSON payload. Multi-builder architecture (Workstream A).",
```

---

## Change 7 — `extension/sidepanel.html`

### 7a. Change title, add builder picker section CSS + markup

**Find:**
```html
  <h1 { font-size: 14px; margin: 0 0 10px; }

  /* Picker (Phase 2) */
  .picker { padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
```

**Replace:**
```html
  h1 { font-size: 14px; margin: 0 0 10px; }

  /* Builder picker (Workstream A) — matches entry picker visual language */
  .builder-picker { padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
  .builder-picker-row { display: flex; gap: 6px; align-items: stretch; }
  .builder-picker-row select { flex: 1; min-width: 0; padding: 6px 8px; font-size: 12px; font-family: inherit; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; color: #111; }

  /* Picker (Phase 2) */
  .picker { padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
```

> **Cursor:** The first line of the Find block above has a typo in the current file (`<h1 { font-size...` — stray `<` and no closing `>` on the tag). It is written exactly as it exists at HEAD so the Find matches; the Replace fixes it to a proper CSS selector (`h1 { ... }`). Confirm the typo is present at `extension/sidepanel.html` ~line 8 before applying; if the file has already been corrected to `h1 { ... }`, replace that corrected form instead.

### 7b. Change `<h1>` text + add builder dropdown markup

**Find:**
```html
  <h1>Lennar CVRMLS Matrix Filler</h1>

  <div id="picker" class="picker">
```

**Replace:**
```html
  <h1>CVRMLS Matrix Filler</h1>

  <div id="builderPicker" class="builder-picker">
    <div class="builder-picker-row">
      <select id="builderSelect" aria-label="Select builder">
        <option value="lennar">Lennar</option>
      </select>
    </div>
  </div>

  <div id="picker" class="picker">
```

---

## Change 8 — `extension/sidepanel.js`

### 8a. Add DOM ref for builder select + state helpers

**Find:**
```javascript
// DOM refs — picker (Phase 2)
var entrySelect = document.getElementById('entrySelect');
var loadBtn = document.getElementById('loadBtn');
var refreshBtn = document.getElementById('refreshBtn');
var pickerFooter = document.getElementById('pickerFooter');
var pickerStatus = document.getElementById('pickerStatus');
var clearBtn = document.getElementById('clearBtn');

// DOM refs — Phase 3a
var prepBtn = document.getElementById('prepBtn');
var phase3StatusEl = document.getElementById('phase3Status');
```

**Replace:**
```javascript
// DOM refs — picker (Phase 2)
var entrySelect = document.getElementById('entrySelect');
var loadBtn = document.getElementById('loadBtn');
var refreshBtn = document.getElementById('refreshBtn');
var pickerFooter = document.getElementById('pickerFooter');
var pickerStatus = document.getElementById('pickerStatus');
var clearBtn = document.getElementById('clearBtn');

// DOM refs — Phase 3a
var prepBtn = document.getElementById('prepBtn');
var phase3StatusEl = document.getElementById('phase3Status');

// DOM refs — builder picker (Workstream A)
var builderSelect = document.getElementById('builderSelect');

// Builder state (Workstream A) — read via getCurrentBuilder() at every
// Railway call so state is single-sourced from the <select> element.
var DEFAULT_BUILDER = 'lennar';

function getCurrentBuilder() {
  return (builderSelect && builderSelect.value) || DEFAULT_BUILDER;
}
```

### 8b. Load persisted builder from `chrome.storage.local` on panel open

**Find:**
```javascript
chrome.storage.local.get(['matrixFillerPayload', 'matrixFillerAutoFill'], function(result) {
  if (result.matrixFillerPayload) { payloadEl.value = result.matrixFillerPayload; }
  toggleEl.checked = !!result.matrixFillerAutoFill;
  updateFillButtonVisibility();
});
```

**Replace:**
```javascript
chrome.storage.local.get(['matrixFillerPayload', 'matrixFillerAutoFill', 'matrixFillerBuilder'], function(result) {
  if (result.matrixFillerPayload) { payloadEl.value = result.matrixFillerPayload; }
  toggleEl.checked = !!result.matrixFillerAutoFill;
  // Workstream A — restore the persisted builder selection. Falls back to
  // DEFAULT_BUILDER if nothing is stored or the stored value is no longer
  // a valid option in the dropdown.
  if (result.matrixFillerBuilder) {
    var isValid = false;
    for (var i = 0; i < builderSelect.options.length; i++) {
      if (builderSelect.options[i].value === result.matrixFillerBuilder) { isValid = true; break; }
    }
    if (isValid) { builderSelect.value = result.matrixFillerBuilder; }
  }
  updateFillButtonVisibility();
});
```

### 8c. Add `builder` to every Railway request

**Find:**
```javascript
function fetchRecentEntries() {
  if (!CONFIG.RAILWAY_BASE_URL) {
    setPickerError('Missing RAILWAY_BASE_URL in extension/config.js.');
    return;
  }
  setPickerLoading();
  var url = CONFIG.RAILWAY_BASE_URL + '/recent-entries';
  fetch(url, { headers: railwayHeaders() })
```

**Replace:**
```javascript
function fetchRecentEntries() {
  if (!CONFIG.RAILWAY_BASE_URL) {
    setPickerError('Missing RAILWAY_BASE_URL in extension/config.js.');
    return;
  }
  setPickerLoading();
  // Workstream A — pass selected builder as a query param. Server defaults
  // to lennar if omitted, so the fallback path stays safe.
  var url = CONFIG.RAILWAY_BASE_URL + '/recent-entries?builder=' + encodeURIComponent(getCurrentBuilder());
  fetch(url, { headers: railwayHeaders() })
```

**Find:**
```javascript
  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ entry_id: entryId })
  })
    .then(function(res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status); }
      return res.json();
    })
    .then(function(body) {
      if (!body || body.status !== 'ok' || !body.payload) {
        var msg = (body && body.message) || 'Unknown error from Railway.';
        setPickerError('Generation failed: ' + msg);
        console.error('[picker] /generate error envelope:', body);
        return;
      }
```

**Replace:**
```javascript
  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ entry_id: entryId, builder: getCurrentBuilder() })
  })
    .then(function(res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status); }
      return res.json();
    })
    .then(function(body) {
      if (!body || body.status !== 'ok' || !body.payload) {
        var msg = (body && body.message) || 'Unknown error from Railway.';
        setPickerError('Generation failed: ' + msg);
        console.error('[picker] /generate error envelope:', body);
        return;
      }
```

**Find:**
```javascript
function prepareListingForEntry(entryId) {
  var headers = railwayHeaders();
  headers['Content-Type'] = 'application/json';
  return fetch(CONFIG.RAILWAY_BASE_URL + '/prepare-listing', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ entry_id: entryId })
  })
```

**Replace:**
```javascript
function prepareListingForEntry(entryId) {
  var headers = railwayHeaders();
  headers['Content-Type'] = 'application/json';
  return fetch(CONFIG.RAILWAY_BASE_URL + '/prepare-listing', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ entry_id: entryId, builder: getCurrentBuilder() })
  })
```

### 8d. Wire the builder-change handler (clear payload, reset tabs/phase3, auto-refresh picker, persist)

**Find:**
```javascript
clearBtn.addEventListener('click', function() {
  payloadEl.value = '';
  // Also clear the persisted value so a panel reopen does not resurrect it.
  chrome.storage.local.remove('matrixFillerPayload');
  // Reset the per-tab status dots back to all-unvisited, since Clear means
  // we're starting fresh on a new listing. The currently-detected tab goes
  // back to 'pending' to match setCurrentStatus's first-detection behavior.
  TAB_ORDER.forEach(function(t) { tabStatus[t] = 'unvisited'; });
  if (currentDetectedTab) { tabStatus[currentDetectedTab] = 'pending'; }
  renderTabList();
  setPhase3Idle();
});
```

**Replace:**
```javascript
clearBtn.addEventListener('click', function() {
  payloadEl.value = '';
  // Also clear the persisted value so a panel reopen does not resurrect it.
  chrome.storage.local.remove('matrixFillerPayload');
  // Reset the per-tab status dots back to all-unvisited, since Clear means
  // we're starting fresh on a new listing. The currently-detected tab goes
  // back to 'pending' to match setCurrentStatus's first-detection behavior.
  TAB_ORDER.forEach(function(t) { tabStatus[t] = 'unvisited'; });
  if (currentDetectedTab) { tabStatus[currentDetectedTab] = 'pending'; }
  renderTabList();
  setPhase3Idle();
});

// Workstream A — builder-change handler. Switching builders mid-session is a
// context switch: the loaded Lennar payload would fill against the wrong
// Matrix fields for Builder X, and the picker is showing the wrong form's
// entries. Treat it as Clear + persist + refresh picker.
builderSelect.addEventListener('change', function() {
  chrome.storage.local.set({ matrixFillerBuilder: builderSelect.value });
  // Same reset flow as the Clear button.
  payloadEl.value = '';
  chrome.storage.local.remove('matrixFillerPayload');
  TAB_ORDER.forEach(function(t) { tabStatus[t] = 'unvisited'; });
  if (currentDetectedTab) { tabStatus[currentDetectedTab] = 'pending'; }
  renderTabList();
  setPhase3Idle();
  // Re-populate the picker with the newly-selected builder's recent entries.
  // Clears the current list first — fetchRecentEntries() shows the loading
  // state immediately, so there's no stale-list window.
  recentEntries = [];
  fetchRecentEntries();
});
```

---

## Change 9 — `extension/Lennar_Extension_Build.md`

### 9a. Append a Workstream A section after the Phase 3a.1 section

**Find:**
```markdown
Cursor handoff: `HANDOFF-2026-10-14-phase-3a1-sheets-write.md`.
```

**Replace:**
```markdown
Cursor handoff: `HANDOFF-2026-10-14-phase-3a1-sheets-write.md`.

---

## Workstream A — Multi-builder architecture (session 1)

Added 2026-10-15. Introduces a per-builder registry (`extension/scripts/builders.py`) and a builder dropdown in the extension side panel. Lennar behavior is preserved exactly; registry has `"lennar"` as its only key. Session 1 of 2–3; session 2+ validates against a real or hypothetical second builder.

### Server (Python)

- **New `extension/scripts/builders.py`** — holds per-builder, non-secret config (Airtable base ID, four Airtable table IDs, Cognito form ID + Submitted view ID, Drive folder ID, Google Sheet ID + tab ID + target row, display name, MLS tag, and the key naming which community resolver to use). Lennar's config is populated from values that previously lived as Railway env vars (`AIRTABLE_LENNAR_BASE_ID`, `COGNITO_FORM_ID`, `LENNAR_PROPERTIES_FOLDER_ID`, `GOOGLE_SHEET_ID`) plus module-level constants (table IDs, `SUBMITTED_VIEW_ID`, `LENNAR_LISTINGS_TAB_ID`, `TARGET_ROW`).
- **`REQUIRED_ENV_VARS`** shrinks to shared secrets only: `AIRTABLE_PAT`, `AIRTABLE_CVRMLS_BASE_ID`, `COGNITO_API_KEY`. Everything else is per-builder data in the registry.
- **`generate.py`** — `_build_payload`, `_resolve_community_key`, `fetch_recent_entries`, `generate_payload`, and `main()` all accept a `builder` parameter (defaults to `"lennar"`). `_airtable_list_all` now takes `base_id` as a parameter. Payload envelope's `"mls"` and `"builder"` keys are sourced from the registry. A new `COMMUNITY_RESOLVERS` dict maps a resolver key (`"lennar_default"`) to the actual resolver function; new builders either reuse `lennar_default` or register a new named resolver. New `--builder` CLI flag.
- **`app.py`** — `/generate` and `/prepare-listing` request bodies accept optional `builder`; `/recent-entries` accepts a `builder` query param. All three default to `"lennar"` when omitted, preserving backward compat with the 0.4.0 extension during the deploy window.
- **`sheets_services.py`** — `write_listing_row` takes `tab_id` and `target_row` as keyword-only parameters (passed in from the registry via `app.py`). Module-level `LENNAR_LISTINGS_TAB_ID` and `TARGET_ROW` constants removed.
- **`prep_email.py`** — `build_prep_email` accepts `builder_display_name` (defaults to `"Lennar"`) and interpolates it into the subject (`"Listing prep: 3435 Moonstone Dr (Lennar)"`) and opening sentence of the body.

### Extension

- **`sidepanel.html`** — new builder dropdown as the first element in the panel, visually matching the entry picker's `<select>` + section-separator style. `<h1>` text changed from `"Lennar CVRMLS Matrix Filler"` to `"CVRMLS Matrix Filler"` (builder is now shown in the dropdown; MLS stays in the title since the extension's `content_scripts.matches` still assumes CVRMLS).
- **`sidepanel.js`** — reads selected builder via `getCurrentBuilder()` at every Railway call; sends it as a `?builder=` query param on `/recent-entries` and as a `builder` field in the `/generate` and `/prepare-listing` request bodies. Persists the selection to `chrome.storage.local` under `matrixFillerBuilder`. Restores the persisted selection on panel open (falls back to `"lennar"` if the stored value is no longer a valid option). On builder change: clears the textarea, resets tab status dots, resets Phase 3 state to idle, and auto-refreshes the picker to pull the new builder's recent entries — same reset flow as the Clear button, plus the refresh.
- **`manifest.json`** — version `0.4.0` → `0.5.0`. Name changes from `"Lennar CVRMLS Matrix Filler (POC)"` to `"CVRMLS Matrix Filler"`. Description updated.

### Env var migration

Four Railway env vars are now unused and can be removed from Railway Variables at the operator's leisure once the Workstream A deploy is confirmed working. They do no harm staying set:

- `AIRTABLE_LENNAR_BASE_ID` → `builders.py["lennar"]["airtable_base_id"]`
- `COGNITO_FORM_ID` → `builders.py["lennar"]["cognito_form_id"]`
- `LENNAR_PROPERTIES_FOLDER_ID` → `builders.py["lennar"]["drive_properties_folder_id"]`
- `GOOGLE_SHEET_ID` → `builders.py["lennar"]["sheet_id"]`

Shared secrets that stay in Railway: `AIRTABLE_PAT`, `AIRTABLE_CVRMLS_BASE_ID`, `COGNITO_API_KEY`, `API_SHARED_SECRET`, `GCP_CLIENT_ID`, `GCP_CLIENT_SECRET`, `GCP_REFRESH_TOKEN`.

### Deploy order

Railway redeploys automatically on push. The server accepts optional `builder` on all three endpoints and defaults to `"lennar"` when omitted, so the 0.4.0 extension (which doesn't send `builder`) continues working during the brief window between Railway deploy and the operator reloading the 0.5.0 extension. No coordination required.

Cursor handoff: `HANDOFF-2026-10-15-workstream-a-builder-registry.md`.
```

---

## Post-apply

1. **Commit and push.** Suggested commit message:
   > `Workstream A: per-builder registry + extension builder dropdown`
   >
   > `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`
   > `Claude-Session: https://claude.ai/code/session_01VFSkC6LwzqHjnKtQ4wuANT`
2. **Watch Railway deploy.** Give it ~1–2 minutes to pick up the push (per the v0.19 deploy-race note). Deploy picks up the new `builders.py`; existing `GCP_*`, `AIRTABLE_PAT`, `COGNITO_API_KEY`, `AIRTABLE_CVRMLS_BASE_ID`, `API_SHARED_SECRET` env vars are unchanged. The now-unused `AIRTABLE_LENNAR_BASE_ID`, `COGNITO_FORM_ID`, `LENNAR_PROPERTIES_FOLDER_ID`, and `GOOGLE_SHEET_ID` can stay set in Railway (unused, no harm) — remove them at leisure after smoke-test passes.
3. **Smoke-test server endpoints via curl** (confirm the backward-compat path works before touching the extension):
   ```bash
   # Health check — unchanged
   curl -s https://lennar-payload-script-production.up.railway.app/ | jq .

   # No builder param — defaults to lennar
   curl -s -H "X-API-Key: $API_SHARED_SECRET" \
     https://lennar-payload-script-production.up.railway.app/recent-entries | jq '.status, (.entries | length)'

   # Explicit builder=lennar — same result
   curl -s -H "X-API-Key: $API_SHARED_SECRET" \
     "https://lennar-payload-script-production.up.railway.app/recent-entries?builder=lennar" | jq '.status, (.entries | length)'

   # Unknown builder — should return structured error envelope with the "Unknown builder" message
   curl -s -H "X-API-Key: $API_SHARED_SECRET" \
     "https://lennar-payload-script-production.up.railway.app/recent-entries?builder=notreal" | jq .
   ```
4. **Reload the extension in Chrome.** `chrome://extensions` → Lennar Matrix Filler → Reload. The sidebar reopens; version shows 0.5.0 in the extensions page.
5. **Verify the new UI:** builder dropdown appears at the top with `"Lennar"` selected; entry picker populates with recent Form 17 entries (auto-fetched on panel open); textarea is empty; Phase 3 button disabled with "Load a Cognito entry first." hint.
6. **End-to-end smoke test:** pick an entry from the dropdown, click Load → payload populates in the textarea; open a Matrix listing → auto-fill works tab-by-tab exactly as it did at 0.4.0. If a Cognito entry already exists in the queue, click Generate listing prep → verify the prep email arrives and the Drive folder + Sheet row land as before. **The prep email subject and body now include `(Lennar)` — that is the one deliberate text change from 0.4.0.**

If the smoke test passes, the Workstream A session-1 architecture is live. Session 2+ scaffolds a second builder end-to-end.

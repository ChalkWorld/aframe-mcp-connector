---
title: Cognito YesNo field type normalization — fixes Rule 111 basement_foundation and Rule 114 basement_yn
handoff_id: HANDOFF-2026-10-07-generate-py-cognito-yesno
date: 2026-10-07
author: Andrew Rich (via Claude Opus 4.7 session)
project: AAR-TC Lennar Operational Project
targets:
  - extension/scripts/generate.py
related:
  - FOUND-PHASE-TRACKER-001 (v0.14)
  - SESSION-HANDOFF-2026-10-05-PHASE-1-PIPELINE-LIVE.md
---

# Cognito YesNo field type normalization — Cursor Handoff

Small follow-up to the 2026-10-05 pipeline-build handoff. Fixes a dispatcher bug surfaced by the Everstone SF Entry #18 validation run (first SF listing through the pipeline).

Single file, three edits: add one helper, swap two call sites. No Rules table changes.

---

## 1. The bug

Entry #18's payload came out with `features_a.basement_foundation = []` when Rule 111's SF+No branch should have produced `["Input_569_03"]` (Crawl Space, Features-tab-prefixed).

**Root cause.** `BuildFeatures.Basement.Basement` is a Cognito **YesNo** field type, which the single-entry API returns as boolean `true`/`false`. The dispatcher at `generate.py` lines 848 and 850 compares `basement == "No"` / `basement == "Yes"` — these are string comparisons that silently fail on booleans (`False == "No"` is False, `True == "Yes"` is False). Entry #18's `Basement = false` fell through to the final `return []` at line 853.

**Why Garage didn't have this bug.** `BuildFeatures.Garage.Garage1` is a Cognito **Choice** field with Yes/No as text options — it returns the string `"Yes"`. Line 836's `== "Yes"` comparison works. Different Cognito field types, different return types.

**Why Rule 114 (Input_153 basement_yn) is also broken but Entry #18 didn't surface it.** Line 862 does the same string comparison on the same field: `return "1" if basement == "Yes" else "0"`. For Entry #18 (`Basement = false`), the comparison `False == "Yes"` is False, falls to the else branch, returns `"0"` — which is coincidentally correct for a No-basement listing. The latent bug would silently write `"0"` on any SF+Yes-basement entry, mis-reporting Basement Y/N on Matrix. This handoff fixes it preemptively.

**Why Pool Y/N (line 830) is safe.** That line reads from the Community Reference DB, not Cognito. DB columns are plain text.

---

## 2. Target: `extension/scripts/generate.py`

### Change 1 — Add `_cognito_yesno()` helper

**Find this block** (end of `_cognito_multiselect_list`, start of Community resolution section):

```python
def _cognito_multiselect_list(entry: dict, dotted_path: str) -> list:
    """Read a Cognito multi-select field as a list of trimmed option strings."""
    raw = _cognito_get(entry, dotted_path)
    if not raw:
        return []
    if isinstance(raw, list):
        return [str(x).strip() for x in raw if str(x).strip()]
    # Cognito's standard shape: comma-joined string
    return [part.strip() for part in str(raw).split(",") if part.strip()]


# ---------------------------------------------------------------------------
# Community resolution — convention #6
# ---------------------------------------------------------------------------
```

**Replace with:**

```python
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
```

### Change 2 — Rule 111 (Input_569 basement_foundation) uses `_cognito_yesno`

**Find this block:**

```python
    # --- Basement/Foundation: PropertyType + Basement + FinishedStatus ---
    if input_id == "Input_569":
        prop_type = _cognito_get(entry, "PropertyBasics.PropertyType")
        basement  = _cognito_get(entry, "BuildFeatures.Basement.Basement")
        finished  = _cognito_get(entry, "BuildFeatures.Basement.FinishedStatus")
```

**Replace with:**

```python
    # --- Basement/Foundation: PropertyType + Basement + FinishedStatus ---
    if input_id == "Input_569":
        prop_type = _cognito_get(entry, "PropertyBasics.PropertyType")
        basement  = _cognito_yesno(entry, "BuildFeatures.Basement.Basement")
        finished  = _cognito_get(entry, "BuildFeatures.Basement.FinishedStatus")
```

Only `basement` changes. `prop_type` is a Choice field (string "Single Family" / "Townhouse"); `finished` is a Choice field (string "Finished" / "Part Finished" / "Unfinished" / null). Both stay on `_cognito_get`. Preserve the two-space alignment after `basement` and `finished` — it keeps the three variable names visually aligned.

### Change 3 — Rule 114 (Input_153 basement_yn) uses `_cognito_yesno`

**Find this block:**

```python
    # --- Basement Y/N: TH → "0", SF → Basement Y/N passthrough ---
    if input_id == "Input_153":
        prop_type = _cognito_get(entry, "PropertyBasics.PropertyType")
        if prop_type == "Townhouse":
            return "0"
        if prop_type == "Single Family":
            basement = _cognito_get(entry, "BuildFeatures.Basement.Basement")
            return "1" if basement == "Yes" else "0"
        return "0"
```

**Replace with:**

```python
    # --- Basement Y/N: TH → "0", SF → Basement Y/N passthrough ---
    if input_id == "Input_153":
        prop_type = _cognito_get(entry, "PropertyBasics.PropertyType")
        if prop_type == "Townhouse":
            return "0"
        if prop_type == "Single Family":
            basement = _cognito_yesno(entry, "BuildFeatures.Basement.Basement")
            return "1" if basement == "Yes" else "0"
        return "0"
```

Only the one `basement = ...` line changes. The `== "Yes"` comparison on the next line is now correct for both the TH case (`"No"`) and SF Yes-basement case (`"Yes"`).

---

## 3. Out of scope (do not touch)

- Line 830 (Pool Y/N from Community DB) — DB column read, already a string.
- Line 836 (Garage1 Cognito Choice field) — returns string "Yes" natively, works as-is.
- Rules table in Airtable — Transform text is correct; this is purely a script-side type-coercion fix.
- The `_cognito_multiselect_list` body — only the function that comes after it is new; its body is unchanged.
- Any other dispatcher case, OUTPUT_MAP, Features prefixing, community resolution, bath defaults, etc.

---

## 4. Verification after apply

Re-run Entry #18:

```bash
cd /Users/andrewrich/Desktop/aframe-mcp-connector/extension/scripts
source .venv/bin/activate
python generate.py --entry-id 18 --out /tmp/everstone-18-payload.json
```

Expected diff from the pre-fix Entry #18 payload — exactly two values change:

1. `features_a.basement_foundation` goes from `[]` to `["Input_569_03"]`.
2. `features_a.basement_yn` stays `"0"` (unchanged — Entry #18 is Basement=No, which the fix produces correctly; the pre-fix bug happened to produce the same "0" by coincidence).

Nothing else in the payload should change. If anything else differs, stop and report.

Then drop into the extension and run the Matrix fill on a test/draft listing. Features tab should now check the Crawl Space box under Basement/Foundation.

---

## 5. Rollback

Revert `extension/scripts/generate.py` to pre-handoff state. The pre-fix pipeline still produces a usable payload for TH listings (which don't exercise the broken branches) and for SF+No listings where `basement_foundation = []` can be hand-corrected on the Matrix side.

---

*Co-authored by Claude Opus 4.7 as the 2026-10-07 session's Everstone SF validation output. Diagnosis traced to the Cognito single-entry API returning `BuildFeatures.Basement.Basement` as boolean `false` (confirmed via direct `get_entry` fetch of Entry #18) rather than the string `"No"` returned by the view-API's summary listing.*

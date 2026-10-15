---
title: Phase 3a.1 — Lennar Listings sheet row write
document_id: HANDOFF-2026-10-14-phase-3a1-sheets-write
date: 2026-10-14
project: AAR-TC Lennar Operational Project
scope: Add Google Sheets row-write to /prepare-listing endpoint
related: FOUND-PHASE-TRACKER-001 v0.18, SESSION-HANDOFF-2026-10-13-VIRTUAL-TOUR-FIX-AND-PHASE-3A-LIVE.md
---

# Phase 3a.1 — Lennar Listings sheet row write

Single additive feature. 6 files touched. Not a batched-override; each file change is independent but all three "scope + builder + call site" pieces are needed for the feature to work end-to-end.

## Operator pre-apply steps (do IN PARALLEL with Cursor's apply)

These are operator-side GCP + Railway tasks. Cursor doesn't do these.

1. **Enable Google Sheets API** at console.cloud.google.com → "Matrix Automation" project → APIs & Services → Enable. OAuth consent screen stays as-is (already production-published).

2. **Re-mint refresh token** AFTER Cursor applies (needs the expanded SCOPES in `gcp_oauth_helper.py`):
   - `cd extension/scripts && python gcp_oauth_helper.py`
   - Browser pops open, authorize the expanded scopes, copy the new refresh token.

3. **Update Railway env vars**:
   - Replace `GCP_REFRESH_TOKEN` with the new value from step 2.
   - Add new var `GOOGLE_SHEET_ID` = `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME`.
   - Leave all other vars as-is.

## What this handoff does

Expands `/prepare-listing` to append a new row to the Lennar Listings Google Sheet at intake time, after the Drive folder create and prep email send. The row inserts at index 45 of the "Lennar Listings" tab, pushing existing rows down by one. Operator moves the row to its community block manually.

## Changes

### Change 1 — `extension/scripts/gcp_oauth_helper.py`

Expand the SCOPES list to include Sheets:

```python
SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/spreadsheets",  # Phase 3a.1
]
```

### Change 2 — `extension/scripts/google_services.py`

Add the Sheets scope to the SCOPES constant at the top (match gcp_oauth_helper.py exactly), and add a service builder below the existing Drive/Gmail builders:

```python
def build_sheets_service(credentials):
    """Build the Google Sheets API service using shared OAuth credentials."""
    return build("sheets", "v4", credentials=credentials, cache_discovery=False)
```

### Change 3 — NEW file `extension/scripts/sheets_services.py`

Full content:

```python
"""
Lennar Listings sheet write for /prepare-listing.

Target: "Lennar Listings Sheet - Gary Martin", tab "Lennar Listings" (sheetId 206940732).
Writes a new row at index 45 (1-based), pushing existing rows down by one.

Column map (confirmed 2026-10-14):
    A: Address             -> script writes "{StreetNumber} {StreetName}"
    B: MLS#                -> blank (operator fills after Matrix accepts)
    C: Current Price       -> script writes list price as currency
    D: New Price           -> blank
    E: Community           -> script writes DB key (e.g. "Everstone SF")
    F: Status              -> script writes "Input in progress"
    G: Closing Date        -> blank
    H: Price change date   -> blank
    I: (spacer)            -> blank
    J: Notes/Comments      -> blank
    K: (spacer)            -> blank
    L: Build Model         -> script writes PropertyBasics.BuildModelPlanName
    M: NHC                 -> script writes Intake.SubmittedBy (FirstAndLast)
    N: Tax ID              -> blank (operator fills from Matrix)
    O: Closing Cost        -> blank (operator fills post-contract)
    P: Loan Type           -> blank (operator fills post-contract)
    Q: Co-op Agent         -> blank (operator fills post-contract)
    R: Exterior Photos     -> =HYPERLINK(url, "Box link") OR
                              "Reused from {reuse_ref}" OR blank
    S: Interior Photos     -> same pattern (AdditionalPhotosLink field)
    T: Virtual Tour        -> =HYPERLINK(url, "Tour link") OR
                              "Reused from {reuse_ref}" OR blank
                              (Virtual Tour also falls back to the ReusePhotos
                              field — assumption: reused photos = reused tour)
"""

import logging

logger = logging.getLogger(__name__)

LENNAR_LISTINGS_TAB_ID = 206940732
TARGET_ROW = 45
STATUS_AT_INTAKE = "Input in progress"


def _format_price(value):
    if value is None:
        return ""
    try:
        return f"${float(value):,.0f}"
    except (TypeError, ValueError):
        return ""


def _photo_cell(url, reuse_ref, label):
    """
    Build the cell content for a photo/tour link.
    - URL populated     -> =HYPERLINK("url", "label")
    - URL blank + reuse -> "Reused from {reuse_ref}"
    - both blank        -> ""
    """
    if url:
        safe_url = url.replace('"', '""')
        return f'=HYPERLINK("{safe_url}", "{label}")'
    if reuse_ref:
        return f"Reused from {reuse_ref}"
    return ""


def build_listing_row(entry, community_display_name):
    """
    Build the 20-cell row (A..T) from a Cognito Form 17 single-entry fetch.

    Args:
        entry: nested-dict shape as returned by _cognito_fetch_entry
        community_display_name: resolved DB community key (e.g. "Everstone SF")

    Returns:
        List of 20 cell values, index 0 = column A.
    """
    def nested(path):
        cur = entry
        for part in path.split("."):
            if not isinstance(cur, dict):
                return None
            cur = cur.get(part)
        return cur

    street_number = nested("Intake.StreetNumber") or ""
    street_name = nested("Intake.StreetName") or ""
    address = f"{street_number} {street_name}".strip()

    list_price = nested("PropertyBasics.ListPrice")
    model = nested("PropertyBasics.BuildModelPlanName") or ""

    submitted_by = nested("Intake.SubmittedBy")
    if isinstance(submitted_by, dict):
        nhc = (
            submitted_by.get("FirstAndLast")
            or " ".join(x for x in [submitted_by.get("First"), submitted_by.get("Last")] if x)
            or ""
        )
    else:
        nhc = submitted_by or ""

    exterior_url = nested("PhotosVirtualTour.ExteriorPhotoLink") or ""
    interior_url = nested("PhotosVirtualTour.AdditionalPhotosLink") or ""
    tour_url = nested("PhotosVirtualTour.VirtualTourLink") or ""
    reuse_ref = nested("PhotosVirtualTour.ReusePhotosFromAPreviousListing") or ""

    row = [""] * 20
    row[0] = address                                              # A
    row[2] = _format_price(list_price)                            # C
    row[4] = community_display_name                               # E
    row[5] = STATUS_AT_INTAKE                                     # F
    row[11] = model                                               # L
    row[12] = nhc                                                 # M
    row[17] = _photo_cell(exterior_url, reuse_ref, "Box link")    # R
    row[18] = _photo_cell(interior_url, reuse_ref, "Box link")    # S
    row[19] = _photo_cell(tour_url, reuse_ref, "Tour link")       # T
    # B, D, G, H, I, J, K, N, O, P, Q intentionally blank
    return row


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
                    "inheritFromBefore": False,
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

### Change 4 — `extension/scripts/app.py`

**Imports (near top, with existing google_services / prep_email imports):**

```python
from sheets_services import build_listing_row, write_listing_row
from google_services import build_sheets_service
```

**Inside the `/prepare-listing` handler, after the existing Drive + Gmail steps and before the success response:**

```python
    # Phase 3a.1 — Lennar Listings sheet row write
    try:
        sheet_id = os.getenv("GOOGLE_SHEET_ID")
        if not sheet_id:
            raise RuntimeError("GOOGLE_SHEET_ID env var not set")
        sheets = build_sheets_service(credentials)
        row = build_listing_row(entry, community_display_name)
        write_listing_row(sheets, sheet_id, row)
        logger.info("Sheet row written for entry %s", entry_id)
    except Exception:
        logger.exception("Sheet row write failed for entry %s", entry_id)
        warnings.append("Sheet row write failed — see Railway logs")
```

**Cursor confirm step before applying:** this block assumes `credentials`, `entry`, `community_display_name`, `entry_id`, and `warnings` are all in scope at this point in the handler. The handler already builds `credentials` for the Drive/Gmail services — reuse that variable rather than minting new ones. If the handler uses different variable names (e.g. `creds`, `cognito_entry`, `community_key`), adapt to the real names rather than taking the snippet verbatim. Same `Header(None, alias="X-API-Key")` + `_check_api_key()` + `logger.exception` conventions apply as in prior changes.

### Change 5 — `extension/scripts/.env.example`

Append after the existing Phase 3a block:

```
# Phase 3a.1 — Lennar Listings sheet write
GOOGLE_SHEET_ID=
```

### Change 6 — `extension/Lennar_Extension_Build.md`

Append a new section at the end:

```markdown
## Phase 3a.1 — Lennar Listings sheet row write

Added 2026-10-14. Expands `/prepare-listing` to also append a row to the "Lennar Listings" Google Sheet at intake time, after the Drive folder and prep email steps.

- Target sheet: "Lennar Listings Sheet - Gary Martin" tab "Lennar Listings" (env var `GOOGLE_SHEET_ID`)
- Target row: 45 (hardcoded; new row inserts there, pushes everything below down one)
- Script-written columns: A (Address), C (Current Price), E (Community), F (Status = "Input in progress"), L (Build Model), M (NHC), R (Exterior Photos), S (Interior Photos), T (Virtual Tour)
- Operator-fill columns: B (MLS#), D (New Price), G (Closing Date), H (Price change date), J (Notes), N (Tax ID), O (Closing Cost), P (Loan Type), Q (Co-op Agent)
- Photo cells: `=HYPERLINK(url, "Box link")` for Exterior/Interior, `=HYPERLINK(url, "Tour link")` for Virtual Tour when Cognito URL is populated; `"Reused from {ReusePhotosFromAPreviousListing}"` when URL blank and the reuse field is populated (Virtual Tour also uses this fallback — assumption: reused photos imply reused tour); cell blank otherwise.
- Operator moves the row to its community block manually after the write.
- Sheet row write failure is non-fatal: logs the exception, appends a warning, lets the Drive + email succeed.
```

## Post-apply verification

1. Confirm Cursor applied all 6 changes cleanly. Report any deviations.
2. Operator: run `gcp_oauth_helper.py` locally to mint the new token, swap into Railway, add `GOOGLE_SHEET_ID`.
3. Railway auto-redeploys on push to main. Confirm `/`, `/recent-entries`, `/generate`, `/prepare-listing` all serving.
4. Fire `/prepare-listing` against the next real intake (or a prior entry ID for a smoke test).
5. Open the sheet. Confirm a new row appeared at row 45 with: Address populated, Current Price formatted, Community correct, Status = "Input in progress", Build Model and NHC populated in L/M, and R/S/T showing either hyperlinks or "Reused from..." or blank per the entry.
6. Click the hyperlinks — verify they open the right Lennar Box / tour URLs.
7. Move the row to its community block in the sheet.

## Parked

- URL auto-derivation for the Lennar virtual tour pattern (jurisdiction/community/model/homesite ID). Requires per-community URL templates in the Community Reference DB. Defer to a follow-up once we see how often the ReusePhotos text-fallback is good enough.
- NHC name edge cases (middle names, suffixes). Current approach grabs `FirstAndLast`.
- Column grouping on L:T (toggle) already live in the sheet — not script-managed.

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
    N: Tax ID               -> blank (operator fills from Matrix)
    O: Closing Cost         -> blank (operator fills post-contract)
    P: Loan Type            -> blank (operator fills post-contract)
    Q: Co-op Agent          -> blank (operator fills post-contract)
    R: Exterior Photos      -> =HYPERLINK(url, "Box link") OR
                               "Reused from {reuse_ref}" OR blank
    S: Interior Photos      -> same pattern (AdditionalPhotosLink field)
    T: Virtual Tour         -> =HYPERLINK(url, "Tour link") OR
                               "Reused from {reuse_ref}" OR blank
                               (Virtual Tour also falls back to the ReusePhotos
                               field — assumption: reused photos = reused tour)
"""

from __future__ import annotations

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

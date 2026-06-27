# Lennar CVRMLS Bookmarklet Build Notes
**Document ID:** AAR-TC-LENNAR-BM-NOTES-001
**Version:** 1.0 | *Last Updated: June 27, 2026*
**Base:** `CVRMLS_Bookmarklet_Build.md` (AAR-TC-CVRMLS-BM-001)

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-27 | Andrew Rich / Claude | Split from `Lennar_MLS_Bookmarklet_Build.md` (AAR-TC-LENNAR-BM-001 v1.3). Lennar-specific operational notes, community tables, and fee data extracted here. |

---

## Purpose

This file contains Lennar-specific build notes that do not belong in the universal CVRMLS build doc. It is read alongside `CVRMLS_Bookmarklet_Build.md` — not as a standalone document. For field maps, architecture decisions, and bookmarklet sequencing, see the universal build doc.

---

## Listing Info — Community Dropdown Values

Confirmed stored option values extracted via live ES session (2026-06-25). These values populate the `COMMUNITIES` lookup table in `Lennar_Bookmarklet_Customization.md`.

Wynwood at Fox Creek removed — community sold out, no forthcoming listings.

| Community | County/City | Area | ZIP | Post Office | Subdivision | Neighborhood | Elementary | Middle | High |
|---|---|---|---|---|---|---|---|---|---|
| Harpers Mill TH | Chesterfield | 54 | 23832 | Chesterfield | Harpers Mill | — | Winterpock | DeepCreek | Cosby |
| Harpers Mill SF | Chesterfield | 54 | 23832 | Chesterfield | Harpers Mill | — | Winterpock | DeepCreek | Cosby |
| Creekside Run TH | Richmond | 60 | 23224 | Richmond | Creekside Run | — | Reid | RiverCity | Huguenot |
| Everstone SF | Henrico | 42 | 23223 | Richmond | None* | Everstone | Harvie | Fairfield | HighlandSprings |
| Watermark SF | Chesterfield | 54 | 23234 | Chesterfield | Watermark | — | Hopkins | FallingCreek | Bird |

*`None` is a real Matrix stored option value for `Input_259`. Everstone uses the Neighborhood text field (`Input_236`) instead.

**Matrix school name storage note:** Multi-word school names are stored without spaces — e.g. `DeepCreek`, `RiverCity`, `FallingCreek`, `HighlandSprings`.

**Entry path assignments:**
- Harpers Mill TH + SF: Tax ID path
- Creekside Run TH: New path
- Everstone SF: New path
- Watermark SF: New path

*Revisit when tax records are updated for new addresses.*

---

## Bath Info — Typical Lennar Configurations

| Type | Basement | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|---|
| Townhouse | 0 full / 0 half | 0 full / 1 half | 2 full / 0 half (TS) | 0/0 | 0/0 |
| Single Family | 0 full / 0 half | 0 full / 1 half | 2 full / 0 half (TS) | 0/0 | 0/0 |

Configurations vary by plan — confirm from listing email. These are the most common defaults.

---

## Fee Info — Per Community Values

Fee data sourced from Lennar Community Reference Database (AAR-TC-LENNAR-DB-001). Confirm at listing intake — amounts may change.

| Community | HOA Fee | Period | Addl HOA | Addl Fee $ | Addl Fee Desc | Fee Includes |
|---|---|---|---|---|---|---|
| Harpers Mill TH | *(from DB)* | *(from DB)* | Yes (`1`) | `70.00` | Initial Working Capital Contribution: $350 | `19` (Clubhouse), `01` (Comm Ar Mnt), `25` (Common Area), `10` (Pool), `14` (Snow Removal), `15` (Trash Removal) |
| Harpers Mill SF | *(from DB)* | *(from DB)* | No (`0`) | — | *(confirm)* | *(confirm exact MLS wording)* |
| Creekside Run TH | *(from DB)* | *(from DB)* | No (`0`) | — | — | *(blank on MLS sheet — confirm)* |
| Everstone SF | *(from DB)* | *(from DB)* | No (`0`) | — | — | `01` (Comm Ar Mnt), `25` (Common Area) |
| Watermark SF | *(from DB)* | *(from DB)* | No (`0`) | — | — | `19` (Clubhouse), `25` (Common Area), `10` (Pool), `11` (Recreational Facilities) |

**Fee Desc for all Lennar communities:** Always `Input_111_01` (Community Association).
**Allow Onsite for all Lennar communities:** All unchecked.

---

## Listing Info — Pending Extractions

Fields still needing stored value confirmation for Lennar communities. These are the `TODO` items carried forward from the original build doc.

| Field | Input ID | Status | Notes |
|---|---|---|---|
| Street Suffix | `Input_37` | ⬜ Pending | Extract stored values for: Dr, Ln, Way, Ct, Pl, Blvd, Rd, St, Ter — Session 017 agenda item 2 |

All County/City, Area, ZIP, Post Office, Subdivision, and school values are confirmed — see community table above.

---

## General Info — Lennar New Path Statics

On the New path, Lennar writes these fields that are skipped or dynamic on non-Lennar listings:

| Field | Input ID | Lennar New Path Value | Notes |
|---|---|---|---|
| Tax Year | `Input_246` | `0` | Pre-populated from tax record on taxid path — skip |
| Annual Taxes | `Input_105` | `0` | Pre-populated from tax record on taxid path — skip |
| Assd Land | `Input_247` | `0` | Pre-populated from tax record on taxid path — skip |
| Legal Description | `Input_100` | `TBD` | Pre-populated on taxid path — skip |

**Assd Improvement (`Input_248`):** Write `0` on both paths for Lennar. This field does NOT pre-populate from the tax record on either path. Write is gated behind `isLennar === true` — non-Lennar taxid listings have this pre-populated and must not be overwritten.

---

## Matrix — Copy Path Notes (Lennar)

The Copy path is the preferred long-term approach for Lennar once a clean template listing exists per community. The bookmarklet becomes a very light touch at that point — only listing-specific fields (price, address, sqft, bed/bath, remarks) need writing; everything else carries over from the template.

Template listings to establish: one per active community, per type (TH/SF).

---

## Bookmarklet Status (Lennar Launchers)

Current status of all Lennar-specific launcher files as of Session 016.

| Tab | Launcher File | Status |
|---|---|---|
| Listing Info | `bookmarklets/listing_info.html` (Lennar variant) | ✅ Tested |
| Room Info | — | Lennar skips this tab — no launcher needed |
| Bath Info | `bookmarklets/bath_info.html` (Lennar variant) | ✅ Tested |
| Features | `bookmarklets/lennar_features.html` | ✅ Tested |
| General Info | `bookmarklets/general_info.html` (Lennar variant) | ✅ Tested |
| Remarks | `bookmarklets/remarks.html` (shared) | ✅ Tested |
| Fee Info | `bookmarklets/fee_info.html` (Lennar variant) | ✅ Tested |
| Owner Info | `bookmarklets/owner_info.html` (Lennar variant) | ✅ Tested |
| Agent/Office Info | `bookmarklets/agent_office_info.html` (Lennar variant) | ✅ Tested |
| Showing Instructions | `bookmarklets/showing_instructions.html` (Lennar variant) | ✅ Tested |
| Virtual Tour Info | `bookmarklets/virtual_tour_info.html` (shared) | ✅ Tested |
| Internet Display Info | `bookmarklets/internet_display_info.html` (shared) | ✅ Tested |

---

*Lennar CVRMLS bookmarklet build notes — Lennar-specific operational data only.*
*Universal field maps and architecture: `docs/cvrmls/CVRMLS_Bookmarklet_Build.md` (AAR-TC-CVRMLS-BM-001).*
*Lennar JS customization layer: `docs/lennar/Lennar_Bookmarklet_Customization.md` (AAR-TC-LENNAR-BM-CUST-001).*
*Community Reference Database: AAR-TC-LENNAR-DB-001.*

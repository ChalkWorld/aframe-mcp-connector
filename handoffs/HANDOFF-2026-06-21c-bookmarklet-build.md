# Cursor Handoff — Bookmarklet Build Doc v1.3
**File:** `docs/Lennar_MLS_Bookmarklet_Build.md`
**Handoff ID:** HANDOFF-2026-06-21c-bookmarklet-build
**Date:** June 21, 2026

Apply every change below in sequence. Run the git commands at the end exactly as written.

---

## Change 1 — Listing Info field map: correct PID New path note

Find this line in the Listing Info field map table:

```
| PID | `Input_99` | text | DYNAMIC | Tax ID if available / `Pending Assignment` if not |
```

Replace with:

```
| PID | `Input_99` | text | DYNAMIC | Tax ID path: pre-populated — bookmarklet skips. New path: enter `TBD` |
```

---

## Change 2 — Add Room Info field map section

Find this line in the Field Maps section:

```
### Agent/Office Info — ✅ Field Map Complete (June 21, 2026)
```

Insert the following block immediately before that line:

```markdown
### Room Info — ✅ Field Map Complete (June 21, 2026)

**Lennar:** Skip this tab entirely — room data is not provided for Lennar listings.

**Subform structure:** All room fields live inside `<table id="_Input_144_table">`. Each room row uses the ID pattern `_Input_144__REPEAT{N}_{fieldNum}` where `N` is the zero-based row index (0, 1, 2…) and field numbers are fixed constants across all rows.

**REPEAT19** is a hidden template row used as a clone source by `showAnotherRow()`. It is never written to by the bookmarklet.

**Row creation:** REPEAT0 exists in the DOM on page load. For each additional room, the bookmarklet must call `Subforms['s_144'].showAnotherRow()` once before writing to that row's fields.

**Open question:** Confirm whether REPEAT0 requires a `showAnotherRow()` call or is reliably present on page load without one.

| Field | Field Num | Full ID Pattern | Type | Static/Dynamic/Skip | Notes |
|---|---|---|---|---|---|
| Room Type | `139` | `_Input_144__REPEAT{N}_139` | select | DYNAMIC | 21 options — see value list below |
| Room Length — feet | `140` | `_Input_144__REPEAT{N}_140` | text | DYNAMIC | Larger dimension, rounded to whole feet |
| Room Length — decimal | `774` | `_Input_144__REPEAT{N}_774` | text | SKIP | Always blank — decimals not used |
| Room Width — feet | `141` | `_Input_144__REPEAT{N}_141` | text | DYNAMIC | Smaller dimension, rounded to whole feet |
| Room Width — decimal | `775` | `_Input_144__REPEAT{N}_775` | text | SKIP | Always blank — decimals not used |
| Room Level | `142` | `_Input_144__REPEAT{N}_142` | select | DYNAMIC | 7 options — see value list below |
| Room Description | `143` | `_Input_144__REPEAT{N}_143` | text (50 char max) | DYNAMIC | 50 char hard limit — abbreviations common; best practices TBD |

**Each row also has these hidden infrastructure fields — do not write to them:**

| Field | Full ID Pattern | Notes |
|---|---|---|
| Room Type DV shadow | `_Input_144__REPEAT{N}_DV_139` | Display-value sentinel — managed by Matrix |
| Room Level DV shadow | `_Input_144__REPEAT{N}_DV_142` | Display-value sentinel — managed by Matrix |
| Entry order | `_Input_144__entryorder__REPEAT{N}_` | Row order tracker — managed by Matrix |
| Row presence | `_Input_144__rowPresence_REPEAT{N}_` | Set to `Present` by Matrix on row creation |

**Room Type select values:**

| Value | Display Label |
|---|---|
| `ADRM1` | Additional Room 1 |
| `ADRM2` | Additional Room 2 |
| `ADRM3` | Additional Room 3 |
| `ADRM4` | Additional Room 4 |
| `BDRM2` | Bedroom 2 |
| `BDRM3` | Bedroom 3 |
| `BDRM4` | Bedroom 4 |
| `BDRM5` | Bedroom 5 |
| `DINRM` | Dining Room |
| `FAMRM` | Family Room |
| `FLARM` | Florida Room |
| `FOYER` | Foyer |
| `GRTRM` | Great Room |
| `KTCH` | Kitchen |
| `LAUTRM` | Laundry-Utility Room |
| `LIVRM` | Living Room |
| `MORRM` | Morning Room |
| `OFCST` | Office-Study |
| `MBDRM` | Primary Bedroom |
| `MBDRM2` | Primary Bedroom 2 |
| `RECRM` | Rec Room |

**Room Level select values:**

| Value | Display Label |
|---|---|
| `1` | Level 1 |
| `2` | Level 2 |
| `3` | Level 3 |
| `4` | Level 4 |
| `B` | Basement |
| `L` | Lower |
| `M` | Main |

**Room order best practice (non-Lennar):** Level 1 first, ascending by level, Basement last. Within each level, walk-through order — entry → living spaces → kitchen → bedrooms. Guideline only; not enforced by bookmarklet.

**Payload structure:**
```json
"room": [
  { "type": "FOYER", "length": 10, "width": 8, "level": "1", "desc": "" },
  { "type": "FAMRM", "length": 18, "width": 14, "level": "1", "desc": "" }
]
```

---

```

---

## Change 3 — Add General Info field map section

Find this line in the Field Maps section:

```
### Showing Instructions — ✅ Field Map Complete (June 21, 2026)
```

Insert the following block immediately before that line:

```markdown
### General Info — ✅ Field Map Complete (June 21, 2026)

**Tax ID path notes:**
- Tax Year, Annual Taxes, Assd Land, and Acres pre-populate from tax record — bookmarklet skips those four on Tax ID path
- Assd Improvement does NOT pre-populate on Tax ID path — bookmarklet writes `0` on both paths
- Legal Description pre-populates on Tax ID path — bookmarklet skips on Tax ID path; writes `TBD` on New path
- Acres: on Tax ID path, verify pre-populated value against email data sheet — new construction lot sizes may not yet match tax record

| Field | Input ID | Type | Lennar — New Path | Lennar — Tax ID Path | Non-Lennar |
|---|---|---|---|---|---|
| Waterfront | `Input_94` | select | STATIC → `N` | STATIC → `N` | DYNAMIC |
| Investor Rental Cap | `Input_697` | select | SKIP | SKIP | DYNAMIC |
| Water Depth | `Input_700` | select | SKIP | SKIP | DYNAMIC |
| Model Available | `Input_249` | select | STATIC → `0` (No) | STATIC → `0` (No) | DYNAMIC |
| Model Furnished | `Input_250` | select | SKIP | SKIP | DYNAMIC |
| Res Energy Efficient Appraisal | `Input_703` | select | SKIP | SKIP | DYNAMIC |
| Pre Qual Letter | `Input_702` | select | SKIP | SKIP | DYNAMIC |
| Acres | `Input_95` | text (9 char) | DYNAMIC — from email data sheet | SKIP — pre-populated; verify against email | DYNAMIC |
| Body of Water | `Input_696` | text (48 char) | SKIP | SKIP | DYNAMIC |
| Lot Dimensions | `Input_96` | text (25 char) | SKIP | SKIP | DYNAMIC |
| Tax Year | `Input_246` | text (10 char) | STATIC → `2026` | SKIP — pre-populated | DYNAMIC |
| Annual Taxes | `Input_105` | text (14 char) | STATIC → `0` | SKIP — pre-populated | DYNAMIC |
| Assd Land | `Input_247` | text (10 char) | STATIC → `0` | SKIP — pre-populated | DYNAMIC |
| Assd Improvement | `Input_248` | text (10 char) | STATIC → `0` | STATIC → `0` | DYNAMIC |
| Home Warranty | `Input_106` | text (10 char) | SKIP | SKIP | DYNAMIC |
| Current Zoning | `Input_253` | text (64 char) | SKIP | SKIP | DYNAMIC |
| Road Frontage | `Input_251` | text (10 char) | SKIP | SKIP | DYNAMIC |
| Water Frontage | `Input_252` | text (10 char) | SKIP | SKIP | DYNAMIC |
| Home Energy Score | `Input_704` | text (2 char) | SKIP | SKIP | DYNAMIC |
| Home Energy Rating System | `Input_273` | text (10 char) | SKIP | SKIP | DYNAMIC |
| Does Not Convey | `Input_93` | text (128 char) | SKIP | SKIP | DYNAMIC |
| Does Convey | `Input_863` | text (128 char) | SKIP | SKIP | DYNAMIC |
| Minimum Deposit | `Input_701` | text | SKIP | SKIP | DYNAMIC |
| Legal Description | `Input_100` | textarea | STATIC → `TBD` | SKIP — pre-populated | DYNAMIC |
| Lot Desc | `Input_101_*` | checkbox (46 options) | SKIP | SKIP | DYNAMIC |
| Disclosures | `Input_102_*` | checkbox (12 options) | STATIC → `Input_102_NOTREQ` checked | STATIC → `Input_102_NOTREQ` checked | DYNAMIC |
| Lead Disclosure | `Input_103_*` | checkbox (5 options) | STATIC → `Input_103_NOTREQ` checked | STATIC → `Input_103_NOTREQ` checked | DYNAMIC |

**DV shadow pairs on this tab:**
- `DV_94` → paired with `Input_94` (Waterfront select)
- `DV_700` → paired with `Input_700` (Water Depth select)
- `DV_101` → paired with `Input_101_*` (Lot Desc checkboxes)
- `DV_102` → paired with `Input_102_*` (Disclosures checkboxes)
- `DV_103` → paired with `Input_103_*` (Lead Disclosure checkboxes)

**Lot Desc — full semantic list (46 options, non-Lennar use):**

| Element ID | Value | Display Label |
|---|---|---|
| `Input_101_01` | `01` | Additional Parcel Available |
| `Input_101_45` | `45` | Beach |
| `Input_101_46` | `46` | Boat Ramp |
| `Input_101_44` | `44` | Buildable |
| `Input_101_21` | `21` | Bulkhead/RIP |
| `Input_101_02` | `02` | City View |
| `Input_101_22` | `22` | Cleared |
| `Input_101_03` | `03` | Corner |
| `Input_101_23` | `23` | Crops |
| `Input_101_24` | `24` | Cross Fenced |
| `Input_101_04` | `04` | Cul-De-Sac |
| `Input_101_25` | `25` | Curb/Gutters |
| `Input_101_05` | `05` | Dead End Street |
| `Input_101_26` | `26` | Fenced/Enclosed |
| `Input_101_27` | `27` | Flag Lot |
| `Input_101_06` | `06` | Fruit Trees |
| `Input_101_28` | `28` | Graded |
| `Input_101_07` | `07` | Irregular |
| `Input_101_08` | `08` | Landlocked |
| `Input_101_29` | `29` | Landscaped |
| `Input_101_09` | `09` | Level |
| `Input_101_10` | `10` | On Golf Course |
| `Input_101_11` | `11` | Paper Street |
| `Input_101_12` | `12` | Park Like |
| `Input_101_30` | `30` | Pasture |
| `Input_101_31` | `31` | Possible Subdivision |
| `Input_101_32` | `32` | Possible Wetland |
| `Input_101_35` | `35` | Railroad Access |
| `Input_101_36` | `36` | Railroad Siding |
| `Input_101_33` | `33` | Railroad Spur |
| `Input_101_34` | `34` | Rolling |
| `Input_101_37` | `37` | Sidewalks |
| `Input_101_13` | `13` | Sloping |
| `Input_101_14` | `14` | Steep Slopes |
| `Input_101_20` | `20` | Street Lights |
| `Input_101_15` | `15` | Subdividable |
| `Input_101_38` | `38` | Timber-Hardwood |
| `Input_101_39` | `39` | Timber-Mixed |
| `Input_101_40` | `40` | Timber-Pine |
| `Input_101_41` | `41` | Timbered-Clear Cut |
| `Input_101_42` | `42` | Timbered-Select Cut |
| `Input_101_43` | `43` | Unimproved |
| `Input_101_16` | `16` | Waterfront |
| `Input_101_17` | `17` | Waterview |
| `Input_101_18` | `18` | Wooded |
| `Input_101_19` | `19` | Zero Lot Line |

**Disclosures — full semantic list (12 options):**

| Element ID | Value | Display Label |
|---|---|---|
| `Input_102_APCZ` | `APCZ` | AICUZ Accident Potential Clear Zone |
| `Input_102_APZ1` | `APZ1` | AICUZ Accident Potential Zone 1 |
| `Input_102_APZ2` | `APZ2` | AICUZ Accident Potential Zone 2 |
| `Input_102_LESS65` | `LESS65` | AICUZ Noise Level <65 |
| `Input_102_75PLUS` | `75PLUS` | AICUZ Noise Level >75 |
| `Input_102_65TO70` | `65TO70` | AICUZ Noise Level 65-70 |
| `Input_102_70TO75` | `70TO75` | AICUZ Noise Level 70-75 |
| `Input_102_LISTAT` | `LISTAT` | Listing Attachment |
| `Input_102_NOFORM` | `NOFORM` | No Form |
| `Input_102_NOTREQ` | `NOTREQ` | Not Required |
| `Input_102_OFFICE` | `OFFICE` | Office |
| `Input_102_PROPTY` | `PROPTY` | Property |

**Lead Disclosure — full semantic list (5 options):**

| Element ID | Value | Display Label |
|---|---|---|
| `Input_103_LISTAT` | `LISTAT` | Listing Attachment |
| `Input_103_NOFORM` | `NOFORM` | No Form |
| `Input_103_NOTREQ` | `NOTREQ` | Not Required |
| `Input_103_OFFICE` | `OFFICE` | Office |
| `Input_103_PROPTY` | `PROPTY` | Property |

**Payload structure:**
```json
"general": {
  "acres": "",
  "legal": "TBD"
}
```

---

```

---

## Change 4 — Add Remarks field map section

Find this line in the Field Maps section:

```
### Fee Info — ✅ Field Map Complete (June 21, 2026)
```

Insert the following block immediately before that line:

```markdown
### Remarks — ✅ Field Map Complete (June 21, 2026)

Character limits are enforced client-side via companion `Input_[N]_chars` counter labels — neither textarea has a `maxlength` HTML attribute on the element itself.

| Field | Input ID | Type | Char Limit | Lennar | Notes |
|---|---|---|---|---|---|
| Remarks | `Input_107` | textarea | 2048 | DYNAMIC | Public-facing remarks — from email/session |
| Agent Only Comments | `Input_108` | textarea | 1000 | DYNAMIC | Internal agent notes |
| Copyright Agreement | `Input_662` | select | — | STATIC → `1` (Yes) | Always Yes — hardcoded in bookmarklet; Matrix flags if blank |

**Copyright Agreement options:** `""` (blank, default), `1` (Yes), `0` (No). Bookmarklet always sets `1`.

**Payload structure:**
```json
"remarks": {
  "remarks": "",
  "agent_comments": ""
}
```

---

```

---

## Change 5 — Update payload schema

Find this block in the Payload Schema section:

```
  "room": { ... },
```

Replace with:

```
  "room": [
    { "type": "", "length": 0, "width": 0, "level": "", "desc": "" }
  ],
```

---

Find this block:

```
  "general": { ... },
  "remarks": { ... },
```

Replace with:

```
  "general": {
    "acres": "",
    "legal": "TBD"
  },
  "remarks": {
    "remarks": "",
    "agent_comments": ""
  },
```

---

## Change 6 — Update Tab Inventory

Find these three rows in the Tab Inventory table:

```
| Room Info | ✅ | ⬜ Pending | ⬜ Pending | |
```

Replace with:

```
| Room Info | ✅ | ✅ Complete | ⬜ Pending | Subform repeating structure — REPEAT{N} index; skip entirely for Lennar |
```

---

Find:

```
| General Info | ✅ | ⬜ Pending | ⬜ Pending | |
```

Replace with:

```
| General Info | ✅ | ✅ Complete | ⬜ Pending | Mostly SKIP for Lennar — 4 statics, 1 dynamic (Acres on New path) |
```

---

Find:

```
| Remarks | ✅ | ⬜ Pending | ⬜ Pending | Public remarks + agent comments — long text fields |
```

Replace with:

```
| Remarks | ✅ | ✅ Complete | ⬜ Pending | 3 fields — Remarks (2048), Agent Comments (1000), Copyright (STATIC Yes) |
```

---

## Change 7 — Update Open Questions

Find this line in the Open Questions section:

```
- [ ] Owner Info — confirm what fields exist and whether Lennar as seller has a standard entry
```

Delete that line entirely — Owner Info is now mapped and this question is resolved.

---

Add the following new open question at the end of the Open Questions list:

```
- [ ] Room Info — confirm whether REPEAT0 requires a `showAnotherRow()` call or is reliably present on page load without one
```

---

## Change 8 — Update Version History

Find this line in the Version History table:

```
| 1.2 | 2026-06-21 | Andrew Rich / Claude | Owner Info and Fee Info field maps complete. Full semantic label lists captured for all checkbox groups for non-Lennar use. Fee Includes per-community values added. Standing rule established: always capture full semantic labels during extraction regardless of Lennar static usage. |
```

Add this new row immediately after it:

```
| 1.3 | 2026-06-21 | Andrew Rich / Claude | Room Info, General Info, and Remarks field maps complete. Listing Info PID New path note corrected to `TBD`. Payload schema updated for room, general, and remarks keys. Tab Inventory updated. |
```

---

## Git Commands

Run in sequence after all changes are applied:

```bash
git add docs/Lennar_MLS_Bookmarklet_Build.md
git commit -m "v1.3: Room Info, General Info, Remarks field maps complete; PID New path correction"
git push
```

---

*AAR-TC Transaction Services | Handoff date: June 21, 2026*

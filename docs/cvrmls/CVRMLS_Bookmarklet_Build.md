# CVRMLS Matrix Bookmarklet Build
**Document ID:** AAR-TC-CVRMLS-BM-001
**Version:** 1.0 | *Last Updated: June 27, 2026*
*Living document — update as field mapping and build work progresses*

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-27 | Andrew Rich / Claude | Split from `Lennar_MLS_Bookmarklet_Build.md` (AAR-TC-LENNAR-BM-001 v1.3). Universal CVRMLS content extracted; Lennar-specific build notes moved to `Lennar_Bookmarklet_Build_Notes.md`. Field map "Lennar Value" columns generalized to "Notes / Builder Use". |

---

## What This Is

A bookmarklet-based system for automating MLS data entry in CVRMLS Matrix. Instead of manually reading each field and clicking each checkbox, a session parses the listing source and outputs a JSON payload. You copy the payload, navigate to Matrix, and click a bookmark on each tab — fields populate instantly.

The goal is to eliminate the cognitive load of careful field-by-field reading during Matrix input. The clicking stays manual; the thinking is removed entirely.

---

## Architecture Decisions

**One bookmarklet per tab** — CVRMLS Matrix uses ASP.NET server-side tab rendering. Each tab is a separate page load; the other tabs' fields do not exist in the DOM until navigated to. A single fire-and-done bookmarklet is not possible. One bookmarklet per tab is the correct approach.

**Clipboard reader** — The bookmarklet reads a JSON payload from the clipboard rather than having listing data hardcoded in. This means the bookmarklet itself is permanent and never changes — only the clipboard payload changes listing to listing. The session generates the full payload; you copy it once and use it across all tabs.

**Static vs dynamic fields** — Some fields are identical across all listings of a given type (e.g. builder new construction). These can be hardcoded into a builder customization layer as constants and fire automatically without needing to be in the clipboard payload. Only fields that vary listing to listing are pulled from the clipboard. Builder-specific constants are defined in the builder's customization file — see `docs/lennar/Lennar_Bookmarklet_Customization.md` for the Lennar implementation.

**Status tab — never automated** — The Status tab controls MLS activation (Coming Soon, Active, etc.). This tab is never touched by the bookmarklet system. Activation is always a manual action. Hard rule.

**Bookmarklet installation method** — Chrome blocks pasting `javascript:` URLs directly into bookmark fields. The correct installation method is a local HTML launcher file with the bookmarklet as an `href` on an anchor element. Dragging that anchor to the bookmarks bar installs it without triggering Chrome's security restriction. A launcher file should be generated for each bookmarklet.

**Three entry paths — three bookmarklet folders** — Prior to the tabbed input view, Matrix offers three listing creation paths. Each path pre-populates a different set of fields, so the bookmarklet behavior differs by path. Three Chrome bookmark folders are used:
- `Matrix — New` — clean slate; bookmarklet fills all fields
- `Matrix — Tax ID` — location fields pre-populated from tax record; bookmarklet skips those, fills the rest
- `Matrix — Copy` — most fields pre-populated from an existing listing; bookmarklet fills listing-specific fields only (price, address, sq ft, bed/bath, remarks)

The session generates one payload per listing. The correct folder is selected based on which entry path was used.

**Dynamic dropdown sequencing** — Several fields on the Listing Info tab are dynamically populated based on upstream selections. County/City must be set and a `change` event fired before Area, ZIP Code, Subdivision, and school dropdowns will populate. The Listing Info bookmarklet handles this with async sequencing: set County/City → fire `change` → await DOM repopulation → set Area → fire `change` → await → then set Subdivision and schools. Matrix requires `change` events to be fired on dropdowns, not just value setting.

**Map fields — always manual** — Latitude, Longitude, and Directions are never touched by the bookmarklet. Map verification requires human judgment, especially for new construction addresses. The Directions field has a 215-character limit and is address-specific.

**Custom Chrome extension — future state** — A custom Chrome extension is a cleaner long-term solution. It could detect the current Matrix tab automatically, hold the payload internally (no clipboard needed), and provide a single toolbar button. No App Store approval required — extensions load via `chrome://extensions` in developer mode. This is a Cursor project and the right target state once the field mapping is complete and the workflow is proven. The extension should support multiple MLS systems and builder customization layers via header keys in the payload (`mls`, `builder`).

---

## POC Results — June 20, 2026

**Tab tested:** Bath Info
**Listing used:** 6035 Blue Iris Dr, Creekside Run TH

**What was proven:**
- Claude in Chrome extension can read DOM field IDs from a Matrix tab
- Field IDs follow a consistent, predictable naming convention: `Input_[N]` for form fields, `DV_[N]` for paired hidden display value fields
- JavaScript executing in the Matrix page context can set text field values and select dropdown values correctly
- The clipboard reader approach works — bookmarklet reads `navigator.clipboard.readText()`, parses JSON, maps values to field IDs
- The drag-to-bookmarks-bar HTML launcher method successfully installs a working bookmarklet in Chrome
- End-to-end flow confirmed: copy payload → navigate to tab → click bookmark → fields populate

---

## Field Maps

Field map columns:
- **Static/Dynamic/Skip** — universal behavior. `STATIC` = hardcoded value consistent across all listings of this type; `DYNAMIC` = read from clipboard payload; `SKIP` = never written by bookmarklet
- **Notes / Builder Use** — CVRMLS behavioral notes and builder-specific value examples. Lennar-specific defaults are noted where applicable.

---

### Bath Info — ✅ Complete (POC — June 20, 2026)

| Field | Input ID | Type | Static/Dynamic/Skip | Notes / Builder Use |
|---|---|---|---|---|
| Basement — Bath Description | `Input_57` | select | DYNAMIC | Values: blank, `S`, `T`, `TS` |
| Basement — Full Baths | `Input_61` | text | DYNAMIC | Explicit `0` required — Matrix flags blank |
| Basement — Half Baths | `Input_65` | text | DYNAMIC | Explicit `0` required |
| Level 1 — Bath Description | `Input_58` | select | DYNAMIC | Values: blank, `S`, `T`, `TS` |
| Level 1 — Full Baths | `Input_62` | text | DYNAMIC | |
| Level 1 — Half Baths | `Input_66` | text | DYNAMIC | |
| Level 2 — Bath Description | `Input_59` | select | DYNAMIC | Values: blank, `S`, `T`, `TS` |
| Level 2 — Full Baths | `Input_63` | text | DYNAMIC | |
| Level 2 — Half Baths | `Input_67` | text | DYNAMIC | |
| Level 3 — Bath Description | `Input_60` | select | DYNAMIC | Values: blank, `S`, `T`, `TS` |
| Level 3 — Full Baths | `Input_64` | text | DYNAMIC | |
| Level 3 — Half Baths | `Input_68` | text | DYNAMIC | |
| Level 4 — Bath Description | `Input_737` | select | DYNAMIC | Values: blank, `S`, `T`, `TS` |
| Level 4 — Full Baths | `Input_738` | text | DYNAMIC | |
| Level 4 — Half Baths | `Input_739` | text | DYNAMIC | |

**Bath Info rules:**
- Bath Description dropdown only needs a value when Full Baths > 0 — leave blank for half-bath-only levels
- All numeric fields require explicit `0` — Matrix flags empty fields on save

---

### Listing Info — ✅ Field Map Complete (June 21, 2026)

43 fields total. `STATIC` values shown are CVRMLS system behaviors or common defaults; builder-specific static values are noted in the Notes column.

#### Listing Information Section

| Field | Input ID | Type | Static/Dynamic/Skip | Notes / Builder Use |
|---|---|---|---|---|
| County/City | `Input_29` | select (186 options) | DYNAMIC | Set first; triggers downstream cascade. Stored values confirmed per jurisdiction — see extraction notes |
| Delayed Show | `Input_32` | select | DYNAMIC | `0` (No) default; builder may hardcode — Lennar: always `0` |
| List Price | `Input_31` | text | DYNAMIC | From listing source |
| List Date | `Input_160` | text (date picker) | DYNAMIC | Today's date — always; never source email date |
| Type | `Input_849` | select | DYNAMIC | `SFR` = Single Family / `TOWN` = Townhouse |
| Attached YN | `Input_850` | select | DYNAMIC | Derived from Type — `1` (Yes) for TH / `0` (No) for SF |
| No Show Until | `Input_33` | text (date picker) | SKIP | Leave blank |
| Expected OnMkt Dte | `Input_782` | text (date picker) | SKIP | Leave blank |
| PID | `Input_99` | text | DYNAMIC | Tax ID path: pre-populated — skip. New path: write value or placeholder. Lennar new path: `TBD` |
| Area | `Input_30` | select (dynamic) | DYNAMIC | Populated after County/City — varies by jurisdiction |
| Expire Date | `Input_162` | text (date picker) | DYNAMIC | Listing agreement expiry — builder may hardcode. Lennar: `12/31/2026` (Master Listing Agreement expiry — update when renewed) |
| 1st Rt of Refusal | `Input_781` | select | STATIC | blank — always |

#### Location Information Section

| Field | Input ID | Type | Static/Dynamic/Skip | Notes / Builder Use |
|---|---|---|---|---|
| Street # | `Input_34` | text | DYNAMIC | From listing source |
| Street Direction | `Input_35` | select (9 options) | DYNAMIC | From address — blank if none |
| Street Name | `Input_36` | text | DYNAMIC | From listing source |
| Street Suffix | `Input_37` | select (95 options) | DYNAMIC | Stored values — e.g. `DR`, `WAY`, `RD`; extraction pass required to confirm all used values |
| Unit # | `Input_515` | text | SKIP | Leave blank unless unit number present |
| Unit/Level | `Input_771` | select | SKIP | Leave blank |
| ZIP Code | `Input_635` | select (dynamic) | DYNAMIC | Populated after County/City — varies by jurisdiction |
| ZIP Code 4 | `Input_39` | text | SKIP | Leave blank |
| State | `Input_40` | text | SKIP | Pre-filled `VA` — never touch |
| New/Resale | `Input_42` | select | DYNAMIC | Varies by listing type. Lennar: always `NVROC` (New, never occupied) |
| Post Office | `Input_41` | select (740 options) | DYNAMIC | Varies by jurisdiction |
| PUD | `Input_43` | select | SKIP | Leave blank unless applicable |
| Subdivision | `Input_259` | select (dynamic) | DYNAMIC | Populated after County/City |
| Neighborhood | `Input_236` | text | DYNAMIC | Use when subdivision option not available in list |
| Year Built | `Input_44` | text | DYNAMIC | From listing source |
| Year Built Description | `Input_45` | select | DYNAMIC | e.g. `EXIST`, `UNDCON`. Lennar: always `UNDCON` (Under Construction) |
| Rooms | `Input_48` | text | DYNAMIC | From listing source |
| Levels | `Input_49` | text | DYNAMIC | From listing source |
| Lot | `Input_622` | text | DYNAMIC | Homesite/lot number from listing source |
| Bedrooms | `Input_47` | text | DYNAMIC | From listing source |
| Elementary School | `Input_51` | select (dynamic) | DYNAMIC | Populated after County/City — varies by jurisdiction |
| Middle School | `Input_53` | select (dynamic) | DYNAMIC | Populated after County/City — varies by jurisdiction |
| High School | `Input_52` | select (dynamic) | DYNAMIC | Populated after County/City — varies by jurisdiction |
| Other School | `Input_54` | text | SKIP | Leave blank |
| Directions | `Input_55` | textarea (215 char) | SKIP | Manual — address-specific, human judgment required |

#### Square Feet Section

| Field | Input ID | Type | Static/Dynamic/Skip | Notes / Builder Use |
|---|---|---|---|---|
| Above Grade Finished Area | `Input_879` | text | DYNAMIC | From listing source |
| Below Grade Finished Area | `Input_882` | text | DYNAMIC | `0` if no basement |
| Above Grade Unfinished Area | `Input_880` | text | DYNAMIC | `0` if none |
| Below Grade Unfinished Area | `Input_883` | text | DYNAMIC | `0` if none |
| Total Finished Area | *(none)* | display only | SKIP | Calculated — no input ID |
| SqFt Total [Public Rec] | *(none)* | display only | SKIP | Calculated — no input ID |
| Total Unfinished Area | *(none)* | display only | SKIP | Calculated — no input ID |
| SqFt Source | `Input_97` | select | DYNAMIC | e.g. `04` (Per Builder), `01` (Per Owner). Lennar: always `04` |
| Fin SqFt Source Desc | `Input_98` | text | SKIP | Leave blank |

#### Listing Info — Bookmarklet Sequencing

Must execute in this order due to dynamic dropdown dependencies:

1. Set `Input_29` (County/City) → fire `change` event → await DOM repopulation (~1500ms)
2. Set `Input_30` (Area) → fire `change` event → await DOM repopulation (~800ms)
3. Set `Input_635` (ZIP Code)
4. Set `Input_259` (Subdivision)
5. Set `Input_51`, `Input_53`, `Input_52` (Elementary, Middle, High School)
6. Set all remaining fields (order does not matter)

#### Listing Info — Open Questions

- [ ] Confirm `change` event alone triggers cascade or whether Matrix requires additional events (`input`, `blur`)
- [ ] Street Suffix (`Input_37`) stored values — extraction pass required for all suffixes in use
- [ ] County/City, Area, ZIP, Post Office, Subdivision, school stored values — confirm per jurisdiction via live extraction session

---

### Room Info — ✅ Field Map Complete (June 21, 2026)

**Subform structure:** All room fields live inside `<table id="_Input_144_table">`. Each room row uses the ID pattern `_Input_144__REPEAT{N}_{fieldNum}` where `N` is the zero-based row index (0, 1, 2…) and field numbers are fixed constants across all rows.

**REPEAT19** is a hidden template row used as a clone source by `showAnotherRow()`. Never write to it.

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
| Room Description | `143` | `_Input_144__REPEAT{N}_143` | text (50 char max) | DYNAMIC | 50 char hard limit — abbreviations common |

**Hidden infrastructure fields — do not write to them:**

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

**Room order best practice:** Level 1 first, ascending by level, Basement last. Within each level, walk-through order — entry → living spaces → kitchen → bedrooms. Guideline only; not enforced by bookmarklet.

---

### Agent/Office Info — ✅ Field Map Complete (June 21, 2026)

| Field | Input ID | Type | Static/Dynamic/Skip | Notes / Builder Use |
|---|---|---|---|---|
| List Agent Code | `Input_159` | text | SKIP | Pre-filled — never touch |
| Co-List Agent Code | `Input_170` | text | STATIC | blank — always |
| Type | `Input_163` | select | DYNAMIC | Standard: `ER` (Exclusive Right). Lennar: `MO` (MLS Only) |
| Limited Rep | `Input_164` | select | DYNAMIC | Standard: `0` (No). Lennar: `1` (Yes) |
| Listing Override (Office Email) | `Input_853` | text | SKIP | Leave blank |

---

### General Info — ✅ Field Map Complete (June 21, 2026)

**Tax ID path notes:**
- Tax Year, Annual Taxes, Assd Land, and Acres pre-populate from tax record — skip those four on Tax ID path
- Assd Improvement does NOT pre-populate on Tax ID path — write value on both paths
- Legal Description pre-populates on Tax ID path — skip on Tax ID path; write on New path
- Acres: on Tax ID path, verify pre-populated value against listing data — new construction lot sizes may not yet match tax record

| Field | Input ID | Type | New Path | Tax ID Path | Notes / Builder Use |
|---|---|---|---|---|---|
| Waterfront | `Input_94` | select | DYNAMIC | DYNAMIC | `N` or `Y`. Lennar: always `N` |
| Investor Rental Cap | `Input_697` | select | DYNAMIC | DYNAMIC | Non-Lennar use |
| Water Depth | `Input_700` | select | DYNAMIC | DYNAMIC | Non-Lennar use |
| Model Available | `Input_249` | select | DYNAMIC | DYNAMIC | `0` or `1`. Lennar: always `0` |
| Model Furnished | `Input_250` | select | DYNAMIC | DYNAMIC | Non-Lennar use |
| Res Energy Efficient Appraisal | `Input_703` | select | DYNAMIC | DYNAMIC | Non-Lennar use |
| Pre Qual Letter | `Input_702` | select | DYNAMIC | DYNAMIC | Non-Lennar use |
| Acres | `Input_95` | text (9 char) | DYNAMIC | SKIP (pre-populated) | Verify pre-pop against source on taxid path |
| Body of Water | `Input_696` | text (48 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Lot Dimensions | `Input_96` | text (25 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Tax Year | `Input_246` | text (10 char) | DYNAMIC | SKIP (pre-populated) | Lennar new path: write `0` |
| Annual Taxes | `Input_105` | text (14 char) | DYNAMIC | SKIP (pre-populated) | Lennar new path: write `0` |
| Assd Land | `Input_247` | text (10 char) | DYNAMIC | SKIP (pre-populated) | Lennar new path: write `0` |
| Assd Improvement | `Input_248` | text (10 char) | DYNAMIC | DYNAMIC | Does NOT pre-populate on taxid path — write on both paths. Lennar: always `0` (gated by `isLennar` flag) |
| Home Warranty | `Input_106` | text (10 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Current Zoning | `Input_253` | text (64 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Road Frontage | `Input_251` | text (10 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Water Frontage | `Input_252` | text (10 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Home Energy Score | `Input_704` | text (2 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Home Energy Rating System | `Input_273` | text (10 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Does Not Convey | `Input_93` | text (128 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Does Convey | `Input_863` | text (128 char) | DYNAMIC | DYNAMIC | Non-Lennar use |
| Minimum Deposit | `Input_701` | text | DYNAMIC | DYNAMIC | Non-Lennar use |
| Legal Description | `Input_100` | textarea | DYNAMIC | SKIP (pre-populated) | Lennar new path: write `TBD` |
| Lot Desc | `Input_101_*` | checkbox (46 options) | DYNAMIC | DYNAMIC | Non-Lennar use — see full list below |
| Disclosures | `Input_102_*` | checkbox (12 options) | DYNAMIC | DYNAMIC | Lennar: always `Input_102_NOTREQ` checked |
| Lead Disclosure | `Input_103_*` | checkbox (5 options) | DYNAMIC | DYNAMIC | Lennar: always `Input_103_NOTREQ` checked |

**DV shadow pairs on this tab:**
- `DV_94` → paired with `Input_94` (Waterfront)
- `DV_700` → paired with `Input_700` (Water Depth)
- `DV_101` → paired with `Input_101_*` (Lot Desc)
- `DV_102` → paired with `Input_102_*` (Disclosures)
- `DV_103` → paired with `Input_103_*` (Lead Disclosure)

**Lot Desc — full semantic list (46 options):**

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

---

### Showing Instructions — ✅ Field Map Complete (June 21, 2026)

| Field | Input ID | Type | Static/Dynamic/Skip | Notes / Builder Use |
|---|---|---|---|---|
| Accompany Show | `Input_722_AS` | checkbox | DYNAMIC | Lennar: always unchecked |
| Appt Required | `Input_722_AR` | checkbox | DYNAMIC | Lennar: always checked |
| Showing Instr 2 | `Input_136` | select (15 options) | DYNAMIC | Lennar: always `NLCS` (No LB Call Showing Service) |
| LockBox Type | `Input_333` | select | DYNAMIC | Lennar: always blank (no lockbox) |
| Supra Serial LB # | `Input_137` | text (8 char) | SKIP | Non-Lennar use |
| Sentrilock Serial LB # | `Input_732` | text (8 char) | DYNAMIC | Non-Lennar: 7-digit number — zero-pad to 8 chars. Lennar: skip |
| Additional Showing Instructions | `Input_138` | textarea (750 char) | DYNAMIC | Verbatim from listing source |

**Sentrilock serial number quirk:** Sentrilock numbers are 7 digits but Matrix requires 8 characters. Bookmarklet must zero-pad automatically: e.g. `1404928` → `01404928`.

---

### Virtual Tour Info — ✅ Field Map Complete (June 21, 2026)

| Field | Input ID | Type | Static/Dynamic/Skip | Notes |
|---|---|---|---|---|
| Virtual Tour | `Input_610` | text (255 char) | DYNAMIC | URL from listing source — skip tab if no link provided |
| Additional Virtual Tour | `Input_611` | text (255 char) | DYNAMIC | blank unless second link provided |

---

### Internet Display Info — ✅ Field Map Complete (June 21, 2026)

Fully static — all four fields always Yes. No payload read needed.

| Field | Input ID | Type | Static/Dynamic/Skip | Value |
|---|---|---|---|---|
| Internet Display | `Input_227` | select | STATIC | `1` (Yes) |
| Address Display | `Input_228` | select | STATIC | `1` (Yes) |
| Comments/Reviews | `Input_229` | select | STATIC | `1` (Yes) |
| AVM | `Input_230` | select | STATIC | `1` (Yes) |

---

### Owner Info — ✅ Field Map Complete (June 21, 2026)

**Tax ID path note:** `Input_118` (Owner Name) will be pre-filled with tax record data on the Tax ID entry path. Some builder implementations force-overwrite this field regardless — see builder customization doc.

| Field | Input ID | Type | Static/Dynamic/Skip | Notes / Builder Use |
|---|---|---|---|---|
| Owner Name | `Input_118` | text | DYNAMIC | From listing source. Lennar: always `Lennar` — force-overwrite even if pre-filled on taxid path |
| Owner Phone | `Input_122` | text | DYNAMIC | Seller phone if available. Lennar: blank |
| Owner Name 2 | `Input_857` | text | DYNAMIC | Second seller if applicable. Lennar: blank |
| Occupant Name | `Input_119` | text | DYNAMIC | Seller/Tenant name if occupied. Lennar: `None` |
| Occupant Phone | `Input_123` | text | DYNAMIC | Occupant phone if applicable. Lennar: blank |
| Occupied By | `Input_606` | select | DYNAMIC | Varies. Lennar: `V` (Vacant) |
| Owner Agent | `Input_124` | select | DYNAMIC | Varies. Lennar: `0` (No) |
| Agent Related to Seller | `Input_707` | select | DYNAMIC | Required field — Matrix flags if blank. Lennar: `0` (No) |
| Owned By | checkbox group | checkbox | DYNAMIC | See value list below. Lennar: `02` (Corporate) |
| Possession | checkbox group | checkbox | DYNAMIC | See value list below. Lennar: `01` (At Closing) |

**Owned By checkbox group:**

| Element ID | Value | Display Label |
|---|---|---|
| `Input_120_02` | `02` | Corporate |
| `Input_120_03` | `03` | Estate |
| `Input_120_04` | `04` | Individuals |
| `Input_120_06` | `06` | Other |
| `Input_120_07` | `07` | Partnership |
| `Input_120_08` | `08` | Relocation |
| `Input_120_01` | `01` | REO |

**Possession checkbox group:**

| Element ID | Value | Display Label |
|---|---|---|
| `Input_121_01` | `01` | At Closing |
| `Input_121_02` | `02` | Immediate |
| `Input_121_06` | `06` | Leasehold Rights |
| `Input_121_03` | `03` | Negotiable |
| `Input_121_04` | `04` | Other |
| `Input_121_05` | `05` | Tenant Rights |

---

### Remarks — ✅ Field Map Complete (June 21, 2026)

Character limits are enforced client-side via companion `Input_[N]_chars` counter labels — neither textarea has a `maxlength` HTML attribute.

| Field | Input ID | Type | Char Limit | Static/Dynamic/Skip | Notes |
|---|---|---|---|---|---|
| Remarks | `Input_107` | textarea | 2048 | DYNAMIC | Public-facing remarks |
| Agent Only Comments | `Input_108` | textarea | 1000 | DYNAMIC | Internal agent notes |
| Copyright Agreement | `Input_662` | select | — | STATIC → `1` (Yes) | Always Yes — hardcoded; Matrix flags if blank |

**Copyright Agreement options:** `""` (blank, default), `1` (Yes), `0` (No). Bookmarklet always sets `1`.

---

### Fee Info — ✅ Field Map Complete (June 21, 2026)

**Note on Fee Includes:** The full semantic label list is preserved here for reference — use display labels to identify which checkboxes to include when building a non-builder payload.

**Note on Capital Contribution:** Initial Working Capital Contribution or Capital Contribution Fee goes into `Input_117` (Add'l Fee Dsc) as a text string — e.g. `Initial Working Capital Contribution: $350`.

| Field | Input ID | Type | Static/Dynamic/Skip | Notes / Builder Use |
|---|---|---|---|---|
| HOA/Condo | `Input_109` | select | DYNAMIC | `1` (Yes) or `0` (No). Lennar: always `1` |
| Add'l HOA Y/N | `Input_719` | select | DYNAMIC | `1` (Yes) or `0` (No) — varies by community |
| Membership Reqd | `Input_112` | select | DYNAMIC | Lennar: always `1` (Yes) |
| Fee $ | `Input_110` | text | DYNAMIC | From community data |
| Fee Period | `Input_113` | select | DYNAMIC | `MO`, `QU`, or `YR` |
| Management Firm | `Input_705` | text | DYNAMIC | blank if none |
| Management Phone | `Input_706` | text | SKIP | Leave blank |
| Fee Desc | checkbox group | checkbox | DYNAMIC | See value list below. Lennar: always `Input_111_01` (Community Association) |
| Fee Includes | checkbox group | checkbox | DYNAMIC | See full list below — varies by community |
| Allow Onsite | checkbox group | checkbox | DYNAMIC | See value list below. Lennar: all unchecked |
| Add'l Fee $ | `Input_115` | text | DYNAMIC | Additional fee if applicable |
| Add'l Fee Dsc | `Input_117` | text | DYNAMIC | Capital Contribution info — e.g. `Initial Working Capital Contribution: $350` |
| HOA Website | `Input_860` | text | SKIP | Leave blank |

**Fee Desc checkbox group:**

| Element ID | Value | Display Label |
|---|---|---|
| `Input_111_01` | `01` | Community Association |
| `Input_111_02` | `02` | Condo Association |
| `Input_111_03` | `03` | Cooperative |
| `Input_111_04` | `04` | Owners Association |
| `Input_111_05` | `05` | Road Maintenance |

**Fee Includes checkbox group — full semantic list:**

| Element ID | Value | Display Label |
|---|---|---|
| `Input_576_26` | `26` | Building Insurance |
| `Input_576_19` | `19` | Clubhouse |
| `Input_576_01` | `01` | Comm Ar Mnt |
| `Input_576_25` | `25` | Common Area |
| `Input_576_18` | `18` | Community Utilities |
| `Input_576_03` | `03` | Exterior Maintenance |
| `Input_576_04` | `04` | Gas |
| `Input_576_05` | `05` | Heat |
| `Input_576_06` | `06` | Hot Water |
| `Input_576_07` | `07` | Insurance |
| `Input_576_08` | `08` | Janitorial |
| `Input_576_27` | `27` | Limited Exterior Maintenance |
| `Input_576_28` | `28` | Limited Yard Maintenance |
| `Input_576_09` | `09` | Management Fees |
| `Input_576_10` | `10` | Pool |
| `Input_576_11` | `11` | Recreational Facilities |
| `Input_576_29` | `29` | Recycling |
| `Input_576_12` | `12` | Reserves |
| `Input_576_22` | `22` | Road Maintenance |
| `Input_576_20` | `20` | Security |
| `Input_576_13` | `13` | Sewer |
| `Input_576_14` | `14` | Snow Removal |
| `Input_576_15` | `15` | Trash Removal |
| `Input_576_23` | `23` | Water |
| `Input_576_21` | `21` | Water Access |
| `Input_576_17` | `17` | Yard Maintenance |

**Allow Onsite checkbox group:**

| Element ID | Value | Display Label |
|---|---|---|
| `Input_116_1` | `1` | Boats |
| `Input_116_4` | `4` | Pets |
| `Input_116_5` | `5` | Pets w/ Restriction |
| `Input_116_6` | `6` | Recreational Vehicles |
| `Input_116_7` | `7` | Rentals |
| `Input_116_8` | `8` | Trucks/Trailer |

---

## Tab Inventory

| Tab | Automate | Field Map | Bookmarklet | Notes |
|---|---|---|---|---|
| Status | ❌ Never | — | — | Controls MLS activation — manual only. Hard rule |
| Listing Info | ✅ | ✅ Complete | ✅ Complete | Dynamic cascade; stored values confirmed per community |
| Room Info | ✅ | ✅ Complete | ⬜ Pending | Subform repeating structure — REPEAT{N} index. Builder note: Lennar skips this tab |
| Bath Info | ✅ | ✅ Complete | ✅ Complete | POC tab — proven June 20, 2026 |
| Features | ✅ | ✅ Complete | ✅ Complete | See `CVRMLS_Features_Bookmarklet_Source.md` (AAR-TC-CVRMLS-BM-SRC-001-FEA) |
| General Info | ✅ | ✅ Complete | ✅ Complete | Path-dependent behavior — see field map above |
| Remarks | ✅ | ✅ Complete | ✅ Complete | 3 fields — Remarks (2048), Agent Comments (1000), Copyright (always Yes) |
| Fee Info | ✅ | ✅ Complete | ✅ Complete | Community-variable HOA data |
| Owner Info | ✅ | ✅ Complete | ✅ Complete | Lennar: fully static |
| Agent/Office Info | ✅ | ✅ Complete | ✅ Complete | Lennar: fully static |
| Showing Instructions | ✅ | ✅ Complete | ✅ Complete | Lennar: static except Additional Instructions |
| Virtual Tour Info | ✅ | ✅ Complete | ✅ Complete | 2 text fields — skip tab if no URL |
| Internet Display Info | ✅ | ✅ Complete | ✅ Complete | Fully static — all 4 fields always Yes |

---

## Build Roadmap

### Phase 1 — Field Mapping (Claude in Chrome)
Use the Claude in Chrome extension to extract field IDs from each tab. Navigate to the tab, ask the extension to list all `input`, `select`, and `textarea` element IDs and types. Document results in the Field Maps section above.

Do one tab per session to avoid burning excessive tokens. Features is the most complex — break it into sections.

**Standing rule:** Always capture full semantic label lists during extraction regardless of whether a builder uses them — non-builder use and future builders will need them.

### Phase 2 — Bookmarklet Build (Cursor or Claude)
Once field maps are complete:
- Define the complete payload JSON schema
- Build the clipboard-reader bookmarklet for each tab (universal variant)
- Derive builder-specific variant from universal — document overrides in builder customization file
- Generate HTML launcher files for each bookmarklet

### Phase 3 — Session Integration
Update the session protocol so payload generation is a standard output step:
- Session parses listing source → generates data sheet → generates MLS payload JSON
- Payload output is formatted as a copy-ready block
- Session notes which fields need manual attention

### Phase 4 — Chrome Extension (Future)
Once bookmarklets are proven across all tabs, build a custom Chrome extension:
- Single toolbar button replaces 12+ bookmarks
- Auto-detects current Matrix tab via URL or DOM signature
- Payload pasted into extension popup — no clipboard management needed
- Supports multiple MLS systems via `payload.mls` header key
- Supports builder customization layers via `payload.builder` header key
- Built in Cursor; installed via `chrome://extensions` developer mode

---

## HTML Launcher Files

Bookmarklet installation in Chrome requires dragging from an HTML anchor element — pasting `javascript:` URLs directly into bookmark fields is blocked by Chrome security.

**For each bookmarklet, generate an HTML launcher file** containing:
- The bookmarklet as an `href` on a styled anchor element
- Drag instruction: make bookmarks bar visible (Cmd+Shift+B), drag the button to the bar
- The JSON payload schema for that tab as a copy-ready reference block

The Bath Info launcher serves as the canonical template for all future launchers.

---

## Open Questions

- [ ] Confirm `change` event alone triggers Matrix cascade dropdowns — or whether additional events (`input`, `blur`) are needed
- [ ] Confirm text fields do not require `change` events — Bath Info confirmed; verify holds across all tabs
- [ ] Room Info — confirm REPEAT0 requires `showAnotherRow()` or is reliably present on page load
- [ ] Street Suffix (`Input_37`) stored values — extraction pass required for all suffixes in use

---

*CVRMLS Matrix bookmarklet build reference — universal field maps and architecture.*
*Builder-specific build notes live in the builder's docs folder. See `docs/lennar/Lennar_Bookmarklet_Build_Notes.md` for Lennar.*
*Source JS lives in `docs/cvrmls/CVRMLS_Bookmarklet_Source.md` (AAR-TC-CVRMLS-BM-SRC-001).*

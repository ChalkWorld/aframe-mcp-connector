# Lennar MLS Bookmarklet Build
**Document ID:** AAR-TC-LENNAR-BM-001
**Version:** 1.2 | *Last Updated: June 21, 2026*
*Living document — update as field mapping and build work progresses*

---

## What This Is

A bookmarklet-based system for automating MLS data entry in CVRMLS Matrix. Instead of manually reading each field and clicking each checkbox, a Claude session parses the listing email and outputs a JSON payload. You copy the payload, navigate to Matrix, and click a bookmark on each tab — fields populate instantly.

The goal is to eliminate the cognitive load of careful field-by-field reading during Matrix input. The clicking stays manual; the thinking is removed entirely.

---

## Architecture Decisions

**One bookmarklet per tab** — CVRMLS Matrix uses ASP.NET server-side tab rendering. Each tab is a separate page load; the other tabs' fields do not exist in the DOM until navigated to. A single fire-and-done bookmarklet is not possible. One bookmarklet per tab is the correct approach.

**Clipboard reader** — The bookmarklet reads a JSON payload from the clipboard rather than having listing data hardcoded in. This means the bookmarklet itself is permanent and never changes — only the clipboard payload changes listing to listing. The session generates the full payload; you copy it once and use it across all tabs.

**Static vs dynamic fields** — Many fields are identical across every Lennar listing (Structure = Frame, Siding = Vinyl, Roof = Dimensional, etc.). These are hardcoded into the bookmarklet as constants and fire automatically without needing to be in the clipboard payload. Only fields that vary listing to listing are pulled from the clipboard. This keeps the payload lean and the session output clean.

**Status tab — never automated** — The Status tab controls MLS activation (Coming Soon, Active, etc.). This tab is never touched by the bookmarklet system. Andrew controls activation manually. Hard rule.

**Bookmarklet installation method** — Chrome blocks pasting `javascript:` URLs directly into bookmark fields. The correct installation method is a local HTML launcher file with the bookmarklet as an `href` on an anchor element. Dragging that anchor to the bookmarks bar installs it without triggering Chrome's security restriction. A launcher file should be generated for each new bookmarklet.

**Three entry paths — three bookmarklet folders** — Prior to the tabbed input view, Matrix offers three listing creation paths. Each path pre-populates a different set of fields, so the bookmarklet behavior differs by path. Three Chrome bookmark folders are used:
- `Matrix — New` — clean slate; bookmarklet fills all fields
- `Matrix — Tax ID` — location fields pre-populated from tax record; bookmarklet skips those, fills the rest
- `Matrix — Copy` — most fields pre-populated from an existing listing; bookmarklet fills listing-specific fields only (price, address, sq ft, bed/bath, remarks)

The session generates one payload per listing. The correct folder is selected based on which entry path was used. The `Matrix — Copy` path is the preferred long-term approach for Lennar once a clean template listing exists per community — the bookmarklet becomes a very light touch at that point.

**Dynamic dropdown sequencing** — Several fields on the Listing Info tab are dynamically populated based on upstream selections. County/City must be set and a `change` event fired before Area, ZIP Code, Subdivision, and the school dropdowns will populate. The Listing Info bookmarklet handles this with async sequencing: set County/City → fire `change` → await DOM repopulation → set Area → fire `change` → await → then set Subdivision and schools. This confirms that Matrix requires `change` events to be fired on dropdowns, not just value setting.

**Map fields — always manual** — Latitude, Longitude, and Directions are never touched by the bookmarklet. Map verification requires human judgment, especially for new construction addresses. The Directions field has a 215-character limit and is address-specific.

**Custom Chrome extension — future state** — A custom Chrome extension is a cleaner long-term solution. It could detect the current Matrix tab automatically, hold the payload internally (no clipboard needed), and provide a single toolbar button. No App Store approval required — extensions load via `chrome://extensions` in developer mode. This is a Cursor project and the right target state once the field mapping is complete and the workflow is proven.

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

**Bath Info field map:**

| Field | Input ID | Type | Notes |
|---|---|---|---|
| Basement — Bath Description | `Input_57` | select | Values: blank, `S`, `T`, `TS` |
| Basement — Full Baths | `Input_61` | text | |
| Basement — Half Baths | `Input_65` | text | |
| Level 1 — Bath Description | `Input_58` | select | Values: blank, `S`, `T`, `TS` |
| Level 1 — Full Baths | `Input_62` | text | |
| Level 1 — Half Baths | `Input_66` | text | |
| Level 2 — Bath Description | `Input_59` | select | Values: blank, `S`, `T`, `TS` |
| Level 2 — Full Baths | `Input_63` | text | |
| Level 2 — Half Baths | `Input_67` | text | |
| Level 3 — Bath Description | `Input_60` | select | Values: blank, `S`, `T`, `TS` |
| Level 3 — Full Baths | `Input_64` | text | |
| Level 3 — Half Baths | `Input_68` | text | |
| Level 4 — Bath Description | `Input_737` | select | Values: blank, `S`, `T`, `TS` |
| Level 4 — Full Baths | `Input_738` | text | |
| Level 4 — Half Baths | `Input_739` | text | |

**Bath Info rules:**
- Bath Description dropdown only needs a value when Full Baths > 0 — leave blank for half-bath-only levels
- All numeric fields require explicit `0` — Matrix flags empty fields on save
- Typical Lennar TH: Level 1 = 0 full / 1 half, Level 2 = 2 full / 0 half (TS), others = 0/0
- Typical Lennar SF: Level 1 = 0 full / 1 half, Level 2 = 2 full / 0 half (TS), others = 0/0 (varies)

---

## Field Maps

---

### Bath Info — ✅ Complete (POC — June 20, 2026)

| Field | Input ID | Type | Notes |
|---|---|---|---|
| Basement — Bath Description | `Input_57` | select | Values: blank, `S`, `T`, `TS` |
| Basement — Full Baths | `Input_61` | text | |
| Basement — Half Baths | `Input_65` | text | |
| Level 1 — Bath Description | `Input_58` | select | Values: blank, `S`, `T`, `TS` |
| Level 1 — Full Baths | `Input_62` | text | |
| Level 1 — Half Baths | `Input_66` | text | |
| Level 2 — Bath Description | `Input_59` | select | Values: blank, `S`, `T`, `TS` |
| Level 2 — Full Baths | `Input_63` | text | |
| Level 2 — Half Baths | `Input_67` | text | |
| Level 3 — Bath Description | `Input_60` | select | Values: blank, `S`, `T`, `TS` |
| Level 3 — Full Baths | `Input_64` | text | |
| Level 3 — Half Baths | `Input_68` | text | |
| Level 4 — Bath Description | `Input_737` | select | Values: blank, `S`, `T`, `TS` |
| Level 4 — Full Baths | `Input_738` | text | |
| Level 4 — Half Baths | `Input_739` | text | |

**Bath Info rules:**
- Bath Description dropdown only needs a value when Full Baths > 0 — leave blank for half-bath-only levels
- All numeric fields require explicit `0` — Matrix flags empty fields on save
- Typical Lennar TH: Level 1 = 0 full / 1 half, Level 2 = 2 full / 0 half (TS), others = 0/0
- Typical Lennar SF: Level 1 = 0 full / 1 half, Level 2 = 2 full / 0 half (TS), others = 0/0 (varies)

---

### Listing Info — ✅ Field Map Complete (June 21, 2026)

43 fields total. Fields marked **STATIC** are hardcoded Lennar constants. Fields marked **DYNAMIC** vary per listing and come from the clipboard. Fields marked **SKIP** are never written by the bookmarklet.

#### Listing Information Section

| Field | Input ID | Type | Static/Dynamic/Skip | Lennar Value / Notes |
|---|---|---|---|---|
| County/City | `Input_29` | select (186 options) | DYNAMIC | Varies by community — set first; triggers downstream cascade |
| Delayed Show | `Input_32` | select | STATIC | `0` (No) — always |
| List Price | `Input_31` | text | DYNAMIC | From email |
| List Date | `Input_160` | text (date picker) | DYNAMIC | Today's date — always; never email date |
| Type | `Input_849` | select | DYNAMIC | `SFR` = Single Family / `TOWN` = Townhouse |
| Attached YN | `Input_850` | select | DYNAMIC | Derived from Type — `1` (Yes) for TH / `0` (No) for SF |
| No Show Until | `Input_33` | text (date picker) | SKIP | Leave blank |
| Expected OnMkt Dte | `Input_782` | text (date picker) | SKIP | Leave blank |
| PID | `Input_99` | text | DYNAMIC | Tax ID if available / `Pending Assignment` if not |
| Area | `Input_30` | select (dynamic) | DYNAMIC | Populated after County/City — varies by community |
| Expire Date | `Input_162` | text (date picker) | STATIC | `12/31/2026` — current Master Listing Agreement expiry; update when agreement renews |
| 1st Rt of Refusal | `Input_781` | select | STATIC | blank — always |

#### Location Information Section

| Field | Input ID | Type | Static/Dynamic/Skip | Lennar Value / Notes |
|---|---|---|---|---|
| Street # | `Input_34` | text | DYNAMIC | From email |
| Street Direction | `Input_35` | select (9 options) | DYNAMIC | From address — most Lennar addresses blank |
| Street Name | `Input_36` | text | DYNAMIC | From email |
| Street Suffix | `Input_37` | select (95 options) | DYNAMIC | From address — e.g. `DR`, `WAY`, `RD` |
| Unit # | `Input_515` | text | SKIP | Lennar listings do not use unit numbers |
| Unit/Level | `Input_771` | select | SKIP | Leave blank |
| ZIP Code | `Input_635` | select (dynamic) | DYNAMIC | Populated after County/City — varies by community |
| ZIP Code 4 | `Input_39` | text | SKIP | Leave blank |
| State | `Input_40` | text | SKIP | Pre-filled `VA` — never touch |
| New/Resale | `Input_42` | select | STATIC | `NVROC` (New, never occupied) — always |
| Post Office | `Input_41` | select (740 options) | DYNAMIC | Varies by community |
| PUD | `Input_43` | select | SKIP | Leave blank — Lennar communities are not PUDs |
| Subdivision | `Input_259` | select (dynamic) | DYNAMIC | Populated after County/City — Everstone exception: use `None` (see Neighborhood) |
| Neighborhood | `Input_236` | text | DYNAMIC | Blank for all communities except Everstone — use `Everstone` here since it does not appear in Subdivision list |
| Year Built | `Input_44` | text | DYNAMIC | From email (typically current year) |
| Year Built Description | `Input_45` | select | STATIC | `UNDCON` (Under Construction) — always |
| Rooms | `Input_48` | text | DYNAMIC | From email |
| Levels | `Input_49` | text | DYNAMIC | From email |
| Lot | `Input_622` | text | DYNAMIC | From email (homesite/lot number) |
| Bedrooms | `Input_47` | text | DYNAMIC | From email |
| Elementary School | `Input_51` | select (dynamic) | DYNAMIC | Populated after County/City — varies by community |
| Middle School | `Input_53` | select (dynamic) | DYNAMIC | Populated after County/City — varies by community |
| High School | `Input_52` | select (dynamic) | DYNAMIC | Populated after County/City — varies by community |
| Other School | `Input_54` | text | SKIP | Leave blank |
| Directions | `Input_55` | textarea (215 char) | SKIP | Manual — address-specific, human judgment required |

#### Square Feet Section

| Field | Input ID | Type | Static/Dynamic/Skip | Lennar Value / Notes |
|---|---|---|---|---|
| Above Grade Finished Area | `Input_879` | text | DYNAMIC | From email |
| Below Grade Finished Area | `Input_882` | text | DYNAMIC | From email (0 if no basement) |
| Above Grade Unfinished Area | `Input_880` | text | DYNAMIC | From email (0 if none) |
| Below Grade Unfinished Area | `Input_883` | text | DYNAMIC | From email (0 if none) |
| Total Finished Area | *(none)* | display only | SKIP | Calculated — no input ID |
| SqFt Total [Public Rec] | *(none)* | display only | SKIP | Calculated — no input ID |
| Total Unfinished Area | *(none)* | display only | SKIP | Calculated — no input ID |
| SqFt Source | `Input_97` | select | STATIC | `04` (Per Builder) — always for Lennar |
| Fin SqFt Source Desc | `Input_98` | text | SKIP | Leave blank |

#### Listing Info — Bookmarklet Sequencing

Must execute in this order due to dynamic dropdown dependencies:

1. Set `Input_29` (County/City) → fire `change` event → await DOM repopulation
2. Set `Input_30` (Area) → fire `change` event → await DOM repopulation
3. Set `Input_635` (ZIP Code)
4. Set `Input_259` (Subdivision)
5. Set `Input_51`, `Input_53`, `Input_52` (Elementary, Middle, High School)
6. Set all remaining fields (order does not matter)

#### Listing Info — Open Questions

- [ ] Confirm exact `Input_29` County/City stored option values for each Lennar community (display label may differ from stored value)
- [ ] Confirm Area, ZIP, Subdivision, and school option values per community — requires second extraction pass with County/City pre-selected in a live Matrix session
- [ ] Confirm whether `change` event alone triggers cascade or whether Matrix requires additional events (`input`, `blur`)
- [ ] Confirm Post Office (`Input_41`) stored values for each community
- [ ] Confirm Street Suffix (`Input_37`) stored values for Lennar street types (DR, WAY, RD, TER, LOOP, etc.)

#### Listing Info — Community Dropdown Values (Pending Confirmation)

| Community | County/City | Area | ZIP | Subdivision | Elementary | Middle | High |
|---|---|---|---|---|---|---|---|
| Harpers Mill TH | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* |
| Harpers Mill SF | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* |
| Creekside Run TH | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* |
| Everstone SF | *(confirm)* | *(confirm)* | *(confirm)* | `None` + Neighborhood: `Everstone` | *(confirm)* | *(confirm)* | *(confirm)* |
| Watermark SF | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* | *(confirm)* |
| Wynwood at Fox Creek SF | *(pending)* | *(pending)* | *(pending)* | *(pending)* | *(pending)* | *(pending)* | *(pending)* |

---

### Agent/Office Info — ✅ Field Map Complete (June 21, 2026)

Fully static for Lennar — no clipboard payload needed.

| Field | Input ID | Type | Static/Dynamic/Skip | Lennar Value | Non-Lennar Value |
|---|---|---|---|---|---|
| List Agent Code | `Input_159` | text | SKIP | Pre-filled — never touch | Pre-filled — never touch |
| Co-List Agent Code | `Input_170` | text | STATIC | blank | blank |
| Type | `Input_163` | select | STATIC | `MO` (MLS Only) | `ER` (Exclusive Right) |
| Limited Rep | `Input_164` | select | STATIC | `1` (Yes) | `0` (No) |
| Listing Override (Office Email) | `Input_853` | text | SKIP | Leave blank | Leave blank |

---

### Showing Instructions — ✅ Field Map Complete (June 21, 2026)

| Field | Input ID | Type | Static/Dynamic/Skip | Lennar Value / Notes |
|---|---|---|---|---|
| Accompany Show | `Input_722_AS` | checkbox | STATIC | Unchecked — always |
| Appt Required | `Input_722_AR` | checkbox | STATIC | Checked — always |
| Showing Instr 2 | `Input_136` | select (15 options) | STATIC | `NLCS` (No LB Call Showing Service) — always |
| LockBox Type | `Input_333` | select | STATIC | blank — no LB selection made so Matrix does not flag |
| Supra Serial LB # | `Input_137` | text (8 char) | SKIP | Not applicable for Lennar |
| Sentrilock Serial LB # | `Input_732` | text (8 char) | SKIP | Not applicable for Lennar |
| Additional Showing Instructions | `Input_138` | textarea (750 char) | DYNAMIC | Verbatim from email |

**Non-Lennar quirk — Sentrilock serial number:** Sentrilock numbers are 7 digits but Matrix requires 8 characters. Prepend a leading `0` before writing to `Input_732`. Example: `1404928` → `01404928`. The bookmarklet should zero-pad this value automatically from the payload.

---

### Virtual Tour Info — ✅ Field Map Complete (June 21, 2026)

| Field | Input ID | Type | Static/Dynamic/Skip | Lennar Value / Notes |
|---|---|---|---|---|
| Virtual Tour | `Input_610` | text (255 char) | DYNAMIC | URL from email — skip tab entirely if no link provided |
| Additional Virtual Tour | `Input_611` | text (255 char) | DYNAMIC | blank — omit unless second link provided |

---

### Internet Display Info — ✅ Field Map Complete (June 21, 2026)

Fully static — no clipboard payload needed. All four fields always Yes.

| Field | Input ID | Type | Static/Dynamic/Skip | Lennar Value |
|---|---|---|---|---|
| Internet Display | `Input_227` | select | STATIC | `1` (Yes) |
| Address Display | `Input_228` | select | STATIC | `1` (Yes) |
| Comments/Reviews | `Input_229` | select | STATIC | `1` (Yes) |
| AVM | `Input_230` | select | STATIC | `1` (Yes) |

---

### Owner Info — ✅ Field Map Complete (June 21, 2026)

Fully static for Lennar — no clipboard payload needed.

**Important — Tax ID path:** `Input_118` (Owner Name) will be pre-filled with tax record data on the Tax ID entry path. The bookmarklet must force-overwrite this field with `Lennar` regardless of what is already there. This is an exception to the general Tax ID path rule of skipping pre-populated fields.

| Field | Input ID | Type | Static/Dynamic/Skip | Lennar Value | Non-Lennar Value |
|---|---|---|---|---|---|
| Owner Name | `Input_118` | text | STATIC | `Lennar` — always; overwrite even if pre-filled | Seller name from contract |
| Owner Phone | `Input_122` | text | SKIP | blank | Seller phone if available |
| Owner Name 2 | `Input_857` | text | SKIP | blank | Second seller if applicable |
| Occupant Name | `Input_119` | text | STATIC | `None` | Seller / Tenant name if occupied |
| Occupant Phone | `Input_123` | text | STATIC | blank | Occupant phone if applicable |
| Occupied By | `Input_606` | select | STATIC | `V` (Vacant) | Varies |
| Owner Agent | `Input_124` | select | STATIC | `0` (No) | Varies |
| Agent Related to Seller | `Input_707` | select | STATIC | `0` (No) — required field; Matrix flags if blank | Varies |
| Possession | checkbox group | checkbox | STATIC | `Input_121_01` (At Closing) checked — all others unchecked | Varies |

**Owned By checkbox group — Lennar always Corporate:**

| Element ID | Value | Display Label | Lennar |
|---|---|---|---|
| `Input_120_02` | `02` | Corporate | ✅ Checked |
| `Input_120_03` | `03` | Estate | ⬜ Unchecked |
| `Input_120_04` | `04` | Individuals | ⬜ Unchecked |
| `Input_120_06` | `06` | Other | ⬜ Unchecked |
| `Input_120_07` | `07` | Partnership | ⬜ Unchecked |
| `Input_120_08` | `08` | Relocation | ⬜ Unchecked |
| `Input_120_01` | `01` | REO | ⬜ Unchecked |

**Possession checkbox group — Lennar always At Closing:**

| Element ID | Value | Display Label | Lennar |
|---|---|---|---|
| `Input_121_01` | `01` | At Closing | ✅ Checked |
| `Input_121_02` | `02` | Immediate | ⬜ Unchecked |
| `Input_121_06` | `06` | Leasehold Rights | ⬜ Unchecked |
| `Input_121_03` | `03` | Negotiable | ⬜ Unchecked |
| `Input_121_04` | `04` | Other | ⬜ Unchecked |
| `Input_121_05` | `05` | Tenant Rights | ⬜ Unchecked |

---

### Fee Info — ✅ Field Map Complete (June 21, 2026)

Most fields are community-variable and driven entirely from the Community Reference Database. The bookmarklet reads the community key from the payload and applies the correct values per community record.

**Note on Fee Includes:** The bookmarklet uses element IDs and value attributes to check the correct boxes. The full semantic label list is preserved in this document for non-Lennar use — when building a non-Lennar payload, reference display labels here to identify which checkboxes to include.

**Note on Capital Contribution:** The Initial Working Capital Contribution or Capital Contribution Fee (varies by community) goes into `Input_117` (Add'l Fee Dsc) as a text string — e.g. `Initial Working Capital Contribution: $350`.

| Field | Input ID | Type | Static/Dynamic/Skip | Lennar Value / Notes |
|---|---|---|---|---|
| HOA/Condo | `Input_109` | select | STATIC | `1` (Yes) — always |
| Add'l HOA Y/N | `Input_719` | select | DYNAMIC | `1` (Yes) for Harpers Mill TH only / `0` (No) for all others |
| Membership Reqd | `Input_112` | select | STATIC | `1` (Yes) — always |
| Fee $ | `Input_110` | text | DYNAMIC | From DB per community |
| Fee Period | `Input_113` | select | DYNAMIC | From DB per community — `MO`, `QU`, or `YR` |
| Management Firm | `Input_705` | text | DYNAMIC | From DB per community — blank if none |
| Management Phone | `Input_706` | text | SKIP | Leave blank |
| Fee Desc | checkbox group | checkbox | STATIC | `Input_111_01` (Community Association) — always for Lennar |
| Fee Includes | checkbox group | checkbox | DYNAMIC | From DB per community — see table below |
| Allow Onsite | checkbox group | checkbox | STATIC | All unchecked — always for Lennar |
| Add'l Fee $ | `Input_115` | text | DYNAMIC | Harpers Mill TH only: `70.00` / blank for all others |
| Add'l Fee Dsc | `Input_117` | text | DYNAMIC | Capital Contribution info from DB per community — e.g. `Initial Working Capital Contribution: $350` |
| HOA Website | `Input_860` | text | SKIP | Leave blank |

**Fee Desc checkbox group — full semantic list:**

| Element ID | Value | Display Label | Lennar |
|---|---|---|---|
| `Input_111_01` | `01` | Community Association | ✅ Always checked |
| `Input_111_02` | `02` | Condo Association | ⬜ Non-Lennar use |
| `Input_111_03` | `03` | Cooperative | ⬜ Non-Lennar use |
| `Input_111_04` | `04` | Owners Association | ⬜ Non-Lennar use |
| `Input_111_05` | `05` | Road Maintenance | ⬜ Non-Lennar use |

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

**Fee Includes per Lennar community — checkboxes to set:**

| Community | Fee Includes values to check |
|---|---|
| Harpers Mill TH | `19` (Clubhouse), `01` (Comm Ar Mnt), `25` (Common Area), `10` (Pool), `14` (Snow Removal), `15` (Trash Removal) |
| Harpers Mill SF | *(confirm exact MLS wording — no SF example sheet yet)* |
| Creekside Run TH | *(blank on MLS sheet — confirm)* |
| Everstone SF | `01` (Comm Ar Mnt), `25` (Common Area) |
| Watermark SF | `19` (Clubhouse), `25` (Common Area), `10` (Pool), `11` (Recreational Facilities) |
| Wynwood at Fox Creek SF | *(pending)* |

**Allow Onsite checkbox group — full semantic list (all unchecked for Lennar):**

| Element ID | Value | Display Label |
|---|---|---|
| `Input_116_1` | `1` | Boats |
| `Input_116_4` | `4` | Pets |
| `Input_116_5` | `5` | Pets w/ Restriction |
| `Input_116_6` | `6` | Recreational Vehicles |
| `Input_116_7` | `7` | Rentals |
| `Input_116_8` | `8` | Trucks/Trailer |

---

## Payload Schema

The session outputs a single JSON object covering all tabs. Each bookmarklet reads only its own key. Static fields are hardcoded in the bookmarklet and never appear in the payload.

```json
{
  "listing": {
    "county_city": "",
    "list_price": "",
    "list_date": "",
    "type": "",
    "attached_yn": "",
    "pid": "",
    "area": "",
    "street_num": "",
    "street_dir": "",
    "street_name": "",
    "street_suffix": "",
    "zip": "",
    "post_office": "",
    "subdivision": "",
    "neighborhood": "",
    "year_built": "",
    "rooms": "",
    "levels": "",
    "lot": "",
    "bedrooms": "",
    "elementary": "",
    "middle": "",
    "high": "",
    "sqft_above_finished": "",
    "sqft_below_finished": "",
    "sqft_above_unfinished": "",
    "sqft_below_unfinished": ""
  },
  "room": { ... },
  "bath": {
    "basement": { "desc": "", "full": "0", "half": "0" },
    "level1":   { "desc": "", "full": "0", "half": "1" },
    "level2":   { "desc": "TS", "full": "2", "half": "0" },
    "level3":   { "desc": "", "full": "0", "half": "0" },
    "level4":   { "desc": "", "full": "0", "half": "0" }
  },
  "features": { ... },
  "general": { ... },
  "remarks": { ... },
  "fee": { ... },
  "owner": { },
  "fee": {
    "addl_hoa": "",
    "fee_amount": "",
    "fee_period": "",
    "management_firm": "",
    "fee_includes": [],
    "addl_fee_amount": "",
    "addl_fee_desc": ""
  },
  "showing": {
    "additional_instructions": ""
  },
  "tour": {
    "virtual_tour": "",
    "additional_virtual_tour": ""
  },
  "internet": { }
}
```

Schema for pending tab sections to be filled in as field mapping is completed.

---

## Tab Inventory

| Tab | Automate | Field Map | Bookmarklet | Notes |
|---|---|---|---|---|
| Status | ❌ Never | — | — | Controls MLS activation — Andrew only |
| Listing Info | ✅ | ✅ Complete | ⬜ Pending | Dynamic cascade; second extraction pass needed for dependent dropdown values |
| Room Info | ✅ | ⬜ Pending | ⬜ Pending | |
| Bath Info | ✅ | ✅ Complete | ✅ Complete | POC tab — proven June 20, 2026 |
| Features | ✅ | ⬜ Pending | ⬜ Pending | 40+ fields; most are Lennar constants — static layer + small dynamic layer |
| General Info | ✅ | ⬜ Pending | ⬜ Pending | |
| Remarks | ✅ | ⬜ Pending | ⬜ Pending | Public remarks + agent comments — long text fields |
| Fee Info | ✅ | ✅ Complete | ⬜ Pending | Community-variable HOA data — driven entirely from DB per community |
| Owner Info | ✅ | ✅ Complete | ⬜ Pending | Fully static for Lennar — bookmarklet overwrites Input_118 even on Tax ID path |
| Agent/Office Info | ✅ | ✅ Complete | ⬜ Pending | Fully static for Lennar — no clipboard payload needed |
| Showing Instructions | ✅ | ✅ Complete | ⬜ Pending | Static for Lennar except Additional Showing Instructions textarea |
| Virtual Tour Info | ✅ | ✅ Complete | ⬜ Pending | 2 text fields — URL from email into Input_610; Input_611 blank unless second link provided |
| Internet Display Info | ✅ | ✅ Complete | ⬜ Pending | Fully static — all 4 fields always Yes; no clipboard payload needed |

---

## Build Roadmap

### Phase 1 — Field Mapping (Claude in Chrome)
Use the Claude in Chrome extension to extract field IDs from each remaining tab. Navigate to the tab, ask the extension to list all `input`, `select`, and `textarea` element IDs and types. Paste results back into this document under the relevant tab section.

Do one tab per session to avoid burning excessive tokens. Features will take the most time — consider breaking it into sections.

### Phase 2 — Bookmarklet Build (Cursor)
Once field maps are complete, build the full bookmarklet set in Cursor:
- Define the complete payload JSON schema
- Build the clipboard-reader bookmarklet for each tab
- Identify all static Lennar constants and hardcode them
- Generate HTML launcher files for each bookmarklet

### Phase 3 — Session Integration
Update the session protocol so the payload generation is a standard output step:
- Session parses email → generates data sheet → generates MLS payload JSON
- Payload output is formatted as a copy-ready block
- Session notes which fields need manual attention (e.g. fields not in the Cognito form)

### Phase 4 — Chrome Extension (Future)
Once bookmarklets are proven across all tabs, build a custom Chrome extension:
- Single toolbar button replaces 12 bookmarks
- Auto-detects current Matrix tab
- Payload pasted into extension popup — no clipboard management needed
- Built in Cursor; installed via `chrome://extensions` developer mode

---

## HTML Launcher Files

Bookmarklet installation in Chrome requires dragging from an HTML anchor element — pasting `javascript:` URLs directly into bookmark fields is blocked by Chrome security.

**For each bookmarklet, generate an HTML launcher file** containing:
- The bookmarklet as an `href` on a styled anchor element
- Drag instruction: make bookmarks bar visible (Cmd+Shift+B), drag the button to the bar
- The JSON payload for that tab as a copy-ready block (for reference)

The Bath Info launcher (`bath_info_bookmarklet_clipboard.html`) serves as the template for all future launchers.

---

## Open Questions

- [ ] Matrix requires `change` events on dropdowns to trigger cascade — confirm whether `change` event alone is sufficient or whether additional events (`input`, `blur`) are needed
- [ ] Confirm that text fields do not require `change` events — Bath Info worked without firing events on text fields; confirm this holds across all tabs
- [ ] How does Matrix handle checkbox fields in the DOM — `input[type=checkbox]` with `checked` property, or something else? (Relevant for Features tab)
- [ ] Owner Info — confirm what fields exist and whether Lennar as seller has a standard entry
- [ ] Features tab — identify which fields are Lennar constants vs listing-specific before building the bookmarklet
- [ ] Listing Info dependent dropdown values — see open questions under Listing Info field map above

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-20 | Andrew Rich / Claude | Initial document. Bath Info POC complete. Architecture decisions locked. |
| 1.1 | 2026-06-21 | Andrew Rich / Claude | Listing Info, Agent/Office Info, Showing Instructions, Virtual Tour Info, and Internet Display Info field maps complete. Three-path entry architecture added. Dynamic cascade sequencing documented. Payload schema updated. Community dropdown value confirmation table added. |
| 1.2 | 2026-06-21 | Andrew Rich / Claude | Owner Info and Fee Info field maps complete. Full semantic label lists captured for all checkbox groups for non-Lennar use. Fee Includes per-community values added. Standing rule established: always capture full semantic labels during extraction regardless of Lennar static usage. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Claude-facing document. Update version history and date with each revision.*

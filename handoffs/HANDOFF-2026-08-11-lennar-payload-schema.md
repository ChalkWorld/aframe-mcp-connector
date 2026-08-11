---
title: Cursor Handoff — Lennar_Payload_Schema.md — v1.2 to v1.3
document_id: HANDOFF-2026-08-11-lennar-payload-schema
date: 2026-08-11
project: AAR-TC Lennar CVRMLS Matrix Intake
---

Apply the changes below surgically to `docs/lennar/Lennar_Payload_Schema.md`. Do not modify anything not listed here.

## Change 1 — Version header bump

**Find:**
```
version: 1.2
version_date: 2026-07-16
```

**Replace with:**
```
version: 1.3
version_date: 2026-08-11
```

---

## Change 2 — §3 Path Decision: Wynwood retired, Creekside Run TH migrated to taxid

**Find:**
```
| Community | `path` value | Rationale |
|---|---|---|
| Harpers Mill TH | `"taxid"` | Tax records populated; location and tax fields pre-populate |
| Harpers Mill SF | `"taxid"` | Same as Harpers Mill TH |
| Creekside Run TH | `"new"` | Tax records not yet populated; clean-slate entry |
| Everstone SF | `"new"` | Tax records not yet populated |
| Watermark SF | `"new"` | Tax records not yet populated |
| Wynwood at Fox Creek SF | *(pending)* | Community sold out — no active listings; revisit when a new listing appears |
```

**Replace with:**
```
| Community | `path` value | Rationale |
|---|---|---|
| Harpers Mill TH | `"taxid"` | Tax records populated; location and tax fields pre-populate |
| Harpers Mill SF | `"taxid"` | Same as Harpers Mill TH |
| Creekside Run TH | `"taxid"` | Tax records populated as of August 2026 — migrated from `"new"`. First live confirmation: 6039 Blue Iris Rd, MLS# 2621807 |
| Everstone SF | `"new"` | Tax records not yet populated |
| Watermark SF | `"new"` | Tax records not yet populated |
| Wynwood at Fox Creek SF | **retired** | Community sold out — no further listings expected |
```

---

## Change 3 — §5.1 Pure statics: remove Siding and Flooring (confirmed not universal)

**Find:**
```
| Field | Payload key | Lennar value |
|---|---|---|
| Structure | `features_a.structure` | `["Input_70_03"]` (Frame) |
| Siding | `features_a.siding` | `["Input_71_22"]` (Vinyl) |
| Roof | `features_a.roof` | `["Input_72_12"]` (Shingled) |
| Flooring | `features_a.flooring` | `["Input_73_17"]` (Vinyl - Plank/Tile/Stone) |
| Attic | `features_a.attic` | `["Input_241_09"]` (Access Panel) |
| Golf Frontage Y/N | `features_a.golf_frontage_yn` | `"0"` |
| Water | `features_a.water` | `["Input_676_PW"]` (Public Water) |
| Sewer/Septic | `features_a.sewer` | `["Input_670_PBLCSR"]` (Sewer - Public) |
| Water Heater | `features_b.water_heater` | `["Input_571_01"]` (Electric) |
| Cooling | `features_b.cooling` | `["Input_88_06"]` (Heat Pump) |
| Wall Type | `features_b.wall_type` | `["Input_254_02"]` (Drywall) |
```

**Replace with:**
```
| Field | Payload key | Lennar value |
|---|---|---|
| Structure | `features_a.structure` | `["Input_70_03"]` (Frame) |
| Roof | `features_a.roof` | `["Input_72_12"]` (Shingled) |
| Attic | `features_a.attic` | `["Input_241_09"]` (Access Panel) |
| Golf Frontage Y/N | `features_a.golf_frontage_yn` | `"0"` |
| Water | `features_a.water` | `["Input_676_PW"]` (Public Water) |
| Sewer/Septic | `features_a.sewer` | `["Input_670_PBLCSR"]` (Sewer - Public) |
| Water Heater | `features_b.water_heater` | `["Input_571_01"]` (Electric) |
| Cooling | `features_b.cooling` | `["Input_88_06"]` (Heat Pump) |
| Wall Type | `features_b.wall_type` | `["Input_254_02"]` (Drywall) |

**Removed 2026-08-11 — Siding and Flooring are no longer pure statics.** The Cognito intake form (Form ID 17) offers real alternatives for both: Siding — Hardiplank, Brick, Brick Veneer, Stone alongside Vinyl; Flooring — Tile alongside Luxury Vinyl Plank. Confirmed real usage: townhomes can mix sidings, some plans have tile in bathrooms. Vinyl/LVP remain the correct **defaults** when a listing doesn't specify otherwise — they're accurate as a base case, just not universal. Both fields moved to §5.4 as payload-driven with a stated default.
```

---

## Change 4 — §5.4: add Flooring/Siding rows, add Cognito Form 17 mapping subsection

**Find:**
```
| Field | Payload key | Codes |
|---|---|---|
| Style | `features_a.style` | See stored value list below |
| Parking | `features_a.parking` | See `CVRMLS_Features_Field_Map.md` Chunk 2 |
| Exterior | `features_a.exterior` | See `CVRMLS_Features_Field_Map.md` Chunk 2 |
| Interior | `features_a.interior` | See `CVRMLS_Features_Field_Map.md` Chunk 4 |
| Num Cars | `features_a.num_cars` | Select — `"1"`, `"15"` (=1.5), `"2"`, `"25"` (=2.5), `"3"`, `"4plus"` |
| Garage Y/N | `features_a.garage_yn` | Select — `"1"` or `"0"` (drives §5.3 conditional resolution) |
| Basement Y/N | `features_a.basement_yn` | Select — `"1"` or `"0"` (drives §5.3 conditional resolution) |
| Num Fp | `features_a.num_fp` | Select — `"0"` default |
| Fireplace | `features_a.fireplace` | Checkbox array — only written when `num_fp` > 0; codes in Field Map Chunk 5 |
| Porch | `features_b.porch` | See `CVRMLS_Features_Field_Map.md` Chunk 8 |
| Appl/Equip | `features_b.appl_equip` | See stored value list below |
| Unit Placement | `features_b.unit_placement` | Checkbox array — leave `[]` for SF listings |
```

**Replace with:**
```
| Field | Payload key | Codes |
|---|---|---|
| Style | `features_a.style` | See stored value list below |
| Parking | `features_a.parking` | See `CVRMLS_Features_Field_Map.md` Chunk 2 |
| Exterior | `features_a.exterior` | See `CVRMLS_Features_Field_Map.md` Chunk 2 |
| Interior | `features_a.interior` | See `CVRMLS_Features_Field_Map.md` Chunk 4 |
| Flooring | `features_a.flooring` | Payload-driven — default `["Input_73_17"]` (Vinyl - Plank/Tile/Stone) when unspecified; add `["Input_73_08"]` (Tile) alongside when Tile is selected (e.g. bathrooms). Moved from §5.1 2026-08-11 — see removal note there. |
| Siding | `features_a.siding` | Payload-driven — default `["Input_71_22"]` (Vinyl) when unspecified; townhomes can mix — add `Input_71_25` (Hardiplank), `Input_71_05` (Brick), `Input_71_06` (Brick Veneer), or `Input_71_18` (Stone) per selection. Moved from §5.1 2026-08-11 — see removal note there. |
| Num Cars | `features_a.num_cars` | Select — `"1"`, `"15"` (=1.5), `"2"`, `"25"` (=2.5), `"3"`, `"4plus"` |
| Garage Y/N | `features_a.garage_yn` | Select — `"1"` or `"0"` (drives §5.3 conditional resolution) |
| Basement Y/N | `features_a.basement_yn` | Select — `"1"` or `"0"` (drives §5.3 conditional resolution) |
| Num Fp | `features_a.num_fp` | Select — `"0"` default |
| Fireplace | `features_a.fireplace` | Checkbox array — only written when `num_fp` > 0; codes in Field Map Chunk 5 |
| Porch | `features_b.porch` | See `CVRMLS_Features_Field_Map.md` Chunk 8 |
| Appl/Equip | `features_b.appl_equip` | See stored value list below |
| Unit Placement | `features_b.unit_placement` | Checkbox array — leave `[]` for SF listings. Townhouse mapping now confirmed — see §5.4.1. |
```

---

## Change 5 — Add new §5.4.1 with the full Cognito Form 17 crosswalk

**Find:**
```
### 5.5 Fields excluded from Lennar Features entirely
```

**Add** (insert immediately before the Find text above, i.e. between the end of §5.4's Appl/Equip stored value list and the start of §5.5):
```
### 5.4.1 Cognito Form 17 mapping (confirmed 2026-08-11)

When the source is Andrew's current Cognito form (Form ID `17`, internal name `LennarNewListingIntake`), every relevant checkbox/radio field on the form is a closed enum pulled directly via the Cognito Forms API — full crosswalk to CVRMLS codes below. This replaces per-email guessing for these fields once the form sees real rep use (form is confirmed but still test-entries-only as of this writing — see Protocol §"How a New Listing Arrives").

**Appl/Equip — `BuildFeatures.KitchenAndAppliances.SelectAllThatApply` → `features_b.appl_equip`:**

| Form option | Code | Form option | Code |
|---|---|---|---|
| Electric Cooking | `Input_81_09` | Stove (Range with Oven) | `Input_81_23` |
| Gas Cooking | `Input_81_13` | Stove Hood | `Input_81_24` |
| Disposal | `Input_81_06` | EV Charger | `Input_81_39` |
| Dishwasher | `Input_81_05` | Washer | `Input_81_27` |
| Double Oven | `Input_81_33` | Dryer | `Input_81_08` |
| Microwave | `Input_81_18` | Refrigerator | `Input_81_19` |

All 12 form options map cleanly. This resolves the "Range" ambiguity seen on legacy-form/email submissions — the form's "Stove (Range with Oven)" option is unambiguous and confirmed correct against a live comp (6035 Blue Iris Rd Agent Long sheet, appliance line reads "Stove").

**Interior — `BuildFeatures.InteriorFeatures.SelectAllThatApply` → `features_a.interior`:**

| Form option | Code | Form option | Code |
|---|---|---|---|
| 1st Floor Primary Bedroom | `Input_568_50` | Dining Area | `Input_568_13` |
| 1st Floor Bedroom | `Input_568_19` | Double Vanity | `Input_568_14` |
| 9ft Ceilings | `Input_568_01` | Island | `Input_568_25` |
| Bay Window | `Input_568_03` | Loft | `Input_568_26` |
| Ceiling Fans | `Input_568_11` | Pantry | `Input_568_28` |
| Recessed Lighting | `Input_568_29` | Rough-in Bath | `Input_568_30` |
| Walk-in Closets | `Input_568_39` | | |

All 13 form options map cleanly.

**Flooring — `BuildFeatures.InteriorFeatures.Flooring` → `features_a.flooring`:**

| Form option | Code |
|---|---|
| Luxury Vinyl Plank (LVP) | `Input_73_17` (Vinyl - Plank/Tile/Stone) |
| Tile | `Input_73_08` |

Confirmed real per-listing selections, not a static — see §5.1 removal note. Default when the form/email doesn't specify: `["Input_73_17"]`.

**Siding — `BuildFeatures.ExteriorFeatures.Siding` → `features_a.siding`:**

| Form option | Code |
|---|---|
| Vinyl | `Input_71_22` |
| Hardiplank | `Input_71_25` (HardiPlank Type) |
| Brick | `Input_71_05` |
| Brick Veneer | `Input_71_06` |
| Stone | `Input_71_18` |

Confirmed real per-listing selections, not a static — townhomes can mix sidings. Default when the form/email doesn't specify: `["Input_71_22"]`.

**Exterior Features — `BuildFeatures.ExteriorFeatures.Features` → `features_a.exterior`:**

| Form option | Code |
|---|---|
| Deck | `Input_570_43` |
| Irrigation System | `Input_570_31` |
| Cul-de-sac Lot | `Input_570_35` (Cul-de-sac) |
| Covered Porch | `Input_570_44` (Porch) — confirmed 2026-08-11; maps to the generic Exterior "Porch" flag, not the separate Porch-type detail group (`features_b.porch`, Chunk 8) |

**Style (Single Family only) — `PropertyBasics.Style` → `features_a.style`:**

The form offers only 3 of the 30 CVRMLS style options — Style stops being an open per-listing question once the form is in use for SF:

| Form option | Code |
|---|---|
| Ranch | `Input_541_18` |
| 2 Story | `Input_541_27` (2-Story) |
| Custom | `Input_541_06` |

Townhouse listings don't get a Style prompt on the form — TH Style remains the existing static `["Input_541_19"]` (Rowhouse/Townhouse).

**Unit Placement (Townhouse only) — `Intake.PropertyBasics.TownhouseUnitPlacement` → `features_b.unit_placement`:**

| Form option | Code |
|---|---|
| End Unit | `Input_657_03` |
| Interior Unit | `Input_657_04` |

Fills the gap the existing spec left open (previously: "leave `[]` for SF listings," silent on TH).

---

### 5.5 Fields excluded from Lennar Features entirely
```

---

## Change 6 — §6 Community Lookup Pointer: note Area is now tracked

**Find:**
```
Per-community values for schools, HOA fees, management firms, fee includes (display text AND numeric codes per 2026-07-15 migration), and Features B community fields (heating, heat fuel, pool, community amenities) live in **`Lennar_Community_Reference_Database.md`** (`AAR-TC-LENNAR-DB-001`).

**Community keys used in Lennar payloads** (values match DB section headers by display name):
```

**Replace with:**
```
Per-community values for schools, HOA fees, management firms, fee includes (display text AND numeric codes per 2026-07-15 migration), MLS Area codes (added 2026-08-11 — previously undocumented for every community), and Features B community fields (heating, heat fuel, pool, community amenities) live in **`Lennar_Community_Reference_Database.md`** (`AAR-TC-LENNAR-DB-001`).

**Community keys used in Lennar payloads** (values match DB section headers by display name):
```

---

## Change 7 — §7.1: resolve taxid/Richmond City verification, update Fee Includes/Addl Fee Desc scope note

**Find:**
```
- **Property details on Harpers Mill taxid path.** *Resolved 2026-07-15 — smoke test (8720 Whitman Dr) confirmed field-specific behavior:* Lot autofills from the tax record on Harpers Mill taxid (SKIP-TAXID is correct — see §4.1 Lot row); Year Built, Rooms, Levels, Bedrooms, and Post Office do NOT autofill and must be written from payload via the Lennar carveout (`payload.builder === "lennar"`). §4.1 and §7.2 updated to match. Behavior for other taxid-path communities (Harpers Mill SF future) remains unverified but expected to match per parcel-record consistency across Chesterfield County.
```

**Replace with:**
```
- **Property details on Harpers Mill taxid path.** *Resolved 2026-07-15 — smoke test (8720 Whitman Dr) confirmed field-specific behavior:* Lot autofills from the tax record on Harpers Mill taxid (SKIP-TAXID is correct — see §4.1 Lot row); Year Built, Rooms, Levels, Bedrooms, and Post Office do NOT autofill and must be written from payload via the Lennar carveout (`payload.builder === "lennar"`). §4.1 and §7.2 updated to match.
- **Creekside Run TH taxid path — Richmond City jurisdiction.** *Resolved 2026-08-11 — first live taxid pull (6039 Blue Iris Rd, MLS# 2621807), first outside Chesterfield County:* County/City cascade fires and populates correctly on Richmond City parcels, same as Chesterfield — the `listing.county_city` "always write, both paths" rule (§4.1) holds across jurisdictions. Property-details carveout (Year Built/Rooms/Levels/Bedrooms/Post Office) also held.
```

**Find:**
```
- **`fee.addl_fee_desc` scope across communities.** Build Notes' fee table populated Addl Fee Desc for Harpers Mill TH only (`"Initial Working Capital Contribution: $350"`). The Community Reference DB records capital contribution amounts for all communities (`$300` HM SF, `$450` Creekside, `$144` Everstone, `$275` Watermark). Question: should the Capital Contribution text write into `Input_117` (Add'l Fee Dsc) for all Lennar communities, or only Harpers Mill TH (which is the only community with Addl HOA = Yes)? Current schema documents Harpers Mill TH only per deployed behavior; verify against MLS convention on a live standard-listing Fee Info tab.
```

**Replace with:**
```
- **`fee.addl_fee_desc` scope across communities.** *Partially resolved 2026-08-11:* Creekside Run TH's capital contribution (`"Initial Working Capital Contribution: $450"`) confirmed written to `Input_117` (Add'l Fee Dsc) on 6039 Blue Iris Rd — second community confirmed after Harpers Mill TH, and Creekside is not an "Addl HOA = Yes" community, so the original Addl-HOA-linked theory doesn't hold. Trending toward "populate wherever a capital contribution amount is known in the Community DB," but not yet confirmed as a blanket rule — Harpers Mill SF (`$300`), Everstone (`$144`), and Watermark (`$275`) remain unconfirmed. Ask before applying to those three.
```

---

## Change 8 — Version History: add 1.3 row

**Find:**
```
| 1.2 | 2026-07-16 | Andrew Rich / Claude | 8724 Whitman Dr smoke re-test (second Harpers Mill TH taxid listing) ran clean against v1.1 — no new bugs, confirms Fixes 1 & 2 hold. Added three standing defaults: §4.1 `listing.rooms` static fallback when absent from email (TH="8", SF="10"); §4.2 structural rule that all Lennar TH are 3-level/slab with no Basement row (confirmed via Harpers Mill TH / Arcadia); §4.2 all-full-baths-`"TS"` default. §7.1 Bath configuration item updated to reflect partial resolution — level structure now fixed, per-level counts and SF still open. |
```

**Replace with:**
```
| 1.2 | 2026-07-16 | Andrew Rich / Claude | 8724 Whitman Dr smoke re-test (second Harpers Mill TH taxid listing) ran clean against v1.1 — no new bugs, confirms Fixes 1 & 2 hold. Added three standing defaults: §4.1 `listing.rooms` static fallback when absent from email (TH="8", SF="10"); §4.2 structural rule that all Lennar TH are 3-level/slab with no Basement row (confirmed via Harpers Mill TH / Arcadia); §4.2 all-full-baths-`"TS"` default. §7.1 Bath configuration item updated to reflect partial resolution — level structure now fixed, per-level counts and SF still open. |
| 1.3 | 2026-08-11 | Andrew Rich / Claude | Cleanup pass following 6039 Blue Iris Rd intake (first Creekside Run TH taxid listing, first outside Chesterfield County). §3: Wynwood retired, Creekside Run TH migrated `new` → `taxid`. §5.1/§5.4: Siding and Flooring removed as pure statics (confirmed real per-listing selections via Cognito Form 17 — Vinyl/LVP remain the correct defaults, not universal facts) and moved to §5.4 as payload-driven with defaults. New §5.4.1 added: full Cognito Form 17 → CVRMLS crosswalk for Appl/Equip (resolves the "Range" ambiguity), Interior, Flooring, Siding, Exterior (Covered Porch → Porch), Style (SF, now a 3-option closed set instead of the full 30-option list), and Unit Placement (TH, previously undocumented). §6: Community Lookup Pointer notes Area codes now tracked. §7.1: Richmond City taxid jurisdiction confirmed working same as Chesterfield; `fee.addl_fee_desc` scope partially resolved (2 of 5 communities confirmed, not yet a blanket rule). |
```

---

No other changes to `Lennar_Payload_Schema.md`.

```bash
git add -A
git commit -m "Lennar Payload Schema v1.2 -> v1.3: Creekside taxid migration, Cognito Form 17 features crosswalk, Siding/Flooring corrected from static to payload-driven"
git push origin main
```

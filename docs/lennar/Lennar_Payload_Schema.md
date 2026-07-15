---
title: Lennar Payload Schema
document_id: AAR-TC-LENNAR-PL-001
version: 1.0
version_date: 2026-07-15
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar CVRMLS Matrix Intake
---

# Lennar Payload Schema
### AAR-TC Transaction Services | Document ID: AAR-TC-LENNAR-PL-001

**Base upstream:** `docs/cvrmls/CVRMLS_Payload_Schema.md` (`AAR-TC-CVRMLS-PL-001`)
**Envelope contract:** `docs/Payload_Envelope.md` (`AAR-TC-ENV-001`)
**Community lookup source:** `docs/lennar/Lennar_Community_Reference_Database.md` (`AAR-TC-LENNAR-DB-001`)

---

## 1. Purpose

The single runtime source of truth for a Lennar CVRMLS session. Derives from the CVRMLS Payload Schema (upstream) with Lennar-specific statics pre-resolved, community lookups mapped to the Community Reference Database, the Features field set scoped down to Lennar-used groups only, and path-specific include/omit rules applied.

This is the payload-schema doc a Lennar session loads at runtime per `Payload_Envelope.md` §3, alongside `Lennar_New_Listing_Protocol.md` (workflow) and `Lennar_Community_Reference_Database.md` (per-community values). Nothing else on the Lennar side needs to be loaded to generate a valid payload.

**Consolidates and retires:**
- `Lennar_Bookmarklet_Customization.md` (`AAR-TC-LENNAR-BM-CUST-001`) — full content migrates
- `Lennar_Bookmarklet_Build_Notes.md` (`AAR-TC-LENNAR-BM-NOTES-001`) — schema content migrates; per-community fee data migrates into the Community DB (Step 4)
- `Lennar_Features_Payload_Schema.md` (`AAR-TC-LENNAR-BM-SCH-001`) — Features field-map content migrates; Listing Info section drops (stale Input IDs); Fee Info section drops (stale Input IDs)
- `Lennar_Features_Bookmarklet_Source.md` (`AAR-TC-LENNAR-BM-SRC-001-FEA`) — Features resolution table migrates

See §Retirement Notes at the end of this doc for what's kept, what's dropped, and why.

---

## 2. Payload Envelope for Lennar

Every Lennar payload carries the four envelope keys specified in `Payload_Envelope.md` §2. For Lennar the concrete values are:

| Envelope key | Value | When present |
|---|---|---|
| `mls` | `"cvrmls"` | Always |
| `builder` | `"lennar"` | Always |
| `path` | `"new"` \| `"taxid"` | Always — see §3 for per-community assignment |
| `phase` | *(omitted)* | Never — builder intakes are one-shot; `phase` is standard-listings only |

**Canonical `path` values are `new` and `taxid` — no underscore.** Any legacy `tax_id` occurrence should be updated on contact per `Payload_Envelope.md` §2. A `copy` path exists in the protocol as a future option but is not currently in use.

### 2.1 The `community` key

In addition to the four envelope keys, every Lennar payload carries a top-level `community` key naming the Lennar community for this listing:

```json
{
  "mls":       "cvrmls",
  "builder":   "lennar",
  "path":      "taxid",
  "community": "Harpers Mill TH",
  "listing":   { "...": "..." }
}
```

`community` is a sibling of the envelope keys, not part of the envelope contract — it's a Lennar-specific data key that lives at the top level because it drives lookups across multiple tabs (Listing Info location cascade, Fee Info values via Community DB, Features B community table). Placing it under `listing` would misrepresent its scope.

**Values match the community sections in `Lennar_Community_Reference_Database.md` by display name:**

```
"Harpers Mill TH" | "Harpers Mill SF" | "Creekside Run TH" |
"Everstone SF"    | "Watermark SF"    | "Wynwood at Fox Creek SF" (pending)
```

Bookmarklets do not read `community`. Post-Session 021 unification, every community-derived value the bookmarklet consumes has already been resolved into the concrete payload fields (`listing.county_city`, `fee.fee_amount`, `features_b.heating`, etc.) by the session. `community` remains in the payload as informational metadata for the session, for human debugging, and for future extension routing.

### 2.2 Retired: `"lennar": true` flag

The legacy `"lennar": true` top-level boolean is superseded by the envelope's `"builder": "lennar"`. Lennar payloads generated against this schema should not include `"lennar": true`.

`CVRMLS_Payload_Schema.md`'s "Builder Flag Pattern" section still describes the old convention as of this schema's writing. That section will be updated to reference the envelope pattern as part of Step 5 (CVRMLS layer clarification) in the doc realignment execution plan.

---

## 3. Path Decision by Community

Each Lennar community uses one Matrix entry path. This assignment is stable and reflects whether tax records currently exist for the community's parcels.

| Community | `path` value | Rationale |
|---|---|---|
| Harpers Mill TH | `"taxid"` | Tax records populated; location and tax fields pre-populate |
| Harpers Mill SF | `"taxid"` | Same as Harpers Mill TH |
| Creekside Run TH | `"new"` | Tax records not yet populated; clean-slate entry |
| Everstone SF | `"new"` | Tax records not yet populated |
| Watermark SF | `"new"` | Tax records not yet populated |
| Wynwood at Fox Creek SF | *(pending)* | Community sold out — no active listings; revisit when a new listing appears |

**Revisit path assignments when tax records are updated for new addresses.** Communities currently on the `"new"` path may migrate to `"taxid"` as their parcels get filed in tax records; this changes what fields the payload omits (see per-tab path rules below).

### 3.1 Path-specific behavior summary

The `path` value controls which fields the bookmarklet writes vs. skips. The high-level rules (details in each tab section below):

- **`"new"`** — Clean-slate entry. Bookmarklet fills all fields. Session includes all payload keys.
- **`"taxid"`** — Matrix pre-populates location and tax fields from the parcel tax record. Bookmarklet skips those specific fields; session omits them from the payload. **Exceptions applied for Lennar:** Owner Name always force-overwrites to `"Lennar"`; Assd Improvement always writes `"0"` (Lennar new construction never has this pre-populated); property details (Year Built, Rooms, Levels, Bedrooms, Lot) are always written because Lennar new-construction parcels typically don't have these values in their tax records — see §7 Open Verification Items.

---

## 4. Tab-by-Tab Payload Shape

Coverage is complete for all Matrix tabs a Lennar session touches. Room Info is omitted — Lennar new construction listings do not populate Room Info; the tab is skipped entirely and the payload carries no `room` key.

### 4.1 Listing Info

**Bookmarklet:** `bookmarklets/listing_info.html` (universal, post-Session 021 unification)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 1 — Listing Info

**Lennar-specific behavior:**
- Location cascade fields (County/City → Area → ZIP → Post Office → Subdivision → Neighborhood → Schools) resolve from the Community Reference Database via the `community` key
- Five listing-level statics resolve session-side to fixed Lennar values (Delayed Show, New/Resale, Year Built Desc, Expire Date, SqFt Source)
- On `"taxid"` path, street fields (Street #, Street Dir, Street Name, Street Suffix) and PID skip because Matrix pre-populates them from the parcel tax record
- Property details (Year Built, Rooms, Levels, Bedrooms, Lot) are always written from the email — Lennar new-construction parcels typically don't have these in the tax record

**Field-by-field payload shape:**

| Payload key | Input ID | Value / Source | Notes |
|---|---|---|---|
| `listing.county_city` | `Input_29` | Community lookup | Fires the location cascade — **always write, both paths** |
| `listing.area` | `Input_30` | Community lookup | Written after county_city cascade settles (~1500ms) |
| `listing.zip` | `Input_635` | Community lookup | Written after Area cascade settles (~800ms) |
| `listing.post_office` | `Input_41` | Community lookup | Written after cascade |
| `listing.subdivision` | `Input_259` | Community lookup | Everstone uses stored value `"None"` (see Everstone note in DB) |
| `listing.neighborhood` | `Input_236` | Community lookup | Blank for all communities except Everstone (`"Everstone"`) |
| `listing.elementary` | `Input_51` | Community lookup | Matrix stores multi-word school names without spaces (e.g. `"DeepCreek"`) |
| `listing.middle` | `Input_53` | Community lookup | Same storage convention |
| `listing.high` | `Input_52` | Community lookup | Same storage convention |
| `listing.list_price` | `Input_31` | Dynamic (email) | May be blank at intake if not yet confirmed |
| `listing.list_date` | `Input_160` | Dynamic (session) | Today's date always — never the email date |
| `listing.type` | `Input_849` | Dynamic (email) | `"SFR"` (Single Family) or `"TOWN"` (Townhouse) |
| `listing.attached_yn` | `Input_850` | Dynamic (email) | `"1"` (Yes) for TH; `"0"` (No) for SF |
| `listing.delayed_show` | `Input_32` | Static: `"0"` | Lennar always No |
| `listing.new_resale` | `Input_42` | Static: `"NVROC"` | New, never occupied |
| `listing.year_built_desc` | `Input_45` | Static: `"UNDCON"` | Under Construction |
| `listing.expire_date` | `Input_162` | Static: `"12/31/2026"` | ⚠ **Update when Master Listing Agreement renews** |
| `listing.sqft_source` | `Input_97` | Static: `"04"` | Per Builder |
| `listing.pid` | `Input_99` | Static: `"TBD"` (new path) / *skip* (taxid path) | Matrix pre-populates on taxid |
| `listing.street_num` | `Input_34` | Dynamic (email) / *skip* on taxid | Verify for comma artifacts (`"15,912"` → `"15912"`) |
| `listing.street_dir` | `Input_35` | Dynamic (email) / *skip* on taxid | Blank string if none |
| `listing.street_name` | `Input_36` | Dynamic (email) / *skip* on taxid | |
| `listing.street_suffix` | `Input_37` | Dynamic (email) / *skip* on taxid | Stored option value — see §7 Open Verification Items |
| `listing.year_built` | `Input_44` | Dynamic (email) | Always written for Lennar — see path rules note |
| `listing.rooms` | `Input_48` | Dynamic (email) | Always written for Lennar |
| `listing.levels` | `Input_49` | Dynamic (email) | Always written for Lennar |
| `listing.lot` | `Input_622` | Dynamic (email) | Always written for Lennar |
| `listing.bedrooms` | `Input_47` | Dynamic (email) | Always written for Lennar |
| `listing.sqft_above_finished` | `Input_879` | Dynamic (email) | |
| `listing.sqft_below_finished` | `Input_882` | Dynamic (email) | `"0"` if no basement |
| `listing.sqft_above_unfinished` | `Input_880` | Dynamic (email) | `"0"` if none |
| `listing.sqft_below_unfinished` | `Input_883` | Dynamic (email) | `"0"` if none |

**Path-specific include/omit rules:**
- **On `"new"` path:** Include all fields above.
- **On `"taxid"` path:** Omit `pid`, `street_num`, `street_dir`, `street_name`, `street_suffix`. Include everything else, including the cascade fields (cascade must fire for the Area / Schools dropdowns to populate).

**Fields excluded from payload entirely:**
- No Show Until (`Input_33`), Expected OnMkt Date (`Input_782`) — always manual
- Latitude, Longitude, Directions — always manual

---

### 4.2 Bath Info

**Bookmarklet:** `bookmarklets/bath_info.html` (universal — no Lennar-specific behavior)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 3 — Bath Info

All bath data is listing-specific and comes from the email. No Lennar statics, no community lookups.

**Field-by-field payload shape:**

| Payload key | Input ID | Value / Source |
|---|---|---|
| `bath.basement.desc` | `Input_57` | Dynamic — `""`, `"S"`, `"T"`, or `"TS"` (only needed when full baths > 0) |
| `bath.basement.full` | `Input_61` | Dynamic — integer as string, always explicit `"0"` never blank |
| `bath.basement.half` | `Input_65` | Dynamic — same rule |
| `bath.level1.desc` | `Input_58` | Dynamic |
| `bath.level1.full` | `Input_62` | Dynamic |
| `bath.level1.half` | `Input_66` | Dynamic |
| `bath.level2.desc` | `Input_59` | Dynamic |
| `bath.level2.full` | `Input_63` | Dynamic |
| `bath.level2.half` | `Input_67` | Dynamic |
| `bath.level3.desc` | `Input_60` | Dynamic |
| `bath.level3.full` | `Input_64` | Dynamic |
| `bath.level3.half` | `Input_68` | Dynamic |
| `bath.level4.desc` | `Input_737` | Dynamic — rarely used |
| `bath.level4.full` | `Input_738` | Dynamic |
| `bath.level4.half` | `Input_739` | Dynamic |

**Path-specific rules:** None. All fields always included on both paths.

**Typical Lennar bath configurations (confirm per email — do not assume):**

| Type | Basement | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|---|
| Townhouse | 0 / 0 | 0 / 1 | 2 / 0 (TS) | 0 / 0 | 0 / 0 |
| Single Family | 0 / 0 | 0 / 1 | 2 / 0 (TS) | 0 / 0 | 0 / 0 |

Configurations vary by plan; these are the most common defaults. See §7 Open Verification Items.

---

### 4.3 Features (Tabs 4a / 4b)

Features are split across two bookmarklets (`features_a.html`, `features_b.html`) and two payload keys (`features_a`, `features_b`) per Session 021 unification. Full Lennar Features specification lives in **§5 Features Subset for Lennar** — see that section for pure statics, community-lookup fields, conditional resolutions, and the already-shared field list.

**Path-specific rules:** None — Features are always included in both `"new"` and `"taxid"` payloads (Lennar is a one-shot builder intake; there is no separate Phase 2 update).

---

### 4.4 General Info

**Bookmarklet:** `bookmarklets/general_info.html` (universal)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 5 — General Info

**Lennar-specific behavior:**
- Six General Info fields resolve session-side to fixed Lennar values (Waterfront, Model Available, Disclosures, Lead Disclosure, Assd Improvement, and — on new path only — Tax Year and Legal Description)
- Acres always comes from the email on new path; on taxid path Matrix pre-populates from tax record
- **Assd Improvement always writes `"0"` on both paths for Lennar** — new construction never has this pre-populated from the tax record, unlike standard listings

**Field-by-field payload shape:**

| Payload key | Input ID | Value / Source | Notes |
|---|---|---|---|
| `general.waterfront` | `Input_94` | Static: `"N"` | Lennar always No |
| `general.model_available` | `Input_249` | Static: `"0"` | Lennar always No |
| `general.disclosures` | `Input_102_*` | Static: `["NOTREQ"]` | Not Required — checkbox array |
| `general.lead_disclosure` | `Input_103_*` | Static: `["NOTREQ"]` | Not Required — checkbox array |
| `general.assd_improvement` | `Input_248` | Static: `"0"` | Both paths — Lennar override of standard taxid skip behavior |
| `general.acres` | `Input_95` | Dynamic (email) on new / *skip* on taxid | Matrix pre-populates on taxid path from tax record; verify against email — new construction lot sizes may not match tax record |
| `general.tax_year` | `Input_246` | Static: `"0"` (new path) / *skip* (taxid) | Matrix pre-populates on taxid |
| `general.legal` | `Input_100` | Static: `"TBD"` (new path) / *skip* (taxid) | Matrix pre-populates on taxid |

**Path-specific include/omit rules:**
- **On `"new"` path:** Include `waterfront`, `model_available`, `disclosures`, `lead_disclosure`, `assd_improvement`, `acres`, `tax_year`, `legal`.
- **On `"taxid"` path:** Include `waterfront`, `model_available`, `disclosures`, `lead_disclosure`, `assd_improvement`. Omit `acres`, `tax_year`, `legal`.

**Fields excluded from Lennar payload entirely:**
- Body of Water, Lot Dimensions, Lot Description, Energy Efficient, Pre-Qual Letter, Investor Rental Cap, Water Depth, Model Furnished — none apply to Lennar new construction
- AICUZ — never written
- Does Convey / Does Not Convey / Min Deposit — never written for any listing

---

### 4.5 Remarks

**Bookmarklet:** `bookmarklets/remarks.html` (universal — no Lennar-specific behavior)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 6 — Remarks

**Field-by-field payload shape:**

| Payload key | Input ID | Value / Source | Notes |
|---|---|---|---|
| `remarks.remarks` | `Input_107` | Dynamic (email) | Public remarks — 2048 char max; **strip phone number lines** per compliance rule |
| `remarks.agent_comments` | `Input_108` | Dynamic (email) | Agent-only — 1000 char max; strip phone numbers |

Copyright Agreement (`Input_662`) is hardcoded to `"1"` by the bookmarklet — not in payload. This is a genuine MLS-wide constant, not a Lennar-specific value.

**Path-specific rules:** None.

**Compliance note:** CVRMLS prohibits phone numbers in public remarks. The correct Lennar public-remarks closing line ends with `"...finishes, and layout may vary."` — session must strip any trailing `"call [number]"` line and flag the removal on the data sheet.

---

### 4.6 Fee Info

**Bookmarklet:** `bookmarklets/fee_info.html` (universal)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 7 — Fee Info

**Lennar-specific behavior:**
- Every Lennar community has an HOA; four Fee Info fields resolve session-side to fixed Lennar values (HOA/Condo, Membership Required, Fee Desc, Allow Onsite)
- Seven community-variable fields resolve from the Community Reference Database via the `community` key

**Field-by-field payload shape:**

| Payload key | Input ID | Value / Source | Notes |
|---|---|---|---|
| `fee.hoa_condo` | `Input_109` | Static: `"1"` | Lennar always Yes |
| `fee.membership_required` | `Input_112` | Static: `"1"` | Lennar always Yes |
| `fee.fee_desc` | `Input_111_*` | Static: `["01"]` | Community Association — always |
| `fee.allow_onsite` | `Input_116_*` | Static: `[]` | All unchecked — always |
| `fee.addl_hoa` | `Input_719` | Community lookup | `"1"` Harpers Mill TH only; `"0"` all others |
| `fee.fee_amount` | `Input_110` | Community lookup | From DB "Fee" — dollar amount as string, e.g. `"800.00"` |
| `fee.fee_period` | `Input_113` | Community lookup | From DB "Fee" period, mapped: Monthly → `"MO"`, Quarterly → `"QU"`, Yearly → `"YR"` |
| `fee.management_firm` | `Input_705` | Community lookup | From DB "Management Firm"; blank if none listed |
| `fee.fee_includes` | `Input_576_*` | Community lookup | From DB "Fee Includes" — mapped to stored option value array (see §7 Open Verification Items) |
| `fee.addl_fee_amount` | `Input_115` | Community lookup | Harpers Mill TH: `"70.00"`; all others: blank (see §7) |
| `fee.addl_fee_desc` | `Input_117` | Community lookup | From DB "Initial Working Capital Contribution" or "Capital Contribution Fee" — text string like `"Initial Working Capital Contribution: $350"` |

**Path-specific rules:** None. All fields always included on both paths.

**Cross-reference:** Per-community values (fee amounts, periods, management firms, fee includes lists, capital contribution amounts) live in `Lennar_Community_Reference_Database.md`. Stored option value mappings for `fee_includes` are pending migration into the DB — flagged in §7.

---

### 4.7 Owner Info

**Bookmarklet:** `bookmarklets/owner_info.html` (universal)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 8 — Owner Info

**Lennar-specific behavior:**
- Every Owner Info field is a Lennar static — the entire tab resolves to fixed values
- Owner Name (`Input_118`) force-overwrites `"Lennar"` on both paths — including taxid, where the tax record's pre-populated owner name must be overwritten

**Field-by-field payload shape:**

| Payload key | Input ID | Value / Source | Notes |
|---|---|---|---|
| `owner.owner_name` | `Input_118` | Static: `"Lennar"` | Force-overwrite on taxid path — bookmarklet writes unconditionally |
| `owner.occupant_name` | `Input_119` | Static: `"None"` | Lennar-specific default (standard listings default to `"Vacant"`) |
| `owner.occupied_by` | `Input_606` | Static: `"V"` | Vacant |
| `owner.owner_agent` | `Input_124` | Static: `"0"` | No |
| `owner.agent_related` | `Input_707` | Static: `"0"` | No — canonical key name is `agent_related` (not `agent_related_to_seller`), per CVRMLS upstream |
| `owner.owned_by` | `Input_120_*` | Static: `["02"]` | Corporate — checkbox array |
| `owner.possession` | `Input_121_*` | Static: `["01"]` | At Closing — checkbox array |

**Path-specific rules:** None. All fields always included on both paths — Lennar's Owner Info is fully static regardless of entry path.

**Fields excluded from Lennar payload entirely:**
- Owner Name 2 (`Input_857`), Owner Phone (`Input_122`), Occupant Phone (`Input_123`) — never populated for Lennar

---

### 4.8 Agent/Office Info

**Bookmarklet:** `bookmarklets/agent_office_info.html` (universal — post-Session 021)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 9 — Agent/Office Info

**Lennar-specific behavior:**
- Two Agent/Office fields resolve session-side to Lennar-specific values (Type and Limited Rep — different from non-Lennar defaults)
- Co-List Agent Code is not in the payload — it comes from the agent profile at session time per `New_Seller_Side_Session_Protocol.md`

**Field-by-field payload shape:**

| Payload key | Input ID | Value / Source | Notes |
|---|---|---|---|
| `agent_office.type` | `Input_163` | Static: `"MO"` | MLS Only (non-Lennar standard is `"ER"` Exclusive Right) |
| `agent_office.limited_rep` | `Input_164` | Static: `"1"` | Yes (non-Lennar standard is `"0"`) |

**Path-specific rules:** None.

**Fields excluded from payload entirely:**
- List Agent Code (`Input_159`) — pre-filled by Matrix, never touched
- Co-List Agent Code (`Input_170`) — comes from agent profile per protocol, not from Lennar builder logic; written manually in Matrix if agent profile specifies one

---

### 4.9 Showing Instructions

**Bookmarklet:** `bookmarklets/showing_instructions.html` (universal)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 10 — Showing Instructions

**Lennar-specific behavior:**
- Four Showing Instructions fields resolve session-side to fixed Lennar values (Accompany Show, Appt Required, Showing Instr 2, LockBox Type)
- Additional Instructions is always listing-specific — verbatim from email

**Field-by-field payload shape:**

| Payload key | Input ID | Value / Source | Notes |
|---|---|---|---|
| `showing.accompany_show` | `Input_722_AS` | Static: `false` | Unchecked — always |
| `showing.appt_required` | `Input_722_AR` | Static: `true` | Checked — always |
| `showing.showing_instr_2` | `Input_136` | Static: `"NLCS"` | No LB Call Showing Service — Lennar has no lockbox |
| `showing.lockbox_type` | `Input_333` | Static: `""` | Blank — Lennar has no lockbox (differs from non-Lennar which is always Sentrilock) |
| `showing.additional_instructions` | `Input_138` | Dynamic (email) | Verbatim from email; `""` if not provided |

**Path-specific rules:** None.

**Fields excluded from Lennar payload entirely:**
- Supra Serial LB # (`Input_137`), Sentrilock Serial LB # (`Input_732`) — Lennar has no lockbox

---

### 4.10 Virtual Tour Info

**Bookmarklet:** `bookmarklets/virtual_tour_info.html` (universal — no Lennar-specific behavior)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 11 — Virtual Tour Info

**Field-by-field payload shape:**

| Payload key | Input ID | Value / Source | Notes |
|---|---|---|---|
| `tour.virtual_tour` | `Input_610` | Dynamic (email) | URL from email — see path rule below |
| `tour.additional_virtual_tour` | `Input_611` | Dynamic (email) | Second URL; `""` if none |

**Payload-level rule:** **Omit the `tour` key entirely if no virtual tour URL is provided in the email.** The bookmarklet is not clicked in that case; the Virtual Tour tab is skipped.

**Path-specific rules:** None.

---

### 4.11 Internet Display Info

**Bookmarklet:** `bookmarklets/internet_display_info.html` (universal — no clipboard read)
**Upstream:** `CVRMLS_Payload_Schema.md` §TAB 12 — Internet Display Info

All four Internet Display fields are hardcoded to `"1"` (Yes) by the bookmarklet — a genuine MLS-wide constant. **No payload key.** The bookmarklet fires without reading the clipboard.

For reference only (not in payload):

| Field | Input ID | Value |
|---|---|---|
| Internet Display | `Input_227` | `"1"` |
| Address Display | `Input_228` | `"1"` |
| Comments/Reviews | `Input_229` | `"1"` |
| AVM | `Input_230` | `"1"` |

---

### 4.12 Room Info — Skipped

Lennar new construction listings do not populate Room Info. The Room Info tab is skipped entirely, and the Lennar payload carries no `room` key. Room Info is Phase 1 scope for standard (non-builder) listings only.

---

## 5. Features Subset for Lennar

Features are the largest single tab in CVRMLS (49 field groups, ~605 individual checkboxes and selects). Lennar uses a small subset. This section documents only the fields a Lennar session touches. For the full CVRMLS Features field map (all groups, all stored option values), see `docs/cvrmls/CVRMLS_Features_Field_Map.md` (`AAR-TC-CVRMLS-BM-001-FEA`).

**Bookmarklets:** `bookmarklets/features_a.html`, `bookmarklets/features_b.html` (both universal — post-Session 021 unification)
**Payload keys:** `features_a`, `features_b` — the session writes both; each bookmarklet reads only its own top-level key
**Retired file:** `bookmarklets/lennar_features.html` was deleted in Session 021 after features_a/features_b were confirmed byte-identical to the Lennar variant for every shared checkbox group

### 5.1 Pure statics (11 fields)

Session resolves these to fixed values for every Lennar payload:

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

### 5.2 Community-lookup fields (5 fields)

Session resolves these from the community table below (mirrored from `Lennar_Features_Bookmarklet_Source.md` — will migrate to `Lennar_Community_Reference_Database.md` per §7):

| Field | Payload key |
|---|---|
| Heating | `features_b.heating` |
| Heat Fuel | `features_b.heat_fuel` |
| Pool Y/N | `features_b.pool_yn` |
| Pool Description | `features_b.pool_desc` (conditional on Pool Y/N = `"1"`) |
| Community Amenities | `features_b.community_amenities` |

**Per-community resolution table:**

| Community | Heating | Heat Fuel | Pool Y/N | Pool Desc | Community Amenities |
|---|---|---|---|---|---|
| Harpers Mill TH | `["Input_86_07"]` (Forced Hot Air) | `["Input_87_05"]` (Natural Gas) | `"1"` | `["Input_91_02"]` (Community/Off Site) | `["Input_534_01","Input_534_03","Input_534_04","Input_534_22","Input_534_47"]` |
| Harpers Mill SF | Same as HM TH | Same | Same | Same | Same |
| Creekside Run TH | `["Input_86_08"]` (Heat Pump) | `["Input_87_02"]` (Electric) | `"0"` | `[]` | `["Input_534_01","Input_534_04","Input_534_46","Input_534_22"]` |
| Everstone SF | Same as Creekside Run | Same | Same | Same | Same |
| Watermark SF | `["Input_86_07"]` (Forced Hot Air) | `["Input_87_05"]` (Natural Gas) | `"1"` | `["Input_91_02"]` (Community/Off Site) | `["Input_534_01"]` |

### 5.3 Conditional resolutions (2 fields)

Session resolves these based on other payload values — not builder-specific in principle, but Lennar-specific in the resolution logic because Lennar's `basement_foundation` value depends on `basement_yn` (payload-driven) rather than being fixed:

| Field | Payload key | Resolution logic |
|---|---|---|
| Garage | `features_a.garage` | If `garage_yn === "1"`: `["Input_539_02", "Input_539_05"]` (Attached + Direct Entry), plus `"Input_539_03"` (Auto Door Opener) if applicable. If `garage_yn === "0"`: `[]`. |
| Basement/Foundation | `features_a.basement_foundation` | If `basement_yn === "1"`: `["Input_569_01"]` (Basement-Full). If `basement_yn === "0"`: `["Input_569_12"]` (Slab). |

**Basement/Foundation correction note:** Corrected 2026-07-01 after live discovery on 15824 Greenhart Dr. The previous resolution had Crawl Space (`Input_569_03`) firing for homes with a basement — backwards. Correct value is Basement-Full (`Input_569_01`).

### 5.4 Already-shared, listing-specific fields

These fields are not builder-specific — they come from the email and are payload-driven regardless of builder. Listed here to make the A/B payload-key assignment explicit (missing this assignment for Appl/Equip in July 2026 caused a silent write failure on a live listing):

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

**Style — `Input_541_*` checkbox group** (Lennar always populates — Townhouse listings use `["Input_541_19"]`; SF plan styles confirm per email):

`2-Story 27` · `A-frame 01` · `Cape 02` · `Colonial 03` · `Contemporary 04` · `Cottage/Bungalow 05` · `Craftsman 33` · `Custom 06` · `Dutch Colonial 07` · `Farm House 09` · `Gentleman Farm 10` · `Green Certified Home 31` · `Hi-Rise 30` · `Log 11` · `Low-Rise 28` · `Manufactured Homes 32` · `Mediterranean/Spanish 12` · `Mid-Century Modern 36` · `Mid-Rise 29` · `Modern 34` · `Modular 14` · `Other 15` · `Patio Home 16` · `Ranch 18` · `Rowhouse/Townhouse 19` · `Saltbox 20` · `Split Foyer 21` · `Transitional 23` · `Tri-Level/Quad Level 24` · `Tudor 25` · `Victorian 26`

**Appl/Equip — `Input_81_*` checkbox group** (confirm per email — bolded values appear on nearly every Lennar listing per live confirmation on 15824 Greenhart Dr):

`Attic Fan 01` · `Central Vac 02` · `Compactor 03` · `Countertop Range 04` · **`Dishwasher 05`** · `Disposal 06` · `Downdraft Range 07` · **`Dryer 08`** · `Electric Cooking 09` · `Electric Air Cln 10` · `Exhaust Fan 11` · `Freezer 12` · **`Gas Cooking 13`** · `Gas Grill 14` · `Humidifier 15` · `Ice Maker 16` · `Intercom 17` · **`Microwave 18`** · **`Refrigerator 19`** · `Satellite Dish 20` · `Self/Con Cleaning 21` · `Smoke Alarm 22` · `Stove 23` · **`Stove Hood 24`** (= "Range Hood" on builder forms) · `Sump Pump 25` · **`Wall Oven 26`** · **`Washer 27`** · `Water Purifier 28` · `Water Softener 29` · `Stack Washer/Dryer 30` · `Drop-In Range 31` · `Oven 32` · `Double Oven 33` · `Smooth Top Cooking 34` · `Wine Cooler 35` · `Generator 36` · `Generator Wired 37` · `EV Charging Station 39` · `Fire Sprinkler System 38`

### 5.5 Fields excluded from Lennar Features entirely

Never written for Lennar. Some are excluded from CVRMLS scope generally; others are excluded because they don't apply to Lennar new construction.

- Golf View / Golf Frontage description (Golf Frontage Y/N is always `"0"` for Lennar, so descriptions never apply)
- Internet Connected / Internet Description
- ADU Y/N / ADU Description
- Fenced Y/N / Fenced
- Restrictions
- Green Cert
- Disabl Equipd Y/N / Disabl Feat
- Maintenance Contract Y/N
- Other Heating / Heat Fuel / Cooling description text fields
- Water Type
- Building / Structure
- Farm Type
- Irrigation Source

---

## 6. Community Lookup Pointer

Per-community values for schools, HOA fees, management firms, fee includes, and Features B community fields (heating, heat fuel, pool, community amenities) live in **`Lennar_Community_Reference_Database.md`** (`AAR-TC-LENNAR-DB-001`).

**Community keys used in Lennar payloads** (values match DB section headers by display name):

- `"Harpers Mill TH"` — Harpers Mill (Townhome)
- `"Harpers Mill SF"` — Harpers Mill (Single Family)
- `"Creekside Run TH"` — Creekside Run (Townhome)
- `"Everstone SF"` — Everstone (Single Family)
- `"Watermark SF"` — Watermark (Single Family)
- `"Wynwood at Fox Creek SF"` — pending (no active listings)

Session workflow: read the `community` key from the payload envelope area, look up the corresponding section in the DB, resolve all community-driven fields (Listing Info location cascade, Fee Info values, Features B community fields), and write the resolved concrete values into the appropriate tab keys before generating the final payload.

Bookmarklets never read the `community` key — every community-derived value in the payload is already resolved to a concrete final value.

---

## 7. Open Verification Items

Anything currently guessed or not yet confirmed on a live MLS session. Flagged explicitly here rather than buried, so the "Surface Ambiguity" rule has visible defaults to work against.

### 7.1 Live-verification pending

- **Property details on Harpers Mill taxid path.** Does the tax record actually populate Year Built, Rooms, Levels, Bedrooms, and Lot for Harpers Mill parcels, or does the session need to write these from the email? This schema documents the current Lennar-specific override behavior (always write from email) — but the underlying question of what the tax record contains for a new-construction Lennar parcel has not been confirmed live. If tax records DO populate these, the payload can omit them on taxid path per standard CVRMLS behavior. Related to Session 023 agenda.
- **Street Suffix stored values.** `listing.street_suffix` uses stored option values (`Input_37`). Full stored value set (Dr, Ln, Way, Ct, Pl, Blvd, Rd, St, Ter) has not been extracted — carried forward from Session 017 agenda item 2. Currently the deployed bookmarklet writes the value from payload; if the payload uses a value not in Matrix's stored options, the field remains blank.
- **Fee Includes stored value mappings per community.** `fee.fee_includes` requires stored option value arrays (e.g. `["Input_576_01", "Input_576_19", ...]`). Current mappings live in the retired `Lennar_Bookmarklet_Build_Notes.md` fee table. Step 4 of the doc realignment migrates these into `Lennar_Community_Reference_Database.md`. Until that migration lands, sessions should consult the interim table in the retired Build Notes or the FEA doc's community table for community_amenities equivalents.
- **`fee.addl_fee_desc` scope across communities.** Build Notes' fee table populates Addl Fee Desc for Harpers Mill TH only (`"Initial Working Capital Contribution: $350"`). The Community Reference DB, however, records capital contribution amounts for all communities (`$300` HM SF, `$450` Creekside, `$144` Everstone, `$275` Watermark). Question: should the Capital Contribution text write into `Input_117` (Add'l Fee Dsc) for all Lennar communities, or only Harpers Mill TH (which is the only community with Addl HOA = Yes)? Current schema documents Harpers Mill TH only per deployed behavior; verify against MLS convention on a live standard-listing Fee Info tab.
- **Bath configuration confirmation.** The typical configurations in §4.2 are common defaults, not per-listing truth. Sessions must confirm bath counts from the actual email before writing to payload.
- **Owner Info naming — `agent_related`.** CVRMLS canonical is `owner.agent_related` (per upstream schema, `Input_707`). Legacy Lennar Customization used `owner.agent_related_to_seller`. This schema uses the canonical form. Verify the deployed `owner_info.html` bookmarklet actually reads `payload.owner.agent_related` and not the legacy key. Resolves Session 023 agenda item 5.

### 7.2 Structural decisions made in this consolidation

These are called out so the reasoning is retrievable if any of them turns out to be wrong.

- **`community` key at top level, not nested under `listing`.** Source docs disagreed. Chose top-level because `community` drives lookups across multiple tabs, structurally parallel to `path`.
- **`"lennar": true` retired.** Envelope's `"builder": "lennar"` supersedes. Introduces a dependency on Step 5 of the doc realignment: `CVRMLS_Payload_Schema.md`'s "Builder Flag Pattern" section describes the old convention and will need updating.
- **`path: "taxid"` canonical form** (no underscore). Per `Payload_Envelope.md` §2. Any legacy `tax_id` occurrence in bookmarklet source or protocol templates should be updated on contact.
- **FEA doc authoritative for Features.** `Lennar_Features_Payload_Schema.md` §TAB 3 is superseded reference only (per its own `**Superseded 2026-07-01**` marker). This schema pulls Features content from FEA.
- **Property details always in payload for Lennar** (`listing.year_built`, `rooms`, `levels`, `lot`, `bedrooms`). Standard CVRMLS behavior is SKIP-TAXID; Lennar overrides because new-construction parcels typically lack these values in tax records. See §7.1 first item.

### 7.3 Depends on other realignment steps

- **Step 3 (Lennar Protocol update):** Step 5b payload template in `Lennar_New_Listing_Protocol.md` currently shows `"community": "..."` at top level (correct) and `"lennar": true` (retiring). Protocol update must regenerate the template against this schema.
- **Step 4 (retire drift):** Four source docs retire once this schema is verified live. Community fee data in Build Notes migrates into the Community DB with stored value mappings added.
- **Step 5 (CVRMLS clarification):** `CVRMLS_Payload_Schema.md`'s Builder Flag Pattern section becomes stale on retirement of `"lennar": true`. Small update to reference envelope pattern.

---

## 8. Complete Payload — Concrete Examples

Two examples showing the actual JSON structure a session generates. Field ordering within objects is not significant; the examples follow a consistent order for readability.

### 8.1 Harpers Mill TH — `"taxid"` path

Illustrates: taxid path omits (street fields, pid, acres, tax_year, legal); Addl HOA = Yes with capital contribution; pool community; Style = Rowhouse/Townhouse.

```json
{
  "mls":       "cvrmls",
  "builder":   "lennar",
  "path":      "taxid",
  "community": "Harpers Mill TH",

  "listing": {
    "county_city":           "Chesterfield",
    "area":                  "54",
    "zip":                   "23832",
    "post_office":           "Chesterfield",
    "subdivision":           "Harpers Mill",
    "neighborhood":          "",
    "elementary":            "Winterpock",
    "middle":                "DeepCreek",
    "high":                  "Cosby",
    "list_price":            "429890",
    "list_date":             "07/15/2026",
    "type":                  "TOWN",
    "attached_yn":           "1",
    "delayed_show":          "0",
    "new_resale":            "NVROC",
    "year_built_desc":       "UNDCON",
    "expire_date":           "12/31/2026",
    "sqft_source":           "04",
    "year_built":            "2026",
    "rooms":                 "6",
    "levels":                "2",
    "lot":                   "17",
    "bedrooms":              "3",
    "sqft_above_finished":   "1650",
    "sqft_below_finished":   "0",
    "sqft_above_unfinished": "0",
    "sqft_below_unfinished": "0"
  },

  "bath": {
    "basement": { "desc": "",   "full": "0", "half": "0" },
    "level1":   { "desc": "",   "full": "0", "half": "1" },
    "level2":   { "desc": "TS", "full": "2", "half": "0" },
    "level3":   { "desc": "",   "full": "0", "half": "0" },
    "level4":   { "desc": "",   "full": "0", "half": "0" }
  },

  "features_a": {
    "style":              ["Input_541_19"],
    "structure":          ["Input_70_03"],
    "siding":             ["Input_71_22"],
    "roof":               ["Input_72_12"],
    "flooring":           ["Input_73_17"],
    "attic":              ["Input_241_09"],
    "golf_frontage_yn":   "0",
    "water":              ["Input_676_PW"],
    "sewer":              ["Input_670_PBLCSR"],
    "parking":            ["Input_519_02"],
    "exterior":           ["Input_570_03"],
    "interior":           ["Input_568_11"],
    "garage_yn":          "1",
    "garage":             ["Input_539_02", "Input_539_05", "Input_539_03"],
    "num_cars":           "1",
    "basement_yn":        "0",
    "basement_foundation":["Input_569_12"],
    "num_fp":             "0",
    "fireplace":          []
  },

  "features_b": {
    "water_heater":         ["Input_571_01"],
    "cooling":              ["Input_88_06"],
    "wall_type":            ["Input_254_02"],
    "heating":              ["Input_86_07"],
    "heat_fuel":            ["Input_87_05"],
    "pool_yn":              "1",
    "pool_desc":            ["Input_91_02"],
    "community_amenities":  ["Input_534_01","Input_534_03","Input_534_04","Input_534_22","Input_534_47"],
    "appl_equip":           ["Input_81_05","Input_81_08","Input_81_13","Input_81_18","Input_81_19","Input_81_24","Input_81_26","Input_81_27"],
    "porch":                ["Input_92_02"],
    "unit_placement":       []
  },

  "general": {
    "waterfront":       "N",
    "model_available":  "0",
    "disclosures":      ["NOTREQ"],
    "lead_disclosure":  ["NOTREQ"],
    "assd_improvement": "0"
  },

  "remarks": {
    "remarks":        "Beautiful new townhome...finishes, and layout may vary.",
    "agent_comments": ""
  },

  "fee": {
    "hoa_condo":           "1",
    "membership_required": "1",
    "fee_desc":            ["01"],
    "allow_onsite":        [],
    "addl_hoa":            "1",
    "fee_amount":          "800.00",
    "fee_period":          "YR",
    "management_firm":     "ACS West Management",
    "fee_includes":        ["Input_576_19","Input_576_01","Input_576_25","Input_576_10","Input_576_14","Input_576_15"],
    "addl_fee_amount":     "70.00",
    "addl_fee_desc":       "Initial Working Capital Contribution: $350"
  },

  "owner": {
    "owner_name":     "Lennar",
    "occupant_name":  "None",
    "occupied_by":    "V",
    "owner_agent":    "0",
    "agent_related":  "0",
    "owned_by":       ["02"],
    "possession":     ["01"]
  },

  "agent_office": {
    "type":         "MO",
    "limited_rep":  "1"
  },

  "showing": {
    "accompany_show":          false,
    "appt_required":           true,
    "showing_instr_2":         "NLCS",
    "lockbox_type":            "",
    "additional_instructions": ""
  }
}
```

**Omitted keys** (present in the schema, absent from this payload):
- `listing.pid`, `listing.street_num`, `listing.street_dir`, `listing.street_name`, `listing.street_suffix` — taxid path, Matrix pre-populates
- `general.acres`, `general.tax_year`, `general.legal` — taxid path, Matrix pre-populates
- `tour` — no virtual tour link in the email

### 8.2 Watermark SF — `"new"` path

Illustrates: new path includes street fields, pid, tax_year, legal; Addl HOA = No; pool community with only Association amenity; Style TBD (SF plan style — sessions confirm per email or flag as ambiguity).

```json
{
  "mls":       "cvrmls",
  "builder":   "lennar",
  "path":      "new",
  "community": "Watermark SF",

  "listing": {
    "county_city":           "Chesterfield",
    "area":                  "54",
    "zip":                   "23234",
    "post_office":           "Chesterfield",
    "subdivision":           "Watermark",
    "neighborhood":          "",
    "elementary":            "Hopkins",
    "middle":                "FallingCreek",
    "high":                  "Bird",
    "list_price":            "527040",
    "list_date":             "07/15/2026",
    "type":                  "SFR",
    "attached_yn":           "0",
    "delayed_show":          "0",
    "new_resale":            "NVROC",
    "year_built_desc":       "UNDCON",
    "expire_date":           "12/31/2026",
    "sqft_source":           "04",
    "pid":                   "TBD",
    "street_num":            "7012",
    "street_dir":            "",
    "street_name":           "Sanguine",
    "street_suffix":         "Mews",
    "year_built":            "2026",
    "rooms":                 "8",
    "levels":                "2",
    "lot":                   "42",
    "bedrooms":              "4",
    "sqft_above_finished":   "2340",
    "sqft_below_finished":   "0",
    "sqft_above_unfinished": "0",
    "sqft_below_unfinished": "0"
  },

  "bath": {
    "basement": { "desc": "",   "full": "0", "half": "0" },
    "level1":   { "desc": "",   "full": "0", "half": "1" },
    "level2":   { "desc": "TS", "full": "2", "half": "0" },
    "level3":   { "desc": "",   "full": "0", "half": "0" },
    "level4":   { "desc": "",   "full": "0", "half": "0" }
  },

  "features_a": {
    "style":              [],
    "structure":          ["Input_70_03"],
    "siding":             ["Input_71_22"],
    "roof":               ["Input_72_12"],
    "flooring":           ["Input_73_17"],
    "attic":              ["Input_241_09"],
    "golf_frontage_yn":   "0",
    "water":              ["Input_676_PW"],
    "sewer":              ["Input_670_PBLCSR"],
    "parking":            [],
    "exterior":           [],
    "interior":           [],
    "garage_yn":          "1",
    "garage":             ["Input_539_02", "Input_539_05", "Input_539_03"],
    "num_cars":           "2",
    "basement_yn":        "0",
    "basement_foundation":["Input_569_12"],
    "num_fp":             "0",
    "fireplace":          []
  },

  "features_b": {
    "water_heater":         ["Input_571_01"],
    "cooling":              ["Input_88_06"],
    "wall_type":            ["Input_254_02"],
    "heating":              ["Input_86_07"],
    "heat_fuel":            ["Input_87_05"],
    "pool_yn":              "1",
    "pool_desc":            ["Input_91_02"],
    "community_amenities":  ["Input_534_01"],
    "appl_equip":           [],
    "porch":                [],
    "unit_placement":       []
  },

  "general": {
    "waterfront":       "N",
    "model_available":  "0",
    "disclosures":      ["NOTREQ"],
    "lead_disclosure":  ["NOTREQ"],
    "assd_improvement": "0",
    "acres":            "",
    "tax_year":         "0",
    "legal":            "TBD"
  },

  "remarks": {
    "remarks":        "",
    "agent_comments": ""
  },

  "fee": {
    "hoa_condo":           "1",
    "membership_required": "1",
    "fee_desc":            ["01"],
    "allow_onsite":        [],
    "addl_hoa":            "0",
    "fee_amount":          "180.00",
    "fee_period":          "QU",
    "management_firm":     "ACS West Management",
    "fee_includes":        ["Input_576_19","Input_576_25","Input_576_10","Input_576_11"],
    "addl_fee_amount":     "",
    "addl_fee_desc":       ""
  },

  "owner": {
    "owner_name":     "Lennar",
    "occupant_name":  "None",
    "occupied_by":    "V",
    "owner_agent":    "0",
    "agent_related":  "0",
    "owned_by":       ["02"],
    "possession":     ["01"]
  },

  "agent_office": {
    "type":         "MO",
    "limited_rep":  "1"
  },

  "showing": {
    "accompany_show":          false,
    "appt_required":           true,
    "showing_instr_2":         "NLCS",
    "lockbox_type":            "",
    "additional_instructions": ""
  }
}
```

**Notes on this example:**
- `style: []` reflects a Style that hasn't been confirmed for this SF plan — a real session would either confirm the value against `Input_541_*` codes or surface as ambiguity per the Standing Rule
- `parking`, `exterior`, `interior`, `appl_equip`, `porch` shown as `[]` — real listings populate these from the email
- `fee.addl_fee_amount` and `addl_fee_desc` are blank per the current Build Notes convention; if §7.1 verification confirms Capital Contribution should write for all communities, `addl_fee_desc` would carry `"Capital Contribution Fee: $275"`

---

## Retirement Notes

What survived, what changed, what dropped:

| Source doc | Section | Disposition |
|---|---|---|
| `Lennar_Bookmarklet_Customization.md` | Full doc | **Migrated in full.** Statics tables, community lookup structure, per-tab resolution details all carry into §§4–5. |
| `Lennar_Bookmarklet_Build_Notes.md` | Community Dropdown Values | Migrated into §4.1 Field-by-field table and the community keys in §6. |
| " | Bath Info Typical Configurations | Migrated into §4.2. |
| " | Fee Info Per Community | Structural pattern migrated into §4.6 and §5.2 references. Per-community fee data migrates into Community DB (Step 4). |
| " | Listing Info Pending Extractions | Migrated into §7.1 (Street Suffix stored values). |
| " | General Info Lennar New Path Statics | Migrated into §4.4. |
| " | Copy Path Notes | Deferred — not yet in scope. Kept as a footnote in §3 for future. |
| " | Bookmarklet Status | Dropped — status tracking lives in `Lennar_New_Listing_Protocol.md`. |
| `Lennar_Features_Payload_Schema.md` | Payload envelope / builder flag | **Dropped.** Replaced by envelope pattern per §2. |
| " | TAB 1 Listing Info | **Dropped — stale Input IDs.** (`Input_6` street num, `Input_10` zip, etc. — canonical values in §4.1 are from CVRMLS upstream: `Input_34`, `Input_635`.) |
| " | TAB 2 Bath Info | Content confirmed against upstream — canonical values in §4.2. |
| " | TAB 3 Features | **Superseded per its own marker.** FEA doc is authoritative — content in §5. |
| " | TAB 4 General Info | Content confirmed against upstream — canonical values in §4.4. |
| " | TAB 5 Remarks | Content confirmed — §4.5. |
| " | TAB 6 Fee Info | **Dropped — stale Input IDs.** (`Input_48`, `Input_49`, `Input_52`, `Input_53`, `Input_55`, etc. — canonical values in §4.6 are from CVRMLS upstream: `Input_109`, `Input_112`, `Input_110`, `Input_113`, `Input_705`.) |
| " | TABs 7–11 | Content confirmed against upstream / Customization; canonical in §§4.7–4.11. |
| " | Fields Excluded list | Migrated into §5.5. |
| `Lennar_Features_Bookmarklet_Source.md` (FEA) | Non-Lennar JS block | Dropped — belongs in CVRMLS bookmarklet source, not the Lennar schema. |
| " | Features — Lennar Resolution | **Migrated in full** into §5. |
| " | Community table | Migrated into §5.2. |

**Files retiring after this schema is verified live** (Step 4 of the doc realignment execution):
- `Lennar_Bookmarklet_Customization.md`
- `Lennar_Bookmarklet_Build_Notes.md`
- `Lennar_Features_Payload_Schema.md`
- `Lennar_Features_Bookmarklet_Source.md`

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-07-15 | Andrew Rich / Claude | Initial consolidated schema. Merges content from `Lennar_Bookmarklet_Customization.md`, `Lennar_Bookmarklet_Build_Notes.md`, `Lennar_Features_Payload_Schema.md` (Features section only — Listing Info and Fee Info dropped as stale), and `Lennar_Features_Bookmarklet_Source.md`. Aligns to `Payload_Envelope.md` — retires `"lennar": true` flag; adopts `"builder": "lennar"` from envelope. Top-level `community` placement resolves prior drift. Canonical `owner.agent_related` (per CVRMLS upstream). Canonical `path: "taxid"` (no underscore). |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Consolidated Lennar payload schema — runtime source of truth for Lennar CVRMLS session pack (per `Payload_Envelope.md` §3).*
*Upstream: `docs/cvrmls/CVRMLS_Payload_Schema.md` (`AAR-TC-CVRMLS-PL-001`).*
*Community lookup: `docs/lennar/Lennar_Community_Reference_Database.md` (`AAR-TC-LENNAR-DB-001`).*
*Full Features field map (all groups): `docs/cvrmls/CVRMLS_Features_Field_Map.md` (`AAR-TC-CVRMLS-BM-001-FEA`).*
*This is a living document. Update version history and version_date with each revision.*

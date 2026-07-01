---
title: CVRMLS Matrix Payload Schema
document_id: AAR-TC-CVRMLS-PL-001
version: 1.0
version_date: 2026-06-29
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC CVRMLS Matrix Bookmarklet
---

# CVRMLS Matrix Payload Schema
### AAR-TC Transaction Services | Document ID: AAR-TC-CVRMLS-PL-001

---

## Purpose

This document defines the universal clipboard payload schema for CVRMLS Matrix bookmarklet use. It is the baseline from which builder-specific implementations are derived. Builder customizations (hardcoded statics, community lookup tables, flag keys) are layered on top of this structure — see the relevant builder schema doc for specifics.

For the Lennar implementation, see `docs/lennar/Lennar_Features_Payload_Schema.md` (`AAR-TC-LENNAR-BM-SCH-001`).

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 0.1 | 2026-06-26 | Andrew Rich / Claude | Stub created as `Non_Lennar_Payload_Schema.md`. Core behavioral distinctions documented. |
| 0.2 | 2026-06-27 | Andrew Rich / Claude | Renamed and reframed as universal CVRMLS baseline. Stale source file reference updated. Moved to `docs/cvrmls/`. |
| 1.0 | 2026-06-29 | Andrew Rich / Claude | Full Phase 1 payload schema defined for non-Lennar (standard listing) workflow. All tabs in scope documented with field classifications, taxid path skip behavior, session rules, and known source bugs. Features key stubbed — Phase 2 only. |

---

## Builder Flag Pattern

Builder-specific payloads include a top-level flag key that bookmarklets use to detect the implementation and gate builder-specific writes.

| Key | Value | Meaning |
|---|---|---|
| `"lennar": true` | present | Lennar implementation — apply Lennar statics and community lookup |
| *(key absent)* | — | Universal/non-builder — fully payload-driven, no hardcoded constants |

Never include `"lennar": false` — omit the key entirely for non-builder payloads. The absence is the signal.

---

## Key Behavioral Distinctions — Universal vs Builder

| Behavior | Universal | Lennar |
|---|---|---|
| `lennar` key | Omitted | `true` |
| `community` key | Omitted — all values in payload directly | Present — drives community lookup table |
| `path` | `"new"` or `"taxid"` as applicable | `"new"` or `"taxid"` per community |
| Owner Name (`Input_118`) | From `owner.owner_name` in payload | Hardcoded `"Lennar"` — force overwrite |
| Assd Improvement (`Input_248`) | Pre-populated from tax record on taxid path — skip | Write `"0"` — new construction never pre-populated |
| Fee Info | Fully payload-driven | Community lookup table drives most values |
| Expire Date | From `listing.expire_date` in payload | Hardcoded per Master Listing Agreement |
| Location cascade fields | From payload directly | Resolved from community lookup table |

---

## `path` Key

Controls which fields the bookmarklet writes vs skips. Always include at the top level.

```json
{ "path": "new" }     // Clean slate — bookmarklet fills all fields
{ "path": "taxid" }   // Tax record pre-populated — bookmarklet skips pre-filled fields
{ "path": "copy" }    // Copied from existing listing — bookmarklet fills listing-specific fields only
```

---

## Phase 1 Scope — Standard Listing (Non-Lennar)

This schema defines the Phase 1 clipboard payload for a standard (non-Lennar) Tax ID path listing. Phase 1 covers all stable structural data: Listing Info, Room Info, Bath Info, General Info, Fee Info, Owner Info, Showing Instructions, and Agent/Office Info. Features are Phase 2 only.

**Entry path:** `"taxid"` always for standard listings. The `path` key controls which fields the bookmarklet writes vs. skips.

**Phase 2 (Features update)** is a separate payload triggered when Tier 3 input arrives (seller/agent notes, photo review). It targets the Features tab only. Phase 2 schema is pending Features bookmarklet build-out — see `docs/cvrmls/CVRMLS_Features_Field_Map.md`.

---

## Field Classification Key

| Code | Meaning |
|---|---|
| **DYN** | Dynamic — comes from this payload; varies by listing |
| **SKIP-TAXID** | Pre-populated by Matrix on taxid path — bookmarklet skips; omit key from taxid payload |
| **MANUAL** | Always manual — not in bookmarklet scope; not in payload |
| **EXCL** | Excluded from non-Lennar scope entirely — not written, not in payload |
| **KNOWN-BUG** | Current bookmarklet source behavior does not match confirmed protocol; fix pending Item 3 |

---

## TAB 1 — Listing Info

**Cascade fields:** County/City → Area → ZIP → Subdivision → Schools. Executed in sequence with await.
**Map fields (always manual):** Latitude, Longitude, Directions — never in payload.
**Post Office and Subdivision:** Always manual — not in bookmarklet scope.

| Key | Input ID | Class | Notes |
|---|---|---|---|
| `listing.county_city` | `Input_29` | DYN | Stored option value — see `CVRMLS_County_City_Reference.md` (AAR-TC-CVRMLS-CC-001). Must fire cascade even on taxid path — downstream dropdowns depend on it. |
| `listing.area` | `Input_30` | DYN | Stored option value — see `CVRMLS_County_City_Reference.md` |
| `listing.list_price` | `Input_31` | DYN | e.g. `"425000"` — may be blank if not yet confirmed at intake |
| `listing.list_date` | `Input_160` | DYN | Today's date — e.g. `"06/29/2026"` |
| `listing.type` | `Input_849` | DYN | `"SFR"` or `"TOWN"` |
| `listing.attached_yn` | `Input_850` | DYN | `"1"` (Yes) for TH; `"0"` (No) for SF |
| `listing.expire_date` | `Input_162` | DYN | e.g. `"12/31/2027"` |
| `listing.delayed_show` | `Input_32` | DYN | `"0"` (No) default; `"1"` (Yes) if agent requests |
| `listing.new_resale` | `Input_42` | DYN | `"EXIST"` for standard resale |
| `listing.year_built_desc` | `Input_45` | DYN | e.g. `"EXIST"` — confirm from old MLS sheet |
| `listing.sqft_source` | `Input_97` | DYN | `"01"` (Per Tax) always for standard listings |
| `listing.sqft_above_finished` | `Input_879` | DYN | From tax record |
| `listing.sqft_below_finished` | `Input_882` | DYN | `"0"` if no basement |
| `listing.sqft_above_unfinished` | `Input_880` | DYN | `"0"` if none |
| `listing.sqft_below_unfinished` | `Input_883` | DYN | `"0"` if none |
| `listing.street_dir` | `Input_35` | DYN | `""` if none — confirmed blank from tax record; bookmarklet writes regardless of path |
| `listing.elementary` | `Input_51` | DYN | Stored option value — see `CVRMLS_County_City_Reference.md` |
| `listing.middle` | `Input_53` | DYN | Stored option value — see `CVRMLS_County_City_Reference.md` |
| `listing.high` | `Input_52` | DYN | Stored option value — see `CVRMLS_County_City_Reference.md` |
| `listing.street_num` | `Input_34` | SKIP-TAXID | Pre-populated from tax record |
| `listing.street_name` | `Input_36` | SKIP-TAXID | Pre-populated from tax record |
| `listing.street_suffix` | `Input_37` | SKIP-TAXID | Pre-populated from tax record |
| `listing.zip` | `Input_635` | SKIP-TAXID | Pre-populated from cascade — set from payload after cascade settles |
| `listing.year_built` | `Input_44` | SKIP-TAXID | Pre-populated from tax record |
| `listing.rooms` | `Input_48` | SKIP-TAXID | Pre-populated from tax record |
| `listing.levels` | `Input_49` | SKIP-TAXID | Pre-populated from tax record |
| `listing.bedrooms` | `Input_47` | SKIP-TAXID | Pre-populated from tax record |
| `listing.lot` | `Input_622` | SKIP-TAXID | Pre-populated from tax record |
| `listing.pid` | `Input_99` | SKIP-TAXID | Pre-populated from tax record |
| `listing.post_office` | `Input_41` | MANUAL | Not in bookmarklet scope |
| `listing.subdivision` | `Input_259` | MANUAL | Not in bookmarklet scope |

**Note on County/City and cascade:** County/City pre-populates on taxid path but the bookmarklet must still set and fire it to trigger the cascade. Without firing `Input_29`, the Area and Schools dropdowns will be empty. This is the one SKIP-TAXID field the bookmarklet always writes.

---

## TAB 2 — Room Info

Non-Lennar only — Lennar skips this tab. Phase 1 includes room data from the old MLS sheet.

**Open question (unresolved):** Confirm whether `REPEAT0` row is reliably present on page load without calling `showAnotherRow()` first. Bookmarklet build is pending this confirmation.

| Key | Notes |
|---|---|
| `room` | Array of room objects — one per room |
| `room[].type` | Room type stored value |
| `room[].length` | Integer — feet |
| `room[].width` | Integer — feet |
| `room[].level` | Level stored value |
| `room[].desc` | Room description — flooring, closet, ceiling fan, ensuite notes |

---

## TAB 3 — Bath Info

All fields dynamic. Bath counts do not pre-populate on taxid path.

| Key | Input ID | Notes |
|---|---|---|
| `bath.basement.desc` | `Input_57` | `""`, `"S"`, `"T"`, or `"TS"` — only needed when full baths > 0 |
| `bath.basement.full` | `Input_61` | Integer as string — always explicit `"0"`, never blank |
| `bath.basement.half` | `Input_65` | Integer as string — always explicit `"0"`, never blank |
| `bath.level1.desc` | `Input_58` | |
| `bath.level1.full` | `Input_62` | |
| `bath.level1.half` | `Input_66` | |
| `bath.level2.desc` | `Input_59` | |
| `bath.level2.full` | `Input_63` | |
| `bath.level2.half` | `Input_67` | |
| `bath.level3.desc` | `Input_60` | |
| `bath.level3.full` | `Input_64` | |
| `bath.level3.half` | `Input_68` | |
| `bath.level4.desc` | `Input_737` | Rarely used |
| `bath.level4.full` | `Input_738` | |
| `bath.level4.half` | `Input_739` | |

---

## TAB 4 — Features

**Phase 2 only.** Omit from Phase 1 payload entirely. Features are populated in a separate session when Tier 3 input is available.

Full schema pending Features bookmarklet build-out. Reference: `docs/cvrmls/CVRMLS_Features_Field_Map.md` (AAR-TC-CVRMLS-BM-001-FEA).

---

## TAB 5 — General Info

**Taxid path behavior:** Acres and Legal Description pre-populate from the tax record — skip. Assd Improvement also pre-populates on taxid path — skip. Model Available is excluded from non-Lennar scope entirely.

| Key | Input ID | Class | Notes |
|---|---|---|---|
| `general.waterfront` | `Input_94` | DYN | `"N"` for most listings; `"Y"` if waterfront |
| `general.disclosures` | `Input_102_*` | DYN | Checkbox array — e.g. `["LISTAT"]`. Uncheck all, then check from payload. |
| `general.lead_disclosure` | `Input_103_*` | DYN | Checkbox array — e.g. `["LISTAT"]` |
| `general.body_of_water` | `Input_696` | DYN | Name of the body of water — e.g. `"James River"`, `"Lake Anna"`, `"pond"`. Required when `waterfront = "Y"`; omit otherwise. |
| `general.lot_dimensions` | `Input_96` | DYN | Optional — e.g. `"100x150"`. From old MLS sheet or agent. |
| `general.lot_desc` | `Input_*` | DYN | Optional — checkbox array. Option list TBD during build. |
| `general.energy_efficient` | `Input_703` | DYN | Optional — omit if none |
| `general.pre_qual_letter` | `Input_702` | DYN | Optional — omit if none |
| `general.investor_rental_cap` | `Input_697` | DYN | Optional — omit if none |
| `general.water_depth` | `Input_700` | DYN | Optional — omit if none |
| `general.model_furnished` | `Input_250` | DYN | Optional — omit if none |
| `general.acres` | `Input_95` | SKIP-TAXID | Pre-populated from tax record |
| `general.legal` | `Input_100` | SKIP-TAXID | Pre-populated from tax record |
| `general.assd_improvement` | `Input_248` | SKIP-TAXID | Pre-populated from tax record on taxid path — skip |
| `general.model_available` | `Input_249` | EXCL | Non-Lennar scope only; not written |

**Does Convey / Does Not Convey / Min Deposit:** These fields are specific to the prior sale transaction and must never be carried forward from an old MLS sheet. Leave blank / unchecked.

---

## TAB 6 — Remarks

Not a Phase 1 blocking field. Include when available; leave blank if the agent writes their own or remarks are not yet ready.

| Key | Input ID | Notes |
|---|---|---|
| `remarks.remarks` | `Input_107` | Public remarks — 2048 char max |
| `remarks.agent_comments` | `Input_108` | Agent-only — 1000 char max |

Copyright Agreement (`Input_662`) is hardcoded to `"1"` (Yes) by the bookmarklet — not in payload.

---

## TAB 7 — Fee Info

**If no HOA:** include `fee.hoa_condo = "0"` and omit all other fee keys. The bookmarklet sets `Input_109` to No and stops.

**If HOA:** full fee payload applies.

| Key | Input ID | Class | Notes |
|---|---|---|---|
| `fee.hoa_condo` | `Input_109` | DYN | **Required.** `"1"` (Yes) or `"0"` (No). If `"0"`, all other fee keys omitted. **KNOWN-BUG:** current source hardcodes `"1"` — fix in Item 3. |
| `fee.membership_required` | `Input_112` | DYN | `"1"` (Yes) or `"0"` (No). Only include when `hoa_condo = "1"`. **KNOWN-BUG:** current source hardcodes `"1"` — fix in Item 3. |
| `fee.addl_hoa` | `Input_719` | DYN | `"0"` default |
| `fee.fee_amount` | `Input_110` | DYN | e.g. `"250.00"` |
| `fee.fee_period` | `Input_113` | DYN | `"MO"`, `"QU"`, or `"YR"` |
| `fee.management_firm` | `Input_705` | DYN | Blank if none |
| `fee.fee_desc` | `Input_111_*` | DYN | Checkbox array — e.g. `["01"]` for Community Association |
| `fee.fee_includes` | `Input_576_*` | DYN | Checkbox array |
| `fee.allow_onsite` | `Input_116_*` | DYN | Checkbox array — `[]` to uncheck all |
| `fee.addl_fee_amount` | `Input_115` | DYN | Blank if none |
| `fee.addl_fee_desc` | `Input_117` | DYN | Blank if none |

---

## TAB 8 — Owner Info

**Session check (every listing, before payload):** Surface the owner names pulled from the tax record and ask for confirmation — *"The deed shows [Name 1] and [Name 2] — does this look correct, or does the seller name need to be updated?"* This catches both LLC/investor overrides and unexpected names on the deed that the agent may not be aware of. Seller name verification is also an Aframe task; the session is explicitly in the loop.

**Default behavior:** If confirmed correct, omit `owner_name` and `owner_name_2` from the payload. The bookmarklet leaves the Matrix pre-fill untouched.

**Override behavior:** If the seller name needs to change (LLC, corrected name, etc.), include the keys in the payload. The bookmarklet writes them, overriding the tax record pre-fill.

| Key | Input ID | Class | Notes |
|---|---|---|---|
| `owner.owner_name` | `Input_118` | DYN (conditional) | Omit by default — include only if override confirmed in session check |
| `owner.owner_name_2` | `Input_857` | DYN (conditional) | Omit by default — include only if override confirmed |
| `owner.occupant_name` | `Input_119` | DYN | `""` if owner-occupied or vacant |
| `owner.occupied_by` | `Input_606` | DYN | e.g. `"O"` (Owner), `"V"` (Vacant), `"T"` (Tenant) |
| `owner.owned_by` | `Input_120_*` | DYN | Checkbox array — e.g. `["01"]` for Individual |
| `owner.possession` | `Input_121_*` | DYN | Checkbox array — e.g. `["01"]` for At Closing |
| `owner.owner_phone` | `Input_122` | DYN | `""` if not provided |
| `owner.occupant_phone` | `Input_123` | DYN | `""` if not applicable |
| `owner.owner_agent` | `Input_124` | DYN | `"0"` (No) default |
| `owner.agent_related` | `Input_707` | DYN | `"0"` (No) default |

---

## TAB 9 — Agent/Office Info

No payload key — all fields are hardcoded in the bookmarklet for non-Lennar. Bookmarklet fires without reading clipboard.

| Field | Input ID | Value | Notes |
|---|---|---|---|
| List Agent Code | `Input_159` | *(pre-filled)* | Never touch |
| Co-List Agent Code | `Input_170` | `""` default | Confirm at session start — write code manually in Matrix if agent profile specifies one |
| Type | `Input_163` | `"ER"` | Exclusive Right — non-Lennar standard |
| Limited Rep | `Input_164` | `"0"` | No — non-Lennar standard |

---

## TAB 10 — Showing Instructions

Defaults are protocol-locked. Only `additional_instructions` varies.

| Key | Input ID | Notes |
|---|---|---|
| `showing.accompany_show` | `Input_722_AS` | `false` default |
| `showing.appt_required` | `Input_722_AR` | `true` always |
| `showing.showing_instr_2` | `Input_136` | `"NLCS"` default; `"LBGD"` if vacant per Cognito form |
| `showing.lockbox_type` | `Input_333` | Always Sentrilock — stored option value |
| `showing.sentrilock_serial` | `Input_732` | 7-digit number — bookmarklet zero-pads to 8 chars; enter when known |
| `showing.additional_instructions` | `Input_138` | Verbatim from agent — `""` if none |

---

## TAB 11 — Virtual Tour Info

Skip this tab if no virtual tour URL is provided.

| Key | Input ID | Notes |
|---|---|---|
| `tour.virtual_tour` | `Input_610` | URL — omit key entirely if none |
| `tour.additional_virtual_tour` | `Input_611` | Second URL — `""` unless provided |

---

## TAB 12 — Internet Display Info

Fully static — all four fields always Yes. No payload key. Bookmarklet fires without clipboard read.

---

## Complete Phase 1 Payload — Standard Listing (Non-Lennar, Tax ID Path)

The session outputs one JSON object. Each bookmarklet reads only its own top-level key. Omit keys for tabs not being run (e.g. omit `tour` if no virtual tour URL; omit `features` always for Phase 1).

```json
{
  "path": "taxid",

  "listing": {
    "county_city":           "",   // stored value — fires cascade; required even on taxid path
    "area":                  "",   // stored value — e.g. "54", "42", "60"
    "list_price":            "",   // e.g. "425000" — blank if not yet confirmed
    "list_date":             "",   // e.g. "06/29/2026"
    "type":                  "",   // "SFR" or "TOWN"
    "attached_yn":           "",   // "1" (Yes) TH; "0" (No) SF
    "expire_date":           "",   // e.g. "12/31/2027"
    "delayed_show":          "0",  // "0" default
    "new_resale":            "",   // "EXIST" for standard resale
    "year_built_desc":       "",   // e.g. "EXIST"
    "sqft_source":           "01", // Per Tax — always for standard listings
    "sqft_above_finished":   "",
    "sqft_below_finished":   "0",  // "0" if no basement
    "sqft_above_unfinished": "0",  // "0" if none
    "sqft_below_unfinished": "0",  // "0" if none
    "street_dir":            "",   // "" if none — bookmarklet writes regardless of path
    "elementary":            "",   // stored value
    "middle":                "",   // stored value
    "high":                  ""    // stored value
    // SKIP on taxid path (Matrix pre-populates from tax record):
    //   street_num, street_name, street_suffix, zip, year_built,
    //   rooms, levels, bedrooms, lot, pid
    // MANUAL (not in bookmarklet scope): post_office, subdivision
    // county_city fires cascade even on taxid path — always include
  },

  "room": [
    { "type": "", "length": 0, "width": 0, "level": "", "desc": "" }
    // One object per room — from old MLS sheet
    // Bookmarklet build pending REPEAT0 open question
  ],

  "bath": {
    "basement": { "desc": "",  "full": "0", "half": "0" },
    "level1":   { "desc": "",  "full": "0", "half": "0" },
    "level2":   { "desc": "",  "full": "0", "half": "0" },
    "level3":   { "desc": "",  "full": "0", "half": "0" },
    "level4":   { "desc": "",  "full": "0", "half": "0" }
    // desc: "" | "S" | "T" | "TS" — only when full > 0
    // full/half: always explicit "0" — never blank
  },

  // features: Phase 2 only — omit from Phase 1 payload entirely

  "general": {
    "waterfront":          "N",  // "N" default; "Y" if waterfront
    "disclosures":         [],   // e.g. ["LISTAT"]
    "lead_disclosure":     [],   // e.g. ["LISTAT"]
    "body_of_water":       "",   // required when waterfront = "Y"; name e.g. "James River", "pond"
    "lot_dimensions":      "",   // optional
    "lot_desc":            [],   // optional — checkbox array; option list TBD
    "energy_efficient":    "",   // optional
    "pre_qual_letter":     "",   // optional
    "investor_rental_cap": "",   // optional
    "water_depth":         "",   // optional
    "model_furnished":     ""    // optional
    // SKIP on taxid path: acres, legal, assd_improvement
    // EXCL (non-Lennar): model_available
    // Does Convey / Does Not Convey / Min Deposit: never carry from old MLS sheet — leave blank
  },

  "remarks": {
    "remarks":        "",  // 2048 char max — blank if not yet available
    "agent_comments": ""   // 1000 char max — blank if none
  },

  // Fee — no HOA case: include only hoa_condo = "0", omit all other fee keys
  // Fee — HOA case: full block below
  "fee": {
    "hoa_condo":           "",   // "1" or "0" — required; KNOWN-BUG: source hardcodes "1"
    "membership_required": "",   // "1" or "0" — only when hoa_condo = "1"; KNOWN-BUG: source hardcodes "1"
    "addl_hoa":            "0",
    "fee_amount":          "",
    "fee_period":          "",   // "MO", "QU", or "YR"
    "management_firm":     "",
    "fee_desc":            [],   // e.g. ["01"]
    "fee_includes":        [],
    "allow_onsite":        [],   // [] to uncheck all
    "addl_fee_amount":     "",
    "addl_fee_desc":       ""
  },

  // Owner — default: omit owner_name and owner_name_2 (leave Matrix pre-fill from tax record)
  // Override: include owner_name / owner_name_2 only if confirmed in session check
  "owner": {
    // "owner_name":  "",  // conditional — include only if session check confirms override needed
    // "owner_name_2": "", // conditional — include only if override confirmed
    "occupant_name":   "",   // "" if owner-occupied or vacant
    "occupied_by":     "",   // "O", "V", or "T"
    "owned_by":        [],   // e.g. ["01"] for Individual
    "possession":      [],   // e.g. ["01"] for At Closing
    "owner_phone":     "",
    "occupant_phone":  "",
    "owner_agent":     "0",
    "agent_related":   "0"
  },

  "showing": {
    "accompany_show":          false,
    "appt_required":           true,   // always true — protocol default
    "showing_instr_2":         "",     // "NLCS" default; "LBGD" if vacant
    "lockbox_type":            "",     // always Sentrilock
    "sentrilock_serial":       "",     // 7-digit; zero-padded to 8 by bookmarklet
    "additional_instructions": ""     // "" if none
  },

  "tour": {
    "virtual_tour":            "",  // omit key entirely if no tour
    "additional_virtual_tour": ""
  }

  // agent_office: no payload key — bookmarklet hardcodes ER / No for non-Lennar
  // internet: no payload key — bookmarklet hardcodes all Yes
}
```

---

*CVRMLS Matrix universal payload schema — non-Lennar Phase 1 standard listing.*
*Builder-specific schemas: `docs/lennar/Lennar_Features_Payload_Schema.md` (AAR-TC-LENNAR-BM-SCH-001).*
*Source JS: `docs/cvrmls/CVRMLS_Bookmarklet_Source.md` (AAR-TC-CVRMLS-BM-SRC-001).*
*Protocol authority: `docs/protocols/New_Seller_Side_Session_Protocol.md` (AAR-TC-SELLER-PROTO-001).*
*This is a living document. Update version history and version_date with each revision.*

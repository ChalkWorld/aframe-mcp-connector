---
title: CVRMLS Matrix Payload Schema
document_id: AAR-TC-CVRMLS-PL-001
version: 0.2
version_date: 2026-06-27
status: Stub — to be completed when full bookmarklet workflow is built out
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

## Payload Schema

The universal payload is fully dynamic — all values come from the payload, no hardcoded constants.

*Full field schema to be completed during universal bookmarklet build-out. Canonical JS source: `docs/cvrmls/CVRMLS_Bookmarklet_Source.md` (`AAR-TC-CVRMLS-BM-SRC-001`) — the non-builder variant in that file is the reference implementation.*

```json
{
  "path": "",
  "listing": {
    "county_city":           "",
    "list_price":            "",
    "list_date":             "",
    "type":                  "",
    "attached_yn":           "",
    "pid":                   "",
    "area":                  "",
    "expire_date":           "",
    "street_num":            "",
    "street_dir":            "",
    "street_name":           "",
    "street_suffix":         "",
    "zip":                   "",
    "post_office":           "",
    "subdivision":           "",
    "neighborhood":          "",
    "year_built":            "",
    "year_built_desc":       "",
    "rooms":                 "",
    "levels":                "",
    "lot":                   "",
    "bedrooms":              "",
    "elementary":            "",
    "middle":                "",
    "high":                  "",
    "sqft_above_finished":   "",
    "sqft_below_finished":   "0",
    "sqft_above_unfinished": "0",
    "sqft_below_unfinished": "0",
    "delayed_show":          "",
    "new_resale":            "",
    "sqft_source":           "",
    "lockbox_type":          "",
    "sentrilock_serial":     ""
  },
  "room": [
    { "type": "", "length": 0, "width": 0, "level": "", "desc": "" }
  ],
  "bath": {
    "basement": { "desc": "", "full": "0", "half": "0" },
    "level1":   { "desc": "", "full": "0", "half": "0" },
    "level2":   { "desc": "", "full": "0", "half": "0" },
    "level3":   { "desc": "", "full": "0", "half": "0" },
    "level4":   { "desc": "", "full": "0", "half": "0" }
  },
  "features": {
    // To be defined during features bookmarklet build-out
    // See docs/cvrmls/CVRMLS_Features_Field_Map.md for full field reference
  },
  "general": {
    "acres":               "",
    "legal":               "",
    "model_available":     "",
    "waterfront":          "",
    "assd_improvement":    "",
    "disclosures":         [],
    "lead_disclosure":     [],
    "model_furnished":     "",
    "investor_rental_cap": "",
    "water_depth":         "",
    "energy_efficient":    "",
    "pre_qual_letter":     "",
    "body_of_water":       "",
    "lot_dimensions":      "",
    "lot_desc":            []
  },
  "remarks": {
    "remarks":        "",
    "agent_comments": ""
  },
  "fee": {
    "addl_hoa":        "",
    "fee_amount":      "",
    "fee_period":      "",
    "management_firm": "",
    "fee_desc":        [],
    "fee_includes":    [],
    "allow_onsite":    [],
    "addl_fee_amount": "",
    "addl_fee_desc":   ""
  },
  "owner": {
    "owner_name":      "",
    "occupant_name":   "",
    "occupied_by":     "",
    "owned_by":        [],
    "possession":      [],
    "owner_phone":     "",
    "owner_name_2":    "",
    "occupant_phone":  "",
    "owner_agent":     "",
    "agent_related":   ""
  },
  "showing": {
    "accompany_show":         false,
    "appt_required":          false,
    "showing_instr_2":        "",
    "lockbox_type":           "",
    "sentrilock_serial":      "",
    "additional_instructions": ""
  },
  "tour": {
    "virtual_tour":            "",
    "additional_virtual_tour": ""
  }
  // internet: no payload key — fully static, all fields always Yes
}
```

---

*CVRMLS Matrix universal payload schema — baseline for all implementations.*
*Builder-specific schemas: `docs/lennar/Lennar_Features_Payload_Schema.md` (AAR-TC-LENNAR-BM-SCH-001).*
*Source JS: `docs/cvrmls/CVRMLS_Bookmarklet_Source.md` (AAR-TC-CVRMLS-BM-SRC-001).*
*This is a living document. Update version history and version_date with each revision.*

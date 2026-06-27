# Lennar MLS Bookmarklet — Full Payload Schema
**Document ID:** AAR-TC-LENNAR-BM-SCH-001
**Version:** 1.1
**Date:** 2026-06-26
**Author:** Andrew Rich / Claude (Anthropic)
**Status:** Active — Living Document

---

## Purpose

This document defines the complete payload schema for the AAR-TC Lennar MLS bookmarklet set. It covers every tab across all launchers — Lennar variant, non-Lennar variant, or shared — and is the authority for what is hardcoded, what comes from the community lookup table, what comes from the clipboard payload, and what is excluded entirely.

The Lennar Features section reflects confirmed values established through live bookmarklet testing on 2026-06-26. All other tab sections are stubbed to the confirmed field map and will be finalized as each bookmarklet is built and tested.

---

## Classification Key

| Code | Meaning |
|---|---|
| **HC** | Hardcoded static — fires automatically every run; same value for all listings |
| **CL** | Community lookup — driven by `community` key; values in the `C` table inside the bookmarklet JS |
| **DYN** | Dynamic — read from the clipboard payload; varies by listing |
| **COND** | Conditional — derived automatically from another field's value; not directly in payload |
| **EXCL** | Excluded — not written by the bookmarklet at all; leave for manual entry or not applicable |
| **SKIP** | Skip on path — written on some entry paths (New / Tax ID / Copy) but not others |

---

## Complete Payload Schema

The full clipboard payload is a single JSON object. Each bookmarklet reads only its own top-level key. Static and excluded fields never appear in the payload.

```json
{
  "community": "",
  "listing": { ... },
  "bath": { ... },
  "features": { ... },
  "general": { ... },
  "remarks": { ... },
  "fee": { ... },
  "showing": { ... },
  "tour": { ... }
}
```

Notes:
- `owner` — no payload key for Lennar; fully static
- `internet` — no payload key for Lennar or non-Lennar; fully static
- `room` — non-Lennar only; Lennar skips Room Info tab entirely

---

## TAB 1 — Listing Info

**Bookmarklet:** `bookmarklets/lennar_listing_info.html` ✅ Built and tested

### Lennar Classification

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| County/City | `Input_29` | DYN | `listing.county_city` — set first; triggers downstream cascade |
| Delayed Show | `Input_32` | HC | `0` (No) |
| List Price | `Input_31` | DYN | `listing.list_price` |
| List Date | `Input_160` | DYN | `listing.list_date` — today's date always; never email date |
| Type | `Input_849` | DYN | `listing.type` — `SFR` or `TOWN` |
| Attached YN | `Input_850` | DYN | `listing.attached_yn` — `1` (TH) / `0` (SF) |
| No Show Until | `Input_33` | EXCL | Leave blank |
| Expected OnMkt Dte | `Input_782` | EXCL | Leave blank |
| PID | `Input_99` | DYN | `listing.pid` — New path: TBD; Tax ID path: pre-populated, skip |
| Area | `Input_36` | DYN | `listing.area` — from community lookup via cascade |
| Street # | `Input_6` | DYN | `listing.street_num` |
| Street Dir | `Input_7` | DYN | `listing.street_dir` — blank if none |
| Street Name | `Input_8` | DYN | `listing.street_name` |
| Street Suffix | `Input_37` | DYN | `listing.street_suffix` — stored option value; TBD confirmation |
| ZIP | `Input_10` | DYN | `listing.zip` — from community lookup via cascade |
| Post Office | `Input_38` | DYN | `listing.post_office` — from community lookup via cascade |
| Subdivision | `Input_12` | DYN | `listing.subdivision` — from community lookup via cascade |
| Neighborhood | `Input_13` | DYN | `listing.neighborhood` — from community lookup; blank except Everstone |
| Year Built | `Input_15` | DYN | `listing.year_built` |
| Rooms | `Input_16` | DYN | `listing.rooms` |
| Levels | `Input_17` | DYN | `listing.levels` |
| Lot # | `Input_19` | DYN | `listing.lot` |
| Bedrooms | `Input_22` | DYN | `listing.bedrooms` |
| Elementary School | `Input_23` | DYN | `listing.elementary` — from community lookup via cascade |
| Middle School | `Input_24` | DYN | `listing.middle` — from community lookup via cascade |
| High School | `Input_25` | DYN | `listing.high` — from community lookup via cascade |
| Sq Ft Above Finished | `Input_26` | DYN | `listing.sqft_above_finished` |
| Sq Ft Below Finished | `Input_27` | DYN | `listing.sqft_below_finished` — `0` if no basement |
| Sq Ft Above Unfinished | `Input_247` | DYN | `listing.sqft_above_unfinished` — `0` if none |
| Sq Ft Below Unfinished | `Input_248` | DYN | `listing.sqft_below_unfinished` — `0` if none |
| Expire Date | `Input_30` | HC | `12/31/2026` — per Master Listing Agreement |
| New Const YN | `Input_848` | HC | `1` (Yes) |
| Sqft Source | `Input_853` | HC | `04` (Per Builder) |
| NVROC / EXIST | `Input_852` | HC | `NVROC` |

### Payload Structure

```json
"listing": {
  "county_city":            "",
  "list_price":             "",
  "list_date":              "",
  "type":                   "",
  "attached_yn":            "",
  "pid":                    "",
  "area":                   "",
  "street_num":             "",
  "street_dir":             "",
  "street_name":            "",
  "street_suffix":          "",
  "zip":                    "",
  "post_office":            "",
  "subdivision":            "",
  "neighborhood":           "",
  "year_built":             "",
  "rooms":                  "",
  "levels":                 "",
  "lot":                    "",
  "bedrooms":               "",
  "elementary":             "",
  "middle":                 "",
  "high":                   "",
  "sqft_above_finished":    "",
  "sqft_below_finished":    "0",
  "sqft_above_unfinished":  "0",
  "sqft_below_unfinished":  "0"
}
```

---

## TAB 2 — Bath Info

**Bookmarklet:** `bookmarklets/lennar_bath_info.html` ✅ Built and tested

### Lennar Classification

All fields dynamic — no Lennar-specific statics for Bath Info. Lennar and non-Lennar variants are functionally identical.

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| Basement — Bath Desc | `Input_57` | DYN | `bath.basement.desc` — blank if no basement |
| Basement — Full Baths | `Input_61` | DYN | `bath.basement.full` |
| Basement — Half Baths | `Input_65` | DYN | `bath.basement.half` |
| Level 1 — Bath Desc | `Input_58` | DYN | `bath.level1.desc` |
| Level 1 — Full Baths | `Input_62` | DYN | `bath.level1.full` |
| Level 1 — Half Baths | `Input_66` | DYN | `bath.level1.half` |
| Level 2 — Bath Desc | `Input_59` | DYN | `bath.level2.desc` |
| Level 2 — Full Baths | `Input_63` | DYN | `bath.level2.full` |
| Level 2 — Half Baths | `Input_67` | DYN | `bath.level2.half` |
| Level 3 — Bath Desc | `Input_60` | DYN | `bath.level3.desc` |
| Level 3 — Full Baths | `Input_64` | DYN | `bath.level3.full` |
| Level 3 — Half Baths | `Input_68` | DYN | `bath.level3.half` |
| Level 4 — Bath Desc | `Input_737` | DYN | `bath.level4.desc` — rarely used |
| Level 4 — Full Baths | `Input_738` | DYN | `bath.level4.full` |
| Level 4 — Half Baths | `Input_739` | DYN | `bath.level4.half` |

Rules: Bath Desc only needed when Full Baths > 0. All numeric fields must be explicit `0` — Matrix flags blanks. Desc values: blank, `S`, `T`, `TS`.

### Payload Structure

```json
"bath": {
  "basement": { "desc": "",   "full": "0", "half": "0" },
  "level1":   { "desc": "",   "full": "0", "half": "0" },
  "level2":   { "desc": "TS", "full": "2", "half": "0" },
  "level3":   { "desc": "",   "full": "0", "half": "0" },
  "level4":   { "desc": "",   "full": "0", "half": "0" }
}
```

---

## TAB 3 — Features

**Bookmarklet:** `bookmarklets/lennar_features.html` ✅ Built and tested (schema patch pending commit)

### Lennar Classification

| Field | Group | Input ID(s) | Class | Value / Notes |
|---|---|---|---|---|
| Style | Checkbox | `Input_541_*` | DYN | `features.style` |
| Structure | Checkbox | `Input_70_03` | HC | Frame |
| Siding | Checkbox | `Input_71_22` | HC | Vinyl |
| Roof | Checkbox | `Input_72_12` | HC | Shingled |
| Flooring | Checkbox | `Input_73_17` | HC | Vinyl - Plank/Tile/Stone |
| Golf Frontage Y/N | Select | `Input_693` | HC | `0` (No) |
| Attic | Checkbox | `Input_241_09` | HC | Access Panel |
| Parking | Checkbox | `Input_519_*` | DYN | `features.parking` |
| Exterior | Checkbox | `Input_570_*` | DYN | `features.exterior` |
| Internet Connected | — | — | EXCL | Not written |
| Garage Y/N | Select | `Input_150` | DYN | `features.garage_yn` — `"1"` or `"0"` |
| Garage — Attached | Checkbox | `Input_539_02` | COND | Auto-checked when `garage_yn` = `"1"` |
| Garage — Direct Entry | Checkbox | `Input_539_05` | COND | Auto-checked when `garage_yn` = `"1"` |
| Garage — Auto Door Opener | Checkbox | `Input_539_03` | DYN | `features.garage_auto_door` — `true`/`false` |
| # Cars | Select | `Input_226` | DYN | `features.num_cars` |
| ADU Y/N | — | — | EXCL | Not written |
| Basement Y/N | Select | `Input_153` | DYN | `features.basement_yn` — `"1"` or `"0"` |
| Basement — Slab | Checkbox | `Input_569_12` | COND | Auto-checked when `basement_yn` = `"0"` |
| Basement — Crawl Space | Checkbox | `Input_569_03` | COND | Auto-checked when `basement_yn` = `"1"` |
| Interior | Checkbox | `Input_568_*` | DYN | `features.interior` |
| Water | Checkbox | `Input_676_PW` | HC | Public Water |
| Sewer/Septic | Checkbox | `Input_670_PBLCSR` | HC | Sewer - Public |
| Fenced Y/N | — | — | EXCL | Not written |
| Restrictions | — | — | EXCL | Not written |
| # FP | Select | `Input_152` | DYN | `features.num_fp` — `"0"` default |
| Fireplace | Checkbox | `Input_90_*` | DYN | `features.fireplace` — only written when `num_fp` > 0 |
| Community Amenities | Checkbox | `Input_534_*` | CL | Driven by community lookup |
| Green Cert | — | — | EXCL | Not written |
| Pool Y/N | Select | `Input_244` | CL | Driven by community lookup |
| Pool Description | Checkbox | `Input_91_02` | COND | Community/Off Site — auto-checked when Pool Y/N = `"1"` |
| Appl/Equip | Checkbox | `Input_81_*` | DYN | `features.appl_equip` — alphabetical; Washer + Dryer separate |
| Heating | Checkbox | `Input_86_*` | CL | Driven by community lookup |
| Water Heater | Checkbox | `Input_571_01` | HC | Electric |
| Disabl Equipd Y/N | — | — | EXCL | Not written |
| Heat/Fuel | Checkbox | `Input_87_*` | CL | Driven by community lookup |
| Porch | Checkbox | `Input_92_*` | DYN | `features.porch` |
| Maintenance Contract Y/N | — | — | EXCL | Not written |
| Unit Placement | Checkbox | `Input_657_*` | DYN | `features.unit_placement` — leave `[]` for SF |
| Cooling | Checkbox | `Input_88_06` | HC | Heat Pump |
| Wall Type | Checkbox | `Input_254_02` | HC | Drywall |

### Community Lookup Table

| Community | Heating | Heat/Fuel | Pool Y/N | Community Amenities |
|---|---|---|---|---|
| Harpers Mill TH | Forced Hot Air (`Input_86_07`) | Natural Gas (`Input_87_05`) | Yes | Association, Clubhouse, Common Area, Playground, Pool |
| Harpers Mill SF | Forced Hot Air (`Input_86_07`) | Natural Gas (`Input_87_05`) | Yes | Association, Clubhouse, Common Area, Playground, Pool |
| Creekside Run | Heat Pump (`Input_86_08`) | Electric (`Input_87_02`) | No | Association, Common Area, Picnic Area, Playground |
| Everstone | Heat Pump (`Input_86_08`) | Electric (`Input_87_02`) | No | Association, Common Area, Picnic Area, Playground |
| Watermark | Forced Hot Air (`Input_86_07`) | Natural Gas (`Input_87_05`) | Yes | Association |

Pool Description is always Community/Off Site (`Input_91_02`) when Pool Y/N = Yes — hardcoded in conditional logic.

### Payload Structure

```json
"features": {
  "style":            [],
  "parking":          [],
  "exterior":         [],
  "garage_yn":        "1",
  "garage_auto_door": false,
  "num_cars":         "",
  "basement_yn":      "0",
  "interior":         [],
  "num_fp":           "0",
  "fireplace":        [],
  "appl_equip":       [],
  "porch":            [],
  "unit_placement":   []
}
```

---

## TAB 4 — General Info

**Bookmarklet:** `bookmarklets/lennar_general_info.html` ✅ Built and tested

### Lennar Classification

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| Acres | `Input_43` | DYN | `general.acres` — New path only; skip on Tax ID path |
| Legal Description | `Input_44` | HC | `TBD` — New path only; skip on Tax ID path |
| Assd Improvement | `Input_246` | EXCL | Not written for Lennar |
| AICUZ | `Input_102_*` | EXCL | Not written |
| Lead Disclosure | `Input_103_*` | EXCL | Not written |

### Payload Structure

```json
"general": {
  "acres": ""
}
```

---

## TAB 5 — Remarks

**Bookmarklet:** `bookmarklets/lennar_remarks.html` ✅ Built and tested

### Lennar Classification

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| Public Remarks | `Input_45` | DYN | `remarks.remarks` — 2048 char max; strip phone number lines |
| Agent Only Comments | `Input_46` | DYN | `remarks.agent_comments` — 1000 char max |
| Copyright YN | `Input_47` | HC | `1` (Yes) |

### Payload Structure

```json
"remarks": {
  "remarks":        "",
  "agent_comments": ""
}
```

---

## TAB 6 — Fee Info

**Bookmarklet:** `bookmarklets/lennar_fee_info.html` ✅ Built and tested

### Lennar Classification

All values community-variable — driven entirely from Community Reference Database. No listing-specific dynamic fields.

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| HOA | `Input_48` | HC | `1` (Yes) — always |
| Membership Required | `Input_49` | HC | `1` (Yes) — always |
| Additional HOA | `Input_51` | DYN | `fee.addl_hoa` — `"1"` Harpers Mill TH only / `"0"` all others |
| Fee $ | `Input_52` | DYN | `fee.fee_amount` — from Community DB |
| Fee Period | `Input_53` | DYN | `fee.fee_period` — `"MO"`, `"QU"`, or `"YR"` |
| Management Firm | `Input_55` | DYN | `fee.management_firm` — blank if none |
| Fee Description | `Input_56_*` | DYN | `fee.fee_desc` — checkbox values from Community DB |
| Fee Includes | `Input_54_*` | DYN | `fee.fee_includes` — checkbox values from Community DB |
| Add'l Fee Amount | `Input_843` | DYN | `fee.addl_fee_amount` — Harpers Mill TH: `"70.00"` / blank others |
| Add'l Fee Desc | `Input_844` | DYN | `fee.addl_fee_desc` — Capital Contribution string from Community DB |

### Payload Structure

```json
"fee": {
  "addl_hoa":        "0",
  "fee_amount":      "",
  "fee_period":      "",
  "management_firm": "",
  "fee_desc":        [],
  "fee_includes":    [],
  "addl_fee_amount": "",
  "addl_fee_desc":   ""
}
```

---

## TAB 7 — Owner Info

**Bookmarklet:** `bookmarklets/lennar_owner_info.html` ✅ Built and tested

### Lennar Classification

Fully static — no payload key for Lennar. Owner Name always force-overwrites to `Lennar` even on Tax ID path (exception to the general Tax ID skip rule).

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| Owner Name | `Input_118` | HC | `Lennar` — always; force-overwrite on Tax ID path |
| All other owner fields | — | EXCL | Not written for Lennar |

No payload key — `owner` section not included in Lennar payload.

---

## TAB 8 — Agent/Office Info

**Bookmarklet:** `bookmarklets/lennar_agent_office_info.html` ✅ Built and tested

### Lennar Classification

Fully static — no payload key. No clipboard read needed.

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| Type | `Input_*` | HC | MLS Only — always |
| Limited Rep | `Input_*` | HC | Yes — always |
| All other fields | — | EXCL | Not written |

No payload key — `agent` section not included in Lennar payload.

---

## TAB 9 — Showing Instructions

**Bookmarklet:** `bookmarklets/lennar_showing_instructions.html` ✅ Built and tested

### Lennar Classification

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| Accompany Show | `Input_722_AS` | HC | Unchecked — always |
| Appt Required | `Input_722_AR` | HC | Checked — always |
| Showing Instr 2 | `Input_136` | HC | `NLCS` (No LB Call Showing Service) |
| LockBox Type | `Input_333` | HC | Blank — no LB for Lennar |
| Supra Serial LB # | `Input_137` | EXCL | Not applicable for Lennar |
| Sentrilock Serial LB # | `Input_732` | EXCL | Not applicable for Lennar |
| Additional Showing Instructions | `Input_138` | DYN | `showing.additional_instructions` — verbatim from email |

### Payload Structure

```json
"showing": {
  "additional_instructions": ""
}
```

---

## TAB 10 — Virtual Tour Info

**Bookmarklet:** `bookmarklets/lennar_virtual_tour_info.html` ✅ Built and tested

### Lennar Classification

Skip tab entirely if no virtual tour URL in email. Both fields always dynamic — Lennar and non-Lennar variants identical.

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| Virtual Tour | `Input_610` | DYN | `tour.virtual_tour` — URL from email |
| Additional Virtual Tour | `Input_611` | DYN | `tour.additional_virtual_tour` — blank unless second link provided |

### Payload Structure

```json
"tour": {
  "virtual_tour":            "",
  "additional_virtual_tour": ""
}
```

---

## TAB 11 — Internet Display Info

**Bookmarklet:** `bookmarklets/lennar_internet_display_info.html` ✅ Built and tested

### Lennar Classification

Fully static — all four fields always Yes. No payload key for Lennar or non-Lennar. No clipboard read needed.

| Field | Input ID | Class | Value / Notes |
|---|---|---|---|
| Internet Display | `Input_227` | HC | `1` (Yes) |
| Address Display | `Input_228` | HC | `1` (Yes) |
| Comments/Reviews | `Input_229` | HC | `1` (Yes) |
| AVM | `Input_230` | HC | `1` (Yes) |

No payload key — `internet` section not included in payload.

---

## Fields Excluded from All Lennar Bookmarklets

Never written under any circumstances. Fill manually in Matrix if applicable or leave blank.

- Internet Connected / Internet Description
- ADU Y/N / ADU Description
- Fenced Y/N / Fenced
- Restrictions
- Green Cert
- Disabl Equipd Y/N / Disabl Feat
- Maintenance Contract Y/N
- Golf View / Golf Frontage description
- Other Heating / Heat Fuel / Cooling description fields
- Water Type
- Building / Structure type
- Farm Type
- Irrigation Source
- AICUZ / Lead Disclosure (General Info)
- Assd Improvement (General Info)
- Supra / Sentrilock serial (Showing Instructions — Lennar only)
- No Show Until / Expected OnMkt Dte (Listing Info)
- Room Info tab — Lennar skips entirely

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-26 | Andrew Rich / Claude | Initial document — Lennar Features schema confirmed through live testing |
| 1.1 | 2026-06-26 | Andrew Rich / Claude | Expanded to full payload schema covering all tabs; non-Features sections stubbed from confirmed field maps |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This document is the authority for the Lennar MLS bookmarklet payload schema. Update version history with each revision.*

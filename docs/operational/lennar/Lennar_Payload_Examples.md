---
title: Lennar Payload Examples
document_id: LENNAR-OPS-EXAMPLES-001
version: 1.0
version_date: 2026-08-19
status: Active
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar Operational Project
---

# Lennar Payload Examples

Companion to `Lennar_Payload_Schema.md`. Contains complete, concrete payload examples for Lennar listings across the path × home-type matrix. Loaded by sessions on fresh new-listing intakes as a shape reference; the schema remains authoritative for field-level detail and rules.

Field ordering within objects is not significant; the examples follow a consistent order for readability.

---

## 1. Harpers Mill TH — `taxid` path

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
    "fee_includes":        ["19","01","25","10","14","15"],
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
- `tour` — no virtual tour link in the intake

---

## 2. Watermark SF — `new` path

Illustrates: new path includes street fields, pid, tax_year, legal; Addl HOA = No; pool community with only the Association amenity; an unresolved SF Style.

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
    "fee_includes":        ["19","25","10","11"],
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

- `style: []` reflects a Style that hasn't been confirmed for this SF plan. A real session resolves it from the intake form's three-option SF set (`Lennar_Payload_Schema.md` §5.4.1) or surfaces it per `Lennar_Project_Protocol.md` §4.1 — it is never left empty in a payload that goes to Andrew.
- `parking`, `exterior`, `interior`, `appl_equip`, `porch` shown as `[]` — real listings populate these from the intake.
- `fee.addl_fee_amount` and `addl_fee_desc` are blank because the capital contribution has not been confirmed for Watermark. See `Lennar_Payload_Schema.md` §4.6 — ask before applying it to an unconfirmed community.

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-08-19 | Initial version. Examples extracted from `docs/lennar/Lennar_Payload_Schema.md` v1.5 §8 during the operational doc set standup. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

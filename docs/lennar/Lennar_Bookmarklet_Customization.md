# Lennar CVRMLS Bookmarklet Customization
**Document ID:** AAR-TC-LENNAR-BM-CUST-001
**Version:** 1.0
**Last Updated:** 2026-06-27
**Base:** `CVRMLS_Bookmarklet_Source.md` (AAR-TC-CVRMLS-BM-SRC-001)
**Status:** Active — Listing Info complete; remaining tabs in progress

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-27 | Andrew Rich / Claude | Split from `Lennar_MLS_Bookmarklet_Source.md` (AAR-TC-LENNAR-BM-SRC-001 v0.1). Lennar-specific variants and community lookup tables extracted here; universal content moved to `CVRMLS_Bookmarklet_Source.md`. |

---

## Purpose

This file contains every Lennar-specific customization on top of the universal CVRMLS bookmarklet source. It is not a standalone document — it is read alongside `CVRMLS_Bookmarklet_Source.md`. The universal source defines the field structure and universal variant JS; this file defines what changes for Lennar.

**When building a Lennar launcher:** start from the universal variant in the CVRMLS source, then apply the overrides documented here.

---

## How Lennar Customization Works

**The `lennar` flag:** All Lennar payloads include a top-level `"lennar": true` key. Bookmarklets read `payload.lennar === true` as `isLennar` to gate Lennar-specific field writes. Non-Lennar payloads omit the key entirely — never include `"lennar": false`.

**Three tiers of Lennar field behavior:**
- **Static** — hardcoded value, fires automatically every run, same for all Lennar listings
- **Community lookup** — driven by `payload.listing.community` key; values resolved from the `COMMUNITIES` table inside the bookmarklet JS
- **Dynamic** — read from the clipboard payload; varies by listing (same as universal)

**Builder flag pattern is extensible.** Any future builder uses the same pattern with its own flag key. The `isLennar` check is the template.

---

## Lennar Payload Additions

These keys are added to or differ from the universal payload schema when `"lennar": true`:

```json
{
  "lennar": true,                    // required — gates all Lennar-specific writes
  "path": "new" | "taxid" | "copy", // same as universal
  "listing": {
    "community": "",                 // Lennar-only — key into COMMUNITIES lookup table
                                     // e.g. "harpers_mill_th", "creekside_run_th"
                                     // county_city, area, zip, post_office, subdivision,
                                     // neighborhood, and schools are resolved from lookup —
                                     // do not include them directly in the payload
    "list_price": "",
    "list_date": "",
    "type": "",
    "attached_yn": "",
    "street_num": "",
    "street_dir": "",
    "street_name": "",
    "street_suffix": "",
    "year_built": "",
    "rooms": "",
    "levels": "",
    "lot": "",
    "bedrooms": "",
    "sqft_above_finished": "",
    "sqft_below_finished": "",
    "sqft_above_unfinished": "",
    "sqft_below_unfinished": ""
    // Lennar statics — never in payload:
    // delayed_show → "0" (No)
    // new_resale → "NVROC" (New, never occupied)
    // year_built_desc → "UNDCON" (Under Construction)
    // expire_date → "12/31/2026" (Master Listing Agreement expiry — update when renewed)
    // sqft_source → "04" (Per Builder)
    // pid → "TBD" on new path; pre-filled on taxid path (skip)
  },
  "general": {
    "acres": ""   // new path only; taxid path pre-populated — skip
    // Lennar statics — never in payload:
    // waterfront → "N"
    // model_available → "0" (No — Input_249 value; note: Input_249 = "N" in Lennar variant)
    // disclosures → ["NOTREQ"]
    // lead_disclosure → ["NOTREQ"]
    // assd_improvement → "0" (Input_248; does not pre-populate for Lennar on either path)
    // legal → "TBD" on new path; taxid path pre-populated — skip
    // tax_year (Input_246) → "0" on new path; taxid path pre-populated — skip
  },
  "showing": {
    "additional_instructions": ""
    // Lennar statics — never in payload:
    // accompany_show → false (unchecked)
    // appt_required → true (checked)
    // showing_instr_2 → "NLCS" (No LB Call Showing Service)
    // lockbox_type → "" (blank — no lockbox for Lennar)
  },
  "fee": {
    // Community-variable — always in payload for Lennar:
    "addl_hoa": "",
    "fee_amount": "",
    "fee_period": "",
    "management_firm": "",
    "fee_includes": [],
    "addl_fee_amount": "",
    "addl_fee_desc": ""
    // Lennar statics — never in payload:
    // hoa_condo → "1" (Yes)
    // membership_required → "1" (Yes)
    // fee_desc → ["01"] (Community Association)
    // allow_onsite → all unchecked
  }
  // owner: no payload key needed — fully static for Lennar (see TAB 8 below)
  // internet: no payload key — fully static, identical to universal
}
```

**Minimal Lennar payload on taxid path** (when only showing instructions needed):
```json
{ "lennar": true, "path": "tax_id" }
```

---

## Community Lookup Table

Stored option values confirmed via live ES session extraction (2026-06-25). Matrix stores multi-word school names without spaces (e.g. `DeepCreek`, `RiverCity`, `FallingCreek`, `HighlandSprings`).

Wynwood at Fox Creek removed — community sold out, no forthcoming listings.

```javascript
var COMMUNITIES = {
  "harpers_mill_th": {
    county_city:  "Chesterfield",
    area:         "54",
    zip:          "23832",
    post_office:  "Chesterfield",
    subdivision:  "Harpers Mill",
    neighborhood: "",
    elementary:   "Winterpock",
    middle:       "DeepCreek",
    high:         "Cosby"
  },
  "harpers_mill_sf": {
    county_city:  "Chesterfield",
    area:         "54",
    zip:          "23832",
    post_office:  "Chesterfield",
    subdivision:  "Harpers Mill",
    neighborhood: "",
    elementary:   "Winterpock",
    middle:       "DeepCreek",
    high:         "Cosby"
  },
  "creekside_run_th": {
    county_city:  "Richmond",
    area:         "60",
    zip:          "23224",
    post_office:  "Richmond",
    subdivision:  "Creekside Run",
    neighborhood: "",
    elementary:   "Reid",
    middle:       "RiverCity",
    high:         "Huguenot"
  },
  "everstone_sf": {
    county_city:  "Henrico",
    area:         "42",
    zip:          "23223",
    post_office:  "Richmond",
    subdivision:  "None",           // "None" is a real Matrix option value for Input_259
    neighborhood: "Everstone",      // text field Input_236
    elementary:   "Harvie",
    middle:       "Fairfield",
    high:         "HighlandSprings"
  },
  "watermark_sf": {
    county_city:  "Chesterfield",
    area:         "54",
    zip:          "23234",
    post_office:  "Chesterfield",
    subdivision:  "Watermark",
    neighborhood: "",
    elementary:   "Hopkins",
    middle:       "FallingCreek",
    high:         "Bird"
  }
};
```

**Entry path assignments by community:**
- Harpers Mill (TH + SF): Tax ID path
- Creekside Run (TH): New path
- Everstone (SF): New path
- Watermark (SF): New path

*Revisit path assignments when tax records are updated for new addresses.*

---

## TAB 1 — Listing Info — Lennar Variant

**Lennar statics hardcoded:** Delayed Show (`0`), New/Resale (`NVROC`), Year Built Description (`UNDCON`), Expire Date (`12/31/2026`), SqFt Source (`04`), PID (`TBD` on new path).
**Community lookup:** County/City, Area, ZIP, Post Office, Subdivision, Neighborhood, Schools resolved from `COMMUNITIES` table via `d.community` key.

```javascript
(function() {

  // --- Helpers ---
  function setField(id, value) {
    var el = document.getElementById(id);
    if (el) { el.value = value; }
  }
  function fireChange(id) {
    var el = document.getElementById(id);
    if (el) { el.dispatchEvent(new Event('change', { bubbles: true })); }
  }
  function wait(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
  }

  // --- Community lookup table ---
  var COMMUNITIES = {
    "harpers_mill_th":  { county_city: "Chesterfield", area: "54", zip: "23832", post_office: "Chesterfield", subdivision: "Harpers Mill",  neighborhood: "", elementary: "Winterpock", middle: "DeepCreek",    high: "Cosby"           },
    "harpers_mill_sf":  { county_city: "Chesterfield", area: "54", zip: "23832", post_office: "Chesterfield", subdivision: "Harpers Mill",  neighborhood: "", elementary: "Winterpock", middle: "DeepCreek",    high: "Cosby"           },
    "creekside_run_th": { county_city: "Richmond",     area: "60", zip: "23224", post_office: "Richmond",     subdivision: "Creekside Run", neighborhood: "", elementary: "Reid",        middle: "RiverCity",    high: "Huguenot"        },
    "everstone_sf":     { county_city: "Henrico",      area: "42", zip: "23223", post_office: "Richmond",     subdivision: "None",          neighborhood: "Everstone", elementary: "Harvie", middle: "Fairfield", high: "HighlandSprings" },
    "watermark_sf":     { county_city: "Chesterfield", area: "54", zip: "23234", post_office: "Chesterfield", subdivision: "Watermark",     neighborhood: "", elementary: "Hopkins",    middle: "FallingCreek", high: "Bird"            }
  };

  navigator.clipboard.readText().then(function(text) {

    var payload = JSON.parse(text);
    var d = payload.listing;
    var path = payload.path || "new";

    // Resolve community lookup
    var comm = COMMUNITIES[d.community] || {};
    if (!comm.county_city) {
      alert('Lennar bookmarklet: unknown community key "' + d.community + '" — fill location fields manually.');
    }

    (async function() {

      // Step 1: County/City cascade
      setField('Input_29', comm.county_city);
      fireChange('Input_29');
      await wait(1500);

      // Step 2: Area cascade
      setField('Input_30', comm.area);
      fireChange('Input_30');
      await wait(800);

      // Step 3: Cascade-dependent fields
      setField('Input_635', comm.zip);
      setField('Input_259', comm.subdivision);
      setField('Input_236', comm.neighborhood  || "");
      setField('Input_51',  comm.elementary);
      setField('Input_53',  comm.middle);
      setField('Input_52',  comm.high);
      setField('Input_41',  comm.post_office);

      // Step 4: Lennar static fields — hardcoded, never in payload
      setField('Input_32',  '0');          // Delayed Show = No
      setField('Input_42',  'NVROC');      // New/Resale = New, never occupied
      setField('Input_45',  'UNDCON');     // Year Built Description = Under Construction
      setField('Input_162', '12/31/2026'); // Expire Date = Master Listing Agreement expiry
                                           // UPDATE THIS when agreement renews
      setField('Input_97',  '04');         // SqFt Source = Per Builder

      // Step 5: Dynamic listing fields from payload
      setField('Input_31',  d.list_price);
      setField('Input_160', d.list_date);
      setField('Input_849', d.type);
      setField('Input_850', d.attached_yn);

      // PID — new path only; taxid path pre-populated
      if (path === "new") {
        setField('Input_99', 'TBD');
      }

      // Step 6: Location — new path only (pre-filled on taxid and copy paths)
      if (path === "new") {
        setField('Input_34', d.street_num);
        setField('Input_35', d.street_dir   || "");
        setField('Input_36', d.street_name);
        setField('Input_37', d.street_suffix);
      }

      // Step 7: Property details — always write
      setField('Input_44',  d.year_built);
      setField('Input_48',  d.rooms);
      setField('Input_49',  d.levels);
      setField('Input_622', d.lot);
      setField('Input_47',  d.bedrooms);

      // Square footage
      setField('Input_879', d.sqft_above_finished   || "0");
      setField('Input_882', d.sqft_below_finished   || "0");
      setField('Input_880', d.sqft_above_unfinished || "0");
      setField('Input_883', d.sqft_below_unfinished || "0");

    })();

  }).catch(function(e) {
    alert('Bookmarklet error — could not read clipboard: ' + e.message);
  });

})();
```

---

## TAB 2 — Room Info — Lennar

**Skip this tab entirely for Lennar listings.** Room data is not provided for Lennar new construction. No Lennar variant needed.

---

## TAB 3 — Bath Info — Lennar

No Lennar-specific static values for Bath Info. All bath data is listing-specific. **Use the universal variant** from `CVRMLS_Bookmarklet_Source.md` — no separate Lennar variant needed.

---

## TAB 4 — Features — Lennar Variant

**Source addendum:** Lennar Features variant lives in `AAR-TC-LENNAR-BM-SRC-001-FEA` (`docs/lennar/Lennar_Features_Bookmarklet_Source.md`). See that file for the full Lennar Features JS.

**Lennar static fields hardcoded in that file:** Structure, Siding, Roof (Shingled — `Input_72_12`), Flooring (Vinyl - Plank/Tile/Stone), Attic (Access Panel), Wall Type (Drywall), Golf Frontage Y/N, Water (Public Water), Sewer/Septic (Sewer - Public), Basement/Foundation (conditional — Slab when Basement Y/N = No, Crawl Space when Yes), Water Heater (Electric), Cooling (Heat Pump).

**Dynamic fields (Garage Y/N and Basement Y/N):** These are payload-driven, not hardcoded — `features.garage_yn` and `features.basement_yn`. Garage Attached + Direct Entry auto-check when garage_yn = `"1"`; Slab/Crawl Space auto-check based on basement_yn value. Garage Auto Door Opener is also dynamic (`features.garage_auto_door`).

**Skip entirely for Lennar (EXCL — not written):** ADU Y/N, Fenced Y/N, Restrictions, Disabl Equipd Y/N, Maintenance Contract Y/N, Golf View/Frontage description, Internet Connected/Description, ADU Description, Fenced description, Water Type, Building/Structure type, Farm Type, Irrigation Source, Disabl Feat, Other Heating/Heat/Fuel/Cooling Description fields.

---

## TAB 5 — General Info — Lennar Variant

**Lennar statics hardcoded:** Waterfront (`N`), Model Available (`0`), Disclosures (`NOTREQ`), Lead Disclosure (`NOTREQ`), Assd Improvement (`0` via `isLennar` flag).
**Path-dependent:** Tax Year (`Input_246`) and Acres written on new path only; taxid path pre-populates both — skip.
**isLennar flag:** Assd Improvement write gated behind `payload.lennar === true` — non-Lennar listings have this pre-populated from tax record on taxid path; must not overwrite.

```javascript
(function() {

  function setField(id, value) {
    var el = document.getElementById(id);
    if (el) { el.value = value; }
  }
  function setCheck(id, checked) {
    var el = document.getElementById(id);
    if (el) { el.checked = checked; }
  }

  navigator.clipboard.readText().then(function(text) {

    var payload = JSON.parse(text);
    var d = payload.general || {};
    var path = payload.path || "new";
    var isLennar = payload.lennar === true;

    // Lennar static fields — always write
    setField('Input_94',  'N');   // Waterfront = No
    setField('Input_249', '0');   // Model Available = No

    // Disclosures = Not Required
    setCheck('Input_102_NOTREQ', true);
    // Lead Disclosure = Not Required
    setCheck('Input_103_NOTREQ', true);

    // Assd Improvement — Lennar only
    // Non-Lennar: always taxid path; pre-populated from tax record — must not overwrite
    if (isLennar) {
      setField('Input_248', '0'); // Assd Improvement = 0; Input_248 confirmed on taxid path
    }

    // New path only
    if (path === "new") {
      setField('Input_246', '0');           // Tax Year = 0 on new path
      setField('Input_95',  d.acres || ""); // Acres — from payload
      setField('Input_100', 'TBD');         // Legal Description = TBD for Lennar new construction
    }
    // taxid path: Tax Year, Acres, and Legal pre-populated — skip all three

  }).catch(function(e) {
    alert('Bookmarklet error — could not read clipboard: ' + e.message);
  });

})();
```

---

## TAB 6 — Remarks — Lennar

No Lennar-specific behavior. **Use the universal variant** from `CVRMLS_Bookmarklet_Source.md`. Copyright Agreement is hardcoded to `1` (Yes) in the universal variant — no override needed.

---

## TAB 7 — Fee Info — Lennar Variant

**Lennar statics hardcoded:** HOA/Condo (`1`), Membership Required (`1`), Fee Desc = Community Association (`01`), Allow Onsite = all unchecked.
**Community-variable fields still come from payload** — fee amounts, period, management firm, fee includes, and additional fee data differ by community.

```javascript
(function() {

  function setField(id, value) {
    var el = document.getElementById(id);
    if (el) { el.value = value; }
  }
  function setCheck(id, checked) {
    var el = document.getElementById(id);
    if (el) { el.checked = checked; }
  }

  navigator.clipboard.readText().then(function(text) {

    var d = JSON.parse(text).fee;

    // Lennar static fields
    setField('Input_109', '1');         // HOA/Condo = Yes — always
    setField('Input_112', '1');         // Membership Required = Yes — always
    setCheck('Input_111_01', true);     // Fee Desc = Community Association — always

    // Allow Onsite — all unchecked for Lennar
    ['1','4','5','6','7','8'].forEach(function(v) {
      setCheck('Input_116_' + v, false);
    });

    // Community-variable fields from payload
    setField('Input_719', d.addl_hoa       || "0");
    setField('Input_110', d.fee_amount     || "");
    setField('Input_113', d.fee_period     || "");
    setField('Input_705', d.management_firm || "");
    setField('Input_115', d.addl_fee_amount || "");
    setField('Input_117', d.addl_fee_desc   || "");

    // Fee Includes — uncheck all, then check from payload
    var feeInclIds = ['26','19','01','25','18','03','04','05','06','07',
                      '08','27','28','09','10','11','29','12','22','20',
                      '13','14','15','23','21','17'];
    feeInclIds.forEach(function(v) { setCheck('Input_576_' + v, false); });
    (d.fee_includes || []).forEach(function(v) { setCheck('Input_576_' + v, true); });

  }).catch(function(e) {
    alert('Bookmarklet error — could not read clipboard: ' + e.message);
  });

})();
```

---

## TAB 8 — Owner Info — Lennar Variant

**Fully static — no clipboard payload needed.**
**Tax ID path exception:** `Input_118` (Owner Name) will be pre-filled with tax record data on taxid path. Force-overwrite to `Lennar` regardless — this is the one field that always overwrites even on taxid path.

```javascript
(function() {

  function setField(id, value) {
    var el = document.getElementById(id);
    if (el) { el.value = value; }
  }
  function setCheck(id, checked) {
    var el = document.getElementById(id);
    if (el) { el.checked = checked; }
  }

  // Owner Name — force-overwrite even on taxid path
  setField('Input_118', 'Lennar');
  setField('Input_119', 'None');   // Occupant Name
  setField('Input_606', 'V');      // Occupied By = Vacant
  setField('Input_124', '0');      // Owner Agent = No
  setField('Input_707', '0');      // Agent Related to Seller = No — required field

  // Owned By = Corporate
  ['02','03','04','06','07','08','01'].forEach(function(v) {
    setCheck('Input_120_' + v, false);
  });
  setCheck('Input_120_02', true);  // Corporate

  // Possession = At Closing
  ['01','02','06','03','04','05'].forEach(function(v) {
    setCheck('Input_121_' + v, false);
  });
  setCheck('Input_121_01', true);  // At Closing

})();
```

---

## TAB 9 — Agent/Office Info — Lennar Variant

**Fully static — no clipboard payload needed.**
**Lennar difference from universal:** Type = `MO` (MLS Only), Limited Rep = `1` (Yes).

```javascript
(function() {

  function setField(id, value) {
    var el = document.getElementById(id);
    if (el) { el.value = value; }
  }

  // List Agent Code (Input_159) — always pre-filled, never touch
  setField('Input_170', '');    // Co-List Agent Code — blank
  setField('Input_163', 'MO'); // Type = MLS Only (Lennar-specific)
  setField('Input_164', '1');  // Limited Rep = Yes (Lennar-specific)

})();
```

---

## TAB 10 — Showing Instructions — Lennar Variant

**Lennar statics hardcoded:** Accompany Show (unchecked), Appt Required (checked), Showing Instr 2 = `NLCS`, LockBox Type = blank.
**Dynamic from payload:** Additional Instructions only.

```javascript
(function() {

  function setField(id, value) {
    var el = document.getElementById(id);
    if (el) { el.value = value; }
  }
  function setCheck(id, checked) {
    var el = document.getElementById(id);
    if (el) { el.checked = checked; }
  }

  navigator.clipboard.readText().then(function(text) {

    var d = JSON.parse(text).showing;

    // Lennar static fields
    setCheck('Input_722_AS', false);  // Accompany Show = unchecked
    setCheck('Input_722_AR', true);   // Appt Required = checked
    setField('Input_136', 'NLCS');    // Showing Instr 2 = No LB Call Showing Service
    setField('Input_333', '');        // LockBox Type = blank (no lockbox for Lennar)
    // Input_137 (Supra Serial) — skip
    // Input_732 (Sentrilock Serial) — skip

    // Dynamic from payload
    setField('Input_138', d.additional_instructions || "");

  }).catch(function(e) {
    alert('Bookmarklet error — could not read clipboard: ' + e.message);
  });

})();
```

---

## TAB 11 — Virtual Tour Info — Lennar

No Lennar-specific behavior. **Use the universal variant** from `CVRMLS_Bookmarklet_Source.md`.

---

## TAB 12 — Internet Display Info — Lennar

No Lennar-specific behavior. **Use the universal variant** from `CVRMLS_Bookmarklet_Source.md`.

---

## Lennar Statics Reference

Quick reference for all hardcoded Lennar values across all tabs.

| Tab | Field | Input ID | Lennar Value | Notes |
|---|---|---|---|---|
| Listing Info | Delayed Show | Input_32 | `0` | No |
| Listing Info | New/Resale | Input_42 | `NVROC` | New, never occupied |
| Listing Info | Year Built Desc | Input_45 | `UNDCON` | Under Construction |
| Listing Info | Expire Date | Input_162 | `12/31/2026` | Master Listing Agreement expiry — update when renewed |
| Listing Info | SqFt Source | Input_97 | `04` | Per Builder |
| Listing Info | PID | Input_99 | `TBD` | New path only; taxid pre-populated |
| General Info | Waterfront | Input_94 | `N` | No |
| General Info | Model Available | Input_249 | `0` | No |
| General Info | Disclosures | Input_102_NOTREQ | checked | Not Required |
| General Info | Lead Disclosure | Input_103_NOTREQ | checked | Not Required |
| General Info | Assd Improvement | Input_248 | `0` | isLennar gate — taxid path confirmed ID |
| General Info | Tax Year | Input_246 | `0` | New path only; taxid pre-populated |
| General Info | Legal Description | Input_100 | `TBD` | New path only |
| Fee Info | HOA/Condo | Input_109 | `1` | Yes |
| Fee Info | Membership Required | Input_112 | `1` | Yes |
| Fee Info | Fee Desc | Input_111_01 | checked | Community Association |
| Fee Info | Allow Onsite | Input_116_* | unchecked | All options |
| Owner Info | Owner Name | Input_118 | `Lennar` | Force-overwrite even on taxid path |
| Owner Info | Occupant Name | Input_119 | `None` | |
| Owner Info | Occupied By | Input_606 | `V` | Vacant |
| Owner Info | Owner Agent | Input_124 | `0` | No |
| Owner Info | Agent Related | Input_707 | `0` | No |
| Owner Info | Owned By | Input_120_02 | checked | Corporate |
| Owner Info | Possession | Input_121_01 | checked | At Closing |
| Agent/Office Info | Type | Input_163 | `MO` | MLS Only |
| Agent/Office Info | Limited Rep | Input_164 | `1` | Yes |
| Showing Instructions | Accompany Show | Input_722_AS | unchecked | |
| Showing Instructions | Appt Required | Input_722_AR | checked | |
| Showing Instructions | Showing Instr 2 | Input_136 | `NLCS` | No LB Call Showing Service |
| Showing Instructions | LockBox Type | Input_333 | `` | Blank |

---

*Lennar CVRMLS bookmarklet customization — Lennar-specific variants only.*
*Base field maps and universal variants live in `docs/cvrmls/CVRMLS_Bookmarklet_Source.md`.*
*Features Lennar variant lives in `docs/lennar/Lennar_Features_Bookmarklet_Source.md` (AAR-TC-LENNAR-BM-SRC-001-FEA).*

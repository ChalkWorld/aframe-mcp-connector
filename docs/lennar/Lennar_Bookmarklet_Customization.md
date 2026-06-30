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

This file contains every Lennar-specific value that the session resolves into the payload before a listing's bookmarklets are run. It is not a standalone document — it is read alongside `CVRMLS_Bookmarklet_Source.md`, which defines the universal, builder-agnostic bookmarklet JS. As of this session, no bookmarklet contains any Lennar-aware branching, lookup table, or hardcoded static — every value in this file is resolved by the session at listing intake and written directly into the payload as a final value. The bookmarklet's job is unchanged regardless of where a value came from: read `payload.<tab>.<field>`, write it to the Matrix field.

**When generating a Lennar payload:** look up every value this doc specifies for the relevant tabs, resolve it (community lookup or static), and write the resolved value into the payload JSON before handing it to Andrew to copy.

---

## How Lennar Customization Works

**No flag, no bookmarklet-side branching.** Bookmarklets contain zero builder-specific logic — no `isLennar` check, no `COMMUNITIES` table, no `payload.lennar` read. A `lennar` or `builder` key may still be useful as an informational header on the payload (so a future session or tooling can tell what kind of payload it's looking at), but no bookmarklet's field-writing logic reads it.

**Three tiers of Lennar field behavior — now all resolved session-side:**
- **Static** — the session writes the same hardcoded value into every Lennar payload; the bookmarklet just sees it as a normal payload value, same as anything listing-specific
- **Community lookup** — the session resolves `community` against the table in this doc and writes the resolved value(s) directly into the payload; the bookmarklet never sees a community key or a lookup table
- **Dynamic** — read from the clipboard payload; varies by listing (unchanged)

**Builder pattern is extensible.** Any future builder uses the same pattern: a reference doc the session consults at listing intake, resolving values into the payload before generation. No bookmarklet changes are ever needed to onboard a new builder.

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

## TAB 4 — Features — Lennar Resolution

**`bookmarklets/lennar_features.html` is deleted.** It is not merged into a new file — `bookmarklets/features_a.html` and `bookmarklets/features_b.html` were confirmed this session to already be fully universal, payload-driven, and syntax-valid. Every checkbox-group field shared between the old Lennar launcher and Features A/B was confirmed byte-identical (same Input IDs, same order) — Features A/B were already correctly built as the canonical source the Lennar launcher was derived from.

**Full field-by-field classification and the per-community lookup table now live in `docs/lennar/Lennar_Features_Bookmarklet_Source.md`** — see that file's companion handoff for the resolution table covering all 49 field groups: 11 pure statics, 5 community-lookup fields, the garage/basement conditional resolution, and the fields requiring no resolution at all (already shared, listing-specific regardless of builder).

No bookmarklet-side conditional logic (garage_yn-driven checkbox sets, basement_yn-driven Slab/Crawl Space selection) survives — Features A's existing `setCheckGroup(ids, d.garage)` / `setCheckGroup(ids, d.basement_foundation)` pattern already accepts any array. The session resolves the correct array for Lennar and writes it directly; no new payload keys or bookmarklet changes were needed.

---

## TAB 5 — General Info — Lennar Resolution

**Session resolves these values into the `general` payload key for every Lennar listing.** The bookmarklet (now universal — see `CVRMLS_Bookmarklet_Source.md`) has no builder awareness; it just writes whatever is in the payload.

| Field | Payload key | Lennar value | Notes |
|---|---|---|---|
| Waterfront | `general.waterfront` | `"N"` | Always |
| Model Available | `general.model_available` | `"0"` | Always |
| Disclosures | `general.disclosures` | `["NOTREQ"]` | Always |
| Lead Disclosure | `general.lead_disclosure` | `["NOTREQ"]` | Always |
| Assd Improvement | `general.assd_improvement` | `"0"` | Always — Lennar never pre-populates on either path, unlike standard listings |
| Tax Year | `general.tax_year` | `"0"` | New path only — omit on taxid path (Matrix pre-populates) |
| Acres | `general.acres` | from email/listing data | New path only — omit on taxid path |
| Legal Description | `general.legal` | `"TBD"` | New path only — omit on taxid path |

---

## TAB 6 — Remarks

No Lennar-specific resolution needed. This tab is fully universal — see `CVRMLS_Bookmarklet_Source.md`. Copyright Agreement is a genuine MLS-wide constant, confirmed against the live file this session, not a Lennar-only assumption.

---

## TAB 7 — Fee Info — Lennar Resolution

**Session resolves these values into the `fee` payload key for every Lennar listing**, alongside the per-community values from the Fee Info table below. The bookmarklet treats every field on this tab identically — no special casing.

| Field | Payload key | Lennar value |
|---|---|---|
| HOA/Condo | `fee.hoa_condo` | `"1"` — always |
| Membership Required | `fee.membership_required` | `"1"` — always |
| Fee Desc | `fee.fee_desc` | `["01"]` (Community Association) — always |
| Allow Onsite | `fee.allow_onsite` | `[]` (all unchecked) — always |

Community-variable fields (`addl_hoa`, `fee_amount`, `fee_period`, `management_firm`, `addl_fee_amount`, `addl_fee_desc`, `fee_includes`) are resolved per-community from the Fee Info table in `Lennar_Bookmarklet_Build_Notes.md`, same as before.

---

## TAB 8 — Owner Info — Lennar Variant

**Fully static — no clipboard payload needed.**
**Open design question, not resolved here:** does the session always resolve `owner_name` into the payload when an override is needed (Lennar or otherwise), or does this override behavior stay Lennar-only in practice? Flagged for a session-level decision — see `CVRMLS_Bookmarklet_Source.md` TAB 8 for the unconditional-write side of this that the bookmarklet now implements.

**Session resolves these values into the `owner` payload key for every Lennar listing:**

| Field | Payload key | Lennar value |
|---|---|---|
| Owner Name | `owner.owner_name` | `"Lennar"` — written unconditionally (force-overwrite even on taxid path) |
| Occupant Name | `owner.occupant_name` | `"None"` |
| Occupied By | `owner.occupied_by` | `"V"` (Vacant) |
| Owner Agent | `owner.owner_agent` | `"0"` (No) |
| Agent Related to Seller | `owner.agent_related_to_seller` | `"0"` (No) |
| Owned By | `owner.owned_by` | `"02"` (Corporate) |
| Possession | `owner.possession` | `"01"` (At Closing) |

---

## TAB 9 — Agent/Office Info — Lennar Resolution

**Session resolves these values into the `agent_office` payload key for every Lennar listing.** This tab previously had no clipboard read at all (fully static); the bookmarklet is now fully payload-driven, matching every other tab.

| Field | Payload key | Lennar value |
|---|---|---|
| Type | `agent_office.type` | `"MO"` (MLS Only) |
| Limited Rep | `agent_office.limited_rep` | `"1"` (Yes) |

`co_list_agent_code` is not builder-specific — it comes from the agent profile regardless of builder; see `New_Seller_Side_Session_Protocol.md`.

---

## TAB 10 — Showing Instructions — Lennar Resolution

**Session resolves these values into the `showing` payload key for every Lennar listing.**

| Field | Payload key | Lennar value |
|---|---|---|
| Accompany Show | `showing.accompany_show` | `false` — always |
| Appt Required | `showing.appt_required` | `true` — always |
| Showing Instr 2 | `showing.showing_instr_2` | `"NLCS"` — always |
| LockBox Type | `showing.lockbox_type` | `""` (blank) — always |

`additional_instructions` is always listing-specific and comes from the email regardless of builder. Compare against standard listings, where `showing_instr_2` defaults to `"NLCS"` but switches to `"LBGD"` if vacant — see `New_Seller_Side_Session_Protocol.md`.

---

## TAB 11 — Virtual Tour Info — Lennar

No Lennar-specific behavior. **Use the universal variant** from `CVRMLS_Bookmarklet_Source.md`. Confirmed against the live launcher file this session — already fully builder-agnostic.

---

## TAB 12 — Internet Display Info

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

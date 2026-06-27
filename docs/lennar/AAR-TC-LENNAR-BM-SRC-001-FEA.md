# Lennar MLS — Features Bookmarklet Source
**Document ID:** AAR-TC-LENNAR-BM-SRC-001-FEA
**Version:** 1.0
**Date:** June 26, 2026
**Addendum to:** `Lennar_MLS_Bookmarklet_Source.md` (`AAR-TC-LENNAR-BM-SRC-001`)
**Field Map:** `Lennar_MLS_Features_Field_Map.md` (`AAR-TC-LENNAR-BM-001-FEA`)

*Both variants complete — non-Lennar and Lennar. Ready for launcher build.*

---

## TAB 4 — Features

**Field count:** 49 field groups / ~605 individual checkboxes + selects
**Lennar static fields (hardcoded):** Structure, Siding, Roof, Garage Y/N, Basement Y/N, ADU Y/N, Golf Frontage Y/N, Fenced Y/N, Water, Sewer/Septic, Restrictions, Basement/Foundation, Disabl Equipd Y/N, Maintenance Contract Y/N, Garage (Attached + Auto Door Opener)
**Skip entirely (Lennar):** Golf View/Frontage, Internet Description, ADU Description, Fenced, Water Type, Building/Structure, Farm Type, Irrigation Source, Disabl Feat, Other Heating/Heat/Fuel/Cooling Description fields
**Named suffix pattern:** Some checkbox groups use named suffixes (e.g. `Input_845_FIBER`, `Input_676_PW`) rather than numeric. Both patterns handled via setCheck().
**Non-sequential IDs:** `Input_88_13` (Geothermal in Cooling) is non-sequential — added later; do not assume suffix order matches display order.

---

### Features — Non-Lennar Variant

All fields payload-driven. No hardcoded constants. Checkbox groups: uncheck all options first, then check selected values from payload array.

```javascript
(function() {

  function setField(id, value) {
    var el = document.getElementById(id);
    if (el) { el.value = value; }
  }

  function setCheck(id, checked) {
    var el = document.getElementById(id);
    if (el) { el.checked = !!checked; }
  }

  // Uncheck all options in a group, then check the ones in the provided array
  function setCheckGroup(ids, selected) {
    ids.forEach(function(id) { setCheck(id, false); });
    (selected || []).forEach(function(id) { setCheck(id, true); });
  }

  navigator.clipboard.readText().then(function(text) {

    var d = JSON.parse(text).features;

    // ── CHUNK 1 ────────────────────────────────────────────────────────────

    // Style (checkbox group)
    setCheckGroup([
      'Input_541_27','Input_541_01','Input_541_02','Input_541_03','Input_541_04',
      'Input_541_05','Input_541_33','Input_541_06','Input_541_07','Input_541_09',
      'Input_541_10','Input_541_31','Input_541_30','Input_541_11','Input_541_28',
      'Input_541_32','Input_541_12','Input_541_36','Input_541_29','Input_541_34',
      'Input_541_14','Input_541_15','Input_541_16','Input_541_18','Input_541_19',
      'Input_541_20','Input_541_21','Input_541_23','Input_541_24','Input_541_25',
      'Input_541_26'
    ], d.style);

    // Structure (checkbox group)
    setCheckGroup([
      'Input_70_01','Input_70_02','Input_70_11','Input_70_03','Input_70_05',
      'Input_70_06','Input_70_07','Input_70_09','Input_70_10'
    ], d.structure);

    // Siding (checkbox group)
    setCheckGroup([
      'Input_71_01','Input_71_02','Input_71_03','Input_71_04','Input_71_05',
      'Input_71_06','Input_71_07','Input_71_08','Input_71_10','Input_71_11',
      'Input_71_12','Input_71_25','Input_71_13','Input_71_14','Input_71_15',
      'Input_71_16','Input_71_17','Input_71_18','Input_71_19','Input_71_20',
      'Input_71_21','Input_71_22','Input_71_23'
    ], d.siding);

    // Roof (checkbox group)
    setCheckGroup([
      'Input_72_02','Input_72_03','Input_72_04','Input_72_05','Input_72_06',
      'Input_72_07','Input_72_08','Input_72_09','Input_72_10','Input_72_11',
      'Input_72_12','Input_72_13','Input_72_14','Input_72_15','Input_72_16',
      'Input_72_17','Input_72_18'
    ], d.roof);

    // Flooring (checkbox group)
    setCheckGroup([
      'Input_73_16','Input_73_01','Input_73_02','Input_73_03','Input_73_15',
      'Input_73_04','Input_73_12','Input_73_05','Input_73_06','Input_73_07',
      'Input_73_08','Input_73_09','Input_73_10','Input_73_17','Input_73_11',
      'Input_73_13','Input_73_14'
    ], d.flooring);

    // ── CHUNK 2 ────────────────────────────────────────────────────────────

    // Golf Frontage Y/N (select)
    setField('Input_693', d.golf_frontage_yn || '');

    // Golf View/Frontage (checkbox group) — named suffixes
    setCheckGroup([
      'Input_721_CartPath','Input_721_Fairway','Input_721_Green',
      'Input_721_Tee','Input_721_View'
    ], d.golf_view);

    // Attic (checkbox group)
    setCheckGroup([
      'Input_241_09','Input_241_01','Input_241_07','Input_241_12','Input_241_02',
      'Input_241_08','Input_241_03','Input_241_05','Input_241_06'
    ], d.attic);

    // Parking (checkbox group)
    setCheckGroup([
      'Input_519_01','Input_519_02','Input_519_03','Input_519_04','Input_519_05',
      'Input_519_06','Input_519_07','Input_519_08','Input_519_09','Input_519_10',
      'Input_519_11','Input_519_12','Input_519_13','Input_519_14','Input_519_15',
      'Input_519_16'
    ], d.parking);

    // Exterior (checkbox group)
    setCheckGroup([
      'Input_570_01','Input_570_02','Input_570_47','Input_570_03','Input_570_04',
      'Input_570_05','Input_570_35','Input_570_43','Input_570_06','Input_570_07',
      'Input_570_08','Input_570_09','Input_570_10','Input_570_11','Input_570_12',
      'Input_570_31','Input_570_13','Input_570_36','Input_570_14','Input_570_15',
      'Input_570_16','Input_570_44','Input_570_17','Input_570_18','Input_570_19',
      'Input_570_20','Input_570_21','Input_570_45','Input_570_46','Input_570_23',
      'Input_570_32','Input_570_33','Input_570_25','Input_570_26','Input_570_27',
      'Input_570_28','Input_570_29','Input_570_22','Input_570_24'
    ], d.exterior);

    // ── CHUNK 3 ────────────────────────────────────────────────────────────

    // Currently Connected Internet (checkbox group) — named suffixes
    setCheckGroup([
      'Input_845_ADDINFO','Input_845_CABLE','Input_845_DSL','Input_845_FIBER',
      'Input_845_OTHER','Input_845_SATELLITE','Input_845_UNKNOWN'
    ], d.internet_connected);

    // Internet Description (text) — non-Lennar only
    setField('Input_846', d.internet_desc || '');

    // Garage Y/N (select)
    setField('Input_150', d.garage_yn || '');

    // # Cars (select)
    setField('Input_226', d.num_cars || '');

    // ADU Y/N (select)
    setField('Input_861', d.adu_yn || '');

    // Basement Y/N (select)
    setField('Input_153', d.basement_yn || '');

    // ADU Description (text) — non-Lennar only
    setField('Input_862', d.adu_desc || '');

    // ── CHUNK 4 ────────────────────────────────────────────────────────────

    // Garage (checkbox group)
    setCheckGroup([
      'Input_539_01','Input_539_02','Input_539_03','Input_539_15','Input_539_04',
      'Input_539_05','Input_539_13','Input_539_16','Input_539_06','Input_539_08',
      'Input_539_09','Input_539_10','Input_539_17','Input_539_21','Input_539_18',
      'Input_539_11','Input_539_14','Input_539_12'
    ], d.garage);

    // Basement/Foundation (checkbox group)
    setCheckGroup([
      'Input_569_01','Input_569_02','Input_569_03','Input_569_04','Input_569_05',
      'Input_569_06','Input_569_07','Input_569_08','Input_569_09','Input_569_19',
      'Input_569_10','Input_569_11','Input_569_20','Input_569_12','Input_569_17',
      'Input_569_18','Input_569_13','Input_569_14','Input_569_15'
    ], d.basement_foundation);

    // Interior (checkbox group)
    setCheckGroup([
      'Input_568_49','Input_568_19','Input_568_50','Input_568_01','Input_568_56',
      'Input_568_02','Input_568_03','Input_568_04','Input_568_05','Input_568_06',
      'Input_568_07','Input_568_08','Input_568_10','Input_568_09','Input_568_11',
      'Input_568_12','Input_568_57','Input_568_58','Input_568_59','Input_568_60',
      'Input_568_13','Input_568_14','Input_568_15','Input_568_46','Input_568_16',
      'Input_568_17','Input_568_55','Input_568_18','Input_568_20','Input_568_21',
      'Input_568_62','Input_568_22','Input_568_23','Input_568_24','Input_568_48',
      'Input_568_25','Input_568_45','Input_568_26','Input_568_28','Input_568_27',
      'Input_568_29','Input_568_30','Input_568_47','Input_568_31','Input_568_32',
      'Input_568_33','Input_568_61','Input_568_34','Input_568_35','Input_568_36',
      'Input_568_37','Input_568_38','Input_568_39','Input_568_40','Input_568_41',
      'Input_568_43','Input_568_44'
    ], d.interior);

    // Water (checkbox group) — named suffixes
    setCheckGroup([
      'Input_676_CW','Input_676_OTHER','Input_676_PW','Input_676_WELL'
    ], d.water);

    // Sewer/Septic (checkbox group) — named suffixes
    setCheckGroup([
      'Input_670_ALTSEPTC','Input_670_COSEPTC','Input_670_COMSR',
      'Input_670_PBLCSR','Input_670_NONE','Input_670_OTHER','Input_670_UNKNOWN'
    ], d.sewer);

    // ── CHUNK 5 ────────────────────────────────────────────────────────────

    // Fenced Y/N (select)
    setField('Input_695', d.fenced_yn || '');

    // Fenced (checkbox group)
    setCheckGroup([
      'Input_79_01','Input_79_02','Input_79_03','Input_79_04','Input_79_05',
      'Input_79_06','Input_79_07','Input_79_08','Input_79_09','Input_79_10',
      'Input_79_11','Input_79_12','Input_79_13','Input_79_14','Input_79_15',
      'Input_79_16','Input_79_17','Input_79_20','Input_79_18','Input_79_19'
    ], d.fenced);

    // Restrictions (checkbox group)
    setCheckGroup([
      'Input_540_25','Input_540_24','Input_540_01','Input_540_02','Input_540_03',
      'Input_540_04','Input_540_05','Input_540_06','Input_540_07','Input_540_27',
      'Input_540_09','Input_540_10','Input_540_29','Input_540_26','Input_540_11',
      'Input_540_13','Input_540_14','Input_540_15','Input_540_28','Input_540_16',
      'Input_540_17','Input_540_18','Input_540_19','Input_540_21'
    ], d.restrictions);

    // #FP — Number of Fireplaces (text)
    setField('Input_152', d.num_fp || '0');

    // Fireplace (checkbox group)
    setCheckGroup([
      'Input_90_01','Input_90_02','Input_90_09','Input_90_03','Input_90_08',
      'Input_90_04','Input_90_05','Input_90_06','Input_90_07'
    ], d.fireplace);

    // ── CHUNK 6 ────────────────────────────────────────────────────────────

    // Community Amenities (checkbox group)
    setCheckGroup([
      'Input_534_01','Input_534_02','Input_534_41','Input_534_45','Input_534_33',
      'Input_534_03','Input_534_04','Input_534_05','Input_534_06','Input_534_07',
      'Input_534_08','Input_534_09','Input_534_10','Input_534_11','Input_534_12',
      'Input_534_13','Input_534_31','Input_534_14','Input_534_15','Input_534_36',
      'Input_534_16','Input_534_17','Input_534_42','Input_534_18','Input_534_19',
      'Input_534_29','Input_534_40','Input_534_20','Input_534_37','Input_534_21',
      'Input_534_46','Input_534_22','Input_534_47','Input_534_23','Input_534_24',
      'Input_534_25','Input_534_26','Input_534_43','Input_534_27','Input_534_28',
      'Input_534_44','Input_534_32','Input_534_30','Input_534_34'
    ], d.community_amenities);

    // Green Cert (checkbox group)
    setCheckGroup([
      'Input_85_03','Input_85_06','Input_85_02','Input_85_05',
      'Input_85_07','Input_85_01','Input_85_04'
    ], d.green_cert);

    // Pool Y/N (select)
    setField('Input_244', d.pool_yn || '');

    // Pool Description (checkbox group)
    setCheckGroup([
      'Input_91_01','Input_91_02','Input_91_03','Input_91_04','Input_91_05',
      'Input_91_06','Input_91_07','Input_91_08','Input_91_09','Input_91_10',
      'Input_91_11','Input_91_12','Input_91_13','Input_91_14','Input_91_15',
      'Input_91_16','Input_91_17','Input_91_18','Input_91_19','Input_91_20'
    ], d.pool_desc);

    // ── CHUNK 7 ────────────────────────────────────────────────────────────

    // Appl/Equip (checkbox group)
    setCheckGroup([
      'Input_81_01','Input_81_02','Input_81_03','Input_81_04','Input_81_05',
      'Input_81_06','Input_81_07','Input_81_08','Input_81_09','Input_81_10',
      'Input_81_39','Input_81_11','Input_81_12','Input_81_13','Input_81_14',
      'Input_81_15','Input_81_16','Input_81_17','Input_81_18','Input_81_19',
      'Input_81_20','Input_81_21','Input_81_22','Input_81_23','Input_81_24',
      'Input_81_25','Input_81_26','Input_81_27','Input_81_28','Input_81_29',
      'Input_81_30','Input_81_31','Input_81_32','Input_81_33','Input_81_34',
      'Input_81_35','Input_81_36','Input_81_37','Input_81_38'
    ], d.appl_equip);

    // Heating (checkbox group)
    setCheckGroup([
      'Input_86_01','Input_86_02','Input_86_03','Input_86_04','Input_86_05',
      'Input_86_06','Input_86_07','Input_86_19','Input_86_08','Input_86_09',
      'Input_86_10','Input_86_11','Input_86_12','Input_86_13','Input_86_14',
      'Input_86_15','Input_86_16','Input_86_17','Input_86_18'
    ], d.heating);

    // Other Heating Description (text)
    setField('Input_659', d.heating_other_desc || '');

    // Water Heater (checkbox group)
    setCheckGroup([
      'Input_571_12','Input_571_01','Input_571_02','Input_571_03','Input_571_04',
      'Input_571_05','Input_571_06','Input_571_07','Input_571_08','Input_571_13',
      'Input_571_09','Input_571_10','Input_571_11'
    ], d.water_heater);

    // ── CHUNK 8 ────────────────────────────────────────────────────────────

    // Disabl Equipd Y/N (select)
    setField('Input_245', d.disabl_equipd_yn || '');

    // Disabl Feat (checkbox group)
    setCheckGroup([
      'Input_83_18','Input_83_19','Input_83_20','Input_83_21','Input_83_03',
      'Input_83_22','Input_83_23','Input_83_24','Input_83_04','Input_83_14',
      'Input_83_09','Input_83_25','Input_83_13','Input_83_07','Input_83_26',
      'Input_83_15','Input_83_16','Input_83_27','Input_83_08','Input_83_17'
    ], d.disabl_feat);

    // Heat/Fuel (checkbox group)
    setCheckGroup([
      'Input_87_01','Input_87_02','Input_87_03','Input_87_04','Input_87_05',
      'Input_87_06','Input_87_07','Input_87_08','Input_87_09','Input_87_10',
      'Input_87_11'
    ], d.heat_fuel);

    // Other Heat/Fuel Description (text)
    setField('Input_660', d.heat_fuel_other_desc || '');

    // Porch (checkbox group)
    setCheckGroup([
      'Input_92_01','Input_92_02','Input_92_03','Input_92_05','Input_92_04',
      'Input_92_06','Input_92_07','Input_92_08','Input_92_09','Input_92_10',
      'Input_92_11','Input_92_12','Input_92_13'
    ], d.porch);

    // ── CHUNK 9 ────────────────────────────────────────────────────────────

    // Maintenance Contract Y/N (select)
    setField('Input_671', d.maintenance_contract_yn || '');

    // Unit Placement (checkbox group)
    setCheckGroup([
      'Input_657_01','Input_657_03','Input_657_04','Input_657_05',
      'Input_657_06','Input_657_07','Input_657_08','Input_657_09'
    ], d.unit_placement);

    // Cooling (checkbox group) — note: Input_88_13 (Geothermal) is non-sequential
    setCheckGroup([
      'Input_88_01','Input_88_02','Input_88_03','Input_88_04','Input_88_05',
      'Input_88_13','Input_88_06','Input_88_07','Input_88_08','Input_88_09',
      'Input_88_10','Input_88_11','Input_88_12'
    ], d.cooling);

    // Other Cooling Description (text)
    setField('Input_661', d.cooling_other_desc || '');

    // ── CHUNK 10 ───────────────────────────────────────────────────────────

    // Water Type (checkbox group)
    setCheckGroup([
      'Input_542_20','Input_542_02','Input_542_03','Input_542_21','Input_542_05',
      'Input_542_06','Input_542_07','Input_542_08','Input_542_34','Input_542_33',
      'Input_542_32','Input_542_31','Input_542_30','Input_542_26','Input_542_22',
      'Input_542_11','Input_542_12','Input_542_13','Input_542_14','Input_542_15',
      'Input_542_23','Input_542_17','Input_542_18','Input_542_24'
    ], d.water_type);

    // Wall Type (checkbox group)
    setCheckGroup([
      'Input_254_09','Input_254_10','Input_254_02','Input_254_07','Input_254_08',
      'Input_254_04','Input_254_05','Input_254_03','Input_254_01','Input_254_06'
    ], d.wall_type);

    // Building/Structure (checkbox group)
    setCheckGroup([
      'Input_256_24','Input_256_01','Input_256_02','Input_256_03','Input_256_04',
      'Input_256_05','Input_256_06','Input_256_07','Input_256_08','Input_256_09',
      'Input_256_10','Input_256_22','Input_256_23','Input_256_12','Input_256_13',
      'Input_256_14','Input_256_15','Input_256_16','Input_256_17','Input_256_18',
      'Input_256_19'
    ], d.building_structure);

    // Farm Type (checkbox group)
    setCheckGroup([
      'Input_257_01','Input_257_02','Input_257_03','Input_257_04','Input_257_05',
      'Input_257_06','Input_257_07','Input_257_08','Input_257_09'
    ], d.farm_type);

    // Irrigation Source (checkbox group)
    setCheckGroup([
      'Input_258_05','Input_258_01','Input_258_02','Input_258_03','Input_258_04'
    ], d.irrigation_source);

  }).catch(function(e) {
    alert('Bookmarklet error — could not read clipboard: ' + e.message);
  });

})();
```

---

### Features — Lennar Variant

Three-tier design:
- **Truly static** → hardcoded; never in payload
- **Community-variable** → looked up from `COMMUNITIES[d.community]`
- **Payload-driven** → read from `payload.features`

Community lookup provides: `heating`, `heat_fuel`, `pool_yn`, `pool_desc`, `community_amenities`
Cooling is a Lennar static (Heat Pump — all communities). Water Heater is a Lennar static (Electric — all communities).
Unit Placement is TH plans only — stub in; Lennar has not started specifying yet.

```javascript
(function() {

  function setField(id, value) {
    var el = document.getElementById(id);
    if (el) { el.value = value; }
  }

  function setCheck(id, checked) {
    var el = document.getElementById(id);
    if (el) { el.checked = !!checked; }
  }

  function setCheckGroup(ids, selected) {
    ids.forEach(function(id) { setCheck(id, false); });
    (selected || []).forEach(function(id) { setCheck(id, true); });
  }

  navigator.clipboard.readText().then(function(text) {

    var payload = JSON.parse(text);
    var d = payload.features;
    var community = payload.community;

    // Community lookup table
    var COMMUNITIES = {
      'Harpers Mill TH': {
        heating:             ['Input_86_07'],          // Forced Hot Air
        heat_fuel:           ['Input_87_05'],          // Natural Gas
        pool_yn:             '1',
        pool_desc:           ['Input_91_02'],          // Community/Off Site
        community_amenities: ['Input_534_01','Input_534_03','Input_534_04','Input_534_22','Input_534_47']
        // Association, Clubhouse, Common Area, Playground, Pool
      },
      'Harpers Mill SF': {
        heating:             ['Input_86_07'],          // Forced Hot Air
        heat_fuel:           ['Input_87_05'],          // Natural Gas
        pool_yn:             '1',
        pool_desc:           ['Input_91_02'],          // Community/Off Site
        community_amenities: ['Input_534_01','Input_534_03','Input_534_04','Input_534_22','Input_534_47']
        // Association, Clubhouse, Common Area, Playground, Pool
      },
      'Creekside Run': {
        heating:             ['Input_86_08'],          // Heat Pump
        heat_fuel:           ['Input_87_02'],          // Electric
        pool_yn:             '0',
        pool_desc:           [],
        community_amenities: ['Input_534_01','Input_534_04','Input_534_46','Input_534_22']
        // Association, Common Area, Picnic Area, Playground
      },
      'Everstone': {
        heating:             ['Input_86_08'],          // Heat Pump
        heat_fuel:           ['Input_87_02'],          // Electric
        pool_yn:             '0',
        pool_desc:           [],
        community_amenities: ['Input_534_01','Input_534_04','Input_534_46','Input_534_22']
        // Association, Common Area, Picnic Area, Playground
      },
      'Watermark': {
        heating:             ['Input_86_07'],          // Forced Hot Air
        heat_fuel:           ['Input_87_05'],          // Natural Gas
        pool_yn:             '1',
        pool_desc:           ['Input_91_02'],          // Community/Off Site
        community_amenities: ['Input_534_01']
        // Association (may expand as community matures)
      }
    };

    var c = COMMUNITIES[community];
    if (!c) {
      alert('Features bookmarklet — unknown community: "' + community + '". Fill tab manually.');
      return;
    }

    // ── CHUNK 1 — STATIC + DYNAMIC ─────────────────────────────────────────

    // Style — payload-driven
    setCheckGroup([
      'Input_541_27','Input_541_01','Input_541_02','Input_541_03','Input_541_04',
      'Input_541_05','Input_541_33','Input_541_06','Input_541_07','Input_541_09',
      'Input_541_10','Input_541_31','Input_541_30','Input_541_11','Input_541_28',
      'Input_541_32','Input_541_12','Input_541_36','Input_541_29','Input_541_34',
      'Input_541_14','Input_541_15','Input_541_16','Input_541_18','Input_541_19',
      'Input_541_20','Input_541_21','Input_541_23','Input_541_24','Input_541_25',
      'Input_541_26'
    ], d.style);

    // Structure — STATIC: Frame
    setCheck('Input_70_03', true);

    // Siding — STATIC: Vinyl
    setCheck('Input_71_22', true);

    // Roof — STATIC: Dimensional
    setCheck('Input_72_07', true);

    // Flooring — payload-driven
    setCheckGroup([
      'Input_73_16','Input_73_01','Input_73_02','Input_73_03','Input_73_15',
      'Input_73_04','Input_73_12','Input_73_05','Input_73_06','Input_73_07',
      'Input_73_08','Input_73_09','Input_73_10','Input_73_17','Input_73_11',
      'Input_73_13','Input_73_14'
    ], d.flooring);

    // ── CHUNK 2 — STATIC + DYNAMIC ─────────────────────────────────────────

    // Golf Frontage Y/N — STATIC: No
    setField('Input_693', '0');

    // Golf View/Frontage — SKIP (no Lennar communities have golf frontage)

    // Attic — payload-driven
    setCheckGroup([
      'Input_241_09','Input_241_01','Input_241_07','Input_241_12','Input_241_02',
      'Input_241_08','Input_241_03','Input_241_05','Input_241_06'
    ], d.attic);

    // Parking — payload-driven
    setCheckGroup([
      'Input_519_01','Input_519_02','Input_519_03','Input_519_04','Input_519_05',
      'Input_519_06','Input_519_07','Input_519_08','Input_519_09','Input_519_10',
      'Input_519_11','Input_519_12','Input_519_13','Input_519_14','Input_519_15',
      'Input_519_16'
    ], d.parking);

    // Exterior — payload-driven
    setCheckGroup([
      'Input_570_01','Input_570_02','Input_570_47','Input_570_03','Input_570_04',
      'Input_570_05','Input_570_35','Input_570_43','Input_570_06','Input_570_07',
      'Input_570_08','Input_570_09','Input_570_10','Input_570_11','Input_570_12',
      'Input_570_31','Input_570_13','Input_570_36','Input_570_14','Input_570_15',
      'Input_570_16','Input_570_44','Input_570_17','Input_570_18','Input_570_19',
      'Input_570_20','Input_570_21','Input_570_45','Input_570_46','Input_570_23',
      'Input_570_32','Input_570_33','Input_570_25','Input_570_26','Input_570_27',
      'Input_570_28','Input_570_29','Input_570_22','Input_570_24'
    ], d.exterior);

    // ── CHUNK 3 — STATIC ───────────────────────────────────────────────────

    // Currently Connected Internet — payload-driven
    setCheckGroup([
      'Input_845_ADDINFO','Input_845_CABLE','Input_845_DSL','Input_845_FIBER',
      'Input_845_OTHER','Input_845_SATELLITE','Input_845_UNKNOWN'
    ], d.internet_connected);

    // Internet Description — SKIP (Lennar)

    // Garage Y/N — STATIC: Yes
    setField('Input_150', '1');

    // # Cars — payload-driven
    setField('Input_226', d.num_cars || '');

    // ADU Y/N — STATIC: No
    setField('Input_861', '0');

    // Basement Y/N — STATIC: No
    setField('Input_153', '0');

    // ADU Description — SKIP (ADU Y/N always No)

    // ── CHUNK 4 — STATIC + DYNAMIC ─────────────────────────────────────────

    // Garage — STATIC base: Attached + Auto Door Opener; payload may add more
    setCheck('Input_539_02', true);   // Attached
    setCheck('Input_539_03', true);   // Auto Door Opener
    (d.garage_extra || []).forEach(function(id) { setCheck(id, true); });

    // Basement/Foundation — STATIC: Slab
    setCheck('Input_569_12', true);

    // Interior — payload-driven
    setCheckGroup([
      'Input_568_49','Input_568_19','Input_568_50','Input_568_01','Input_568_56',
      'Input_568_02','Input_568_03','Input_568_04','Input_568_05','Input_568_06',
      'Input_568_07','Input_568_08','Input_568_10','Input_568_09','Input_568_11',
      'Input_568_12','Input_568_57','Input_568_58','Input_568_59','Input_568_60',
      'Input_568_13','Input_568_14','Input_568_15','Input_568_46','Input_568_16',
      'Input_568_17','Input_568_55','Input_568_18','Input_568_20','Input_568_21',
      'Input_568_62','Input_568_22','Input_568_23','Input_568_24','Input_568_48',
      'Input_568_25','Input_568_45','Input_568_26','Input_568_28','Input_568_27',
      'Input_568_29','Input_568_30','Input_568_47','Input_568_31','Input_568_32',
      'Input_568_33','Input_568_61','Input_568_34','Input_568_35','Input_568_36',
      'Input_568_37','Input_568_38','Input_568_39','Input_568_40','Input_568_41',
      'Input_568_43','Input_568_44'
    ], d.interior);

    // Water — STATIC: Public Water (named suffix)
    setCheck('Input_676_PW', true);

    // Sewer/Septic — STATIC: Sewer - Public (named suffix)
    setCheck('Input_670_PBLCSR', true);

    // ── CHUNK 5 — STATIC + DYNAMIC ─────────────────────────────────────────

    // Fenced Y/N — STATIC: No
    setField('Input_695', '0');

    // Fenced — SKIP (Fenced Y/N always No)

    // Restrictions — STATIC: Assoc Restrictions
    setCheck('Input_540_02', true);

    // #FP — payload-driven
    setField('Input_152', d.num_fp || '0');

    // Fireplace — payload-driven (skip when num_fp = 0)
    if (d.num_fp && parseInt(d.num_fp) > 0) {
      setCheckGroup([
        'Input_90_01','Input_90_02','Input_90_09','Input_90_03','Input_90_08',
        'Input_90_04','Input_90_05','Input_90_06','Input_90_07'
      ], d.fireplace);
    }

    // ── CHUNK 6 — COMMUNITY LOOKUP ─────────────────────────────────────────

    // Community Amenities — from community lookup
    setCheckGroup([
      'Input_534_01','Input_534_02','Input_534_41','Input_534_45','Input_534_33',
      'Input_534_03','Input_534_04','Input_534_05','Input_534_06','Input_534_07',
      'Input_534_08','Input_534_09','Input_534_10','Input_534_11','Input_534_12',
      'Input_534_13','Input_534_31','Input_534_14','Input_534_15','Input_534_36',
      'Input_534_16','Input_534_17','Input_534_42','Input_534_18','Input_534_19',
      'Input_534_29','Input_534_40','Input_534_20','Input_534_37','Input_534_21',
      'Input_534_46','Input_534_22','Input_534_47','Input_534_23','Input_534_24',
      'Input_534_25','Input_534_26','Input_534_43','Input_534_27','Input_534_28',
      'Input_534_44','Input_534_32','Input_534_30','Input_534_34'
    ], c.community_amenities);

    // Green Cert — payload-driven
    setCheckGroup([
      'Input_85_03','Input_85_06','Input_85_02','Input_85_05',
      'Input_85_07','Input_85_01','Input_85_04'
    ], d.green_cert);

    // Pool Y/N — from community lookup
    setField('Input_244', c.pool_yn);

    // Pool Description — from community lookup (skip when pool_yn = 0)
    if (c.pool_yn === '1') {
      setCheckGroup([
        'Input_91_01','Input_91_02','Input_91_03','Input_91_04','Input_91_05',
        'Input_91_06','Input_91_07','Input_91_08','Input_91_09','Input_91_10',
        'Input_91_11','Input_91_12','Input_91_13','Input_91_14','Input_91_15',
        'Input_91_16','Input_91_17','Input_91_18','Input_91_19','Input_91_20'
      ], c.pool_desc);
    }

    // ── CHUNK 7 — DYNAMIC + STATIC ─────────────────────────────────────────

    // Appl/Equip — payload-driven
    setCheckGroup([
      'Input_81_01','Input_81_02','Input_81_03','Input_81_04','Input_81_05',
      'Input_81_06','Input_81_07','Input_81_08','Input_81_09','Input_81_10',
      'Input_81_39','Input_81_11','Input_81_12','Input_81_13','Input_81_14',
      'Input_81_15','Input_81_16','Input_81_17','Input_81_18','Input_81_19',
      'Input_81_20','Input_81_21','Input_81_22','Input_81_23','Input_81_24',
      'Input_81_25','Input_81_26','Input_81_27','Input_81_28','Input_81_29',
      'Input_81_30','Input_81_31','Input_81_32','Input_81_33','Input_81_34',
      'Input_81_35','Input_81_36','Input_81_37','Input_81_38'
    ], d.appl_equip);

    // Heating — from community lookup
    setCheckGroup([
      'Input_86_01','Input_86_02','Input_86_03','Input_86_04','Input_86_05',
      'Input_86_06','Input_86_07','Input_86_19','Input_86_08','Input_86_09',
      'Input_86_10','Input_86_11','Input_86_12','Input_86_13','Input_86_14',
      'Input_86_15','Input_86_16','Input_86_17','Input_86_18'
    ], c.heating);

    // Water Heater — STATIC: Electric (all communities)
    setCheck('Input_571_01', true);

    // ── CHUNK 8 — STATIC + DYNAMIC ─────────────────────────────────────────

    // Disabl Equipd Y/N — STATIC: No
    setField('Input_245', '0');

    // Disabl Feat — SKIP (Disabl Equipd Y/N always No)

    // Heat/Fuel — from community lookup
    setCheckGroup([
      'Input_87_01','Input_87_02','Input_87_03','Input_87_04','Input_87_05',
      'Input_87_06','Input_87_07','Input_87_08','Input_87_09','Input_87_10',
      'Input_87_11'
    ], c.heat_fuel);

    // Porch — payload-driven
    setCheckGroup([
      'Input_92_01','Input_92_02','Input_92_03','Input_92_05','Input_92_04',
      'Input_92_06','Input_92_07','Input_92_08','Input_92_09','Input_92_10',
      'Input_92_11','Input_92_12','Input_92_13'
    ], d.porch);

    // ── CHUNK 9 — STATIC + DYNAMIC ─────────────────────────────────────────

    // Maintenance Contract Y/N — STATIC: No
    setField('Input_671', '0');

    // Unit Placement — payload-driven; TH plans only; stub in for future use
    if (d.unit_placement && d.unit_placement.length > 0) {
      setCheckGroup([
        'Input_657_01','Input_657_03','Input_657_04','Input_657_05',
        'Input_657_06','Input_657_07','Input_657_08','Input_657_09'
      ], d.unit_placement);
    }

    // Cooling — STATIC: Heat Pump (all communities)
    setCheck('Input_88_06', true);

    // ── CHUNK 10 — DYNAMIC ─────────────────────────────────────────────────

    // Water Type — SKIP (no Lennar communities are waterfront)

    // Wall Type — payload-driven
    setCheckGroup([
      'Input_254_09','Input_254_10','Input_254_02','Input_254_07','Input_254_08',
      'Input_254_04','Input_254_05','Input_254_03','Input_254_01','Input_254_06'
    ], d.wall_type);

    // Building/Structure — SKIP (Lennar new construction has no outbuildings)

    // Farm Type — SKIP (not applicable to Lennar new construction)

    // Irrigation Source — SKIP (not applicable to Lennar new construction)

  }).catch(function(e) {
    alert('Bookmarklet error — could not read clipboard: ' + e.message);
  });

})();
```

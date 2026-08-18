// ============================================================
// Lennar CVRMLS Matrix Filler — content script (POC)
// Injects fresh on every Matrix page load (Matrix reloads the
// full page on every tab click — confirmed 2026-08-17 — so no
// MutationObserver/polling is needed to detect tab switches).
// ============================================================

// ---------- Write helpers (verbatim from CVRMLS_Bookmarklet_Source.md v0.6) ----------
// Each write is logged (found/not-found) so the popup can report real
// field-level feedback instead of a bare success/fail.

var __writeLog = { attempted: 0, missing: [] };

function setField(id, value) {
  __writeLog.attempted++;
  var el = document.getElementById(id);
  if (el) { el.value = value; return true; }
  __writeLog.missing.push(id);
  return false;
}

function setCheck(id, checked) {
  __writeLog.attempted++;
  var el = document.getElementById(id);
  if (el) { el.checked = checked; return true; }
  __writeLog.missing.push(id);
  return false;
}

function fireChange(id) {
  var el = document.getElementById(id);
  if (el) { el.dispatchEvent(new Event('change', { bubbles: true })); return true; }
  return false;
}

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

// ---------- Tab detection ----------
// Confirmed signatures — SESSION-HANDOFF-2026-08-17-extension-poc-scoping-and-tab-detection.md §3.
// Cross-checked live across all 11 tabs and the full documented field maps (all 11 tabs,
// including the ~605-field Features map) — zero Input_N collisions found anywhere.

var TAB_SIGNATURES = [
  { tab: 'listing_info',           ids: ['Input_29']  },
  { tab: 'bath_info',              ids: ['Input_57']  },
  { tab: 'features',               ids: ['Input_70', 'Input_571'] }, // one physical tab — both fire together
  { tab: 'general_info',           ids: ['Input_94']  },
  { tab: 'remarks',                ids: ['Input_107'] },
  { tab: 'fee_info',               ids: ['Input_109'] },
  { tab: 'owner_info',             ids: ['Input_118'] },
  { tab: 'agent_office_info',      ids: ['Input_163'] },
  { tab: 'showing_instructions',   ids: ['Input_136'] },
  { tab: 'virtual_tour_info',      ids: ['Input_610'] },
  { tab: 'internet_display_info',  ids: ['Input_227'] }
];

function detectTab() {
  for (var i = 0; i < TAB_SIGNATURES.length; i++) {
    var sig = TAB_SIGNATURES[i];
    var allPresent = sig.ids.every(function(id) { return !!document.getElementById(id); });
    if (allPresent) { return sig.tab; }
  }
  return null;
}

// ---------- Fill functions ----------
// Ported from docs/cvrmls/CVRMLS_Bookmarklet_Source.md v0.6.
// See "The One Delta" in the handoff doc — clipboard-read wrapper stripped,
// payload passed directly as an argument. Everything else is unchanged.

async function fillListingInfo(payload) {
  var d = payload.listing;
  var path = payload.path || "new";

  // Step 1: County/City — must fire first; triggers Area, ZIP, Subdivision, Schools.
  setField('Input_29', d.county_city);
  fireChange('Input_29');
  await wait(1500);

  // Step 2: Area
  setField('Input_30', d.area);
  fireChange('Input_30');
  await wait(800);

  // Step 3: Schools / cascade-dependent fields
  if (path !== "taxid") {
    setField('Input_635', d.zip);
  }
  setField('Input_259', d.subdivision  || "");
  setField('Input_236', d.neighborhood || "");
  setField('Input_41',  d.post_office  || "");
  setField('Input_51',  d.elementary);
  setField('Input_53',  d.middle);
  setField('Input_52',  d.high);

  // Step 4: Remaining Listing Information fields
  setField('Input_31',  d.list_price);
  setField('Input_160', d.list_date);
  setField('Input_849', d.type);
  setField('Input_850', d.attached_yn);
  setField('Input_162', d.expire_date);
  setField('Input_32',  d.delayed_show || "0");
  setField('Input_42',  d.new_resale || "");
  setField('Input_45',  d.year_built_desc || "");

  if (path !== "taxid") {
    setField('Input_99', d.pid || "");
  }

  // Step 5: Street number/name/suffix — SKIP-TAXID. street_dir always writes.
  if (path === "new") {
    setField('Input_34', d.street_num);
    setField('Input_36', d.street_name);
    setField('Input_37', d.street_suffix);
  }
  setField('Input_35', d.street_dir || "");

  // Step 6: Property detail fields — SKIP-TAXID except Lennar (tax record predates
  // new-construction structure). payload.builder === "lennar" check per envelope v1.0.
  if (path !== "taxid" || payload.builder === "lennar") {
    setField('Input_44', d.year_built);
    setField('Input_48', d.rooms);
    setField('Input_49', d.levels);
    setField('Input_47', d.bedrooms);
  }
  if (path !== "taxid") {
    setField('Input_622', d.lot || "");
  }

  setField('Input_97', d.sqft_source || "01");
  setField('Input_879', d.sqft_above_finished   || "0");
  setField('Input_882', d.sqft_below_finished   || "0");
  setField('Input_880', d.sqft_above_unfinished || "0");
  setField('Input_883', d.sqft_below_unfinished || "0");
}

function fillBathInfo(payload) {
  var d = payload.bath;
  setField('Input_57',  d.basement.desc);
  setField('Input_61',  d.basement.full);
  setField('Input_65',  d.basement.half);
  setField('Input_58',  d.level1.desc);
  setField('Input_62',  d.level1.full);
  setField('Input_66',  d.level1.half);
  setField('Input_59',  d.level2.desc);
  setField('Input_63',  d.level2.full);
  setField('Input_67',  d.level2.half);
  setField('Input_60',  d.level3.desc);
  setField('Input_64',  d.level3.full);
  setField('Input_68',  d.level3.half);
  setField('Input_737', d.level4.desc);
  setField('Input_738', d.level4.full);
  setField('Input_739', d.level4.half);
}

function fillGeneralInfo(payload) {
  var d = payload.general;
  var path = payload.path || "new";

  setField('Input_249', d.model_available  || "0");
  setField('Input_94',  d.waterfront       || "N");
  setField('Input_248', d.assd_improvement || "0");

  var disclosureIds = ['LISTAT','NOFORM','NOTREQ','OFFICE','PROPTY',
    'APZ1','APZ2','LESS65','75PLUS','65TO70','70TO75','POTCLZ'];
  disclosureIds.forEach(function(v) { setCheck('Input_102_' + v, false); });
  (d.disclosures || []).forEach(function(v) { setCheck('Input_102_' + v, true); });

  var leadIds = ['LISTAT','NOFORM','NOTREQ','OFFICE','PROPTY'];
  leadIds.forEach(function(v) { setCheck('Input_103_' + v, false); });
  (d.lead_disclosure || []).forEach(function(v) { setCheck('Input_103_' + v, true); });

  if (path === "new") {
    setField('Input_246', d.tax_year || "0");
    setField('Input_95',  d.acres    || "");
    setField('Input_100', d.legal    || "");
  }
  // taxid path: Tax Year, Acres, Legal Description pre-populated — skip all three

  setField('Input_250', d.model_furnished     || "");
  setField('Input_697', d.investor_rental_cap || "");
  setField('Input_700', d.water_depth         || "");
  setField('Input_703', d.energy_efficient    || "");
  setField('Input_702', d.pre_qual_letter     || "");
  setField('Input_696', d.body_of_water       || "");
  setField('Input_96',  d.lot_dimensions      || "");
  // Lot Desc checkbox group intentionally omitted — source doc v0.6 still had this
  // as an open TODO (full option list not finalized) at the time of this build.
  // Not a gap introduced by the extension; matches current bookmarklet state.
}

function fillRemarks(payload) {
  var d = payload.remarks;
  setField('Input_107', d.remarks        || "");
  setField('Input_108', d.agent_comments || "");
  setField('Input_662', '1'); // Copyright Agreement — always Yes, MLS-wide constant
}

function fillFeeInfo(payload) {
  var d = payload.fee;
  setField('Input_109', d.hoa_condo || "0");
  setField('Input_112', d.membership_required || "0");

  if (d.hoa_condo !== "1") { return; } // no-HOA: stop here, matches source early-return

  setField('Input_719', d.addl_hoa || "0");
  setField('Input_110', d.fee_amount      || "");
  setField('Input_113', d.fee_period      || "");
  setField('Input_705', d.management_firm || "");
  setField('Input_115', d.addl_fee_amount || "");
  setField('Input_117', d.addl_fee_desc   || "");

  var feeDescIds = ['01','02','03','04','05'];
  feeDescIds.forEach(function(v) { setCheck('Input_111_' + v, false); });
  (d.fee_desc || []).forEach(function(v) { setCheck('Input_111_' + v, true); });

  var feeInclIds = ['26','19','01','25','18','03','04','05','06','07',
                    '08','27','28','09','10','11','29','12','22','20',
                    '13','14','15','23','21','17'];
  feeInclIds.forEach(function(v) { setCheck('Input_576_' + v, false); });
  (d.fee_includes || []).forEach(function(v) { setCheck('Input_576_' + v, true); });
  // NOTE: fee_includes is SUFFIX-ONLY format ("19" not "Input_576_19") — payload
  // must match. Sending full IDs here produces a silent zero-write (Input_576_Input_576_19
  // does not exist). This exact bug has shipped once already (2026-07-15, 8720 Whitman Dr).

  var allowOnsiteIds = ['1','4','5','6','7','8'];
  allowOnsiteIds.forEach(function(v) { setCheck('Input_116_' + v, false); });
  (d.allow_onsite || []).forEach(function(v) { setCheck('Input_116_' + v, true); });
}

function fillOwnerInfo(payload) {
  var d = payload.owner || {};

  // Owner Name — unconditional write whenever present, regardless of path.
  if (d.owner_name !== undefined) {
    setField('Input_118', d.owner_name);
  }
  setField('Input_119', d.occupant_name || "");
  setField('Input_606', d.occupied_by   || "");

  // Owned By — single-select; check exactly one
  ['02','03','04','06','07','08','01'].forEach(function(v) {
    setCheck('Input_120_' + v, false);
  });
  if (d.owned_by) { setCheck('Input_120_' + d.owned_by, true); }

  // Possession — single-select; check exactly one
  ['01','02','06','03','04','05'].forEach(function(v) {
    setCheck('Input_121_' + v, false);
  });
  if (d.possession) { setCheck('Input_121_' + d.possession, true); }

  setField('Input_122', d.owner_phone    || "");
  setField('Input_857', d.owner_name_2   || "");
  setField('Input_123', d.occupant_phone || "");
  setField('Input_124', d.owner_agent             || "0");
  setField('Input_707', d.agent_related_to_seller || "0");
}

function fillAgentOfficeInfo(payload) {
  var d = payload.agent_office || {};
  // Input_159 (List Agent Code) always pre-filled by Matrix — never touch.
  setField('Input_170', d.co_list_agent_code || '');
  setField('Input_163', d.type);
  setField('Input_164', d.limited_rep);
  // Input_853 (Listing Override / Office Email) — skip, leave blank
}

function fillShowingInstructions(payload) {
  var d = payload.showing;
  setCheck('Input_722_AS', d.accompany_show  || false);
  setCheck('Input_722_AR', d.appt_required   || false);
  setField('Input_136', d.showing_instr_2 || "");
  setField('Input_333', d.lockbox_type    || "");
  if (d.sentrilock_serial) {
    var serial = String(d.sentrilock_serial).padStart(8, '0'); // 7-digit serials, Matrix needs 8
    setField('Input_732', serial);
  }
  setField('Input_138', d.additional_instructions || "");
}

function fillVirtualTourInfo(payload) {
  var d = payload.tour;
  setField('Input_610', d.virtual_tour            || "");
  setField('Input_611', d.additional_virtual_tour || "");
}

function fillInternetDisplayInfo() {
  // Fully static, all four always Yes — no payload read. MLS-wide policy constant.
  setField('Input_227', '1');
  setField('Input_228', '1');
  setField('Input_229', '1');
  setField('Input_230', '1');
}

// ---------- Features (TAB 4) — ported verbatim from bookmarklets/features_a.html
// and bookmarklets/features_b.html (universal, zero builder branching — used for
// every builder including Lennar). Payload keys are top-level features_a / features_b.
//
// setCheckGroup mirrors the bookmarklets' own local `g(ids, sel)` helper: uncheck
// every id in the group, then check whichever ids appear in the payload's selected
// array. Unlike Fee Info, the ids here are already full Input_NNN_SUFFIX strings in
// both the group list and the payload's selected array — no prefix concatenation.

function setCheckGroup(ids, selected) {
  ids.forEach(function(id) { setCheck(id, false); });
  (selected || []).forEach(function(id) { setCheck(id, true); });
}

function fillFeaturesA(payload) {
  var d = payload.features_a;

  setCheckGroup(['Input_541_27','Input_541_01','Input_541_02','Input_541_03','Input_541_04','Input_541_05','Input_541_33','Input_541_06','Input_541_07','Input_541_09','Input_541_10','Input_541_31','Input_541_30','Input_541_11','Input_541_28','Input_541_32','Input_541_12','Input_541_36','Input_541_29','Input_541_34','Input_541_14','Input_541_15','Input_541_16','Input_541_18','Input_541_19','Input_541_20','Input_541_21','Input_541_23','Input_541_24','Input_541_25','Input_541_26'], d.style);
  setCheckGroup(['Input_70_01','Input_70_02','Input_70_11','Input_70_03','Input_70_05','Input_70_06','Input_70_07','Input_70_09','Input_70_10'], d.structure);
  setCheckGroup(['Input_71_01','Input_71_02','Input_71_03','Input_71_04','Input_71_05','Input_71_06','Input_71_07','Input_71_08','Input_71_10','Input_71_11','Input_71_12','Input_71_25','Input_71_13','Input_71_14','Input_71_15','Input_71_16','Input_71_17','Input_71_18','Input_71_19','Input_71_20','Input_71_21','Input_71_22','Input_71_23'], d.siding);
  setCheckGroup(['Input_72_02','Input_72_03','Input_72_04','Input_72_05','Input_72_06','Input_72_07','Input_72_08','Input_72_09','Input_72_10','Input_72_11','Input_72_12','Input_72_13','Input_72_14','Input_72_15','Input_72_16','Input_72_17','Input_72_18'], d.roof);
  setCheckGroup(['Input_73_16','Input_73_01','Input_73_02','Input_73_03','Input_73_15','Input_73_04','Input_73_12','Input_73_05','Input_73_06','Input_73_07','Input_73_08','Input_73_09','Input_73_10','Input_73_17','Input_73_11','Input_73_13','Input_73_14'], d.flooring);
  setField('Input_693', d.golf_frontage_yn || '');
  setCheckGroup(['Input_721_CartPath','Input_721_Fairway','Input_721_Green','Input_721_Tee','Input_721_View'], d.golf_view);
  setCheckGroup(['Input_241_09','Input_241_01','Input_241_07','Input_241_12','Input_241_02','Input_241_08','Input_241_03','Input_241_05','Input_241_06'], d.attic);
  setCheckGroup(['Input_519_01','Input_519_02','Input_519_03','Input_519_04','Input_519_05','Input_519_06','Input_519_07','Input_519_08','Input_519_09','Input_519_10','Input_519_11','Input_519_12','Input_519_13','Input_519_14','Input_519_15','Input_519_16'], d.parking);
  setCheckGroup(['Input_570_01','Input_570_02','Input_570_47','Input_570_03','Input_570_04','Input_570_05','Input_570_35','Input_570_43','Input_570_06','Input_570_07','Input_570_08','Input_570_09','Input_570_10','Input_570_11','Input_570_12','Input_570_31','Input_570_13','Input_570_36','Input_570_14','Input_570_15','Input_570_16','Input_570_44','Input_570_17','Input_570_18','Input_570_19','Input_570_20','Input_570_21','Input_570_45','Input_570_46','Input_570_23','Input_570_32','Input_570_33','Input_570_25','Input_570_26','Input_570_27','Input_570_28','Input_570_29','Input_570_22','Input_570_24'], d.exterior);
  setCheckGroup(['Input_845_ADDINFO','Input_845_CABLE','Input_845_DSL','Input_845_FIBER','Input_845_OTHER','Input_845_SATELLITE','Input_845_UNKNOWN'], d.internet_connected);
  setField('Input_846', d.internet_desc || '');
  setField('Input_150', d.garage_yn || '');
  setField('Input_226', d.num_cars || '');
  setField('Input_861', d.adu_yn || '');
  setField('Input_153', d.basement_yn || '');
  setField('Input_862', d.adu_desc || '');
  setCheckGroup(['Input_539_01','Input_539_02','Input_539_03','Input_539_15','Input_539_04','Input_539_05','Input_539_13','Input_539_16','Input_539_06','Input_539_08','Input_539_09','Input_539_10','Input_539_17','Input_539_21','Input_539_18','Input_539_11','Input_539_14','Input_539_12'], d.garage);
  setCheckGroup(['Input_569_01','Input_569_02','Input_569_03','Input_569_04','Input_569_05','Input_569_06','Input_569_07','Input_569_08','Input_569_09','Input_569_19','Input_569_10','Input_569_11','Input_569_20','Input_569_12','Input_569_17','Input_569_18','Input_569_13','Input_569_14','Input_569_15'], d.basement_foundation);
  setCheckGroup(['Input_568_49','Input_568_19','Input_568_50','Input_568_01','Input_568_56','Input_568_02','Input_568_03','Input_568_04','Input_568_05','Input_568_06','Input_568_07','Input_568_08','Input_568_10','Input_568_09','Input_568_11','Input_568_12','Input_568_57','Input_568_58','Input_568_59','Input_568_60','Input_568_13','Input_568_14','Input_568_15','Input_568_46','Input_568_16','Input_568_17','Input_568_55','Input_568_18','Input_568_20','Input_568_21','Input_568_62','Input_568_22','Input_568_23','Input_568_24','Input_568_48','Input_568_25','Input_568_45','Input_568_26','Input_568_28','Input_568_27','Input_568_29','Input_568_30','Input_568_47','Input_568_31','Input_568_32','Input_568_33','Input_568_61','Input_568_34','Input_568_35','Input_568_36','Input_568_37','Input_568_38','Input_568_39','Input_568_40','Input_568_41','Input_568_43','Input_568_44'], d.interior);
  setCheckGroup(['Input_676_CW','Input_676_OTHER','Input_676_PW','Input_676_WELL'], d.water);
  setCheckGroup(['Input_670_ALTSEPTC','Input_670_COSEPTC','Input_670_COMSR','Input_670_PBLCSR','Input_670_NONE','Input_670_OTHER','Input_670_UNKNOWN'], d.sewer);
  setField('Input_695', d.fenced_yn || '');
  setCheckGroup(['Input_79_01','Input_79_02','Input_79_03','Input_79_04','Input_79_05','Input_79_06','Input_79_07','Input_79_08','Input_79_09','Input_79_10','Input_79_11','Input_79_12','Input_79_13','Input_79_14','Input_79_15','Input_79_16','Input_79_17','Input_79_20','Input_79_18','Input_79_19'], d.fenced);
  setCheckGroup(['Input_540_25','Input_540_24','Input_540_01','Input_540_02','Input_540_03','Input_540_04','Input_540_05','Input_540_06','Input_540_07','Input_540_27','Input_540_09','Input_540_10','Input_540_29','Input_540_26','Input_540_11','Input_540_13','Input_540_14','Input_540_15','Input_540_28','Input_540_16','Input_540_17','Input_540_18','Input_540_19','Input_540_21'], d.restrictions);
  setField('Input_152', d.num_fp || '0');
  setCheckGroup(['Input_90_01','Input_90_02','Input_90_09','Input_90_03','Input_90_08','Input_90_04','Input_90_05','Input_90_06','Input_90_07'], d.fireplace);
}

function fillFeaturesB(payload) {
  var d = payload.features_b;

  setCheckGroup(['Input_534_01','Input_534_02','Input_534_41','Input_534_45','Input_534_33','Input_534_03','Input_534_04','Input_534_05','Input_534_06','Input_534_07','Input_534_08','Input_534_09','Input_534_10','Input_534_11','Input_534_12','Input_534_13','Input_534_31','Input_534_14','Input_534_15','Input_534_36','Input_534_16','Input_534_17','Input_534_42','Input_534_18','Input_534_19','Input_534_29','Input_534_40','Input_534_20','Input_534_37','Input_534_21','Input_534_46','Input_534_22','Input_534_47','Input_534_23','Input_534_24','Input_534_25','Input_534_26','Input_534_43','Input_534_27','Input_534_28','Input_534_44','Input_534_32','Input_534_30','Input_534_34'], d.community_amenities);
  setCheckGroup(['Input_85_03','Input_85_06','Input_85_02','Input_85_05','Input_85_07','Input_85_01','Input_85_04'], d.green_cert);
  setField('Input_244', d.pool_yn || '');
  setCheckGroup(['Input_91_01','Input_91_02','Input_91_03','Input_91_04','Input_91_05','Input_91_06','Input_91_07','Input_91_08','Input_91_09','Input_91_10','Input_91_11','Input_91_12','Input_91_13','Input_91_14','Input_91_15','Input_91_16','Input_91_17','Input_91_18','Input_91_19','Input_91_20'], d.pool_desc);
  setCheckGroup(['Input_81_01','Input_81_02','Input_81_03','Input_81_04','Input_81_05','Input_81_06','Input_81_07','Input_81_08','Input_81_09','Input_81_10','Input_81_39','Input_81_11','Input_81_12','Input_81_13','Input_81_14','Input_81_15','Input_81_16','Input_81_17','Input_81_18','Input_81_19','Input_81_20','Input_81_21','Input_81_22','Input_81_23','Input_81_24','Input_81_25','Input_81_26','Input_81_27','Input_81_28','Input_81_29','Input_81_30','Input_81_31','Input_81_32','Input_81_33','Input_81_34','Input_81_35','Input_81_36','Input_81_37','Input_81_38'], d.appl_equip);
  setCheckGroup(['Input_86_01','Input_86_02','Input_86_03','Input_86_04','Input_86_05','Input_86_06','Input_86_07','Input_86_19','Input_86_08','Input_86_09','Input_86_10','Input_86_11','Input_86_12','Input_86_13','Input_86_14','Input_86_15','Input_86_16','Input_86_17','Input_86_18'], d.heating);
  setField('Input_659', d.heating_other_desc || '');
  setCheckGroup(['Input_571_12','Input_571_01','Input_571_02','Input_571_03','Input_571_04','Input_571_05','Input_571_06','Input_571_07','Input_571_08','Input_571_13','Input_571_09','Input_571_10','Input_571_11'], d.water_heater);
  setField('Input_245', d.disabl_equipd_yn || '');
  setCheckGroup(['Input_83_18','Input_83_19','Input_83_20','Input_83_21','Input_83_03','Input_83_22','Input_83_23','Input_83_24','Input_83_04','Input_83_14','Input_83_09','Input_83_25','Input_83_13','Input_83_07','Input_83_26','Input_83_15','Input_83_16','Input_83_27','Input_83_08','Input_83_17'], d.disabl_feat);
  setCheckGroup(['Input_87_01','Input_87_02','Input_87_03','Input_87_04','Input_87_05','Input_87_06','Input_87_07','Input_87_08','Input_87_09','Input_87_10','Input_87_11'], d.heat_fuel);
  setField('Input_660', d.heat_fuel_other_desc || '');
  setCheckGroup(['Input_92_01','Input_92_02','Input_92_03','Input_92_05','Input_92_04','Input_92_06','Input_92_07','Input_92_08','Input_92_09','Input_92_10','Input_92_11','Input_92_12','Input_92_13'], d.porch);
  setField('Input_671', d.maintenance_contract_yn || '');
  setCheckGroup(['Input_657_01','Input_657_03','Input_657_04','Input_657_05','Input_657_06','Input_657_07','Input_657_08','Input_657_09'], d.unit_placement);
  setCheckGroup(['Input_88_01','Input_88_02','Input_88_03','Input_88_04','Input_88_05','Input_88_13','Input_88_06','Input_88_07','Input_88_08','Input_88_09','Input_88_10','Input_88_11','Input_88_12'], d.cooling);
  setField('Input_661', d.cooling_other_desc || '');
  setCheckGroup(['Input_542_20','Input_542_02','Input_542_03','Input_542_21','Input_542_05','Input_542_06','Input_542_07','Input_542_08','Input_542_34','Input_542_33','Input_542_32','Input_542_31','Input_542_30','Input_542_26','Input_542_22','Input_542_11','Input_542_12','Input_542_13','Input_542_14','Input_542_15','Input_542_23','Input_542_17','Input_542_18','Input_542_24'], d.water_type);
  setCheckGroup(['Input_254_09','Input_254_10','Input_254_02','Input_254_07','Input_254_08','Input_254_04','Input_254_05','Input_254_03','Input_254_01','Input_254_06'], d.wall_type);
  setCheckGroup(['Input_256_24','Input_256_01','Input_256_02','Input_256_03','Input_256_04','Input_256_05','Input_256_06','Input_256_07','Input_256_08','Input_256_09','Input_256_10','Input_256_22','Input_256_23','Input_256_12','Input_256_13','Input_256_14','Input_256_15','Input_256_16','Input_256_17','Input_256_18','Input_256_19'], d.building_structure);
  setCheckGroup(['Input_257_01','Input_257_02','Input_257_03','Input_257_04','Input_257_05','Input_257_06','Input_257_07','Input_257_08','Input_257_09'], d.farm_type);
  setCheckGroup(['Input_258_05','Input_258_01','Input_258_02','Input_258_03','Input_258_04'], d.irrigation_source);
}

// ---------- Message handling ----------

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'GET_STATUS') {
    sendResponse({ tab: detectTab() });
    return false;
  }

  if (message.type === 'FILL_PAYLOAD') {
    var tab = detectTab();
    if (!tab) {
      sendResponse({ ok: false, tab: null, error: 'No known Matrix tab detected on this page.' });
      return false;
    }

    __writeLog = { attempted: 0, missing: [] };

    (async function() {
      try {
        switch (tab) {
          case 'listing_info':          await fillListingInfo(message.payload); break;
          case 'bath_info':             fillBathInfo(message.payload); break;
          case 'features':
            fillFeaturesA(message.payload);
            fillFeaturesB(message.payload);
            break;
          case 'general_info':          fillGeneralInfo(message.payload); break;
          case 'remarks':                fillRemarks(message.payload); break;
          case 'fee_info':               fillFeeInfo(message.payload); break;
          case 'owner_info':             fillOwnerInfo(message.payload); break;
          case 'agent_office_info':      fillAgentOfficeInfo(message.payload); break;
          case 'showing_instructions':   fillShowingInstructions(message.payload); break;
          case 'virtual_tour_info':      fillVirtualTourInfo(message.payload); break;
          case 'internet_display_info':  fillInternetDisplayInfo(); break;
        }
        sendResponse({
          ok: true,
          tab: tab,
          fieldsAttempted: __writeLog.attempted,
          fieldsMissing: __writeLog.missing
        });
      } catch (e) {
        sendResponse({ ok: false, tab: tab, error: e.message });
      }
    })();

    return true; // keep the message channel open for the async sendResponse above
  }
});

// ---------- Announce detected tab on load ----------
// Content script re-injects fresh on every Matrix page load (full reload per
// tab click, confirmed). Announcing immediately is what lets the side panel
// react without the user clicking anything — this is the auto-fill trigger.
chrome.runtime.sendMessage({ type: 'TAB_DETECTED', tab: detectTab() });

---
title: Lennar Restructure Phase Tracker
document_id: FOUND-PHASE-TRACKER-001
version: 0.7
version_date: 2026-09-16
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar Operational Project
---

# Lennar Restructure Phase Tracker

The living-state document for the Lennar Operational Project's restructure. Captures phase structure, decisions landed, decisions parked, and the next session's opening move. Read this first at every session start; update it at every session close.

This is not a vision or charter document — those come later in Phase 0. This is the execution tracker that sits alongside them.

---

## Frame

### What Changed

The AAR-TC Lennar Operational Project has been reframed. The previous model — one Claude session per listing across the full intake-through-close lifecycle, with a heavy doc load and session-driven Airtable/Gmail choreography — is being retired.

The new model separates concerns cleanly:

- **Payload generation** becomes a deterministic script running in the operator's infrastructure, wrapped as an MCP tool or extension surface. Zero session context cost.
- **Matrix self-fill** stays as the Chrome extension does today, expanded to also trigger payload generation and PandaDoc addenda.
- **Lifecycle tracking** happens in the Google Sheet by the operator, with the Sheet as sole source of truth for status, price, and closing data.
- **Claude sessions** become episodic — used for how-to questions from the operator, engineering collaboration on the script and docs, and rare judgment-call escape hatches.

The Lennar Listings Airtable table (lifecycle ledger under the old model) is being frozen as archival. A new Lennar Listings Audit table will replace it, populated at intake time with immutable data only.

### Why This Restructure

Token economics on the Claude Pro tier made the session-driven end-to-end model unsustainable — two new-listing intakes consumed >50% of the 5-hour window. Beyond that, honest review of the workflow surfaced that most session-driven lifecycle work (delta sync, Gmail label choreography, beat orchestration) was solving problems that were not actually the operator's real pain. The Google Sheet was already sufficient for daily tracking.

The real pain the AI stack solves — captured in ranked order from the operator side — is:

1. Field inputs to the Matrix listing tabs (solved: extension + payload)
2. Addenda generation (solved-pending: PandaDoc, ready to activate)
3. Photo download / upload / rearrange (stubbed, on radar as parallel work)
4. Listing tracking outside the Sheet (revised: Sheet is enough)

Prior findings that triggered this restructure:

- `BRIEF-2026-09-04-session-scope-payload-split` — token economics and session-scope split proposal.
- `ISSUE-2026-09-03-beat-scope-triage-and-delta-sync` — beat-scope failures under the old operational model. Superseded by this restructure; the operational model that produced these failures is retiring.

### Multi-Builder Pin

This restructure is being designed with the second-and-Nth builder in mind, not just Lennar. Layer discipline throughout:

- **MLS layer** (objective, per-MLS): CVRMLS Matrix Fields, Cognito Form Fields. Universal across builders.
- **Builder layer** (policy, per-builder): Lennar Payload Rules. Links to MLS layer.
- **Instance layer**: per-listing payloads and audit rows.

A new builder onboards by adding a new Builder Rules table linked to the appropriate MLS base(s). Cross-MLS builder support becomes "link the builder rules to multiple MLS bases." No architectural retrofit.

### Docs, Neutral Operator Framing

The eventual operator is not assumed to be the current author. Docs are authored for a competent real-estate professional with MLS familiarity and Matrix credentials — Lennar workflow inside those systems, not real estate or Matrix in general. Anything below that baseline is training, not documentation.

The primary operator interface for how-to questions is a Claude session that parses the SOP and related docs and walks the operator through the task. The operator is not expected to parse markdown files directly. This shapes doc structure: clean headers, unambiguous section names, clear anchors — Claude-readable and human-readable in the same authoring pass.

---

## Phase Structure

**Phase 0 — Foundation.** CVRMLS Matrix Fields Airtable base designed, built, and populated. Lennar Payload Rules table designed and populated as the Payload Schema audit proceeds. Foundation docs authored: vision/charter, base schema specification, this tracker, maintenance protocol, builder-onboarding protocol. Prerequisite to Phase 1.

**Phase 1 — Payload script standalone.** Python CLI runs against a Cognito entry ID and produces a payload for paste into the existing extension. Bridge value: every intake from Phase 1 completion forward runs through the script; no Claude session needed for payload generation.

**Phase 2 — Extension integration.** Chrome extension expands: adds a "Generate from Cognito Entry" surface, calls the script (now exposed as an endpoint), self-fills the Matrix tabs. UX shift, not a functional one.

**Phase 3 — PandaDoc + audit table + Drive folder + email trigger.** Extension owns intake fully in the browser. Addendum draft generated at extension time, staged in the operator's inbox with a "Send now" button. New Lennar Listings Audit row written. Property Google Drive folder created. All at intake time.

**Phase 4 — Doc refactor.** Retire operational-session behavior in Project Protocol. Reshape New Listing Protocol as reference material Claude parses when the operator asks how-to questions. Close SOP stubs (SOP becomes the primary reference asset for the operator, parsed via Claude session as the interface). Old operational docs marked archival.

Phases execute strictly in order. Phase 1 waits for Phase 0 completion. The existing Ops Project continues to run payloads in the interim under the current model.

---

## Current Phase: Phase 0

### Scope

- Design and build the CVRMLS Matrix Fields Airtable base.
- Populate the Residential Input Form table by walking every Matrix tab.
- Design and populate the Lennar Payload Rules table (separate base) linking to CVRMLS Matrix Fields. Population is the migration of current Payload Schema content plus the example-inferred-rule audit (garage code, phone-number handling, community-name resolution, and anything else currently inferred from examples rather than stated as an explicit rule).
- Author foundation docs: vision/charter, base schema specification, phase tracker (this doc), maintenance protocol, builder-onboarding protocol.
- Populate the small exclusion reference for Matrix hidden infrastructure fields (`_DV_` shadows, `_entryorder_`, `_rowPresence_`) so they are captured somewhere without cluttering the base.

### Decisions Landed This Session

**Project scope.** The existing AAR-TC Lennar Operational Project continues to house the restructure work. New docs stack alongside existing operational docs rather than requiring a new project. Old operational docs will be archived in Phase 4.

**Architecture layers.** Three-layer model established: MLS layer (objective, per-MLS), Builder layer (policy, per-builder), Instance layer. Enforced through separate Airtable bases with cross-base links.

**CVRMLS Matrix Fields as a dedicated base.** Not colocated with Lennar-specific data. Rationale: colocating recreates the intermingling problem at the base level. Other MLSes get their own bases when added.

**Base scope.** Residential Input Form as its own table for now. Additional Matrix input forms (Land, Commercial, Rental) become sibling tables in the same base if and when needed.

**Table structure — single table with grouping.** One Residential Input Form table containing all fields across all 12 Matrix tabs. Primary grouping by Tab; secondary grouping by Section inside the larger tabs (Listing Info, Features). Rationale: the base's primary consumers are the script and Claude sessions — a flat table serves both cleanly, and Airtable's group-by-view feature gives the operator tab-organized browsing when needed. Ten of the twelve tabs are lightweight enough that secondary Section grouping is often unnecessary.

**Sections as a linked table.** Not a text column. Gives sections a place to carry notes and makes filtering / grouping cleaner. Applies primarily inside the two large tabs.

**Field Types as a linked table.** Not a text column on Matrix Fields. Rows are the type enum:

- TEXT
- TEXTAREA
- SELECT
- SELECT_DYNAMIC
- DATE_PICKER
- CHECKBOX_GROUP
- INDIVIDUAL_CHECKBOX
- REPEAT_SUBFORM
- DISPLAY_ONLY

Adding a type when a new MLS surfaces one is a row edit, not a schema change. Hidden infrastructure fields are excluded from the base entirely and captured in a short exclusion reference doc rather than modeled as a type.

**Type-specific parameters as columns on Matrix Fields.** Empty cells on rows that do not use a column cost nothing. Parameters:

- Character Limit (number, populated for TEXT and TEXTAREA where enforced)
- Options (link to Field Options table, populated for SELECT and CHECKBOX_GROUP)
- Cascade Parent (self-link, populated for SELECT_DYNAMIC)
- Explicit Zero Required (boolean, populated for numeric text where Matrix flags blank)
- Repeat Container (self-link, populated for fields inside a REPEAT_SUBFORM)
- Max Selections (number, populated only when a checkbox-group cap is known)
- Yellow Highlighted (boolean, captured; interpretation TBD)
- Notes

**Max Selections column semantics.** Blank means "not enforced" — collapses "no cap exists" and "unknown cap" into one state, since the script treats them identically. Known caps populated at design time; unknowns get surfaced by live inputs going forward and populated then. Progressive knowledge capture.

**Field Options as a linked table.** One row per option (per individual Input ID within a checkbox group, or per option value in a select). Columns: Parent Field (link), Full Input ID, Value, Display Label, Sort Order.

**Individual checkboxes modeled as CHECKBOX_GROUP with a small option set.** Not as separate INDIVIDUAL_CHECKBOX rows. Rationale: same ID pattern, same base structure, and additions later are row edits not schema changes. INDIVIDUAL_CHECKBOX type is retained in the Field Types enum as a fallback for future MLS variations that genuinely differ.

**REPEAT_SUBFORM as first-class type.** Not a documented special case. Room Info's `_Input_144__REPEAT{N}_{fieldNum}` pattern gets a clean handler in the script; any future MLS or form using the same repeating pattern reuses the type without new code paths.

**Payload Schema and Payload Examples reassigned, not deleted.** They become the spec that drives the transform code, versioned alongside the transform. The example-inferred-rule audit is prerequisite work inside Phase 0 and happens as a natural byproduct of populating Lennar Payload Rules.

**Standing progress tracking via this doc.** Every session updates this tracker at close. No separate handoff artifact per session. Next session reads this tracker first as its opening move.

**Lennar Listings Airtable table frozen as archival.** Freeze happens at Phase 4, timed with the doc refactor. Existing table gets a visible "archival — do not edit" marker in the table description. New Lennar Listings Audit table added at Phase 3 for immutable intake-time data (model type, photos used, photo URLs, form submitted date, community, NHC/POC frozen at submission, path, envelope, tax ID or Realist reference, any flags surfaced during generation, MLS# once captured).

**Listing Info fully populated.** 43 of 43 fields, up from the 3 illustrative rows carried since base buildout — 95 Street Suffix options, six County/City-rooted cascade links, and the Sections table's first real use (3 new rows). Full detail in `SESSION-HANDOFF-2026-09-10-LISTING-INFO-PASS.md`.

**Doc architecture confirmed: `CVRMLS_*` docs are the general MLS-wide upstream reference; `Lennar_*` docs are the separate builder layer.** A mid-session mischaracterization (treating the CVRMLS docs as Lennar-scoped) was corrected — the split was deliberate, done in an earlier cleanup pass specifically so `CVRMLS_*` stays builder-agnostic. Restates Charter Design Principle 1 at the doc level rather than introducing anything new.

**Notes column verbosity: not formalized, kept as-is for now.** Field-level usage nuance (timing rules, conditional behavior, edge cases) stays in Residential Input Form's Notes column until a schema doc exists that's actually built to hold conditional workflow logic — removing it now would be data loss, not cleanup, since nothing downstream currently captures it. A future cleanup pass targets stale content specifically (GAP tags for gaps since filled, resolved-ambiguity narrative, session-provenance commentary), not usage-related nuance.

**Features fully populated.** 49 of 49 field groups (up from the 1 illustrative row — Water — carried since base buildout): 48 new Residential Input Form rows, 635 new Field Options rows (639 total for Features including Water's 4). Full detail in `SESSION-HANDOFF-2026-09-14-FEATURES-PASS.md`.

**CVRMLS Features field map fully live-verified.** All 30 previously-unconfirmed checkbox groups (12 Tier-2 suffix-gap candidates plus 18 Tier-1/Tier-3 sequence-clean or small groups) confirmed via Claude-in-Chrome ES extraction. 29 of 30 matched documented content exactly; Siding was missing Composite (`Input_71_26`), corrected in both the field map (now v1.2) and the base. The suffix-gap detection method itself proved structurally blind to additions above the highest known suffix — the Composite miss was found only via full re-traversal, a caution for any future field-map verification that leans on the same heuristic.

**Section field left blank for Features, pending confirmation.** The Sections table's own definition (Section Name = "the section label as it appears in the Matrix UI") and the existing Water row's precedent (no Section link) both point away from inventing a thematic taxonomy for Features. No evidence yet that Features' Matrix UI has real named section panels analogous to Listing Info's three (Listing Information / Location Information / Square Feet were confirmed as real Matrix UI panel labels, not editorial groupings, via the live base). Table Structure's original decision (Decisions Landed, restructure-alignment session) named Features alongside Listing Info for Section grouping — that assumption is now an open question, not a confirmed design, until someone checks Matrix's live Features tab for actual panel headers.

**GAP list rebuilt fresh, per this tracker's own instruction not to trust a stale count — found 25 fields, not 18.** The "18-field GAP list" carried in v0.4/v0.5 undercounted: Listing Info's 2026-09-10 population pass actually flagged 16 GAP fields, not the 9 credited to it in version history. Corrected total: 9 (Bath/Owner/Agent/Showing/General Info pass) + 16 (Listing Info pass) = 25.

**17 of the 25 GAP fields extension-verified via a series of Claude-in-Chrome live-DOM extraction sessions, split one focused prompt per tab/batch to avoid overloading any single ES session.** Covered: Listing Info (Street Direction, Unit/Level, Type/dwelling, New/Resale, Year Built Description, SqFt Source, PUD, 1st Rt of Refusal), General Info (Investor Rental Cap, Water Depth, Model Furnished, Res Energy Efficient Appraisal, Pre Qual Letter), Showing Instructions (LockBox Type, Showing Instr 2), Agent/Office Info (Type), Owner Info (Occupied By). All 17 fields' Field Options written to the base (138 new rows) and their Notes-column GAP flags cleared. Full extraction data and reasoning in `SESSION-HANDOFF-2026-09-15-GAP-EXTRACTION-PASS.md`.

**Four real doc-vs-live corrections surfaced, not just newly-documented fields.** New/Resale (`Input_42`) and Year Built Description (`Input_45`) both had a documented value (`EXIST`) that does not exist in the live DOM — confirmed on both the New-listing and Tax ID entry paths (not path-conditional). SqFt Source (`Input_97`) had `01`/`02` swapped from the confirmed default (`01` = Per Appraiser, not Per Tax; `02` = Per Tax). Showing Instr 2 (`Input_136`)'s documented vacant-property code `LBGD` does not exist — the real code is `LGD`. Standard/resale-listing replacement values confirmed by Andrew: `RESAL` for New/Resale, `ACTUAL` for Year Built Description. All four corrections recorded in the affected fields' Notes column in Airtable; still need folding into `CVRMLS_Payload_Schema.md` and the Showing Instructions reference doc.

**County/City scope decision: stay at the 11 confirmed Richmond-metro jurisdictions, no further extraction.** Full statewide extraction (186 County/City options, with Area/Schools cascading per-jurisdiction) would be its own dedicated session comparable to the original Street Suffix pass — not worth it unless this operation lists outside those 11 jurisdictions, which it currently doesn't.

**Cascade Options table design agreed — not yet built.** Area, Elementary, Middle, and High School are genuinely cascade-scoped (their valid options depend on the selected County/City), which Field Options as currently structured has no way to represent. Agreed design: a new `Cascade Options` table (Field link, Cascade Condition link to Field Options, Label, Value, Input ID, Sort Order) plus a new `Cascade Options` link column on Residential Input Form, populated only for SELECT_DYNAMIC fields — parallel to how `Options` already works for SELECT/CHECKBOX_GROUP, generalized beyond just County/City so any future cascading field (in this MLS or a future one) reuses the same mechanism rather than a one-off table. Deliberately deferred to next session to keep this session focused on closing out the confirmed 17 GAP fields. This will also be the first entry in the not-yet-authored Base Schema Specification doc once that's written.

**Lennar Payload Rules base built as three colocated tables in the existing Lennar base.** Chose the existing Lennar base rather than a new dedicated base — Phase 0 scope reads "(separate base)" but the intent is "separate from CVRMLS Matrix Fields," not "dedicated per Builder-layer table." Three tables created: Source Types (enum, 5 seed rows: STATIC/COGNITO/COMMUNITY_DB/DERIVED/MANUAL_ENTRY), Cognito Fields (Form 17 field inventory, populated incrementally), and Payload Rules (the main table). Rules links intra-base to Community Reference DB, Source Types, and Cognito Fields; column set mirrors the CVRMLS Matrix Fields base's discipline (rich column descriptions, enum-as-table pattern for Source Types). Full detail in `SESSION-HANDOFF-2026-09-16-PAYLOAD-RULES-BASE-BUILD.md`.

**Cross-base linking to CVRMLS Matrix Fields: declined in favor of plain-text Input ID references.** Airtable synced tables evaluated but rejected — sync setup is Airtable-UI-only (outside the connector's reach), sync is not real-time, auto-pauses on inactive source bases, and nested linked-record fields on the sync degrade to text anyway. Runtime cost is equivalent since the Phase 1 script joins Rules ↔ Matrix Fields at generation time by Input ID either way. Reinforced by a parallel proposal in flight to flatten Field Options into Residential Input Form, which would break any sync we set up. Trade-off: typos are silent at authoring time; mitigated by a `Matrix Field Label` column duplicated onto Rule rows for legibility.

**Cognito Fields placed at the Builder layer, not the MLS layer.** Multi-Builder Pin currently lists "Cognito Form Fields" at MLS layer as "universal across builders" — corrected here because Form 17 is `LennarNewListingIntake`, explicitly Lennar-specific per the Session 026 decision ("No builder-name field on the form. Multi-builder reuse will be handled as a separate cloned/tweaked form per builder"). Future builders will get their own Cognito Fields tables in their own bases. Multi-Builder Pin phrasing needs a future revision.

**Excluded-field policy refined across two variants.** Fields the script never touches (Owner Phone, List Agent Code, Supra/Sentrilock LB #, LockBox Type) get no row — Rules stays lean, absence implies "not written." Fields the extension hardcodes without a payload key (Internet Display Info's 4 fields) get rows so the tab is represented and there's no question of whether it was overlooked. Established across Owner Info, Agent/Office Info, and Internet Display Info; LockBox Type moved from "STATIC blank" to excluded during Showing Instructions authoring — Matrix's default is blank, extension is doing an unnecessary write.

**Checkbox-group compound-ID modeling: base field ID with JSON-array Static Value.** Payload Schema splits `Input_722` into `Input_722_AS` and `Input_722_AR`; base treats it as one CHECKBOX_GROUP. Rules follows the base — one row per base field ID with array-valued Static Value (`["02"]`, `["01"]`, `["AR"]`). Static Value column is singleLineText; array-valued rules store the array as literal JSON text. For non-Max checkbox groups (Input_722), the Rule's Notes column captures the "unlisted options explicitly unchecked, not left in default state" intent.

**Payload Rules coverage: 4 of 12 tabs complete — 15 rows written.** Owner Info (7 STATIC), Agent/Office Info (2 STATIC), Internet Display Info (4 STATIC), Showing Instructions (2 STATIC + 1 COGNITO). Three consecutive all-static tabs (Form 17 has no Owner/Agent/Internet-Display sections) established the "small static tab" pattern; Showing Instructions exercised the Cognito Fields link for the first time.

**Data hygiene cleanup in CVRMLS Matrix Fields base.** Seven stale Field Options records deleted, all superseded by 2026-09-15 extraction-pass records that had been left alongside older entries: three from Input_163 Type (old label format with codes embedded, e.g. "ER (Exclusive Right)") and four from Input_333 LockBox Type (2026-09-10 stubs with no Values, superseded by extraction-pass records with proper `02`/`03`/`04` codes). Both fields now show 4 correct options each, matching the live-DOM confirmation.

**Payload Schema §4.7-4.11 imprecisions and omissions: deliberately NOT queued for correction.** Per this session's policy call, the schema stays lightweight and streamlined; the Rules table carries the complete structure. Specifics for provenance: §4.8 doesn't mention Input_853 (base does); §4.11 calls Internet Display fields "MLS-wide constants" (base clarifies they're Lennar-policy constants driven by Listing Agreement §11); §4.9 states LockBox Type as `Static ""` (session-live decision was to exclude entirely). None of these get schema corrections. Value corrections from the 2026-09-15 extraction pass (New/Resale, Year Built Description, SqFt Source, LBGD→LGD) remain queued separately — those are wrong values, not omissions.

### Decisions Parked for Next Session

**Payload Rules authoring — 8 tabs remaining.** This session completed Owner Info, Agent/Office Info, Internet Display Info, and Showing Instructions (4 of 12 tabs, 15 rules). Remaining tabs in ascending complexity: Virtual Tour Info (2 Cognito rules), Bath Info (Cognito-heavy, first repeating-section pattern), General Info (mixed statics + community-scoped), Fee Info (first COMMUNITY_DB rules, first community-scoped rows; also carries the Payload Schema's "capital contribution scope only confirmed for 2 of 5 communities" open question), Remarks (Cognito with character-limit constraints), Listing Info (biggest, community-name resolution derivation), Features (biggest and most complex, includes Payload Schema §5.4.1 Cognito crosswalks). Room Info explicitly out of scope.

**Cascade Options table build.** Unchanged from v0.6 — design agreed, not yet created in Airtable. First candidate for next session's structure work; also seeds the first entry of the not-yet-authored Base Schema Specification doc.

**Whether to write County/City's own flat 11-option list now or hold it with the cascade-table work.** Unchanged from v0.6.

**Post Office and Subdivision closure.** Unchanged from v0.6 — recommended as "working as intended, no extraction needed" since both are explicitly MANUAL, but not yet explicitly confirmed by Andrew.

**Four extraction-pass value corrections not yet folded into source docs.** Unchanged from v0.6 — New/Resale and Year Built Description defaults in `Lennar_Payload_Schema.md`; the SqFt Source default wherever it's recorded; the Showing Instructions `LBGD`→`LGD` reference. Separate from Payload Schema §4.7-4.11 imprecisions surfaced during this session's Rules authoring, which were deliberately NOT queued (schema stays lean per this session's policy call).

**Whether Features' Matrix UI has real Section panels.** Unchanged open item from v0.6.

**Multi-Builder Pin phrasing correction.** Tracker's Multi-Builder Pin lists "Cognito Form Fields" at the MLS layer as "universal across builders" — inaccurate. Form 17 is Lennar-specific (`LennarNewListingIntake`), and future builders will get their own Cognito Fields tables in their own bases. Phrasing needs a future revision but not urgent.

**Extension-side script optimizations surfaced by the Rules audit.** LockBox Type (Input_333) — extension currently writes empty string; Rules says leave untouched. First entry of a running list — more optimizations likely as the remaining 8 tabs are authored. Address at the eventual extension rebuild.

---

## Next Session Opening Move

1. Read this tracker first, then `SESSION-HANDOFF-2026-09-16-PAYLOAD-RULES-BASE-BUILD.md` for the full base structure, cross-base linking decision, excluded-field policy, and 4-tab authoring detail.
2. **Continue Payload Rules authoring — 8 tabs remaining.** Suggested order in ascending complexity: Virtual Tour Info (2 Cognito rules) → Bath Info (Cognito-heavy, first repeating-section pattern) → General Info (mixed statics + community-scoped) → Fee Info (first COMMUNITY_DB rules, first community-scoped rows) → Remarks (Cognito with character-limit constraints) → Listing Info (biggest, community-name resolution derivation) → Features (biggest and most complex, includes Payload Schema §5.4.1 Cognito crosswalks). Room Info explicitly out of scope.
3. **Build the Cascade Options table** (unchanged parked item from v0.6 — design agreed, needs creating).
4. **Fold the four extraction-pass value corrections** into `Lennar_Payload_Schema.md` (New/Resale, Year Built Description, SqFt Source defaults) and the Showing Instructions reference doc (`LBGD`→`LGD`). Payload Schema §4.7-4.11 imprecisions surfaced this session are NOT queued — schema stays lean.
5. **Resolve whether Features has real Matrix UI Section panels** — unchanged open item, a quick live-DOM check settles it either way.
6. Confirm Post Office / Subdivision closure with Andrew if not already settled.
7. Room Info stays deferred — Lennar skips this tab entirely.
8. Residential Input Form population remains functionally complete across all in-scope tabs (Room Info excepted by design) — the 8 remaining GAP-flagged fields (County/City, Area, 3 Schools, ZIP, Post Office, Subdivision) are the deliberately-deferred cascade/MANUAL items, not overlooked gaps.

At session close: bump version and date, refresh Decisions Parked and Next Session Opening Move to current state, and add a Version History row. Substantive decisions migrate to canonical foundation docs, not into this tracker.

---

## Parallel Workstreams

Not part of the phase plan, tracked here so they are not forgotten:

- **Photos** (pain #3). Browser automation for download / upload / reorder to Matrix. Separate from token economics; separate from base structure. Revisit after Phase 3.
- **Standard-listing session-based payload generation.** The old session-based intake shape remains appropriate for standard listings arriving as unstructured collections (old MLS sheets, agent/seller notes, forms). Not being retired; recognized as a different fit than the builder-listing use case that drove this restructure. Lives in its own project scope when built out.
- **Legacy Cognito notification-email intake.** Flattened, delimiter-less text rendering of Form 17 submissions for legacy forms. Escape hatch (flag back to a full Claude session with payload docs loaded) is the current-plan handling; a purpose-built parser is a future option if legacy intake volume warrants it.

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-09-09 | Initial authoring at close of the restructure alignment session. Captures phase structure, session decisions landed, decisions parked for next session, and next-session opening move. Doc ID uses `AAR-TC-LENNAR-` prefix as interim; final prefix and location parked for next session decision. |
| 0.2 | 2026-09-10 | Session close after Restructure Charter drafting. Charter (`FOUND-CHARTER-001` v0.1) landed at `docs/foundation/Lennar_Restructure_Charter.md`. Doc_id updated from interim `AAR-TC-LENNAR-PHASE-TRACKER-001` to confirmed `FOUND-PHASE-TRACKER-001`. All three 2026-09-09 parked decisions confirmed; two-audience principle canonized as Charter Principle 6. |
| 0.3 | 2026-09-10 | Session close after a CVRMLS Matrix Fields base population pass. Populated Bath Info, Owner Info, Internet Display Info, Virtual Tour Info, Agent/Office Info, Showing Instructions, Remarks, Fee Info, and General Info into Residential Input Form (89 rows, 189 Field Options rows — up from 6/8 at session start). 9 fields flagged GAP for a deferred extension verification pass — see `SESSION-HANDOFF-2026-09-10-POPULATION-PASS.md`. Next: Listing Info (3/43 fields done) and Features. |
| 0.4 | 2026-09-10 | Session close after Listing Info population pass. Populated all 43 fields (up from 3 illustrative rows), 95 Street Suffix options, and six County/City-rooted cascade links; Sections table got its first real use. Corrected a mid-session mischaracterization of the CVRMLS docs as Lennar-scoped — confirmed against Charter Design Principle 1 as the general upstream reference instead. GAP list grew from 9 to 18 fields, deliberately held until after Features. Next: Features, with a build-inventory-then-align-with-Andrew checkpoint before any writes — see `SESSION-HANDOFF-2026-09-10-LISTING-INFO-PASS.md`. |
| 0.5 | 2026-09-14 | Session close after Features population pass. Populated all 49 field groups (up from the 1 illustrative row), 635 new Field Options rows (639 total for Features). Live ES verification completed for all 30 previously-unconfirmed checkbox groups — 29 clean, Siding's missing Composite option (`Input_71_26`) added and corrected in the CVRMLS field map (now v1.2). Section field left blank for Features pending confirmation of real Matrix UI panels — flagged as an open question against Table Structure's original decision. GAP-list extension pass no longer blocked. Residential Input Form population functionally complete across all in-scope tabs (Room Info excepted by design). Next: run the GAP extension pass, resolve the Features-Section question — see `SESSION-HANDOFF-2026-09-14-FEATURES-PASS.md`. |
| 0.6 | 2026-09-15 | Session close after the GAP extension-verification pass. Rebuilt the GAP list fresh per this tracker's own instruction and found 25 fields, not the 18 carried in v0.4/v0.5 — Listing Info's 2026-09-10 pass had actually flagged 16 GAP fields, not 9. Extracted and wrote 17 of the 25 via a series of Claude-in-Chrome live-DOM sessions (138 new Field Options rows; all 17 Notes-column GAP flags cleared). Surfaced four real doc-vs-live corrections, not just new data: New/Resale and Year Built Description both had a documented value (`EXIST`) that doesn't exist on either entry path; SqFt Source's `01`/`02` were swapped from the confirmed default; Showing Instr 2's documented `LBGD` code doesn't exist (`LGD` is correct). Standard-listing replacements confirmed by Andrew: `RESAL` and `ACTUAL` respectively. County/City scope decided: stay at 11 confirmed jurisdictions, no further extraction. Agreed the design for a new Cascade Options table (for Area/Schools' per-jurisdiction option scoping) but deferred building it to next session. Confirmed script-writing (Phase 1) is not yet unblocked — Lennar Payload Rules table population is still outstanding and is now the priority. Remaining 8 GAP-flagged fields are the deliberately-deferred County/City-cascade and MANUAL items. Full detail in `SESSION-HANDOFF-2026-09-15-GAP-EXTRACTION-PASS.md`. |
| 0.7 | 2026-09-16 | Session close after Payload Rules base build + 4-tab authoring pass. Three tables built in the existing Lennar base (Source Types with 5 enum rows, Cognito Fields with 1 row, Payload Rules with 15 rows across Owner Info, Agent/Office Info, Internet Display Info, and Showing Instructions). Key design decisions landed: Rules colocated in Lennar base (not a new dedicated base); cross-base link to Matrix Fields declined in favor of plain-text Input ID references (synced-table evaluated but rejected — UI-only setup, sync lag, auto-pause risk, and parallel Field Options flattening proposal all argued against); Cognito Fields placed at Builder layer since Form 17 is Lennar-specific (Multi-Builder Pin phrasing needs future revision); excluded-field policy refined into two variants — "script doesn't touch" gets no row, "extension hardcodes without payload key" gets a row so the tab is represented; checkbox-group compound IDs modeled at base field ID with JSON-array Static Values. Data hygiene: 7 stale Field Options records deleted from CVRMLS Matrix Fields base (Input_163 Type, Input_333 LockBox Type) where the 2026-09-15 extraction pass had left older records alongside corrected new ones. LockBox Type Rule specifically shifted from "STATIC blank" to excluded — Matrix defaults blank, extension currently does unnecessary write (surfaced as extension optimization for the eventual rebuild). Payload Schema §4.7-4.11 imprecisions surfaced but deliberately not queued for correction (schema stays lean); §4.7-4.11 value corrections from the 2026-09-15 extraction pass remain queued separately. 8 tabs and the Cascade Options table build remain for next session. Full detail in `SESSION-HANDOFF-2026-09-16-PAYLOAD-RULES-BASE-BUILD.md`. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

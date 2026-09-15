---
title: Lennar Restructure Phase Tracker
document_id: FOUND-PHASE-TRACKER-001
version: 0.6
version_date: 2026-09-15
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

### Decisions Parked for Next Session

**Cascade Options table build.** Design agreed (see Decisions Landed) — new table plus a new link column on Residential Input Form — but not yet created in Airtable. First candidate for next session; also seeds the first entry of the not-yet-authored Base Schema Specification doc.

**Whether to write County/City's own flat 11-option list now or hold it with the cascade-table work.** County/City itself doesn't need the new table (it's unscoped, top of the chain) — the data already exists in `CVRMLS_County_City_Reference.md`, just not yet in Airtable. Area/Elementary/Middle/High School do need the new table and stay blocked on it.

**Post Office and Subdivision closure.** Recommended as "working as intended, no extraction needed" since both are explicitly MANUAL — never written by the bookmarklet — but not yet explicitly confirmed by Andrew.

**Four doc corrections not yet folded into source docs.** New/Resale and Year Built Description defaults in `CVRMLS_Payload_Schema.md`; the SqFt Source default wherever it's recorded; the Showing Instructions `LBGD`→`LGD` reference. Also unresolved: whether the SqFt Source `01`/`02` swap requires reviewing any live listings that used the wrong code.

**Whether Features' Matrix UI has real Section panels.** Unchanged from prior session — see Decisions Landed, prior session. If Andrew confirms Features has no visible section headers in Matrix, Table Structure's decision should be revised to name Listing Info only; if it does, a live-extraction pass identifies the panel names and boundaries before Section links get added retroactively.

---

## Next Session Opening Move

1. Read this tracker first, then `SESSION-HANDOFF-2026-09-15-GAP-EXTRACTION-PASS.md` for full extraction data, the four doc-correction findings, and the Cascade Options table design.
2. **Scope the Lennar Payload Rules table.** This is now the priority — the field-mapping work does not by itself unblock Phase 1 script-writing; the actual builder-specific logic (migrated Payload Schema content, plus the example-inferred-rule audit: garage code, phone-number handling, community-name resolution, anything currently inferred from examples rather than stated as an explicit rule) is still outstanding and more directly load-bearing for the script than the field map was.
3. **Build the Cascade Options table.** Agreed design in Decisions Landed above — new table plus a new link column on Residential Input Form. Decide alongside this whether to write County/City's flat 11-option list at the same time or separately (see Decisions Parked).
4. **Fold the four doc corrections into source docs** — see Decisions Parked for the full list.
5. **Resolve whether Features has real Matrix UI Section panels** — unchanged open item, a quick live-DOM check settles it either way.
6. Room Info stays deferred — Lennar skips this tab entirely, and it's low priority for this operation otherwise.
7. Residential Input Form population remains functionally complete across all in-scope tabs (Room Info excepted by design) — the 8 remaining GAP-flagged fields (County/City, Area, 3 Schools, ZIP, Post Office, Subdivision) are the deliberately-deferred cascade/MANUAL items, not overlooked gaps.

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

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

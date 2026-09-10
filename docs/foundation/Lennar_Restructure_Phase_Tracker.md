---
title: Lennar Restructure Phase Tracker
document_id: FOUND-PHASE-TRACKER-001
version: 0.3
version_date: 2026-09-10
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

### Decisions Parked for Next Session

**Timing of the extension verification pass for flagged GAP fields.** Nine Residential Input Form fields across Owner Info, Agent/Office Info, Showing Instructions, and General Info carry incomplete option sets, all findable by filtering the table's Notes column for "GAP". Decided not to interrupt the population pass to close them now — batching them into a dedicated extension/Claude-in-Chrome session was judged lower priority than continuing tab coverage. No firm date set; revisit when convenient.

---

## Next Session Opening Move

1. Read this tracker first, then `SESSION-HANDOFF-2026-09-10-POPULATION-PASS.md` for full base state (record IDs, exact tab-by-tab status, conventions used, the GAP list).
2. Continue Residential Input Form population. Two tabs of meaningful size remain:
   - **Listing Info** — only 3 of 43 fields populated so far (the original illustrative rows: County/City, Area, List Price). Needs its own full pass.
   - **Features** — the largest tab (~49 field groups), already scoped in the prior bridge doc as its own multi-session batch.
3. Room Info stays deferred — Lennar skips this tab entirely, and it's low priority for this operation otherwise.

Not for next session unless time permits: the 9 flagged GAP fields (see Decisions Parked above) — batched for a dedicated extension verification pass, not urgent.

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

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

---
title: Lennar Operational Project — Restructure Charter
document_id: FOUND-CHARTER-001
version: 0.1
version_date: 2026-09-09
status: Draft — In Review
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar Operational Project
audience: Engineer user (currently Andrew) maintaining the restructured stack
---

# Lennar Operational Project — Restructure Charter

The frame all subsequent Phase 0 foundation docs inherit. States what the AAR-TC Lennar Operational Project is, what it isn't, and the load-bearing principles that shape every downstream decision.

Read this once to orient. Return to it when a design choice pulls against a principle stated here — the principle is the tiebreaker, or the principle is wrong and needs to be revisited explicitly in this doc, not silently in the downstream one.

---

## Purpose

The AAR-TC Lennar Operational Project is the tooling and documentation stack that operationalizes Lennar builder-listing intake into the CVRMLS Matrix. It exists to solve the operator's ranked pain points — Matrix field entry, addenda generation, intake-time audit, and photo handling — using a script-plus-extension architecture, with the Google Sheet as the operator's daily source of truth for lifecycle and Claude sessions as episodic support rather than operational drivers.

The project is authored with Lennar as the first builder and the second-and-Nth builder pinned as a design constraint from day one. Multi-builder support is not a retrofit target; it is baked into the layer structure.

---

## Design Principles

**1. Layer discipline.**
The stack is organized in three layers, enforced through separate Airtable bases with cross-base links:

- **MLS layer** — objective, per-MLS. What Matrix requires, what field IDs exist, what character limits enforce, what options a select carries. Universal within an MLS, independent of any builder.
- **Builder layer** — policy, per-builder. What Lennar (or the next builder) wants poured into which MLS fields, and under what rules. Links to the MLS layer.
- **Instance layer** — per-listing payloads and audit rows.

Onboarding a new builder or MLS is a data addition, not an architecture change. Any decision that seems to require touching layer boundaries is a design smell to surface, not to accept.

**2. Operator pain drives the architecture, not session pain.**
The old model failed not on technical grounds but on aim — it optimized for problems that weren't actually the operator's top pain. Ranked pain, from the operator's side: Matrix field entry, addenda, photos, tracking outside the sheet. The stack addresses these directly. Anything below the line lives outside the project scope until it earns its way in on evidence, not on symmetry.

**3. Sessions are episodic, not operational.**
Payload generation is a deterministic script running in the operator's infrastructure. Lifecycle tracking is the Google Sheet, maintained by the operator. Claude sessions handle how-to questions via SOP parsing, engineering collaboration on the stack, and rare judgment-call escape hatches. Zero session context is consumed by routine intake once Phase 1 completes.

**4. Multi-builder pin.**
Lennar is the first builder, not the only one. Every design decision is checked against "does this hold when the second builder arrives on a different or additional MLS?" If a decision serves only Lennar, either it is a data value (fine — that is exactly the Builder layer's job) or it is a design smell (surface, fix).

**5. Docs are Claude-and-human-readable in one authoring pass.**
The SOP is the operator interface via a Claude session — the operator is not expected to parse markdown directly. Clean headers, unambiguous section names, and clear anchors are not stylistic preferences; they are the interface contract. Docs are authored so a session can parse them and walk the operator through a task, and so an engineer can read them directly. One pass, both audiences served.

**6. Two audiences, two voices — do not collapse them.**
Working docs (this Charter, the Phase Tracker, the Base Schema Specification, the maintenance protocol, the builder-onboarding protocol) are authored for the engineer maintaining the stack. They assume technical fluency and skip the training. The SOP and help-desk artifacts, which live in the Ops Project, are authored for a competent MLS-familiar operator who is not assumed to be the engineer — and will be tweaked personally for Liz when she takes over the operator role. These are distinct authorial contracts. Do not let SOP-style hand-holding creep into foundation docs, and do not let engineer-voice terseness creep into the SOP.

---

## Architecture

**Payload generation.** Deterministic Python script running in the operator's infrastructure, wrapped as a callable surface for the Chrome extension. Consumes a Cognito entry ID; emits the Matrix payload plus the addendum inputs. Rule inputs come from the Lennar Payload Rules table (Builder layer); field metadata comes from the CVRMLS Matrix Fields base (MLS layer). The script is the single implementation of the transform; the schema and examples docs become its versioned spec.

**Intake browser flow.** Chrome extension owns the intake experience end-to-end at Phase 3 completion. From a "Generate from Cognito Entry" surface: calls the script, self-fills Matrix tabs, generates the PandaDoc addendum draft (staged in the operator's inbox with a "Send now" button), writes the audit row, creates the property Drive folder. The extension is the operator's intake surface; the script is what it calls.

**Lifecycle tracking.** Google Sheet, operator-maintained. Sole source of truth for status, price, and closing data. Not automated. Not Claude-mediated. The Sheet was already sufficient for daily tracking; the restructure formalizes that reality rather than fighting it.

**Claude sessions.** Two shapes, hosted in two different projects:

- *Engineering collaboration* — this project's home base. Working on the script, the docs, the Airtable bases, the extension. Session-driven, doc-heavy, iterative.
- *SOP help-desk* — the eventual production interface for the operator, hosted in the separate Ops Project. Parses the SOP and reference docs to walk the operator through tasks and answer how-to questions. Does not perform intake actions itself.

---

## Roles

**Engineer user.** Currently Andrew. Authors and maintains the working docs, the script, the extension, and the Airtable bases. Reads and updates the Phase Tracker at every session boundary. Consumes engineering-oriented docs directly. Also serves as the operator during the transition and into early production, until the operator role is handed off.

**Operator.** Neutral in the SOP-layer docs; eventually Liz in production, with personal tweaks at the SOP layer when the handoff happens. Runs intake through the extension. Maintains the Google Sheet. Uses Claude sessions in the Ops Project for how-to questions via the SOP. Not expected to parse markdown files directly.

**Claude.** Same model, different context per project. In this project: engineering collaborator on the buildout. In the Ops Project (eventually): SOP-parsing help-desk for the operator. Judgment-call escape hatch in either.

---

## Scope

**In scope**

- Lennar builder-listing intake into CVRMLS Matrix.
- Addenda generation via PandaDoc, activated at extension-integration time.
- Intake-time audit table population and property Drive folder creation.
- SOP authoring for operator how-to (delivered to the Ops Project).
- The three-layer Airtable base structure and its maintenance and builder-onboarding protocols.

**Out of scope for the restructure — parallel or later**

- Photo download / upload / reorder. Parallel workstream, revisited after Phase 3.
- Standard-listing session-based intake. Different fit — unstructured collections from old MLS sheets, agent/seller notes, and forms — lives in its own project scope when built out. The session-driven end-to-end model remains appropriate for that use case; it is retiring only for the builder-listing case that drove this restructure.
- Legacy Cognito notification-email intake. Escape-hatched to a full Claude session with payload docs loaded. A purpose-built parser is a future option if legacy volume warrants it.

---

## Success Criteria

Phase 4 complete means all of the following are true:

- The CVRMLS Matrix Fields base is built, populated across the Residential Input Form, and driving the script.
- The Lennar Payload Rules base is populated with migrated Payload Schema content plus the example-inferred-rule audit resolved (garage code, phone-number handling, community-name resolution, and any other rules currently inferred from examples rather than stated explicitly).
- The Python script owns payload generation. No session context is consumed by routine intake.
- The Chrome extension owns the browser flow end-to-end at intake: Cognito entry → script call → Matrix self-fill → PandaDoc addendum draft → audit row → Drive folder.
- The Lennar Listings Audit table is populated at intake with the immutable data set: model type, photos used, photo URLs, form submitted date, community, NHC/POC frozen at submission, path, envelope, tax ID or Realist reference, any flags surfaced during generation, and MLS# once captured.
- The old Lennar Listings table is frozen as archival with a visible marker in its description.
- The SOP is the primary operator reference, parsed via Claude session in the Ops Project.
- Old operational docs are archived.
- The foundation-layer docs — this Charter, the Phase Tracker, the Base Schema Specification, the maintenance protocol, the builder-onboarding protocol — remain live and maintained.

---

## Governance

**Phase advancement.** Strictly ordered. Phase N does not begin until Phase N-1 completes. The phase structure and current state are tracked in `AAR-TC-LENNAR-PHASE-TRACKER-001`.

**Session boundaries.** Every session opens by reading the Phase Tracker. Every session closes by updating its Decisions Landed, Decisions Parked, and Next Session Opening Move sections and bumping the version. A separate session handoff bridge doc is authored only when the next-session move is not obvious from the tracker alone.

**Doc changes.** Every substantive edit bumps `version` and `version_date`. Version history sits at the foot of each doc. Foundation-layer doc IDs use the `FOUND-` prefix and are filed under `docs/foundation/`.

**Decisions.** Landed decisions belong to the Phase Tracker during the phase they belong to. Once a phase closes, its decisions are canonized into the relevant foundation doc — this Charter, the Base Schema Specification, the maintenance protocol, or the builder-onboarding protocol as appropriate — and the tracker's active state advances to the next phase. The tracker is working memory; the foundation docs are long-term memory.

**Charter revision.** When a design choice pulls against a principle in this Charter, the principle is the tiebreaker — or the principle is wrong and needs to be revised here explicitly, in the same session that surfaced the conflict, before the downstream decision lands. Silent principle drift is the failure mode this doc exists to prevent.

---

## Origin

The restructure was triggered by two prior findings:

- `BRIEF-2026-09-04-session-scope-payload-split` — token economics that made the session-driven end-to-end model unsustainable, and the session-scope split proposal that became this restructure.
- `ISSUE-2026-09-03-beat-scope-triage-and-delta-sync` — beat-scope failures under the old operational model. Superseded by this restructure; the operational model that produced those failures is retiring.

The 2026-09-09 restructure alignment session captured the full realignment. See `AAR-TC-LENNAR-PHASE-TRACKER-001` v0.1 for the phase-by-phase decisions landed and the Phase 0 opening state.

---

## Transition

During the transition, the existing AAR-TC Lennar Operational Project continues to run payloads under the old session-driven model. The switchover happens at Phase 1 completion, when the script is standalone and callable. Phase 4 completes the transition by refactoring the docs, freezing the old Lennar Listings table, and archiving the old operational docs.

The Charter itself is forward-facing: once the transition completes, this doc remains the frame for the restructured project without needing to lean on the transition context. This section will move to a smaller footnote at that point.

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-09-09 | Initial draft authored at Phase 0 session open following the 2026-09-09 restructure alignment. Establishes purpose, six design principles (with two-audience/two-voice as an explicit principle), architecture, roles, scope, success criteria, and governance for the restructured project. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

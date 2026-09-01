---
title: Cursor Handoff — Project_Session_Log_v2.md — 2026-08-31
document_id: HANDOFF-2026-08-31-session-log
date: 2026-08-31
project: AAR-TC (project-level)
---

Apply the change below surgically to `docs/project/Project_Session_Log_v2.md`. Do not modify anything not listed here.

## Change 1

Append a new session entry immediately before the file's closing footer line (the italicized line beginning with `*Log started`). Determine the session number **N** by finding the highest existing `## Session <number>` heading currently in the file and adding 1.

**Add** (immediately before the closing footer):

```markdown
## Session N — 2026-08-31 — Lennar Ops persona, workflow reorder, and automation philosophy

### Context

Discussion session on the Lennar Ops project doc set, focused on two threads Andrew opened: dialing in the user-side workflow (particularly the session-open pacing) and formalizing the tone/persona of Ops sessions. Prompted by a recent listing where the session felt like it was slowing Andrew down rather than moving in parallel with him, plus longer-term planning for Liz taking over Lennar workflow execution as AAR-TC scales to additional builder collaborations.

### Key decisions

**Session-open reordered around a lightweight handshake (Step 0).** Sessions now open with a narrow Cognito read — community and property type only, from the newest entry via `get_entries_in_view` on view `17-3` with `take=1` — then state back to the user what they're seeing, ask whether the Matrix incomplete listing exists yet, and hand the user something concrete to do (create the listing, get the MLS#) while the session pulls the full intake in parallel. Both parties advance during the same span of time. The "quick" part of the read is Claude-side discipline about which fields to look at; the tool returns the full entry either way.

**Path is community-driven, not home-type-driven.** Path (`taxid` vs `new`) reflects parcel-data availability in Matrix, not property type — Everstone was `new` because streets weren't in Google Maps yet, not because it's single-family. Property type is read in the handshake for secondary reasons (sanity check the user hears back, Harpers Mill TH vs SF selection in later steps).

**MLS# is intake-time data now, not later.** Matrix generates the MLS# on the first save of an Incomplete listing, so it's available before the session finishes intake — folded into Step 7's Airtable row-add, removed from the Step 10 handoff Airtable-save line.

**Photo source resolution promoted to Step 4a.** Previously a passing note at the bottom of the doc; now an owned session step that sits between parsing and payload generation. Establishes the multitask handoff point of the intake beat — user starts photo upload while the session builds the payload.

**Addendum trigger rewritten from "send early" to "send only when launch-ready."** Two conditions required: photos secured (from Step 4a) and no open NHC blockers. The old "send early to overlap the signature turnaround" rationale was calibrated for a slower-signer era that no longer applies; a signed addendum in hand for a listing that can't actually go active is worse than a small delay starting the signature clock.

**Persona codified as §4.5 in the Project Protocol.** Two threads: pacing (structure work so the session's next task and the user's next action run in parallel and meet back in the middle) and voice register (confident, directive, guides without being terse, tolerant of hand-holding when it helps). Motivated by the pacing issue Andrew flagged and by planning for Liz as a future operator who won't carry Andrew's mental model of the workflow.

**User-Side Workflow SOP stubbed in §5.3.** Placeholder for a future reference doc capturing manual Matrix/CVRMLS navigation and lifecycle-entry procedures currently held in Andrew's head. Not authored; sessions coordinate with the user directly on how-to questions until it exists.

### Workflow philosophy — captured for cross-project applicability

The discussion surfaced a design discipline that is not Lennar-specific and applies to everything AAR-TC builds with AI — the Aframe connector work, future buyer- and seller-side contract protocol automation, additional builder onboardings, and any future AAR-TC AI initiative.

**Automate the tedious, repetitive, high-volume mechanical work.** Matrix input, addendum sending, record-keeping infrastructure. This is where automation clears its cost — the tedium tax on hundreds of fields per listing across dozens of listings per year is real, and the mechanical nature of the work means the automation stays predictable and maintainable.

**Leave the judgment work, the relationship work, and the low-frequency high-stakes work with the human.** Reading an NHC's email to determine intent, deciding whether an intake anomaly needs a rep conversation or a workaround, activating a listing in Matrix, entering price and status changes. These stay with the user because the human touchpoints are what keep the automation trustworthy and the liability picture clean.

**Automation needs to earn its keep.** Complexity has costs: more surface area to maintain, more potential gaps and unseen failure points, harder for a new operator to hold in their head. Every proposed extension of the harness gets scrutinized against those costs, not just "does it save time in theory." Sounding neat is not a reason to build.

**Not every automation needs to live inside the session's execution surface.** Adjacent tools — the Chrome extension, Cursor-run local Python scripts (Reverse Prospecting is one example), the frozen photo preprocessing tool — stay in the toolbox next to Claude rather than being pulled into Claude's workflow. Coordination around them is fine; absorbing them into the session's scope isn't. This is a specific instance of the earn-its-keep rule: pulling an already-solved adjacent automation into the session adds surface area without proportionate benefit.

**AOR (area of responsibility) framing.** The Ops project stays balanced when user AOR and session AOR are explicit and the boundary between them is maintained by rules rather than vibes. Currently held implicitly across procedural notes in the New Listing Protocol; a candidate for explicit codification in a future protocol revision once the concept has earned enough operational use to name plainly. Applies equally to future Aframe workflow docs and any other operational project.

### Business context

The harness enables scale: four to five builder/agent clients at ~$1,500/mo of largely automated work yields real annual recurring revenue on manageable volume — the target that lets Liz leave her current job. The persona and pacing rules are not polish; they're the difference between "harness that scales" and "harness that becomes a second full-time job for Liz." Every friction point smoothed out compounds over hundreds of listings per year across multiple builders.

The architecture — SOP docs as first-class artifacts, authoring/operational split, versioned specs with Cursor handoffs, formal escalation via Issue Reports, explicit human-in-the-loop for high-stakes actions — matches what enterprise AI teams converge on as they mature past the chatbot phase. Real Broker's Leo CoPilot (in reZEN) sits in the earlier chatbot-over-knowledge-base pattern; what AAR-TC is building sits in the workflow-encoded-agent pattern that is the next shape. Arriving there via solo-operator necessity means the discipline is baked in from the start rather than retrofitted.

Named in-session: "harness engineering" as the term for the scaffolding around the model that turns raw capability into reliable execution — tools, docs, pacing rules, state, boundaries between session decisions and human decisions. This session's philosophy captures apply to the harness discipline in general, not to Lennar specifically.

### Artifacts produced

- `docs/operational/lennar/Lennar_Project_Protocol.md` v1.1 → v1.2 (added §4.5 Session Voice and Pacing; added User-Side Workflow SOP stub to §5.3)
- `docs/operational/lennar/Lennar_New_Listing_Protocol.md` v1.4 → v1.5 (added Step 0 Opening Handshake; added Step 4a Resolve Photo Source; revised Step 5 fill flow to remove Matrix creation; added MLS# to Step 7 Airtable row-add; revised Step 9 addendum trigger; adjusted Step 10 handoff item; Step 1 now reuses Step 0's Cognito response object)
- Cursor handoffs (deleted post-commit per handoff protocol)
- This session log entry

### What we intentionally didn't do

- Didn't rename "Andrew" to "the user" throughout the New Listing Protocol; the persona doc's user-agnostic framing plus new-section language sits alongside existing Andrew-specific procedural text. A rename pass would be a bigger revision than this session's scope and can happen when Liz's onboarding is closer.
- Didn't add forward references from other docs to the yet-unauthored SOP ref doc. When the SOP is authored, cross-references get added then — including likely shortening Step 0's inline taxid/new prereq walkthrough to point at the SOP.
- Didn't extend the automation surface — no changes to what the session does end-to-end, only how it opens, paces, and hands off work. This session was about tuning the human/AI interface, not adding new automation capabilities.
- Didn't pull the Reverse Prospecting solution into the Ops session's scope. It exists as a separate Cursor-run local Python script solved in another project, and stays there.
```

No other changes to `Project_Session_Log_v2.md`.

## Commit

```bash
git rm handoffs/incoming/HANDOFF-2026-08-31-session-log.md
git add -A
git commit -m "Session log v2: Lennar Ops persona, workflow reorder, and automation philosophy"
git push origin main
```

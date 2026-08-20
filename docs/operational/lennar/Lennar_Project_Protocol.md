---
title: Lennar Project Protocol
document_id: LENNAR-OPS-PROTOCOL-001
version: 1.0
version_date: 2026-08-19
status: Active
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar Operational Project
---

# Lennar Project Protocol

The overarching protocol for the AAR-TC Lennar Operational Project. Establishes what this project is, how sessions run in it, what behavior is expected, and what lies inside and outside its scope.

---

## 1. Purpose and Scope

This project exists to execute Lennar new construction listing work — from initial intake through the listing's close — using established Lennar-specific artifacts (protocol, schema, extension, community data). Most sessions in this project process a listing or support a listing already in flight.

This is one of potentially several operational projects in the broader AAR-TC Transaction Services ecosystem. It is not the place where the Lennar workflow is designed, refined, or extended — that work happens in a separate authoring project. This project's job is to *run* the workflow well and consistently, and to surface findings back to the authoring project when the workflow needs to change.

---

## 2. Coherency Context

Sessions in this project have no passive memory or awareness across instantiations. Each new session, and each new turn, starts fresh. The context in this section exists so that a session can reason coherently about what it's doing and why — not just execute mechanically.

### 2.1 The Work

AAR-TC Transaction Services handles MLS listing input for Lennar Homes' new construction sales in the Central Virginia market. Lennar's reps — called NHCs (New Home Consultants) — submit new listings via a Cognito intake form; AAR-TC processes each submission into the CVRMLS Matrix system, keeps the listing in good standing across its life, and completes closing paperwork when the home is sold.

The primary agent of record for all Lennar listings is Gary Martin (Providence Hill Real Estate). Every Lennar listing is created under Gary's Matrix account. The session does not need to know Gary's specific details — Matrix handles agent info at the account level automatically.

Andrew Rich runs AAR-TC and executes the workflow. Sessions in this project work alongside Andrew to do that work.

Andrew is directly responsible and accountable for the accuracy of all data entered into Matrix. Certain lifecycle work requires Andrew to interact with Matrix himself rather than relying on the session or the extension to intermediate: price adjustments and status changes (Pending, Closed, etc.) must be entered in Matrix directly by Andrew, not just recorded in Airtable and the Google Sheet. Reverse Prospecting sheet requests, which come in ad hoc from reps, are also produced by Andrew in Matrix. Sessions coordinate this work — surfacing what needs to happen, tracking state in Airtable, drafting rep communications — but the Matrix-side execution for these specific events is Andrew's.

### 2.2 Matrix and CVRMLS

CVRMLS (Central Virginia Regional Multiple Listing Service) is the MLS covering the Central Virginia market. Matrix is the web application that CVRMLS members use to input, manage, and search MLS listings. It is the source system for what appears on IDX feeds (Realtor.com, Zillow, brokerage sites) and in agent MLS searches — a listing does not exist to the wider market until it exists in Matrix. Accurate, timely Matrix input is therefore the point of AAR-TC's Lennar work.

Matrix organizes listing data across a set of tabs, each covering a category of information — the property basics, bathroom breakdown, features and community amenities, HOA and fee data, showing instructions, and so on. The tab structure reflects how MLS data has evolved into distinct validated categories over time. For Lennar new construction listings, 11 tabs are in scope; Room Info is skipped by Lennar convention. A small handful of Matrix fields (Map, Directions, Subdivision, Post Office) require Andrew to interact with Matrix directly and are not covered by any fill mechanism (see `Lennar_Extension_Reference.md` §5).

The 11 in-scope tabs collectively hold several hundred fields. Most Lennar values follow predictable patterns per community and per home type, which is what makes the payload-plus-extension model viable. Per-tab field detail — every field ID, every static value, every path-specific rule — lives in the Payload Schema. Sessions consult the schema for that detail, not this section.

### 2.3 The Communities

Five active Lennar communities in Central Virginia currently produce listings:

- **Harpers Mill** (Chesterfield) — townhomes and single-family homes
- **Creekside Run** (Chesterfield) — townhomes
- **Everstone** (Henrico) — single-family homes
- **Watermark** (Chesterfield) — single-family homes
- **Wynwood at Fox Creek** — sold out, no new listings expected (retained as historical reference in Airtable)

Community-level reference data — MLS Area, HOA fees, schools, heating, fuel, cooling, community amenities, fee inclusions — lives in the Airtable Community Reference DB table. Sessions read from Airtable at payload-generation time; the session does not carry static community data.

Each community has a defined path (`new` or `taxid`) that determines how certain General Info fields are populated. Path assignments live in the Payload Schema and shift over time as Lennar's assessor timing changes; the schema is the current authority.

### 2.4 The Workflow Ecosystem

This project is one operational branch of a larger transaction services operation. Other branches exist or are anticipated — buyer-side representation work, other builders as they onboard, other MLS systems as AAR-TC expands. The payload envelope keys (`mls`, `builder`, `path`, `phase`) reflect this multi-branch design; a Lennar session only ever sets Lennar-relevant values, but the keys exist because the underlying architecture is builder- and MLS-agnostic.

The Lennar-specific docs in this project are tailored to Lennar's needs. They do not describe the universal MLS or extension architecture, and a session does not need to understand that architecture to do its work. Everything a session needs to run a Lennar listing is contained in this project's doc set and its Airtable and connector access.

### 2.5 Why the Extension Exists

Matrix data entry for a listing spans 11 tabs and hundreds of fields, most of which follow predictable patterns per builder. The original fill mechanism was a set of per-tab bookmarklets — Andrew would generate a payload from a session, then click one bookmarklet per tab to populate fields. This was replaced with a Chrome extension (side-panel architecture) that reads the payload once, persists across Matrix's per-tab page reloads, and fills fields on whichever tab Andrew is currently viewing.

The session's job is to generate the payload. The extension is Andrew's tool for applying it. `Lennar_Extension_Reference.md` describes what the session needs to know about how the extension behaves and how Andrew uses it.

---

## 3. Session Lifecycle

A Lennar listing session spans the listing's full lifecycle — intake, activation, any interim updates (price changes, status changes), and close. That lifecycle can span weeks or months. A session may sit dormant between beats and be resumed when a rep's email announces the next event.

Sessions do not have a rigid "type" — the work in front of the session at any given moment makes the shape of the beat obvious. The beats described below are guides for what to expect and how to open each beat well, not modes the session has to consciously choose between.

### 3.1 Intake Beat

The opening of a fresh new-listing session. Triggered by a Cognito Form 17 submission (or, less commonly, a rep email that hasn't gone through the form).

The intake beat is front-loaded — the bulk of a listing's per-session work happens here. The session parses the intake, resolves community-driven data via Airtable, generates the payload, coordinates with Andrew on any ambiguities, and hands off the payload for Andrew to run through the extension. Airtable is updated to reflect the new listing's initial state, and the Google Sheet main tab entry is created or updated per protocol.

The session should open with a plain statement of what it sees, what it plans to do, and what confirmation it needs before proceeding. This is the operational equivalent of the authoring project's "session review beat" — different content, same purpose: alignment before action.

### 3.2 Working Beats

The main body of any active session, whether intake or resume. The session executes the work described in the New Listing Protocol against the listing at hand, reading and writing Airtable as the source of truth for listing state.

Working beats are where the "Work Within Documented Patterns, Surface Real Ambiguity" rule (§4.1) does most of its work. The session moves through the workflow with confidence when the pattern is documented, and pauses to surface when it isn't.

### 3.3 Resume Beat

The re-entry into a session that has been dormant. Triggered by a rep email announcing a lifecycle event — most commonly a status change (Pending, Closed), a price adjustment, or an ad hoc information request.

Rep emails vary widely in format. The session absorbs whatever arrives — a two-line note, a forwarded confirmation, a formal contract attachment — parses what it can, and reconciles against the Airtable row for the listing. The row is the durable record; session memory is not. Before taking action, the session states what it thinks has happened, what it plans to do about it, and what confirmation it needs from Andrew.

The Activation Double-Check pattern (surfacing ShowingTime, active-listing rep email, and any other post-activation tasks when Andrew reports Active) is one specific case of the Resume Beat and is documented in the New Listing Protocol.

### 3.4 Session Close

A session closes when the current beat's work is complete and Andrew signals the session is done for now. State is committed to Airtable before close. If any issues were surfaced during the beat that warrant an Issue Report, the artifact is generated at close (per §4.2). The session goes dormant until the next lifecycle event brings Andrew back.

There is no session log written to this project. Airtable is the record of what happened to the listing. Chat history is the record of the working conversation.

---

## 4. Behavioral Rules

### 4.1 Work Within Documented Patterns, Surface Real Ambiguity

Sessions in this project derive and proceed when the derivation is one step and grounded in an established pattern. Sessions pause and surface when the situation is genuinely novel, contradicted between sources, or unresolved in the docs.

**Derive and proceed:**

- Intake says "all full baths TS" — apply the TS default per protocol convention. Not ambiguous.
- Intake says "roof: architectural shingles" — apply CVRMLS option "Shingled." Straightforward mapping to a documented static.
- Rep email says "went under contract yesterday" — set status Pending, contract date yesterday. Note the derivation; don't ask.
- Community data field needed — read from Airtable; no need to ask Andrew to confirm what Airtable already knows.

**Surface and stop:**

- Intake for a community not in the Community DB — no way to derive fee_includes, schools, HOA data. Real map-edge; ask.
- Intake omits a field the docs contradict on. (Historical example: siding and flooring for townhomes at one point had conflicting guidance across docs.) When the docs themselves disagree, surface rather than pick a side.
- Rep email says "closing on 9/15" but doesn't give the contract price. Derivable pieces: derivable; missing pieces: ask.
- Extension reports a field write failure — log it, mention it to Andrew, defer troubleshooting to the authoring project (see §4.4).

The intent is that sessions feel like a capable colleague running a listing — moving with confidence through documented patterns, checking in when something's actually off the map. Not a checklist bot that pings for every third value. If it turns out a session is surfacing too often on things it should be handling, that itself is a signal worth an Issue Report — the calibration of this rule is a live design concern.

### 4.2 Escalation via Issue Report

When a session encounters something that indicates a doc, protocol, extension, tool, or community-data issue needs to change, the session escalates via an Issue Report. This is the one and only channel by which the operational project sends findings back to the authoring project. Sessions do not attempt to fix issues in-flight, do not modify docs, and do not carry findings forward informally.

**The flow:**

1. Session encounters an issue during working beat.
2. Session flags it to Andrew in chat immediately — describes what it saw, what impact on current work (if any), and what it proposes as the issue category.
3. Session works around the issue if Andrew directs it to, or pauses if the issue blocks the current work.
4. At session close (or on Andrew's cue mid-session), the session generates the Issue Report as a downloadable markdown artifact.
5. Andrew downloads the artifact and provides it to the authoring project as input for its next authoring session.

**One file per issue, not one per session.** A single session that surfaces two unrelated issues generates two Issue Report artifacts.

**Artifact format:**

```
# Issue Report

Report ID:   ISSUE-YYYY-MM-DD-<slug>
Date/Time:   YYYY-MM-DD HH:MM <timezone>
Address:     <property address>
MLS #:       <MLS number if assigned>
Category:    Field ID | Doc Gap | Protocol Conflict | Community DB
             | Tool Failure | Extension Behavior | Other
Severity:    Low | Medium | High

## What Happened

Concrete description — what triggered the report, what the session
observed, what impact on the current listing if any.

## Context

- Path: taxid | new
- Community: <name>
- Envelope: {"mls":"cvrmls","builder":"lennar","path":"taxid"}
- Any other relevant state

## Proposed Fix or Question

Session's best read on what should happen. Explicit that this is a
proposal, not a decision — the authoring project decides.

## References

Payload excerpts, screenshots Andrew took, linked docs, extension
log output, whatever is relevant.
```

**Filename:** `ISSUE-YYYY-MM-DD-<short-slug>.md`. Slug describes the issue in a few hyphenated words (e.g., `input-102-potclz-stale`, `harpers-mill-th-hoa-fee-changed`, `extension-features-write-timeout`).

**Severity is session-set with a Medium default.** Andrew can override in-chat before the artifact is generated. Low = cosmetic or informational; Medium = affects work quality but doesn't block; High = blocks the current listing or represents a systematic risk.

### 4.3 Airtable as Source of Truth

Airtable is the durable record of every listing's state — MLS Input Stage, status, dates, communities, notes, all of it. Sessions read from Airtable at intake to resolve community data and check for existing listing records. Sessions write to Airtable as work progresses, and always before session close.

Community reference data (fee_includes, MLS Area, heating, fuel, cooling, pool, amenities, schools, HOA) also lives in Airtable, in a separate table. This supersedes the historical markdown Community Reference Database.

If Airtable is unavailable for any reason, the session surfaces the issue to Andrew immediately rather than proceeding without it. A markdown snapshot of the Community DB exists in the authoring project and can be provided on request as a fallback for community data specifically, but the operational project does not carry it.

### 4.4 Execute, Don't Fix

This project executes the Lennar workflow. It does not fix, improve, or extend it.

When a session encounters a stale field ID, an outdated doc reference, a schema gap, a protocol conflict, an extension bug, or any other indication that the workflow's underlying artifacts need to change — the session flags to Andrew, files an Issue Report, and continues with the work at hand (or pauses if blocked). The session does not attempt to patch the docs, propose schema edits, modify community data, or troubleshoot extension internals.

Fix-and-improve work is the authoring project's responsibility. That separation is what makes both projects trustworthy in their own domain.

---

## 5. Scope Boundaries

### 5.1 In Scope

- Lennar CVRMLS new construction listings, intake through close
- Cognito Form 17 (`LennarNewListingIntake`) as the primary intake source
- Rep emails for lifecycle events (Pending, Closed, price changes, ad hoc)
- Airtable read/write for listing state and community data
- Google Drive for property folders and archived documents
- Google Sheet main tab entries and hyperlinks
- Gmail for reading rep intake and lifecycle emails
- Chrome extension coordination (session generates payload; Andrew runs the fill)
- PandaDoc for addendum sending when the paid tier is active; TransactionDesk as current manual fallback
- Reverse Prospecting sheet requests — coordination with Andrew for the ad hoc rep requests he produces in Matrix

### 5.2 Out of Scope

- Buyer-side representation work
- Other builders (Pulte, KB, DR Horton, any non-Lennar builder)
- Other MLS systems (REIN, BrightMLS, any non-CVRMLS system)
- Standard (non-new-construction) listings
- Aframe transaction creation — Lennar listings are tracked via Airtable and Google Sheet only; Aframe is not used
- Cursor handoffs — Cursor is not part of the operational workflow
- Modifying docs, schemas, protocols, extension code, or community data (see §4.4)

### 5.3 Parked as Future Additions

The following are known future capabilities not yet in scope. When a session encounters a request that would need one of these, the session flags it clearly ("that's a documented future capability, not currently in scope") rather than either guessing or acting like the request is unexpected.

- **Active Listing Email (Step 13).** When a listing goes Active, the session composes and sends an email to the appropriate Lennar reps with an MLS listing PDF attached. Trigger, recipient roster, template, and attachment method to be defined. This replaces functionality that was previously handled through Aframe.
- **Formal Reverse Prospecting protocol document.** The work itself is in scope (see §5.1) — Andrew handles rep requests as they come in. A dedicated reference doc capturing the procedure end-to-end is planned once the pattern is formalized. Until then, sessions coordinate with Andrew directly on each request.

---

## 6. Doc Map

### 6.1 Loaded at Session Start

- `Lennar_Project_Protocol.md` — this doc
- `Lennar_New_Listing_Protocol.md` — the workflow SOP; every session runs against it
- `Lennar_Payload_Schema.md` — payload authority; every field the session generates is defined here
- `Lennar_Extension_Reference.md` — what the session needs to know about the extension

### 6.2 Loaded When Needed

- `Lennar_Payload_Examples.md` — canonical payload examples across the path × home-type matrix. Loaded on fresh new-listing intakes as a reference for shape.

### 6.3 Not Loaded — Reached via Connector

- **Airtable Community Reference DB** — community data lookups at payload-generation time. Base `app78fMUwDNBHUZ6r`, table `tbleMbM1WgY8Si2t7`.
- **Airtable Listings table** — listing state read/write across all beats. Base `app78fMUwDNBHUZ6r`, table TBD (session confirms table on first access).
- **Google Drive** — property folders, saved documents.
- **Google Sheet** — Lennar main tab.
- **Gmail** — rep intake and lifecycle emails.
- **PandaDoc** — addendum sending when tier is active.

### 6.4 Not in This Project

The following exist elsewhere and are not consulted by operational sessions:

- The Community Reference DB markdown snapshot — in the authoring project. Provided on request only if Airtable is unavailable.
- CVRMLS universal layer docs (field maps, source, universal schema) — in the authoring project. The Lennar schema is self-sufficient for operational use.
- Extension build doc — in the authoring project, describes internals for maintenance.
- Cursor handoff protocol — Cursor is not part of the operational workflow.
- Authoring project session logs, protocol drafts, agent profiles for non-Lennar work.

---

## 7. Version History

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-08-19 | Initial version. Adapted from the authoring project's `docs/lennar/` doc set following the operational-project split design session. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

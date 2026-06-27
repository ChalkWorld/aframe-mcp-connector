---
title: AAR-TC Aframe Connector — Project Vision
document_id: VISION-001
version: 1.0
version_date: 2026-06-17
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted vision session
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# AAR-TC Aframe Connector — Project Vision
### AAR-TC Transaction Services | Document ID: VISION-001

---

## Purpose

This document captures the *why* and *what* of the AAR-TC Aframe Connector project — articulated clearly enough to drive prioritization decisions, protocol design, and tool development. It is not a roadmap or a technical spec. It is the answer to: *"What do you actually want out of this project?"*

This document was produced in a vision session on 2026-06-17 and reflects Andrew Rich's intent in his own words. It supersedes any implied priorities from prior execution sessions.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-17 | Andrew Rich / Claude | Initial vision document. Produced in dedicated vision session. |
| 1.1 | 2026-06-17 | Andrew Rich / Claude | Added: one-session-per-file concept, Gmail label schema, ! Stages structure, broker platform out-of-scope boundary, Gemini bookmarklet note, document upload note. |

---

## 1. What Problem Does This Project Solve?

I run my TC business out of Aframe and Gmail. When a new contract comes in — buyer side or seller side — there's a predictable block of work that has to happen before I can actually start managing the file: create the Aframe transaction, populate all the merge fields, apply the right task templates, apply the right dates template, apply the right attachments template, configure the conditional tasks (omit the ones that don't apply), enter all the contract dates, add every participant, and create the Gmail label. None of that work requires judgment. It's all data entry driven by information that's sitting right there in the contract PDF, the Cognito intake form, and the pre-approval letter.

That setup block takes real time — 30 minutes for a single file, roughly 2 hours when four come in at once. And because it's tedious data entry rather than actual TC work, it's also where mistakes happen: wrong date calculated, wrong template applied, participant info entered incorrectly.

The same problem exists on the Lennar side. Processing a new Lennar listing from Carly's email involves a long MLS data entry process and a parallel Aframe file setup. The Aframe piece currently adds overhead without adding value — because there's no automation behind it.

What I want is for a Claude session to handle the setup block. Give it the documents, and the file comes out the other side ready to work — participants in, merge fields populated, templates applied and configured, dates entered, Gmail label created. I review, I click activate, I move on to actual TC work.

---

## 2. What Is the Shape of the Tool?

The project has two components that are equally essential and neither works without the other:

**The connector** is the mechanism — it gives a Claude session the ability to read from and write to Aframe, submit Cognito forms, interact with Gmail, and eventually work with other systems. Without the connector, a session can read a contract but can't act on it.

**The protocol** is the brain — it tells the session what to do, in what order, under what conditions, using what data from which sources. Without the protocol, the connector is just plumbing. A session with tools but no protocol doesn't know which task template to apply or which tasks to omit or what the Gmail label should be named.

The vision is: for each workflow, a complete protocol document exists AND the connector tools it depends on are built. They ship together. A workflow isn't done until both halves are in place.

### What the tool does

The tool handles **file setup** — the predictable, data-driven work that happens between "contract received" and "file is ready to manage." It operates in two modes:

**Mode 1 — Intake:** A new contract or listing arrives. The session reads the source documents (contract PDF, Cognito form, pre-approval letter), extracts everything it needs, and builds the Aframe file as completely as possible in one pass. It applies templates, configures tasks, enters dates, adds participants, and creates the Gmail label. What can't be completed on day one is documented in an intake note so nothing falls through.

**Mode 2 — Update:** As the file progresses, new information arrives in email — a TC on the other side introduces themselves, the closer sends their contact info, an amendment changes a date. A session reads the relevant email thread for a file and updates Aframe accordingly: adds the new participant, updates the field, logs a note, checks off completed tasks. This extends the setup process over time without requiring manual data entry every time something new comes in.

**One session per file:** The intended working model is one persistent Claude session for the life of each file. The session isn't a one-shot intake tool — it accumulates context as the file progresses. When you return to it, the session can re-orient itself by querying Aframe for the current state of the transaction (what's populated, what participants are in, what tasks are complete or outstanding), then continue from where it left off. This makes `get_transaction`, `list_transaction_participants`, and `search_tasks` load-bearing tools — they're how the session re-orients, not just how it writes.

### What the tool does not do

The tool does not replace judgment. Compliance review, negotiation strategy, agent communication, deciding whether to waive a contingency — those stay with Andrew. The tool handles data entry and file configuration, not TC decision-making.

The tool does not eliminate Andrew from the process. The model is: session does the work, Andrew reviews and activates. Particularly while the tool is maturing, Andrew's eyes on the output before anything goes live is the right posture.

The tool does not currently handle document uploads to Aframe, email sending, or broker platform interactions. Those remain manual for now.

**Broker platform setup is a defined manual boundary.** Every file requires setup in the agent's broker compliance platform — Exp uses SkySlope, Real uses ReZen, PHRE uses Brokermint. These are three different systems, each with their own interface, and Andrew knows them well. A session has no path into any of them, and this is intentional — Andrew maintains direct control over compliance platform setup. The session's output (organized contract data, participants, dates) reduces the cognitive load of doing that manual step, but the step itself stays with Andrew.

---

## 3. Which Use Cases, In What Priority?

### Priority 1 — Buyer-Side Contract Intake (Mode 1 + Mode 2)

This is the headline use case and the one with the highest leverage. A buyer-side contract is the most common file type and has the most complex setup: multiple template selections, the most conditional task omits, the most participants to add, and the most dates to enter.

**Source documents:** Ratified contract PDF, Simplified AAR-TC New Contract Form (Cognito), pre-approval letter PDF (when available).

**What a session does:**
- Extracts all contract data: address, price, dates, financing type, AS-IS flag, rent back flag, referral flag, HOA, well, septic, home warranty, concessions, paragraph 23 notes, broker
- Reads the Cognito form entry: buyer contact info, lender, settlement contact, inspection details, commission, admin fee, missing docs
- Creates the Aframe transaction
- Populates all merge fields (commissions, earnest money, financing type, HOA, well, septic, concessions, notes, etc.)
- Determines and applies the correct task template combination:
  - Always: New Pending Buyer + Buyer Side New In-take Checklist
  - Inspection: Standard or AS-IS based on contract
  - Property type: Land or New Construction variants replace standard if applicable
  - Additive: Rent Back if applicable, Buyer Side Referral if applicable
- Determines and applies the correct dates template (Standard / AS-IS / CASH / AS-IS+CASH / Land / New Construction)
- Determines and applies the correct attachments template based on broker (Real→ReZen, Exp→SkySlope, Providence Hill or other→Generic; plus New Construction or Land variants)
- Omits conditional tasks that don't apply: financing tasks if cash, HOA tasks if no HOA, well/septic tasks if neither present, commission wire admin fee task if no admin fee — and any others defined in the protocol
- Enters all contract dates into the dates template
- Adds participants: buyers (from form), listing agent (from contract/MLS), lender (from form + pre-approval), settlement contact (from form) — searching existing Aframe contacts first, creating new only when not found; flags Beth Proffitt as default Closer on every buyer-side file
- Creates Gmail label for the file following the established schema (see Gmail Label Schema below)
- Logs an intake note summarizing what was populated and what's still outstanding (TC other side, closer other side — to be filled via Mode 2)

**When the form isn't submitted:** Session works from contract PDF alone. Flags effective date as needing confirmation. Proceeds with everything it can extract.

**Mode 2 continuation:** As emails arrive for the file — other side TC introduction, closer contact, amendment — a session reads the thread and updates Aframe: adds the participant, updates the field, logs a note.

---

### Priority 2 — Seller-Side Contract Update

When one of Andrew's listings goes under contract, the Aframe transaction already exists from the listing-side setup. The workflow is an update, not a create.

The seller-side contract intake shares most of the same logic as buyer-side — same template selection decisions, same omit conditions, same date entry — but applied to an existing transaction rather than a new one. The key differences:

- Transaction already exists: session finds it by address and updates rather than creates
- Broker is always known (it's Andrew's agent's broker)
- Seller info may already be in the file; buyer info comes from the contract
- Status flips from listing-active to under-contract

The seller-side protocol will be defined separately once Priority 1 is fully operational. The connector tools needed are largely the same.

---

### Priority 3 — Lennar Listing Input (Aframe piece)

The Lennar workflow has two distinct problems: MLS data entry (a separate topic, potentially addressed differently) and Aframe file setup. This priority covers only the Aframe piece.

When Carly Evans forwards a new listing via email, a session should handle the Aframe side automatically: create the transaction with Lennar-specific defaults (Primary Agent: Gary Martin, TC/Assistant: Andrew Rich, Seller Company: Lennar, Status: Lennar Active), apply the Lennar task templates, and log an intake note. The broader MLS data entry workflow is governed separately by `AAR-TC-LENNAR-PROTO-001` and its successors.

The Aframe piece of Lennar currently adds overhead without value because it's fully manual. Automating it makes it free — it becomes something that just happens when the listing email arrives, with no additional work from Andrew.

---

## 4. What Does Success Look Like?

Success is not a feature count. It's a feeling about the work.

**Near-term (Priority 1 operational):** A buyer-side contract comes in. I forward the documents to a Claude session. Ten minutes later, the Aframe file is set up — merge fields populated, templates applied, tasks configured, dates entered, participants added, Gmail label created. I open the file, review it, click a few things to apply templates (until that's automated), and move on. The setup block is gone. That 30-minute grind per file is gone.

**Medium-term (Mode 2 operational):** As emails come in on a file, I don't have to manually update Aframe. I paste the email thread into a session, it finds the file and updates it. The file stays current without me being the human copy-paste machine between my inbox and Aframe.

**Longer-term (all three priorities operational):** Every file type I handle has a protocol and the tools to back it up. New files get set up in one session. Ongoing files get updated as information arrives. Lennar listings create their own Aframe entries automatically. I spend my time on TC work — compliance, communication, coordination — not data entry.

**The specific feeling of success:** I stop dreading the setup block. Right now when four contracts come in at once, that's a two-hour grind before I can start actual work. When this project is done, four contracts coming in at once is fine. The sessions handle setup; I handle TC.

---

## Gmail Label Schema

Gmail labels are the organizational backbone of the file system alongside Aframe. A session must create the correct label at intake and understand the full schema to navigate threads for Mode 2 updates.

**Two separate color-coded trees:**

The **green `@ TC Transaction Folder`** tree handles all standard TC files:
- `@ TC Transaction Folder/[address]` — active file, created at intake
- `@ TC Transaction Folder/! Future and Active Listings/[address]` — listing-side pre-contract
- `@ TC Transaction Folder/Released Files/[year]/[address]` — fallen-through deals
- `@ TC Transaction Folder/Closed Files/[year]/[month - Month]/[address]` — closed, archived by month

The **light blue `Lennar`** tree handles all Lennar listings:
- `Lennar/[address]` — active listing, created at intake
- `Lennar/@Under Contract/[address]` — gone under contract
- `Lennar/Closed/[address]` — closed

**Address prefix conventions:**
- `(NC) [address]` — New Construction file (e.g. `(NC) 9119 Verneham Ct`)
- `(New) [address]` — second file at an address that already has a label (e.g. investor buys, then same house sells 6 months later — the seller-side file gets the `(New)` prefix)

Before creating a label, a session should check the existing label list to determine whether the `(New)` prefix is needed. The Gmail connector supports this via `list_labels`.

**`! Stages` labels** — a parallel label set designed for batching email by workflow stage (1 New Contracts, 2 New Listings, 3 Compliance, 4 Lending/Finance, 5 Pre-Closing, 6 Post-Closing, 7 Emergency, 8 30 seconds or less). These exist and are structured but are not currently applied consistently. A session could apply and advance these automatically as files progress — this is a future enhancement, not a current requirement.

---

## Lennar MLS Data Entry — Bookmarklet Approach

The Lennar MLS data entry problem (separate from the Aframe piece) has a viable solution worth capturing: a browser bookmarklet that injects JavaScript into the CVRMLS Matrix listing input page, populating fields directly from DOM element IDs. A session parses the Lennar intake email, generates a JavaScript payload mapped to Matrix's HTML field IDs, and when Andrew opens a blank listing sheet and clicks the bookmarklet, all text fields, dropdowns, and checkboxes populate instantly — reducing data entry to under two minutes.

Key considerations: field mapping relies on Matrix's HTML structure remaining stable; if CVRMLS updates their UI, the mapping may break silently and need to be updated. This is an acceptable tradeoff given the time savings.

This approach lives as a defined step within `AAR-TC-LENNAR-PROTO-001`, not within the Aframe connector project. The session generates the bookmarklet payload on demand per listing; it is not a standing tool.

## 5. Pre-Automation Cleanup — Fix It First

Before certain capabilities can be automated, the underlying Aframe configuration needs to be session-friendly. These are one-time improvements to make in the Aframe UI before building the corresponding connector tools:

**Task list redesign:** Add explicit boolean flags at the top of each task template for HOA, well/septic, and any other conditions that currently require human judgment to identify. Make all conditional tasks explicit children of those flags, the same way the financing task already works. Document every omit condition explicitly — nothing implied. This work defines the omit protocol and makes `update_task` straightforward to implement.

**Date template cleanup:** Make the omit conditions for each date explicit and tied to the same boolean flags used in the task lists. The current "MARK ANY DATES NOT NEEDED AS OMITTED" instruction is a human judgment call — it needs to become a defined list of conditions per date field.

**Attachment template review:** Already cleaner than the others. Verify that HOA Resale Certificate, Well/Septic report, and WDI slots have clear omit conditions aligned with the same flags.

**Cognito form review:** Consider whether broker should be added as a field to the Simplified buyer-side form to make attachment template selection explicit rather than inferred from the contract. Low priority since broker is readable from the contract, but worth evaluating.

---

## 6. Implied Roadmap Priorities

*This section names the implied priority shifts for `CONNECTOR-ROAD-001` without rewriting that document. A dedicated roadmap revision session should follow.*

**Rises in priority:**
- `apply_task_templates` — currently Tier 3, should move to Tier 2. Template application is the single biggest manual step remaining after intake. Without it, every session still requires UI clicks for the most critical part of file setup.
- `search_tasks` + `update_task` (omit) — currently Tier 3. Required to configure task lists after template application. The task cleanup (Fix It First above) should happen before building this, but once it does, this becomes high priority.
- `search_transactions` — currently Tier 3. Required for duplicate detection (buyer side) and finding existing transactions to update (seller side). Should move up.
- `list_task_templates` + `list_transaction_statuses` — currently Tier 3 discovery tools. Needed so sessions can self-discover template IDs and status IDs rather than relying on hardcoded values.

**Stays at current priority:**
- Contacts + participants (Tier 2) — remains the right next build. Participant setup is the second-biggest manual block after template application, and the search-before-create pattern requires both contacts and participants endpoints.

**Deprioritized or deferred:**
- Webhooks — still out of scope. No workflow requires reactivity right now.
- OAuth 2.1 — still deferred. Single-user POC posture is fine for current scope.
- Email queue, attachments, contact notes — remain Tier 4. No workflow dependency in current scope.

**New item — not previously on roadmap:**
- Gmail integration for Mode 2 (email parsing → participant updates). Currently handled via Gmail MCP connector in Claude sessions. Needs a defined protocol before it can be systematized. Add to workflow documentation scope, not connector build scope.

---

## Relationship to Other Documents

```
VISION-001           THIS DOC         — what the project is for
CONNECTOR-ROAD-001   Tool Roadmap     — what to build and when (revise after this doc)
CONNECTOR-REF-001    Tech Reference   — how the connector is built
WORKFLOWS-FW-001     Workflow Frame   — index of protocol documents
WORKFLOWS-BUYER-001  Buyer Protocol   — Priority 1 protocol (to be written)
WORKFLOWS-SELLER-001 Seller Protocol  — Priority 2 protocol (to be written)
WORKFLOWS-LENNAR-001 Lennar Protocol  — Priority 3 Aframe piece (to be written)
AAR-TC-LENNAR-PROTO-001              — Lennar MLS workflow (existing, separate)
```

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

---
title: Seller Under Contract — Session Protocol
document_id: WORKFLOWS-SELLER-001
version: 1.1
version_date: 2026-06-30
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Seller Under Contract — Session Protocol
### AAR-TC Transaction Services | Document ID: WORKFLOWS-SELLER-001

---

## Purpose

This document governs sessions where one of Andrew's existing listings goes under contract. Unlike buyer-side intake (`New_Buyer_Side_Session_Protocol.md`), this is **always an update to an existing Aframe transaction**, never a creation. The listing-side file already exists from the New Listing protocol — primary agent, listing merge fields, and at least one participant (the Seller) are already on the transaction before this protocol begins.

The session's job: read the ratified contract, add the buyer-side participants, populate the contract-stage merge fields, flip the transaction status, apply the correct task template, and verify the dates template the agent applied matches the deal. What the session cannot do — date/attachment template application, event entry, and task omission — is documented explicitly below rather than glossed over, because those gaps shape how work is divided between the session and Andrew.

This document was built from a live working session on the 7113 Deer Run Ln file (Kelly Painschab, xactionId 524298) on 2026-06-30, and reflects decisions made in that session.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-30 | Andrew Rich / Claude | Initial protocol document, built from the Deer Run working session. |
| 1.1 | 2026-06-30 | Andrew Rich / Claude | Structural mirror pass against buyer-side protocol v1.2: added Commission and Payout (single-rate), Services Requested, full merge field master tables (Standard + Native), Land Listings section, and the missing-signatures compliance rule. |

---

## Reference Documents

| Document | ID | Purpose |
|---|---|---|
| New Buyer Side Session Protocol | — | Structural sibling — buyer-side intake; shares contact creation rules, role IDs, and merge field patterns |
| Agent Profiles | — | Per-agent defaults: default closer, admin fee, commission, gender fields, file quirks |
| Aframe Connector Technical Reference | CONNECTOR-REF-001 | Connector architecture and operational gotchas |
| Pre-Automation Cleanup Checklist | PREAUTOMATION-001 | Documents the task-omit field removal (see Known Limitations) |

---

## How a Session Starts

Andrew provides the address and agent name, or forwards the signing-complete email directly (e.g. an Authentisign "Signing complete" notification). The session:

1. Searches Gmail for the signing email and any related thread (offer, possession agreement, addenda)
2. Reads the contract PDF(s) in full — main purchase agreement plus any separately-signed addenda (possession agreement, escalation addendum, etc.)
3. Searches Aframe by address (`search_transactions`) to find the existing listing-side transaction — **do not create a new transaction**
4. Confirms the transaction found matches the agent and address before making any changes

### Gmail label move

New listings already have an address label under `@ TC Transaction Folder/! Future and Active Listings/[Address]`, created at listing intake. Once the listing goes under contract, that label moves up to live directly under `@ TC Transaction Folder/[Address]` — out of the future/active listings bucket entirely, not into a different subfolder. This is what makes the file visually show as under contract at a glance in the label tree.

**This move is UI-only.** There is no label create/rename/move tool available to a session — only `label_thread`/`unlabel_thread` and the message-level equivalents, which add or remove an *existing* label from a message or thread. Renaming a label's nested path (which is how Gmail represents label hierarchy — the parent/child relationship lives in the label name string itself, not a separate field) isn't something the connector can do. The session's job is to identify and flag the move, not perform it:

1. Find the existing address label (`list_labels`, match by address) and confirm it's currently nested under `! Future and Active Listings`
2. Flag the move for Andrew in the handoff summary (Step 10) rather than attempting it
3. Search for any other emails associated with this contract that don't already carry the address label — the signing-complete notification, any prior offer/negotiation threads, anything else tied to this address — and apply the existing label ID to them via `label_thread`. This part *is* in-session work, since it's adding an existing label, not renaming one.

---

## Step 1 — Read the Contract in Full

Extract the following before touching Aframe. Read every page, including separately-signed addenda — a possession agreement or escalation addendum is a separate PDF from the main purchase agreement and carries its own terms.

**Transaction Details**
- Purchase price
- Ratification date — the date of the **last** signature across all parties, not the date the offer was drafted or sent. Check Gmail thread first if ambiguous on the contract itself.
- Financing type (Cash, Conventional, FHA, VA, etc.)
- EMD amount, escrow holder, due date (days after ratification)
- Settlement date and settlement company (this is the **buyer's side** settlement company on a seller-side file — see Step 6 closer note)
- Seller concessions (dollar amount, what it covers)
- Buyer broker compensation (percentage or dollar amount, who pays)
- Inspection terms — active with repair rights, AS-IS, or informational only; inspection deadline (days from ratification)
- Repair cap / limitation amount if specified in Additional Terms
- HOA / Well / Septic / Home Warranty status (usually already set from listing intake — verify, don't assume)
- Possession / rent-back terms if a separate Possession by Seller Agreement is signed: occupancy deadline, occupancy fee structure, escrow deposit amount and holder
- Paragraph 23 / Additional Terms — read in full; note if a conflict-resolution clause exists between typewritten and pre-printed contract terms (see Step 7 note on this)

**Participant Data**
- Buyer(s) — full names as signed; determine grouping (see Step 5)
- Buyer's agent — name, brokerage, email, phone, DPOR license
- Buyer's settlement company — name as it appears on the contract (individual contact name usually not yet known)

**Signature Verification**
Confirm all required signatures are present and dated. Note the latest date among them as the ratification date.

---

## Land Listings — What's Different

A land contract under contract is a subset of the standard seller-side contract, not a parallel workflow — most of Step 1's extraction list still applies. The differences:

- **Fewer contingencies** — no home inspection paragraph, no well/septic/WDI in the residential sense (a land deal may still have soil-related contingencies, see below), no home warranty
- **One addition: Soil and Feasibility Study Due Diligence Date** — extract this date from the contract the same way EMD due date or inspection deadline is extracted on a standard contract. This is the land-specific deadline that doesn't exist on residential contracts and needs its own entry once the dates template is applied.
- **Fewer tasks** — the land task template (`Listing Under Contract - LAND`, ID 42120 — confirm current ID via `list_task_templates` before applying, template IDs can change) reflects the reduced contingency set; it replaces 29771, don't apply both.

Everything else in this protocol — contact rules, merge field formatting, participant roles, the Known Limitations section — applies the same way to a land file as a standard one.

---

## Step 2 — Find the Existing Transaction

Search Aframe by address (`search_transactions`, `searchAddress` parameter). The transaction will already show:
- `xactionSide: SELLER`
- Status: `Active` (or another pre-contract listing status)
- Primary Agent already set to the roster agent
- Seller already a participant
- Listing-stage merge fields already populated (HOA, Well, Septic, Subdivision, etc.)

If no matching transaction exists, stop and flag this to Andrew before proceeding — a missing listing-side transaction means something is wrong with either the address or the file setup, not that a new transaction should be created.

---

## Step 3 — Present Extracted Data for Confirmation

Before touching Aframe, present a clean summary of everything pulled from the contract: price, dates, financing, concessions, commission, possession terms, and all buyer-side participants with their planned contact structure. Andrew reviews and confirms — including any judgment calls (see Step 7 paragraph 23 note) — before the session proceeds.

---

## Step 4 — Search Aframe Before Creating Any Contact

Same rule as buyer-side: never create a contact without searching first.

- Search by company name as well as by individual name — settlement companies in particular often already exist under a different individual contact (e.g. "Frontier Title II" may already exist under three different named employees without a company-only placeholder record)
- If the buyer's settlement company exists in Aframe but only under named individuals, and the specific contact for this file isn't yet known, create a new **company-only** contact (no first/last name, `company` field only) rather than reusing or guessing at an existing individual. Update later via Mode 2 once the actual contact introduces themselves.

---

## Step 5 — Contact Creation Rules (Buyer-Side Participants)

These mirror the buyer-side protocol's contact rules, applied from the seller's perspective:

**Multiple buyers, grouping by relationship:**
- If the contract signature block makes the buyer grouping clear (e.g. spouses or a couple sharing a transaction, listed together), create one contact with the second person in the alt-contact fields — same as buyer-side
- If a third (or additional) buyer is part of a different household or relationship, create a **separate** contact for that person rather than forcing everyone into one record's alt-contact slot (which only holds one additional name)
- When the grouping is ambiguous from the contract alone, ask — don't guess. On Deer Run, three purchasers split into two records: "Jose and Diana Gonzalez" (one record, Diana as alt contact) and "Melody Choate" (separate record).

**Participant role:** All buyer-side contacts (buyers, buyer's agent, buyer's settlement company) use the `(Other Side)` participant roles, since this is a seller-side file:

| Role | Role ID |
|---|---|
| Seller | 21541 |
| Closer | 21544 |
| Agent (Other Side) | 21543 |
| Buyer (Other Side) | 43982 |
| Closer (Other Side) | 21549 |

**Categories at creation:**
- Buyers: `Buyer Other Side` + transaction year (e.g. `2026`)
- Buyer's agent: `Agent` + transaction year
- Buyer's settlement company: `Closer` + transaction year

Categories are creation-time only — the connector cannot patch categories onto an existing contact. If missed, it must be fixed manually in the Aframe UI.

---

## Step 6 — The Closer Rule (Seller-Side Specific)

**On a seller-side file, the `Closer` participant role is always the settlement company representing Andrew's side of the deal** — i.e., the seller's own closer (e.g. Kelly's default, Lafayette Title & Escrow), which is typically already on the transaction from listing setup and should not be changed.

The settlement company named in the contract is the **buyer's** settlement company, and goes in the `Closer (Other Side)` role — even though the contract itself doesn't use "other side" language. This is the inverse of how it reads on a buyer-side file, and it's an easy place to make a mistake if read too literally off the contract.

Do not replace the existing seller-side Closer participant based on what's named in the contract's settlement section — that section names the other side's company.

---

## Step 7 — Populate Merge Fields and Transaction Fields

Most fields are written via `update_custom_field` using Merge Field Codes. A few are native to the transaction object and written via `update_transaction` — called out below.

### Formatting Rules

- **No `$` symbol** in dollar-amount custom merge fields: write `3,000` not `$3,000` for EMD, concessions, etc.
- **No `%` symbol** in commission custom merge fields: write `3` (or `3.0`, per agent preference — Andrew prefers no trailing decimal) not `3.0%`
- **Commission rates (native `percentageCommission`)** — decimal form (e.g. `0.03` for 3%)
- **Dollar amounts (native transaction fields)** — numeric, no formatting (e.g. `300000`)
- **Financing** — plain text, short form (e.g. `Cash`, `Conventional`)
- **Yes/No fields** — `Yes` or `No`

### Standard Merge Fields (via `update_custom_field`)

Codes confirmed via `get_transaction_field_tree` on the Deer Run file.

| Merge Field Code | Description | Notes |
|---|---|---|
| `f_EarnestMoney` | EMD amount | Dollar amount per formatting rules |
| `f_Financing` | Financing type | Plain text short form |
| `f_BuyerSideCommission` | Buyer broker compensation stated in the contract | Numeric, no `%`. Seller-side has no delta scenario — this is the only commission field a session writes. |
| `f_Concessions` | Concessions narrative | Short plain-language note — e.g. `On Contract` is sufficient; not a place for the full clause text |
| `f_ConcessionsTotal` | Concessions dollar total | Dollar amount of seller concessions, no `$` |
| `f_HOA` | HOA yes/no | Usually already set from listing intake — verify rather than overwrite |
| `f_WellWater` | Well yes/no | Usually already set from listing intake — verify rather than overwrite |
| `f_SepticSystem` | Septic yes/no | Usually already set from listing intake — verify rather than overwrite |
| `f_HomeWarranty1` | Home warranty yes/no | `Yes` or `No` |
| `f_ContractOtherInfo` | Paragraph 23 / Additional Terms | Summarize, don't transcribe verbatim, unless the clause is short. If a typewritten-overrides-preprinted conflict exists between paragraph 23 and another contract paragraph, note the override relationship explicitly rather than just the raw numbers — that's the detail that matters later, not which number "looks right." |
| `f_Possession` | Rent back / possession terms | Keep brief: occupancy/possession date and escrow deposit amount is enough — e.g. `7/23/26, $1,000 deposit`. Do not restate the full possession agreement terms here. |
| `f_ServiceRequested` | Services rendered for invoice tracking | See Services Requested below |

### Native Transaction Fields (via `update_transaction`)

These are properties on the transaction object itself, not custom merge fields.

| Field | Description | Notes |
|---|---|---|
| `xactionStatusId` | Transaction status | `18495` (Under Contract) — confirm via `list_transaction_statuses` rather than hardcoding, in case status IDs differ by team |
| `contractPrice` | Negotiated sale price | Numeric, no formatting (e.g. `300000` not `"$300,000"`) |
| `effectiveDate` | Ratification date | `YYYY-MM-DD` |
| `closingDate` | Settlement date | `YYYY-MM-DD` |
| `percentageCommission` | Seller-side commission rate | Decimal form — see Commission and Payout below |
| `payoutEstimated` | Estimated payout at intake | See Commission and Payout below |
| `payoutActual` | Actual payout at closing | **Blank at intake.** Populated post-closing only. |

List price (`listPrice`) is **not** overwritten — it stays as the historical listing record. Contract price is the separate field for the negotiated number.

### Commission and Payout

Seller-side commission is simpler than buyer-side — there's a single rate and no "buyer covers the delta" scenario. `f_SellerSideCommission` is set at listing intake (before this protocol begins) and is normally **not** re-written here unless the contract changes it.

| Field | Source | Tool | Value |
|---|---|---|---|
| `f_SellerSideCommission` | Listing Agreement (set at listing intake — verify, don't overwrite unless the contract changes it) | `update_custom_field` | Numeric, no `%` |
| `percentageCommission` | Computed from `f_SellerSideCommission` | `update_transaction` | Decimal — e.g. `3` → `0.03` |
| `payoutEstimated` | Computed | `update_transaction` | `contractPrice × percentageCommission`. Example: $300,000 × 0.03 = `9000`. |
| `payoutActual` | Post-closing | `update_transaction` | **Blank at intake.** |

### Services Requested — `f_ServiceRequested`

`f_ServiceRequested` should already be populated from listing intake (e.g. `Listing input - $100`) — verify it's still correct rather than re-writing it from scratch. It is **not** the agent's admin fee — that's `f_AdminFee`, a separate field, also set at listing intake per the agent's profile.

| File Type / Service | Value |
|---|---|
| Listing — data input only | `Listing Data Input - $100` |
| Listing — full listing management | `Listing Management - $200` |

Agent profiles record which service level each agent uses for their listings — see Agent Profiles for the per-agent default.

### A note on resolving contract ambiguity

Paragraph 23 (or any typewritten "Additional Terms" section) controls over conflicting pre-printed contract language — this is usually stated explicitly in the contract's miscellaneous/boilerplate paragraph. When a discrepancy shows up between a checked box elsewhere in the contract and the Additional Terms section (e.g. one section says 9 days, another says 10), resolve it using that override hierarchy rather than picking whichever number seems more standard. Verify the resolution against the dates template once applied — the auto-calculated date is a useful cross-check.

---

## Step 8 — Apply Task Template

Seller-side task templates live in their own Aframe folder (`AAR-TC - Seller Side - Under Contract`), structurally parallel to the buyer-side folder but built differently — see Known Limitations and Design Notes below for why.

| Template | ID | When to Apply |
|---|---|---|
| Listing Under Contract | 29771 | Always — the base template, covers the full file lifecycle in one checklist |
| Listing Under Contract - AS-IS | 40349 | AS-IS addendum only (replaces 29771, don't apply both) |
| Listing Under Contract - LAND | 42120 | Land contracts only (replaces 29771) |
| First Right of Refusal Check List | 39110 | First right of refusal contingency only — additive |
| New Listing Under Contract In-take Checklist | 30264 | Optional — functions as a mini-SOP/reminder list for the session itself (get intake form, check financing/contingencies, apply dates template, apply attachments template, flip status, create Gmail label, then self-delete). Apply if useful as a working checklist; it duplicates steps already in 29771 and isn't required. |

Apply via `apply_task_templates` using the **ratification date** as `startDate` — same rule as buyer-side.

### Why there's no separate seller-side inspection or rent-back checklist

Buyer-side splits inspection and rent-back into their own modular templates (29492/40225, 29493) because the buyer's side is the active party in those processes — submitting the inspection, the repair request, negotiating, following up. On a seller-side file, the seller's role in those same processes is reactive — responding to what the buyer's side initiates. That's why 29771 folds inspection-response and rent-back tasks directly into the single base checklist with conditional/omit-as-needed items, and why the AS-IS variant (40349) is the same list with the repair-response branch removed rather than a separate modular add-on.

---

## Known Limitations — What This Session Cannot Do

These are hard boundaries as of 2026-06-30, not pending build items. Each has a different cause and a different chance of changing:

**1. Date templates and attachment templates — no API endpoint exists at all.** There is no `list_date_templates` or `apply_date_template` equivalent to `apply_task_templates`. Same for attachment templates. This is a permanent UI-only action unless Aframe adds these endpoints — not a gated/future-tool situation like task omission below. Andrew applies the correct template (standard vs. cash, etc.) directly in the Aframe UI.

**2. Task omission — endpoint exists, capability was removed.** As of the Aframe API changelog dated 2026-05-29, the `omitted` field was removed from all Task, Event, and Transaction Attachment request/response DTOs. `PATCH /tasks/{taskId}` rejects an omitted task with `404`, and omitted tasks are filtered from all GET responses, matching the Aframe web app's own behavior. **This means a session can identify which tasks should be omitted and why, but cannot execute the omit itself, full stop.** This used to be an open question (see `PREAUTOMATION-001`); it's now answered, in the negative.

**3. Transaction events — read-only.** Events (the items populated by a dates template) can be read via `search_transactions` with `includes: ["EVENTS"]`, which is genuinely useful for verification — it caught a wrong-template application live during the Deer Run session (standard template applied instead of cash, which left appraisal/loan-application events present on a cash deal; reapplying the correct cash template removed them entirely rather than requiring an omit). But there is no write tool of any kind for Aframe transaction events — no create, no update, no omit. All event entry and correction is Andrew's work in the UI.

**4. Gmail label creation and renaming — no tool exists.** `label_thread`/`unlabel_thread` and the message-level equivalents only add or remove an *existing* label from a thread or message. There is no tool to create a new label or rename/move an existing one. Since Gmail represents label hierarchy in the label's name string itself (e.g. `! Future and Active Listings/[Address]` vs. `[Address]`), the listing-to-under-contract label move is a rename and falls under this limitation. A session can find, apply, and remove existing labels — it cannot create or restructure them.

### Division of labor that follows from these limits

| Who | Owns |
|---|---|
| Session | Contacts, participants, merge fields, transaction core fields (price/dates/status), task template application, verification reads, applying existing Gmail labels to newly-found related emails |
| Andrew | Date template selection and application, attachment template application, event entry/correction, task omission in the UI, Gmail label creation and the listing-to-under-contract label move |
| Joint | Final review pass over the complete file before considering it done |

---

## Step 9 — Identify Tasks for Omission (Flag, Don't Execute)

Since task omission is UI-only (see Known Limitations), the session's job is to identify candidates and the reason for each — not to act on them. Reasons fall into different categories with different shelf-lives, and the protocol should preserve that distinction rather than flattening every omit into the same bucket:

- **Contract-driven, file-specific but logic is standing** — e.g. a financing-flag task when the deal is cash, a well/septic task when the property has neither. The same logic re-applies to every future file; only the contract fact changes.
- **Agent-preference, file-specific because of who the agent is** — e.g. a sign-removal task omitted because a specific agent self-handles signage. The fact belongs to the agent, not the file; this should also prompt an Agent Profiles update if the preference isn't documented yet (see Deer Run example: Kelly/Lance handle their own signage — Agent Profiles doesn't currently capture a "signage" field).
- **Standing process rule, applies to every file regardless of contract or agent** — e.g. a step that's paused company-wide pending a template or process Andrew hasn't built yet, or a courtesy step Andrew has decided isn't worth doing for established agent relationships anymore.
- **Temporarily parked, not actually omitted** — blocked on something outside the file's control (e.g. waiting on portal access). These should stay open, not be omitted, since the work still needs to happen once the blocker clears.

Present the list with reasons in the session handoff (Step 10) rather than as a flat checklist of task names.

---

## Step 10 — Session Handoff Summary

At the close of every session, present Andrew with:

- [ ] Confirm the correct dates template was applied (standard vs. cash, vs. any other variant) — verify via `search_transactions` with `EVENTS` include; cross-check at least one calculated date (e.g. inspection deadline) against the contract
- [ ] Move the Gmail address label from `! Future and Active Listings/[Address]` to directly under `@ TC Transaction Folder/[Address]` (UI-only — no rename/move-label tool available)
- [ ] Apply the attachments template (UI-only)
- [ ] Enter or correct any transaction events not auto-calculated by the dates template (UI-only)
- [ ] List of tasks identified for omission, with reasons (see Step 9) — Andrew actions these in the UI
- [ ] Confirm Primary Agent and Assistant 1 are still correct (should already be set from listing intake — verify, don't assume)
- [ ] Confirm the buyer's settlement company contact — if only the company name is known at intake, this gets filled in via a Mode 2 update once the buyer's side settlement contact introduces themselves
- [ ] Note any contract ambiguities resolved during the session and the reasoning used (e.g. paragraph 23 override calls) so the file record shows *why*, not just the final value
- [ ] Confirm signed addenda (possession agreement, escalation addendum, etc.) are saved to the transaction and/or Drive folder

---

## General Rules & Notes

- **This is always an update, never a create** — if `search_transactions` doesn't find an existing listing-side transaction, stop and flag rather than creating a new one
- **Always search before creating any contact** — including by company name, since settlement companies often already exist under named individuals without a company-only placeholder
- **Categories are creation-time only** — same limitation as buyer-side; cannot be patched onto an existing contact via the connector
- **The Closer role always means Andrew's side's settlement company** — the contract's named settlement company is the buyer's side and goes in Closer (Other Side); see Step 6
- **Ratification date = task template start date** — the date of the last signature, not the offer date or today's date
- **Read every signed document, not just the main contract** — a possession agreement or escalation addendum is a separate PDF with its own terms and is easy to miss if only the primary purchase agreement is reviewed
- **Verify, don't just apply** — the `EVENTS` include on `search_transactions` is a real verification tool, not just a read convenience; use it to catch template mismatches before they sit unnoticed in the file
- **Check for missing signatures** — every signature line on the contract and every required addendum (possession agreement, escalation addendum, etc.) should be reviewed at intake; a missing or incomplete signature is a compliance issue, not a cosmetic one, and gets flagged in the handoff summary (Step 10) regardless of how minor it looks

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

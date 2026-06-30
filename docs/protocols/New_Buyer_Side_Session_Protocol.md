# New Buyer Side Session Protocol
**Version 1.2** | *Last Updated: June 30, 2026*
*Claude-facing SOP | Generic — applies to all agents and file types*

---

## Overview

A session begins when Andrew provides an address and agent name. From that starting point, the session runs through a defined sequence: find the email threads, create labels, read the source documents, extract and verify all participant data, populate Aframe, and apply the task template. The session closes with a handoff summary of what still needs Andrew's attention in the UI.

Source documents for a session will be one or more of the following:
- **Signing email** — found in Gmail, contains the ratified contract as an attachment
- **Cognito intake form** — pulled directly from Cognito Forms (Form ID 14), newest entry matching the address
- **MLS sheet** — provided by Andrew directly in session

Together these three sources should supply approximately 95% of the information needed to complete the file.

---

## Step 1 — Email Thread Search & Labels

When Andrew provides the address and agent name:

1. Search Gmail for the relevant signing/contract email thread using the address and agent name as search terms
2. Search for any additional related threads (TC intro, forwarded contracts, etc.)
3. Review the full thread — read it completely before extracting any contacts or data
4. **Label creation is UI-only.** There is no create-label tool available to a session — `label_thread`/`unlabel_thread` and their message-level equivalents only add or remove an *existing* label. If the address label doesn't already exist (check via `list_labels`), flag it for Andrew to create in the handoff summary (Step 10) following the naming convention: `Lennar/[Address]` or the applicable parent label structure
5. If the label already exists, apply it to all relevant threads found via `label_thread`

**Note:** The email thread is the primary source for other-side agent contact info, TC introductions, and CC instructions. Always read the full thread before creating any contacts.

---

## Step 2 — Pull the Cognito Intake Form

1. Search Cognito Forms Form ID **14** — All Entries view
2. Retrieve the most recent entry matching the property address
3. Extract all available data: buyer names, contact info, agent details, lender, closer, and any notes

---

## Step 3 — Read the Contract

The contract is either pulled from the Gmail attachment or provided directly by Andrew in session. Read the full document and extract the following:

**Transaction Details**
- Property address, county, tax parcel ID, legal description, subdivision
- Ratification date / effective date *(when ambiguous on the contract, check the Gmail thread first — the date is usually confirmed in the ratification delivery email. Only flag to the agent if it cannot be confirmed from either source.)*
- Purchase price
- Financing type (VA, Conventional, FHA, Cash, etc.)
- Loan term
- EMD amount, escrow holder, EMD due date, payment method
- Settlement date and settlement agent
- Closing cost concessions (dollar amount)
- Buyer broker compensation (percentage)
- Appraisal contingency (yes/no)
- Inspection status (active, waived, informational only)
- HOA (yes/no)
- Well (yes/no)
- Septic (yes/no)
- WDI required (yes/no)
- Home warranty (yes/no/who pays)
- Rent back (yes/no)
- Referral (yes/no)
- Escalation addendum (yes/no)
- Paragraph 23 additional terms (copy verbatim)
- Year built, MLS number

**Participant Data**
- Buyer(s) — full names, determine if 2nd buyer is co-buyer or spouse
- Seller(s) — full names, note if entity
- Buyer broker / agent info
- Listing broker / listing agent info
- Lender name and contact
- Settlement agent / closer name and company

**Signature Verification**
Review all required signatures at intake and flag any that are missing or incomplete. *(See sub-protocol: Signature Verification — to be developed)*

---

## Land Contracts — What's Different

A land contract is a subset of the standard contract, not a parallel workflow — most of Step 3's extraction list still applies. The differences:

- **Fewer contingencies** — no home inspection paragraph, no well/septic/WDI in the residential sense (a land deal may still have soil-related contingencies, see below), no home warranty
- **One addition: Soil and Feasibility Study Due Diligence Date** — extract this date from the contract the same way EMD due date or inspection deadline is extracted on a standard contract. This is the land-specific deadline that doesn't exist on residential contracts and needs its own entry once the dates template is applied.
- **Fewer tasks** — the land task template (`New Pending Buyer - Land`, ID 22937 — confirm current ID via `list_task_templates` before applying, template IDs can change) reflects the reduced contingency set; do not also apply the standard inspection checklist templates (29492/40225) unless the land contract specifically includes a property inspection contingency

Everything else in this protocol — contact rules, merge field formatting, participant roles, the Known Limitations section — applies the same way to a land file as a standard one.

---

## Step 4 — Extract & Present Participant Data

Before touching Aframe, compile all participant data from the three sources and present it to Andrew in a clean summary for review. Include:

- All parties with names, roles, emails, and phone numbers
- Any flags — missing signatures, missing contact info, spouse vs. co-buyer determination, entity buyer/seller identification
- Any contacts that will need to be created as new vs. found in the system

Andrew reviews and confirms before the session proceeds to Aframe.

---

## Step 5 — Search Aframe Before Creating Anything

For every participant that needs to be added to the transaction, search Aframe first:

1. Search by first and last name
2. If found, note the contact ID — do not create a duplicate
3. If not found, create a new contact (see contact creation rules below)

Also pull:
- Participant role IDs (via `list_participant_roles`)
- Merge field codes (via `list_custom_fields`) if not already known

---

## Step 6 — Contact Creation Rules

When creating a new contact, always apply these rules:

**Name Fields**
- Individual: `firstName` + `lastName` as they appear on the contract — ignore middle names
- Couples (married or otherwise): one contact record for the primary; the second person goes in the alt contact fields on that same record. Applies regardless of whether the couple shares a last name. Aframe handles the display.
- Entity (LLC, Corp, Trust, etc.): `lastName` = short entity name as it appears on the contract (e.g. `MPE LLC`), `company` = full legal name, `jobTitle` = authorized signatory/rep name

**Categories — REQUIRED at creation time**

> ⚠️ **Hard limitation: the Aframe connector cannot update contact categories after a contact is created.** Categories must be passed in the `create_contact` call. If missed, the contact must be deleted and recreated, or accepted as miscategorized — there is no in-session fix. Get this right the first time, every time.

| Contact Type | Categories (pass all at creation) |
|---|---|
| Seller on a buyer-side file | `Seller Other Side` |
| Buyer on a seller-side file | `Buyer Other Side` |
| Other-side agent (any file) | `Co-Op Agent` + transaction year (e.g. `2026`) |

**Other-side agents — Co-Op Agent rule**
Other-side agents always receive two categories at creation: `Co-Op Agent` plus the transaction year. Never use `Agent` as the category for an other-side agent. Both must be passed in the same `create_contact` call.

**Sellers on a buyer-side file — no contact info required**
The seller record on a buyer-side file is name + role (Seller Other Side, role ID 43983) + category (Seller Other Side). Do not ask for or populate phone, email, or address. The record exists for transaction roster completeness only.

**Agent + TC on the Other Side**
When the listing agent has an assistant or TC copied on the email thread, create one contact record for the agent and include the TC as the alt contact on the same record.

---

## Step 7 — Populate Aframe Merge Fields and Transaction Fields

Most fields are written via `update_custom_field` using Merge Field Codes. A few are native to the transaction object and written via `update_transaction` — called out below.

### Formatting Rules

- **Commission percentages (custom merge fields)** — numeric only, no `%` (e.g. `2.5`)
- **Commission rates (native `percentageCommission`)** — decimal form (e.g. `0.025` for 2.5%)
- **Dollar amounts (custom merge fields)** — numeric with comma formatting, no `$` (e.g. `1,000`)
- **Dollar amounts (native transaction fields)** — numeric, no formatting (e.g. `12500`)
- **Financing** — plain text, short form (e.g. `VA Loan`, `Conventional`, `Cash`)
- **Yes/No fields** — `Yes` or `No`
- **Agent gender fields** — `her` or `him` (both `f_Agentgender` and `f_Agentgender2hisher`)

### Standard Merge Fields (via `update_custom_field`)

| Merge Field Code | Description | Notes |
|---|---|---|
| `f_EarnestMoney` | EMD amount | Dollar amount per formatting rules |
| `f_Financing` | Loan type | Plain text short form |
| `f_BuyerSideCommission` | Buyer-side commission % | See Commission and Payout below |
| `f_CommissioncoveredbytheBuyer` | Delta the buyer covers, if any | See Commission and Payout below |
| `f_CommissionNotes` | Notes on atypical commission situations | Used to flag deltas, splits, or anything non-standard |
| `f_Concessions` | Concessions narrative | See Concessions below |
| `f_ConcessionsTotal` | Concessions dollar total | See Concessions below |
| `f_HOA` | HOA yes/no | `Yes` or `No` |
| `f_WellWater` | Well yes/no | `Yes` or `No` |
| `f_SepticSystem` | Septic yes/no | `Yes` or `No` |
| `f_HomeWarranty1` | Home warranty yes/no | `Yes` or `No` |
| `f_ContractOtherInfo` | Paragraph 23 additional terms | See Paragraph 23 below |
| `f_Notes` | Deal characteristics worth surfacing | See Notes below |
| `f_Possession` | Rent back end date if applicable | See Possession below |
| `f_County` | County | Plain text |
| `f_TaxId` | Tax parcel ID | Plain text |
| `f_MlsId` | MLS number | Plain text |
| `f_YearBuilt` | Year built | Plain text |
| `f_Subdivision` | Subdivision | Plain text |
| `f_Agentgender` | Agent gender pronoun | `her` or `him` |
| `f_Agentgender2hisher` | Agent gender pronoun 2 | `her` or `him` |
| `f_ServiceRequested` | Services rendered for invoice tracking | See Services Requested below |

### Native Transaction Fields (via `update_transaction`)

These are properties on the transaction object itself, not custom merge fields. They are written through `update_transaction`, not `update_custom_field`.

| Field | Description | Notes |
|---|---|---|
| `percentageCommission` | Total commission rate for this side | Decimal form. See Commission and Payout below. |
| `payoutEstimated` | Estimated payout at intake | See Commission and Payout below. |
| `payoutActual` | Actual payout at closing | **Blank at intake.** Populated post-closing only. |

### Commission and Payout

Commission lives across two source documents — the contract states what the **seller** is paying toward buyer-side commission; the Buyer Agency Agreement states what the **buyer** is willing to pay in total. These usually align. When they don't, the buyer covers the delta.

| Field | Source | Tool | Value |
|---|---|---|---|
| `f_BuyerSideCommission` | Contract | `update_custom_field` | What the *contract* states (seller's portion). Numeric, no `%`. |
| `f_CommissioncoveredbytheBuyer` | Buyer Agency vs. contract | `update_custom_field` | The delta when there is one — what the buyer covers above what the seller is paying. Numeric, no `%`. Blank when aligned. |
| `f_CommissionNotes` | Session | `update_custom_field` | Note explaining the delta or any other atypical commission detail. Blank when standard. |
| `percentageCommission` | Computed | `update_transaction` | Total buyer-side rate as **decimal** — `(f_BuyerSideCommission + f_CommissioncoveredbytheBuyer) / 100`. Example: 2.5% total → `0.025`. |
| `payoutEstimated` | Computed | `update_transaction` | `contractPrice × percentageCommission`. Example: $500,000 × 0.025 = `12500`. |
| `payoutActual` | Post-closing | `update_transaction` | **Blank at intake.** |

**Worked examples:**

*Aligned case* — contract says seller pays 2.5%, Buyer Agency says buyer total is 2.5%, contract price $500K:
- `f_BuyerSideCommission` = `2.5`
- `f_CommissioncoveredbytheBuyer` = blank
- `f_CommissionNotes` = blank
- `percentageCommission` = `0.025`
- `payoutEstimated` = `12500`

*Delta case* — contract says seller pays 2%, Buyer Agency says buyer total is 2.5%, contract price $500K:
- `f_BuyerSideCommission` = `2`
- `f_CommissioncoveredbytheBuyer` = `0.5`
- `f_CommissionNotes` = `Buyer covering 0.5% delta — seller paying 2%, Buyer Agency total is 2.5%`
- `percentageCommission` = `0.025`
- `payoutEstimated` = `12500`

### Concessions

- `f_ConcessionsTotal` — at intake, the dollar value of concessions stated in the contract. Numeric with comma formatting, no `$` (e.g. `1,500`). Blank if none.
- `f_Concessions` — at intake, write `On contract` if concessions are in the contract; leave blank otherwise. As concessions evolve during the deal (Mode 2), append new lines describing each (e.g. `Credit in lieu of repairs — $500`). The total in `f_ConcessionsTotal` is updated to reflect the running sum.

### Paragraph 23 — `f_ContractOtherInfo`

By default, copy paragraph 23 verbatim from the contract into `f_ContractOtherInfo`.

When paragraph 23 contains a lot of content — for example, escalation clause terms embedded in 23 rather than as a separate addendum (Gary does this; other agents may too), or other lengthy additional terms — **stop and ask Andrew what should be included before writing**. The standard for inclusion is whether the information affects the deal *post-ratification*. If not (e.g. an escalation clause that's already settled at ratification), it can be summarized or omitted. Default to asking when paragraph 23 runs more than a few short lines.

### Notes — `f_Notes`

Use `f_Notes` to surface deal characteristics worth keeping in mind throughout the file — anything unusual, atypical, or specific that should remain visible. Examples:
- `Waived Inspections`
- `As-Is Sale`
- `Cash deal — no financing contingency`
- `Buyer paying admin fee directly`

This field is for at-a-glance deal context, not contract terms (which go in `f_ContractOtherInfo`) or commission specifics (which go in `f_CommissionNotes`).

### Possession — `f_Possession`

Used when the contract includes a rent back. Format: `Rentback ends on X/X` (e.g. `Rentback ends on 8/15`). Blank when no rent back.

### Services Requested — `f_ServiceRequested`

`f_ServiceRequested` must be populated on every file. It captures the work Andrew performs on the file, sourced from AAR-TC pricing (aar-tc.com). It is **not** the agent's admin fee — that's `f_AdminFee`, which is a separate field.

| File Type / Service | Value |
|---|---|
| Buyer-side contract intake | `C2C - $395` |
| Listing — data input only | `Listing Data Input - $100` |
| Listing — full listing management | `Listing Management - $200` |

Format: one service per line. Multiple services on the same file appear as multi-line entries. Agent profiles record which service level each agent uses for their listings; buyer-side files are always `C2C - $395` regardless of agent.

### UI-Only Fields (cannot be written via connector — flag for Andrew)

- **Property Type** — must be set manually from dropdown in Aframe UI
  - Valid values: 2-4 Units, Apartment, Condo/Townhome, Land, Lease, New Construction, Other, Single Family
- **Primary Agent** — the roster agent (Kelly, Gary, Liz, etc.) is always the Primary Agent on every file regardless of side. Set manually in the UI at file creation.
- **Assistant 1** — Andrew Rich is always Assistant 1 on every file regardless of side. Set manually in the UI at file creation.

---

## Step 8 — Add Participants to the Transaction

Add all participants via `add_transaction_participant` using the confirmed contact IDs and role IDs.

> **Buyer's agent placement on a buyer-side file:** the buyer's agent (the roster agent — Kelly, Gary, Liz, etc.) lives in the Primary Agent slot only (see Step 7 UI-only fields). **Do not add the buyer's agent as a participant in the participant roster.** The Primary Agent slot is the single placement.

Standard roles:

| Role | Role ID |
|---|---|
| Buyer | 21542 |
| Closer | 21544 |
| Lender | 21545 |
| Agent Other Side | 21543 |
| Seller Other Side | 43983 |
| TC Other Side | 21908 |
| Buyer Other Side | 43982 |

---

## Step 9 — Apply Task Template

Apply the appropriate task template(s) via `apply_task_templates` using the ratification date as the start date.

**Standard buyer-side templates:**

| Template | ID | When to Apply |
|---|---|---|
| New Pending Buyer - color coded for stages | 29491 | Always (standard, non-land contracts) |
| New Pending Buyer - Land | 22937 | Land contracts only — replaces 29491, see Land Contracts section above |
| Buyer Side Referral Checklist | 29494 | Referral files only |
| Rent Back Check List | 29493 | Rent back only |
| Inspection Checklist - Standard | 29492 | Active inspection contingency with repair rights only |
| Inspection Checklist - AS-IS | 40225 | AS-IS addendum only |

**Notes:**
- Informational-only inspections (waived repair rights) do not trigger an inspection checklist
- Template 29819 (Buyer Side New In-take Checklist) is triggered automatically by Zapier — do not apply manually
- If inspection repairs are later requested, the inspection checklist can be added at that time

---

## Known Limitations — What This Session Cannot Do

These are hard boundaries as of 2026-06-30, not pending build items. Each has a different cause and a different chance of changing:

**1. Date templates and attachment templates — no API endpoint exists at all.** There is no `list_date_templates` or `apply_date_template` equivalent to `apply_task_templates`. Same for attachment templates. This is a permanent UI-only action unless Aframe adds these endpoints — not a gated/future-tool situation like task omission below. Andrew applies the correct template (Standard / AS-IS / CASH / AS-IS+CASH / Land / New Construction) directly in the Aframe UI.

**2. Task omission — endpoint exists, capability was removed.** As of the Aframe API changelog dated 2026-05-29, the `omitted` field was removed from all Task, Event, and Transaction Attachment request/response DTOs. `PATCH /tasks/{taskId}` rejects an omitted task with `404`, and omitted tasks are filtered from all GET responses, matching the Aframe web app's own behavior. **This means a session can identify which tasks should be omitted and why, but cannot execute the omit itself, full stop.** This used to be an open question; it's now answered, in the negative — financing, HOA, well, septic, and admin-fee conditional tasks all fall under this limit.

**3. Transaction events — read-only.** Events (the items populated by a dates template) can be read via `search_transactions` with `includes: ["EVENTS"]`, which is genuinely useful for verification — it can catch a wrong-template application (e.g. standard applied instead of cash, leaving appraisal/loan-application events present on a cash deal) before it sits unnoticed in the file. But there is no write tool of any kind for Aframe transaction events — no create, no update, no omit. All event entry and correction is Andrew's work in the UI.

**4. Gmail label creation and renaming — no tool exists.** `label_thread`/`unlabel_thread` and the message-level equivalents only add or remove an *existing* label from a thread or message. There is no tool to create a new label or rename/move an existing one. A session can find, apply, and remove existing labels — it cannot create or restructure them (see Step 1).

### Division of labor that follows from these limits

| Who | Owns |
|---|---|
| Session | Contacts, participants, merge fields, transaction core fields (price/dates/status), task template application, verification reads, applying existing Gmail labels to relevant threads |
| Andrew | Date template selection and application, attachment template application, event entry/correction, task omission in the UI, Gmail label creation |
| Joint | Final review pass over the complete file before considering it done |

---

## Step 9b — Identify Tasks for Omission (Flag, Don't Execute)

Since task omission is UI-only (see Known Limitations), the session's job is to identify candidates and the reason for each — not to act on them. Reasons fall into different categories with different shelf-lives, and the protocol should preserve that distinction rather than flattening every omit into the same bucket:

- **Contract-driven, file-specific but logic is standing** — e.g. a financing-flag task when the deal is cash, a well/septic task when the property has neither. The same logic re-applies to every future file; only the contract fact changes.
- **Agent-preference, file-specific because of who the agent is** — e.g. a task omitted because a specific agent self-handles something a task assumes Andrew or the agent does generically. The fact belongs to the agent, not the file; check Agent Profiles first, and flag for an Agent Profiles update if the preference isn't documented yet.
- **Standing process rule, applies to every file regardless of contract or agent** — e.g. a step that's paused company-wide pending a template or process Andrew hasn't built yet, or a courtesy step Andrew has decided isn't worth doing for established agent relationships anymore.
- **Temporarily parked, not actually omitted** — blocked on something outside the file's control (e.g. waiting on portal access or a missing credential). These should stay open, not be omitted, since the work still needs to happen once the blocker clears.

Present the list with reasons in the session handoff (Step 10) rather than as a flat checklist of task names.

---

## Step 10 — Session Handoff Summary

At the close of every session, present Andrew with a clear handoff summary of what still requires action in the UI:

- [ ] Confirm Primary Agent set to the roster agent (UI-only — cannot be written via connector)
- [ ] Confirm Assistant 1 set to Andrew Rich (UI-only — cannot be written via connector)
- [ ] Set Property Type (UI dropdown — cannot be written via connector)
- [ ] Create the Gmail label if it didn't already exist (UI-only — no create-label tool available)
- [ ] Apply the correct dates template (Standard / AS-IS / CASH / AS-IS+CASH / Land / New Construction) — UI-only, no API endpoint
- [ ] Apply the correct attachments template — UI-only, no API endpoint
- [ ] Enter or correct any transaction events not auto-calculated by the dates template (UI-only)
- [ ] List of tasks identified for omission, with reasons (see Step 9b) — Andrew actions these in the UI
- [ ] Verify any contact categories that could not be set at creation — note: existing contacts created without categories cannot be fixed via connector and must be edited in the UI
- [ ] Confirm `f_ServiceRequested` populated (buyer-side default `C2C - $395`)
- [ ] Confirm `percentageCommission` and `payoutEstimated` populated on the transaction (via `update_transaction`)
- [ ] Confirm EMD wire received by due date
- [ ] Review and action any flagged items from signature verification
- [ ] Note any pending contacts (e.g. TC Other Side not yet introduced)

---

## General Rules & Notes

- **Always search before creating** — never create a contact without searching first
- **Categories are creation-time only** — the connector cannot update categories on existing contacts; flag for manual fix in UI if missed
- **Read the full email thread** — contact info, CC instructions, and TC introductions often appear in the body of the thread, not just the attachment
- **Last name drives merge field output** — subject lines in Aframe email templates pull from last name fields; accuracy here affects every automated email in the file
- **Ratification date = task template start date** — always use the contract's effective/ratification date, not today's date
- **Check for missing signatures** — every signature line on the contract and every required addendum should be reviewed at intake; a missing or incomplete signature is a compliance issue, not a cosmetic one, and gets flagged in the handoff summary (Step 10) regardless of how minor it looks

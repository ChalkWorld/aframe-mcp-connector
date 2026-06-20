# New Buyer Side Session Protocol
**Version 1.0** | *Last Updated: June 20, 2026*
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
4. Create a Gmail label following the naming convention: `Lennar/[Address]` or the applicable parent label structure
5. Apply the label to all relevant threads found

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
- Ratification date / effective date
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
- Individual: `firstName` + `lastName` as they appear on the contract
- Married couple with same last name: one contact, shared last name only — Aframe handles the rendering automatically
- Different last names: each person entered with their own last name — Aframe handles the separator
- Entity (LLC, Corp, Trust, etc.): `lastName` = short entity name as it appears on the contract (e.g. `MPE LLC`), `company` = full legal name, `jobTitle` = authorized signatory/rep name

**Categories — REQUIRED at creation time**
Categories cannot be added after the fact via the connector. They must be passed in the `create_contact` call. Never skip this step.

| Contact Type | Category |
|---|---|
| Seller on a buyer-side file | Seller Other Side |
| Buyer on a seller-side file | Buyer Other Side |

**Agent + TC on the Other Side**
When the listing agent has an assistant or TC copied on the email thread, create one contact record for the agent and include the TC as the alt contact on the same record.

**Spouse as 2nd Buyer**
When Kelly (or another agent) lists a spouse as Buyer 2 for communications purposes only, the spouse is not a separate participant in Aframe. They are linked within the buyer's contact record. Confirm with the agent if unclear whether the 2nd buyer is a true co-buyer or a spouse.

---

## Step 7 — Populate Aframe Merge Fields

Write all merge fields via `update_custom_field`. Follow these formatting rules:

- **Commission percentages** — numeric only, no % sign (e.g. `2`)
- **Dollar amounts** — numeric with comma formatting, no $ sign (e.g. `1,000`)
- **Financing** — plain text, short form (e.g. `VA Loan`, `Conventional`, `Cash`)
- **Yes/No fields** — `Yes` or `No`
- **Agent gender fields** — `her` or `him` (both `f_Agentgender` and `f_Agentgender2hisher`)
- **Paragraph 23** — copy verbatim from the contract into `f_ContractOtherInfo`

**Standard fields to populate on every file:**

| Merge Field Code | Description |
|---|---|
| `f_EarnestMoney` | EMD amount |
| `f_Financing` | Loan type |
| `f_BuyerSideCommission` or `f_SellerSideCommission` | Commission % |
| `f_Concessions` | Seller concessions |
| `f_HOA` | HOA yes/no |
| `f_WellWater` | Well yes/no |
| `f_SepticSystem` | Septic yes/no |
| `f_HomeWarranty1` | Home warranty yes/no |
| `f_ContractOtherInfo` | Paragraph 23 additional terms |
| `f_County` | County |
| `f_TaxId` | Tax parcel ID |
| `f_MlsId` | MLS number |
| `f_YearBuilt` | Year built |
| `f_Subdivision` | Subdivision |
| `f_Agentgender` | Agent gender pronoun (her/him) |
| `f_Agentgender2hisher` | Agent gender pronoun 2 (her/him) |
| `f_ServiceRequested` | Services rendered for invoice tracking |

**UI-Only Fields (cannot be written via connector — flag for Andrew)**
- Property Type — must be set manually from dropdown in Aframe UI
  - Valid values: 2-4 Units, Apartment, Condo/Townhome, Land, Lease, New Construction, Other, Single Family

---

## Step 8 — Add Participants to the Transaction

Add all participants via `add_transaction_participant` using the confirmed contact IDs and role IDs. Standard roles:

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
| New Pending Buyer - color coded for stages | 29491 | Always |
| Buyer Side Referral Checklist | 29494 | Referral files only |
| Rent Back Check List | 29493 | Rent back only |
| Inspection Checklist - Standard | 29492 | Active inspection contingency with repair rights only |
| Inspection Checklist - AS-IS | 40225 | AS-IS addendum only |

**Notes:**
- Informational-only inspections (waived repair rights) do not trigger an inspection checklist
- Template 29819 (Buyer Side New In-take Checklist) is triggered automatically by Zapier — do not apply manually
- If inspection repairs are later requested, the inspection checklist can be added at that time

---

## Step 10 — Session Handoff Summary

At the close of every session, present Andrew with a clear handoff summary of what still requires action in the UI:

- [ ] Set Property Type (UI dropdown — cannot be written via connector)
- [ ] Apply date template and enter all key dates
- [ ] Apply attachment template
- [ ] Verify any contact categories that could not be set (only possible if contact already existed without category)
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

---
title: Aframe Transaction Workflows — Framework
document_id: AAR-TC-AFRAME-WF-001
version: 1.0
version_date: 2026-06-13
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted framework design
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Aframe Transaction Workflows — Framework
### AAR-TC Transaction Services | Document ID: AAR-TC-AFRAME-WF-001

---

## Purpose

This document is the **index and structural framework** for the business-layer workflow protocols that govern how incoming files are processed into complete Aframe transactions via the connector. It does not contain workflow content itself — each workflow gets its own document. This framework defines:

- What workflow documents exist and what each covers
- The standard structure every workflow document follows
- The patterns and conventions shared across all workflows
- Status of each workflow (built, in progress, planned)

**For Claude sessions:** Load this document first when starting any new transaction-processing session, then load the specific workflow document(s) relevant to the file at hand.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-13 | Andrew Rich / Claude | Initial framework. Establishes three planned workflows; structural scaffolding only — content to follow in subsequent sessions. |

---

## Where This Sits

```
Technical layer:
  AAR-TC-AFRAME-REF-001    Technical Reference  (what the connector is)
  AAR-TC-AFRAME-ROAD-001   Tool Roadmap         (what tools exist / are next)

Business layer:
  AAR-TC-AFRAME-WF-001     Workflow Framework   (this doc — the index)
  AAR-TC-AFRAME-WF-BUYER-001    Buyer-side contract intake   (planned)
  AAR-TC-AFRAME-WF-SELLER-001   Seller-side contract intake  (placeholder)
  AAR-TC-AFRAME-WF-LENNAR-001   Lennar listing input         (placeholder)

Adjacent (existing):
  AAR-TC-LENNAR-DB-001     Lennar Community Reference Database
  AAR-TC-LENNAR-DS-TPL-001 Lennar MLS Datasheet Template
  AAR-TC-LENNAR-PROTO-001  Lennar New Listing Protocol (broader MLS workflow)
```

The Aframe connector is the write layer. The workflow documents describe how each incoming file type maps onto the connector's tool surface. The existing Lennar documents continue to govern the broader MLS/Transaction Desk/photo workflow; the Aframe Lennar workflow document (when built) covers specifically what the Aframe-connector portion of that flow looks like.

---

## Standard Workflow Document Structure

Every workflow document under this framework follows this section structure. Sections marked *(optional)* may be omitted if not relevant; all others are required for completeness.

1. **Purpose & Trigger** — what this workflow handles, what event fires it
2. **Version History** — table
3. **Reference Documents** — links to related docs (Technical Reference, custom field references, adjacent docs)
4. **Key Contacts** — who is involved on the AAR-TC side
5. **Critical Rules & Compliance Notes** — non-negotiables (compliance requirements, hard rules, things that cause real damage if missed)
6. **Source & Intake** — where the file arrives (Gmail thread, PDF attachment, Cognito form, forwarded note) and what to check on receipt
7. **Data Extraction Requirements** — what to pull from the source document, with the level of precision required for each field
8. **Aframe Transaction Setup** — the create_transaction call: required fields, defaults, address verification
9. **Aframe Custom Field Mapping** — table mapping source data → merge field code → expected value format
10. **Participants & Roles** — who gets added to the transaction, in what role, and where their contact info comes from
11. **Task Templates** — which template(s) to apply, with branching logic (e.g., financed vs. cash, AS-IS vs. standard)
12. **Notes & Activities** — what intake notes get logged on the transaction
13. **Adjacent System Steps** *(optional)* — Gmail labeling, local folder creation, Transaction Desk, MLS, etc.
14. **Quality Checks** — duplicate detection, address verification, compliance sweeps, final review checklist
15. **Typical Time Estimate** — per-file estimate; batch estimate where applicable

---

## Cross-Workflow Conventions

Patterns that apply to every workflow under this framework:

### Aframe connector is the single write surface
All Aframe-side work flows through the connector tools defined in `AAR-TC-AFRAME-REF-001`. No direct API calls; no UI-side writes during Claude-handled intake (UI is reserved for final review by Andrew).

### Duplicate detection always comes first
Before creating any new transaction, the workflow must check for an existing transaction at the same address. Once `search_transactions` is wrapped (Tool Roadmap Tier 3), this becomes a connector call. Until then, duplicate checks happen in the Aframe UI or by referencing the relevant tracking spreadsheet.

### Address verification is non-negotiable
Source documents (especially forwarded forms) are not authoritative for street number and street name. Always cross-check against an authoritative source (tracking spreadsheet, MLS, original contract PDF). Mistakes here propagate everywhere downstream.

### Intake note on every transaction
Every transaction created via the connector gets at least one intake note logged via `add_transaction_note`, capturing: date/time, source of intake (e.g., "Carly Evans email forwarded 6/13/26"), and a one-line summary of what Claude populated. This is the audit trail.

### Custom fields use merge codes, not field IDs
All custom-field writes go through `update_custom_field` using Merge Field Codes (e.g., `f_EarnestMoney`), not numeric field IDs. Codes are durable across Team configuration changes; IDs are not.

### Defer participant operations until Phase 3
Workflow documents may *describe* the participants that should be added to a transaction, but the connector cannot yet add them programmatically (see Tool Roadmap Tier 2). Until those tools land, the workflow ends with "participants to be added manually in Aframe UI" — and the workflow doc captures who, in what role, with what contact info.

### Phone number compliance (listing workflows only)
CVR MLS rules prohibit phone numbers in public remarks. This applies to listing workflows (Lennar, future listing types) but not to buyer-side or seller-side contract intake.

---

## Planned Workflows

### Workflow 1 — Buyer-Side Contract Intake

**Document:** `AAR-TC-AFRAME-WF-BUYER-001` *(to be created)*
**Status:** Framework only — full content scheduled for the next session.

A buyer-side contract arrives (ratified contract PDF, typically forwarded via Gmail). The workflow extracts contract data — price, dates, parties, terms, contingencies, deal type (financed vs. cash, AS-IS vs. standard, referral vs. not) — and uses the Aframe connector to:

- Create the transaction with the correct address, side (`BUYER`), price, and dates
- Populate custom fields (earnest money, commission, MLS#, occupancy, property type, etc.)
- Identify participants to add (buyer(s), seller(s), seller's agent, lender, closer) — pending Phase 3 tools, document them for manual addition
- Select and apply the appropriate task template(s) based on deal type — pending Phase 3 tools, document the selection
- Log an intake note summarizing what was processed

This is the workflow with the highest expected leverage from the current connector tool set, which is why it's first.

### Workflow 2 — Seller-Side Contract Intake

**Document:** `AAR-TC-AFRAME-WF-SELLER-001` *(placeholder)*
**Status:** Not started.

A seller-side situation — typically one of Andrew's existing listings has gone under contract and the ratified contract arrives. The workflow updates the existing Aframe transaction (status, contract price, dates, contingencies) and populates buyer-side participant info that was unknown at listing time.

Key difference from buyer-side: this is usually an `update_transaction` flow rather than a `create_transaction` flow, because the transaction already exists from the listing-side workflow.

### Workflow 3 — Lennar Listing Input

**Document:** `AAR-TC-AFRAME-WF-LENNAR-001` *(placeholder)*
**Status:** Not started. Will integrate with existing Lennar documents (`AAR-TC-LENNAR-*`).

The Aframe-specific portion of the broader Lennar New Listing workflow (`AAR-TC-LENNAR-PROTO-001`). When Carly Evans forwards a new Lennar listing, the connector handles:

- Aframe transaction creation with Lennar-specific defaults (Primary Agent: Gary Martin, Status: Lennar - Active, TC/Assistant: Andrew Rich, Seller Company: Lennar)
- Task template application (Lennar New Listing Task List + MLS Data Input Checklist)
- Field population for known Lennar values

The broader workflow (MLS data input, Transaction Desk, photos, etc.) remains governed by `AAR-TC-LENNAR-PROTO-001`. This document covers only the Aframe-side portion.

---

## Suggested Next-Session Prompt

When starting the next session to build out the buyer-side contract intake workflow document, use a prompt along these lines:

```
Open a working session to build AAR-TC-AFRAME-WF-BUYER-001 — the 
buyer-side contract intake workflow document. Load the following 
context first:

  - AAR-TC-AFRAME-WF-001 (Workflow Framework, this doc)
  - AAR-TC-AFRAME-REF-001 (Technical Reference)
  - AAR-TC-AFRAME-ROAD-001 (Tool Roadmap)
  - The Aframe Connector Handover doc (for original priority operations)
  - A sample ratified buyer contract PDF (I will upload)

Goal: produce AAR-TC-AFRAME-WF-BUYER-001 as a living document that 
follows the standard structure defined in the Framework. We'll work 
through the contract together, extract the data points that matter, 
map them to Aframe custom fields, identify the participants and 
roles, and select the right task template(s). The output is the 
workflow document — not yet an automation; the document is what 
makes the future automation possible.
```

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version date with each revision.*

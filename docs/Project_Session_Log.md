# Project Session Log
*Living record of sessions, decisions, changes, gaps, and document updates*

---

## Log Structure
Each session entry captures: what was worked on, decisions made, gaps identified or cleared, protocol rules established, and any documents created or updated with version numbers.

---

## Session 001 — June 20, 2026

### Focus
New contract intake workflow — building and testing the buyer-side session protocol using a real file (248 Pisgah Church Rd) from agent Kelly Painschab.

### Files Worked
- **248 Pisgah Church Rd, Rice VA 23966** | Buyer Side | Kelly Painschab
  - Aframe Transaction ID: 556409
  - Ratification Date: June 19, 2026
  - Settlement Date: July 20, 2026
  - Purchase Price: $615,000 | VA Loan | EMD: $1,000

### What Was Done
- Pulled Cognito intake form (Form ID 14, Entry 93)
- Read contract and MLS sheet provided by Andrew in session
- Extracted all participant data and presented for review
- Searched Aframe for all participants before creating
- Created new contacts: Thomas & Nan Renn, Navona Hart (w/ Tori Elmore as alt contact), Test BuyerOtherSide (test only)
- Populated 16 merge fields + Services Requested + Property Type (noted as UI-only)
- Added all participants to transaction with correct role IDs
- Applied task template 29491
- Created Gmail labels: Lennar/8651 Clemet Dr, Lennar/3332 Sunstone Dr (separate task)
- Discussed attachment/Drive workflow capabilities

### Decisions Made
- **Cognito form** is pulled by session, not Zap-linked — newest entry matching address
- **Template 29819** (Intake Checklist) stays Zap-triggered for now; Andrew will revamp later
- **Template 29491** applied manually in session
- **Inspection checklist** only applied when active inspection contingency with repair rights exists — informational-only inspections do not qualify
- **Session handoff checklist** to be created as a separate doc (not a task template for now)
- **Agent Profiles** to be maintained as a separate living doc, one section per agent
- **Property Type** confirmed as a system/UI-only field — cannot be written via connector
- **Categories** must be passed at contact creation time — connector cannot update categories on existing contacts
- **Drive + Gmail attachment workflow** — technically viable if Aframe attachment endpoints are built (currently Tier 4 on roadmap)
- **Aframe attachment endpoints** not yet extracted/built; file-push workflow is future state

### Protocol Rules Established
- Search Aframe before creating any contact — never duplicate
- Last name field drives merge field output in email subject lines — must be accurate
- Entity buyers/sellers: lastName = short entity name, company = full legal name, jobTitle = rep/signatory
- Same last name couple: one contact, shared last name — Aframe handles rendering
- Different last names: separate last name entries — Aframe handles separator
- Spouse as 2nd buyer (communications only): linked within buyer contact record, not a separate participant
- Categories are creation-time only — Seller Other Side / Buyer Other Side must be passed at create
- Agent + TC on other side: one contact record, TC as alt contact
- Commission %: numeric only, no % sign
- Dollar amounts: numeric with comma formatting, no $ sign
- Agent gender: `her` or `him` for both gender merge fields
- Ratification date = task template start date
- Read full email thread before extracting contacts — TC intros and CC instructions live in thread body
- When a new session starts: Andrew provides address + agent → Claude searches Gmail for relevant threads → creates labels → proceeds with intake

### Gaps Identified
- [ ] **Signature Verification Sub-Protocol** — stub exists in protocol doc; full detail TBD
- [ ] **Duplicate transaction check** — confirm no active transaction at same address before proceeding
- [ ] **Date template / Attachment template specifics** — which applies when; needs documentation
- [ ] **Mode 2 / Mid-file updates** — protocol for when new contacts arrive after intake (e.g. TC intro email)
- [ ] **UI-only fields full list** — Property Type confirmed; others TBD
- [ ] **Template 29819 revamp** — Andrew to update intake checklist to reflect session-driven workflow
- [ ] **Test contact cleanup** — Test BuyerOtherSide (contact + participant) on transaction 556409 to be removed

### Documents Created This Session

| Document | Version | File Name |
|---|---|---|
| New Buyer Side Session Protocol | 1.0 | New_Buyer_Side_Session_Protocol.md |
| Session Handoff Checklist | — | TBD — next session |
| Agent Profiles | — | TBD — next session |
| Project Session Log | 1.0 | Project_Session_Log.md |

### Documents Planned (Not Yet Created)

| Document | Notes |
|---|---|
| New Listing Session Protocol | Based on buyer-side protocol; Lennar variant likely needed |
| Seller Under Contract Session Protocol | Based on buyer-side protocol |
| Lennar Listing Session Protocol | Lennar-specific variant of New Listing |
| Session Handoff Checklist | Andrew-facing post-session UI to-do |
| Agent Profiles | One section per agent; Kelly Painschab to be first entry |

### Agent Profile Notes Captured (Kelly Painschab)
- Lance Taylor always added as Co-Agent
- David Velazquez and Carter Hall are Kelly's typical lenders
- Mary Bonniville / Lafayette Title & Escrow is Kelly's default closer
- Tori Elmore (tori@c21realtyathome.com) is Navona Hart's assistant — CC on all emails for Navona files
- Agent gender: her/her
- Services Rendered standard: C2C - $395
- Admin Fee: $395
- Holly Schilling added as spouse within buyer contact record — not a separate participant

---
*Next session: Complete Session Handoff Checklist and Agent Profiles docs*

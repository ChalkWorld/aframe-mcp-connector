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

---

## Session 002 — June 20, 2026

### Focus
Lennar listing workflow design — building the Lennar Listing Session Protocol, restructuring the Google Sheet, establishing Google Drive folder structure, and working two live Lennar listings as test cases.

### Files Worked
- **15912 Greenhart Dr, Chesterfield VA 23832** | Lennar Listing | Harpers Mill SF
  - Status: Input in Progress — MLS data sheet not yet generated
  - Gmail thread: `19ee0f5f7f909ecd`
- **6035 Blue Iris Dr, Chesterfield VA 23832** | Lennar Listing | Creekside Run TH
  - Status: Input in Progress — MLS data sheet not yet generated; photos pending from Stefanie Nayder
  - Gmail thread: `19ee12982e889ccc`

### What Was Done
- Read New Buyer Side Session Protocol (v1.0) as the structural baseline
- Discussed Lennar workflow end-to-end: email source, Zap chain, Aframe role, Google Sheet as source of truth, lifecycle stages (new listing → under contract → closed)
- Established that Google Sheet is source of truth; Aframe is secondary/optional tracking
- Restructured Google Sheet (Lennar Listings):
  - Removed Tax/PID column from main tab
  - Created Session Data tab with 16 columns (Address, MLS#, Community, Model Name, List Price, Status, Intake Date, Addendum Status, Gmail Thread ID, Aframe Transaction ID, Photo Status, Photo Source, MLS Input Stage, POC, Tax/PID, Session Notes)
  - Added 15912 Greenhart Dr and 6035 Blue Iris Dr in correct community/type/descending-numeric positions, status = Input in Progress
- Created Properties folder in Google Drive inside Lennar folder (Folder ID: `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B`)
- Captured Megan Cook (megan.cook@lennar.com) as Carly Evans replacement effective June 30, 2026; from Gary Martin intro email (thread `19edd38e2489160d`)
- Activated Google Sheets connector via Zapier
- Wrote New Lennar Listing Session Protocol v1.0 from scratch
- Wrote Session Handoff Checklist v1.0 (standalone reusable doc by file type)

### Decisions Made
- **Google Sheet is source of truth** — Aframe is not load-bearing for Lennar files
- **Sessions replace the Zap chain** for Aframe transaction creation going forward
- **Properties folder** in Google Drive is the doc home for new listings (tax record, signed addendum, MLS listing sheet); local folder migration deferred — Andrew migrates as needed
- **Sales rep roster** stubbed in protocol; to be documented once Megan Cook is onboarded (expect shuffle)
- **DocuSign** flagged as future connector for sending listing addenda in-session; not yet implemented
- **Session Data tab** covers active files only; same community/SF-TH/descending-numeric-order convention as main sheet
- **Cognito form ID for Lennar** not yet confirmed — carry forward to next session
- **Reverse Prospecting** (existing Cursor Python script) to be pulled into this project in a future session

### Protocol Rules Established
- No listing goes Active in MLS until signed addendum is on file — hard compliance rule
- List date is always today's date, never the email date or form date
- Street number formatting: Cognito form data sometimes includes erroneous commas in street numbers (e.g. `15,912`) — correct before writing anywhere
- Phone numbers in public remarks must be removed before MLS input (CVR MLS compliance)
- Appliance formatting: alphabetical; Microwave Over Range → Microwave; Washer & Dryer → separate Dryer and Washer entries
- Duplicate check against Google Sheet and Aframe before creating any transaction
- Address format for Gmail labels and Drive folders: street number + street name only, no city/state/zip

### Gaps Identified
- [ ] **Session Data tab** not yet populated — all current active listings need rows added
- [ ] **Gmail labels** not yet applied to the two new listing threads
- [ ] **Drive property folders** not yet created for the two new listings
- [ ] **Aframe transactions** not yet created for the two new listings
- [ ] **MLS data sheets** not generated this session — carry forward
- [ ] **Aframe contact IDs** for Gary Martin and Lennar not yet hardcoded in protocol Section 9
- [ ] **Cognito form ID** for Lennar MLS entry form not yet confirmed
- [ ] **Sales rep roster by community** — stub only; document once Megan onboarded
- [ ] **Reverse Prospecting script** not yet integrated into this project

### Documents Created This Session

| Document | Version | File Name |
|---|---|---|
| New Lennar Listing Session Protocol | 1.0 | New_Lennar_Listing_Session_Protocol.md |
| Session Handoff Checklist | 1.0 | Session_Handoff_Checklist.md |
| Session 002 Handoff | — | Session_002_Handoff.md |

### Key IDs Captured This Session

| Item | Value |
|---|---|
| Google Sheet ID | `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Google Drive — Lennar folder | `1hIN1WhrARVrQ7Y4KCh3hlCrI0Q-JS8az` |
| Google Drive — Properties folder | `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |
| Gmail thread — 15912 Greenhart Dr | `19ee0f5f7f909ecd` |
| Gmail thread — 6035 Blue Iris Dr | `19ee12982e889ccc` |
| Gmail thread — Megan Cook intro | `19edd38e2489160d` |

---
*Next session: Complete two live listings, populate Session Data tab, add Lennar protocol to /docs, integrate Reverse Prospecting*

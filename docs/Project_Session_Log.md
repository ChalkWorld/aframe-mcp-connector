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

---

## Session 003 — June 21, 2026

### Focus
Lennar listing protocol continuation — completing the two live listings from Session 002, and designing the MLS input automation system (bookmarklet POC).

### Files Worked
- **15912 Greenhart Dr** — Harpers Mill SF | List Price: $579,990 | Emails read, data parsed, data sheet pending
- **6035 Blue Iris Dr** — Creekside Run TH | List Price: $359,990 | Emails read, data parsed, data sheet pending

### What Was Done

#### Protocol Work
- Read both live listing emails (thread IDs from Session 002 handoff) — full data parsed for both listings
- Confirmed list prices from email: 15912 Greenhart Dr = $579,990 (not $387,490 placeholder); 6035 Blue Iris Dr = $359,990 (not $349,990 placeholder)
- Identified phone number violations in public remarks on both listings — flagged for removal
- Confirmed 6035 Blue Iris Dr photos still pending from Stefanie Nayder
- Data sheets not yet generated — session pivoted to protocol design work

#### MLS Input Automation — Bookmarklet System
- Designed and proven a bookmarklet-based system for automating CVRMLS Matrix data entry
- Discovered Matrix uses ASP.NET server-side tab rendering — each tab is a separate page load; fields for other tabs do not exist in DOM until navigated to
- Determined one-bookmarklet-per-tab architecture is correct approach
- Proven clipboard-reader pattern: session generates full JSON payload → user copies once → clicks bookmarklet on each tab → fields populate
- Identified static vs dynamic field split: Lennar constants (Frame, Vinyl, Dimensional, etc.) hardcoded in bookmarklet; listing-specific values pulled from clipboard
- Identified Chrome security restriction on pasting `javascript:` URLs — resolved with HTML launcher file (drag-to-bookmarks-bar method)
- Explored Claude in Chrome extension for field ID extraction — confirmed viable; extension can read DOM field IDs from any Matrix tab
- Explored custom Chrome extension as future target state — confirmed viable, no App Store approval needed, Cursor project
- **POC complete:** Bath Info tab proven end-to-end — field IDs extracted, bookmarklet built, clipboard reader confirmed working, drag-install method confirmed working

#### Documents Created
- `Lennar_MLS_Bookmarklet_Build.md` (`AAR-TC-LENNAR-BM-001`) — full build doc covering architecture decisions, POC results, Bath Info field map, payload schema, tab inventory, build roadmap, open questions
- `bath_info_bookmarklet_clipboard.html` — HTML launcher for Bath Info clipboard-reader bookmarklet (serves as template for all future tab launchers)

### Decisions Made
- Status tab is never automated — Andrew controls MLS activation manually, hard rule
- Bookmarklet install method: HTML launcher drag-to-bar — not clipboard paste (Chrome blocks javascript: URLs pasted into bookmark fields)
- Custom Chrome extension is the correct long-term target — one toolbar button, auto-detects tab, no clipboard management; build in Cursor once all tab field maps are complete
- Session output will include full JSON payload alongside data sheet as standard Lennar listing output
- Data sheets for 15912 Greenhart Dr and 6035 Blue Iris Dr deferred to Session 004

### Carry Forward — Session 004 Priorities
- [ ] Generate MLS data sheets for both listings (15912 Greenhart Dr and 6035 Blue Iris Dr)
- [ ] Apply Gmail labels for both listings
- [ ] Create Drive property folders for both listings
- [ ] Create Aframe transactions for both listings
- [ ] Add both listings to Session Data tab
- [ ] Continue bookmarklet field mapping — next tab: Listing Info (use Claude in Chrome extension)

### Gaps Identified
- [ ] List prices in Google Sheet need to be confirmed/corrected from email values
- [ ] 6035 Blue Iris Dr photos blocked pending Stefanie Nayder email — watch inbox
- [ ] Bookmarklet field maps needed for 11 remaining tabs

### Documents Created This Session

| Document | Version | File Name |
|---|---|---|
| Lennar MLS Bookmarklet Build | 1.0 | Lennar_MLS_Bookmarklet_Build.md |
| Bath Info Bookmarklet HTML Launcher | — | bath_info_bookmarklet_clipboard.html |

---
*Next session: Continue bookmarklet field mapping. Features tab next. Complete two live listings. Populate Session Data tab.*

---

## Session 004 — June 21, 2026

**Focus:** Bookmarklet field mapping — Listing Info through Fee Info

**Accomplished:**
- Listing Info tab fully mapped (43 fields) — dynamic cascade sequencing documented; Everstone subdivision exception identified (Subdivision = None, Neighborhood = Everstone); Expire Date confirmed as 12/31/2026 static tied to Master Listing Agreement
- Agent/Office Info tab fully mapped — fully static for Lennar; Type = MLS Only, Limited Rep = Yes
- Showing Instructions tab fully mapped — Appt Required always checked, No LB Call Showing Service, Sentrilock zero-pad rule captured for non-Lennar use
- Virtual Tour Info tab fully mapped — 2 text fields, skip tab if no link in email
- Internet Display Info tab fully mapped — all 4 fields always Yes, fully static
- Owner Info tab fully mapped — fully static for Lennar; Owner Name force-overwrites to Lennar even on Tax ID path
- Fee Info tab fully mapped — community-variable; full 26-item Fee Includes semantic label list captured for non-Lennar use; Capital Contribution goes into Add'l Fee Dsc field
- Three-entry-path architecture established — New / Tax ID / Copy bookmark folders; Copy path is preferred long-term for Lennar
- Standing rule established: always capture full semantic labels for all checkbox groups during extraction regardless of Lennar static usage — critical for non-Lennar applicability
- Community Reference Database rewrite deferred — correctly identified that DB must be written against confirmed Matrix field IDs and dropdown option values, not ahead of them; second extraction pass needed for dynamic Listing Info dropdowns (Area, ZIP, Subdivision, schools) with County/City pre-selected
- Old Lennar New Listing Protocol doc reviewed for salvageable content before deletion — Community Quick Reference table and critical rules identified for migration into DB rewrite; step-by-step workflow confirmed stale and not worth preserving

**Tabs remaining:**
- Room Info, Features (dedicated session — 40+ fields), General Info, Remarks

**Cursor handoffs produced this session:**
- `HANDOFF-2026-06-21-bookmarklet-build.md` — bookmarklet build doc v1.1 (Listing Info, Agent/Office, Showing, Virtual Tour, Internet Display)
- `HANDOFF-2026-06-21b-bookmarklet-build.md` — bookmarklet build doc v1.2 (Owner Info, Fee Info)
- `HANDOFF-2026-06-21-session-log.md` — this entry

**Key references:**

| Item | Value |
|---|---|
| Google Sheet ID | `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Google Drive — Lennar folder | `1hIN1WhrARVrQ7Y4KCh3hlCrI0Q-JS8az` |
| Google Drive — Properties folder | `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |
| Gmail thread — 15912 Greenhart Dr | `19ee0f5f7f909ecd` |
| Gmail thread — 6035 Blue Iris Dr | `19ee12982e889ccc` |
| Gmail thread — Megan Cook intro (Gary) | `19edd38e2489160d` |
| Bookmarklet Build Doc | AAR-TC-LENNAR-BM-001 |

---
*Next session: Features tab field mapping (dedicated session — extract in steps with Chrome extension). Room Info, General Info, Remarks. Second extraction pass for Listing Info dynamic dropdowns with County/City pre-selected. Two live listings still pending.*

---

## Session 005 — June 21, 2026

**Focus:** Bookmarklet field mapping — Room Info, General Info, Remarks

**Accomplished:**
- Room Info tab fully mapped — repeating subform structure confirmed; ID pattern `_Input_144__REPEAT{N}_{fieldNum}`; REPEAT19 is hidden template row; decimal-inch fields (774, 775) confirmed present but always skipped — whole feet only; Room Description 50 char max; full Room Type (21 options) and Room Level (7 options) value lists captured; room ordering best practice documented (Level 1 → ascending → Basement, walk-through order within level)
- General Info tab fully mapped — two-path behavior documented; Tax Year/Annual Taxes/Assd Land/Acres skip on Tax ID path; Assd Improvement writes `0` on both paths; Legal Description writes `TBD` on New path; Waterfront and Model Available static No for Lennar; Disclosures and Lead Disclosure static Not Required for Lennar; full semantic lists captured for all three checkbox groups (Lot Desc 46 options, Disclosures 12 options, Lead Disclosure 5 options)
- Remarks tab fully mapped — 3 fields; Remarks 2048 char, Agent Only Comments 1000 char (both client-side enforced, no maxlength HTML attr); Copyright Agreement always static Yes — hardcoded in bookmarklet
- Listing Info PID field note corrected — New path behavior documented as `TBD`
- Decided to do small tabs first before Features — correct sequencing; Features now the only remaining tab
- Confirmed Features session approach: extract in chunks of 5-6 fields at a time, top to bottom

**Tabs remaining:**
- Features (dedicated session — extract in chunks of 5-6 with Chrome extension)

**Cursor handoffs produced this session:**
- `HANDOFF-2026-06-21c-bookmarklet-build.md` — bookmarklet build doc v1.3 (Room Info, General Info, Remarks field maps; PID correction; payload schema updated)
- `HANDOFF-2026-06-21d-session-log.md` — this entry

**Key references:**

| Item | Value |
|---|---|
| Google Sheet ID | `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Google Drive — Lennar folder | `1hIN1WhrARVrQ7Y4KCh3hlCrI0Q-JS8az` |
| Google Drive — Properties folder | `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |
| Bookmarklet Build Doc | AAR-TC-LENNAR-BM-001 |

---
*Next session: Features tab field mapping — dedicated session, extract in chunks of 5-6 fields with Chrome extension, top to bottom.*

---

## Session 006 — June 23, 2026

**Focus:** Protocol consolidation — incorporating learnings from working sessions (Topping Lane 6/23 intake, mixed 6/22 session) into the buyer-side and Lennar listing protocols; deepening agent profile data; capturing the commission/payout model from the Aframe field tree.

**Accomplished:**

*New Buyer Side Session Protocol — v1.0 → v1.1 (7 surgical changes):*
- Ratification date Gmail-first rule added to Step 3 — when ambiguous on contract, check the ratification delivery email before flagging to agent
- Name convention consolidated in Step 6 — all couples (married or otherwise, same or different last names) = one contact + alt contact on the same record; middle names ignored; supersedes prior "shared last name vs. different last names" split and folds in the spouse-as-2nd-buyer carve-out
- Categories section hardened in Step 6 — ⚠️ callout that the connector cannot update categories after creation (contact must be deleted/recreated if missed); Co-Op Agent + transaction year rule added for other-side agents (never "Agent"); seller-on-buyer-side rule added (name + role + category only, no contact info needed)
- Step 7 replaced wholesale — new title "Populate Aframe Merge Fields and Transaction Fields"; adds Commission and Payout model section, Concessions handling section, redrafted Paragraph 23 rule (default verbatim, ask when long — standard is post-ratification relevance), Notes (`f_Notes`) section, Possession (`f_Possession`) section, Services Requested rule with full pricing table, native transaction fields callout (`percentageCommission`, `payoutEstimated`, `payoutActual` via `update_transaction`), and Primary Agent + Assistant 1 added to UI-only fields
- Buyer's agent placement note added to Step 8 — on a buyer-side file the buyer's agent lives in the Primary Agent slot only, not in the participant roster
- Step 10 handoff checklist expanded — adds Primary Agent / Assistant 1 confirmation, `f_ServiceRequested` confirmation, `percentageCommission` / `payoutEstimated` confirmation

*Lennar Listing Session Protocol — v1.0 → v1.1 (8 surgical changes):*
- Systems & Reference table updated — Google Sheet main tab now flagged read-only for sessions; Session Data tab writable with narrate-before-execute rule
- Compliance Rules expanded — Sheet main tab read-only rule, categories-creation-time-only rule, Co-Op Agent + year rule for other-side agents at Under Contract
- Step 6 Sheet write path converted to read-and-surface — sessions read main tab to verify no duplicate, then surface proposed row to Andrew for manual entry
- Step 8 — capture MLS data sheet file URL after saving to property folder; URL surfaces in Step 12 handoff for Andrew to apply as Column A hyperlink on the address
- Step 9 expanded — Primary Agent (Gary Martin) and Assistant 1 (Andrew Rich) marked UI-only; `percentageCommission` = `0` via `update_transaction`; `f_ServiceRequested` = `Listing Data Input - $100`; explicit callout that other commission/payout fields (`payoutEstimated`, `payoutActual`, `f_BuyerSideCommission`, `f_SellerSideCommission`, `f_CommissioncoveredbytheBuyer`, `f_CommissionNotes`) all stay blank on Lennar listings
- Lifecycle sections (Price Adjustment, Under Contract, Closed) updated — Sheet writes become surface-to-Andrew; Co-Op Agent rule added to Under Contract for buyer's agent participant creation
- Step 12 handoff checklist expanded — Sheet add with hyperlink instruction, Primary Agent + Assistant 1 confirmation, MLS# manual entry note

*Agent Profiles — v1.2 → v1.3:*
- New "File Setup Rule" admonition added at the top — roster agent = Primary Agent, Andrew = Assistant 1, all file types, UI-only at creation
- New "Invoicing & Payment (QuickBooks Online)" admonition added at the top — 3% CC surcharge default, Venmo/bank opt-out, ~1% bank fee Andrew absorbs
- Admin Fee vs. Services Requested admonition updated — clarifies seller-side admin fee source (Listing Agreement) in addition to buyer-side (Buyer Agency Agreement)
- Kelly Painschab — admin fee now split buyer-side $395 / seller-side $425; listing service level added (`Listing Data Input - $100`); Merge Field Defaults table updated for `f_ServiceRequested` and `f_AdminFee`; new Payment Preferences section (bank routing, ~1% absorbed by Andrew)
- Gary Martin — gender fields populated (`him` / `his`); listing service level added (`Listing Data Input - $100`); Merge Field Defaults table updated; new Payment Preferences section (credit card, absorbs surcharge himself)
- Liz Brown — gender fields populated (`her` / `her`); listing service level added (`Listing Management - $200`); admin fees populated ($425 buyer-side / $625 seller-side with CC passthrough explanation); Merge Field Defaults table updated; new Payment Preferences section (credit card, passes 3% surcharge through to clients via inflated admin fees)
- Bethanne Elamghari — Payment Preferences section added with all fields TBC; listing service line added (TBC)

*Discoveries:*
- Aframe custom field tree retrieved via `list_custom_fields_tree` — confirmed no "Payout" custom field group exists; payout data lives at the native transaction level via `update_transaction` (`payoutEstimated`, `payoutActual`, `percentageCommission` — the last as decimal, e.g. `0.025` for 2.5%)
- Six existing custom merge fields surfaced that the prior protocol did not document: `f_CommissioncoveredbytheBuyer`, `f_CommissionNotes`, `f_ConcessionsTotal`, `f_Notes`, `f_Possession`, `f_HOAtruefalse` — first five incorporated into buyer-side Step 7; `f_HOAtruefalse` deferred (potential duplicate of `f_HOA`, not in scope this session)

**Decisions Made:**
- **Sheet main tab is read-only for sessions** (confirmed and codified from 6/22 brief) — main Lennar Listings tab is externally visible to Lennar sales contacts; the Zapier mishap on 6/22 (JSON written to COL$A of row 21) is the cautionary precedent. Sessions read and surface; Andrew writes.
- **Column A hyperlink target = MLS data sheet file** (not folder) — on the two new listings from 6/22 this is already in place; backfill of existing rows deferred to a future one-off cleanup session
- **Listing service level lives on the agent profile**, not in the protocol — protocol references Agent Profiles for non-buyer-side service levels; profile is the source of truth
- **Aframe URL attachment promotion deferred to its own session** — coupling roadmap promotion with the actual connector build (Swagger extraction via `EXTRACTION-PROC-001` plus tool wrap via `CURSOR-HANDOFF-PROTOCOL-001`) into one commit is cleaner than splitting them
- **Old `Lennar_New_Listing_Protocol.md`** (the pre-session-protocol doc) — still slated for deletion per Session 004; not done this session

**Protocol Rules Established:**
- Ratification date — Gmail-first when ambiguous on contract; ratification delivery email usually confirms
- Buyer name convention — one contact + alt contact for all couples regardless of last name match; middle names ignored
- Co-Op Agent categories — other-side agents always get `Co-Op Agent` + transaction year; never `Agent`; both at creation
- Sellers on buyer-side files — name + role (Seller Other Side, role ID 43983) + category only; no contact info
- Paragraph 23 — default verbatim, ask when long; standard for inclusion is whether content affects deal post-ratification
- Commission and Payout model — contract states seller's portion of buyer-side commission; Buyer Agency states buyer's total; delta in `f_CommissioncoveredbytheBuyer`; `percentageCommission` = total as decimal; `payoutEstimated` = `contractPrice × percentageCommission`; `payoutActual` blank at intake
- Lennar payout simplification — `percentageCommission` = `0`, all other commission/payout fields blank
- Services Requested — buyer-side default `C2C - $395`; listing values per agent profile (`Listing Data Input - $100` for data input only; `Listing Management - $200` for full management)
- Primary Agent / Assistant 1 — UI-only on every file type; roster agent = Primary, Andrew = Assistant 1
- Concessions at intake — `f_ConcessionsTotal` numeric dollar value from contract; `f_Concessions` = `On contract` if any, blank if none; Mode 2 appends additional lines as concessions accrue
- Possession (`f_Possession`) — used only for rent back; format `Rentback ends on X/X`
- Notes (`f_Notes`) — surface deal characteristics worth keeping in mind (Waived Inspections, As-Is, etc.); not contract terms (those go in `f_ContractOtherInfo`) or commission specifics (those go in `f_CommissionNotes`)

**Gaps Cleared:**
- Buyer-side protocol now codifies the 8 Topping items (6/23 intake brief)
- Lennar listing protocol now carries the 6/22 Sheet read-only decision
- Lennar listing protocol now has explicit MLS sheet hyperlink workflow (Step 8 captures URL; Step 12 surfaces it in handoff)
- Agent profile listing service levels populated for Kelly, Gary, Liz
- Agent profile gender fields populated for Gary and Liz
- Kelly seller-side admin fee documented ($425 on Listing Agreement)
- Liz buyer-side ($425) and seller-side ($625) admin fees documented with CC passthrough mechanism
- QBO payment workflow and per-agent payment preferences documented

**Gaps Identified / Carried Forward:**
- ⭐ **Aframe URL attachment endpoints — promote from Tier 4 to Tier 2 in `CONNECTOR-ROAD-001` and build.** Per 6/22 brief, the `URL` variant of `attachmentType` eliminates the binary upload complexity that originally deferred attachments to Tier 4. Building this would enable the Gmail → Drive → Aframe attachment chain in-session — sessions could grab a signed document from a new email, save to the property's Drive folder, patch a Drive share link into the matching Aframe attachment slot, and apply the Gmail label, all in one pass. **This was the most-felt gap across working sessions on 6/22 and 6/23 (Lennar signed addenda, Winshire St closing extension, Kelly's Ridgecrest LA packet — 7 attachment slots that remain empty without it).** High priority for the next connector build session: extract via `EXTRACTION-PROC-001`, then wrap `create_transaction_attachment` (URL variant) + `list_transaction_attachments` via `CURSOR-HANDOFF-PROTOCOL-001`. Roadmap promotion lands in the same commit as the tool wrap.
- ⭐ **MLS bookmarklet — Features tab extraction and full build.** Features is the only remaining tab to map (dedicated session — extract in chunks of 5-6 with Chrome extension, top to bottom). Once mapped, the full bookmarklet set can be built in Cursor. **Non-Lennar applicability confirmed during 6/23 intake (Kelly's 4508 Ridgecrest Ln new listing) — would have removed substantial manual entry friction.** The full semantic checkbox label lists already captured during prior extractions are explicitly designed to support non-Lennar use. High priority.
- Second extraction pass for Listing Info dynamic dropdowns (Area, ZIP, Subdivision, schools) with County/City pre-selected — still pending; blocks both Listing Info bookmarklet build and Community Reference Database rewrite
- Sales rep roster by community — Megan Cook onboards 6/30; document once she's in
- Bethanne Elamghari agent profile — most fields still TBC; will fill as her files come in
- Old `Lennar_New_Listing_Protocol.md` — still slated for deletion per Session 004; one-off cleanup handoff when convenient
- Existing rows in the Google Sheet main tab without Column A hyperlinks — backfill task, out of scope; do when convenient
- New session protocols still to be written: New Lennar Listing Session Protocol covers listings, New Buyer Side Session Protocol covers buyer-side intake — a Seller-Side Contract Update Protocol is still in the planned-but-not-created bucket (Session 001 carried this forward; still open)

**Cursor handoffs produced this session:**
- `HANDOFF-2026-06-23-protocol-updates.md` — two-target surgical update (New_Buyer_Side_Session_Protocol.md v1.1, New_Lennar_Listing_Session_Protocol.md v1.1); applied earlier in session, commit deferred until this handoff
- `HANDOFF-2026-06-23-session-log.md` — this entry; carries commit block and `git rm` for both handoff files

**Documents Updated This Session:**

| Document | Version | File Name |
|---|---|---|
| New Buyer Side Session Protocol | 1.0 → 1.1 | New_Buyer_Side_Session_Protocol.md |
| Lennar Listing Session Protocol | 1.0 → 1.1 | New_Lennar_Listing_Session_Protocol.md |
| Agent Profiles | 1.2 → 1.3 | Agent_Profiles.md *(project-only doc — re-uploaded to project knowledge by Andrew)* |
| Project Session Log | — | Project_Session_Log.md |

**Key references:**

| Item | Value |
|---|---|
| Google Sheet ID | `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Google Drive — Properties folder | `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |
| Aframe Custom Field Collections | `Transaction Info` (fc_TransactionInfo, ID 457), `Contract Info` (fc_ContractInfo, ID 458) |
| Aframe Field Group — Commissions and fees | fg_Commissionsandfees, ID 9726 |
| Connector Roadmap | `CONNECTOR-ROAD-001` |
| Cursor Handoff Procedure | `CURSOR-HANDOFF-PROTOCOL-001` |
| Swagger Extraction Procedure | `EXTRACTION-PROC-001` |

---
*Next session priority: connector build session — extract Aframe attachment endpoints from Swagger (`EXTRACTION-PROC-001`), then wrap `create_transaction_attachment` (URL variant) + `list_transaction_attachments` and promote in `CONNECTOR-ROAD-001` from Tier 4 to Tier 2. Alternative: dedicated Features tab extraction session for the bookmarklet — extract in chunks of 5-6 with Chrome extension, top to bottom.*

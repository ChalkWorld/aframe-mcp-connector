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

## Session 007 — June 24, 2026 (Extraction) / Session 008 — June 24, 2026 (Build)

**Focus:** Transaction Attachment tools — full Swagger extraction (Session 007) and connector build (Session 008). Both sessions completed same day; logged as one entry.

**Accomplished:**

*Session 007 — Extraction*
- All 7 Transaction Attachment endpoints extracted into `API-REF-001` via `EXTRACTION-PROC-001`
- Changelog notes incorporated: `omitted` field removed from all attachment DTOs; uploader field renamed `appUserIdUploader` → `appUserId`; `completeMode` query parameter documented on `/file` sub-endpoints
- Tool scope decisions made for Session 008 build (see below)
- `PREAUTOMATION-001` gate lifted — task tools (`search_tasks`, `get_task`, `update_task`, `create_task`) are now ungated Tier 2; task visibility needed before template cleanup can be assessed

*Session 008 — Build*
- All 7 Transaction Attachment tools built and deployed as v0.5.0
- `aframeMultipartRequest` helper added to `src/aframe.js` for multipart/form-data file uploads
- `CONNECTOR-ROAD-001` fully rewritten as v3.0 — Tier 1 now reflects all 34 tools shipped v0.1.0–v0.5.0; Tier 2 cleared of all built items; task tools listed as ungated Tier 2

**Tools Built (v0.5.0):**

| Tool | Endpoint |
|---|---|
| `create_transaction_attachment` | `POST /v1/xaction-attachments` |
| `get_transaction_attachment` | `GET /v1/xaction-attachments/{xactionAttachmentId}` |
| `list_transaction_attachments` | `GET /v1/xactions/{xactionId}/xaction-attachments` |
| `update_transaction_attachment` | `PATCH /v1/xaction-attachments/{xactionAttachmentId}` |
| `upload_transaction_attachment_file` | `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file` |
| `unassign_transaction_attachment_file` | `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file/unassign` |
| `assign_transaction_attachment_file` | `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file/assign` |

**Deferred:** `DELETE /v1/xaction-attachments/{xactionAttachmentId}/file` — remains Tier 4; not needed for current workflows.

**Decisions Made:**
- `upload_transaction_attachment_file` accepts `fileBase64` (base64-encoded string) as the MCP tool input — Claude cannot pass raw binary across a tool call; `Buffer.from(fileBase64, 'base64')` converts before the multipart fetch
- `assign_transaction_attachment_file` returns a plain string from the API (not a DTO) — `formatResult` handles this correctly
- Roadmap rewrite (v3.0) performed wholesale rather than surgical patches — too many stale sections for surgical edits to be practical

**Cursor Handoffs Produced:**
- `HANDOFF-v0.5.0-aframe-js.md` — `aframeMultipartRequest` helper + 7 new attachment functions
- `HANDOFF-v0.5.0-index-js.md` — import block, tool registrations (Tools 28–34), version bump, startup log
- `HANDOFF-v0.5.0-package-json.md` — version bump to 0.5.0
- `HANDOFF-v0.5.0-roadmap.md` — surgical tier promotion patch (attachment tools Tier 4 → Tier 1)
- `HANDOFF-v0.5.0-roadmap-rewrite.md` — full `CONNECTOR-ROAD-001` rewrite to v3.0; carries commit block

**Documents Updated This Session:**

| Document | Version | File |
|---|---|---|
| Aframe API Reference — Transaction Attachments | — | `docs/aframe-api-reference/04-transaction-attachments.md` |
| Aframe Connector source | v0.5.0 | `src/aframe.js`, `src/index.js`, `package.json` |
| Connector Tool Roadmap | v3.0 | `docs/CONNECTOR_TOOL_ROADMAP.md` |
| Project Session Log | — | `docs/Project_Session_Log.md` |

**Key References:**

| Item | Value |
|---|---|
| Connector Roadmap | `CONNECTOR-ROAD-001` |
| Cursor Handoff Protocol | `CURSOR-HANDOFF-PROTOCOL-001` |
| Swagger Extraction Procedure | `EXTRACTION-PROC-001` |
| Aframe API Reference | `API-REF-001` |
| Railway connector URL | `https://aframe-mcp-connector-production.up.railway.app/mcp` |

**Smoke Test Results (v0.5.0 — Oakwood test file, xactionId 554560):**
- `list_transaction_attachments` — confirmed working; returned all 15 placeholder slots in Contract Files folder
- `update_transaction_attachment` — confirmed working; patched Ratified Contract slot to URL type with Drive link, marked complete
- `upload_transaction_attachment_file` — partially confirmed; API call succeeded and slot marked complete, but binary routing through MCP context is not viable for real file sizes (640KB PDF = ~853k base64 chars / ~200k tokens); file stored in Aframe was truncated/corrupt

**Key Decision — Binary Upload Architecture:**
Binary files cannot be routed through Claude's context window for real-world document sizes. The correct architecture is a **server-side transfer endpoint** in the Railway connector app. Claude orchestrates (provides IDs, confirms intent); binary moves server-to-server without touching the MCP layer.

**Gmail→Aframe Vision Scoped:**
Full Mode 2 attachment workflow defined and documented in `GMAIL-TO-AFRAME-001`:
1. Email arrives with attachment during active transaction
2. Claude reads thread (Gmail MCP), understands document type from context
3. Claude matches to correct Aframe slot or determines new slot needed
4. Claude confirms with Andrew
5. Transfer tool fires — Gmail API → Aframe API, server-side, no context burn
6. Slot marked complete

Stretch goal: intelligent PDF splitting inside the endpoint (server-side Claude API call) to handle merged packets (contract + addenda + disclosures as one file → split and routed to correct slots).

**Documents Created This Session:**

| Document | Version | File |
|---|---|---|
| Gmail→Aframe File Transfer Scoping Doc | 0.1 | `docs/GMAIL-TO-AFRAME-001.md` |

**Next Session Priorities:**
1. Task endpoint extraction + build — `search_tasks`, `get_task`, `update_task`, `create_task` — extract from Swagger, wrap in connector (Session 009 lead)
2. Gmail→Aframe scoping session — confirm auth path (personal Gmail vs. Workspace), finalize endpoint design, decide splitting v1 vs. v2, author handoffs
3. Features tab field map (Lennar bookmarklet)
4. Second extraction pass — Listing Info dynamic dropdowns

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

---

## Session 009 — June 25, 2026

**Focus:** Task tools — Swagger extraction, connector build (v0.6.0), smoke testing, and behavioral discoveries

---

**Accomplished:**

*Extraction*
- Extracted 3 missing task endpoints from Swagger via `EXTRACTION-PROC-001` (Path B): `POST /v1/tasks/search`, `GET /v1/tasks/{taskId}`, `POST /v1/tasks`. `PATCH /v1/tasks/{taskId}` was already extracted (Session 006). All 4 now complete in `08-tasks.md`.

*Build — v0.6.0*
- All 4 task tools built and deployed: `search_tasks`, `get_task`, `update_task`, `create_task`
- Connector now at 38 tools (up from 34)
- Two post-build patches applied:
  - `taskTZ` added to `create_task` — undocumented required field discovered during smoke test; hardcoded to `"America/New_York"`
  - Date-adjustment field block added to both `create_task` and `update_task` — fields were in the extracted schema but omitted from initial build; corrected same session
  - Version strings in `src/index.js` health check and startup log fixed (were still showing `0.5.0`)

*Smoke testing — all 4 tools confirmed on xactionId 554560 (4821 Oakwood Drive test file)*

| Tool | Result | Notes |
|---|---|---|
| `search_tasks` | ✅ Clean | WAITING behavior confirmed (see quirks below) |
| `get_task` | ✅ Clean | Full APITaskDto returned correctly |
| `update_task` | ✅ Clean | COMPLETE/OPEN toggle, color, due date, folder assignment all working |
| `create_task` | ✅ Clean (after patch) | Required `taskTZ` not documented in schema |

*Date-adjustment smoke test*
- `update_task` with date-adjustment fields returns 422 with no validation detail — behavior appears to be create-only; PATCH rejection is silent and may be an API limitation
- `create_task` with `dueDateAdjustType: PARENT_TASK` confirmed working after discovering that `dateAdjustReferenceCode` must be `"d_{parentTaskId}"` (parent task ID prefixed with `d_`) — API auto-converts internally and stores as `EVENT_MERGE_FIELD_CODE` type
- `dueDateAdjustRefTaskParentContingent: true` confirmed working — task was hidden in UI until flag flipped to false via `update_task`
- Before/after direction is controlled entirely by sign of `dueDateAdjustDelta` — negative = before, 0 = day of, positive = after; no separate direction field

---

**Behavioral Discoveries (document in `08-tasks.md` quirks):**

- `search_tasks` excludes tasks with `dueDateAdjustStatus: WAITING` from results — tasks anchored to an unset merge field (e.g. `d_ClosingDate`) are invisible to search until the field is populated. Once a close date is entered, WAITING tasks resolve to SET and appear. In production this is a non-issue — all files will have a close date before task management begins.
- `taskTZ` is required on `create_task` even when no due date is supplied — not flagged as required in the Swagger schema.
- `status` is required on `create_task` — not flagged as required in the Swagger schema; defaults exist in the schema description but the API enforces explicit supply.
- Date-adjustment fields (`dueDateAdjustActive`, `dueDateAdjustType`, etc.) appear patchable in the schema but `update_task` returns silent 422 for all combinations tested — may be create-only.
- `dateAdjustReferenceCode` for `PARENT_TASK` type must be `"d_{parentTaskId}"` — pass the parent task ID as a plain string; the `d_` prefix is applied and stored by Aframe.
- The task date formula dropdown in the Aframe UI pulls from the team's event/date merge field list (e.g. `d_ClosingDate`, `d_EarnestMoneyDue`). This list is not yet accessible as a dedicated connector tool — blocked by `list_transaction_events` being unextracted (see Roadmap flag below).

---

**Roadmap Flag:**

`list_transaction_events` (`GET /v1/xactions/{xactionId}/events`) is currently Tier 4. Promote to Tier 3 minimum — the events endpoint is the source of all date merge fields used in task due date formulas (`d_ClosingDate`, `d_EarnestMoneyDue`, etc.). Without it, dynamic task creation with date-anchored due dates requires hardcoding merge field codes rather than reading them from the transaction. Full dynamic due date input for `create_task` is blocked until this tool is built.

---

**Tools Built (v0.6.0):**

| Tool | Endpoint |
|---|---|
| `search_tasks` | `POST /v1/tasks/search` |
| `get_task` | `GET /v1/tasks/{taskId}` |
| `update_task` | `PATCH /v1/tasks/{taskId}` |
| `create_task` | `POST /v1/tasks` |

---

**Cursor Handoffs Produced:**

| Handoff | Target | Notes |
|---|---|---|
| `HANDOFF-v0.6.0-aframe-js.md` | `src/aframe.js` | 4 new task functions |
| `HANDOFF-v0.6.0-index-js.md` | `src/index.js` | 4 tool registrations + imports |
| `HANDOFF-v0.6.0-package-json.md` | `package.json` + `src/index.js` | Version bump to 0.6.0; carries commit block |
| `HANDOFF-v0.6.0-patch-create-task-tz.md` | `src/index.js` | Add `taskTZ` hardcoded to `create_task` params |
| `HANDOFF-v0.6.0-patch-task-date-adjust.md` | `src/index.js` | Date-adjustment field block on both task tools; version string fix |

---

**Documents Updated This Session:**

| Document | Change | File |
|---|---|---|
| Aframe API Reference — Tasks | 3 endpoints extracted (search, get, create); date-adjust quirks to be added | `docs/aframe-api-reference/08-tasks.md` |
| Aframe Connector source | v0.6.0 — 4 task tools + 2 patches | `src/aframe.js`, `src/index.js`, `package.json` |
| Project Session Log | This entry | `docs/Project_Session_Log.md` |

---

**Open Items Carried Forward:**

- [ ] Add quirks to `08-tasks.md` — `taskTZ` undocumented required, `status` undocumented required, WAITING search exclusion, date-adjust PATCH silent 422, `dateAdjustReferenceCode` prefix behavior
- [ ] Promote `list_transaction_events` from Tier 4 → Tier 3 in `CONNECTOR-ROAD-001` with blocking note
- [ ] Delete test tasks from 4821 Oakwood Drive test file (21440040, 21442067) — Andrew to do in UI
- [ ] Remove close date from 4821 Oakwood Drive test file — Andrew to do in UI if desired

**Key References:**

| Item | Value |
|---|---|
| Connector Roadmap | `CONNECTOR-ROAD-001` |
| Aframe API Reference — Tasks | `docs/aframe-api-reference/08-tasks.md` |
| Cursor Handoff Protocol | `CURSOR-HANDOFF-PROTOCOL-001` |
| Swagger Extraction Procedure | `EXTRACTION-PROC-001` |
| Railway connector URL | `https://aframe-mcp-connector-production.up.railway.app/mcp` |
| Test file xactionId | 554560 (4821 Oakwood Drive) |

---

*Next session priority: Features tab field mapping and full bookmarklet build.*

---

## Session 011 — June 25, 2026

**Focus:** Bookmarklet system design, source file creation, and Lennar launcher build

**Accomplished:**

- Reviewed full bookmarklet system architecture and confirmed approach for Session 011
- Decided to build directly in Claude artifacts rather than Cursor — self-contained HTML launchers are faster to produce and test iteratively; Cursor batch reserved for complex interdependent builds
- Decided to build non-Lennar baseline first, then derive Lennar variant — correct sequencing; Lennar is a pared-down version of the full field set, not the other way around
- Created master bookmarklet source file `docs/Lennar_MLS_Bookmarklet_Source.md` (`AAR-TC-LENNAR-BM-SRC-001`) — all 12 tabs, non-Lennar and Lennar variants, readable commented JS, canonical payload schema; one master file, never minified; launchers generated from this source
- Identified and resolved `Input_705` conflict — field was incorrectly attributed to Assd Improvement in General Info; confirmed via ES session that `Input_705` is Management Firm (Fee Info) and Assd Improvement is `Input_246`; source file patched via Cursor handoff
- Scoped Listing Info extraction gap — County/City, Area, and Schools are the only fields worth extracting per jurisdiction; Subdivision and Post Office are too long and too variable to maintain lookup tables for; both treated as payload-driven best-effort with silent fallback to manual
- Defined Tier 1 jurisdiction list for non-Lennar lookup table: Chesterfield, Henrico, Richmond City (already covered by Lennar) + Goochland, Powhatan, Hanover, New Kent, Dinwiddie, Petersburg, Hopewell, Colonial Heights, Ashland (confirm whether separate from Hanover in Matrix)
- Decided to document extraction approach and keep building rather than stop to extract — extraction requires live Matrix session with Claude in Chrome; not a blocker for tabs that are ready now
- Built and tested 9 of 12 Lennar launcher HTML files — all confirmed working in Chrome via drag-to-bookmarks-bar install; multi-tab payload isolation confirmed working (each bookmarklet reads only its own key)

**Launchers built and tested:**

| Tab | File | Status |
|---|---|---|
| Bath Info | `bookmarklets/lennar_bath_info.html` | ✅ Tested |
| General Info | `bookmarklets/lennar_general_info.html` | ✅ Tested |
| Remarks | `bookmarklets/lennar_remarks.html` | ✅ Tested |
| Fee Info | `bookmarklets/lennar_fee_info.html` | ✅ Tested |
| Owner Info | `bookmarklets/lennar_owner_info.html` | ✅ Tested |
| Agent/Office Info | `bookmarklets/lennar_agent_office_info.html` | ✅ Tested |
| Showing Instructions | `bookmarklets/lennar_showing_instructions.html` | ✅ Tested |
| Virtual Tour Info | `bookmarklets/lennar_virtual_tour_info.html` | ✅ Tested |
| Internet Display Info | `bookmarklets/lennar_internet_display_info.html` | ✅ Tested |

**Remaining Lennar launchers — blockers:**

| Tab | Blocker |
|---|---|
| Listing Info | Cascade dropdown stored values not yet confirmed — requires extraction pass in live Matrix session |
| Features | Own dedicated session — field map complete in `AAR-TC-LENNAR-BM-001-FEA`; build approach updated (see decisions below) |
| Room Info | Lennar skips entirely — non-Lennar only; one open question on REPEAT0 behavior |

**Decisions Made:**

- **One master source file** — `docs/Lennar_MLS_Bookmarklet_Source.md` is the source of truth for all bookmarklet JS; never minified; launcher HTMLs generated from it; fits existing doc conventions; avoids noise of dozens of individual JS files
- **`bookmarklets/` folder** — all launcher HTML files live here; separate from `docs/` to avoid mixing reference docs with deployment artifacts
- **Non-Lennar baseline first** — non-Lennar variant is the canonical full version; Lennar variant is derived from it with static layer applied; building Lennar-first would require undoing assumptions later
- **Subdivision and Post Office** — not worth extracting; both dropdowns are hundreds of options long and mostly irrelevant; treated as payload-driven best-effort; bookmarklet attempts to set, silently fails if option not present, falls back to manual
- **Jurisdiction extraction scope** — extract only County/City stored value, Area stored value, and school stored values per jurisdiction; schools are zone-dependent and may need to be built incrementally from real listings
- **Flag-and-fallback pattern** — if community lookup returns null for any jurisdiction, bookmarklet alerts and tab is filled manually; no bloat in lookup table for rare jurisdictions
- **Features bookmarklet design change** — do not fully hardcode Lennar constants; use default-with-payload-override pattern (`d.field || 'LennarDefault'`) so richer data from sales team can flow through when provided; three-tier field classification: truly static (Water, Sewer, Heating/Cooling, Structure, Siding, Roof, Foundation), community/model defaults with override (Garage, ADU, Basement), fully dynamic (Interior, Exterior, Appliances, Pool, Community Amenities, Flooring, Porch)
- **Features session framing** — Lennar sales team is a potential source of richer per-listing feature data; more complete feature data improves MLS listing quality and searchability; worth surfacing as a value-add conversation with sales team

**Cursor Handoffs Produced This Session:**

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-06-25-assd-improvement-fix.md` | Surgical fix — Assd Improvement field ID `Input_246` in General Info variants of source file |
| This entry | Session log + repo restructure |

**Documents Created This Session:**

| Document | Version | File |
|---|---|---|
| Bookmarklet Source File | 0.1 | `docs/Lennar_MLS_Bookmarklet_Source.md` (`AAR-TC-LENNAR-BM-SRC-001`) |
| Lennar Bath Info Launcher | — | `bookmarklets/lennar_bath_info.html` |
| Lennar General Info Launcher | — | `bookmarklets/lennar_general_info.html` |
| Lennar Remarks Launcher | — | `bookmarklets/lennar_remarks.html` |
| Lennar Fee Info Launcher | — | `bookmarklets/lennar_fee_info.html` |
| Lennar Owner Info Launcher | — | `bookmarklets/lennar_owner_info.html` |
| Lennar Agent/Office Info Launcher | — | `bookmarklets/lennar_agent_office_info.html` |
| Lennar Showing Instructions Launcher | — | `bookmarklets/lennar_showing_instructions.html` |
| Lennar Virtual Tour Info Launcher | — | `bookmarklets/lennar_virtual_tour_info.html` |
| Lennar Internet Display Info Launcher | — | `bookmarklets/lennar_internet_display_info.html` |

---
*Next session: Features bookmarklet build — dedicated session; all pre-build prep complete; go straight into JS.*

---

## Session 012 — June 25, 2026

**Focus:** Listing Info stored value extraction, Listing Info launcher build, Features pre-build prep

**Accomplished:**
- Listing Info stored option values extracted via ES session — ran extraction prompt against one active listing per community; confirmed stored `value` attributes for County/City, Area, ZIP, Post Office, Subdivision, Neighborhood, and all three schools
- Key extraction finding: Matrix stores multi-word school names without spaces (DeepCreek, RiverCity, FallingCreek, HighlandSprings) — would have caused silent failures if assumed otherwise
- `LENNAR_COMMUNITIES` lookup table patched in `docs/Lennar_MLS_Bookmarklet_Source.md` — both the readable object and the inline JS object updated with confirmed values; Wynwood removed from both (community sold out, no forthcoming listings)
- Listing Info launcher built (`bookmarklets/lennar_listing_info.html`) and tested successfully on first try — cascade timing (1500ms + 800ms) held; all fields populated correctly including Subdivision, schools, and all Lennar statics
- Single-folder bookmarklet architecture confirmed — one set of bookmarklets; `path` key in payload drives per-tab behavior; no separate bookmark folders per entry path needed
- Features pre-build prep completed in full — all community-specific values resolved without additional ES session work: Heating, Heat/Fuel, Pool Y/N, Pool Description, Community Amenities per community confirmed; Cooling and Water Heater confirmed as Lennar statics across all communities; Unit Placement, Interior, Exterior, Porch identified as payload-driven stubs
- Confirmed Harpers Mill TH and SF are identical for Features — only difference between them is Fee Info tab
- Confirmed Pool Description for Lennar is always Community/Off Site only — other pool description options are non-Lennar
- Confirmed payload spec should cover both Lennar and non-Lennar variants in one pass — non-Lennar is canonical baseline

**Community Amenities confirmed per community:**
- Harpers Mill (TH + SF): Association, Clubhouse, Common Area, Playground, Pool
- Creekside Run: Association, Common Area, Picnic Area, Playground
- Everstone: Association, Common Area, Picnic Area, Playground
- Watermark: Association (may expand as community matures)

**Items closed this session:**
- Delete test tasks 21440040 + 21442067 — confirmed done
- Google Sheet Column A hyperlink backfill — confirmed done
- `Lennar_New_Listing_Protocol.md` deletion — confirmed already gone from repo

**Cursor Handoffs Produced This Session:**

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-06-25-listing-info-lookup-table.md` | Patch `LENNAR_COMMUNITIES` + inline `COMMUNITIES` in source file with confirmed stored values; remove Wynwood |
| `HANDOFF-2026-06-25-session-log.md` | This entry |

**Documents Created This Session:**

| Document | Version | File |
|---|---|---|
| Lennar Listing Info Launcher | — | `bookmarklets/lennar_listing_info.html` |

**Key References:**

| Item | Value |
|---|---|
| Bookmarklet Source File | `AAR-TC-LENNAR-BM-SRC-001` (`docs/Lennar_MLS_Bookmarklet_Source.md`) |
| Features Field Map | `AAR-TC-LENNAR-BM-001-FEA` (`docs/Lennar_MLS_Features_Field_Map.md`) |
| Bookmarklet Build Doc | `AAR-TC-LENNAR-BM-001` (`docs/Lennar_MLS_Bookmarklet_Build.md`) |
| Google Sheet ID | `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Google Drive — Lennar folder | `1hIN1WhrARVrQ7Y4KCh3hlCrI0Q-JS8az` |
| Google Drive — Properties folder | `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |

---

## Session 013 — June 26, 2026

**Focus:** Features bookmarklet build — non-Lennar and Lennar variants, launchers, and session protocol improvements

**Accomplished:**
- Features bookmarklet built in full — non-Lennar variant (all 49 field groups, fully payload-driven) and Lennar variant (three-tier design: hardcoded statics, community lookup table, payload-driven dynamic fields)
- Gemini cross-reference audit conducted against field map — three missing text inputs identified and patched in non-Lennar variant (`Input_659` Other Heating Desc, `Input_660` Other Heat/Fuel Desc, `Input_661` Other Cooling Desc); Cooling and Water Heater Lennar use notes flagged as documentation conflict — resolved in favor of Session 012 confirmed statics (bookmarklet JS correct; field map needs patch via separate handoff)
- Features source addendum created as separate file (`AAR-TC-LENNAR-BM-SRC-001-FEA`) rather than inline in main source file — scale of tab (~400 lines across both variants) justified addendum pattern; consistent with field map precedent (`AAR-TC-LENNAR-BM-001-FEA`)
- Features bookmarklet split into three launchers rather than one — decision made during session review: non-Lennar split into Features A (chunks 1–5, Style through Fireplace) and Features B (chunks 6–10, Community Amenities through Irrigation Source); Lennar kept as single bookmarklet; each launcher reads its own payload key independently; no extra workflow complexity
- Smoke test conducted on Lennar Features bookmarklet — passed after correcting drag install issue (artifact widget used for proper drag target)
- Session review beat added to session protocol — before any build work begins, Claude recaps the agenda and explicitly invites Andrew to surface any between-session questions, changes, or new context; prevents jumping straight into building without alignment check
- Non-Lennar baseline first pattern reconfirmed — handoff captured the build priority but not the sequencing decision; review beat caught this before build started

**Key decisions:**
- Features source lives in addendum (`docs/AAR-TC-LENNAR-BM-SRC-001-FEA.md`) — not inline in main source file; TAB 4 stub in source file updated to reference it
- Three Features launchers — `bookmarklets/features_a.html`, `bookmarklets/features_b.html`, `bookmarklets/lennar_features.html`; non-Lennar payload split across `features_a` and `features_b` keys; Lennar payload uses `features` + `community` keys
- Cooling (Heat Pump) and Water Heater (Electric) confirmed Lennar statics — field map Lennar use notes to be patched via `HANDOFF-2026-06-26-features-fieldmap-static-patch.md`
- Session review beat is now standing protocol — see Session Rules

**Cursor handoffs produced this session:**

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-06-26-features-fieldmap-static-patch.md` | Patch Cooling and Water Heater Lennar use notes in Features field map from DYNAMIC to STATIC |
| `HANDOFF-2026-06-26-features-source-addendum.md` | Commit `AAR-TC-LENNAR-BM-SRC-001-FEA.md` to `docs/`; patch TAB 4 stub in main source file |
| `HANDOFF-2026-06-26-session-log.md` | This entry |

**Documents created this session:**

| Document | Version | File |
|---|---|---|
| Features Bookmarklet Source Addendum | 1.0 | `docs/AAR-TC-LENNAR-BM-SRC-001-FEA.md` |
| Features A Launcher | — | `bookmarklets/features_a.html` |
| Features B Launcher | — | `bookmarklets/features_b.html` |
| Lennar Features Launcher | — | `bookmarklets/lennar_features.html` |

**Launchers confirmed working (cumulative):**

| Tab | File | Status |
|---|---|---|
| Bath Info | `bookmarklets/lennar_bath_info.html` | ✅ Tested |
| General Info | `bookmarklets/lennar_general_info.html` | ✅ Tested |
| Remarks | `bookmarklets/lennar_remarks.html` | ✅ Tested |
| Fee Info | `bookmarklets/lennar_fee_info.html` | ✅ Tested |
| Owner Info | `bookmarklets/lennar_owner_info.html` | ✅ Tested |
| Agent/Office Info | `bookmarklets/lennar_agent_office_info.html` | ✅ Tested |
| Showing Instructions | `bookmarklets/lennar_showing_instructions.html` | ✅ Tested |
| Virtual Tour Info | `bookmarklets/lennar_virtual_tour_info.html` | ✅ Tested |
| Internet Display Info | `bookmarklets/lennar_internet_display_info.html` | ✅ Tested |
| Listing Info | `bookmarklets/lennar_listing_info.html` | ✅ Tested |
| Features (Lennar) | `bookmarklets/lennar_features.html` | ✅ Tested |
| Features A (Non-Lennar) | `bookmarklets/features_a.html` | ⬜ Not yet tested |
| Features B (Non-Lennar) | `bookmarklets/features_b.html` | ⬜ Not yet tested |
| Room Info | — | ⬜ Non-Lennar only; REPEAT0 open question |

**Key references:**

| Item | Value |
|---|---|
| Bookmarklet Source File | `AAR-TC-LENNAR-BM-SRC-001` (`docs/Lennar_MLS_Bookmarklet_Source.md`) |
| Features Source Addendum | `AAR-TC-LENNAR-BM-SRC-001-FEA` (`docs/AAR-TC-LENNAR-BM-SRC-001-FEA.md`) |
| Features Field Map | `AAR-TC-LENNAR-BM-001-FEA` (`docs/Lennar_MLS_Features_Field_Map.md`) |
| Bookmarklet Build Doc | `AAR-TC-LENNAR-BM-001` (`docs/Lennar_MLS_Bookmarklet_Build.md`) |
| Google Sheet ID | `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Google Drive — Lennar folder | `1hIN1WhrARVrQ7Y4KCh3hlCrI0Q-JS8az` |
| Google Drive — Properties folder | `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |

---
*Next session: Features A + B smoke tests; payload spec (both variants); General Info path logic patch (Acres + Legal taxid skip missing).*

---

## Session 014 — June 26, 2026

**Focus:** Lennar Features bookmarklet fix, Features schema doc, Lennar New Listing Protocol v2.0 rewrite

---

### What Was Done

**Lennar Features bookmarklet — href bug fix**
The orange drag-to-bookmarks button in `bookmarklets/lennar_features.html` was rendering raw JS as visible page text. Root cause: two literal `"` characters inside the `alert()` string were terminating the double-quoted `href` attribute early in the browser, exposing ~6,200 chars of JS as page content. Fixed by replacing those two `"` with `&quot;` HTML entities. JS logic unchanged. File replaced in Chrome and confirmed working. No Cursor handoff needed — file delivered directly.

**Lennar Features bookmarklet — schema review and patch (Cursor handoff)**
Live smoke test on a Matrix listing revealed the previous session had made undiscussed best-guess decisions about which fields to hardcode. Full schema review conducted with Andrew. All Features tab fields confirmed and classified. Cursor handoff `HANDOFF-2026-06-26-lennar-features-patch.md` produced covering 10 changes:

- Roof: `Input_72_07` (Dimensional) → `Input_72_12` (Shingled) — HC
- Flooring: dynamic → HC `Input_73_17` (Vinyl - Plank/Tile/Stone)
- Attic: dynamic → HC `Input_241_09` (Access Panel)
- Wall Type: dynamic → HC `Input_254_02` (Drywall)
- Garage Y/N: hardcoded Yes → dynamic (`d.garage_yn`); Attached + Direct Entry conditional on Yes; Auto Door Opener payload key kept (`garage_auto_door`) but not hardcoded
- Basement Y/N: hardcoded No → dynamic (`d.basement_yn`); Slab conditional on No, Crawl Space conditional on Yes
- ADU Y/N: removed entirely
- Fenced Y/N: removed entirely
- Internet Connected: removed entirely
- Restrictions, Disabl Equipd Y/N, Maintenance Contract Y/N, Green Cert: all removed entirely
- Water Heater (Electric) and Cooling (Heat Pump): confirmed correct as HC — no change
- Statics display table and payload example block in launcher HTML updated to match

**Lennar Features Payload Schema — new document**
`AAR-TC-LENNAR-BM-SCH-001` (`Lennar_Features_Payload_Schema.md`) created. Expanded from Features-only scope to cover all 11 bookmarklet tabs. Includes: field classification table per tab, community lookup table with confirmed values, payload structures for all dynamic tabs, excluded fields master list, and version history. Supersedes the Features-only v1.0 produced earlier in the session.

**Lennar New Listing Protocol — full rewrite (v2.0)**
`New_Lennar_Listing_Session_Protocol.md` deleted from repo. Replaced with `Lennar_New_Listing_Protocol.md` v2.0 (`AAR-TC-LENNAR-PROTO-001`). Key changes from v1.1:

- Step 2 rebuilt as three-substep sequence: parse/verify → create Aframe transaction → generate data sheet (confirm with Andrew) → generate payload. Explicit confirmation gate between data sheet and payload — session never one-shots the payload without review.
- Entry path rules by community documented as a named section: Harpers Mill TH/SF on Tax ID path; Creekside Run, Everstone, Watermark on New path. Reason and current status noted.
- Community key formats clarified — two conventions exist: Features bookmarklet uses human-readable display names (`Harpers Mill TH` etc.); Listing Info bookmarklet uses lowercase underscore internal keys (`harpers_mill_th` etc.).
- Step 9 (Transaction Desk): planned signing platform automation noted — address, price, and community name are the only inputs needed when implemented.
- Step 10 (Photos): planned local photo sorter/renumbering automation noted (`AAR-TC-LENNAR-PHOTO-001`).
- Community Quick Reference table updated — Wynwood removed, Cooling column added, Entry Path column added.
- Reference docs table updated to include schema doc and bookmarklet build doc.

**New path full smoke test — separate session (not captured here)**
A full New path test was run in a parallel Claude session. A bug was found and resolved in that session. Details not captured here — see that session's handoff.

---

### Decisions Made

- **Data sheet before payload, always** — session presents data sheet to Andrew for explicit confirmation before generating the payload; no one-shotting
- **Lennar statics are narrow** — only fields that are truly invariant across all listings and communities are hardcoded; anything community-variable goes in the lookup table; anything listing-variable goes in the payload
- **ADU Y/N, Fenced Y/N, Internet Connected, Restrictions, Disabl Equipd Y/N, Maintenance Contract Y/N, Green Cert** — all excluded from the Lennar Features bookmarklet entirely; not written under any circumstances
- **Auto Door Opener** — payload key kept (`garage_auto_door`) but not hardcoded; confirm with Lennar if standard; default `false` until confirmed
- **Basement logic** — `basement_yn` `"1"` → Crawl Space; `"0"` → Slab; all current Lennar communities are slab
- **Garage logic** — `garage_yn` `"1"` → Attached + Direct Entry auto-checked; `"0"` → neither checked
- **Community key conventions** — TH/SF suffix in community display names is an AAR-TC internal convention for distinguishing type; not a Matrix stored value
- **Entry path assignments** — Harpers Mill Tax ID; Creekside Run/Everstone/Watermark New path — revisit when tax records are updated for new addresses
- **Lennar New Listing Protocol replaces old session protocol** — `New_Lennar_Listing_Session_Protocol.md` deleted; `Lennar_New_Listing_Protocol.md` v2.0 is now the single authority

---

### Protocol Rules Confirmed / Added

- Data sheet first, confirm, then payload — never one-shot the payload without Andrew confirming the data sheet
- Session review beat confirmed as standing rule — recap agenda and check in before any build work begins

---

### Gaps Identified / Carried Forward

- **Street Suffix stored values (`Input_37`)** — not yet confirmed for Listing Info; may have been surfaced in the parallel smoke test session — check that handoff
- **Features A + B smoke tests** — not reached this session; still pending
- **Payload generation spec** — pending Features A + B schema confirmation
- **General Info path logic patch** — Acres + Legal Description missing `taxid` skip; pending
- **Lennar Features bookmarklet schema patch** — Cursor handoff produced but not yet committed; Chrome bookmark not yet updated with schema patch

---

### Cursor Handoffs Produced This Session

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-06-26-lennar-features-patch.md` | 10-change schema patch to `bookmarklets/lennar_features.html` |
| This entry | Session log |

---

### Documents Created / Updated This Session

| Document | Version | File |
|---|---|---|
| Lennar Features Payload Schema (all tabs) | 1.1 | `Lennar_Features_Payload_Schema.md` (`AAR-TC-LENNAR-BM-SCH-001`) |
| Lennar New Listing Protocol | 2.0 | `Lennar_New_Listing_Protocol.md` (`AAR-TC-LENNAR-PROTO-001`) |
| `New_Lennar_Listing_Session_Protocol.md` | — | **Deleted** — superseded by v2.0 above |

---

### Key References

| Item | Value |
|---|---|
| Bookmarklet Build Doc | `AAR-TC-LENNAR-BM-001` (`docs/Lennar_MLS_Bookmarklet_Build.md`) |
| Full Payload Schema | `AAR-TC-LENNAR-BM-SCH-001` (`Lennar_Features_Payload_Schema.md`) |
| Lennar New Listing Protocol | `AAR-TC-LENNAR-PROTO-001` (`Lennar_New_Listing_Protocol.md`) |
| Test file xactionId | 554560 (4821 Oakwood Drive) |
| Bookmarklets folder | `bookmarklets/` (repo root) |
---

## Session 016 — June 26, 2026

**Focus:** Cold run new listing test (8752 Whitman Dr), General Info bookmarklet bug investigation and fixes, protocol sync issue discovery, session log handoff pattern

**Note:** Session started without a handoff upload — intentional cold read test of the new listing protocol and bookmarklet workflow. Session 015 handoff uploaded mid-session to provide context for log entry and carry-forward.

---

### Accomplished

**1. Cold run new listing test — 8752 Whitman Dr (Harpers Mill TH)**

Full new listing intake run using Gmail (Carly's email, thread `19e898d10f9c86f5`), Community Reference Database, and MLS Data Sheet template. Address confirmed as a duplicate (already Active at MLS# 2615020) — test proceeded anyway for bookmarklet validation purposes; listing was not saved.

Data sheet and full JSON payload generated. Bookmarklet test run on Tax ID path produced two findings:

- **Features — Style field missed** — payload had `"style": []` (empty array); bookmarklet correctly skipped it. Root cause: session output rule gap — Style was not being populated. Fix: protocol rule added (see below).
- **General Info — two bugs found** (see item 2 below).

**2. General Info bookmarklet — three bugs identified and fixed**

Live bookmarklet test against Tax ID path listing revealed:

**Bug 1 — Input_246 / Input_248 label swap**
Extraction was originally run against a New path listing. On Tax ID path, Matrix shifts field IDs:
- `Input_246` = Tax Year (not Assd Improvement as previously mapped)
- `Input_248` = Assd Improvement (unmapped; not in original extraction)

Confirmed via live ES session DOM extraction against Tax ID path listing (June 26, 2026). This explains both symptoms: Tax Year was being overwritten to `"0"` and Assd Improvement was never being written.

**Bug 2 — Tax Year written on Tax ID path**
`Input_246` (Tax Year) was being written unconditionally. On Tax ID path it is pre-populated from the tax record and must not be overwritten. Fix: moved inside `path === "new"` block.

**Bug 3 — Assd Improvement never written on Tax ID path**
`Input_248` was not in the bookmarklet at all (wrong ID in original extraction). Fix: added unconditional write of `"0"` gated behind `isLennar` flag (see item 3).

**3. isLennar flag — new pattern introduced**

Non-Lennar listings are always Tax ID path and have Assd Improvement pre-populated from the tax record — it must not be touched. Lennar new construction never has a pre-populated Assd Improvement on either path.

Solution: top-level `"lennar": true` key added to all Lennar payloads. Bookmarklet reads `payload.lennar === true` as `isLennar` flag and gates the Assd Improvement write behind it. Non-Lennar payloads omit the key entirely — field is skipped.

Pattern is extensible: any future field with Lennar-vs-non-Lennar behavioral difference uses the same flag.

**4. Cursor handoffs produced and committed**

Four handoffs produced and committed this session:

| Handoff | Target | Changes |
|---|---|---|
| `HANDOFF-2026-06-26-general-info-source.md` | `docs/Lennar_MLS_Bookmarklet_Source.md` | Fix Input_246/248 swap; Tax Year to New path block; isLennar flag; Assd Improvement gated write |
| `HANDOFF-2026-06-26-general-info-launcher.md` | `bookmarklets/lennar_general_info.html` | Sync minified JS with source; update static-note and warning divs |
| `HANDOFF-2026-06-26-protocol-style-rule.md` | `docs/Lennar_New_Listing_Protocol.md` | Add features.style payload rule; add lennar flag requirement (committed via direct Cursor prompt due to sync issue — see item 5) |
| `HANDOFF-2026-06-26-non-lennar-payload-schema.md` | `docs/Non_Lennar_Payload_Schema.md` | New stub doc — non-Lennar payload schema with key behavioral distinctions documented |

**5. Project knowledge sync issue identified**

Protocol handoff (item 4, third row) failed twice because find strings written against the project knowledge copy of `Lennar_New_Listing_Protocol.md` did not match the actual repo file. The project knowledge copy was behind v2.0 (committed earlier in Session 015). Andrew uploaded the live file from GitHub mid-session; Cursor prompt was rewritten against real content and succeeded.

**Root cause:** Project knowledge is not auto-synced with repo commits. Any session that produces a handoff against a file that was also updated in the same or recent session is at risk of this mismatch.

**Mitigation going forward:** For files that have been recently updated, Andrew uploads the current version from GitHub before Claude writes find strings against them.

**6. General Info bookmarklet — confirmed passing**

After new bookmarklet installed in Chrome, re-tested against 8752 Whitman Tax ID path with minimal payload:
```json
{ "lennar": true, "path": "tax_id" }
```
Result: Tax Year held pre-populated value (2026), Assd Improvement correctly wrote `"0"`. Full pass.

---

### Key Decisions

- `isLennar` flag pattern (`payload.lennar === true`) is the standard mechanism for Lennar-vs-non-Lennar behavioral branching in all bookmarklets going forward
- Non-Lennar payloads omit `"lennar"` key entirely — do not include `"lennar": false`
- `features.style` must always be populated in session payload output — never left as `[]`
- Townhouse → `["Input_541_19"]`; SF style values confirmed from field map as they come up
- General Info minimal payload on Tax ID path is `{ "lennar": true, "path": "tax_id" }` — no `general` key needed; Acres is pre-populated and skipped
- Project knowledge sync is a known risk — upload live file from GitHub when writing find strings against recently-modified files

---

### Items Closed This Session

- General Info bookmarklet Input_246/248 swap — fixed and confirmed
- General Info Tax Year overwrite on Tax ID path — fixed and confirmed
- General Info Assd Improvement not writing on Tax ID path — fixed and confirmed
- features.style always-empty gap — protocol rule added

---

### Cursor Handoffs Produced This Session

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-06-26-general-info-source.md` | General Info source file fixes |
| `HANDOFF-2026-06-26-general-info-launcher.md` | General Info launcher HTML sync |
| `HANDOFF-2026-06-26-protocol-style-rule.md` | Protocol — style rule + lennar flag (committed via direct Cursor prompt) |
| `HANDOFF-2026-06-26-non-lennar-payload-schema.md` | New non-Lennar payload schema stub |
| `HANDOFF-2026-06-26-session-log-016.md` | This entry |

---

### Key References

| Item | Value |
|---|---|
| Bookmarklet Source File | `AAR-TC-LENNAR-BM-SRC-001` (`docs/Lennar_MLS_Bookmarklet_Source.md`) |
| Features Field Map | `AAR-TC-LENNAR-BM-001-FEA` (`docs/Lennar_MLS_Features_Field_Map.md`) |
| Full Payload Schema | `AAR-TC-LENNAR-BM-SCH-001` (`Lennar_Features_Payload_Schema.md`) |
| Non-Lennar Payload Schema | `AAR-TC-NONLENNAR-PL-001` (`docs/Non_Lennar_Payload_Schema.md`) |
| Lennar New Listing Protocol | `AAR-TC-LENNAR-PROTO-001` (`Lennar_New_Listing_Protocol.md`) |
| Google Sheet ID | `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Google Drive — Properties folder | `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |

---

## Session 017 — June 27, 2026

**Focus:** Repo restructure — universal CVRMLS / Lennar implementation layer separation; doc splits across all major bookmarklet docs

---

### What Was Done

**Repo file structure review and restructure**

Full file tree reviewed via Cursor. The `/docs` folder had grown to 20 flat files covering unrelated concerns with no organization. A two-layer directory structure was established and committed:

- `docs/cvrmls/` — universal CVRMLS Matrix docs (field maps, source JS, build roadmap, payload schema). MLS-specific, not builder-specific. The deployable package layer.
- `docs/lennar/` — Lennar implementation layer (customization docs, community lookup tables, builder statics, listing protocol). References the CVRMLS layer as its base.
- `docs/connector/` — Aframe connector technical reference, tool roadmap, API reference subdirectory
- `docs/protocols/` — session and workflow protocols (buyer-side, general ops, cursor handoff, extraction procedure, Gmail-to-Aframe, transaction workflows)
- `docs/project/` — project vision, session log, pre-automation notes

Bookmarklet files renamed — `lennar_` prefix dropped from all generic Matrix tab launchers. `lennar_features.html` kept as-is (genuinely Lennar-specific). Three stray root-level handoff files moved to `handoffs/applied/`.

**Vision articulated and captured**

The bookmarklet system is a universal CVRMLS Matrix data-entry toolkit — Lennar was the proving ground but the core belongs to any agent or TC working CVRMLS listings. The architecture is designed to extend:

- Additional MLS systems (`docs/rein/`, `docs/bright/`, `docs/caar/`) follow the same pattern as `docs/cvrmls/` — each gets its own field maps, source file, and build doc
- Additional builders follow the same pattern as `docs/lennar/` — each gets its own subfolder with community tables, statics, and customization docs referencing the relevant MLS layer
- The Chrome extension (future state) uses `payload.mls` and `payload.builder` header keys to route to the right field map and customization layer automatically
- The universal package is what gets zipped and handed to another agent or TC — no Lennar or AAR-TC-specific content in it

**Doc splits — four files retired, eight new files created**

Each major doc was split into a universal CVRMLS file and a Lennar-specific file. The separation rule: if it's a Matrix field ID, option value, or CVRMLS behavioral note → CVRMLS doc. If it's a hardcoded Lennar value, community lookup table, or Lennar operational note → Lennar doc.

| Retired | Replaced By |
|---|---|
| `Lennar_MLS_Bookmarklet_Source.md` | `docs/cvrmls/CVRMLS_Bookmarklet_Source.md` + `docs/lennar/Lennar_Bookmarklet_Customization.md` |
| `Lennar_MLS_Bookmarklet_Build.md` | `docs/cvrmls/CVRMLS_Bookmarklet_Build.md` + `docs/lennar/Lennar_Bookmarklet_Build_Notes.md` |
| `Lennar_MLS_Features_Field_Map.md` | `docs/cvrmls/CVRMLS_Features_Field_Map.md` (Lennar schema is the Lennar authority — no separate Lennar field map needed) |
| `Non_Lennar_Payload_Schema.md` | `docs/cvrmls/CVRMLS_Payload_Schema.md` (correctly reframed as universal baseline) |

Key decisions made during the split work:
- The universal source file uses "Universal Variant" instead of "Non-Lennar Variant" throughout — the non-Lennar variant is the canonical base; Lennar adds on top
- The Lennar customization doc lists what Lennar does — if a field isn't listed, skip it. No redundant skip lists.
- The Features field map is pure Matrix reference (Input IDs and option values only). The Lennar Features Payload Schema (`AAR-TC-LENNAR-BM-SCH-001`) is the Lennar authority for Features — a separate Lennar Features field map is redundant.
- The `Non_Lennar_Payload_Schema.md` was actually the universal CVRMLS baseline all along — renamed and reframed accordingly as `CVRMLS_Payload_Schema.md` (`AAR-TC-CVRMLS-PL-001`)

**New document IDs established**

| Document | New ID |
|---|---|
| `CVRMLS_Bookmarklet_Source.md` | `AAR-TC-CVRMLS-BM-SRC-001` |
| `CVRMLS_Bookmarklet_Build.md` | `AAR-TC-CVRMLS-BM-001` |
| `CVRMLS_Features_Field_Map.md` | `AAR-TC-CVRMLS-BM-001-FEA` |
| `CVRMLS_Payload_Schema.md` | `AAR-TC-CVRMLS-PL-001` |
| `Lennar_Bookmarklet_Customization.md` | `AAR-TC-LENNAR-BM-CUST-001` |
| `Lennar_Bookmarklet_Build_Notes.md` | `AAR-TC-LENNAR-BM-NOTES-001` |

**Gap identified — Lennar New Listing Protocol stale on Features**

The Lennar New Listing Protocol references Features statics that don't match the confirmed values in `Lennar_Features_Payload_Schema.md` (v1.1, confirmed via live testing 2026-06-26). The schema is the authority. Protocol needs a patch handoff — carry to Session 018 before any Features build work.

---

### Cursor Handoffs Produced This Session

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-06-26-repo-restructure.md` | Repo directory restructure — new `docs/` subdirs, bookmarklet renames, root handoff cleanup |
| `HANDOFF-2026-06-27-source-file-split.md` | Add `CVRMLS_Bookmarklet_Source.md` + `Lennar_Bookmarklet_Customization.md`; retire `Lennar_MLS_Bookmarklet_Source.md` |
| `HANDOFF-2026-06-27-build-doc-split.md` | Add `CVRMLS_Bookmarklet_Build.md` + `Lennar_Bookmarklet_Build_Notes.md`; retire `Lennar_MLS_Bookmarklet_Build.md` |
| `HANDOFF-2026-06-27-features-field-map-split.md` | Add `CVRMLS_Features_Field_Map.md`; retire `Lennar_MLS_Features_Field_Map.md` |
| `HANDOFF-2026-06-27-payload-schema-restructure.md` | Add `CVRMLS_Payload_Schema.md`; retire `Non_Lennar_Payload_Schema.md`; update refs in Lennar schema |
| `HANDOFF-2026-06-27-session-log-017.md` | This entry |

---

### Documents Created This Session

| Document | ID | Location |
|---|---|---|
| `CVRMLS_Bookmarklet_Source.md` | `AAR-TC-CVRMLS-BM-SRC-001` | `docs/cvrmls/` |
| `CVRMLS_Bookmarklet_Build.md` | `AAR-TC-CVRMLS-BM-001` | `docs/cvrmls/` |
| `CVRMLS_Features_Field_Map.md` | `AAR-TC-CVRMLS-BM-001-FEA` | `docs/cvrmls/` |
| `CVRMLS_Payload_Schema.md` | `AAR-TC-CVRMLS-PL-001` | `docs/cvrmls/` |
| `Lennar_Bookmarklet_Customization.md` | `AAR-TC-LENNAR-BM-CUST-001` | `docs/lennar/` |
| `Lennar_Bookmarklet_Build_Notes.md` | `AAR-TC-LENNAR-BM-NOTES-001` | `docs/lennar/` |

### Documents Retired This Session

| Document | Reason |
|---|---|
| `Lennar_MLS_Bookmarklet_Source.md` | Split into CVRMLS universal + Lennar customization |
| `Lennar_MLS_Bookmarklet_Build.md` | Split into CVRMLS universal + Lennar build notes |
| `Lennar_MLS_Features_Field_Map.md` | Replaced by CVRMLS field map + Lennar schema doc |
| `Non_Lennar_Payload_Schema.md` | Renamed and reframed as `CVRMLS_Payload_Schema.md` |

---

### Open Items Carried Forward

- **Lennar New Listing Protocol — Features statics patch** — protocol is stale vs confirmed schema; patch handoff needed before any Features build work in Session 018
- **Street Suffix stored values (`Input_37`)** — Session 017 agenda item 2; not reached
- **County/City cascade confirmation** — Session 017 agenda item 3; not reached
- **Listing Info bookmarklet — New path + non-Lennar variant** — Session 017 agenda item 4; not reached
- **Features A + B smoke tests** — non-Lennar Features launchers not yet tested in live Matrix session
- **Promote `list_transaction_events` Tier 4 → Tier 3** in `CONNECTOR-ROAD-001`
- **Megan Cook onboarding 6/30** — sales rep roster by community pending
- **Bethanne Elamghari agent profile** — fill as files come in
- **Seller-Side Contract Update Protocol** — planned, not created
- **Photo sorter POC** — `AAR-TC-LENNAR-PHOTO-001`
- **Reverse Prospecting workflow**
- **`f_HOAtruefalse` merge field** — possible duplicate of `f_HOA`; investigate
- **Non-Lennar bookmarklet builds** — Features A + B are the only non-Lennar launchers built; remaining tabs still need non-Lennar variants
- **Room Info launcher** — non-Lennar only; REPEAT0 open question still unresolved
- **Features A + B launchers** — confirm committed to `bookmarklets/` in repo
- **Cross-reference audit** — internal doc references throughout the repo now point to old paths from before the restructure; low priority but should be swept before external sharing

---

### Key Decisions (Session 017)

- Bookmarklet system is a universal CVRMLS toolkit — Lennar is one implementation on top of it
- Architecture is MLS-scoped, not builder-scoped — future MLS systems get their own `docs/[mls]/` layer; builders get their own `docs/[builder]/` layer referencing the relevant MLS layer
- Chrome extension future state uses `payload.mls` + `payload.builder` header keys to route to the correct field map and customization layer
- Universal package = zip file deployable by any CVRMLS agent or TC — no AAR-TC or Lennar content in it
- Lennar Features Payload Schema (`AAR-TC-LENNAR-BM-SCH-001`) is the Lennar Features authority — separate Lennar Features field map is redundant; dropped
- `Non_Lennar_Payload_Schema.md` was always the universal baseline — correctly renamed `CVRMLS_Payload_Schema.md`
- Cross-reference debt from the restructure is known and accepted — sweep when approaching external sharing milestone

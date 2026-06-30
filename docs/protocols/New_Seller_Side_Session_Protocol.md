---
title: New Seller Side Session Protocol
document_id: AAR-TC-SELLER-PROTO-001
version: 0.4
version_date: 2026-06-29
status: Draft — MLS Data Input section only; remaining sections pending
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Transaction Services
---

# New Seller Side Session Protocol
### AAR-TC Transaction Services | Document ID: AAR-TC-SELLER-PROTO-001

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 0.1 | 2026-06-29 | Andrew Rich / Claude | Initial draft — MLS Data Input section scoped; land listing stub added; remaining protocol sections placeholder only |
| 0.2 | 2026-06-29 | Andrew Rich / Claude | Service tiers added; Incomplete status as Phase 1 landing point; two-payload model clarified; automation scope boundary documented; strategic context note added |
| 0.3 | 2026-06-29 | Andrew Rich / Claude | Showing instruction defaults locked in; co-list agent rule and current assignments added; Tax ID path pre-populated fields confirmed via live Matrix entry; sqft confirmed blank on Tax ID path — bookmarklet writes from tax record; street suffix confirmed pre-populated; subdivision and post office confirmed manual-only |
| 0.4 | 2026-06-29 | Andrew Rich / Claude | Seller name verification check added to Step 2 — session surfaces tax record owner names and confirms accuracy before payload; covers LLC/investor overrides and unexpected deed names; aligns with existing Aframe verification task |

---

## Document Scope — This Version

This version covers the **MLS data input** portion of the seller-side session workflow only — data sources, session flow, payload generation, and listing variants. The following sections are planned but not yet written:

- Aframe transaction creation
- Gmail labeling and Drive folder setup
- Transaction Desk / addendum workflow
- Photo coordination
- Closing and status management

---

## Reference Documents

| Document | ID | Purpose |
|---|---|---|
| CVRMLS Bookmarklet Build | AAR-TC-CVRMLS-BM-001 | Universal field maps and architecture |
| CVRMLS Bookmarklet Source | AAR-TC-CVRMLS-BM-SRC-001 | Universal JS source — all tab variants |
| CVRMLS Payload Schema | AAR-TC-CVRMLS-PL-001 | Universal payload schema baseline |
| CVRMLS County/City Reference | AAR-TC-CVRMLS-CC-001 | Jurisdiction stored values, Area, schools |
| Cursor Handoff Protocol | CURSOR-HANDOFF-PROTOCOL-001 | Handoff format and commit process |

---

## Service Tiers

Two service tiers are offered for standard seller-side listings. The bookmarklet payload workflow is the same for both — the difference is what surrounds it.

| Tier | Fee | MLS Data Input | Listing Docs | Remarks | Coordination |
|---|---|---|---|---|---|
| **Data Input Only** | $100 | Yes — Phase 1 + Phase 2 as needed | Agent handles | Agent writes own | Agent handles |
| **Full Listing Management** | $200 | Yes — Phase 1 + Phase 2 as needed | Andrew drafts and sends for signature | Andrew drafts (where applicable) | Andrew coordinates with sellers and photographer |

**Remarks note:** Remarks are drafted in-session only for Full Listing Management clients where Andrew is responsible for them. Currently this applies to Liz Brown listings only. Gary Martin and Kelly Painschab write their own for all listings regardless of tier.

**Automation scope boundary:** The bookmarklet system handles bulk MLS field entry — Phase 1 and Phase 2 payloads. Minor tweaks, photo uploads, showing instruction adjustments, status changes, and remarks entry remain manual. This is intentional. The goal is not full automation of every listing scenario but elimination of the most time-consuming mechanical data entry. Standard listings, particularly Full Listing Management, will always carry coordination overhead that cannot be automated.

**Strategic note:** The standard listing service is maintained for existing agent relationships. The primary area of growth and automation investment is builder new construction listing services, where the workflow is predictable, repeatable, and volume-driven. Standard listing automation improvements are additive, not the core focus.

---

## Listing Variants

Three listing modes exist. The mode determines what is required before MLS activation and how the session is structured.

| Mode | Description | Features Required | Remarks Required |
|---|---|---|---|
| **Full** | Standard resale — old MLS sheet available; complete data entry | Yes | Agent writes own; or drafted in session |
| **Coming Soon** | Agent-requested status; details may follow after initial input | Partial OK | Can follow later |
| **Investor / Minimal** | No features required; bare or no remarks | No | Optional |

The session must confirm the listing mode at the start based on the Cognito intake form and agent context before any data work begins.

---

## Data Sources

Standard seller-side listings use up to four data sources. Not all are always present.

### Tier 1 — Realist Tax Record (Always Present)

The tax record is always available and always drives the Matrix entry path. It provides:

- PID / Tax ID
- Full address (street number, name, suffix, city, zip)
- Legal description
- Assessed values — Total, Land, Improved
- Tax year and annual taxes
- Lot acres
- Owner name(s)
- Year built (confirm against old MLS sheet if available)

**Entry path:** Tax ID path — always for standard listings. Matrix pre-populates a significant number of fields from the tax record. See Tax ID Path — Confirmed Pre-Populated Fields section.

### Tier 2 — Old MLS Sheet (Usually Present for Resales)

When available, the old MLS sheet provides the bulk of listing content. The following fields map directly to Matrix and are used in the session payload:

**Used — maps to Matrix:**
- Listing info: type, attached Y/N, area, subdivision, schools, sqft (all four fields), sqft source
- Bath counts and level descriptions
- Features: all checkbox groups and selects — style, structure, siding, roof, flooring, heating, heat fuel, cooling, water heater, attic, parking, interior, exterior, appliances, pool, community amenities, water, sewer, lot desc, etc.
- Room dimensions and levels
- General info: acres (cross-check against tax record), waterfront, lot desc, body of water, lot dimensions
- Fee info: HOA Y/N, fee amount, fee period, management firm, fee description, fee includes

**Not used — unique to the old listing:**
- Seller / owner names — comes from tax record and Cognito form only
- Remarks and agent comments — separate process; old remarks may be reference material for drafting new ones but are never carried forward directly
- Showing instructions — unique to new listing; set per agent preference and vacancy status
- Lockbox info — set fresh for new listing
- List agent / office — always current agent
- Sold data, price history, days on market

### Tier 3 — Supplemental Input (When Available)

Fills the gap between the old sheet and the current state of the property. Sources vary and may arrive after initial MLS input:

- **Seller or agent email/notes** — improvements, upgrades, added features not on the old sheet (new HVAC, tankless water heater, added deck, etc.)
- **Photos** — used to verify and add features after initial input; commonly catches recessed lighting, double vanities, cooking type (smooth top vs. gas), flooring details. Also used to populate room description fields (floor type, closet, ceiling fan, ensuite notes).

### Tier 4 — Cognito Intake Form (Aframe / Session Trigger)

The AAR-TC New Listing Intake Form (Form ID 11) triggers the session and drives Aframe file creation. Its role in the MLS payload is limited:

- **List price** — present when decided; often not final at intake. Reference from Aframe when needed for payload. Price is not a blocking field — listing can be entered without it and updated later.
- **Coming Soon flag and date** — determines listing mode
- **Anticipated list date** — context only
- **Agent name** — session context; also drives agent profile lookup
- **Lockbox type** — used for Showing Instructions tab
- **HOA flag** — cross-check against old MLS sheet
- **Vacancy status** — determines Showing Instr 2 default (see Showing Instructions Defaults)

The Cognito form is **not a direct payload source**. It is processed before MLS input as part of Aframe setup. All MLS data comes from Tiers 1–3.

---

## Session Workflow — Standard Listing (Full Mode)

### Step 1 — Confirm Listing Mode and Agent Profile

Before any data work begins, confirm:
- Which mode: Full, Coming Soon, or Investor/Minimal
- Which data sources are available (Tier 1 always; Tier 2 and 3 may be absent or partial)
- Whether remarks are being written in-session or by the agent separately
- Agent profile: service tier, co-list agent (if any), any agent-specific flags
- Vacancy status from Cognito form — drives Showing Instr 2 default

### Step 2 — Parse Sources and Present Data Sheet

Parse all available sources and present a clean MLS data sheet for review before generating any payload. The data sheet covers all Matrix tabs in order.

**Flag for review:**
- Any field where Tier 2 and Tier 1 conflict (e.g. acres on old MLS sheet vs. tax record — tax record wins unless there is a known discrepancy)
- Any feature that may have changed since the old MLS sheet (flag for Tier 3 confirmation)
- Any field that cannot be populated from available sources (mark as pending)
- Year built discrepancies between sources
- Whether a co-list agent applies — if unclear, ask before proceeding
- **Seller name verification (every listing):** Surface the owner names from the tax record and confirm with the agent — *"The deed shows [Name 1] and [Name 2] — does this look correct, or does the seller name need to be updated?"* This catches LLC/investor overrides (e.g. a client whose properties are held in a business name) and unexpected names on the deed the agent may not be aware of (spouse, family member, estate). Seller name verification is also an Aframe task; the session surfaces it here so it is caught before payload generation rather than after MLS entry. If confirmed correct, owner names are left as pre-filled by Matrix from the tax record and omitted from the payload. If an override is needed, the corrected names go into the payload and the bookmarklet writes them.

**Confirmation gate:** Andrew reviews and confirms the data sheet before any payload is generated. No exceptions.

### Step 3 — Generate Phase 1 Payload

After confirmation, generate the full JSON payload for all bookmarklet tabs. Fields that are pending or unconfirmed are omitted or flagged with a `// PENDING` comment inline.

Phase 1 payload covers everything confirmed from Tier 1 and Tier 2. Remarks are not expected at this stage for most listings and are not a blocking field.

**Phase 1 is the primary payload.** It covers the structural listing data that is stable and unlikely to change — listing info, room info, bath info, general info, fee info, owner info. This is where the bulk of the time savings comes from.

### Step 4 — MLS Input

Andrew runs the bookmarklets against the Tax ID path listing in Matrix. Tab order follows the standard bookmarklet sequence. Map, Directions, Subdivision, and Post Office fields are always manual.

**The listing lands in Incomplete status after Phase 1 input.** It stays there until Andrew or the agent switches it to Coming Soon or Active. This is the standard landing point — no listing goes live automatically from a Phase 1 session.

### Step 5 — Phase 2 Payload (Features Update)

Phase 2 is a targeted Features-tab update triggered when Tier 3 input arrives — seller/agent notes describing improvements, or photo review that surfaces additional or corrected features. It is not a full re-entry.

Phase 2 is expected but not always required. When it happens, the same confirmation gate applies — updated data presented and confirmed before payload is generated.

**Phase 2 scope is intentionally narrow:** Features tab only in most cases. Anything else — minor field corrections, showing instruction updates, remarks — Andrew or the agent handles manually in Matrix. The session is not opened for small one-field changes.

---

## Session Workflow — Coming Soon Mode

Same as Full Mode through Step 2, with the following differences:

- Coming Soon status is set manually by Andrew in Matrix — not automated
- Remarks and full features are not required before activation to Coming Soon
- Phase 1 payload covers all confirmed fields; remarks and pending features are deferred to Phase 2
- Phase 2 is expected and planned — note the anticipated timing in the session

---

## Session Workflow — Investor / Minimal Mode

- Features tab: skipped or minimal — confirm with agent which fields if any are needed
- Remarks: bare minimum or skipped per agent preference
- Payload is lighter; session is shorter
- No Phase 2 expected unless agent requests additions later

---

## Remarks Ownership

Remarks are never auto-generated without instruction. Ownership by agent:

| Agent | Remarks Handling |
|---|---|
| Gary Martin | Writes own — deliver to Andrew when ready |
| Kelly Painschab | Writes own — or skips for investor listings |
| Liz Brown | Drafted in session — separate project with style reference |
| Others | Confirm at session start |

Old remarks from a prior MLS sheet may be used as reference material for drafting new remarks, but are never carried forward verbatim. Drafting new remarks from old ones is a separate step, not part of the payload workflow.

---

## Showing Instructions Defaults

Standard defaults apply to all non-Lennar listings unless the agent profile specifies otherwise.

| Field | Default | Condition |
|---|---|---|
| Showing Instr 1 | Appt. Required (checked) | Always |
| Showing Instr 2 | LB Use Online Showing Service (`NLCS`) | Default |
| Showing Instr 2 | LB Go Direct (`LBGD`) | Vacant property — confirmed on Cognito intake form |
| Lockbox Type | Sentrilock | Always |
| Sentrilock Serial # | From agent / intake | Manual — enter when known |

Vacancy status is read from the Cognito intake form at session start. If vacant, Showing Instr 2 switches to LB Go Direct automatically.

---

## Agent/Office Info — Session Rules

Agent/Office Info tab behavior is driven by the agent profile, not the old MLS sheet. The old listing's agent and office info is never carried forward.

| Field | Source | Notes |
|---|---|---|
| List Agent Code (`Input_159`) | Pre-filled by Matrix | Never touch |
| Co-List Agent Code (`Input_170`) | Agent profile | Blank if no co-agent; write code when agent profile specifies one |
| Type (`Input_163`) | Standard: `ER` (Exclusive Right) | Lennar uses `MO` — not applicable here |
| Limited Rep (`Input_164`) | Standard: `0` (No) | Lennar uses `1` — not applicable here |

**Co-list agent rule:** An agent may have a standing co-list agent that is added to every listing. This is a property of the agent relationship and is documented in the agent profile. Confirm whether a co-list agent applies at session start, before payload creation. If there is any ambiguity — always ask.

---

## Field Source Mapping Summary

| Matrix Tab | Primary Source | Notes |
|---|---|---|
| Listing Info | Tier 2 (old MLS) + Tier 1 (tax record for pre-populated fields) | See Tax ID path pre-populated fields section |
| Room Info | Tier 2 (old MLS) | Dimensions, level, room type, description |
| Bath Info | Tier 2 (old MLS) | Counts and level descriptions |
| Features | Tier 2 (old MLS) + Tier 3 (supplemental/photos) | Most complete source; Tier 3 fills gaps and updates |
| General Info | Tier 1 (tax record) + Tier 2 (old MLS) | Acres, legal, assessed values from tax record; waterfront, lot desc from old MLS |
| Remarks | Agent-written or session-drafted per agent preference | Never from old MLS sheet directly |
| Fee Info | Tier 2 (old MLS) + Tier 4 (Cognito HOA flag) | Cross-check HOA between sources |
| Owner Info | Tier 1 (tax record) | Pre-populated by Matrix on Tax ID path — confirm accuracy |
| Agent/Office Info | Agent profile | Never from old MLS sheet; co-list code from agent profile |
| Showing Instructions | Defaults + Tier 4 (vacancy status, lockbox type) | Set fresh — never from old listing |
| Virtual Tour Info | Tier 3 (agent provides URL) | Skip tab if none provided |
| Internet Display Info | Always static — all Yes | No payload key needed |

---

## Tax ID Path — Confirmed Pre-Populated Fields

Confirmed via live Matrix entry on 2026-06-29 (4508 Ridgecrest Ln, Colonial Heights). These fields are pre-populated by Matrix on Tax ID path and are skipped by the bookmarklet.

**Listing Info tab:**
- County/City, Address (street number + name), ZIP, State
- Year Built, Rooms, Levels, Bedrooms, Lot
- Street Suffix (confirmed populated from tax record)

**General Info tab:**
- PID, Acres, Total Assessment, Annual Taxes, Legal Description, Basement/Found

**Owner Info tab:**
- Owner Name, Owner Name 2 (from tax record ownership data)

**Confirmed blank on Tax ID path — bookmarklet writes:**
- Area, Post Office (manual — too many options to map), Subdivision (manual)
- Schools (all three)
- Sqft fields — all four fields and Sqft Source confirmed blank; bookmarklet writes from tax record data; source always `Per Tax`
- List Price, List Date, Type, Attached Y/N, New/Resale, Delayed Show, Expire Date, Year Built Desc
- Street Direction (blank if none)

---

## Land Listing Path

*(Stub — to be fully defined in a future session)*

Land listings use a subset of the standard Matrix tabs and have different field requirements. The overall session structure (data sources, confirmation gate, payload flow) is the same.

**Differences from standard residential path:**

- Fewer Matrix tabs required — Room Info, Bath Info, and most Features fields do not apply
- Listing Info tab has land-specific fields (lot size, frontage, acreage) that differ from residential
- General Info tab is the primary data tab for land — legal description, acres, lot dimensions, body of water, waterfront are all more prominent
- Features tab is a smaller, different subset — relevant fields TBD during land bookmarklet build
- Remarks are land-specific; no room or feature descriptions

**Data sources for land listings:**

- Tier 1 (tax record) is even more important — often the primary source since no old MLS sheet exists
- Tier 2 (old MLS sheet) when available — land MLS sheets are structurally different from residential
- Tier 3 (agent/seller notes) — lot characteristics, utilities at street, easements, access

**Entry path:** Tax ID path — same as standard residential. Tax records exist for land parcels.

*Full land listing tab field map, payload schema, and bookmarklet build to be documented when land listing workflow is active.*

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Seller-side session protocol — MLS data input section. Additional workflow sections to follow.*
*This is a living document. Update version history and version_date with each revision.*

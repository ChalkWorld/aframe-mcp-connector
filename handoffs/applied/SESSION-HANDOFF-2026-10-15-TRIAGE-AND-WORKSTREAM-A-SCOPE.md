---
title: Session Handoff — Triage + Phase 4 re-scope + Workstream A pre-scoping
document_id: SESSION-HANDOFF-2026-10-15-TRIAGE-AND-WORKSTREAM-A-SCOPE
date_range: 2026-10-15 (single-day)
project: AAR-TC Lennar Operational Project
related: FOUND-PHASE-TRACKER-001 (v0.20), SESSION-HANDOFF-2026-10-14-PHASE-3A1-SHEETS-WRITE-LIVE.md, HANDOFF-2026-10-15-prep-polish.md
---

# Session Handoff — Triage + Phase 4 re-scope + Workstream A pre-scoping
### AAR-TC Lennar Operational Project | 2026-10-15

Full session detail. v0.19 wrapped with "no clearly-burning next priority"; this session opened on triage of the parked queue, pivoted mid-session into a Phase 4 strategic re-scope driven by the operator's business-dev lens, pre-scoped Workstream A (multi-builder architecture) end-to-end so next session can kick it off cleanly, shipped two polish fixes (Sheet-row suffix abbreviation + Gmail banner attempt), and surfaced a wrong recommendation that's worth capturing explicitly: Gmail's self-send heuristic normalizes sub-addressing before comparing From/To, so plus-aliasing doesn't suppress the banner on Gmail-to-Gmail mail. The strategic re-scope is the substantive output of the session — Phase 4's prior scope was dominated by doc housekeeping that the operator doesn't need, while the actual next unlock for scaling the business (multi-builder support) was buried. Referenced from `Lennar_Restructure_Phase_Tracker.md` v0.20. Read the tracker first — this doc is the supporting detail.

---

## What happened this session

1. **Session opened on triage per v0.19's "no clearly-burning next priority" wrap.** Starting state inventory: Gmail banner mitigation still TBD after v0.18's filter attempt, Property Type orphan options cleanup still open, Payload Rules table description paste still blocked via API. Short-sprint plan sketched (Gmail banner + Property Type cleanup + table description paste + CURSOR-HANDOFF-PROTOCOL-001 refresh note = 30 minutes of parked-item cleanup) but didn't ship as proposed. Operator pivoted the session into deeper discussions as the parked items got surfaced one by one.

2. **Airtable Field Options flattening scoped and parked with an explicit trigger.** v0.7's "parallel proposal in flight to flatten Field Options" surfaced in the parked-queue walkthrough as a one-line reference, never captured as its own item. Operator produced the September 15 standalone proposal doc (`AAR-TC-CVRMLS-FIELDOPTS-PROPOSAL-001`); session reviewed against current state. Original trigger (free-tier record cap) is no longer live — operator upgraded Airtable to paid tier at some point before this session, confirmed via the 2026-10-15 Airtable invoice ($24 Team plan monthly) in the operator's inbox. Current record counts verified live via `analyze_table`: CVRMLS Matrix Fields base at 1,531 records (Field Options alone 1,080; over the 1k free cap), Lennar base well under cap. Session-wide project perspective settled: Field Options is live reference material for three distinct consumers (Phase 1 Lennar script = no runtime read; future builder script authoring = one-time lookup per field; standard-listing session work = targeted per-field lookup per listing). Flattening preserves all three use cases; Cascade Options stays structured because standard-listing session work queries it per-jurisdiction. **Updated recommendation: Option B from the proposal (flatten Field Options, rewrite Cascade Options' Cascade Condition link to plain-text column) remains correct, but tie the migration to a real forcing function rather than doing it now** — do it when a second builder gets added (Workstream A), so the second builder's base is Free-tier-compatible from day one. Standalone Field Options flattening is removed from the parked queue; the migration is now a known-shape step inside Workstream A.

3. **Standard-listing protocol (`New_Seller_Side_Session_Protocol.md`) reviewed and confirmed as stays-as-is.** v0.5 (2026-07-15, MLS Data Input section only). Doc has four classes of dated content: (1) one live bug — Showing Instr 2 vacant code `LBGD` doesn't exist (real code is `LGD`, confirmed in v0.6's extraction pass); (2) retired terminology throughout — "bookmarklet" references point at an architecture that was superseded by the Chrome extension; (3) no Airtable awareness — doc's reference layer is entirely md files (`CVRMLS Payload Schema`, `CVRMLS County/City Reference`, `CVRMLS_Features_Field_Map.md`), pre-dating the Airtable base's existence; (4) terminology collision risk — doc's "Phase 1/Phase 2" refer to per-listing payload stages, Lennar restructure uses "Phase 0/1/2/3/4" at project level. Operator confirmed the doc won't be used until it's overhauled, and the overhaul is not a current priority: standard-listing volume is low, operator does these by hand efficiently, no agent-side pressure to scale. **The old operational project is retired in the operator's working mind.** Removed from the active parked queue; parked indefinitely with no trigger. If standard-listing session work ever gets re-activated, the doc overhaul becomes the first step then — not before.

4. **Phase 4 re-scoped from four housekeeping items to three workstreams, driven by the "scale builders" business-dev lens.** Operator articulated the forward move: builder listing input work (Lennar today, N builders ahead) is where AAR-TC growth lives; standard-listing TC work is maintenance mode. Phase 4's prior scope — retire operational-session behavior from Project Protocol, reshape New Listing Protocol as how-to reference, close SOP stubs, archive Airtable Lennar Listings table — was dominated by housekeeping the operator doesn't need. The real unlock to walk into business-dev conversations with confidence is proving the infrastructure handles builder #2, #3, #N as a configuration exercise rather than a repeat of the Lennar engineering effort. Session re-scoped Phase 4 into three workstreams:
   - **Workstream A — Multi-builder architecture.** The real priority. Script, extension, Railway environment, and Airtable layer all currently assume "one builder." Builder dispatch becomes explicit. Must happen before builder #2 ships. 2-3 session scope. See Workstream A pre-scoping below.
   - **Workstream B — Builder-onboarding runbook.** The written artifact that lets the operator (or a future helper) add a new builder in a defined, bounded amount of session work. Captures the Lennar pattern as a repeatable template. One doc-heavy session.
   - **Workstream C — Housekeeping.** The original Phase 4 scope: retire old operational docs, archive Airtable Lennar Listings table, close SOP stubs, mark operational-session docs as archival, author the three remaining foundation docs (base schema specification, maintenance protocol, builder-onboarding protocol). Deferred — no business-dev value, land it when a specific item forces it.
   
   Base schema specification + builder-onboarding protocol (two of Workstream C's foundation docs) fold naturally into Workstream B — they ARE the builder-onboarding runbook when written. Maintenance protocol stays in C.

5. **Workstream A kickoff pre-scoped — 6 of 7 shape questions settled by operator at session midpoint, Q4 settled by Claude.** Same session-opening-decision style as Phase 1 (v0.13), Phase 2 (v0.16), Phase 3 (v0.18) kickoffs:
   - **Q1 Builder dispatch mechanism.** Extension gets a builder dropdown; selection drives which Cognito form the picker queries. Single source of truth for "which builder" — extension-side selection, propagates downstream.
   - **Q2 Cognito form structure.** Each builder gets its own custom form. No shared form with a builder select field. Clean separation; operator can tune each builder's form independently.
   - **Q3 Airtable base structure.** One base per builder. Some redundancy (duplicated Source Types enum, etc.) accepted as the cost of clean per-builder separation.
   - **Q4 Builder concept in script dispatcher.** Config-driven registry pattern. The `/generate` endpoint takes `{entry_id, builder}` (or infers builder from `entry_id`'s form ID). Script loads a per-builder config at startup — base ID, form ID, community resolver, Drive folder root — and the dispatcher's existing per-rule logic doesn't change. Registry is probably a dict in a config file (or an Airtable table of its own, if operator wants it editable without a code push). Not inline `if builder == "lennar"` branches, not full per-builder module separation.
   - **Q5 Railway deploy structure.** One Railway build, not per-builder. Env var proliferation handled by registry pattern (only true secrets stay in Railway Variables). GCP OAuth, Cognito API key, Airtable PAT, API shared secret all stay shared across builders.
   - **Q6 Drive folder structure.** Per-builder root. Each builder gets its own top-level folder (`Lennar/Properties/`, `BuilderX/Properties/`, etc.); same inner structure.
   - **Q7 Prep email template.** Same shared template; builder name interpolated into the body. One Jinja-ish shape, builder-labeled output.
   
   Scope flag parked for Workstream A kickoff: **Payload Rules convention file is shared across builders** (MLS/Matrix conventions, not Lennar-specific). If a future builder is on a different MLS (not CVRMLS), that's a bigger architectural question than the kickoff is scoped to answer.

6. **Sheet-row suffix abbreviation shipped (small polish fix).** Operator spotted during live validation that `/prepare-listing` writes the raw unabbreviated address to the Sheet row A column ("3435 Moonstone Drive" instead of "3435 Moonstone Dr"), while the Drive folder created in the same run uses the abbreviated form via `_abbreviate_street_name()`. Fix: pass the already-computed abbreviated `address` from `app.py`'s handler into `build_listing_row` as a new parameter; drop the internal reconstruction in `sheets_services.py`. Single source of truth for the display form across Drive folder, prep email body, and Sheet row A. Shipped as a protocol-conformant Cursor handoff (`HANDOFF-2026-10-15-prep-polish.md`) — see Protocol conformance below.

7. **Gmail banner fix attempted via plus-aliasing — failed. Wrong recommendation surfaced and captured explicitly.** v0.18 parked the Gmail self-send yellow banner with the plus-aliasing fallback (change `to_address` to `agentandrewrich+listings@gmail.com`) as the "small Cursor handoff if filter doesn't kill the banner" fix. Operator confirmed the v0.18 filter mitigation didn't work; session shipped the plus-alias change bundled into the sheet-row-suffix handoff. Live-test on Entry fired against 8742 Clemet Dr confirmed the alias IS on the wire (raw header inspection: `to: agentandrewrich+listings@gmail.com`) but the banner persists. **Diagnosis: Gmail normalizes sub-addressing BEFORE running the self-send heuristic.** Gmail knows that `agentandrewrich+listings@gmail.com` and `agentandrewrich@gmail.com` route to the same mailbox and treats them as equal for the purpose of the banner check. On top of that, the Gmail API send path tags itself in the Received headers (`gmailapi.google.com with HTTPREST`) — Gmail can tell the message is sent by the same OAuth-authenticated user receiving it, independent of what the headers claim. **The plus-aliasing recommendation was wrong — captured here so a future session doesn't repeat it.** Operator electing to live with the banner for now (cosmetic, mail still arrives, filters still fire, operator knows what the email is). Three future-option paths captured in the parked queue — see parked items.

8. **Protocol conformance for `HANDOFF-2026-10-15-prep-polish.md`.** First iteration drafted the handoff without reading the actual code and in prose instead of Find/Replace blocks — operator caught the gap mid-session, asked for a review of `CURSOR-HANDOFF-PROTOCOL-001`. Session redrafted properly: cloned the repo, read `app.py` and `sheets_services.py` directly, built exact Find/Replace blocks, matched the convention actually in use (established in the virtual-tour-emission-fix and Phase 3a.1 handoffs), scoped the Sheet-row change cleanly by passing `address` as a parameter rather than duplicating the suffix abbreviator across modules. Pattern lesson: **when writing a Cursor handoff for a known file, read the actual file first and build real Find/Replace blocks, don't rely on prose descriptions.** CURSOR-HANDOFF-PROTOCOL-001's "surgical, not generative" principle: Cursor executes the handoff literally, so the handoff must contain the literal code.

9. **Pattern lesson captured — "which browser / which session / which tool is actually doing the work?"** Earlier in the session the question of how to look at live code came up. Repo is synced to the project knowledge via GitHub (`src/` and `docs/` filters), but `extension/scripts/` isn't in the filter so wasn't searchable via `project_search`. The right move was to clone the repo via `add_repo` + `Bash` — which the session eventually did, after one incorrect assumption that `add_repo` had already run. Lesson: when the project knowledge base doesn't surface a file path, check the sync filter before concluding the file doesn't exist.

---

## Architectural decisions — resolutions this session

### Phase 4's real scope is multi-builder, not doc housekeeping

v0.18/v0.19's Phase 4 scope was dominated by doc work that the operator doesn't need in order to scale the business. The real scaling unlock is proving the infrastructure handles builder #2, #3, #N as configuration rather than engineering. Re-scoped from four items to three workstreams; A is the next real priority. Workstream C's housekeeping items don't disappear — they just stop blocking anything.

### Standard-listing protocol overhaul is parked indefinitely

The operator's working model has retired the old operational project. Standard-listing TC work is maintenance mode at current volume; the operator does these by hand efficiently. The protocol doc stays with its known gaps (bookmarklet terminology, missing Airtable awareness, one `LBGD` bug) until standard-listing work ever gets re-activated. No trigger set.

### Airtable Field Options flattening ties to Workstream A

Prior status was "parallel proposal in flight" from v0.7, never captured as its own parked item. Now explicitly scoped and parked with a real trigger: do it when builder #2 gets added, so builder #2's base is Free-tier-compatible from day one. Standalone flattening removed; migration becomes a known step inside Workstream A.

### Phase 1 Lennar script never touches Field Options at runtime

Confirmed by reading `generate.py` — the script reads from Payload Rules + Cognito Fields + Source Types + Community Reference DB. Field Options is Rules-authoring reference, not pipeline runtime data. This makes the flattening safe from the Lennar script side, independent of when it happens.

### Gmail's self-send heuristic normalizes sub-addressing

Plus-aliasing does NOT suppress the banner on Gmail-to-Gmail mail. Captured as a wrong-recommendation lesson in the parked queue so a future session doesn't rediscover it. Three alternative paths captured; operator electing option 1 (live with it) for now.

### Workstream A kickoff is a kickoff-style session, not an implementation session

Same shape as Phase 1 (v0.13), Phase 2 (v0.16), Phase 3 (v0.18) kickoffs: a short list of shape questions settled sequentially, decisions landed, then a Cursor handoff produces the engineering work. Operator pre-settled 6 of 7 questions this session; Workstream A kickoff's real work is converting those decisions into the registry pattern + extension builder dropdown + per-builder base scaffolding.

### Protocol-conformant handoffs require reading real code first

CURSOR-HANDOFF-PROTOCOL-001's "surgical, not generative" principle means Cursor executes the handoff literally. A handoff written in prose descriptions ("find where `to_address` is set") pushes interpretation onto Cursor and risks the kind of inventive-but-wrong application the protocol was designed to prevent. For any single-file surgical change, the authoring session reads the file and builds exact Find/Replace blocks. Multi-file batched changes follow the same discipline per-file.

---

## Doc state at close

- **Repo (`aframe-mcp-connector`)** — Sheet-row suffix abbreviation + Gmail banner attempt landed via `HANDOFF-2026-10-15-prep-polish.md` (commit TBD at session close). Changes to `extension/scripts/app.py` (lines ~251-259 Gmail banner, lines ~266-269 pass address) and `extension/scripts/sheets_services.py` (column-map docstring + `build_listing_row` signature). Gmail change is a false positive (confirmed in live-test — banner persists); the plus-alias stays on the wire but doesn't help. Sheet-row fix confirmed working.
- **Railway** — unchanged. No env var changes this session.
- **Google Cloud Console** — unchanged. All three APIs (Drive + Gmail + Sheets) still enabled; OAuth consent screen still production-published.
- **Cognito Form 17** — unchanged.
- **Airtable** — unchanged. Operator noted via inbox invoice that current plan is Team ($24 monthly). CVRMLS Matrix Fields base confirmed at 1,531 records; Lennar base well under 1k.
- **`Lennar_Restructure_Phase_Tracker.md`** — bumping v0.19 → v0.20 via `HANDOFF-2026-10-15-phase-tracker-v0.20.md` accompanying this session doc.
- **`Payload_Rules_Conventions.md`** — unchanged at v0.6.
- **`Lennar_Community_Reference_Database.md`** — unchanged at v1.4.
- **`Lennar_Payload_Schema.md`** — unchanged at v1.3.
- **`Lennar_New_Listing_Protocol.md`** — unchanged at v1.7.
- **`New_Seller_Side_Session_Protocol.md`** — reviewed, left at v0.5. Known gaps captured in parked (indefinitely deferred).
- **`CVRMLS_Field_Options_Flattening_Proposal.md`** — reviewed, left at 2026-09-15 state. Still accurate; migration now scoped as part of Workstream A.
- **`CURSOR-HANDOFF-PROTOCOL-001.md`** — still at v1.1. Refresh item parked.
- **`Lennar_Payload_Examples.md`** — still stale on HM TH `taxid` example; Workstream C target (unchanged).

---

## Small parked items (post v0.20)

**Phase 4 workstream structure:**
- **Workstream A — Multi-builder architecture** (new this session, Priority 1 for next session). Pre-scoped: Q1-Q7 shape questions settled. Config-driven registry pattern in the script dispatcher, one Railway build, one base per builder, per-builder Cognito forms, per-builder Drive folder roots, shared email template with builder interpolation, extension builder dropdown drives Cognito form selection. Includes the Airtable Field Options flattening as a known-shape step when builder #2 gets added.
- **Workstream B — Builder-onboarding runbook** (new this session, Priority 2 after A lands). The written artifact — base schema specification + builder-onboarding protocol folded in. One doc-heavy session.
- **Workstream C — Housekeeping** (new this session, deferred). Original Phase 4 scope: retire operational-session docs, archive Airtable Lennar Listings table, close SOP stubs, maintenance protocol. Lands when something specific forces it.

**Gmail banner mitigation (revised this session):**
- Plus-alias attempt FAILED — Gmail normalizes sub-addressing before the self-send check. Alias stays on the wire (no harm) but doesn't suppress the banner. Three future-option paths:
  1. Live with it (current operator choice — banner is cosmetic, mail still arrives, filters still fire).
  2. aar-tc.com domain email via Squarespace. Operator pays Squarespace for domain + website hosting; Squarespace offers Google Workspace integration (paid underneath, but may be bundled with annual domain renewal) and/or basic email forwarding. If forwarding is available, point `andrew@aar-tc.com` or similar at Gmail inbox; `to_address` swap in `app.py` becomes the Cursor handoff. External-origin mail breaks Gmail's self-send heuristic.
  3. External SMTP (SendGrid, Mailgun, Amazon SES) — real infrastructure refactor; overkill for a cosmetic banner.
  
  Operator investigating Option 2 at their own pace. No session trigger set.

**Business-dev readiness:**
- Workstream A unblocks "yes we can onboard your builder in bounded session time" as a confident operator pitch. Current state: Lennar-only. Post-Workstream-A state: Lennar + one proof-of-concept second builder (ideal), or Lennar + documented second-builder recipe (minimum).

**Standard-listing protocol:**
- `New_Seller_Side_Session_Protocol.md` v0.5 — known gaps (bookmarklet references, missing Airtable awareness, `LBGD` → `LGD` bug, Phase 1/Phase 2 terminology collision with project-level Phase 4) parked indefinitely. Reactivates only if standard-listing session work ever becomes a volume priority.

**Phase 3b — PandaDoc addendum create + magic-link send** (unchanged from v0.19, Priority 2 whenever unblocked). All design preserved; blocked on operator PandaDoc Starter subscription decision.

**Formal retirement of Airtable Lennar Listings table** (unchanged from v0.19, slated for Workstream C).

**Property Type multi-select orphan option cleanup** (unchanged from v0.8). Still unaddressed (surfaced in the parked-queue walkthrough early in the session but didn't ship).

**Payload Rules table description update via API blocked** (unchanged from v0.8). Conventions file now v0.6; manual paste still pending.

**`CURSOR-HANDOFF-PROTOCOL-001` protocol-doc refresh** (unchanged from v0.14 — now reinforced). This session surfaced the pattern explicitly: for any single-file surgical change, read the file and build real Find/Replace blocks. The `handoffs/incoming/` + `handoffs/applied/` convention and the batched-override pattern (six times running now) both still need to land in the protocol doc.

**Doc-process note: template-copy operator step** (unchanged from v0.17, low priority).

**`Lennar_New_Listing_Protocol.md` `"17-3"` shorthand clarification** (unchanged from v0.16, low priority).

**Cognito OData silently ignores `$top`** (unchanged from v0.16, informational).

**`Entry_DateCreated` defensive fallback in `fetch_recent_entries`** (unchanged from v0.16, informational).

**Rule 111 Finished / Part Finished / Unfinished crosswalk branches untested** (unchanged from v0.15, low priority — production catch).

**Rule 110 SF+No garage branch untested** (unchanged from v0.15, low priority — production catch).

**Watermark SF `new`-path rules untested** (unchanged from v0.15, low priority — production catch).

**Spot-check-before-fill pattern as operator hedge** (unchanged from v0.15, procedural).

**Cognito form field-type standardization** (unchanged from v0.15, optional).

**Rules-table Features-tab cleanup** (unchanged from v0.14, low priority).

**`Lennar_Payload_Examples.md` v1.1 doc refresh** (unchanged from v0.14, low priority).

**`_cognito_null_default` numeric-TEXT list hardcoded in the dispatcher** (unchanged from v0.14, low priority).

**`SCRIPTS-*` doc_id convention decision** (unchanged from v0.14, low priority).

**Post Office / Subdivision closure confirmation** (unchanged from v0.6).

**Multi-Builder Pin phrasing correction** (unchanged from v0.7 — directly relevant to Workstream A, resolves when A lands).

**HOA Fee / Additional Fee DB column split** (unchanged from v0.9, low priority).

**Copyright Agreement multi-builder promotion decision** (unchanged from v0.9 — directly relevant to Workstream A, resolves when A lands).

**NumberOfCars form constraints** (unchanged from v0.11, low priority).

**Features Matrix UI Section panels check** (unchanged from v0.6).

**URL auto-derivation for the Lennar virtual tour pattern** (unchanged from v0.19, low priority).

**NHC name formatting edge cases** (unchanged from v0.19, informational).

**Removed from queue this session:**
- Airtable Field Options flattening as a standalone parked item (resolved — migration now scoped as a known step inside Workstream A, triggered by builder #2 add).
- Standard-listing protocol as an actively-queued item (resolved — parked indefinitely, no trigger).
- Sheet-row suffix abbreviation (shipped this session via `HANDOFF-2026-10-15-prep-polish.md`).
- Gmail banner "small Cursor handoff" scope (replaced — plus-alias attempt failed, new scope requires external mail routing).

---

## Next session opening move

**Workstream A kickoff.** Per the Phase 4 re-scope landed this session, Workstream A (multi-builder architecture) is the real priority to unlock business dev. 6 of 7 shape questions settled this session (see "What happened" item 5); session should open on the implementation plan.

Suggested opening sequence:
1. **Confirm the 7 kickoff decisions still stand.** Operator may have thought of edge cases since.
2. **Draft the builder registry structure.** Config file vs. Airtable table — probably config file for now (easier to iterate), promote to Airtable later if operator wants editable-without-code-push.
3. **Identify the smallest viable Lennar refactor** that introduces the registry without changing current Lennar behavior. Should be a one-handoff change: extract Lennar's current hardcoded config into a `BUILDERS` dict with `"lennar"` as the only key; dispatcher reads from `BUILDERS[builder]` instead of `os.environ[...]`.
4. **Scope the extension builder-dropdown changes.** Side panel adds a builder select; selection triggers `/recent-entries?builder=X` and `/generate?builder=X` (or passes `builder` in the request body). Mockup-before-handoff pattern invoked (artifact mockup for UI changes, per v0.17 / v0.18).
5. **Prepare the empty second-builder scaffold** — new Cognito form, new Airtable base, new Drive folder root. Not populated with real builder data, just the structure. Proves the registry works end-to-end before a real builder onboarding happens.

Workstream A is 2-3 sessions of work, not one. Session 1 lands the architecture; session 2+ validates against a real or hypothetical builder #2.

**If Workstream A is NOT the move at session open**, these are the alternative openings:
- aar-tc.com Squarespace mail investigation (operator decision whether to pursue).
- Any production catches that surface between now and then.
- Phase 3b activation if PandaDoc subscription lands.

At session close: bump tracker version to v0.21, refresh Decisions Parked and Next Session Opening Move. Substantive Workstream A decisions migrate to the Workstream B runbook once it exists.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

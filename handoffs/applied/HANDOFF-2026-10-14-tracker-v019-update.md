---
title: Tracker v0.18 → v0.19 update
document_id: HANDOFF-2026-10-14-tracker-v019-update
date: 2026-10-14
project: AAR-TC Lennar Operational Project
scope: Update Lennar_Restructure_Phase_Tracker.md to v0.19 after Phase 3a.1 Sheets write live
related: SESSION-HANDOFF-2026-10-14-PHASE-3A1-SHEETS-WRITE-LIVE.md, HANDOFF-2026-10-14-phase-3a1-sheets-write.md
---

# Tracker v0.18 → v0.19 update

Single-file doc update. Bumps `docs/foundation/Lennar_Restructure_Phase_Tracker.md` from v0.18 to v0.19 after Phase 3a.1 (Google Sheets row write) landed live.

## File to update

`docs/foundation/Lennar_Restructure_Phase_Tracker.md`

## Changes

### 1. Frontmatter

```
version: 0.19
version_date: 2026-10-14
```

### 2. "Decisions Landed This Session" section

Append new decisions below the existing v0.18 content (keep all prior decisions intact — this section is cumulative). Add these new entries at the end of the section, before "Decisions Parked for Next Session":

```markdown
**Lennar Listings table overhaul scope-pivoted from Airtable to Google Sheet (v0.19).** v0.18's Priority 1 move pointed at an Airtable overhaul; session open clarified that the Google Sheet is the actual lifecycle tracker per the Charter's "Sheet is sole source of truth" principle. No Airtable overhaul happened; the Airtable Lennar Listings table drops into the Phase 4 archival queue instead. The "audit row" concept from the Phase 3 charter also drops — audit-row writes now go to Sheet rows via `/prepare-listing`, not to a separate Airtable Audit table. The Lennar Listings Audit table (planned at Phase 3 charter) is formally retired this session.

**Nine new columns added to the Lennar Listings Sheet (v0.19).** Columns L–T, right of the existing Notes/Comments column, with existing A–J layout preserved: L Build Model, M NHC, N Tax ID, O Closing Cost, P Loan Type, Q Co-op Agent, R Exterior Photos, S Interior Photos, T Virtual Tour. Native column grouping on L:T with the built-in `+`/`−` toggle for show/hide. Script writes to A (Address), C (Current Price), E (Community with DB SF/TH suffix), F (Status = "Input in progress"), L (Build Model), M (NHC), R/S/T (photo cells). B/D/G/H/J/N/O/P/Q are operator-fill.

**Form 17 updated with `PhotosVirtualTour.ReusePhotosFromAPreviousListing` field (v0.19).** New free-text field inside the existing `PhotosVirtualTour` section, not required, no format validation. Added mid-session to replace the originally-considered regex-parse-Notes-to-Andrew path for "reused photos" cases. Script rule for the three link cells (R/S/T): Cognito URL populated → `=HYPERLINK(url, "Box link")` or `"Tour link"`; URL blank + ReusePhotos populated → `Reused from {value}`; both blank → cell blank. Virtual Tour also falls back to the ReusePhotos field (assumption: reused photos imply reused tour).

**Phase 3a.1 Sheets write shipped as a 6-file Cursor handoff (v0.19 — commit `b846791`).** `HANDOFF-2026-10-14-phase-3a1-sheets-write.md`, default pattern (not batched-override — file-level coherence weaker than Phase 3a's 10-file batch, each file change independent). Changes: `gcp_oauth_helper.py` SCOPES expanded; `google_services.py` SCOPES matched + `build_sheets_service()` builder; `sheets_services.py` NEW with `build_listing_row()`, `write_listing_row()`, and photo-cell helper; `app.py` `/prepare-listing` adds Sheets-write step after Drive + Gmail wrapped in own try/except for non-fatal failure; `.env.example` adds `GOOGLE_SHEET_ID` slot; `Lennar_Extension_Build.md` Phase 3a.1 section. Row inserts at index 45 via `insertDimension` (shifts existing rows down one), then writes A:T. Operator moves to community block manually.

**Four Cursor apply deviations, all judgment-call wins (v0.19).** Cursor on Sonnet 5 High applied with: `build_sheets_service(credentials)` → `sheets_service()` no-arg (matches existing Drive/Gmail builders calling private `_credentials()` internally rather than inventing a credentials-passing convention); `community_display_name` → resolved via existing `_resolve_community_key(entry)` from `generate.py` (handler's local `community` is raw unsuffixed `Intake.Community`, Sheet needs DB key with SF/TH suffix — reuse the existing resolver rather than mint new logic); introduced `warnings = []` initializer (handler had hardcoded `"warnings": []` in response — real list needed so sheet-write fail path could actually append); `.env.example` section header style matched existing `# -------- Section Name --------` convention. Fifth handoff running (v0.14, v0.16, v0.17, v0.18, v0.19) where Cursor's codebase-aware judgment beat handoff placeholder-samples cleanly.

**Full GCP OAuth infrastructure now spans Drive + Gmail + Sheets with no architectural changes (v0.19).** Operator-side setup: Google Sheets API enabled in "Matrix Automation" GCP project; refresh token re-minted locally via desktop venv at `/Users/andrewrich/Desktop/phase3-oauth/` (needed brief terminal walkthrough — `source venv/bin/activate` + full client-secret filename arg); Railway env vars rotated `GCP_REFRESH_TOKEN` and added `GOOGLE_SHEET_ID` = `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME`. OAuth consent screen stayed production-published; no re-verification. Architecture scales cleanly to future Google services (Calendar, Contacts) with the same minimal footprint: enable API + add scope string + re-mint token.

**Live validation surfaced a Railway deploy-race, then confirmed clean end-to-end (v0.19).** First post-apply fire returned success envelope but no sheet row — Railway was still mid-deploy on `b846791`, so older code path handled the call without the sheet-write step. Second fire a few minutes later hit the new build cleanly: row at A45:T45 with correct address, currency-formatted price, SF-suffixed community, "Input in progress" status, model + NHC in L/M, and photo cells rendering as expected. Pattern note: for Railway-redeploy tests, pause 1–2 minutes after a push before firing the smoke test.

**Status dropdown inheritance via `inheritFromBefore: True` (v0.19).** Phase 3a.1 shipped with `inheritFromBefore: False` in the `insertDimension` call; Status column's data validation didn't carry to the newly inserted row at 45 — operator saw literal text instead of dropdown chip. One-line fix in `sheets_services.py`: flip to `True`. Operator applied the Status dropdown to F44 so the inherit-from-above pattern has a source. Pattern note: when inserting rows inside a table-shaped sheet (data validation, formatting, formulas in surrounding rows), `inheritFromBefore: True` is almost always the right default; the `False` default in the Google Sheets API docs is defensive and inappropriate for this use case.

**Mockup-in-sheet variant of the mockup-before-handoff pattern (v0.19).** Prior sessions used HTML artifacts for UX mockups; this data-model session wrote test headers at L2:U2 and test rows at A40:U41 directly to the live sheet via the Google Sheets API. Operator's rearrangement decisions — column order, Intake Date drop, "Interior Photos" rename, hyperlink labels as "Box link"/"Tour link" — landed directly in the artifact being reviewed, no Cursor round-trip. Mockup-before-handoff pattern now has two forms: HTML artifact for UI sessions, direct-write for data-model sessions.
```

### 3. "Decisions Parked for Next Session" section

Replace the existing v0.18 content wholesale (this section is NOT cumulative — it reflects the current parked state). New content:

```markdown
### Decisions Parked for Next Session

**No clearly-burning next priority.** Phase 3a.1 is live. Phase 3b (PandaDoc) is operator-blocked on subscription decision. Phase 4 (doc refactor + operational-session retirement) is the natural next phase but doesn't have specific scope settled. Possible next-session moves, in no particular order (operator picks at session open):

1. **Phase 4 doc refactor kickoff** — vision/charter + base schema specification + maintenance protocol + builder-onboarding protocol all still to author; mark the Airtable Lennar Listings table as archival; retire old operational-session behavior from Project Protocol and New Listing Protocol. Doc-heavy session.

2. **Gmail self-send yellow-banner mitigation** — if the v0.18 filter didn't kill the banner, apply the plus-aliasing fix (change `to_address` in `app.py` to `agentandrewrich+listings@gmail.com`). ~5-minute Cursor handoff.

3. **Phase 3b activation** if operator subscribes to PandaDoc Starter. ~3-file additive handoff with all design preserved from v0.18.

4. **Production catches** as they come. v0.15's parked branches (Rule 111 Finished/Part Finished/Unfinished crosswalk, Rule 110 SF+No garage, Watermark SF `new`-path) still unexercised. Nothing to do until a listing surfaces one.

**URL auto-derivation for the Lennar virtual tour pattern** (new, v0.19, low priority). Would require per-community URL templates in the Community Reference DB (jurisdiction, slug, prefix). Defer until ReusePhotos text-fallback proves insufficient in practice.

**NHC name formatting edge cases** (new, v0.19, informational). Current approach grabs `FirstAndLast`. Middle names, prefixes, and suffixes aren't handled distinctly — tighten if operator sees messy NHC names in column M.

**Formal retirement of Airtable Lennar Listings table** (new, v0.19, slated for Phase 4). Adding a visible "archival — do not edit" marker in the table description is enough. Can land as part of the Phase 4 doc refactor or as a tiny Airtable-side task whenever.

**Phase 3b — PandaDoc addendum create + magic-link send** (unchanged from v0.18, Priority 2 whenever unblocked). All design preserved: template config (`9DpcJ2wbwTkXvLh59aTPTn`), three-role preassignments, Composed Clause template string, `GET /send-signing?token=X` magic-link JWT, email button swap from `<span>` to `<a href>`. Blocked on operator PandaDoc Starter subscription decision.

**Gmail self-send yellow-banner mitigation** (unchanged from v0.18, low priority). First mitigation (Gmail filter) attempted — TBD whether it kills the banner itself. If filter doesn't work, apply plus-aliasing as a tiny Cursor handoff.

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

**`_cognito_null_default` numeric-TEXT list is hardcoded in the dispatcher** (unchanged from v0.14, low priority).

**`CURSOR-HANDOFF-PROTOCOL-001` protocol-doc refresh** (unchanged from v0.14, low priority).

**`SCRIPTS-*` doc_id convention decision** (unchanged from v0.14, low priority).

**Post Office and Subdivision closure.** Unchanged from v0.6.

**HOA Fee / Additional Fee DB column split** (unchanged from v0.9, low priority).

**Copyright Agreement multi-builder promotion decision** (unchanged from v0.9, low priority).

**Whether Features' Matrix UI has real Section panels.** Unchanged from v0.6.

**Multi-Builder Pin phrasing correction.** Unchanged from v0.7, not urgent.

**Payload Rules table description update via API blocked.** Unchanged from v0.8. Conventions file now v0.6.

**Property Type multi-select orphan option cleanup.** Unchanged from v0.8.

**`Payload_Rules_Conventions.md` ID convention decision.** Unchanged from v0.8.

**NumberOfCars form constraints** (unchanged from v0.11, low priority).

**Phase 0 doc authoring items.** Vision/charter is landed. Still to author: base schema specification, maintenance protocol, builder-onboarding protocol. Natural fold-in to Phase 4.

**Removed from queue this session:**
- Lennar Listings table overhaul (resolved — scope shifted from Airtable to Sheet; no overhaul needed, old Airtable table slated for Phase 4 archival).
- Lennar Listings Audit table concept (dropped — audit row writes now Sheet rows via `/prepare-listing`).
```

### 4. "Next Session Opening Move" section

Replace the existing v0.18 content wholesale. New content:

```markdown
## Next Session Opening Move

**Phase 3a.1 is live.** Operator UX for a new intake now looks like: new Cognito email → create Matrix listing → open extension → Load entry from picker → click Generate listing prep (fires Drive folder + prep email + Sheet row at row 45) → auto-fill through Matrix tabs → upload photos → do PandaDoc manually with the provided merge values → exit extension → move the Sheet row to its community block when convenient. The automation gap that remains is PandaDoc, which is Phase 3b and still operator-blocked on subscription.

**No forward commitment for the next session.** There's no clearly-burning next priority. Operator picks at session open from the parked possibilities (Phase 4 doc refactor kickoff; Gmail banner mitigation; Phase 3b activation if subscription lands; any production catches). Likely a short triage session unless a specific move earns its place.

At session close: bump tracker version to v0.20, refresh Decisions Parked and Next Session Opening Move. Substantive decisions migrate to canonical foundation docs, not into this tracker.
```

### 5. Version History table

Append a new row at the end of the version history table:

```markdown
| 0.19 | 2026-10-14 | Session close after Phase 3a.1 (Google Sheets row write) landed live. Session opened on v0.18's parked Priority 1 (Lennar Listings table overhaul) but scope pivoted in the opening exchange: operator clarified the Google Sheet is the actual lifecycle tracker per the Charter's "Sheet is sole source of truth" principle, and the planned Airtable overhaul was a leftover from pre-restructure thinking. The Airtable Lennar Listings table drops into the Phase 4 archival queue; the Lennar Listings Audit table (planned at Phase 3 charter) is formally retired because audit-row writes now go to Sheet rows via `/prepare-listing`. Nine new columns added to the Sheet (L–T: Build Model, NHC, Tax ID, Closing Cost, Loan Type, Co-op Agent, Exterior Photos, Interior Photos, Virtual Tour), hidden by default via native column grouping toggle. Script writes A (Address), C (Current Price), E (Community with DB SF/TH suffix), F (Status = "Input in progress"), L (Build Model), M (NHC), R/S/T (photo cells); B/D/G/H/J/N/O/P/Q operator-fill. Form 17 updated mid-session with new `PhotosVirtualTour.ReusePhotosFromAPreviousListing` field (text, not required) — rejected the regex-parse-Notes-to-Andrew path for photo-reuse cases in favor of structured data. Script rule for R/S/T cells: Cognito URL populated → `=HYPERLINK(url, "Box link")` or `"Tour link"`; URL blank + ReusePhotos populated → `Reused from {value}`; both blank → cell blank. Virtual Tour also falls back to ReusePhotos (assumption: reused photos imply reused tour). Phase 3a.1 shipped as a 6-file Cursor handoff (`HANDOFF-2026-10-14-phase-3a1-sheets-write.md`, commit `b846791`): `gcp_oauth_helper.py` SCOPES expanded with `spreadsheets`; `google_services.py` SCOPES matched + `build_sheets_service()` builder; `sheets_services.py` NEW with row-build and insert-at-45 logic; `app.py` `/prepare-listing` adds Sheets-write step wrapped in own try/except for non-fatal failure; `.env.example` adds `GOOGLE_SHEET_ID` slot; `Lennar_Extension_Build.md` Phase 3a.1 section. Row inserts at index 45 via `insertDimension` (shifts existing rows down one), then writes A:T. Operator moves to community block manually. Cursor applied with four judgment-call deviations (all matching existing codebase conventions): `build_sheets_service(credentials)` → `sheets_service()` no-arg matching existing Drive/Gmail builder pattern; `community_display_name` → resolved via existing `_resolve_community_key(entry)` from `generate.py` rather than passing raw community; introduced `warnings = []` initializer so the sheet-write fail path could surface warnings; `.env.example` section header matched existing style. Fifth handoff running (v0.14, v0.16, v0.17, v0.18, v0.19) where Cursor's codebase-aware judgment cleanly beat handoff placeholder-samples. Operator-side GCP + Railway setup done via desktop venv terminal walkthrough: Google Sheets API enabled in "Matrix Automation" project; refresh token re-minted; Railway env vars rotated `GCP_REFRESH_TOKEN` and added `GOOGLE_SHEET_ID` = `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME`; OAuth consent screen stayed production-published, no re-verification. GCP OAuth infrastructure now spans Drive + Gmail + Sheets with no architectural changes. Live validation surfaced a brief Railway deploy-race (first fire hit old code path before `b846791` deployed; second fire a few minutes later worked cleanly); row at A45:T45 populated correctly with address, currency-formatted price, SF-suffixed community, "Input in progress" status, model + NHC in L/M, photo cells rendering as expected. Small Status-dropdown polish shipped as one-line Cursor follow-up: `insertDimension` request body `"inheritFromBefore": False` → `True` so new row inherits data validation (and other properties) from row 44 above it; operator applied the Status dropdown to F44 as the inherit source. Pattern note: `inheritFromBefore: True` is almost always right when inserting rows inside a table-shaped sheet. Mockup-before-handoff pattern adapted to data-model session: test headers at L2:U2 and test rows at A40:U41 written directly to the live sheet via API, operator rearranged in place (column order, Intake Date drop, "Interior Photos" rename, hyperlink labels as "Box link"/"Tour link"). Extension-contract-knowledge pattern from v0.14 holds through v0.19 — Phase 3a.1 changes all script-side; Rules table, `content.js`, `background.js`, extension UI all untouched; extension stays at v0.4.0. **Phase 3a.1 complete.** No clearly-burning next priority; operator picks at session open. Full detail in `SESSION-HANDOFF-2026-10-14-PHASE-3A1-SHEETS-WRITE-LIVE.md`. |
```

## Post-apply verification

1. Open `docs/foundation/Lennar_Restructure_Phase_Tracker.md` and confirm frontmatter shows v0.19 and today's date.
2. Confirm the new "Decisions Landed" entries appended cleanly below v0.18 content (not replacing).
3. Confirm "Decisions Parked" and "Next Session Opening Move" sections replaced wholesale.
4. Confirm version history table has a new v0.19 row at the end.
5. Commit with message like `docs: bump tracker to v0.19 after Phase 3a.1 Sheets write live`.
6. Move this handoff from `handoffs/incoming/` to `handoffs/applied/`.

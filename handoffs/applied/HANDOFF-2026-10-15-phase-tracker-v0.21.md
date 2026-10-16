# HANDOFF-2026-10-15-phase-tracker-v0.21

**Author:** Claude session, 2026-10-15
**Protocol:** CURSOR-HANDOFF-PROTOCOL-001 v1.1
**Scope:** Update `docs/foundation/Lennar_Restructure_Phase_Tracker.md` from v0.20 → v0.21.

## Scope

Single-file surgical change to `Lennar_Restructure_Phase_Tracker.md` only. Session memory (the companion `SESSION-HANDOFF-2026-10-15-WORKSTREAM-A-REGISTRY-LIVE.md` doc) lives outside the repo — do NOT look for it, do NOT add it to the commit, do NOT reference it as a repo file. The tracker's own version-history entry and the Workstream A session 1 content carry everything the next session needs.

Five Find/Replace blocks against the current tracker at HEAD (v0.20):

1. Correct the Multi-Builder Pin's MLS/Builder layer bullets (parked since v0.7 — resolves this session as a bonus fix).
2. Update the version frontmatter.
3. Append v0.21 Decisions Landed bullets after the last v0.20 bullet, before `### Decisions Parked for Next Session`.
4. Replace the Decisions Parked section with the refreshed list.
5. Replace the Next Session Opening Move section with the Workstream A session 2 opener.
6. Append a v0.21 row to the version history table.

---

## Change 1 — Multi-Builder Pin phrasing correction (bonus fix)

**Find:**
```markdown
- **MLS layer** (objective, per-MLS): CVRMLS Matrix Fields, Cognito Form Fields. Universal across builders.
- **Builder layer** (policy, per-builder): Lennar Payload Rules. Links to MLS layer.
- **Instance layer**: per-listing payloads and audit rows.
```

**Replace:**
```markdown
- **MLS layer** (objective, per-MLS): CVRMLS Matrix Fields. Universal across builders.
- **Builder layer** (policy, per-builder): Lennar Payload Rules and Cognito Form Fields. Links to MLS layer. (Cognito Form Fields corrected to Builder layer per v0.7's decision — Form 17 is `LennarNewListingIntake`, Lennar-specific; each new builder gets its own Cognito Fields table in its own base.)
- **Instance layer**: per-listing payloads and audit rows.
```

---

## Change 2 — Version frontmatter

**Find:**
```markdown
version: 0.20
version_date: 2026-10-15
```

**Replace:**
```markdown
version: 0.21
version_date: 2026-10-15
```

---

## Change 3 — Append v0.21 Decisions Landed bullets

**Find:**
```markdown
**Protocol conformance lesson (v0.20).** `HANDOFF-2026-10-15-prep-polish.md` first iteration drafted in prose without reading actual code; redrafted with exact Find/Replace blocks after `CURSOR-HANDOFF-PROTOCOL-001` review. Pattern: single-file surgical handoffs require reading the real file and building literal Find/Replace blocks — Cursor executes the handoff literally.

### Decisions Parked for Next Session
```

**Replace:**
```markdown
**Protocol conformance lesson (v0.20).** `HANDOFF-2026-10-15-prep-polish.md` first iteration drafted in prose without reading actual code; redrafted with exact Find/Replace blocks after `CURSOR-HANDOFF-PROTOCOL-001` review. Pattern: single-file surgical handoffs require reading the real file and building literal Find/Replace blocks — Cursor executes the handoff literally.

**Workstream A session 1 live: registry refactor + extension builder dropdown shipped end-to-end (v0.21).** Per v0.20's parked Priority 1 move. Session opened on confirming the 7 kickoff decisions still stand (they do), then on operator's clarifying question: "what actual work is there that can be done without knowing any details about a new potential builder?" — surfaced the distinction between buildable-now (registry pattern, dropdown UI, runbook template) and requires-real-builder-data (new Cognito form, new Airtable base, new Drive root, end-to-end validation against a second key). Buildable-now subset was substantial enough for session 1. Shipped as 9-file batched-override handoff (`HANDOFF-2026-10-15-workstream-a-builder-registry.md`): NEW `extension/scripts/builders.py` carrying the `BUILDERS` registry with Lennar's full config (display_name, mls_tag, cognito_form_id, submitted_view_id, airtable_base_id + 4 table IDs, drive_properties_folder_id, sheet_id + sheet_tab_id + sheet_target_row, community_resolver key), `DEFAULT_BUILDER = "lennar"`, and `get_builder_config()` hard-fail-on-unknown-key dispatcher. `generate.py` registry-aware across 11 Find/Replace blocks (`REQUIRED_ENV_VARS` shrinks to `AIRTABLE_PAT` + `AIRTABLE_CVRMLS_BASE_ID` + `COGNITO_API_KEY`; module-level `LENNAR_BASE_ID` + 4 table ID constants + `SUBMITTED_VIEW_ID` all deleted; `_airtable_list_all` takes `base_id` parameter; `_resolve_community_key` splits into `_resolve_community_lennar_default` + `COMMUNITY_RESOLVERS` dict + public dispatcher taking optional `builder`; `_build_payload` + `fetch_recent_entries` + `generate_payload` + `main()` all thread `builder` through; payload envelope sources `"mls"` from registry's `mls_tag` and `"builder"` from the parameter; new `--builder` CLI flag). `app.py` across 7 blocks (`GenerateRequest` + `PrepareListingRequest` gain `Optional[str] = None` builder field; all three endpoints default to `"lennar"` server-side; `/prepare-listing` sources `cognito_form_id` / `drive_properties_folder_id` / `sheet_id` / `sheet_tab_id` / `sheet_target_row` from registry via `get_builder_config()`, passes `builder_display_name` to `build_prep_email`, passes `tab_id` + `target_row` to `write_listing_row`). `sheets_services.py` across 2 blocks (`LENNAR_LISTINGS_TAB_ID` + `TARGET_ROW` module constants deleted; `write_listing_row` takes keyword-only `tab_id` + `target_row` — keyword-only star enforced so the two integers can't be silently swapped). `prep_email.py` 1 block (`build_prep_email` takes `builder_display_name: str = "Lennar"`, interpolated into subject `"Listing prep: 3435 Moonstone Dr (Lennar)"` and opening sentence of body). `manifest.json` version 0.4.0 → 0.5.0, name `"Lennar CVRMLS Matrix Filler (POC)"` → `"CVRMLS Matrix Filler"`, description updated for Workstream A. `sidepanel.html` adds `.builder-picker` CSS matching entry-picker visual language and new builder dropdown as first panel element; `<h1>` text changes `"Lennar CVRMLS Matrix Filler"` → `"CVRMLS Matrix Filler"`. `sidepanel.js` across 5 blocks (adds `builderSelect` DOM ref + `getCurrentBuilder()` helper reading state from the `<select>` at every Railway call; loads persisted `matrixFillerBuilder` from `chrome.storage.local` on panel open with validity-check against current dropdown options; threads `builder` into `/recent-entries` as `?builder=` query param and into `/generate` + `/prepare-listing` POST bodies as `builder` field; builder-change handler mirrors Clear's reset flow — textarea cleared, persisted payload removed, tab status dots reset, Phase 3 state reset to idle — plus persists new selection and auto-refreshes picker to pull new builder's recent entries). `Lennar_Extension_Build.md` Workstream A section appended. **First handoff of the project to land with zero Cursor deviations on first apply** — reading every file first before writing Find/Replace blocks delivered. Validates CURSOR-HANDOFF-PROTOCOL-001's "surgical, not generative" principle from the authoring side. All four Railway smoke tests passed (health check, no-builder-param defaults to lennar, explicit `builder=lennar` same result, unknown builder returns structured error with "Unknown builder" message naming valid options). End-to-end extension smoke test passed: dropdown appeared, Lennar selected, picker auto-populated, entry Loaded, Matrix tabs filled correctly, Generate listing prep fired cleanly, Drive folder + prep email (now with `(Lennar)` subject suffix) + Sheet row at A45:T45 all landed as expected.

**Env var migration landed (v0.21).** Non-secret per-builder config (base IDs, folder IDs, sheet IDs, form IDs, table IDs, view IDs, tab IDs, target row) moved INTO `builders.py` as plain data. Only true shared secrets stay in Railway Variables: `AIRTABLE_PAT`, `AIRTABLE_CVRMLS_BASE_ID`, `COGNITO_API_KEY`, `API_SHARED_SECRET`, `GCP_CLIENT_ID`, `GCP_CLIENT_SECRET`, `GCP_REFRESH_TOKEN`. Four previously-required env vars (`AIRTABLE_LENNAR_BASE_ID`, `COGNITO_FORM_ID`, `LENNAR_PROPERTIES_FOLDER_ID`, `GOOGLE_SHEET_ID`) are now unused in the codebase — operator removes from Railway at leisure, no harm staying set.

**`AIRTABLE_CVRMLS_BASE_ID` deliberately stays as env var, not in registry (v0.21).** The CVRMLS Matrix Fields reference base is MLS-wide, not per-builder — used by Cascade Options authoring work (parallel standard-listing workstream, parked indefinitely). If a second CVRMLS builder is ever added, this becomes a shared MLS-layer registry (separate from the per-builder registry). Not blocking today.

**Explicit `builder` field in request bodies, not form_id inference (v0.21).** D2 landed. Alternative was reverse-looking-up builder from the Cognito form_id. Rejected because form IDs could in theory be reused across builders (same form cloned to a new workspace), and the inference couples unrelated things. Explicit `builder` from the extension side keeps the dispatch decision in one place.

**Community resolver as registry key string, not callable in config (v0.21).** D3 landed. `builders.py` stores `"community_resolver": "lennar_default"`; `generate.py` has a `COMMUNITY_RESOLVERS` dict mapping keys to actual functions. Keeps `builders.py` data-only (no implementation imports), and new builders either reuse `"lennar_default"` or get a new named resolver added. Operator confirmed from knowledge of big builders that Intake.Community + PropertyType is a common organizational shape — Lennar's resolver should serve as a default for other builders with similar form structures.

**Builder change in the extension is a context switch, not a mode toggle (v0.21).** R3 landed. Switching builders mid-session triggers the same reset flow Clear does (textarea cleared, persisted payload removed, tab status dots reset, Phase 3 state reset to idle) PLUS an auto-refresh of the entry picker to pull the new builder's recent form submissions. Carrying stale payload JSON forward across a builder change would invite filling against the wrong Matrix tabs. Behavior reflects that different builders are different workflows that happen to share one extension surface.

**Extension-contract-knowledge pattern (v0.14) survives Workstream A session 1 intact (v0.21).** All server-side registry work landed in `builders.py` + `generate.py` + `app.py` + `sheets_services.py` + `prep_email.py`. Extension changes landed in `sidepanel.html` + `sidepanel.js` + `manifest.json`. **Rules table, `content.js`, `background.js` all untouched.** `content.js:122`'s existing `payload.builder === "lennar"` check already does the right thing — when `payload.builder` becomes `"builder-x"` for another builder, the Lennar-specific skip-taxid override naturally stops applying.

**Workstream B runbook reframed as intake checklist, not architecture guide (v0.21).** Operator's sharpening mid-session: the runbook's primary value isn't documenting the architecture (which is now self-evident from the registry code) — it's capturing **what data has to be gathered from the builder before the architecture work can start**. Sections identified: NHC roster + email conventions; Communities (full Community DB column set per community); Property models; Listing agreement terms (become STATIC rules); MLS confirmation; Photos workflow (delivery mechanism, naming convention, reuse pattern); Builder-side contact person; **Cognito form authoring** as its own step (scoped NHC phone call walking Form 17's structure as a template, with Features tab called out as the expected divergence point since builder standard build packages differ substantially). Operator's community-data-from-MLS-history pattern added: for an established builder, pull N past listings per community from the builder's MLS history and extract Community DB columns from them — faster and more accurate than asking the builder's team to fill out a spreadsheet. Runbook distinguishes **data the builder provides** (HOA fees, model types, roster) from **data the operator extracts from MLS history** (Area, schools, path, Zip). Not written yet; outline captured in Workstream A session 1 session memory for session 2+ or dedicated Workstream B session.

**Multi-Builder Pin phrasing correction landed in this handoff (v0.21).** Parked since v0.7 — the Pin's MLS layer bullet listed `"Cognito Form Fields"` as universal across builders, which contradicted v0.7's decision that Form 17 is `LennarNewListingIntake` and each new builder gets its own Cognito Fields table in its own base. Fixed in Change 1 of this handoff; parked item removed from queue.

**Pattern lesson from Workstream A session 1 authoring: "read everything before writing anything" (v0.21).** CURSOR-HANDOFF-PROTOCOL-001 v1.1's "surgical, not generative" principle from v0.20's protocol-conformance incident extends to multi-file batched handoffs: before drafting the handoff, read every file touched (not just the main one), inventory the hooks, settle architectural ambiguity by walking the actual access points. The reading phase was the longest part of the session; the handoff itself drafted linearly from the inventory with no backtracking. First-pass Cursor apply with zero deviations is the direct ROI. Candidate addition to the parked protocol-doc refresh.

### Decisions Parked for Next Session
```

---

## Change 4 — Replace Decisions Parked section

**Find:**
```markdown
### Decisions Parked for Next Session

**Workstream A — Multi-builder architecture** (new, v0.20, Priority 1 for next session). Pre-scoped: Q1–Q7 shape questions settled. Config-driven registry pattern in the script dispatcher, one Railway build, one base per builder, per-builder Cognito forms, per-builder Drive folder roots, shared email template with builder interpolation, extension builder dropdown drives Cognito form selection. Includes Airtable Field Options flattening as a known-shape step when builder #2 gets added.

**Workstream B — Builder-onboarding runbook** (new, v0.20, Priority 2 after A lands). Base schema specification + builder-onboarding protocol folded in. One doc-heavy session.

**Workstream C — Housekeeping** (new, v0.20, deferred). Original Phase 4 scope: retire operational-session docs, archive Airtable Lennar Listings table, close SOP stubs, maintenance protocol. Lands when something specific forces it.

**Gmail self-send yellow-banner mitigation** (revised, v0.20). Plus-alias attempt failed — Gmail normalizes sub-addressing before the self-send check; alias stays on the wire but doesn't suppress the banner. Three paths: (1) live with it (operator's current choice — cosmetic, mail arrives, filters work); (2) aar-tc.com domain email via Squarespace (operator investigating at own pace — forwarding would break self-send heuristic; `to_address` swap in `app.py` becomes the Cursor handoff); (3) external SMTP via SendGrid/Mailgun/SES (overkill for cosmetic banner). No session trigger set.

**Standard-listing protocol** (revised, v0.20, parked indefinitely). `New_Seller_Side_Session_Protocol.md` v0.5 — known gaps (bookmarklet references, missing Airtable awareness, `LBGD`→`LGD` bug, Phase 1/2 terminology collision with project-level Phase 4). Reactivates only if standard-listing session work ever becomes a volume priority.

**Phase 3b — PandaDoc addendum create + magic-link send** (unchanged from v0.19, Priority 2 whenever unblocked). All design preserved; blocked on operator PandaDoc Starter subscription decision.

**Formal retirement of Airtable Lennar Listings table** (unchanged from v0.19, slated for Workstream C).

**Property Type multi-select orphan option cleanup** (unchanged from v0.8). Surfaced in parked-queue walkthrough this session but didn't ship.

**Payload Rules table description update via API blocked** (unchanged from v0.8). Conventions file now v0.6; manual paste still pending.

**`CURSOR-HANDOFF-PROTOCOL-001` protocol-doc refresh** (unchanged from v0.14, reinforced v0.20). Single-file surgical changes require reading the file and building real Find/Replace blocks; `handoffs/incoming/` + `handoffs/applied/` convention and batched-override pattern still need to land in the protocol doc.

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

**`SCRIPTS-*` doc_id convention decision** (unchanged from v0.14, low priority).

**Post Office and Subdivision closure.** Unchanged from v0.6.

**HOA Fee / Additional Fee DB column split** (unchanged from v0.9, low priority).

**Copyright Agreement multi-builder promotion decision** (unchanged from v0.9 — directly relevant to Workstream A, resolves when A lands).

**Whether Features' Matrix UI has real Section panels.** Unchanged from v0.6.

**Multi-Builder Pin phrasing correction** (unchanged from v0.7 — directly relevant to Workstream A, resolves when A lands).

**`Payload_Rules_Conventions.md` ID convention decision.** Unchanged from v0.8.

**NumberOfCars form constraints** (unchanged from v0.11, low priority).

**URL auto-derivation for the Lennar virtual tour pattern** (unchanged from v0.19, low priority).

**NHC name formatting edge cases** (unchanged from v0.19, informational).

**Removed from queue this session:**
- Airtable Field Options flattening as a standalone parked item (migration now scoped inside Workstream A at builder #2 add).
- Standard-listing protocol as an actively-queued item (parked indefinitely, no trigger).
- Sheet-row suffix abbreviation (shipped via `HANDOFF-2026-10-15-prep-polish.md`).
- Gmail banner "small Cursor handoff" scope (plus-alias failed; new scope requires external mail routing).
- v0.19 "Possible next-session moves" list (replaced by Workstream A/B/C structure).

---
```

**Replace:**
```markdown
### Decisions Parked for Next Session

**Workstream A session 2 — second-builder scaffold** (v0.21, Priority 1 for next session). Session 1 shipped the architecture (registry + dropdown + per-builder endpoint plumbing); session 2 proves the registry works beyond "Lennar is the only key." Scope: pick a target builder (real or hypothetical); walk Workstream B's intake checklist for that builder; scaffold a new Cognito form (clone-and-rename for hypothetical, author from NHC call for real); scaffold a new Airtable base with the four tables populated to minimum viable (Source Types enum, 1 Community DB row with path, a handful of rules exercising each Source Type); create a new Drive folder root; add a new key to `BUILDERS` in `builders.py`; switch extension dropdown to new builder and verify end-to-end. Includes Airtable Field Options flattening as a known-shape step at this point so the new builder's base is Free-tier-compatible from day one.

**Workstream B — Builder-onboarding runbook** (v0.21, Priority 2 after session 2+). Reframed from "architecture guide" to **intake checklist** — captures what data has to be gathered from the builder before architecture work can start. Primary audience: operator conducting a scoped NHC phone call. Sections outlined (see Workstream A session 1 session memory for the full list): NHC roster + email conventions, Communities, Property models, Listing agreement terms, MLS confirmation, Photos workflow, Builder-side contact, Cognito form authoring (Form 17 as template with Features tab as expected divergence point), community-data-from-MLS-history pattern, split between builder-provided and operator-extracted data. Writes much better against real code shape + a real target builder than against a hypothetical.

**Workstream C — Housekeeping** (unchanged from v0.20, deferred). Original Phase 4 scope: retire operational-session docs, archive Airtable Lennar Listings table, close SOP stubs, maintenance protocol. Lands when something specific forces it.

**Gmail self-send yellow-banner mitigation** (unchanged from v0.20). Operator's current choice: live with it (option 1). Option 2 (aar-tc.com domain mail via Squarespace) under investigation at operator's own pace. Option 3 (external SMTP) remains overkill for a cosmetic banner. No session trigger set.

**Standard-listing protocol** (unchanged from v0.20, parked indefinitely). Reactivates only if standard-listing session work ever becomes a volume priority.

**Phase 3b — PandaDoc addendum create + magic-link send** (unchanged from v0.19, Priority 2 whenever unblocked). All design preserved; blocked on operator PandaDoc Starter subscription decision.

**Formal retirement of Airtable Lennar Listings table** (unchanged from v0.19, slated for Workstream C).

**Property Type multi-select orphan option cleanup** (unchanged from v0.8).

**Payload Rules table description update via API blocked** (unchanged from v0.8). Conventions file at v0.6; manual paste still pending.

**`CURSOR-HANDOFF-PROTOCOL-001` protocol-doc refresh** (unchanged from v0.14, reinforced further v0.21). Candidate additions now include: (a) multi-file handoff authoring extension to the "read first, write literal" principle — read every file touched, not just the main one, before drafting Find/Replace blocks; (b) `handoffs/incoming/` + `handoffs/applied/` convention; (c) batched-override pattern (seven times running).

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

**`SCRIPTS-*` doc_id convention decision** (unchanged from v0.14, low priority).

**Post Office and Subdivision closure.** Unchanged from v0.6.

**HOA Fee / Additional Fee DB column split** (unchanged from v0.9, low priority).

**Copyright Agreement multi-builder promotion decision** (updated v0.21 — now resolves specifically when a second builder is scaffolded in Workstream A session 2+. Options at that point: promote to a shared MLS-layer registry OR copy per-builder STATIC in each builder's Rules table. Decision deferred to the moment a second CVRMLS builder actually exists.).

**Whether Features' Matrix UI has real Section panels.** Unchanged from v0.6.

**`Payload_Rules_Conventions.md` ID convention decision.** Unchanged from v0.8.

**NumberOfCars form constraints** (unchanged from v0.11, low priority).

**URL auto-derivation for the Lennar virtual tour pattern** (unchanged from v0.19, low priority).

**NHC name formatting edge cases** (unchanged from v0.19, informational).

**Sheet-name derivation in `write_listing_row`** (new v0.21, low priority). `sheets_services.py` currently hardcodes `'Lennar Listings'!` as the sheet name in the A1 range even though `tab_id` is now per-builder. For builder #2, either derive the sheet-name from the tab via the Sheets API or add `sheet_tab_name` to the registry alongside `sheet_tab_id`. Not blocking today — one builder, one tab name.

**Removed from queue this session:**
- Multi-Builder Pin phrasing correction (v0.7 → fixed as a bonus in this tracker handoff).
- Workstream A kickoff shape questions (Q1–Q7, from v0.20 — all folded into Workstream A session 1's shipped work).

---
```

---

## Change 5 — Replace Next Session Opening Move section

**Find:**
```markdown
## Next Session Opening Move

**Workstream A kickoff.** Per the Phase 4 re-scope landed this session, Workstream A (multi-builder architecture) is the real priority to unlock business dev. Six of seven shape questions settled this session; session should open on the implementation plan.

Suggested opening sequence:

1. **Confirm the 7 kickoff decisions still stand.** Operator may have thought of edge cases since.
2. **Draft the builder registry structure.** Config file vs. Airtable table — probably config file for now (easier to iterate), promote to Airtable later if operator wants editable-without-code-push.
3. **Identify the smallest viable Lennar refactor** that introduces the registry without changing current Lennar behavior. Should be a one-handoff change: extract Lennar's current hardcoded config into a `BUILDERS` dict with `"lennar"` as the only key; dispatcher reads from `BUILDERS[builder]` instead of `os.environ[...]`.
4. **Scope the extension builder-dropdown changes.** Side panel adds a builder select; selection triggers `/recent-entries?builder=X` and `/generate` with `builder` in the request body (or equivalent). Mockup-before-handoff pattern for UI changes (per v0.17 / v0.18).
5. **Prepare the empty second-builder scaffold** — new Cognito form, new Airtable base, new Drive folder root. Not populated with real builder data, just the structure. Proves the registry works end-to-end before a real builder onboarding happens.

Workstream A is 2–3 sessions of work, not one. Session 1 lands the architecture; session 2+ validates against a real or hypothetical builder #2.

**If Workstream A is not the move at session open:** aar-tc.com Squarespace mail investigation (operator decision); any production catches; Phase 3b activation if PandaDoc subscription lands.

At session close: bump tracker version to v0.21, refresh Decisions Parked and Next Session Opening Move. Substantive Workstream A decisions migrate to the Workstream B runbook once it exists.
```

**Replace:**
```markdown
## Next Session Opening Move

**Workstream A session 2 — second-builder scaffold.** Session 1 landed the architecture (registry refactor + builder dropdown + per-builder endpoint plumbing, all live in production, extension at 0.5.0, smoke-tested end-to-end). Session 2's job is proving the registry works beyond one key.

Suggested opening sequence:

1. **Confirm registry still feels right in production.** Any wrinkles the operator noticed since session 1 shipped. Any production catches on Lennar workflows that surfaced between then and now.
2. **Decide: hypothetical builder or real builder?** If real, which one is the operator targeting? Operator's business-dev conversations may have identified a specific candidate. If hypothetical, name it something concrete (e.g. "Ryan Homes", "DR Horton") to make the scaffold feel real.
3. **Walk Workstream B's intake checklist for the target builder.** Even if hypothetical, exercising the checklist surfaces gaps in the runbook. For a real builder, this is the scoped NHC call.
4. **Scaffold Cognito form.** For real builder, author from the NHC call (Form 17 as template, Features tab deliberately divergent per the builder's standard build packages). For hypothetical, clone Form 17 and rename.
5. **Scaffold Airtable base.** Four tables (Payload Rules, Cognito Fields, Source Types, Community Reference DB). Populate to minimum viable: Source Types enum (5 rows), 1 Community DB row with path, a handful of rules exercising each Source Type.
6. **New Drive folder root.** One-click in Google Drive.
7. **Add new key to `BUILDERS` in `builders.py`.** One-file Cursor handoff with the new registry entry.
8. **Switch extension dropdown to new builder.** Verify picker auto-refreshes with new builder's recent entries (empty for hypothetical, real for real builder). Verify a test entry generates correctly end-to-end.

Workstream A session 2 is 1–2 sessions depending on hypothetical-vs-real and how much Cognito form authoring the real builder requires.

**If Workstream A session 2 is not the move at session open:** Workstream B runbook outlining (now that registry code exists to point at); aar-tc.com Squarespace mail investigation; any production catches; Phase 3b activation if PandaDoc subscription lands.

At session close: bump tracker version to v0.22, refresh Decisions Parked and Next Session Opening Move. If session 2 scaffolds a real builder, the Workstream B runbook also starts getting written against that work.
```

---

## Change 6 — Append v0.21 to version history table

**Find:**
```markdown
| 0.20 | 2026-10-15 | Session close after triage + Phase 4 re-scope + Workstream A pre-scoping + two polish fixes (one successful, one failed). Session opened on v0.19's "no clearly-burning next priority" wrap with a short-sprint parked-item cleanup plan sketched (Gmail banner + Property Type cleanup + Payload Rules table description paste + CURSOR-HANDOFF-PROTOCOL-001 refresh); plan didn't ship as proposed — operator pivoted the session into deeper strategic discussions as parked items got surfaced.
```

**Replace:**
```markdown
| 0.21 | 2026-10-15 | Session close after Workstream A session 1 shipped end-to-end (registry refactor + extension builder dropdown). Second session of the day; v0.20 pre-scoped Workstream A (7 shape decisions, Phase 4 re-scope); v0.21 cashed the pre-scoping in. Session opened on confirming the 7 kickoff decisions still stand, then on operator's clarifying question "what actual work is there that can be done without knowing any details about a new potential builder?" — surfaced the buildable-now (registry pattern, dropdown UI, runbook template) vs. requires-real-builder-data (new Cognito form, new Airtable base, new Drive root, end-to-end validation) split. Buildable-now subset was substantial enough for session 1. Six design decisions settled shape-first before any code (D1 non-secret per-builder config into `builders.py` not Railway Variables; D2 explicit `builder` field in request body not form_id inference; D3 community resolver as registry key string pointing at a function in `COMMUNITY_RESOLVERS` dict, not a callable in config; D4 ship dropdown with Lennar as only option, `<h1>` drops "Lennar", persist selection to `chrome.storage.local`; R1 drop training-wheel "Builder" footer label; R3 builder change clears textarea + resets tab status dots + resets Phase 3 state + auto-refreshes picker — operator's addition mid-session). Workstream B runbook reframed from "architecture guide" to **intake checklist** — primary job is capturing what data has to be gathered from the builder before architecture work can start; Cognito form authoring added as its own step with Features tab called out as expected divergence point; community-data-from-MLS-history pattern added for established builders. Full code inventory conducted before any Find/Replace block written (lesson from v0.20's protocol-conformance incident, extended to multi-file handoffs). Shipped as 9-file batched-override Cursor handoff `HANDOFF-2026-10-15-workstream-a-builder-registry.md`: NEW `extension/scripts/builders.py` with `BUILDERS` registry (Lennar config: display_name, mls_tag, cognito_form_id, submitted_view_id, airtable_base_id + 4 table IDs, drive_properties_folder_id, sheet_id + tab_id + target_row, community_resolver key) + `DEFAULT_BUILDER = "lennar"` + `get_builder_config()` hard-fail-on-unknown dispatcher; `generate.py` across 11 blocks (`REQUIRED_ENV_VARS` shrinks to 3 shared secrets; `LENNAR_BASE_ID` + 4 table ID consts + `SUBMITTED_VIEW_ID` deleted; `_airtable_list_all` + `_resolve_community_key` + `_build_payload` + `fetch_recent_entries` + `generate_payload` + `main()` all take `builder` or `base_id` params; payload envelope sources `mls`/`builder` from registry; `COMMUNITY_RESOLVERS` dict + `--builder` CLI flag added); `app.py` across 7 blocks (all three endpoints accept optional `builder` defaulting to lennar; `/prepare-listing` sources per-builder IDs from registry); `sheets_services.py` across 2 blocks (`LENNAR_LISTINGS_TAB_ID`/`TARGET_ROW` deleted; `write_listing_row` takes keyword-only `tab_id` + `target_row`); `prep_email.py` 1 block (`build_prep_email` takes `builder_display_name`, interpolated into subject + opening sentence); `manifest.json` 0.4.0 → 0.5.0 + name/description updated; `sidepanel.html` adds builder dropdown + `<h1>` edit; `sidepanel.js` across 5 blocks (builder DOM ref + `getCurrentBuilder()` helper + persist to `matrixFillerBuilder` + load with validity check + thread `builder` into all three Railway calls + builder-change handler mirroring Clear plus picker auto-refresh); `Lennar_Extension_Build.md` Workstream A section appended. **First handoff of the project to land with zero Cursor deviations on first apply** — reading every file first before writing Find/Replace blocks delivered. All four Railway curl smoke tests passed (health check, no-builder-param defaults to lennar, explicit `builder=lennar` same result, unknown builder returns structured error). End-to-end extension smoke test passed: dropdown appeared, Lennar selected, picker auto-populated, entry Loaded, Matrix tabs filled, Generate listing prep fired, Drive folder + prep email (with new `(Lennar)` subject suffix) + Sheet row at A45:T45 all landed cleanly. Env var migration landed: 4 Railway env vars now unused (`AIRTABLE_LENNAR_BASE_ID`, `COGNITO_FORM_ID`, `LENNAR_PROPERTIES_FOLDER_ID`, `GOOGLE_SHEET_ID`); operator removes from Railway at leisure. Multi-Builder Pin phrasing correction (parked since v0.7) landed as bonus fix in this tracker handoff — Cognito Form Fields moved from MLS layer to Builder layer. Extension-contract-knowledge pattern (v0.14) held intact — Rules table + `content.js` + `background.js` untouched; `content.js:122`'s existing `payload.builder === "lennar"` check already does the right thing when payload.builder becomes something else. Full detail in `SESSION-HANDOFF-2026-10-15-WORKSTREAM-A-REGISTRY-LIVE.md` (operator-maintained session memory, outside the repo). |
| 0.20 | 2026-10-15 | Session close after triage + Phase 4 re-scope + Workstream A pre-scoping + two polish fixes (one successful, one failed). Session opened on v0.19's "no clearly-burning next priority" wrap with a short-sprint parked-item cleanup plan sketched (Gmail banner + Property Type cleanup + Payload Rules table description paste + CURSOR-HANDOFF-PROTOCOL-001 refresh); plan didn't ship as proposed — operator pivoted the session into deeper strategic discussions as parked items got surfaced.
```

---

## Post-apply

1. **Commit** with the following message:
   > `Phase tracker v0.20 → v0.21: Workstream A session 1 live`
   >
   > `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`
   > `Claude-Session: https://claude.ai/code/session_01VFSkC6LwzqHjnKtQ4wuANT`

2. **Do NOT look for or commit any session handoff doc.** Session handoffs live outside the repo (operator-maintained memory). The tracker's v0.21 version-history row carries all the detail the next session needs; a reference to `SESSION-HANDOFF-2026-10-15-WORKSTREAM-A-REGISTRY-LIVE.md` appears in the row text but **points at a file that is intentionally not in the repo** — do not resolve it as a missing-link error.

3. **No other file changes.** This handoff is intentionally tracker-only.

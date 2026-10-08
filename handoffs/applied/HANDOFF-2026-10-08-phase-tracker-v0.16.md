---
title: Cursor Handoff — Phase Tracker v0.15 → v0.16
document_id: HANDOFF-2026-10-08-phase-tracker-v0.16
date: 2026-10-08
project: AAR-TC Lennar Operational Project
---

Apply the changes below surgically to `docs/foundation/Lennar_Restructure_Phase_Tracker.md`. Do not modify anything not listed here.

**Commit message:** `Bump Phase Tracker v0.15 → v0.16 (Phase 2 server-side complete)`

---

## Change 1 — Version header bump

**Find:**

```
version: 0.15
version_date: 2026-10-07
```

**Replace with:**

```
version: 0.16
version_date: 2026-10-08
```

---

## Change 2 — Add Phase 2 Decisions Landed block to Current Phase section

**Note:** Phase 2 kickoff moved from "parked" (v0.15) to "in progress → server-side complete" (v0.16). The tracker's "Current Phase: Phase 0" header reflects the original phase-structure framing; the Decisions Landed section accumulates across phases without renaming the header. Add the new Phase 2 decisions as a continuation of the existing Decisions Landed block.

**Find:** (the last Decisions Landed entry from v0.15 — the "Pattern lesson from the YesNo bug" entry)

```
**Pattern lesson from the YesNo bug (v0.15).** Cognito's view-API and single-entry-API have different serialization behavior for the same field; view-API stringifies booleans to pretty-print the summary listing. Dispatcher debugging must happen against single-entry fetch shape, not view-API summary shape. Captured in convention #11's "view-API caveat" clause so this trap doesn't get rediscovered. Extension-contract-knowledge pattern from v0.14 continues — the script holds the type-normalization layer, not the Rules table and not the form.
```

**Replace with:**

```
**Pattern lesson from the YesNo bug (v0.15).** Cognito's view-API and single-entry-API have different serialization behavior for the same field; view-API stringifies booleans to pretty-print the summary listing. Dispatcher debugging must happen against single-entry fetch shape, not view-API summary shape. Captured in convention #11's "view-API caveat" clause so this trap doesn't get rediscovered. Extension-contract-knowledge pattern from v0.14 continues — the script holds the type-normalization layer, not the Rules table and not the form.

**Phase 2 kickoff — six decisions settled, FastAPI wrapper live on Railway (v0.16).** Session opened on Phase 2 per v0.15's parked next-session move; six kickoff decisions settled one at a time, shape-first per operator preference: (1) **Hosting: Railway** (already paying base tier for Aframe connector; zero additional cost). Operator probed alternatives — local-via-launch-at-login, menu-bar app wrapper, Docker Desktop, double-clickable `.command`, and whether the extension could run it all in-browser — all evaluated honestly before committing. The extension-in-browser option specifically got a full accounting (API keys publicly readable in extension code; Python → JavaScript rewrite of 111 rules; Cognito CORS from browser origins) and dismissed cleanly as a non-escape-hatch. (2) **Endpoint shape: `POST /generate` with `{"entry_id": N}` body, wrapped envelope response (`{"status": "ok", "payload": {...}, "warnings": [...]}` or `{"status": "error", "message": "..."}`), one-shot (no streaming).** Standard REST shape; envelope leaves room for structured warnings later. (3) **Extension surface + picker UX** (rolled together per operator reframing): extension calls a second endpoint `GET /recent-entries` on open to populate a picker; picker refreshes on open plus a manual refresh button; each row shows address + date/time; "Generate" button fires on the selection. Existing manual-paste surface stays as secondary. UX redesign explicitly deferred. (4) **Error handling: inline warnings for Railway-side failures, full detail to browser console. Matrix-fill behavior stays as-is.** No modals — operator-solo tool. (5) **Auth: shared secret in `X-API-Key` header.** Operator confirmed solo production use; extension-hardcoded-secret caveat noted and dismissed as not-today's-problem. (6) **Deploy-order flip: Railway first, then code.** v0.13's scaffold plan assumed code-local-then-deploy; this session configured Railway (empty service, failing deploy as placeholder) before shipping the FastAPI commit, trading local-testing cycle for faster path to real environment per operator's distaste for local testing + the core pipeline's existing cross-community validation.

**Railway deployment configured end-to-end** (v0.16). Six-step setup walked through one-click-at-a-time per operator's "comfortable with Railway but need guided step-by-step" framing: new project pointed at `aframe-mcp-connector` (private, GitHub integration already authorized from prior Aframe connector work); service renamed to `lennar-payload-script`; root directory set to `extension/scripts`; all six env vars populated via Variables UI (`AIRTABLE_PAT`, `AIRTABLE_LENNAR_BASE_ID=app78fMUwDNBHUZ6r`, `AIRTABLE_CVRMLS_BASE_ID=appEEYJ31UKuCnJ6v`, `COGNITO_API_KEY`, `COGNITO_FORM_ID=17`, `API_SHARED_SECRET` newly generated via `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`); public domain generated as `lennar-payload-script-production.up.railway.app`; listening port `8080` chosen (Railway's suggested default). Initial deploy failed as expected (no FastAPI app yet at `extension/scripts/`).

**FastAPI wrapper shipped as deliberately-batched multi-file Cursor handoff** (`HANDOFF-2026-10-08-phase-2-fastapi-wrapper.md`, commit `4958f01`, v0.16). Six changes across six files: `requirements.txt` adds `fastapi==0.115.*` + `uvicorn[standard]==0.32.*`; `.env.example` adds `API_SHARED_SECRET=`; `generate.py` adds `fetch_recent_entries()` + `_cognito_fetch_view_entry_ids()` helper above the untouched `generate_payload()`; new `app.py` with `/`, `/recent-entries`, `/generate` endpoints + `X-API-Key` auth check + CORS for `chrome-extension://.*` origins; new `Procfile` (`web: uvicorn app:app --host 0.0.0.0 --port 8080`); `README.md` appends Phase 2 section. Override explanation in handoff header per CURSOR-HANDOFF-PROTOCOL-001 — same batching pattern as the Phase 1 scaffold (v0.13) and pipeline-build (v0.14) handoffs; Cursor on Sonnet 5 High applied cleanly. Two flagged deviations in the apply report: (a) `generate_payload` real signature is `(entry_id: int, env: dict) -> str` returning a JSON string rather than the handoff's assumed `(entry_id) -> dict` — Cursor adapted `app.py` to load env once at startup and `json.loads()` the string result (anticipated via Change 3b's "confirm, don't edit" clause); (b) Cursor checked Cognito's actual REST API docs rather than taking the handoff's hand-waved `GET /forms/{id}/entries?view=&take=` at face value, confirmed the real "list a view's entries" operation is OData, structured `fetch_recent_entries` accordingly, and flagged live-API field-name verification as the thing most likely to need iteration under real testing.

**Cognito OData URL-shape bug surfaced and fixed in a one-iteration Cursor-driven diagnosis pass** (commit `bf0b529`, v0.16). First live `/recent-entries` call returned a structured `{"status":"error", "message":"500 Server Error ... for url: https://www.cognitoforms.com/api/odata/Forms(17)/Views(17-3)/Entries?%24select=Id"}` — handoff's try/except did its job cleanly, auth and handler both confirmed working, Cognito itself rejecting the OData call shape (the "second look" item Cursor had flagged). Operator attempted terminal-side diagnostic probing against Cognito direct (three URL-shape variations drafted by Claude), hit friction on shell-variable export mechanics and secret-paste copy-paste, switched approach to Cursor-driven diagnosis (Cursor has repo + `.env` in-session, can probe live Cognito without the operator shuttling terminal output). This was the right call — Cursor root-caused by probing the live endpoint directly rather than guessing from docs:
- **`"17-3"` is human/MCP shorthand** meaning "form 17, view 3" — the literal OData path segment is the bare integer `3`. `Views('17-3')` returned a `500 UnknownError` (that's the Railway 500 we saw); `Views(17)` returned a clean `404 EntryViewNotFound`; `Views(3)` returned `200`.
- **Cognito's `$select` on view entries isn't a general field-projection parameter.** Only accepts the bare literal `"Id"` — endpoint is specifically "retrieve entry IDs for all entries in a view" per Cognito's own docs.
- **Cognito silently ignores `$top`.** `$top=5` returned all 20 rows with a `200 OK`. Caught via an explicit count assertion before committing; would have been a silent bug if any Form 17 batch submission ever pushed the queue past the picker's requested limit.

Fix went beyond URL-patching: `fetch_recent_entries` architecturally rewritten as a flat-OData-read rather than the handoff's original N+1 pattern. The Submitted view's OData rows already carry everything the picker needs as flat underscore-joined fields (`Id`, `Intake_StreetNumber`, `Intake_StreetName`, `Entry_DateSubmitted`) — different shape from the nested dotted-path shape `_cognito_get` expects from REST `GetEntry`, so Cursor reads them directly rather than reusing that helper. One OData call per picker refresh, slice to `limit` in Python, 6× fewer API calls than the N+1 approach. `Entry_DateSubmitted` confirmed as the real timestamp field (`Entry_DateCreated` doesn't exist in the Submitted view's OData schema; kept as a defensive fallback).

**End-to-end live verification via Railway after the fix** (v0.16). All three endpoints responded correctly: `GET /` → `{"status":"ok","service":"lennar-payload-api","version":"0.1.0"}`; `GET /recent-entries` with `X-API-Key` → ok envelope with 5 most recent Form 17 submissions, Entry #18 displayed as `"3737 Larimar Lane"`; `POST /generate` with `{"entry_id": 18}` → ok envelope with the full Everstone SF payload matching the 2026-10-07 CLI known-good. **Phase 2 server-side complete.**

**Cursor-as-diagnostic-agent pattern landed as a deliberate choice, not a one-off** (v0.16). When operator terminal mechanics are the bottleneck for live-API probing, handing diagnosis off to Cursor (with repo access, env already loaded, and repeatable curl-via-shell in one session) resolves faster than Claude-session + operator-terminal round trips. The split from here forward: Claude session drafts the plan and interprets results, Cursor executes against the live system when operator terminal mechanics would stall the loop.

**`"17-3"` shorthand ambiguity flagged as a Lennar-wide doc concern** (v0.16, low priority). `Lennar_New_Listing_Protocol.md`'s connector-notes language has used `"17-3"` as human/MCP shorthand throughout — fine for human reading and MCP tool use (connector resolves internally), but silently wrong when passed to Cognito OData directly. Only `fetch_recent_entries` uses OData today, but a convention note prevents the next direct-OData author from repeating the trap.

**Extension-contract-knowledge pattern from v0.14 holds through Phase 2** (v0.16). FastAPI wrapper + OData flat-read + CORS config all live in the script layer. Rules table unchanged. Extension unchanged (next session). The v0.14 pattern — "the script carries responsibility for shape and contract knowledge unless Rules table intent is actually what's wrong" — survives Phase 2's server-side build intact.
```

---

## Change 3 — Replace Decisions Parked block

**Find:**

```
**Phase 2 kickoff — extension integration** (new, v0.15, Priority 1 for next session). CLI wrapped as an endpoint; "Generate from Cognito Entry" surface built on the extension; batch-picker UX per v0.13 pre-note (N most recent Form 17 entries, operator selects); Railway hosting per v0.13 scaffold decisions; endpoint shape (REST POST `/generate` with `entry_id` in body); error surfacing (unresolved community, Cognito 404, dispatcher RuntimeError).
```

**Replace with:**

```
**Phase 2 extension-side build** (new, v0.16, Priority 1 for next session). Picker UI alongside existing manual-paste surface, `GET /recent-entries` on extension open + refresh button, address + date/time per row, "Generate" button on selection firing `POST /generate`, inline error warnings on Railway failures, full detail to browser console. Railway URL and `API_SHARED_SECRET` stored in the extension — exact mechanism TBD during build (likely a small `extension/config.js` or similar, depends on current extension structure). **Read current `extension/sidepanel.html` + `sidepanel.js` + `content.js` + `background.js` + `manifest.json` first before any design work** — operator flagged mid-v0.16 that extension behavior doesn't exactly match a "generate and fill" framing; the picker-to-payload handoff point needs to converge with however the extension consumes a payload today.

**`Lennar_New_Listing_Protocol.md` `"17-3"` shorthand clarification** (new, v0.16, low priority — doc correction). Connector-notes language should distinguish human/MCP shorthand (`"17-3"` meaning "form 17, view 3") from literal OData path segment (bare integer `3`). Only `fetch_recent_entries` uses OData directly today, but a note prevents the next direct-OData author from repeating the 500-UnknownError trap.

**Cognito OData silently ignores `$top`** (new, v0.16, informational). Captured in-code as a comment in `fetch_recent_entries`; worth remembering if any future Cognito-view lookup wants server-side limiting — Cognito won't do it, slice in Python.

**`Entry_DateCreated` defensive fallback in `fetch_recent_entries`** (new, v0.16, informational). `Entry_DateSubmitted` is the real field; `Entry_DateCreated` doesn't exist in the Submitted view's OData schema. Fallback kept per graceful-degradation preference; harmless either way.
```

---

## Change 4 — Replace Decisions Parked block continued

**Find:**

```
**Rule 111 Finished / Part Finished / Unfinished crosswalk branches untested** (new, v0.15, low priority — production catch). First SF+Yes-basement listing in production exercises this. Operator-level hedge: spot-check `features_a.basement_foundation` on the generated payload before extension-fill. Current risk: silent wrong output if the FinishedStatus crosswalk is mis-implemented; low likelihood (code looks right, same block was author-reviewed in v0.11).
```

**Replace with:**

```
**Rule 111 Finished / Part Finished / Unfinished crosswalk branches untested** (unchanged from v0.15, low priority — production catch). First SF+Yes-basement listing in production exercises this. Operator-level hedge: spot-check `features_a.basement_foundation` on the generated payload before extension-fill. Current risk: silent wrong output if the FinishedStatus crosswalk is mis-implemented; low likelihood (code looks right, same block was author-reviewed in v0.11).
```

---

## Change 5 — Update remaining Decisions Parked entries' version marker

**Find:**

```
**Rule 110 SF+No garage branch untested** (new, v0.15, low priority — production catch). Unlikely to exercise ever (no detached-garage or garageless Lennar builds in the current catalog per v0.11); flagged for completeness.

**Watermark SF `new`-path rules untested** (new, v0.15, low priority — production catch). Rules 50/51/52/71/93/94/95 have never executed. When the first real Watermark listing lands, operator triages in-session. Possible that Watermark's parcels get tax records before that happens (parallel to Creekside 2026-08-11 and Everstone 2026-09-18 migrations) — in which case Watermark flips `new` → `taxid` in the Community DB and the `new`-path code stays untested indefinitely, which is fine.

**Spot-check-before-fill pattern as operator hedge** (new, v0.15, procedural). For any first-of-kind community × property-type combination, operator reviews the generated payload JSON before dropping into the extension. 30-second visual check; catches the known-untested branches above without blocking Phase 2.

**Cognito form field-type standardization** (new, v0.15, optional). If future form editing surfaces, standardizing Basement.Basement to a Choice field (matching Garage1) would let the script drop `_cognito_yesno`. Not recommended as proactive work — the helper is doing its job, reshaping a live form carries risk, and the helper carries forward institutional knowledge about the pattern.
```

**Replace with:**

```
**Rule 110 SF+No garage branch untested** (unchanged from v0.15, low priority — production catch). Unlikely to exercise ever (no detached-garage or garageless Lennar builds in the current catalog per v0.11); flagged for completeness.

**Watermark SF `new`-path rules untested** (unchanged from v0.15, low priority — production catch). Rules 50/51/52/71/93/94/95 have never executed. When the first real Watermark listing lands, operator triages in-session. Possible that Watermark's parcels get tax records before that happens — in which case Watermark flips `new` → `taxid` in the Community DB and the `new`-path code stays untested indefinitely, which is fine.

**Spot-check-before-fill pattern as operator hedge** (unchanged from v0.15, procedural). For any first-of-kind community × property-type combination, operator reviews the generated payload JSON before dropping into the extension. 30-second visual check; catches the known-untested branches above without blocking Phase 2.

**Cognito form field-type standardization** (unchanged from v0.15, optional). If future form editing surfaces, standardizing Basement.Basement to a Choice field (matching Garage1) would let the script drop `_cognito_yesno`. Not recommended as proactive work — the helper is doing its job, reshaping a live form carries risk, and the helper carries forward institutional knowledge about the pattern.
```

---

## Change 6 — Update "Removed from queue this session" block

**Find:**

```
**Removed from queue this session:**
- Phase 1 pipeline expansion to other 4 active communities (deliberately shelved — remaining 3 communities moved to accepted-production-catch status per the scope decision this session).
- Convention #11 proposal (completed — codified in `Payload_Rules_Conventions.md` v0.6).
```

**Replace with:**

```
**Removed from queue this session:**
- Phase 2 kickoff — extension integration planning (completed — six kickoff decisions settled, FastAPI wrapper live on Railway, both endpoints end-to-end validated against Entry #18 Everstone SF known-good). What remains is the extension-side build, which replaces this entry in the parked queue above.
```

---

## Change 7 — Replace Next Session Opening Move

**Find:** The entire "## Next Session Opening Move" section, from the heading through the final line before "## Parallel Workstreams". Replace with:

```
## Next Session Opening Move

**Phase 2 server-side is complete.** Railway endpoint live at `lennar-payload-script-production.up.railway.app`; both `/recent-entries` and `/generate` endpoints validated end-to-end against Entry #18 Everstone SF (payload matches the 2026-10-07 CLI known-good exactly). Next session is the extension-side build — picker UI, Generate button, Railway wiring — the actual operator-facing UX shift from "run CLI, paste JSON" to "click Generate from Cognito Entry."

Sequencing:

1. Read this handoff, `SESSION-HANDOFF-2026-10-08-PHASE-2-ENDPOINT-LIVE.md`, and the Phase Structure section's Phase 2 scope line. `Payload_Rules_Conventions.md` v0.6 at hand but not directly relevant to this session's work.

2. **Read the current extension code first before any design work.** Operator flagged mid-v0.16 that extension behavior doesn't exactly match a "generate and fill" framing. Files to review: `extension/sidepanel.html`, `extension/sidepanel.js`, `extension/content.js`, `extension/background.js`, `extension/manifest.json`. Understand the current paste-and-fill flow end to end before designing where the picker surface attaches and how its output converges with the existing payload consumption point.

3. Design decisions to settle at session open (shape-first per v0.16's framing style):
   - **Where the picker surface attaches in the existing UI.** New section at the top of the side panel? Below the existing paste box? Toggle between "pick" and "paste" modes? Depends on step 2's reading.
   - **How Railway URL + shared secret are configured in the extension.** Hardcoded in `extension/config.js`? Prompted on first run and stored in extension storage? Chrome-extension-standard options page? Simplest for a solo-operator tool is hardcoded config file.
   - **Picker refresh behavior details.** On-open happens via the extension lifecycle; refresh button needs a visible UI affordance (small reload icon? "Refresh" text button?). Match whatever existing paste surface uses visually.
   - **Row rendering specifics.** Address + date/time was settled in v0.16; exact date-time format (relative "2h ago" vs. absolute `2026-10-08 09:12`) is a smaller choice to make at build time.
   - **Loading / empty / error states.** What does the picker show while fetching? When Cognito returns no entries? When Railway is unreachable?

4. Scaffold the picker UI + wiring as a Cursor handoff. Likely multi-file (`sidepanel.html`, `sidepanel.js`, maybe `background.js`, maybe new `config.js`) — probably warrants the batched-handoff override pattern again.

5. End-to-end test from the extension: open extension → picker shows 5 most recent entries → click Entry #18 → "Generate" button → payload arrives → extension does whatever it does today with a payload → operator confirms Matrix fill behaves identically to the manual-paste path. Compare against the known-good manual-paste result from the 2026-10-07 Everstone validation.

**Not for next session:**
- Phase 3 (PandaDoc addendum generation + audit table + Drive folder + email trigger).
- Phase 4 (doc refactor, operational-session behavior retirement).
- Extension UI redesign (operator explicitly deferred in v0.16; picker gets added to the existing basic UI, redesign is its own pass).
- Remaining Phase 1 community validations (production catch pattern per v0.15).
- Doc-correction queue (parked items above remain low-priority).

At session close: bump tracker version, refresh Decisions Parked and Next Session Opening Move. Substantive decisions migrate to canonical foundation docs, not into this tracker.

```

---

## Change 8 — Add v0.16 row to Version History

**Find:** (the end of the Version History table — the final `|` character of the v0.15 row before the closing `---`)

```
| 0.15 | 2026-10-07 | Session close after Everstone SF validation + Cognito YesNo field-type bug fix + Phase 1 "complete enough" scope decision. Second community through the pipeline, first SF listing. Entry #18 (3737 Larimar Lane, Guilford Ranch, Chris MacLaird 2026-09-17) chosen for a single targeted verification run after operator pushback on the four-community full-validation plan ("what's the advantage of running all four?"). Entry #18 covers Rule 77 Neighborhood (Everstone-only Input_236 write), Rule 116 Style SF COGNITO Transform (Ranch → Input_541_18), Rule 110 Garage DERIVED SF branch, Rule 114 SF basement_yn, Rule 111 SF+No branch (Crawl Space Input_569_03), Rule 17 Virtual Tour tab-skip (VirtualTourLink null). First pipeline run came back with empty `features_a.basement_foundation` — Rules table pull confirmed Transform text correct (three-branch structure authored properly in v0.11); root cause isolated via direct `get_entry` fetch as a Cognito field-type mismatch. `BuildFeatures.Basement.Basement` was authored in Form 17 as a Cognito YesNo field (returns boolean `false`) while `BuildFeatures.Garage.Garage1` was authored as a Choice field with Yes/No text options (returns string `"Yes"`) — two deliberate form-authoring decisions made at different times that produce different single-entry API return types. The dispatcher at line 848 compared `basement == "No"` — `False == "No"` is False, fell through to `return []`. View-API's `get_entries_in_view` stringifies booleans for its summary listing, masking the mismatch until an actual single-entry read. Fix: `_cognito_yesno()` helper added to `generate.py` after `_cognito_multiselect_list`; normalizes boolean to `"Yes"`/`"No"`, strings pass through, None → `""`. Rule 111's basement read and Rule 114's basement read swapped to use the helper (prop_type and finished stay on `_cognito_get` — Choice fields). Pool Y/N (DB column, text) and Garage1 (Choice field) untouched. Rule 114 found to have the same latent flaw in the same handoff — Entry #18 coincidentally produced correct `basement_yn = "0"` via `False == "Yes"` → else → `"0"`, but on a SF+Yes-basement listing would have silently written `"0"` when Matrix needs `"1"`. First dispatcher case where validation surfaced a bug that would have produced wrong output without raising. Both fixes shipped via `HANDOFF-2026-10-07-generate-py-cognito-yesno.md`; re-run Entry #18 diffed cleanly with only `basement_foundation` changing `[]` → `["Input_569_03"]`. Extension fill succeeded on all 12 Matrix tabs cleanly, Features tab's Basement/Foundation shows Crawl Space checked. Convention #11 codified in `Payload_Rules_Conventions.md` v0.6: Cognito field-type normalization for Yes/No semantic fields, including the view-API-stringifies-booleans debugging caveat. Scope decision: remaining 3 communities (HM TH same-architecture-as-Creekside; HM SF basement-crosswalk-and-Rule-114-Yes-path still unknowns; Watermark SF new-path still unknowns) deferred to production catch, not dedicated validation sessions. Each production catch costs about the same as a verification session; Phase 2/3/4 value compounds; pipeline is production-usable for 2 confirmed communities today. Operator-level hedge for first-of-kind listings in remaining communities: 30-second spot-check of generated payload JSON before extension-fill. Phase 1 declared "complete enough"; Phase 2 (extension integration — CLI wrapped as endpoint, "Generate from Cognito Entry" surface built, batch-picker UX from v0.13 pre-note) is next session's opening move. Full detail in `SESSION-HANDOFF-2026-10-07-EVERSTONE-SF-VALIDATION-AND-YESNO-FIX.md`. |
```

**Replace with:**

```
| 0.15 | 2026-10-07 | Session close after Everstone SF validation + Cognito YesNo field-type bug fix + Phase 1 "complete enough" scope decision. Second community through the pipeline, first SF listing. Entry #18 (3737 Larimar Lane, Guilford Ranch, Chris MacLaird 2026-09-17) chosen for a single targeted verification run after operator pushback on the four-community full-validation plan ("what's the advantage of running all four?"). Entry #18 covers Rule 77 Neighborhood (Everstone-only Input_236 write), Rule 116 Style SF COGNITO Transform (Ranch → Input_541_18), Rule 110 Garage DERIVED SF branch, Rule 114 SF basement_yn, Rule 111 SF+No branch (Crawl Space Input_569_03), Rule 17 Virtual Tour tab-skip (VirtualTourLink null). First pipeline run came back with empty `features_a.basement_foundation` — Rules table pull confirmed Transform text correct (three-branch structure authored properly in v0.11); root cause isolated via direct `get_entry` fetch as a Cognito field-type mismatch. `BuildFeatures.Basement.Basement` was authored in Form 17 as a Cognito YesNo field (returns boolean `false`) while `BuildFeatures.Garage.Garage1` was authored as a Choice field with Yes/No text options (returns string `"Yes"`) — two deliberate form-authoring decisions made at different times that produce different single-entry API return types. The dispatcher at line 848 compared `basement == "No"` — `False == "No"` is False, fell through to `return []`. View-API's `get_entries_in_view` stringifies booleans for its summary listing, masking the mismatch until an actual single-entry read. Fix: `_cognito_yesno()` helper added to `generate.py` after `_cognito_multiselect_list`; normalizes boolean to `"Yes"`/`"No"`, strings pass through, None → `""`. Rule 111's basement read and Rule 114's basement read swapped to use the helper (prop_type and finished stay on `_cognito_get` — Choice fields). Pool Y/N (DB column, text) and Garage1 (Choice field) untouched. Rule 114 found to have the same latent flaw in the same handoff — Entry #18 coincidentally produced correct `basement_yn = "0"` via `False == "Yes"` → else → `"0"`, but on a SF+Yes-basement listing would have silently written `"0"` when Matrix needs `"1"`. First dispatcher case where validation surfaced a bug that would have produced wrong output without raising. Both fixes shipped via `HANDOFF-2026-10-07-generate-py-cognito-yesno.md`; re-run Entry #18 diffed cleanly with only `basement_foundation` changing `[]` → `["Input_569_03"]`. Extension fill succeeded on all 12 Matrix tabs cleanly, Features tab's Basement/Foundation shows Crawl Space checked. Convention #11 codified in `Payload_Rules_Conventions.md` v0.6: Cognito field-type normalization for Yes/No semantic fields, including the view-API-stringifies-booleans debugging caveat. Scope decision: remaining 3 communities (HM TH same-architecture-as-Creekside; HM SF basement-crosswalk-and-Rule-114-Yes-path still unknowns; Watermark SF new-path still unknowns) deferred to production catch, not dedicated validation sessions. Each production catch costs about the same as a verification session; Phase 2/3/4 value compounds; pipeline is production-usable for 2 confirmed communities today. Operator-level hedge for first-of-kind listings in remaining communities: 30-second spot-check of generated payload JSON before extension-fill. Phase 1 declared "complete enough"; Phase 2 (extension integration — CLI wrapped as endpoint, "Generate from Cognito Entry" surface built, batch-picker UX from v0.13 pre-note) is next session's opening move. Full detail in `SESSION-HANDOFF-2026-10-07-EVERSTONE-SF-VALIDATION-AND-YESNO-FIX.md`. |
| 0.16 | 2026-10-08 | Session close after Phase 2 kickoff + FastAPI wrapper live on Railway + Cognito OData URL-shape bug caught and fixed in one Cursor-driven iteration round. Six kickoff decisions settled one at a time, shape-first per operator preference: Railway hosting (already paying base tier for Aframe connector; alternative options including local-via-launch-at-login, menu-bar app wrapper, Docker Desktop, and the full "run it all in the extension" question evaluated honestly before committing); `POST /generate` with `{"entry_id": N}` body and wrapped envelope response (`{"status": "ok", "payload": {...}, "warnings": [...]}` or `{"status": "error", "message": "..."}`), one-shot; extension-side picker surface with `GET /recent-entries` on open + refresh button, address + date/time per row, "Generate" button on selection, existing manual-paste surface stays as secondary, UX redesign explicitly deferred; inline warnings for Railway-side failures + full detail to browser console, no modals; shared secret in `X-API-Key` header; deploy-order flipped from v0.13's code-local-first to Railway-first-with-empty-placeholder-deploy per operator distaste for local testing + core pipeline's existing cross-community validation. Railway setup walked through one-click-at-a-time (new project pointed at `aframe-mcp-connector`, service renamed to `lennar-payload-script`, root directory `extension/scripts`, all six env vars populated including newly-generated `API_SHARED_SECRET`, public domain `lennar-payload-script-production.up.railway.app`, listening port 8080). FastAPI wrapper shipped as deliberately-batched multi-file handoff (`HANDOFF-2026-10-08-phase-2-fastapi-wrapper.md`, commit `4958f01`): `requirements.txt` adds `fastapi==0.115.*` + `uvicorn[standard]==0.32.*`; `.env.example` adds `API_SHARED_SECRET=`; `generate.py` adds `fetch_recent_entries()` + `_cognito_fetch_view_entry_ids()` helper above untouched `generate_payload()`; new `app.py` with `/`, `/recent-entries`, `/generate` endpoints + `X-API-Key` auth + CORS for `chrome-extension://.*`; new `Procfile` (`web: uvicorn app:app --host 0.0.0.0 --port 8080`); `README.md` Phase 2 section appended. Cursor on Sonnet 5 High applied cleanly with two flagged deviations: `generate_payload` real signature is `(entry_id: int, env: dict) -> str` returning a JSON string (anticipated via Change 3b's "confirm, don't edit" clause — `app.py` adapted to `json.loads()` the result); Cursor also checked Cognito's actual REST API docs rather than taking the handoff's hand-waved endpoint shape at face value, confirmed OData as the real "list a view's entries" operation, flagged live-API field-name verification as the likely iteration point. First live `/recent-entries` call returned structured `{"status":"error","message":"500 Server Error ... for url: ...Views(17-3)/Entries?%24select=Id"}` — handoff's try/except did its job, auth and handler both confirmed working, Cognito itself rejecting the OData call shape. Operator terminal-side diagnostic probing hit shell-syntax friction; switched approach to Cursor-driven diagnosis (Cursor has repo + `.env` in-session, can probe Cognito direct without operator terminal round-trips) — resolved cleanly in one iteration (commit `bf0b529`). Three Cognito OData findings surfaced via live probing (not from docs): (1) `"17-3"` is human/MCP shorthand meaning "form 17, view 3"; literal OData path segment is the bare integer `3` — `Views('17-3')` returned a `500 UnknownError`, `Views(17)` cleanly `404`'d, `Views(3)` `200`'d; (2) Cognito's `$select` on view entries only accepts the bare literal `"Id"`, not a general field-projection parameter; (3) Cognito silently ignores `$top` (returned all 20 rows with a `200 OK` on `$top=5`) — caught via explicit count assertion before committing, would have been a silent bug on batch submissions. `fetch_recent_entries` architecturally rewritten in the fix pass as a flat-OData-read: Submitted view rows already carry everything the picker needs as flat underscore-joined fields (`Id`, `Intake_StreetNumber`, `Intake_StreetName`, `Entry_DateSubmitted`), 6× fewer API calls than the N+1 pattern the original handoff drafted. `Entry_DateSubmitted` confirmed as real timestamp field (`Entry_DateCreated` doesn't exist in the Submitted view's OData schema; kept as defensive fallback per graceful-degradation preference). End-to-end live verification via Railway succeeded on all three endpoints after fix: `GET /` returned health-check payload; `GET /recent-entries` with `X-API-Key` returned ok envelope with 5 most recent Form 17 submissions, Entry #18 as `"3737 Larimar Lane"`; `POST /generate` with `{"entry_id": 18}` returned ok envelope with full Everstone SF payload matching the 2026-10-07 CLI known-good. **Phase 2 server-side complete.** Cursor-as-diagnostic-agent pattern landed as deliberate choice (not one-off): when operator terminal mechanics bottleneck live-API probing, Cursor-driven diagnosis resolves faster than Claude-session + operator-terminal round trips. Extension-contract-knowledge pattern from v0.14 held through Phase 2 — FastAPI wrapper + OData flat-read + CORS config all live in script layer, Rules table unchanged. `"17-3"` shorthand ambiguity flagged as low-priority doc concern for `Lennar_New_Listing_Protocol.md`. Phase 2 extension-side build (picker UI + Generate button + Railway wiring) is next session's opening move; **read current `extension/sidepanel.html` + `sidepanel.js` + `content.js` + `background.js` + `manifest.json` first before any design work** — operator flagged mid-session that extension behavior doesn't exactly match a "generate and fill" framing. Full detail in `SESSION-HANDOFF-2026-10-08-PHASE-2-ENDPOINT-LIVE.md`. |
```

---

*AAR-TC Aframe Connector | Phase Tracker bump | 2026-10-08*

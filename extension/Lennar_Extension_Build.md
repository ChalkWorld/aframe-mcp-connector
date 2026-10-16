# Lennar CVRMLS Matrix Extension (POC)

Chrome extension (Manifest V3) — consolidates the bookmarklet-per-tab system into one tool. Auto-detects the current Matrix tab and fills its fields on click, replacing the need to click a separate bookmark per tab.

Scoped to Lennar/CVRMLS only for the POC. The `payload.mls` / `payload.builder` envelope keys and multi-MLS/multi-builder routing (see `docs/Payload_Envelope.md`) are a later-phase decision, not built into this POC.

Source logic to port from: `docs/cvrmls/CVRMLS_Bookmarklet_Source.md`.

---

## Build Status — Updated August 18, 2026

POC built, live-tested, and rebuilt once after live testing surfaced a workflow defect. Current state:

**Architecture: Chrome side panel, not a popup.** The first build used a popup; live testing found that Matrix's full-page-reload-per-tab-click closes popups automatically, wiping the pasted payload on every tab switch. Rebuilt on `chrome.sidePanel` (stable since Chrome 114) instead — a separate persistent document that survives the page reload underneath it.

**Files:**
- `manifest.json` — Manifest V3; `sidePanel`/`storage`/`activeTab` permissions; `side_panel.default_path` + `background.service_worker`, no `default_popup`
- `background.js` — registers `openPanelOnActionClick` on install
- `content.js` — tab detection (table below), all 11 tabs' fill logic, `TAB_DETECTED` announce-on-load, `FILL_PAYLOAD`/`GET_STATUS` message handlers
- `sidepanel.html` / `sidepanel.js` — payload textarea (persisted via `chrome.storage.local`), auto-fill/manual-confirm toggle (persisted, defaults off), per-tab status list, live field-write feedback

**New behavior beyond the original MVP scope:**
- Auto-fill toggle — on: fills immediately on tab detection; off: shows a "Fill current tab" button, the original manual checkpoint
- Per-tab status list (unvisited / pending / filled / error, color-coded) across all 11 tabs
- Field-write logging (`__writeLog`) threaded through every `setField`/`setCheck` call — a detection miss, a messaging miss, and a field-write miss now surface differently instead of all looking like silent success

**Features:** ported directly from the live `bookmarklets/features_a.html` / `bookmarklets/features_b.html` files, not from any doc — those files are the sole remaining authority since `AAR-TC-LENNAR-BM-SRC-001-FEA` was retired in Session 021. Verified by re-parsing both live files and diffing every checkbox-group array and scalar field against the port: 18 groups + 9 scalars (Features A) and 16 groups + 6 scalars (Features B), byte-for-byte, same order, same payload keys.

**Confirmed live by Andrew:** side-panel payload persistence across tab switches, manual fill, auto-fill, and a Features pass.

**One open item:** `Input_102_POTCLZ` (General Info disclosures checkbox group) reported as a missing field on a live taxid-path test. Confirmed not introduced by this build — the ported code is byte-identical to the existing source, which always attempts all 12 disclosure checkboxes on every fill regardless of payload content. Root cause (stale ID vs. conditionally-rendered checkbox vs. taxid-path-specific) not yet isolated — next step is direct DOM inspection in Matrix, not further payload analysis.

Cursor handoffs: `HANDOFF-2026-08-17-extension-poc-build.md` (initial build), `HANDOFF-2026-08-18-extension-sidepanel-conversion.md` (side-panel rebuild, commit `828c4e6`).

---

## Phase 2 Build Status — October 2026

Picker UI added at the top of the side panel. The operator picks a Form 17 entry from a dropdown, clicks Load, and the Phase 1 pipeline (hosted on Railway as a FastAPI service — `lennar-payload-script-production.up.railway.app`) returns the generated payload. The payload lands in the existing textarea and the existing fill flow (auto-fill toggle, Fill button, content-script messaging) takes over unchanged.

**New files:**
- `config.example.js` — Railway base URL + shared API secret template. Copied to `config.js` (git-ignored) locally and filled in with the real secret from Railway Variables.

**Changed files:**
- `manifest.json` — bumped to `0.3.0`, added `host_permissions` for the Railway domain.
- `sidepanel.html` — picker section at top (dropdown + Load button, refresh + "Updated Xm ago" below); Clear button added above the textarea; Fill button moved inline into the toggle row (now labeled just "Auto-fill" / "Fill tab").
- `sidepanel.js` — picker state, Railway `/recent-entries` and `/generate` calls, picker rendering, event wiring for Refresh/Load/Clear, hybrid time formatting (`2h ago` / `yesterday` / `Oct 7`), per-minute "Updated Xm ago" tick. Existing fill/messaging/persistence behavior preserved verbatim.

**Error states:**
- Railway unreachable on `/recent-entries` → inline `Can't reach Railway. Click refresh to retry.`
- Railway returns `{status: "error"}` on `/recent-entries` → inline `Failed to load entries: <message>`
- Railway unreachable on `/generate` → inline `Can't reach Railway. Try refresh or paste manually.`
- Railway returns `{status: "error"}` on `/generate` → inline `Generation failed: <message>`

Textarea paste fallback remains fully usable when Railway is down. Full error detail goes to the browser console.

**Config / secret handling:**
`config.js` is git-ignored. First-time setup: `cp extension/config.example.js extension/config.js`, open it, replace `PASTE_SECRET_HERE` with the `API_SHARED_SECRET` value from Railway → `lennar-payload-script` → Variables. Changing the secret later is the same workflow (edit `config.js`, reload the extension in `chrome://extensions`).

**Permission reload note:**
After pulling and reloading the extension in `chrome://extensions`, Chrome shows a one-time permission prompt for the new Railway host. Accept it; `fetch()` from the side panel will not reach Railway until this is granted.

**Live-tested by Andrew:** TODO after the first end-to-end extension run against Entry #18 Everstone SF.

Cursor handoff: `HANDOFF-2026-10-09-phase-2-extension-picker.md`.

---

## Phase 3a Build Status — October 2026

**Status: live.** Side panel adds a Generate listing prep button between the picker and the Clear row. One click fires `POST /prepare-listing` on the Railway service; Railway creates (or reuses) a Drive folder at `Lennar/Properties/{abbreviated address}` with a `Photos` subfolder nested inside, then sends a prep email to agentandrewrich@gmail.com with the three merge values (Property Address, Price, Community), the Composed Clause string ready to paste into PandaDoc, a link to the Drive folder, and a visually-stubbed "Send signing request" button. The stub becomes functional when Phase 3b lands.

Env vars added for Phase 3a: `GCP_CLIENT_ID`, `GCP_CLIENT_SECRET`, `GCP_REFRESH_TOKEN`, `LENNAR_PROPERTIES_FOLDER_ID`. OAuth scopes: Drive full + Gmail send.

Phase 3b (deferred — PandaDoc create+send automation, magic-link token, /send-signing endpoint) is a small additive handoff when the operator decides to pay for PandaDoc Starter.

---

## Tab Detection — Confirmed August 17, 2026

Live-tested via Claude in Chrome against a blank new-listing page. Each candidate ID checked for presence/absence across all 11 Lennar-scoped tabs (cross-checked, not just spot-checked) — zero collisions found.

| Tab | Detection signature |
|---|---|
| Listing Info | `document.getElementById('Input_29')` |
| Bath Info | `document.getElementById('Input_57')` |
| Features | `document.getElementById('Input_70')` (or `Input_571`) — **one physical tab**, see note below |
| General Info | `document.getElementById('Input_94')` |
| Remarks | `document.getElementById('Input_107')` |
| Fee Info | `document.getElementById('Input_109')` |
| Owner Info | `document.getElementById('Input_118')` |
| Agent/Office Info | `document.getElementById('Input_163')` |
| Showing Instructions | `document.getElementById('Input_136')` |
| Virtual Tour Info | `document.getElementById('Input_610')` |
| Internet Display Info | `document.getElementById('Input_227')` |

Room Info has no signature yet — out of scope for the Lennar POC (Lennar skips this tab entirely). Needs its own extraction pass if/when the extension expands to standard (non-builder) listings.

**Detection logic shape** — a simple if/else chain checked on every page load:
```js
if (document.getElementById('Input_29')) activeTab = 'Listing Info';
else if (document.getElementById('Input_57')) activeTab = 'Bath Info';
else if (document.getElementById('Input_70')) activeTab = 'Features';
// ...remaining tabs
```

*Illustrative only, from before the build existed.* `extension/content.js` is now canonical for the actual implementation — it uses an equivalent signature-table lookup (`TAB_SIGNATURES`), not this literal if/else chain. Update `content.js` first if detection logic ever changes; this doc's signature table above stays the confirmed-ID reference either way.

### Key architectural findings

- **URL-based detection is not viable.** Matrix uses a single opaque `c=` state token in the URL that stays byte-identical across every tab, regardless of which is active. Confirmed by direct comparison across 3 different tabs. DOM signature is the only detection method.
- **Matrix does a full page reload on every tab click**, even though the URL string doesn't change. Confirmed by setting a JS variable on one tab and observing it wiped after a manual tab click. This means a content script re-injects fresh on every tab switch automatically — no `MutationObserver` or polling needed to detect navigation. Chrome's normal content-script injection behavior is sufficient on its own.
- **Features is one physical Matrix tab**, not two. The `features_a`/`features_b` bookmarklet split was a build-organization choice (49 field groups was too much for one extraction/build pass) that never got recombined — confirmed by Andrew directly and verified live (`Input_70` and `Input_571` both present together on the same page). The extension should detect Features once and fire both fill functions together.
- **No cross-tab ID collisions found** anywhere in the documented field maps (cross-referenced all 11 tabs' full maps, including the ~605-field Features map) — consistent with Matrix assigning `Input_N` IDs from one global sequential pool across the entire multi-tab form rather than reusing numbers per tab. Strong evidence, not a formal guarantee — any future signature ID (e.g. for Room Info, or a future MLS) should get the same two-step check: cross-reference the field map, then live spot-check.

### Future Consideration (post-MVP, not in POC scope)

Since Matrix does a full reload per tab and the extension can already detect which tab it landed on, the extension could in principle click through the tab links itself (Listing Info → wait for reload → detect → fill → click next tab → ...), turning "auto-fill per tab" into full auto-navigation with a single button press. Deliberately deferred until after the MVP is built and tested — it removes the natural per-tab checkpoint where the user visually confirms each tab before moving on, and needs its own reload-timing and conditional-tab-skipping logic (e.g. Virtual Tour Info is skipped when no tour URL is present). Worth a dedicated design pass later, not bundled into the MVP.

**Eliminate manual payload paste.** The POC pastes the JSON payload into the extension's side panel by hand — simplest and lowest-risk for a first version, but Andrew wants this manual step removed in a later phase. Partially mitigated by the Aug 18 side-panel rebuild: the payload now persists across tab switches, so this is a paste-once-per-session problem rather than the original paste-once-per-tab problem. Still unbuilt, still worth solving. No mechanism chosen yet. Candidate directions, roughly in order of how proven the pieces already are:

- **Remote data store the extension polls or subscribes to.** Supabase is proven for exactly this role elsewhere in this org — the Chalk World project uses it as a typed message bus between a deployed runtime and a browser canvas (see `docs/connector/CONNECTOR_TECHNICAL_REFERENCE.md` §2). The nuance specific to *this* project: the Supabase MCP connector currently wired in here only exposes a read-only log-query tool to a Claude session (confirmed live 2026-08-17) — a session can't write to a Supabase table through a direct tool call today. That's a gap in this project's connector setup, not a limitation of Supabase itself. Chalk World's pattern points at the actual fix: a small deployed service holding its own Supabase credentials (same shape as the existing `aframe-mcp-connector` Railway app) that either a new Claude MCP tool calls, or the extension calls directly — matching how Chalk World's runtime already writes to Supabase in production. Airtable remains the lower-effort near-term option since its CRUD is already wired into this project specifically (Community Reference DB, Lennar Listings table); Supabase is the stronger long-term option given the working precedent, once a similar small write-capable service exists for it.
- **Native-messaging host** — a small local companion process the extension talks to directly. Most capable, most setup (needs a native host manifest installed once).
- **Localhost server** — simpler than native messaging, but needs a background process running plus `host_permissions` for `localhost`.

Needs its own design pass — not part of the MVP.

---

Internal layout finalized August 17–18, 2026 — see Build Status above for the current file list and architecture.

---

## Phase 3a.1 — Lennar Listings sheet row write

Added 2026-10-14. Expands `/prepare-listing` to also append a row to the "Lennar Listings" Google Sheet at intake time, after the Drive folder and prep email steps.

- Target sheet: "Lennar Listings Sheet - Gary Martin" tab "Lennar Listings" (env var `GOOGLE_SHEET_ID`)
- Target row: 45 (hardcoded; new row inserts there, pushes everything below down one)
- Script-written columns: A (Address), C (Current Price), E (Community), F (Status = "Input in progress"), L (Build Model), M (NHC), R (Exterior Photos), S (Interior Photos), T (Virtual Tour)
- Operator-fill columns: B (MLS#), D (New Price), G (Closing Date), H (Price change date), J (Notes), N (Tax ID), O (Closing Cost), P (Loan Type), Q (Co-op Agent)
- Photo cells: `=HYPERLINK(url, "Box link")` for Exterior/Interior, `=HYPERLINK(url, "Tour link")` for Virtual Tour when Cognito URL is populated; `"Reused from {ReusePhotosFromAPreviousListing}"` when URL blank and the reuse field is populated (Virtual Tour also uses this fallback — assumption: reused photos imply reused tour); cell blank otherwise.
- Community cell (E) uses the same `_resolve_community_key()` resolver `/generate` uses (Intake.Community + PropertyBasics.PropertyType → e.g. "Everstone SF"), reused here rather than the unsuffixed raw `Intake.Community` string already used in the prep email.
- Operator moves the row to its community block manually after the write.
- Sheet row write failure is non-fatal: logs the exception, appends a warning, lets the Drive + email succeed.

Env var added for Phase 3a.1: `GOOGLE_SHEET_ID`. OAuth scope added: Sheets (`https://www.googleapis.com/auth/spreadsheets`) — requires a re-minted `GCP_REFRESH_TOKEN` after this scope expansion.

Cursor handoff: `HANDOFF-2026-10-14-phase-3a1-sheets-write.md`.

---

## Workstream A — Multi-builder architecture (session 1)

Added 2026-10-15. Introduces a per-builder registry (`extension/scripts/builders.py`) and a builder dropdown in the extension side panel. Lennar behavior is preserved exactly; registry has `"lennar"` as its only key. Session 1 of 2–3; session 2+ validates against a real or hypothetical second builder.

### Server (Python)

- **New `extension/scripts/builders.py`** — holds per-builder, non-secret config (Airtable base ID, four Airtable table IDs, Cognito form ID + Submitted view ID, Drive folder ID, Google Sheet ID + tab ID + target row, display name, MLS tag, and the key naming which community resolver to use). Lennar's config is populated from values that previously lived as Railway env vars (`AIRTABLE_LENNAR_BASE_ID`, `COGNITO_FORM_ID`, `LENNAR_PROPERTIES_FOLDER_ID`, `GOOGLE_SHEET_ID`) plus module-level constants (table IDs, `SUBMITTED_VIEW_ID`, `LENNAR_LISTINGS_TAB_ID`, `TARGET_ROW`).
- **`REQUIRED_ENV_VARS`** shrinks to shared secrets only: `AIRTABLE_PAT`, `AIRTABLE_CVRMLS_BASE_ID`, `COGNITO_API_KEY`. Everything else is per-builder data in the registry.
- **`generate.py`** — `_build_payload`, `_resolve_community_key`, `fetch_recent_entries`, `generate_payload`, and `main()` all accept a `builder` parameter (defaults to `"lennar"`). `_airtable_list_all` now takes `base_id` as a parameter. Payload envelope's `"mls"` and `"builder"` keys are sourced from the registry. A new `COMMUNITY_RESOLVERS` dict maps a resolver key (`"lennar_default"`) to the actual resolver function; new builders either reuse `lennar_default` or register a new named resolver. New `--builder` CLI flag.
- **`app.py`** — `/generate` and `/prepare-listing` request bodies accept optional `builder`; `/recent-entries` accepts a `builder` query param. All three default to `"lennar"` when omitted, preserving backward compat with the 0.4.0 extension during the deploy window.
- **`sheets_services.py`** — `write_listing_row` takes `tab_id` and `target_row` as keyword-only parameters (passed in from the registry via `app.py`). Module-level `LENNAR_LISTINGS_TAB_ID` and `TARGET_ROW` constants removed.
- **`prep_email.py`** — `build_prep_email` accepts `builder_display_name` (defaults to `"Lennar"`) and interpolates it into the subject (`"Listing prep: 3435 Moonstone Dr (Lennar)"`) and opening sentence of the body.

### Extension

- **`sidepanel.html`** — new builder dropdown as the first element in the panel, visually matching the entry picker's `<select>` + section-separator style. `<h1>` text changed from `"Lennar CVRMLS Matrix Filler"` to `"CVRMLS Matrix Filler"` (builder is now shown in the dropdown; MLS stays in the title since the extension's `content_scripts.matches` still assumes CVRMLS).
- **`sidepanel.js`** — reads selected builder via `getCurrentBuilder()` at every Railway call; sends it as a `?builder=` query param on `/recent-entries` and as a `builder` field in the `/generate` and `/prepare-listing` request bodies. Persists the selection to `chrome.storage.local` under `matrixFillerBuilder`. Restores the persisted selection on panel open (falls back to `"lennar"` if the stored value is no longer a valid option). On builder change: clears the textarea, resets tab status dots, resets Phase 3 state to idle, and auto-refreshes the picker to pull the new builder's recent entries — same reset flow as the Clear button, plus the refresh.
- **`manifest.json`** — version `0.4.0` → `0.5.0`. Name changes from `"Lennar CVRMLS Matrix Filler (POC)"` to `"CVRMLS Matrix Filler"`. Description updated.

### Env var migration

Four Railway env vars are now unused and can be removed from Railway Variables at the operator's leisure once the Workstream A deploy is confirmed working. They do no harm staying set:

- `AIRTABLE_LENNAR_BASE_ID` → `builders.py["lennar"]["airtable_base_id"]`
- `COGNITO_FORM_ID` → `builders.py["lennar"]["cognito_form_id"]`
- `LENNAR_PROPERTIES_FOLDER_ID` → `builders.py["lennar"]["drive_properties_folder_id"]`
- `GOOGLE_SHEET_ID` → `builders.py["lennar"]["sheet_id"]`

Shared secrets that stay in Railway: `AIRTABLE_PAT`, `AIRTABLE_CVRMLS_BASE_ID`, `COGNITO_API_KEY`, `API_SHARED_SECRET`, `GCP_CLIENT_ID`, `GCP_CLIENT_SECRET`, `GCP_REFRESH_TOKEN`.

### Deploy order

Railway redeploys automatically on push. The server accepts optional `builder` on all three endpoints and defaults to `"lennar"` when omitted, so the 0.4.0 extension (which doesn't send `builder`) continues working during the brief window between Railway deploy and the operator reloading the 0.5.0 extension. No coordination required.

Cursor handoff: `HANDOFF-2026-10-15-workstream-a-builder-registry.md`.

---

## Workstream A — Multi-builder architecture (session 2)

Added 2026-10-16. Second builder scaffolded end-to-end to prove the registry pattern works beyond one key. Builder X is a hypothetical builder — its Cognito form (Form 18) is a clone of Lennar's Form 17, and its Airtable base (`appv1my0msvAyGpor`, "Builder X Payload Rules") is a schema clone of Lennar's with empty tables (Source Types enum seeded with the 5 standard rows). No real Builder X data; the scaffold's job is proving the wiring works.

### Server (Python)

- **`extension/scripts/builders.py`** — new `"builder-x"` entry with the full per-builder config (Cognito form 18 + Submitted view 5; Airtable base `appv1my0msvAyGpor` with the four table IDs; Drive folder `1xoRuD33NFme2lzmXHu7hHysCj48TIg1Q`; Google Sheet `1_KJ67--gajL-Bh-2ZhcZsLfXFDwYWnqBRacQ8ZuDMB4` with tab `206940732` named "Builder X Listings"; target row 5; display name "Builder X"; MLS tag `cvrmls`; community resolver `lennar_default` reused). Lennar's entry gains a `sheet_tab_name` field (`"Lennar Listings"`) to match the new registry shape.
- **`extension/scripts/sheets_services.py`** — `write_listing_row` takes a new keyword-only `sheet_tab_name` parameter and interpolates it into the A1 range (`f"'{sheet_tab_name}'!A..T"`), replacing the hardcoded `'Lennar Listings'`. Module docstring generalized to no longer describe a Lennar-specific target. Closes the v0.21 parked "Sheet-name derivation in `write_listing_row`" item.
- **`extension/scripts/app.py`** — `/prepare-listing` reads `sheet_tab_name` from the registry alongside `sheet_tab_id` and `sheet_target_row`, and passes it into `write_listing_row`.

### Extension

- **`sidepanel.html`** — new `<option value="builder-x">Builder X</option>` added to the builder dropdown after Lennar.
- **`manifest.json`** — version `0.5.0` → `0.6.0`. Description updated.

### Builder X Airtable base layout

Cloned from Lennar's schema with empty tables. Five tables:

- `Payload Rules` (`tblEm6RNl3EtFaUfM`) — primary field `Rule` (autoNumber), the full 15 columns including links to Source Types / Community / Cognito Field. `Property Type` multi-select is clean (`SF`, `TH` only — no orphans propagated from Lennar's parked v0.8 cleanup item).
- `Cognito Fields` (`tbl9LWfHDEuYtgFvv` for Lennar; `tblhZRN8ggMt0QS6O` for Builder X) — primary field `Field Path`.
- `Source Types` (`tblpqZHlIIgzk1UDl`) — primary field `Source Type`, seeded with the 5 enum rows (STATIC, COGNITO, COMMUNITY_DB, DERIVED, MANUAL_ENTRY). Notes column reworded to drop Lennar-specific examples.
- `Community Reference DB` (`tblTLN4bKIVlid5iO`) — primary field `Community`, same 34 columns as Lennar's including `Path` singleSelect and `Neighborhood` text. Empty.
- `Personnel Roster` (`tbl8ag9XE1VIES8tW`) — primary field `Name`, same role/status enums as Lennar. Empty. (Not referenced from the registry today; included for operational symmetry with Lennar's base.)

### Session 2 learnings

- **Cloning Form 17 in Cognito reassigns view IDs.** Form 17's Submitted view is `17-3` (OData segment `3`); Form 18's Submitted view is `18-5` (OData segment `5`). The registry can't assume view IDs are consistent across cloned forms — each builder's `submitted_view_id` must be looked up and set explicitly.
- **Cloning a Google Sheet preserves grid IDs on each tab.** Both Lennar's "Lennar Listings" tab and Builder X's "Builder X Listings" tab (which was cloned from it) share `gid=206940732`. The grid ID alone doesn't disambiguate between sheets — that's what `sheet_id` is for — but it does mean that for a cloned sheet the registry's `sheet_tab_id` can match the source.
- **Lennar `sheet_tab_name` field closes the v0.21 parked `write_listing_row` item.** The hardcoded `'Lennar Listings'` string in `sheets_services.py` was a known debt; session 2 forced the fix because Builder X's tab has a different name.

Cursor handoff: `HANDOFF-2026-10-16-workstream-a-builder-x.md`.

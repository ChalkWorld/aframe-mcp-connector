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

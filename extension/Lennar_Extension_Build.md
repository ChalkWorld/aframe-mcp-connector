# Lennar CVRMLS Matrix Extension (POC)

Chrome extension (Manifest V3) — consolidates the bookmarklet-per-tab system into one tool. Auto-detects the current Matrix tab and fills its fields on click, replacing the need to click a separate bookmark per tab.

Scoped to Lennar/CVRMLS only for the POC. The `payload.mls` / `payload.builder` envelope keys and multi-MLS/multi-builder routing (see `docs/Payload_Envelope.md`) are a later-phase decision, not built into this POC.

Source logic to port from: `docs/cvrmls/CVRMLS_Bookmarklet_Source.md`.

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

### Key architectural findings

- **URL-based detection is not viable.** Matrix uses a single opaque `c=` state token in the URL that stays byte-identical across every tab, regardless of which is active. Confirmed by direct comparison across 3 different tabs. DOM signature is the only detection method.
- **Matrix does a full page reload on every tab click**, even though the URL string doesn't change. Confirmed by setting a JS variable on one tab and observing it wiped after a manual tab click. This means a content script re-injects fresh on every tab switch automatically — no `MutationObserver` or polling needed to detect navigation. Chrome's normal content-script injection behavior is sufficient on its own.
- **Features is one physical Matrix tab**, not two. The `features_a`/`features_b` bookmarklet split was a build-organization choice (49 field groups was too much for one extraction/build pass) that never got recombined — confirmed by Andrew directly and verified live (`Input_70` and `Input_571` both present together on the same page). The extension should detect Features once and fire both fill functions together.
- **No cross-tab ID collisions found** anywhere in the documented field maps (cross-referenced all 11 tabs' full maps, including the ~605-field Features map) — consistent with Matrix assigning `Input_N` IDs from one global sequential pool across the entire multi-tab form rather than reusing numbers per tab. Strong evidence, not a formal guarantee — any future signature ID (e.g. for Room Info, or a future MLS) should get the same two-step check: cross-reference the field map, then live spot-check.

### Future Consideration (post-MVP, not in POC scope)

Since Matrix does a full reload per tab and the extension can already detect which tab it landed on, the extension could in principle click through the tab links itself (Listing Info → wait for reload → detect → fill → click next tab → ...), turning "auto-fill per tab" into full auto-navigation with a single button press. Deliberately deferred until after the MVP is built and tested — it removes the natural per-tab checkpoint where the user visually confirms each tab before moving on, and needs its own reload-timing and conditional-tab-skipping logic (e.g. Virtual Tour Info is skipped when no tour URL is present). Worth a dedicated design pass later, not bundled into the MVP.

---

Internal layout (manifest, content scripts, popup, etc.) is finalized during the build session.

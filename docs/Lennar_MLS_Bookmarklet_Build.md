# Lennar MLS Bookmarklet Build
**Document ID:** AAR-TC-LENNAR-BM-001
**Version:** 1.0 | *Last Updated: June 20, 2026*
*Living document — update as field mapping and build work progresses*

---

## What This Is

A bookmarklet-based system for automating MLS data entry in CVRMLS Matrix. Instead of manually reading each field and clicking each checkbox, a Claude session parses the listing email and outputs a JSON payload. You copy the payload, navigate to Matrix, and click a bookmark on each tab — fields populate instantly.

The goal is to eliminate the cognitive load of careful field-by-field reading during Matrix input. The clicking stays manual; the thinking is removed entirely.

---

## Architecture Decisions

**One bookmarklet per tab** — CVRMLS Matrix uses ASP.NET server-side tab rendering. Each tab is a separate page load; the other tabs' fields do not exist in the DOM until navigated to. A single fire-and-done bookmarklet is not possible. One bookmarklet per tab is the correct approach.

**Clipboard reader** — The bookmarklet reads a JSON payload from the clipboard rather than having listing data hardcoded in. This means the bookmarklet itself is permanent and never changes — only the clipboard payload changes listing to listing. The session generates the full payload; you copy it once and use it across all tabs.

**Static vs dynamic fields** — Many fields are identical across every Lennar listing (Structure = Frame, Siding = Vinyl, Roof = Dimensional, etc.). These are hardcoded into the bookmarklet as constants and fire automatically without needing to be in the clipboard payload. Only fields that vary listing to listing are pulled from the clipboard. This keeps the payload lean and the session output clean.

**Status tab — never automated** — The Status tab controls MLS activation (Coming Soon, Active, etc.). This tab is never touched by the bookmarklet system. Andrew controls activation manually. Hard rule.

**Bookmarklet installation method** — Chrome blocks pasting `javascript:` URLs directly into bookmark fields. The correct installation method is a local HTML launcher file with the bookmarklet as an `href` on an anchor element. Dragging that anchor to the bookmarks bar installs it without triggering Chrome's security restriction. A launcher file should be generated for each new bookmarklet.

**Custom Chrome extension — future state** — A custom Chrome extension is a cleaner long-term solution. It could detect the current Matrix tab automatically, hold the payload internally (no clipboard needed), and provide a single toolbar button. No App Store approval required — extensions load via `chrome://extensions` in developer mode. This is a Cursor project and the right target state once the field mapping is complete and the workflow is proven.

---

## POC Results — June 20, 2026

**Tab tested:** Bath Info
**Listing used:** 6035 Blue Iris Dr, Creekside Run TH

**What was proven:**
- Claude in Chrome extension can read DOM field IDs from a Matrix tab
- Field IDs follow a consistent, predictable naming convention: `Input_[N]` for form fields, `DV_[N]` for paired hidden display value fields
- JavaScript executing in the Matrix page context can set text field values and select dropdown values correctly
- The clipboard reader approach works — bookmarklet reads `navigator.clipboard.readText()`, parses JSON, maps values to field IDs
- The drag-to-bookmarks-bar HTML launcher method successfully installs a working bookmarklet in Chrome
- End-to-end flow confirmed: copy payload → navigate to tab → click bookmark → fields populate

**Bath Info field map:**

| Field | Input ID | Type | Notes |
|---|---|---|---|
| Basement — Bath Description | `Input_57` | select | Values: blank, `S`, `T`, `TS` |
| Basement — Full Baths | `Input_61` | text | |
| Basement — Half Baths | `Input_65` | text | |
| Level 1 — Bath Description | `Input_58` | select | Values: blank, `S`, `T`, `TS` |
| Level 1 — Full Baths | `Input_62` | text | |
| Level 1 — Half Baths | `Input_66` | text | |
| Level 2 — Bath Description | `Input_59` | select | Values: blank, `S`, `T`, `TS` |
| Level 2 — Full Baths | `Input_63` | text | |
| Level 2 — Half Baths | `Input_67` | text | |
| Level 3 — Bath Description | `Input_60` | select | Values: blank, `S`, `T`, `TS` |
| Level 3 — Full Baths | `Input_64` | text | |
| Level 3 — Half Baths | `Input_68` | text | |
| Level 4 — Bath Description | `Input_737` | select | Values: blank, `S`, `T`, `TS` |
| Level 4 — Full Baths | `Input_738` | text | |
| Level 4 — Half Baths | `Input_739` | text | |

**Bath Info rules:**
- Bath Description dropdown only needs a value when Full Baths > 0 — leave blank for half-bath-only levels
- All numeric fields require explicit `0` — Matrix flags empty fields on save
- Typical Lennar TH: Level 1 = 0 full / 1 half, Level 2 = 2 full / 0 half (TS), others = 0/0
- Typical Lennar SF: Level 1 = 0 full / 1 half, Level 2 = 2 full / 0 half (TS), others = 0/0 (varies)

---

## Payload Schema

The session outputs a single JSON object covering all tabs. Each bookmarklet reads only its own key.

```json
{
  "listing": { ... },
  "room": { ... },
  "bath": {
    "basement": { "desc": "", "full": "0", "half": "0" },
    "level1":   { "desc": "", "full": "0", "half": "1" },
    "level2":   { "desc": "TS", "full": "2", "half": "0" },
    "level3":   { "desc": "", "full": "0", "half": "0" },
    "level4":   { "desc": "", "full": "0", "half": "0" }
  },
  "features": { ... },
  "general": { ... },
  "remarks": { ... },
  "fee": { ... },
  "owner": { ... },
  "agent": { ... },
  "showing": { ... },
  "tour": { ... },
  "internet": { ... }
}
```

Schema for each tab section to be filled in as field mapping is completed.

---

## Tab Inventory

| Tab | Automate | Field Map | Bookmarklet | Notes |
|---|---|---|---|---|
| Status | ❌ Never | — | — | Controls MLS activation — Andrew only |
| Listing Info | ✅ | ⬜ Pending | ⬜ Pending | |
| Room Info | ✅ | ⬜ Pending | ⬜ Pending | |
| Bath Info | ✅ | ✅ Complete | ✅ Complete | POC tab — proven June 20, 2026 |
| Features | ✅ | ⬜ Pending | ⬜ Pending | 40+ fields; most are Lennar constants — static layer + small dynamic layer |
| General Info | ✅ | ⬜ Pending | ⬜ Pending | |
| Remarks | ✅ | ⬜ Pending | ⬜ Pending | Public remarks + agent comments — long text fields |
| Fee Info | ✅ | ⬜ Pending | ⬜ Pending | HOA data — largely static per community |
| Owner Info | ✅ | ⬜ Pending | ⬜ Pending | |
| Agent/Office Info | ✅ | ⬜ Pending | ⬜ Pending | Likely mostly static — Gary Martin info never changes |
| Showing Instructions | ✅ | ⬜ Pending | ⬜ Pending | Long text field |
| Virtual Tour Info | ✅ | ⬜ Pending | ⬜ Pending | Single URL field |
| Internet Display Info | ✅ | ⬜ Pending | ⬜ Pending | |

---

## Build Roadmap

### Phase 1 — Field Mapping (Claude in Chrome)
Use the Claude in Chrome extension to extract field IDs from each remaining tab. Navigate to the tab, ask the extension to list all `input`, `select`, and `textarea` element IDs and types. Paste results back into this document under the relevant tab section.

Do one tab per session to avoid burning excessive tokens. Features will take the most time — consider breaking it into sections.

### Phase 2 — Bookmarklet Build (Cursor)
Once field maps are complete, build the full bookmarklet set in Cursor:
- Define the complete payload JSON schema
- Build the clipboard-reader bookmarklet for each tab
- Identify all static Lennar constants and hardcode them
- Generate HTML launcher files for each bookmarklet

### Phase 3 — Session Integration
Update the session protocol so the payload generation is a standard output step:
- Session parses email → generates data sheet → generates MLS payload JSON
- Payload output is formatted as a copy-ready block
- Session notes which fields need manual attention (e.g. fields not in the Cognito form)

### Phase 4 — Chrome Extension (Future)
Once bookmarklets are proven across all tabs, build a custom Chrome extension:
- Single toolbar button replaces 12 bookmarks
- Auto-detects current Matrix tab
- Payload pasted into extension popup — no clipboard management needed
- Built in Cursor; installed via `chrome://extensions` developer mode

---

## HTML Launcher Files

Bookmarklet installation in Chrome requires dragging from an HTML anchor element — pasting `javascript:` URLs directly into bookmark fields is blocked by Chrome security.

**For each bookmarklet, generate an HTML launcher file** containing:
- The bookmarklet as an `href` on a styled anchor element
- Drag instruction: make bookmarks bar visible (Cmd+Shift+B), drag the button to the bar
- The JSON payload for that tab as a copy-ready block (for reference)

The Bath Info launcher (`bath_info_bookmarklet_clipboard.html`) serves as the template for all future launchers.

---

## Open Questions

- [ ] Does Matrix require any `change` or `input` events to be triggered after setting field values, or does it read raw field values on save? (Bath Info worked without firing events — confirm this holds for dropdowns and checkboxes on other tabs)
- [ ] How does Matrix handle checkbox fields in the DOM — are they `input[type=checkbox]` with a `checked` property, or something else? (Relevant for Features tab)
- [ ] Agent/Office Info — confirm Gary Martin's field values once mapped; if fully static, this bookmarklet needs no clipboard payload at all
- [ ] Owner Info — confirm what fields are here and whether Lennar as seller has a standard entry
- [ ] Features tab — identify which fields are Lennar constants vs listing-specific before building the bookmarklet

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Claude-facing document. Update version history and date with each revision.*

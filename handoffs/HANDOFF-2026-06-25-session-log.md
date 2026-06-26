# Cursor Handoff — Session 011 Log Entry + Repo Restructure
**Date:** 2026-06-25
**Protocol:** CURSOR-HANDOFF-PROTOCOL-001
**Target files:** `docs/Project_Session_Log.md` + repo structure

---

## Instructions

Two tasks in this handoff. Complete both before committing.

---

### Task 1 — Create `bookmarklets/` folder and move launcher files

Create a new `bookmarklets/` folder at the repo root. Move the following files from `docs/` into `bookmarklets/`:

- `lennar_bath_info.html`
- `lennar_general_info.html`
- `lennar_remarks.html`
- `lennar_fee_info.html`
- `lennar_owner_info.html`
- `lennar_agent_office_info.html`
- `lennar_showing_instructions.html`
- `lennar_virtual_tour_info.html`
- `lennar_internet_display_info.html`

`Lennar_MLS_Bookmarklet_Source.md` stays in `docs/` — no move needed.

---

### Task 2 — Append session log entry to `docs/Project_Session_Log.md`

**Find (end of file — append after this line):**

```
*AAR-TC Transaction Services | Session date: June 25, 2026*
```

**Append:**

```markdown
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
```

---

## Commit

```
chore: create bookmarklets/ folder, move launchers from docs/, add Session 011 log entry
```

---

*Two tasks, one commit.*

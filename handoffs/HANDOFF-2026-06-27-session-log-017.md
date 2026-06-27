---

## Session 017 — June 27, 2026

**Focus:** Repo restructure — universal CVRMLS / Lennar implementation layer separation; doc splits across all major bookmarklet docs

---

### What Was Done

**Repo file structure review and restructure**

Full file tree reviewed via Cursor. The `/docs` folder had grown to 20 flat files covering unrelated concerns with no organization. A two-layer directory structure was established and committed:

- `docs/cvrmls/` — universal CVRMLS Matrix docs (field maps, source JS, build roadmap, payload schema). MLS-specific, not builder-specific. The deployable package layer.
- `docs/lennar/` — Lennar implementation layer (customization docs, community lookup tables, builder statics, listing protocol). References the CVRMLS layer as its base.
- `docs/connector/` — Aframe connector technical reference, tool roadmap, API reference subdirectory
- `docs/protocols/` — session and workflow protocols (buyer-side, general ops, cursor handoff, extraction procedure, Gmail-to-Aframe, transaction workflows)
- `docs/project/` — project vision, session log, pre-automation notes

Bookmarklet files renamed — `lennar_` prefix dropped from all generic Matrix tab launchers. `lennar_features.html` kept as-is (genuinely Lennar-specific). Three stray root-level handoff files moved to `handoffs/applied/`.

**Vision articulated and captured**

The bookmarklet system is a universal CVRMLS Matrix data-entry toolkit — Lennar was the proving ground but the core belongs to any agent or TC working CVRMLS listings. The architecture is designed to extend:

- Additional MLS systems (`docs/rein/`, `docs/bright/`, `docs/caar/`) follow the same pattern as `docs/cvrmls/` — each gets its own field maps, source file, and build doc
- Additional builders follow the same pattern as `docs/lennar/` — each gets its own subfolder with community tables, statics, and customization docs referencing the relevant MLS layer
- The Chrome extension (future state) uses `payload.mls` and `payload.builder` header keys to route to the right field map and customization layer automatically
- The universal package is what gets zipped and handed to another agent or TC — no Lennar or AAR-TC-specific content in it

**Doc splits — four files retired, eight new files created**

Each major doc was split into a universal CVRMLS file and a Lennar-specific file. The separation rule: if it's a Matrix field ID, option value, or CVRMLS behavioral note → CVRMLS doc. If it's a hardcoded Lennar value, community lookup table, or Lennar operational note → Lennar doc.

| Retired | Replaced By |
|---|---|
| `Lennar_MLS_Bookmarklet_Source.md` | `docs/cvrmls/CVRMLS_Bookmarklet_Source.md` + `docs/lennar/Lennar_Bookmarklet_Customization.md` |
| `Lennar_MLS_Bookmarklet_Build.md` | `docs/cvrmls/CVRMLS_Bookmarklet_Build.md` + `docs/lennar/Lennar_Bookmarklet_Build_Notes.md` |
| `Lennar_MLS_Features_Field_Map.md` | `docs/cvrmls/CVRMLS_Features_Field_Map.md` (Lennar schema is the Lennar authority — no separate Lennar field map needed) |
| `Non_Lennar_Payload_Schema.md` | `docs/cvrmls/CVRMLS_Payload_Schema.md` (correctly reframed as universal baseline) |

Key decisions made during the split work:
- The universal source file uses "Universal Variant" instead of "Non-Lennar Variant" throughout — the non-Lennar variant is the canonical base; Lennar adds on top
- The Lennar customization doc lists what Lennar does — if a field isn't listed, skip it. No redundant skip lists.
- The Features field map is pure Matrix reference (Input IDs and option values only). The Lennar Features Payload Schema (`AAR-TC-LENNAR-BM-SCH-001`) is the Lennar authority for Features — a separate Lennar Features field map is redundant.
- The `Non_Lennar_Payload_Schema.md` was actually the universal CVRMLS baseline all along — renamed and reframed accordingly as `CVRMLS_Payload_Schema.md` (`AAR-TC-CVRMLS-PL-001`)

**New document IDs established**

| Document | New ID |
|---|---|
| `CVRMLS_Bookmarklet_Source.md` | `AAR-TC-CVRMLS-BM-SRC-001` |
| `CVRMLS_Bookmarklet_Build.md` | `AAR-TC-CVRMLS-BM-001` |
| `CVRMLS_Features_Field_Map.md` | `AAR-TC-CVRMLS-BM-001-FEA` |
| `CVRMLS_Payload_Schema.md` | `AAR-TC-CVRMLS-PL-001` |
| `Lennar_Bookmarklet_Customization.md` | `AAR-TC-LENNAR-BM-CUST-001` |
| `Lennar_Bookmarklet_Build_Notes.md` | `AAR-TC-LENNAR-BM-NOTES-001` |

**Gap identified — Lennar New Listing Protocol stale on Features**

The Lennar New Listing Protocol references Features statics that don't match the confirmed values in `Lennar_Features_Payload_Schema.md` (v1.1, confirmed via live testing 2026-06-26). The schema is the authority. Protocol needs a patch handoff — carry to Session 018 before any Features build work.

---

### Cursor Handoffs Produced This Session

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-06-26-repo-restructure.md` | Repo directory restructure — new `docs/` subdirs, bookmarklet renames, root handoff cleanup |
| `HANDOFF-2026-06-27-source-file-split.md` | Add `CVRMLS_Bookmarklet_Source.md` + `Lennar_Bookmarklet_Customization.md`; retire `Lennar_MLS_Bookmarklet_Source.md` |
| `HANDOFF-2026-06-27-build-doc-split.md` | Add `CVRMLS_Bookmarklet_Build.md` + `Lennar_Bookmarklet_Build_Notes.md`; retire `Lennar_MLS_Bookmarklet_Build.md` |
| `HANDOFF-2026-06-27-features-field-map-split.md` | Add `CVRMLS_Features_Field_Map.md`; retire `Lennar_MLS_Features_Field_Map.md` |
| `HANDOFF-2026-06-27-payload-schema-restructure.md` | Add `CVRMLS_Payload_Schema.md`; retire `Non_Lennar_Payload_Schema.md`; update refs in Lennar schema |
| `HANDOFF-2026-06-27-session-log-017.md` | This entry |

---

### Documents Created This Session

| Document | ID | Location |
|---|---|---|
| `CVRMLS_Bookmarklet_Source.md` | `AAR-TC-CVRMLS-BM-SRC-001` | `docs/cvrmls/` |
| `CVRMLS_Bookmarklet_Build.md` | `AAR-TC-CVRMLS-BM-001` | `docs/cvrmls/` |
| `CVRMLS_Features_Field_Map.md` | `AAR-TC-CVRMLS-BM-001-FEA` | `docs/cvrmls/` |
| `CVRMLS_Payload_Schema.md` | `AAR-TC-CVRMLS-PL-001` | `docs/cvrmls/` |
| `Lennar_Bookmarklet_Customization.md` | `AAR-TC-LENNAR-BM-CUST-001` | `docs/lennar/` |
| `Lennar_Bookmarklet_Build_Notes.md` | `AAR-TC-LENNAR-BM-NOTES-001` | `docs/lennar/` |

### Documents Retired This Session

| Document | Reason |
|---|---|
| `Lennar_MLS_Bookmarklet_Source.md` | Split into CVRMLS universal + Lennar customization |
| `Lennar_MLS_Bookmarklet_Build.md` | Split into CVRMLS universal + Lennar build notes |
| `Lennar_MLS_Features_Field_Map.md` | Replaced by CVRMLS field map + Lennar schema doc |
| `Non_Lennar_Payload_Schema.md` | Renamed and reframed as `CVRMLS_Payload_Schema.md` |

---

### Open Items Carried Forward

- **Lennar New Listing Protocol — Features statics patch** — protocol is stale vs confirmed schema; patch handoff needed before any Features build work in Session 018
- **Street Suffix stored values (`Input_37`)** — Session 017 agenda item 2; not reached
- **County/City cascade confirmation** — Session 017 agenda item 3; not reached
- **Listing Info bookmarklet — New path + non-Lennar variant** — Session 017 agenda item 4; not reached
- **Features A + B smoke tests** — non-Lennar Features launchers not yet tested in live Matrix session
- **Promote `list_transaction_events` Tier 4 → Tier 3** in `CONNECTOR-ROAD-001`
- **Megan Cook onboarding 6/30** — sales rep roster by community pending
- **Bethanne Elamghari agent profile** — fill as files come in
- **Seller-Side Contract Update Protocol** — planned, not created
- **Photo sorter POC** — `AAR-TC-LENNAR-PHOTO-001`
- **Reverse Prospecting workflow**
- **`f_HOAtruefalse` merge field** — possible duplicate of `f_HOA`; investigate
- **Non-Lennar bookmarklet builds** — Features A + B are the only non-Lennar launchers built; remaining tabs still need non-Lennar variants
- **Room Info launcher** — non-Lennar only; REPEAT0 open question still unresolved
- **Features A + B launchers** — confirm committed to `bookmarklets/` in repo
- **Cross-reference audit** — internal doc references throughout the repo now point to old paths from before the restructure; low priority but should be swept before external sharing

---

### Key Decisions (Session 017)

- Bookmarklet system is a universal CVRMLS toolkit — Lennar is one implementation on top of it
- Architecture is MLS-scoped, not builder-scoped — future MLS systems get their own `docs/[mls]/` layer; builders get their own `docs/[builder]/` layer referencing the relevant MLS layer
- Chrome extension future state uses `payload.mls` + `payload.builder` header keys to route to the correct field map and customization layer
- Universal package = zip file deployable by any CVRMLS agent or TC — no AAR-TC or Lennar content in it
- Lennar Features Payload Schema (`AAR-TC-LENNAR-BM-SCH-001`) is the Lennar Features authority — separate Lennar Features field map is redundant; dropped
- `Non_Lennar_Payload_Schema.md` was always the universal baseline — correctly renamed `CVRMLS_Payload_Schema.md`
- Cross-reference debt from the restructure is known and accepted — sweep when approaching external sharing milestone

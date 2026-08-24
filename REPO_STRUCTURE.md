# Repo Structure — Quick Reference
**Last Updated:** August 24, 2026 (regenerated from actual repo structure — see Layer Logic for `docs/operational/` note)

---

## Top Level

```
aframe-mcp-connector/
├── bookmarklets/       ← HTML launcher files — one per Matrix tab
├── docs/               ← All documentation — see breakdown below
├── extension/          ← Chrome extension (Lennar/CVRMLS POC, Manifest V3, side panel) — see extension/ section below
├── handoffs/           ← Cursor handoff files
│   ├── applied/        ← Committed and executed handoffs (historical record)
│   └── incoming/       ← Staging area for handoffs awaiting execution
├── src/                ← Connector source code (aframe.js, index.js)
├── .env.example
├── package.json
└── README.md
```

---

## `bookmarklets/`

Universal CVRMLS Matrix tab launchers. One HTML file per tab. Builder-specific launchers (e.g. `lennar_features.html`) are the exception — named explicitly.

---

## `extension/`

Chrome extension (Manifest V3) — POC consolidating the bookmarklet-per-tab system into one tool. Auto-detects the current Matrix tab and fills its fields on click, replacing the need to click a separate bookmark per tab. Scoped to Lennar/CVRMLS only for the POC — the `payload.mls` / `payload.builder` envelope keys and multi-MLS/multi-builder routing are a later-phase decision, not built into the POC.

Internal layout (manifest, content scripts, popup, etc.) is finalized during the build session — this entry reserves the top-level location and scope statement ahead of that work.

---

## `docs/`

```
docs/
├── Payload_Envelope.md ← Cross-MLS/cross-builder runtime payload envelope contract
│
├── cvrmls/             ← Universal CVRMLS Matrix layer
│   ├── Bookmarklet build roadmap
│   ├── Bookmarklet source JS (universal variants)
│   ├── Features tab field map
│   ├── County/city reference table
│   └── Payload schema (universal baseline)
│
├── lennar/             ← Lennar builder authoring layer — frozen historical reference now that
│   │                      docs/operational/lennar/ has stood up (see Layer Logic)
│   ├── Community reference database (frozen — superseded by Airtable Community Reference DB)
│   ├── New listing protocol (frozen v2.9 — superseded by docs/operational/lennar/Lennar_New_Listing_Protocol.md)
│   ├── Payload schema (frozen v1.5 — superseded by docs/operational/lennar/Lennar_Payload_Schema.md)
│   └── Photo preprocessing (local AI photo sorter — not superseded, still active)
│
├── operational/        ← Operational doc sets for downstream Claude projects that execute
│   │                      (rather than author) builder-specific workflows
│   └── lennar/         ← Lennar operational doc set — current edit target (AAR-TC Lennar Operational Project)
│       ├── Extension reference (LENNAR-OPS-EXT-REF-001)
│       ├── New listing protocol (LENNAR-OPS-PROTOCOL-002)
│       ├── Payload examples (LENNAR-OPS-EXAMPLES-001)
│       ├── Payload schema (LENNAR-OPS-SCHEMA-001)
│       └── Project protocol (LENNAR-OPS-PROTOCOL-001)
│
├── mls-input/          ← MLS-side input/extraction procedures
│   └── Aframe Swagger endpoint extraction procedure
│
├── connector/          ← Aframe connector technical reference
│   ├── Technical reference
│   ├── Tool roadmap
│   └── aframe-api-reference/   ← Aframe API endpoint reference (19 endpoint subdocs + README)
│
├── protocols/          ← Session and workflow protocols
│   ├── General operations protocol (AAR-TC)
│   ├── New buyer-side session protocol
│   ├── New seller-side session protocol
│   ├── Seller under-contract session protocol
│   ├── Transaction workflows framework
│   ├── Gmail-to-Aframe workflow
│   └── Cursor handoff protocol
│
└── project/            ← Project-level tracking and vision
    ├── Agent profiles
    ├── Pre-automation notes
    ├── Project vision
    ├── Session log (v1, archived)
    └── Session log v2 (current)
```

---

## Layer Logic

**`docs/cvrmls/`** — anything that describes CVRMLS Matrix itself: field IDs, option values, tab structure, cascade behavior, universal JS variants. Anyone working any CVRMLS listing uses these docs. Future MLS systems follow the same pattern: `docs/rein/`, `docs/bright/`, etc.

**`docs/lennar/`** — anything Lennar-specific: hardcoded statics, community lookup tables, `isLennar` flag behavior, listing protocol tied to Carly/Megan emails. This is the authoring-lineage layer, tracked in this same repo. Now that `docs/operational/lennar/` has stood up, the two docs it explicitly supersedes — `Lennar_Payload_Schema.md` (frozen at v1.5) and `Lennar_New_Listing_Protocol.md` (frozen at v2.9) — are frozen historical reference at their original paths (not moved, not archived elsewhere). `Lennar_Community_Reference_Database.md` is separately superseded by the Airtable Community Reference DB table. `Lennar_Photo_Preprocessing.md` is not superseded by anything and remains active. Future builders follow the same pattern: `docs/[builder]/`, referencing the relevant MLS layer.

**`docs/operational/`** — Operational doc sets for downstream Claude projects that execute (rather than author) builder-specific workflows. Each subdirectory (`docs/operational/lennar/`, future `docs/operational/<builder>/`) contains a scoped, self-contained set of docs derived from the corresponding authoring folder. Operational sets are the current edit target once created; corresponding authoring folders (e.g. `docs/lennar/`) freeze as historical reference after their operational counterpart stands up. **All five `docs/operational/lennar/` docs are tracked in this git repo** — they are not maintained externally. `Issue_Report_Resolution_Log.md` (referenced elsewhere in the AAR-TC Lennar Operational Project) does not exist anywhere in this repo, tracked or untracked, as of this update — confirm with the operational project owner whether it lives outside git or hasn't been created yet.

**`docs/mls-input/`** — MLS-side input/extraction procedures not specific to any one MLS or builder (currently: the Aframe Swagger endpoint extraction procedure).

**`bookmarklets/`** — deployment artifacts generated from the source files in `docs/cvrmls/`. Universal tabs have generic names; builder-specific launchers are named explicitly.

---

*Updated at the end of each session where structure changes. Individual filenames in GitHub.*

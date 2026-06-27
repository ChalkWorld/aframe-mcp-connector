# Repo Structure — Quick Reference
**Last Updated:** June 27, 2026 (Session 017 restructure)

---

## Top Level

```
aframe-mcp-connector/
├── bookmarklets/       ← HTML launcher files — one per Matrix tab
├── docs/               ← All documentation — see breakdown below
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

## `docs/`

```
docs/
├── cvrmls/             ← Universal CVRMLS Matrix layer
│   ├── Bookmarklet build roadmap and field maps
│   ├── Bookmarklet source JS (universal variants)
│   ├── Features tab field map
│   ├── Payload schema (universal baseline)
│   └── aframe-api-reference/   ← Aframe API endpoint reference (subdocs)
│
├── lennar/             ← Lennar builder implementation layer
│   ├── Bookmarklet customization (Lennar variants + community lookup tables)
│   ├── Bookmarklet build notes (community tables, fee data, launcher status)
│   ├── Features bookmarklet source (Lennar variant JS)
│   ├── Features payload schema (Lennar authority — HC/DYN/CL/EXCL)
│   └── New listing protocol
│
├── connector/          ← Aframe connector technical reference
│   ├── Technical reference
│   └── Tool roadmap
│
├── protocols/          ← Session and workflow protocols
│   ├── General operations protocol
│   ├── Buyer-side session protocol
│   ├── Transaction workflows framework
│   ├── Gmail-to-Aframe workflow
│   ├── Cursor handoff protocol
│   └── Extraction procedure
│
└── project/            ← Project-level tracking and vision
    ├── Project vision
    ├── Session log
    └── Pre-automation notes
```

---

## Layer Logic

**`docs/cvrmls/`** — anything that describes CVRMLS Matrix itself: field IDs, option values, tab structure, cascade behavior, universal JS variants. Anyone working any CVRMLS listing uses these docs. Future MLS systems follow the same pattern: `docs/rein/`, `docs/bright/`, etc.

**`docs/lennar/`** — anything Lennar-specific: hardcoded statics, community lookup tables, `isLennar` flag behavior, listing protocol tied to Carly/Megan emails. Future builders follow the same pattern: `docs/[builder]/`, referencing the relevant MLS layer.

**`bookmarklets/`** — deployment artifacts generated from the source files in `docs/cvrmls/`. Universal tabs have generic names; builder-specific launchers are named explicitly.

---

*Updated at the end of each session where structure changes. Individual filenames in GitHub.*

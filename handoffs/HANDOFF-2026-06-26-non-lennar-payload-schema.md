---
title: Cursor Handoff — Non-Lennar Payload Schema — new stub doc
document_id: HANDOFF-2026-06-26-non-lennar-payload-schema
date: 2026-06-26
project: AAR-TC Lennar MLS Bookmarklet
---

Create the file below at `docs/Non_Lennar_Payload_Schema.md`. The file does not yet exist — this is a new file creation, not an edit.

---

## New File — docs/Non_Lennar_Payload_Schema.md

```markdown
---
title: Non-Lennar MLS Payload Schema
document_id: AAR-TC-NONLENNAR-PL-001
version: 0.1
version_date: 2026-06-26
status: Stub — to be completed when non-Lennar bookmarklet workflow is built out
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar MLS Bookmarklet
---

# Non-Lennar MLS Payload Schema
### AAR-TC Transaction Services | Document ID: AAR-TC-NONLENNAR-PL-001

---

## Purpose

This document defines the clipboard payload schema for non-Lennar listings using the CVRMLS Matrix bookmarklet set. Non-Lennar listings are always entered via the Tax ID path — a listing is never started from scratch (New path) for a resale or non-builder file.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 0.1 | 2026-06-26 | Andrew Rich / Claude | Stub created. Core behavioral distinctions documented. Full field schema to be defined when non-Lennar bookmarklet workflow is built out. |

---

## Key Behavioral Distinctions from Lennar Payload

### `lennar` key — omitted

Non-Lennar payloads do **not** include a `"lennar": true` key. Its absence is how bookmarklets detect non-Lennar context. Do not include `"lennar": false` — simply omit the key entirely.

Bookmarklet behavior gated on `isLennar` (`payload.lennar === true`):

| Field | Lennar | Non-Lennar |
|---|---|---|
| Assd Improvement (`Input_248`) | Write `"0"` — new construction never pre-populated | Skip — pre-populated from tax record on Tax ID path |
| Owner Name (`Input_118`) | Hardcode `"Lennar"` — force overwrite | Pull from payload — `owner.owner_name` |
| Fee Info | Community lookup table drives all values | Fully payload-driven — all fields from payload |

### `path` key

Non-Lennar is always `"tax_id"`. The `"new"` path is not used for non-Lennar listings.

```json
{
  "path": "tax_id"
}
```

### `community` key — omitted

Non-Lennar payloads do not include a `"community"` key. Community lookup tables in the bookmarklets are Lennar-only. All fee, school, and location values come from the payload directly for non-Lennar listings.

---

## Payload Schema

*To be defined during non-Lennar bookmarklet build session. Canonical baseline: `AAR-TC-LENNAR-BM-SRC-001` (`docs/Lennar_MLS_Bookmarklet_Source.md`) — non-Lennar variant is the fully payload-driven baseline that the Lennar variant was derived from.*

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*
```

---

No other changes.

```bash
git add -A
git commit -m "fix: General Info bookmarklet — correct Input_246/248 swap, gate Tax Year to New path, add isLennar flag for Assd Improvement; add features.style payload rule to protocol; add lennar flag requirement; stub non-Lennar payload schema doc"
git push origin main
```

After pushing, delete all four handoff files:

```bash
git rm handoffs/HANDOFF-2026-06-26-general-info-source.md handoffs/HANDOFF-2026-06-26-general-info-launcher.md handoffs/HANDOFF-2026-06-26-protocol-style-rule.md handoffs/HANDOFF-2026-06-26-non-lennar-payload-schema.md
git add -A
git commit -m "chore: remove June 26 handoff files"
git push origin main
```

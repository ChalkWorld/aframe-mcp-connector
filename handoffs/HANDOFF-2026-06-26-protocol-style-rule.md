---
title: Cursor Handoff — Lennar_New_Listing_Protocol.md — features.style payload rule
document_id: HANDOFF-2026-06-26-protocol-style-rule
date: 2026-06-26
project: AAR-TC Lennar MLS Bookmarklet
---

Apply the changes below surgically to `docs/Lennar_New_Listing_Protocol.md`. Do not modify anything not listed here.

---

## Change 1 — Add features.style population rule to payload generation notes

**What and why:** The features.style field was left as an empty array in session payload output, causing the Features bookmarklet to skip it silently. Style is a dynamic field that varies by plan type — it must always be populated in the session payload based on property type from the Cognito form email. Discovered during live bookmarklet test June 26, 2026.

Also adds `"lennar": true` as a required top-level payload key — this flag gates the Assd Improvement write in the General Info bookmarklet (non-Lennar listings must not have that field overwritten).

**Find:**
```
Features payload notes:
- `garage_yn` — `"1"` or `"0"`
- `garage_auto_door` — `true` or `false` (confirm with Lennar if unknown; default `false` until confirmed)
- `basement_yn` — `"0"` for all current communities (slab construction); `"1"` only if confirmed crawl space
- `num_fp` — `"0"` for all current communities; set only if confirmed fireplace present
- `appl_equip` — parse from email; alphabetical order; Washer + Dryer separate; use `Microwave` not `Microwave Over Range`
- `unit_placement` — leave `[]` for single-family plans
```

**Replace with:**
```
Features payload notes:
- `style` — **always populate** based on property type from the Cognito form email:
  - Townhouse → `["Input_541_19"]` (Rowhouse/Townhouse)
  - Single Family → confirm value from Features field map (`AAR-TC-LENNAR-BM-001-FEA`) as SF plan styles come up; do not leave as `[]`
- `garage_yn` — `"1"` or `"0"`
- `garage_auto_door` — `true` or `false` (confirm with Lennar if unknown; default `false` until confirmed)
- `basement_yn` — `"0"` for all current communities (slab construction); `"1"` only if confirmed crawl space
- `num_fp` — `"0"` for all current communities; set only if confirmed fireplace present
- `appl_equip` — parse from email; alphabetical order; Washer + Dryer separate; use `Microwave` not `Microwave Over Range`
- `unit_placement` — leave `[]` for single-family plans
```

---

## Change 2 — Add lennar flag to payload generation notes

**What and why:** The General Info bookmarklet uses a top-level `"lennar": true` flag to gate the Assd Improvement write. This flag must be present in every Lennar session payload output.

**Find:**
```
The payload uses two different community key formats — one per bookmarklet system. Use the correct format for each:
```

**Replace with:**
```
Every Lennar payload must include `"lennar": true` as a top-level key. This flag is read by the General Info bookmarklet to gate the Assd Improvement write — non-Lennar listings omit this key and the field is skipped.

The payload uses two different community key formats — one per bookmarklet system. Use the correct format for each:
```

---

No other changes to `Lennar_New_Listing_Protocol.md`.

Do not commit yet. Changes for additional files follow in separate handoffs.

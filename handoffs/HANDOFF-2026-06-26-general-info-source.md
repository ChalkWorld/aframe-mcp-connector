---
title: Cursor Handoff — Lennar_MLS_Bookmarklet_Source.md — General Info fixes
document_id: HANDOFF-2026-06-26-general-info-source
date: 2026-06-26
project: AAR-TC Lennar MLS Bookmarklet
---

Apply the changes below surgically to `docs/Lennar_MLS_Bookmarklet_Source.md`. Do not modify anything not listed here.

---

## Change 1 — Fix Input_246 / Input_248 label swap and add isLennar flag

**What and why:** The General Info source JS has Input_246 and Input_248 mislabeled. Extraction was run against a New path listing where Matrix assigns Input_246 to Assd Improvement. On the Tax ID path, Matrix shifts: Input_246 = Tax Year, Input_248 = Assd Improvement. Both IDs confirmed via live ES session extraction against a Tax ID path listing (June 26, 2026).

Fix also:
- Moves Tax Year (Input_246) inside the `new` path block so it is not overwritten on the Tax ID path
- Adds `isLennar` flag gating the Assd Improvement write — Lennar only (new construction never has a pre-populated value); non-Lennar Tax ID path has Assd Improvement pre-populated from tax record and must not be touched
- Corrects the Input_249 comment — it is Model Available, not Tax Year

**Find:**
```javascript
    // Lennar static fields — always write
    setField('Input_94',  'N');   // Waterfront = No
    setField('Input_249', '0');   // Model Available = No
    // Assd Improvement = 0 on both paths (does not pre-populate even on Tax ID path)
    setField('Input_246', '0');  // Assd Improvement — confirmed Input_246
    // Disclosures = Not Required — hardcoded
    setCheck('Input_102_NOTREQ', true);
    // Lead Disclosure = Not Required — hardcoded
    setCheck('Input_103_NOTREQ', true);
    // Acres and Legal — New path only
    if (path === "new") {
      setField('Input_95',  d.acres || "");  // from payload — varies per listing
      setField('Input_100', 'TBD');          // Legal Description = TBD for Lennar new construction
    }
    // Tax ID path: Acres pre-populated (verify against email); Legal pre-populated — skip both
```

**Replace with:**
```javascript
    var isLennar = payload.lennar === true;

    // Lennar static fields — always write
    setField('Input_94',  'N');    // Waterfront = No
    setField('Input_249', 'N');    // Model Available = No
    // Disclosures = Not Required — hardcoded
    setCheck('Input_102_NOTREQ', true);
    // Lead Disclosure = Not Required — hardcoded
    setCheck('Input_103_NOTREQ', true);
    // Assd Improvement = 0 for Lennar only — new construction never pre-populated on either path
    // Non-Lennar: always Tax ID path; Assd Improvement pre-populated from tax record — skip
    if (isLennar) {
      setField('Input_248', '0');  // Assd Improvement — Input_248 confirmed on Tax ID path
    }
    // Tax Year, Acres, and Legal — New path only
    // Tax Year (Input_246) pre-populated from tax record on Tax ID path — do not overwrite
    if (path === "new") {
      setField('Input_246', '0');           // Tax Year = 0 on New path
      setField('Input_95',  d.acres || ""); // Acres — from payload; varies per listing
      setField('Input_100', 'TBD');         // Legal Description = TBD for Lennar new construction
    }
    // Tax ID path: Tax Year, Acres, and Legal pre-populated — skip all three
```

---

No other changes to `Lennar_MLS_Bookmarklet_Source.md`.

Do not commit yet. Changes for additional files follow in separate handoffs.

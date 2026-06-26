# Cursor Handoff — Fix Assd Improvement Field ID
**Date:** 2026-06-25
**Protocol:** CURSOR-HANDOFF-PROTOCOL-001
**Target file:** `docs/Lennar_MLS_Bookmarklet_Source.md`

---

## Instructions

Two surgical edits to `docs/Lennar_MLS_Bookmarklet_Source.md`. No other changes.

---

## Edit 1 — General Info Non-Lennar Variant

**Find:**
```
    // Always write
    setField('Input_249', d.model_available   || "0");  // Model Available
    setField('Input_94',  d.waterfront        || "N");  // Waterfront
    // TODO: Assd Improvement field ID not captured during General Info extraction — verify in Matrix before adding
    //   Write "0" on both paths (does not pre-populate even on Tax ID path)
```

**Replace with:**
```
    // Always write
    setField('Input_249', d.model_available   || "0");  // Model Available
    setField('Input_94',  d.waterfront        || "N");  // Waterfront
    setField('Input_246', d.assd_improvement  || "0");  // Assd Improvement — confirmed Input_246; write "0" on both paths (does not pre-populate even on Tax ID path)
```

---

## Edit 2 — General Info Lennar Variant

**Find:**
```
    // Assd Improvement = 0 on both paths (does not pre-populate even on Tax ID path)
    // TODO: Assd Improvement field ID not captured during General Info extraction — verify in Matrix before adding
```

**Replace with:**
```
    // Assd Improvement = 0 on both paths (does not pre-populate even on Tax ID path)
    setField('Input_246', '0');  // Assd Improvement — confirmed Input_246
```

---

## Commit

```
fix: confirm Assd Improvement field ID as Input_246 in General Info variants
```

---

*One commit. No other files touched.*

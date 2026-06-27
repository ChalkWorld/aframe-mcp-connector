# Cursor Handoff — Features Source Addendum + Source File TAB 4 Stub Patch
**Date:** June 26, 2026
**Files:** `docs/Lennar_MLS_Bookmarklet_Source.md`, `docs/AAR-TC-LENNAR-BM-SRC-001-FEA.md`
**Purpose:** Add the Features source addendum to the repo and update the TAB 4 stub in the main source file to reference it.

---

## Step 1 — Add the addendum file

Copy `AAR-TC-LENNAR-BM-SRC-001-FEA.md` (provided alongside this handoff) into `docs/`.

Add a header block at the very top of the file before the `## TAB 4` heading:

**Prepend to top of file:**
```
# Lennar MLS — Features Bookmarklet Source
**Document ID:** AAR-TC-LENNAR-BM-SRC-001-FEA
**Version:** 1.0
**Date:** June 26, 2026
**Addendum to:** `Lennar_MLS_Bookmarklet_Source.md` (`AAR-TC-LENNAR-BM-SRC-001`)
**Field Map:** `Lennar_MLS_Features_Field_Map.md` (`AAR-TC-LENNAR-BM-001-FEA`)

*Both variants complete — non-Lennar and Lennar. Ready for launcher build.*

---

```

---

## Step 2 — Patch TAB 4 stub in main source file

**File:** `docs/Lennar_MLS_Bookmarklet_Source.md`

**Find:**
```
**Named suffix pattern:** Some checkbox groups use named suffixes (e.g. `Input_721_CartPath`, `Input_845_FIBER`) rather than numeric. Bookmarklet must handle both patterns.
**Non-sequential IDs:** `Input_88_13` (Geothermal in Cooling) is non-sequential — do not assume suffix order matches display order.

```javascript
// TODO: Build in next session — Features tab is the most complex
// Field map: AAR-TC-LENNAR-BM-001-FEA (docs/Lennar_MLS_Features_Field_Map.md)
```
```

**Replace with:**
```
**Named suffix pattern:** Some checkbox groups use named suffixes (e.g. `Input_721_CartPath`, `Input_845_FIBER`) rather than numeric. Bookmarklet must handle both patterns.
**Non-sequential IDs:** `Input_88_13` (Geothermal in Cooling) is non-sequential — do not assume suffix order matches display order.

**Source addendum:** Due to the scale of this tab (~400 lines across both variants), the Features bookmarklet source lives in a separate addendum file rather than inline here.
See `AAR-TC-LENNAR-BM-SRC-001-FEA` (`docs/AAR-TC-LENNAR-BM-SRC-001-FEA.md`) — both non-Lennar and Lennar variants complete as of Session 013.
```

---

## Commit

```
feat: add Features bookmarklet source addendum (AAR-TC-LENNAR-BM-SRC-001-FEA)

Both non-Lennar and Lennar variants complete. Non-Lennar variant covers
all 49 field groups fully payload-driven. Lennar variant applies three-
tier design: hardcoded statics, community lookup table, and payload-
driven dynamic fields. TAB 4 stub in main source file updated to
reference addendum. Cooling and Water Heater confirmed Lennar statics
(Heat Pump / Electric) across all communities.
```

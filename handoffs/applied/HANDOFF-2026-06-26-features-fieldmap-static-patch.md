# Cursor Handoff — Features Field Map Static Patch
**Date:** June 26, 2026
**File:** `docs/Lennar_MLS_Features_Field_Map.md`
**Purpose:** Update Cooling and Water Heater Lennar use notes from DYNAMIC to STATIC. These were confirmed as Lennar statics during Session 012 pre-build prep but the field map was not updated at that time. The bookmarklet source file is already correct.

---

## Edit 1 — Water Heater Lennar use note

**Find:**
```
**Lennar use:** DYNAMIC — driven by community DB. Pulled from clipboard.

---

### Disabl Equipd Y/N — Chunk 8
```

**Replace with:**
```
**Lennar use:** STATIC — `Input_571_01` (Electric) always checked. Confirmed Lennar static Session 012. Hardcoded in bookmarklet.

---

### Disabl Equipd Y/N — Chunk 8
```

---

## Edit 2 — Cooling Lennar use note

**Find:**
```
**Lennar use:** DYNAMIC — driven by community DB. Pulled from clipboard.

---

### Other Cooling Description — Chunk 9
```

**Replace with:**
```
**Lennar use:** STATIC — `Input_88_06` (Heat Pump) always checked. Confirmed Lennar static Session 012. Hardcoded in bookmarklet.

---

### Other Cooling Description — Chunk 9
```

---

## Commit

```
docs: patch Features field map — Cooling and Water Heater confirmed Lennar statics

Cooling (Heat Pump) and Water Heater (Electric) confirmed as Lennar
statics across all communities during Session 012 pre-build prep.
Updated Lennar use notes in Features field map to reflect STATIC
classification. Bookmarklet source file was already correct.
```

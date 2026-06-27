---
title: Cursor Handoff — Features Field Map Split
document_id: HANDOFF-2026-06-27-features-field-map-split
date: 2026-06-27
project: AAR-TC Aframe Connector
---

Apply the changes below to the repository. This handoff adds one new file, retires one existing file, and makes no content edits to any other file.

---

## Overview

The `docs/lennar/Lennar_MLS_Features_Field_Map.md` is being retired. It is replaced by a clean two-doc structure:

- `docs/cvrmls/CVRMLS_Features_Field_Map.md` — universal CVRMLS Matrix Features tab reference (new doc ID: AAR-TC-CVRMLS-BM-001-FEA). Pure field IDs and option values, no builder content.
- `docs/lennar/Lennar_Features_Payload_Schema.md` — already exists and is the Lennar authority for Features. No changes needed to this file. It serves as the Lennar Features reference going forward.

The draft `Lennar_Features_Field_Map.md` in the handoffs folder is not committed — discard it.

---

## Step 1 — Confirm `docs/cvrmls/` directory exists

```bash
mkdir -p docs/cvrmls
```

---

## Step 2 — Add `CVRMLS_Features_Field_Map.md`

```bash
cp handoffs/CVRMLS_Features_Field_Map.md docs/cvrmls/CVRMLS_Features_Field_Map.md
git add docs/cvrmls/CVRMLS_Features_Field_Map.md
```

---

## Step 3 — Remove the old Lennar Features field map

```bash
git rm docs/lennar/Lennar_MLS_Features_Field_Map.md
```

---

## Step 4 — Discard the draft Lennar Features field map

```bash
rm -f handoffs/Lennar_Features_Field_Map.md
```

---

## Step 5 — Commit and push

```bash
git add -A
git commit -m "refactor: split Features field map into universal CVRMLS reference + retire Lennar-specific doc (schema is Lennar authority)"
git push origin main
```

Then delete this handoff file and `CVRMLS_Features_Field_Map.md` from the handoffs folder — they are not committed to the repo.

---

No content edits to any existing file. `docs/lennar/Lennar_Features_Payload_Schema.md` is unchanged.

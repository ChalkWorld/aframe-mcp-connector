---
title: Cursor Handoff — CVRMLS/Lennar Build Doc Split
document_id: HANDOFF-2026-06-27-build-doc-split
date: 2026-06-27
project: AAR-TC Aframe Connector
---

Apply the changes below to the repository. This handoff adds two new files and removes one. No content edits to any existing file.

---

## Overview

The monolithic `docs/lennar/Lennar_MLS_Bookmarklet_Build.md` is being retired and replaced by two files that cleanly separate universal CVRMLS content from Lennar-specific build notes:

- `docs/cvrmls/CVRMLS_Bookmarklet_Build.md` — universal CVRMLS Matrix field maps, architecture, and build roadmap (new doc ID: AAR-TC-CVRMLS-BM-001)
- `docs/lennar/Lennar_Bookmarklet_Build_Notes.md` — Lennar-specific community tables, fee data, and operational notes (new doc ID: AAR-TC-LENNAR-BM-NOTES-001)

---

## Step 1 — Confirm `docs/cvrmls/` directory exists

```bash
mkdir -p docs/cvrmls
```

---

## Step 2 — Add `CVRMLS_Bookmarklet_Build.md`

```bash
cp handoffs/CVRMLS_Bookmarklet_Build.md docs/cvrmls/CVRMLS_Bookmarklet_Build.md
git add docs/cvrmls/CVRMLS_Bookmarklet_Build.md
```

---

## Step 3 — Add `Lennar_Bookmarklet_Build_Notes.md`

```bash
cp handoffs/Lennar_Bookmarklet_Build_Notes.md docs/lennar/Lennar_Bookmarklet_Build_Notes.md
git add docs/lennar/Lennar_Bookmarklet_Build_Notes.md
```

---

## Step 4 — Remove the old build file

```bash
git rm docs/lennar/Lennar_MLS_Bookmarklet_Build.md
```

---

## Step 5 — Commit and push

```bash
git add -A
git commit -m "refactor: split bookmarklet build doc into universal CVRMLS + Lennar build notes"
git push origin main
```

Then delete this handoff file and both content files from the handoffs folder — they are not committed to the repo.

---

No other changes. No edits to any existing file.

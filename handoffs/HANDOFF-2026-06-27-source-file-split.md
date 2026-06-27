---
title: Cursor Handoff — CVRMLS/Lennar Source File Split
document_id: HANDOFF-2026-06-27-source-file-split
date: 2026-06-27
project: AAR-TC Aframe Connector
---

Apply the changes below to the repository. This handoff adds two new files and removes one. No content edits to any existing file.

---

## Overview

The monolithic `docs/lennar/Lennar_MLS_Bookmarklet_Source.md` is being retired and replaced by two files that cleanly separate universal CVRMLS content from Lennar-specific customizations:

- `docs/cvrmls/CVRMLS_Bookmarklet_Source.md` — universal CVRMLS Matrix bookmarklet source (new doc ID: AAR-TC-CVRMLS-BM-SRC-001)
- `docs/lennar/Lennar_Bookmarklet_Customization.md` — Lennar-specific variants, community lookup tables, and static overrides (new doc ID: AAR-TC-LENNAR-BM-CUST-001)

---

## Step 1 — Create `docs/cvrmls/` directory if it does not exist

```bash
mkdir -p docs/cvrmls
```

---

## Step 2 — Add `CVRMLS_Bookmarklet_Source.md`

Copy the file from the handoff package into the repo:

```bash
cp handoffs/CVRMLS_Bookmarklet_Source.md docs/cvrmls/CVRMLS_Bookmarklet_Source.md
git add docs/cvrmls/CVRMLS_Bookmarklet_Source.md
```

---

## Step 3 — Add `Lennar_Bookmarklet_Customization.md`

```bash
cp handoffs/Lennar_Bookmarklet_Customization.md docs/lennar/Lennar_Bookmarklet_Customization.md
git add docs/lennar/Lennar_Bookmarklet_Customization.md
```

---

## Step 4 — Remove the old source file

```bash
git rm docs/lennar/Lennar_MLS_Bookmarklet_Source.md
```

---

## Step 5 — Commit and push

```bash
git add -A
git commit -m "refactor: split bookmarklet source into universal CVRMLS + Lennar customization layers"
git push origin main
```

Then delete this handoff file and both content files from the handoffs folder — they are not committed to the repo.

---

No other changes. No edits to any existing file.

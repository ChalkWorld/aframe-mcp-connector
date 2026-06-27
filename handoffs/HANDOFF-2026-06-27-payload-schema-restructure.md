---
title: Cursor Handoff — Payload Schema Restructure
document_id: HANDOFF-2026-06-27-payload-schema-restructure
date: 2026-06-27
project: AAR-TC Aframe Connector
---

Apply the changes below to the repository. Two operations: add one new file, make three surgical edits to one existing file, and remove one old file.

---

## Overview

- `docs/lennar/Non_Lennar_Payload_Schema.md` is retired and replaced by `docs/cvrmls/CVRMLS_Payload_Schema.md` — the universal CVRMLS baseline schema.
- `docs/lennar/Lennar_Features_Payload_Schema.md` gets three small reference updates to reflect the restructured doc landscape. All schema content is unchanged.

---

## Step 1 — Confirm `docs/cvrmls/` directory exists

```bash
mkdir -p docs/cvrmls
```

---

## Step 2 — Add `CVRMLS_Payload_Schema.md`

```bash
cp handoffs/CVRMLS_Payload_Schema.md docs/cvrmls/CVRMLS_Payload_Schema.md
git add docs/cvrmls/CVRMLS_Payload_Schema.md
```

---

## Step 3 — Remove `Non_Lennar_Payload_Schema.md`

```bash
git rm docs/lennar/Non_Lennar_Payload_Schema.md
```

---

## Step 4 — Surgical edits to `docs/lennar/Lennar_Features_Payload_Schema.md`

Apply the changes below surgically. Do not modify anything not listed here.

### Change 1 — Update title

**Find:**
```
# Lennar MLS Bookmarklet — Full Payload Schema
```

**Replace with:**
```
# Lennar MLS Bookmarklet — Payload Schema
```

### Change 2 — Update Purpose paragraph

**Find:**
```
This document defines the complete payload schema for the AAR-TC Lennar MLS bookmarklet set. It covers every tab across all launchers — Lennar variant, non-Lennar variant, or shared — and is the authority for what is hardcoded, what comes from the community lookup table, what comes from the clipboard payload, and what is excluded entirely.
```

**Replace with:**
```
This document defines the Lennar-specific payload schema for the AAR-TC CVRMLS Matrix bookmarklet set. It is the authority for what is hardcoded, what comes from the community lookup table, what comes from the clipboard payload, and what is excluded entirely for Lennar listings. For the universal CVRMLS baseline schema, see `docs/cvrmls/CVRMLS_Payload_Schema.md` (AAR-TC-CVRMLS-PL-001).
```

### Change 3 — Update footer

**Find:**
```
*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This document is the authority for the Lennar MLS bookmarklet payload schema. Update version history with each revision.*
```

**Replace with:**
```
*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Lennar payload schema — authority for all Lennar bookmarklet field classifications.*
*Universal CVRMLS baseline: `docs/cvrmls/CVRMLS_Payload_Schema.md` (AAR-TC-CVRMLS-PL-001).*
*Source JS: `docs/cvrmls/CVRMLS_Bookmarklet_Source.md` (AAR-TC-CVRMLS-BM-SRC-001).*
*This is a living document. Update version history and version_date with each revision.*
```

No other changes to `Lennar_Features_Payload_Schema.md`.

---

## Step 5 — Commit and push

```bash
git add -A
git commit -m "refactor: retire Non_Lennar_Payload_Schema; add universal CVRMLS_Payload_Schema; update Lennar schema refs"
git push origin main
```

Then delete this handoff file and `CVRMLS_Payload_Schema.md` from the handoffs folder — they are not committed to the repo.

---

No other changes to any file.

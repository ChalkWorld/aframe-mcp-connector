---
title: Cursor Handoff — Repo Restructure — 2026-06-26
document_id: HANDOFF-2026-06-26-repo-restructure
date: 2026-06-26
project: AAR-TC Aframe Connector
---

Apply the changes below to the repository file structure. This handoff uses shell commands only — no content edits to any file. Execute every command exactly as written.

---

## Overview

This restructure does three things:

1. **Creates a two-layer directory structure under `docs/`** — a universal MLS input layer (`docs/mls-input/`) and a Lennar implementation layer (`docs/lennar/`), plus `docs/connector/`, `docs/protocols/`, and `docs/project/` for the remaining docs.
2. **Renames bookmarklet files** — drops the `lennar_` prefix from all generic Matrix tab launchers; keeps `lennar_features.html` as-is (it is genuinely Lennar-specific).
3. **Moves three stray root-level handoff files** into `handoffs/applied/`.

---

## Step 1 — Create new `docs/` subdirectories

```bash
mkdir -p docs/mls-input
mkdir -p docs/lennar
mkdir -p docs/connector
mkdir -p docs/protocols
mkdir -p docs/project
```

---

## Step 2 — Move docs into `docs/lennar/` (Lennar implementation layer)

```bash
git mv docs/Lennar_New_Listing_Protocol.md docs/lennar/Lennar_New_Listing_Protocol.md
git mv docs/Lennar_MLS_Bookmarklet_Build.md docs/lennar/Lennar_MLS_Bookmarklet_Build.md
git mv docs/Lennar_MLS_Bookmarklet_Source.md docs/lennar/Lennar_MLS_Bookmarklet_Source.md
git mv docs/AAR-TC-LENNAR-BM-SRC-001-FEA.md docs/lennar/AAR-TC-LENNAR-BM-SRC-001-FEA.md
git mv docs/Lennar_MLS_Features_Field_Map.md docs/lennar/Lennar_MLS_Features_Field_Map.md
git mv docs/Lennar_Features_Payload_Schema.md docs/lennar/Lennar_Features_Payload_Schema.md
git mv docs/Non_Lennar_Payload_Schema.md docs/lennar/Non_Lennar_Payload_Schema.md
git mv docs/Lennar_Photo_Preprocessing.md docs/lennar/Lennar_Photo_Preprocessing.md
```

---

## Step 3 — Move docs into `docs/mls-input/` (universal layer)

```bash
git mv docs/EXTRACTION_PROCEDURE.md docs/mls-input/EXTRACTION_PROCEDURE.md
```

---

## Step 4 — Move docs into `docs/connector/`

```bash
git mv docs/CONNECTOR_TECHNICAL_REFERENCE.md docs/connector/CONNECTOR_TECHNICAL_REFERENCE.md
git mv docs/CONNECTOR_TOOL_ROADMAP.md docs/connector/CONNECTOR_TOOL_ROADMAP.md
git mv docs/aframe-api-reference docs/connector/aframe-api-reference
```

---

## Step 5 — Move docs into `docs/protocols/`

```bash
git mv docs/AAR-TC_General_Operations_Protocol.md docs/protocols/AAR-TC_General_Operations_Protocol.md
git mv docs/New_Buyer_Side_Session_Protocol.md docs/protocols/New_Buyer_Side_Session_Protocol.md
git mv docs/TRANSACTION_WORKFLOWS_FRAMEWORK.md docs/protocols/TRANSACTION_WORKFLOWS_FRAMEWORK.md
git mv docs/GMAIL-TO-AFRAME-001.md docs/protocols/GMAIL-TO-AFRAME-001.md
git mv docs/CURSOR-HANDOFF-PROTOCOL-001.md docs/protocols/CURSOR-HANDOFF-PROTOCOL-001.md
```

---

## Step 6 — Move docs into `docs/project/`

```bash
git mv docs/PROJECT_VISION.md docs/project/PROJECT_VISION.md
git mv docs/Project_Session_Log.md docs/project/Project_Session_Log.md
git mv docs/PREAUTOMATION-001.md docs/project/PREAUTOMATION-001.md
```

---

## Step 7 — Rename bookmarklet files (drop `lennar_` prefix from generic tabs)

```bash
git mv bookmarklets/lennar_agent_office_info.html bookmarklets/agent_office_info.html
git mv bookmarklets/lennar_bath_info.html bookmarklets/bath_info.html
git mv bookmarklets/lennar_fee_info.html bookmarklets/fee_info.html
git mv bookmarklets/lennar_general_info.html bookmarklets/general_info.html
git mv bookmarklets/lennar_internet_display_info.html bookmarklets/internet_display_info.html
git mv bookmarklets/lennar_listing_info.html bookmarklets/listing_info.html
git mv bookmarklets/lennar_owner_info.html bookmarklets/owner_info.html
git mv bookmarklets/lennar_remarks.html bookmarklets/remarks.html
git mv bookmarklets/lennar_showing_instructions.html bookmarklets/showing_instructions.html
git mv bookmarklets/lennar_virtual_tour_info.html bookmarklets/virtual_tour_info.html
```

`lennar_features.html`, `features_a.html`, and `features_b.html` are not renamed — they are already correctly named.

---

## Step 8 — Move stray root-level handoff files into `handoffs/applied/`

```bash
git mv HANDOFF-2026-06-26-features-fieldmap-static-patch.md handoffs/applied/HANDOFF-2026-06-26-features-fieldmap-static-patch.md
git mv HANDOFF-2026-06-26-features-source-addendum.md handoffs/applied/HANDOFF-2026-06-26-features-source-addendum.md
git mv HANDOFF-2026-06-26-session-log.md handoffs/applied/HANDOFF-2026-06-26-session-log.md
```

---

## Step 9 — Commit and push

```bash
git add -A
git commit -m "chore: repo restructure — two-layer docs hierarchy, bookmarklet renames, root handoff cleanup"
git push origin main
```

Then delete this handoff file — it is not committed to the repo.

---

No content edits to any file. Moves and renames only.

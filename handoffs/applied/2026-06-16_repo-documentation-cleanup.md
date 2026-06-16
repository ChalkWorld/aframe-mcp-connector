# Cursor Handoff — Repo Documentation Cleanup

**Type:** Meta-handoff (not an endpoint extraction). DO NOT place in `handoffs/incoming/` — the standard CURSOR_INSTRUCTIONS workflow would fail to process this. Save at repo root and invoke directly.

**Target scope:** Many files across `docs/` and `handoffs/`.
**Action:** Coordinated reorganization, renaming, surgical edits, and one new doc — applied as **a single git commit**, then pushed.

---

## Purpose

Consolidate and clean up the documentation:
- Remove orphan and stray files
- Strip `AFRAME_` prefix from doc filenames (everything in this repo is Aframe — the prefix is noise)
- Strip `AAR-TC-AFRAME-` prefix from document IDs (same reasoning)
- Extract the human extraction procedure out of `CURSOR_INSTRUCTIONS.md` into its own dedicated doc, so future-Andrew (or anyone) returning fresh has one clear entry point for "how do I extract a Swagger endpoint?"
- Drop the obsolete per-endpoint drill-down prompt from the API Reference README (Cursor now handles formatting via the raw-paste workflow)

---

## Pre-flight checks (do before starting)

1. **Working tree clean.** `git status` should show no uncommitted changes. If dirty, stop and report — do not proceed.
2. **Branch is `main`.** If on another branch, stop and report.
3. **Files expected to exist:**
   - `docs/AFRAME_API_ENDPOINT_REFERENCE.md` (will be deleted)
   - `docs/User Instructions.md` (will be deleted)
   - `docs/AFRAME_CONNECTOR_TECHNICAL_REFERENCE.md` (will be renamed)
   - `docs/AFRAME_CONNECTOR_TOOL_ROADMAP.md` (will be renamed)
   - `docs/AFRAME_TRANSACTION_WORKFLOWS_FRAMEWORK.md` (will be renamed)
   - `docs/aframe-api-reference/README.md` (will be edited)
   - `docs/aframe-api-reference/01-transactions.md` through `19-health-check.md` (will have front matter edited)
   - `handoffs/CURSOR_INSTRUCTIONS.md` (will be edited)

   If any of these are missing, stop and report — do not proceed.

---

## Operations

Execute in this order. Do not commit until all operations succeed.

### Op 1 — Delete orphan files

```
git rm "docs/AFRAME_API_ENDPOINT_REFERENCE.md"
git rm "docs/User Instructions.md"
```

### Op 2 — Rename files (preserve git history)

```
git mv "docs/AFRAME_CONNECTOR_TECHNICAL_REFERENCE.md" "docs/CONNECTOR_TECHNICAL_REFERENCE.md"
git mv "docs/AFRAME_CONNECTOR_TOOL_ROADMAP.md"        "docs/CONNECTOR_TOOL_ROADMAP.md"
git mv "docs/AFRAME_TRANSACTION_WORKFLOWS_FRAMEWORK.md" "docs/TRANSACTION_WORKFLOWS_FRAMEWORK.md"
```

### Op 3 — Update document_id in front matter

For each doc, update its `document_id` value in the YAML front matter:

| File | Old document_id | New document_id |
|---|---|---|
| `docs/CONNECTOR_TECHNICAL_REFERENCE.md` | `AAR-TC-AFRAME-REF-001` | `CONNECTOR-REF-001` |
| `docs/CONNECTOR_TOOL_ROADMAP.md` | `AAR-TC-AFRAME-ROAD-001` | `CONNECTOR-ROAD-001` |
| `docs/TRANSACTION_WORKFLOWS_FRAMEWORK.md` | `AAR-TC-AFRAME-WF-001` | `WORKFLOWS-FW-001` |
| `docs/aframe-api-reference/README.md` | `AAR-TC-AFRAME-API-001` | `API-REF-001` |
| `handoffs/CURSOR_INSTRUCTIONS.md` | `AAR-TC-AFRAME-CURSOR-001` | `CURSOR-INST-001` |

Also bump `version_date` to today's date in each of these files' front matter, and add a version history row to each noting the cleanup (no version-number bump unless otherwise specified per file below).

### Op 4 — Update parent_doc in all API category files

Files `docs/aframe-api-reference/01-transactions.md` through `19-health-check.md` (19 files) each have `parent_doc: AAR-TC-AFRAME-API-001` in their front matter. Update to `parent_doc: API-REF-001`. Also bump each file's `version_date` to today.

### Op 5 — Sweep all docs for cross-references using old IDs

Search every `.md` file under `docs/` and `handoffs/` for occurrences of these strings, and replace each:

| Find | Replace with |
|---|---|
| `AAR-TC-AFRAME-REF-001` | `CONNECTOR-REF-001` |
| `AAR-TC-AFRAME-ROAD-001` | `CONNECTOR-ROAD-001` |
| `AAR-TC-AFRAME-WF-001` | `WORKFLOWS-FW-001` |
| `AAR-TC-AFRAME-WF-BUYER-001` | `WORKFLOWS-BUYER-001` |
| `AAR-TC-AFRAME-WF-SELLER-001` | `WORKFLOWS-SELLER-001` |
| `AAR-TC-AFRAME-WF-LENNAR-001` | `WORKFLOWS-LENNAR-001` |
| `AAR-TC-AFRAME-API-001` | `API-REF-001` |
| `AAR-TC-AFRAME-CURSOR-001` | `CURSOR-INST-001` |

Also find and replace filename references in any prose:

| Find | Replace with |
|---|---|
| `AFRAME_CONNECTOR_TECHNICAL_REFERENCE.md` | `CONNECTOR_TECHNICAL_REFERENCE.md` |
| `AFRAME_CONNECTOR_TOOL_ROADMAP.md` | `CONNECTOR_TOOL_ROADMAP.md` |
| `AFRAME_TRANSACTION_WORKFLOWS_FRAMEWORK.md` | `TRANSACTION_WORKFLOWS_FRAMEWORK.md` |
| `AFRAME_API_ENDPOINT_REFERENCE.md` | `aframe-api-reference/README.md` |

Skip the meta-handoff file itself (this file) when sweeping.

In the commit message body, include a summary line: `Cross-reference sweep: [N] occurrences updated across [M] files.`

### Op 6 — Create the new `docs/EXTRACTION_PROCEDURE.md`

Create the file with the content between `=== BEGIN EXTRACTION_PROCEDURE ===` and `=== END EXTRACTION_PROCEDURE ===` at the bottom of this handoff. Add to git.

### Op 7 — Surgical edits to `handoffs/CURSOR_INSTRUCTIONS.md`

1. **Front matter:** bump `version` from `1.2` to `1.3`; update `version_date` to today.
2. **Version History table:** add row:
   ```
   | 1.3 | [TODAY] | Andrew Rich / Claude | Removed User Procedure sections (Path A and Path B). Human procedure now lives in `docs/EXTRACTION_PROCEDURE.md` (EXTRACTION-PROC-001). This doc is now Cursor-side only. |
   ```
3. **Delete** the entire section starting at the heading `## User Procedure — Path B (raw-paste handoff)` through and including the `---` separator that precedes `## User Procedure — Path A (pre-formatted handoff)`.
4. **Delete** the entire section starting at the heading `## User Procedure — Path A (pre-formatted handoff)` through and including the `---` separator that precedes `## Cursor logic — what Cursor does per handoff file`.
5. **Insert** the following block in place of the deleted sections (just before `## Cursor logic — what Cursor does per handoff file`):
   ```
   ## User procedure

   The human extraction procedure (how you, the operator, pull endpoint schemas from Swagger and prepare them for Cursor to apply) lives in its own document: see [`docs/EXTRACTION_PROCEDURE.md`](../docs/EXTRACTION_PROCEDURE.md) (`EXTRACTION-PROC-001`).

   This document covers only what Cursor does once handoff files are present in `handoffs/incoming/`.

   ---

   ```

### Op 8 — Surgical edits to `docs/aframe-api-reference/README.md`

1. **Front matter:** keep `version` at `1.0`; update `version_date` to today.
2. **Version History table:** add row:
   ```
   | 1.0 | [TODAY] | Andrew Rich / Claude | Document ID changed from AAR-TC-AFRAME-API-001 to API-REF-001. Removed obsolete per-endpoint drill-down prompt section (Cursor now formats raw-paste handoffs directly). Added pointer to EXTRACTION-PROC-001. |
   ```
3. **Delete** the entire `### Per-endpoint drill-down prompt` subsection inside the "How to Add to This Reference" section, including the long fenced prompt block and the paragraph immediately after about `<!-- TARGET: ... -->`.
4. **Edit** the "How to Add to This Reference" intro paragraph to read:

   ```
   The reference grows one endpoint at a time. The full human extraction procedure (Swagger → Cursor) lives in [`docs/EXTRACTION_PROCEDURE.md`](../EXTRACTION_PROCEDURE.md) (`EXTRACTION-PROC-001`). This section preserves only the lay-of-the-land prompt, which is used when surveying or re-surveying the entire API surface (e.g., after Aframe announces API changes).
   ```

5. **Keep** the "Lay-of-the-land prompt" subsection as-is.

---

## Commit

After all operations succeed, commit with this message:

```
Docs: cleanup — rename, reorganize, extract human procedure to its own doc

- Delete docs/AFRAME_API_ENDPOINT_REFERENCE.md (orphan pre-split version)
- Delete docs/User Instructions.md (mid-session save, not project content)
- Rename: AFRAME_CONNECTOR_TECHNICAL_REFERENCE.md  → CONNECTOR_TECHNICAL_REFERENCE.md
- Rename: AFRAME_CONNECTOR_TOOL_ROADMAP.md         → CONNECTOR_TOOL_ROADMAP.md
- Rename: AFRAME_TRANSACTION_WORKFLOWS_FRAMEWORK.md → TRANSACTION_WORKFLOWS_FRAMEWORK.md
- Drop AAR-TC-AFRAME- prefix from all document_id values; simpler IDs
- Sweep all cross-references to use new IDs
- Create docs/EXTRACTION_PROCEDURE.md — human-side Swagger extraction procedure
- CURSOR_INSTRUCTIONS.md v1.3: strip User Procedure sections, add pointer
  to EXTRACTION_PROCEDURE.md; doc is now Cursor-side only
- aframe-api-reference/README.md: strip obsolete drill-down prompt
  (raw-paste workflow makes it unnecessary), add pointer to EXTRACTION_PROCEDURE.md

Cross-reference sweep: [N] occurrences updated across [M] files.
```

Fill in the `[N]` and `[M]` placeholders with actual counts from Op 5.

## Push

After commit succeeds, push to `origin/main`.

## Archive this handoff

Move this file to `handoffs/applied/` with today's date prefixed:

```
git mv "[this-handoff-filename]" "handoffs/applied/[TODAY]_repo-documentation-cleanup.md"
```

This requires a second commit (the file move). Use commit message:

```
Archive: docs cleanup meta-handoff
```

Then push again.

---

## New file content — paste verbatim into `docs/EXTRACTION_PROCEDURE.md`

=== BEGIN EXTRACTION_PROCEDURE ===
---
title: Aframe Swagger Endpoint Extraction Procedure
document_id: EXTRACTION-PROC-001
version: 1.0
version_date: [TODAY]
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Aframe Swagger Endpoint Extraction Procedure
### Document ID: EXTRACTION-PROC-001

---

## Purpose

This document is the **human-side procedure** for extracting an Aframe API endpoint's schema from the Aframe Swagger UI and installing it into the API Endpoint Reference (`API-REF-001`).

It exists because:
- Aframe's Swagger UI is JavaScript-rendered, so `web_fetch` cannot read it directly
- Token-expensive browser-extension automation is overkill for a page that's already in front of you
- Cursor (Sonnet 4.6) can format raw paste content directly, eliminating the need for an in-between Claude.ai formatting step

The procedure splits work between you, a brief Claude.ai project session, and Cursor:
- **You:** pick the endpoint, copy the relevant pieces from Swagger, save the handoff file
- **Claude.ai session:** parses the endpoint's header block (URL, summary, description) and returns a partial handoff with those pre-filled
- **Cursor:** formats the raw Schema-view paste using the doc template, replaces the placeholder, commits, pushes

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | [TODAY] | Andrew Rich / Claude | Initial document. Extracted from `handoffs/CURSOR_INSTRUCTIONS.md` v1.2; reorganized as a standalone procedure doc. |

---

## Reference Documents

| Doc | ID | Purpose |
|---|---|---|
| Aframe API Endpoint Reference | `API-REF-001` | The destination — placeholders this procedure fills in |
| Aframe Connector Tool Roadmap | `CONNECTOR-ROAD-001` | Use to prioritize *which* endpoint to extract next |
| Aframe Connector Technical Reference | `CONNECTOR-REF-001` | How the connector is built; useful when planning which endpoints to wrap |
| Cursor Instructions | `CURSOR-INST-001` | What Cursor does once a handoff file lands in `handoffs/incoming/` |

---

## Key URLs

- Aframe Swagger UI: `https://api.aframeonline.com/api-pub/swagger-ui/index.html`
- Repo: `github.com/ChalkWorld/aframe-mcp-connector` (private)

---

## Critical Rules

- **Always use Swagger's "Schema" view, not "Example Value."** Example Value captures only field names and example data. Schema view captures the field types, descriptions, constraints, and enum values you actually need.
- **Expand every nested object before copying.** Click the collapse arrows in the Schema view tree to expand nested DTOs (e.g., `NameDto`, `PhoneDto`). What's collapsed at copy time is missing from the paste.
- **TARGET path must match the placeholder exactly.** Include `{parameter}` curly-brace placeholders verbatim from the Swagger URL bar — do not retype. A typo means Cursor cannot find the matching placeholder and skips the handoff.
- **Identify which endpoint you're extracting carefully.** Several endpoints in the same Swagger category can have very similar paths (e.g., `PATCH /v1/xaction-participants/{id}`, `PATCH /v1/xaction-participants/{id}/linked-contact`, `PATCH /v1/xaction-participants/{id}/contact-info`). The TARGET line determines which placeholder gets filled — getting the wrong one fills the wrong section.
- **Do not skip the Claude.ai header step.** Summary and Description text from Swagger looks similar in placement but means different things in the template. The Claude.ai session disambiguates them by reading the entire header block; doing it yourself risks the SUMMARY/DESCRIPTION mix-up that's bitten earlier extractions.

---

## Workflow Overview

```
Pick endpoint (Tool Roadmap → API Reference placeholders)
   ↓
Open in Swagger, copy header block
   ↓
Paste header to Claude.ai project session
   ↓
Claude returns partial handoff (TARGET + FORMAT + SUMMARY + DESCRIPTION pre-filled)
   ↓
Create file in handoffs/incoming/, paste Claude's output
   ↓
In Swagger: toggle Parameters + Responses to Schema view, expand nested objects, copy
   ↓
Paste under the PARAMETERS and RESPONSES markers in the handoff file
   ↓
Save the file
   ↓
Prompt Cursor: "Process all files in handoffs/incoming/ following handoffs/CURSOR_INSTRUCTIONS.md"
   ↓
Cursor formats, replaces placeholder, commits, pushes, archives handoff
   ↓
Verify: README version history updated, handoff in handoffs/applied/, category file updated
```

---

## Step-by-Step Procedure (Path B — Raw Paste)

**This is the default procedure.** Use Path A only in special cases (see "Path A" section below).

### Step 1 — Pick the endpoint

Open `docs/aframe-api-reference/README.md` and find a placeholder marked `Not extracted`. The Tool Roadmap (`CONNECTOR-ROAD-001`) indicates priority order. When working through the buyer-side or seller-side workflow, prioritize endpoints in Roadmap Tier 2 (Contacts, Participants) and Tier 3 (Tasks, discovery endpoints).

### Step 2 — Open the endpoint in Swagger

In your browser, open `https://api.aframeonline.com/api-pub/swagger-ui/index.html`. Find the endpoint by category and click to expand it.

You'll see (top to bottom):
1. The URL bar with the HTTP method and path, plus a short title (the **summary**)
2. A description paragraph below the URL bar
3. The Parameters section
4. The Responses section

### Step 3 — Copy the header block

Select everything from the URL bar down through the description paragraph, but **not** including the "Parameters" heading. Specifically:

- HTTP method (e.g. `PATCH`)
- Full path (e.g. `/v1/xaction-participants/{xactionParticipantId}/linked-contact`)
- Summary text (the short title next to the URL)
- Description paragraph (longer prose explaining the endpoint)

### Step 4 — Send to Claude.ai project session

Open the Claude.ai project session for this project. Paste the header block with a brief framing line like *"Header for the next endpoint."*

Claude returns a partial handoff file with the following pre-filled:
- `<!-- TARGET: METHOD PATH -->` on line 1
- `<!-- FORMAT: RAW_PASTE -->` on line 2
- `<!-- SUMMARY -->` with the summary text below it
- `<!-- DESCRIPTION -->` with the description text below it
- `<!-- PARAMETERS (Schema view) -->` (empty — you fill this)
- `<!-- RESPONSES (Schema view) -->` (empty — you fill this)

### Step 5 — Save to `handoffs/incoming/`

In Cursor (or any editor), create a new file in `handoffs/incoming/`. Suggested naming: `<method>-<dashed-path-tail>.md` (e.g. `patch-xaction-participants-linked-contact.md`). The filename does not affect routing — Cursor reads the `<!-- TARGET -->` comment for that — but a descriptive filename keeps the folder readable when multiple handoffs are queued.

Paste Claude's output. Save.

### Step 6 — Fill in Parameters (Schema view)

Return to Swagger. In the Parameters section, toggle the view from "Example Value" to **"Schema"**.

For each nested object or DTO referenced in the schema, click the collapse arrows to expand it. Continue expanding until everything visible is fully expanded.

Select the entire Parameters region (from the "Parameters" heading down to but not including the "Responses" heading). Copy.

Back in your handoff file, paste below `<!-- PARAMETERS (Schema view) -->`.

### Step 7 — Fill in Responses (Schema view)

In Swagger, for each Response code (200, 201, 4xx, 5xx as applicable), toggle the view to **"Schema"**. Expand any nested DTOs.

Select the entire Responses region (all response codes together). Copy.

Back in your handoff file, paste below `<!-- RESPONSES (Schema view) -->`.

### Step 8 — Save

Save the handoff file.

### Step 9 — Trigger Cursor

In Cursor, open `handoffs/CURSOR_INSTRUCTIONS.md` and prompt:

> *"Process all files in `handoffs/incoming/` following the instructions in this document."*

Cursor will:
- Parse your handoff (detect Path B via the absence of a `####` heading and presence of TARGET at top)
- Format the raw paste using the template in `docs/aframe-api-reference/README.md`
- Locate the matching placeholder in the right category file
- Replace it (preserving any "Built in connector" cross-link annotation)
- Update the master README's version_date and add a Version History row
- Move the consumed handoff to `handoffs/applied/` with today's date prefixed
- Commit with a descriptive message
- Push to `origin/main`

### Step 10 — Verify

After Cursor reports completion:

- Open `docs/aframe-api-reference/README.md` — the Version History table should have a new row noting the extraction
- Open the relevant category file (e.g. `02-transaction-participants.md`) — the placeholder you targeted should now be a fully-filled section with bold markers, tables, and the today's date in the Status line
- Check `handoffs/incoming/` — should be empty (just `.gitkeep`)
- Check `handoffs/applied/` — should contain your archived handoff
- (Optional) Open the GitHub repo and confirm the commit landed on `origin/main`

If anything looks off, see the **Common Pitfalls** section below.

---

## Path A — Pre-formatted handoff (special cases)

Use Path A when:
- The endpoint is complex enough that you want Claude to author the entire markdown block (full template + schema) before Cursor sees it
- You need to consult Claude about a design decision (e.g. should the endpoint be wrapped as one connector tool or two?)
- The Swagger schema is poorly structured and you want Claude to interpret it before formatting

**Path A procedure:**

1. In the Claude.ai project session, paste both the header block AND a full Schema-view dump of Parameters and Responses
2. Claude produces a complete, formatted markdown block ending with `<!-- TARGET: METHOD PATH -->` at the bottom
3. Save Claude's output as a `.md` file in `handoffs/incoming/`
4. Trigger Cursor as in Path B Step 9

Cursor detects this as Path A (heading present, TARGET at bottom) and applies as-is — no formatting step needed.

---

## Common Pitfalls

### Wrong endpoint targeted

Symptom: After Cursor runs, the *intended* placeholder is still unfilled but a *different* placeholder is now filled in (often a sibling endpoint).

Cause: The `<!-- TARGET -->` line specified the wrong path. Cursor matched the path it was given, not the path you meant.

Fix: Identify the correct TARGET path from Swagger's URL bar (exact match including `{parameter}` placeholders), edit the handoff file (now in `handoffs/applied/`), and re-run as a fresh extraction. Cursor will overwrite the incorrectly-filled section and note the overwrite in the commit message.

### SUMMARY contains description text

Symptom: The rendered `**Summary:**` line in the category file is a paragraph rather than a short title.

Cause: The `<!-- SUMMARY -->` section in the handoff was empty, so Cursor used the description as the summary.

Fix: This is what the Claude.ai header-parsing step prevents. If you skipped that step and went directly to Cursor, the summary won't be cleanly extracted. Re-run via the Claude.ai header step.

### Bold markers stripped on copy/paste

Symptom: Status, Summary, Request, Response labels appear as plain text rather than bold in the category file.

Cause: This was the issue with the old Chrome-extension workflow. Should not occur in the current Path B workflow because Cursor authors the formatted output directly.

Fix: If it occurs, manually add `**` markers around the affected labels. Worth flagging back to me — it shouldn't be happening.

### Cursor reports "endpoint not found"

Symptom: Cursor logs a warning that the TARGET path matches no placeholder.

Cause: Path mismatch. The path in the TARGET line differs from the placeholder's path (perhaps a typo, missing curly brace, or extra/missing slash).

Fix: Open the relevant category file in `docs/aframe-api-reference/` and find the placeholder's exact path. Copy that path verbatim into the handoff's TARGET line. Re-trigger Cursor.

### Multiple PATCH endpoints in the same category

Several Aframe categories have multiple PATCH endpoints with similar paths (e.g. participants has PATCH for the participant itself, PATCH for linked-contact, PATCH for contact-info — all targeting the same `{xactionParticipantId}`). Read the Swagger URL bar carefully. Copy the path verbatim from Swagger.

---

## Typical Time Estimate

| Step | Estimated Time |
|---|---|
| Pick endpoint, open in Swagger, copy header | 2 min |
| Claude.ai header parse, save handoff file | 1 min |
| Toggle Schema view, expand DTOs, copy & paste Parameters | 3 min |
| Same for Responses | 3 min |
| Trigger Cursor, wait for commit + push | 1 min |
| Verify | 1 min |
| **Per endpoint, end to end** | **~10 minutes** |

Most of the time is in the Swagger UI doing manual expand-and-copy. The Claude.ai and Cursor steps are quick.

---

*This is a living document. Update version history and version_date with each revision.*
=== END EXTRACTION_PROCEDURE ===

---

## Notes for the human (Andrew) — after Cursor runs this handoff

Once Cursor reports success:

1. Open `docs/EXTRACTION_PROCEDURE.md` and skim — confirm it reads cleanly as a self-contained procedure doc
2. Open `handoffs/CURSOR_INSTRUCTIONS.md` and confirm the User Procedure sections are gone and the pointer to EXTRACTION_PROCEDURE.md is present
3. Open `docs/aframe-api-reference/README.md` and confirm the drill-down prompt section is gone but the lay-of-the-land prompt remains
4. Open the GitHub repo and confirm the cleanup commit (plus the archive commit) landed on `origin/main`
5. Pick up the abandoned `PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact` extraction when you're ready to resume populating the API Reference

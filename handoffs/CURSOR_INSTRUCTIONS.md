---
title: Cursor Instructions — Apply API Endpoint Handoffs
document_id: CURSOR-INST-001
version: 1.3
version_date: 2026-06-16
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Cursor Instructions — Apply API Endpoint Handoffs
### AAR-TC Transaction Services | Document ID: CURSOR-INST-001

---

## Purpose

This document is the **standing instruction set for Cursor** when applying incoming Aframe API endpoint schema extractions to the API Reference document set.

**To invoke:** Open this file in Cursor, then prompt: *"Process all files in `handoffs/incoming/` following the instructions in this document."*

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-14 | Andrew Rich / Claude | Initial instructions. Pre-formatted handoff path only. |
| 1.1 | 2026-06-14 | Andrew Rich / Claude | Added Path B: raw-paste handoff support. Cursor (Sonnet 4.6) now formats raw Swagger content into the template before applying. Eliminates the need for a Claude.ai session to format extracted content. |
| 1.2 | 2026-06-16 | Andrew Rich / Claude | Doc ID changed from `AAR-TC-AFRAME-CURSOR-001` to `CURSOR-INST-001`. |
| 1.3 | 2026-06-16 | Andrew Rich / Claude | Removed User Procedure sections (Path A and Path B). Human procedure now lives in `docs/EXTRACTION_PROCEDURE.md` (EXTRACTION-PROC-001). This doc is now Cursor-side only. |

---

## Two handoff paths

The reference doc set supports two ways of getting endpoint schemas into the docs:

**Path A — Pre-formatted handoff.** A Claude session (the project's chat) produces a fully-formatted markdown block ready to drop in. The handoff file already has the `#### ` heading, bold labels, tables, and the `<!-- TARGET -->` comment at the bottom. Cursor's job is purely placeholder-swap.

**Path B — Raw-paste handoff (preferred for routine extraction).** You copy raw content directly from the Aframe Swagger UI into a handoff file, with a `<!-- TARGET -->` comment at the top and section markers separating the parts. Cursor's job is to **format** the raw content into the template shape, then apply it.

Cursor detects which path by inspecting the handoff:
- File contains a `####` heading and TARGET at bottom → **Path A** (apply as-is)
- File starts with `<!-- TARGET: ... -->` at top and contains no `####` heading → **Path B** (format then apply)

---

## How the handoff workflow works

```
Aframe Swagger UI (in your normal browser)
  ↓  (you copy raw schema text following EXTRACTION-PROC-001)
handoffs/incoming/[any-filename].md
  ↓  (Cursor, prompted with these instructions)
docs/aframe-api-reference/[NN-category].md   ← placeholder replaced with formatted schema
handoffs/applied/[date]_[original-filename].md ← consumed handoff archived
git commit + push
```

---

## User procedure

The human extraction procedure (how you, the operator, pull endpoint schemas from Swagger and prepare them for Cursor to apply) lives in its own document: see [`docs/EXTRACTION_PROCEDURE.md`](../docs/EXTRACTION_PROCEDURE.md) (`EXTRACTION-PROC-001`).

This document covers only what Cursor does once handoff files are present in `handoffs/incoming/`.

---

## Cursor logic — what Cursor does per handoff file

For each file in `handoffs/incoming/` (skip dotfiles and `.gitkeep`):

### 1. Detect the path

Read the file. Determine which path applies:
- If the file contains a line matching `^#### .* — ` → **Path A** (pre-formatted). Skip to step 4 below.
- If the file's first non-blank line is `<!-- TARGET: METHOD PATH -->` and no `####` heading exists → **Path B** (raw paste). Go to step 2.
- Otherwise: skip with a warning. The file doesn't conform to either path.

### 2. Parse Path B sections

For raw-paste handoffs, extract:
- **TARGET** from the first comment line: method + path
- **SUMMARY** — content between `<!-- SUMMARY -->` and the next marker
- **DESCRIPTION** — content between `<!-- DESCRIPTION -->` and the next marker (may be empty)
- **PARAMETERS** — content between `<!-- PARAMETERS (Schema view) -->` and the next marker
- **RESPONSES** — content between `<!-- RESPONSES (Schema view) -->` and end of file (or next marker)

### 3. Format Path B into the template

Build a markdown block using the **Endpoint Schema Template** defined in `docs/aframe-api-reference/README.md`. Specifically:

- `#### \`[METHOD] [PATH]\` — [Summary from SUMMARY section]` as the heading
- `**Status:** ✅ Extracted [today's date in YYYY-MM-DD]` as the status line
- `**Summary:** [SUMMARY content]`
- `**Description:** [DESCRIPTION content]` — omit this line entirely if DESCRIPTION section is empty
- `**Request**` block:
  - Content-Type — infer from the endpoint (default `application/json`; PATCH endpoints typically use `application/json-patch+json`)
  - Path params table — parse from the parameters paste, one row per path-tagged param
  - Query params table — parse from the parameters paste, one row per query-tagged param
  - Body schema table — parse from the parameters paste if a request body schema is present; otherwise write `Body schema: None`
- `**Response (2xx payload)**` block — parse the 200/2xx response schema into a flat field-path table (use dotted/bracket notation for nested fields, e.g. `xactionParticipants[].contactInfo.name.firstName`)
- `**Enums / constants:**` — extract all enum value lists found in the raw paste; if none, omit this section
- `**Notable errors:**` — list all non-2xx response codes with their description text from the raw paste. If error responses use a shared envelope (e.g. `APIResponseDto`), note the envelope shape once before the list.
- `**Quirks & notes:**` — capture any constraints, wrapper DTOs (like `apiXactionParticipantPagedQueryDto`), nullability notes, or other observations from the raw paste. Always include `Authentication: global \`X-AFrame-API-Key\` header.`
- Trailing `<!-- TARGET: ... -->` comment is **stripped** — it does not appear in the installed section.

Use proper markdown: `**bold**` markers around all section labels, inline backticks around code-like terms (field names, paths, enum values, DTO names), pipe-delimited tables.

### 4. Locate the target placeholder

Search `docs/aframe-api-reference/` for a markdown heading matching:

```
#### `[METHOD] [PATH]` —
```

The backticks and the em-dash are literal. Summary after the em-dash will vary; match on method + path only.

Expected: exactly one match. Zero → warn, skip. Multiple → warn (duplicate placeholder), skip.

### 5. Determine the section's extent

The section to replace runs from the `#### ` heading line through (and including) the next `---` separator line that follows it.

### 6. Preserve the "Built in connector" annotation

If the existing placeholder's status line contains `| Built in connector vX.Y.Z as \`tool_name\``, append that annotation to the new section's status line. Example:

Existing: `**Status:** Not extracted | Built in connector v0.2.0 as \`create_transaction\``
New: `**Status:** ✅ Extracted 2026-06-14`
Merged: `**Status:** ✅ Extracted 2026-06-14 | Built in connector v0.2.0 as \`create_transaction\``

### 7. Replace and check for overwrite

Replace the located section with the prepared (and merged) replacement. Ensure the section ends with a `---` separator and a blank line before the next heading.

If the placeholder was already filled (status started with `✅ Extracted`), note the overwrite in the commit message body. Do not block.

### 8. Update the master version_date

Open `docs/aframe-api-reference/README.md`. Update `version_date` in the front matter to today. Add a row to the Version History table:

```
| 1.0 | YYYY-MM-DD | Cursor / Claude-in-Chrome | Extracted: [METHOD] [PATH] |
```

Do NOT bump `version` — that's reserved for structural changes to the reference set.

### 9. Archive the consumed handoff

Move the handoff file from `handoffs/incoming/` to `handoffs/applied/`. Prefix the filename with today's date in `YYYY-MM-DD_` format. Create `handoffs/applied/` if it doesn't exist.

### 10. Commit

One commit per handoff. Message format:

```
API ref: extract [METHOD] [PATH]

- Replace placeholder with full schema in [category-file].md
- Update master README version_date
- Archive handoff: [original-filename]
```

If the section was an overwrite (step 7), add:
```
- Note: previously extracted on [old date]; overwritten with newer data
```

If processing was Path B (raw paste with Cursor formatting), add:
```
- Source: raw Swagger paste, formatted by Cursor (Path B)
```

### 11. Push

After all handoffs are processed and committed, push to `origin/main` once.

---

## Failure modes & how to respond

| Situation | Cursor response |
|---|---|
| Handoff file has no TARGET comment at top OR no `####` heading anywhere | Skip, log warning ("Cannot detect handoff path — needs `<!-- TARGET -->` at top OR `####` heading with TARGET at bottom"), do not commit |
| TARGET points to an endpoint not found in any category file | Skip, log warning showing the target path and the searched directory, do not commit |
| TARGET matches multiple placeholders | Skip, log warning showing all matched files and line numbers, do not commit |
| Path B handoff with missing section markers (e.g., no SUMMARY marker) | Process what's present, note the gap in the commit message: `- WARNING: SUMMARY section missing in raw paste; rendered with placeholder` |
| Path B handoff where the raw paste is empty or nonsensical for a section | Insert what was provided as-is; do not fabricate content. Note in commit message. |
| Path A handoff content malformed | Insert as-is — Cursor is not the validator. Note in commit message: `- WARNING: handoff may be incomplete; review extracted section` |
| `handoffs/applied/` does not exist | Create it before moving (no warning needed) |
| `handoffs/incoming/` is empty (only `.gitkeep`) | Report "No handoffs to process" and exit cleanly |
| Git working tree has uncommitted changes outside this workflow | Stop. Report the dirty state and ask the user before proceeding |

---

## What this workflow does NOT do

- **Does not validate schema correctness against Swagger.** Cursor trusts the extracted/pasted content is faithful. Validation is on the human (you) and on review.
- **Does not decide whether to wrap an endpoint as a connector tool.** That decision lives in `CONNECTOR-ROAD-001` and is made in a build-planning Claude session.
- **Does not modify the Tool Roadmap or Technical Reference.** Those move on different cycles with their own commits.
- **Does not access the Swagger UI itself.** Extraction (Path A or B) is performed by humans; Cursor only installs the result.

---

## Conventions reference

- **Categorization:** Endpoints are filed under the Aframe category they belong to (per Swagger's published structure, mirrored in `docs/aframe-api-reference/` numbering).
- **Format:** Every endpoint section is bounded by `---` separators, headed with `#### \`[METHOD] [PATH]\` — [summary]`, and contains a `**Status:**` line as its first non-heading line.
- **Built tools cross-link:** Endpoints already wrapped in the connector have `| Built in connector vX.Y.Z as \`tool_name\`` appended to their status line. This is preserved on every fill-in (per Cursor logic step 6).
- **One commit per endpoint:** Granular git history, no squashing.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

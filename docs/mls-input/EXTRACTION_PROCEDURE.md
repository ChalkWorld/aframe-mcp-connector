---
title: Aframe Swagger Endpoint Extraction Procedure
document_id: EXTRACTION-PROC-001
version: 1.0
version_date: 2026-06-16
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
| 1.0 | 2026-06-16 | Andrew Rich / Claude | Initial document. Extracted from `handoffs/CURSOR_INSTRUCTIONS.md` v1.2; reorganized as a standalone procedure doc. |

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

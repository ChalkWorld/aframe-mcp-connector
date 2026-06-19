---
title: Aframe API Endpoint Reference
document_id: API-REF-001
version: 1.0
version_date: 2026-06-18
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Aframe API Endpoint Reference
### AAR-TC Transaction Services | Document ID: API-REF-001

> **This is the master index.** Endpoint detail lives in the 19 category files in this folder, one per Aframe API category. See the [Category Index](#category-index) below.

---

## Purpose

This document set is the **canonical capture of the Aframe Open API's endpoint surface** as published in the Aframe Swagger UI. It is the working reference used when planning, scoping, or building new MCP tools on the Aframe Connector.

The reference is structured to mirror Aframe's own categorization of endpoints (19 categories, ~55 endpoints as of v1.0). It is descriptive — it captures what the API *offers*. Decisions about what we *wrap and when* live in the Tool Roadmap (`CONNECTOR-ROAD-001`).

### Why this exists as a document set, not a single doc

The Aframe Swagger UI is JavaScript-rendered, so `web_fetch` cannot read it directly. Extraction requires Claude in Chrome, which is token-expensive. This reference captures the extracted data **once**, persistently, so future build sessions can pull schema details from here rather than re-scraping the Swagger page each time.

Splitting by category keeps each file small enough that Cursor can open just the file being edited, and project knowledge can load only the category file relevant to a given session — instead of paying token cost for all ~55 endpoints every time.

### Relationship to other documents

```
API-REF-001              THIS DOC SET      — what the Aframe API offers
CONNECTOR-ROAD-001       Tool Roadmap      — what we plan to wrap and when
CONNECTOR-REF-001        Tech Reference    — how the connector is built and operates
WORKFLOWS-FW-*           Workflow docs     — business processes using the tools
```

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-14 | Andrew Rich / Claude | Initial skeleton. All 19 categories and ~55 endpoints listed as placeholders across category files. Global info populated from Swagger survey of 2026-06-14. No per-endpoint schemas extracted yet. |
| 1.0 | 2026-06-14 | Cursor / Claude-in-Chrome | Extracted: GET /v1/xactions/{xactionId}/xaction-participants |
| 1.0 | 2026-06-14 | Cursor / Claude-in-Chrome | Extracted: GET /v1/xactions/{xactionId}/xaction-participants (overwrite — improved schema from second extraction) |
| 1.0 | 2026-06-14 | Cursor / Claude-in-Chrome | Extracted: PATCH /v1/xaction-participants/{xactionParticipantId}/contact-info |
| 1.0 | 2026-06-16 | Andrew Rich / Claude | Document ID changed from `AAR-TC-AFRAME-API-001` to `API-REF-001`. Removed obsolete per-endpoint drill-down prompt section (Cursor now formats raw-paste handoffs directly). Added pointer to EXTRACTION-PROC-001. |
| 1.0 | 2026-06-17 | Cursor / Claude-in-Chrome | Extracted: PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact |
| 1.0 | 2026-06-17 | Cursor / Claude-in-Chrome | Extracted: POST /v1/contacts/search |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: POST /v1/contacts |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: GET /v1/contacts/{contactId} |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: PATCH /v1/contacts/{contactId} |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: POST /v1/xaction-participants |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: GET /v1/xaction-participants/{xactionParticipantId} |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: PATCH /v1/xaction-participants/{xactionParticipantId} |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: DELETE /v1/xaction-participants/{xactionParticipantId} |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: DELETE /v1/xaction-participants/{xactionParticipantId} (overwrite — added response schema from second extraction) |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: PUT /v1/xaction-participants/{xactionParticipantId}/linked-contact/{linkedContactId} |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: DELETE /v1/xaction-participants/{xactionParticipantId}/linked-contact |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: GET /v1/xaction-participant-roles |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: PATCH /v1/tasks/{taskId} |
| 1.0 | 2026-06-18 | Cursor / Claude-in-Chrome | Extracted: GET /v1/fields |

---

## How to Use This Document Set

- **Looking up an endpoint:** Find the category in the [Category Index](#category-index), open that file, find the endpoint. If status is "Extracted," the schema is there. If "Not extracted," only method/path/summary are known so far.
- **Planning a tool addition:** Pair this set with the Tool Roadmap. The Roadmap names the tool and tier; this set supplies the schema once extracted.
- **Generating a Cursor handoff for connector build:** Copy the relevant endpoint's filled section from the category file into the build handoff. The schema sections are formatted to lift cleanly into a connector tool definition.

---

## How to Add to This Reference

The reference grows one endpoint at a time. The full human extraction procedure (Swagger → Cursor) lives in [`docs/EXTRACTION_PROCEDURE.md`](../EXTRACTION_PROCEDURE.md) (`EXTRACTION-PROC-001`). This section preserves only the lay-of-the-land prompt, which is used when surveying or re-surveying the entire API surface (e.g., after Aframe announces API changes).

### Lay-of-the-land prompt (already used for v1.0)

The survey that produced the initial endpoint inventory. Re-run if Aframe publishes API changes:

```
Survey this Swagger UI page and give me the lay of the land. Don't
expand endpoints or extract schemas yet — just report what you see:
1. List the endpoint tags/categories shown in the sidebar or page
   (e.g. "Transactions", "Transaction Activities (Notes)",
   "Participants", etc.)
2. Under each category, list the endpoints — just HTTP method and
   path, plus the one-line summary if it's visible
   (e.g. "POST /v1/xactions — Create a Transaction")
3. If there's any global info visible (auth method, base URL,
   response envelope structure, rate limit info) in a page header,
   intro section, or sidebar, note that too.
Output as a plain-text outline. Once I see what's there, I'll tell
you which specific endpoints to drill into.
```

---

## Endpoint Schema Template

The format every endpoint section follows once extracted. Shown here for reference; the full prompt-ready version lives in `EXTRACTION-PROC-001`:

```markdown
#### `POST /v1/example` — Example Endpoint
**Status:** ✅ Extracted YYYY-MM-DD | Built in connector vX.Y.Z as `tool_name` *(omit "Built…" if not built)*

**Summary:** One-line description from Swagger.

**Request**
- Content-Type: `application/json`
- Path params: None
- Body schema:

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | exampleField | string | yes | … |

**Response (2xx payload)**

  | Field | Type | Description |
  |---|---|---|
  | id | integer | … |

**Quirks & notes:**
- …
```

When Cursor applies a handoff, it preserves any existing "Built in connector vX.Y.Z as `tool_name`" annotation already on the placeholder's status line.

---

## Global Info

Source: Aframe Swagger UI survey, 2026-06-14.

| Item | Value |
|---|---|
| Title | AFrameSoftware API 1.0 (OAS 3.1) |
| Base URL | `https://api.aframeonline.com/api-pub` |
| Auth | API Key via `X-AFrame-API-Key` HTTP header |
| Key source | Aframe → My Profile → API Keys (per-user) |

### Response envelope

All endpoints return:

```json
{
  "payload": { /* the requested resource, when successful */ },
  "error":   { /* present on errors and on partial-success 2xx responses */ }
}
```

- `payload` — single object, paged list, or simple string like `"success"`
- `error` — carries `messages`, `details`, and `validationErrors` on failures
- **`error` can be present on 2xx responses** as warnings (validation notices, defaulted fields). HTTP status is the authoritative success signal; see `CONNECTOR-REF-001` § 5.1 for the client's handling.

### Rate limits

- 60 requests/minute
- 2,500 requests/hour
- 429 responses include headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`

---

## Category Index

The 19 Aframe categories, in Swagger's published order. Each links to the category file in this folder.

| # | Category | Endpoints | File |
|---|---|---:|---|
| 1 | Transactions | 5 | [01-transactions.md](01-transactions.md) |
| 2 | Transaction Participants | 9 | [02-transaction-participants.md](02-transaction-participants.md) |
| 3 | Transaction Activities (Notes) | 4 | [03-transaction-activities.md](03-transaction-activities.md) |
| 4 | Transaction Attachments | 8 | [04-transaction-attachments.md](04-transaction-attachments.md) |
| 5 | Transaction Data (Custom Fields) | 3 | [05-transaction-data.md](05-transaction-data.md) |
| 6 | Events | 1 | [06-events.md](06-events.md) |
| 7 | Email Queues | 2 | [07-email-queues.md](07-email-queues.md) |
| 8 | Tasks | 4 | [08-tasks.md](08-tasks.md) |
| 9 | Contacts | 4 | [09-contacts.md](09-contacts.md) |
| 10 | Contact Notes | 5 | [10-contact-notes.md](10-contact-notes.md) |
| 11 | Files | 3 | [11-files.md](11-files.md) |
| 12 | Team Members | 5 | [12-team-members.md](12-team-members.md) |
| 13 | Admin :: Task Templates | 1 | [13-admin-task-templates.md](13-admin-task-templates.md) |
| 14 | Admin :: Custom Fields | 2 | [14-admin-custom-fields.md](14-admin-custom-fields.md) |
| 15 | Admin :: Contact Categories | 1 | [15-admin-contact-categories.md](15-admin-contact-categories.md) |
| 16 | Admin :: Transaction Participant Roles | 1 | [16-admin-participant-roles.md](16-admin-participant-roles.md) |
| 17 | Admin :: Transaction Statuses | 1 | [17-admin-transaction-statuses.md](17-admin-transaction-statuses.md) |
| 18 | Webhooks | 1 | [18-webhooks.md](18-webhooks.md) |
| 19 | Health Check | 1 | [19-health-check.md](19-health-check.md) |

**Status legend used in category files:**
- `Not extracted` — only method/path/summary known; schemas TBD
- `Extracted [date]` — full schema captured in the section
- `Built in connector vX.Y.Z as tool_name` — cross-link to the connector tool (appended to status line where applicable)

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document set. Update version history and version_date with each revision to any file.*

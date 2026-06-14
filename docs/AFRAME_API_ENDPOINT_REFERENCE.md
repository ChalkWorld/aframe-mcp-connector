---
title: Aframe API Endpoint Reference
document_id: AAR-TC-AFRAME-API-001
version: 1.0
version_date: 2026-06-14
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Aframe API Endpoint Reference
### AAR-TC Transaction Services | Document ID: AAR-TC-AFRAME-API-001

---

## Purpose

This document is the **canonical capture of the Aframe Open API's endpoint surface** as published in the Aframe Swagger UI. It is the working reference used when planning, scoping, or building new MCP tools on the Aframe Connector.

The document is structured to mirror Aframe's own categorization of endpoints (19 categories, ~55 endpoints as of v1.0). It is descriptive — it captures what the API *offers*. Decisions about what we *wrap and when* live in the Tool Roadmap (`AAR-TC-AFRAME-ROAD-001`).

### Why this document exists

The Aframe Swagger UI is JavaScript-rendered, so `web_fetch` cannot read it directly. Extraction requires Claude in Chrome, which is token-expensive. This document captures the extracted data **once**, persistently, so future build sessions can pull schema details from here rather than re-scraping the Swagger page each time.

### Relationship to other documents

```
AAR-TC-AFRAME-API-001    THIS DOC          — what the Aframe API offers
AAR-TC-AFRAME-ROAD-001   Tool Roadmap      — what we plan to wrap and when
AAR-TC-AFRAME-REF-001    Tech Reference    — how the connector is built and operates
AAR-TC-AFRAME-WF-*       Workflow docs     — business processes using the tools
```

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-14 | Andrew Rich / Claude | Initial skeleton. All 19 categories and ~55 endpoints listed as placeholders. Global info populated from Swagger survey of 2026-06-14. No per-endpoint schemas extracted yet. |

---

## How to Use This Document

- **Looking up an endpoint:** Find the category section, then the endpoint. If the status reads "Extracted," the request/response schemas and quirks are below it. If "Not extracted," only the method/path/summary are known so far.
- **Planning a tool addition:** Pair this doc with the Tool Roadmap. The Roadmap names the tool and tier; this doc supplies the schema once extracted.
- **Generating a Cursor handoff:** Copy the relevant endpoint's filled section into the handoff. The schema sections are formatted to lift cleanly into a connector tool definition.

---

## How to Add to This Document

The doc grows one endpoint at a time, separating expensive Swagger extraction from the cheap doc update:

1. **Open a Claude-in-Chrome session** on the Aframe Swagger UI page:
   `https://api.aframeonline.com/api-pub/swagger-ui/index.html`
2. **Drill into a single endpoint.** Use the per-endpoint extraction prompt below.
3. **Bring the extracted data back to a Claude/Cursor session** in this project.
4. **Cursor updates this doc** — replaces the matching endpoint's placeholder with the fully-filled section, updates the "Extracted" date and status, and bumps the version + version_date in the front matter.
5. **Commit and move on.** No bulk extraction, no token-window pressure.

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

### Per-endpoint drill-down prompt

Run this against one endpoint at a time. Replace `[METHOD] [PATH]` with the target.

```
Expand the [METHOD] [PATH] endpoint in this Swagger UI page and
extract its full specification. Report:

1. Summary and description (verbatim from the page)

2. Request:
   - Content-Type required
   - Path parameters (name, type, required, description)
   - Query parameters (name, type, required, description, default)
   - Request body schema — every field with:
     * Field name
     * Type (string, integer, boolean, array, object, enum)
     * Required (yes/no)
     * Description
     * Enum values if applicable
     * Default value if applicable
     * Format hints (e.g. date, date-time, email)
   - Any nested object schemas in full

3. Response (2xx payload schema):
   - Every field with type and description
   - Note whether payload is a single object, paged list, or string
   - Nested objects in full

4. Notable error responses (4xx codes and what triggers them)

5. Any quirks: special headers, JSON Patch requirement, enum
   constraints, envelope differences from the standard
   {payload, error} shape, anything that would surprise an
   implementer.

Output as plain markdown. I'll format it for the reference doc.
```

---

## Endpoint Schema Template

The format every endpoint section follows once extracted. Placeholder sections below convert to this shape on extraction:

```markdown
#### `POST /v1/example` — Example Endpoint
**Status:** ✅ Extracted YYYY-MM-DD | Built in connector vX.Y.Z as `tool_name` *(omit if not built)*

**Summary:** One-line description from Swagger.

**Description:** Fuller description from Swagger, if distinct from summary.

**Request**
- Content-Type: `application/json` (or `application/json-patch+json` for PATCH)
- Path params:

  | Name | Type | Required | Description |
  |---|---|---|---|
  | … | … | … | … |

- Query params: *(omit if none)*

  | Name | Type | Required | Default | Description |
  |---|---|---|---|---|
  | … | … | … | … | … |

- Body schema:

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | … | … | … | … |

**Response (2xx payload)**

  | Field | Type | Description |
  |---|---|---|
  | … | … | … |

**Enums / constants:**
- `fieldName`: VALUE_A, VALUE_B, VALUE_C

**Notable errors:**
- 400 — …
- 404 — …

**Quirks & notes:**
- …
```

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
- **`error` can be present on 2xx responses** as warnings (validation notices, defaulted fields). HTTP status is the authoritative success signal; see `AAR-TC-AFRAME-REF-001` § 5.1 for the client's handling.

### Rate limits

- 60 requests/minute
- 2,500 requests/hour
- 429 responses include headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`

---

# Endpoints

The remainder of this document is organized into the 19 categories Aframe publishes. Within each category, endpoints are listed in the order they appear in Swagger.

**Status legend for each endpoint:**
- `Not extracted` — only method/path/summary known; schemas TBD
- `Extracted [date]` — full schema captured below the header
- `Built in connector vX.Y.Z as tool_name` — cross-link to the connector tool

---

## 1. Transactions

*A real estate deal tracked through its lifecycle (e.g. listing, sale, lease), with participants, documents, dates, and tasks.*

---

#### `POST /v1/xactions` — Create a Transaction
**Status:** Not extracted | Built in connector v0.2.0 as `create_transaction`

_Schema TBD — see Endpoint Schema Template above for fill-in format._

---

#### `POST /v1/xactions/{xactionId}/apply-task-templates` — Apply task templates to a Transaction
**Status:** Not extracted

_Schema TBD._

---

#### `POST /v1/xactions/search` — Search Transactions
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/xactions/{xactionId}` — Get a Transaction
**Status:** Not extracted | Built in connector v0.2.0 as `get_transaction`

_Schema TBD._

---

#### `PATCH /v1/xactions/{xactionId}` — Update a Transaction
**Status:** Not extracted | Built in connector v0.2.0 as `update_transaction`

_Schema TBD._

---

## 2. Transaction Participants

*Manage participants or contacts involved in a Transaction (e.g. buyers, sellers, agents).*

---

#### `POST /v1/xaction-participants` — Add a participant
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/xaction-participants/{xactionParticipantId}` — Get a participant
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/xaction-participants/{xactionParticipantId}` — Update a participant
**Status:** Not extracted

_Schema TBD._

---

#### `DELETE /v1/xaction-participants/{xactionParticipantId}` — Remove a participant
**Status:** Not extracted

_Schema TBD._

---

#### `PUT /v1/xaction-participants/{xactionParticipantId}/linked-contact/{linkedContactId}` — Link a contact
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact` — Update linked contact
**Status:** Not extracted

_Schema TBD._

---

#### `DELETE /v1/xaction-participants/{xactionParticipantId}/linked-contact` — Unlink a contact
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/xaction-participants/{xactionParticipantId}/contact-info` — Update contact info on participant
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/xactions/{xactionId}/xaction-participants` — List participants on a Transaction
**Status:** Not extracted

_Schema TBD._

---

## 3. Transaction Activities (Notes)

*Timestamped activity entries logged against a Transaction to record work done.*

---

#### `POST /v1/xaction-activities` — Create an activity/note
**Status:** Not extracted | Built in connector v0.2.0 as `add_transaction_note`

_Schema TBD._

---

#### `GET /v1/xaction-activities/{xactionActivityId}` — Get an activity
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/xaction-activities/{xactionActivityId}` — Update an activity
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/xactions/{xactionId}/xaction-activities` — List activities on a Transaction
**Status:** Not extracted

_Schema TBD._

---

## 4. Transaction Attachments

*Files, weblinks, and file placeholders attached to a Transaction (e.g. signed contracts).*

---

#### `POST /v1/xaction-attachments` — Create an attachment
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/xaction-attachments/{xactionAttachmentId}` — Get an attachment
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/xaction-attachments/{xactionAttachmentId}` — Update an attachment
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file` — Assign/update file on attachment
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file/assign` — Assign file
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file/unassign` — Unassign file
**Status:** Not extracted

_Schema TBD._

---

#### `DELETE /v1/xaction-attachments/{xactionAttachmentId}/file` — Delete file from attachment
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/xactions/{xactionId}/xaction-attachments` — List attachments on a Transaction
**Status:** Not extracted

_Schema TBD._

---

## 5. Transaction Data (Custom Fields)

*Values of the Team's custom Fields on a Transaction (e.g. earnest money amount, property type).*

---

#### `PATCH /v1/xactions/{xactionId}/fields/{fieldId}` — Update a field value by field ID
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/xactions/{xactionId}/fields/code/{mergeFieldCode}` — Update a field value by merge field code
**Status:** Not extracted | Built in connector v0.2.0 as `update_custom_field`

_Schema TBD._

---

#### `GET /v1/xactions/{xactionId}/field-tree` — Get all field values for a Transaction
**Status:** Not extracted

_Schema TBD._

---

## 6. Events

*Calendar dates tied to a Transaction's lifecycle (e.g. earnest money due, financing contingency).*

---

#### `GET /v1/xactions/{xactionId}/events` — List events on a Transaction
**Status:** Not extracted

_Schema TBD._

---

## 7. Email Queues

*Emails queued or already sent for a Transaction, along with their rendered content for preview.*

---

#### `GET /v1/xactions/{xactionId}/email-queues` — List email queue entries for a Transaction
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/email-queues/{emailQueueId}/preview` — Preview a rendered email
**Status:** Not extracted

_Schema TBD._

---

## 8. Tasks

*Assignable to-do items owned by Team Members, optionally scoped to a Contact or Transaction.*

---

#### `POST /v1/tasks` — Create a task
**Status:** Not extracted

_Schema TBD._

---

#### `POST /v1/tasks/search` — Search tasks
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/tasks/{taskId}` — Get a task
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/tasks/{taskId}` — Update a task
**Status:** Not extracted

_Schema TBD._

---

## 9. Contacts

*People and organizations in the Team's address book (clients, leads, agents, lenders, vendors, etc.).*

---

#### `POST /v1/contacts` — Create a contact
**Status:** Not extracted

_Schema TBD._

---

#### `POST /v1/contacts/search` — Search contacts
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/contacts/{contactId}` — Get a contact
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/contacts/{contactId}` — Update a contact
**Status:** Not extracted

_Schema TBD._

---

## 10. Contact Notes

*Free-form notes recorded against a Contact (e.g. conversation summaries, preferences, reminders).*

---

#### `POST /v1/contact-notes` — Create a contact note
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/contact-notes/{contactNoteId}` — Get a contact note
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/contact-notes/{contactNoteId}` — Update a contact note
**Status:** Not extracted

_Schema TBD._

---

#### `DELETE /v1/contact-notes/{contactNoteId}` — Delete a contact note
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/contact/{contactId}/contact-notes` — List notes on a Contact
**Status:** Not extracted

_Schema TBD._

---

## 11. Files

*Binary downloads for file attachments referenced by Transactions, Contact Notes, and Emails.*

---

#### `GET /v1/files/xaction-attachments/{xactionAttachmentId}` — Download a transaction attachment file
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/files/email-queue-attachments/{emailQueueAttachmentId}` — Download an email queue attachment file
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/files/contact-notes/{contactNoteId}` — Download a contact note file
**Status:** Not extracted

_Schema TBD._

---

## 12. Team Members

*User accounts on the Team (agents, assistants, administrators) who own work in the system.*

---

#### `POST /v1/app-users` — Create a team member
**Status:** Not extracted

_Schema TBD._

---

#### `POST /v1/app-users/search` — Search team members
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/app-users/{appUserId}` — Get a team member
**Status:** Not extracted

_Schema TBD._

---

#### `PATCH /v1/app-users/{appUserId}` — Update a team member
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/app-users/me` — Get the current authenticated user
**Status:** Not extracted

_Schema TBD._

---

## 13. Admin :: Task Templates

*Reusable Task definitions used to generate consistent to-do items on Contacts and Transactions.*

---

#### `GET /v1/task-templates` — List task templates
**Status:** Not extracted

_Schema TBD._

---

## 14. Admin :: Custom Fields

*Team-defined Field definitions that capture extra data on Transactions.*

---

#### `GET /v1/fields` — List custom fields
**Status:** Not extracted

_Schema TBD._

---

#### `GET /v1/fields/tree` — Get fields as a tree structure
**Status:** Not extracted

_Schema TBD._

---

## 15. Admin :: Contact Categories

*Team-defined tags used to classify Contacts (e.g. Buyer, Seller, Vendor).*

---

#### `GET /v1/categories` — List contact categories
**Status:** Not extracted

_Schema TBD._

---

## 16. Admin :: Transaction Participant Roles

*Team-defined Role definitions that describe a Contact's part in a Transaction.*

---

#### `GET /v1/xaction-participant-roles` — List participant roles
**Status:** Not extracted

_Schema TBD._

---

## 17. Admin :: Transaction Statuses

*Team-defined Status definitions describing where a Transaction sits in its workflow.*

---

#### `GET /v1/xaction-statuses` — List transaction statuses
**Status:** Not extracted

_Schema TBD._

---

## 18. Webhooks

*Endpoints related to AFrame's webhook feature.*

---

#### `POST /webhook/consume` — Consume/receive a webhook event
**Status:** Not extracted

_Schema TBD._

---

## 19. Health Check

*Simple health check.*

---

#### `GET /health-check` — Health check (no auth required)
**Status:** Not extracted

_Schema TBD._

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

---
title: Aframe MCP Connector — Tool Roadmap
document_id: AAR-TC-AFRAME-ROAD-001
version: 1.0
version_date: 2026-06-13
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted scoping and documentation
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Aframe MCP Connector — Tool Roadmap
### AAR-TC Transaction Services | Document ID: AAR-TC-AFRAME-ROAD-001

---

## Purpose

This document is the authoritative list of which Aframe Open API endpoints have been wrapped as MCP tools on the connector, which are queued to be wrapped next, and which are deferred. It is the answer to the question *"What should we build into the connector next?"*

**Scope:** Tool additions only. Bug fixes, refactors, infrastructure changes, and behavioral/workflow documentation are tracked elsewhere (commit history, Technical Reference, TC workflow protocols).

---

## How to Read This Roadmap

- Tools are grouped by **status tier**, not by date. Tier indicates how soon the tool is likely to be built, not when.
- Within each tier, related tools are grouped by Aframe API category.
- **Dependencies** are called out where build order matters (e.g., adding a participant requires contact search/create first).
- This roadmap is updated whenever priorities shift, items complete, or new scope is added. A stale roadmap is worse than no roadmap.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-13 | Andrew Rich / Claude | Initial roadmap. v0.2.0 is the current released build (5 tools across transactions + custom fields + notes). |

---

## Tier 1 — Built (v0.2.0)

These tools are deployed and validated. Reference: `AFRAME_CONNECTOR_TECHNICAL_REFERENCE.md` § 4.

| Tool | Aframe endpoint | Released |
|---|---|---|
| `create_transaction` | `POST /v1/xactions` | v0.1.0 |
| `add_transaction_note` | `POST /v1/xaction-activities` | v0.1.0 |
| `get_transaction` | `GET /v1/xactions/{xactionId}` | v0.2.0 |
| `update_transaction` | `PATCH /v1/xactions/{xactionId}` | v0.2.0 |
| `update_custom_field` | `PATCH /v1/xactions/{xactionId}/fields/code/{mergeFieldCode}` | v0.2.0 |

---

## Tier 2 — Next (Phase 3 candidate)

### Participants & Contacts

The headline gap. To turn an incoming contract into a complete Aframe transaction, the connector must be able to add the buyer(s), seller(s), lender, cooperating agent, closer, and any other parties — and those parties have to exist as contacts first. This is the unlock that takes the connector from "create the shell" to "build the whole file."

**Build order matters here** because participants reference contacts. Wrap contacts first, then participants.

#### Contacts (build first)

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `search_contacts` | `POST /v1/contacts/search` | Find existing contact by name, email, etc. — primary lookup before deciding to create |
| `get_contact` | `GET /v1/contacts/{contactId}` | Fetch full contact record |
| `create_contact` | `POST /v1/contacts` | Create a new contact when search returns no match |
| `update_contact` | `PATCH /v1/contacts/{contactId}` | Edit existing contact (e.g., add missing phone/email) |

#### Participants (build after contacts)

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `list_transaction_participants` | `GET /v1/xactions/{xactionId}/xaction-participants` | See who is already on a transaction before adding |
| `add_transaction_participant` | `POST /v1/xaction-participants` | Add a participant to a transaction |
| `link_participant_contact` | `PUT /v1/xaction-participants/{id}/linked-contact/{contactId}` | Link a contact to a participant |
| `update_transaction_participant` | `PATCH /v1/xaction-participants/{id}` | Update role, notes, etc. |
| `remove_transaction_participant` | `DELETE /v1/xaction-participants/{id}` | Remove a participant (typo recovery, role changes) |

#### Discovery dependency

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `list_participant_roles` | `GET /v1/xaction-participant-roles` | Required so Claude knows which role IDs exist on the Team (Buyer, Seller, Lender, etc.) without hardcoding |

---

## Tier 3 — Planned (Phase 4 candidate)

### Tasks

Once participants land, the next workflow piece is task management — applying task templates on transaction creation, then searching, updating, and completing tasks across the lifecycle.

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `list_task_templates` | `GET /v1/task-templates` | Required to know which templates exist (e.g., "Lennar New Listing Task List") |
| `apply_task_templates` | `POST /v1/xactions/{xactionId}/apply-task-templates` | Attach one or more templates to a transaction |
| `search_tasks` | `POST /v1/tasks/search` | Find tasks by transaction, assignee, completion status |
| `get_task` | `GET /v1/tasks/{taskId}` | Inspect a specific task |
| `update_task` | `PATCH /v1/tasks/{taskId}` | Mark complete, change due date, reassign |
| `create_task` | `POST /v1/tasks` | One-off task creation (less common than via template) |

### Discovery / Admin (low-cost, high-value)

These are mostly read-only listings that let Claude self-discover the Team's configuration rather than relying on documentation. Small wins, batch them together.

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `list_custom_fields` | `GET /v1/fields` | Discover all custom field merge codes on the Team (instead of memorizing `f_EarnestMoney` etc.) |
| `list_transaction_statuses` | `GET /v1/xaction-statuses` | Discover status IDs for use in `update_transaction.xactionStatusId` |
| `list_contact_categories` | `GET /v1/categories` | Discover contact tags |
| `get_current_user` | `GET /v1/app-users/me` | Identify the authenticated user (Andrew); useful for setting agent fields explicitly rather than letting Aframe default |

### Search

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `search_transactions` | `POST /v1/xactions/search` | Find existing transactions by address, status, agent, date range — useful for duplicate checks before creating |

---

## Tier 4 — Later (lower priority, on the radar)

### Activities (notes) — read/update

Currently only `add_transaction_note` (POST) is wrapped. The remaining three endpoints (get, update, list) are useful but lower priority.

| Tool | Aframe endpoint |
|---|---|
| `list_transaction_activities` | `GET /v1/xactions/{xactionId}/xaction-activities` |
| `get_transaction_activity` | `GET /v1/xaction-activities/{xactionActivityId}` |
| `update_transaction_activity` | `PATCH /v1/xaction-activities/{xactionActivityId}` |

### Email queue

Visibility into queued/sent emails on a transaction. Read-only, useful for status checks.

| Tool | Aframe endpoint |
|---|---|
| `list_email_queue` | `GET /v1/xactions/{xactionId}/email-queues` |
| `preview_email` | `GET /v1/email-queues/{emailQueueId}/preview` |

### Events

| Tool | Aframe endpoint |
|---|---|
| `list_transaction_events` | `GET /v1/xactions/{xactionId}/events` |

### Contact notes

Notes attached directly to contacts (vs. transactions). Lower priority than transaction-level activities.

| Tool | Aframe endpoint |
|---|---|
| `create_contact_note` | `POST /v1/contact-notes` |
| `list_contact_notes` | `GET /v1/contact/{contactId}/contact-notes` |
| `get_contact_note` | `GET /v1/contact-notes/{contactNoteId}` |
| `update_contact_note` | `PATCH /v1/contact-notes/{contactNoteId}` |
| `delete_contact_note` | `DELETE /v1/contact-notes/{contactNoteId}` |

### Attachments (transaction)

Files and weblinks attached to a transaction. Lower priority because file handling adds complexity (binary uploads, content-type handling) and most attachments are managed via the Aframe UI.

| Tool | Aframe endpoint |
|---|---|
| `list_transaction_attachments` | `GET /v1/xactions/{xactionId}/xaction-attachments` |
| `get_transaction_attachment` | `GET /v1/xaction-attachments/{id}` |
| `create_transaction_attachment` | `POST /v1/xaction-attachments` |
| `update_transaction_attachment` | `PATCH /v1/xaction-attachments/{id}` |
| (plus 5 file-assignment sub-endpoints) | various | Defer until attachment workflow is needed |

### File downloads

| Tool | Aframe endpoint |
|---|---|
| `download_transaction_attachment` | `GET /v1/files/xaction-attachments/{id}` |
| `download_email_attachment` | `GET /v1/files/email-queue-attachments/{id}` |
| `download_contact_note_file` | `GET /v1/files/contact-notes/{id}` |

### Custom field by ID

Lower priority — merge-code endpoint already covers the workflow case. ID-based is useful for admin/cleanup scripts.

| Tool | Aframe endpoint |
|---|---|
| `update_custom_field_by_id` | `PATCH /v1/xactions/{xactionId}/fields/{fieldId}` |
| `get_transaction_field_tree` | `GET /v1/xactions/{xactionId}/field-tree` |

---

## Tier 5 — Out of Scope (for now)

Items deliberately not on the build path under the current architecture. Revisit when the surrounding need changes.

### Webhooks

`POST /webhook/consume` — Aframe pushes events (transaction/contact created/updated/deleted) with HMAC-SHA256 signed payloads. Out of scope because the connector currently operates request/response only. Implementing webhooks requires a public Railway endpoint with signature verification, plus a state-mirror table somewhere (Supabase or Railway-local) so Claude can query "what changed since X."

**Trigger to revisit:** When a workflow needs reactivity (Claude needs to know about an event without being asked).

### OAuth 2.1 authentication

The connector currently runs authless. OAuth 2.1 with PKCE is required for production posture but deferred until the connector moves out of POC use.

**Trigger to revisit:** Before the connector is used outside Andrew's single-user sessions, OR before it stores or processes other people's data.

### Team Members admin

`POST /v1/app-users`, `POST /v1/app-users/search`, `PATCH /v1/app-users/{id}` — administrative endpoints for managing team member accounts. Not workflow-relevant for transaction processing; managed via the Aframe UI.

**Trigger to revisit:** If multi-agent workflow automation becomes a need (unlikely in current scope).

---

## Notes on Releases

- Group tool additions into batches when possible. Each batch requires a Claude.ai connector reconnect (per Technical Reference § 6.1), so adding tools one at a time creates friction.
- Bump version (semver) per release. Minor version for feature batches, patch version for bug-fix-only releases.
- Update this roadmap on every release: move released tools to Tier 1, adjust Tier 2/3 based on what's next.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version date with each revision.*

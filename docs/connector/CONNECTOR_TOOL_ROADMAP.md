---
title: Aframe MCP Connector — Tool Roadmap
document_id: CONNECTOR-ROAD-001
version: 3.1
version_date: 2026-07-13
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted scoping and documentation
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Aframe MCP Connector — Tool Roadmap
### AAR-TC Transaction Services | Document ID: CONNECTOR-ROAD-001

---

## Purpose

This document is the authoritative list of which Aframe Open API endpoints have been wrapped as MCP tools on the connector, which are queued to be wrapped next, and which are deferred. It is the answer to the question *"What should we build into the connector next?"*

**Scope:** Tool additions only. Bug fixes, refactors, infrastructure changes, and behavioral/workflow documentation are tracked elsewhere (commit history, Technical Reference, TC workflow protocols).

---

## How to Read This Roadmap

- Tools are grouped by **status tier**, not by date. Tier indicates how soon the tool is likely to be built.
- Within each tier, related tools are grouped by Aframe API category.
- **Dependencies** are called out where build order matters.
- This roadmap is updated whenever priorities shift, items complete, or new scope is added. A stale roadmap is worse than no roadmap.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-13 | Andrew Rich / Claude | Initial roadmap. v0.2.0 is the current released build (5 tools). |
| 1.0 | 2026-06-16 | Andrew Rich / Claude | Doc ID changed to `CONNECTOR-ROAD-001`. File renamed. |
| 2.0 | 2026-06-17 | Andrew Rich / Claude | Major revision following `VISION-001` strategy session. Tier assignments revised; Cluster A and Cluster B defined; discovery tools promoted; task tools gated on `PREAUTOMATION-001`. |
| 3.0 | 2026-06-24 | Andrew Rich / Claude | Full rewrite to ground truth. Tier 1 updated to reflect all 34 tools shipped across v0.1.0–v0.5.0. Tier 2 cleared of all built items. Task tools gate lifted per Session 007 — `search_tasks`, `get_task`, `update_task`, `create_task` are now ungated Tier 2. Transaction Attachment tools (7) promoted from Tier 4 to Tier 1 on v0.5.0 build. |
| 3.1 | 2026-07-13 | Andrew Rich / Claude | Added Batch / Bulk Operations scope to Tier 2 — `bulk_update_custom_fields`, `bulk_create_contacts`, `bulk_add_transaction_participants`. Motivated by a live buyer-side intake session (7301 Karissa Farm Dr) that used ~25 individual write calls to build one file. Design and implementation deferred to a dedicated build session. |

---

## Tier 1 — Built

All tools are deployed and validated. Reference: `CONNECTOR-REF-001` § 4.

### Transactions

| Tool | Endpoint | Released |
|---|---|---|
| `create_transaction` | `POST /v1/xactions` | v0.1.0 |
| `add_transaction_note` | `POST /v1/xaction-activities` | v0.1.0 |
| `get_transaction` | `GET /v1/xactions/{xactionId}` | v0.2.0 |
| `update_transaction` | `PATCH /v1/xactions/{xactionId}` | v0.2.0 |
| `update_custom_field` | `PATCH /v1/xactions/{xactionId}/fields/code/{mergeFieldCode}` | v0.2.0 |
| `search_transactions` | `POST /v1/xactions/search` | v0.4.0 |

### Contacts

| Tool | Endpoint | Released |
|---|---|---|
| `search_contacts` | `POST /v1/contacts/search` | v0.3.0 |
| `get_contact` | `GET /v1/contacts/{contactId}` | v0.3.0 |
| `create_contact` | `POST /v1/contacts` | v0.3.0 |
| `update_contact` | `PATCH /v1/contacts/{contactId}` | v0.3.0 |

### Transaction Participants

| Tool | Endpoint | Released |
|---|---|---|
| `list_participant_roles` | `GET /v1/xaction-participant-roles` | v0.3.0 |
| `list_transaction_participants` | `GET /v1/xactions/{xactionId}/xaction-participants` | v0.3.0 |
| `add_transaction_participant` | `POST /v1/xaction-participants` | v0.3.0 |
| `get_transaction_participant` | `GET /v1/xaction-participants/{xactionParticipantId}` | v0.3.0 |
| `update_transaction_participant` | `PATCH /v1/xaction-participants/{xactionParticipantId}` | v0.3.0 |
| `remove_transaction_participant` | `DELETE /v1/xaction-participants/{xactionParticipantId}` | v0.3.0 |
| `set_participant_linked_contact` | `PUT /v1/xaction-participants/{xactionParticipantId}/linked-contact/{linkedContactId}` | v0.3.0 |
| `unlink_participant_contact` | `DELETE /v1/xaction-participants/{xactionParticipantId}/linked-contact` | v0.3.0 |
| `update_participant_linked_contact` | `PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact` | v0.4.0 |
| `update_participant_contact_info` | `PATCH /v1/xaction-participants/{xactionParticipantId}/contact-info` | v0.4.0 |

### Custom Fields & Field Admin

| Tool | Endpoint | Released |
|---|---|---|
| `list_custom_fields` | `GET /v1/fields` | v0.4.0 |
| `list_custom_fields_tree` | `GET /v1/fields/tree` | v0.4.0 |
| `get_transaction_field_tree` | `GET /v1/xactions/{xactionId}/field-tree` | v0.4.0 |

### Task Templates & Discovery

| Tool | Endpoint | Released |
|---|---|---|
| `list_task_templates` | `GET /v1/task-templates` | v0.4.0 |
| `apply_task_templates` | `POST /v1/xactions/{xactionId}/apply-task-templates` | v0.4.0 |
| `list_transaction_statuses` | `GET /v1/xaction-statuses` | v0.4.0 |
| `list_contact_categories` | `GET /v1/categories` | v0.4.0 |

### Transaction Attachments

| Tool | Endpoint | Released |
|---|---|---|
| `create_transaction_attachment` | `POST /v1/xaction-attachments` | v0.5.0 |
| `get_transaction_attachment` | `GET /v1/xaction-attachments/{xactionAttachmentId}` | v0.5.0 |
| `list_transaction_attachments` | `GET /v1/xactions/{xactionId}/xaction-attachments` | v0.5.0 |
| `update_transaction_attachment` | `PATCH /v1/xaction-attachments/{xactionAttachmentId}` | v0.5.0 |
| `upload_transaction_attachment_file` | `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file` | v0.5.0 |
| `unassign_transaction_attachment_file` | `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file/unassign` | v0.5.0 |
| `assign_transaction_attachment_file` | `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file/assign` | v0.5.0 |

---

## Tier 2 — Next

### Task Management

The `PREAUTOMATION-001` gate is lifted per Session 007. Task visibility is needed to understand what the template cleanup actually requires — can't assess task structure without being able to read the tasks. Extract all four from Swagger via `EXTRACTION-PROC-001`, then wrap.

| Tool | Endpoint | Notes |
|---|---|---|
| `search_tasks` | `POST /v1/tasks/search` | Find tasks on a transaction by status, type, or assignee |
| `get_task` | `GET /v1/tasks/{taskId}` | Inspect a specific task |
| `update_task` | `PATCH /v1/tasks/{taskId}` | Mark complete, change due date, omit conditionally, reassign |
| `create_task` | `POST /v1/tasks` | One-off task creation outside of template application |

### Batch / Bulk Operations

Added 2026-07-13, following a live buyer-side intake session that used ~25 individual write calls to build one file (7301 Karissa Farm Dr). Each bulk tool loops the existing single-entity function server-side and returns one aggregated result — Aframe still receives one HTTP call per entity (no batch endpoint exists on their side), but the loop moves below the LLM boundary instead of costing a tool-call round trip per entity. Partial-failure tolerance follows the same pattern already proven in `apply_task_templates`: a bad entry is skipped and reported, the whole batch only fails if every entry fails.

Design and implementation deferred to a dedicated session — see `SESSION-HANDOFF-2026-07-13-batch-tools.md`.

| Tool | Wraps | Notes |
|---|---|---|
| `bulk_update_custom_fields` | Loops `update_custom_field` | Input: array of `{mergeFieldCode, value}`. Highest-frequency case — 14 calls collapsed to 1 in the Karissa Farm session. |
| `bulk_create_contacts` | Loops `create_contact` | Input: array of contact objects (same shape as `create_contact` params). |
| `bulk_add_transaction_participants` | Loops `add_transaction_participant` | Input: array of participant objects (`xactionParticipantRoleId` + either `linkedContactId` or inline contact fields). Most logic of the three — each entry independently resolves to a linked or inline contact. |

Deliberately three composable tools, not one `create_full_file` mega-tool — per the same "one file per handoff, isolated and re-runnable" principle this project already applies to Cursor handoffs (`CURSOR-HANDOFF-PROTOCOL-001`). A partial failure in one bulk call (e.g. one bad merge field code) stays isolated and debuggable rather than buried in one opaque multi-resource blob.

---

## Tier 3 — Planned

Lower-frequency workflow needs that become relevant once Tier 2 is complete.

### Activities (notes) — read/update

Currently only `add_transaction_note` (POST) is wrapped. Read and update endpoints are useful for reviewing existing notes before adding new ones.

| Tool | Endpoint |
|---|---|
| `list_transaction_activities` | `GET /v1/xactions/{xactionId}/xaction-activities` |
| `get_transaction_activity` | `GET /v1/xaction-activities/{xactionActivityId}` |
| `update_transaction_activity` | `PATCH /v1/xaction-activities/{xactionActivityId}` |

### Team Member discovery

| Tool | Endpoint | Notes |
|---|---|---|
| `get_current_user` | `GET /v1/app-users/me` | Identify the authenticated user explicitly |

---

## Tier 4 — Later

### Email queue

| Tool | Endpoint |
|---|---|
| `list_email_queue` | `GET /v1/xactions/{xactionId}/email-queues` |
| `preview_email` | `GET /v1/email-queues/{emailQueueId}/preview` |

### Events (dates on a transaction)

| Tool | Endpoint |
|---|---|
| `list_transaction_events` | `GET /v1/xactions/{xactionId}/events` |

### Contact notes

| Tool | Endpoint |
|---|---|
| `create_contact_note` | `POST /v1/contact-notes` |
| `list_contact_notes` | `GET /v1/contact/{contactId}/contact-notes` |
| `get_contact_note` | `GET /v1/contact-notes/{contactNoteId}` |
| `update_contact_note` | `PATCH /v1/contact-notes/{contactNoteId}` |
| `delete_contact_note` | `DELETE /v1/contact-notes/{contactNoteId}` |

### Transaction Attachments — remaining deferred endpoint

| Tool | Endpoint | Notes |
|---|---|---|
| `delete_transaction_attachment_file` | `DELETE /v1/xaction-attachments/{xactionAttachmentId}/file` | Not needed for current workflows |

### File downloads

| Tool | Endpoint |
|---|---|
| `download_transaction_attachment` | `GET /v1/files/xaction-attachments/{id}` |
| `download_email_attachment` | `GET /v1/files/email-queue-attachments/{id}` |
| `download_contact_note_file` | `GET /v1/files/contact-notes/{id}` |

### Custom field by ID

Lower priority — the merge-code endpoint already covers the workflow case.

| Tool | Endpoint |
|---|---|
| `update_custom_field_by_id` | `PATCH /v1/xactions/{xactionId}/fields/{fieldId}` |

---

## Tier 5 — Out of Scope

### Webhooks

`POST /webhook/consume` — out of scope; connector operates request/response only. Implementing webhooks requires a public Railway endpoint with HMAC-SHA256 signature verification and a state-mirror table.

**Trigger to revisit:** When a workflow needs reactivity without being explicitly prompted.

### OAuth 2.1 authentication

Connector currently runs authless. OAuth 2.1 with PKCE required for production posture.

**Trigger to revisit:** Before the connector is used outside Andrew's single-user sessions or handles other people's data.

### Gmail integration

Email parsing → participant/field updates is currently handled via Gmail MCP connector in Claude sessions. Workflow documentation scope, not connector build scope.

**Trigger to revisit:** When `WORKFLOWS-SELLER-001` is written and the Mode 2 email-driven update pattern is formalized.

### Team Members admin

`POST /v1/app-users`, `POST /v1/app-users/search`, `PATCH /v1/app-users/{id}` — administrative endpoints for managing team member accounts. Not workflow-relevant for transaction processing.

---

## Protocol Documents

| Document ID | Workflow | Status | Tool dependencies |
|---|---|---|---|
| `WORKFLOWS-BUYER-001` | Buyer-side contract intake (Mode 1) | Planned — Priority 1 | Tier 1 complete; Tier 2 task tools next |
| `WORKFLOWS-SELLER-001` | Seller-side contract update (Mode 2) | Planned — Priority 2 | Same as buyer-side |
| `WORKFLOWS-LENNAR-001` | Lennar listing Aframe setup (Mode 1 variant) | Planned — Priority 3 | Tier 1 complete; task tools optional |

---

## Notes on Releases

- Group tool additions into batches when possible. Each batch requires a Claude.ai connector reconnect (per `CONNECTOR-REF-001` § 6.1).
- Bump version (semver) per release: minor for feature batches, patch for bug-fix-only releases.
- Update this roadmap on every release.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

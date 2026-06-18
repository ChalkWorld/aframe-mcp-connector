---
title: Aframe MCP Connector — Tool Roadmap
document_id: CONNECTOR-ROAD-001
version: 2.0
version_date: 2026-06-17
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

- Tools are grouped by **status tier**, not by date. Tier indicates how soon the tool is likely to be built, not when.
- Within each tier, related tools are grouped by Aframe API category.
- **Dependencies** are called out where build order matters (e.g., adding a participant requires contact search/create first).
- This roadmap is updated whenever priorities shift, items complete, or new scope is added. A stale roadmap is worse than no roadmap.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-13 | Andrew Rich / Claude | Initial roadmap. v0.2.0 is the current released build (5 tools across transactions + custom fields + notes). |
| 1.0 | 2026-06-16 | Andrew Rich / Claude | Doc ID changed from `AAR-TC-AFRAME-ROAD-001` to `CONNECTOR-ROAD-001`. File renamed from `AFRAME_CONNECTOR_TOOL_ROADMAP.md`. |
| 2.0 | 2026-06-17 | Andrew Rich / Claude | Major revision following `VISION-001` strategy session. Tier assignments revised: `apply_task_templates`, `search_tasks`, `update_task`, `search_transactions`, and all discovery tools promoted from Tier 3 → Tier 2. `list_transaction_participants` added as new Tier 2 item. `search_tasks` and `update_task` gated on pre-automation cleanup (see `PREAUTOMATION-001`). Protocol Documents section added. Date template discovery gap noted. Participants table corrected against Swagger screenshot — all 9 endpoints now listed with accurate paths and tool names. |

---

## Tier 1 — Built (v0.2.0)

These tools are deployed and validated. Reference: `CONNECTOR-REF-001` § 4.

| Tool | Aframe endpoint | Released |
|---|---|---|
| `create_transaction` | `POST /v1/xactions` | v0.1.0 |
| `add_transaction_note` | `POST /v1/xaction-activities` | v0.1.0 |
| `get_transaction` | `GET /v1/xactions/{xactionId}` | v0.2.0 |
| `update_transaction` | `PATCH /v1/xactions/{xactionId}` | v0.2.0 |
| `update_custom_field` | `PATCH /v1/xactions/{xactionId}/fields/code/{mergeFieldCode}` | v0.2.0 |

---

## Tier 2 — Next (Phase 3)

This tier now contains two parallel capability clusters that together make a fully-automated buyer-side intake session possible. They can be built in the same Phase 3 batch or sequenced, but both are needed before Mode 1 is complete.

### Cluster A — Participants & Contacts

The headline gap for Mode 1 intake. To turn an incoming contract into a complete Aframe transaction, the connector must be able to add the buyer(s), seller(s), lender, cooperating agent, closer, and any other parties — and those parties have to exist as contacts first. This is the unlock that takes the connector from "create the shell" to "build the whole file."

**Build order matters here** because participants reference contacts. Wrap contacts first, then participants.

#### Contacts (build first)

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `search_contacts` | `POST /v1/contacts/search` | Find existing contact by name, email, etc. — primary lookup before deciding to create |
| `get_contact` | `GET /v1/contacts/{contactId}` | Fetch full contact record |
| `create_contact` | `POST /v1/contacts` | Create a new contact when search returns no match |
| `update_contact` | `PATCH /v1/contacts/{contactId}` | Edit existing contact (e.g., add missing phone/email) |

#### Participants (build after contacts)

All 9 Swagger endpoints in this category, verified against Swagger UI 2026-06-17.

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `list_transaction_participants` | `GET /v1/xactions/{xactionId}/xaction-participants` | List who is already on a transaction — critical for Mode 2 re-orientation on existing files; already extracted in API-REF-001 |
| `add_transaction_participant` | `POST /v1/xaction-participants` | Create a participant on a transaction |
| `get_transaction_participant` | `GET /v1/xaction-participants/{xactionParticipantId}` | Fetch a single participant record |
| `update_transaction_participant` | `PATCH /v1/xaction-participants/{xactionParticipantId}` | Update participant-level fields (role, visibility, sort order, etc.) |
| `remove_transaction_participant` | `DELETE /v1/xaction-participants/{xactionParticipantId}` | Delete a participant (typo recovery, role changes) |
| `set_participant_linked_contact` | `PUT /v1/xaction-participants/{xactionParticipantId}/linked-contact/{linkedContactId}` | Set or replace the linked Contact on a participant |
| `update_participant_linked_contact` | `PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact` | Update contact info fields when a linked Contact exists — partial handoff in `handoffs/incoming/` |
| `update_participant_contact_info` | `PATCH /v1/xaction-participants/{xactionParticipantId}/contact-info` | Update contact info when no linked Contact exists — already extracted in API-REF-001 |
| `unlink_participant_contact` | `DELETE /v1/xaction-participants/{xactionParticipantId}/linked-contact` | Unlink (detach) the Contact from a participant |

#### Participant role discovery

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `list_participant_roles` | `GET /v1/xaction-participant-roles` | Required so Claude knows which role IDs exist on the Team (Buyer, Seller, Lender, etc.) without hardcoding |

---

### Cluster B — Templates, Tasks, and Discovery

**Promoted from Tier 3.** Template application is the single biggest remaining manual step in buyer-side intake. Without it, every intake session still requires UI clicks for the most critical part of setup. These tools, combined with Cluster A, complete the automation picture for Mode 1.

#### Transaction search (required for both modes)

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `search_transactions` | `POST /v1/xactions/search` | Find existing transactions by address, status, or agent — required for duplicate detection on buyer-side intake and for finding existing transactions on seller-side update (Mode 2) |

#### Task templates

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `list_task_templates` | `GET /v1/task-templates` | Discover which templates exist and their IDs — sessions must self-discover rather than rely on hardcoded values |
| `apply_task_templates` | `POST /v1/xactions/{xactionId}/apply-task-templates` | Apply one or more templates to a transaction — eliminates the biggest remaining manual click-block in intake |

#### Task management ⚠️ GATED — see dependency note below

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `search_tasks` | `POST /v1/tasks/search` | Find tasks on a transaction by status, type, or assignee |
| `get_task` | `GET /v1/tasks/{taskId}` | Inspect a specific task |
| `update_task` | `PATCH /v1/tasks/{taskId}` | Mark complete, change due date, omit conditionally, reassign |
| `create_task` | `POST /v1/tasks` | One-off task creation (less common than via template) |

> **⚠️ Dependency — do not build `search_tasks` or `update_task` until `PREAUTOMATION-001` cleanup is done.**
>
> These tools are only useful if the task templates they operate on are structured correctly — meaning conditional tasks are children of boolean flag tasks (HOA, well, septic, etc.) and the omit logic is documented. Building the tools before the templates are redesigned means any task management protocol written against them will be immediately wrong when the redesign happens. The pre-automation cleanup in `PREAUTOMATION-001` must come first. `list_task_templates`, `apply_task_templates`, and `search_transactions` have no such dependency and can be built now.

#### Discovery / Admin (self-configure)

These are read-only listings that let sessions self-discover Team configuration rather than relying on hardcoded IDs. Low build cost, high long-term value — batch with the task template tools.

| Tool | Aframe endpoint | Notes |
|---|---|---|
| `list_transaction_statuses` | `GET /v1/xaction-statuses` | Discover status IDs for use in `update_transaction.xactionStatusId` |
| `list_custom_fields` | `GET /v1/fields` | Discover all custom field merge codes on the Team |
| `list_contact_categories` | `GET /v1/categories` | Discover contact tags |
| `get_current_user` | `GET /v1/app-users/me` | Identify the authenticated user (Andrew) explicitly |

> **Note — Date template discovery gap:** There is no Aframe API endpoint equivalent to `GET /v1/task-templates` for date templates. The Aframe API has 19 published categories; none covers date template listing. Date template IDs will need to be hardcoded into protocol documents or manually documented until Aframe adds a discovery endpoint (if they do). This is a known gap; note it in `WORKFLOWS-BUYER-001` when that doc is written.

---

## Tier 3 — Planned (Phase 4 candidate)

Tools moved up to Tier 2 in v2.0 revision. Remaining Tier 3 items are lower-frequency workflow needs that become relevant once Mode 1 and Mode 2 are fully operational.

### Activities (notes) — read/update

Currently only `add_transaction_note` (POST) is wrapped. The remaining three endpoints are useful for reviewing existing notes before adding new ones, but not blocking for intake.

| Tool | Aframe endpoint |
|---|---|
| `list_transaction_activities` | `GET /v1/xactions/{xactionId}/xaction-activities` |
| `get_transaction_activity` | `GET /v1/xaction-activities/{xactionActivityId}` |
| `update_transaction_activity` | `PATCH /v1/xaction-activities/{xactionActivityId}` |

---

## Tier 4 — Later (lower priority, on the radar)

### Email queue

Visibility into queued/sent emails on a transaction. Read-only, useful for status checks.

| Tool | Aframe endpoint |
|---|---|
| `list_email_queue` | `GET /v1/xactions/{xactionId}/email-queues` |
| `preview_email` | `GET /v1/email-queues/{emailQueueId}/preview` |

### Events (dates on a transaction)

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
| (plus 5 file-assignment sub-endpoints) | various — defer until attachment workflow is needed |

### Custom field by ID

Lower priority — merge-code endpoint already covers the workflow case.

| Tool | Aframe endpoint |
|---|---|
| `update_custom_field_by_id` | `PATCH /v1/xactions/{xactionId}/fields/{fieldId}` |
| `get_transaction_field_tree` | `GET /v1/xactions/{xactionId}/field-tree` |

### File downloads

| Tool | Aframe endpoint |
|---|---|
| `download_transaction_attachment` | `GET /v1/files/xaction-attachments/{id}` |
| `download_email_attachment` | `GET /v1/files/email-queue-attachments/{id}` |
| `download_contact_note_file` | `GET /v1/files/contact-notes/{id}` |

---

## Tier 5 — Out of Scope (for now)

Items deliberately not on the build path under the current architecture. Revisit when the surrounding need changes.

### Webhooks

`POST /webhook/consume` — Aframe pushes events with HMAC-SHA256 signed payloads. Out of scope because the connector currently operates request/response only. Implementing webhooks requires a public Railway endpoint with signature verification, plus a state-mirror table.

**Trigger to revisit:** When a workflow needs reactivity (Claude needs to know about an event without being asked).

### OAuth 2.1 authentication

The connector currently runs authless. OAuth 2.1 with PKCE is required for production posture but deferred until the connector moves out of POC use.

**Trigger to revisit:** Before the connector is used outside Andrew's single-user sessions, or before it stores or processes other people's data.

### Gmail integration (Mode 2)

Email parsing → participant/field updates is currently handled via Gmail MCP connector in Claude sessions. Needs a defined protocol before it can be systematized. This is workflow documentation scope, not connector build scope.

**Trigger to revisit:** When `WORKFLOWS-SELLER-001` is written and the Mode 2 email-driven update pattern is formalized.

### Team Members admin

`POST /v1/app-users`, `POST /v1/app-users/search`, `PATCH /v1/app-users/{id}` — administrative endpoints for managing team member accounts. Not workflow-relevant for transaction processing.

**Trigger to revisit:** If multi-agent workflow automation becomes a need (unlikely in current scope).

---

## Protocol Documents

Tools and protocols ship together — a tool without a protocol is a capability with no behavior spec, and a protocol without the underlying tools is aspirational. This section tracks the workflow protocol documents that define how the connector's tools get used in practice.

These documents live in `WORKFLOWS-FW-001` (index) and the individual workflow files. The table below maps each protocol to the tool tiers it depends on, so it's clear what must be built before each protocol can be written or executed.

| Document ID | Workflow | Status | Tool dependencies |
|---|---|---|---|
| `WORKFLOWS-BUYER-001` | Buyer-side contract intake (Mode 1) | Planned — Priority 1 | Tier 1 (done), Tier 2 Cluster A + B; `search_tasks` / `update_task` gated on `PREAUTOMATION-001` |
| `WORKFLOWS-SELLER-001` | Seller-side contract update (Mode 2) | Planned — Priority 2 | Same as buyer-side plus `search_transactions` for finding existing files |
| `WORKFLOWS-LENNAR-001` | Lennar listing Aframe setup (Mode 1 variant) | Planned — Priority 3 | Tier 2 Cluster B (`apply_task_templates`); contacts optional since Seller Company covers Lennar side |

**Write order:** `WORKFLOWS-BUYER-001` first, immediately after `PREAUTOMATION-001` cleanup is complete. Seller-side protocol follows. Lennar workflow protocol follows once buyer-side is stable (Lennar is a simpler variant of the same pattern).

---

## Open Items and Pending Handoffs

- **`PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact`** — partial handoff prepared in an earlier session, never completed. Now listed in the roadmap as `update_participant_linked_contact`. Pick up from `handoffs/incoming/` when extraction resumes.
- **`list_transaction_participants` and `update_participant_contact_info`** — both already extracted in `API-REF-001` (category 2). Include in the next participant tool batch; no Swagger work needed, schemas are ready.
- **Date template IDs** — no API discovery endpoint exists. Template IDs must be manually documented. Add a section to `WORKFLOWS-BUYER-001` with the hardcoded ID list once the pre-automation cleanup is done and template structure is finalized.

---

## Notes on Releases

- Group tool additions into batches when possible. Each batch requires a Claude.ai connector reconnect (per `CONNECTOR-REF-001` § 6.1), so adding tools one at a time creates friction.
- Bump version (semver) per release. Minor version for feature batches, patch version for bug-fix-only releases.
- Update this roadmap on every release: move released tools to Tier 1, adjust Tier 2/3 based on what's next.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

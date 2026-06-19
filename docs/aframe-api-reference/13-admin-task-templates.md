---
title: Aframe API Reference — 13. Admin :: Task Templates
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 13. Admin :: Task Templates
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*Reusable Task definitions used to generate consistent to-do items on Contacts and Transactions.*

---

#### `GET /v1/task-templates` — List Task Templates
**Status:** ✅ Extracted 2026-06-18

**Summary:** List Task Templates

**Description:** Returns every Task Template defined for the Team. Optionally filter by `taskTemplateType` to return only templates for Contacts or Transactions.

**Request**
- Content-Type: `application/json`
- Path params: None
- Query params:

  | Param | Type | Required | Description |
  |---|---|---|---|
  | `taskTemplateType` | string (enum) | no | Scope results to `"CONTACT"` or `"XACTION"` templates. Omit for all templates. |

- Body schema: None

**Response (2xx payload)**

Response is a bare array of TaskTemplate objects.

| Field | Type | Description |
|---|---|---|
| `[].taskTemplateId` | integer (int32) | Task Template ID |
| `[].teamId` | integer (int32) | Team ID |
| `[].name` | string | Task Template name |
| `[].description` | string | Task Template description |
| `[].taskTemplateType` | string (enum) | `"CONTACT"` or `"XACTION"` |
| `[].folder.folderId` | integer (int32) | Folder ID |
| `[].folder.teamId` | integer (int32) | Folder's team ID |
| `[].folder.contactId` | integer (int32) | Contact ID (if folder is contact-scoped) |
| `[].folder.xactionId` | integer (int32) | Xaction ID (if folder is xaction-scoped) |
| `[].folder.name` | string | Folder name |
| `[].folder.folderType` | string (enum) | Folder type — see enums |
| `[].folder.renderClosed` | boolean | Render folder initially closed? |
| `[].folder.sort` | integer (int32) | Folder sort order |
| `[].taskFolderName` | string | Folder name created when the template is applied to a Contact or Transaction |
| `[].sort` | integer (int32) | Sort order for this Task Template |

**Enums / constants:**
- `taskTemplateType`: `"CONTACT"`, `"XACTION"`
- `folder.folderType`: `"TEAM_ATTACHMENTS"`, `"LETTER_TEMPLATES"`, `"TASK_TEMPLATES"`, `"EVENT_TEMPLATES"`, `"ATTACHMENT_TEMPLATES"`, `"XACTION_ATTACHMENTS"`, `"TASKS"`, `"EVENTS"`

**Notable errors:**
All non-2xx responses use the `APIResponse` envelope: `payload` (any), `error.requestId` (string), `error.messages` (array<string>), `error.details` (array<string>), `error.validationErrors[].fieldName` (string), `error.validationErrors[].message` (string).

- `400` Bad Request — `taskTemplateType` value is not a recognized enum.
- `429` Too Many Requests — Rate limit exceeded.

**Quirks & notes:**
- Response is a bare array (not wrapped in `APIResponse`).
- `folder.contactId` and `folder.xactionId` are only relevant when the folder is scoped to a specific record; typically null on Team-level template folders.
- Authentication: global `X-AFrame-API-Key` header.

---


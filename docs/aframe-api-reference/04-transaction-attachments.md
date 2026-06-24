---
title: Aframe API Reference — 4. Transaction Attachments
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 4. Transaction Attachments
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*Files, weblinks, and file placeholders attached to a Transaction (e.g. signed contracts).*

---

#### `POST /v1/xaction-attachments` — Create an attachment
**Status:** ✅ Extracted 2026-06-24

**Summary:** Create a Transaction Attachment

**Description:** Creates a new Transaction Attachment record (metadata only). To attach a file, first create the attachment with this endpoint, then upload the file to `PATCH /xaction-attachments/{id}/file`.

**Request**
- Content-Type: `application/json`
- Path params: None
- Body schema (`APIXactionAttachmentCreateDto`):

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | `xactionId` | integer (int32) | — | ID of the Xaction the attachment belongs to |
  | `folderId` | integer (int32) | — | ID of the Folder to place the attachment in; mutually exclusive with `newFolderName` |
  | `newFolderName` | string | — | Name of a new Folder to create and place the attachment in; mutually exclusive with `folderId` |
  | `attachmentType` | string enum | — | Attachment type (`"FILE"` or `"URL"`) |
  | `title` | string ≤300 chars | — | Attachment title |
  | `description` | string ≤65535 chars | — | Attachment description |
  | `webLink` | string (uri) | required if `attachmentType` is `"URL"` | URL link |
  | `required` | boolean | — | Whether the attachment is required |
  | `completed` | boolean | — | Whether the attachment is completed |
  | `color` | string enum | — | Color (default `"NONE"`) |
  | `agentVisible` | boolean | — | Whether the attachment is visible on the Agent Portal |
  | `buyerSellerVisible` | boolean | — | Whether the attachment is visible on the Buyer/Seller Portal |
  | `mergeFieldCode` | string | — | Merge field code |
  | `sort` | integer (int32) | — | Sort order within the Folder |

**Response (2xx payload)** (`APIXactionAttachmentDto`)

  | Field | Type | Description |
  |---|---|---|
  | `xactionAttachmentId` | integer (int32) | ID of the XactionAttachment |
  | `xactionId` | integer (int32) | ID of the associated Xaction |
  | `appUserId` | integer (int32) | ID of the AppUser who created the entry or uploaded the attachment |
  | `attachmentType` | string enum | Attachment type |
  | `title` | string ≤100 chars | Title |
  | `description` | string ≤500 chars | Description |
  | `fileName` | string ≤255 chars | File name |
  | `contentType` | string ≤100 chars | Content type (MIME) |
  | `fileSizeBytes` | integer (int64) | File size in bytes |
  | `fileUploadDateTime` | string (date-time) | Date and time the file was uploaded |
  | `webLink` | string (uri) ≤500 chars | Web link for attachments of type `"URL"` |
  | `required` | boolean | Whether the attachment is required |
  | `completed` | boolean | Whether the attachment is completed |
  | `color` | string enum | Color |
  | `agentVisible` | boolean | Whether the attachment is visible on the Agent Portal |
  | `buyerSellerVisible` | boolean | Whether the attachment is visible on the Buyer/Seller Portal |
  | `mergeFieldCode` | string ≤100 chars | Merge field code |
  | `sort` | integer (int32) | Sort order |
  | `createDateTime` | string (date-time) | Date and time the record was created |
  | `folder` | object | Folder containing this attachment (null if not in a folder) |
  | `folder.folderId` | integer (int32) | ID of the Folder |
  | `folder.name` | string | Folder name |
  | `folder.sort` | integer (int32) | Folder sort order |

**Enums / constants:**
- `attachmentType`: `"FILE"`, `"URL"`
- `color`: `"NONE"`, `"RED"`, `"TANGERINE"`, `"TAUPE"`, `"YELLOW"`, `"LIME"`, `"GREEN"`, `"CYAN"`, `"TEAL"`, `"COBALT"`, `"PURPLE"`, `"MAGENTA"` (default: `"NONE"`)

**Notable errors:**

Error responses use the `APIResponse` envelope (`payload`, `error.requestId`, `error.messages[]`, `error.details[]`, `error.validationErrors[].fieldName`, `error.validationErrors[].message`).

- `400` — Bad Request: Malformed JSON or unreadable payload
- `403` — Forbidden: Authenticated user does not have permission
- `404` — Not Found: A related entity (Xaction, Folder) was not found
- `422` — Unprocessable Content: Validation errors occurred
- `429` — Too Many Requests: Rate limit exceeded

**Quirks & notes:**
- Two-step process: create metadata with this endpoint, then upload the file via `PATCH /xaction-attachments/{id}/file`
- `folderId` and `newFolderName` are mutually exclusive
- `webLink` is required when `attachmentType` is `"URL"`
- Request body `title` allows ≤300 chars; response `title` is ≤100 chars — API may truncate on read
- Request body `description` allows ≤65535 chars; response `description` is ≤500 chars — same truncation risk
- Authentication: global `X-AFrame-API-Key` header

---

#### `GET /v1/xaction-attachments/{xactionAttachmentId}` — Get an attachment
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xaction-attachments/{xactionAttachmentId}` — Update an attachment
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file` — Assign/update file on attachment
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file/assign` — Assign file
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xaction-attachments/{xactionAttachmentId}/file/unassign` — Unassign file
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `DELETE /v1/xaction-attachments/{xactionAttachmentId}/file` — Delete file from attachment
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `GET /v1/xactions/{xactionId}/xaction-attachments` — List attachments on a Transaction
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---


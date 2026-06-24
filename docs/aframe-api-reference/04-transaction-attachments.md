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

#### `GET /v1/xaction-attachments/{xactionAttachmentId}` — Get a Transaction Attachment
**Status:** ✅ Extracted 2026-06-24

**Summary:** Get a Transaction Attachment

**Description:** Returns the Transaction Attachment with the supplied ID.

**Request**
- Content-Type: `application/json`
- Path params:

  | Param | Type | Required | Description |
  |---|---|---|---|
  | `xactionAttachmentId` | integer (int32) | Yes | ID of the XactionAttachment |

- Query params: None
- Body schema: None

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

- `403` — Forbidden: The authenticated user does not have permission to access this Transaction Attachment.
- `404` — Not Found: Transaction Attachment with the supplied ID does not exist.
- `429` — Too Many Requests: Rate limit exceeded.

**Quirks & notes:**
- Response DTO is `APIXactionAttachmentDto` — same shape as the `POST /v1/xaction-attachments` create response.
- `folder` field is `null` if the attachment is not in a folder.
- Authentication: global `X-AFrame-API-Key` header.

---

#### `PATCH /v1/xaction-attachments/{xactionAttachmentId}` — Patch a Transaction Attachment
**Status:** ✅ Extracted 2026-06-24

**Summary:** Patch a Transaction Attachment

**Description:** Updates the specified Transaction Attachment using JSON Patch (RFC 6902) operations. See `APIXactionAttachmentPatchDto` for the patchable fields. Attempts to patch fields outside this set return 400.

**Request**
- Content-Type: `application/json-patch+json`
- Path params:

  | Param | Type | Required | Description |
  |---|---|---|---|
  | `xactionAttachmentId` | integer (int32) | Yes | ID of the XactionAttachment to patch |

- Query params: None
- Body schema (`APIXactionAttachmentPatchDto` — JSON Patch target fields):

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | `attachmentType` | string enum | — | Attachment type (`"FILE"` or `"URL"`) |
  | `title` | string ≤300 chars | — | Attachment title |
  | `description` | string ≤65535 chars | — | Attachment description |
  | `webLink` | string (uri) | — | URL link (applicable when `attachmentType` is `"URL"`) |
  | `fileName` | string | — | File name of the stored file (rename without re-uploading; extension must match) |
  | `required` | boolean | — | Whether the attachment is required |
  | `completed` | boolean | — | Whether the attachment is completed |
  | `color` | string enum | — | Color (default `"NONE"`) |
  | `agentVisible` | boolean | — | Whether the attachment is visible on the Agent Portal |
  | `buyerSellerVisible` | boolean | — | Whether the attachment is visible on the Buyer/Seller Portal |
  | `mergeFieldCode` | string | — | Merge field code |
  | `sort` | integer (int32) | — | Sort order within the Folder |
  | `folderId` | integer (int32) | — | ID of the Folder to move the attachment to; mutually exclusive with `newFolderName` |
  | `newFolderName` | string | — | Name of a new Folder to create and move the attachment to; mutually exclusive with `folderId` |

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

- `400` — Bad Request: Invalid JSON Patch format or operation
- `403` — Forbidden: The authenticated user does not have permission to update this Transaction Attachment
- `404` — Not Found: Transaction Attachment with the supplied ID does not exist
- `422` — Unprocessable Content: Validation errors occurred
- `429` — Too Many Requests: Rate limit exceeded

**Quirks & notes:**
- Request body is a JSON Patch (RFC 6902) array — standard ops (`add`, `replace`, `remove`, etc.) targeting the `APIXactionAttachmentPatchDto` fields listed above.
- Only fields defined in `APIXactionAttachmentPatchDto` may be patched; targeting other paths returns 400.
- `folderId` and `newFolderName` are mutually exclusive — use one or the other to move/assign a folder.
- To rename a file, patch `fileName`; the new extension must match the existing one.
- To upload, replace, remove, or reassign the actual file binary, use the dedicated `/file` sub-routes instead.
- `color` defaults to `"NONE"` if not set.
- Authentication: global `X-AFrame-API-Key` header.

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

#### `GET /v1/xactions/{xactionId}/xaction-attachments` — List Transaction Attachments for a Transaction
**Status:** ✅ Extracted 2026-06-24

**Summary:** List Transaction Attachments for a Transaction

**Description:** Returns a paged list of file attachments on the specified Transaction. Only non-omitted attachments are returned. Pagination via page (0-based) and pageSize (max 100) is supported as query parameters.

**Request**
- Content-Type: `application/json`
- Path params:

  | Param | Type | Required | Description |
  |---|---|---|---|
  | `xactionId` | integer (int32) | Yes | ID of the Transaction whose attachments to fetch |

- Query params (`apiXactionAttachmentPagedQueryDto`):

  | Param | Type | Required | Description / Notes |
  |---|---|---|---|
  | `page` | integer (int32) ≥ 0 | — | Page number (0-based); default `0` |
  | `pageSize` | integer (int32) [1, 100] | — | Page size (max 100); default `50` |

- Body schema: None

**Response (2xx payload)** (`APIXactionAttachmentListDto`)

  | Field | Type | Description |
  |---|---|---|
  | `xactionAttachments[]` | array | List of XactionAttachment objects |
  | `xactionAttachments[].xactionAttachmentId` | integer (int32) | ID of the XactionAttachment |
  | `xactionAttachments[].xactionId` | integer (int32) | ID of the associated Xaction |
  | `xactionAttachments[].appUserId` | integer (int32) | ID of the AppUser who created the entry or uploaded the attachment |
  | `xactionAttachments[].attachmentType` | string enum | Attachment type |
  | `xactionAttachments[].title` | string ≤100 chars | Title |
  | `xactionAttachments[].description` | string ≤500 chars | Description |
  | `xactionAttachments[].fileName` | string ≤255 chars | File name |
  | `xactionAttachments[].contentType` | string ≤100 chars | Content type (MIME) |
  | `xactionAttachments[].fileSizeBytes` | integer (int64) | File size in bytes |
  | `xactionAttachments[].fileUploadDateTime` | string (date-time) | Date and time the file was uploaded |
  | `xactionAttachments[].webLink` | string (uri) ≤500 chars | Web link for attachments of type `"URL"` |
  | `xactionAttachments[].required` | boolean | Whether the attachment is required |
  | `xactionAttachments[].completed` | boolean | Whether the attachment is completed |
  | `xactionAttachments[].color` | string enum | Color (default `"NONE"`) |
  | `xactionAttachments[].agentVisible` | boolean | Whether the attachment is visible on the Agent Portal |
  | `xactionAttachments[].buyerSellerVisible` | boolean | Whether the attachment is visible on the Buyer/Seller Portal |
  | `xactionAttachments[].mergeFieldCode` | string ≤100 chars | Merge field code |
  | `xactionAttachments[].sort` | integer (int32) | Sort order |
  | `xactionAttachments[].createDateTime` | string (date-time) | Date and time the record was created |
  | `xactionAttachments[].folder` | object | Folder containing this attachment (null if not in a folder) |
  | `xactionAttachments[].folder.folderId` | integer (int32) | ID of the Folder |
  | `xactionAttachments[].folder.name` | string | Folder name |
  | `xactionAttachments[].folder.sort` | integer (int32) | Folder sort order |
  | `pageMetadata` | object | Page metadata |
  | `pageMetadata.page` | integer (int32) | Current page number (0-based) |
  | `pageMetadata.pageSize` | integer (int32) | Current page size |
  | `pageMetadata.totalElementsOnPage` | integer (int32) | Number of elements on this page |
  | `pageMetadata.totalElements` | integer (int32) | Total number of elements |
  | `pageMetadata.hasNextPage` | boolean | Has next page |
  | `pageMetadata.lastPage` | integer (int32) | Last page number |
  | `pageMetadata.groupCounts` | object | Optional map of group counts if grouping applied (values: integer int32) |

**Enums / constants:**
- `attachmentType`: `"FILE"`, `"URL"`
- `color`: `"NONE"`, `"RED"`, `"TANGERINE"`, `"TAUPE"`, `"YELLOW"`, `"LIME"`, `"GREEN"`, `"CYAN"`, `"TEAL"`, `"COBALT"`, `"PURPLE"`, `"MAGENTA"` (default: `"NONE"`)

**Notable errors:**

Error responses use the `APIResponse` envelope (`payload`, `error.requestId`, `error.messages[]`, `error.details[]`, `error.validationErrors[].fieldName`, `error.validationErrors[].message`).

- `403` — Forbidden: The authenticated user does not have permission to access this Transaction.
- `404` — Not Found: Transaction with the supplied ID does not exist.
- `429` — Too Many Requests: Rate limit exceeded.

**Quirks & notes:**
- Response is wrapped in `APIXactionAttachmentListDto` containing a `xactionAttachments[]` array and `pageMetadata`.
- Query parameters are passed as the `apiXactionAttachmentPagedQueryDto` object; only `page` and `pageSize` are supported fields.
- Only non-omitted attachments are returned.
- `folder` is `null` if the attachment is not in a folder.
- `pageMetadata.groupCounts` is an additional-properties map (string → integer); only present if grouping is applied.
- Authentication: global `X-AFrame-API-Key` header.

---


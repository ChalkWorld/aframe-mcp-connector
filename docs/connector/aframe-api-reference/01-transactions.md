---
title: Aframe API Reference — 1. Transactions
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 1. Transactions
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*A real estate deal tracked through its lifecycle (e.g. listing, sale, lease), with participants, documents, dates, and tasks.*

---

#### `POST /v1/xactions` — Create a Transaction
**Status:** Not extracted | Built in connector v0.2.0 as `create_transaction`

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `POST /v1/xactions/{xactionId}/apply-task-templates` — Apply TaskTemplates to a Transaction
**Status:** ✅ Extracted 2026-06-18

**Summary:** Apply TaskTemplates to a Transaction

**Description:** Applies one or more TaskTemplates to the specified Transaction. Each TaskTemplate's entries are converted into individual Tasks attached to the Transaction. Invalid TaskTemplate IDs are skipped and reported as warnings in the response; if all IDs are invalid the request fails with a validation error.

**Request**
- Content-Type: `application/json`
- Path params:

  | Param | Type | Required | Description |
  |---|---|---|---|
  | `xactionId` | integer (int32) | yes | ID of the Transaction to apply the TaskTemplates to |

- Query params: None
- Body schema (`APIXactionApplyTaskTemplatesRequestDto`):

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | `taskTemplateIds` | array\<integer (int32)\> | yes | IDs of the TaskTemplates to apply; invalid IDs are skipped with a warning, and if all IDs are invalid the request fails with a validation error |
  | `startDate` | string (date) | no | Start date used when computing due dates for generated Tasks; if omitted, defaults to today in the authenticated user's time zone |

**Response (2xx payload)**

Returns an array of `APITaskBriefDto` objects — one per Task created.

  | Field | Type | Description |
  |---|---|---|
  | `taskId` | integer (int32) | ID of the Task |
  | `contactId` | integer (int32) | ID of the associated Contact |
  | `xactionId` | integer (int32) | ID of the associated Xaction |
  | `appUserId` | integer (int32) | ID of the AppUser assigned to the task |
  | `folderId` | integer (int32) | ID of the associated Folder |
  | `taskType` | string (enum) | Task type — see enums |
  | `status` | string (enum) | Task status — see enums |
  | `subject` | string | Task subject/title |
  | `color` | string (enum) | Color — default `"NONE"` — see enums |
  | `dueDate` | string (date) | Due date |
  | `dueTime` | string | Due time (converted from `dueTimeMinutes`) |
  | `timeZone.zoneId` | string | Time zone ID |
  | `timeZone.fullName` | string | Time zone full name |
  | `timeZone.shortName` | string | Time zone short name |
  | `completeDate` | string (date) | Completion date |
  | `appUserIdCompletedBy` | integer (int32) | ID of the AppUser who completed the task |
  | `editDateTime` | string (date-time) | Last edit date/time |
  | `createDateTime` | string (date-time) | Creation date/time |

**Enums / constants:**
- `taskType`: `"TODO"`, `"PHONE"`, `"LETTER"`, `"EMAIL"`
- `status`: `"OPEN"`, `"IN_PROGRESS"`, `"COMPLETE"`
- `color`: `"NONE"`, `"RED"`, `"TANGERINE"`, `"TAUPE"`, `"YELLOW"`, `"LIME"`, `"GREEN"`, `"CYAN"`, `"TEAL"`, `"COBALT"`, `"PURPLE"`, `"MAGENTA"` — default `"NONE"`

**Notable errors:**

All error responses use the `APIResponse` envelope (`payload`, `error.requestId`, `error.messages`, `error.details`, `error.validationErrors[].fieldName`, `error.validationErrors[].message`).

- `400` — Bad Request: Malformed JSON or unreadable payload
- `403` — Forbidden: The authenticated user does not have permission to access this Transaction
- `404` — Not Found: Transaction with the supplied ID does not exist
- `422` — Unprocessable Content: No valid TaskTemplate IDs were supplied
- `429` — Too Many Requests: Rate limit exceeded

**Quirks & notes:**
- Invalid `taskTemplateIds` entries are silently skipped with warnings in the response; the request only fails (422) when *all* provided IDs are invalid.
- `startDate` controls due date calculation for generated Tasks; omitting it defaults to today in the user's time zone.
- Authentication: global `X-AFrame-API-Key` header.

---

#### `POST /v1/xactions/search` — Search Transactions
**Status:** ✅ Extracted 2026-06-18

**Summary:** Search Transactions

**Description:** Search for Transactions using the supplied criteria. Pagination via `page` (0-based) and `pageSize` (max 100) is supported. Use the `includes` array to eagerly load related data (Participants, Events, Attachments) in a single response.

**Request**
- Content-Type: `application/json`
- Path params: None
- Query params: None
- Body schema (`APIXactionPagedQueryDto`):

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | `searchCriteria.xactionId` | integer (int32) | no | Filter by single Xaction ID |
  | `searchCriteria.xactionIds` | array\<integer\> (unique) | no | Filter by multiple Xaction IDs (max 100) |
  | `searchCriteria.xactionStages` | array\<string\> (enum, unique) | no | Filter by stage — see enums |
  | `searchCriteria.searchAddress` | string | no | General address search across `propNum`, `propStreetDir`, `propStreet`, `propStreetUnit` |
  | `searchCriteria.propNum` | string | no | Filter by property address number |
  | `searchCriteria.propStreetDir` | string | no | Filter by property street direction |
  | `searchCriteria.propStreet` | string | no | Filter by property street name |
  | `searchCriteria.propStreetUnit` | string | no | Filter by property street unit |
  | `searchCriteria.city` | string | no | Filter by property city |
  | `searchCriteria.state` | string | no | Filter by property state |
  | `searchCriteria.zip` | string | no | Filter by property zip code |
  | `searchCriteria.xactionEditDateTime.from` | string (date-time) | no | Edit date range start, ISO-8601, inclusive |
  | `searchCriteria.xactionEditDateTime.to` | string (date-time) | no | Edit date range end, ISO-8601, inclusive |
  | `searchCriteria.xactionCreateDateTime.from` | string (date-time) | no | Create date range start, ISO-8601, inclusive |
  | `searchCriteria.xactionCreateDateTime.to` | string (date-time) | no | Create date range end, ISO-8601, inclusive |
  | `includes` | array\<string\> (enum, unique) | no | Eager-load related data — see enums. Options: `"PARTICIPANTS"`, `"EVENTS"`, `"ATTACHMENTS"` |
  | `page` | integer (int32, ≥0) | no | Page number (0-based). Default: `0` |
  | `pageSize` | integer (int32, [1,100]) | no | Page size, max 100. Default: `20` |

**Response (2xx payload)**

Response is `APIXactionPagedResultDto`. Core Transaction digest fields are always present; `xactionParticipants`, `events`, and `xactionAttachments` are only populated when the corresponding value is included in `includes`.

*Transaction core fields (`items[]`):*

| Field | Type | Description |
|---|---|---|
| `items[].xactionId` | integer (int32) | ID of the Xaction |
| `items[].xactionStatus.xactionStatusId` | integer (int32) | Status ID |
| `items[].xactionStatus.name` | string | Status name |
| `items[].xactionStatus.sort` | integer (int32) | Status sort order |
| `items[].xactionStatus.xactionStage` | string (enum) | Stage — see enums |
| `items[].xactionStatus.xactionStatusSystemType` | string (enum) | System type — see enums |
| `items[].xactionStatus.colorHex` | string | Status color hex code |
| `items[].xactionStatus.agentVisible` | boolean | Visible to agents? |
| `items[].xactionStatus.buyerSellerVisible` | boolean | Visible on Buyer/Seller portal? |
| `items[].address.address1` | string | Address line 1 |
| `items[].address.address2` | string | Address line 2 |
| `items[].address.city` | string | City |
| `items[].address.state` | string | State abbreviation |
| `items[].address.zip` | string | Zip code |
| `items[].address.country` | string | Country |
| `items[].address.county` | string | County |
| `items[].address.latitude` | number (double) | Latitude |
| `items[].address.longitude` | number (double) | Longitude |
| `items[].address.usstate` | string (enum) | US state/territory — see enums |
| `items[].address.cszstring` | string | City/state/zip formatted string |
| `items[].address.propNum` | string | Street number |
| `items[].address.propStreetDir` | string | Street direction |
| `items[].address.propStreet` | string | Street name |
| `items[].address.propStreetUnit` | string | Unit number |
| `items[].address.timeZone` | string | Default time zone of the transaction |
| `items[].xactionSide` | string (enum) | Side — see enums |
| `items[].listPrice` | number | List price |
| `items[].listPriceOriginal` | number | Original list price |
| `items[].contractPrice` | number | Contract price |
| `items[].percentageCommission` | number | Commission percentage (decimal, e.g. `0.03` = 3%) |
| `items[].listDate` | string (date) | Date property was listed |
| `items[].onMarketDate` | string (date) | Date property went on market |
| `items[].expireDate` | string (date) | Listing expiry date |
| `items[].effectiveDate` | string (date) | Effective date of the transaction |
| `items[].closingDate` | string (date) | Closing date |
| `items[].closedDate` | string (date) | Date transaction closed |
| `items[].createDateTime` | string (date-time) | Transaction created |
| `items[].editDateTime` | string (date-time) | Transaction last edited |
| `items[].xactionFieldData` | object (map\<string, string\>) | Custom field values keyed by `mergeFieldCode` (or `fieldId` if no merge code) |

*AppUser fields — `appUserPrimaryAgent`, `appUserCoAgent`, `appUserAssistant1`, `appUserAssistant2` all share the same shape (shown once using `appUserPrimaryAgent`):*

| Field | Type | Description |
|---|---|---|
| `items[].appUserPrimaryAgent.appUserId` | integer (int32) | AppUser ID |
| `items[].appUserPrimaryAgent.profileUrl` | string (uri) | Profile picture URL |
| `items[].appUserPrimaryAgent.contact.contactId` | integer (int32) | Contact ID |
| `items[].appUserPrimaryAgent.contact.name.company` | string | Company (in name object) |
| `items[].appUserPrimaryAgent.contact.name.title` | string | Title (e.g. "Mr.") |
| `items[].appUserPrimaryAgent.contact.name.firstName` | string | First name |
| `items[].appUserPrimaryAgent.contact.name.middleName` | string | Middle name |
| `items[].appUserPrimaryAgent.contact.name.lastName` | string | Last name |
| `items[].appUserPrimaryAgent.contact.company` | string | Company name |
| `items[].appUserPrimaryAgent.contact.teamName` | string | Team name |
| `items[].appUserPrimaryAgent.contact.jobTitle` | string | Job title |
| `items[].appUserPrimaryAgent.contact.primaryEmail` | string (email) | Primary email |
| `items[].appUserPrimaryAgent.contact.phone1.phone` | string | Phone number |
| `items[].appUserPrimaryAgent.contact.phone1.formattedPhoneString` | string | Formatted phone (xxx) xxx-xxxx |
| `items[].appUserPrimaryAgent.contact.phone1.phoneType` | string (enum) | Phone type — see enums |
| `items[].appUserPrimaryAgent.contact.phone1.phoneDesc` | string | Extension / description |
| `items[].appUserPrimaryAgent.contact.phone2.*` | (same shape as phone1) | Phone 2 |
| `items[].appUserPrimaryAgent.contact.altContactName.{company,title,firstName,middleName,lastName}` | string | Alt contact name fields |
| `items[].appUserPrimaryAgent.contact.altContactJobTitle` | string | Alt contact job title |
| `items[].appUserPrimaryAgent.contact.altContactPrimaryEmail` | string (email) | Alt contact email |
| `items[].appUserPrimaryAgent.contact.altContactPhone1.*` | (same shape as phone1) | Alt contact phone 1 |
| `items[].appUserPrimaryAgent.contact.altContactPhone2.*` | (same shape as phone1) | Alt contact phone 2 |
| `items[].appUserPrimaryAgent.contact.brokerNum` | string | Broker license number |
| `items[].appUserPrimaryAgent.contact.licenseNum` | string | Contact license number |
| `items[].appUserPrimaryAgent.contact.createDateTime` | string (date-time) | Contact created |
| `items[].appUserPrimaryAgent.contact.editDateTime` | string (date-time) | Contact last edited |

*Participants (`includes: ["PARTICIPANTS"]`):*

| Field | Type | Description |
|---|---|---|
| `items[].xactionParticipants[].xactionParticipantId` | integer (int32) | Participant ID |
| `items[].xactionParticipants[].xactionParticipantRole` | string | Role name |
| `items[].xactionParticipants[].linkedContactId` | integer (int32) or null | Linked Contact ID; null if no linked contact |
| `items[].xactionParticipants[].contactInfo.*` | (same Contact digest shape as AppUser contact above) | Contact info (from linked Contact or participant snapshot) |
| `items[].xactionParticipants[].agentVisible` | boolean | Visible on agent portal? |
| `items[].xactionParticipants[].buyerSellerVisible` | boolean | Visible on Buyer/Seller portal? |

*Events (`includes: ["EVENTS"]`):*

| Field | Type | Description |
|---|---|---|
| `items[].events[].eventId` | integer (int32) | Event ID |
| `items[].events[].title` | string | Event title |
| `items[].events[].location` | string | Event location |
| `items[].events[].color` | string (enum) | Color — see enums. Default: `"NONE"` |
| `items[].events[].allDayEvent` | boolean | Spans the entire day? |
| `items[].events[].startDate` | string (date) | Start date |
| `items[].events[].startTime` | string | Start time (e.g. `"14:30"`) |
| `items[].events[].durationMinutes` | integer (int32) | Duration in minutes |
| `items[].events[].timeZone.zoneId` | string | Time zone ID (e.g. `"America/New_York"`) |
| `items[].events[].timeZone.fullName` | string | Full time zone name (e.g. `"America/New_York (ET)"`) |
| `items[].events[].timeZone.shortName` | string | Short name (e.g. `"ET"`) |
| `items[].events[].completed` | boolean | Event completed? |

*Attachments (`includes: ["ATTACHMENTS"]`):*

| Field | Type | Description |
|---|---|---|
| `items[].xactionAttachments[].xactionAttachmentId` | integer (int32) | Attachment ID |
| `items[].xactionAttachments[].attachmentType` | string (enum) | `"FILE"` or `"URL"` |
| `items[].xactionAttachments[].title` | string (≤100 chars) | Attachment title |
| `items[].xactionAttachments[].color` | string (enum) | Color — see enums. Default: `"NONE"` |
| `items[].xactionAttachments[].webLink` | string (uri, ≤500 chars) | Web link; present when `attachmentType` is `"URL"` |
| `items[].xactionAttachments[].fileInfo.fileName` | string | File name; present when `attachmentType` is `"FILE"` |
| `items[].xactionAttachments[].fileInfo.physicalFileName` | string | Stored file name |
| `items[].xactionAttachments[].fileInfo.contentType` | string | MIME type |
| `items[].xactionAttachments[].fileInfo.fileSizeBytes` | integer (int64) | File size in bytes |
| `items[].xactionAttachments[].required` | boolean | Attachment required? |
| `items[].xactionAttachments[].completed` | boolean | Attachment completed? |

*Pagination:*

| Field | Type | Description |
|---|---|---|
| `pageMetadata.page` | integer (int32) | Current page (0-based) |
| `pageMetadata.pageSize` | integer (int32) | Current page size |
| `pageMetadata.totalElementsOnPage` | integer (int32) | Elements on this page |
| `pageMetadata.totalElements` | integer (int32) | Total matching elements |
| `pageMetadata.hasNextPage` | boolean | More pages available? |
| `pageMetadata.lastPage` | integer (int32) | Last page number |
| `groupCounts` | object (map\<string, integer\>) | Optional group counts map |

**Enums / constants:**
- `xactionStages` / `xactionStatus.xactionStage`: `"PRE_ACTIVE"`, `"ACTIVE"`, `"UNDER_CONTRACT"`, `"SOLD"`, `"NOT_SOLD"`, `"NOT_ACTIVE"`
- `xactionStatus.xactionStatusSystemType`: `"XACTION_STATUS_SYSTEM_ACTIVE"`, `"XACTION_STATUS_SYSTEM_CLOSED"`, `"XACTION_STATUS_SYSTEM_FELL_APART"`, `"XACTION_STATUS_SYSTEM_DRAFT"`
- `xactionSide`: `"BUYER"`, `"SELLER"`, `"DUAL"`
- `includes`: `"PARTICIPANTS"`, `"EVENTS"`, `"ATTACHMENTS"`
- `phoneType`: `"CELL"`, `"HOME"`, `"WORK"`, `"COMPANY"`, `"PAGER"`, `"ASSISTANT"`, `"FAX"`, `"OTHER"`
- `events[].color` / `xactionAttachments[].color`: `"NONE"`, `"RED"`, `"TANGERINE"`, `"TAUPE"`, `"YELLOW"`, `"LIME"`, `"GREEN"`, `"CYAN"`, `"TEAL"`, `"COBALT"`, `"PURPLE"`, `"MAGENTA"`
- `attachmentType`: `"FILE"`, `"URL"`
- `address.usstate`: all 50 US states + `"AMERICAN_SAMOA"`, `"DISTRICT_OF_COLUMBIA"`, `"FEDERATED_STATES_OF_MICRONESIA"`, `"GUAM"`, `"MARSHALL_ISLANDS"`, `"NORTHERN_MARIANA_ISLANDS"`, `"PALAU"`, `"PUERTO_RICO"`, `"VIRGIN_ISLANDS"`, `"UNKNOWN"`

**Notable errors:**
All non-2xx responses use the `APIResponse` envelope: `payload` (any), `error.requestId` (string), `error.messages` (array<string>), `error.details` (array<string>), `error.validationErrors[].fieldName` (string), `error.validationErrors[].message` (string).

- `400` Bad Request — Malformed JSON or unreadable payload.
- `422` Unprocessable Content — Invalid search criteria (e.g. `pageSize` out of range).
- `429` Too Many Requests — Rate limit exceeded.

**Quirks & notes:**
- Request body is wrapped in `APIXactionPagedQueryDto`; the search criteria live in the nested `searchCriteria` object. All fields are optional — omitting `searchCriteria` entirely returns all Transactions (paginated).
- `xactionIds` is limited to 100 IDs.
- The Contact digest shape is reused across `appUserPrimaryAgent`, `appUserCoAgent`, `appUserAssistant1`, `appUserAssistant2`, and `xactionParticipants[].contactInfo`. These fields are always present in the digest but may be null if the slot is not filled on the transaction.
- `xactionFieldData` is a flat map keyed by `mergeFieldCode` (preferred) or `fieldId` (fallback). Values are always strings.
- `groupCounts` is returned only when grouping is applied; otherwise omit or treat as empty.
- Authentication: global `X-AFrame-API-Key` header.

---

#### `GET /v1/xactions/{xactionId}` — Get a Transaction
**Status:** Not extracted | Built in connector v0.2.0 as `get_transaction`

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xactions/{xactionId}` — Update a Transaction
**Status:** Not extracted | Built in connector v0.2.0 as `update_transaction`

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---


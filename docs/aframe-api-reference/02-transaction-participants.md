---
title: Aframe API Reference — 2. Transaction Participants
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 2. Transaction Participants
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*Manage participants or contacts involved in a Transaction (e.g. buyers, sellers, agents).*

---

#### `POST /v1/xaction-participants` — Add a participant
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `GET /v1/xaction-participants/{xactionParticipantId}` — Get a participant
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xaction-participants/{xactionParticipantId}` — Update a participant
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `DELETE /v1/xaction-participants/{xactionParticipantId}` — Remove a participant
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PUT /v1/xaction-participants/{xactionParticipantId}/linked-contact/{linkedContactId}` — Link a contact
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact` — Update linked contact
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `DELETE /v1/xaction-participants/{xactionParticipantId}/linked-contact` — Unlink a contact
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xaction-participants/{xactionParticipantId}/contact-info` — Update contact info on participant
**Status:** ✅ Extracted 2026-06-14

**Summary:** Applies patch operations to the participant's contact-info. Only use when the participant has no linked Contact (`linkedContactId` is null). Returns 409 Conflict otherwise — use `PATCH /xaction-participants/{id}/linked-contact` instead.

**Request**
- Content-Type: `application/json-patch+json`
- Path params:

  | Name | Type | Required | Description |
  |---|---|---|---|
  | xactionParticipantId | integer | yes | ID of the Transaction Participant. (Example: 123) |

- Body schema: JSON Patch operations array (RFC 6902). Each element:

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | op | string | yes | Patch operation (e.g. `"replace"`) |
  | path | string | yes | JSON Pointer to the target field (e.g. `"/firstName"`) — see `APIContactInfoPatchDto` paths below |
  | value | any | yes (for `replace`) | New value for the field |

  **Patchable field paths (`APIContactInfoPatchDto`):**

  | Path | Type | Description |
  |---|---|---|
  | /company | string | Company |
  | /teamName | string | Team name |
  | /title | string | Name title (e.g. `"Mr."`) |
  | /firstName | string | First name |
  | /middleName | string | Middle name |
  | /lastName | string | Last name |
  | /jobTitle | string | Job title |
  | /email1 | string | Email 1 (primary) |
  | /phone1 | string | Phone 1 |
  | /phone1Type | string (enum) | Phone 1 type — see Enums |
  | /phone1Desc | string | Phone 1 description / extension |
  | /phone2 | string | Phone 2 |
  | /phone2Type | string (enum) | Phone 2 type — see Enums |
  | /phone2Desc | string | Phone 2 description / extension |
  | /phone3 | string | Phone 3 |
  | /phone3Type | string (enum) | Phone 3 type — see Enums |
  | /phone3Desc | string | Phone 3 description / extension |
  | /phone4 | string | Phone 4 |
  | /phone4Type | string (enum) | Phone 4 type — see Enums |
  | /phone4Desc | string | Phone 4 description / extension |
  | /fax | string | Fax number |
  | /faxDesc | string | Fax description / extension |
  | /altContactTitle | string | Alt contact name title |
  | /altContactFirstName | string | Alt contact first name |
  | /altContactMiddleName | string | Alt contact middle name |
  | /altContactLastName | string | Alt contact last name |
  | /altContactJobTitle | string | Alt contact job title |
  | /altContactEmail1 | string | Alt contact email 1 (primary) |
  | /altContactPhone1 | string | Alt contact phone 1 |
  | /altContactPhone1Type | string (enum) | Alt contact phone 1 type — see Enums |
  | /altContactPhone1Desc | string | Alt contact phone 1 description / extension |
  | /altContactPhone2 | string | Alt contact phone 2 |
  | /altContactPhone2Type | string (enum) | Alt contact phone 2 type — see Enums |
  | /altContactPhone2Desc | string | Alt contact phone 2 description / extension |
  | /altContactPhone3 | string | Alt contact phone 3 |
  | /altContactPhone3Type | string (enum) | Alt contact phone 3 type — see Enums |
  | /altContactPhone3Desc | string | Alt contact phone 3 description / extension |
  | /addressLine1 | string | Primary address line 1 |
  | /addressLine2 | string | Primary address line 2 |
  | /addressCity | string | Primary address city |
  | /addressState | string | Primary address state |
  | /addressZip | string | Primary address zip or postal code |
  | /addressCountry | string | Primary address country |
  | /website | string (uri) | Website URL |

**Response (2xx payload)** — wrapper: `APIXactionParticipantDto`

  | Field | Type | Description |
  |---|---|---|
  | xactionParticipantId | integer (int32) | ID of the XactionParticipant |
  | xactionId | integer (int32) | ID of the Xaction |
  | xactionParticipantRoleId | integer (int32) | ID of the XactionParticipantRole |
  | xactionParticipantRole | string | Name of the Transaction Participant Role |
  | linkedContactId | integer (int32) | ID of the linked Contact, or null when no linked Contact |
  | contactInfo | object | Contact information (digest). Sourced from the linked Contact when one exists, otherwise from the participant's snapshot. |
  | contactInfo.contactId | integer (int32) | ID of the Contact |
  | contactInfo.name | object | Contact name (NameDto) |
  | contactInfo.name.company | string | Company |
  | contactInfo.name.title | string | Title (e.g. `"Mr."`) |
  | contactInfo.name.firstName | string | First Name |
  | contactInfo.name.middleName | string | Middle Name |
  | contactInfo.name.lastName | string | Last Name |
  | contactInfo.company | string | Company name |
  | contactInfo.teamName | string | Team name |
  | contactInfo.jobTitle | string | Job title |
  | contactInfo.primaryEmail | string (email) | Primary email used for communication |
  | contactInfo.phone1 | object | Phone 1 (PhoneDto) |
  | contactInfo.phone1.phone | string | Phone Number |
  | contactInfo.phone1.formattedPhoneString | string | Phone Number with (xxx) xxx-xxxx format, if possible |
  | contactInfo.phone1.phoneType | string (enum) | Phone Type — see Enums |
  | contactInfo.phone1.phoneDesc | string | Phone Description or Extension |
  | contactInfo.phone2 | object | Phone 2 (PhoneDto — same shape as phone1) |
  | contactInfo.phone2.phone | string | Phone Number |
  | contactInfo.phone2.formattedPhoneString | string | Phone Number with (xxx) xxx-xxxx format, if possible |
  | contactInfo.phone2.phoneType | string (enum) | Phone Type — see Enums |
  | contactInfo.phone2.phoneDesc | string | Phone Description or Extension |
  | contactInfo.altContactName | object | Alt contact name (NameDto — same shape as name) |
  | contactInfo.altContactName.company | string | Company |
  | contactInfo.altContactName.title | string | Title |
  | contactInfo.altContactName.firstName | string | First Name |
  | contactInfo.altContactName.middleName | string | Middle Name |
  | contactInfo.altContactName.lastName | string | Last Name |
  | contactInfo.altContactJobTitle | string | Alt contact job title |
  | contactInfo.altContactPrimaryEmail | string (email) | Alt contact primary email |
  | contactInfo.altContactPhone1 | object | Alt contact phone 1 (PhoneDto) |
  | contactInfo.altContactPhone1.phone | string | Phone Number |
  | contactInfo.altContactPhone1.formattedPhoneString | string | Formatted phone string |
  | contactInfo.altContactPhone1.phoneType | string (enum) | Phone Type — see Enums |
  | contactInfo.altContactPhone1.phoneDesc | string | Phone Description or Extension |
  | contactInfo.altContactPhone2 | object | Alt contact phone 2 (PhoneDto — same shape as altContactPhone1) |
  | contactInfo.altContactPhone2.phone | string | Phone Number |
  | contactInfo.altContactPhone2.formattedPhoneString | string | Formatted phone string |
  | contactInfo.altContactPhone2.phoneType | string (enum) | Phone Type — see Enums |
  | contactInfo.altContactPhone2.phoneDesc | string | Phone Description or Extension |
  | contactInfo.brokerNum | string | Broker license number |
  | contactInfo.licenseNum | string | Contact license number |
  | contactInfo.createDateTime | string (date-time) | Date and time the Contact was created |
  | contactInfo.editDateTime | string (date-time) | Date and time the Contact was last edited |
  | sort | integer (int32) | Sort order for display |
  | agentVisible | boolean | Whether the participant is visible to agents on the transaction |
  | buyerSellerVisible | boolean | Whether the participant is visible to buyers/sellers on the portal |

**Enums / constants:**
- `phoneType` (all PhoneDto instances in response): `CELL`, `HOME`, `WORK`, `COMPANY`, `PAGER`, `ASSISTANT`, `FAX`, `OTHER`
- `phone1Type`, `phone2Type`, `phone3Type`, `phone4Type`, `altContactPhone1Type`, `altContactPhone2Type`, `altContactPhone3Type` (patch request body): `CELL`, `HOME`, `WORK`, `PAGER`, `ASSISTANT`, `COMPANY`, `OTHER`

**Notable errors:**

All non-2xx responses use the `APIResponse` envelope: `payload` (any), `error.requestId` (correlation ID), `error.messages[]` (friendly), `error.details[]` (detailed), `error.validationErrors[]` (per-field: `fieldName`, `message`).

- 400 — Bad Request: Invalid JSON Patch format or operation
- 403 — Forbidden: The authenticated user does not have permission to update this Transaction Participant
- 404 — Not Found: Transaction Participant with the supplied ID does not exist
- 409 — Conflict: The participant has a linked Contact; use `PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact` instead
- 422 — Unprocessable Content: Validation errors occurred while updating the snapshot (per-field `validationErrors` populated)
- 429 — Too Many Requests: Rate limit exceeded

**Quirks & notes:**
- This endpoint targets the participant's **snapshot** contact-info (not a linked Contact's record). It must only be called when `linkedContactId` is null — the API returns 409 Conflict if a linked contact exists.
- The request body is a JSON Patch array (RFC 6902). Content-Type must be `application/json-patch+json`.
- Patchable field names in `APIContactInfoPatchDto` differ slightly from the response `contactInfo` structure (e.g. patch path `/email1` vs response field `primaryEmail`).
- Authentication: global `X-AFrame-API-Key` header.

---

#### `GET /v1/xactions/{xactionId}/xaction-participants` — List Transaction Participants for a Transaction
**Status:** ✅ Extracted 2026-06-14

**Summary:** List Transaction Participants for a Transaction

**Description:** Returns a paged list of Participants assigned to the specified Transaction. Pagination via `page` (0-based) and `pageSize` (max 100) is supported as query parameters.

**Request**
- Content-Type: `application/json`
- Path params:

  | Name | Type | Required | Description |
  |---|---|---|---|
  | xactionId | integer | yes | ID of the Transaction whose Participants to fetch. (Example: 123) |

- Query params (passed as a single wrapper object `apiXactionParticipantPagedQueryDto`):

  | Name | Type | Required | Default | Description |
  |---|---|---|---|---|
  | page | integer (int32, ≥ 0) | yes | 0 | Page number (0-based) |
  | pageSize | integer (int32, [1, 100]) | yes | 50 | Page size (max 100) |

- Body schema: None

**Response (2xx payload)** — wrapper: `APIXactionParticipantListDto`

  | Field | Type | Description |
  |---|---|---|
  | xactionParticipants | array\<object\> | List of XactionParticipant digests |
  | xactionParticipants[].xactionParticipantId | integer (int32) | ID of the XactionParticipant |
  | xactionParticipants[].xactionParticipantRole | string | Name of the Transaction Participant Role |
  | xactionParticipants[].linkedContactId | integer (int32) | ID of the linked Contact, or null when the participant has no linked Contact |
  | xactionParticipants[].contactInfo | object | Contact information digest. Sourced from the linked Contact when one exists, otherwise from the participant's snapshot. |
  | xactionParticipants[].contactInfo.contactId | integer (int32) | ID of the Contact |
  | xactionParticipants[].contactInfo.name | object | Contact name (NameDto) |
  | xactionParticipants[].contactInfo.name.company | string | Company |
  | xactionParticipants[].contactInfo.name.title | string | Title (e.g., "Mr.") |
  | xactionParticipants[].contactInfo.name.firstName | string | First Name |
  | xactionParticipants[].contactInfo.name.middleName | string | Middle Name |
  | xactionParticipants[].contactInfo.name.lastName | string | Last Name |
  | xactionParticipants[].contactInfo.company | string | Company name |
  | xactionParticipants[].contactInfo.teamName | string | Team name |
  | xactionParticipants[].contactInfo.jobTitle | string | Job title |
  | xactionParticipants[].contactInfo.primaryEmail | string (email) | Primary email used for communication |
  | xactionParticipants[].contactInfo.phone1 | object | Phone 1 (PhoneDto) |
  | xactionParticipants[].contactInfo.phone1.phone | string | Phone Number |
  | xactionParticipants[].contactInfo.phone1.formattedPhoneString | string | Phone Number with (xxx) xxx-xxxx format, if possible |
  | xactionParticipants[].contactInfo.phone1.phoneType | string (enum) | Phone Type — see Enums |
  | xactionParticipants[].contactInfo.phone1.phoneDesc | string | Phone Description or Extension |
  | xactionParticipants[].contactInfo.phone2 | object | Phone 2 (PhoneDto — same shape as phone1) |
  | xactionParticipants[].contactInfo.altContactName | object | Alt contact name (NameDto — same shape as name) |
  | xactionParticipants[].contactInfo.altContactJobTitle | string | Alt contact job title |
  | xactionParticipants[].contactInfo.altContactPrimaryEmail | string (email) | Alt contact primary email used for communication |
  | xactionParticipants[].contactInfo.altContactPhone1 | object | Alt contact phone 1 (PhoneDto) |
  | xactionParticipants[].contactInfo.altContactPhone2 | object | Alt contact phone 2 (PhoneDto) |
  | xactionParticipants[].contactInfo.brokerNum | string | Broker license number |
  | xactionParticipants[].contactInfo.licenseNum | string | Contact license number |
  | xactionParticipants[].contactInfo.createDateTime | string (date-time) | Date and time the Contact was created |
  | xactionParticipants[].contactInfo.editDateTime | string (date-time) | Date and time the Contact was last edited |
  | xactionParticipants[].agentVisible | boolean | Whether the participant is visible on the Agent portal |
  | xactionParticipants[].buyerSellerVisible | boolean | Whether the participant is visible on the Buyer/Seller portal |
  | pageMetadata | object | Page metadata |
  | pageMetadata.page | integer (int32) | The current page number, 0-based |
  | pageMetadata.pageSize | integer (int32) | The current page size |
  | pageMetadata.totalElementsOnPage | integer (int32) | Number of elements on page |
  | pageMetadata.totalElements | integer (int32) | Total number of elements |
  | pageMetadata.hasNextPage | boolean | Has next page |
  | pageMetadata.lastPage | integer (int32) | Last page number |
  | pageMetadata.groupCounts | object (map\<string, integer (int32)\>) | Optional map of group counts if grouping is applied |

**Enums / constants:**
- `phoneType` (used by all PhoneDto instances): `CELL`, `HOME`, `WORK`, `COMPANY`, `PAGER`, `ASSISTANT`, `FAX`, `OTHER`

**Notable errors:**

All error responses use the `APIResponseDto` envelope: `payload` (typically null on error), `error.requestId` (correlation ID — quote when reporting issues), `error.messages` (friendly), `error.details` (detailed), `error.validationErrors[]` (per-field, each with `fieldName` and `message`).

- 403 — Forbidden: the authenticated user does not have permission to access this Transaction
- 404 — Not Found: Transaction with the supplied ID does not exist
- 429 — Too Many Requests: rate limit exceeded

**Quirks & notes:**
- The query parameters (`page`, `pageSize`) are passed as a single named query object `apiXactionParticipantPagedQueryDto`; both fields are required in the schema.
- Response payload wrapper: `APIXactionParticipantListDto`.
- `linkedContactId` may be null when the participant has no linked Contact; in that case `contactInfo` is still populated from the participant's snapshot data.
- Authentication: global `X-AFrame-API-Key` header.

---


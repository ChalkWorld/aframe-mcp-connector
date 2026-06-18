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

#### `POST /v1/xaction-participants` — Create a Transaction Participant
**Status:** ✅ Extracted 2026-06-18

**Summary:** Create a Transaction Participant

**Description:** Creates a new Transaction Participant assigned to a Transaction with a specified role. You may either provide `linkedContactId` to link an existing Contact, or provide `contactInfo` to create a brand-new Contact and link it at the same time. If both are supplied, `linkedContactId` wins and `contactInfo` is ignored.

**Request**
- Content-Type: `application/json`
- Path params: None
- Body schema (`APIXactionParticipantCreateDto`):

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | `xactionId` | integer (int32) | yes | ID of the Xaction |
  | `xactionParticipantRoleId` | integer (int32) | yes | ID of the XactionParticipantRole |
  | `linkedContactId` | integer (int32) | no | ID of an existing Contact to link; if provided, `contactInfo` is ignored |
  | `contactInfo` | object | no | Inline contact data; required if `linkedContactId` is not provided |
  | `contactInfo.company` | string ≤100 | no | Company name |
  | `contactInfo.teamName` | string ≤100 | no | Team name |
  | `contactInfo.title` | string ≤20 | no | Name title |
  | `contactInfo.firstName` | string ≤75 | no | First name |
  | `contactInfo.middleName` | string ≤25 | no | Middle name |
  | `contactInfo.lastName` | string ≤75 | no | Last name |
  | `contactInfo.jobTitle` | string ≤75 | no | Job title |
  | `contactInfo.email1` | string (email) ≤255 | no | Email 1 (primary) |
  | `contactInfo.email2` | string (email) ≤255 | no | Email 2 |
  | `contactInfo.email3` | string (email) ≤255 | no | Email 3 |
  | `contactInfo.phone1` | string ≤30 | no | Phone 1 |
  | `contactInfo.phone1Type` | string ≤20 | no | Phone 1 type (enum) |
  | `contactInfo.phone1Desc` | string ≤20 | no | Phone 1 description / extension |
  | `contactInfo.phone2` | string ≤30 | no | Phone 2 |
  | `contactInfo.phone2Type` | string ≤20 | no | Phone 2 type (enum) |
  | `contactInfo.phone2Desc` | string ≤20 | no | Phone 2 description / extension |
  | `contactInfo.phone3` | string ≤30 | no | Phone 3 |
  | `contactInfo.phone3Type` | string ≤20 | no | Phone 3 type (enum) |
  | `contactInfo.phone3Desc` | string ≤20 | no | Phone 3 description / extension |
  | `contactInfo.phone4` | string ≤30 | no | Phone 4 |
  | `contactInfo.phone4Type` | string ≤20 | no | Phone 4 type (enum) |
  | `contactInfo.phone4Desc` | string ≤20 | no | Phone 4 description / extension |
  | `contactInfo.fax` | string ≤30 | no | Fax number |
  | `contactInfo.faxDesc` | string ≤20 | no | Fax description / extension |
  | `contactInfo.altContactTitle` | string ≤20 | no | Alt contact name title |
  | `contactInfo.altContactFirstName` | string ≤75 | no | Alt contact first name |
  | `contactInfo.altContactMiddleName` | string ≤25 | no | Alt contact middle name |
  | `contactInfo.altContactLastName` | string ≤75 | no | Alt contact last name |
  | `contactInfo.altContactJobTitle` | string ≤75 | no | Alt contact job title |
  | `contactInfo.altContactEmail1` | string (email) ≤255 | no | Alt contact email 1 (primary) |
  | `contactInfo.altContactEmail2` | string (email) ≤255 | no | Alt contact email 2 |
  | `contactInfo.altContactEmail3` | string (email) ≤255 | no | Alt contact email 3 |
  | `contactInfo.altContactPhone1` | string ≤30 | no | Alt contact phone 1 |
  | `contactInfo.altContactPhone1Type` | string ≤20 | no | Alt contact phone 1 type (enum) |
  | `contactInfo.altContactPhone1Desc` | string ≤20 | no | Alt contact phone 1 description / extension |
  | `contactInfo.altContactPhone2` | string ≤30 | no | Alt contact phone 2 |
  | `contactInfo.altContactPhone2Type` | string ≤20 | no | Alt contact phone 2 type (enum) |
  | `contactInfo.altContactPhone2Desc` | string ≤20 | no | Alt contact phone 2 description / extension |
  | `contactInfo.altContactPhone3` | string ≤30 | no | Alt contact phone 3 |
  | `contactInfo.altContactPhone3Type` | string ≤20 | no | Alt contact phone 3 type (enum) |
  | `contactInfo.altContactPhone3Desc` | string ≤20 | no | Alt contact phone 3 description / extension |
  | `contactInfo.homeAddressLine1` | string ≤100 | no | Home address line 1 |
  | `contactInfo.homeAddressLine2` | string ≤100 | no | Home address line 2 |
  | `contactInfo.homeAddressCity` | string ≤75 | no | Home address city |
  | `contactInfo.homeAddressState` | string ≤4 | no | Home address state |
  | `contactInfo.homeAddressZip` | string ≤10 | no | Home address zip or postal code |
  | `contactInfo.homeAddressCountry` | string ≤50 | no | Home address country |
  | `contactInfo.workAddressLine1` | string ≤100 | no | Work address line 1 |
  | `contactInfo.workAddressLine2` | string ≤100 | no | Work address line 2 |
  | `contactInfo.workAddressCity` | string ≤75 | no | Work address city |
  | `contactInfo.workAddressState` | string ≤4 | no | Work address state |
  | `contactInfo.workAddressZip` | string ≤10 | no | Work address zip or postal code |
  | `contactInfo.workAddressCountry` | string ≤50 | no | Work address country |
  | `contactInfo.primaryAddress` | string | no | Primary address used for communication (enum: `HOME`, `WORK`) |
  | `contactInfo.website` | string (uri) ≤255 | no | Website URL |
  | `contactInfo.brokerNum` | string ≤20 | no | Broker license number |
  | `contactInfo.licenseNum` | string ≤20 | no | Contact license number |
  | `contactInfo.relationshipRating` | string | no | Relationship rating (enum: `A`–`E`) |
  | `contactInfo.salutationLtr` | string ≤255 | no | Letter salutation; auto-completed if not provided |
  | `contactInfo.salutationEnv` | string ≤255 | no | Envelope salutation; auto-completed if not provided |
  | `contactInfo.categories` | array\<string ≤100\> | no | Category names to associate with the Contact |
  | `onlySaveContactInTransaction` | boolean | no | If `true`, contact info stored only on participant snapshot — no Contact entity created |
  | `agentVisible` | boolean | no | Visible on Agent portal. Defaults to `true` |
  | `buyerSellerVisible` | boolean | no | Visible on Buyer/Seller portal. Defaults to `true` |

**Response (2xx payload)**

HTTP 201. Returns `APIXactionParticipantDto`:

  | Field | Type | Description |
  |---|---|---|
  | `xactionParticipantId` | integer | ID of the XactionParticipant |
  | `xactionId` | integer | ID of the Xaction |
  | `xactionParticipantRoleId` | integer | ID of the XactionParticipantRole |
  | `xactionParticipantRole` | string | Name of the Transaction Participant Role |
  | `linkedContactId` | integer \| null | ID of the linked Contact, or `null` when no linked Contact |
  | `contactInfo.contactId` | integer | ID of the Contact |
  | `contactInfo.name.company` | string | Company (from name object) |
  | `contactInfo.name.title` | string | Title |
  | `contactInfo.name.firstName` | string | First Name |
  | `contactInfo.name.middleName` | string | Middle Name |
  | `contactInfo.name.lastName` | string | Last Name |
  | `contactInfo.company` | string | Company name |
  | `contactInfo.teamName` | string | Team name |
  | `contactInfo.jobTitle` | string | Job title |
  | `contactInfo.primaryEmail` | string (email) | Primary email used for communication |
  | `contactInfo.phone1.phone` | string | Phone Number |
  | `contactInfo.phone1.formattedPhoneString` | string | Phone Number in (xxx) xxx-xxxx format if possible |
  | `contactInfo.phone1.phoneType` | string | Phone Type (enum) |
  | `contactInfo.phone1.phoneDesc` | string | Phone Description or Extension |
  | `contactInfo.phone2.phone` | string | Phone Number |
  | `contactInfo.phone2.formattedPhoneString` | string | Phone Number formatted |
  | `contactInfo.phone2.phoneType` | string | Phone Type (enum) |
  | `contactInfo.phone2.phoneDesc` | string | Phone Description or Extension |
  | `contactInfo.altContactName.company` | string | Company |
  | `contactInfo.altContactName.title` | string | Title |
  | `contactInfo.altContactName.firstName` | string | First Name |
  | `contactInfo.altContactName.middleName` | string | Middle Name |
  | `contactInfo.altContactName.lastName` | string | Last Name |
  | `contactInfo.altContactJobTitle` | string | Alt contact job title |
  | `contactInfo.altContactPrimaryEmail` | string (email) | Alt contact primary email |
  | `contactInfo.altContactPhone1.phone` | string | Phone Number |
  | `contactInfo.altContactPhone1.formattedPhoneString` | string | Phone Number formatted |
  | `contactInfo.altContactPhone1.phoneType` | string | Phone Type (enum) |
  | `contactInfo.altContactPhone1.phoneDesc` | string | Phone Description or Extension |
  | `contactInfo.altContactPhone2.phone` | string | Phone Number |
  | `contactInfo.altContactPhone2.formattedPhoneString` | string | Phone Number formatted |
  | `contactInfo.altContactPhone2.phoneType` | string | Phone Type (enum) |
  | `contactInfo.altContactPhone2.phoneDesc` | string | Phone Description or Extension |
  | `contactInfo.brokerNum` | string | Broker license number |
  | `contactInfo.licenseNum` | string | Contact license number |
  | `contactInfo.createDateTime` | string (date-time) | Date and time the Contact was created |
  | `contactInfo.editDateTime` | string (date-time) | Date and time the Contact was last edited |
  | `sort` | integer | Sort order for display |
  | `agentVisible` | boolean | Whether the participant is visible to agents on the transaction |
  | `buyerSellerVisible` | boolean | Whether the participant is visible to buyers/sellers on the portal |

**Enums / constants:**
- `phone1Type` / `phone2Type` / `phone3Type` / `phone4Type` / `altContactPhone1Type` / `altContactPhone2Type` / `altContactPhone3Type` (request) and `phoneType` (response phone objects): `"CELL"`, `"HOME"`, `"WORK"`, `"COMPANY"`, `"PAGER"`, `"ASSISTANT"`, `"FAX"`, `"OTHER"`
- `primaryAddress`: `"HOME"`, `"WORK"`
- `relationshipRating`: `"A"`, `"B"`, `"C"`, `"D"`, `"E"`

**Notable errors:**

All error responses use the `APIResponse` envelope (`payload: any`, `error.requestId`, `error.messages[]`, `error.details[]`, `error.validationErrors[].fieldName`, `error.validationErrors[].message`).

| Code | Description |
|---|---|
| 400 | Bad Request — Malformed JSON or unreadable payload |
| 403 | Forbidden — Authenticated user does not have permission to access the Transaction |
| 404 | Not Found — Transaction, Role, or Contact does not exist |
| 422 | Unprocessable Content — Validation errors occurred while creating the Transaction Participant |
| 429 | Too Many Requests — Rate limit exceeded |

**Quirks & notes:**
- `linkedContactId` vs `contactInfo`: supply one or the other; if both are present, `linkedContactId` wins and `contactInfo` is silently ignored.
- `onlySaveContactInTransaction = true`: contact data stored only on the participant's snapshot — no standalone Contact entity is created and `linkedContactId` on the response will be `null`. Useful for one-time participants.
- Response `contactInfo` is sourced from the linked Contact when one exists; otherwise from the participant's snapshot (digest, not the full writable payload).
- Returns HTTP 201 (not 200) on success.
- Authentication: global `X-AFrame-API-Key` header.

---

#### `GET /v1/xaction-participants/{xactionParticipantId}` — Get a Transaction Participant
**Status:** ✅ Extracted 2026-06-18

**Summary:** Get a Transaction Participant

**Description:** Returns the Transaction Participant with the supplied ID.

**Request**
- Content-Type: `application/json`
- Path params:

  | Name | Type | Required | Description |
  |---|---|---|---|
  | `xactionParticipantId` | integer (int32) | yes | ID of the Transaction Participant |

- Query params: None
- Body schema: None

**Response (2xx payload)** — wrapper: `APIXactionParticipantDto`

  | Field | Type | Description |
  |---|---|---|
  | `xactionParticipantId` | integer (int32) | ID of the XactionParticipant |
  | `xactionId` | integer (int32) | ID of the Xaction |
  | `xactionParticipantRoleId` | integer (int32) | ID of the XactionParticipantRole |
  | `xactionParticipantRole` | string | Name of the Transaction Participant Role |
  | `linkedContactId` | integer (int32) \| null | ID of the linked Contact, or `null` when the participant has no linked Contact |
  | `contactInfo` | object | Contact information (digest). Sourced from the linked Contact when one exists, otherwise from the participant's snapshot. |
  | `contactInfo.contactId` | integer (int32) | ID of the Contact |
  | `contactInfo.name` | object | Contact name (NameDto) |
  | `contactInfo.name.company` | string | Company |
  | `contactInfo.name.title` | string | Title (e.g. `"Mr."`) |
  | `contactInfo.name.firstName` | string | First Name |
  | `contactInfo.name.middleName` | string | Middle Name |
  | `contactInfo.name.lastName` | string | Last Name |
  | `contactInfo.company` | string | Company name |
  | `contactInfo.teamName` | string | Team name |
  | `contactInfo.jobTitle` | string | Job title |
  | `contactInfo.primaryEmail` | string (email) | Primary email used for communication |
  | `contactInfo.phone1` | object | Phone 1 (PhoneDto) |
  | `contactInfo.phone1.phone` | string | Phone Number |
  | `contactInfo.phone1.formattedPhoneString` | string | Phone Number with (xxx) xxx-xxxx format, if possible |
  | `contactInfo.phone1.phoneType` | string (enum) | Phone Type — see Enums |
  | `contactInfo.phone1.phoneDesc` | string | Phone Description or Extension |
  | `contactInfo.phone2` | object | Phone 2 (PhoneDto — same shape as phone1) |
  | `contactInfo.phone2.phone` | string | Phone Number |
  | `contactInfo.phone2.formattedPhoneString` | string | Phone Number with (xxx) xxx-xxxx format, if possible |
  | `contactInfo.phone2.phoneType` | string (enum) | Phone Type — see Enums |
  | `contactInfo.phone2.phoneDesc` | string | Phone Description or Extension |
  | `contactInfo.altContactName` | object | Alt contact name (NameDto — same shape as name) |
  | `contactInfo.altContactName.company` | string | Company |
  | `contactInfo.altContactName.title` | string | Title |
  | `contactInfo.altContactName.firstName` | string | First Name |
  | `contactInfo.altContactName.middleName` | string | Middle Name |
  | `contactInfo.altContactName.lastName` | string | Last Name |
  | `contactInfo.altContactJobTitle` | string | Alt contact job title |
  | `contactInfo.altContactPrimaryEmail` | string (email) | Alt contact primary email used for communication |
  | `contactInfo.altContactPhone1` | object | Alt contact phone 1 (PhoneDto) |
  | `contactInfo.altContactPhone1.phone` | string | Phone Number |
  | `contactInfo.altContactPhone1.formattedPhoneString` | string | Phone Number with (xxx) xxx-xxxx format, if possible |
  | `contactInfo.altContactPhone1.phoneType` | string (enum) | Phone Type — see Enums |
  | `contactInfo.altContactPhone1.phoneDesc` | string | Phone Description or Extension |
  | `contactInfo.altContactPhone2` | object | Alt contact phone 2 (PhoneDto — same shape as altContactPhone1) |
  | `contactInfo.altContactPhone2.phone` | string | Phone Number |
  | `contactInfo.altContactPhone2.formattedPhoneString` | string | Phone Number with (xxx) xxx-xxxx format, if possible |
  | `contactInfo.altContactPhone2.phoneType` | string (enum) | Phone Type — see Enums |
  | `contactInfo.altContactPhone2.phoneDesc` | string | Phone Description or Extension |
  | `contactInfo.brokerNum` | string | Broker license number |
  | `contactInfo.licenseNum` | string | Contact license number |
  | `contactInfo.createDateTime` | string (date-time) | Date and time the Contact was created |
  | `contactInfo.editDateTime` | string (date-time) | Date and time the Contact was last edited |
  | `sort` | integer (int32) | Sort order for display |
  | `agentVisible` | boolean | Whether the participant is visible to agents on the transaction |
  | `buyerSellerVisible` | boolean | Whether the participant is visible to buyers/sellers on the portal |

**Enums / constants:**
- `phoneType` (all PhoneDto instances — `contactInfo.phone1`, `contactInfo.phone2`, `contactInfo.altContactPhone1`, `contactInfo.altContactPhone2`): `"CELL"`, `"HOME"`, `"WORK"`, `"COMPANY"`, `"PAGER"`, `"ASSISTANT"`, `"FAX"`, `"OTHER"`

**Notable errors:**

All error responses use the `APIResponse` envelope (`payload: any`, `error.requestId`, `error.messages[]`, `error.details[]`, `error.validationErrors[].fieldName`, `error.validationErrors[].message`).

| Code | Description |
|---|---|
| 403 | Forbidden — The authenticated user does not have permission to access this Transaction Participant |
| 404 | Not Found — Transaction Participant with the supplied ID does not exist |
| 429 | Too Many Requests — Rate limit exceeded |

**Quirks & notes:**
- `linkedContactId` may be `null` when the participant has no linked Contact; `contactInfo` is still populated from the participant's snapshot data.
- `contactInfo` is a digest (not the full writable payload) sourced from the linked Contact when one exists, otherwise from the participant's snapshot.
- Authentication: global `X-AFrame-API-Key` header.

---

#### `PATCH /v1/xaction-participants/{xactionParticipantId}` — Update Participant-Level Fields on a Transaction Participant
**Status:** ✅ Extracted 2026-06-18

**Summary:** Update Participant-Level Fields on a Transaction Participant

**Description:** Updates participant-level fields (role, visibility) on the specified Transaction Participant. Contact-info fields (name, phones, address, etc.) are NOT patchable here. Use `PATCH /xaction-participants/{id}/linked-contact` when the participant has a linked Contact (updates the Contact entity and re-syncs the snapshot), or `PATCH /xaction-participants/{id}/contact-info` when the participant has no linked Contact (updates the snapshot only). Discover linkage state via the `linkedContactId` field on the response of `GET /xaction-participants/{id}`.

**Request**
- Content-Type: `application/json-patch+json`
- Path params:

  | Name | Type | Required | Description |
  |---|---|---|---|
  | xactionParticipantId | integer | yes | ID of the Transaction Participant to update |

- Body schema (`APIXactionParticipantPatchDto` — patch model for participant-level fields):

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | xactionParticipantRoleId | integer (int32) | no | ID of the XactionParticipantRole to assign |
  | agentVisible | boolean | no | Whether the participant is visible on the Agent portal |
  | buyerSellerVisible | boolean | no | Whether the participant is visible on the Buyer/Seller portal |

**Response (2xx payload)** — wrapper: `APIXactionParticipantDto`

  | Field | Type | Description |
  |---|---|---|
  | xactionParticipantId | integer (int32) | ID of the XactionParticipant |
  | xactionId | integer (int32) | ID of the Xaction |
  | xactionParticipantRoleId | integer (int32) | ID of the XactionParticipantRole |
  | xactionParticipantRole | string | Name of the Transaction Participant Role |
  | linkedContactId | integer (int32) | ID of the linked Contact, or null when no linked Contact |
  | contactInfo | object | Contact information (digest). Sourced from linked Contact or participant snapshot |
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
  | contactInfo.altContactName | object | Alt contact name (NameDto) |
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

**Notable errors:**

All non-2xx responses use the `APIResponse` envelope: `payload` (any), `error.requestId` (correlation ID), `error.messages[]` (friendly), `error.details[]` (detailed), `error.validationErrors[]` (per-field: `fieldName`, `message`).

- 400 — Bad Request: Invalid JSON Patch format or operation
- 403 — Forbidden: The authenticated user does not have permission to update this Transaction Participant
- 404 — Not Found: Transaction Participant with the supplied ID does not exist
- 422 — Unprocessable Content: Validation errors occurred while updating the Transaction Participant (per-field `validationErrors` populated)
- 429 — Too Many Requests: Rate limit exceeded

**Quirks & notes:**
- This endpoint patches **participant-level fields only** (`xactionParticipantRoleId`, `agentVisible`, `buyerSellerVisible`). Contact-info fields (name, phones, address, etc.) are not patchable here.
- To update contact-info, use `PATCH /xaction-participants/{id}/linked-contact` (when `linkedContactId` is not null) or `PATCH /xaction-participants/{id}/contact-info` (when no linked Contact).
- Despite the `application/json-patch+json` content-type, the body schema (`APIXactionParticipantPatchDto`) is a plain object with named fields — not an RFC 6902 array.
- Authentication: global `X-AFrame-API-Key` header.

---

#### `DELETE /v1/xaction-participants/{xactionParticipantId}` — Delete a Transaction Participant
**Status:** ✅ Extracted 2026-06-18

**Summary:** Delete a Transaction Participant

**Description:** Deletes the Transaction Participant with the supplied ID. If the Participant is linked to a Contact, the Contact is not deleted.

**Request**
- Content-Type: N/A (no request body)
- Path params:

  | Name | Type | Required | Description |
  |---|---|---|---|
  | `xactionParticipantId` | integer | yes | ID of the Transaction Participant to delete |

- Body schema: None

**Response (2xx payload)**

The 200 response payload is a plain `string` (e.g., `"success"`).

  | Field | Type | Description |
  |---|---|---|
  | `payload` | string | Confirmation string (e.g., `"success"`) |

**Notable errors:**

All error responses use the `APIResponse` envelope with fields: `payload` (any), `error.requestId` (string), `error.messages[]` (string), `error.details[]` (string), `error.validationErrors[]` (`fieldName`, `message`).

| Code | Description |
|---|---|
| 403 | Forbidden — authenticated user does not have permission to delete this Transaction Participant |
| 404 | Not Found — Transaction Participant with the supplied ID does not exist |
| 429 | Too Many Requests — rate limit exceeded |

**Quirks & notes:**
- Deleting a participant does not delete the linked Contact (if any).
- Authentication: global `X-AFrame-API-Key` header.

---

#### `PUT /v1/xaction-participants/{xactionParticipantId}/linked-contact/{linkedContactId}` — Link a contact
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact` — Update Linked Contact Info for Transaction Participant
**Status:** ✅ Extracted 2026-06-17

**Summary:** Update Linked Contact Info for Transaction Participant

**Description:** Applies patch operations to the participant's contact-info. Only use when the participant has a linked Contact (`linkedContactId` is not null). Returns 409 Conflict otherwise — use `PATCH /xaction-participants/{id}/contact-info` instead.

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
- 409 — Conflict: The participant has no linked Contact; use `PATCH /v1/xaction-participants/{xactionParticipantId}/contact-info` instead
- 422 — Unprocessable Content: Validation errors occurred while updating the Contact (per-field `validationErrors` populated)
- 429 — Too Many Requests: Rate limit exceeded

**Quirks & notes:**
- This endpoint targets the **linked Contact's** contact-info record (not the participant's snapshot). It must only be called when `linkedContactId` is not null — the API returns 409 Conflict if the participant has no linked contact.
- The request body is a JSON Patch array (RFC 6902). Content-Type must be `application/json-patch+json`.
- Patchable field names in `APIContactInfoPatchDto` differ slightly from the response `contactInfo` structure (e.g. patch path `/email1` vs response field `primaryEmail`).
- Authentication: global `X-AFrame-API-Key` header.

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


---
title: Aframe API Reference — 9. Contacts
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 9. Contacts
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*People and organizations in the Team's address book (clients, leads, agents, lenders, vendors, etc.).*

---

#### `POST /v1/contacts` — Create a Contact
**Status:** ✅ Extracted 2026-06-18

**Summary:** Create a Contact

**Description:** Creates a new Contact on the authenticated user's Team. A Contact must have either a first & last name, or a company name, to be valid. See `APIContactCreateDto` for the full list of accepted fields.

**Request**
- Content-Type: `application/json`
- Path params: None
- Query params: None
- Body schema (`APIContactCreateDto`):

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | `company` | string (≤ 100 chars) | conditional | Company name. Required if `firstName`/`lastName` not provided. |
  | `teamName` | string (≤ 100 chars) | no | Team name |
  | `title` | string (≤ 20 chars) | no | Name title (e.g. `"Mr."`) |
  | `firstName` | string (≤ 75 chars) | conditional | First name. Required with `lastName` if `company` not provided. |
  | `middleName` | string (≤ 25 chars) | no | Middle name |
  | `lastName` | string (≤ 75 chars) | conditional | Last name. Required with `firstName` if `company` not provided. |
  | `jobTitle` | string (≤ 75 chars) | no | Job title |
  | `email1` | string (email, ≤ 255 chars) | no | Email 1 (primary) |
  | `email2` | string (email, ≤ 255 chars) | no | Email 2 |
  | `email3` | string (email, ≤ 255 chars) | no | Email 3 |
  | `phone1` | string (≤ 30 chars) | no | Phone 1 number |
  | `phone1Type` | string (enum) | no | Phone 1 type. See `phoneType` enum. |
  | `phone1Desc` | string (≤ 20 chars) | no | Phone 1 description / extension |
  | `phone2` | string (≤ 30 chars) | no | Phone 2 number |
  | `phone2Type` | string (enum) | no | Phone 2 type. See `phoneType` enum. |
  | `phone2Desc` | string (≤ 20 chars) | no | Phone 2 description / extension |
  | `phone3` | string (≤ 30 chars) | no | Phone 3 number |
  | `phone3Type` | string (enum) | no | Phone 3 type. See `phoneType` enum. |
  | `phone3Desc` | string (≤ 20 chars) | no | Phone 3 description / extension |
  | `phone4` | string (≤ 30 chars) | no | Phone 4 number |
  | `phone4Type` | string (enum) | no | Phone 4 type. See `phoneType` enum. |
  | `phone4Desc` | string (≤ 20 chars) | no | Phone 4 description / extension |
  | `fax` | string (≤ 30 chars) | no | Fax number |
  | `faxDesc` | string (≤ 20 chars) | no | Fax description / extension |
  | `altContactTitle` | string (≤ 20 chars) | no | Alt contact name title |
  | `altContactFirstName` | string (≤ 75 chars) | no | Alt contact first name |
  | `altContactMiddleName` | string (≤ 25 chars) | no | Alt contact middle name |
  | `altContactLastName` | string (≤ 75 chars) | no | Alt contact last name |
  | `altContactJobTitle` | string (≤ 75 chars) | no | Alt contact job title |
  | `altContactEmail1` | string (email, ≤ 255 chars) | no | Alt contact email 1 (primary) |
  | `altContactEmail2` | string (email, ≤ 255 chars) | no | Alt contact email 2 |
  | `altContactEmail3` | string (email, ≤ 255 chars) | no | Alt contact email 3 |
  | `altContactPhone1` | string (≤ 30 chars) | no | Alt contact phone 1 |
  | `altContactPhone1Type` | string (enum) | no | Alt contact phone 1 type. See `phoneType` enum. |
  | `altContactPhone1Desc` | string (≤ 20 chars) | no | Alt contact phone 1 description / extension |
  | `altContactPhone2` | string (≤ 30 chars) | no | Alt contact phone 2 |
  | `altContactPhone2Type` | string (enum) | no | Alt contact phone 2 type. See `phoneType` enum. |
  | `altContactPhone2Desc` | string (≤ 20 chars) | no | Alt contact phone 2 description / extension |
  | `altContactPhone3` | string (≤ 30 chars) | no | Alt contact phone 3 |
  | `altContactPhone3Type` | string (enum) | no | Alt contact phone 3 type. See `phoneType` enum. |
  | `altContactPhone3Desc` | string (≤ 20 chars) | no | Alt contact phone 3 description / extension |
  | `homeAddressLine1` | string (≤ 100 chars) | no | Home address line 1 |
  | `homeAddressLine2` | string (≤ 100 chars) | no | Home address line 2 |
  | `homeAddressCity` | string (≤ 75 chars) | no | Home address city |
  | `homeAddressState` | string (≤ 4 chars) | no | Home address state |
  | `homeAddressZip` | string (≤ 10 chars) | no | Home address zip or postal code |
  | `homeAddressCountry` | string (≤ 50 chars) | no | Home address country |
  | `workAddressLine1` | string (≤ 100 chars) | no | Work address line 1 |
  | `workAddressLine2` | string (≤ 100 chars) | no | Work address line 2 |
  | `workAddressCity` | string (≤ 75 chars) | no | Work address city |
  | `workAddressState` | string (≤ 4 chars) | no | Work address state |
  | `workAddressZip` | string (≤ 10 chars) | no | Work address zip or postal code |
  | `workAddressCountry` | string (≤ 50 chars) | no | Work address country |
  | `primaryAddress` | string (enum) | no | Primary address used for communication. See `primaryAddress` enum. |
  | `website` | string (uri, ≤ 255 chars) | no | Website URL |
  | `brokerNum` | string (≤ 20 chars) | no | Broker license number |
  | `licenseNum` | string (≤ 20 chars) | no | Contact license number |
  | `relationshipRating` | string (enum) | no | Relationship rating. See `relationshipRating` enum. |
  | `salutationLtr` | string (≤ 255 chars) | no | Letter salutation; auto-completed if not provided |
  | `salutationEnv` | string (≤ 255 chars) | no | Envelope salutation; auto-completed if not provided |
  | `categories` | array\<string\> | no | Category names to associate with the Contact (each name ≤ 100 chars) |

**Response (2xx payload)**

  Returns `APIContactDto` (201 Created):

  | Field | Type | Description |
  |---|---|---|
  | `contactId` | integer | ID of the Contact |
  | `teamId` | integer | ID of the Team |
  | `associatedAppUserId` | integer | ID of the associated AppUser; populated when Contact is a team member |
  | `company` | string | Company name |
  | `teamName` | string | Team name |
  | `name.company` | string | Company (in name object) |
  | `name.title` | string | Title (e.g. `"Mr."`) |
  | `name.firstName` | string | First Name |
  | `name.middleName` | string | Middle Name |
  | `name.lastName` | string | Last Name |
  | `name.jobTitle` | string | Job title |
  | `email1` | string (email) | Email 1 |
  | `email2` | string (email) | Email 2 |
  | `email3` | string (email) | Email 3 |
  | `primaryEmail` | string (email) | Primary email used for communication |
  | `phone1.phone` | string | Phone Number |
  | `phone1.formattedPhoneString` | string | Phone formatted as (xxx) xxx-xxxx if possible |
  | `phone1.phoneType` | string (enum) | See `phoneType` enum |
  | `phone1.phoneDesc` | string | Phone Description or Extension |
  | `phone2.phone` | string | Phone 2 number |
  | `phone2.formattedPhoneString` | string | Phone 2 formatted |
  | `phone2.phoneType` | string (enum) | See `phoneType` enum |
  | `phone2.phoneDesc` | string | Phone 2 description |
  | `phone3.phone` | string | Phone 3 number |
  | `phone3.formattedPhoneString` | string | Phone 3 formatted |
  | `phone3.phoneType` | string (enum) | See `phoneType` enum |
  | `phone3.phoneDesc` | string | Phone 3 description |
  | `phone4.phone` | string | Phone 4 number |
  | `phone4.formattedPhoneString` | string | Phone 4 formatted |
  | `phone4.phoneType` | string (enum) | See `phoneType` enum |
  | `phone4.phoneDesc` | string | Phone 4 description |
  | `fax.phone` | string | Fax number |
  | `fax.formattedPhoneString` | string | Fax formatted |
  | `fax.phoneType` | string (enum) | See `phoneType` enum |
  | `fax.phoneDesc` | string | Fax description |
  | `altContactName.company` | string | Alt contact company |
  | `altContactName.title` | string | Alt contact title |
  | `altContactName.firstName` | string | Alt contact first name |
  | `altContactName.middleName` | string | Alt contact middle name |
  | `altContactName.lastName` | string | Alt contact last name |
  | `altContactJobTitle` | string | Alt contact job title |
  | `altContactEmail1` | string (email) | Alt contact email 1 |
  | `altContactEmail2` | string (email) | Alt contact email 2 |
  | `altContactEmail3` | string (email) | Alt contact email 3 |
  | `altContactPrimaryEmail` | string (email) | Alt contact primary email |
  | `altContactPhone1.phone` | string | Alt contact phone 1 number |
  | `altContactPhone1.formattedPhoneString` | string | Alt contact phone 1 formatted |
  | `altContactPhone1.phoneType` | string (enum) | See `phoneType` enum |
  | `altContactPhone1.phoneDesc` | string | Alt contact phone 1 description |
  | `altContactPhone2.phone` | string | Alt contact phone 2 number |
  | `altContactPhone2.formattedPhoneString` | string | Alt contact phone 2 formatted |
  | `altContactPhone2.phoneType` | string (enum) | See `phoneType` enum |
  | `altContactPhone2.phoneDesc` | string | Alt contact phone 2 description |
  | `altContactPhone3.phone` | string | Alt contact phone 3 number |
  | `altContactPhone3.formattedPhoneString` | string | Alt contact phone 3 formatted |
  | `altContactPhone3.phoneType` | string (enum) | See `phoneType` enum |
  | `altContactPhone3.phoneDesc` | string | Alt contact phone 3 description |
  | `homeAddress.address1` | string | Home address line 1 |
  | `homeAddress.address2` | string | Home address line 2 |
  | `homeAddress.city` | string | Home city |
  | `homeAddress.state` | string | Home state |
  | `homeAddress.zip` | string | Home zip / postal code |
  | `homeAddress.country` | string | Home country |
  | `homeAddress.county` | string | Home county |
  | `homeAddress.latitude` | number (double) | Home latitude |
  | `homeAddress.longitude` | number (double) | Home longitude |
  | `workAddress.address1` | string | Work address line 1 |
  | `workAddress.address2` | string | Work address line 2 |
  | `workAddress.city` | string | Work city |
  | `workAddress.state` | string | Work state |
  | `workAddress.zip` | string | Work zip / postal code |
  | `workAddress.country` | string | Work country |
  | `workAddress.county` | string | Work county |
  | `workAddress.latitude` | number (double) | Work latitude |
  | `workAddress.longitude` | number (double) | Work longitude |
  | `primaryAddress` | string (enum) | Primary address used for communication |
  | `website` | string (uri) | Website URL |
  | `brokerNum` | string | Broker license number |
  | `licenseNum` | string | Contact license number |
  | `salutationLtr` | string | Letter salutation |
  | `salutationEnv` | string | Envelope salutation |
  | `relationshipRating` | string (enum) | Relationship rating |
  | `createDateTime` | string (date-time) | Date and time the Contact was created |
  | `editDateTime` | string (date-time) | Date and time the Contact was last edited |
  | `appUserIdOwners` | array\<integer\> | AppUser IDs that own the Contact (unique) |
  | `categories[].categoryId` | integer | Category ID |
  | `categories[].teamId` | integer | Team ID |
  | `categories[].name` | string | Category name |

**Enums / constants:**
- `phoneType` (applies to `phone1Type`–`phone4Type`, `altContactPhone1Type`–`altContactPhone3Type`): `"CELL"`, `"HOME"`, `"WORK"`, `"COMPANY"`, `"PAGER"`, `"ASSISTANT"`, `"FAX"`, `"OTHER"`
- `primaryAddress`: `"HOME"`, `"WORK"`
- `relationshipRating`: `"A"`, `"B"`, `"C"`, `"D"`, `"E"`

**Notable errors:**

Error responses use the `APIResponse` envelope: `{ payload: any, error: { requestId, messages[], details[], validationErrors[{ fieldName, message }] } }`

- `400 Bad Request` — Malformed JSON or unreadable payload
- `404 Not Found` — A referenced resource (such as a Category) could not be found
- `422 Unprocessable Content` — The Contact data is invalid or missing required fields
- `429 Too Many Requests` — Rate limit exceeded

**Quirks & notes:**
- A Contact must have either (`firstName` + `lastName`) OR `company` to be valid; the API enforces this via 422.
- `salutationLtr` and `salutationEnv` are auto-completed by Aframe if not supplied.
- `categories` accepts an array of **category name strings** (not IDs); a 404 is returned if a named category is not found on the team.
- Response DTO (`APIContactDto`) includes `latitude`/`longitude` on address objects (geocoded by Aframe).
- Authentication: global `X-AFrame-API-Key` header.

---

#### `POST /v1/contacts/search` — Search Contacts
**Status:** ✅ Extracted 2026-06-17

**Summary:** Search for Contacts using the supplied criteria. Pagination via `page` (0-based) and `pageSize` (max 100) is supported.

**Request**
- Content-Type: `application/json`
- Path params: None
- Query params: None
- Body schema (`APIContactPagedQueryDto`):

  | Field | Type | Required | Description / Notes |
  |---|---|---|---|
  | `contactSearchCriteriaDto` | object | no | Search criteria wrapper |
  | `contactSearchCriteriaDto.company` | string | no | Filter by company ('starts with' matching) |
  | `contactSearchCriteriaDto.teamName` | string | no | Filter by team name ('starts with' matching) |
  | `contactSearchCriteriaDto.firstName` | string | no | Filter by contact first name or alt contact first name ('starts with' matching) |
  | `contactSearchCriteriaDto.lastName` | string | no | Filter by contact last name or alt contact last name ('starts with' matching) |
  | `contactSearchCriteriaDto.altContactFirstName` | string | no | Filter by alt contact first name ('starts with' matching) |
  | `contactSearchCriteriaDto.altContactLastName` | string | no | Filter by alt contact last name ('starts with' matching) |
  | `contactSearchCriteriaDto.email` | string (email) | no | Filter by contact email (exact matching) |
  | `contactSearchCriteriaDto.categories` | string | no | Comma-separated category filters; a leading `-` on a token is a negative filter ('starts with' matching). Example: `"Builder, COI, -Investor"` |
  | `contactSearchCriteriaDto.contactEditDateTime.from` | string (date-time) | no | Edit date range start, ISO-8601 (inclusive) |
  | `contactSearchCriteriaDto.contactEditDateTime.to` | string (date-time) | no | Edit date range end, ISO-8601 (inclusive) |
  | `contactSearchCriteriaDto.contactCreateDateTime.from` | string (date-time) | no | Create date range start, ISO-8601 (inclusive) |
  | `contactSearchCriteriaDto.contactCreateDateTime.to` | string (date-time) | no | Create date range end, ISO-8601 (inclusive) |
  | `page` | integer (≥ 0) | no | Page number, 0-based. Default: `0` |
  | `pageSize` | integer ([1, 100]) | no | Page size, max 100. Default: `20` |

**Response (2xx payload)**

  `APIContactPagedResultDto`:

  | Field | Type | Description |
  |---|---|---|
  | `items` | array\<object\> | List of contact digest results |
  | `items[].contactId` | integer | ID of the Contact |
  | `items[].name.company` | string | Company (in name object) |
  | `items[].name.title` | string | Title (e.g. `"Mr."`) |
  | `items[].name.firstName` | string | First Name |
  | `items[].name.middleName` | string | Middle Name |
  | `items[].name.lastName` | string | Last Name |
  | `items[].company` | string | Company name |
  | `items[].teamName` | string | Team name |
  | `items[].jobTitle` | string | Job title |
  | `items[].primaryEmail` | string | Primary email used for communication |
  | `items[].phone1.phone` | string | Phone Number |
  | `items[].phone1.formattedPhoneString` | string | Phone formatted as (xxx) xxx-xxxx if possible |
  | `items[].phone1.phoneType` | string (enum) | See `phoneType` enum |
  | `items[].phone1.phoneDesc` | string | Phone Description or Extension |
  | `items[].phone2.phone` | string | Phone Number (second phone) |
  | `items[].phone2.formattedPhoneString` | string | Formatted second phone |
  | `items[].phone2.phoneType` | string (enum) | See `phoneType` enum |
  | `items[].phone2.phoneDesc` | string | Phone Description or Extension |
  | `items[].altContactName.company` | string | Alt contact company |
  | `items[].altContactName.title` | string | Alt contact title |
  | `items[].altContactName.firstName` | string | Alt contact first name |
  | `items[].altContactName.middleName` | string | Alt contact middle name |
  | `items[].altContactName.lastName` | string | Alt contact last name |
  | `items[].altContactJobTitle` | string | Alt contact job title |
  | `items[].altContactPrimaryEmail` | string | Alt contact primary email |
  | `items[].altContactPhone1.phone` | string | Alt contact phone 1 number |
  | `items[].altContactPhone1.formattedPhoneString` | string | Alt contact phone 1 formatted |
  | `items[].altContactPhone1.phoneType` | string (enum) | See `phoneType` enum |
  | `items[].altContactPhone1.phoneDesc` | string | Alt contact phone 1 description |
  | `items[].altContactPhone2.phone` | string | Alt contact phone 2 number |
  | `items[].altContactPhone2.formattedPhoneString` | string | Alt contact phone 2 formatted |
  | `items[].altContactPhone2.phoneType` | string (enum) | See `phoneType` enum |
  | `items[].altContactPhone2.phoneDesc` | string | Alt contact phone 2 description |
  | `items[].brokerNum` | string | Broker license number |
  | `items[].licenseNum` | string | Contact license number |
  | `items[].createDateTime` | string (date-time) | Date and time the Contact was created |
  | `items[].editDateTime` | string (date-time) | Date and time the Contact was last edited |
  | `pageMetadata.page` | integer | Current page number (0-based) |
  | `pageMetadata.pageSize` | integer | Current page size |
  | `pageMetadata.totalElementsOnPage` | integer | Number of elements on this page |
  | `pageMetadata.totalElements` | integer | Total number of matching elements |
  | `pageMetadata.hasNextPage` | boolean | Whether there is a next page |
  | `pageMetadata.lastPage` | integer | Last page number |
  | `groupCounts` | object | Optional map of group counts (key → integer count) if grouping applied |

**Enums / constants:**
- `phoneType` (applies to `phone1`, `phone2`, `altContactPhone1`, `altContactPhone2`): `"CELL"`, `"HOME"`, `"WORK"`, `"COMPANY"`, `"PAGER"`, `"ASSISTANT"`, `"FAX"`, `"OTHER"`

**Notable errors:**

Error responses use the `APIResponse` envelope: `{ payload: any, error: { requestId, messages[], details[], validationErrors[{ fieldName, message }] } }`

- `400 Bad Request` — Malformed JSON or unreadable payload
- `422 Unprocessable Content` — Invalid search criteria (e.g. `pageSize` out of range)
- `429 Too Many Requests` — Rate limit exceeded

**Quirks & notes:**
- Request body is wrapped in `APIContactPagedQueryDto`; search criteria are nested inside `contactSearchCriteriaDto`.
- `categories` filter is comma-separated; a leading `-` on any token is a negative filter.
- `page` is 0-based (default `0`); `pageSize` max is 100 (default `20`).
- Response payload is `APIContactPagedResultDto` directly (not the standard `APIResponse` envelope).
- Each `items[]` entry is a mid-level contact summary (digest), not a full contact record.
- Authentication: global `X-AFrame-API-Key` header.

---

#### `GET /v1/contacts/{contactId}` — Get a contact
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/contacts/{contactId}` — Update a contact
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---


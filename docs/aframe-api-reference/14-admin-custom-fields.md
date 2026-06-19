---
title: Aframe API Reference — 14. Admin :: Custom Fields
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 14. Admin :: Custom Fields
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*Team-defined Field definitions that capture extra data on Transactions.*

---

#### `GET /v1/fields` — List custom Field definitions
**Status:** ✅ Extracted 2026-06-18

**Summary:** List custom Field definitions

**Description:** Returns a flat, alphabetically-sorted list of every custom Field defined for the Team. Custom Fields store additional structured data on Transactions.

**Request**
- Content-Type: `application/json`
- Path params: None
- Query params: None
- Body schema: None

**Response (2xx payload)**

| Field | Type | Description |
|---|---|---|
| `[].fieldId` | integer (int32) | Field Id |
| `[].teamId` | integer (int32) | Team Id |
| `[].fieldGroupId` | integer (int32) | Field Group Id |
| `[].fieldGroupName` | string | Field Group Name |
| `[].label` | string | Field Label |
| `[].placeholder` | string | Field Placeholder Text (for input fields) |
| `[].mergeFieldCode` | string | Merge Field Code |
| `[].fieldType` | string (enum) | Field Type — see enums |
| `[].choices[].value` | string | Choice value; only present when `fieldType` is `CHOICE` |
| `[].choices[].color` | string (enum) | Choice color — see enums |
| `[].multiChoice` | boolean | Allow multiple Choices for the field? |
| `[].showDecimal` | boolean | Show Decimal for the field? |
| `[].sort` | integer (int32) | Sort order within the Field Group |

**Enums / constants:**
- `fieldType`: `"TEXT"`, `"TEXTAREA"`, `"EMAIL"`, `"URL"`, `"NUMBER"`, `"CURRENCY"`, `"SQFT"`, `"CHOICE"`, `"SYS_MLS_ID"`, `"SYS_LOCKBOX_ID"`, `"SYS_SOURCE"`, `"SYS_PROP_TYPE"`
- `choices[].color`: `"NONE"`, `"RED"`, `"TANGERINE"`, `"TAUPE"`, `"YELLOW"`, `"LIME"`, `"GREEN"`, `"CYAN"`, `"TEAL"`, `"COBALT"`, `"PURPLE"`, `"MAGENTA"`

**Notable errors:**
The non-2xx responses use the `APIResponse` envelope: `payload` (any), `error.requestId` (string), `error.messages` (array<string>), `error.details` (array<string>), `error.validationErrors[].fieldName` (string), `error.validationErrors[].message` (string).

- `429` Too Many Requests — Rate limit exceeded.

**Quirks & notes:**
- Response is a bare array (not wrapped in `APIResponse`); the 200 payload is the array directly.
- `choices` is only populated when `fieldType` is `CHOICE`.
- Authentication: global `X-AFrame-API-Key` header.

---

#### `GET /v1/fields/tree` — Get fields as a tree structure
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---


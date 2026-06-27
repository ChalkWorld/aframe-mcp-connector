---
title: Aframe API Reference — 5. Transaction Data (Custom Fields)
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 5. Transaction Data (Custom Fields)
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*Values of the Team's custom Fields on a Transaction (e.g. earnest money amount, property type).*

---

#### `PATCH /v1/xactions/{xactionId}/fields/{fieldId}` — Update a field value by field ID
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/xactions/{xactionId}/fields/code/{mergeFieldCode}` — Update a field value by merge field code
**Status:** Not extracted | Built in connector v0.2.0 as `update_custom_field`

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `GET /v1/xactions/{xactionId}/field-tree` — Get the full custom Field tree for a Transaction
**Status:** ✅ Extracted 2026-06-18

**Summary:** Get the full custom Field tree for a Transaction

**Description:** Returns the Team's custom Fields grouped as Field Collections > Field Groups > Fields, with each Field's current value on the given Transaction merged in. Fields that do not yet have a value on the Transaction are included with an empty value.

**Request**
- Content-Type: `application/json`
- Path params:

  | Param | Type | Required | Description |
  |---|---|---|---|
  | `xactionId` | integer (int32) | yes | ID of the Transaction |

- Query params: None
- Body schema: None

**Response (2xx payload)**

Response is wrapped in `XactionFieldTreeDto`. Three-level nesting: `xactionFieldCollections` → `xactionFieldGroups` → `xactionFields`. Each level pairs a definition object (`fieldCollection` / `fieldGroup` / `field`) with the Transaction-level value object (`xactionField`).

| Field | Type | Description |
|---|---|---|
| `xactionFieldCollections[].fieldCollectionId` | integer (int32) | Field Collection Id (key) |
| `xactionFieldCollections[].fieldCollection.fieldCollectionId` | integer (int32) | Field Collection Id |
| `xactionFieldCollections[].fieldCollection.teamId` | integer (int32) | Team Id |
| `xactionFieldCollections[].fieldCollection.name` | string | Field Collection Name |
| `xactionFieldCollections[].fieldCollection.mergeFieldCode` | string | Merge Field Code |
| `xactionFieldCollections[].fieldCollection.sort` | integer (int32) | Sort number |
| `xactionFieldCollections[].xactionFieldGroups[].fieldGroupId` | integer (int32) | Field Group Id (key) |
| `xactionFieldCollections[].xactionFieldGroups[].fieldGroup.fieldGroupId` | integer (int32) | Field Group Id |
| `xactionFieldCollections[].xactionFieldGroups[].fieldGroup.fieldCollectionId` | integer (int32) | Field Collection Id |
| `xactionFieldCollections[].xactionFieldGroups[].fieldGroup.fieldCollectionName` | string | Field Collection Name |
| `xactionFieldCollections[].xactionFieldGroups[].fieldGroup.name` | string | Field Group Name |
| `xactionFieldCollections[].xactionFieldGroups[].fieldGroup.mergeFieldCode` | string | Merge Field Code |
| `xactionFieldCollections[].xactionFieldGroups[].fieldGroup.sort` | integer (int32) | Sort number |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].fieldId` | integer (int32) | Field Id (key) |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.fieldId` | integer (int32) | Field Id |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.teamId` | integer (int32) | Team Id |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.fieldGroupId` | integer (int32) | Field Group Id |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.fieldGroupName` | string | Field Group Name |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.label` | string | Field Label |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.placeholder` | string | Field Placeholder Text (for input fields) |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.mergeFieldCode` | string | Merge Field Code |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.fieldType` | string (enum) | Field Type — see enums |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.choices[].value` | string | Choice value; only present when `fieldType` is `CHOICE` |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.choices[].color` | string (enum) | Choice color — see enums |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.multiChoice` | boolean | Allow multiple Choices for the field? |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.showDecimal` | boolean | Show Decimal for the field? |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].field.sort` | integer (int32) | Sort order within the Field Group |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].xactionField.fieldId` | integer (int32) | Field Id |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].xactionField.value` | string | Current value on this Transaction (empty string if not yet set) |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].xactionField.color` | string (enum) | Value color — see enums |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].xactionField.omitted` | boolean | Field omitted on this Transaction? |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].xactionField.required` | boolean | Field required on this Transaction? |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].xactionField.agentVisible` | boolean | Visible to agents? |
| `xactionFieldCollections[].xactionFieldGroups[].xactionFields[].xactionField.buyerSellerVisible` | boolean | Visible to buyers/sellers? |

**Enums / constants:**
- `field.fieldType`: `"TEXT"`, `"TEXTAREA"`, `"EMAIL"`, `"URL"`, `"NUMBER"`, `"CURRENCY"`, `"SQFT"`, `"CHOICE"`, `"SYS_MLS_ID"`, `"SYS_LOCKBOX_ID"`, `"SYS_SOURCE"`, `"SYS_PROP_TYPE"`
- `field.choices[].color` / `xactionField.color`: `"NONE"`, `"RED"`, `"TANGERINE"`, `"TAUPE"`, `"YELLOW"`, `"LIME"`, `"GREEN"`, `"CYAN"`, `"TEAL"`, `"COBALT"`, `"PURPLE"`, `"MAGENTA"`

**Notable errors:**
All non-2xx responses use the `APIResponse` envelope: `payload` (any), `error.requestId` (string), `error.messages` (array<string>), `error.details` (array<string>), `error.validationErrors[].fieldName` (string), `error.validationErrors[].message` (string).

- `403` Forbidden — The authenticated user does not have permission to access this Transaction.
- `404` Not Found — Transaction with the supplied ID does not exist.
- `429` Too Many Requests — Rate limit exceeded.

**Quirks & notes:**
- Response is the `XactionFieldTreeDto` object directly (not a bare array); every field is present even if it has no value on the Transaction — check `xactionField.value` for empty string.
- Each nesting level pairs a *definition* sub-object (`fieldCollection`, `fieldGroup`, `field`) with the *id key* for that level (`fieldCollectionId`, `fieldGroupId`, `fieldId`).
- `xactionField.color` is only meaningful for `CHOICE`-type fields.
- Use `GET /v1/fields/tree` if you only need field definitions without Transaction values.
- Authentication: global `X-AFrame-API-Key` header.

---


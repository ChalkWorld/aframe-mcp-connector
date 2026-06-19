---
title: Aframe API Reference — 17. Admin :: Transaction Statuses
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 17. Admin :: Transaction Statuses
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*Team-defined Status definitions describing where a Transaction sits in its workflow.*

---

#### `GET /v1/xaction-statuses` — List Transaction Statuses
**Status:** ✅ Extracted 2026-06-18

**Summary:** List Transaction Statuses

**Description:** Returns every Transaction Status defined for the Team. Optionally supply `xactionStages` to restrict the result to statuses that belong to the given Stages (e.g. `ACTIVE`, `UNDER_CONTRACT`).

**Request**
- Content-Type: `application/json`
- Path params: None
- Query params:

  | Param | Type | Required | Description |
  |---|---|---|---|
  | `xactionStages` | string (enum, repeatable) | no | Filter by Stage; supply once per value (e.g. `?xactionStages=ACTIVE&xactionStages=UNDER_CONTRACT`) — see enums |

- Body schema: None

**Response (2xx payload)**

Returns an array of Transaction Status objects.

  | Field | Type | Description |
  |---|---|---|
  | `xactionStatusId` | integer (int32) | ID for the Transaction Status |
  | `name` | string | Status name |
  | `sort` | integer (int32) | Sort order |
  | `xactionStage` | string (enum) | Stage this status belongs to — see enums |
  | `xactionStatusSystemType` | string (enum) | System type designation, if applicable — see enums |
  | `colorHex` | string | Color hex code for the status |
  | `agentVisible` | boolean | Whether this status is visible to agent Team Members |
  | `buyerSellerVisible` | boolean | Whether this status is visible on the Buyer/Seller portal |

**Enums / constants:**
- `xactionStage` / `xactionStages` (query): `"PRE_ACTIVE"`, `"ACTIVE"`, `"UNDER_CONTRACT"`, `"SOLD"`, `"NOT_SOLD"`, `"NOT_ACTIVE"`
- `xactionStatusSystemType`: `"XACTION_STATUS_SYSTEM_ACTIVE"`, `"XACTION_STATUS_SYSTEM_CLOSED"`, `"XACTION_STATUS_SYSTEM_FELL_APART"`, `"XACTION_STATUS_SYSTEM_DRAFT"`

**Notable errors:**

All error responses use the `APIResponse` envelope.

- `400` — Bad Request: One of the supplied `xactionStages` values is not a recognized enum
- `429` — Too Many Requests: Rate limit exceeded

**Quirks & notes:**
- `xactionStages` is a repeatable query param — pass it multiple times to filter by multiple stages simultaneously.
- `xactionStatusSystemType` identifies system-managed statuses; custom statuses will have this field absent or null.
- Authentication: global `X-AFrame-API-Key` header.

---


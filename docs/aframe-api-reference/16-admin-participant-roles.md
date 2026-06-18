---
title: Aframe API Reference — 16. Admin :: Transaction Participant Roles
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 16. Admin :: Transaction Participant Roles
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*Team-defined Role definitions that describe a Contact's part in a Transaction.*

---

#### `GET /v1/xaction-participant-roles` — List Transaction Participant Roles
**Status:** ✅ Extracted 2026-06-18

**Summary:** List Transaction Participant Roles

**Description:** Returns every Transaction Participant Role defined for the authenticated user's Team. Roles identify the part each Participant plays in a Transaction (e.g. Buyer, Listing Agent, Lender).

**Request**
- Content-Type: N/A
- Path params: None
- Query params: None
- Body schema: None

**Response (2xx payload)**

Returns an array of role objects.

  | Field | Type | Description |
  |---|---|---|
  | `[].xactionParticipantRoleId` | integer | ID of the Transaction Participant Role |
  | `[].name` | string | Name of the role (e.g., `"Buyer"`, `"Listing Agent"`) |
  | `[].sort` | integer | Sort order for display |
  | `[].mergeFieldCodePrefix` | string | Merge field code prefix used in templates |

**Notable errors:**

| Code | Description |
|---|---|
| 429 | Too Many Requests — rate limit exceeded |

**Quirks & notes:**
- Returns all roles for the authenticated user's Team — no filtering parameters.
- Authentication: global `X-AFrame-API-Key` header.

---


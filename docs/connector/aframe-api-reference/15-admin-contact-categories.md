---
title: Aframe API Reference — 15. Admin :: Contact Categories
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 15. Admin :: Contact Categories
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*Team-defined tags used to classify Contacts (e.g. Buyer, Seller, Vendor).*

---

#### `GET /v1/categories` — List Contact Categories
**Status:** ✅ Extracted 2026-06-18

**Summary:** List Contact Categories

**Description:** Returns every Contact Category defined on the authenticated user's Team. Contact Categories are the tags used throughout the app to classify Contacts for easier searching.

**Request**
- Content-Type: `application/json`
- Path params: None
- Query params: None
- Body schema: None

**Response (2xx payload)**

Returns an array of category objects.

  | Field | Type | Description |
  |---|---|---|
  | `categoryId` | integer (int32) | Category ID |
  | `teamId` | integer (int32) | Team ID |
  | `name` | string | Category name (e.g. `"Sphere of Influence"`) |

**Notable errors:**

- `429` — Too Many Requests: Rate limit exceeded (`APIResponse` envelope)

**Quirks & notes:**
- No parameters — returns all categories for the authenticated user's Team.
- Authentication: global `X-AFrame-API-Key` header.

---


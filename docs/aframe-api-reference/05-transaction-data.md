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

#### `GET /v1/xactions/{xactionId}/field-tree` — Get all field values for a Transaction
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---


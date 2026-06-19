---
title: Cursor Handoff — src/aframe.js — v0.4.0
document_id: HANDOFF-v0.4.0-aframe-js
version: 0.4.0
date: 2026-06-19
project: AAR-TC Aframe Connector
---

# Cursor Handoff — `src/aframe.js` — v0.4.0

Apply the changes below **surgically**. Do not modify anything not listed here.

---

## Change 1 — Bug fix: `updateTransactionParticipant`

The current implementation sends a plain object body. Replace it with RFC 6902 JSON Patch, matching the pattern used by `updateTransaction`, `updateContact`, and `updateCustomField`.

**Find this exact block:**

```js
// PATCH /v1/xaction-participants/{xactionParticipantId} — plain object body (not RFC 6902)
// Note: Content-Type is application/json-patch+json per Aframe spec, but body is NOT
// an RFC 6902 array — it is a plain APIXactionParticipantPatchDto object.
export async function updateTransactionParticipant(xactionParticipantId, changes) {
  return aframeRequest(
    "PATCH",
    `/v1/xaction-participants/${encodeURIComponent(xactionParticipantId)}`,
    changes,
    "application/json-patch+json"
  );
}
```

**Replace with:**

```js
// PATCH /v1/xaction-participants/{xactionParticipantId} — JSON Patch RFC 6902
export async function updateTransactionParticipant(xactionParticipantId, changes) {
  const ops = toJsonPatch(changes);
  if (ops.length === 0) {
    throw new Error("updateTransactionParticipant called with no fields to update");
  }
  return aframeRequest(
    "PATCH",
    `/v1/xaction-participants/${encodeURIComponent(xactionParticipantId)}`,
    ops,
    "application/json-patch+json"
  );
}
```

---

## Change 2 — Add 8 new client methods

Add the following three section blocks at the **bottom of the file**, after `updateParticipantContactInfo`.

---

### Block A — Custom Field Admin

```js
// ---------------------------------------------------------------------------
// Custom Field Admin
// ---------------------------------------------------------------------------

// GET /v1/fields
export async function listCustomFields() {
  return aframeRequest("GET", "/v1/fields");
}

// GET /v1/fields/tree
export async function listCustomFieldsTree() {
  return aframeRequest("GET", "/v1/fields/tree");
}

// GET /v1/xactions/{xactionId}/field-tree
export async function getTransactionFieldTree(xactionId) {
  return aframeRequest("GET", `/v1/xactions/${encodeURIComponent(xactionId)}/field-tree`);
}
```

---

### Block B — Transaction Search & Task Templates

```js
// ---------------------------------------------------------------------------
// Transaction Search & Task Templates
// ---------------------------------------------------------------------------

// POST /v1/xactions/search
export async function searchTransactions(body) {
  return aframeRequest("POST", "/v1/xactions/search", body);
}

// GET /v1/task-templates
export async function listTaskTemplates({ taskTemplateType } = {}) {
  const qs = taskTemplateType
    ? `?taskTemplateType=${encodeURIComponent(taskTemplateType)}`
    : "";
  return aframeRequest("GET", `/v1/task-templates${qs}`);
}

// POST /v1/xactions/{xactionId}/apply-task-templates
export async function applyTaskTemplates(xactionId, { taskTemplateIds, startDate } = {}) {
  const body = { taskTemplateIds };
  if (startDate !== undefined) body.startDate = startDate;
  return aframeRequest(
    "POST",
    `/v1/xactions/${encodeURIComponent(xactionId)}/apply-task-templates`,
    body
  );
}
```

---

### Block C — Contact Categories & Transaction Statuses

```js
// ---------------------------------------------------------------------------
// Contact Categories & Transaction Statuses
// ---------------------------------------------------------------------------

// GET /v1/categories
export async function listContactCategories() {
  return aframeRequest("GET", "/v1/categories");
}

// GET /v1/xaction-statuses
export async function listTransactionStatuses({ xactionStages } = {}) {
  let path = "/v1/xaction-statuses";
  if (xactionStages && xactionStages.length > 0) {
    const qs = xactionStages
      .map((s) => `xactionStages=${encodeURIComponent(s)}`)
      .join("&");
    path += `?${qs}`;
  }
  return aframeRequest("GET", path);
}
```

---

*No other changes to `src/aframe.js`.*

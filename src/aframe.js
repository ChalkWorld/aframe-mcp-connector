// Aframe Open API client
// Docs: https://api.aframeonline.com/api-pub/swagger-ui/index.html
//
// Response envelope (per Aframe spec):
//   {
//     "payload": { ... },     // resource on success
//     "error":   { ... }      // present on errors AND on partial-success 2xx
//                             //   responses (as warnings, e.g. "defaulted field")
//   }
//
// We treat HTTP status as the authoritative success/failure signal. On 2xx,
// payload is returned and any error block is surfaced as `warnings`. On non-2xx,
// the error block is thrown.

const AFRAME_BASE_URL = "https://api.aframeonline.com/api-pub";

function getApiKey() {
  const key = process.env.AFRAME_API_KEY;
  if (!key) {
    throw new Error("AFRAME_API_KEY environment variable is not set");
  }
  return key;
}

async function aframeRequest(method, path, body, contentType) {
  const url = `${AFRAME_BASE_URL}${path}`;
  const headers = {
    "X-AFrame-API-Key": getApiKey(),
  };
  if (body !== undefined) {
    headers["Content-Type"] = contentType || "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(
        `Aframe API returned non-JSON (status ${res.status}): ${text.slice(0, 500)}`
      );
    }
  }

  if (!res.ok) {
    const errPayload = json?.error ?? json ?? `HTTP ${res.status}`;
    throw new Error(
      `Aframe API error (${res.status}): ${JSON.stringify(errPayload)}`
    );
  }

  return {
    payload: json?.payload ?? json,
    warnings: json?.error ?? null,
  };
}

// Build a JSON Patch (RFC 6902) array from a flat { field: value } object.
// Only defined values are included; `undefined` is treated as "no change".
function toJsonPatch(changes) {
  const ops = [];
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) continue;
    ops.push({ op: "replace", path: `/${key}`, value });
  }
  return ops;
}

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

// POST /v1/xactions
export async function createTransaction(params) {
  return aframeRequest("POST", "/v1/xactions", params);
}

// GET /v1/xactions/{xactionId}
export async function getTransaction(xactionId) {
  return aframeRequest("GET", `/v1/xactions/${encodeURIComponent(xactionId)}`);
}

// PATCH /v1/xactions/{xactionId} — JSON Patch RFC 6902
export async function updateTransaction(xactionId, changes) {
  const ops = toJsonPatch(changes);
  if (ops.length === 0) {
    throw new Error("updateTransaction called with no fields to update");
  }
  return aframeRequest(
    "PATCH",
    `/v1/xactions/${encodeURIComponent(xactionId)}`,
    ops,
    "application/json-patch+json"
  );
}

// ---------------------------------------------------------------------------
// Transaction notes (activities)
// ---------------------------------------------------------------------------

// POST /v1/xaction-activities
export async function createTransactionNote({ xactionId, note }) {
  return aframeRequest("POST", "/v1/xaction-activities", { xactionId, note });
}

// ---------------------------------------------------------------------------
// Custom fields
// ---------------------------------------------------------------------------

// PATCH /v1/xactions/{xactionId}/fields/code/{mergeFieldCode} — JSON Patch RFC 6902
// If the field has no value on the transaction yet, one is created automatically.
// Note: `value` is always a string per the API spec, regardless of underlying
// field type (date, number, currency, text). Aframe handles type coercion server-side.
export async function updateCustomField(xactionId, mergeFieldCode, changes) {
  const ops = toJsonPatch(changes);
  if (ops.length === 0) {
    throw new Error("updateCustomField called with no fields to update");
  }
  return aframeRequest(
    "PATCH",
    `/v1/xactions/${encodeURIComponent(xactionId)}/fields/code/${encodeURIComponent(mergeFieldCode)}`,
    ops,
    "application/json-patch+json"
  );
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

// POST /v1/contacts/search
export async function searchContacts(body) {
  return aframeRequest("POST", "/v1/contacts/search", body);
}

// GET /v1/contacts/{contactId}
export async function getContact(contactId) {
  return aframeRequest("GET", `/v1/contacts/${encodeURIComponent(contactId)}`);
}

// POST /v1/contacts
export async function createContact(params) {
  return aframeRequest("POST", "/v1/contacts", params);
}

// PATCH /v1/contacts/{contactId} — JSON Patch RFC 6902
export async function updateContact(contactId, changes) {
  const ops = toJsonPatch(changes);
  if (ops.length === 0) {
    throw new Error("updateContact called with no fields to update");
  }
  return aframeRequest(
    "PATCH",
    `/v1/contacts/${encodeURIComponent(contactId)}`,
    ops,
    "application/json-patch+json"
  );
}

// ---------------------------------------------------------------------------
// Transaction Participants
// ---------------------------------------------------------------------------

// GET /v1/xaction-participant-roles
export async function listParticipantRoles() {
  return aframeRequest("GET", "/v1/xaction-participant-roles");
}

// GET /v1/xactions/{xactionId}/xaction-participants
export async function listTransactionParticipants(xactionId, { page = 0, pageSize = 50 } = {}) {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  return aframeRequest(
    "GET",
    `/v1/xactions/${encodeURIComponent(xactionId)}/xaction-participants?${qs}`
  );
}

// POST /v1/xaction-participants
export async function addTransactionParticipant(params) {
  return aframeRequest("POST", "/v1/xaction-participants", params);
}

// GET /v1/xaction-participants/{xactionParticipantId}
export async function getTransactionParticipant(xactionParticipantId) {
  return aframeRequest(
    "GET",
    `/v1/xaction-participants/${encodeURIComponent(xactionParticipantId)}`
  );
}

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

// DELETE /v1/xaction-participants/{xactionParticipantId}
export async function removeTransactionParticipant(xactionParticipantId) {
  return aframeRequest(
    "DELETE",
    `/v1/xaction-participants/${encodeURIComponent(xactionParticipantId)}`
  );
}

// PUT /v1/xaction-participants/{xactionParticipantId}/linked-contact/{linkedContactId}
export async function setParticipantLinkedContact(xactionParticipantId, linkedContactId) {
  return aframeRequest(
    "PUT",
    `/v1/xaction-participants/${encodeURIComponent(xactionParticipantId)}/linked-contact/${encodeURIComponent(linkedContactId)}`
  );
}

// DELETE /v1/xaction-participants/{xactionParticipantId}/linked-contact
export async function unlinkParticipantContact(xactionParticipantId) {
  return aframeRequest(
    "DELETE",
    `/v1/xaction-participants/${encodeURIComponent(xactionParticipantId)}/linked-contact`
  );
}

// PATCH /v1/xaction-participants/{xactionParticipantId}/linked-contact — JSON Patch RFC 6902
// Use when the participant HAS a linked Contact (linkedContactId is not null).
// Updates the linked Contact entity and re-syncs the participant snapshot.
export async function updateParticipantLinkedContact(xactionParticipantId, changes) {
  const ops = toJsonPatch(changes);
  if (ops.length === 0) {
    throw new Error("updateParticipantLinkedContact called with no fields to update");
  }
  return aframeRequest(
    "PATCH",
    `/v1/xaction-participants/${encodeURIComponent(xactionParticipantId)}/linked-contact`,
    ops,
    "application/json-patch+json"
  );
}

// PATCH /v1/xaction-participants/{xactionParticipantId}/contact-info — JSON Patch RFC 6902
// Use when the participant has NO linked Contact (linkedContactId is null).
// Updates the participant's snapshot only — does not create or modify a Contact entity.
export async function updateParticipantContactInfo(xactionParticipantId, changes) {
  const ops = toJsonPatch(changes);
  if (ops.length === 0) {
    throw new Error("updateParticipantContactInfo called with no fields to update");
  }
  return aframeRequest(
    "PATCH",
    `/v1/xaction-participants/${encodeURIComponent(xactionParticipantId)}/contact-info`,
    ops,
    "application/json-patch+json"
  );
}

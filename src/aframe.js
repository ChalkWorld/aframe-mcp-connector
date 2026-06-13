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

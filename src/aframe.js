// Aframe Open API client
// Docs: https://api.aframeonline.com/api-pub/swagger-ui/index.html

const AFRAME_BASE_URL = "https://api.aframeonline.com/api-pub";

function getApiKey() {
  const key = process.env.AFRAME_API_KEY;
  if (!key) {
    throw new Error("AFRAME_API_KEY environment variable is not set");
  }
  return key;
}

async function aframeRequest(method, path, body) {
  const url = `${AFRAME_BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "X-AFrame-API-Key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Aframe API returned non-JSON (status ${res.status}): ${text.slice(0, 200)}`
    );
  }

  if (!res.ok || (json && json.error)) {
    const errMsg =
      json?.error?.message || json?.error || `HTTP ${res.status}`;
    throw new Error(`Aframe API error: ${JSON.stringify(errMsg)}`);
  }

  return json;
}

// POST /v1/xactions — Create a Transaction
// Only a full property address is required; all other fields use Team defaults.
export async function createTransaction(params) {
  return aframeRequest("POST", "/v1/xactions", params);
}

// POST /v1/xaction-activities — Create a Transaction Note (XactionActivity)
export async function createTransactionNote({ xactionId, note }) {
  return aframeRequest("POST", "/v1/xaction-activities", { xactionId, note });
}

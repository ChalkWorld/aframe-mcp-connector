---
title: Aframe MCP Connector — Technical Reference
document_id: CONNECTOR-REF-001
version: 1.0
version_date: 2026-06-16
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted design, build, and documentation
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Aframe MCP Connector — Technical Reference
### AAR-TC Transaction Services | Document ID: CONNECTOR-REF-001

---

## Purpose

This document captures the technical architecture, deployment, and operating details of the Aframe MCP Connector — a custom MCP server that bridges Claude sessions to the Aframe Open API. It is the foundational technical reference; behavioral and workflow protocols (contract intake, data mapping, etc.) build on top of this.

This document is written primarily for future Claude sessions to load as context when working with the connector. Secondary audience: a human engineer maintaining or extending it.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-13 | Andrew Rich / Claude | Initial document. Captures connector v0.2.0 — five tools, Railway deployment, authless POC posture. |
| 1.0 | 2026-06-16 | Andrew Rich / Claude | Doc ID changed from `AAR-TC-AFRAME-REF-001` to `CONNECTOR-REF-001`. File renamed from `AFRAME_CONNECTOR_TECHNICAL_REFERENCE.md`. |

---

## 1. What This Is

The Aframe MCP Connector is a small Node.js service that lets a Claude session read from and write to Aframe (the transaction management platform at aframeonline.com) by exposing Aframe API operations as MCP tools.

Once connected, a Claude session can call tools like `create_transaction`, `get_transaction`, `update_custom_field`, etc., and the connector translates each call into the corresponding Aframe Open API request, returning the response back into the session.

The connector is not the workflow — it is the plumbing. Workflow protocols (what data to extract from contracts, what fields to set, when to add participants) are documented separately.

---

## 2. Architecture

```
Claude.ai session
  ↓  (custom MCP connector — Streamable HTTP transport)
Railway service (aframe-mcp-connector repo)
  ↓  (HTTPS with X-AFrame-API-Key header)
Aframe Open API  (https://api.aframeonline.com/api-pub)
```

The Railway service is the only thing holding the Aframe API key. Claude sessions never see the key directly — they call MCP tools, and the Railway service makes the authenticated API request on their behalf.

### Why MCP and not a Supabase message bus
The Chalk World project uses Supabase as a typed message bus between a deployed runtime and a browser canvas, because those two processes cannot connect to each other directly. The Aframe Connector does not have that constraint — Claude calls a service, the service returns a result. That is request/response, which is what MCP is built for. Choosing MCP cut the architecture in half: no commands table, no results table, no polling, no correlation IDs.

---

## 3. Where Things Live

| Component | Location | Notes |
|---|---|---|
| Source code | github.com/ChalkWorld/aframe-mcp-connector | Private repo |
| Deployment | aframe-mcp-connector-production.up.railway.app | Railway service |
| Health check | `GET /` | Returns `{status, service, version}` JSON |
| MCP endpoint | `POST /mcp` | Streamable HTTP transport, stateless mode |
| API key storage | Railway → Variables → `AFRAME_API_KEY` | Sourced from Aframe → My Profile → API Keys → Developer Zone |
| Auto-deploy trigger | `git push origin main` | Railway redeploys in ~30–60 seconds |
| Claude.ai connector | Settings → Connectors → `aframe-connector` | Custom connector, URL ends in `/mcp` |

### Repo file structure

```
aframe-mcp-connector/
├── package.json          Dependencies, scripts, version
├── .gitignore
├── .env.example          Template — actual .env is gitignored
├── README.md             User-facing setup/deploy/connect guide
└── src/
    ├── index.js          Entry point: Express server + MCP server + tool definitions
    └── aframe.js         Aframe API client (auth, envelope handling, JSON Patch helper)
```

---

## 4. Available Tools (v0.2.0)

| Tool | Aframe endpoint | Purpose |
|---|---|---|
| `create_transaction` | `POST /v1/xactions` | Create a new transaction. Address required; everything else optional and defaults to Team values. |
| `get_transaction` | `GET /v1/xactions/{xactionId}` | Fetch full transaction by ID, including custom field map. |
| `update_transaction` | `PATCH /v1/xactions/{xactionId}` | Partial update of transaction fields (price, dates, address, status, etc.). |
| `update_custom_field` | `PATCH /v1/xactions/{xactionId}/fields/code/{mergeFieldCode}` | Set or update a custom field by its Merge Field Code (e.g. `f_EarnestMoney`). Auto-creates the field value if it does not yet exist on the transaction. |
| `add_transaction_note` | `POST /v1/xaction-activities` | Add an activity note (HTML supported) to an existing transaction. |

Each tool's full parameter schema is defined in `src/index.js`. The MCP server exposes them via Streamable HTTP; Claude.ai discovers them on connector registration.

---

## 5. Implementation Details That Matter

### 5.1 Aframe response envelope

All Aframe API responses use the envelope `{ payload, error }`:

- On success (2xx), `payload` contains the resource.
- On failure (non-2xx), `error` contains failure details.
- **Critically:** `error` can also be present *alongside* `payload` on a 2xx success response, carrying validation warnings (e.g. "Primary Agent not specified, defaulting to current AppUser"). These are warnings, not failures.

The client (`aframe.js`) handles this by using HTTP status as the authoritative success signal. On 2xx, it returns `{ payload, warnings }` to the tool handler. On non-2xx, it throws with the error details.

This was a real bug in v0.1.0 — the original code threw on any presence of `error`, including the warning case, causing successful API calls to appear as failures. v0.2.0 fixed it.

### 5.2 JSON Patch (RFC 6902) for PATCH endpoints

Aframe's PATCH endpoints (`update_transaction`, `update_custom_field`) require a JSON Patch array as the request body with `Content-Type: application/json-patch+json`. Example:

```json
[
  { "op": "replace", "path": "/contractPrice", "value": 250000 },
  { "op": "replace", "path": "/closingDate", "value": "2026-08-15" }
]
```

The MCP tools accept friendly flat-object inputs (`{ contractPrice: 250000, closingDate: "2026-08-15" }`) and the `toJsonPatch` helper in `aframe.js` builds the patch array internally. Claude sessions never need to construct RFC 6902 syntax.

### 5.3 Custom fields

The `xactionFieldData` object on a transaction is a flat `{ mergeFieldCode: stringValue }` map. All values are strings regardless of underlying field type (date, number, currency, text) — Aframe handles type coercion server-side.

To update a field, the connector calls the merge-code endpoint (`/fields/code/{mergeFieldCode}`) rather than the numeric field ID endpoint. Merge codes (e.g. `f_EarnestMoney`) are durable; field IDs are internal.

If a field exists on the Team but has no value on the transaction, calling `update_custom_field` auto-creates the value record. No separate create step is needed.

### 5.4 Auth posture (current)

The connector runs **authless**. Anyone with the Railway URL can call the MCP endpoint. This is acceptable for current POC/development use because the Railway subdomain is effectively unguessable in practice.

This is not acceptable for production. Claude.ai's custom connector UI does not currently support pasted bearer tokens, so the production path requires implementing OAuth 2.1 with PKCE (Dynamic Client Registration, JWT issuance, refresh token rotation). This is on the roadmap, not in scope for current builds.

### 5.5 Stateless MCP transport

The Express endpoint creates a new `StreamableHTTPServerTransport` per request (stateless mode). For the current tool set this is the right choice — calls are short, no server-initiated notifications are needed, no resumability is required. If we later need persistent sessions (e.g. for streaming long-running operations), switch to session-based.

---

## 6. Operational Gotchas

### 6.1 Tool list changes require a connector refresh in Claude.ai

When the MCP server's tool list changes (adding, removing, or renaming tools), the Claude.ai connector caches the old list at registration time. A new Claude conversation alone is not enough — the cache lives at the connector level.

**To pick up the new tool list:**
1. Claude.ai → Settings → Connectors
2. Remove `aframe-connector`
3. Add it back with the same URL: `https://aframe-mcp-connector-production.up.railway.app/mcp`
4. Start a fresh conversation (or call `tool_search` in an existing one)

Internal changes to existing tools (logic, schemas, parsing) do **not** require this — only changes to the *tool list itself*. Batch tool additions across releases when possible to minimize this dance.

### 6.2 `tool_search` queries the live connector

Within a single Claude session, the `tool_search` mechanism dynamically queries the connector's current tool list. So once the Claude.ai connector itself is refreshed (per 6.1), the new tools become available even in already-running sessions via `tool_search`.

### 6.3 Railway deploys are automatic on push to main

Pushing to `main` triggers a Railway redeploy in ~30–60 seconds. The fastest way to verify the new build is live is to hit the health URL — the JSON response includes the deployed version number, which should match `package.json`.

### 6.4 Aframe date formatting

Aframe accepts dates in `YYYY-MM-DD` but stores/returns them without leading zeros on the month (e.g. `2026-8-15` rather than `2026-08-15`). Semantically equivalent; cosmetic only. Tools should not depend on the returned string matching the input string exactly.

### 6.5 Empty warning envelopes are still rendered as "API notes"

When Aframe returns a 2xx with `error` set but all its arrays empty (`{details:[], messages:[], validationErrors:[]}`), the current tool output still surfaces an "API notes" line. This is cosmetic and queued for cleanup — the check should test whether any value in the warnings object has actual content, not just whether the object exists.

---

## 7. How to Add a New Tool

The pattern has stabilized across v0.1.0 → v0.2.0. Steps:

1. **Scope.** Identify the Aframe endpoint(s) to wrap and the tool surface they should expose. Group related endpoints into the same release where it makes sense.
2. **Drill into the Swagger.** The Aframe Swagger UI is JavaScript-rendered, so `web_fetch` cannot read it directly. Use Claude in Chrome on the Swagger page to extract the relevant endpoint's URL, request body schema, response schema, and any quirks.
3. **Generate a Cursor handoff.** Write a surgical handoff document that adds the relevant client method to `src/aframe.js` and the corresponding MCP tool definition in `src/index.js`. Bump the version in `package.json` and the `McpServer` constructor.
4. **Apply via Cursor.** Cursor reads the handoff, applies edits, commits with the prepared message, and pushes to GitHub.
5. **Verify Railway deploy.** Hit the health URL — confirm the version number reflects the new build.
6. **Refresh the Claude.ai connector** (per 6.1, only needed when tool list changes).
7. **Test in a fresh session.** Run the new tools against a test transaction. Confirm both success and error paths.

---

## 8. Out of Scope (Current Release)

The following are deliberately not implemented in v0.2.0. Add them in future releases when the workflow needs them:

- **Webhooks** — Aframe supports webhook events (transaction/contact created/updated/deleted) with HMAC-SHA256 signature verification. Deferred. When added, Railway would expose a `/webhook` endpoint and maintain its own state mirror for "what changed since X" queries.
- **OAuth 2.1 auth** — required for production. Authless POC posture is current.
- **Participants and contacts** — adding buyer/seller/lender/cooperating agent/closer to a transaction. Listed as priority #2 in the original handover doc; first candidate for the next release.
- **Tasks** — search, mark complete, create. Listed as priority #4 in the handover doc.
- **Search/list endpoints** — `POST /v1/xactions/search`, `GET /v1/xaction-participant-roles`, `GET /v1/fields`, etc. Would let Claude discover what exists on the Team rather than relying on documentation.
- **Email queue access, attachments, contact notes** — present in the Aframe API surface but not yet wrapped.

---

## 9. Key External References

- **Aframe Open API docs:** https://api.aframeonline.com/api-pub/swagger-ui/index.html
- **MCP specification:** https://modelcontextprotocol.io
- **Claude custom connectors:** https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- **JSON Patch (RFC 6902):** https://datatracker.ietf.org/doc/html/rfc6902

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version date with each revision.*

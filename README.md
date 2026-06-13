# Aframe MCP Connector

A Node.js MCP server that bridges Claude sessions to the [Aframe Open API](https://api.aframeonline.com/api-pub/swagger-ui/index.html). Deployed on Railway, exposed to Claude.ai as a custom remote MCP connector.

## Status

**v0.2.0** — POC validated, expanded to core transaction CRUD + custom fields.

### Tools

| Tool | Description |
|---|---|
| `create_transaction` | Create a new transaction in Aframe |
| `get_transaction` | Fetch an existing transaction by ID (full payload incl. custom fields) |
| `update_transaction` | PATCH transaction fields (partial update via JSON Patch under the hood) |
| `update_custom_field` | PATCH a custom/merge field by Merge Field Code (e.g. `f_EarnestMoney`) |
| `add_transaction_note` | Add an activity note to an existing transaction |

## Architecture

```
Claude.ai session
  ↓  (custom MCP connector — Streamable HTTP)
Railway service (this repo)
  ↓  (HTTPS with X-AFrame-API-Key header)
Aframe Open API
```

## Local development

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `AFRAME_API_KEY`
3. `npm start`
4. Verify health: `curl http://localhost:3000/` → `{"status":"ok",...}`

## Deployment (Railway)

Auto-deploys on push to `main`. Required environment variable:
- `AFRAME_API_KEY` — your Aframe API key

Generate a public domain under Settings → Networking after the first deploy.

## Connecting to Claude.ai

Settings → Connectors → Add custom connector → paste `https://<railway-url>/mcp` → Add.

Tools become available in any new conversation with the connector enabled.

## Implementation notes

**Aframe response envelope:** `{ payload, error }`. The `error` block can appear *alongside* `payload` on 2xx success responses (as validation warnings, e.g. "defaulted to current AppUser"). HTTP status is the authoritative success/failure signal — `error` on 2xx is surfaced as `warnings`, not thrown.

**JSON Patch (RFC 6902):** Aframe's PATCH endpoints (`update_transaction`, `update_custom_field`) require an array of patch operations with `Content-Type: application/json-patch+json`. The MCP tools accept friendly flat-object inputs (e.g. `{ closingDate: "2026-08-15" }`) and the client internally constructs the patch array. Callers never need to write RFC 6902 syntax.

**Custom fields:** Stored as a flat `xactionFieldData` map keyed by Merge Field Code (e.g. `f_EarnestMoney`). All values are strings regardless of underlying type — Aframe handles type coercion server-side.

## Auth note

This service runs **authless**. Acceptable for development since the Railway subdomain is effectively unguessable, but **not suitable for production**. Claude.ai's custom connector UI does not currently support pasted bearer tokens (per [the connector auth docs](https://claude.com/docs/connectors/building/authentication)); production use will require OAuth 2.1 with PKCE.

## Version history

- **v0.2.0** — Added `get_transaction`, `update_transaction`, `update_custom_field`. Fixed response envelope parsing to treat `error` on 2xx as warnings rather than failures. JSON Patch helper for PATCH endpoints.
- **v0.1.0** — Initial POC with `create_transaction` and `add_transaction_note`.

## Reference

- Aframe Open API: https://api.aframeonline.com/api-pub/swagger-ui/index.html
- MCP spec: https://modelcontextprotocol.io
- Claude custom connectors: https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- JSON Patch (RFC 6902): https://datatracker.ietf.org/doc/html/rfc6902

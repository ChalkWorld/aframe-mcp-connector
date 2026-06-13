# Aframe MCP Connector

A Node.js MCP server that bridges Claude sessions to the [Aframe Open API](https://api.aframeonline.com/api-pub/swagger-ui/index.html). Deployed on Railway, exposed to Claude.ai as a custom remote MCP connector.

## Status

**Proof of Concept (v0.1.0)** — validates the architecture with two tools:

- `create_transaction` — create a new transaction in Aframe
- `add_transaction_note` — add a note to an existing transaction

If this works end-to-end (Claude creates a transaction → returns the ID → Claude adds a note to that transaction → both appear in the Aframe UI), the architecture is proven and the same pattern extends to participants, custom fields, tasks, and webhooks.

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

1. Push this repo to a new private GitHub repository
2. Create a new Railway project → New Service → Deploy from GitHub repo → select the repo
3. In the Railway service → Variables, set:
   - `AFRAME_API_KEY` = your Aframe API key (from Aframe → My Profile → API Keys → Developer Zone)
4. Under Settings → Networking, generate a public domain (Railway will issue one like `https://aframe-mcp-connector-production.up.railway.app`)
5. Confirm the deployment is healthy by visiting the public URL in a browser — should return `{"status":"ok","service":"aframe-mcp-connector","version":"0.1.0"}`

Railway auto-deploys on every push to `main`.

## Connecting to Claude.ai

1. In Claude.ai → Settings → Connectors → Add custom connector
2. Paste the Railway URL with `/mcp` appended:
   ```
   https://<your-railway-url>/mcp
   ```
3. Click Add. The two tools (`create_transaction`, `add_transaction_note`) should now be available in any new conversation.

### POC test sequence

In a new Claude session with the connector enabled:

1. Ask: *"Create a test transaction in Aframe for 100 Main Street, Richmond, VA 23220, buyer side."*
2. Claude calls `create_transaction`, returns the new transaction ID
3. Ask: *"Add a note to that transaction saying 'POC test from Claude session — [timestamp]'"*
4. Claude calls `add_transaction_note` using the ID from step 2
5. Open Aframe → confirm the transaction exists and the note is attached

If both steps land, the connector is working.

## Auth note

This POC runs **authless** — anyone who knows the Railway URL can call the MCP server. This is acceptable for short-lived POC testing because the Railway subdomain is effectively unguessable, but it is **not suitable for production**.

The reason: Claude.ai's custom connector UI does not currently support user-pasted bearer tokens (per [the connector auth docs](https://claude.com/docs/connectors/building/authentication)). For production use, the connector will need to implement OAuth 2.1 with PKCE — that's a Phase 2 task.

## Reference

- Aframe Open API: https://api.aframeonline.com/api-pub/swagger-ui/index.html
- MCP spec: https://modelcontextprotocol.io
- Claude custom connectors: https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- Claude connector auth: https://claude.com/docs/connectors/building/authentication

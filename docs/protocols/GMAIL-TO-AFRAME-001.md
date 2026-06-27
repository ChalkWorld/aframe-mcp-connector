---
title: Gmail→Aframe File Transfer — Scoping & Build Document
document_id: GMAIL-TO-AFRAME-001
version: 0.2
version_date: 2026-06-24
status: Scoping Complete — Ready for Build Session
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted design and documentation; Gemini — independent review and open question resolution
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Gmail→Aframe File Transfer
### AAR-TC Transaction Services | Document ID: GMAIL-TO-AFRAME-001

---

## Purpose

This document scopes and tracks the build of a server-side file transfer capability that moves email attachments from Gmail directly into Aframe transaction attachment slots — without routing the binary through Claude's context window.

This is the foundational piece for **Mode 2 attachment workflow**: when a document arrives in email during an active transaction (WDI report, signed addendum, closing extension, lender docs, settlement statement), a session identifies it, matches it to the correct Aframe slot, confirms with Andrew, and fires the transfer — all in one pass.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 0.1 | 2026-06-24 | Andrew Rich / Claude | Initial scoping document. Created following v0.5.0 build session after confirming binary upload via MCP context is not viable for real-world file sizes. |
| 0.2 | 2026-06-24 | Andrew Rich / Claude / Gemini | Gemini review resolved auth strategy, endpoint request body, attachment ID lookup, Drive deferral, and splitting v2 decision. All open questions resolved except GCP project. Status updated to Ready for Build Session. |

---

## Reference Documents

| Doc | ID | Purpose |
|---|---|---|
| Connector Technical Reference | `CONNECTOR-REF-001` | Connector architecture — new endpoint lives here |
| Connector Tool Roadmap | `CONNECTOR-ROAD-001` | Tracks build status and tier |
| Cursor Handoff Protocol | `CURSOR-HANDOFF-PROTOCOL-001` | Build delivery pattern |
| Aframe API Reference — Attachments | `API-REF-001` (category 4) | Aframe `/file` endpoint spec |

---

## Why This Exists

The `upload_transaction_attachment_file` MCP tool built in v0.5.0 proved the Aframe file upload endpoint works correctly. However, routing a real PDF binary through a Claude session as a base64 string is not viable — a 640KB contract PDF encodes to ~853k characters (~200k+ tokens), burning context and producing a truncated/corrupt upload.

The solution is a **server-side transfer endpoint** in the Railway connector app. Claude orchestrates (provides IDs, confirms intent) but never touches the binary. The binary moves server-to-server: Gmail API → Aframe API.

---

## The Vision (Mode 2 Attachment Workflow)

1. Email arrives during an active transaction — WDI report, ratified addendum, closing extension, lender commitment, etc.
2. Claude reads the Gmail thread (Gmail MCP), understands what the document is from context — subject, body, sender, attachment filename
3. Claude pulls the current Aframe attachment list (`list_transaction_attachments`) — sees what slots exist, what's filled, what's empty
4. Claude matches the incoming document to the right slot — or determines a new slot needs creating
5. Claude surfaces the match: *"WDI report from ABC Pest Control attached. Empty WDI slot in Contract Files. Want me to put it there?"*
6. Andrew confirms
7. Claude fires the transfer tool — binary moves server-side, Gmail → Aframe
8. Slot marked complete. Done.

**No Drive intermediate step required.** Drive is optional — only relevant if the file has already been saved there. The direct Gmail → Aframe path is faster and cleaner for in-session work.

---

## Architecture

```
Claude session
  ↓  calls new MCP tool with gmailMessageId + filename + xactionAttachmentId
Railway connector (new endpoint: POST /gmail-to-aframe)
  ↓  fetches message structure from Gmail API (OAuth 2.0 refresh token auth)
  ↓  looks up attachmentId by filename in message MIME parts
  ↓  fetches binary from Gmail API
  ↓  POSTs binary to Aframe PATCH /xaction-attachments/{id}/file
Returns updated attachment DTO to Claude
```

The new endpoint lives in the same Express app as the existing MCP server. No new Railway service needed.

---

## Resolved Decisions (Post-Gemini Review)

### ✅ Auth Strategy — OAuth 2.0 with Long-Lived Refresh Token

Service account with domain-wide delegation is **off the table** — that is a Google Workspace enterprise feature only. Personal `@gmail.com` accounts cannot use it.

**Confirmed path: OAuth 2.0 with a persistent refresh token stored in Railway.**

Setup steps (one-time, done before build session):
1. Create a Google Cloud project (or use an existing one)
2. Enable the Gmail API
3. Configure an OAuth consent screen — internal/testing status is fine for single-user
4. Create OAuth client credentials (Desktop app type for initial token generation)
5. Authorize once via a script or Postman to get an authorization code
6. Exchange the authorization code for a refresh token
7. Store `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN` as Railway environment variables

At runtime, the Express app uses the `googleapis` Node client with these three values to auto-generate fresh short-lived access tokens on every request. No manual token rotation needed.

---

### ✅ Endpoint Request Body — `gmailMessageId` + `filename`

The `gmailAttachmentId` is not reliably surfaced by Gmail MCP tool responses — implementations typically return only metadata (filename, size, mimeType) to keep context clean, not the deep MIME part attachment ID.

**Confirmed endpoint design:** Accept `gmailMessageId` and `filename`. The endpoint does the attachment ID lookup server-side.

**Flow:**
1. Claude passes `gmailMessageId` and `"WDI_Report.pdf"` (filename exactly as it appears in the email)
2. Endpoint calls `gmail.users.messages.get` to retrieve the full message structure
3. Server-side code loops through MIME parts, matches on filename, extracts the `attachmentId`
4. Endpoint fetches the binary using that attachment ID
5. POSTs to Aframe

This makes Claude's job simpler (no fragile attachment ID parsing required) and more robust.

---

### ✅ Drive Source — Deferred to Separate Tool

Drive support is deferred. The `googleapis` package covers both Gmail and Drive under the same auth client, so adding it later is straightforward. v0.6.0 is Gmail-to-Aframe only.

---

### ✅ Splitting — Definitively v2 (v0.7.0)

Splitting introduces PDF buffering, a mid-stream Claude API call, page boundary mapping, and `pdf-lib` manipulation — significant complexity and latency. The server-to-server pipe must be solid first.

**v0.6.0:** Single clean file, Gmail → Aframe, no splitting.
**v0.7.0:** Intelligent packet splitting with server-side Claude API call and `pdf-lib`.

---

## Endpoint Specification

**Route:** `POST /gmail-to-aframe`

**Request body:**
```json
{
  "gmailMessageId": "string",
  "filename": "string",
  "xactionAttachmentId": integer,
  "completeMode": "DEFAULT | COMPLETE | INCOMPLETE | UNCHANGED"
}
```
`completeMode` is optional, defaults to `DEFAULT`.

**Response:** Aframe `APIXactionAttachmentDto` (same shape as existing attachment tools)

**Error handling:**
- Filename not found in message MIME parts → 404 with descriptive message
- Aframe attachment not FILE type → 422 with clear message
- Gmail auth failure → 401
- Aframe upload failure → surface Aframe error verbatim

---

## MCP Tool Specification

**Tool name:** `transfer_gmail_attachment_to_aframe`

**Parameters:**
- `gmailMessageId` — string, required — Gmail message ID (from `search_threads` or `get_thread` results via Gmail MCP)
- `filename` — string, required — Exact filename of the attachment as it appears in the email
- `xactionAttachmentId` — integer, required — Aframe attachment slot ID
- `completeMode` — string, optional — `DEFAULT | COMPLETE | INCOMPLETE | UNCHANGED`

---

## Dependencies to Add

- `googleapis` — Google API Node client; covers Gmail auth and API calls; same package will cover Drive when that tool is built
- `form-data` — multipart/form-data construction for the Aframe file upload POST (or use the existing `aframeMultipartRequest` helper already in `src/aframe.js` from v0.5.0 — confirm compatibility)

---

## Version Plan

| Version | Scope |
|---|---|
| v0.6.0 | Gmail→Aframe transfer endpoint + `transfer_gmail_attachment_to_aframe` MCP tool |
| v0.7.0 | Intelligent PDF splitting — server-side Claude API call + `pdf-lib` |

---

## Build Session Agenda

One remaining item to confirm at the start of the build session, then proceed directly to handoff authoring:

1. **Google Cloud project** — does one exist, or create new? Confirm project name/ID for the Build Notes below
2. **Author handoffs:**
   - `src/aframe.js` — new `gmailToAframe` helper (Gmail fetch + Aframe multipart POST)
   - `src/index.js` — new Express route `POST /gmail-to-aframe` + new MCP tool registration
   - `package.json` — version bump 0.5.x → 0.6.0, add `googleapis` and `form-data`
   - `docs/CONNECTOR_TOOL_ROADMAP.md` — promote tool to Tier 1, add v0.6.0 entry
3. **One-time auth setup** — walk through OAuth token generation for Railway env vars if not already done before the session

---

## Build Notes (To Fill In During Build Session)

### Google Cloud Setup
- Project: *(TBD — confirm at session start)*
- OAuth client ID stored as Railway env var: `GMAIL_CLIENT_ID`
- OAuth client secret stored as Railway env var: `GMAIL_CLIENT_SECRET`
- Refresh token stored as Railway env var: `GMAIL_REFRESH_TOKEN`

### Gmail API Scope
- `https://www.googleapis.com/auth/gmail.readonly` — minimum required for message read + attachment fetch

### Handoffs Produced
*(To be filled in during build session)*

---

## Open Questions

- [ ] **Google Cloud project** — existing project or create new? *(only remaining open question)*

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

---
title: Lennar Payload Generator — Phase 1 CLI
document_id: SCRIPTS-README-001
version: 0.1
version_date: 2026-10-02
status: Active — Scaffold
project: AAR-TC Lennar Operational Project
---

# Lennar Payload Generator — Phase 1 CLI

Standalone Python CLI that generates a Lennar listing payload from a Cognito Form 17 entry.

## What it does

Reads a Cognito Form 17 entry by ID, joins it against the Lennar Payload Rules + Community Reference DB (both in Airtable), and emits a payload matching the shape in `docs/operational/lennar/Lennar_Payload_Examples.md` — ready to paste into the Lennar/CVRMLS extension side panel.

## Scope

**Phase 1 is standalone CLI.** The script runs on the operator's machine, takes an entry ID at the command line, and prints the generated payload to stdout (or clipboard / file via flags). Phase 2 wraps this same code as an endpoint the extension can call directly; Phase 3 makes a Cognito submission the trigger. Scaffold is intentionally shaped to make the Phase 2 wrap trivial.

See `docs/foundation/Lennar_Restructure_Phase_Tracker.md` for phase status.

## Setup

Requires Python 3.11+.

```bash
cd extension/scripts/
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env with real credentials
```

## Usage

```bash
# Generate from Cognito entry ID
python generate.py --entry-id 42

# Also accepts a pasted Cognito entry URL (extracts the trailing ID)
python generate.py --entry-id https://www.cognitoforms.com/Shared/Form_17/42

# Output options (mutually exclusive)
python generate.py --entry-id 42                    # stdout (default)
python generate.py --entry-id 42 --clipboard        # macOS pbcopy
python generate.py --entry-id 42 --out ./out.json   # write to file
```

## Credentials

- **Airtable PAT** — one Personal Access Token, read-only, scoped to the Lennar base (`app78fMUwDNBHUZ6r`) and the CVRMLS Matrix Fields base.
- **Cognito API Key** — scoped to Form 17.

Both live in `.env` next to `generate.py`. `.env` is git-ignored via the repo-level `.gitignore`. See `.env.example` for the full key list.

## Status

Scaffold only. No Airtable or Cognito API calls wired in yet — running `generate.py` validates the environment and prints a placeholder JSON showing what it would fetch. The Phase 1 build-out replaces the `generate_payload()` placeholder in `generate.py` with the real pipeline (Cognito fetch → community resolution → Payload Rules iteration → DB lookups → payload assembly).

## Related

- `docs/foundation/Payload_Rules_Conventions.md` — script-author conventions for reading the Payload Rules table.
- `docs/operational/lennar/Lennar_Payload_Schema.md` — payload shape reference.
- `docs/operational/lennar/Lennar_Payload_Examples.md` — known-good payloads for diff comparison during Phase 1 build-out.

---

## Phase 2 — FastAPI Endpoint (Railway-Hosted)

The CLI above continues to work for local use. Phase 2 adds `app.py`, a FastAPI
wrapper that exposes the same `generate_payload()` function over two HTTP endpoints,
deployed on Railway and called by the Chrome extension.

### Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Public health check (no auth) |
| GET | `/recent-entries` | Last 5 Form 17 submissions for the extension picker |
| POST | `/generate` | Run the pipeline for a given `entry_id` |

Both authenticated endpoints require an `X-API-Key` header matching the
`API_SHARED_SECRET` environment variable. Generate the secret with:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Request / Response Shapes

`POST /generate`:
```json
// Request
{"entry_id": 18}

// Success response
{"status": "ok", "payload": { /* full Lennar payload */ }, "warnings": []}

// Error response
{"status": "error", "message": "Community not resolved for Entry #18"}
```

`GET /recent-entries`:
```json
// Success response
{
  "status": "ok",
  "entries": [
    {"entry_id": 20, "address": "6136 Hull Street Rd", "submitted_at": "2026-10-05T09:12:00Z"},
    {"entry_id": 18, "address": "3737 Larimar Lane", "submitted_at": "2026-09-17T14:03:00Z"}
  ]
}
```

### Deployment

Railway auto-deploys on every push to the `extension/scripts/` subfolder.
Environment variables are managed in Railway's Variables UI (same keys as `.env`,
plus `API_SHARED_SECRET`). The service listens on port 8080 per `Procfile`.

Public URL: `lennar-payload-script-production.up.railway.app`

### Local Run (Optional)

```bash
cd extension/scripts
source .venv/bin/activate
uvicorn app:app --reload --port 8080
```

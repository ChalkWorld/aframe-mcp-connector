---
title: Cursor Handoff — Phase 2 FastAPI wrapper (multi-file batched)
document_id: HANDOFF-2026-10-08-phase-2-fastapi-wrapper
date: 2026-10-08
project: AAR-TC Aframe Connector
---

# Phase 2 FastAPI Wrapper — Multi-File Batched Handoff

## Why This Is Batched (Protocol Override)

`CURSOR-HANDOFF-PROTOCOL-001` v1.1's default is one file per handoff for isolated, independently re-runnable changes. This handoff deliberately batches six changes across six files because they are one cohesive feature (wrap the existing Phase 1 CLI as a Railway-hosted HTTP endpoint) that leaves the repo in a broken intermediate state if split — a FastAPI app without its dependencies in `requirements.txt` won't boot, a `Procfile` without the app it points at is dead, etc. Same batching pattern used in `HANDOFF-2026-10-02-phase-1-scripts-scaffold.md` and `HANDOFF-2026-10-05-phase-1-pipeline-build.md`, both applied cleanly by Cursor on Sonnet 5 High.

Apply all six changes in order. Commit once at the end. Do not modify anything not listed here.

**Commit message:** `Phase 2: Wrap generate_payload as FastAPI endpoint for Railway deployment`

---

## What This Handoff Does

Adds a FastAPI web app at `extension/scripts/app.py` that exposes the existing `generate_payload()` function (and a new `fetch_recent_entries()` helper) over two HTTP endpoints:

- `GET /recent-entries` — returns the last 5 Form 17 submissions as a small picker list (entry ID + address + submission date/time).
- `POST /generate` — takes `{"entry_id": N}` in the body, runs the full Phase 1 pipeline, returns `{"status": "ok", "payload": {...}, "warnings": [...]}` or `{"status": "error", "message": "..."}`.

Both endpoints require an `X-API-Key` header matching the `API_SHARED_SECRET` environment variable. CORS is enabled so the Chrome extension can call from `chrome-extension://` origins.

The existing CLI in `generate.py` stays fully intact — both the CLI and the FastAPI app call the same core `generate_payload(entry_id)` function.

Railway is already configured (project pointed at `extension/scripts/`, all six env vars set including `API_SHARED_SECRET`, public URL `lennar-payload-script-production.up.railway.app` generated, listening port 8080). Pushing this commit triggers Railway's auto-deploy; the previously-failing deploy will go green.

---

## Change 1 — Add FastAPI + Uvicorn to `requirements.txt`

**Target file:** `extension/scripts/requirements.txt`

**Find:**

```
requests==2.32.*
python-dotenv==1.0.*
```

**Replace with:**

```
requests==2.32.*
python-dotenv==1.0.*
fastapi==0.115.*
uvicorn[standard]==0.32.*
```

---

## Change 2 — Add `API_SHARED_SECRET` to `.env.example`

**Target file:** `extension/scripts/.env.example`

**Add** this block to the end of the file (preserve all existing content exactly):

```
# Shared secret for the FastAPI endpoint. Generate with:
#   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
# The Chrome extension sends this value in the X-API-Key header on every request.
API_SHARED_SECRET=
```

---

## Change 3 — Refactor `generate.py` to expose core as importable functions

**Target file:** `extension/scripts/generate.py`

Two edits to this file. The CLI (`main()` and argparse plumbing) stays entirely intact — these edits only add a new helper function (`fetch_recent_entries`) and ensure `generate_payload` is cleanly importable.

### 3a — Add `fetch_recent_entries()` helper

Locate the existing `generate_payload(entry_id)` function. **Immediately above** `def generate_payload`, add this new function. Match the file's existing style for Cognito API calls (reuse whatever helper or `requests.get` pattern `generate_payload` already uses to call Cognito — do not introduce a new HTTP client pattern).

```python
def fetch_recent_entries(limit: int = 5) -> list[dict]:
    """
    Fetch the N most recent Form 17 submissions for the extension picker.

    Returns a list of dicts: {"entry_id": int, "address": str, "submitted_at": str}
    sorted by submission time, newest first.

    The Submitted view (view ID "17-3") is already sorted by Entry.Number descending
    per the Lennar New Listing Protocol's connector notes, so this calls that view
    with take=limit and transforms each entry's Intake.StreetNumber + Intake.StreetName
    into a display address.

    Entries missing either StreetNumber or StreetName fall back to a "(address unknown — Entry #N)"
    label so the picker always has something to display.

    Cognito API endpoint pattern: GET /forms/{form_id}/entries with view and take query params.
    Reuse the same base URL, auth header, and error handling pattern as the existing
    get-single-entry call inside generate_payload.
    """
    # Implementation: call the Cognito REST API for Form 17's Submitted view (17-3),
    # take=limit, map each entry to the three-key dict above.
    # Entry submission timestamp field in Cognito's response is typically
    # Entry.DateSubmitted — use that if present, otherwise Entry.DateCreated.
    raise NotImplementedError("Implement using the same Cognito API call pattern as generate_payload")
```

**Note to Cursor:** Replace the `raise NotImplementedError(...)` line with the actual implementation, modeled on how `generate_payload` already calls Cognito. The exact endpoint path, auth header, and response shape should mirror the existing call — do not infer from documentation. If the existing code uses a helper like `_cognito_fetch_entry(entry_id)`, consider adding a parallel `_cognito_fetch_view_entries(view_id, take)` helper alongside it rather than inlining the HTTP call.

### 3b — Confirm `generate_payload()` return shape (no code change if already correct)

The FastAPI app imports `generate_payload` and expects it to return a `dict` (the full payload). If the current function already returns the payload dict directly, no change is needed here. If it currently returns `(payload, warnings)` tuple or similar, leave it as-is — the FastAPI app will unpack whatever shape it currently returns.

Confirm (by reading, not editing) and note in the commit if the shape differs from `dict`.

---

## Change 4 — Create `app.py` (new file, FastAPI endpoints)

**Target file:** `extension/scripts/app.py` (NEW)

**Add** this file with the following content:

```python
"""
FastAPI wrapper around the Phase 1 Lennar payload generation pipeline.

Exposes two endpoints:
  GET  /recent-entries   — last 5 Form 17 submissions for the extension picker
  POST /generate         — run the full pipeline for a given entry_id

Both endpoints require an X-API-Key header matching API_SHARED_SECRET.

Deployed on Railway. The Chrome extension calls these endpoints from a
chrome-extension:// origin; CORS is configured accordingly.

The core pipeline lives in generate.py — this module is a thin HTTP wrapper
around generate_payload() and fetch_recent_entries(). The CLI in generate.py
continues to work independently.
"""

import os
import logging
from typing import Optional

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from generate import generate_payload, fetch_recent_entries

load_dotenv()

API_SHARED_SECRET = os.getenv("API_SHARED_SECRET")
if not API_SHARED_SECRET:
    raise RuntimeError(
        "API_SHARED_SECRET environment variable is required. "
        "Set it in Railway Variables (production) or .env (local)."
    )

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)
logger = logging.getLogger("lennar-payload-api")

app = FastAPI(
    title="Lennar Payload API",
    description="Phase 2 HTTP wrapper around the Phase 1 payload generation pipeline.",
    version="0.1.0",
)

# CORS: allow Chrome extension origins. Chrome extensions call from
# chrome-extension://<extension-id>, which does not match a wildcard "*" cleanly
# in all browsers. allow_origin_regex catches any chrome-extension:// URL.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"chrome-extension://.*",
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-Key"],
)


def _check_api_key(x_api_key: Optional[str]) -> None:
    """Reject any request without a matching X-API-Key header."""
    if not x_api_key or x_api_key != API_SHARED_SECRET:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


class GenerateRequest(BaseModel):
    entry_id: int


@app.get("/")
def health_check():
    """Public health check — no auth required. Confirms the app is running."""
    return {"status": "ok", "service": "lennar-payload-api", "version": "0.1.0"}


@app.get("/recent-entries")
def recent_entries(x_api_key: Optional[str] = Header(None, alias="X-API-Key")):
    """
    Return the last 5 Form 17 submissions for the extension picker.

    Response shape:
      {"status": "ok", "entries": [{"entry_id": int, "address": str, "submitted_at": str}, ...]}

    On error:
      {"status": "error", "message": str}
    """
    _check_api_key(x_api_key)
    try:
        entries = fetch_recent_entries(limit=5)
        logger.info("recent-entries returned %d entries", len(entries))
        return {"status": "ok", "entries": entries}
    except Exception as e:
        logger.exception("recent-entries failed")
        return {"status": "error", "message": str(e)}


@app.post("/generate")
def generate(
    body: GenerateRequest,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
):
    """
    Run the Phase 1 pipeline for the given entry_id.

    Request body: {"entry_id": N}

    Response shape (success):
      {"status": "ok", "payload": {...}, "warnings": [...]}

    Response shape (error):
      {"status": "error", "message": str}

    The pipeline itself can raise for several reasons: unresolved community,
    Cognito 404 on the entry, dispatcher RuntimeError on a bad rule. All are
    caught here and surfaced as a structured error response rather than a 500.
    """
    _check_api_key(x_api_key)
    try:
        payload = generate_payload(body.entry_id)
        logger.info("generate succeeded for entry_id=%s", body.entry_id)
        # If generate_payload ever returns (payload, warnings), unpack here instead:
        #   payload, warnings = generate_payload(body.entry_id)
        return {"status": "ok", "payload": payload, "warnings": []}
    except Exception as e:
        logger.exception("generate failed for entry_id=%s", body.entry_id)
        return {"status": "error", "message": str(e)}
```

---

## Change 5 — Create `Procfile` (new file, tells Railway how to start the app)

**Target file:** `extension/scripts/Procfile` (NEW — no extension, exact filename `Procfile`)

**Add** this file with exactly this one line:

```
web: uvicorn app:app --host 0.0.0.0 --port 8080
```

Port 8080 matches what we told Railway when generating the domain. `0.0.0.0` is required so Railway's edge can reach the container (as opposed to `127.0.0.1`, which only accepts local-container traffic).

---

## Change 6 — Update `README.md` to document the FastAPI endpoint

**Target file:** `extension/scripts/README.md`

**Add** this section to the end of the file (preserve all existing content exactly):

```markdown
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
```

---

## Post-Apply Verification

After Cursor commits and pushes:

1. Open Railway dashboard, confirm the new deploy triggered automatically from the push.
2. Wait for build to go green (~1-2 minutes).
3. In a browser, hit `https://lennar-payload-script-production.up.railway.app/` — should return `{"status": "ok", "service": "lennar-payload-api", "version": "0.1.0"}`. This confirms the app booted and `/` (unauthenticated) works.
4. From a terminal, test the authenticated endpoints:

   ```bash
   # Replace <YOUR_SECRET> with the API_SHARED_SECRET value
   curl -H "X-API-Key: <YOUR_SECRET>" \
     https://lennar-payload-script-production.up.railway.app/recent-entries

   curl -X POST \
     -H "X-API-Key: <YOUR_SECRET>" \
     -H "Content-Type: application/json" \
     -d '{"entry_id": 18}' \
     https://lennar-payload-script-production.up.railway.app/generate
   ```

5. The `/generate` call for Entry #18 should return the same payload the CLI produces for Everstone SF Entry #18 (the Phase 1 known-good from the 2026-10-07 validation session).

If any step fails, surface the error — do not attempt silent fixes. The most likely failure modes are:
- Build failure → check Railway's build logs; typically a `requirements.txt` typo or a Python import error in `app.py`.
- Boot failure → check Railway's deploy logs; typically a missing env var (the app raises on `API_SHARED_SECRET` missing by design).
- 401 on authenticated calls → the header name or secret value doesn't match.
- `/recent-entries` returns an error payload → the `fetch_recent_entries` implementation needs a look at the actual Cognito response shape; iterate from there.

---

*AAR-TC Aframe Connector | Phase 2 kickoff | 2026-10-08*

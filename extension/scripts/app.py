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

Per HANDOFF-2026-10-08-phase-2-fastapi-wrapper.md Change 3b: generate_payload()
returns a JSON *string* (its existing CLI output contract), not a dict, and
takes (entry_id, env) — not entry_id alone. This module loads env once at
startup (same load_env() the CLI uses, which validates required vars and
raises loudly on boot if any are missing) and json.loads() the pipeline's
output before handing it back as the "payload" key.
"""

import hmac
import json
import logging
import os
from typing import Optional

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from generate import generate_payload, fetch_recent_entries, load_env

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

# Validates AIRTABLE_PAT, AIRTABLE_LENNAR_BASE_ID, AIRTABLE_CVRMLS_BASE_ID,
# COGNITO_API_KEY, COGNITO_FORM_ID at boot (same check the CLI runs) and
# exits loudly if any are missing, rather than failing confusingly mid-request.
_ENV = load_env()

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
    if not x_api_key or not hmac.compare_digest(x_api_key, API_SHARED_SECRET):
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
        # generate_payload returns a JSON string (its existing CLI output
        # contract) — parse it back to a dict for the response body.
        payload_json = generate_payload(body.entry_id, _ENV)
        payload = json.loads(payload_json)
        logger.info("generate succeeded for entry_id=%s", body.entry_id)
        return {"status": "ok", "payload": payload, "warnings": []}
    except Exception as e:
        logger.exception("generate failed for entry_id=%s", body.entry_id)
        return {"status": "error", "message": str(e)}

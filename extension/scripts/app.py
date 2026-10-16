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

from generate import generate_payload, fetch_recent_entries, load_env, _cognito_fetch_entry, _resolve_community_key
from google_services import drive_service, gmail_service, sheets_service, find_or_create_folder, send_html_email
from prep_email import build_prep_email
from sheets_services import build_listing_row, write_listing_row
from builders import DEFAULT_BUILDER, get_builder_config

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
    builder: Optional[str] = None  # defaults to DEFAULT_BUILDER server-side


@app.get("/")
def health_check():
    """Public health check — no auth required. Confirms the app is running."""
    return {"status": "ok", "service": "lennar-payload-api", "version": "0.1.0"}


@app.get("/recent-entries")
def recent_entries(
    builder: Optional[str] = None,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
):
    """
    Return the last 5 form submissions for the extension picker.

    Query params:
      builder: optional builder slug. Defaults to DEFAULT_BUILDER ("lennar")
               when omitted so pre-Workstream-A clients keep working.

    Response shape:
      {"status": "ok", "entries": [{"entry_id": int, "address": str, "submitted_at": str}, ...]}

    On error:
      {"status": "error", "message": str}
    """
    _check_api_key(x_api_key)
    try:
        resolved_builder = (builder or DEFAULT_BUILDER)
        entries = fetch_recent_entries(limit=5, builder=resolved_builder)
        logger.info("recent-entries builder=%s returned %d entries", resolved_builder, len(entries))
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
        resolved_builder = (body.builder or DEFAULT_BUILDER)
        # generate_payload returns a JSON string (its existing CLI output
        # contract) — parse it back to a dict for the response body.
        payload_json = generate_payload(body.entry_id, _ENV, resolved_builder)
        payload = json.loads(payload_json)
        logger.info("generate succeeded builder=%s entry_id=%s", resolved_builder, body.entry_id)
        return {"status": "ok", "payload": payload, "warnings": []}
    except Exception as e:
        logger.exception("generate failed for entry_id=%s", body.entry_id)
        return {"status": "error", "message": str(e)}


class PrepareListingRequest(BaseModel):
    entry_id: int
    builder: Optional[str] = None  # defaults to DEFAULT_BUILDER server-side


_STREET_SUFFIX_ABBREV = {
    "Drive": "Dr",
    "Road": "Rd",
    "Lane": "Ln",
    "Street": "St",
    "Court": "Ct",
    "Place": "Pl",
    "Boulevard": "Blvd",
    "Terrace": "Ter",
    "Avenue": "Ave",
    "Circle": "Cir",
    "Way": "Way",
    "Trail": "Trl",
    "Parkway": "Pkwy",
}


def _abbreviate_street_name(street_name: str) -> str:
    """Abbreviate the last word of a street name if it's a known suffix.

    "Moonstone Drive" -> "Moonstone Dr"
    "Hull Street Road" -> "Hull Street Rd"
    "Clemet" (no suffix) -> "Clemet"
    """
    parts = street_name.strip().split()
    if not parts:
        return street_name
    last = parts[-1]
    abbrev = _STREET_SUFFIX_ABBREV.get(last)
    if abbrev:
        parts[-1] = abbrev
    return " ".join(parts)


def _build_folder_name(street_number: str, street_name: str) -> str:
    return f"{street_number.strip()} {_abbreviate_street_name(street_name)}"


@app.post("/prepare-listing")
def prepare_listing(
    body: PrepareListingRequest,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
):
    """
    Create (or reuse) a Drive listing folder and send a prep email for the
    given Cognito entry_id.

    Request body: {"entry_id": N}

    Response shape (success):
      {"status": "ok", "folder_name": str, "folder_url": str,
       "folder_reused": bool, "email_sent": bool, "warnings": [...]}

    Response shape (error):
      {"status": "error", "message": str}
    """
    _check_api_key(x_api_key)
    try:
        warnings = []

        resolved_builder = (body.builder or DEFAULT_BUILDER)
        config = get_builder_config(resolved_builder)

        form_id = config["cognito_form_id"]
        entry = _cognito_fetch_entry(form_id, body.entry_id)
        intake = entry.get("Intake", {})
        property_basics = entry.get("PropertyBasics", {})

        street_number = str(intake.get("StreetNumber", "")).strip()
        street_name_raw = str(intake.get("StreetName", "")).strip()
        community = str(intake.get("Community", "")).strip()
        list_price = property_basics.get("ListPrice") or 0

        if not street_number or not street_name_raw:
            return {
                "status": "error",
                "message": f"Entry {body.entry_id} is missing StreetNumber or StreetName; cannot build folder name.",
            }

        folder_name = _build_folder_name(street_number, street_name_raw)
        address = folder_name  # abbreviated form is also what we show throughout

        parent_folder_id = config["drive_properties_folder_id"]

        drive = drive_service()
        listing_folder_id, listing_folder_url, folder_reused = find_or_create_folder(
            drive, parent_folder_id, folder_name
        )
        # Nest a Photos subfolder; reuse-safe via the same helper.
        find_or_create_folder(drive, listing_folder_id, "Photos")

        subject, html = build_prep_email(
            address=address,
            list_price=list_price,
            community=community,
            folder_name=folder_name,
            folder_url=listing_folder_url,
            folder_reused=folder_reused,
            entry_id=body.entry_id,
            builder_display_name=config["display_name"],
        )

        from_address = "agentandrewrich@gmail.com"
        # Plus-alias on the To: so Gmail doesn't flag the message as a
        # self-send and render its "Be careful with this message" banner.
        # Gmail silently strips "+listings" for delivery, so mail still
        # lands at agentandrewrich@gmail.com. The existing Gmail filter
        # (from: + subject match) continues to work unchanged.
        to_address = "agentandrewrich+listings@gmail.com"
        gmail = gmail_service()
        send_html_email(
            gmail,
            to_address=to_address,
            from_address=from_address,
            subject=subject,
            html_body=html,
        )

        # Listings sheet row write (per-builder sheet ID + tab + tab name +
        # target row from the registry).
        try:
            sheet_id = config["sheet_id"]
            tab_id = config["sheet_tab_id"]
            tab_name = config["sheet_tab_name"]
            target_row = config["sheet_target_row"]
            community_display_name = _resolve_community_key(entry, resolved_builder)
            sheets = sheets_service()
            # Pass the already-abbreviated address so the Sheet row A
            # matches the Drive folder name and the email body. The
            # handler's local `address` is set from _build_folder_name()
            # above.
            row = build_listing_row(entry, community_display_name, address=address)
            write_listing_row(
                sheets,
                sheet_id,
                row,
                tab_id=tab_id,
                target_row=target_row,
                sheet_tab_name=tab_name,
            )
            logger.info("Sheet row written builder=%s entry_id=%s", resolved_builder, body.entry_id)
        except Exception:
            logger.exception("Sheet row write failed for entry_id=%s", body.entry_id)
            warnings.append("Sheet row write failed — see Railway logs")

        logger.info("prepare-listing succeeded for entry_id=%s", body.entry_id)
        return {
            "status": "ok",
            "folder_name": folder_name,
            "folder_url": listing_folder_url,
            "folder_reused": folder_reused,
            "email_sent": True,
            "warnings": warnings,
        }

    except Exception as exc:
        logger.exception("prepare-listing failed for entry_id=%s", body.entry_id)
        return {
            "status": "error",
            "message": f"{type(exc).__name__}: {exc}",
        }

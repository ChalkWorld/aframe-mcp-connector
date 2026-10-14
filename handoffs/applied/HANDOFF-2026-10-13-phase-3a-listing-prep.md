---
title: Handoff — Phase 3a: Listing Prep (Drive folder + prep email)
document_id: HANDOFF-2026-10-13-PHASE-3A-LISTING-PREP
date: 2026-10-13
author: Andrew Rich via Claude (AAR-TC Lennar Operational Project)
scope: batched (10 files; Google OAuth + Drive + Gmail integration end-to-end, extension-side button and section)
batched_override_explanation: One coherent feature — the "Generate listing prep" button is the deliverable, and every file touched is either the implementation (requirements.txt, .env.example, app.py, google_services.py, prep_email.py), the operator interface (sidepanel.html, sidepanel.js, manifest.json, Lennar_Extension_Build.md), or the one-time operator-side setup helper (gcp_oauth_helper.py). Partial apply would ship a broken button. Same batched pattern established in Phase 2 pipeline-build (tracker v0.14) and Phase 2 FastAPI wrapper (v0.16).
related: FOUND-PHASE-TRACKER-001 (v0.17), SESSION-HANDOFF-2026-10-09-PHASE-2-EXTENSION-LIVE.md
---

# Handoff — Phase 3a: Listing Prep

**Context.** Phase 3 of the Lennar restructure adds four pieces of surrounding workflow around the Matrix fill: Drive folder, audit row, PandaDoc addendum, email trigger. This handoff ships **Phase 3a** — Drive folder creation + prep email to the operator's inbox — without PandaDoc. PandaDoc automation was scoped out this session when the free-tier recipient cap blocked the three-role template setup. Deferral is a budget call, not an architectural one; the clause composition, merge-field mapping, role structure, and magic-link token design we settled this session all stay valid for Phase 3b whenever the operator decides to pay. Audit row remains deferred per prior tracker versions pending the Lennar Listings table overhaul.

**What Phase 3a ships:** when the operator clicks the new **Generate listing prep** button in the side panel after Loading a Cognito entry, Railway creates (or reuses) a listing folder in the operator's Google Drive at `Lennar/Properties/{address}`, nests a `Photos` subfolder inside, and sends a prep email to the operator's inbox containing the merge values to paste into PandaDoc, a link to the Drive folder, and a visually-stubbed "Send signing request" button that becomes functional when Phase 3b lands.

---

## Operator-side prep — do these BEFORE applying the handoff

**Step 1 — Google Cloud project setup.** In Google Cloud Console (console.cloud.google.com):

1. Create a new project (or reuse one you already have). Name it anything — "Lennar Automation" is a reasonable choice.
2. Enable the **Google Drive API** and **Gmail API** for the project. (APIs & Services → Library → search each → Enable.)
3. Configure the OAuth consent screen: User type = External, publishing status = Testing, add `agentandrewrich@gmail.com` as a test user. Scopes don't need to be added here — the helper script requests them at runtime.
4. Create OAuth 2.0 Client credentials: APIs & Services → Credentials → Create credentials → OAuth client ID → Application type = **Desktop app**. Name it "Lennar Prep". Download the JSON — Google will call it `client_secret_XXXXX.apps.googleusercontent.com.json`.

**Step 2 — Run the OAuth helper locally** to exchange your downloaded client credentials for a refresh token. From `extension/scripts/` with your venv active (same venv you used for Phase 1):

```bash
python gcp_oauth_helper.py path/to/client_secret_XXXXX.apps.googleusercontent.com.json
```

A browser window opens; sign in as `agentandrewrich@gmail.com` and grant Drive + Gmail Send access. The script prints `GCP_CLIENT_ID`, `GCP_CLIENT_SECRET`, and `GCP_REFRESH_TOKEN` values to the terminal. Copy them.

**Step 3 — Find your `Lennar/Properties` folder ID.** Open the Google Drive URL `https://drive.google.com/drive/folders/1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` — that's the ID. (If it's changed since 2026-10-13, open the folder in your browser and copy the ID from the URL.)

**Step 4 — Set four new Railway env vars** in the `lennar-payload-script` service's Variables tab:

- `GCP_CLIENT_ID` — from the helper output
- `GCP_CLIENT_SECRET` — from the helper output
- `GCP_REFRESH_TOKEN` — from the helper output
- `LENNAR_PROPERTIES_FOLDER_ID` — `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B`

Railway redeploys on save. The existing Phase 2 vars (`AIRTABLE_PAT`, `AIRTABLE_LENNAR_BASE_ID`, `AIRTABLE_CVRMLS_BASE_ID`, `COGNITO_API_KEY`, `COGNITO_FORM_ID`, `API_SHARED_SECRET`) all stay.

**You can do Steps 1-4 while Cursor is applying the handoff. They complete independently.**

---

## Changes

### Change 1 — `extension/scripts/requirements.txt`

**Find:**

```
fastapi==0.115.*
uvicorn[standard]==0.32.*
requests==2.32.*
python-dotenv==1.0.*
```

**Replace with:**

```
fastapi==0.115.*
uvicorn[standard]==0.32.*
requests==2.32.*
python-dotenv==1.0.*
google-api-python-client==2.149.*
google-auth==2.35.*
google-auth-oauthlib==1.2.*
google-auth-httplib2==0.2.*
```

### Change 2 — `extension/scripts/.env.example`

**Find** the last line (the `API_SHARED_SECRET=` line) and append the four new vars after it:

**Replace** the full `.env.example` content with:

```
# Phase 1 — Airtable + Cognito
AIRTABLE_PAT=
AIRTABLE_LENNAR_BASE_ID=app78fMUwDNBHUZ6r
AIRTABLE_CVRMLS_BASE_ID=
COGNITO_API_KEY=
COGNITO_FORM_ID=17

# Phase 2 — API auth
API_SHARED_SECRET=

# Phase 3a — Google Drive + Gmail (OAuth refresh token flow)
# Run gcp_oauth_helper.py locally to obtain CLIENT_ID / CLIENT_SECRET / REFRESH_TOKEN.
# LENNAR_PROPERTIES_FOLDER_ID = Google Drive folder ID for Lennar/Properties.
GCP_CLIENT_ID=
GCP_CLIENT_SECRET=
GCP_REFRESH_TOKEN=
LENNAR_PROPERTIES_FOLDER_ID=
```

### Change 3 — NEW file `extension/scripts/gcp_oauth_helper.py`

Standalone utility. Not imported by `app.py` or `generate.py`. Operator runs this once locally to mint a refresh token.

```python
"""One-time helper to produce a Google OAuth refresh token for Phase 3a.

Usage:
    python gcp_oauth_helper.py path/to/client_secret.json

Opens a browser, has the operator grant Drive + Gmail Send scopes to
agentandrewrich@gmail.com, then prints the three values to copy into
Railway env vars: GCP_CLIENT_ID, GCP_CLIENT_SECRET, GCP_REFRESH_TOKEN.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/gmail.send",
]


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python gcp_oauth_helper.py path/to/client_secret.json", file=sys.stderr)
        return 2

    client_secret_path = Path(sys.argv[1])
    if not client_secret_path.is_file():
        print(f"Not a file: {client_secret_path}", file=sys.stderr)
        return 2

    with client_secret_path.open() as f:
        client_config = json.load(f)

    # Desktop app credentials come out of GCP as either an "installed" or "web" shape;
    # InstalledAppFlow accepts the former. Either shape has client_id + client_secret.
    installed = client_config.get("installed") or client_config.get("web")
    if not installed:
        print("Unexpected client_secret.json shape — missing 'installed' or 'web' key.", file=sys.stderr)
        return 2

    client_id = installed["client_id"]
    client_secret = installed["client_secret"]

    flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
    creds = flow.run_local_server(port=0, prompt="consent", access_type="offline")

    if not creds.refresh_token:
        print(
            "No refresh token returned. Revoke the app's access at "
            "https://myaccount.google.com/permissions, then re-run.",
            file=sys.stderr,
        )
        return 1

    print()
    print("=" * 70)
    print("Paste these into Railway env vars for the lennar-payload-script service:")
    print("=" * 70)
    print(f"GCP_CLIENT_ID={client_id}")
    print(f"GCP_CLIENT_SECRET={client_secret}")
    print(f"GCP_REFRESH_TOKEN={creds.refresh_token}")
    print("=" * 70)
    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

### Change 4 — NEW file `extension/scripts/google_services.py`

Google OAuth credential builder plus Drive and Gmail client factories. Also provides `find_or_create_folder` (with skip-if-exists semantics per Phase 3a design) and `send_html_email`.

```python
"""Google Drive and Gmail service builders for Phase 3a.

Uses OAuth 2.0 refresh-token flow — credentials rebuilt from Railway env
vars on each request (lightweight; no persistent token storage needed since
the google-auth library refreshes on-demand against the token endpoint).
"""

from __future__ import annotations

import base64
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Tuple

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/gmail.send",
]

FOLDER_MIME = "application/vnd.google-apps.folder"


def _credentials() -> Credentials:
    client_id = os.environ["GCP_CLIENT_ID"]
    client_secret = os.environ["GCP_CLIENT_SECRET"]
    refresh_token = os.environ["GCP_REFRESH_TOKEN"]
    return Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=SCOPES,
    )


def drive_service():
    return build("drive", "v3", credentials=_credentials(), cache_discovery=False)


def gmail_service():
    return build("gmail", "v1", credentials=_credentials(), cache_discovery=False)


def find_or_create_folder(service, parent_id: str, name: str) -> Tuple[str, str, bool]:
    """Return (folder_id, folder_url, reused) for a folder named `name` under `parent_id`.

    Skip-if-exists: if a non-trashed folder with the same name already exists
    under the parent, reuse it. Otherwise create it.
    """
    # Escape single quotes in name for the Drive query DSL.
    safe_name = name.replace("'", r"\'")
    q = (
        f"'{parent_id}' in parents and "
        f"name = '{safe_name}' and "
        f"mimeType = '{FOLDER_MIME}' and "
        f"trashed = false"
    )
    existing = service.files().list(
        q=q,
        spaces="drive",
        fields="files(id, name, webViewLink)",
        pageSize=10,
    ).execute()

    files = existing.get("files", [])
    if files:
        folder = files[0]
        return (
            folder["id"],
            folder.get("webViewLink") or f"https://drive.google.com/drive/folders/{folder['id']}",
            True,
        )

    created = service.files().create(
        body={
            "name": name,
            "mimeType": FOLDER_MIME,
            "parents": [parent_id],
        },
        fields="id, webViewLink",
    ).execute()
    return (
        created["id"],
        created.get("webViewLink") or f"https://drive.google.com/drive/folders/{created['id']}",
        False,
    )


def send_html_email(service, to_address: str, from_address: str, subject: str, html_body: str) -> str:
    """Send an HTML email via Gmail. Returns the message id."""
    message = MIMEMultipart("alternative")
    message["to"] = to_address
    message["from"] = from_address
    message["subject"] = subject
    message.attach(MIMEText(html_body, "html"))
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    sent = service.users().messages().send(userId="me", body={"raw": raw}).execute()
    return sent["id"]
```

### Change 5 — NEW file `extension/scripts/prep_email.py`

Builds the prep email body. Composes the Composed Clause string from the three merge values so the operator can paste it into PandaDoc without reconstructing. Includes the visually-stubbed signing button.

```python
"""Prep email composer for Phase 3a.

Produces (subject, html_body) for the listing-prep email sent to the
operator's inbox after Drive folder creation.

The 'Send signing request' button is intentionally a <span> styled to look
like a disabled button — Phase 3b replaces the <span> with an <a href=...>
pointing at a Railway magic-link endpoint. Nothing else about the email
needs to change in Phase 3b.
"""

from __future__ import annotations


COMPOSED_CLAUSE_TEMPLATE = (
    "This addendum to the Master Listing Agreement serves as input for "
    "the following address - {address} at ${price:,.0f} in the "
    "{community} community."
)


def _format_price(list_price) -> str:
    """Format a numeric list price with a leading $ and thousands separators."""
    try:
        n = float(list_price)
    except (TypeError, ValueError):
        return str(list_price)
    return f"${n:,.0f}"


def build_composed_clause(address: str, list_price, community: str) -> str:
    try:
        price_num = float(list_price)
    except (TypeError, ValueError):
        price_num = 0
    return COMPOSED_CLAUSE_TEMPLATE.format(
        address=address,
        price=price_num,
        community=community,
    )


def build_prep_email(
    *,
    address: str,
    list_price,
    community: str,
    folder_name: str,
    folder_url: str,
    folder_reused: bool,
    entry_id: int,
) -> tuple[str, str]:
    """Return (subject, html_body) for the prep email."""
    subject = f"Listing prep: {address}"
    price_str = _format_price(list_price)
    composed_clause = build_composed_clause(address, list_price, community)
    reuse_note = (
        '<p style="color:#8a6d3b;font-size:13px;margin:12px 0 0;">'
        f'Note: the Drive folder for {address} already existed and was reused.'
        '</p>'
    ) if folder_reused else ""

    html = f"""\
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#212529;max-width:560px;">
  <p>Listing prep is ready for <strong>{address}</strong>.</p>

  <p style="margin-top:20px;"><strong>Paste these into PandaDoc when you create the addendum:</strong></p>
  <ul style="line-height:1.6;">
    <li><strong>Property Address:</strong> {address}</li>
    <li><strong>Price:</strong> {price_str}</li>
    <li><strong>Community:</strong> {community}</li>
  </ul>

  <p style="margin-top:20px;"><strong>Composed Clause (paste into PandaDoc):</strong></p>
  <blockquote style="border-left:3px solid #adb5bd;padding:4px 0 4px 12px;margin:4px 0 0 0;color:#495057;font-style:italic;">
    {composed_clause}
  </blockquote>

  <p style="margin-top:24px;">
    <a href="{folder_url}" style="color:#0d6efd;text-decoration:underline;">Drive folder: {folder_name}</a>
    <span style="color:#6c757d;"> · Cognito entry #{entry_id}</span>
  </p>

  {reuse_note}

  <p style="margin-top:32px;">
    <span style="display:inline-block;padding:10px 18px;background:#e9ecef;color:#6c757d;border:1px solid #ced4da;border-radius:4px;font-weight:500;cursor:not-allowed;">Send signing request (coming soon)</span>
  </p>

  <p style="margin-top:24px;font-size:12px;color:#868e96;">
    Generated by the Lennar extension. Reply to this email to leave yourself a note.
  </p>
</div>
"""
    return subject, html
```

### Change 6 — `extension/scripts/app.py`

Add a `/prepare-listing` endpoint parallel to `/generate`. It fetches the single Cognito entry (reusing the existing single-entry Cognito fetch pattern), extracts the fields needed for folder naming + email composition, creates/reuses the Drive folder, creates the Photos subfolder if missing, sends the email, and returns a wrapped envelope.

**Find** the imports block at the top of `app.py`:

```python
import json
import os
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from generate import generate_payload, fetch_recent_entries, _cognito_get_entry
```

(If the import of `_cognito_get_entry` or an equivalent isn't currently present as shown, pull in the actual helper used by `generate_payload` for single-entry fetches — do not duplicate the fetch logic.)

**Replace with:**

```python
import json
import os
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from generate import generate_payload, fetch_recent_entries, _cognito_get_entry
from google_services import drive_service, gmail_service, find_or_create_folder, send_html_email
from prep_email import build_prep_email
```

**Find** the existing `POST /generate` route handler. **Append** the new route handler after it:

```python
class PrepareListingRequest(BaseModel):
    entry_id: int


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
def prepare_listing(req: PrepareListingRequest, x_api_key: str = Header(None)):
    if x_api_key != API_SHARED_SECRET:
        raise HTTPException(status_code=401, detail="Invalid API key")

    try:
        entry = _cognito_get_entry(req.entry_id)
        intake = entry.get("Intake", {})
        property_basics = entry.get("PropertyBasics", {})

        street_number = str(intake.get("StreetNumber", "")).strip()
        street_name_raw = str(intake.get("StreetName", "")).strip()
        community = str(intake.get("Community", "")).strip()
        list_price = property_basics.get("ListPrice") or 0

        if not street_number or not street_name_raw:
            return {
                "status": "error",
                "message": f"Entry {req.entry_id} is missing StreetNumber or StreetName; cannot build folder name.",
            }

        folder_name = _build_folder_name(street_number, street_name_raw)
        address = folder_name  # abbreviated form is also what we show throughout

        parent_folder_id = os.environ["LENNAR_PROPERTIES_FOLDER_ID"]

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
            entry_id=req.entry_id,
        )

        operator_email = "agentandrewrich@gmail.com"
        gmail = gmail_service()
        send_html_email(
            gmail,
            to_address=operator_email,
            from_address=operator_email,
            subject=subject,
            html_body=html,
        )

        return {
            "status": "ok",
            "folder_name": folder_name,
            "folder_url": listing_folder_url,
            "folder_reused": folder_reused,
            "email_sent": True,
            "warnings": [],
        }

    except Exception as exc:
        return {
            "status": "error",
            "message": f"{type(exc).__name__}: {exc}",
        }
```

Notes for the applier:
- `_cognito_get_entry` is the helper `generate_payload` already uses for single-entry fetches via the REST API. If the real name differs (e.g. `_cognito_fetch_entry`), use the real name — do not create a duplicate.
- `API_SHARED_SECRET` is already a module-level constant in `app.py` from Phase 2; reuse that same reference.
- The sender/recipient addresses are hardcoded `agentandrewrich@gmail.com` — operator-config, parameterize later if a second builder joins.

### Change 7 — `extension/manifest.json`

Bump version to `0.4.0`. Railway `host_permissions` already present from Phase 2; no new permissions needed.

**Find:**

```json
"version": "0.3.0",
```

**Replace with:**

```json
"version": "0.4.0",
```

### Change 8 — `extension/sidepanel.html`

Add the Phase 3 section between the `.picker` div and the `.clear-row` div. Add the new CSS block to the `<style>` block.

**Find** this run of CSS (the end of the Phase 2 picker styles, right before the Clear-button styles):

```css
  .picker-footer .refresh-btn:hover { text-decoration: underline; }
  .picker-footer.error { color: #721c24; }

  /* Clear button above textarea (Phase 2) */
```

**Replace with:**

```css
  .picker-footer .refresh-btn:hover { text-decoration: underline; }
  .picker-footer.error { color: #721c24; }

  /* Phase 3a — Generate listing prep */
  .phase3 { padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
  .phase3-btn { width: 100%; padding: 7px 12px; font-size: 12px; font-family: inherit; border: 1px solid #d1d5db; background: #f3f4f6; border-radius: 4px; cursor: pointer; color: #111; text-align: center; font-weight: 500; }
  .phase3-btn:disabled { opacity: 0.4; cursor: default; }
  .phase3-btn.busy { background: #e9ecef; cursor: wait; }
  .phase3-status { margin-top: 6px; font-size: 11px; color: #6b7280; line-height: 1.45; }
  .phase3-status.success { color: #155724; }
  .phase3-status.success a { color: #155724; text-decoration: underline; }
  .phase3-status.error { color: #721c24; }
  .phase3-status .success-row { display: flex; align-items: center; gap: 6px; padding: 4px 0; }
  .phase3-status .check { font-weight: 700; }
  .phase3-status .notice { display: block; font-style: italic; margin-top: 2px; color: #856404; }

  /* Clear button above textarea (Phase 2) */
```

**Find** the body section where the picker closes and the clear-row begins:

```html
  <div id="picker" class="picker">
    <div class="picker-row">
      <select id="entrySelect" aria-label="Select Cognito entry">
        <option>Loading recent entries…</option>
      </select>
      <button id="loadBtn" type="button" disabled>Load</button>
    </div>
    <div id="pickerFooter" class="picker-footer">
      <button id="refreshBtn" type="button" class="refresh-btn">⟳ Refresh</button>
      <span id="pickerStatus"></span>
    </div>
  </div>

  <div class="clear-row">
```

**Replace with:**

```html
  <div id="picker" class="picker">
    <div class="picker-row">
      <select id="entrySelect" aria-label="Select Cognito entry">
        <option>Loading recent entries…</option>
      </select>
      <button id="loadBtn" type="button" disabled>Load</button>
    </div>
    <div id="pickerFooter" class="picker-footer">
      <button id="refreshBtn" type="button" class="refresh-btn">⟳ Refresh</button>
      <span id="pickerStatus"></span>
    </div>
  </div>

  <div id="phase3" class="phase3">
    <button id="prepBtn" class="phase3-btn" type="button" disabled>Generate listing prep</button>
    <div id="phase3Status" class="phase3-status">Load a Cognito entry first.</div>
  </div>

  <div class="clear-row">
```

### Change 9 — `extension/sidepanel.js`

Add Phase 3a wiring. Preserve all existing Phase 2 behavior verbatim. The important shape is:

- Phase 3 button is **disabled** until the payload textarea has content.
- When the Load button successfully populates the textarea, re-render the Phase 3 state to enabled.
- When Phase 3 button is clicked, POST `/prepare-listing` with `{"entry_id": <id>}` where `<id>` is the entry currently selected in the picker.
- During the fetch, button shows "Generating…" with `.busy` class, status shows "Creating Drive folder, sending prep email…".
- On success envelope: button returns to idle label, status shows the folder link + "Prep email sent" check row + the reuse notice if `folder_reused` is true.
- On error envelope or network failure: button returns to idle label, status shows the error, `console.error` logs full detail.
- The existing Clear button handler must additionally reset the Phase 3 status to its default "Load a Cognito entry first." text and clear any `.success`/`.error` state classes.

**Specific changes to make inside `sidepanel.js`:**

**(a)** At the top of the file, next to the other `document.getElementById(...)` references for picker/clear/textarea/etc., add:

```javascript
const prepBtn = document.getElementById('prepBtn');
const phase3StatusEl = document.getElementById('phase3Status');
```

**(b)** Add this helper block near the other picker helpers (`setPickerLoading`, `setPickerError`, etc.):

```javascript
function setPhase3Idle() {
  prepBtn.disabled = !payloadEl.value;
  prepBtn.classList.remove('busy');
  prepBtn.textContent = 'Generate listing prep';
  phase3StatusEl.className = 'phase3-status';
  phase3StatusEl.textContent = payloadEl.value
    ? ''
    : 'Load a Cognito entry first.';
}

function setPhase3Busy() {
  prepBtn.disabled = true;
  prepBtn.classList.add('busy');
  prepBtn.textContent = 'Generating…';
  phase3StatusEl.className = 'phase3-status';
  phase3StatusEl.textContent = 'Creating Drive folder, sending prep email…';
}

function setPhase3Success({ folder_name, folder_url, folder_reused }) {
  prepBtn.disabled = false;
  prepBtn.classList.remove('busy');
  prepBtn.textContent = 'Generate listing prep';
  phase3StatusEl.className = 'phase3-status success';
  phase3StatusEl.innerHTML = '';

  const folderRow = document.createElement('div');
  folderRow.className = 'success-row';
  folderRow.innerHTML =
    '<span class="check">✓</span> Drive folder: ' +
    `<a href="${folder_url}" target="_blank" rel="noopener noreferrer">${folder_name}</a>`;
  phase3StatusEl.appendChild(folderRow);

  const emailRow = document.createElement('div');
  emailRow.className = 'success-row';
  emailRow.innerHTML = '<span class="check">✓</span> Prep email sent to your inbox';
  phase3StatusEl.appendChild(emailRow);

  if (folder_reused) {
    const notice = document.createElement('span');
    notice.className = 'notice';
    notice.textContent = 'Folder already existed — reused it.';
    phase3StatusEl.appendChild(notice);
  }
}

function setPhase3Error(message) {
  prepBtn.disabled = !payloadEl.value;
  prepBtn.classList.remove('busy');
  prepBtn.textContent = 'Generate listing prep';
  phase3StatusEl.className = 'phase3-status error';
  phase3StatusEl.textContent = message;
}
```

**(c)** Add this fetch function next to `generatePayload`:

```javascript
async function prepareListingForEntry(entryId) {
  const resp = await fetch(`${window.LENNAR_PAYLOAD_CONFIG.RAILWAY_BASE_URL}/prepare-listing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': window.LENNAR_PAYLOAD_CONFIG.API_SHARED_SECRET,
    },
    body: JSON.stringify({ entry_id: entryId }),
  });
  const body = await resp.json();
  if (!resp.ok || body.status !== 'ok') {
    const msg = body?.message || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return body;
}
```

**(d)** Wire the Phase 3 button click handler. Near the Load-button click handler:

```javascript
prepBtn.addEventListener('click', async () => {
  const entryId = Number(entrySelect.value);
  if (!entryId) {
    setPhase3Error('No entry selected.');
    return;
  }
  setPhase3Busy();
  try {
    const result = await prepareListingForEntry(entryId);
    setPhase3Success(result);
  } catch (err) {
    console.error('Phase 3 prepare-listing failed:', err);
    const msg = err?.message || 'Network error — see console for details.';
    setPhase3Error(`Prep failed: ${msg}`);
  }
});
```

**(e)** After the Load handler successfully puts a payload into the textarea, call `setPhase3Idle()` so the Phase 3 button enables. Example — find the Load click handler's success path and add `setPhase3Idle();` after it writes to `payloadEl.value`.

**(f)** In the Clear button handler, after the existing resets (textarea, storage, tab-status dots), add:

```javascript
setPhase3Idle();
```

**(g)** At the bottom of the init block (after the existing panel-open setup), call `setPhase3Idle()` once so the initial disabled/hint state is set.

### Change 10 — `extension/Lennar_Extension_Build.md`

Append this section just before the existing Tab Detection section (same insertion pattern as Phase 2):

```markdown
## Phase 3a Build Status — October 2026

**Status: live.** Side panel adds a Generate listing prep button between the picker and the Clear row. One click fires `POST /prepare-listing` on the Railway service; Railway creates (or reuses) a Drive folder at `Lennar/Properties/{abbreviated address}` with a `Photos` subfolder nested inside, then sends a prep email to agentandrewrich@gmail.com with the three merge values (Property Address, Price, Community), the Composed Clause string ready to paste into PandaDoc, a link to the Drive folder, and a visually-stubbed "Send signing request" button. The stub becomes functional when Phase 3b lands.

Env vars added for Phase 3a: `GCP_CLIENT_ID`, `GCP_CLIENT_SECRET`, `GCP_REFRESH_TOKEN`, `LENNAR_PROPERTIES_FOLDER_ID`. OAuth scopes: Drive full + Gmail send.

Phase 3b (deferred — PandaDoc create+send automation, magic-link token, /send-signing endpoint) is a small additive handoff when the operator decides to pay for PandaDoc Starter.
```

---

## Post-apply verification

**Before you can test anything, the four operator-side prep steps at the top of this handoff must be complete and the four Railway env vars must be live.** If Railway shows the new env vars and `/` still returns a healthy response, the deploy picked them up.

1. **Env var smoke check.** `curl` the Railway health endpoint:
   ```
   curl https://lennar-payload-script-production.up.railway.app/
   ```
   Confirms the service is still up after the deploy. Expected: `{"status":"ok","service":"lennar-payload-api","version":"0.1.0"}` (the version string hasn't been bumped; that's fine).

2. **Phase 3 endpoint smoke check** via curl against Entry #18 (Everstone Larimar — already validated for Phase 2):
   ```
   curl -X POST https://lennar-payload-script-production.up.railway.app/prepare-listing \
     -H "Content-Type: application/json" \
     -H "X-API-Key: <your API_SHARED_SECRET>" \
     -d '{"entry_id": 18}'
   ```
   Expected: `{"status":"ok","folder_name":"3737 Larimar Ln","folder_url":"https://drive.google.com/...","folder_reused":false,"email_sent":true,"warnings":[]}` (or `folder_reused:true` if you already created that folder manually).

3. **Email receipt check.** Open your inbox. Expected: an email with subject `Listing prep: 3737 Larimar Ln`, containing the three merge values (Address: 3737 Larimar Ln, Price: $434,990, Community: Everstone), the Composed Clause text, a clickable link to the newly created or reused Drive folder, and a visually-stubbed "Send signing request" button.

4. **Drive folder check.** In Google Drive under `Lennar/Properties`, confirm `3737 Larimar Ln` exists with a `Photos` subfolder inside.

5. **Idempotency check.** Fire the same curl command a second time. Expected: `folder_reused:true` in the response, a second email arrives with the italic reuse notice, no duplicate folders created.

6. **Extension end-to-end.** Reload the extension (new manifest version `0.4.0`). Pick an entry → Load → confirm the Phase 3 button enables → click Generate listing prep → confirm the button goes busy → confirm success state renders inline with folder link + email check + any reuse notice. Verify Clear resets the Phase 3 status back to "Load a Cognito entry first."

7. **Fail-loud regression check.** Temporarily blank out `LENNAR_PROPERTIES_FOLDER_ID` in Railway and redeploy. Fire the extension. Confirm the error renders inline in the Phase 3 status, with the full error detail in the browser console. Restore the env var afterward.

## Commit block

```bash
git add extension/scripts/requirements.txt extension/scripts/.env.example \
        extension/scripts/gcp_oauth_helper.py extension/scripts/google_services.py \
        extension/scripts/prep_email.py extension/scripts/app.py \
        extension/manifest.json extension/sidepanel.html extension/sidepanel.js \
        extension/Lennar_Extension_Build.md
git commit -m "feat(phase-3a): Generate listing prep — Drive folder + prep email

Adds a 'Generate listing prep' button to the extension side panel. On click
Railway creates (or reuses, skip-if-exists) a Drive folder at
Lennar/Properties/{abbreviated address} with a nested Photos subfolder,
then emails the operator a listing-prep summary — Property Address, Price,
Community, pre-composed PandaDoc clause, link to the Drive folder, and a
visually-stubbed 'Send signing request' button that Phase 3b wires up to a
magic-link Railway endpoint when PandaDoc automation is ready.

Phase 3a scope only — PandaDoc automation is deferred (free-tier recipient
cap blocks the three-role template; operator will decide whether to pay for
Starter later). Audit row remains deferred pending Lennar Listings table
overhaul.

New endpoint: POST /prepare-listing with {entry_id}; wrapped envelope
response, X-API-Key auth, same pattern as /generate.

New env vars: GCP_CLIENT_ID, GCP_CLIENT_SECRET, GCP_REFRESH_TOKEN,
LENNAR_PROPERTIES_FOLDER_ID. OAuth scopes: Drive full + Gmail send.
gcp_oauth_helper.py is a one-time local utility operators run to mint
the refresh token.

Refs: Phase Tracker v0.17, Phase 3 charter scope.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014uarCbd7ciAXjcQZLyhszZ"
git push
mv handoffs/incoming/HANDOFF-2026-10-13-phase-3a-listing-prep.md handoffs/applied/
git add handoffs/
git commit -m "chore(handoffs): move phase-3a-listing-prep to applied

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014uarCbd7ciAXjcQZLyhszZ"
git push
```

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

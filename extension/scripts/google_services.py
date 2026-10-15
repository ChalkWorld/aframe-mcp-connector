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
    "https://www.googleapis.com/auth/spreadsheets",  # Phase 3a.1
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


def sheets_service():
    """Build the Google Sheets API service using the shared OAuth credentials.

    Phase 3a.1 — mirrors drive_service()/gmail_service() rather than taking a
    credentials param, since _credentials() is rebuilt fresh per request here.
    """
    return build("sheets", "v4", credentials=_credentials(), cache_discovery=False)


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

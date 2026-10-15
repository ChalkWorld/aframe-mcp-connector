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
    "https://www.googleapis.com/auth/spreadsheets",  # Phase 3a.1
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

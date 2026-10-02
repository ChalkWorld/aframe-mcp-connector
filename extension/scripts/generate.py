#!/usr/bin/env python3
"""
Lennar Payload Generator — Phase 1 CLI

Reads a Cognito Form 17 entry by ID, joins it against the Lennar Payload
Rules + Community Reference DB in Airtable, and emits a payload matching
Lennar_Payload_Examples.md shape.

Phase 1 scope: standalone CLI. Phase 2 wraps this as an endpoint; Phase 3
triggers from a Cognito submission webhook. Scaffold is intentionally
shaped to make the Phase 2 wrap trivial.

See extension/scripts/README.md for setup and usage.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv


# -------- CLI --------

def parse_entry_id(raw: str) -> int:
    """Accept either a bare integer or a Cognito entry URL. Return int."""
    raw = raw.strip()
    if raw.isdigit():
        return int(raw)
    # Match a trailing integer in a Cognito entry URL,
    # e.g. https://www.cognitoforms.com/Shared/Form_17/42
    match = re.search(r"/(\d+)/?$", raw)
    if match:
        return int(match.group(1))
    raise argparse.ArgumentTypeError(
        f"Could not parse an entry ID from {raw!r}. "
        f"Pass an integer or a Cognito entry URL ending in /<id>."
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="generate.py",
        description=(
            "Generate a Lennar listing payload from a Cognito Form 17 entry."
        ),
    )
    parser.add_argument(
        "--entry-id",
        type=parse_entry_id,
        required=True,
        help="Cognito entry ID (integer) or a pasted Cognito entry URL.",
    )
    output = parser.add_mutually_exclusive_group()
    output.add_argument(
        "--clipboard",
        action="store_true",
        help="Copy the generated payload to the macOS clipboard (pbcopy).",
    )
    output.add_argument(
        "--out",
        type=Path,
        metavar="PATH",
        help="Write the generated payload to this file.",
    )
    return parser


# -------- Env loading & validation --------

REQUIRED_ENV_VARS = (
    "AIRTABLE_PAT",
    "AIRTABLE_LENNAR_BASE_ID",
    "AIRTABLE_CVRMLS_BASE_ID",
    "COGNITO_API_KEY",
    "COGNITO_FORM_ID",
)


def load_env() -> dict[str, str]:
    """Load .env next to this script. Return a dict of required vars."""
    script_dir = Path(__file__).resolve().parent
    load_dotenv(script_dir / ".env")

    missing = [v for v in REQUIRED_ENV_VARS if not os.getenv(v)]
    if missing:
        sys.exit(
            f"Missing required environment variables: {', '.join(missing)}.\n"
            f"Copy .env.example to .env and fill in values."
        )

    return {v: os.environ[v] for v in REQUIRED_ENV_VARS}


# -------- Output --------

def emit(payload: str, args: argparse.Namespace) -> None:
    """Route the generated payload to stdout, clipboard, or file."""
    if args.clipboard:
        subprocess.run(["pbcopy"], input=payload, text=True, check=True)
        print("Payload copied to clipboard.", file=sys.stderr)
    elif args.out:
        args.out.write_text(payload)
        print(f"Payload written to {args.out}", file=sys.stderr)
    else:
        print(payload)


# -------- Payload generation (scaffold placeholder) --------

def generate_payload(entry_id: int, env: dict[str, str]) -> str:
    """
    Build the payload for the given Cognito entry.

    Phase 1 build-out replaces this placeholder with the real pipeline:
      1. Fetch Cognito entry via Form 17 API.
      2. Resolve community key (<Community> <TH|SF>) and look up Community
         Reference DB row — fail loudly if unresolved (convention #6).
      3. Read Payload Rules table, iterate rules, apply Source Type logic:
         STATIC, COGNITO, COMMUNITY_DB, DERIVED, MANUAL_ENTRY.
      4. Honor Transform / Logic column per convention #3.
      5. Assemble the payload matching Lennar_Payload_Examples.md shape.

    Returns the payload as a JSON string.
    """
    placeholder = {
        "_scaffold": True,
        "_message": (
            "Phase 1 scaffold — Cognito/Airtable calls not yet wired. "
            "Env validation passed; would fetch Cognito entry "
            f"{entry_id} from Form {env['COGNITO_FORM_ID']}."
        ),
        "entry_id": entry_id,
    }
    return json.dumps(placeholder, indent=2)


# -------- Main --------

def main() -> int:
    args = build_parser().parse_args()
    env = load_env()
    payload = generate_payload(args.entry_id, env)
    emit(payload, args)
    return 0


if __name__ == "__main__":
    sys.exit(main())

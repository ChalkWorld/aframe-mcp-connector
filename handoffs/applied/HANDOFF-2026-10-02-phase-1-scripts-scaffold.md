---
title: Cursor Handoff — Phase 1 Payload Generator Scaffold (extension/scripts/)
document_id: HANDOFF-2026-10-02-phase-1-scripts-scaffold
date: 2026-10-02
project: AAR-TC Lennar Operational Project
---

Apply the changes below surgically to the repo. This handoff stands up the Phase 1 Lennar Payload Generator CLI as a new `extension/scripts/` subfolder containing a Python scaffold (README, env template, requirements, and a working CLI shell with argparse + env loading), then updates `REPO_STRUCTURE.md` to document the subfolder.

This handoff is batched intentionally — it creates five new files in one subfolder and makes two surgical edits to `REPO_STRUCTURE.md`. The usual one-file-per-handoff rule is overridden here because the files are a single logical scaffold and reviewing them together is clearer than reviewing them separately.

Do not modify anything not listed here.

Note on folders: Git tracks files, not directories. The `extension/scripts/` folder does not currently exist and is created implicitly by the file creations in Changes 1–5 — no separate folder-creation step is required.

---

## Change 1 — Create `extension/scripts/README.md`

New file. Explains what the Phase 1 CLI is, its scope, and how to set it up and run it. Doc ID `SCRIPTS-README-001` keeps the subfolder's reference doc discoverable without claiming the `FOUND-` prefix (foundation-layer governance docs are a different concern from a code-local README).

**Add:** create a new file at `extension/scripts/README.md` with the exact content below.

~~~markdown
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
~~~

---

## Change 2 — Create `extension/scripts/.env.example`

New file. Template for the `.env` the operator will create locally. Documents every required env var with where to get the value, parallel to the top-level `.env.example` pattern already in the repo.

**Add:** create a new file at `extension/scripts/.env.example` with the exact content below.

```
# ============================================================
# Lennar Payload Generator — environment configuration
# Copy to .env in the same directory and fill in real values.
# .env is git-ignored via the repo-level .gitignore.
# ============================================================

# -------- Airtable --------
# Personal Access Token (PAT) with read scope on both bases below.
# Create at: https://airtable.com/create/tokens
AIRTABLE_PAT=pat_your_token_here

# Lennar base — holds Payload Rules, Cognito Fields, Source Types,
# Community Reference DB.
AIRTABLE_LENNAR_BASE_ID=app78fMUwDNBHUZ6r

# CVRMLS Matrix Fields base — holds Residential Input Form,
# Field Options, Cascade Options. Read-only reference.
AIRTABLE_CVRMLS_BASE_ID=app_your_cvrmls_base_id_here

# -------- Cognito Forms --------
# API key scoped to Form 17 (Lennar New Listing Intake).
# Create at: https://www.cognitoforms.com/ → Account → Integrations → API
COGNITO_API_KEY=your_cognito_key_here

# Form ID for Form 17.
COGNITO_FORM_ID=17
```

---

## Change 3 — Create `extension/scripts/requirements.txt`

New file. Pins the two Python dependencies the scaffold uses. Compatible-release pins (`==2.32.*`) allow patch updates without surprise majors.

**Add:** create a new file at `extension/scripts/requirements.txt` with the exact content below.

```
requests==2.32.*
python-dotenv==1.0.*
```

---

## Change 4 — Create `extension/scripts/generate.py`

New file. Working CLI shell with argument parsing, URL-or-ID entry parsing, `.env` loading, env validation, and output routing to stdout / clipboard / file. The payload-generation body is a labeled placeholder that returns a stub JSON so the end-to-end CLI shape is testable immediately; the real pipeline replaces that function in the next session.

**Add:** create a new file at `extension/scripts/generate.py` with the exact content below.

~~~python
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
~~~

---

## Change 5 — Create `extension/scripts/.gitkeep`

New empty file. Guarantees the `extension/scripts/` directory is tracked by git even if all other files in it were ever removed, and makes the subfolder visible in a bare `git clone` before `pip install` creates `.venv/` or an operator creates `.env`. Harmless and conventional.

**Add:** create a new empty file at `extension/scripts/.gitkeep`. Content: empty (zero bytes).

---

## Change 6 — Update `REPO_STRUCTURE.md` "Last Updated" line

Target file: `REPO_STRUCTURE.md`

**Find:**

```markdown
**Last Updated:** September 17, 2026 (added `/docs/foundation/` to the tree diagram and named `Payload_Rules_Conventions.md`)
```

**Replace with:**

```markdown
**Last Updated:** October 2, 2026 (added `extension/scripts/` for the Phase 1 Lennar Payload Generator CLI)
```

---

## Change 7 — Update `REPO_STRUCTURE.md` `extension/` section to describe `scripts/`

Target file: `REPO_STRUCTURE.md`

Replaces the existing `## `extension/`` section with an updated version that describes the new `scripts/` subfolder alongside the existing extension-POC description. Preserves the existing "internal layout finalized during build" paragraph for the extension itself.

**Find:**

```markdown
## `extension/`

Chrome extension (Manifest V3) — POC consolidating the bookmarklet-per-tab system into one tool. Auto-detects the current Matrix tab and fills its fields on click, replacing the need to click a separate bookmark per tab. Scoped to Lennar/CVRMLS only for the POC — the `payload.mls` / `payload.builder` envelope keys and multi-MLS/multi-builder routing are a later-phase decision, not built into the POC.

Internal layout (manifest, content scripts, popup, etc.) is finalized during the build session — this entry reserves the top-level location and scope statement ahead of that work.
```

**Replace with:**

```markdown
## `extension/`

Chrome extension (Manifest V3) — POC consolidating the bookmarklet-per-tab system into one tool. Auto-detects the current Matrix tab and fills its fields on click, replacing the need to click a separate bookmark per tab. Scoped to Lennar/CVRMLS only for the POC — the `payload.mls` / `payload.builder` envelope keys and multi-MLS/multi-builder routing are a later-phase decision, not built into the POC.

Internal layout (manifest, content scripts, popup, etc.) is finalized during the build session — this entry reserves the top-level location and scope statement ahead of that work.

### `extension/scripts/`

Phase 1 Lennar Payload Generator — a standalone Python CLI (`generate.py`) that reads a Cognito Form 17 entry, joins it against the Lennar Payload Rules + Community Reference DB in Airtable, and emits a payload matching `docs/operational/lennar/Lennar_Payload_Examples.md`. See `extension/scripts/README.md` (`SCRIPTS-README-001`) for setup and usage. Co-located with the extension because Phase 2 wraps this same code as an endpoint the extension's "Generate from Cognito Entry" surface will call — the two pieces belong in one repo.

Phase status: scaffold landed, pipeline build-out follows. See `docs/foundation/Lennar_Restructure_Phase_Tracker.md`.
```

---

No other changes to `REPO_STRUCTURE.md`. No other files touched.

---

## Commit

Commit all seven changes as a single commit.

**Commit message:**

```
Scaffold Phase 1 Lennar Payload Generator CLI (extension/scripts/)

Stands up extension/scripts/ as the home for the Phase 1 standalone
Python CLI that generates Lennar payloads from Cognito Form 17 entries.

New files:
- extension/scripts/README.md (SCRIPTS-README-001 v0.1) — setup, usage,
  scope statement
- extension/scripts/.env.example — Airtable PAT + Cognito API key
  template
- extension/scripts/requirements.txt — requests, python-dotenv
- extension/scripts/generate.py — working CLI shell (argparse, env
  loading and validation, stdout/clipboard/file output). Payload
  generation body is a labeled placeholder; real pipeline follows next
  session.
- extension/scripts/.gitkeep — tracks the empty-of-code directory

REPO_STRUCTURE.md: Last Updated line refreshed; extension/ section
extended with an extension/scripts/ subsection describing the Phase 1
CLI and the Phase 2 integration rationale for co-locating it with the
extension.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01MFfrr14YLQALiAPjhwYjE9
```

Then push to `origin main`.

---

## Cleanup

After commit and push, move this handoff file from `handoffs/incoming/` to `handoffs/applied/` per the active repo convention for executed handoffs.

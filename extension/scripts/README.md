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

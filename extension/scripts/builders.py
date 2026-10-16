"""Builder registry — per-builder configuration for the Workstream A multi-builder architecture.

Each key in BUILDERS maps a short lowercase slug (used in URL params and request bodies)
to a config dict for one builder. The script dispatcher reads from BUILDERS[builder]
instead of pulling base IDs, form IDs, folder IDs, and sheet IDs from the environment.

What belongs here:
  - Per-builder, non-secret config: Airtable base + table IDs, Cognito form + view IDs,
    Drive folder ID, Google Sheet ID + tab ID + target row, display name, MLS tag, and
    the key naming which community resolver to use.

What stays in Railway Variables (shared secrets):
  - AIRTABLE_PAT, COGNITO_API_KEY, GCP_CLIENT_ID/SECRET/REFRESH_TOKEN, API_SHARED_SECRET.

Adding a new builder: add a new top-level key to BUILDERS. See the Workstream B
onboarding runbook (when it lands) for the data-gathering checklist that precedes
this step.
"""

from __future__ import annotations

BUILDERS: dict = {
    "lennar": {
        "display_name": "Lennar",
        "mls_tag": "cvrmls",
        "cognito_form_id": "17",
        "submitted_view_id": 3,
        "airtable_base_id": "app78fMUwDNBHUZ6r",
        "airtable_tables": {
            "payload_rules": "tbletiuyEdhVwcwGw",
            "cognito_fields": "tbl9LWfHDEuYtgFvv",
            "source_types": "tblpwaJswUvNpYOyY",
            "community_db": "tbleMbM1WgY8Si2t7",
        },
        "drive_properties_folder_id": "1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B",
        "sheet_id": "1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME",
        "sheet_tab_id": 206940732,
        "sheet_target_row": 45,
        "community_resolver": "lennar_default",
    },
}

DEFAULT_BUILDER = "lennar"


def get_builder_config(builder: str | None) -> dict:
    """Return the registry entry for `builder`, defaulting to DEFAULT_BUILDER when None/empty.

    Hard-fails with a clear error if the key is unknown — do not silently fall back.
    Lowercases + strips the input so URL/body variants of case don't matter.
    """
    key = (builder or DEFAULT_BUILDER).strip().lower()
    if key not in BUILDERS:
        valid = ", ".join(sorted(BUILDERS.keys()))
        raise RuntimeError(
            f"Unknown builder {key!r}. Valid builders: {valid}. "
            "Add a new entry to extension/scripts/builders.py to onboard a new builder."
        )
    return BUILDERS[key]

---
title: Handoff — Prep Listing Polish (Sheet suffix + Gmail banner)
document_id: HANDOFF-2026-10-15-PREP-POLISH
date: 2026-10-15
author: Andrew Rich via Claude (AAR-TC Lennar Operational Project)
scope: two-file batched (extension/scripts/app.py, extension/scripts/sheets_services.py)
batched: yes
batched_rationale: Both changes are small, independent polish fixes to the Phase 3a / 3a.1 /prepare-listing flow. Partial apply of either is safe — no cross-dependency, nothing breaks if only one lands. Batched for operator convenience, same pattern as v0.14 pipeline-build, v0.16 FastAPI wrapper, v0.17 Phase 2 extension-side, v0.18 Phase 3a, v0.19 Phase 3a.1. CURSOR-HANDOFF-PROTOCOL-001 v1.1's "one file per handoff" rule is the operator-blessed divergence here.
related: FOUND-PHASE-TRACKER-001 (v0.19), SESSION-HANDOFF-2026-10-14-PHASE-3A1-SHEETS-WRITE-LIVE.md, CURSOR-HANDOFF-PROTOCOL-001
---

# Handoff — Prep Listing Polish (Sheet suffix + Gmail banner)

Two small polish fixes to the Phase 3a / 3a.1 listing-prep flow, both in `extension/scripts/`. Neither depends on the other.

**Context — Gmail banner.** Prep emails sent via `/prepare-listing` arrive in the operator's inbox with Gmail's "Be careful with this message" yellow banner. Confirmed via raw-header inspection of two live prep emails on 2026-10-15 — `from:` and `to:` are a byte-for-byte exact-string match (`agentandrewrich@gmail.com` → `agentandrewrich@gmail.com`), which is Gmail's single documented trigger for the self-send banner. The banner is a UI-level rendering decision, not a Spam-filter decision — which is why the v0.18 Gmail filter mitigation (match on from + subject) didn't suppress it. Workspace allowlists would also work but require a paid Workspace account the operator doesn't have. Fix: use a plus-alias (`agentandrewrich+listings@gmail.com`) for the `to:` address. Gmail silently strips `+listings` on delivery so mail still lands in the inbox, but the from/to strings are no longer identical and the banner is suppressed.

**Context — Sheet row suffix abbreviation.** The Phase 3a.1 Sheets write (`sheets_services.py`) currently writes the full street name (e.g. "3435 Moonstone Drive") into column A of the Lennar Listings Sheet. The operator's standing formatting convention on the Sheet uses abbreviated suffixes (e.g. "3435 Moonstone Dr") to match the Drive folder naming convention. The suffix abbreviator (`_abbreviate_street_name` / `_build_folder_name`) already exists in `app.py` and is used to construct the Drive folder name. The handler also assigns the abbreviated form to a local `address` variable (`app.py:230`) but currently only uses it in the prep email body — `build_listing_row` ignores it and rebuilds the address internally from the raw `Intake.StreetNumber` + `Intake.StreetName`. Fix: pass the already-abbreviated `address` from `app.py` into `build_listing_row` as a parameter, and drop the internal reconstruction. One source of truth, same abbreviated form used for the Drive folder, the email body, and the Sheet row A.

---

## Change 1 — Gmail banner: plus-alias on `to:` address (`app.py` ~lines 251-259)

**Find** this block:

```python
        operator_email = "agentandrewrich@gmail.com"
        gmail = gmail_service()
        send_html_email(
            gmail,
            to_address=operator_email,
            from_address=operator_email,
            subject=subject,
            html_body=html,
        )
```

**Replace with:**

```python
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
```

Notes for the applier:
- Keeping `from_address` as the unaliased address — the authenticated send is still from the real account via OAuth, so DKIM/SPF stay clean.
- Only the `operator_email` local is reshaped; `send_html_email`'s signature is untouched. If a later caller elsewhere imports `operator_email`, confirm nothing else in the file references that name (it's handler-local in the current source).

---

## Change 2 — Pass abbreviated address through to `build_listing_row` (`app.py` ~lines 266-269)

**Find** this block:

```python
            community_display_name = _resolve_community_key(entry)
            sheets = sheets_service()
            row = build_listing_row(entry, community_display_name)
            write_listing_row(sheets, sheet_id, row)
```

**Replace with:**

```python
            community_display_name = _resolve_community_key(entry)
            sheets = sheets_service()
            # Pass the already-abbreviated address so the Sheet row A
            # matches the Drive folder name and the email body. The
            # handler's local `address` is set from _build_folder_name()
            # above (line ~230).
            row = build_listing_row(entry, community_display_name, address=address)
            write_listing_row(sheets, sheet_id, row)
```

Notes for the applier:
- `address` is already in scope at this point in the handler — set at line ~230 as `address = folder_name`. No new helper to import.
- Change 3 updates `build_listing_row`'s signature to accept this `address` parameter.

---

## Change 3 — Accept `address` from caller, drop internal reconstruction (`sheets_services.py` ~lines 7-9 and 69-90)

### 3a. Update the column-map docstring at the top of the file

**Find:**

```python
Column map (confirmed 2026-10-14):
    A: Address             -> script writes "{StreetNumber} {StreetName}"
    B: MLS#                -> blank (operator fills after Matrix accepts)
```

**Replace with:**

```python
Column map (confirmed 2026-10-14):
    A: Address             -> script writes abbreviated address from caller
                              (matches Drive folder name, e.g. "3435 Moonstone Dr")
    B: MLS#                -> blank (operator fills after Matrix accepts)
```

### 3b. Update `build_listing_row` signature + docstring + body

**Find:**

```python
def build_listing_row(entry, community_display_name):
    """
    Build the 20-cell row (A..T) from a Cognito Form 17 single-entry fetch.

    Args:
        entry: nested-dict shape as returned by _cognito_fetch_entry
        community_display_name: resolved DB community key (e.g. "Everstone SF")

    Returns:
        List of 20 cell values, index 0 = column A.
    """
    def nested(path):
        cur = entry
        for part in path.split("."):
            if not isinstance(cur, dict):
                return None
            cur = cur.get(part)
        return cur

    street_number = nested("Intake.StreetNumber") or ""
    street_name = nested("Intake.StreetName") or ""
    address = f"{street_number} {street_name}".strip()

    list_price = nested("PropertyBasics.ListPrice")
```

**Replace with:**

```python
def build_listing_row(entry, community_display_name, address):
    """
    Build the 20-cell row (A..T) from a Cognito Form 17 single-entry fetch.

    Args:
        entry: nested-dict shape as returned by _cognito_fetch_entry
        community_display_name: resolved DB community key (e.g. "Everstone SF")
        address: pre-abbreviated address string from the caller (e.g.
            "3435 Moonstone Dr"). The caller owns the abbreviation so the
            Drive folder name, the prep email body, and the Sheet row A
            all carry the same display form.

    Returns:
        List of 20 cell values, index 0 = column A.
    """
    def nested(path):
        cur = entry
        for part in path.split("."):
            if not isinstance(cur, dict):
                return None
            cur = cur.get(part)
        return cur

    list_price = nested("PropertyBasics.ListPrice")
```

Notes for the applier:
- The three lines that reconstructed `address` from `Intake.StreetNumber` + `Intake.StreetName` are removed in the Replace. The `nested` helper stays because other fields still use it.
- `build_listing_row` is called only from `app.py`'s `/prepare-listing` handler (confirmed by `grep build_listing_row extension/`). The signature change is safe — Change 2 updates the sole caller in the same handoff.

---

## Post-apply verification

1. **Operator fires `Generate listing prep` from the extension side panel** against any recent Form 17 entry (Entry #18, #20, or #21 all work for a smoke test).

2. **Pause 1-2 minutes for Railway to redeploy** before firing the smoke test — per the v0.19 deploy-race lesson. First fire against stale code looks like a silent no-op; second fire against the new build is the real result.

3. **Prep email check:** Open the resulting prep email in Gmail. Confirm the yellow "Be careful with this message" banner is **gone**. The email body, subject, and attachments are otherwise identical to prior prep emails.
   - If the banner persists, the deploy may not have cut over yet — wait another minute and refresh.
   - Check that the existing Gmail filter (if any) still fires. It matches on `from:` + subject, both unchanged, so should keep working.

4. **Sheet row check:** Open the Lennar Listings Sheet. Confirm the newly-inserted row at row 45 shows column A with the abbreviated form (e.g. "3435 Moonstone Dr", **not** "3435 Moonstone Drive"). Confirm the Drive folder created in the same run uses the same abbreviated form — the two should match exactly.
   - If the row writes "3435 Moonstone Drive" (full form), Change 2 didn't land — Cursor may have applied Change 3 without Change 2, leaving `build_listing_row` requiring an `address` arg the caller doesn't pass. The handler's try/except catches this and surfaces "Sheet row write failed" in the warnings; check Railway logs for the TypeError.

5. **No regression check on other written cells:** Confirm C (Current Price), E (Community), F (Status), L (Build Model), M (NHC), R/S/T (photo cells) all still populate correctly. Changes 2 and 3 only touch column A's source — the rest of the row builder is untouched.

---

## Commit block

```bash
git add extension/scripts/app.py extension/scripts/sheets_services.py
git commit -m "fix(prep-listing): abbreviate Sheet row address, plus-alias prep email

Two small polish fixes to the /prepare-listing flow:

1. Gmail yellow 'Be careful with this message' banner was firing on prep
   emails because From and To headers were a byte-exact match
   (agentandrewrich@gmail.com -> itself). Confirmed via raw-header
   inspection of two live prep emails 2026-10-15. Switched the To: to
   agentandrewrich+listings@gmail.com — Gmail strips the +listings for
   delivery so mail still lands in the same inbox, but the self-send
   heuristic no longer fires. The existing from:+subject Gmail filter
   is unaffected.

2. Sheet row column A now carries the abbreviated address (e.g.
   '3435 Moonstone Dr') to match the Drive folder naming convention
   and the operator's standing Sheet formatting. The handler already
   builds the abbreviated form for the Drive folder; now passes it
   through to build_listing_row instead of rebuilding internally from
   raw Intake.StreetNumber + Intake.StreetName.

Refs: Phase Tracker v0.19, Session Handoff 2026-10-14 Phase 3a.1.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01J2mL5c2H96ZRUu6Cndqv35"
git push
mv handoffs/incoming/HANDOFF-2026-10-15-prep-polish.md handoffs/applied/
git add handoffs/
git commit -m "chore(handoffs): move prep-polish to applied

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01J2mL5c2H96ZRUu6Cndqv35"
git push
```

---

## Cursor prompt

Drop this file in `handoffs/incoming/`, open Cursor, and run:

```
Read handoffs/incoming/HANDOFF-2026-10-15-prep-polish.md and apply all three changes it specifies — Change 1 and Change 2 to extension/scripts/app.py, Change 3 (parts 3a and 3b) to extension/scripts/sheets_services.py. Do not modify any other files. Then run the git commands exactly as written in the Commit block.
```

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

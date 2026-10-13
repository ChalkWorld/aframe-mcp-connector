---
title: Handoff — Virtual Tour Payload Emission Fix
document_id: HANDOFF-2026-10-13-VIRTUAL-TOUR-EMISSION-FIX
date: 2026-10-13
author: Andrew Rich via Claude (AAR-TC Lennar Operational Project)
scope: single-file surgical (extension/scripts/generate.py)
related: FOUND-PHASE-TRACKER-001 (v0.17), SESSION-HANDOFF-2026-10-07-EVERSTONE-SF-VALIDATION-AND-YESNO-FIX.md, Lennar_Payload_Schema.md §4.10
---

# Handoff — Virtual Tour Payload Emission Fix

**Context.** Entry #21 (3435 Moonstone Drive, Everstone SF, submitted 2026-10-12 by TJ Hall) is the first live run with a populated `PhotosVirtualTour.VirtualTourLink`. The extension's Virtual Tour tab auto-fill threw `Cannot read properties of undefined (reading 'virtual_tour')`. Operator confirmed the URL was present in the generated payload textarea — the symptom is at the extension dispatcher boundary, not at Cognito fetch or Rule 17 lookup.

**Root cause.** `generate.py` emits the Virtual Tour section under the wrong keys. Schema §4.10 and `content.js:284-288`'s `fillVirtualTourInfo` dispatcher both expect the payload shape `payload.tour.virtual_tour` / `payload.tour.additional_virtual_tour`. The current generator emits `payload.virtual_tour.url` instead — top-level key is wrong (`virtual_tour` vs `tour`), inner key is wrong (`url` vs `virtual_tour`). The dispatcher does `var d = payload.tour;` → `d` is `undefined` → `d.virtual_tour` throws.

**Why it didn't surface before.** Entries #18 (Everstone Larimar, 2026-09-17) and #20 (Creekside 6136 Hull, 2026-10-05) both had `VirtualTourLink: null`. On those entries the `if vt_url:` branch at line 1081 never fired, so no `virtual_tour` key was emitted at all. Entry #21 is the first `vt_url` truthy run — the production-catch pattern parked in Phase Tracker v0.15.

**Three closely-related changes to `extension/scripts/generate.py`, all around Virtual Tour emission:**
1. Fix the key-name mismatch at line ~1082 so the emitted shape matches the extension's dispatcher reads.
2. Always emit the `tour` section (with empty defaults when no URL), mirroring the v0.14 extension-contract-knowledge pattern already applied to Bath Info level sub-objects. This also fixes the latent crash risk on null-URL entries if the operator auto-fills through the Virtual Tour tab.
3. Delete the dead OUTPUT_MAP entry at line 353 — unreachable because the router at line 948 short-circuits for `Input_610` before OUTPUT_MAP is consulted.

---

## Change 1 — Rewrite the Virtual Tour emission block (`generate.py` ~lines 1075-1083)

**Find** this block:

```python
    # --- 8. Virtual Tour tab-skip ---
    # If the Cognito VirtualTourLink is blank/missing, drop the entire
    # virtual_tour section (per Rule 17 Notes / Schema §4.10 payload-level
    # omit rule). We route Input_610 to a sentinel key during iteration,
    # then promote or drop it here.
    vt_url = payload.pop("_virtual_tour_url", None)
    if vt_url:
        payload["virtual_tour"] = {"url": vt_url}
```

**Replace with:**

```python
    # --- 8. Virtual Tour section ---
    # Promote the Input_610 sentinel to the extension's expected shape under
    # payload.tour.{virtual_tour, additional_virtual_tour}. Always emit the
    # section with empty defaults when no URL is provided — the extension's
    # fillVirtualTourInfo dispatcher reads payload.tour unconditionally and
    # does `var d = payload.tour;` which throws on undefined. Matches the
    # v0.14 extension-contract-knowledge pattern applied below for Bath Info
    # level sub-objects (shape always present, rule-driven values preserved).
    # Schema §4.10's "omit entirely on blank URL" semantics are preserved
    # operationally: Matrix accepts empty strings as "no virtual tour".
    vt_url = payload.pop("_virtual_tour_url", None) or ""
    payload["tour"] = {
        "virtual_tour": vt_url,
        "additional_virtual_tour": "",
    }
```

Notes for the applier:
- `.pop("_virtual_tour_url", None) or ""` normalizes None/missing to empty string in one expression, consistent with the dispatcher's own `|| ""` defense.
- `additional_virtual_tour` has no Form 17 source (Input_611 excluded per Phase Tracker v0.13 — "absence of a row" pattern); the empty-string default here is purely shape, not value.

## Change 2 — Delete the dead OUTPUT_MAP entry (`generate.py` ~line 353)

**Find:**

```python
    # Virtual Tour Info
    "Input_610": ("_virtual_tour", "url"),  # see tab-skip logic below
```

**Replace with:**

```python
    # Virtual Tour Info
    # Input_610 is handled by the router's own short-circuit before
    # OUTPUT_MAP is consulted — see _route_rule_output() and the
    # Virtual Tour section-build block below. No OUTPUT_MAP entry needed.
```

The two lines of comment preserve the mental anchor for the next reader so the ID doesn't look overlooked; delete entirely if you prefer.

---

## Post-apply verification

1. From `extension/scripts/`, with the venv active:
   ```
   python generate.py --entry-id 21 --out ./test-outputs/entry-21.json
   ```
   Confirm exit code 0 and the file is produced.

2. In the output JSON, confirm:
   - Top-level `tour` key exists.
   - `tour.virtual_tour` is the Lennar URL from the Cognito entry (`https://www.lennar.com/new-homes/virginia/richmond-area/richmond/everstone/powell/22831650029/virtual-tour`).
   - `tour.additional_virtual_tour` is the empty string `""`.
   - No `virtual_tour` top-level key.

3. For null-URL regression check:
   ```
   python generate.py --entry-id 18 --out ./test-outputs/entry-18.json
   ```
   Confirm:
   - Top-level `tour` key exists.
   - `tour.virtual_tour` is `""`.
   - `tour.additional_virtual_tour` is `""`.

4. Load the Entry #21 payload into the extension side panel via the picker, open the Matrix Virtual Tour tab in a Lennar incomplete listing, let auto-fill fire. Confirm Input_610 is populated with the URL and no console error.

5. (Optional, if a Lennar test listing with no virtual tour is on hand) Load the Entry #18 payload and auto-fill the Virtual Tour tab. Confirm Input_610 and Input_611 both end up blank with no console error — this exercises the previously-latent null-URL dispatcher crash path.

## Commit block

```bash
git add extension/scripts/generate.py
git commit -m "fix(generate): emit virtual tour under tour.{virtual_tour,additional_virtual_tour}

Virtual Tour tab auto-fill was crashing on Entry #21 (3435 Moonstone, first
live run with a populated VirtualTourLink). generate.py was emitting
payload.virtual_tour.url; the extension's fillVirtualTourInfo dispatcher
reads payload.tour.virtual_tour and payload.tour.additional_virtual_tour.

Also always emit the tour section with empty defaults when no URL is
provided, mirroring the v0.14 Bath Info level sub-object pattern. This
closes the latent crash risk on null-URL entries when auto-fill reaches
the Virtual Tour tab.

Deleted the dead OUTPUT_MAP entry for Input_610 — router short-circuits
before OUTPUT_MAP is consulted, so the entry was unreachable.

Refs: Phase Tracker v0.17, Schema §4.10, Rule 17.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014uarCbd7ciAXjcQZLyhszZ"
git push
mv handoffs/incoming/HANDOFF-2026-10-13-virtual-tour-emission-fix.md handoffs/applied/
git add handoffs/
git commit -m "chore(handoffs): move virtual-tour-emission-fix to applied

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014uarCbd7ciAXjcQZLyhszZ"
git push
```

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

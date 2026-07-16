---
title: Cursor Handoff — Lennar_New_Listing_Protocol.md — 2026-07-16
document_id: HANDOFF-2026-07-16-LENNAR-PROTOCOL
date: 2026-07-16
project: AAR-TC Lennar CVRMLS Matrix Intake
---

Apply the changes below surgically to `docs/lennar/Lennar_New_Listing_Protocol.md`. Do not modify anything not listed here.

## Change 1

Bump the version header.

**Find:**
```markdown
**Version 2.4** | *Last Updated: July 15, 2026*
```

**Replace with:**
```markdown
**Version 2.5** | *Last Updated: July 16, 2026*
```

## Change 2

Add the ShowingTime "Allow Online Requests" reminder to the Step 12 Session Handoff Summary checklist, next to the other Aframe UI-only manual tasks. Easy to miss now that Aframe transactions aren't created automatically at intake — Andrew almost forgot it for both 8720 and 8724 Whitman Dr.

**Find:**
```markdown
- [ ] Set Property Type in Aframe UI (dropdown — cannot be written via connector)
- [ ] Save MLS# back to the Session Data tab once assigned; surface to Andrew for manual entry on the main tab
```

**Replace with:**
```markdown
- [ ] Set Property Type in Aframe UI (dropdown — cannot be written via connector)
- [ ] ShowingTime — check "No" for Allowing Online Requests in Aframe (UI-only — cannot be written via connector). Keeps buyer agents from contacting the listing agent (Gary Martin) directly to request showings. Easy to forget now that Aframe transactions aren't created automatically at intake — flag every session regardless of whether Step 9 ran.
- [ ] Save MLS# back to the Session Data tab once assigned; surface to Andrew for manual entry on the main tab
```

## Change 3

Add a cross-reference from Step 11 to the new Step 13 stub.

**Find:**
```markdown
### 11. Active Listing Email
Once the listing goes Active in MLS (Andrew handles activation), send the "now active" email to the sales rep(s) for that community with the MLS listing sheet attached.

Sales rep roster by community: *(stub — see Primary Contact section above)*
```

**Replace with:**
```markdown
### 11. Active Listing Email
Once the listing goes Active in MLS (Andrew handles activation), send the "now active" email to the sales rep(s) for that community with the MLS listing sheet attached.

Sales rep roster by community: *(stub — see Primary Contact section above)*

*(See Step 13 for the session-executed version of this step — stub, not yet implemented.)*
```

## Change 4

Add a new Step 13 stub — placeholder for the session (not Andrew) sending the active-listing email once the sales rep roster and trigger are worked out.

**Find:**
```markdown
- [ ] Send active listing email to community sales rep(s)

---
```

**Replace with:**
```markdown
- [ ] Send active listing email to community sales rep(s)

---

### 13. Send Active Listing Email — STUB (session-executed, details pending)

*Added 2026-07-16 — placeholder step, not yet fully specified. Do not treat as executable guidance until fleshed out.*

Once Andrew confirms a listing has gone Active in MLS, the session — not Andrew — drafts and sends the "now active" notification email to the appropriate community sales rep(s), with the MLS listing sheet attached. Meant to eventually replace the manual process described in Step 11.

Not yet defined:
- Exact trigger — does Andrew explicitly flag each activation, or does the session watch for status changes some other way?
- Recipient roster by community (see Primary Contact section — Megan's full rep roster is still a stub)
- Email template and tone
- Whether the MLS data sheet is attached directly or linked from Drive

---
```

## Change 5

Add a new standing rule: when Andrew reports a listing has gone Active, the session proactively re-surfaces the short list of easy-to-forget activation-adjacent manual tasks, without being asked.

**Find:**
```markdown
When the equivalent Standard MLS Session Protocol is built, add a parallel standing rule pointing at whatever section captures the same convention upstream in `CVRMLS_Payload_Schema.md` (per the schema's Format Conventions carry-forward note).

---

## Systems & Reference
```

**Replace with:**
```markdown
When the equivalent Standard MLS Session Protocol is built, add a parallel standing rule pointing at whatever section captures the same convention upstream in `CVRMLS_Payload_Schema.md` (per the schema's Format Conventions carry-forward note).

### Activation Double-Check (Standing Rule — Added 2026-07-16)

Whenever Andrew reports that a listing has gone Active — in any phrasing ("I just made 8724 active," "both are active now," etc.) — the session immediately surfaces the short list of easy-to-forget manual tasks that go with activation, without waiting to be asked. As of 2026-07-16 that list is:

1. ShowingTime — "No" for Allowing Online Requests (Aframe, UI-only)
2. Flip Aframe status from Draft to Lennar - Active, if not already done
3. Send the active listing email to the community sales rep(s) (Step 11 / Step 13 stub)

Keep it to a quick nudge, not a full session review — e.g. "Nice — just want to make sure you didn't forget: ShowingTime toggle and the sales rep email for both." If multiple addresses are reported active in the same message, cover each by address rather than assuming they're all in the same state.

This list should be kept in sync with whatever Step 12's Aframe/activation-adjacent checklist items are — if that checklist changes, update this list too.

---

## Systems & Reference
```

## Change 6

Add a version history row for v2.5.

**Find:**
```markdown
| 2.4 | 2026-07-15 | Step 4 of doc realignment (`AAR-TC-DOC-REALIGN-TARGET-001` §8) plus smoke-test findings. Added "Payload Format Conventions" standing rule cross-referencing the new `Lennar_Payload_Schema.md` §Format Conventions section — captures the checkbox array format split (Fee Info/Owner = suffix-only; Features A/B = full-ID) first surfaced on 8720 Whitman Dr smoke test. Added `listing.lot` to the taxid-path omit list in Step 5b (smoke test confirmed Harpers Mill tax record autofills Lot). Removed four retired-doc rows from Key IDs & References (`AAR-TC-LENNAR-BM-CUST-001`, `AAR-TC-LENNAR-BM-NOTES-001`, `AAR-TC-LENNAR-BM-SCH-001`, `AAR-TC-LENNAR-BM-SRC-001-FEA`) — full retirement handled in a separate commit that also `git rm`'s the four files themselves. |
```

**Replace with:**
```markdown
| 2.4 | 2026-07-15 | Step 4 of doc realignment (`AAR-TC-DOC-REALIGN-TARGET-001` §8) plus smoke-test findings. Added "Payload Format Conventions" standing rule cross-referencing the new `Lennar_Payload_Schema.md` §Format Conventions section — captures the checkbox array format split (Fee Info/Owner = suffix-only; Features A/B = full-ID) first surfaced on 8720 Whitman Dr smoke test. Added `listing.lot` to the taxid-path omit list in Step 5b (smoke test confirmed Harpers Mill tax record autofills Lot). Removed four retired-doc rows from Key IDs & References (`AAR-TC-LENNAR-BM-CUST-001`, `AAR-TC-LENNAR-BM-NOTES-001`, `AAR-TC-LENNAR-BM-SCH-001`, `AAR-TC-LENNAR-BM-SRC-001-FEA`) — full retirement handled in a separate commit that also `git rm`'s the four files themselves. |
| 2.5 | 2026-07-16 | Added ShowingTime "No" Allow Online Requests reminder to Step 12 Session Handoff Summary checklist (Aframe UI-only task, easy to miss now that Aframe transactions aren't created automatically at intake). Added Step 13 stub for session-executed Active Listing Email — trigger, recipient roster, template, and attachment method not yet defined; placeholder only, cross-referenced from Step 11. Added "Activation Double-Check" standing rule — when Andrew reports a listing went Active, the session proactively re-surfaces the ShowingTime toggle, Aframe status flip, and sales rep email as a quick nudge. |
```

No other changes to `Lennar_New_Listing_Protocol.md`.

```bash
git add -A
git commit -m "docs(lennar): add TH bath structural defaults + rooms fallback to schema; ShowingTime reminder, activation double-check rule, and active-listing-email stub to protocol"
git push origin main
```

Before pushing, delete both handoff files used this session:

```bash
git rm handoffs/HANDOFF-2026-07-16-lennar-payload-schema.md handoffs/HANDOFF-2026-07-16-lennar-new-listing-protocol.md
git add -A
git commit -m "docs(lennar): add TH bath structural defaults + rooms fallback to schema; ShowingTime reminder, activation double-check rule, and active-listing-email stub to protocol"
git push origin main
```

---
title: Cursor Handoff — Project_Session_Log_v2.md — Append New Session Entry
document_id: HANDOFF-2026-08-11-session-log-v2
date: 2026-08-11
project: AAR-TC Lennar CVRMLS Matrix Intake
---

Apply the change below to `docs/project/Project_Session_Log_v2.md`. Do not modify anything else in the file.

## Change 1 — Append new session entry

**This is an append, not a find/replace.** Open `docs/project/Project_Session_Log_v2.md`, find the highest-numbered existing session entry, and insert the entry below immediately after that entry's closing `---` divider (i.e. before the file's closing attribution footer at the very bottom of the file). Replace `Session [N]` in the heading below with the correct next sequential number — do not hardcode a number here, determine it from the file's actual current state.

**Insert:**
```
## Session [N] — Lennar Doc Cleanup + Live Taxid Migration Test
**Date:** August 11, 2026

### Focus
Clean up accumulated documentation debt across the three Lennar docs (Protocol, Payload Schema, Community Reference DB) and confirm several long-open items via live testing on an incoming Creekside Run TH listing.

### What Was Accomplished
- Multi-rep intake model documented — Megan Cook confirmed as a regional director, not a day-to-day submission funnel; Primary Contact and "How a New Listing Arrives" rewritten accordingly. NHC (New Home Consultant) terminology noted.
- Cognito form identities confirmed via direct API lookup: current form is ID 17 (`LennarNewListingIntake`), legacy is ID 16 (`ZapierFormForLennarOLD`). New standing rule: when Form 17 is the source, sessions pull the entry directly from Cognito rather than parsing the flattened email notification.
- Full Cognito Form 17 → CVRMLS crosswalk built and documented (Appl/Equip, Interior, Flooring, Siding, Exterior, Style for SF, Unit Placement for TH) — resolves the long-standing "Range" appliance ambiguity and the SF Style guessing problem.
- Siding and Flooring corrected from pure Lennar-wide statics to payload-driven fields with a stated default (Vinyl/LVP) — confirms a decision Session 007 had already made but never applied to the doc.
- Creekside Run TH migrated from `new` to `taxid` path — tax records confirmed populated; first live taxid pull outside Chesterfield County (Richmond City), County/City cascade confirmed working the same as Chesterfield.
- MLS Area codes documented for the first time for all 5 active communities (previously untracked anywhere): Harpers Mill 54, Creekside Run 60, Everstone 42, Watermark 54.
- Creekside Run Fee Includes resolved (Comm Ar Mnt, Common Area, Snow Removal) and capital contribution confirmed flowing into Add'l Fee Desc — second community confirmed after Harpers Mill TH.
- Wynwood at Fox Creek marked retired (sold out, no further listings expected) across all three docs.
- Features A/B launchers marked Tested in the Protocol's launcher table (three clean Lennar taxid runs).
- Step 10 (Send the Listing Addendum) annotated with current operational status — PandaDoc build retained in full as documented target state, but addenda are sent manually via TransactionDesk until the paid tier is reactivated (free trial ended, not a priority at current volume).
- Stale "General Info Tax ID patch" item removed from Planned Automations — confirmed working across multiple live sessions.
- A new Creekside Run TH listing (6039 Blue Iris Rd) came in mid-session and was used as the live test case for several of the above — taxid migration, County/City cascade, Fee Includes, and the Stove/Range appliance mapping were all confirmed against it. Listing details not logged here beyond that.

### Decisions Made
- Reps submit new listings directly going forward; there is no single funnel contact. POC on the Session Data tab should be the actual submitting rep, confirmed per intake thread, not a default name.
- PandaDoc remains the documented target state for addendum signing but is on hold — TransactionDesk (manual) is the current method until the paid tier is activated.
- Vinyl siding and LVP flooring remain the correct Lennar defaults when a listing doesn't specify otherwise, but are no longer treated as universal facts — real per-listing variation exists and is now payload-driven.

### Documents Updated

| Document | Version | File |
|---|---|---|
| Lennar New Listing Protocol | 2.6 → 2.7 | `docs/lennar/Lennar_New_Listing_Protocol.md` |
| Lennar Payload Schema | 1.2 → 1.3 | `docs/lennar/Lennar_Payload_Schema.md` |
| Lennar Community Reference Database | 1.1 → 1.2 | `docs/lennar/Lennar_Community_Reference_Database.md` |

### Cursor Handoffs Produced

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-08-11-lennar-new-listing-protocol.md` | Multi-rep intake model, Cognito-direct-pull rule, Creekside taxid migration, Wynwood retirement, Features A/B tested, PandaDoc hold status (v2.7) |
| `HANDOFF-2026-08-11-lennar-payload-schema.md` | Creekside taxid migration, Cognito Form 17 features crosswalk, Siding/Flooring corrected to payload-driven (v1.3) |
| `HANDOFF-2026-08-11-lennar-community-reference-database.md` | MLS Area codes for all active communities, Creekside Fee Includes resolved, Wynwood retired (v1.2) |
| `HANDOFF-2026-08-11-session-log-v2.md` | This entry |

### Discrepancies Surfaced (Not Fixed This Session)
- **Zapier → Google Sheets connection is still broken as of session end — a full reauth did not fix it.** The connection showed `is_stale: false` throughout even while every call failed with "Authorization access_token missing for Google Sheets." Andrew reauthenticated mid-session (confirmed via a fresh `last_refreshed_at` timestamp), but the identical error recurred on every retry afterward. This points to the OAuth grant itself not including Sheets scope, not a stale-token issue — a plain reconnect click is unlikely to fix it next time either. Needs real investigation, not another retry.
- **Session 007 (July 24) contains decisions not yet fully reconciled into this session's Payload Schema update:** Auto Door Opener should be a static whenever Garage = Yes (not confirmed per-listing); Dishwasher/Microwave/Refrigerator/Washer/Dryer were decided as genuine Lennar-wide statics, not purely form-driven selections — today's new §5.4.1 documents all 12 Appl/Equip options as form-driven with no baseline, which is incomplete against that decision. Not fixed this session.
- **Payload Schema §6 still incorrectly claims** the Heating/Pool/Amenities community lookup table lives in the Community Reference DB. It doesn't — confirmed still only in §5.2 of the Payload Schema itself. Flagged in Session 007, still open.
- **Style field's "Custom" option** — flagged in Session 007 as needing confirmation against Andrew's stated Ranch/2 Story-only rule for Single Family. Still present in the live form as of this session, still unresolved.

### Open Verification Items (Carried Forward)
- Sales rep roster by community — still a stub.
- Fawncrest — still not an active community in the Community DB; no data added.
- `fee.addl_fee_desc` scope — now confirmed for 2 of 5 communities (Harpers Mill TH, Creekside Run); Harpers Mill SF, Everstone, and Watermark remain unconfirmed.
- Harpers Mill SF Fee Includes — still pending, no SF example sheet yet.
- Session Data tab row for the live-test listing — still blocked on the Zapier → Google Sheets connection (see Discrepancies above); not written this session.
- Auto Door Opener + Appl/Equip static promotion reconciliation (see Discrepancies above) — carried forward from Session 007, still open.

### Key References
- `Lennar_New_Listing_Protocol.md` v2.7
- `Lennar_Payload_Schema.md` v1.3
- `Lennar_Community_Reference_Database.md` v1.2
- Cognito Form 17 (`LennarNewListingIntake`) / Form 16 (`ZapierFormForLennarOLD`)

---
```

---

No other changes to `Project_Session_Log_v2.md`.

```bash
git add -A
git commit -m "Session log: append entry for Lennar doc cleanup pass + live taxid migration test (8/11)"
git push origin main
```

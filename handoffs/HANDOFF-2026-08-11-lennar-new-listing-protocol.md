---
title: Cursor Handoff — Lennar_New_Listing_Protocol.md — v2.6 to v2.7
document_id: HANDOFF-2026-08-11-lennar-new-listing-protocol
date: 2026-08-11
project: AAR-TC Lennar CVRMLS Matrix Intake
---

Apply the changes below surgically to `docs/lennar/Lennar_New_Listing_Protocol.md`. Do not modify anything not listed here.

## Change 1 — Version header bump

**Find:**
```
**Version 2.6** | *Last Updated: July 21, 2026*
```

**Replace with:**
```
**Version 2.7** | *Last Updated: August 11, 2026*
```

---

## Change 2 — Primary Contact section rewritten for multi-rep model

Megan Cook is a regional director, not a day-to-day intake funnel. There is no single primary contact anymore — listings arrive from individual sales reps directly.

**Find:**
```
## Primary Contact

**New listings come from:** Carly Evans (carly.evans@lennar.com) — through June 29, 2026
**Effective June 30, 2026:** Megan Cook (megan.cook@lennar.com) takes over
- Megan handles new listing submissions and signs listing addenda
- Full rep roster by community: *(stub — to be documented once Megan is onboarded. Reps shuffle; confirm current contacts at the start of any session involving community-specific emails)*
```

**Replace with:**
```
## Primary Contact

**New listings arrive from individual sales reps directly** — there is no single funnel contact anymore. Reps should use Andrew's Cognito form (see "How a New Listing Arrives" below); in practice some still default to a legacy form or email a manager instead, so sessions should not assume a fixed sender.

**History:** Carly Evans (carly.evans@lennar.com) was the funnel contact through July 2026 (out as of August 1, 2026 — relocated). Megan Cook (megan.cook@lennar.com) was originally slated to take over the same funnel role effective June 30, 2026, but **Megan is a regional director and is not hands-on with day-to-day submissions** — the single-contact funnel model never actually materialized under her. Sales reps (e.g. Stefanie Nayder, Mercedes Creech, Izaiah Clark) submit listings themselves. **Terminology:** Lennar refers to these reps internally as NHCs (New Home Consultants) — expect to see that abbreviation in their email signatures and threads.

**Session implication:** the POC field on the Session Data tab (Step 7) should be the actual rep who submitted the listing, not a generic contact — confirm from the intake email/thread rather than defaulting to a name.

- Full rep roster by community: *(stub — reps shuffle; confirm current contacts at the start of any session involving community-specific emails. More important now than under the old single-contact model, since there's no funnel to fall back on.)*
```

---

## Change 3 — "How a New Listing Arrives" updated for direct rep submission

**Find:**
```
## How a New Listing Arrives

Carly/Megan fills out a Lennar Cognito form. That form submission triggers an email to Andrew's inbox. The email contains the full form data — address, community, price, beds/baths, remarks, showing instructions, etc.

Andrew's Zap parser reads that email and populates his internal Lennar intake form, which previously triggered Aframe creation automatically. **Sessions now replace that Zap** and handle Aframe creation directly.

The email is the primary data source. There is no separate contract document.
```

**Replace with:**
```
## How a New Listing Arrives

The sales rep for the community fills out Andrew's Cognito form ("Lennar VA / DC Metro — MLS Entry Form") directly. That form submission triggers an email to Andrew's inbox from `notifications@cognitoforms.com`, containing the full form data — address, community, price, beds/baths, remarks, showing instructions, etc.

**Known gap:** a legacy Cognito form (originally Carly's) is still in circulation and some reps default to it out of habit. Confirmed first surfacing: Stefanie Nayder / 6039 Blue Iris Rd, August 2026. Both forms currently produce usable intake data, but reps should be steered to the current form when the opportunity comes up — flag it if a session spots the legacy form being used.

**When Andrew's current form is the source, pull the entry directly from Cognito — the email notification is not the source of truth for this form.** Confirmed form identity: Form ID `17`, internal name `LennarNewListingIntake`, display name "Lennar New Listing Intake." Check the Submitted view (`17-3`) for the newest entry, or use `get_entry` directly if the entry number is known. Reason: the email notification is a flattened, run-together text rendering of the form with no reliable field delimiters (e.g. `Street Number:6,039Street Name: Blue Iris Road` collapses two fields into one unbroken string) — meaningfully more error-prone to parse than the structured entry data available via the Cognito connector. Treat the notification email purely as a trigger ("a submission arrived"), not as the data to extract from.

*Not yet live-tested with a real rep submission as of August 2026* — the form's only two entries so far are Andrew's own test submissions (Harpers Mill placeholder data, both `Entry_Status: Submitted`). Real submissions are still landing on the legacy form (Form ID `16`, `ZapierFormForLennarOLD`, 32 entries as of this writing). Treat the first genuine rep submission through Form 17 as a smoke test — verify the field-name mapping (`Intake_*`, `PropertyBasics_*`, `BedsBathsLevels_*`, `SquareFootage_*`, `Remarks_*`, `Showing_*`, `PhotosVirtualTour_*`, `BuildFeatures_*`) holds up against real data before trusting it fully.

Andrew's Zap parser previously read the email and populated an internal intake form, which triggered Aframe creation automatically. **Sessions now replace that Zap** and handle Aframe creation directly.

For the legacy form (email-sourced submissions), the email remains the primary data source. There is no separate contract document either way.
```

---

## Change 4 — Matrix Entry Path Rules: Wynwood retired, Creekside Run TH migrated to taxid

**Find:**
```
| Community | Preferred Path | Notes |
|---|---|---|
| Harpers Mill TH | `taxid` | Tax records populated; location and tax fields pre-populate from parcel |
| Harpers Mill SF | `taxid` | Tax records populated; location and tax fields pre-populate from parcel |
| Creekside Run TH | `new` | Tax records not yet populated; clean-slate entry |
| Everstone SF | `new` | Tax records not yet populated. Subdivision field: use `None` + Neighborhood: `Everstone` — Everstone does not appear in Subdivision dropdown |
| Watermark SF | `new` | Tax records not yet populated |
| Wynwood at Fox Creek SF | *(pending)* | Community sold out — no active listings; revisit when a new listing appears |
```

**Replace with:**
```
| Community | Preferred Path | Notes |
|---|---|---|
| Harpers Mill TH | `taxid` | Tax records populated; location and tax fields pre-populate from parcel |
| Harpers Mill SF | `taxid` | Tax records populated; location and tax fields pre-populate from parcel |
| Creekside Run TH | `taxid` | Tax records now populated as of August 2026 — migrated from `new`. First confirmed live on 6039 Blue Iris Rd (MLS# 2621807). First taxid pull in Richmond City rather than Chesterfield County; general taxid behavior held (Lennar carveout fields for Year Built/Rooms/Levels/Bedrooms/Post Office still needed) but jurisdiction-specific edge cases not yet fully ruled out |
| Everstone SF | `new` | Tax records not yet populated. Subdivision field: use `None` + Neighborhood: `Everstone` — Everstone does not appear in Subdivision dropdown |
| Watermark SF | `new` | Tax records not yet populated |
| Wynwood at Fox Creek SF | **retired** | Community sold out — no further listings expected. Not carried forward as a pending item. |
```

---

## Change 5 — Bookmarklet launcher table: Features A/B confirmed tested

**Find:**
```
| Features A | `bookmarklets/features_a.html` | ⬜ Not yet tested |
| Features B | `bookmarklets/features_b.html` | ⬜ Not yet tested |
```

**Replace with:**
```
| Features A | `bookmarklets/features_a.html` | ✅ Tested |
| Features B | `bookmarklets/features_b.html` | ✅ Tested |
```

---

## Change 6 — Step 7 (Session Data tab): POC guidance changed from fixed name to actual submitter

**Find:**
```
### 7. Update the Session Data Tab
Add a corresponding row with:
- Address, Community, List Price, Status = Input in Progress
- Intake Date = today
- Addendum Status = Pending
- Gmail Thread ID
- POC = Carly Evans (or Megan Cook if after 6/30)
- MLS Input Stage = Not Started
- Photo Status and Photo Source if known from Carly's note
- Model name if present in the form data
```

**Replace with:**
```
### 7. Update the Session Data Tab
Add a corresponding row with:
- Address, Community, List Price, Status = Input in Progress
- Intake Date = today
- Addendum Status = Pending
- Gmail Thread ID
- POC = the sales rep who actually submitted the listing — confirm from the intake email/thread, do not default to a fixed name (see Primary Contact section; there is no single funnel contact anymore)
- MLS Input Stage = Not Started
- Photo Status and Photo Source if known from the intake note
- Model name if present in the form data
```

---

## Change 7 — Step 10: PandaDoc build retained, annotated with current operational status

Per Andrew: keep the full PandaDoc documentation in place as the target state, just note that the paid tier isn't active and TransactionDesk (manual) is the current method.

**Find:**
```
### 10. Send the Listing Addendum

Sessions send the listing addendum directly via the PandaDoc connector. This step no longer requires Andrew to do anything manually.

**Template:**
```

**Replace with:**
```
### 10. Send the Listing Addendum

**Current status (as of August 2026): PandaDoc is on hold.** The free trial ended and the paid tier hasn't been activated — not a priority at current listing volume. Until it's turned back on, addenda are sent the old way: **Andrew sends and tracks the addendum manually via TransactionDesk**, outside the session. The PandaDoc build below is fully documented and tested — it's the target state to resume the moment the paid tier is active, not a stale or abandoned plan.

**When PandaDoc is active**, sessions send the listing addendum directly via the PandaDoc connector — no manual step required from Andrew.

**Template:**
```

---

## Change 8 — Planned Automations: remove resolved items

The General Info Tax ID patch has been confirmed working across multiple live sessions (no further issues). The Features A/B smoke-test item is now redundant with the launcher table (Change 5).

**Find:**
```
### Immediate (Next Session)
- [ ] **Features A + B smoke tests** — non-Lennar Features launchers (`bookmarklets/features_a.html`, `bookmarklets/features_b.html`) not yet tested in a live Matrix session
- [ ] **Payload spec (non-Lennar, Features A + B)** — document the full non-Lennar payload structure for `features_a` and `features_b` keys; parallel to the Lennar `features` key spec above
- [ ] **General Info path logic patch** — Acres and Legal Description Tax ID path skip logic is missing from the General Info bookmarklet; patch needed before Tax ID path is used in a real session
```

**Replace with:**
```
### Immediate (Next Session)
- [ ] **Payload spec (non-Lennar, Features A + B)** — document the full non-Lennar payload structure for `features_a` and `features_b` keys; parallel to the Lennar `features` key spec above. (Features A/B themselves are proven — three clean Lennar taxid runs as of August 2026; see launcher table above. This item is about writing the standard-listing documentation, not further testing.)
```

---

## Change 9 — Version History: add 2.7 row

**Find:**
```
| 2.6 | 2026-07-21 | Step 10 (Send the Listing Addendum) rewritten — DocuSign-pending stub replaced with the built and tested PandaDoc automation: template ID, Sender/Owner/Agent role structure, field map (`Property Address`, `Composed Clause`), recipient routing (Megan Cook → `megan.cook@lennar.com`, Gary Martin → `agentandrewrich@gmail.com`), document naming convention, and fire-and-forget send sequencing. Step 12 checklist item for manual addendum sending removed (now session-executed). "Future" section's DocuSign line replaced with signed-document retrieval automation as the remaining open item. Key IDs table gained PandaDoc template ID row. |
```

**Replace with:**
```
| 2.6 | 2026-07-21 | Step 10 (Send the Listing Addendum) rewritten — DocuSign-pending stub replaced with the built and tested PandaDoc automation: template ID, Sender/Owner/Agent role structure, field map (`Property Address`, `Composed Clause`), recipient routing (Megan Cook → `megan.cook@lennar.com`, Gary Martin → `agentandrewrich@gmail.com`), document naming convention, and fire-and-forget send sequencing. Step 12 checklist item for manual addendum sending removed (now session-executed). "Future" section's DocuSign line replaced with signed-document retrieval automation as the remaining open item. Key IDs table gained PandaDoc template ID row. |
| 2.7 | 2026-08-11 | Cleanup pass following 6039 Blue Iris Rd intake. Primary Contact and "How a New Listing Arrives" rewritten for the multi-rep submission model — Megan Cook is a regional director, not the intake funnel; reps (internally "NHCs" — New Home Consultants) submit directly, ideally via Andrew's current Cognito form (legacy form still in circulation). Cognito form identities confirmed via direct API lookup: current form is ID 17 (`LennarNewListingIntake`), legacy is ID 16 (`ZapierFormForLennarOLD`, 32 entries vs. 17's 2 test-only entries). New standing rule: when the current form is the source, sessions pull the entry directly from Cognito rather than parsing the email notification, which collapses field boundaries in its flattened text rendering. Matrix Entry Path Rules table updated: Wynwood at Fox Creek retired (sold out, no more listings expected); Creekside Run TH migrated `new` → `taxid` (first live confirmation: 6039 Blue Iris Rd, MLS# 2621807, first taxid pull outside Chesterfield County). Features A/B launchers marked ✅ Tested (three clean Lennar taxid runs). Step 7 POC guidance changed from a fixed name to "confirm the actual submitting rep." Step 10 annotated with current operational status — PandaDoc build retained in full as documented target state, but addenda are sent manually via TransactionDesk until the paid tier is reactivated. Stale "General Info Tax ID patch" and "Features A+B smoke test" items removed from Planned Automations as resolved. |
```

---

No other changes to `Lennar_New_Listing_Protocol.md`.

```bash
git add -A
git commit -m "Lennar Protocol v2.6 -> v2.7: multi-rep/NHC intake model, Cognito-direct-pull rule for Form 17, Creekside taxid migration, Wynwood retirement, Features A/B tested, PandaDoc hold status"
git push origin main
```

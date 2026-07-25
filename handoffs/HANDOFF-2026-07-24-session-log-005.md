---
title: Cursor Handoff — Project_Session_Log_v2.md — Session 005 entry
document_id: HANDOFF-2026-07-24-session-log-005
date: 2026-07-24
project: AAR-TC Transaction Services
---

Apply the changes below surgically to `docs/project/Project_Session_Log_v2.md`. Do not modify anything not listed here.

**Numbering note:** this entry is written as Session 005, on the assumption that Session 004 (PandaDoc Addendum Signing Automation, from the July 21 session) already landed in the log per its own handoff. If that entry isn't actually in the file yet, renumber this to 004 instead before applying, and flag it back so numbering stays consistent going forward — I couldn't independently confirm from this session whether 004 landed.

## Change 1

Append a new session entry to the end of the file, immediately after the most recent existing session entry (whichever is currently last — Session 004 if it landed, otherwise Session 003).

**Add:**

```markdown
---

## Session 005 — Cognito Lennar Intake Form Build
**Date:** July 24, 2026

### Focus
Replace the informal Carly/Megan email intake process (and the abandoned Zapier-linked stub form) with a real, Andrew-managed Cognito form for Lennar new-listing submissions. Build the form, validate its field list against actual rep knowledge via a live walkthrough, and get it into the sales team's hands.

### What Was Accomplished
- **Inventoried existing Cognito form landscape** — found three parallel/competing efforts: the org-level "Lennar VA / DC Metro" form Carly/Megan have been actively using since May (external, on Lennar's own Cognito account, not accessible via AAR-TC's API key), a personal prototype built by Izaiah Clark under his own Cognito account, and Andrew's own Form 16 ("Lennar In-take form"), an April stub with a fragile Chesterfield-string-matching address formula and a notification email that never included entry data. All three retired in favor of a single new form Andrew owns and manages.
- **Built Form 17 ("Lennar New Listing Intake")** in Cognito, modeled in part on Izaiah's field list and in part on the existing "Property Details Sheet" (Form 9) — specifically its conditional level-by-level bathroom input pattern (Levels with Bathrooms checkbox → per-level Full/Half Bath + Features subsections), which maps more directly onto the payload schema's per-level bath structure than Izaiah's flat field list did.
- **Live rep call correction pass** — Andrew ran a live walkthrough with the sales team using the general Property Details Sheet as a working reference (Entry #12, all-options-checked test entry), surfacing several corrections to previously-assumed statics: Washer/Dryer are universal across all builds (not fuel-related, as originally guessed from historical listing-email patterns); Gas Cooking vs. Electric Cooking is a genuine per-listing choice, not a Heat-Fuel-derived static as historical email data had suggested; Siding and Flooring both have real cross-listing variation, contradicting the current `Lennar_Payload_Schema.md` §5.1 pure-statics entries for both.
- **Established a Lennar-specific "static but visible" pattern** — several fields (Dishwasher, Microwave, Refrigerator, Washer, Dryer, Cooking Type) are backend-predictable but kept as checkable form fields anyway, so reps get active confirmation rather than an absence they might mistake for an omission.
- **Simplified several sections against Lennar-specific rules, confirmed by Andrew directly rather than inferred from data:** bathroom Full Bath is always Tub & Shower and Half Bath needs no Features distinction (Property Details Sheet's Features dropdown dropped from the new form entirely); garage is always attached with Direct Entry and Auto Door Opener whenever Garage = Yes (no separate form fields needed); Townhouse Unit Placement locked to exactly 2 options (End Unit, Interior Unit) rather than the general 8-option CVRMLS set.
- **Confirmed a real capability limit, not just a style preference:** neither the MCP connector's `generate_form` tool nor Cognito's own in-app AI form generator can edit an existing form — both only create new forms (confirmed against Cognito's own documentation). All field additions and workflow fixes this session were done by Andrew directly in the Cognito editor, with Claude providing build guides and post-edit schema verification passes rather than attempting AI-driven edits.
- **Sent the form live to the Lennar sales team.** Two real test entries submitted and reviewed (Entry #1, Entry #2) — core field capture confirmed working correctly, including decimal handling on Acres/Lat-Long (fixed this session) and conditional bathroom-level logic.
- **Partial workflow cleanup** — the two dead notification-email actions (blank recipient addresses) were deleted, leaving one working email to `agentandrewrich@gmail.com`. The surviving email's body text was not updated and still references several stale/incorrect merge-field paths — see Open Verification Items.

### Decisions Made
- **Form 17 is the sole Lennar intake mechanism going forward.** The org-level "Lennar VA / DC Metro" form, Izaiah's personal prototype, and Andrew's Form 16 stub (renamed "Zapier form for Lennar (OLD)," kept for history rather than deleted) are all superseded.
- **No builder-name field on the form.** Multi-builder reuse, when it comes, will be handled as a separate cloned/tweaked form per builder rather than one generic form with a builder selector — each builder is expected to have real quirks.
- **Appl/Equip static promotion:** Dishwasher, Microwave, Refrigerator, Washer, Dryer move from `Lennar_Payload_Schema.md` §5.4's "confirm per email" framing to genuine Lennar-wide statics. Cooking Type (Gas/Electric) stays per-listing — the original hypothesis that it tracked community Heat Fuel (from historical email-pattern analysis) was explicitly discarded once live rep input showed the pattern was survivorship of reps not knowing the full option set, not a real construction fact.
- **Siding and Flooring are not statics** as currently documented in `Lennar_Payload_Schema.md` §5.1 — real variation confirmed via live rep walkthrough. Protocol doc fix intentionally deferred until the form is fully locked (see Session Handoff Produced).
- **A stale doc-pointer bug was found, not yet fixed:** `Lennar_Payload_Schema.md` §6 claims the community Heating/Pool/Amenities lookup table lives in `Lennar_Community_Reference_Database.md`. It doesn't — confirmed by direct inspection this session. The table only exists in §5.2 of the payload schema itself. The migration promised in §5.2's own note never happened.

### Discrepancies Surfaced
- **Style field can retain a stale value after Property Type changes.** Observed live in Entry #2 — Style showed "Ranch" on a Townhouse entry, despite the field's conditional visibility formula (`=(PropertyType = "Single Family")`) hiding it. Cognito does not clear a field's stored value just because it becomes hidden. Not fixed this session — flagged as a real risk for whatever reads this data downstream, since Style must be disregarded whenever Property Type = Townhouse regardless of what's actually stored.
- **Style field's "Custom" option is still present**, despite Andrew's stated rule being just Ranch / 2 Story for Single Family. Left unresolved — confirm intent before the protocol update locks in the Style field's expected value set.

### Open Verification Items
- Email notification body still contains stale merge-field paths (`{{PropertyBasics.ListDate}}`, `{{Garage.Garage}}` / `{{Garage.NumberOfCars}}`, `{{Garage.DirectEntry}}`, `{{TownhouseUnitPlacement.UnitPlacement}}`, `{{FeaturesAppliances.FeaturesAndAppliances}}`, `{{BedsBathsLevels.AdditionalBathroomFeatures}}` referencing a field that was deliberately removed from the form, `{{Intake.SubmittedByEmail}}` referencing a field that was never added). A corrected body was drafted (see Key References) but not yet applied as of session end.
- The corrected merge-tag paths in that draft are Claude's best inference from the schema's object nesting, not confirmed against Cognito's actual rendering — recommend using Cognito's "Insert Field" picker to place them rather than trusting the draft's exact syntax, then verifying against a real test submission.
- Exterior Features section has a field labeled just "Features," sitting inside a section already titled "Exterior Features" — cosmetic, low priority.

### Key References
- Cognito Form ID 17, internal name `LennarNewListingIntake`, public form title "Lennar New Listing Intake"
- Retired: Form 16 ("Zapier form for Lennar (OLD)"), Izaiah Clark's personal prototype (`cognitoforms.com/IzaiahClark/...`), external org-level "Lennar VA / DC Metro" form
- Test entries: Form 17 Entry #1, Entry #2 (2026-07-24)
- Working documents produced this session (Andrew's local files, not yet in repo): `Lennar_Intake_Form_Cognito_AI_Prompt.md`, `Lennar_Intake_Form_Review_Notes.md`, `Lennar_Form_Field_Classification.md`, `Lennar_Form_Property_Basics_Build_Guide.md`, `Lennar_Form_Email_Fix_Guide.md`

### Session Handoff Produced
`Session_Handoff_Cognito_Intake_Form.md` — bridge doc scoping the `Lennar_Payload_Schema.md` and `Lennar_New_Listing_Protocol.md` updates needed to bring the protocol in line with the new form.
```

No other changes to `Project_Session_Log_v2.md`.

```bash
git add -A
git commit -m "Session 005: Cognito Lennar intake form build (Form 17) — session log entry"
git push origin main
```

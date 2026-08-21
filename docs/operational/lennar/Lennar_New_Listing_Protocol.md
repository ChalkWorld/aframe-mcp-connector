---
title: Lennar New Listing Protocol
document_id: LENNAR-OPS-PROTOCOL-002
version: 1.0
version_date: 2026-08-19
status: Active
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar Operational Project
supersedes: docs/lennar/Lennar_New_Listing_Protocol.md v2.9 (authoring source, frozen)
---

# Lennar New Listing Protocol

The workflow SOP for Lennar listing work — new listing intake, payload generation, and the lifecycle updates that follow (price changes, under contract, closed).

`Lennar_Project_Protocol.md` governs how sessions run. This doc governs what the session does. Where the two overlap, the Project Protocol is the authority and this doc points at it rather than restating it.

---

## Standing Rules

**Session lifecycle.** `Lennar_Project_Protocol.md` §3 is the authority for how a beat opens, runs, and closes — Intake Beat, Working Beats, Resume Beat, Session Close. Do not improvise a lifecycle; run the beat described there.

**Ambiguity.** `Lennar_Project_Protocol.md` §4.1 is the authority for when to derive and proceed versus when to stop and surface. The calibration in that section governs every step below.

**Escalation.** `Lennar_Project_Protocol.md` §4.2 is the authority for escalating anything that indicates a doc, schema, extension, tool, or community-data problem. Flag it to Andrew, generate the Issue Report, keep working. Do not fix it in-flight.

**Payload format conventions.** Checkbox array fields use one of two element formats, and using the wrong one is a silent write failure — no error, nothing written, the Matrix field simply stays blank on save. Fee Info and Owner Info arrays are suffix-only (`["19","01","25"]`); Features A/B arrays are full-ID (`["Input_541_19"]`). Verify format against `Lennar_Payload_Schema.md` §Format Conventions, or against the concrete payloads in `Lennar_Payload_Examples.md`, before generating any payload containing checkbox arrays.

**Activation double-check.** Whenever Andrew reports that a listing has gone Active — in any phrasing ("I just made 8724 active," "both are active now") — immediately surface the short list of easy-to-forget manual tasks that go with activation, without waiting to be asked:

1. ShowingTime — set Allowing Online Requests to "No"
2. Send the active listing email to the community sales rep(s) (Step 11)

Keep it to a quick nudge, not a full review. If multiple addresses are reported active in the same message, cover each by address rather than assuming they're all in the same state.

---

## Systems & Reference

| System | Purpose | Reference |
|---|---|---|
| **Airtable — Lennar Listings table** | Source of truth for listing state: address, community, model, price, status, dates, photos, POC, MLS Input Stage, addendum status, notes | Base `app78fMUwDNBHUZ6r`, table `tbllTArjNE464zFGi` — confirm the table on first access rather than assuming the ID |
| **Airtable — Community Reference DB table** | Source of truth for all per-community data: MLS Area, schools, HOA fees, management firm, fee includes, heating, heat fuel, pool, community amenities | Base `app78fMUwDNBHUZ6r`, table `tbleMbM1WgY8Si2t7` |
| Google Sheet — main tab | Authoritative for Status, Current Price, Closing Date, and Price Change Date only. **Read-only for sessions** — Andrew makes every write himself. Shared externally with the Lennar sales team | Sheet ID `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Cognito Forms | Primary intake source | Form `17`, internal name `LennarNewListingIntake` |
| Gmail | Intake and lifecycle emails; label tracks listing state | Label convention `Lennar/[Address]` — street number and street name only. Under contract: `Lennar/@Under Contract/[Address]`. Closed: `Lennar/Closed/[Address]` |
| Google Drive — Lennar root | Root folder for Lennar work | Folder ID `1hIN1WhrARVrQ7Y4KCh3hlCrI0Q-JS8az` |
| Google Drive — Properties folder | One subfolder per address; holds the tax record, the signed addendum, and the MLS listing PDF | Folder ID `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |
| PandaDoc | Listing addendum sending — **paid tier currently inactive**, addenda go out manually via TransactionDesk (Step 9) | Template ID `9DpcJ2wbwTkXvLh59aTPTn` |
| CVRMLS Matrix | MLS data entry. Sessions never touch Matrix directly — the session generates the payload and Andrew runs the extension | `Lennar_Extension_Reference.md` |

**Connector notes.** A few tool behaviors that fail quietly and are worth knowing before they cost a beat:

- Call `tool_search` before any Airtable tool loads. `Airtable:create_table` needs the exact phrase `"Creates a new table in an Airtable base"` to surface.
- Read current `tableId` and `fieldId` values with `Airtable:list_tables_for_base` rather than relying on memorized IDs.
- There is no field-creation tool on the Airtable connector. Andrew adds new columns in the Airtable UI; sessions populate them afterward with normal record writes.
- To write a `singleSelect`/`multipleSelects` value that isn't in the field's choice list yet, pass `typecast: true` on the create/update call. `Airtable:update_field`'s `options` param does not accept `choices`.
- Google Sheets reads: use `Zapier:execute_zapier_read_action` with action `_zap_raw_request` and tool `google_sheets_make_api_get_request` against `https://sheets.googleapis.com/v4/spreadsheets/{id}/values/'{Sheet Name}'!A1:Z###`. Zapier's abstracted `get_data_range` / `get_many_rows` actions have returned silently empty results on a populated worksheet.

---

## How a New Listing Arrives

The community's sales rep fills out the Cognito intake form directly. The submission triggers a notification email to Andrew's inbox from `notifications@cognitoforms.com`.

**Pull the entry from Cognito, not from the email.** The notification is a flattened text rendering with no reliable field delimiters — `Street Number:6,039Street Name: Blue Iris Road` collapses two fields into one unbroken string. Treat the email purely as a trigger and read the structured entry through the Cognito connector: check the Submitted view (`17-3`) for the newest entry, or call `get_entry` directly when the entry number is known.

Form 17 field-name prefixes: `Intake_*`, `PropertyBasics_*`, `BedsBathsLevels_*`, `SquareFootage_*`, `Remarks_*`, `Showing_*`, `PhotosVirtualTour_*`, `BuildFeatures_*`, `Notes_*`.

**Legacy form still in circulation.** Some reps default out of habit to an older form (ID `16`, `ZapierFormForLennarOLD`). Both forms produce usable intake data, but for legacy-form submissions the notification email is the primary data source. Flag it when a session sees the legacy form used, so reps can be steered to Form 17.

**No single funnel contact.** Reps submit their own listings; there is no manager or coordinator the intake routes through. Lennar calls these reps NHCs (New Home Consultants) — expect the abbreviation in signatures and threads. The POC recorded in Airtable is the rep who actually submitted the listing, confirmed from the intake itself, never a defaulted name.

Rep roster by community: *(stub — reps shuffle. Confirm current contacts at the start of any session involving community-specific email.)*

---

## Source of Listing Data

From the intake (form entry or, for legacy submissions, the email):

- Property address — verify carefully; street numbers sometimes carry comma artifacts (`15,912` → `15912`)
- Community, list price, property type, beds, baths, levels, garage, square footage
- Public remarks and agent-only comments
- Showing instructions
- Virtual tour link, if provided
- Appliances and build features
- Any notes to Andrew — these sometimes carry photo instructions that appear nowhere in the structured fields

Per-community data — MLS Area, schools, HOA and fee values, heating, heat fuel, pool, community amenities — comes from the Airtable Community Reference DB table, never from the intake.

---

## Compliance Rules (Non-Negotiable)

- **No phone numbers in public remarks.** CVRMLS prohibits them. If the last line of public remarks contains a phone number or "call [number]", remove it. The correct closing line ends with "...finishes, and layout may vary." Flag the removal to Andrew.
- **Do not activate.** A listing must not go Active in MLS until the signed addendum is on file. Sessions never touch activation — Andrew activates manually in Matrix.
- **Duplicate check before creating anything.** Search the Airtable Lennar Listings table by MLS# and by address. Reps have submitted duplicates before.
- **List date is always today** — never the intake email date or the form submission date.
- **The Google Sheet main tab is read-only for sessions.** It is visible externally to Lennar sales contacts. Sessions read it; Andrew writes it.

---

## Appliance Formatting Rules

- Alphabetical order
- "Microwave Over Range" → **Microwave**
- "Washer & Dryer" → **Dryer** and **Washer** as separate entries
- Gourmet kitchen descriptors (e.g. "Gourmet Kitchen - Gas Cooktop") → break into individual appliances; drop the marketing label

---

## Matrix Entry Path Rules by Community

Before the tabbed input view, Matrix offers three listing creation paths. The path determines which fields Matrix pre-populates and therefore which fields the payload carries.

- `new` — clean slate; the payload carries every field
- `taxid` — location and tax fields pre-populate from the parcel tax record; the payload omits those
- `copy` — most fields pre-populate from an existing listing; the payload carries listing-specific fields only. *Not yet in use — requires a clean template listing per community.*

| Community | Path | Notes |
|---|---|---|
| Harpers Mill TH | `taxid` | Tax records populated |
| Harpers Mill SF | `taxid` | Tax records populated |
| Creekside Run TH | `taxid` | Migrated from `new` in August 2026. Richmond City rather than Chesterfield County; general taxid behavior holds, jurisdiction-specific edge cases not fully ruled out |
| Everstone SF | `new` | Tax records not yet populated. Subdivision is `None` with Neighborhood `Everstone` — Everstone does not appear in the Subdivision dropdown |
| Watermark SF | `new` | Tax records not yet populated |
| Wynwood at Fox Creek SF | **retired** | Sold out; no further listings expected |

`Lennar_Payload_Schema.md` §3 is the authority for path values and §3.1 for path-specific payload behavior. Path assignments change as Lennar's parcels get filed in tax records — a community on `new` today may migrate to `taxid`. If the intake community's path looks wrong for what Matrix actually shows Andrew, surface it and file an Issue Report.

---

## New Listing — Session Steps

### 1. Read the Intake

Read it in full before doing anything else. Notes-to-Andrew fields and rep forwarding notes carry photo instructions that don't appear in the structured form data.

### 2. Verify the Address

Cross-check against the Airtable Lennar Listings table and confirm the listing isn't already there. Fix comma artifacts in the street number.

### 3. Apply the Gmail Label

Check whether `Lennar/[Address]` already exists — an existing Gmail filter often applies it before the session starts. If it doesn't exist, create it directly (`Gmail:create_label`) rather than flagging it as a manual task for Andrew. Apply it to the intake email and any related threads either way. This step is session-owned end to end.

### 4. Parse & Present Listing Data

Present a clean summary to Andrew before generating anything. Flag:

- Any phone numbers in public remarks or agent comments
- Missing fields — virtual tour, showing instructions, square footage
- Photo instructions from the rep's notes
- Address discrepancies

Andrew confirms before the session proceeds.

### 5. Generate the Payload

The payload is the session's primary output. There is no intermediate data sheet artifact — the session generates the payload, Andrew pastes it into the extension's side panel, and Andrew reviews each field fill in Matrix as the extension populates it.

`Lennar_Payload_Schema.md` is the authority for every field: payload keys, Matrix Input IDs, statics, path-specific include/omit rules, and the Features subset. `Lennar_Payload_Examples.md` carries complete concrete payloads for both paths — load it on a fresh intake as a shape reference.

Generation checkpoints:

- **Envelope and community.** Every Lennar payload carries `mls: "cvrmls"`, `builder: "lennar"`, `path` per the community table above, and a top-level `community` key set to the exact community display name. `phase` is never present. See Schema §2 and §2.1.
- **Community lookups.** Resolve every community-driven value from the Airtable Community Reference DB table before generating — the extension does not read the `community` key, so every value must already be concrete. See Schema §6.
- **Path omissions.** On `taxid`, omit the fields Matrix pre-populates from the parcel. Owner Name always force-overwrites to `"Lennar"` and Assd Improvement always writes `"0"`, on both paths. See Schema §3.1 and the per-tab path rules in §4.
- **Style is always populated.** Townhouse is `["Input_541_19"]` (Rowhouse/Townhouse). Single Family comes from the form's three-option set per Schema §5.4.1 — never leave it `[]`.
- **Showing instructions.** Verbatim from the intake. On Form 17, a blank `Showing_AdditionalShowingInstructions` stays blank — no fallback to agent-only comments, which may carry a phone number or other text never meant to be showing-facing. The agent-comments fallback applies to legacy/email-sourced intake only.
- **Virtual tour.** Omit the `tour` key entirely when no link was provided.
- **Room Info.** No `room` key — Lennar skips the tab entirely.
- **Checkbox array format.** Verify against Schema §Format Conventions before output. Wrong format writes nothing and reports nothing.

Fill flow, for what to expect back from Andrew:

1. Session outputs the payload as a single copy-ready JSON block.
2. Andrew creates the listing in Matrix via the correct entry path for the community.
3. Andrew pastes the payload once into the extension's side panel and clicks through the Lennar-scoped tabs; the extension fills whichever tab is showing. See `Lennar_Extension_Reference.md` §2.
4. Andrew reviews the populated fields before saving each tab and reports the outcome.
5. The Status tab is never automated — Andrew activates manually.

Handle Andrew's feedback per `Lennar_Extension_Reference.md` §4. Field-write errors and detection misses are Issue Report material, not in-session debugging.

### 6. Sync Status/Price Deltas, Then Check the Google Sheet Row

The main tab stays read-only. Read it twice this step:

1. Confirm the new listing isn't already present — this is the sheet-side half of the duplicate check.
2. Diff Status, Current Price, Closing Date, and Price Change Date for *existing* Airtable rows against what the sheet shows, matching by MLS#, and apply any deltas to Airtable. This is the sync point that keeps the two tools from drifting; it runs at every new-listing intake, so drift never goes back further than the last one.

Then, based on the duplicate check:

- **Row already on the sheet:** check it for accuracy — address, List Price, Community, position (grouped by community, then SF or TH, descending numeric order), and the Column A hyperlink. Flag any mismatch in the Step 10 handoff; say nothing further if it checks out.
- **Row not there yet:** give Andrew a plain reminder to add it (address, List Price, Community) in the Step 10 handoff. He knows the sheet's conventions — the reminder only needs to flag that it's still pending.

> **Column A hyperlink source.** The hyperlink on the address text in Column A points to the MLS listing PDF that Andrew exports from Matrix once the listing is Active and saves to the Google Drive property folder. Session does not touch the sheet or the hyperlink — this is Andrew's manual post-activation step (see Step 10). The session's responsibility is to include the post-activation reminder in the Step 10 handoff.

### 7. Add the New Row to Airtable

Add the listing to the Lennar Listings table:

- Address, Community, List Price (as `Current Price`), Status = Input in Progress
- Intake Date = today
- Addendum Status = Pending
- Gmail Thread ID
- POC = the rep who actually submitted the listing, confirmed from the intake
- MLS Input Stage = Not Started
- Photo Status and Photo Source, if known from the intake notes
- Model name, if present

### 8. Create the Google Drive Property Folder

Inside the Properties folder (`1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B`), create a subfolder named `[Street Number] [Street Name]` — e.g. `15912 Greenhart Dr`. This folder holds the tax record, the signed addendum once returned, and the MLS listing PDF.

### 9. Send the Listing Addendum

**Current state: sent manually.** The PandaDoc paid tier is inactive, so Andrew sends and tracks the listing addendum through TransactionDesk, outside the session. The session's job at this step is to flag that the addendum needs to go out and to track its status in Airtable.

The PandaDoc integration is built, tested, and documented — template ID `9DpcJ2wbwTkXvLh59aTPTn`, with Megan Cook as the Owner signer and Gary Martin as the Agent signer (routed to Andrew's email, deliberately). It resumes as a session-executed step the moment the tier is reactivated. Sessions do not attempt to send through PandaDoc while the tier is inactive.

Either way, set Addendum Status to `Sent` in Airtable once it goes out, and:

- **Send early in intake** — don't hold the rest of the session waiting on a signature.
- **Check for a future launch date.** Occasionally an intake asks for activation on a specific future date rather than immediately. If a stated launch date is in the future, hold the addendum and send it on that date instead. Flag any held send clearly in the handoff so the next beat follows through.
- **Multiple listings at once** are handled one after another in the same session; there is no batch path.

> **HARD RULE: a listing cannot go Active in the MLS under any circumstances until the signed listing addendum is on file. Do not mark the activation handoff item complete and do not prompt Andrew to activate until the signed addendum has been received and saved to the Google Drive property folder.**

### 10. Session Handoff Summary

Close every beat with a clear handoff of what still needs Andrew's action:

- [ ] Google Sheet main tab — per Step 6: either confirmed accurate, with any mismatch flagged, or a plain reminder to add the row
- [ ] MLS data input — paste the Step 5 payload into the extension side panel and click through the Lennar-scoped tabs
- [ ] Manual Matrix fields the extension never touches: **Map** and **Directions** — enter these while reviewing the extension's fills (`Lennar_Extension_Reference.md` §5)
- [ ] ShowingTime — set Allowing Online Requests to "No". Keeps buyer agents from contacting Gary Martin directly to request showings
- [ ] Photos — download/save, then upload and reorder in MLS: exterior first, bathrooms to the back
- [ ] Save the MLS# back to Airtable once assigned, and surface it for manual entry on the Google Sheet main tab
- [ ] Save the signed addendum to the Google Drive property folder once returned
- [ ] Activate the listing in MLS once the signed addendum is on file
- [ ] Post-activation: export the MLS listing PDF from Matrix, save it to the property Drive folder, and hyperlink the address in Column A of the Google Sheet main tab to that PDF
- [ ] Send the active listing email to the community sales rep(s)

### 11. Active Listing Email — Stub

*Not yet fully specified. Do not treat as executable guidance. Parked as a future addition per `Lennar_Project_Protocol.md` §5.3.*

When Andrew reports the listing has gone Active, the session composes and sends the "now active" notification to the appropriate community sales rep(s).

- **Trigger:** Andrew reports the listing is Active
- **Recipients:** TBD — rep roster by community is still a stub
- **Content:** notify the Lennar reps that the listing is active
- **Attachment:** the MLS listing PDF. Source TBD — most likely a Matrix-exported listing PDF

This replaces functionality that was previously handled through a separate transaction-tracking tool no longer used in this workflow.

---

## Lifecycle Updates

Rep emails announcing lifecycle events are Resume Beats — see `Lennar_Project_Protocol.md` §3.3. Reconcile against the Airtable row before acting; the row is the durable record.

Price adjustments and status changes must be entered in Matrix by Andrew himself. Recording them in Airtable and surfacing them for the Google Sheet is the session's half of the work, not the whole of it.

### Price Adjustment

1. Read the email; confirm address and new price.
2. Surface the proposed main-tab update to Andrew — Current Price plus today's date in Price Change Date. Andrew applies it.
3. Update Current Price and Price Change Date in Airtable.
4. Flag the Matrix update in the handoff — Andrew enters it.
5. Apply the Gmail label if not already applied.

### Under Contract

1. Surface the proposed main-tab status change to **Pending**, plus the closing date if known. Andrew applies it.
2. Update Status and Closing Date in Airtable.
3. Update the Gmail label to `Lennar/@Under Contract/[Address]`.
4. Flag the Matrix status change in the handoff — Andrew enters it.

### Closed

1. Surface the proposed main-tab status change to **Closed**, plus the confirmed closing date. Andrew applies it.
2. Update Status and Closing Date in Airtable.
3. Update the Gmail label to `Lennar/Closed/[Address]`.
4. Flag the Matrix status change in the handoff — Andrew enters it.

---

## Photo Notes

Photos are often reused across listings within the same community. When the intake references another listing's images, capture that in Airtable under Photo Source. Check the Google Drive property folders for existing photos before requesting new ones from the rep.

**Virtual tour pairing.** Whenever an image-reuse instruction references a prior address, also search Gmail for that address's thread and check it for a virtual tour link before finalizing the payload. Virtual tours are tied to model plus community, so they travel with the photos more often than not. If found, carry it into the payload's `tour` key; if genuinely absent, proceed without it — but check either way, whether or not Andrew asked.

Photo upload order in MLS: exterior first, bathroom photos to the back.

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-08-19 | Initial operational version. Derived from `docs/lennar/Lennar_New_Listing_Protocol.md` v2.9 (frozen as historical reference). Rewritten for operational scope per Session 015 design. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

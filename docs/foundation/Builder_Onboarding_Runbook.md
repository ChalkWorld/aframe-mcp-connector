---
title: Builder Onboarding Runbook
document_id: FOUND-ONBOARDING-RUNBOOK-001
version: 0.3
version_date: 2026-10-19
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Builder Listing Automation
---

# Builder Onboarding Runbook

Working checklist for onboarding a new builder onto the automation stack. Scoped as a project-internal reference — assumes the reader has the ops overview and tracker available for context. The job is "don't miss anything," not "teach the system from scratch."

Living doc. Update version history and version_date with each revision.

---

## 1. Intake checklist (gather from the builder)

Most of this comes from a scoped NHC phone call, 30-60 minutes with a cooperative NHC lead or sales manager. The rest comes from the Listing Agreement, from existing MLS history (see §2), or from the builder's public-facing material.

### 1.1 Personnel

- [ ] NHC roster — every NHC who may submit intakes. Full name as it appears on MLS, email address, phone, which communities each one covers.
- [ ] Email convention — do NHC emails follow `firstname.lastname@builder.com` or something else? Needed because the Personnel Roster is used to resolve NHC email from NHC name on the Cognito form.
- [ ] **Sales manager** — name, email, phone. This is the builder-side primary contact: approves changes, resolves escalations, and is the point of contact if a form or process needs adjustment. Critical to identify explicitly up front, not conflated with "whoever picks up the phone."
- [ ] **Addendum signer(s)** — who on the builder side will sign the Listing Agreement addendum for each listing. May be the sales manager, may be a regional VP, may vary by community or by price band. Needed because the PandaDoc Owner role is assigned at document create time; getting this wrong means every listing's signing request routes to the wrong person and either stalls or gets rejected. Capture name, email, and the rule for which-signer-when if more than one is in play.
- [ ] Sales management chain — who the NHCs report to above the sales manager. Useful for scoping the NHC call and for later process-change conversations.

### 1.2 Communities

For each community the builder currently sells in, gather:

- [ ] Community name (as the NHC says it — this becomes the `Intake.Community` value on the Cognito form).
- [ ] Property types the community offers (SF, TH, or both — determines whether the Community Reference DB gets one row or two).
- [ ] Address, County/City, Zip (for the Community Reference DB).
- [ ] HOA fee amount, period (monthly/quarterly/yearly), and whether the fee is community-association or condo-association.
- [ ] Additional HOA fee amount and description if any.
- [ ] Capital contribution amount if any.
- [ ] Pool Y/N.
- [ ] Standard features that vary by community (heating codes, fuel codes, exterior features that differ from the builder's broader standard package).
- [ ] Subdivision as the MLS expects it to appear (not always the same as the community name).
- [ ] Entry path — `new` (no tax record yet) or `taxid` (tax records populated). This often changes over a community's lifetime; capture the current state.

The MLS-history pattern (§2) covers Area, schools, Zip, and path extraction more efficiently than asking the builder's team for most of this. Use the NHC call for the HOA/fee/capital-contribution data and the operational notes.

### 1.3 Property models

- [ ] List of model names the builder sells, with property type for each (SF or TH).
- [ ] Any model-specific defaults the builder treats as standing (e.g. "all Ranch models are one-level, all Townhomes are three-level").
- [ ] Features that vary by model within a community — anything that would make the Payload Rules diverge from a straight passthrough.

### 1.4 Listing agreement terms

The Listing Agreement is the source of truth for Lennar-wide STATIC rules — things like Delayed Show flag, Owner contact handling, Internet Display preferences, Showing Instructions defaults, Copyright Agreement acknowledgment. For each new builder:

- [ ] Get a copy of the signed Listing Agreement.
- [ ] **Expiration date / Expire Date (Matrix Input_89).** This goes into every payload the script generates for this builder — it's a Builder-layer STATIC. Capture the exact date. If the agreement renews annually (typical), capture the renewal convention so this STATIC can be updated at the right time without a listing landing with a stale date mid-year.
- [ ] Walk the agreement against Lennar's STATIC rules in the Payload Rules base — anything that differs becomes a new STATIC rule for this builder.
- [ ] Confirm any rules that are "always this way" vs. "sometimes this way" — the former is STATIC, the latter needs a Cognito field.

### 1.5 MLS confirmation and limited-rep agent

- [ ] Confirm the builder uses CVRMLS (the only MLS this system currently supports). If they use a different MLS, that's an MLS-layer workstream — adding a second MLS base to Airtable — not just a Builder-layer onboarding.
- [ ] **Limited representation agent(s) for this builder.** The working assumption is **not Gary** for new builders — Gary is Lennar's limited-rep agent, and new builders will typically bring their own. Capture the agent (or agents, plural — new builders may co-list with two agents on the limited-rep role) with full name, MLS agent code, office code, email, and phone for each. Needed for the Agent/Office Info tab's STATIC rules and for the PandaDoc Agent role assignment.
- [ ] If two agents co-list, confirm which one is primary and which is co-agent — Matrix's Agent/Office Info tab supports both roles natively (primary agent + co-agent fields). The current script and extension write only the primary; when a co-listing builder is onboarded, the app code needs to be updated to also populate the co-agent static inputs. Cross that bridge when the case comes up — flag it here so the first co-listing builder doesn't surface it as a surprise.

### 1.6 Photos workflow

- [ ] Delivery mechanism — does the builder deliver photos via a shared Drive folder, Dropbox, email attachment, Box link, or something else?
- [ ] Naming convention — do photo files arrive with meaningful names or just numbered?
- [ ] Reuse pattern — does the builder reuse photos across listings in the same community (model-type photos), and if so what's the convention for noting it?
- [ ] Virtual tour pattern — does the builder provide a virtual tour URL, and if so where?
- [ ] **File size for MLS.** Photos must be sized correctly for CVRMLS before upload — Matrix enforces maximum dimensions and file size per photo. Confirm the builder delivers photos at a size the operator's photo-sorter applet can handle, or that the photo-sorter is doing the resize step before Matrix upload. If photos arrive at raw camera resolution and the resize step isn't automated, this becomes manual pre-upload work on every listing. Not a Cognito-form question — a workflow question that affects how much time photo handling adds per listing.

The Cognito form will carry the `PhotosVirtualTour.VirtualTourLink` field and the `PhotosVirtualTour.ReusePhotosFromAPreviousListing` field (both authored on Form 17); the question here is how the NHC will populate them in practice.

### 1.7 Cognito form authoring

Form 17 (Lennar) is the template for every new builder's intake form. Clone it, rename it, then walk the form section-by-section with the NHC lead to identify divergences. In practice:

- [ ] Most sections carry over cleanly — Intake, PropertyBasics, BedsBathsLevels, SquareFootage, BuildFeatures, PhotosVirtualTour, Remarks.
- [ ] The **Features tab is the expected divergence point.** Different builders have different standard build packages (appliances, flooring, siding, interior features). Walk this section carefully with the NHC lead and adjust the dropdown options to match what this builder actually offers.
- [ ] Confirm the Personnel section's NHC dropdown gets re-populated with this builder's NHC roster.
- [ ] Confirm the Community dropdown gets re-populated with this builder's communities.

---

## 2. Operator-extracted data (MLS history pattern)

For an established builder with existing CVRMLS history, the following data is faster to pull from the MLS than from the builder's team:

- Community Area code (CVRMLS integer).
- Elementary / Middle / High school stored values.
- Zip code (when it varies by community).
- Current entry path (`new` vs. `taxid` — determined by whether tax records populate for the parcels).

Pull 2-3 past listings per community from the builder's MLS history, extract these fields from the Matrix entry, and populate them into the Community Reference DB directly. Faster than asking the builder's operations team to fill out a spreadsheet, and more accurate (the data comes from the actual MLS entries that worked).

For a greenfield builder with no CVRMLS history, this data has to be gathered from the builder's team or looked up directly (County GIS for Area, local school district for schools).

---

## 3. Scaffold checklist (apply the gathered data)

Sequential. Each step depends on the previous one being done.

### 3.1 Cognito

- [ ] Clone Form 17 → new form, named `<Builder> New Listing Intake`.
- [ ] Rename section labels and helptext that reference "Lennar" to this builder's name.
- [ ] Walk the Features tab and adjust options to match this builder's standard packages (per §1.7).
- [ ] Populate the Personnel dropdown with this builder's NHC roster.
- [ ] Populate the Community dropdown with this builder's communities.
- [ ] Set the form to accept submissions.
- [ ] Note the form's ID (an integer, e.g. 18) and the Submitted view's OData ID (also an integer, often different from the form ID — Form 18's is 5, not 18).

### 3.2 Airtable

- [ ] Clone the Lennar Payload Rules base. The clone should include all 5 tables: Payload Rules, Cognito Fields, Source Types, Community Reference DB, Personnel Roster.
- [ ] Rename the base to `<Builder> Payload Rules`.
- [ ] Drop the Lennar prefix from table names (`Personnel Roster` not `Lennar Personnel Roster`).
- [ ] Delete all Payload Rules rows, Cognito Fields rows, Community Reference DB rows, and Personnel Roster rows. Keep the 5 Source Types enum rows but reword any Lennar-specific examples in their Notes fields.
- [ ] Verify the Property Type multi-select on Payload Rules has only `SF` and `TH` (not the Lennar base's orphan `Single Family` / `Townhouse` options).
- [ ] Note the base ID and the IDs of all 5 tables.
- [ ] Author the builder's Payload Rules — walk the Cognito form section by section, author STATIC / COGNITO / COMMUNITY_DB / DERIVED rules per the Payload Rules Conventions. Most will mirror Lennar's rules structurally; divergences come from Listing Agreement terms (§1.4) and Features-tab differences (§1.7).
- [ ] Populate Cognito Fields with the dotted paths the Rules reference.
- [ ] Populate Community Reference DB with one row per community (combined with property type if the community has both).
- [ ] Populate Personnel Roster with the NHC data from §1.1.

### 3.3 Google

- [ ] Create `<Builder>/` folder at the Drive root.
- [ ] Create `<Builder>/Properties/` subfolder.
- [ ] Copy the Lennar Listings Sheet into `<Builder>/` and rename to `<Builder> Listings Sheet`.
- [ ] Clear all listing data from the copied sheet. Keep the header row and column structure.
- [ ] Note the Drive folder ID, Sheet ID, and the sheet's tab ID (`gid` in the URL) and tab name.
- [ ] Decide on the target row for new-listing inserts (depends on whether the sheet has a community-block layout — Lennar uses row 45 because of the layout above/below, a greenfield sheet uses row 2 or thereabouts).

### 3.4 `builders.py` registry

- [ ] Add a new entry keyed by builder slug (e.g. `"ryan-homes"`).
- [ ] Fill in: `display_name`, `mls_tag`, `cognito_form_id`, `submitted_view_id`, `airtable_base_id` + 4 table IDs, `drive_properties_folder_id`, `sheet_id`, `sheet_tab_id`, `sheet_tab_name`, `sheet_target_row`, `community_resolver`.
- [ ] Default `community_resolver` to `"lennar_default"` unless this builder's Cognito form structures Community + PropertyType differently.
- [ ] Add the builder's slug as an `<option>` in the extension's `sidepanel.html` dropdown.
- [ ] Bump the extension manifest version.
- [ ] Commit, push, let Railway redeploy.

### 3.5 Smoke test

- [ ] Health check: `GET /` on the Railway service returns ok.
- [ ] Submit a real or test Cognito entry for the new builder.
- [ ] Open the extension, select the new builder, confirm the picker populates.
- [ ] Load the entry — payload should generate (will be mostly empty if the Payload Rules haven't been fully authored yet, which is normal for a scaffold-complete-but-rules-pending state).
- [ ] Once Rules are authored, run a full Matrix fill against a real listing and confirm each tab fills correctly.
- [ ] Click Generate listing prep — confirm the Drive folder, prep email, and Sheet row all land.

---

## 4. Credential scoping

The two production catches that have surfaced during onboarding (session 2's Builder X scaffold) both come from credentials that are scoped per-resource at creation time and don't automatically extend to new resources. Easy to forget, annoying to debug when missed — the symptom is a 403 on the first `/generate` or `/recent-entries` call for the new builder.

- [ ] **Cognito API key** — open Cognito admin → API Keys → edit the existing `COGNITO_API_KEY` → add the new builder's form ID to the authorized-forms list.
- [ ] **Airtable PAT** — open Airtable Builder Hub → Personal access tokens → edit the existing `AIRTABLE_PAT` → add the new builder's Payload Rules base to the "Access to bases" list.
- [ ] **GCP OAuth refresh token** — nothing to do. GCP scopes by API scope at consent time (Drive, Gmail, Sheets), not by per-resource grant. The new builder's Drive folder, Sheet, and Gmail account inherit automatically.

If a 403 surfaces on the first smoke-test call for a new builder, these are the first two things to check.

---

## 5. When done, you have…

Self-check — at the end of a successful onboarding, the following artifacts exist and are reachable:

- A Cognito form at `<Builder> New Listing Intake` with a known form ID and Submitted view ID.
- An Airtable base at `<Builder> Payload Rules` with 5 tables, Source Types seeded, Payload Rules authored, Cognito Fields populated, Community Reference DB populated with one row per community, Personnel Roster populated with NHC data.
- A Drive folder structure at `<Builder>/Properties/` under the operator's Drive root.
- A Google Sheet at `<Builder> Listings Sheet` with the lifecycle-tracker column structure.
- An entry in `builders.py` with the slug, config, and all four GCP / Airtable / Cognito / Sheet IDs filled in.
- An `<option>` in the extension's `sidepanel.html` dropdown.
- The `COGNITO_API_KEY` scoped to include the new form.
- The `AIRTABLE_PAT` scoped to include the new base.
- A successful smoke test — real Cognito entry → Load → Matrix fill → Generate listing prep → folder + email + Sheet row.

If any of these are missing, the onboarding is incomplete. The system will fail at a predictable point for each missing piece.

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-10-19 | Initial authoring as part of the Phase 4 wrap-up. Scope: project-internal working checklist, not cold-read reference. Covers the intake data to gather from the builder, the operator-extracted data pattern, the sequential scaffold steps, the credential-scoping sub-checklist, and the self-check at the end. Reflects Workstream A session 1 and session 2 learning (v0.21 and v0.22 in the phase tracker). |
| 0.2 | 2026-10-19 | Operator refinement pass. §1.1 split the single "builder-side primary contact" bullet into explicit **sales manager** and **addendum signer(s)** items (addendum signer is critical for PandaDoc Owner role assignment at document create time and was implicit before). §1.4 added **expiration date** as its own bullet (Matrix Input_89 Expire Date is a Builder-layer STATIC in every payload). §1.5 renamed to "MLS confirmation and limited-rep agent" and rewrote the Gary assumption — new builders typically bring their own limited-rep agent, potentially two agents co-listing; captures what to gather and the one-agent-of-record constraint on Matrix. §1.6 added **file size for MLS** bullet (photos must be sized to CVRMLS limits before upload; this is a workflow question affecting per-listing time, not a Cognito field). All refinements come from the operator's experience with Lennar; future revisions after the first real builder onboarding will likely refine further. |
| 0.3 | 2026-10-19 | §1.5 co-listing bullet corrected. v0.2 incorrectly stated Matrix supports one agent of record per listing and suggested co-list representation via the Agent-Only Comments field as a fallback. Matrix's Agent/Office Info tab natively supports both primary agent and co-agent fields; the current app code only writes the primary. Updated the bullet to flag that onboarding a co-listing builder will require an app-code update to populate the co-agent static inputs, with the explicit "cross that bridge when the case comes up" framing so the first co-listing builder doesn't surface it as a surprise. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

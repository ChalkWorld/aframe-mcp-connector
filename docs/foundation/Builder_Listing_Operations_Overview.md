---
title: Builder Listing Operations Overview
document_id: FOUND-OPERATIONS-OVERVIEW-001
version: 0.2
version_date: 2026-10-19
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Builder Listing Automation
---

# Builder Listing Operations Overview

The system-level reference for how the builder-listing automation works end-to-end. Scoped for two readers: an LLM reading cold that needs a complete mental model of the pieces and how they fit, and an operator (new or returning) that needs to run a listing through the extension without being lost. Not a tutorial for real-estate operations, Matrix, or the broader listing lifecycle — those are the operator's world and this doc assumes fluency in them. The subject is specifically the automation stack that sits between a builder's new-listing form submission and a Matrix listing being ready for photos and signing.

Living doc. Update version history and version_date with each revision.

---

## 1. What this system is and isn't

### What it is

An automation stack that takes a new-listing form submission from a home builder's intake form and produces a fully-populated Matrix listing (CVRMLS, Richmond-area MLS), a Google Drive folder structured for photos and documents, a prep email with the operator's working materials for the manual steps that remain, and a row in a Google Sheet lifecycle tracker. One builder (Lennar) is live in production as of this writing; the architecture is multi-builder by design and a second builder (Builder X, hypothetical) exists in the stack as a wiring proof.

The system's job starts when a builder's New Home Consultant (NHC) submits an intake form and ends when the listing is in Matrix with everything the operator can automate already filled in. The operator then handles photos, signing, and the rest of the listing's lifecycle outside this system.

### What it isn't

Not a listing-management system, not a transaction-management system, not a CRM. It doesn't track listings across their lifecycle (the Google Sheet does, as a lightweight tracker, but it's a tracker not a system of record). It doesn't handle the pre-listing relationship with the builder, doesn't manage NHC relationships, doesn't do anything with contracts or closings. The Chrome extension's single job is to fill a Matrix listing's input tabs and kick off the prep work for the human-handled steps that follow.

### The surrounding world (named-but-not-explained)

The doc assumes the reader knows what these are:
- A **builder** is a home-construction company whose newly-built homes become MLS listings. Lennar is one, Ryan Homes and DR Horton are examples of others.
- An **NHC** (New Home Consultant) is a builder-side employee who sells the builder's homes and submits the listing-intake forms when a home is ready to go on the market.
- An **agent** is the licensed real-estate agent of record on the MLS listing — in this operation, that's Gary, with Andrew acting as transaction coordinator.
- A **listing** has a lifecycle (intake → MLS entry → marketing → showings → offers → contract → closing). This system touches only the intake-to-MLS-entry portion.
- **Matrix** is the CVRMLS listing-entry web application. Listings live there once entered.
- **PandaDoc** is the signing platform used for the Listing Agreement addendum.
- **Cognito Forms** is the form-hosting platform where the builder's intake form lives.

Everything else is this system.

---

## 2. The layer model

The architecture separates concerns into three layers. Understanding this is the key to understanding why the pieces are organized the way they are.

### MLS layer (objective, per-MLS)

Facts about how CVRMLS Matrix works — what fields exist on each tab, what codes those fields accept, which dropdowns cascade into which others. These are the same for any listing in CVRMLS regardless of who the builder is. Lives in the **CVRMLS Matrix Fields** Airtable base. A second MLS (if ever added) would get its own base in parallel; nothing at the Builder or Instance layer would need rearchitecting.

### Builder layer (policy, per-builder)

Decisions about how a specific builder's input data maps to Matrix fields. Lennar lists all its homes as `Residential/Detached` or `Residential/Attached`. Lennar's Fee Description is community-specific (Condo Association vs. Community Association). Lennar's Public Remarks don't include a Sales Hotline. These are policy choices that vary per builder. Lives in a per-builder Airtable base — currently the Lennar base and the Builder X base. Each builder's base holds its own Payload Rules, Cognito Fields reference, Source Types enum, Community Reference DB, and Personnel Roster.

### Instance layer (per-listing)

The actual data for a specific listing. A Cognito form submission, the payload generated from it, the Matrix entry it produces, the Drive folder for it, the Sheet row tracking it. Nothing persistent at this layer other than those operational artifacts.

### Why this matters

New builder onboarding is a Builder-layer activity — clone the Cognito form, clone the Airtable base, add a registry entry. The MLS layer is untouched; the Instance layer is produced automatically when the new builder's first listings come through. Adding a second MLS someday would be an MLS-layer activity. The layer discipline is what makes the system scale without rewrites.

---

## 3. The pieces

Each component gets a short description below. Read in roughly data-flow order — a Cognito submission at the top, a Sheet row at the bottom.

### 3.1 Cognito form

The intake form the builder's NHC fills out when a new home is ready to list. One form per builder (Lennar's is Form 17 "LennarNewListingIntake"; Builder X's is Form 18 "Builder X New Listing Intake"). The form captures everything that varies per listing: address, price, model type, lot/homesite number, bedroom and bathroom counts, square footage, features (interior, exterior, appliances, flooring, siding), basement details, garage details, and so on. Fields the system reads are mirrored into the per-builder Airtable "Cognito Fields" table so the Payload Rules can reference them by dotted path.

Each builder's Cognito form has a "Submitted" view that the extension queries to populate its entry picker. The view's OData ID is **not** the same as the form ID — Form 17's Submitted view is `17-3` as human shorthand but `3` in OData; Form 18's is `18-5` / `5`. View IDs shift on clone.

### 3.2 Airtable: CVRMLS Matrix Fields base (MLS layer)

Reference base describing CVRMLS Matrix itself. Shared across all builders. Four tables of note:

- **Residential Input Form** — one row per Matrix field across all 12 Matrix input tabs. Columns capture field type, character limits, cascade parents, options, and so on.
- **Field Options** — one row per option value for every select or checkbox field. Rows are referenced by Residential Input Form rows via a link column.
- **Cascade Options** — one row per option value for cascade-scoped fields (Area, Elementary School, Middle School, High School — their valid options depend on the selected County/City). Separate from Field Options because the same option label can mean different things under different parent values.
- **Field Types** / **Sections** — enum tables supporting the above.

This base is the authoritative answer to "what does Matrix expect in this field?" The script reads it at generate time to validate and format outputs. Operators consult it when authoring new Payload Rules.

### 3.3 Airtable: per-builder Payload Rules base (Builder layer)

One base per builder. Five tables:

- **Payload Rules** — the main table. One row per Matrix field the script writes, saying how to produce the value: STATIC (fixed value), COGNITO (passthrough from a form field), COMMUNITY_DB (lookup from the Community Reference DB), DERIVED (computed by Transform logic), or MANUAL_ENTRY (operator fills in Matrix directly). A row can be scoped to Property Type (SF vs. TH) or Entry Path (`new` vs. `taxid`). The script iterates these rows at generate time.
- **Cognito Fields** — reference table of every Cognito form field the Rules link to, by dotted path. Keeps Payload Rules authoring honest (a Rule linking to a non-existent Cognito field is caught at authoring time).
- **Source Types** — enum table (5 rows) describing what each Source Type means. Reference only, not read at runtime.
- **Community Reference DB** — one row per community the builder lists in. Carries per-community data that doesn't come from the Cognito form: Area code, Zip, schools (elementary/middle/high), Subdivision code, path (`new` or `taxid`), HOA fee amount/period, capital contribution, Fee Description type, Pool Y/N, Heating codes, Fuel codes, Neighborhood (used for Everstone's temporary Matrix-Subdivision gap), and so on. The script keys into this table by combining `Intake.Community` from the form with Property Type (so "Harpers Mill TH" and "Harpers Mill SF" are distinct rows).
- **Personnel Roster** — the builder's NHCs with their email addresses and other contact data. Not currently read by the script; staged for future use.

Lennar's base is `app78fMUwDNBHUZ6r`. Builder X's is `appv1my0msvAyGpor` (currently empty of listing data, used only to prove the registry works).

### 3.4 `builders.py` registry

Python module in the extension repo at `extension/scripts/builders.py`. Carries the per-builder config as plain data: display name, MLS tag, Cognito form ID, Submitted view ID, Airtable base ID and the four table IDs within it, Drive properties folder ID, Sheet ID + tab ID + tab name + target row, and the key for which community-resolver function to use. The script's dispatch functions all take a `builder` parameter and look up config from this registry; nothing else in the codebase has per-builder constants hardcoded. Adding a builder is a config edit here plus the external artifacts (Cognito form, Airtable base, Drive folder, Sheet) existing.

### 3.5 Railway service (FastAPI wrapper + `generate.py` pipeline)

Python service hosted on Railway at `lennar-payload-script-production.up.railway.app`. (Name is historical; the service is now multi-builder.) Three endpoints, all authenticated with `X-API-Key`:

- **`GET /`** — health check.
- **`GET /recent-entries?builder=<key>`** — queries the selected builder's Cognito form Submitted view via OData, returns a flat list of recent entries with address and submission timestamp for the extension's picker.
- **`POST /generate`** with `{"entry_id": N, "builder": "<key>"}` — the core pipeline. Fetches the Cognito entry, resolves the community, loads the builder's Payload Rules + Cognito Fields + Source Types + Community Reference DB from Airtable, iterates the rules with Property Type and Path scoping, dispatches by Source Type, applies any Transforms, prefixes Features-tab checkbox codes with their Matrix Input IDs, assembles the payload matching the extension's expected envelope shape, and returns it.
- **`POST /prepare-listing`** with `{"entry_id": N, "builder": "<key>"}` — generates the payload (same as `/generate`), then creates the Google Drive folder (skip-if-exists), sends the prep email to the operator, and writes the Sheet row. Each sub-step is wrapped in its own try/except so a failure in one doesn't block the others; failures surface as warnings in the response envelope.

All endpoints return a wrapped envelope: `{"status": "ok", "payload": {...}, "warnings": [...]}` on success, `{"status": "error", "message": "..."}` on failure.

The service also holds the Google integration (Drive + Gmail + Sheets) via OAuth 2.0 refresh-token flow with Desktop App credentials. Credentials live as Railway environment variables (shared secrets only — all per-builder non-secret config is in `builders.py`).

### 3.6 Chrome extension

Side-panel extension loaded in the operator's browser. The user-facing surface. Named "CVRMLS Matrix Filler" (historically "Lennar CVRMLS Matrix Filler (POC)"). Core elements:

- **Builder dropdown** — picks which builder's data to work with. Persisted across panel opens via `chrome.storage.local`. Switching builders resets state (clears textarea, resets tab status dots, resets Phase 3 state) and refreshes the entry picker for the new builder.
- **Entry picker** — populated from `/recent-entries` on panel open and on manual refresh. Each row shows address and submission timestamp. "Load" button fetches `/generate` for the selected entry and drops the payload JSON into the textarea.
- **Textarea** — holds the current payload. Can be pasted into manually as a fallback. Clear button above it wipes the textarea and resets state.
- **Auto-fill toggle + Fill button** — when auto-fill is on (default), the extension's content script watches for Matrix tab navigation and fills each tab from the loaded payload as the operator moves through the tabs. Fill button fires manually for the current tab.
- **Per-tab status row** — small colored dots showing which Matrix tabs have been visited/filled/errored for the current listing.
- **Generate listing prep button** — fires `/prepare-listing`, triggering the Drive folder create, prep email send, and Sheet row write.

The extension holds the "contract knowledge" between the script's payload shape and Matrix's actual DOM — which fields map to which input IDs, which tabs need which dispatchers, how checkbox groups and selects differ. The 111 Payload Rules in the Lennar base are declarative; the content script in the extension is where those rules become real DOM manipulations.

### 3.7 Google Drive folder convention

Per-listing folder created at `<Builder>/Properties/<abbreviated address>/`, with a `Photos` subfolder nested inside. Address abbreviation follows the operator's existing convention (Drive → Dr, Road → Rd, etc.). Skip-if-exists semantics — reusing an existing folder (common when the operator has already created it manually) is normal behavior, not a failure.

Per-builder Drive root is in the registry: Lennar's at `Lennar/Properties/`, Builder X's at `Builder X/Properties/`.

### 3.8 Prep email

HTML email sent to the operator's inbox at prep time. Contains:
- Property address and composed clause with price and community (for pasting into PandaDoc).
- A link to the Drive folder.
- A stubbed "Send signing" button (currently inert; wiring described in §3.10 below).
- Builder display name in the subject line.

Sent from the operator's own Gmail account via the Gmail API. Arrives with a yellow "Be careful with this message" banner (Gmail self-send heuristic — not spoofing-related; mitigation is parked).

### 3.9 Google Sheet lifecycle tracker

Per-builder Sheet with one tab per builder. Lennar's row for a new listing is written at row 45 (above and below are the community-block layouts for operator reference); Builder X's at row 5. The script writes a subset of columns at prep time: A (Address), C (Current Price), E (Community with SF/TH suffix), F (Status = "Input in progress"), L (Build Model), M (NHC), and R/S/T (Exterior Photos / Interior Photos / Virtual Tour as hyperlinks or "Reused from" labels). Other columns are operator-fill. Row inserts via `insertDimension` with `inheritFromBefore: True` so the Status dropdown and other data validation carry down from the row above.

### 3.10 PandaDoc (stub)

**Current state (manual).** The Listing Agreement addendum is sent via PandaDoc manually by the operator, using the merge values from the prep email as the input. PandaDoc template `9DpcJ2wbwTkXvLh59aTPTn` ("Lennar Listing Addendum") has three recipient roles (Sender, Agent, Owner) and two merge fields (Property Address, Composed Clause).

**Future state (automated — Phase 3b).** The `/prepare-listing` endpoint will also create the PandaDoc document from the template, pre-fill the merge fields, pre-assign the three recipients (Sender to `agentandrewrich@gmail.com`, Agent to `chalkworld.ai@gmail.com` as Gary, Owner to the NHC's email from the Personnel Roster), and leave it in draft state. The prep email's "Send signing" button will fire a `GET /send-signing?token=<JWT>` endpoint that sends the already-drafted document to recipients. The two-step split (create at prep, send on click) is deliberate — it lets the operator do photos first and only fire signing when the listing is actually ready.

Blocked on a PandaDoc subscription upgrade (free tier caps at 2 recipients per document, the template needs 3). Design is complete; activation is a cost decision.

**This section is a stub.** Fill in with full endpoint shape, token design, and operator flow when Phase 3b ships.

---

## 4. How they fit — the data flow for one listing

Narrative walkthrough from NHC submission to Sheet row written. One listing, happy path.

1. **NHC submits the Cognito form.** A new entry lands in Form 17 (Lennar) or Form 18 (Builder X) with the listing's data. The entry has an ID (e.g. #21) and a timestamp. Cognito sends a notification email to the operator for every new submission on every form — this is the operator's trigger event. The email arrival is what tells the operator a new listing is ready to work; the extension itself is not polled or watched for new submissions.

2. **Operator opens the Chrome extension side panel.** On open, the extension reads the persisted builder selection from `chrome.storage.local`, restores the dropdown, and fires `GET /recent-entries?builder=<key>` against Railway. Railway's handler queries the Cognito Submitted view via OData, returns the N most recent entries (address + timestamp per row), and the extension populates the picker. The entry the operator just got the email about should be at or near the top of the list.

3. **Operator picks the entry and clicks Load.** The extension fires `POST /generate` with `{"entry_id": N, "builder": "<key>"}`. Railway's handler:
   - Looks up the builder's config in `builders.py`.
   - Fetches the Cognito entry via REST (single-entry endpoint, returns full nested object).
   - Resolves the community key by combining `Intake.Community` with Property Type (e.g. "Creekside Run" + "Townhouse" → "Creekside Run TH").
   - Fetches the builder's Payload Rules, Cognito Fields, Source Types, and Community Reference DB from Airtable.
   - Looks up the matching community row in the Community Reference DB. Hard-fails on miss.
   - Iterates the Payload Rules, filtering by Property Type and Path scoping where set. For each applicable rule:
     - **STATIC** rules write the Static Value verbatim.
     - **COGNITO** rules read the linked Cognito field by dotted path, apply any Transform, write the result.
     - **COMMUNITY_DB** rules read the named column from the matched community row, apply any Transform, write the result.
     - **DERIVED** rules execute the Transform logic (which may read Cognito fields, DB columns, system clock, Property Type, etc.), write the result.
   - For Features-tab checkbox-group outputs, prefixes bare codes with the rule's Matrix Input ID (so `"03"` becomes `"Input_567_03"`) — the extension's dispatcher expects full IDs.
   - Fills in default empty sub-objects for Matrix tabs that assume their presence (Bath Info levels, Virtual Tour section when the URL is blank).
   - Returns the payload wrapped in the ok envelope.

4. **The extension drops the payload JSON into the textarea** and persists it to `chrome.storage.local`. The operator can now see the raw payload for a spot-check if needed.

5. **Operator navigates to Matrix and opens the new listing.** With auto-fill toggled on (default), the extension's content script detects each Matrix tab the operator opens and dispatches the appropriate section of the payload to the fill functions for that tab. Dots in the per-tab status row turn green as each tab fills successfully. The operator moves through the tabs confirming each looks right.

6. **Operator clicks Generate listing prep.** The extension fires `POST /prepare-listing` with the same `{"entry_id": N, "builder": "<key>"}` body. Railway's handler:
   - Regenerates the payload (same pipeline as `/generate` — not cached).
   - Resolves the Drive folder: searches for an existing `<address>` folder under the builder's Properties root, creates one with a `Photos` subfolder if not found. Returns the folder ID either way.
   - Composes the prep email: pulls address, price, community for the Composed Clause; renders the HTML body with the Drive folder link and the stubbed signing button; sends via Gmail API from the operator's own account.
   - Writes the Sheet row: inserts a new row at the builder's target row (45 for Lennar, 5 for Builder X), populates the writable columns, inherits data validation from the row above.
   - Returns the ok envelope. Any sub-step failure surfaces as a warning in the response but doesn't block the others.

7. **Operator sees three things land:** the Drive folder in Google Drive, the prep email in Gmail, and the row in the Sheet. The extension's Generate listing prep button updates to a success state.

8. **Operator handles the manual-only steps:** uploads photos to the Drive folder's `Photos` subfolder, uploads them to Matrix, and manually sends the PandaDoc addendum using the merge values from the prep email. (PandaDoc automation is designed; see §3.10.)

9. **Operator exits Matrix and the extension.** The listing is now in Matrix, in the Sheet tracker, in the Drive folder, and awaiting signature in PandaDoc. The rest of the listing's lifecycle happens outside this system.

---

## 5. Running a listing: the operator flow

This is the past-you section — written for someone who has done listings before but has never seen this automation. Walks through the clicks and what each one is doing, with enough context that the first run goes smoothly.

### 5.1 Prerequisites

- The Chrome extension is loaded (`chrome://extensions`, with Developer mode on and the `aframe-mcp-connector/extension/` folder loaded as an unpacked extension). It appears in the side-panel menu as "CVRMLS Matrix Filler."
- The extension's `config.js` has the Railway URL and `API_SHARED_SECRET` filled in. (If missing, the side panel shows a clear error on open.)
- You're signed into Matrix in Chrome.
- You're signed into the operator Gmail account that owns the Railway OAuth refresh token (currently `agentandrewrich@gmail.com`).

### 5.2 Starting a new listing

1. **Open the Chrome side panel** and select the extension. The panel loads.
2. **Confirm the builder dropdown shows the right builder.** Default is whatever was selected last. For Lennar, pick "Lennar." For a new builder being tested, pick that builder. Changing this clears any loaded state — do it before you load an entry.
3. **The picker populates automatically** with the N most recent form submissions for that builder. Each row shows the property address and submission timestamp (relative for today, "yesterday," or short absolute for older). If the picker is empty or shows an error, click the refresh button next to the "Updated Xm ago" label.
4. **Pick the entry you're working on.** If you don't see it, hit refresh — the NHC may have submitted it moments ago.
5. **Click Load.** The extension fires `/generate` against Railway and the generated payload JSON lands in the textarea below the picker. This takes a few seconds. If generation fails, the error surfaces inline in the picker footer and the textarea stays empty — fall back to pasting a known-good payload manually if you have one.
6. **Spot-check the payload** if this is a first-time listing in a new community, or if anything about this entry is unusual (new model type, unexpected feature combination). The payload is JSON; look for the obvious things (address, price, community, feature arrays). Spot-check is optional for familiar cases.

### 5.3 Filling Matrix

1. **Open Matrix in a new tab** and start a new listing (follow the normal Matrix new-listing flow — the system doesn't automate the "create new listing" click because Matrix's own entry path matters, e.g. taxid vs. new).
2. **Confirm auto-fill is on** in the extension side panel. The toggle is at the top of the panel and should read "Auto-fill" (on). It stays on across sessions.
3. **Click through each Matrix input tab in order.** As you land on each tab, the extension detects it and auto-fills from the loaded payload. The status dots at the top of the panel turn green as each tab fills successfully.
4. **If a tab doesn't auto-fill** (status dot stays yellow or turns red), click the "Fill tab" button next to the auto-fill toggle to fire the current tab manually. If that still fails, check the browser console for details — most errors are specific to a payload shape issue and are rare.
5. **Confirm the fill on each tab** before moving on. Auto-fill is reliable but not infallible; spot-check that key fields look right (price, bedrooms, bathrooms, major features).
6. **Room Info is manual.** The automation doesn't touch Room Info — enter rooms the way you normally would.
7. **If you need to clear the loaded payload mid-listing** (e.g. you loaded the wrong entry), click Clear above the textarea. This wipes the payload, resets the status dots, and resets the Generate listing prep state. The entry picker is unaffected.

### 5.4 Generating listing prep

1. **Once Matrix is filled and you've uploaded photos** (or are about to), click **Generate listing prep** in the side panel.
2. **The button fires `/prepare-listing`** and three things happen in parallel:
   - A Google Drive folder for this listing is created (or found, if you already made one manually) at `<Builder>/Properties/<address>/`, with a `Photos` subfolder.
   - A prep email lands in your Gmail inbox with the merge values for PandaDoc, a link to the Drive folder, and a stubbed signing button (currently inert).
   - A row is inserted in the Builder's Listings Sheet at the target row (Lennar: 45) with address, price, community, status, build model, NHC, and photo cells pre-populated.
3. **The button updates to a success state** when all three succeed. If any sub-step warns (e.g. the folder already existed), it's surfaced in the panel as a non-blocking warning. The whole call rarely fails outright; sub-step failures are isolated.
4. **The prep email arrives with a yellow "Be careful with this message" banner.** This is a Gmail self-send heuristic and not a real security concern. Ignore it; mitigation is parked.

### 5.5 Handling photos, signing, and the rest

The automation ends here. The operator-handled remainder:

1. **Photos.** Upload to the Drive folder's `Photos` subfolder, then upload to Matrix via Matrix's own photo tools.
2. **PandaDoc.** Open PandaDoc, create a document from the "Lennar Listing Addendum" template, paste the Composed Clause and Property Address from the prep email into the merge fields, assign the three recipients (Sender, Agent as Gary, Owner as the NHC), send.
3. **Sheet status updates.** As the listing moves through its lifecycle (coming soon → active → under contract → closed), update the Status column (F) and other operator-fill columns manually.

### 5.6 Common hiccups

- **Picker says "Can't reach Railway. Click refresh to retry."** — the Railway service is probably mid-redeploy or briefly down. Wait 30-60 seconds and refresh. If it persists more than a few minutes, check the Railway dashboard.
- **Load errors with "Generation failed: <message>"** — the pipeline hit a specific error. Common causes: the Cognito entry's community doesn't match any Community Reference DB row (new community needs to be added to the DB first); the entry is missing a required field the Rules depend on. Read the message and check the Rules table for the field in question.
- **Auto-fill dot stays yellow or turns red for a tab** — the payload may have a shape issue the extension's dispatcher can't handle. Rare post-launch; usually surfaces only for first-of-kind listings. Check the browser console and fall back to filling that tab manually.
- **Prep email didn't arrive** — check spam first (unlikely but possible). If missing, check the extension's response envelope for warnings — a Gmail failure would appear there. The Drive folder and Sheet row may still have landed; the prep call's sub-steps are independent.
- **Sheet row didn't appear at row 45** — same as above, check for warnings. Row writes are rare failure points; the common cause would be a Google OAuth refresh token expiry (addressed by keeping the OAuth consent screen published).

---

## 6. Troubleshooting (thin)

Enough detail for an LLM reading cold to reason about symptoms. Not an ops manual — for anything not covered here, read the code and the tracker.

- **Railway deploy race.** The Railway service redeploys on every push to `aframe-mcp-connector`'s watched branch within `/extension/scripts/**`. If you push a code change and immediately test it, the test may hit the old build. Wait 1-2 minutes between push and smoke test. Not a bug; a timing property of the deploy pipeline.
- **Credential scoping for new builders.** Adding a new builder requires granting the existing shared credentials access to the new resources:
  - **Cognito API key** must have the new builder's form ID added to its authorized-forms list (Cognito admin → API Keys → edit the key).
  - **Airtable PAT** must have the new builder's Payload Rules base added to its "Access to bases" list (Airtable Builder Hub → Personal access tokens).
  - **GCP OAuth refresh token** does **not** need per-resource grants — GCP scopes by API scope at consent time, not by resource. The new builder's Drive folder, Sheet, and Gmail account inherit automatically.

  Both the Cognito and Airtable omissions surface as 403 errors on the first `/generate` or `/recent-entries` call for the new builder. The error message names the resource that was unreachable.
- **OAuth refresh token expiry.** Google's OAuth refresh tokens for apps in "Testing" status expire after 7 days. The OAuth consent screen for this project is published to production, which removes that expiry. If the consent screen ever gets reverted or re-verification is triggered, Google may re-apply the 7-day expiry — Phase 3a would silently break the next week. Keep the consent screen production-published.
- **Cognito YesNo field-type gotcha.** Cognito's YesNo field type returns a boolean (`true`/`false`) from the single-entry API, while Choice fields with "Yes"/"No" options return strings. The script's dispatcher has a `_cognito_yesno()` helper that normalizes both to strings — call sites that read a YesNo field must use the helper, not raw `_cognito_get`. Caveat: Cognito's view-API (used for `/recent-entries`) stringifies booleans for its listing output, masking the mismatch until a single-entry read. If a new YesNo field gets authored and the dispatcher is updated to read it, the helper is the right call.
- **Features-tab checkbox prefixing.** Features-tab checkbox-group outputs are authored in the Payload Rules as bare suffix codes (e.g. `"03"`) and prefixed with the Matrix Input ID at script output time to produce full IDs (`"Input_567_03"`). Non-Features checkbox groups pass through bare. If a new Features-tab Rule's output doesn't fire correctly, check that the prefixer is being hit and the Rule's Tab field is set to "Features."
- **Virtual Tour section always emits.** The script emits the `tour` section with empty-string defaults when the virtual tour URL is blank, because the extension's dispatcher assumes the section exists. Same pattern applies to Bath Info level sub-objects (level4 in particular — the Rules don't author it per Lennar's Form 17 scope, but the extension assumes its presence).
- **Builder dropdown change clears state.** Switching builders in the extension clears the textarea, resets the per-tab status dots, resets the Phase 3 state, and auto-refreshes the picker for the new builder. This is intentional — a stale payload from one builder would fill the wrong Matrix fields for another. If you need to compare across builders, use the picker's refresh instead.

---

## 7. Where things live

Pointer-only. One-liners.

### Code

- **Main repo:** `aframe-mcp-connector` on GitHub (operator's account). Contains the Chrome extension (`extension/`) and the Railway script (`extension/scripts/`).
- **Railway service:** `lennar-payload-script` project. Public URL `lennar-payload-script-production.up.railway.app`. Watch Paths set to `/extension/scripts/**`.

### Airtable

- **CVRMLS Matrix Fields base (MLS layer):** `appEEYJ31UKuCnJ6v`.
- **Lennar Payload Rules base (Builder layer):** `app78fMUwDNBHUZ6r`.
- **Builder X Payload Rules base (Builder layer, hypothetical):** `appv1my0msvAyGpor`.

### Google

- **Lennar Drive root:** `Lennar/Properties/` under the operator's Google Drive.
- **Builder X Drive root:** `Builder X/Properties/`. Folder IDs are in `builders.py`.
- **Lennar Listings Sheet:** `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME`.
- **Builder X Listings Sheet:** `1_KJ67--gajL-Bh-2ZhcZsLfXFDwYWnqBRacQ8ZuDMB4`.
- **GCP project:** "Matrix Automation." OAuth client is a Desktop App type. Consent screen published to production.

### Cognito

- **Lennar form:** Form 17 "LennarNewListingIntake." Submitted view: `17-3` (OData `3`).
- **Builder X form:** Form 18 "Builder X New Listing Intake." Submitted view: `18-5` (OData `5`).

### PandaDoc

- **Lennar Listing Addendum template:** `9DpcJ2wbwTkXvLh59aTPTn`.

### Key foundation docs

- **Charter:** `docs/foundation/Lennar_Restructure_Charter.md` (`FOUND-CHARTER-001`). The design principles and the "why" behind the architecture.
- **This doc:** `Builder_Listing_Operations_Overview.md` (`FOUND-OPERATIONS-OVERVIEW-001`). The "what" and "how" of the live system.
- **Payload Rules Conventions:** `docs/foundation/Payload_Rules_Conventions.md`. Base-level rules the script author treats as guaranteed. Current version 0.6.
- **Builder onboarding runbook:** TBD. Will live at `docs/foundation/Builder_Onboarding_Runbook.md` once written. Covers the intake checklist for a new builder and the scaffold steps to apply the gathered data to Cognito/Airtable/Google/registry.
- **Phase tracker (retired at system wrap-up):** `docs/foundation/Lennar_Restructure_Phase_Tracker.md` (`FOUND-PHASE-TRACKER-001`). The historical record of how the system was built. Not a current-state reference.

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-10-18 | Initial authoring. Doc created as part of the Phase 4 wrap-up to replace the Phase Tracker as the system's current-state reference. Scope: dual-audience (LLM reading cold + operator running listings), builder-agnostic with Lennar as the primary live example, PandaDoc section as a stub pending Phase 3b, thin troubleshooting. |
| 0.2 | 2026-10-19 | §4 step 1 corrected to name the Cognito notification email as the operator's trigger event for the whole workflow — previous draft read as if the operator discovered new submissions by opening the extension. Step 2 tightened to acknowledge the operator is looking for a specific known entry, not browsing. No other changes. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

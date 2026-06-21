# Lennar Listing Session Protocol
**Version 1.0** | *Last Updated: June 20, 2026*
*Claude-facing SOP | Lennar new listing intake and lifecycle management*

---

## Overview

This protocol governs how a Claude session handles Lennar listing work. It covers new listing intake, ongoing lifecycle updates (price changes, under contract, closed), and the tools and systems involved.

The **Google Sheet is the source of truth** for all file status and tracking. Everything a session does should keep the sheet accurate.

Sessions replace the Zap chain for Aframe file creation. All other automation (folder creation, Gmail labeling, Sheet updates, doc saving) is handled in-session via connectors.

---

## Systems & Reference

| System | Purpose | Notes |
|---|---|---|
| Google Sheet | Source of truth — file status, pricing, MLS# | Shared with Lennar sales team; keep lean |
| Session Data tab | Session metadata — model, addendum status, photo source, etc. | Session-facing only |
| Google Drive — Properties folder | One subfolder per address; holds tax record, signed addendum, MLS listing sheet | Folder ID: `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |
| Gmail | Source of new listing emails; label tracks file state | Label convention: `Lennar/[Address]` |
| Aframe | Optional — lightweight lifecycle tracking and doc storage | Created in session; not load-bearing |
| CVRMLS Matrix | MLS data input — done manually by Andrew after session generates the data sheet | Session does not touch MLS directly |
| Community Reference Database | Schools, HOA, MLS Area, heating/cooling by community | Document ID: AAR-TC-LENNAR-DB-001 |

---

## Primary Contact

**New listings come from:** Carly Evans (carly.evans@lennar.com) — through June 29, 2026
**Effective June 30, 2026:** Megan Cook (megan.cook@lennar.com) takes over
- Megan handles new listing submissions and signs listing addenda
- Full rep roster by community: *(stub — to be documented once Megan is onboarded. Reps shuffle; confirm current contacts at the start of any session involving community-specific emails)*

---

## How a New Listing Arrives

Carly/Megan fills out a Lennar Cognito form. That form submission triggers an email to Andrew's inbox. The email contains the full form data — address, community, price, beds/baths, remarks, showing instructions, etc.

Andrew's Zap parser reads that email and populates his own internal Lennar intake form, which previously triggered Aframe creation automatically. **Sessions now replace that Zap** and handle Aframe creation directly.

The email is the primary data source. There is no separate contract document.

---

## Source of Listing Data

Everything comes from the Carly/Megan email:
- Property address (verify carefully — street numbers sometimes include erroneous commas, e.g. `15,912` → `15912`)
- Community name
- List price
- Property type, beds, baths, garage, sq ft
- Public remarks and agent comments
- Showing instructions
- Virtual tour link (if provided)
- Appliances
- Carly's forwarding note (may contain image instructions — read carefully)

Community-specific data (schools, HOA, MLS Area, heating/fuel/cooling) comes from the **Community Reference Database**, not the email.

---

## Compliance Rules (Non-Negotiable)

- **Phone numbers in public remarks** — CVR MLS prohibits them. If the last line of public remarks contains a phone number or "call [number]", remove it. The correct closing line ends with "...finishes, and layout may vary." Flag the removal on the data sheet.
- **Do not activate** — listing must not go Active in MLS until the signed addendum is on file. Session does not touch MLS activation.
- **Duplicate check** — search the Google Sheet and Aframe before creating anything. Carly has submitted duplicates before.
- **List date is always today** — never the email date or form submission date.

---

## Appliance Formatting Rules

- Alphabetical order
- "Microwave Over Range" → **Microwave**
- "Washer & Dryer" → **Dryer** and **Washer** as separate entries
- Gourmet kitchen descriptors (e.g. "Gourmet Kitchen - Gas Cooktop") → break into individual appliances; drop the marketing label

---

## New Listing — Session Steps

### 1. Read the Email
Search Gmail for the new listing email. Read it fully before doing anything else — Carly's forwarding note at the top sometimes contains image instructions that don't appear in the form data.

### 2. Verify the Address
Cross-check the address against the Google Sheet. Confirm it's not already there. Fix any number formatting errors (comma artifacts from Cognito).

### 3. Apply Gmail Label
Create label `Lennar/[Address]` (street number + street name only, no city/state/zip). Apply to the email and any related threads.

### 4. Parse & Present Listing Data
Extract all data from the email and present a clean summary to Andrew before doing anything else. Flag:
- Any phone numbers in public remarks or agent comments
- Missing fields (virtual tour, showing instructions, etc.)
- Image instructions from Carly's note
- Address discrepancies

Andrew confirms before the session proceeds.

### 5. Generate the MLS Data Input Sheet
Populate the data sheet template (AAR-TC-LENNAR-DS-TPL-001) covering all 8 Matrix tabs:

1. Property details
2. Location — county and MLS Area from Community Reference Database
3. Schools — from Community Reference Database
4. HOA — from Community Reference Database
5. Features/appliances — formatted per rules above
6. Heating/fuel/cooling — from Community Reference Database
7. Showing instructions — verbatim from email; if blank, use agent comments; if both blank, omit
8. Virtual tour link — verbatim; omit if not provided

Include at the bottom: image note from Carly's forwarding message (if any), and a flag for any removed phone number lines.

### 5b. MLS Input Automation (Bookmarklet System)

A bookmarklet-based system is in development to automate Matrix data entry. Once built, the session will output a JSON payload alongside the data sheet. One permanent bookmarklet per Matrix tab reads from the clipboard and populates fields instantly — eliminating the cognitive load of manual field-by-field entry.

**Status as of Session 003:** POC complete. Bath Info tab fully proven end-to-end. Field mapping and bookmarklet build for remaining tabs is in progress.

**Key rules:**
- Status tab is never automated — activation remains Andrew's manual action only
- The clipboard payload is generated by the session as part of standard listing output
- Bookmarklets are installed via HTML launcher files (drag-to-bookmarks-bar method) — see `AAR-TC-LENNAR-BM-001`

Full details, field maps, tab inventory, build roadmap, and payload schema: **`Lennar_MLS_Bookmarklet_Build.md`** (`AAR-TC-LENNAR-BM-001`)

---

### 6. Update the Google Sheet
Add the new listing row in the correct position:
- Group by community, then SF or TH
- Descending numeric order within the group
- Columns: Address, blank MLS#, List Price, blank New Price, Community, Status = **Input in Progress**, blank Closing Date, blank Price Change Date

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

### 8. Create the Google Drive Property Folder
Inside the Properties folder (`1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B`), create a subfolder named `[Street Number] [Street Name]` (e.g. `15912 Greenhart Dr`).

Save the MLS data sheet to this folder.

### 9. Create Aframe Transaction
Create the transaction with standard Lennar defaults:

| Field | Value |
|---|---|
| Transaction Side | Seller |
| Primary Agent | Gary Martin |
| TC/Assistant | Andrew Rich (agentandrewrich@gmail.com) |
| Seller Company | Lennar |
| Status | Lennar - Active *(may create as Draft — flag for Andrew)* |
| List Date | Today |

Apply task templates:
- Lennar New Listing Task List — always
- MLS Data Input Checklist - For Lennar — always

Confirm via `list_task_templates` before applying — do not rely on memorized IDs.

> **Next session TODO:** Add Aframe contact IDs for Gary Martin and Lennar to this table so sessions don't have to look them up every time. Pull via `search_contacts` once and hardcode here.

### 10. Send the Listing Addendum
*(DocuSign connector — future capability, not yet implemented)*

Until DocuSign is connected: flag in the handoff that the addendum needs to be sent manually via Transaction Desk to Carly/Megan for signature.

> **HARD RULE: A listing cannot go Active in the MLS under any circumstances until the signed listing addendum is on file. This is a compliance requirement. Do not mark the activation handoff item complete and do not prompt Andrew to activate until the signed addendum has been received and saved to the Google Drive property folder.**

### 11. Active Listing Email
Once the listing goes Active in MLS (Andrew handles activation), send the "now active" email to the sales rep(s) for that community with the MLS listing sheet attached.

Sales rep roster by community: *(stub — see Primary Contact section above)*

### 12. Session Handoff Summary
Close every session with a clear handoff of what still needs Andrew's action:
- [ ] MLS data input (using the generated data sheet)
- [ ] Photos — download/save; upload and reorder in MLS (exterior first, bathrooms to back)
- [ ] Send listing addendum to Megan/Carly for signature (until DocuSign is connected)
- [ ] Flip Aframe status from Draft to Lennar - Active if needed
- [ ] Set Property Type in Aframe UI (dropdown — cannot be written via connector)
- [ ] Save MLS# back to Google Sheet and Session Data tab once assigned
- [ ] Save signed addendum to Google Drive property folder once returned
- [ ] Activate listing in MLS once signed addendum is on file
- [ ] Send active listing email to community sales rep(s)

---

## Lifecycle Updates

### Price Adjustment
Carly/Megan sends an email with the new price. Session:
1. Read the email, confirm address and new price
2. Update Current Price in the Google Sheet; log today's date in Price Change Date
3. Update Current Price in Session Data tab
4. Update the MLS (Andrew does this manually — flag in handoff)
5. Apply the Gmail label if not already applied

### Under Contract
Session:
1. Update Google Sheet status to **Pending**; add closing date if known
2. Update Session Data tab status
3. Update Gmail label to `Lennar/@Under Contract/[Address]`
4. Update Aframe status if applicable

### Closed
Session:
1. Update Google Sheet status to **Closed**; confirm closing date
2. Update Session Data tab status
3. Update Gmail label to `Lennar/Closed/[Address]`
4. Update Aframe status if applicable

---

## Photo Notes

Photos are often reused across listings within the same community. When Carly's note references another listing's images, capture that in the Session Data tab under Photo Source. Check the local Properties folder (or Google Drive once migrated) for existing photos before requesting new ones from Carly/Megan.

Photo upload order in MLS: exterior first, bathroom photos to the back.

---

## Scalability Note

This protocol is designed for Lennar but intended to be builder-agnostic. When onboarding a new builder, the following items need a builder-specific configuration:
- Source email/contact (equivalent of Carly/Megan)
- Community Reference Database entries
- Sales rep roster
- Listing addendum template
- Google Sheet section and Gmail label root
- Google Drive Properties subfolder

---

## Key IDs & References

| Item | Value |
|---|---|
| Google Sheet ID | `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Google Drive — Properties folder | `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |
| Community Reference Database | AAR-TC-LENNAR-DB-001 |
| MLS Data Sheet Template | AAR-TC-LENNAR-DS-TPL-001 |
| Aframe — Gary Martin agent ID | *(confirm via Aframe at session start)* |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Claude-facing document. Living — update as workflow evolves.*

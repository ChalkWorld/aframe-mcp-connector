---
title: Lennar New Listing — Intake & MLS Input Protocol
document_id: AAR-TC-LENNAR-PROTO-001
version: 2.0
version_date: 2026-06-26
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar MLS Intake Workflow
---

# Lennar New Listing — Intake & MLS Input Protocol
### AAR-TC Transaction Services | Document ID: AAR-TC-LENNAR-PROTO-001

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-12 | Andrew Rich / Claude | Initial protocol document created |
| 1.1 | 2026-06-12 | Andrew Rich / Claude | Added Aframe task template note; added appliance formatting rules |
| 2.0 | 2026-06-26 | Andrew Rich / Claude | Full rewrite — bookmarklet system integrated; data sheet + payload confirmation flow; entry path rules by community; Wynwood removed; reference docs updated |

---

## Reference Documents

| Document | ID | Purpose |
|---|---|---|
| Lennar Community Reference Database | AAR-TC-LENNAR-DB-001 | Schools, HOA, MLS Area, fee details by community |
| Lennar MLS Data Input Sheet — Template | AAR-TC-LENNAR-DS-TPL-001 | Per-listing data sheet template |
| Lennar MLS Bookmarklet Build | AAR-TC-LENNAR-BM-001 | Bookmarklet architecture, field maps, build roadmap |
| Lennar MLS Bookmarklet — Full Payload Schema | AAR-TC-LENNAR-BM-SCH-001 | Complete payload schema — all tabs, all fields, classification |
| Lennar Listings Google Sheet | — | Master tracking spreadsheet |

---

## Key Contacts

| Name | Role | Contact |
|---|---|---|
| Carly Evans | Lennar Area Sales Manager | carly.evans@lennar.com |
| Gary Martin | Listing Agent | gary@gmartinproperties.com / 804-418-5509 |
| Andrew Rich | Transaction Coordinator | agentandrewrich@gmail.com |

---

## Critical Rules & Compliance Notes

- **Address verification** — Always verify street number and street name against the Lennar Listings Google Sheet before processing. Carly's form data is not always accurate.
- **Phone numbers in public remarks** — CVR MLS rules prohibit phone numbers in public remarks. Remove any line containing a phone number or "call [number]." The correct closing line ends with "...finishes, and layout may vary." Flag the removal in the data sheet.
- **Do not activate without signed addendum** — The listing must not go Active in the MLS until the listing addendum has been signed by Carly Evans and countersigned on behalf of Gary Martin. This is a compliance requirement.
- **List date** — Always use today's date (date of processing), not the date in Carly's email or the Lennar form.
- **Tax ID** — Pull from Realist Tax Records. If no Tax ID exists yet use "Pending Assignment."
- **Duplicate check** — Verify the listing is not already active in the MLS before processing. Carly has occasionally submitted a listing that is already live.
- **Appliance formatting** — List in alphabetical order. Washer and Dryer always listed as separate items. "Microwave Over Range" from Carly's form is not a valid Matrix checkbox — use "Microwave" only.

---

## Entry Path Rules by Community

The Matrix entry path determines how the new listing is created and which bookmarklet path logic applies. This is set at the time of MLS input and must be correct before running any bookmarklets.

| Community | Entry Path | Reason |
|---|---|---|
| Harpers Mill TH | **Tax ID** | Tax records current for these addresses |
| Harpers Mill SF | **Tax ID** | Tax records current for these addresses |
| Creekside Run | **New (Blank)** | Tax records not yet updated for new construction addresses |
| Everstone | **New (Blank)** | Tax records not yet updated for new construction addresses |
| Watermark | **New (Blank)** | Tax records not yet updated for new construction addresses |

**Tax ID path** — Create listing from Realist Tax Record. Some fields pre-populate. PID is already present. Bookmarklet skips pre-populated fields on Tax ID path (Acres, Legal Description).

**New path** — Create a blank new listing input. No pre-population. All fields written by bookmarklet or manual entry. Acres and Legal Description ("TBD") are written on this path.

*These path assignments reflect current tax record status as of 2026-06-26. Revisit when new communities come online or when tax records are updated for existing communities.*

---

## Workflow Overview

```
Email received → AI Session (data sheet → confirm → payload) → 
Aframe → Google Sheet → Gmail label → Drive folder → 
Tax ID lookup → MLS input (bookmarklets) → Transaction Desk → 
Photos → Final review → Activate
```

---

## Step-by-Step Protocol

---

### STEP 1 — Receive Email from Carly

Carly Evans forwards a Cognito Forms submission via email. The email includes:
- Her forwarding note (may include image instructions, e.g. "use same images as [address]")
- The full Lennar MLS Entry Form data (type, price, address, bedrooms, baths, remarks, appliances, etc.)

**Before proceeding:**
- Check that this is a new listing, not a duplicate of an already-active listing
- Note any image instructions in Carly's forwarding note

---

### STEP 2 — AI-Assisted Processing (Claude Session)

Forward or paste the email into a Claude session in the AAR-TC project. The session runs in the following sequence — **do not skip or reorder steps.**

#### 2a — Parse and verify

- Parse all listing data from the email
- Cross-check street number and street name against the Lennar Listings Google Sheet
- Flag any discrepancies before proceeding

#### 2b — Create Aframe transaction

Create the Aframe transaction with the following standard values:

| Field | Value |
|---|---|
| Primary Agent | Gary Martin |
| TC/Assistant 1 | Andrew Rich (agentandrewrich@gmail.com) |
| Transaction Side | Seller |
| Seller Company | Lennar |
| Status | Lennar - Active *(may create as Draft — flip manually if so)* |
| List Date | Today's date |
| Service Requested | Listing Data Input - $100 |
| Task Templates | Lennar New Listing Task List + MLS Data Input Checklist - For Lennar |

Confirm via `list_task_templates` before applying templates — do not rely on memorized IDs. Verify both templates are present in Aframe after creation and apply manually if missing.

#### 2c — Generate and present the MLS Data Sheet

Generate the MLS Data Input Sheet based on `AAR-TC-LENNAR-DS-TPL-001`. The data sheet covers all Matrix tabs and must include:
- All fields populated from the email and Community Reference Database
- Schools, HOA, and fee details pulled from `AAR-TC-LENNAR-DB-001`
- Public remarks and agent comments verbatim, with any phone number line removed and flagged
- Showing instructions verbatim from email (or from agent comments if email field is blank)
- Virtual tour URL if provided
- Image note from Carly's forwarding message
- Entry path noted (New or Tax ID — per community rules above)

**Present the data sheet to Andrew and explicitly ask for confirmation before proceeding.** Example: *"Here is the data going into the payload — please review and confirm, or flag any corrections before I generate the payload."*

#### 2d — Generate and present the JSON payload

After Andrew confirms the data sheet, generate the complete JSON payload per `AAR-TC-LENNAR-BM-SCH-001`. The payload covers all bookmarklet tabs in a single JSON object. Present it as a copy-ready block.

The payload uses two different community key formats — one per bookmarklet system. Use the correct format for each:

**Features bookmarklet** (`features.community`) — human-readable display names as they appear in the Matrix dropdown. `TH` and `SF` are an AAR-TC convention to distinguish type; they are not part of the Matrix stored value.

| Community | Features key |
|---|---|
| Harpers Mill Townhome | `Harpers Mill TH` |
| Harpers Mill Single Family | `Harpers Mill SF` |
| Creekside Run | `Creekside Run` |
| Everstone | `Everstone` |
| Watermark | `Watermark` |

**Listing Info bookmarklet** (`listing.community`) — lowercase underscore keys used internally by the Listing Info bookmarklet lookup table. These do not appear in Matrix; they drive the cascade dropdown values.

| Community | Listing Info key |
|---|---|
| Harpers Mill Townhome | `harpers_mill_th` |
| Harpers Mill Single Family | `harpers_mill_sf` |
| Creekside Run | `creekside_run_th` |
| Everstone | `everstone_sf` |
| Watermark | `watermark_sf` |

Features payload notes:
- `garage_yn` — `"1"` or `"0"`
- `garage_auto_door` — `true` or `false` (confirm with Lennar if unknown; default `false` until confirmed)
- `basement_yn` — `"0"` for all current communities (slab construction); `"1"` only if confirmed crawl space
- `num_fp` — `"0"` for all current communities; set only if confirmed fireplace present
- `appl_equip` — parse from email; alphabetical order; Washer + Dryer separate; use `Microwave` not `Microwave Over Range`
- `unit_placement` — leave `[]` for single-family plans

---

### STEP 3 — Aframe Transaction (Confirm)

- Confirm Aframe transaction was created correctly
- Flip status from Draft to **Lennar - Active** if it did not set automatically
- Save the MLS number back into Aframe once obtained (Step 8)
- Save the signed listing addendum to Aframe once received (Step 9)
- Use the Aframe task checklist throughout the process to track completion

---

### STEP 4 — Google Sheet

- Open the Lennar Listings Google Sheet
- Add the new listing in numerical address order within its community section
- Fields to populate: Address, Community, List Price, MLS# (once available)
- **Status flow:**
  - Set to **In Progress** when the listing is first received and work begins
  - Update to **Active** once the listing goes live in the MLS

---

### STEP 5 — Gmail Label

- Create a Gmail label for the new listing address under the `Lennar/` tree: `Lennar/[address]`
- Apply the label to Carly's email and all subsequent related emails for this listing

---

### STEP 6 — Drive Folder Setup

- Create a property folder in Google Drive — Properties folder (`1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B`)
- Create a Photos subfolder inside it
- Download or save any photos to the Photos subfolder
  - If Carly referenced another listing's images, pull from that listing's Drive folder

---

### STEP 7 — Tax ID Lookup

- Log into CVRMLS Matrix and navigate to **Realist Tax Records**
- Search by property address to retrieve the Tax ID (PID)
- If no Tax ID exists (common for Creekside Run, Everstone, Watermark new construction): use "Pending Assignment"
- Save the Tax ID to Aframe and Google Sheet

---

### STEP 8 — MLS Input (Bookmarklets)

- Log into CVRMLS Matrix
- Create the listing using the correct entry path for the community (see Entry Path Rules above):
  - **Tax ID path** (Harpers Mill TH/SF) — Create from Realist Tax Record
  - **New path** (Creekside Run, Everstone, Watermark) — Create a blank new listing input
- Copy the JSON payload generated in Step 2d to clipboard
- Navigate to each tab in Matrix and click the corresponding bookmarklet — tabs in order:

| Tab | Bookmarklet | Notes |
|---|---|---|
| Listing Info | `lennar_listing_info` | Cascade fires after County/City — allow ~2 seconds between fields |
| Bath Info | `lennar_bath_info` | |
| Features | `lennar_features` | Statics fire automatically; dynamic fields from payload |
| General Info | `lennar_general_info` | Acres + Legal written on New path only |
| Remarks | `lennar_remarks` | |
| Fee Info | `lennar_fee_info` | Driven from community lookup in payload |
| Owner Info | `lennar_owner_info` | Fully static — overwrites Owner Name to Lennar |
| Agent/Office Info | `lennar_agent_office_info` | Fully static — no payload read |
| Showing Instructions | `lennar_showing_instructions` | |
| Virtual Tour Info | `lennar_virtual_tour_info` | Skip tab entirely if no URL in email |
| Internet Display Info | `lennar_internet_display_info` | Fully static — no payload read |

- Copy the MLS number once generated and save to Aframe and Google Sheet

---

### STEP 9 — Transaction Desk — Listing Addendum

- Log into Transaction Desk
- Create a new document using the Lennar listing addendum template
- Fill in: Property address, Community, List Price
- Send for signatures: Carly Evans (Lennar) — primary signer; countersign on behalf of Gary Martin
- **Do not activate the listing until the signed addendum is returned**
- Once signed: save to Aframe and Drive property folder

> **Planned automation:** This step is planned for full automation via an API tool call to a signing platform (e.g. DocuSign or Transaction Desk API). The only inputs needed are address, list price, and community name. When implemented, the session will generate and dispatch the addendum for signatures in one call with no manual Transaction Desk work required.

---

### STEP 10 — Photos

- Upload photos to the MLS listing from the Drive Photos folder
- If using photos from a previous listing, pull from that listing's Drive folder
- Ensure all photos are uploaded
- **Reorder photos** — bathroom photos often appear first in the source and should be moved back; exterior shots should lead

> **Planned automation:** Photo sorting and renumbering is planned as a local workflow tool (`AAR-TC-LENNAR-PHOTO-001`). When built, it will handle ordering and renaming automatically before upload, eliminating the manual reorder step in Matrix.

---

### STEP 11 — Final Review & Activation

Review the Aframe task checklist — confirm all items are complete:
- All MLS tabs completed via bookmarklets
- Photos uploaded and ordered correctly
- Tax ID saved to Aframe and Google Sheet
- MLS number saved to Aframe and Google Sheet
- Signed listing addendum received and saved
- Dates verified
- Signed addendum confirmed on file

**Activate the listing in the MLS.**

---

## Community Quick Reference

| Community | Type | County | MLS Area | Entry Path | Heating | Fuel | Cooling |
|---|---|---|---|---|---|---|---|
| Harpers Mill TH | Townhome | Chesterfield | 54 | Tax ID | Forced Hot Air | Natural Gas | Heat Pump |
| Harpers Mill SF | Single Family | Chesterfield | 54 | Tax ID | Forced Hot Air | Natural Gas | Heat Pump |
| Creekside Run | Townhome | Richmond City | 60 | New | Heat Pump | Electric | Heat Pump |
| Everstone | Single Family | Henrico | 42 | New | Heat Pump | Electric | Heat Pump |
| Watermark | Single Family | Chesterfield | 54 | New | Forced Hot Air | Natural Gas | Heat Pump |

*Full school and HOA details: see AAR-TC-LENNAR-DB-001*

---

## Typical Time Estimate

| Scenario | Estimated Time |
|---|---|
| Single listing | ~20–25 minutes |
| 4 listings | ~90 minutes (block accordingly) |

*Bookmarklet system reduces MLS data entry to under 5 minutes per listing once payload is confirmed. Remaining time is Aframe setup, Transaction Desk, photos, and review.*

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version date with each revision.*

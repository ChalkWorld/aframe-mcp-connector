---
title: Cursor Handoff — Lennar_New_Listing_Protocol.md — v1.5
document_id: HANDOFF-2026-08-31-lennar-new-listing-protocol
date: 2026-08-31
project: AAR-TC Lennar Operational Project
---

Apply the changes below surgically to `docs/operational/lennar/Lennar_New_Listing_Protocol.md`. Do not modify anything not listed here.

## Change 1

Bump version to 1.5 in the frontmatter (date stays 2026-08-31 — second revision of the same day).

**Find:**

```yaml
title: Lennar New Listing Protocol
document_id: LENNAR-OPS-PROTOCOL-002
version: 1.4
version_date: 2026-08-31
```

**Replace with:**

```yaml
title: Lennar New Listing Protocol
document_id: LENNAR-OPS-PROTOCOL-002
version: 1.5
version_date: 2026-08-31
```

## Change 2

Insert new Step 0 (Opening Handshake) as the first numbered step under `## New Listing — Session Steps`, before the current Step 1. Also revise Step 1's opening sentence to reference the entry object already retrieved in Step 0 rather than implying a fresh read.

**Find:**

```markdown
## New Listing — Session Steps

### 1. Read the Intake

Read it in full before doing anything else. Notes-to-Andrew fields and rep forwarding notes carry photo instructions that don't appear in the structured form data.
```

**Replace with:**

```markdown
## New Listing — Session Steps

### 0. Opening Handshake

Every new-listing session opens with the same lightweight handshake before pulling the intake in full. The purpose is to establish parallel work per `Lennar_Project_Protocol.md` §4.5 — the session hands the user a concrete task to run while the session moves into intake parsing.

**Read community and property type from the newest intake.** Call `Cognito Forms:get_entries_in_view` on the Submitted view (`17-3`) with `take=1`. The tool returns the full entry — the "quick" part of the handshake is Claude-side discipline about reading only `Intake_Community` and `PropertyBasics_PropertyType` at this stage, deferring the full parse to Step 1. Retain the response object; Step 1 does not re-call the tool.

**Look up the path from community.** Path is a community property (see Matrix Entry Path Rules by Community above), driven by parcel-data availability rather than home type. Property type is read for two secondary reasons: it's what the session states back to the user as a sanity check, and Harpers Mill has separate TH and SF records in the Community Reference DB that later steps need to select correctly.

**State back and ask.** State back what the intake shows and ask the pacing-critical question — whether the Matrix incomplete listing exists yet. A well-formed opening looks like:

> This is a [community] [property type] listing, which is a [taxid | new] path listing. Have you already created the Matrix incomplete listing? If so, share the MLS# — and the tax ID if this is a taxid-path community. If not, [taxid path: pull the tax record from Realist in CVRMLS to get the tax ID, then create the listing in Matrix with the taxid path | new path: create the listing in Matrix with the new path, no tax record needed]. Either path generates the MLS# on first save.

**Wait for the user's response before proceeding.** The response tells the session whether to proceed straight into Step 1 (user already has MLS# in hand) or whether to walk the user through the Matrix-creation prerequisites first. While the user is creating the listing, the session pulls the full intake and moves into Step 1 in parallel.

**Do not skip the handshake even when the user provides the MLS# in the initial prompt.** The handshake still serves to confirm community, path, and property type, and to keep the session-open shape consistent across users.

### 1. Read the Intake

Read the intake in full using the entry object already retrieved in Step 0 — no new tool call needed. Notes-to-Andrew fields and rep forwarding notes carry photo instructions that don't appear in the structured form data.
```

## Change 3

Insert new Step 4a (Resolve Photo Source) between Step 4 (Parse & Present Listing Data) and Step 5 (Generate the Payload). Promotes photo source resolution from a trailing note to an owned session step, establishing the intake beat's multitask handoff point.

**Find:**

```markdown
Andrew confirms before the session proceeds.

### 5. Generate the Payload
```

**Replace with:**

```markdown
Andrew confirms before the session proceeds.

### 4a. Resolve Photo Source

Photo source resolution is a session-owned step, not a passing note. Reps often reference reusing photos from another listing (typical phrasing: "use Concord model photos," "same as the last Plymouth"), and knowing where those photos live is a prerequisite for the addendum trigger in Step 9.

Read the intake's photo instructions — check `PhotosVirtualTour_ExteriorPhotoLink`, `PhotosVirtualTour_AdditionalPhotosLink`, and any photo notes in `Notes_NotesToAndrew`. Handle each case:

- **New photos provided (links present).** Note the source in the Step 10 handoff; the user downloads and uploads.
- **Reuse from another listing referenced by model or address.** Search the Lennar Listings table for prior listings matching the referenced model in the same community, get the address, and tell the user which Google Drive property folder to grab from. If the reference is ambiguous — multiple prior listings match, no clear address in the note — surface it to the user rather than picking one.
- **No photo source indicated.** Flag it. The addendum cannot go out until this is resolved (see Step 9).

Once photo source is confirmed, the user can start photo upload work in parallel with the session moving into Step 5 payload generation. This is the multitask handoff point of the intake beat, per `Lennar_Project_Protocol.md` §4.5.

### 5. Generate the Payload
```

## Change 4

Revise Step 5's fill-flow sub-steps: remove sub-step 2 (Matrix creation) because Matrix creation now happens at Step 0. Renumber remaining sub-steps from 3–5 to 2–4.

**Find:**

```markdown
Fill flow, for what to expect back from Andrew:

1. Session outputs the payload as a single copy-ready JSON block.
2. Andrew creates the listing in Matrix via the correct entry path for the community.
3. Andrew pastes the payload once into the extension's side panel and clicks through the Lennar-scoped tabs; the extension fills whichever tab is showing. See `Lennar_Extension_Reference.md` §2.
4. Andrew reviews the populated fields before saving each tab and reports the outcome.
5. The Status tab is never automated — Andrew activates manually.
```

**Replace with:**

```markdown
Fill flow, for what to expect back from Andrew:

1. Session outputs the payload as a single copy-ready JSON block.
2. Andrew pastes the payload once into the extension's side panel — the Matrix incomplete listing is already open from Step 0 — and clicks through the Lennar-scoped tabs; the extension fills whichever tab is showing. See `Lennar_Extension_Reference.md` §2.
3. Andrew reviews the populated fields before saving each tab and reports the outcome.
4. The Status tab is never automated — Andrew activates manually.
```

## Change 5

Add MLS# to the list of fields written when the new Airtable row is created in Step 7. MLS# is available at intake now (captured in Step 0) rather than backfilled after activation.

**Find:**

```markdown
Add the listing to the Lennar Listings table:

- Address, Community, List Price (as `Current Price`), Status = Input in Progress
- Intake Date = today
- Addendum Status = Pending
```

**Replace with:**

```markdown
Add the listing to the Lennar Listings table:

- Address, Community, List Price (as `Current Price`), Status = Input in Progress
- MLS# — provided by the user in Step 0
- Intake Date = today
- Addendum Status = Pending
```

## Change 6

Revise the addendum trigger rule in Step 9. Retires "send early in intake" in favor of "send only when launch-ready" — two conditions required (photos secured, no open NHC blockers).

**Find:**

```markdown
Either way, set Addendum Status to `Sent` in Airtable once it goes out, and:

- **Send early in intake** — don't hold the rest of the session waiting on a signature.
- **Check for a future launch date.** Occasionally an intake asks for activation on a specific future date rather than immediately. If a stated launch date is in the future, hold the addendum and send it on that date instead. Flag any held send clearly in the handoff so the next beat follows through.
- **Multiple listings at once** are handled one after another in the same session; there is no batch path.
```

**Replace with:**

```markdown
Either way, set Addendum Status to `Sent` in Airtable once it goes out, and:

- **Send only when the listing is launch-ready.** Two conditions, both required: (a) photos are secured — either in hand or a source folder definitively identified in Step 4a — and (b) no open questions with the NHC that could block launch (missing intake fields, phone number in remarks to resolve, address discrepancies, etc.). If either condition is unmet, hold the addendum. A signed addendum in hand for a listing that can't actually go active is worse than a small delay starting the signature clock; the listing can sit in `Incomplete` in Matrix indefinitely while blockers resolve. (This supersedes the pre-v1.5 "send early in intake" rule, which was calibrated around a slower signer response cycle that no longer applies.)
- **Check for a future launch date.** Occasionally an intake asks for activation on a specific future date rather than immediately. If a stated launch date is in the future, hold the addendum and send it on that date instead — this rule supersedes the launch-ready trigger above. Flag any held send clearly in the handoff so the next beat follows through.
- **Multiple listings at once** are handled one after another in the same session; there is no batch path.
```

## Change 7

Update the Step 10 handoff item for MLS#. Airtable save is now handled at Step 7, so the handoff item only covers the Google Sheet surfacing.

**Find:**

```markdown
- [ ] Save the MLS# back to Airtable once assigned, and surface it for manual entry on the Google Sheet main tab
```

**Replace with:**

```markdown
- [ ] Surface the MLS# (captured in Step 7 during intake) for manual entry on the Google Sheet main tab
```

## Change 8

Add v1.5 row to the version history table, immediately after the v1.4 row.

**Find:**

```markdown
| 1.4 | 2026-08-31 | Withdrawn from MLS now sets Airtable Status to a distinct `Withdrawn` choice (added directly in Airtable by Andrew) instead of collapsing into `Closed`; Gmail-side, Withdrawn still transitions to `Lennar/Closed` since no separate Withdrawn Gmail label exists. Added the "Multi-listing threads and label reconciliation" standing rule to Lifecycle Updates: furthest-along status wins when one thread covers listings at different stages (New Listings < Active < Pending < Closed/Withdrawn), with `Lennar/New Listings` exempted from that ordering until every intake on the thread clears intake. Every lifecycle beat now reconciles the status label across every thread logged in the listing's `Gmail Threads` ledger, not only the triggering thread, closing the gap where sibling threads for the same address kept a stale status label after the listing moved on. Resolves three linked Issue Reports from the 2026-08-30 Cratey Ln delta-sync session (Airtable Status choice gap, multi-listing thread label rule, shared-intake thread label transition). |
```

**Replace with:**

```markdown
| 1.4 | 2026-08-31 | Withdrawn from MLS now sets Airtable Status to a distinct `Withdrawn` choice (added directly in Airtable by Andrew) instead of collapsing into `Closed`; Gmail-side, Withdrawn still transitions to `Lennar/Closed` since no separate Withdrawn Gmail label exists. Added the "Multi-listing threads and label reconciliation" standing rule to Lifecycle Updates: furthest-along status wins when one thread covers listings at different stages (New Listings < Active < Pending < Closed/Withdrawn), with `Lennar/New Listings` exempted from that ordering until every intake on the thread clears intake. Every lifecycle beat now reconciles the status label across every thread logged in the listing's `Gmail Threads` ledger, not only the triggering thread, closing the gap where sibling threads for the same address kept a stale status label after the listing moved on. Resolves three linked Issue Reports from the 2026-08-30 Cratey Ln delta-sync session (Airtable Status choice gap, multi-listing thread label rule, shared-intake thread label transition). |
| 1.5 | 2026-08-31 | Session-open workflow and persona overhaul. Added Step 0 (Opening Handshake) as the standard session-start pattern: lightweight Cognito read for community and property type via `get_entries_in_view` on view `17-3` with `take=1`, path lookup from community, state-back to user, ask whether the Matrix incomplete listing exists, wait for MLS#. Aligns session start with the pacing principle newly codified in `Lennar_Project_Protocol.md` §4.5 (parallel work, meet back in the middle) — session pulls the full intake while the user creates the Matrix listing. Added Step 4a (Resolve Photo Source), promoting photo source resolution from the trailing Photo Notes to an owned session step, positioned before Step 5 so the user starts photo work in parallel with payload generation. Revised Step 9 addendum trigger from "send early in intake" to "send only when launch-ready" (photos secured AND no open NHC blockers), reflecting that current session speeds moot the earlier-multitasking rationale and that a signed addendum on a stalled listing is worse than a delay. Removed Matrix creation from the Step 5 fill flow (now Step 0). Added MLS# to Step 7's Airtable row-add fields (available at intake now) and adjusted the corresponding Step 10 handoff item. Step 1 now reuses the entry object retrieved in Step 0 rather than re-calling the Cognito tool. |
```

No other changes to `Lennar_New_Listing_Protocol.md`.

## Commit

```bash
git rm handoffs/incoming/HANDOFF-2026-08-31-lennar-project-protocol.md handoffs/incoming/HANDOFF-2026-08-31-lennar-new-listing-protocol.md
git add -A
git commit -m "Lennar Ops docs v1.5/v1.2: session-open handshake, photo source promotion, launch-ready addendum rule, persona §4.5"
git push origin main
```

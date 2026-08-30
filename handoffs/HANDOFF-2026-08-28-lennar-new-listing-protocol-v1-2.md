---
title: Cursor Handoff — Lennar_New_Listing_Protocol.md — v1.2
document_id: HANDOFF-2026-08-28-lennar-new-listing-protocol-v1-2
date: 2026-08-28
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to `docs/operational/lennar/Lennar_New_Listing_Protocol.md`. Do not modify anything not listed here.

## Change 1

Bump the frontmatter version from 1.1 to 1.2 and the version_date from 2026-08-27 to 2026-08-28 to reflect the roster-to-Airtable migration.

**Find:**

```markdown
version: 1.1
version_date: 2026-08-27
```

**Replace with:**

```markdown
version: 1.2
version_date: 2026-08-28
```

## Change 2

Retire the inline rep-roster table and its preamble. The roster is now maintained in the Airtable `Lennar Personnel Roster` table so it can absorb NHC churn without a doc edit. Replace with a pointer to the Airtable table, a POC-field-cutover note, session read patterns, and a community-naming note.

**Find:**

```markdown
Rep roster by community (as of 2026-08-27 — reps shuffle; Chris MacLaird may reshuffle NHC assignments as he settles into the new role):

| Role | Name | Email | Communities |
|---|---|---|---|
| Director of Sales, Mid-Atlantic Division | Megan Cook | `megan.cook@lennar.com` | Regional oversight; addendum owner-signer of record for template purposes |
| Area Sales Manager, Richmond/Williamsburg | Chris MacLaird | `christopher.maclaird@lennar.com` | Regional escalation contact; addendum recipient going forward (replaces Carly Evans) |
| NHC | Izaiah Clark | `izaiah.clark@lennar.com` | Harpers Mill SF & TH, Creekside Run TH, Wynwood at Fox Creek |
| NHC | Lucas Clark | `sel9ct8QV6PNpgxg0` — see Airtable POC field | (confirm current community assignment) |
| NHC | Michelle Eke | `michelle.eke@lennar.com` | Harpers Mill Towns & Singles, Wynwood at Fox Creek |
| NHC | Mercedes Creech | `mercedes.creech@lennar.com` | Likely Harpers Mill — pending confirmation from Chris MacLaird |

The POC recorded in Airtable is always the rep who actually submitted the intake, confirmed from the intake itself. Carly Evans is no longer with Lennar; treat any lingering "Carly Evans" POC selection on legacy records as historical. Stefanie Nayder has also departed.
```

**Replace with:**

```markdown
Rep roster is maintained in Airtable, not in this doc. Base `app78fMUwDNBHUZ6r`, table `Lennar Personnel Roster` (`tblYI2KodPRjk1dAO`). The table holds NHCs, the Area Sales Manager, the Director of Sales, and Marketing contacts, each with contact info, community assignments, and Active/Departed status. Keeping the roster in Airtable means NHC churn is a data change, not a doc change.

**POC field cutover.** The POC field on Lennar Listings (`fldL1lmrjcJaOZGIf`) is a linked record pointing at the roster, not a singleSelect. New NHCs become selectable the moment they exist in the roster. Historical Carly Evans and Stefanie Nayder POC selections resolve to Departed roster records preserved for that purpose; those references remain valid post-cutover.

The POC written to Airtable on a new listing is always the rep who actually submitted the intake, confirmed from the intake itself — never a defaulted name.

**Read patterns:**

- Look up an NHC at intake — `search_records` on the roster by name to get the record ID for POC assignment.
- Find active NHCs at a community — filter the roster on `Status = Active AND Communities Assigned contains <community recordId>`. Foundation for the parked Active Listing Email work (`Lennar_Project_Protocol.md` §5.3).
- Find the current Area Sales Manager for CC on announcements — filter the roster on `Role = Area Sales Manager AND Status = Active`.

**Community-naming note.** The Community Reference DB has separate records for Harpers Mill TH and Harpers Mill SF — Andrew's Sheet-side convention for tracking the property-type variants of one physical community. NHCs assigned to "Harpers Mill" link to both records in their `Communities Assigned` field.
```

## Change 3

Add a v1.2 row to the Version History table documenting the roster migration. Insert immediately after the existing v1.1 row.

**Add** (insert on a new line immediately after the existing v1.1 row, which ends with "Added Cognito `take=N` intake pattern and the Gmail `label:` display-name-not-ID rule to Connector notes. |"):

```markdown
| 1.2 | 2026-08-28 | Rep roster migrated to Airtable table `Lennar Personnel Roster` (base `app78fMUwDNBHUZ6r`, table `tblYI2KodPRjk1dAO`) with 11 initial records — the six people from v1.1 plus Tim Hall (NHC), Dianna Sherrod (Marketing Field Coordinator) and Danielle Kefauver (Marketing Specialist), plus Carly Evans and Stefanie Nayder as Departed records preserved for historical POC reference integrity. Retired the inline rep-roster table from the "How a New Listing Arrives" section; replaced with a pointer to the Airtable table, read patterns for sessions, and a community-naming note (Harpers Mill TH/SF are Sheet-side property-type variants of one physical community). POC field on Lennar Listings migrated from singleSelect (`fldQie6dPBjMO8aqh`, deleted) to linked-record field (`fldL1lmrjcJaOZGIf`) pointing at the roster; the 11 existing POC values re-linked in-place. New `Communities Assigned` linked-record field on the roster ties to Community Reference DB, unlocking the parked Active Listing Email work. |
```

No other changes to `Lennar_New_Listing_Protocol.md`.

```bash
git add -A
git commit -m "Lennar_New_Listing_Protocol.md v1.2 — migrate rep roster to Airtable, POC field to linked record"
git rm handoffs/HANDOFF-2026-08-28-lennar-new-listing-protocol-v1-2.md
git add -A
git commit -m "Remove applied handoff"
git push origin main
```

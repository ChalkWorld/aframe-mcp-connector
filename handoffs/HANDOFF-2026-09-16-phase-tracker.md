---
title: Cursor Handoff — Lennar_Restructure_Phase_Tracker.md — v0.7
document_id: HANDOFF-2026-09-16-phase-tracker
date: 2026-09-16
project: AAR-TC Lennar Operational Project
---

Apply the changes below surgically to `docs/foundation/Lennar_Restructure_Phase_Tracker.md`. Do not modify anything not listed here.

## Change 1

Bump version and date in the frontmatter to reflect this session's close.

**Find**

```
version: 0.6
version_date: 2026-09-15
```

**Replace with**

```
version: 0.7
version_date: 2026-09-16
```

## Change 2

Append this session's decisions to the Decisions Landed list, before the Decisions Parked section header.

**Find**

```
This will also be the first entry in the not-yet-authored Base Schema Specification doc once that's written.

### Decisions Parked for Next Session
```

**Replace with**

```
This will also be the first entry in the not-yet-authored Base Schema Specification doc once that's written.

**Lennar Payload Rules base built as three colocated tables in the existing Lennar base.** Chose the existing Lennar base rather than a new dedicated base — Phase 0 scope reads "(separate base)" but the intent is "separate from CVRMLS Matrix Fields," not "dedicated per Builder-layer table." Three tables created: Source Types (enum, 5 seed rows: STATIC/COGNITO/COMMUNITY_DB/DERIVED/MANUAL_ENTRY), Cognito Fields (Form 17 field inventory, populated incrementally), and Payload Rules (the main table). Rules links intra-base to Community Reference DB, Source Types, and Cognito Fields; column set mirrors the CVRMLS Matrix Fields base's discipline (rich column descriptions, enum-as-table pattern for Source Types). Full detail in `SESSION-HANDOFF-2026-09-16-PAYLOAD-RULES-BASE-BUILD.md`.

**Cross-base linking to CVRMLS Matrix Fields: declined in favor of plain-text Input ID references.** Airtable synced tables evaluated but rejected — sync setup is Airtable-UI-only (outside the connector's reach), sync is not real-time, auto-pauses on inactive source bases, and nested linked-record fields on the sync degrade to text anyway. Runtime cost is equivalent since the Phase 1 script joins Rules ↔ Matrix Fields at generation time by Input ID either way. Reinforced by a parallel proposal in flight to flatten Field Options into Residential Input Form, which would break any sync we set up. Trade-off: typos are silent at authoring time; mitigated by a `Matrix Field Label` column duplicated onto Rule rows for legibility.

**Cognito Fields placed at the Builder layer, not the MLS layer.** Multi-Builder Pin currently lists "Cognito Form Fields" at MLS layer as "universal across builders" — corrected here because Form 17 is `LennarNewListingIntake`, explicitly Lennar-specific per the Session 026 decision ("No builder-name field on the form. Multi-builder reuse will be handled as a separate cloned/tweaked form per builder"). Future builders will get their own Cognito Fields tables in their own bases. Multi-Builder Pin phrasing needs a future revision.

**Excluded-field policy refined across two variants.** Fields the script never touches (Owner Phone, List Agent Code, Supra/Sentrilock LB #, LockBox Type) get no row — Rules stays lean, absence implies "not written." Fields the extension hardcodes without a payload key (Internet Display Info's 4 fields) get rows so the tab is represented and there's no question of whether it was overlooked. Established across Owner Info, Agent/Office Info, and Internet Display Info; LockBox Type moved from "STATIC blank" to excluded during Showing Instructions authoring — Matrix's default is blank, extension is doing an unnecessary write.

**Checkbox-group compound-ID modeling: base field ID with JSON-array Static Value.** Payload Schema splits `Input_722` into `Input_722_AS` and `Input_722_AR`; base treats it as one CHECKBOX_GROUP. Rules follows the base — one row per base field ID with array-valued Static Value (`["02"]`, `["01"]`, `["AR"]`). Static Value column is singleLineText; array-valued rules store the array as literal JSON text. For non-Max checkbox groups (Input_722), the Rule's Notes column captures the "unlisted options explicitly unchecked, not left in default state" intent.

**Payload Rules coverage: 4 of 12 tabs complete — 15 rows written.** Owner Info (7 STATIC), Agent/Office Info (2 STATIC), Internet Display Info (4 STATIC), Showing Instructions (2 STATIC + 1 COGNITO). Three consecutive all-static tabs (Form 17 has no Owner/Agent/Internet-Display sections) established the "small static tab" pattern; Showing Instructions exercised the Cognito Fields link for the first time.

**Data hygiene cleanup in CVRMLS Matrix Fields base.** Seven stale Field Options records deleted, all superseded by 2026-09-15 extraction-pass records that had been left alongside older entries: three from Input_163 Type (old label format with codes embedded, e.g. "ER (Exclusive Right)") and four from Input_333 LockBox Type (2026-09-10 stubs with no Values, superseded by extraction-pass records with proper `02`/`03`/`04` codes). Both fields now show 4 correct options each, matching the live-DOM confirmation.

**Payload Schema §4.7-4.11 imprecisions and omissions: deliberately NOT queued for correction.** Per this session's policy call, the schema stays lightweight and streamlined; the Rules table carries the complete structure. Specifics for provenance: §4.8 doesn't mention Input_853 (base does); §4.11 calls Internet Display fields "MLS-wide constants" (base clarifies they're Lennar-policy constants driven by Listing Agreement §11); §4.9 states LockBox Type as `Static ""` (session-live decision was to exclude entirely). None of these get schema corrections. Value corrections from the 2026-09-15 extraction pass (New/Resale, Year Built Description, SqFt Source, LBGD→LGD) remain queued separately — those are wrong values, not omissions.

### Decisions Parked for Next Session
```

## Change 3

Replace the Decisions Parked for Next Session section content with an updated list that carries forward the still-relevant items from v0.6 and adds this session's new parked items.

**Find**

```
### Decisions Parked for Next Session

**Cascade Options table build.** Design agreed (see Decisions Landed) — new table plus a new link column on Residential Input Form — but not yet created in Airtable. First candidate for next session; also seeds the first entry of the not-yet-authored Base Schema Specification doc.

**Whether to write County/City's own flat 11-option list now or hold it with the cascade-table work.** County/City itself doesn't need the new table (it's unscoped, top of the chain) — the data already exists in `CVRMLS_County_City_Reference.md`, just not yet in Airtable. Area/Elementary/Middle/High School do need the new table and stay blocked on it.

**Post Office and Subdivision closure.** Recommended as "working as intended, no extraction needed" since both are explicitly MANUAL — never written by the bookmarklet — but not yet explicitly confirmed by Andrew.

**Four doc corrections not yet folded into source docs.** New/Resale and Year Built Description defaults in `CVRMLS_Payload_Schema.md`; the SqFt Source default wherever it's recorded; the Showing Instructions `LBGD`→`LGD` reference. Also unresolved: whether the SqFt Source `01`/`02` swap requires reviewing any live listings that used the wrong code.

**Whether Features' Matrix UI has real Section panels.** Unchanged from prior session — see Decisions Landed, prior session. If Andrew confirms Features has no visible section headers in Matrix, Table Structure's decision should be revised to name Listing Info only; if it does, a live-extraction pass identifies the panel names and boundaries before Section links get added retroactively.
```

**Replace with**

```
### Decisions Parked for Next Session

**Payload Rules authoring — 8 tabs remaining.** This session completed Owner Info, Agent/Office Info, Internet Display Info, and Showing Instructions (4 of 12 tabs, 15 rules). Remaining tabs in ascending complexity: Virtual Tour Info (2 Cognito rules), Bath Info (Cognito-heavy, first repeating-section pattern), General Info (mixed statics + community-scoped), Fee Info (first COMMUNITY_DB rules, first community-scoped rows; also carries the Payload Schema's "capital contribution scope only confirmed for 2 of 5 communities" open question), Remarks (Cognito with character-limit constraints), Listing Info (biggest, community-name resolution derivation), Features (biggest and most complex, includes Payload Schema §5.4.1 Cognito crosswalks). Room Info explicitly out of scope.

**Cascade Options table build.** Unchanged from v0.6 — design agreed, not yet created in Airtable. First candidate for next session's structure work; also seeds the first entry of the not-yet-authored Base Schema Specification doc.

**Whether to write County/City's own flat 11-option list now or hold it with the cascade-table work.** Unchanged from v0.6.

**Post Office and Subdivision closure.** Unchanged from v0.6 — recommended as "working as intended, no extraction needed" since both are explicitly MANUAL, but not yet explicitly confirmed by Andrew.

**Four extraction-pass value corrections not yet folded into source docs.** Unchanged from v0.6 — New/Resale and Year Built Description defaults in `Lennar_Payload_Schema.md`; the SqFt Source default wherever it's recorded; the Showing Instructions `LBGD`→`LGD` reference. Separate from Payload Schema §4.7-4.11 imprecisions surfaced during this session's Rules authoring, which were deliberately NOT queued (schema stays lean per this session's policy call).

**Whether Features' Matrix UI has real Section panels.** Unchanged open item from v0.6.

**Multi-Builder Pin phrasing correction.** Tracker's Multi-Builder Pin lists "Cognito Form Fields" at the MLS layer as "universal across builders" — inaccurate. Form 17 is Lennar-specific (`LennarNewListingIntake`), and future builders will get their own Cognito Fields tables in their own bases. Phrasing needs a future revision but not urgent.

**Extension-side script optimizations surfaced by the Rules audit.** LockBox Type (Input_333) — extension currently writes empty string; Rules says leave untouched. First entry of a running list — more optimizations likely as the remaining 8 tabs are authored. Address at the eventual extension rebuild.
```

## Change 4

Replace the Next Session Opening Move section to reflect the new priorities.

**Find**

```
## Next Session Opening Move

1. Read this tracker first, then `SESSION-HANDOFF-2026-09-15-GAP-EXTRACTION-PASS.md` for full extraction data, the four doc-correction findings, and the Cascade Options table design.
2. **Scope the Lennar Payload Rules table.** This is now the priority — the field-mapping work does not by itself unblock Phase 1 script-writing; the actual builder-specific logic (migrated Payload Schema content, plus the example-inferred-rule audit: garage code, phone-number handling, community-name resolution, anything currently inferred from examples rather than stated as an explicit rule) is still outstanding and more directly load-bearing for the script than the field map was.
3. **Build the Cascade Options table.** Agreed design in Decisions Landed above — new table plus a new link column on Residential Input Form. Decide alongside this whether to write County/City's flat 11-option list at the same time or separately (see Decisions Parked).
4. **Fold the four doc corrections into source docs** — see Decisions Parked for the full list.
5. **Resolve whether Features has real Matrix UI Section panels** — unchanged open item, a quick live-DOM check settles it either way.
6. Room Info stays deferred — Lennar skips this tab entirely, and it's low priority for this operation otherwise.
7. Residential Input Form population remains functionally complete across all in-scope tabs (Room Info excepted by design) — the 8 remaining GAP-flagged fields (County/City, Area, 3 Schools, ZIP, Post Office, Subdivision) are the deliberately-deferred cascade/MANUAL items, not overlooked gaps.
```

**Replace with**

```
## Next Session Opening Move

1. Read this tracker first, then `SESSION-HANDOFF-2026-09-16-PAYLOAD-RULES-BASE-BUILD.md` for the full base structure, cross-base linking decision, excluded-field policy, and 4-tab authoring detail.
2. **Continue Payload Rules authoring — 8 tabs remaining.** Suggested order in ascending complexity: Virtual Tour Info (2 Cognito rules) → Bath Info (Cognito-heavy, first repeating-section pattern) → General Info (mixed statics + community-scoped) → Fee Info (first COMMUNITY_DB rules, first community-scoped rows) → Remarks (Cognito with character-limit constraints) → Listing Info (biggest, community-name resolution derivation) → Features (biggest and most complex, includes Payload Schema §5.4.1 Cognito crosswalks). Room Info explicitly out of scope.
3. **Build the Cascade Options table** (unchanged parked item from v0.6 — design agreed, needs creating).
4. **Fold the four extraction-pass value corrections** into `Lennar_Payload_Schema.md` (New/Resale, Year Built Description, SqFt Source defaults) and the Showing Instructions reference doc (`LBGD`→`LGD`). Payload Schema §4.7-4.11 imprecisions surfaced this session are NOT queued — schema stays lean.
5. **Resolve whether Features has real Matrix UI Section panels** — unchanged open item, a quick live-DOM check settles it either way.
6. Confirm Post Office / Subdivision closure with Andrew if not already settled.
7. Room Info stays deferred — Lennar skips this tab entirely.
8. Residential Input Form population remains functionally complete across all in-scope tabs (Room Info excepted by design) — the 8 remaining GAP-flagged fields (County/City, Area, 3 Schools, ZIP, Post Office, Subdivision) are the deliberately-deferred cascade/MANUAL items, not overlooked gaps.
```

## Change 5

Add a new Version History row for v0.7 immediately after the v0.6 row.

**Find**

```
| 0.6 | 2026-09-15 | Session close after the GAP extension-verification pass. Rebuilt the GAP list fresh per this tracker's own instruction and found 25 fields, not the 18 carried in v0.4/v0.5 — Listing Info's 2026-09-10 pass had actually flagged 16 GAP fields, not 9. Extracted and wrote 17 of the 25 via a series of Claude-in-Chrome live-DOM sessions (138 new Field Options rows; all 17 Notes-column GAP flags cleared). Surfaced four real doc-vs-live corrections, not just new data: New/Resale and Year Built Description both had a documented value (`EXIST`) that doesn't exist on either entry path; SqFt Source's `01`/`02` were swapped from the confirmed default; Showing Instr 2's documented `LBGD` code doesn't exist (`LGD` is correct). Standard-listing replacements confirmed by Andrew: `RESAL` and `ACTUAL` respectively. County/City scope decided: stay at 11 confirmed jurisdictions, no further extraction. Agreed the design for a new Cascade Options table (for Area/Schools' per-jurisdiction option scoping) but deferred building it to next session. Confirmed script-writing (Phase 1) is not yet unblocked — Lennar Payload Rules table population is still outstanding and is now the priority. Remaining 8 GAP-flagged fields are the deliberately-deferred County/City-cascade and MANUAL items. Full detail in `SESSION-HANDOFF-2026-09-15-GAP-EXTRACTION-PASS.md`. |
```

**Replace with**

```
| 0.6 | 2026-09-15 | Session close after the GAP extension-verification pass. Rebuilt the GAP list fresh per this tracker's own instruction and found 25 fields, not the 18 carried in v0.4/v0.5 — Listing Info's 2026-09-10 pass had actually flagged 16 GAP fields, not 9. Extracted and wrote 17 of the 25 via a series of Claude-in-Chrome live-DOM sessions (138 new Field Options rows; all 17 Notes-column GAP flags cleared). Surfaced four real doc-vs-live corrections, not just new data: New/Resale and Year Built Description both had a documented value (`EXIST`) that doesn't exist on either entry path; SqFt Source's `01`/`02` were swapped from the confirmed default; Showing Instr 2's documented `LBGD` code doesn't exist (`LGD` is correct). Standard-listing replacements confirmed by Andrew: `RESAL` and `ACTUAL` respectively. County/City scope decided: stay at 11 confirmed jurisdictions, no further extraction. Agreed the design for a new Cascade Options table (for Area/Schools' per-jurisdiction option scoping) but deferred building it to next session. Confirmed script-writing (Phase 1) is not yet unblocked — Lennar Payload Rules table population is still outstanding and is now the priority. Remaining 8 GAP-flagged fields are the deliberately-deferred County/City-cascade and MANUAL items. Full detail in `SESSION-HANDOFF-2026-09-15-GAP-EXTRACTION-PASS.md`. |
| 0.7 | 2026-09-16 | Session close after Payload Rules base build + 4-tab authoring pass. Three tables built in the existing Lennar base (Source Types with 5 enum rows, Cognito Fields with 1 row, Payload Rules with 15 rows across Owner Info, Agent/Office Info, Internet Display Info, and Showing Instructions). Key design decisions landed: Rules colocated in Lennar base (not a new dedicated base); cross-base link to Matrix Fields declined in favor of plain-text Input ID references (synced-table evaluated but rejected — UI-only setup, sync lag, auto-pause risk, and parallel Field Options flattening proposal all argued against); Cognito Fields placed at Builder layer since Form 17 is Lennar-specific (Multi-Builder Pin phrasing needs future revision); excluded-field policy refined into two variants — "script doesn't touch" gets no row, "extension hardcodes without payload key" gets a row so the tab is represented; checkbox-group compound IDs modeled at base field ID with JSON-array Static Values. Data hygiene: 7 stale Field Options records deleted from CVRMLS Matrix Fields base (Input_163 Type, Input_333 LockBox Type) where the 2026-09-15 extraction pass had left older records alongside corrected new ones. LockBox Type Rule specifically shifted from "STATIC blank" to excluded — Matrix defaults blank, extension currently does unnecessary write (surfaced as extension optimization for the eventual rebuild). Payload Schema §4.7-4.11 imprecisions surfaced but deliberately not queued for correction (schema stays lean); §4.7-4.11 value corrections from the 2026-09-15 extraction pass remain queued separately. 8 tabs and the Cascade Options table build remain for next session. Full detail in `SESSION-HANDOFF-2026-09-16-PAYLOAD-RULES-BASE-BUILD.md`. |
```

No other changes to `Lennar_Restructure_Phase_Tracker.md`.

```bash
git add -A
git commit -m "Phase Tracker v0.7 — Payload Rules base build + 4-tab authoring pass"
git push origin main
```

Also delete this handoff after Cursor applies it:

```bash
git rm handoffs/HANDOFF-2026-09-16-phase-tracker.md
git add -A
git commit -m "Phase Tracker v0.7 — Payload Rules base build + 4-tab authoring pass"
git push origin main
```

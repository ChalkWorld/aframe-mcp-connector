---
title: Phase Tracker Bump to v0.14 + Conventions v0.5
handoff_id: HANDOFF-2026-10-05-phase-tracker-v0.14
date: 2026-10-05
author: Andrew Rich (via Claude Opus 4.7 session)
project: AAR-TC Lennar Operational Project
targets:
  - docs/foundation/Lennar_Restructure_Phase_Tracker.md
  - docs/foundation/Payload_Rules_Conventions.md
related:
  - SESSION-HANDOFF-2026-10-05-PHASE-1-PIPELINE-LIVE.md
  - HANDOFF-2026-10-05-phase-1-pipeline-build.md
batch_override: yes — tracker + conventions bump are one logical close-of-session unit
---

# Phase Tracker Bump to v0.14 + Conventions Bump to v0.5

Closes the 2026-10-05 Phase 1 pipeline-build session. Two docs updated:

1. **`Lennar_Restructure_Phase_Tracker.md`** — v0.13 → v0.14. Pipeline landing, convention #10 codification, bath-tab defaults fix, Cursor's doc-vs-contract triage trap documented, parked items refreshed, next-session opening move set to Phase 1 community expansion.
2. **`Payload_Rules_Conventions.md`** — v0.4 → v0.5. Convention #10 added (Features-tab prefixing) — validated this session by the extension correctly checking all Features-tab checkboxes on the first fill.

**Batched override justification:** Tracker bump + Conventions bump are session-close docs that go together. Splitting would leave the tracker referencing a Conventions version that doesn't exist yet (or vice versa) in the interim commit. One commit, one atomic session close.

---

## 1. Changes to `Payload_Rules_Conventions.md`

### Header block

```yaml
version: 0.5
date: 2026-10-05
```

### Add convention #10 to the Conventions section

Insert immediately after convention #9 (and before the Change Log section):

```markdown
### 10. Features-tab checkbox outputs are prefixed with the rule's Matrix Input ID

The Rules table and the Community Reference DB may store Features-tab checkbox-group outputs as bare suffix codes:

- STATIC Static Value: `"[\"03\"]"` for Structure, `"[\"19\"]"` for Style TH
- COGNITO Transform output: `"01"`, `"13"`, `"25"` for Interior crosswalk, etc.
- COMMUNITY_DB Community Amenities Codes: `"01,04,46,22"`

The script prefixes each code with the rule's Matrix Input ID at output time, producing full `Input_XX_YY` form in the final payload. This applies **only** to rules whose Tab is `Features`.

**Non-Features checkbox groups pass through bare.** Disclosures (`Input_102`), Lead Disclosure (`Input_103`), Owned By (`Input_120`), Possession (`Input_121`), Fee Includes (`Input_576`), Fee Desc (`Input_111`), and Showing Flags (`Input_722`) all stay as bare suffix codes in the payload. The known-good `Lennar_Payload_Examples.md` shape confirms this split: Features consistently uses full IDs, non-Features consistently uses bare codes.

**Where a DB column already stores full Input IDs**, the prefixer is a no-op. The Community Reference DB's `Heating Codes` and `Heating Fuel Codes` columns store full IDs (`"Input_86_08"`, `"Input_87_02"`); the script splits-on-comma and the resulting items pass through the prefixer unchanged because they already begin with `"Input_"`.

This convention is a downstream application of convention #3 (Transform is the definitive spec when present). It specifies how the script bridges the Rules-table bare-code authoring convention to the extension's full-ID payload consumption convention.

**Future Rules-table hygiene candidate.** A future cleanup pass could normalize all Features-tab checkbox rules to store full Input IDs, making the Rules table self-describing. The script's prefixer would then become a no-op for every Features-tab rule and could be removed. Non-blocking; convention #10 carries the gap in the interim.
```

### Prepend to the Change Log

Insert immediately below the `## Change Log` heading, above the existing v0.4 entry:

```markdown
**v0.5 — 2026-10-05** — Added convention #10 (Features-tab checkbox outputs are prefixed with the rule's Matrix Input ID) codified from the 2026-10-05 Phase 1 pipeline-build session. The bare-code vs. full-Input-ID shape gap was surfaced before any code was written; Option A (script-side prefixing, no Rules-table rewrite) was chosen because it ships the pipeline faster and keeps Rules authoring stable. Convention #10 was validated the same session by the extension correctly checking every Features-tab checkbox (Structure, Siding, Roof, Interior, Exterior, Appl/Equip, Garage, etc.) on the first end-to-end fill against Entry #20 (6136 Hull Street Rd, Creekside Run TH). Non-Features checkbox groups stay bare per the example-payload shape. Where a DB column stores full IDs already (Heating Codes, Heating Fuel Codes), the prefixer is a no-op. Downstream application of convention #3. Future Rules-table hygiene candidate: normalize Features-tab checkbox rules to store full IDs, make the Rules table self-describing, remove the prefixer. Non-blocking.
```

---

## 2. Changes to `Lennar_Restructure_Phase_Tracker.md`

### Header block

```yaml
version: 0.14
version_date: 2026-10-05
```

### Decisions Landed This Session — append after the existing v0.13 landings

Add these new landings to the end of the "Decisions Landed This Session" section:

```markdown
**Phase 1 pipeline landed and validated end-to-end through the extension (v0.14).** `generate_payload()` placeholder in `extension/scripts/generate.py` replaced with the full pipeline via `HANDOFF-2026-10-05-phase-1-pipeline-build.md` (one file, one feature, deliberately batched; applied by Cursor on Sonnet 5 High). Pipeline implements: Cognito Form 17 fetch → community resolution per convention #6 → Payload Rules + Cognito Fields + Source Types + Community Reference DB fetch from Airtable → rule iteration with Property Type + Path scoping → dispatch by Source Type (STATIC / COGNITO / COMMUNITY_DB / DERIVED, MANUAL_ENTRY skipped) → Features-tab prefixing per new convention #10 → payload assembly matching `Lennar_Payload_Examples.md`. All four Airtable table IDs resolved at authoring time and hardcoded in the script (`tbletiuyEdhVwcwGw`, `tbl9LWfHDEuYtgFvv`, `tblpwaJswUvNpYOyY`, `tbleMbM1WgY8Si2t7`). All Transforms from all 111 rules implemented, dispatched by Matrix Input ID. `_cognito_null_default` numeric-TEXT list hardcoded in the dispatcher (convention #1 application; low-priority candidate for Rules-table parameterization later). `OUTPUT_MAP` codifies the envelope shape, including Bath Info's three-tuple nesting, Showing Flags' two-boolean split, Internet Display's deliberate drop (per v0.7 excluded-field policy, rows exist in Rules but no payload key), and Virtual Tour's tab-skip (if `PhotosVirtualTour.VirtualTourLink` is blank, section omitted entirely per Rule 17). `ensure_ascii=False` flipped on `json.dumps` as parked from v0.13. First end-to-end run against live Entry #20 (6136 Hull Street Rd, Creekside Run TH, submitted that morning by Izaiah Clark): exit code 0, no RuntimeErrors — every rule hit resolved cleanly.

**Target community shifted mid-opening from Harpers Mill TH to Creekside Run TH (v0.14).** Session opened on HM TH per v0.13's parked next-session opening move. Mid-opening the operator confirmed a fresh Form 17 entry had been submitted that morning (Entry #20, Creekside Run TH), and the known-good example payload operator had on hand was also a Creekside Run TH payload (6132 Hull Street Rd from September). Two Creekside Run TH artifacts in hand was cleaner than hunting for an HM TH example, so target shifted. No dispatcher changes required — same `taxid` path, same TH property-type structure as the planned HM TH case.

**Features-tab bare-code vs. full-Input-ID shape gap resolved as script-side prefixing (Option A), codified as convention #10 (v0.14).** The Rules table authored Features-tab checkbox outputs as bare suffix codes (STATIC "[\"03\"]" for Structure, Transform producing "01"/"13"/"25"/"29" for Interior crosswalk). The known-good example payload required full `Input_XX_YY` form. Non-Features checkbox groups (Disclosures, Lead Disclosure, Owned By, Possession, Fee Includes, Fee Desc, Showing Flags) stayed bare in both Rules authoring and the example — consistency in those cases, inconsistency only at Features. Two resolution paths surfaced:
- Option A — Script-side prefixing. Script prefixes bare codes with the rule's Matrix Input ID at output time for Features-tab checkbox-group rules only. No Rules-table changes. Chosen for speed and Rules authoring stability.
- Option B — Rules-table rewrite. Update every Features-tab checkbox STATIC value and Transform to produce full IDs; normalize the Community DB. Deferred as a future hygiene candidate.

Convention #10 codified in `Payload_Rules_Conventions.md` v0.5 (bumped from v0.4 this session). The script's `_prefix_features_codes()` is a no-op when the Tab is not Features, and a no-op when the code already begins with `"Input_"` (handles the Heating Codes / Heating Fuel Codes case where the Community DB stores full IDs).

**Convention #10 validated by the first extension fill (v0.14).** Operator dropped Entry #20's payload into the Chrome extension and ran a Matrix fill. The extension correctly checked all boxes under Structure, Siding, Roof, Interior, Exterior, Appl/Equip, Garage, etc. — confirming end-to-end that the full-`Input_XX_YY` output shape is what the extension consumes. Convention #10 moved from "proposed" (parked in the pipeline-build handoff) to "live" in `Payload_Rules_Conventions.md` v0.5 the same session.

**Bath Info Level 4 empty-defaults fix shipped as a small follow-up to the main pipeline handoff (v0.14).** First extension fill surfaced one shape issue: Matrix's Bath Info tab errored with `Cannot read properties of undefined (reading 'desc')` because the extension assumes every level sub-object (`basement`, `level1`–`level4`) exists in the payload. Our output had only `basement`, `level1`, `level2`, `level3` — Rule 44 deliberately excludes Level 4 per v0.8 (no Form 17 source). Matrix's assumption is a quirk, not a Rules-table bug — Level 4 bath fields need static "0"s on every listing regardless of what Rules authors. Fix: extended the existing section-defaults loop at the end of `generate_payload()` to also fill in any missing bath sub-objects with `{"desc": "", "full": "0", "half": "0"}` via `setdefault` (non-destructive — levels populated by rules keep their rule-driven values). Shipped in-chat as a Cursor-paste block rather than a formal handoff; operator applied and confirmed the next extension fill completed cleanly.

**Diff-against-example vs. diff-against-contract — Cursor's doc-trap and the protocol-lookup correction (v0.14).** Cursor's post-apply triage report flagged 4 keys that appeared in `Lennar_Payload_Examples.md` but not in the Entry #20 output: `listing.lot`, `fee.allow_onsite`, `bath.level4`, `showing.lockbox_type`. All 4 trace to deliberate Rules-table decisions landed in prior tracker versions:
- `listing.lot` (Input_622) — Rule 95 is correctly path-scoped to `new`; Creekside is `taxid` so skips. The repo's HM TH `taxid` example shows `lot: "17"` which predates the Path-in-DB rearchitect (v0.10) — stale example, not a pipeline bug.
- `fee.allow_onsite` — per v0.7, extension writes unnecessarily; Rules deliberately omits (convention #5 absence-as-signal).
- `bath.level4` — per v0.8, excluded (no Form 17 source). Separately fixed in this session via the bath-defaults follow-up above, which fills the shape without changing Rules authoring.
- `showing.lockbox_type` — per v0.7, extension does unnecessary write; Rules deliberately omits.

Project-protocol-lookup rule ("doc wins over derivation") caught the trap: the Rules table + Conventions file are the source of truth, not the stale example doc. Worth documenting the shape of this trap because comparing script output against a known-good example is a reasonable instinct, but Rules-table-absence-as-signal (convention #5) means "key absent in output" is not the same as "gap in output" — the Conventions file explicitly resolves the four cases above as deliberate omissions. The stale `Lennar_Payload_Examples.md` v1.1 doc gets a Phase 4 refactor pass; non-blocking.

**Extension-contract knowledge: script carries shape responsibility by default (v0.14).** Both shape fixes surfaced this session (Features-tab prefixing, Bath Info level defaults) were resolved script-side rather than extension-side or Rules-table-side. The pattern that landed: the extension consumes the script's payload, so when a shape mismatch surfaces, the script carries the responsibility unless the fix would conflict with Rules-table authoring intent. The script holds OUTPUT_MAP (envelope shape), `_prefix_features_codes()` (checkbox-group format), and the bath-level defaults — all extension-contract knowledge that the Rules table doesn't need to express. If a future mismatch surfaces where the Rules table's intent IS the problem (not just how the script interprets it), that would be the first case warranting Rules-table changes.
```

### Decisions Parked for Next Session — replace the current list with this updated set

Replace the entire "Decisions Parked for Next Session" subsection with:

```markdown
**Phase 1 pipeline expansion to the other 4 active communities** (new, v0.14, Priority 1 next session). The Creekside Run TH `taxid` happy-path is operational. Remaining communities: Harpers Mill TH (`taxid`, same shape — natural first validation), Harpers Mill SF (`taxid`, SF scope — exercises Rule 116 Style SF and the SF branch of Rule 110 Garage DERIVED for the first time), Everstone SF (`taxid`, same architectural shape as HM SF), Watermark SF (`new`, architecturally most interesting — first `new`-path listing, exercises Rules 50/51/52/71/93/94/95 that have been path-scoped out until now). Each community's first run is a verification, not a build.

**Rules-table Features-tab cleanup** (new, v0.14, low priority). Rules table currently stores Features-tab checkbox outputs as bare suffix codes while the script prefixes at output time per convention #10. Future Rules-table hygiene pass could normalize to full `Input_XX_YY` and remove the prefixer. Non-blocking; convention #10 carries the gap.

**`Lennar_Payload_Examples.md` v1.1 doc refresh** (new, v0.14, low priority). HM TH `taxid` example shows `lot: "17"` which predates Path-in-DB (v0.10) and misled Cursor's post-apply triage. Phase 4 doc refactor pass.

**`_cognito_null_default` numeric-TEXT list is hardcoded in the dispatcher** (new, v0.14, low priority). Convention #1 applied to a specific list of Input IDs; if a new numeric-count field joins Rules later, the list needs updating. Could parameterize via a Rules-table flag column eventually; not urgent.

**`CURSOR-HANDOFF-PROTOCOL-001` protocol-doc refresh** (unchanged from v0.13, low priority). v1.1 says "delete handoff files after apply"; active convention is move-to-`handoffs/applied/`. Batched-handoff override pattern surfaced by 2026-10-02 scaffold handoff and reinforced by this session's pipeline-build handoff + tracker-bump handoff.

**`SCRIPTS-*` doc_id convention decision** (unchanged from v0.13, low priority).

**Post Office and Subdivision closure.** Unchanged from v0.6.

**HOA Fee / Additional Fee DB column split** (unchanged from v0.9, low priority).

**Copyright Agreement multi-builder promotion decision** (unchanged from v0.9, low priority).

**Whether Features' Matrix UI has real Section panels.** Unchanged from v0.6.

**Multi-Builder Pin phrasing correction.** Unchanged from v0.7, not urgent.

**Payload Rules table description update via API blocked.** Unchanged from v0.8. Conventions file now v0.5.

**Property Type multi-select orphan option cleanup.** Unchanged from v0.8.

**`Payload_Rules_Conventions.md` ID convention decision.** Unchanged from v0.8.

**NumberOfCars form constraints** (unchanged from v0.11, low priority).

**Phase 0 doc authoring items.** Vision/charter is landed. Still to author: base schema specification, maintenance protocol, builder-onboarding protocol. Not blocking Phase 1 expansion; better authored once the pipeline proves out across all 5 communities.

**Removed from queue this session:**
- Phase 1 pipeline build (completed — pipeline live, validated end-to-end through the extension).
- Convention #10 proposal (completed — codified in `Payload_Rules_Conventions.md` v0.5).
- `ensure_ascii=False` cosmetic flip (completed — shipped in the main pipeline-build handoff).
- Phase 1 target community decision (completed — Creekside Run TH served as the happy-path, HM TH deferred as next-session's first expansion target).
```

### Next Session Opening Move — replace the current section with this

Replace the entire "Next Session Opening Move" section with:

```markdown
## Next Session Opening Move

**The Creekside Run TH `taxid` happy-path is fully operational.** Payload generation runs end-to-end against live Cognito + Airtable + Community DB data, and the extension fills all 12 Matrix tabs cleanly. Next session's job is to expand the pipeline validation to the other 4 active communities.

**Priority 1 — Harpers Mill TH end-to-end validation.** Same `taxid` path, same TH structure. Straight dispatch verification that the pipeline handles a second community cleanly without any new work expected. If something breaks, that reveals a Creekside-specific assumption we accidentally baked in.

Sequencing:
1. Read this handoff, then the Phase 1 Pipeline Live session handoff (SESSION-HANDOFF-2026-10-05-PHASE-1-PIPELINE-LIVE.md). `Payload_Rules_Conventions.md` v0.5 at hand for the newly-codified convention #10.
2. Pick a recent HM TH Form 17 entry. If no fresh one exists, operator submits a test entry via Form 17's test mode.
3. Run `python generate.py --entry-id <id> --out /tmp/hmth-payload.json`. Verify exit code 0 and no RuntimeErrors (same success criteria as Entry #20).
4. Drop the payload into the extension on a test/draft Matrix listing. Walk through all 12 tabs. Flag any discrepancies.
5. Each discrepancy sorts into (a) extension expects a different shape — small follow-up handoff like the bath-defaults fix, (b) Rules-table bug — fix the table, or (c) new dispatcher case needed — small follow-up handoff.

**Priority 2 — Harpers Mill SF end-to-end validation.** First SF listing through the pipeline. Exercises Rule 116 (Style SF COGNITO Transform) for the first time, Rule 110 (Garage DERIVED) SF branch for the first time, Rule 111 (Basement/Foundation) full SF branch tree for the first time (including the FinishedStatus crosswalk), Rule 114 (Basement Y/N) SF branch, and HM SF's three personnel vs. Creekside's single POC. Same sequencing as HM TH.

**Priority 3 — Everstone SF end-to-end validation.** Same architectural shape as HM SF, different community DB row. Exercises Rule 77 (Neighborhood) for the first time — Everstone is the only community currently populating that column.

**Priority 4 — Watermark SF end-to-end validation.** Architecturally the most interesting — first `new`-path listing. All path-scoped rules get exercised for the first time: Rules 50 (Acres COGNITO), 51 (Tax Year DERIVED), 52 (Legal Description STATIC "TBD"), 71 (PID STATIC "TBD"), 93 (Street Number COGNITO), 94 (Street Name COGNITO), 95 (Lot COGNITO). Rules 93-95's new-path-only scope means the extension will finally see non-blank values for Input_34, Input_36, Input_622.

**Not for next session (Phase 1 completion items — later):**
- The parked HOA Fee / Additional Fee DB column split.
- The queued doc corrections (Phase 4 refactor).
- Phase 2 extension integration (CLI wrapped as an endpoint).

Those come after Phase 1 proves out across all 5 active communities.

At session close: bump tracker version, refresh Decisions Parked and Next Session Opening Move. Substantive decisions migrate to canonical foundation docs, not into this tracker.
```

### Version History — prepend a new row at the top of the table body

Insert immediately below the existing v0.13 row:

```markdown
| 0.14 | 2026-10-05 | Session close after the Phase 1 pipeline build + first end-to-end extension fill. `generate_payload()` placeholder replaced with the full pipeline via `HANDOFF-2026-10-05-phase-1-pipeline-build.md` (single-file, single-feature, deliberately batched; applied by Cursor on Sonnet 5 High). Pipeline implements Cognito fetch → community resolution per convention #6 (hard-fail on miss) → Airtable fetch of all 4 reference tables → rule iteration with Property Type + Path scoping → dispatch by Source Type (STATIC/COGNITO/COMMUNITY_DB/DERIVED) → Features-tab prefixing per new convention #10 → payload assembly. All 111 rules' Transforms implemented, dispatched by Matrix Input ID. Target community shifted mid-opening from HM TH to Creekside Run TH when a fresh Form 17 entry (6136 Hull Street Rd, Entry #20, submitted that morning by Izaiah Clark) landed and operator had a Creekside Run TH example payload on hand — two artifacts in hand was cleaner than hunting for an HM TH example, no dispatcher changes needed. First end-to-end run exit code 0, no RuntimeErrors. Operator ran extension fill on test Matrix listing: all 12 tabs filled correctly except Bath Info, which errored because Matrix's tab assumes every level sub-object (`basement`, `level1`-`level4`) always exists while our payload omitted `level4` per Rule 44's deliberate v0.8 exclusion (no Form 17 source). Fix shipped in-chat as a Cursor-paste block (not a formal handoff): extended the section-defaults loop at the end of `generate_payload()` to also fill in missing bath sub-objects with Matrix's required empty-but-present shape via `setdefault` (non-destructive — rule-populated levels keep their rule-driven values). Operator applied and confirmed next extension fill completed cleanly. Features-tab prefixing convention validated by the extension's correct fill — codified as convention #10 in `Payload_Rules_Conventions.md` v0.5 (bumped from v0.4 same session) with "Features-tab checkbox outputs are prefixed with the rule's Matrix Input ID. Non-Features checkbox groups pass through bare. Where DB stores full IDs already (Heating Codes, Heating Fuel Codes), prefixer is a no-op." Downstream application of convention #3; future Rules-table hygiene candidate to normalize Features-tab authoring to full IDs and remove the prefixer, non-blocking. Cursor's post-apply triage flagged 4 absent keys (`listing.lot`, `fee.allow_onsite`, `bath.level4`, `showing.lockbox_type`) by comparing against the stale `Lennar_Payload_Examples.md` v1.1; project-protocol-lookup rule caught the trap — all 4 are deliberate Rules-table omissions traceable to prior tracker versions (v0.7, v0.8, v0.10). Stale example doc goes to Phase 4 refactor queue. Pattern that landed: extension-contract knowledge (envelope shape, checkbox format, bath-tab assumptions) lives in the script, not the Rules table, unless Rules-table intent is actually what's wrong. Pipeline is operational for Creekside Run TH taxid. Next session Priority 1: HM TH end-to-end validation. Full detail in `SESSION-HANDOFF-2026-10-05-PHASE-1-PIPELINE-LIVE.md`. |
```

---

## 3. Verification after Cursor applies

- `docs/foundation/Payload_Rules_Conventions.md` version is 0.5, date 2026-10-05, convention #10 present between #9 and the Change Log, Change Log has the new v0.5 entry at the top.
- `docs/foundation/Lennar_Restructure_Phase_Tracker.md` version is 0.14, version_date 2026-10-05, Decisions Landed has the new v0.14 landings appended, Decisions Parked is the replaced updated list, Next Session Opening Move is the replaced community-expansion plan, Version History has the new v0.14 row at the top.
- No other files touched.
- Session handoff doc (`SESSION-HANDOFF-2026-10-05-PHASE-1-PIPELINE-LIVE.md`) is created at the project's standard handoff location.

---

## 4. Rollback

Revert `docs/foundation/Lennar_Restructure_Phase_Tracker.md` and `docs/foundation/Payload_Rules_Conventions.md` to their pre-handoff state. Delete the new session handoff doc if it was committed. Nothing else touched.

---

*Co-authored by Claude Opus 4.7 as the 2026-10-05 session-close handoff. Companion to `HANDOFF-2026-10-05-phase-1-pipeline-build.md` and `SESSION-HANDOFF-2026-10-05-PHASE-1-PIPELINE-LIVE.md` from the same session.*

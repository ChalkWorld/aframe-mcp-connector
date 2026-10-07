---
title: Phase Tracker Bump to v0.15 + Conventions v0.6
handoff_id: HANDOFF-2026-10-07-phase-tracker-v0.15-and-conventions-v0.6
date: 2026-10-07
author: Andrew Rich (via Claude Opus 4.7 session)
project: AAR-TC Lennar Operational Project
targets:
  - docs/foundation/Lennar_Restructure_Phase_Tracker.md
  - docs/foundation/Payload_Rules_Conventions.md
related:
  - SESSION-HANDOFF-2026-10-07-EVERSTONE-SF-VALIDATION-AND-YESNO-FIX.md
  - HANDOFF-2026-10-07-generate-py-cognito-yesno.md
batch_override: yes — tracker + conventions bump are one logical close-of-session unit
---

# Phase Tracker Bump to v0.15 + Conventions Bump to v0.6

Closes the 2026-10-07 Everstone SF validation + YesNo bug fix session. Two docs updated:

1. **`Payload_Rules_Conventions.md`** — v0.5 → v0.6. Convention #11 added (Cognito field-type normalization for Yes/No semantic fields) codified from this session's YesNo bug.
2. **`Lennar_Restructure_Phase_Tracker.md`** — v0.14 → v0.15. Everstone SF validation landed, YesNo bug fix landed, Rule 114 latent bug flagged and fixed, Phase 1 declared "complete enough" with remaining 3 communities deferred to production catch, Phase 2 (extension integration) set as next session's opening move.

**Batched override justification:** Tracker bump + Conventions bump are session-close docs that go together. Splitting would leave the tracker referencing a Conventions version that doesn't exist yet (or vice versa) in the interim commit. One commit, one atomic session close.

---

## 1. Changes to `Payload_Rules_Conventions.md`

### Change 1.1 — Frontmatter version bump

**Find:**

```
document_id: PAYLOAD-RULES-CONVENTIONS-001
version: 0.5
date: 2026-10-05
```

**Replace with:**

```
document_id: PAYLOAD-RULES-CONVENTIONS-001
version: 0.6
date: 2026-10-07
```

### Change 1.2 — Add convention #11 after convention #10

**Find** (the ending of convention #10 plus the Change Log section header — keep both bookends intact, insert #11 in between):

```
**Future Rules-table hygiene candidate.** A future cleanup pass could normalize all Features-tab checkbox rules to store full Input IDs, making the Rules table self-describing. The script's prefixer would then become a no-op for every Features-tab rule and could be removed. Non-blocking; convention #10 carries the gap in the interim.

---

## Change Log
```

**Replace with:**

```
**Future Rules-table hygiene candidate.** A future cleanup pass could normalize all Features-tab checkbox rules to store full Input IDs, making the Rules table self-describing. The script's prefixer would then become a no-op for every Features-tab rule and could be removed. Non-blocking; convention #10 carries the gap in the interim.

### 11. Cognito field-type normalization for Yes/No semantic fields

Cognito's **YesNo** field type and **Choice** field type with Yes/No options are both reasonable form-author choices for a Yes/No question, but the single-entry API returns them differently: YesNo returns boolean (`true`/`false`), Choice returns strings (`"Yes"`/`"No"`). Dispatchers comparing against literal `"Yes"`/`"No"` silently fail on YesNo fields — `False == "No"` is False, `True == "Yes"` is False — so a branch intended to fire on a form answer never fires, and the dispatcher falls through to its default (often an empty value or coincidentally-correct wrong-reason value).

**The script normalizes Yes/No semantic reads via `_cognito_yesno(entry, dotted_path)`.** This helper reads the raw value with `_cognito_get`, converts boolean to `"Yes"`/`"No"`, passes strings through, and returns `""` for None. Dispatcher branches then compare against `"Yes"`/`"No"` string literals as the Transform text specifies, regardless of which Cognito field type the form uses.

**Scope:** use `_cognito_yesno` for any Cognito field that semantically answers Yes/No, whenever the field type is uncertain or specifically YesNo. Plain `_cognito_get` remains correct for Choice fields where the author has confirmed the return type is a string.

As of 2026-10-07, the only YesNo-typed field read by the dispatcher is `BuildFeatures.Basement.Basement` (Rules 111 and 114). `BuildFeatures.Garage.Garage1` is a Choice field returning strings and continues to work with plain `_cognito_get`. Community DB `Pool Y/N` is a text column (not a Cognito read) and is unaffected.

**View-API caveat:** the Cognito view-API (`get_entries_in_view`) stringifies booleans in its summary output, so a YesNo field looks like `"No"` or `"Yes"` in that listing — the mismatch only surfaces at single-entry fetch time, which is when the dispatcher actually reads. Debugging payload-generation bugs: trust `get_entry`'s shape, not the view listing.

This convention is a downstream application of convention #3 (Transform/Logic is the definitive spec; the helper preserves spec intent across Cognito field type variance) and complements convention #2 (the Cognito Field link is the primary source — this just adds a type-normalization layer at read).

---

## Change Log
```

### Change 1.3 — Prepend v0.6 Change Log entry

**Find:**

```
## Change Log

**v0.5 — 2026-10-05** —
```

**Replace with:**

```
## Change Log

**v0.6 — 2026-10-07** — Added convention #11 (Cognito field-type normalization for Yes/No semantic fields) codified from the 2026-10-07 Everstone SF validation session. Surfaced when Entry #18's first pipeline run came back with `features_a.basement_foundation = []` — Rule 111's SF+No→Crawl Space branch failed to fire because `BuildFeatures.Basement.Basement` returns boolean `false` from the single-entry Cognito API (YesNo field type), and the dispatcher compared it against the string `"No"`. `BuildFeatures.Garage.Garage1` doesn't have this problem because it's a Cognito Choice field with Yes/No as text options — returns the string. Both are reasonable form-author choices made at different times during Form 17 authoring. Fix: `_cognito_yesno()` helper added to `generate.py` after `_cognito_multiselect_list`; swapped the Basement reads in Rules 111 and 114 to use it. Rule 114 was simultaneously found to have the same latent flaw (Entry #18 coincidentally produced correct output; a SF+Yes-basement listing would have silently written `"0"` for Basement Y/N when it should write `"1"`). Both fixes shipped via `HANDOFF-2026-10-07-generate-py-cognito-yesno.md`. Pool Y/N (Community DB text column) and Garage1 (Choice field) left untouched. Downstream application of convention #3.

**v0.5 — 2026-10-05** —
```

No other changes to `Payload_Rules_Conventions.md`.

---

## 2. Changes to `Lennar_Restructure_Phase_Tracker.md`

### Change 2.1 — Frontmatter version bump

**Find:**

```
version: 0.14
version_date: 2026-10-05
```

**Replace with:**

```
version: 0.15
version_date: 2026-10-07
```

### Change 2.2 — Append v0.15 decisions-landed entries

**Find** (the last v0.14 decisions-landed entry plus the Decisions Parked section header — keep both bookends intact, insert v0.15 entries in between):

```
**Extension-contract knowledge: script carries shape responsibility by default (v0.14).** Both shape fixes surfaced this session (Features-tab prefixing, Bath Info level defaults) were resolved script-side rather than extension-side or Rules-table-side. The pattern that landed: the extension consumes the script's payload, so when a shape mismatch surfaces, the script carries the responsibility unless the fix would conflict with Rules-table authoring intent. The script holds OUTPUT_MAP (envelope shape), `_prefix_features_codes()` (checkbox-group format), and the bath-level defaults — all extension-contract knowledge that the Rules table doesn't need to express. If a future mismatch surfaces where the Rules table's intent IS the problem (not just how the script interprets it), that would be the first case warranting Rules-table changes.

### Decisions Parked for Next Session
```

**Replace with:**

```
**Extension-contract knowledge: script carries shape responsibility by default (v0.14).** Both shape fixes surfaced this session (Features-tab prefixing, Bath Info level defaults) were resolved script-side rather than extension-side or Rules-table-side. The pattern that landed: the extension consumes the script's payload, so when a shape mismatch surfaces, the script carries the responsibility unless the fix would conflict with Rules-table authoring intent. The script holds OUTPUT_MAP (envelope shape), `_prefix_features_codes()` (checkbox-group format), and the bath-level defaults — all extension-contract knowledge that the Rules table doesn't need to express. If a future mismatch surfaces where the Rules table's intent IS the problem (not just how the script interprets it), that would be the first case warranting Rules-table changes.

**Everstone SF validation complete; second community through the pipeline, first SF listing (v0.15).** Entry #18 (3737 Larimar Lane, Guilford Ranch, Chris MacLaird 2026-09-17) chosen for the single verification run. First-time code paths that fired correctly: Rule 77 Neighborhood (Everstone-only Input_236 write), Rule 116 Style SF COGNITO Transform (Ranch → `Input_541_18`), Rule 110 Garage DERIVED SF branch (Yes + 2 cars), Rule 114 SF basement_yn (No → `"0"`), Rule 111 SF+No branch (→ Crawl Space `Input_569_03`, after the YesNo fix below), Rule 17 Virtual Tour tab-skip (VirtualTourLink null). Extension fill succeeded on all 12 Matrix tabs cleanly. Scope shrunk mid-opening from 4-community full validation to 1-community targeted validation per operator's "what's the advantage of running all four?" pushback — Creekside TH + Everstone SF cover the structurally-distinct code paths (TH vs. SF, Rule 77 vs. no-Neighborhood community); HM TH (same path+type as Creekside) and HM SF (same path+type as Everstone-with-basement unknowns) low info-gain for dedicated sessions; Watermark SF deferred since no fresh Form 17 entries exist (recent Watermark Larimar Ln submissions were on old pre-restructure forms, not Form 17).

**Cognito YesNo field type bug surfaced and fixed (v0.15).** First pipeline run of Entry #18 came back with `features_a.basement_foundation = []` where Rule 111's SF+No branch should have produced `["Input_569_03"]`. Rules table pull confirmed Transform text is correct (three-branch structure authored properly in v0.11). Root cause isolated via direct `get_entry` fetch: `BuildFeatures.Basement.Basement` returns boolean `false` from the single-entry Cognito API, not the string `"No"` that the view-API's summary listing shows. Dispatcher at `generate.py:848` compared `basement == "No"` → `False == "No"` is False → fell through to `return []`. Operator post-diagnosis confirmed that Basement.Basement was authored in Form 17 as a Cognito YesNo field (boolean) while Garage.Garage1 was authored as a Choice field with Yes/No text options (returns string) — two deliberate form-authoring decisions made at different sessions that happened to produce different API return types. Fix: `_cognito_yesno(entry, dotted_path) -> str` helper added to `generate.py` after `_cognito_multiselect_list`. Normalizes boolean to `"Yes"`/`"No"`, strings pass through, None → `""`. Two call sites swapped: Rule 111's basement read (prop_type and finished stay on `_cognito_get` — Choice fields returning strings) and Rule 114's basement read. Pool Y/N (DB column, text) and Garage1 (Choice, string) untouched. Fix shipped via `HANDOFF-2026-10-07-generate-py-cognito-yesno.md`; re-run Entry #18 diffed cleanly against pre-fix with only `basement_foundation` changing `[]` → `["Input_569_03"]`.

**Rule 114 latent bug caught preemptively (v0.15) — first silently-wrong-output case.** Line 862 (`return "1" if basement == "Yes" else "0"`) had the same string-vs-boolean comparison on the same field. For Entry #18 (`Basement = false`), `False == "Yes"` is False, falls to else, returns `"0"` — coincidentally correct for a No-basement listing. On any SF+Yes-basement listing (not yet seen through the pipeline) this would have silently written `"0"` for Matrix's Basement Y/N when it should write `"1"`. No error, no exception, just wrong-reported checkbox. Fixed in the same handoff as Rule 111. First case where validation surfaced a bug that would have produced wrong output without raising — reinforces the "some verification beats none" line even as remaining-communities verification is being bounded.

**Convention #11 codified in `Payload_Rules_Conventions.md` v0.6 (v0.15).** Cognito field-type normalization for Yes/No semantic fields. Captures the YesNo-vs-Choice pattern as institutional knowledge for the next dispatcher author — includes the view-API-stringifies-booleans caveat so future debugging doesn't repeat the trap. Downstream application of convention #3; complements convention #2. The helper carries the pattern-knowledge forward whether or not any future form editing standardizes the field types.

**Phase 1 remaining communities deferred to production catch, not dedicated validation sessions (v0.15).** Per operator pushback at session mid-point. Remaining known-untested code paths: Rule 111 Finished / Part Finished / Unfinished crosswalk branches (needs SF+Yes-basement entry); Rule 110 SF+No garage branch (needs SF listing with no garage — may not exist in Lennar catalog per v0.11's "no detached garages, every garage has an opener"); Watermark SF new-path Rules 50/51/52/71/93/94/95 (needs real Watermark listing on `new` path — may never materialize if Watermark's parcels get tax records before the next real listing, flipping `new` → `taxid` in the Community DB and leaving the new-path code untested indefinitely, which is fine). Each production catch costs about the same as a verification session; Phase 2/3/4 value compounds; pipeline is production-usable for 2 confirmed communities today and partially-usable for HM TH (same architecture as Creekside). Operator-level hedge for any first-of-kind listing in a yet-unverified community: spot-check the generated payload JSON before extension-fill — 30-second visual review, catches the known-untested branches without session overhead. Phase 1 declared "complete enough" at this point; Phase 2 (extension integration) is next session's opening move.

**Pattern lesson from the YesNo bug (v0.15).** Cognito's view-API and single-entry-API have different serialization behavior for the same field; view-API stringifies booleans to pretty-print the summary listing. Dispatcher debugging must happen against single-entry fetch shape, not view-API summary shape. Captured in convention #11's "view-API caveat" clause so this trap doesn't get rediscovered. Extension-contract-knowledge pattern from v0.14 continues — the script holds the type-normalization layer, not the Rules table and not the form.

### Decisions Parked for Next Session
```

### Change 2.3 — Replace Decisions Parked for Next Session

**Find** (the entire current Decisions Parked section plus the `## Next Session Opening Move` header — keep the top anchor and bottom anchor, replace everything in between):

```
### Decisions Parked for Next Session

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

---

## Next Session Opening Move
```

**Replace with:**

```
### Decisions Parked for Next Session

**Phase 2 kickoff — extension integration** (new, v0.15, Priority 1 for next session). CLI wrapped as an endpoint; "Generate from Cognito Entry" surface built on the extension; batch-picker UX per v0.13 pre-note (N most recent Form 17 entries, operator selects); Railway hosting per v0.13 scaffold decisions; endpoint shape (REST POST `/generate` with `entry_id` in body); error surfacing (unresolved community, Cognito 404, dispatcher RuntimeError).

**Rule 111 Finished / Part Finished / Unfinished crosswalk branches untested** (new, v0.15, low priority — production catch). First SF+Yes-basement listing in production exercises this. Operator-level hedge: spot-check `features_a.basement_foundation` on the generated payload before extension-fill. Current risk: silent wrong output if the FinishedStatus crosswalk is mis-implemented; low likelihood (code looks right, same block was author-reviewed in v0.11).

**Rule 110 SF+No garage branch untested** (new, v0.15, low priority — production catch). Unlikely to exercise ever (no detached-garage or garageless Lennar builds in the current catalog per v0.11); flagged for completeness.

**Watermark SF `new`-path rules untested** (new, v0.15, low priority — production catch). Rules 50/51/52/71/93/94/95 have never executed. When the first real Watermark listing lands, operator triages in-session. Possible that Watermark's parcels get tax records before that happens (parallel to Creekside 2026-08-11 and Everstone 2026-09-18 migrations) — in which case Watermark flips `new` → `taxid` in the Community DB and the `new`-path code stays untested indefinitely, which is fine.

**Spot-check-before-fill pattern as operator hedge** (new, v0.15, procedural). For any first-of-kind community × property-type combination, operator reviews the generated payload JSON before dropping into the extension. 30-second visual check; catches the known-untested branches above without blocking Phase 2.

**Cognito form field-type standardization** (new, v0.15, optional). If future form editing surfaces, standardizing Basement.Basement to a Choice field (matching Garage1) would let the script drop `_cognito_yesno`. Not recommended as proactive work — the helper is doing its job, reshaping a live form carries risk, and the helper carries forward institutional knowledge about the pattern.

**Rules-table Features-tab cleanup** (unchanged from v0.14, low priority). Rules table currently stores Features-tab checkbox outputs as bare suffix codes while the script prefixes at output time per convention #10. Future Rules-table hygiene pass could normalize to full `Input_XX_YY` and remove the prefixer. Non-blocking; convention #10 carries the gap.

**`Lennar_Payload_Examples.md` v1.1 doc refresh** (unchanged from v0.14, low priority). HM TH `taxid` example shows `lot: "17"` which predates Path-in-DB (v0.10) and misled Cursor's post-apply triage. Phase 4 doc refactor pass.

**`_cognito_null_default` numeric-TEXT list is hardcoded in the dispatcher** (unchanged from v0.14, low priority).

**`CURSOR-HANDOFF-PROTOCOL-001` protocol-doc refresh** (unchanged from v0.14, low priority). v1.1 says "delete handoff files after apply"; active convention is move-to-`handoffs/applied/`. Batched-handoff override pattern reinforced again this session.

**`SCRIPTS-*` doc_id convention decision** (unchanged from v0.14, low priority).

**Post Office and Subdivision closure.** Unchanged from v0.6.

**HOA Fee / Additional Fee DB column split** (unchanged from v0.9, low priority).

**Copyright Agreement multi-builder promotion decision** (unchanged from v0.9, low priority).

**Whether Features' Matrix UI has real Section panels.** Unchanged from v0.6.

**Multi-Builder Pin phrasing correction.** Unchanged from v0.7, not urgent.

**Payload Rules table description update via API blocked.** Unchanged from v0.8. Conventions file now v0.6.

**Property Type multi-select orphan option cleanup.** Unchanged from v0.8.

**`Payload_Rules_Conventions.md` ID convention decision.** Unchanged from v0.8.

**NumberOfCars form constraints** (unchanged from v0.11, low priority).

**Phase 0 doc authoring items.** Vision/charter is landed. Still to author: base schema specification, maintenance protocol, builder-onboarding protocol. Not blocking Phase 2; better authored once the pipeline has proven out at the operator-facing extension layer too.

**Removed from queue this session:**
- Phase 1 pipeline expansion to other 4 active communities (deliberately shelved — remaining 3 communities moved to accepted-production-catch status per the scope decision this session).
- Convention #11 proposal (completed — codified in `Payload_Rules_Conventions.md` v0.6).

---

## Next Session Opening Move
```

### Change 2.4 — Replace Next Session Opening Move

**Find** (the entire current Next Session Opening Move section plus the `## Parallel Workstreams` header — keep both bookends, replace everything in between):

```
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

---

## Parallel Workstreams
```

**Replace with:**

```
## Next Session Opening Move

**Phase 1 is complete enough to use in production.** Two communities validated end-to-end (Creekside Run TH, Everstone SF); dispatcher proven across TH and SF property types; one real bug caught and fixed (Cognito YesNo field-type normalization); three remaining communities accepted as production catches with an operator-level spot-check hedge. Next session is Phase 2 — the operator-facing UX shift from "run CLI, paste JSON into extension" to "click Generate from Cognito Entry in the extension."

Sequencing:

1. Read this handoff, `SESSION-HANDOFF-2026-10-07-EVERSTONE-SF-VALIDATION-AND-YESNO-FIX.md`, and the Phase 2 scope line in the Phase Structure section above: *"Chrome extension expands: adds a 'Generate from Cognito Entry' surface, calls the script (now exposed as an endpoint), self-fills the Matrix tabs. UX shift, not a functional one."* `Payload_Rules_Conventions.md` v0.6 at hand (convention #11 is this session's addition — not Phase-2-relevant on its own, just for context on the YesNo helper's existence).

2. Kickoff decisions to settle at session open:
   - **Endpoint hosting** — Railway as planned per v0.13 scaffold decisions? Credentials already in `.env`, migrating to Railway Variables UI is zero-code change per the scaffold session's design.
   - **Endpoint shape** — REST POST `/generate` with `{"entry_id": N}` in body? GET with query param? Response: full payload JSON? Streaming? Error envelope shape?
   - **Extension integration surface** — new button on the extension's current panel? New tab/section? Keyboard shortcut?
   - **Batch picker UX** — N most recent Form 17 entries with address + submission time + submitter name? Filter by community? Filter by status (Submitted vs. Incomplete)? Per v0.13 pre-note.
   - **Error handling** — if script fails (unresolved community, Cognito 404, dispatcher RuntimeError), how does it surface in the extension? Modal? Inline error? Logged to console?
   - **Auth model** — endpoint secured how? Shared secret? OAuth? IP allowlist?

3. Scaffold the endpoint. Likely a small FastAPI wrapper around the existing `generate_payload()` function. Keep CLI usage intact (both surfaces call the same core).

4. Scaffold the extension's new UX surface. Current extension is in the same repo (`extension/`); new UX likely lives alongside the existing self-fill surface.

5. End-to-end test with Everstone SF Entry #18 (known-good payload): extension's picker lists it, operator clicks it, endpoint returns the payload, extension fills Matrix. Compare against today's known-good manual-paste result from the Everstone validation.

**Not for next session:**
- Phase 3 (PandaDoc addendum generation + audit table + Drive folder + email trigger).
- Phase 4 (doc refactor, operational-session behavior retirement).
- Remaining Phase 1 community validations (production catch pattern per this session's scope decision).
- The parked HOA Fee / Additional Fee DB column split and other deferred doc corrections.

At session close: bump tracker version, refresh Decisions Parked and Next Session Opening Move. Substantive decisions migrate to canonical foundation docs, not into this tracker.

---

## Parallel Workstreams
```

### Change 2.5 — Append v0.15 row to Version History table

**Find** (the current last row of the Version History table — the v0.14 row):

```
| 0.14 | 2026-10-05 | Session close after the Phase 1 pipeline build + first end-to-end extension fill. `generate_payload()` placeholder replaced with the full pipeline via `HANDOFF-2026-10-05-phase-1-pipeline-build.md` (single-file, single-feature, deliberately batched; applied by Cursor on Sonnet 5 High). Pipeline implements Cognito fetch → community resolution per convention #6 (hard-fail on miss) → Airtable fetch of all 4 reference tables → rule iteration with Property Type + Path scoping → dispatch by Source Type (STATIC/COGNITO/COMMUNITY_DB/DERIVED) → Features-tab prefixing per new convention #10 → payload assembly. All 111 rules' Transforms implemented, dispatched by Matrix Input ID. Target community shifted mid-opening from HM TH to Creekside Run TH when a fresh Form 17 entry (6136 Hull Street Rd, Entry #20, submitted that morning by Izaiah Clark) landed and operator had a Creekside Run TH example payload on hand — two artifacts in hand was cleaner than hunting for an HM TH example, no dispatcher changes needed. First end-to-end run exit code 0, no RuntimeErrors. Operator ran extension fill on test Matrix listing: all 12 tabs filled correctly except Bath Info, which errored because Matrix's tab assumes every level sub-object (`basement`, `level1`-`level4`) always exists while our payload omitted `level4` per Rule 44's deliberate v0.8 exclusion (no Form 17 source). Fix shipped in-chat as a Cursor-paste block (not a formal handoff): extended the section-defaults loop at the end of `generate_payload()` to also fill in missing bath sub-objects with Matrix's required empty-but-present shape via `setdefault` (non-destructive — rule-populated levels keep their rule-driven values). Operator applied and confirmed next extension fill completed cleanly. Features-tab prefixing convention validated by the extension's correct fill — codified as convention #10 in `Payload_Rules_Conventions.md` v0.5 (bumped from v0.4 same session) with "Features-tab checkbox outputs are prefixed with the rule's Matrix Input ID. Non-Features checkbox groups pass through bare. Where DB stores full IDs already (Heating Codes, Heating Fuel Codes), prefixer is a no-op." Downstream application of convention #3; future Rules-table hygiene candidate to normalize Features-tab authoring to full IDs and remove the prefixer, non-blocking. Cursor's post-apply triage flagged 4 absent keys (`listing.lot`, `fee.allow_onsite`, `bath.level4`, `showing.lockbox_type`) by comparing against the stale `Lennar_Payload_Examples.md` v1.1; project-protocol-lookup rule caught the trap — all 4 are deliberate Rules-table omissions traceable to prior tracker versions (v0.7, v0.8, v0.10). Stale example doc goes to Phase 4 refactor queue. Pattern that landed: extension-contract knowledge (envelope shape, checkbox format, bath-tab assumptions) lives in the script, not the Rules table, unless Rules-table intent is actually what's wrong. Pipeline is operational for Creekside Run TH taxid. Next session Priority 1: HM TH end-to-end validation. Full detail in `SESSION-HANDOFF-2026-10-05-PHASE-1-PIPELINE-LIVE.md`. |
```

**Replace with:**

```
| 0.14 | 2026-10-05 | Session close after the Phase 1 pipeline build + first end-to-end extension fill. `generate_payload()` placeholder replaced with the full pipeline via `HANDOFF-2026-10-05-phase-1-pipeline-build.md` (single-file, single-feature, deliberately batched; applied by Cursor on Sonnet 5 High). Pipeline implements Cognito fetch → community resolution per convention #6 (hard-fail on miss) → Airtable fetch of all 4 reference tables → rule iteration with Property Type + Path scoping → dispatch by Source Type (STATIC/COGNITO/COMMUNITY_DB/DERIVED) → Features-tab prefixing per new convention #10 → payload assembly. All 111 rules' Transforms implemented, dispatched by Matrix Input ID. Target community shifted mid-opening from HM TH to Creekside Run TH when a fresh Form 17 entry (6136 Hull Street Rd, Entry #20, submitted that morning by Izaiah Clark) landed and operator had a Creekside Run TH example payload on hand — two artifacts in hand was cleaner than hunting for an HM TH example, no dispatcher changes needed. First end-to-end run exit code 0, no RuntimeErrors. Operator ran extension fill on test Matrix listing: all 12 tabs filled correctly except Bath Info, which errored because Matrix's tab assumes every level sub-object (`basement`, `level1`-`level4`) always exists while our payload omitted `level4` per Rule 44's deliberate v0.8 exclusion (no Form 17 source). Fix shipped in-chat as a Cursor-paste block (not a formal handoff): extended the section-defaults loop at the end of `generate_payload()` to also fill in missing bath sub-objects with Matrix's required empty-but-present shape via `setdefault` (non-destructive — rule-populated levels keep their rule-driven values). Operator applied and confirmed next extension fill completed cleanly. Features-tab prefixing convention validated by the extension's correct fill — codified as convention #10 in `Payload_Rules_Conventions.md` v0.5 (bumped from v0.4 same session) with "Features-tab checkbox outputs are prefixed with the rule's Matrix Input ID. Non-Features checkbox groups pass through bare. Where DB stores full IDs already (Heating Codes, Heating Fuel Codes), prefixer is a no-op." Downstream application of convention #3; future Rules-table hygiene candidate to normalize Features-tab authoring to full IDs and remove the prefixer, non-blocking. Cursor's post-apply triage flagged 4 absent keys (`listing.lot`, `fee.allow_onsite`, `bath.level4`, `showing.lockbox_type`) by comparing against the stale `Lennar_Payload_Examples.md` v1.1; project-protocol-lookup rule caught the trap — all 4 are deliberate Rules-table omissions traceable to prior tracker versions (v0.7, v0.8, v0.10). Stale example doc goes to Phase 4 refactor queue. Pattern that landed: extension-contract knowledge (envelope shape, checkbox format, bath-tab assumptions) lives in the script, not the Rules table, unless Rules-table intent is actually what's wrong. Pipeline is operational for Creekside Run TH taxid. Next session Priority 1: HM TH end-to-end validation. Full detail in `SESSION-HANDOFF-2026-10-05-PHASE-1-PIPELINE-LIVE.md`. |
| 0.15 | 2026-10-07 | Session close after Everstone SF validation + Cognito YesNo field-type bug fix + Phase 1 "complete enough" scope decision. Second community through the pipeline, first SF listing. Entry #18 (3737 Larimar Lane, Guilford Ranch, Chris MacLaird 2026-09-17) chosen for a single targeted verification run after operator pushback on the four-community full-validation plan ("what's the advantage of running all four?"). Entry #18 covers Rule 77 Neighborhood (Everstone-only Input_236 write), Rule 116 Style SF COGNITO Transform (Ranch → Input_541_18), Rule 110 Garage DERIVED SF branch, Rule 114 SF basement_yn, Rule 111 SF+No branch (Crawl Space Input_569_03), Rule 17 Virtual Tour tab-skip (VirtualTourLink null). First pipeline run came back with empty `features_a.basement_foundation` — Rules table pull confirmed Transform text correct (three-branch structure authored properly in v0.11); root cause isolated via direct `get_entry` fetch as a Cognito field-type mismatch. `BuildFeatures.Basement.Basement` was authored in Form 17 as a Cognito YesNo field (returns boolean `false`) while `BuildFeatures.Garage.Garage1` was authored as a Choice field with Yes/No text options (returns string `"Yes"`) — two deliberate form-authoring decisions made at different times that produce different single-entry API return types. The dispatcher at line 848 compared `basement == "No"` — `False == "No"` is False, fell through to `return []`. View-API's `get_entries_in_view` stringifies booleans for its summary listing, masking the mismatch until an actual single-entry read. Fix: `_cognito_yesno()` helper added to `generate.py` after `_cognito_multiselect_list`; normalizes boolean to `"Yes"`/`"No"`, strings pass through, None → `""`. Rule 111's basement read and Rule 114's basement read swapped to use the helper (prop_type and finished stay on `_cognito_get` — Choice fields). Pool Y/N (DB column, text) and Garage1 (Choice field) untouched. Rule 114 found to have the same latent flaw in the same handoff — Entry #18 coincidentally produced correct `basement_yn = "0"` via `False == "Yes"` → else → `"0"`, but on a SF+Yes-basement listing would have silently written `"0"` when Matrix needs `"1"`. First dispatcher case where validation surfaced a bug that would have produced wrong output without raising. Both fixes shipped via `HANDOFF-2026-10-07-generate-py-cognito-yesno.md`; re-run Entry #18 diffed cleanly with only `basement_foundation` changing `[]` → `["Input_569_03"]`. Extension fill succeeded on all 12 Matrix tabs cleanly, Features tab's Basement/Foundation shows Crawl Space checked. Convention #11 codified in `Payload_Rules_Conventions.md` v0.6: Cognito field-type normalization for Yes/No semantic fields, including the view-API-stringifies-booleans debugging caveat. Scope decision: remaining 3 communities (HM TH same-architecture-as-Creekside; HM SF basement-crosswalk-and-Rule-114-Yes-path still unknowns; Watermark SF new-path still unknowns) deferred to production catch, not dedicated validation sessions. Each production catch costs about the same as a verification session; Phase 2/3/4 value compounds; pipeline is production-usable for 2 confirmed communities today. Operator-level hedge for first-of-kind listings in remaining communities: 30-second spot-check of generated payload JSON before extension-fill. Phase 1 declared "complete enough"; Phase 2 (extension integration — CLI wrapped as endpoint, "Generate from Cognito Entry" surface built, batch-picker UX from v0.13 pre-note) is next session's opening move. Full detail in `SESSION-HANDOFF-2026-10-07-EVERSTONE-SF-VALIDATION-AND-YESNO-FIX.md`. |
```

No other changes to `Lennar_Restructure_Phase_Tracker.md`.

---

*Co-authored by Claude Opus 4.7 as the 2026-10-07 session's close-of-session output. Session handoff file (`SESSION-HANDOFF-2026-10-07-EVERSTONE-SF-VALIDATION-AND-YESNO-FIX.md`) is being dropped into `handoffs/applied/` by the operator alongside this Cursor handoff.*

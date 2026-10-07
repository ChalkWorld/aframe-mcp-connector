---
title: Session Handoff — Phase 1 Pipeline Live
document_id: SESSION-HANDOFF-2026-10-05-PHASE-1-PIPELINE-LIVE
date: 2026-10-05
author: Andrew Rich (via Claude Opus 4.7 session, applied by Cursor on Sonnet 5 High)
project: AAR-TC Lennar Operational Project
related:
  - HANDOFF-2026-10-05-phase-1-pipeline-build.md
  - HANDOFF-2026-10-05-phase-tracker-v0.14.md
  - docs/foundation/Lennar_Restructure_Phase_Tracker.md (v0.14)
  - docs/foundation/Payload_Rules_Conventions.md (v0.5)
---

# Session Handoff — Phase 1 Pipeline Live
### AAR-TC Lennar Operational Project

Full-detail companion to `Lennar_Restructure_Phase_Tracker.md` v0.14. The tracker's "Decisions Landed" section carries the canonical summary; this doc carries the session narrative and verification detail for anyone who needs the full story.

---

## Focus

Replace the Phase 1 scaffold's `generate_payload()` placeholder in `extension/scripts/generate.py` with the real pipeline: Cognito Form 17 fetch → community resolution → Payload Rules + Cognito Fields + Source Types + Community Reference DB fetch from Airtable → rule dispatch by Source Type → payload assembly matching `Lennar_Payload_Examples.md`. Then validate end-to-end against a live listing through the Chrome extension.

## What Happened

**Target community shifted mid-opening.** Session opened targeting Harpers Mill TH per v0.13's parked opening move. Mid-opening, the operator confirmed a fresh Form 17 entry had landed that morning — Entry #20, Creekside Run TH, 6136 Hull Street Rd, submitted by Izaiah Clark — and the known-good example payload the operator had on hand was also a Creekside Run TH payload (6132 Hull Street Rd, from September). Two Creekside Run TH artifacts in hand was cleaner than hunting down a fresh Harpers Mill TH entry and example, so the target shifted. No dispatcher changes were required to make that switch — same `taxid` path, same TH property-type structure as the originally planned case.

**Pipeline built and applied via `HANDOFF-2026-10-05-phase-1-pipeline-build.md`.** Single-file, single-feature handoff (deliberately batched — one commit, one review surface, explicit override justification in the handoff header). Cursor (Sonnet 5 High) applied the full implementation: Cognito fetch, community resolution per convention #6 (hard-fail on unresolved lookup), Airtable fetch of all four reference tables (Payload Rules, Cognito Fields, Source Types, Community Reference DB), rule iteration honoring Property Type + Path scoping, dispatch by Source Type (`STATIC` / `COGNITO` / `COMMUNITY_DB` / `DERIVED`, `MANUAL_ENTRY` skipped), Features-tab bare-code prefixing (the new convention #10), and payload assembly into the envelope shape. All four Airtable table IDs were resolved at authoring time and hardcoded (`tbletiuyEdhVwcwGw`, `tbl9LWfHDEuYtgFvv`, `tblpwaJswUvNpYOyY`, `tbleMbM1WgY8Si2t7`). All Transforms across all 111 Payload Rules rows were implemented, dispatched by Matrix Input ID.

One scaffold-vs-handoff mismatch surfaced and was resolved without a round-trip: the handoff's snippet assumed `generate_payload(entry_id: str) -> dict`, but the actual scaffold's signature (landed in v0.13) is `generate_payload(entry_id: int, env: dict[str, str]) -> str`, called from `main()`/`emit()` and expected to return a JSON string. Per the handoff's own instruction to leave the function signature identical, Cursor kept the existing signature and moved the handoff's pipeline body into a new `_build_payload(entry_id) -> dict` helper, with `generate_payload()` left as a thin wrapper that calls it and does `json.dumps(..., ensure_ascii=False)`. `ensure_ascii=False` was flipped on that same call, closing out the cosmetic item parked since v0.13.

**First end-to-end run: exit code 0, no RuntimeErrors.** `python generate.py --entry-id 20 --out /tmp/entry20-payload.json` ran against live Cognito + Airtable data. Every rule hit by Entry #20 resolved cleanly — no unmapped Input IDs, no missing Transform dispatchers. Output written to `/tmp/entry20-payload.json`.

**Cursor's post-apply triage flagged 4 absent keys — all resolved as deliberate, not bugs.** Comparing the Entry #20 output against the repo's `Lennar_Payload_Examples.md` (Harpers Mill TH `taxid` and Watermark SF `new` examples — no Creekside Run TH example exists in-repo), 4 keys present in the examples were missing from the live output: `listing.lot`, `fee.allow_onsite`, `bath.level4`, `showing.lockbox_type`. Rather than assume these were pipeline bugs, Cursor queried the live Payload Rules table directly to check:
- `listing.lot` (`Input_622`) — confirmed Path scope is `['new']` in the live Rules table. Creekside resolves to `taxid`, so the rule correctly doesn't fire. The repo's Harpers Mill TH `taxid` example showing `lot: "17"` predates the Path-in-DB rearchitect (v0.10) — a stale example, not a pipeline bug.
- `fee.allow_onsite`, `bath.level4`, `showing.lockbox_type` — no rule rows exist for any of these in the live Payload Rules table at all. Per v0.7/v0.8's excluded-field policy (convention #5, absence-as-signal), these are deliberate omissions, not gaps the script failed to fill.

This is the project's "doc-vs-contract" trap in miniature: comparing script output against a known-good *example* doc is a reasonable instinct, but the Rules table + `Payload_Rules_Conventions.md` are the actual contract, and absence-as-signal (convention #5) means "key missing from output" is not automatically "bug." The stale `Lennar_Payload_Examples.md` v1.1 doc (specifically its Harpers Mill TH `taxid` example) is queued for a Phase 4 doc refactor pass rather than an immediate correction, since Phase 1 is actively rewriting the docs this example doc would otherwise need to track.

**First extension fill: 11 of 12 tabs clean, Bath Info errored.** Operator pasted the Entry #20 payload into the Chrome extension on a test Matrix listing and ran a fill. Every tab filled correctly — including confirmation that convention #10's Features-tab prefixing is the shape the extension actually consumes (Structure, Siding, Roof, Interior, Exterior, Appl/Equip, Garage, etc. all checked correctly on the first attempt). Bath Info threw `Cannot read properties of undefined (reading 'desc')` — Matrix's Bath Info tab assumes every level sub-object (`basement`, `level1`–`level4`) exists in the payload, but the pipeline's output only had `basement`/`level1`/`level2`/`level3`. Rule 44 deliberately excludes Level 4 (no Form 17 source, per v0.8's Rules-table philosophy) — a correct Rules-table decision that Matrix's extension-side assumption doesn't account for.

**Bath Info Level 4 fix shipped as an in-chat follow-up, not a formal handoff.** Scoped small enough (one block, one file) to skip the handoff-file ceremony. Fix: extended the existing section-defaults loop at the end of `_build_payload()` to also backfill any missing bath level sub-object with Matrix's required empty-but-present shape (`{"desc": "", "full": "0", "half": "0"}`) via `setdefault` — non-destructive, so levels already populated by rules (`level1`, `level2`, `level3`, `basement` for this entry) keep their rule-driven values. Reran against Entry #20: `bath.level4` now resolves to the correct empty-shape default; `level3`'s rule-driven `"TS"`/`"2"`/`"0"` values were confirmed untouched. Operator reconfirmed the next extension fill completed cleanly on Bath Info.

**Pattern that landed: extension-contract knowledge lives in the script by default.** Both shape fixes this session (Features-tab prefixing, Bath Info level defaults) were resolved script-side, not by rewriting the Rules table or patching the extension. The operating principle: the extension consumes the script's payload, so when a shape mismatch surfaces, the script carries the responsibility — `OUTPUT_MAP` (envelope shape), `_prefix_features_codes()` (checkbox-group format), and the bath-level defaults are all extension-contract knowledge the Rules table doesn't need to express. A future mismatch would only warrant a Rules-table change if the Rules table's *intent* were actually wrong, not just how the script interprets a correct intent against an extension-side assumption.

**Session closed via `HANDOFF-2026-10-05-phase-tracker-v0.14.md`.** Bumped `Lennar_Restructure_Phase_Tracker.md` v0.13 → v0.14 and `Payload_Rules_Conventions.md` v0.4 → v0.5 (convention #10 promoted from "proposed" to codified, validated by the extension's clean Features-tab fill). Batched together per the handoff's own override justification — tracker and conventions bumps are a single session-close unit; splitting them would leave one doc referencing a version of the other that doesn't exist yet in the interim commit.

## Verification

- `python -m py_compile extension/scripts/generate.py` — clean.
- `ReadLints` on `generate.py` — no errors, before and after the Bath Info fix.
- `python generate.py --entry-id 20 --out /tmp/entry20-payload.json` — exit code 0, both before and after the Bath Info fix. No `RuntimeError`s on either run (confirms every dispatcher case hit by Entry #20's rule set resolved).
- `bath.level4` confirmed present as `{"desc": "", "full": "0", "half": "0"}` after the fix; `level3`'s rule-driven values (`"TS"` / `"2"` / `"0"`) confirmed unchanged.
- Chrome extension fill against a test Matrix listing, twice (before and after the Bath Info fix) — all 12 tabs filled correctly on the second pass.

## Discrepancies Surfaced (Not Bugs)

- `listing.lot` absent for Creekside Run TH — correct, Path-scoped to `new` only; Creekside is `taxid`.
- `fee.allow_onsite`, `showing.lockbox_type` absent — correct, no Rules-table row exists for either (convention #5 absence-as-signal).
- `Lennar_Payload_Examples.md` v1.1's Harpers Mill TH `taxid` example shows `lot: "17"`, which predates the Path-in-DB rearchitect (v0.10). Stale, queued for Phase 4.

## Open Items (Carried to Tracker v0.14's Decisions Parked)

- Phase 1 pipeline expansion to the other 4 active communities (Priority 1 next session: Harpers Mill TH, then HM SF, Everstone SF, Watermark SF).
- Rules-table Features-tab cleanup (normalize bare codes to full `Input_XX_YY`, retire the prefixer) — low priority, non-blocking.
- `Lennar_Payload_Examples.md` v1.1 doc refresh — low priority, Phase 4.
- `_cognito_null_default`'s numeric-TEXT field list is hardcoded in the dispatcher — low priority, parameterize later if it becomes a maintenance burden.
- All items unchanged from v0.13 (`CURSOR-HANDOFF-PROTOCOL-001` refresh, `SCRIPTS-*` doc_id convention, Post Office/Subdivision closure, HOA Fee/Additional Fee DB column split, Copyright Agreement multi-builder promotion, Features Section panels, Multi-Builder Pin phrasing, Payload Rules table description API block, Property Type orphan options, `Payload_Rules_Conventions.md` ID convention, NumberOfCars form constraints, Phase 0 doc authoring items).

## Key References

- Pipeline implementation: `extension/scripts/generate.py` (`_build_payload()`, `generate_payload()`)
- `docs/foundation/Lennar_Restructure_Phase_Tracker.md` v0.14 — canonical decisions-landed summary
- `docs/foundation/Payload_Rules_Conventions.md` v0.5 — convention #10
- Applied handoffs: `handoffs/applied/HANDOFF-2026-10-05-phase-1-pipeline-build.md`, `handoffs/applied/HANDOFF-2026-10-05-phase-tracker-v0.14.md`

## Next Session

Priority 1 — Harpers Mill TH end-to-end validation (same `taxid` path, same TH structure as Creekside; straight dispatch verification, no new work expected). See tracker v0.14's "Next Session Opening Move" for the full sequencing and Priorities 2–4 (HM SF, Everstone SF, Watermark SF).

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

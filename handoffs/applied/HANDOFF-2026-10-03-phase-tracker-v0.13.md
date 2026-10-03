---
title: Cursor Handoff — Phase Tracker v0.13 (Phase 1 Scaffold Landed)
document_id: HANDOFF-2026-10-03-phase-tracker-v0.13
date: 2026-10-03
project: AAR-TC Lennar Operational Project
---

Apply the changes below surgically to the repo. This handoff bumps `docs/foundation/Lennar_Restructure_Phase_Tracker.md` from v0.12 to v0.13 (session close for the 2026-10-02 → 2026-10-03 Phase 1 kickoff / scaffold session) and adds a small `extension/scripts/.gitignore` for Python hygiene (venv, bytecode, test outputs).

This handoff is batched (6 changes to one tracker file + 1 new file) because they are a single logical unit — the session-close update plus one tiny related cleanup. Cursor is running Sonnet 5 High and handles this cleanly.

Do not modify anything not listed here.

---

## Change 1 — Bump Phase Tracker frontmatter version/date

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

**Find:**

```yaml
version: 0.12
version_date: 2026-10-01
```

**Replace with:**

```yaml
version: 0.13
version_date: 2026-10-03
```

---

## Change 2 — Append Phase 1 scaffold decisions to "Decisions Landed This Session"

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

The `### Decisions Landed This Session` section is cumulative across sessions. Append the Phase 1 kickoff / scaffold decisions after the existing "Deferred-doc-corrections queue dropped (v0.12)" paragraph and before the `### Decisions Parked for Next Session` subsection header.

**Add** — insert the following block immediately before the `### Decisions Parked for Next Session` heading. Preserve existing blank-line spacing (one blank line before the new block, one blank line after it before the next heading).

```markdown
**Phase 1 kickoff: repo location, CLI shape, auth, output routing (v0.13).** Phase 1 CLI lives in `aframe-mcp-connector/extension/scripts/` — subfolder in the existing extension repo rather than a new AAR-TC repo or a Lennar project subfolder. Rationale: Phase 2 wraps this CLI as an endpoint the extension's "Generate from Cognito Entry" surface will call; co-location keeps the generation-plus-fill pipeline in one repo. CLI trigger shape: `python generate.py --entry-id <id>` with URL-or-ID parsing (regex extracts trailing `/<id>` from a pasted Cognito URL). Form ID is config (`COGNITO_FORM_ID=17` in `.env`), not an argument, because Phase 1 is one builder; becomes a flag when a second builder's form appears. Output routing: `--stdout` default, `--clipboard` (macOS pbcopy), `--out <path>` (file write) — mutually exclusive flags. Auth mechanism: direct REST APIs for both Cognito and Airtable, credentials in `.env` next to the CLI; session MCP connectors remain the development aid but are not the CLI's auth path. Phase 2+ migrates the same env var keys from `.env` to Railway's Variables UI with no code changes (identical `os.getenv(...)` call pattern in both environments).

**Phase 1 scaffold landed and verified end-to-end (v0.13).** `HANDOFF-2026-10-02-phase-1-scripts-scaffold.md` applied; new `extension/scripts/` subfolder with 5 files: `README.md` (`SCRIPTS-README-001` v0.1), `.env.example` (Airtable PAT + Lennar base ID pre-filled `app78fMUwDNBHUZ6r` + CVRMLS base ID placeholder + Cognito API key + form ID pre-filled `17`), `requirements.txt` (`requests==2.32.*`, `python-dotenv==1.0.*`), `generate.py` (working CLI shell with argparse, env loading, env validation, output routing, labeled `generate_payload()` placeholder), `.gitkeep`. `REPO_STRUCTURE.md` updated with new `extension/scripts/` subsection and refreshed "Last Updated" line. Deliberately batched (7 changes in one Cursor handoff) with override explanation in the handoff header — Cursor on Sonnet 5 High handled cleanly. Operator ran local setup in `/Users/andrewrich/Desktop/aframe-mcp-connector/extension/scripts/`: venv created, deps installed, `.env` populated with real credentials (`AIRTABLE_PAT`, `AIRTABLE_CVRMLS_BASE_ID=appEEYJ31UKuCnJ6v`, `COGNITO_API_KEY`). All three output modes verified against the stub JSON: stdout (default), `--clipboard` (confirmed via paste), `--out ./test-output.json` (confirmed by opening). CLI's full operational surface works end-to-end with the pipeline still stubbed.

**Phase 2 UX pre-note parked (v0.13).** NHCs submit new listings in batches on the same day. The extension's eventual "Generate from Cognito Entry" surface should pull the N most recent Form 17 entries (with address and submission timestamp) and let the operator select from a picker, rather than assuming a single most-recent entry. Doesn't affect the Phase 1 CLI shape — Phase 2 UX context.

**`extension/scripts/.gitignore` added (v0.13).** Python hygiene: `.venv/`, `__pycache__/`, `*.pyc`, `*.pyo`, `test-outputs/`. `.env` is already covered by the repo-level `.gitignore` at any depth.
```

---

## Change 3 — Replace "Decisions Parked for Next Session"

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

Add three new parked items from this session (protocol-doc refresh, `SCRIPTS-*` ID convention, `ensure_ascii=False` cosmetic flip) and remove the four completed kickoff items. All other parked items carry forward.

**Find:**

```markdown
### Decisions Parked for Next Session

**Post Office and Subdivision closure.** Unchanged from v0.6 — recommended as "working as intended, no extraction needed" since both are explicitly MANUAL, but not yet explicitly confirmed by Andrew.

**HOA Fee / Additional Fee DB column split** (from v0.9, low priority). Both columns in the Community Reference DB currently store combined display strings (`"$800.00 / Yearly"`). Fee Info rules use Transform-based extraction; splitting each column into Amount and Period would make the Transforms pure passthrough. Not blocking Phase 1.

**Copyright Agreement multi-builder promotion decision** (from v0.9, low priority). When a second builder is added to this stack, decide whether to promote Copyright Agreement (currently STATIC `"1"` in Lennar Payload Rules) to an MLS-layer shared enum vs. copy per-builder.

**Whether Features' Matrix UI has real Section panels.** Unchanged open item from v0.6. Features rules authored with Section field blank throughout; a live-DOM check settles it either way when convenient.

**Multi-Builder Pin phrasing correction.** Unchanged from v0.7 — future revision, not urgent.

**Payload Rules table description update via API blocked.** Unchanged from v0.8. Conventions live in `Payload_Rules_Conventions.md` (now v0.4, in `/docs/foundation/`); Andrew can paste them into the base description manually if he wants them mirrored.

**Property Type multi-select orphan option cleanup.** Unchanged from v0.8. Airtable connector cannot delete multi-select options; Andrew removes in-app at his convenience.

**Payload_Rules_Conventions.md ID convention decision.** Unchanged from v0.8. Small decision on whether to rename `PAYLOAD-RULES-CONVENTIONS-001` to `FOUND-CONVENTIONS-001` (or similar) and update any downstream references.

**NumberOfCars form constraints** (from v0.11, low priority — form-side observation). Form 17 Max=10 could reduce to 4 to match Matrix's ceiling (Matrix supports 1/1.5/2/2.5/3/4plus); DecimalPlaces=0 forecloses 1.5/2.5-car plans entirely. If a Lennar plan ever needs a half-car value, revisit the DecimalPlaces constraint. Not blocking.

**Phase 0 doc authoring items.** Vision/charter is landed. Still to author: base schema specification, maintenance protocol, builder-onboarding protocol. Not blocking Phase 1; better authored once the script's shape is settled.
```

**Replace with:**

```markdown
### Decisions Parked for Next Session

**`CURSOR-HANDOFF-PROTOCOL-001` protocol-doc refresh** (new, v0.13, low priority). v1.1 says "delete handoff files after apply" but the active convention since at least 2026-09-10 moves them to `handoffs/applied/`. Protocol doc is out of sync with reality. Also worth capturing the batched-handoff override pattern surfaced by the 2026-10-02 scaffold handoff (7 changes in one handoff when the changes are a single logical unit and Cursor is running a capable model).

**`SCRIPTS-*` doc_id convention decision** (new, v0.13, low priority). `extension/scripts/README.md` currently has doc_id `SCRIPTS-README-001` — doesn't follow the `FOUND-*` prefix because it's code-local, not foundation-layer governance. If a `SCRIPTS-*` ID convention gets formalized, this is where it starts.

**`generate.py` `ensure_ascii=False` cosmetic flip** (new, v0.13). Current `json.dumps` call escapes non-ASCII (em-dashes come out as `—`). Cosmetic only; pipeline build should flip `ensure_ascii=False` so output is human-readable for spot-checks.

**Post Office and Subdivision closure.** Unchanged from v0.6 — recommended as "working as intended, no extraction needed" since both are explicitly MANUAL, but not yet explicitly confirmed by Andrew.

**HOA Fee / Additional Fee DB column split** (from v0.9, low priority). Both columns in the Community Reference DB currently store combined display strings (`"$800.00 / Yearly"`). Fee Info rules use Transform-based extraction; splitting each column into Amount and Period would make the Transforms pure passthrough. Not blocking Phase 1.

**Copyright Agreement multi-builder promotion decision** (from v0.9, low priority). When a second builder is added to this stack, decide whether to promote Copyright Agreement (currently STATIC `"1"` in Lennar Payload Rules) to an MLS-layer shared enum vs. copy per-builder.

**Whether Features' Matrix UI has real Section panels.** Unchanged open item from v0.6. Features rules authored with Section field blank throughout; a live-DOM check settles it either way when convenient.

**Multi-Builder Pin phrasing correction.** Unchanged from v0.7 — future revision, not urgent.

**Payload Rules table description update via API blocked.** Unchanged from v0.8. Conventions live in `Payload_Rules_Conventions.md` (now v0.4, in `/docs/foundation/`); Andrew can paste them into the base description manually if he wants them mirrored.

**Property Type multi-select orphan option cleanup.** Unchanged from v0.8. Airtable connector cannot delete multi-select options; Andrew removes in-app at his convenience.

**Payload_Rules_Conventions.md ID convention decision.** Unchanged from v0.8. Small decision on whether to rename `PAYLOAD-RULES-CONVENTIONS-001` to `FOUND-CONVENTIONS-001` (or similar) and update any downstream references.

**NumberOfCars form constraints** (from v0.11, low priority — form-side observation). Form 17 Max=10 could reduce to 4 to match Matrix's ceiling (Matrix supports 1/1.5/2/2.5/3/4plus); DecimalPlaces=0 forecloses 1.5/2.5-car plans entirely. If a Lennar plan ever needs a half-car value, revisit the DecimalPlaces constraint. Not blocking.

**Phase 0 doc authoring items.** Vision/charter is landed. Still to author: base schema specification, maintenance protocol, builder-onboarding protocol. Not blocking Phase 1; better authored once the script's shape is settled.
```

---

## Change 4 — Replace "Next Session Opening Move"

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

Phase 1 kickoff is complete; opening move advances to the pipeline build.

**Find:**

```markdown
## Next Session Opening Move

**Phase 0 is complete on data modeling.** Residential Input Form, Payload Rules, Community Reference DB (schools cleaned up), and the new Cascade Options table all exist with the structure Phase 1 needs. Convention #9 locks in the DB-value guarantee the script relies on. Remaining Phase 0 doc authoring items (base schema specification, maintenance protocol, builder-onboarding protocol) are not blocking the script — they're reference material for operators and future builder onboarding, better authored once the script's shape is settled.

**Priority 1 — Phase 1 kickoff: Python CLI, standalone.**

Reads: Cognito entry ID (via Form 17 API) + Payload Rules (via Airtable API) + Community Reference DB (via Airtable API).
Produces: a payload matching the current `Lennar_Payload_Examples.md` shape, suitable for paste into the existing extension.

Sequencing to consider:
1. Minimal CLI scaffold — one Lennar community, one entry, happy path. Prove the join between Cognito → Rules → DB works end-to-end.
2. Add all 5 active communities, both paths (new + taxid).
3. Add all Rules sources (STATIC, COGNITO, COMMUNITY_DB, DERIVED, MANUAL_ENTRY) exercised.
4. Compare generated payload against known-good `Lennar_Payload_Examples.md` payloads for each community × path combination.
5. Each discrepancy surfaces as either a Rules bug (fix the table) or a Schema doc gap (fix the doc — now in its post-script form, not the pre-script form).

**Setup checklist:**
1. Read this tracker first, then `SESSION-HANDOFF-2026-10-01-CASCADE-OPTIONS-AND-DB-CLEANUP.md` for full session detail. `Payload_Rules_Conventions.md` v0.4 at hand for script-side logic.
2. Decide on repo location for the Phase 1 CLI. Candidates: new repo under AAR-TC org; subfolder in the existing Chrome extension repo; subfolder in the Lennar project. Needs to be a repo Cursor can push to and Railway can deploy if the CLI is wrapped as an MCP tool later (Phase 2).
3. Decide on CLI vs. module shape. Phase 1 scope is "standalone CLI" per the restructure charter — standalone first, MCP tool wrapping comes in Phase 2.
4. Confirm the Airtable connector handles script-side authentication cleanly, or whether a service-account token is needed.
5. First target community for the happy-path test. Harpers Mill TH is the most-exercised community in `Lennar_Payload_Examples.md` and has the cleanest `taxid` path data — recommended as the first target.

At session close: bump version and date, refresh Decisions Parked and Next Session Opening Move to current state, and add a Version History row. Substantive decisions migrate to canonical foundation docs, not into this tracker.
```

**Replace with:**

```markdown
## Next Session Opening Move

**Phase 1 scaffold is live. Credentials are wired. The CLI runs end-to-end with a stub payload.** Next session replaces the `generate_payload()` placeholder in `extension/scripts/generate.py` with the real pipeline. Operator is on `/Users/andrewrich/Desktop/aframe-mcp-connector/extension/scripts/` with venv activated and `.env` populated (Airtable PAT, CVRMLS base ID `appEEYJ31UKuCnJ6v`, Cognito API key).

**Priority 1 — Harpers Mill TH happy-path end-to-end.**

Sequencing:
1. Read this tracker, then `SESSION-HANDOFF-2026-10-03-PHASE-1-SCAFFOLD.md` for full session detail. `Payload_Rules_Conventions.md` v0.4 at hand for script-side logic. Attach a known-good HM TH example from `Lennar_Payload_Examples.md` as the diff target.
2. Pick a real HM TH Cognito Form 17 entry from the operator's recent submissions. Confirm entry ID. (If none exists, operator submits a test entry via Form 17's test mode first.)
3. Implement the pipeline, roughly in this order:
   - **Cognito fetch.** Call Form 17 API to fetch the entry; parse the JSON into a dict. Error loudly on 404 / auth failure.
   - **Community resolution.** Combine `Intake.Community` + `PropertyBasics.PropertyType` → `"Harpers Mill TH"` lookup key per convention #6. Fetch the matching Community Reference DB row. **Hard-fail if unresolved** — convention #6 is non-negotiable.
   - **Payload Rules fetch.** Fetch all rows from Payload Rules table in the Lennar base. Join with Cognito Fields and Source Types via the row's record IDs.
   - **Rule iteration.** For each rule, dispatch by Source Type (STATIC / COGNITO / COMMUNITY_DB / DERIVED / MANUAL_ENTRY) per `Payload_Rules_Conventions.md`.
   - **Property-Type and Path scoping.** Honor the row's Property Type multi-select and Path multi-select — rules fire only when the listing matches. HM TH is `taxid` path per the Community Reference DB.
   - **Payload assembly.** Shape output to match `Lennar_Payload_Examples.md`. Confirm envelope keys per `Payload_Envelope.md`.
4. First end-to-end run against a real HM TH entry. Diff output against the known-good `Lennar_Payload_Examples.md` HM TH example.
5. Each discrepancy sorts into either (a) Rules-table bug — fix the table, or (b) Script bug — fix the code. Schema doc gaps tracked but not yet fixed (Phase 4 doc refactor).

**Also do during pipeline build:**
- Flip `ensure_ascii=False` in `json.dumps` so em-dashes don't come out as `—`.

**Not for next session (Phase 1 expansion items — later):**
- Other 4 active communities (HM SF, Creekside Run TH, Everstone SF, Watermark SF).
- Both paths (new + taxid).
- All 5 Source Types exercised (MANUAL_ENTRY may not appear at HM TH).

Those happen *after* the HM TH happy path produces a payload that diffs clean (or diffs with explainable gaps).

At session close: bump version and date, refresh Decisions Parked and Next Session Opening Move to current state, and add a Version History row. Substantive decisions migrate to canonical foundation docs, not into this tracker.
```

---

## Change 5 — Add v0.13 row to Version History

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

**Find:**

```markdown
| 0.12 | 2026-10-01 | Session close after Cascade Options build + Community Reference DB school-column cleanup — the final Phase 0 data-modeling item. New `Cascade Options` table (`tblNe2xxNzQGEN0Zc`) built in CVRMLS Matrix Fields base with 262 rows across 7 batches (23 Area + 155 Elementary + 47 Middle + 37 High) covering the 11 confirmed Richmond-metro jurisdictions. Prerequisite 11 Field Options rows added for County/City (Input_29). Data source: `docs/cvrmls/CVRMLS_County_City_Reference.md` 2026-06-27 extraction — no Matrix re-extraction needed. Primary field settled as Label singleLineText (not formula — Airtable API doesn't permit formula primary at create time); matches Field Options convention. 7 rename cases captured per-row across Hanover and Richmond City (`StonewallJackson`→"Bell Creek Middle", `LeeDavis`→"Mechanicsville", `Binford`→"Dogwood", `Wythe`→"Richmond High School for the Arts", `GinterPark`→"Frances W. McClenney", `GeorgeMason`→"Henry L. Marsh III", `JohnBCary`→"Lois-Harrison Jones"). 5 Residential Input Form Notes columns cleared of GAP flags (County/City, Area, Elementary, Middle, High). Mid-session realization: Cascade Options is correct general CVRMLS reference data, not Lennar-specific — Lennar uses COMMUNITY_DB rules against the Community Reference DB. No backtracking; work earns its keep for the parallel standard-listing workstream. Community Reference DB school-column cleanup: 5 cells updated from display text to CVRMLS stored values (HM TH & SF Middle `Deep Creek`→`DeepCreek`, Creekside Run TH Middle `River City`→`RiverCity`, Watermark SF Middle `Falling Creek`→`FallingCreek`, Everstone SF High `Highland Springs`→`HighlandSprings`). Result: 4 Listing Info COMMUNITY_DB rules (Area, Elementary, Middle, High) are now clean verbatim passthroughs — no Rules changes needed. `Lennar_Community_Reference_Database.md` bumped v1.3 → v1.4 with new "School Value Convention" section and two-column schools tables (stored value + display label) per community. `Payload_Rules_Conventions.md` bumped v0.3 → v0.4: added convention #9 (Community Reference DB holds the values Matrix expects — downstream application of convention #3). Deferred-doc-corrections queue dropped: 5 Payload Schema value corrections + 2 §5.4.1 dead-code simplifications (v0.11) + 1 Protocol Fee Desc correction (v0.9) + Bath Info Cognito Fields Notes update (v0.10) — all removed from parked list. Rationale: Phase 1 script authoring will rewrite operational docs around the script's actual shape; folding corrections into forms that will be replaced is wasted work. Corrections survive in session handoffs for Phase 1 authoring reference. Phase 0 data modeling complete; Phase 1 kickoff is next-session priority. Full detail in `SESSION-HANDOFF-2026-10-01-CASCADE-OPTIONS-AND-DB-CLEANUP.md`. |
```

**Replace with:**

```markdown
| 0.12 | 2026-10-01 | Session close after Cascade Options build + Community Reference DB school-column cleanup — the final Phase 0 data-modeling item. New `Cascade Options` table (`tblNe2xxNzQGEN0Zc`) built in CVRMLS Matrix Fields base with 262 rows across 7 batches (23 Area + 155 Elementary + 47 Middle + 37 High) covering the 11 confirmed Richmond-metro jurisdictions. Prerequisite 11 Field Options rows added for County/City (Input_29). Data source: `docs/cvrmls/CVRMLS_County_City_Reference.md` 2026-06-27 extraction — no Matrix re-extraction needed. Primary field settled as Label singleLineText (not formula — Airtable API doesn't permit formula primary at create time); matches Field Options convention. 7 rename cases captured per-row across Hanover and Richmond City (`StonewallJackson`→"Bell Creek Middle", `LeeDavis`→"Mechanicsville", `Binford`→"Dogwood", `Wythe`→"Richmond High School for the Arts", `GinterPark`→"Frances W. McClenney", `GeorgeMason`→"Henry L. Marsh III", `JohnBCary`→"Lois-Harrison Jones"). 5 Residential Input Form Notes columns cleared of GAP flags (County/City, Area, Elementary, Middle, High). Mid-session realization: Cascade Options is correct general CVRMLS reference data, not Lennar-specific — Lennar uses COMMUNITY_DB rules against the Community Reference DB. No backtracking; work earns its keep for the parallel standard-listing workstream. Community Reference DB school-column cleanup: 5 cells updated from display text to CVRMLS stored values (HM TH & SF Middle `Deep Creek`→`DeepCreek`, Creekside Run TH Middle `River City`→`RiverCity`, Watermark SF Middle `Falling Creek`→`FallingCreek`, Everstone SF High `Highland Springs`→`HighlandSprings`). Result: 4 Listing Info COMMUNITY_DB rules (Area, Elementary, Middle, High) are now clean verbatim passthroughs — no Rules changes needed. `Lennar_Community_Reference_Database.md` bumped v1.3 → v1.4 with new "School Value Convention" section and two-column schools tables (stored value + display label) per community. `Payload_Rules_Conventions.md` bumped v0.3 → v0.4: added convention #9 (Community Reference DB holds the values Matrix expects — downstream application of convention #3). Deferred-doc-corrections queue dropped: 5 Payload Schema value corrections + 2 §5.4.1 dead-code simplifications (v0.11) + 1 Protocol Fee Desc correction (v0.9) + Bath Info Cognito Fields Notes update (v0.10) — all removed from parked list. Rationale: Phase 1 script authoring will rewrite operational docs around the script's actual shape; folding corrections into forms that will be replaced is wasted work. Corrections survive in session handoffs for Phase 1 authoring reference. Phase 0 data modeling complete; Phase 1 kickoff is next-session priority. Full detail in `SESSION-HANDOFF-2026-10-01-CASCADE-OPTIONS-AND-DB-CLEANUP.md`. |
| 0.13 | 2026-10-03 | Session close after Phase 1 kickoff (2026-10-02 → 2026-10-03). Four kickoff decisions settled: repo location (`aframe-mcp-connector/extension/scripts/` — subfolder in existing extension repo, co-located with the Phase 2 integration target rather than a separate repo); CLI trigger shape (`python generate.py --entry-id <id>` with URL-or-ID parsing; form ID as config in `.env` not an argument); output routing (`--stdout` default, `--clipboard` pbcopy, `--out <path>` — mutually exclusive); auth mechanism (direct REST APIs for both Cognito and Airtable, credentials in `.env` next to the CLI; Phase 2+ migrates the same keys to Railway Variables UI with no code changes). Scaffold shipped via `HANDOFF-2026-10-02-phase-1-scripts-scaffold.md` (deliberately batched — 7 changes in one Cursor handoff; override explanation in handoff header; Cursor on Sonnet 5 High handled cleanly): 5 new files in `extension/scripts/` (`README.md` as `SCRIPTS-README-001` v0.1, `.env.example` with Airtable + Cognito keys templated, `requirements.txt` pinning `requests==2.32.*` and `python-dotenv==1.0.*`, `generate.py` as a working CLI shell with argparse + env validation + output routing + labeled `generate_payload()` placeholder, `.gitkeep`) plus `REPO_STRUCTURE.md` updated with new `extension/scripts/` subsection and refreshed "Last Updated" line. Operator ran local setup end-to-end: venv created, deps installed, `.env` populated with real credentials (`AIRTABLE_PAT`, `AIRTABLE_CVRMLS_BASE_ID=appEEYJ31UKuCnJ6v`, `COGNITO_API_KEY`; pre-filled `AIRTABLE_LENNAR_BASE_ID=app78fMUwDNBHUZ6r` and `COGNITO_FORM_ID=17` left as-is). All three output modes verified against the stub JSON (stdout default, `--clipboard` pbcopy confirmed via paste, `--out ./test-output.json` confirmed by opening). Phase 2 UX pre-note parked: NHCs submit new listings in batches on the same day; the eventual "Generate from Cognito Entry" surface should pull the N most recent Form 17 entries and let the operator select from a picker, not assume a single most-recent entry. `extension/scripts/.gitignore` added for Python hygiene (`.venv/`, `__pycache__/`, `*.pyc`, `*.pyo`, `test-outputs/`). Three small items added to Decisions Parked: `CURSOR-HANDOFF-PROTOCOL-001` protocol-doc refresh (v1.1 says "delete handoff files" but active convention moves to `handoffs/applied/`; also worth capturing the batched-handoff override pattern); `SCRIPTS-*` doc_id convention decision (README's current `SCRIPTS-README-001` doesn't follow `FOUND-*` because it's code-local); `ensure_ascii=False` cosmetic flip in `generate.py` for pipeline-build time (em-dashes currently escape to `—`). Four kickoff items removed from parked (completed). Next session: replace `generate_payload()` placeholder with the real pipeline, Harpers Mill TH happy path first. Full detail in `SESSION-HANDOFF-2026-10-03-PHASE-1-SCAFFOLD.md`. |
```

---

## Change 6 — Create `extension/scripts/.gitignore`

New file. Python hygiene for the scripts subfolder — ignores virtual environment, bytecode, and local test outputs. `.env` is already covered by the repo-level `.gitignore` at any depth, so this file does not duplicate it.

**Add:** create a new file at `extension/scripts/.gitignore` with the exact content below.

```
# Python virtual environment and bytecode
.venv/
__pycache__/
*.pyc
*.pyo

# Local test output files (use ./test-outputs/ for ad-hoc runs)
test-outputs/
```

---

No other changes to `Lennar_Restructure_Phase_Tracker.md`. No other files touched beyond the two above.

---

## Commit

Commit all six changes as a single commit.

**Commit message:**

```
Phase Tracker v0.13: Phase 1 scaffold landed

Session close for 2026-10-02 → 2026-10-03 Phase 1 kickoff. Phase 1
scaffold (standalone Python CLI at extension/scripts/) landed via
HANDOFF-2026-10-02-phase-1-scripts-scaffold.md; this handoff records
the session close in the tracker.

- Decisions Landed: Phase 1 kickoff decisions (repo location, CLI
  shape, auth mechanism, output routing); scaffold landed and verified
  end-to-end; Phase 2 UX picker pre-note parked; extension/scripts/
  .gitignore added for Python hygiene.
- Decisions Parked: added CURSOR-HANDOFF-PROTOCOL-001 refresh,
  SCRIPTS-* ID convention, and generate.py ensure_ascii=False cosmetic
  flip; removed four completed kickoff items.
- Next Session Opening Move: Harpers Mill TH happy-path pipeline build
  (Cognito fetch → community resolution → Payload Rules iteration → DB
  lookups → payload assembly → diff against known-good example).

Also adds extension/scripts/.gitignore: .venv/, __pycache__/, *.pyc,
*.pyo, test-outputs/. (.env already covered by repo-level .gitignore.)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01MFfrr14YLQALiAPjhwYjE9
```

Then push to `origin main`.

---

## Cleanup

After commit and push, move this handoff file from `handoffs/incoming/` to `handoffs/applied/` per the active repo convention for executed handoffs.

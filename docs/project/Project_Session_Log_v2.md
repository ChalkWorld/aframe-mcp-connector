---
title: Project Session Log v2
document_id: AAR-TC-PROJ-LOG-V2-001
started: 2026-07-15
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Transaction Services
---

# Project Session Log v2
### AAR-TC Transaction Services | Document ID: AAR-TC-PROJ-LOG-V2-001

*Living record of sessions, decisions, changes, gaps, and document updates in the post–doc-realignment era.*

**Continues from** `docs/project/Project_Session_Log.md`, which is preserved as the archival record of all pre-realignment sessions. The prior log ends with the last session before the Doc Realignment track began. This log resumes with the first session of the realignment track and continues from there. Session numbering restarts at 001 to make the architectural transition explicit — old-log sessions and new-log sessions are not on a shared axis.

---

## Log Structure

Each session entry captures:
- **Focus** — what the session was working on
- **What Was Accomplished** — concrete outputs (drafts, commits, decisions landed)
- **Decisions Made** — architectural, structural, or workflow decisions that outlast the session
- **Documents Created / Updated** — with version bumps and doc IDs
- **Cursor Handoffs Produced** — with a one-line purpose per handoff
- **Discrepancies Surfaced** — things noticed but intentionally left for later
- **Open Verification Items** — anything untested or unconfirmed carried forward
- **Key References** — pointers to the current-state docs the session leaves behind
- **Session Handoff Produced** — the bridge doc for the next session (if any)

Not every session touches every field. Empty sections are omitted from the entry rather than left blank.

---

## Session 001 — Doc Realignment Foundation
**Date:** July 15, 2026

### Focus
Establish the doc architecture that all subsequent Lennar and standard-listing work will run against. Draft the target architecture, extract the payload envelope into its own spec, and install the standing rule that closed the failure mode driving the whole realignment.

### What Was Accomplished
- **Doc Realignment Target Architecture** drafted (`AAR-TC-DOC-REALIGN-TARGET-001`) — four-part model (Universal MLS field reference / Standard MLS payload schema / Builder-specific payload schema / Protocol), session-pack lookup via payload envelope, execution plan §8. Archival — stored in Andrew's local files; final repo location deferred to end of migration.
- **Payload Envelope Spec** drafted and committed (`AAR-TC-ENV-001`, v1.0, `docs/Payload_Envelope.md`) — defines the four envelope keys (`mls`, `builder`, `path`, `phase`) and the session-pack lookup table that maps envelope values to session-loaded docs.
- **Surface Ambiguity, Don't Guess** standing rule added to both protocols:
  - `Lennar_New_Listing_Protocol.md` (`AAR-TC-LENNAR-PROTO-001`) v2.1 → v2.2
  - `New_Seller_Side_Session_Protocol.md` (`AAR-TC-SELLER-PROTO-001`) v0.4 → v0.5

### Decisions Made
- **Path canonical form is `taxid`** — no underscore. Any legacy `tax_id` occurrence is updated on contact.
- **Envelope key absence carries meaning.** Absence of `builder` signals a standard listing; absence of `phase` signals a one-shot builder payload. Neither should ever appear as `null` or `""` — either the key exists with a value, or it doesn't exist.
- **`Lennar_Community_Reference_Database.md` lives in the repo.** The living-doc pattern doesn't preclude repo-managed edits — updates go through Cursor handoffs like everything else, keeping the routing spec's file paths honest.
- **Session log format v2 = new record.** Old log stays as archival; new log becomes `Project_Session_Log_v2.md` with session numbering restarted at 001.
- **Doc Realignment Target Architecture is kept as archival decision record.** Kept for the rationale documentation, not as a live operating doc. Companion reference from `Payload_Envelope.md`'s header preserves the connection.

### Documents Created / Updated
- Created: `docs/Payload_Envelope.md` (v1.0)
- Updated: `docs/lennar/Lennar_New_Listing_Protocol.md` (v2.1 → v2.2)
- Updated: `docs/protocols/New_Seller_Side_Session_Protocol.md` (v0.4 → v0.5)

### Cursor Handoffs Produced
| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-07-15-payload-envelope.md` | New file: envelope spec |
| `HANDOFF-2026-07-15-lennar-protocol-ambiguity-rule.md` | Add Surface Ambiguity rule to Lennar protocol |
| `HANDOFF-2026-07-15-standard-protocol-ambiguity-rule.md` | Add Surface Ambiguity rule to standard protocol |

### Session Handoff Produced
`Session_Handoff_Doc_Realignment_Foundation.md` — bridge to next session with execution plan and quick-start.

### Key References
- Payload Envelope Spec: `AAR-TC-ENV-001` (`docs/Payload_Envelope.md`) — v1.0
- Doc Realignment Target Architecture: `AAR-TC-DOC-REALIGN-TARGET-001` — archival, in Andrew's local files

---

## Session 002 — Consolidated Lennar Schema + Protocol Sync (Steps 2 & 3)
**Date:** July 15, 2026

### Focus
Execute Steps 2 and 3 of the doc realignment execution plan — draft the consolidated Lennar Payload Schema (Step 2) and sync the Lennar Listing Protocol against it (Step 3).

### What Was Accomplished
- **Consolidated Lennar Payload Schema** drafted and committed (`AAR-TC-LENNAR-PL-001`, v1.0, `docs/lennar/Lennar_Payload_Schema.md`) — 925 lines, structured per Target Architecture §5. Consolidates verified content from four source docs:
  - `Lennar_Bookmarklet_Customization.md` (`AAR-TC-LENNAR-BM-CUST-001`) — full content
  - `Lennar_Bookmarklet_Build_Notes.md` (`AAR-TC-LENNAR-BM-NOTES-001`) — schema content; fee data migrates to Community DB in Step 4
  - `Lennar_Features_Payload_Schema.md` (`AAR-TC-LENNAR-BM-SCH-001`) — Features section only; Listing Info and Fee Info sections dropped as stale
  - `Lennar_Features_Bookmarklet_Source.md` (`AAR-TC-LENNAR-BM-SRC-001-FEA`) — Features resolution table
- **Lennar Listing Protocol synced to schema** — `AAR-TC-LENNAR-PROTO-001` v2.2 → v2.3. Nine surgical changes: version header; Systems & Reference row; Entry Path Rules by Community table populated with confirmed assignments; Step 5b payload template regenerated against envelope contract; "Notes when generating the payload" rewritten; launcher-table intro line updated; end-of-5b technical-details reference updated; two rows added to Key IDs & References; v2.3 entry in Version History.

### Decisions Made (Structural — Documented in Schema §7.2)
- **`community` key at top level**, not nested under `listing` — drives lookups across multiple tabs, structurally parallel to `path`.
- **`"lennar": true` flag retired** in favor of envelope's `"builder": "lennar"`. Introduces dependency on Step 5: `CVRMLS_Payload_Schema.md`'s "Builder Flag Pattern" section becomes stale.
- **`owner.agent_related` canonical** (not `agent_related_to_seller`) — per CVRMLS upstream. Resolves Session 023 agenda item 5 (pre-realignment).
- **FEA doc authoritative for Features** (`AAR-TC-LENNAR-BM-SRC-001-FEA`); `Lennar_Features_Payload_Schema.md` §TAB 3 is superseded reference only, per its own explicit marker.
- **Property details always in Lennar payload on both paths** (`listing.year_built`, `rooms`, `levels`, `lot`, `bedrooms`) — Lennar override of the CVRMLS SKIP-TAXID default because Lennar new-construction parcels typically lack these values in the tax record. See §7.1 first item — the underlying question of what Harpers Mill parcels actually contain hasn't been live-confirmed.

### Community Path Assignments Locked
Previously `*(confirm)*` across the board; now confirmed and documented in both the schema §3 and the protocol's Entry Path Rules table:

| Community | Path |
|---|---|
| Harpers Mill TH | `taxid` |
| Harpers Mill SF | `taxid` |
| Creekside Run TH | `new` |
| Everstone SF | `new` |
| Watermark SF | `new` |
| Wynwood at Fox Creek SF | pending (community sold out — no active listings) |

### Documents Created / Updated
- Created: `docs/lennar/Lennar_Payload_Schema.md` (v1.0)
- Updated: `docs/lennar/Lennar_New_Listing_Protocol.md` (v2.2 → v2.3)

### Cursor Handoffs Produced
| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-07-15-lennar-payload-schema.md` | New file: 925-line consolidated schema embedded in handoff |
| `HANDOFF-2026-07-15-lennar-listing-protocol.md` | 9 surgical changes syncing protocol to new schema |

### Session Handoff Produced
`Session_Handoff_Doc_Realignment_Steps_2_3.md` — bridge to smoke test session with QA guidance for the two live intakes.

### Discrepancies Surfaced (Not Fixed — Out of Step 3 Scope, Carried Forward)
- **Tax Year (New path) value discrepancy.** Protocol's Confirmed Lennar-Wide Statics table (line ~205) has `Tax Year (New path) | 2026`. Three source docs (`Lennar_Bookmarklet_Customization.md`, `Lennar_Bookmarklet_Build_Notes.md`, `Lennar_Features_Payload_Schema.md`) all say `"0"`, and the new schema uses `"0"`. Best read: `"2026"` was a placeholder that never got corrected. Needs live verification.
- **Stale "gated by isLennar flag" language** in Confirmed Statics table's `Assd Improvement` row (line ~203) — per Session 021 unification, bookmarklets no longer branch on any builder key. Left alone in Step 3 scope.

### Open Verification Items Added to Schema §7.1
- Property details on Harpers Mill taxid path — does the tax record actually populate `year_built` / `rooms` / `levels` / `bedrooms` / `lot`?
- Street Suffix stored values — extraction owed since Session 017.
- Fee Includes stored value mappings per community — currently in retiring Build Notes; migrates into Community DB in Step 4.
- `fee.addl_fee_desc` scope across communities — populated only for Harpers Mill TH per current behavior; verify against MLS convention.
- Bath configuration confirmation per plan.
- `owner.agent_related` — verify deployed `owner_info.html` reads canonical key, not legacy `_to_seller` form.

### Key References
- Lennar Payload Schema: `AAR-TC-LENNAR-PL-001` (`docs/lennar/Lennar_Payload_Schema.md`) — v1.0
- Lennar New Listing Protocol: `AAR-TC-LENNAR-PROTO-001` (`docs/lennar/Lennar_New_Listing_Protocol.md`) — v2.3
- Payload Envelope: `AAR-TC-ENV-001` (`docs/Payload_Envelope.md`) — v1.0

---

## Session 003 — Smoke Test: First Live Intakes on New Schema/Protocol
**Date:** *(to be captured)*

### Focus
First live Lennar intakes against the consolidated `Lennar_Payload_Schema.md` (v1.0) and updated `Lennar_New_Listing_Protocol.md` (v2.3). QA pass on the new docs while running the normal intake workflow — treating it as the smoke test that gates Step 4 (retire drift) of the doc realignment.

### Status
Session ran. Andrew reported **"mostly passed."** Full findings captured in `Handoff_Addendum_Smoke_Test.md` (or equivalent name — the addendum to `Session_Handoff_Doc_Realignment_Steps_2_3.md`).

### Content Pending
This entry to be completed by the next working session (or by Andrew directly) from the smoke test addendum. Expected content:
- Per-intake summary — community, path, deviations from schema/protocol
- Confirmed working — fields/tabs/behaviors that wrote correctly
- Discrepancies found — schema/protocol says X, live behavior is Y
- New Open Verification Items — anything §7 doesn't yet capture
- Recommendation on Step 4 — safe to proceed, or fix first?

The Step 4 recommendation from this entry gates the next migration handoff.

---

## Session 004 — Smoke Test Fixes + Step 4 Completion
**Date:** July 15, 2026

### Focus
Resolve the two bugs surfaced by the 8720 Whitman Dr smoke test (see `Session_Handoff_Doc_Realignment_Steps_2_3_ADDENDUM_SmokeTest.md` for the surfacing context), then close Step 4 of the doc realignment execution plan — migrate per-community `fee.fee_includes` codes into the Community DB and retire the four consolidated Lennar source docs. Unblock 8724 Whitman Dr as the smoke re-test against the fully-consolidated schema.

### What Was Accomplished

**Fix 1 — Listing Info bookmarklet + CVRMLS source of truth.**
- Root cause: the Lennar carveout `if (path !== "taxid" || payload.lennar)` was orphaned by the Session 021 envelope migration — `payload.lennar` was retired in favor of `payload.builder === "lennar"` and the bookmarklet's dead-flag check never got updated. On the first live use of the envelope, four fields (Year Built, Rooms, Levels, Bedrooms) stopped writing on Lennar taxid. Post Office (`Input_41`) was a separate bug — the bookmarklet code never wrote it, though the inline reference block claimed it did.
- Fix: migrate the flag check to `payload.builder === "lennar"`; add `setField('Input_41', d.post_office || "")` universally following the Subdivision precedent; add `|| ""` fallback to Lot write for safety. Two handoffs shipped and applied.
- Verification: live smoke test against a blank Matrix listing with a targeted Harpers Mill TH taxid payload — all five fix-target fields (Year Built, Rooms, Levels, Bedrooms, Post Office) populated correctly. Confirmed 2026-07-15.

**Fix 2 — Fee Info fee_includes (turned out to be a payload-format bug, not code).**
- Initial hypothesis was silent-write failure at the code level (same class as July's Appl/Equip). Diagnosis instead: DOM inspection confirmed `Input_576_19` = Clubhouse (prefix and code both correct), a targeted-payload test with schema §8.1's suffix-only codes lit up all six Fee Includes checkboxes cleanly.
- Root cause identified from the actual smoke-test payload: `fee.fee_includes` was populated with full IDs (`["Input_576_19","Input_576_01",...]`) while the Fee Info bookmarklet reconstructs IDs inline via `setCheck('Input_576_' + v, true)` — expecting suffix-only. Bookmarklet built the DOM lookup as `Input_576_Input_576_19` (nonexistent), no boxes checked, no error. Identical `(x || []).forEach(...)` silent-failure surface as July's Appl/Equip — but here the mechanism was payload format mismatch across the two bookmarklet conventions (Fee Info reconstructs, Features A/B pass full IDs), not payload structure.
- Fix: no bookmarklet change. Schema §8.1/§8.2 example payloads corrected to suffix-only format; convention documented prominently as new end-of-doc "Format Conventions" section in `Lennar_Payload_Schema.md` v1.1.

**Step 4 — full doc realignment completion.**
- `fee.fee_includes` numeric codes migrated from retired Build Notes into `Lennar_Community_Reference_Database.md` v1.1 as a paired "Fee Includes Codes" row per community. Harpers Mill TH verified live 2026-07-15; Everstone and Watermark carry "interim mapping — verify at first live use"; Harpers Mill SF and Creekside Run remain pending display-text confirmation.
- Four Lennar source docs retired via `git rm`: `Lennar_Bookmarklet_Customization.md`, `Lennar_Bookmarklet_Build_Notes.md`, `Lennar_Features_Payload_Schema.md`, `Lennar_Features_Bookmarklet_Source.md`. All content had migrated to `Lennar_Payload_Schema.md` v1.0 (Session 002 of Steps 2 & 3 track) or into the Community DB (this session).
- Lennar Payload Schema bumped to v1.1: new Format Conventions section; §4.1 Lot corrected to SKIP-TAXID for Lennar per smoke test (tax record autofills confirmed live on Harpers Mill); §7.1 Property Details item resolved and Fee Includes item closed by migration; §8.1 and §8.2 example payloads corrected to suffix-only fee_includes format.
- Lennar New Listing Protocol bumped to v2.4: "Payload Format Conventions" standing rule added (cross-references schema §Format Conventions), `listing.lot` added to Step 5b taxid-path omit list, four retired-doc rows removed from Key IDs & References.

### Decisions Made

- **Bookmarklet Lennar carveouts stay in code, gated by envelope `payload.builder`.** The universal-bookmarklet ethos leaves as little builder logic in code as possible, but the property-details-on-taxid case is a legitimate builder-specific behavior — Lennar new construction lacks tax-record data that standard listings have. Retaining the check while migrating its flag (from `payload.lennar` to envelope's `payload.builder === "lennar"`) preserves correctness without adding new branches.
- **Post Office follows the Subdivision precedent.** Universal payload-driven write with `|| ""` fallback; community-driven for Lennar, harmless blank for standard MLS (which keeps human-picked). No builder gate needed at code level — payload presence determines behavior.
- **Lot is SKIP-TAXID for Lennar.** Smoke test confirmed Harpers Mill taxid autofills Lot from tax record. Previously documented as "always written for Lennar" — schema §4.1 corrected. Payload should omit `listing.lot` on taxid path.
- **Checkbox array format is a first-class convention.** Two patterns depending on target bookmarklet: suffix-only for Fee Info/Owner arrays (bookmarklet reconstructs `'Input_XX_' + v` inline), full-ID for Features A/B (bookmarklet uses `setCheckGroup` with fixed ID list). This is now documented as the new §Format Conventions in `Lennar_Payload_Schema.md` and as a standing rule in the Protocol. Carry-forward flagged for CVRMLS upstream when Step 5 comes up.
- **Community DB uses paired display-text + codes rows.** Human-readable text stays for MLS-sheet copy-paste; codes row underneath for payload generation, with verification status inline per community (verified live vs. interim vs. pending).
- **Interim mapping is acceptable for un-verified communities.** Everstone SF and Watermark SF codes carried from retired Build Notes; verify at first live use rather than gating the migration. Preserves velocity, keeps risk visible.

### Documents Updated

| Document | ID | Version | Change Summary |
|---|---|---|---|
| CVRMLS Bookmarklet Source | AAR-TC-CVRMLS-BM-SRC-001 | 0.5 → 0.6 | Listing Info §TAB 1: envelope migration (`payload.lennar` → `payload.builder`); Post Office write added; Lot fallback fix |
| Deployed launcher | — | — | `bookmarklets/listing_info.html` — href updated to match v0.6; reference block groupings corrected |
| Lennar Community Reference Database | AAR-TC-LENNAR-DB-001 | 1.0 → 1.1 | Fee Includes Codes rows added for all 5 communities (HM TH verified live; Everstone + Watermark interim; HM SF + Creekside pending) |
| Lennar Payload Schema | AAR-TC-LENNAR-PL-001 | 1.0 → 1.1 | New Format Conventions section; §4.1 Lot correction; §7.1 items resolved; §8 example payloads corrected; Retirement Notes finalized |
| Lennar New Listing Protocol | AAR-TC-LENNAR-PROTO-001 | 2.3 → 2.4 | Payload Format Conventions standing rule; `listing.lot` added to taxid omit list; four retired-doc rows removed |

### Documents Retired

| Document | ID | Reason |
|---|---|---|
| Lennar Bookmarklet Customization | AAR-TC-LENNAR-BM-CUST-001 | Content fully migrated to Lennar Payload Schema v1.0; envelope pattern supersedes bookmarklet-embedded COMMUNITIES table |
| Lennar Bookmarklet Build Notes | AAR-TC-LENNAR-BM-NOTES-001 | Schema content migrated to Lennar Payload Schema; per-community fee_includes codes migrated to Community DB this session |
| Lennar Features Payload Schema | AAR-TC-LENNAR-BM-SCH-001 | Features field-map content migrated; Listing Info and Fee Info sections dropped as stale (used non-canonical Input IDs) |
| Lennar Features Bookmarklet Source | AAR-TC-LENNAR-BM-SRC-001-FEA | Lennar-resolution table migrated; JS source predated Session 021 unification (deployed features_a/features_b.html are the current authority) |

### Cursor Handoffs Produced This Session

| Handoff | Target File | Purpose |
|---|---|---|
| `HANDOFF-2026-07-15-cvrmls-bookmarklet-source.md` | `docs/cvrmls/CVRMLS_Bookmarklet_Source.md` | Fix 1 source-of-truth update (v0.6) |
| `HANDOFF-2026-07-15-listing-info-bookmarklet.md` | `bookmarklets/listing_info.html` | Fix 1 deployed launcher update + commit |
| `HANDOFF-2026-07-15-community-db-fee-includes.md` | `docs/lennar/Lennar_Community_Reference_Database.md` | Step 4: Fee Includes codes migration (v1.1) |
| `HANDOFF-2026-07-15-lennar-payload-schema.md` | `docs/lennar/Lennar_Payload_Schema.md` | Step 4: Format Conventions + smoke-test corrections (v1.1) |
| `HANDOFF-2026-07-15-lennar-protocol-v2-4.md` | `docs/lennar/Lennar_New_Listing_Protocol.md` | Step 4: standing rule + Lot omit + retired-doc cleanup (v2.4) |
| `HANDOFF-2026-07-15-step-4-retirement.md` | *(retirement + commit)* | Step 4: `git rm` × 4 source docs + final commit |
| `HANDOFF-2026-07-15-session-log-v2-002.md` | `docs/project/Project_Session_Log_v2.md` | This entry |

### Discrepancies Surfaced (Not Fixed This Session)

- **`listing_info.html` reference block — ZIP (`Input_635`) accuracy.** The reference block lists ZIP under "ALWAYS — from payload (no builder gate)" but the code writes ZIP only when `path !== "taxid"`. Not touched this session (scoped as reference-block ZIP fix out of Fix 1 scope). Doc-only, low-stakes.
- **Schema §4.1 street_dir vs. deployed code.** Schema lists `street_dir` in the taxid-omit set; deployed bookmarklet writes it on all paths with `|| ""` fallback. Practically invisible for Lennar (Whitman Dr etc. have empty street_dir), but the schema-vs-code disagreement warrants cleanup on a doc-only pass.
- **`fee.addl_fee_desc` scope decision.** Whether Capital Contribution text should write into `Input_117` for all Lennar communities (not just Harpers Mill TH) — question raised in §7.1, not resolved this session. Verify against MLS convention on live Fee Info tab at some point.

### Open Verification Items (Carried Forward)

- **Fee Includes codes for four communities.** Harpers Mill TH verified live; Everstone SF and Watermark SF are interim from retired Build Notes; Harpers Mill SF and Creekside Run TH pending display-text confirmation. First live use of each is the verification.
- **Street Suffix stored values (`Input_37`).** Full stored-value set not extracted — carried from Session 017.
- **Bath configuration confirmation.** Common defaults are documented but per-listing truth requires email confirmation — a permanent item, not resolvable via schema work alone.
- **Owner Info naming — `agent_related`.** Verify deployed `owner_info.html` reads `payload.owner.agent_related` (not legacy `_to_seller`). Not exercised this session's smoke test.
- **Features A/B live test status.** Protocol still shows "Not yet tested" for both `features_a.html` and `features_b.html`. Andrew's 8720 Whitman Dr smoke test payload had both `features_a` and `features_b` populated and ran through to completion, so they've likely been exercised in practice — but Protocol status hasn't been updated. Confirm and update on next intake.
- **Post Office semantics for standard MLS.** Reclassification MANUAL → DYN in `CVRMLS_Payload_Schema.md` — batched with Step 5 CVRMLS work.

### Key References

- `Payload_Envelope.md` v1.0 — envelope contract
- `Lennar_Payload_Schema.md` v1.1 — Lennar runtime schema (with new Format Conventions section)
- `Lennar_New_Listing_Protocol.md` v2.4 — Lennar session protocol
- `Lennar_Community_Reference_Database.md` v1.1 — per-community values including fee_includes codes
- `CVRMLS_Bookmarklet_Source.md` v0.6 — CVRMLS bookmarklet JS source of truth
- `bookmarklets/listing_info.html` — deployed launcher (post Fix 1)

### Session Handoff Produced

`Session_Handoff_Doc_Realignment_Step_4_Complete.md` — bridges to the next session, whose primary task is running the 8724 Whitman Dr smoke re-test against the fully-consolidated schema and protocol. Handoff carries a targeted payload template, the areas of highest re-test risk, and the branching plan (test clean → Step 5 next; test surfaces issues → fix first).

---

## Session 005 — 8724 Whitman Dr Smoke Re-Test + Standing Defaults
**Date:** July 16, 2026

### Focus
Run the 8724 Whitman Dr smoke re-test — the final Step 4 verification — against the fully-consolidated schema (v1.1) and protocol (v2.4). Resolve the bath/basement ambiguity the intake surfaced, capture the standing defaults that came out of it, and close a documentation-drift gap discovered along the way.

### What Was Accomplished
- Read Carly's intake email (thread `19f6606514083bb1`) and Izaiah Clark's exterior photo email (thread `19f4d39b6674a190`) for 8724 Whitman Dr (Harpers Mill TH, Arcadia model, homesite T074).
- Surfaced a genuine ambiguity rather than guessing through it: the form's "Basement, Slab or Crawl? → Slab" conflicted with "Finished SqFt - Bsmt: 502," "Guest Room in Basement: Yes," and a 3-level bath breakdown. Andrew confirmed the Arcadia plan has no true basement — 3 levels on a slab foundation, with the ground floor mapping to Bath Info Level 1.
- Generated the MLS Data Input Sheet and full bookmarklet JSON payload for 8724 Whitman Dr — corrected two Cognito comma/typo artifacts (street number, ZIP), stripped the Public Remarks phone number per the compliance rule.
- **Smoke re-test ran clean — all tabs confirmed correct in Matrix.** Closes Step 4 of the doc realignment end-to-end.
- Applied Gmail label `Lennar/8724 Whitman Dr` (standard Lennar/[Address] palette — `#98d7e4` / `#0d3b44`) to the three related threads (intake, exterior photo, signing-complete).
- Resolved the "Session Data tab metadata" open item carried since the Smoke Test 1 addendum — worksheet ID `1881501036`, 16-column schema, accessed via the Google Sheets Zapier connector. Added the 8724 Whitman Dr row (Active, Received, MLS Input Stage: Done) and updated 8720 Whitman Dr's Status → Active and Addendum Status → Received, per this morning's signing-complete confirmation covering both addresses.
- Discovered and resolved a documentation-drift gap: the Community Reference Database in Claude's project knowledge was showing as stale v1.0 (missing the Fee Includes Codes rows Session 004 had already migrated into the real v1.1 repo file). Andrew confirmed the repo is correctly at v1.1 and replaced the stale project-knowledge copies of the schema, protocol, and Community DB with current versions.

### Decisions Made
- **All Lennar townhomes are 3-level/slab until told otherwise.** No true basement — Bath Info always maps to Level 1/2/3, never the Basement row, regardless of community.
- **All full baths on Lennar listings default to `"TS"`** unless the email explicitly states otherwise.
- **Rooms static default: `"8"` for Townhouse, `"10"` for Single Family**, used whenever the field isn't stated in the intake email.
- **ShowingTime "No" Allow Online Requests formalized as a standing manual checklist item.** Previously relied on the Aframe task template firing automatically at transaction creation — no longer reliable now that sessions skip Aframe transaction creation by default (per current practice, not yet reflected as a protocol-level decision).
- **New "Activation Double-Check" standing rule.** When Andrew reports a listing went Active, the session proactively re-surfaces the ShowingTime toggle, the Aframe status flip, and the sales rep email — rather than waiting to be asked.
- **Step 13 (Active Listing Email, session-executed) stubbed in intentionally incomplete** — trigger, recipient roster, template, and attachment method all deferred to a later session.

### Documents Updated

| Document | ID | Version | Change Summary |
|---|---|---|---|
| Lennar Payload Schema | AAR-TC-LENNAR-PL-001 | 1.1 → 1.2 | Rooms static fallback (TH="8"/SF="10"); TH bath structural default (3-level/slab, no Basement row); all-full-baths-`"TS"` default; §7.1 Bath configuration item partially resolved |
| Lennar New Listing Protocol | AAR-TC-LENNAR-PROTO-001 | 2.4 → 2.5 | ShowingTime "No" Allow Online Requests reminder added to Step 12; Step 13 stub added for session-executed Active Listing Email; new Activation Double-Check standing rule |

### Cursor Handoffs Produced This Session

| Handoff | Target File | Purpose |
|---|---|---|
| `HANDOFF-2026-07-16-lennar-payload-schema.md` | `docs/lennar/Lennar_Payload_Schema.md` | Rooms fallback + TH bath standing defaults (v1.2) |
| `HANDOFF-2026-07-16-lennar-new-listing-protocol.md` | `docs/lennar/Lennar_New_Listing_Protocol.md` | ShowingTime reminder + Step 13 stub + Activation Double-Check rule (v2.5) |
| `HANDOFF-2026-07-16-session-log-v2-005.md` | `docs/project/Project_Session_Log_v2.md` | This entry |

### Discrepancies Surfaced (Not Fixed This Session)
- **Claude project-knowledge copies can silently drift behind the repo.** The Community DB was a full version behind (v1.0 shown vs. v1.1 actual) with no indication anything was wrong until the version header was checked directly. Worth a habit of spot-checking version headers on frequently-edited docs rather than assuming project knowledge is current.
- **Session 003 (Smoke Test: First Live Intakes) is still an unfilled stub in this log.** Flagged again this session; still not resolved — retro-fill from the smoke test addendum, or explicit decision to leave it, still pending.

### Open Verification Items (Carried Forward)
- Session 003 stub — still pending retro-fill or explicit decision to leave as-is.
- Street Suffix stored values (`Input_37`) — still open, carried since Session 017.
- `fee.addl_fee_desc` scope across communities — still open.
- Owner Info `agent_related` — deployed `owner_info.html` behavior not specifically re-verified this session.
- Bath configuration — partially resolved (TH structure now fixed); Single Family bath structure remains unconfirmed.
- Features A/B "Not yet tested" status in the Protocol launcher table — still not updated despite two clean Lennar TH intakes (8720, 8724) exercising both in practice. Worth closing out.
- POC/primary contact — Carly Evans was still sending as of this session (7/16), despite the protocol saying Megan Cook took over 6/30.

### Key References
- `Lennar_Payload_Schema.md` v1.2 — Lennar runtime schema
- `Lennar_New_Listing_Protocol.md` v2.5 — Lennar session protocol
- `Lennar_Community_Reference_Database.md` v1.1 — confirmed current in repo; project-knowledge copy refreshed this session
- Google Sheet Session Data tab — worksheet ID `1881501036` (resolved this session)

---

*Next session: Step 5 (CVRMLS clarification pass — retire the stale Builder Flag Pattern section, reclassify Post Office MANUAL→DYN, mirror the Format Conventions section upstream) is now unblocked. Step 8 (`REPO_STRUCTURE.md` update) waits on Step 5 landing first. Session 003 stub remains open.*

---

## Session 006 — PandaDoc Addendum Signing Automation
**Date:** July 21, 2026

### Focus
Build and test automated Lennar listing addendum signing via PandaDoc, replacing the DocuSign-pending Step 10 stub in the Lennar New Listing Protocol.

### What Was Accomplished
- Evaluated DocuSign's free tier — confirmed no free API/MCP access exists at any account tier; production sending requires the Business Pro plan regardless of whether it's called through the connector or a direct API integration
- Researched alternatives (Verdocs, SignWell, PandaDoc, Docuseal); confirmed PandaDoc's free tier explicitly includes Claude/ChatGPT (LLM agent) usage as a named feature, and PandaDoc has a native MCP connector already in Anthropic's directory
- Connected the PandaDoc account and connector
- Uploaded the blank CVR 106 form and built a PandaDoc Template (`Lennar Listing Addendum - Testing`, ID `9DpcJ2wbwTkXvLh59aTPTn`)
- Designed and built the field structure collaboratively in the PandaDoc editor: Sender role (auto-assigned to document creator, no live recipient) holding two sender-filled text fields (`Property Address`, `Composed Clause`); Owner and Agent roles each carrying a signature field and an autofill-with-signing-date date field
- Found and fixed a field pre-fill bug — PandaDoc requires an explicit "merge field name" distinct from the internal field ID before the API `fields` parameter can target a field
- Ran three iterative test sends against safe test inboxes, catching and correcting: a field-value swap (composed clause and address values landed reversed relative to internal field IDs), a sentence line-wrap issue (address number splitting from street name mid-line — fixed with an inserted line break before the address), and date fields defaulting to manual entry instead of autofill
- Confirmed final recipient routing, document naming convention, and multi-listing handling; captured as a Cursor handoff to the Lennar New Listing Protocol doc

### Decisions Made
- PandaDoc is the platform of record for Lennar addendum signing — DocuSign ruled out (no free-tier API access at any tier); Verdocs ruled out (no connector path via the MCP registry or Zapier)
- Recipient routing: Owner role → Megan Cook (`megan.cook@lennar.com`); Agent role → Gary Martin, routed to Andrew's own inbox (`agentandrewrich@gmail.com`) — Andrew signs on Gary's behalf by design, not a routing error
- Document naming convention: `Lennar Listing Addendum - [Street Number] [Street Name]` — no city/state/zip
- Send-first, fire-and-forget sequencing — the session sends the addendum early in intake and does not block on signature; Addendum Status on the Session Data tab is set to `Sent` immediately after sending
- No native batch-send API exists — multiple simultaneous new listings are handled as sequential create-and-send calls within the same session, not a blocker
- Signed-document retrieval from PandaDoc back to the Google Drive property folder is explicitly **not yet automated** — remains a flagged manual step and a Future work item

### Documents Created / Updated

| Document | Version | File |
|---|---|---|
| Lennar New Listing Protocol | 2.6 | `docs/lennar/Lennar_New_Listing_Protocol.md` |

### Cursor Handoffs Produced

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-07-21-lennar-new-listing-protocol.md` | Step 10 rewrite (PandaDoc automation), Step 12 checklist cleanup, Future section update, Key IDs addition, version bump to 2.6 |
| `HANDOFF-2026-07-21-session-log.md` | This entry |

### Open Verification Items
- Signed-document retrieval and save-to-Drive automation — not yet built
- PandaDoc free-tier volume (60 documents/year per the platform's stated cap) not yet verified against a full year of actual Lennar listing pace
- Megan Cook's exact job title for the printed-name/title caption line — confirmed current directly in PandaDoc by Andrew; not independently verified against a source document

### Key References

| Item | Value |
|---|---|
| PandaDoc — Lennar Addendum Template ID | `9DpcJ2wbwTkXvLh59aTPTn` |
| Lennar New Listing Protocol | v2.6 (`docs/lennar/Lennar_New_Listing_Protocol.md`) |

---

## Session 007 — Cognito Lennar Intake Form Build
**Date:** July 24, 2026

### Focus
Replace the informal Carly/Megan email intake process (and the abandoned Zapier-linked stub form) with a real, Andrew-managed Cognito form for Lennar new-listing submissions. Build the form, validate its field list against actual rep knowledge via a live walkthrough, and get it into the sales team's hands.

### What Was Accomplished
- **Inventoried existing Cognito form landscape** — found three parallel/competing efforts: the org-level "Lennar VA / DC Metro" form Carly/Megan have been actively using since May (external, on Lennar's own Cognito account, not accessible via AAR-TC's API key), a personal prototype built by Izaiah Clark under his own Cognito account, and Andrew's own Form 16 ("Lennar In-take form"), an April stub with a fragile Chesterfield-string-matching address formula and a notification email that never included entry data. All three retired in favor of a single new form Andrew owns and manages.
- **Built Form 17 ("Lennar New Listing Intake")** in Cognito, modeled in part on Izaiah's field list and in part on the existing "Property Details Sheet" (Form 9) — specifically its conditional level-by-level bathroom input pattern (Levels with Bathrooms checkbox → per-level Full/Half Bath + Features subsections), which maps more directly onto the payload schema's per-level bath structure than Izaiah's flat field list did.
- **Live rep call correction pass** — Andrew ran a live walkthrough with the sales team using the general Property Details Sheet as a working reference (Entry #12, all-options-checked test entry), surfacing several corrections to previously-assumed statics: Washer/Dryer are universal across all builds (not fuel-related, as originally guessed from historical listing-email patterns); Gas Cooking vs. Electric Cooking is a genuine per-listing choice, not a Heat-Fuel-derived static as historical email data had suggested; Siding and Flooring both have real cross-listing variation, contradicting the current `Lennar_Payload_Schema.md` §5.1 pure-statics entries for both.
- **Established a Lennar-specific "static but visible" pattern** — several fields (Dishwasher, Microwave, Refrigerator, Washer, Dryer, Cooking Type) are backend-predictable but kept as checkable form fields anyway, so reps get active confirmation rather than an absence they might mistake for an omission.
- **Simplified several sections against Lennar-specific rules, confirmed by Andrew directly rather than inferred from data:** bathroom Full Bath is always Tub & Shower and Half Bath needs no Features distinction (Property Details Sheet's Features dropdown dropped from the new form entirely); garage is always attached with Direct Entry and Auto Door Opener whenever Garage = Yes (no separate form fields needed); Townhouse Unit Placement locked to exactly 2 options (End Unit, Interior Unit) rather than the general 8-option CVRMLS set.
- **Confirmed a real capability limit, not just a style preference:** neither the MCP connector's `generate_form` tool nor Cognito's own in-app AI form generator can edit an existing form — both only create new forms (confirmed against Cognito's own documentation). All field additions and workflow fixes this session were done by Andrew directly in the Cognito editor, with Claude providing build guides and post-edit schema verification passes rather than attempting AI-driven edits.
- **Sent the form live to the Lennar sales team.** Two real test entries submitted and reviewed (Entry #1, Entry #2) — core field capture confirmed working correctly, including decimal handling on Acres/Lat-Long (fixed this session) and conditional bathroom-level logic.
- **Partial workflow cleanup** — the two dead notification-email actions (blank recipient addresses) were deleted, leaving one working email to `agentandrewrich@gmail.com`. The surviving email's body text was not updated and still references several stale/incorrect merge-field paths — see Open Verification Items.

### Decisions Made
- **Form 17 is the sole Lennar intake mechanism going forward.** The org-level "Lennar VA / DC Metro" form, Izaiah's personal prototype, and Andrew's Form 16 stub (renamed "Zapier form for Lennar (OLD)," kept for history rather than deleted) are all superseded.
- **No builder-name field on the form.** Multi-builder reuse, when it comes, will be handled as a separate cloned/tweaked form per builder rather than one generic form with a builder selector — each builder is expected to have real quirks.
- **Appl/Equip static promotion:** Dishwasher, Microwave, Refrigerator, Washer, Dryer move from `Lennar_Payload_Schema.md` §5.4's "confirm per email" framing to genuine Lennar-wide statics. Cooking Type (Gas/Electric) stays per-listing — the original hypothesis that it tracked community Heat Fuel (from historical email-pattern analysis) was explicitly discarded once live rep input showed the pattern was survivorship of reps not knowing the full option set, not a real construction fact.
- **Siding and Flooring are not statics** as currently documented in `Lennar_Payload_Schema.md` §5.1 — real variation confirmed via live rep walkthrough. Protocol doc fix intentionally deferred until the form is fully locked (see Session Handoff Produced).
- **A stale doc-pointer bug was found, not yet fixed:** `Lennar_Payload_Schema.md` §6 claims the community Heating/Pool/Amenities lookup table lives in `Lennar_Community_Reference_Database.md`. It doesn't — confirmed by direct inspection this session. The table only exists in §5.2 of the payload schema itself. The migration promised in §5.2's own note never happened.

### Discrepancies Surfaced
- **Style field can retain a stale value after Property Type changes.** Observed live in Entry #2 — Style showed "Ranch" on a Townhouse entry, despite the field's conditional visibility formula (`=(PropertyType = "Single Family")`) hiding it. Cognito does not clear a field's stored value just because it becomes hidden. Not fixed this session — flagged as a real risk for whatever reads this data downstream, since Style must be disregarded whenever Property Type = Townhouse regardless of what's actually stored.
- **Style field's "Custom" option is still present**, despite Andrew's stated rule being just Ranch / 2 Story for Single Family. Left unresolved — confirm intent before the protocol update locks in the Style field's expected value set.

### Open Verification Items
- Email notification body still contains stale merge-field paths (`{{PropertyBasics.ListDate}}`, `{{Garage.Garage}}` / `{{Garage.NumberOfCars}}`, `{{Garage.DirectEntry}}`, `{{TownhouseUnitPlacement.UnitPlacement}}`, `{{FeaturesAppliances.FeaturesAndAppliances}}`, `{{BedsBathsLevels.AdditionalBathroomFeatures}}` referencing a field that was deliberately removed from the form, `{{Intake.SubmittedByEmail}}` referencing a field that was never added). A corrected body was drafted (see Key References) but not yet applied as of session end.
- The corrected merge-tag paths in that draft are Claude's best inference from the schema's object nesting, not confirmed against Cognito's actual rendering — recommend using Cognito's "Insert Field" picker to place them rather than trusting the draft's exact syntax, then verifying against a real test submission.
- Exterior Features section has a field labeled just "Features," sitting inside a section already titled "Exterior Features" — cosmetic, low priority.

### Key References
- Cognito Form ID 17, internal name `LennarNewListingIntake`, public form title "Lennar New Listing Intake"
- Retired: Form 16 ("Zapier form for Lennar (OLD)"), Izaiah Clark's personal prototype (`cognitoforms.com/IzaiahClark/...`), external org-level "Lennar VA / DC Metro" form
- Test entries: Form 17 Entry #1, Entry #2 (2026-07-24)
- Working documents produced this session (Andrew's local files, not yet in repo): `Lennar_Intake_Form_Cognito_AI_Prompt.md`, `Lennar_Intake_Form_Review_Notes.md`, `Lennar_Form_Field_Classification.md`, `Lennar_Form_Property_Basics_Build_Guide.md`, `Lennar_Form_Email_Fix_Guide.md`

### Session Handoff Produced
`Session_Handoff_Cognito_Intake_Form.md` — bridge doc scoping the `Lennar_Payload_Schema.md` and `Lennar_New_Listing_Protocol.md` updates needed to bring the protocol in line with the new form.

---

## Session 008 — Aframe Role/Category Audit + Batching Design Refinement
**Date:** August 7, 2026

### Focus
Two threads: (1) refine the batch/bulk connector tools design carried from `SESSION-HANDOFF-2026-07-13-batch-tools.md`, resolving open questions about contact/participant chaining; (2) a full audit of participant role and category logic across the buyer-side and seller-side session protocols, prompted by a documentation gap found while designing the batch tools — a missing `Lender` category despite an existing role ID, surfaced by a live email template dependency.

### What Was Accomplished
- **Batching:** confirmed via the live Aframe API reference that `bulk_add_transaction_participants` can create-and-link a new contact inline (no `bulk_create_contacts` round trip needed for the dominant workflow). `bulk_create_contacts` deprioritized/likely cut from the original three-tool plan.
- **Full role/category audit** against live Aframe data (`list_participant_roles`, `list_contact_categories`, live contact and transaction pulls) covering: Lender / Lender (Other Side), Closer (confirmed functional role, not job-title-based — covers title-company closers and settlement-attorney-office paralegals alike), Attorney / Attorney (Other Side) (coexists with Closer, doesn't replace it), Paralegal (confirmed deprecated/unused), Lender Processor (confirmed handled via `altContact*` fields, not a separate participant), Termite/WDI and Septic trigger logic (investor-buyer exception, VA/FHA lender-mandated rule, vendor sourced from Agent Profiles rather than hardcoded), Referral Agent (full pattern confirmed against a real closed file, xactionId `545718`, including the `f_ReferralTransaction2` merge field format and agent-tag categorization), and a new Designated Agency compliance check (same-brokerage co-op agent flag).
- Confirmed via a live contact record that Aframe's second-contact field family is genuinely named `altContact*` at the API level, not a connector-invented term.

### Decisions Made
- Category assignment cannot be mechanically derived from role name — must be checked per-role against Aframe's actual category list (`Lender`/`Closer`/`Attorney` have no "Other Side" category variant; `Buyer`/`Seller` do; `Agent (Other Side)` uses an unrelated label, `Co-Op Agent`).
- Agent-tag category (contact tagged with the roster agent's name, e.g. `Liz Brown`) applies to own-side Client, Lender, and Referral Agent contacts only — not Other Side contacts, not Closer.
- Termite: seller-side always adds the agent's preferred vendor at setup regardless of as-is status (deliberate default, not conditional); buyer-side defaults to adding unless the buyer is a flagged investor.
- Visibility flags (`agentVisible`/`buyerSellerVisible`) exist and vary by role (confirmed Referral Agent is buyer/seller-hidden on the live file checked) but are explicitly out of scope for the batch tools for now — Andrew doesn't use the client portal.

### Documents Created / Updated
- Updated: `docs/protocols/New_Buyer_Side_Session_Protocol.md` (v1.2 → v1.3)
- Updated: `docs/protocols/Seller_Under_Contract_Session_Protocol.md` (v1.1 → v1.2)

### Cursor Handoffs Produced
| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-08-07-new-buyer-side-session-protocol.md` | Role/category audit changes to buyer-side protocol |
| `HANDOFF-2026-08-07-seller-under-contract-session-protocol.md` | Role/category audit changes to seller-side protocol; carried the commit block for both |
| `HANDOFF-2026-08-07-session-log-v2.md` | This entry |

### Discrepancies Surfaced (Not Fixed — Carried Forward)
- Seller-side protocol's existing "Buyer's settlement company: `Closer` + transaction year" category rule was not verified against a live record this session (unlike Termite and Referral Agent, which were confirmed via `get_contact`) — flagged directly in the protocol doc, not resolved.
- Whether the agent-tag category rule should extend beyond Client/Lender/Referral Agent to other role types (Attorney, Termite, Septic, Other Side roles) was not fully resolved — confirmed own-side-only in principle, but each role wasn't individually confirmed.
- Lender Processor role (21814) confirmed "mostly dead" but not fully deprecated like Paralegal — no action taken, left as-is.

### Open Verification Items
- Vendor pricing table (PestNow WDI $49, bacteria well test $150, lead/nitrates cost unknown) — parked, no doc created yet.
- Whether `Referral Agent` category and agent-tag apply on a seller-side file the same way in practice — pattern was documented by analogy from a buyer-side example (xactionId `545718`); not yet confirmed against a live seller-side referral file.

### Session Handoff Produced
`SESSION-HANDOFF-2026-08-07-batch-tools.md` — bridge to next session to build `bulk_update_custom_fields` and `bulk_add_transaction_participants`.

### Key References
- New Buyer Side Session Protocol: v1.3
- Seller Under Contract Session Protocol: v1.2
- Original batch-tools design: `SESSION-HANDOFF-2026-07-13-batch-tools.md`

---

## Session 009 — Batch/Bulk Tools Build
**Date:** August 7, 2026

### Focus
Finalize and ship the three batch/bulk connector tools scoped across `SESSION-HANDOFF-2026-07-13-batch-tools.md` and `SESSION-HANDOFF-2026-08-07-batch-tools.md` — `bulk_update_custom_fields`, `bulk_add_transaction_participants`, and a newly-added third tool, `bulk_search_contacts`.

### What Was Accomplished
- Locked final schemas against the live `src/index.js`, confirming no `src/aframe.js` changes were needed — each bulk tool loops an already-imported single-entity function.
- Added `bulk_search_contacts` as a third tool, not in the original plan — covers the co-op agent/lender/closer "might already exist in the system" lookup, the same thing Aframe's UI typeahead does.
- Confirmed `bulk_create_contacts` stays cut — no standalone use case, since `bulk_add_transaction_participants` already creates-and-links inline.
- Added `categories` to `bulk_add_transaction_participants` — doesn't exist on the single-entity `add_transaction_participant` tool at all; flagged as drift between the two, not fixed this session.
- Shipped as v0.7.0: three Cursor handoffs (`src/index.js`, `package.json`, `CONNECTOR_TOOL_ROADMAP.md` Tier 2 → Tier 1), applied in sequence.
- **Production incident, self-caused:** v0.7.0 crash-looped on deploy — `bulk_search_contacts` mixed `??` and `||` without parentheses, a genuine JS syntax error. Diagnosed from the Railway crash log, fixed in a one-line hotfix (v0.7.1).
- **Second bug, same authoring pass:** all three bulk tools called `formatResult(summary, { results })` instead of `formatResult(summary, { payload: results })` — the per-entry detail array was silently dropped from every tool's output, only the summary line ever rendered. Caught during the first live smoke test. Fixed across all three tools in one hotfix (v0.7.2).
- Reconnected the Claude.ai connector after the v0.7.0 tool-list change; confirmed all three tools discoverable via `tool_search`.
- Full smoke test against the `1 POC Lane` sandbox (`xactionId 551669`) after both hotfixes — all three tools confirmed working end to end, including `categories` verified via a follow-up `get_contact` call and partial-failure isolation confirmed on both write tools with deliberately bad entries.

### Decisions Made
- `bulk_search_contacts` is read-only, no partial-failure model — every entry always returns a result (0, 1, or several matches), never "failed."
- No per-entry `agentVisible`/`buyerSellerVisible` on `bulk_add_transaction_participants` — Aframe's default (`true`) applies; a known, deliberately deferred gap.
- `formatResult` convention (summary line + full per-entry array) is now actually working as designed, not just documented.
- Recurring vendor contacts (closer, lender, termite, co-agent) should be checked against Agent Profiles before any search tool call — `bulk_search_contacts` is for participant-type lookups, not a replacement for the Agent Profiles ID table.

### Known Issues Fixed This Session
| Issue | Introduced | Fixed | Severity |
|---|---|---|---|
| `??`/`||` syntax error in `bulk_search_contacts` crashed the Railway deploy on boot | v0.7.0 handoff | v0.7.1 hotfix | Production outage |
| `formatResult` called with `{ results }` instead of `{ payload: results }` across all three bulk tools — detail array silently dropped | v0.7.0 handoff | v0.7.2 hotfix | Silent data-visibility bug, no crash |

Both bugs were introduced in the same handoff-authoring pass, and both were authoring mistakes, not Cursor apply errors — Cursor applied both fixes correctly on the first pass. The live smoke test is what caught the second bug; a code read-through alone hadn't.

### Documents Created / Updated
- `src/index.js` — 3 new tools (39–41), version bumped 0.6.0 → 0.7.0, two follow-up hotfixes
- `package.json` — version bumped to 0.7.0
- `docs/connector/CONNECTOR_TOOL_ROADMAP.md` — v3.1 → v3.2; Batch/Bulk Operations promoted Tier 2 → Tier 1
- `BATCH-TOOLS-DESIGN-001` — new standalone design doc (schemas, rationale, sample outputs)

### Cursor Handoffs Produced
| Handoff | Purpose |
|---|---|
| `HANDOFF-v0.7.0-index-js.md` | 3 new bulk tools + version bump |
| `HANDOFF-v0.7.0-package-json.md` | Version bump |
| `HANDOFF-v0.7.0-roadmap.md` | Tier promotion; carried commit block |
| `HANDOFF-v0.7.1-index-js-hotfix.md` | Syntax-error fix (crash) |
| `HANDOFF-v0.7.2-index-js-hotfix.md` | `formatResult` payload-key fix (silent data loss) |

### Process Note
Session 008's log entry was misnumbered "Session 004" by the handoff that wrote it, authored without checking the log's live state. Corrected to Session 008 at apply time — low risk since it's a log entry, not code or a protocol doc. Going forward, any handoff appending a session-log entry should confirm the next session number against the live file at apply time rather than hardcoding it. Applied in practice for this entry.

### Open Items Carried Forward
- Two throwaway test participants (`Test SmokeTestSeller` / `Test SmokeTestTC`, IDs 2585318 / 2585319, contacts 2396057 / 2396058) left on `1 POC Lane` — remove in the UI if the file should stay a clean sandbox.
- `f_EarnestMoney` / `f_Financing` on `1 POC Lane` overwritten by the smoke test (`$6,500` / `Cash`) — reset if prior values mattered.
- Single-entity `add_transaction_participant` still doesn't expose `categories`, unlike `create_contact` and the new bulk tool.
- Deployed version string still reports `0.7.0` despite two undeployed-version-bump hotfixes on top — cosmetic drift.

### Key References
- Railway connector URL: `https://aframe-mcp-connector-production.up.railway.app/mcp`
- Test file: `1 POC Lane`, `xactionId 551669`
- Batch tools design doc: `BATCH-TOOLS-DESIGN-001`

---

## Session 010 — Lennar Doc Cleanup + Live Taxid Migration Test
**Date:** August 11, 2026

### Focus
Clean up accumulated documentation debt across the three Lennar docs (Protocol, Payload Schema, Community Reference DB) and confirm several long-open items via live testing on an incoming Creekside Run TH listing.

### What Was Accomplished
- Multi-rep intake model documented — Megan Cook confirmed as a regional director, not a day-to-day submission funnel; Primary Contact and "How a New Listing Arrives" rewritten accordingly. NHC (New Home Consultant) terminology noted.
- Cognito form identities confirmed via direct API lookup: current form is ID 17 (`LennarNewListingIntake`), legacy is ID 16 (`ZapierFormForLennarOLD`). New standing rule: when Form 17 is the source, sessions pull the entry directly from Cognito rather than parsing the flattened email notification.
- Full Cognito Form 17 → CVRMLS crosswalk built and documented (Appl/Equip, Interior, Flooring, Siding, Exterior, Style for SF, Unit Placement for TH) — resolves the long-standing "Range" appliance ambiguity and the SF Style guessing problem.
- Siding and Flooring corrected from pure Lennar-wide statics to payload-driven fields with a stated default (Vinyl/LVP) — confirms a decision Session 007 had already made but never applied to the doc.
- Creekside Run TH migrated from `new` to `taxid` path — tax records confirmed populated; first live taxid pull outside Chesterfield County (Richmond City), County/City cascade confirmed working the same as Chesterfield.
- MLS Area codes documented for the first time for all 5 active communities (previously untracked anywhere): Harpers Mill 54, Creekside Run 60, Everstone 42, Watermark 54.
- Creekside Run Fee Includes resolved (Comm Ar Mnt, Common Area, Snow Removal) and capital contribution confirmed flowing into Add'l Fee Desc — second community confirmed after Harpers Mill TH.
- Wynwood at Fox Creek marked retired (sold out, no further listings expected) across all three docs.
- Features A/B launchers marked Tested in the Protocol's launcher table (three clean Lennar taxid runs).
- Step 10 (Send the Listing Addendum) annotated with current operational status — PandaDoc build retained in full as documented target state, but addenda are sent manually via TransactionDesk until the paid tier is reactivated (free trial ended, not a priority at current volume).
- Stale "General Info Tax ID patch" item removed from Planned Automations — confirmed working across multiple live sessions.
- A new Creekside Run TH listing (6039 Blue Iris Rd) came in mid-session and was used as the live test case for several of the above — taxid migration, County/City cascade, Fee Includes, and the Stove/Range appliance mapping were all confirmed against it. Listing details not logged here beyond that.

### Decisions Made
- Reps submit new listings directly going forward; there is no single funnel contact. POC on the Session Data tab should be the actual submitting rep, confirmed per intake thread, not a default name.
- PandaDoc remains the documented target state for addendum signing but is on hold — TransactionDesk (manual) is the current method until the paid tier is activated.
- Vinyl siding and LVP flooring remain the correct Lennar defaults when a listing doesn't specify otherwise, but are no longer treated as universal facts — real per-listing variation exists and is now payload-driven.

### Documents Updated

| Document | Version | File |
|---|---|---|
| Lennar New Listing Protocol | 2.6 → 2.7 | `docs/lennar/Lennar_New_Listing_Protocol.md` |
| Lennar Payload Schema | 1.2 → 1.3 | `docs/lennar/Lennar_Payload_Schema.md` |
| Lennar Community Reference Database | 1.1 → 1.2 | `docs/lennar/Lennar_Community_Reference_Database.md` |

### Cursor Handoffs Produced

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-08-11-lennar-new-listing-protocol.md` | Multi-rep intake model, Cognito-direct-pull rule, Creekside taxid migration, Wynwood retirement, Features A/B tested, PandaDoc hold status (v2.7) |
| `HANDOFF-2026-08-11-lennar-payload-schema.md` | Creekside taxid migration, Cognito Form 17 features crosswalk, Siding/Flooring corrected to payload-driven (v1.3) |
| `HANDOFF-2026-08-11-lennar-community-reference-database.md` | MLS Area codes for all active communities, Creekside Fee Includes resolved, Wynwood retired (v1.2) |
| `HANDOFF-2026-08-11-session-log-v2.md` | This entry |

### Discrepancies Surfaced (Not Fixed This Session)
- **Zapier → Google Sheets connection is still broken as of session end — a full reauth did not fix it.** The connection showed `is_stale: false` throughout even while every call failed with "Authorization access_token missing for Google Sheets." Andrew reauthenticated mid-session (confirmed via a fresh `last_refreshed_at` timestamp), but the identical error recurred on every retry afterward. This points to the OAuth grant itself not including Sheets scope, not a stale-token issue — a plain reconnect click is unlikely to fix it next time either. Needs real investigation, not another retry.
- **Session 007 (July 24) contains decisions not yet fully reconciled into this session's Payload Schema update:** Auto Door Opener should be a static whenever Garage = Yes (not confirmed per-listing); Dishwasher/Microwave/Refrigerator/Washer/Dryer were decided as genuine Lennar-wide statics, not purely form-driven selections — today's new §5.4.1 documents all 12 Appl/Equip options as form-driven with no baseline, which is incomplete against that decision. Not fixed this session.
- **Payload Schema §6 still incorrectly claims** the Heating/Pool/Amenities community lookup table lives in the Community Reference DB. It doesn't — confirmed still only in §5.2 of the Payload Schema itself. Flagged in Session 007, still open.
- **Style field's "Custom" option** — flagged in Session 007 as needing confirmation against Andrew's stated Ranch/2 Story-only rule for Single Family. Still present in the live form as of this session, still unresolved.

### Open Verification Items (Carried Forward)
- Sales rep roster by community — still a stub.
- Fawncrest — still not an active community in the Community DB; no data added.
- `fee.addl_fee_desc` scope — now confirmed for 2 of 5 communities (Harpers Mill TH, Creekside Run); Harpers Mill SF, Everstone, and Watermark remain unconfirmed.
- Harpers Mill SF Fee Includes — still pending, no SF example sheet yet.
- Session Data tab row for the live-test listing — still blocked on the Zapier → Google Sheets connection (see Discrepancies above); not written this session.
- Auto Door Opener + Appl/Equip static promotion reconciliation (see Discrepancies above) — carried forward from Session 007, still open.

### Key References
- `Lennar_New_Listing_Protocol.md` v2.7
- `Lennar_Payload_Schema.md` v1.3
- `Lennar_Community_Reference_Database.md` v1.2
- Cognito Form 17 (`LennarNewListingIntake`) / Form 16 (`ZapierFormForLennarOLD`)

---

## Session 011 — Airtable Adoption for Lennar Listings + Community Reference Data
**Date:** August 14, 2026

### Focus
Replace the unreliable Zapier/Google Sheets connector with a direct Airtable connector for internal Lennar tracking. Migrate the Session Data tab and Community Reference Database into Airtable tables, lock down the division of authority between Airtable and the Google Sheet, and update all three governing docs to match.

### What Was Accomplished
- Diagnosed the Zapier Google Sheets connector: the connection itself was live and metadata/simple reads worked, but its higher-level "search" actions (`get_data_range`, `get_many_rows`) returned silently empty results on the Session Data tab despite real data being present — worked around via a raw Sheets API passthrough (`_zap_raw_request`) rather than trusting the abstracted read actions.
- Evaluated alternatives to Zapier/GS given its metered monthly call-quota model: Claude artifact + persistent storage, Google Drive (ruled out — no in-place file-update tool), Supabase (ruled out — only a read-only log-query tool available in this environment, no table CRUD), Smartsheet, Airtable. Selected Airtable — native (non-Zapier) connector, free tier fits current scale, no per-call metered billing.
- Connected Airtable; verified connection (`ping`, `list_bases`) with create-level permission.
- Created the `Lennar Listings` table; migrated 7 rows from the Session Data tab (recovered via raw Sheets API after Zapier's abstracted reads falsely returned empty).
- Cross-checked those 7 rows against the Google Sheet main tab — found and corrected real drift (price reductions, status advances). Corrected an earlier miscount of the main tab's row count (91 real listings, not the sheet's allocated-grid "194"). Added `Current Price` / `Closing Date` / `Price Change Date` fields. Corrected `MLS Input Stage` to Done for all 7 (Active/Pending listings can't have incomplete MLS input by definition).
- Investigated a same-day MLS withdrawal request via Gmail (Izaiah Clark / Bret Williams threads) — confirmed the 7 actually-withdrawn addresses (Everstone + Creekside), confirmed none overlapped with the 7 Airtable listings.
- Created the `Community Reference DB` table; migrated all 5 active communities plus retired Wynwood verbatim from `Lennar_Community_Reference_Database.md` (Fawncrest intentionally omitted — parked, not active, per standing instruction). Added structured verification-status fields (`Fee Includes Verification`, `Addl Fee Desc Confirmed`) that turn previously prose-buried hedge language into a filterable status.
- Locked down the Airtable/Google Sheet division of authority: Airtable is source of truth for every table going forward; the Listings table is the sole exception — its `Status`/`Current Price`/`Closing Date`/`Price Change Date` fields remain Google-Sheet-authoritative, refreshed into Airtable at new-listing intake via an MLS#-matched delta sync (bounds drift to "since the last new listing" rather than indefinite).
- Produced 3 Cursor handoffs updating `Lennar_New_Listing_Protocol.md` (v2.8), `Lennar_Payload_Schema.md` (v1.4), and `Lennar_Community_Reference_Database.md` (v1.3) to reflect the new workflow. Fixed the Session 007 §6 doc-pointer bug (open 3 weeks) as part of the Payload Schema update — it had claimed Features B community fields (heating, heat fuel, pool, amenities) lived in the Community Reference Database file; they never did, they've only ever lived in the Payload Schema's own §5.2.

### Decisions Made
- Airtable is source of truth for internal Lennar Listings tracking and all community reference data — applied per-table, not as a blanket statement. The Listings table's Status/Price/Closing Date fields are the one deliberate exception, staying Google-Sheet-authoritative.
- Session Data tab formally deprecated — no longer a session write target.
- Google Sheet ↔ Airtable sync trigger fixed to new-listing intake (delta-check by MLS# against existing Airtable rows), not a fixed schedule or "whenever touched."
- `Lennar_Community_Reference_Database.md` superseded — kept only as historical record, not read at runtime.
- Zapier's abstracted Google Sheets read actions are not to be trusted blind going forward; the raw API passthrough is the documented fallback when a read looks suspiciously empty.

### Documents Created / Updated
| Document | Version | Notes |
|---|---|---|
| `Lennar_New_Listing_Protocol.md` | 2.7 → 2.8 | Airtable adoption throughout; Session Data tab deprecated; Airtable tool-call reference table added |
| `Lennar_Payload_Schema.md` | 1.3 → 1.4 | §6 doc-pointer bug fixed (Session 007, open 3 weeks); all Community DB file references retargeted to Airtable |
| `Lennar_Community_Reference_Database.md` | 1.2 → 1.3 | Superseded — supersession banner added, kept for history only |

### Cursor Handoffs Produced
| Handoff | Target File | Purpose |
|---|---|---|
| `HANDOFF-2026-08-14-lennar-new-listing-protocol.md` | `docs/lennar/Lennar_New_Listing_Protocol.md` | Airtable adoption (v2.8) |
| `HANDOFF-2026-08-14-lennar-payload-schema.md` | `docs/lennar/Lennar_Payload_Schema.md` | §6 doc-pointer fix + Airtable retarget (v1.4) |
| `HANDOFF-2026-08-14-lennar-community-reference-database.md` | `docs/lennar/Lennar_Community_Reference_Database.md` | Supersession banner (v1.3) |
| `HANDOFF-2026-08-14-session-log-v2-011.md` | `docs/project/Project_Session_Log_v2.md` | This entry |

### Discrepancies Surfaced (Not Fixed This Session)
- Heating/Heat Fuel/Pool/Community Amenities community data (Payload Schema §5.2) still not migrated to Airtable — natural next candidate, and directly relevant to the CVRMLS Matrix field migration planned for next session.
- Whether Protocol Step 6's "surface a proposed new row to Andrew for the Google Sheet main tab" behavior should be kept or dropped now that Airtable is the primary write target was not explicitly settled this session — preserved as-is out of caution rather than guessed away; flagged for confirmation.

### Open Verification Items (Carried Forward)
- Sales rep roster by community — still a stub (unchanged from Session 010).
- Style field "Custom" option — still unconfirmed against Andrew's Ranch/2 Story-only rule (unchanged from Session 007/010).
- `fee.addl_fee_desc` scope — still confirmed for only 2 of 5 communities (unchanged from Session 010); now visible as a filterable Airtable field (`Addl Fee Desc Confirmed`) rather than prose.
- Street Suffix stored values (`Input_37`) — still not extracted (unchanged, open since Session 017).
- `owner_info.html` `agent_related` — still not independently re-verified (unchanged).
- Harpers Mill SF Fee Includes — still pending, no SF example sheet (unchanged).
- Fee Includes Verification status for Everstone/Watermark — still "Interim Mapping - Verify at First Use" (unchanged; now a structured, filterable Airtable field instead of a parenthetical).

### Key References
- Airtable base ID: `app78fMUwDNBHUZ6r`
- Airtable Lennar Listings table ID: `tbllTArjNE464zFGi`
- Airtable Community Reference DB table ID: `tbleMbM1WgY8Si2t7`
- `Lennar_New_Listing_Protocol.md` v2.8
- `Lennar_Payload_Schema.md` v1.4
- `Lennar_Community_Reference_Database.md` v1.3 (superseded)

### Session Handoff Produced
- `SESSION-HANDOFF-2026-08-14-airtable-lockdown-and-cvrmls-migration.md` — bridge doc for next session (remaining Airtable-usage lockdown items, then CVRMLS Matrix field migration to Airtable)

---

## Session 012 — Addendum Closeout, Airtable Migration Completion, and New-Project Scoping
**Date:** August 16, 2026

### Focus
Close out every item from `SESSION-HANDOFF-2026-08-14-ADDENDUM-live-session-findings.md` (the 8712 Whitman Dr live-session findings); complete the Heating/Heat Fuel/Pool/Community Amenities → Airtable migration that session had flagged as still open; then a strategic discussion on spinning off a dedicated Lennar Listings Claude Project.

### What Was Accomplished
- Applied three Cursor handoffs closing every Addendum item: Form 17 "not yet live-tested" caveat removed (confirmed against Entry #4 / Izaiah Clark / 8712 Whitman Dr, MLS# 2622209); Protocol/Schema static-values contradiction fixed; Step 3 (Gmail label) made session-owned end to end; Step 5 showing-instructions agent-comments fallback scoped to legacy/email intake only, not Form 17; Step 6 rewritten from a formatted-row hand-off to a check-or-remind pattern, Step 12 checklist updated to match; Photo Notes fixed (stale Session Data tab reference) and gained a virtual-tour-pairing rule; `CURSOR-HANDOFF-PROTOCOL-001.md` gained a session-log-specific Add-pattern convention (this handoff is its first real use).
- Discovered the Airtable connector has no field-creation tool, despite the Protocol's own tool-reference table claiming `Airtable:create_field` exists. Confirmed via Airtable's public API docs that field creation is a real, documented endpoint (`POST /v0/meta/bases/{baseId}/tables/{tableId}/fields`) — just not exposed by this connector. Also checked whether Zapier offered a path around it; it doesn't cleanly (Airtable isn't currently Zapier-connected, and Zapier's built-in Airtable actions are record-level only). Andrew added 6 columns manually to Community Reference DB (Heating, Heating Fuel, Pool Y/N, Community Amenities, Community Amenities Codes — Pool Description intentionally omitted, see Decisions).
- Migrated Heating/Heat Fuel/Pool Y-N/Community Amenities into Airtable for all 5 communities. Resolved the previously-unlabeled Community Amenities code (`Input_534_47` = Pool) against `CVRMLS_Features_Field_Map.md`.
- Found and fixed a real naming drift while populating the data: Community Reference DB's `Community` field stored long-form names (`"Harpers Mill — Townhome"`) that matched neither the Payload Schema's `community` payload key convention nor the `Lennar Listings` table's short-form values (`"Harpers Mill TH"`) — a payload-driven lookup against this table would have silently matched nothing. Renamed all 5 records to the short `TH`/`SF` form.
- Regenerated the Payload Schema handoff mid-session to fold the completed migration into §5.2/§6 directly, rather than layering a second patch on top of a not-yet-applied draft.
- Confirmed a real project-knowledge drift firsthand: this project's copy of `Lennar_Payload_Schema.md` still showed v1.4 after Cursor had already applied and pushed v1.5 — traced to the docs being manually uploaded into this project rather than connected via Claude's real GitHub sync integration. Andrew provided the live v1.5 file directly to unblock the session.
- Scoped (but did not execute) the previously-flagged Payload Schema "trim pass." Concluded, after discussion, that the doc does not need trimming — Version History in particular stays intact, since it's the only place doc-evolution reasoning survives once a session isn't searchable. Only the archaeology sections (§7.2/7.3, Retirement Notes) and the duplicate §8 hand-authored examples remain a live, low-priority question.
- Extended into a broader strategic discussion: spinning off a dedicated "Lennar Listings" Claude Project, scoped to one session per listing, separate from this AAR-TC refinement project. Researched and confirmed: claude.ai connectors are account-wide, not project-scoped, so nothing needs reconnecting in a new project; conversation history does not carry across projects (project-scoped search); Claude's GitHub integration syncs full file contents (not just references) on a manual "Sync now" trigger — not automatically on push. This project isn't currently using that integration, which is what caused the drift above.

### Decisions Made
- **Pool Description is a permanent derivation rule, not a stored fact.** Pool Y/N = Yes always means Community/Off Site, for every current and future Lennar community — confirmed explicitly by Andrew, not treated as a per-community inference. No Airtable column for it.
- **Step 6's Google Sheet hand-off changed.** Sessions now check the existing row for accuracy (if present) or give a plain reminder (if not), rather than preparing a fully formatted copy/paste block. Whether this same pattern should extend to the Price Adjustment / Under Contract / Closed lifecycle hand-offs was raised but not decided — only new-listing Step 6 changed this session.
- **Heating/Heat Fuel/Pool/Community Amenities migrates to Airtable now**, not deferred to a future Workstream 2 slice.
- **The Payload Schema trim pass is not happening.** Doc length and Version History detail are not being treated as a problem going forward.
- **A second Claude Project is likely**, for day-to-day Lennar listing processing (one session per listing), separate from this AAR-TC project — but not until after two prerequisites: the Chrome extension build, and a dedicated Opus-driven logic-gap audit of the whole Lennar process. Andrew is not abandoning this project; it remains the home for protocol refinement and cross-listing work.
- **New-project docs carry the "what/how," not the "why."** Doc-evolution narrative (Version History, rationale) stays this project's concern; a future operational project's per-listing sessions don't need it. A new custom Project Instructions doc (scope statement, session-start behavior, escalation rule, what NOT to do) is planned for the new project, distinct from the Protocol/Schema technical docs.
- **Andrew owns doc sync going forward** — both the Cursor→GitHub commit step and keeping Claude's project knowledge current after it.

### Documents Created / Updated

| Document | ID | Version | Change Summary |
|---|---|---|---|
| Lennar New Listing Protocol | AAR-TC-LENNAR-PROTO-001 | 2.8 → 2.9 | Form 17 live-test caveat closed; static-values contradiction fixed; Step 3 Gmail label session-owned; Step 5 Form 17 showing-instructions carveout; Step 6 rewritten (check-or-remind); Step 12 checklist updated; Photo Notes fixed + virtual-tour pairing rule; Systems & Reference updated for the completed Airtable migration and naming fix; stale `Airtable:create_field` tool reference corrected |
| Lennar Payload Schema | AAR-TC-LENNAR-PL-001 | 1.4 → 1.5 | `year_built` standing default added; §5.2 rewritten to point at Airtable (Heating/Heat Fuel/Pool Y-N/Community Amenities); Pool Description permanent derivation rule documented; Community Amenities code labels resolved; §6 rewritten as the single per-community pointer; Community field naming fix documented |
| CURSOR-HANDOFF-PROTOCOL-001 | CURSOR-HANDOFF-PROTOCOL-001 | 1.0 → 1.1 | Added the session-log-specific Add-pattern convention |
| Airtable — Community Reference DB | — | — | 6 new columns added (Heating, Heating Fuel, Pool Y/N, Community Amenities, Community Amenities Codes); all 5 communities populated; `Community` field values corrected from long-form to short `TH`/`SF` form |

### Cursor Handoffs Produced This Session

| Handoff | Target File | Purpose |
|---|---|---|
| `HANDOFF-2026-08-16-lennar-new-listing-protocol.md` | `docs/lennar/Lennar_New_Listing_Protocol.md` | v2.9 — Addendum closeout + completed Airtable migration + tool-reference fix |
| `HANDOFF-2026-08-16-lennar-payload-schema.md` | `docs/lennar/Lennar_Payload_Schema.md` | v1.5 — `year_built` default + §5.2/§6 rewrite for the completed Airtable migration |
| `HANDOFF-2026-08-16-cursor-handoff-protocol.md` | `docs/protocols/CURSOR-HANDOFF-PROTOCOL-001.md` | v1.1 — session-log Add-pattern convention; carried the commit for all three files |
| `HANDOFF-2026-08-16-session-log-v2.md` | `docs/project/Project_Session_Log_v2.md` | This entry — first real use of the new Add-pattern convention |

### Discrepancies Surfaced (Not Fixed This Session)
- **This project's Claude knowledge isn't connected via the real GitHub sync integration** — it's populated by manual upload, which is why it drifted stale after the last Cursor commit went uncaught for part of this session. Worth setting up the actual integration here, not just in a future new project.
- **The Airtable connector's tool set has no field-creation call**, despite the Protocol doc having claimed one existed. Corrected in the doc; the underlying gap remains — new Airtable columns still require Andrew to add them manually in the UI.

### Open Verification Items (Carried Forward)
- §7.1's three genuinely-open items (Street Suffix stored values, `addl_fee_desc` scope for 3 communities, Owner Info `agent_related` verification) — untouched this session.
- Whether to execute the small Payload Schema archaeology cut (§7.2/7.3, Retirement Notes) and the §8 duplicate-example consolidation — discussed, judged low-priority, not scheduled.
- Whether Step 6's check-or-remind pattern should extend to the Price Adjustment / Under Contract / Closed lifecycle hand-offs — raised, not resolved.

### Key References
- Live-run source: 8712 Whitman Dr, Harpers Mill TH, MLS# 2622209 (Entry #4, Izaiah Clark, NHC)
- Airtable — Community Reference DB table: `tbleMbM1WgY8Si2t7` (base `app78fMUwDNBHUZ6r`) — new fields: Heating (`fld2eN9Sd3HT40VQ0`), Heating Fuel (`fldFbPKK63zotNlsn`), Pool Y/N (`fldNhohc6bIO8fcGv`), Community Amenities (`fldhXs6muuMl0wbDv`), Community Amenities Codes (`fldkrsqOME2NjfLsm`)

### Session Handoff Produced
`SESSION-HANDOFF-2026-08-16-addendum-closeout-and-project-scoping.md` — bridge doc covering this session's closeout work and the new-project planning discussion, for whichever session picks up next (likely the Chrome extension build).

---

*Next session: Chrome extension build (bookmarklet set is now fully live-tested end to end, per the Form 17 confirmation this session — the blocking prerequisite is cleared). New-project migration and the Opus audit pass come after that, not before.*

---

## Session 013 — August 17, 2026 (Scoping) / Session 014 — August 18, 2026 (Build & Live Test)

### Session 013 Focus
Scope the Chrome extension build (POC vs. universal multi-MLS tool), update repo structure to house it, and close out the one genuinely new technical unknown blocking the build — tab detection — via a live Claude-in-Chrome session against Matrix.

### Session 013 — What Was Accomplished
- Extension scope decided: basic POC first (auto-detect the active Matrix tab, fill on click), not the full universal/multi-MLS tool from the roadmap. Clicking through tabs stays manual for now; full auto-navigation deliberately deferred.
- `extension/` added as a new top-level repo directory in `REPO_STRUCTURE.md`, sibling to `bookmarklets/`, `docs/`, `handoffs/`, `src/`.
- Build doc created as `extension/README.md`, then renamed to `extension/Lennar_Extension_Build.md` to match the repo's existing naming convention.
- Tab-detection fully extracted: candidate signature IDs pulled from the already-completed payload schema, live-tested for presence/absence across all 11 Lennar-scoped tabs, cross-checked against the full ~605-field Features map — zero `Input_N` collisions found anywhere in the system.
- Key findings: URL-based tab detection ruled out (Matrix uses one static, opaque `c=` state token, byte-identical across every tab); Matrix does a full page reload on every tab click, so a content script re-injects fresh automatically with no polling/MutationObserver needed; Features confirmed as one physical Matrix tab, not two — the `features_a`/`features_b` split was a build-organization choice never recombined, confirmed by `Input_70` and `Input_571` both present together on the same page; `CVRMLS_Bookmarklet_Build.md`'s stale Phase 4 "auto-detects via URL or DOM signature" claim corrected.

### Session 013 — Decisions Made
- Full auto-navigation and eliminating the manual payload paste both deliberately deferred post-MVP — captured in `extension/Lennar_Extension_Build.md`'s Future Considerations so they aren't lost.

### Session 013 — Documents Created / Updated
| Document | Change |
|---|---|
| `extension/Lennar_Extension_Build.md` | Created — canonical copy of tab-detection signatures, architectural findings, Future Considerations |
| `REPO_STRUCTURE.md` | `extension/` directory added |
| `CVRMLS_Bookmarklet_Build.md` | Phase 4 roadmap corrected |

### Session 013 — Open Verification Items (Carried Forward)
- Whether to hand Cursor the full POC build spec in one shot, or start narrower (detection only, then layer in fill logic) — left as the explicit open decision for the build session. Resolved in Session 014 below.

### Session 013 — Key References
Confirmed detection signatures (11 tabs): Listing Info `Input_29`, Bath Info `Input_57`, Features `Input_70`/`Input_571`, General Info `Input_94`, Remarks `Input_107`, Fee Info `Input_109`, Owner Info `Input_118`, Agent/Office Info `Input_163`, Showing Instructions `Input_136`, Virtual Tour Info `Input_610`, Internet Display Info `Input_227`.

### Session 013 — Session Handoff Produced
`SESSION-HANDOFF-2026-08-17-extension-poc-scoping-and-tab-detection.md` — bridge doc for the build session. This log entry was backfilled during Session 014 after being missed at the time.

---

### Session 014 Focus
Resolve the one-shot-vs-Cursor build-ownership question, author and execute two Cursor handoffs (initial popup-based POC, then a side-panel rebuild after live testing surfaced a workflow defect), and complete live field-level verification in Matrix.

### Session 014 — What Was Accomplished
- Decided extension code generation happens via Cursor — direct repo access, same-tier model reasoning (Sonnet 5 High in both surfaces), no chat-token cost — while design judgment (architecture, field-write logic, exact commit messages) stays in the authoring Claude session per `CURSOR-HANDOFF-PROTOCOL-001`'s core principle. Explicit, reasoned deviations from the protocol were flagged inline in both handoffs rather than applied silently: multiple new interdependent files bundled into one handoff (splitting them would let one land without the others and break silently), and Features fill logic delegated to Cursor reading the live bookmarklet files directly rather than pre-written in-session.
- `HANDOFF-2026-08-17-extension-poc-build.md` authored and executed: created `extension/manifest.json`, `content.js` (10 of 11 tabs ported verbatim from `CVRMLS_Bookmarklet_Source.md` v0.6, uploaded this session; Features left as a sourced stub), `popup.html`, `popup.js`. Confirmed via the Session 021 `lennar_features.html` retirement record that Features routes universally through `features_a.html`/`features_b.html` for every builder including Lennar — closing an ambiguity before Cursor executed rather than leaving it in the handoff.
- Cursor ported `fillFeaturesA`/`fillFeaturesB` directly from the live `bookmarklets/features_a.html`/`features_b.html` files and verified the port programmatically — diffed every checkbox-group array and scalar field against the deployed source; 18 groups + 9 scalars (Features A) and 16 groups + 6 scalars (Features B) confirmed byte-for-byte, in order, against the same payload keys.
- Live testing surfaced a real workflow defect in the popup architecture: Matrix's full-page-reload-per-tab-click closes Chrome popups, wiping the pasted payload on every tab switch — worse than the bookmarklets it was meant to replace.
- `HANDOFF-2026-08-18-extension-sidepanel-conversion.md` authored and executed: converted popup → `chrome.sidePanel` architecture (persists across Matrix's per-tab reload, confirmed via 2026 Chrome docs — `openPanelOnActionClick` is set at runtime via `background.js`, not a manifest field). Added an auto-fill/manual-confirm toggle, a per-tab status list (unvisited/pending/filled/error), and field-write logging (`__writeLog`) so a detection miss, a messaging miss, and a field-write miss each surface distinctly instead of all looking like silent success. `content.js`'s existing fill functions and `TAB_SIGNATURES` table confirmed unchanged via `git diff` — exactly one line appended.
- Live end-to-end testing by Andrew confirmed: side-panel persistence fixed (payload survives tab switches without re-pasting), manual fill works, auto-fill works, Features tab exercised live.
- One live-test finding surfaced and triaged, not yet resolved: a General Info fill on a taxid-path test listing reported `Input_102_POTCLZ` as a missing field. Confirmed not a transcription error — the ported code is byte-identical to the pre-existing disclosures-checkbox uncheck loop in `CVRMLS_Bookmarklet_Source.md`, which always attempts all 12 IDs on every fill regardless of payload content. Root cause undetermined — possibly a stale field ID never previously surfaced (bookmarklets never logged write failures, so this may be the first time anyone's actually seen it fail), possibly a conditionally-rendered checkbox, possibly path-specific (taxid vs. new). Parked per Andrew's direction; live DOM inspection is the agreed next step, not a payload check.

### Session 014 — Decisions Made
- This project's Cursor handoffs may bundle multiple new, interdependent files into a single handoff document when splitting them would let one land without the others and break silently — an explicit, reasoned deviation from `CURSOR-HANDOFF-PROTOCOL-001`'s "one file per handoff" principle for net-new multi-file builds specifically, not a general relaxation of it for surgical edits.
- Handoffs authoring a genuinely new (not surgical-edit) build should open with a plain-English "What This Is / Why It Exists" section, beyond the protocol's existing per-change "what and why" requirement. Surfaced when Andrew pointed out the first extension handoff gave Cursor mechanism (an Architecture section) without ever stating the extension's actual purpose. Applied to the second handoff; worth carrying forward as a standing addition to `CURSOR-HANDOFF-PROTOCOL-001` for future generative handoffs — not yet made to the protocol doc itself this session.
- **`handoffs/incoming/` vs. flat `handoffs/` discrepancy identified and explained**, not just noted as unknown: `REPO_STRUCTURE.md` (updated 2026-08-17) documents `handoffs/applied/` and `handoffs/incoming/` subfolders; `CURSOR-HANDOFF-PROTOCOL-001` v1.1 (updated 2026-08-16, one day earlier) still describes a flat `handoffs/` with a plain `git rm`. The first extension handoff used the `incoming/` path per `REPO_STRUCTURE.md`; Cursor found the file untracked regardless of path and deleted it directly with no functional issue. The protocol doc itself was not updated to match this session — flagged below as carried-forward work.

### Session 014 — Documents Created / Updated
| Document | Change |
|---|---|
| `extension/manifest.json` | Created (v0.1.0) — popup + static content script; replaced (v0.2.0) — side panel + background worker |
| `extension/content.js` | Created (10/11 tabs ported + Features stub); Cursor-ported Features live and diff-verified; one line appended (`TAB_DETECTED` announce-on-load) |
| `extension/popup.html`, `extension/popup.js` | Created, then deleted (superseded by side panel) |
| `extension/background.js` | Created — registers `openPanelOnActionClick` |
| `extension/sidepanel.html`, `extension/sidepanel.js` | Created — payload/toggle persistence, per-tab status list, auto-fill/manual-confirm logic |

### Session 014 — Cursor Handoffs Produced This Session
| Handoff | Target | Purpose |
|---|---|---|
| `HANDOFF-2026-08-17-extension-poc-build.md` | `extension/manifest.json`, `content.js`, `popup.html`, `popup.js` | Initial POC build — 10/11 tabs ported verbatim; Features stub sourced to live bookmarklet files |
| `HANDOFF-2026-08-18-extension-sidepanel-conversion.md` | `extension/manifest.json`, `content.js`, `background.js` (new), `sidepanel.html`/`sidepanel.js` (new), `popup.html`/`popup.js` (deleted) | Popup → side panel conversion after live-test payload-loss defect found; commit `828c4e6` |
| `HANDOFF-2026-08-18-session-log-v2-013-014.md` | `docs/project/Project_Session_Log_v2.md` | This entry |

### Session 014 — Discrepancies Surfaced (Not Fixed This Session)
- `Input_102_POTCLZ` (General Info disclosures group) reported missing on a live taxid-path test — not yet root-caused; live DOM inspection needed before treating it as a bug in either direction.
- `handoffs/incoming/` vs. `CURSOR-HANDOFF-PROTOCOL-001`'s flat `handoffs/` — root cause identified (see Decisions Made above) but the protocol doc itself was not updated to match `REPO_STRUCTURE.md` this session.
- "What This Is / Why It Exists" framing addition to generative handoffs — applied ad hoc this session, not yet written back into `CURSOR-HANDOFF-PROTOCOL-001` as a standing rule.

### Session 014 — Open Verification Items (Carried Forward)
- `Input_102_POTCLZ` — pending Andrew's live DOM inspection of the corresponding checkbox on the General Info tab.
- Whether the taxid path specifically (vs. new-construction path) affects the POTCLZ result — untested variable, flagged by Andrew, not yet isolated.
- Per-tab status persistence across side-panel close/reopen — deliberately left in-memory-only this session as a known, stated limitation; not yet requested as a follow-up.
- A full end-to-end run on a single real listing, tab to tab — spot-checks and individual-tab tests done; no complete single-listing pass yet.

### Session 014 — Key References
- `extension/manifest.json` v0.2.0
- `extension/content.js` — 10/11 tabs live-verified; Features ported and diff-verified against live source
- Live test listing: taxid path, General Info tab (POTCLZ finding)
- Cursor commit: side panel conversion `828c4e6` on `origin/main`

### Session 014 — Session Handoff Produced
`SESSION-HANDOFF-2026-08-18-extension-sidepanel-and-live-testing.md` — bridge doc for the next session (POTCLZ investigation, full end-to-end listing run, and the two carried-forward protocol-doc updates).

---

*Next session: Live DOM inspection of `Input_102_POTCLZ` on the General Info tab — check whether the real field ID differs from the ported one, or whether the checkbox is conditionally rendered. Then a full tab-to-tab run on one real listing before calling the POC validated end to end.*

---

## Session 015 — August 19, 2026
*Model: Claude Opus 4.7 Extra*

### Session 015 Focus
Design and execute the standup of a new operational Lennar Claude project — analysis of which docs belong there, what needs rewriting, what stays here, and what retires. Then produce the doc set and land it in a new `docs/operational/lennar/` folder.

### Session 015 — What Was Accomplished
- Established framing: **authoring project** (this one — architects, refines, extends the workflow) vs. **operational project** (new — executes listing work). The operational project runs one Claude session per listing lifecycle (intake through close), uses Airtable as source of truth for listing state, Cognito Form 17 as intake, and the Chrome extension as the fill mechanism.
- Walked all eight docs in the current Lennar doc set for disposition. Outcome: three come along (rewritten or trimmed), one splits out into a new companion doc, one is retired outright, three do not come along at all.
- **Ambiguity rule calibrated for operational scope** — the authoring project's stricter "Surface Ambiguity, Don't Guess" rewritten as "Work Within Documented Patterns, Surface Real Ambiguity." Derive and proceed when the derivation is one step and grounded in the docs; surface when the situation is genuinely novel, contradicted between sources, or unresolved. Concrete examples worked through with Andrew during the design.
- **Escalation channel designed** as a first-class standing rule — Issue Reports produced as downloadable markdown artifacts (`ISSUE-YYYY-MM-DD-<slug>.md`), enumerated category set, one file per issue not one per session, session flags to Andrew first before generating. Delivery via artifact so Andrew can drop into this project's incoming queue without file-system infrastructure.
- **Architectural insight surfaced mid-design:** the workflow is builder-shaped, not agent-shaped. Andrew's business grows top-down from the agent-builder pairing (agent brings builder work, builder defines the workflow). This resolved the agent-profile-doc question — Gary is invisible to the operational project because Matrix handles agent info at the account level; agent info doesn't need to be a schema static or a profile doc entry.
- **Repo structure decision:** new folder `docs/operational/lennar/` sibling to `docs/lennar/`. `Lennar_` filename prefix retained for future multi-builder disambiguation. Once the operational set stands up, authoring project edits target `docs/operational/lennar/` directly — `docs/lennar/` freezes as historical reference. Future builders come operational-first (no dual-set) using Lennar as the reference implementation.
- **Three new docs authored as artifacts in session:** `Lennar_Project_Protocol.md` (283 lines — the overarching operational protocol, Model 2 architecture with thin project instructions and the doc carrying the weight), `Lennar_Extension_Reference.md` (105 lines — session-oriented extension reference, distinct from the authoring `extension/Lennar_Extension_Build.md`), and (via handoff) `Lennar_Payload_Examples.md` (327 lines split from the schema §8).
- **Two Cursor handoffs executed** to land the operational doc set — Part 1 (folder creation + two verbatim commits + `REPO_STRUCTURE.md` update, commit `8c9ec1f`) and Part 2 (New Listing Protocol rewrite + Schema trim + Examples split, commit `d11072a`). Part 2 was substantial editorial work; Cursor executed carefully, flagged genuine judgment calls and spec conflicts rather than resolving silently, made improvements on the spec in several places worth acknowledging (unified merged steps, kept trimmed connector quirks against strict trim-to-bone because silent-failure runtime mechanics are operationally live). The New Listing Protocol came down from 717 lines to 311; the Schema from 1053 to 630 with the 327-line examples doc split out. Zero references to Aframe, bookmarklets, or the strip-list forbidden refs in the operational docs.
- **Project-level instructions drafted** for the new Claude.ai project (Model 2 — thin identity/load/posture layer, Project Protocol doc as the authority). Andrew holds these to paste into the new project after the pre-split closeout items are handled.
- **Deliberately parked mid-session:** the Airtable Community DB gaining Subdivision and Post Office fields — Andrew confirmed the Airtable side is done, but propagating to schema (add as community-lookup fields) and extension (`content.js` `fillListingInfo()` writes) requires real work in a subsequent session. Docs describe current reality, not target state, until propagation lands.

### Session 015 — Decisions Made
- **Operational project scope-bound:** executes, doesn't fix. Findings that indicate doc/schema/extension/protocol issues become Issue Reports, filed back to this authoring project as input for the next authoring session.
- **One session per listing lifecycle** in the operational project (intake through close), not one session per lifecycle event. Front-loaded work at intake; intermittent Resume Beats when rep emails announce lifecycle events (Pending, Closed, price change).
- **Airtable is source of truth** for listing state and community data. No session log in the operational project — the Airtable row IS the record. Session memory is not durable; Airtable is.
- **Issue Report system** as the single escalation channel back to this authoring project. Artifact-delivered markdown, categorized (Field ID | Doc Gap | Protocol Conflict | Community DB | Tool Failure | Extension Behavior | Other), severity session-set with Medium default and Andrew-overrideable, one file per issue.
- **No named session types** in the operational project — the work in front of the session makes its shape obvious. Deliberate anti-rigidity choice to avoid mode-switching decisions that don't need to exist.
- **Community DB markdown does not come along** to the operational project — Airtable is authority, markdown stays in authoring project as fallback if Airtable is unavailable.
- **Payload Envelope doc does not come along** — envelope contract folded into schema §2, with a note that the extension also reads the envelope at runtime.
- **Agent Profiles doc does not come along** — Gary is invisible per the Matrix account model; future multi-agent scale would come via agent-as-static-in-per-builder-workflow, not via cross-cutting profile docs.
- **CVRMLS layer docs do not come along** — Lennar schema is self-sufficient for operational use.
- **MLS DataSheet Template retired outright** — was pre-Cognito, pre-extension scaffolding for a workflow that no longer exists.
- **Reverse Prospecting sheet requests in scope** for the operational project (as part of what Andrew handles ad hoc); formal protocol doc for the procedure is a stubbed future addition.
- **Extension is builder-agnostic by architecture, Lennar-scoped by payloads received.** Forward-compatible language kept in the operational Extension Reference for eventual expansion.
- **Andrew's Matrix accountability made explicit in Project Protocol §2.1:** price adjustments and status changes require Andrew to enter Matrix directly, not just record in Airtable/Sheet. Sessions coordinate; Matrix-side execution is Andrew's for those specific events.

### Session 015 — Documents Created / Updated
| Document | Change |
|---|---|
| `docs/operational/lennar/Lennar_Project_Protocol.md` | Created (net new) — v1.0, 283 lines |
| `docs/operational/lennar/Lennar_Extension_Reference.md` | Created (net new) — v1.0, 105 lines |
| `docs/operational/lennar/Lennar_New_Listing_Protocol.md` | Created (rewrite of `docs/lennar/` v2.9) — v1.0, 311 lines |
| `docs/operational/lennar/Lennar_Payload_Schema.md` | Created (trim of `docs/lennar/` v1.5) — v1.0, 630 lines |
| `docs/operational/lennar/Lennar_Payload_Examples.md` | Created (split from Schema §8) — v1.0, 327 lines |
| `REPO_STRUCTURE.md` | Added `docs/operational/` entry |
| `docs/lennar/*` | **Unmodified** — frozen as historical reference per new convention |

### Session 015 — Open Verification Items (Carried Forward)

**Pre-operational-standup closeout items (block seeding the new project):**
- `Input_102_POTCLZ` — live DOM inspection to confirm actual field ID (also carried from Aug 18 handoff)
- `owner.agent_related` — verify `extension/content.js` reads the canonical payload key, not the legacy `owner.agent_related_to_seller`

**Parked mid-session, needs full authoring pass:**
- Subdivision and Post Office propagation — Airtable Community DB fields exist; schema needs to add both as community-lookup fields (currently marked always-manual per Session 021 exclusion); `extension/content.js` `fillListingInfo()` needs to write them. Andrew to grab Input IDs from Matrix DOM before the schema/extension work.

**Small doc-fixes surfaced by Cursor's post-execution report on Part 2:**
- Update `docs/operational/lennar/Lennar_Project_Protocol.md` §6.3 with Airtable Listings table ID `tbllTArjNE464zFGi` — Cursor carried the real ID forward into the New Listing Protocol, but Project Protocol §6.3 still says TBD (Project Protocol was frozen at Part 1 landing so Cursor couldn't reconcile).
- Update `docs/operational/lennar/Lennar_Project_Protocol.md` §5.3's "(Step 13)" reference — stripping Aframe renumbered the Active Listing Email step to Step 11, and the reference is stronger as "the Active Listing Email step" without a specific number.
- Decide Step 8's Google Sheet main tab hyperlink target — previously pointed at the retired data sheet; needs a replacement (candidates: property Drive folder, Matrix listing preview URL, drop the hyperlink pattern) or explicit removal. Cursor left as flagged open item rather than guessing.

**Older carry-forwards still open:**
- `CURSOR-HANDOFF-PROTOCOL-001` reconciliation (flat vs. `handoffs/incoming/` + `handoffs/applied/` split, per Aug 18 §6)
- `CURSOR-HANDOFF-PROTOCOL-001` standing addition of "What This Is / Why It Exists" for generative handoffs (per Aug 18 §6, applied ad hoc to all three handoffs this session)
- `extension/Lennar_Extension_Build.md` update to reflect the built POC, side-panel architecture, Features port method, `Input_102_POTCLZ` open item (per Aug 18 §7)

**Watch-list from Cursor's execution:**
- CVRMLS Features option-code carrying — if operational sessions hit unmapped community values often, the authoring project may want the code tables (heating, heat fuel, parking, porch, fireplace) carried into the operational schema. Cursor's current approach: use documented codes, Issue Report unmapped values. Will surface as an Issue Report pattern if it becomes a friction point.

### Session 015 — Key References
- New folder: `docs/operational/lennar/` (sibling to `docs/lennar/`)
- Five operational docs: `Lennar_Project_Protocol.md`, `Lennar_New_Listing_Protocol.md`, `Lennar_Payload_Schema.md`, `Lennar_Payload_Examples.md`, `Lennar_Extension_Reference.md`
- Part 1 commit: `8c9ec1f`
- Part 2 commit: `d11072a`
- Frozen authoring source (post-session): `docs/lennar/*`

### Session 015 — Session Handoff Produced
No traditional forward-looking session handoff. The session's output is the operational doc set itself plus this log entry. Cursor handoffs produced this session:

| Handoff | Purpose | Commit |
|---|---|---|
| `HANDOFF-2026-08-19-operational-folder-standup.md` | Part 1 — folder creation, two verbatim commits, `REPO_STRUCTURE.md` update | `8c9ec1f` |
| `HANDOFF-2026-08-19-operational-doc-set-rewrite.md` | Part 2 — New Listing Protocol rewrite, Schema trim, Examples split | `d11072a` |
| `HANDOFF-2026-08-19-session-log-015.md` | This log entry | (this handoff) |

Next authoring session in this project should close the two pre-split items (`Input_102_POTCLZ`, `owner.agent_related`) and tackle the parked Subdivision/Post Office propagation before Andrew seeds the operational Claude project with the five operational docs.

---

## Session 016 — Operational Preseed Closeout + Aframe Live Exploration
**Date:** August 20, 2026

### Focus
Two operational threads and one architectural discussion. First: close out the pre-standup items blocking the seeding of the new operational Lennar Claude.ai project — silent-write fixes in the extension and CVRMLS source, always-manual list corrections, small doc-fixes from Session 015's post-execution report. Second: live exploration of the Aframe connector against the 1 POC Lane test file, confirming API behavior around task materialization. Third: an extended philosophical discussion about the shape of AI-assisted TC work and where the harness discipline built for Lennar can and cannot transfer.

### What Was Accomplished

**Wave 3 operational preseed closeout — consolidated Cursor handoff drafted.**

Six files, eleven surgical change blocks, single commit. Bundles two silent-write fixes (POTCLZ → APCZ in the disclosures array; `agent_related_to_seller` → `agent_related` canonical key alignment) across both the extension and the CVRMLS source doc, plus the always-manual list corrections across all three docs that reference it (Payload Schema §4.1, Project Protocol §2.2, Extension Reference §5), plus three small doc-fixes surfaced in Session 015's post-execution report (Airtable Listings table ID in Project Protocol §6.3, unnumber "Step 13" reference in §5.3, resolve Step 6 Column A hyperlink open item), plus a Directions community-static future-use stub note in Payload Schema §4.1 and a paired simplification of the New Listing Protocol Step 11 stub. Handoff explicitly notes its own multi-file bundling as a deliberate exception to the one-file-per-handoff rule, at Andrew's direction.

**POTCLZ → APCZ hypothesis confirmed via live DOM inspection.**

Live inspection on a new-path Matrix listing (existing listing with data loaded, General Info tab) returned 12 `Input_102_*` elements matching the field map exactly: 5 disclosures + 3 AICUZ zones (including `APCZ`) + 4 AICUZ noise levels. `Input_102_POTCLZ` confirmed absent. The stale ID in the extension's disclosures array was surfacing in the write log on every General Info fill since Session 014's write logging landed; runtime impact was ~zero (no-op on a null element) but the noise obscured other real field-write failures.

**`owner.agent_related` canonical drift confirmed in extension source.**

Extension `content.js` line 259 reads `d.agent_related_to_seller` (legacy Lennar Customization key); schema canonical is `owner.agent_related`. Silent-write bug — payloads emitting the canonical key hit the `|| "0"` fallback. Happens to match the Lennar static default (always No), so no visible defect on Lennar; would silently miscategorize on non-Lennar dynamic use. Same drift exists in `CVRMLS_Bookmarklet_Source.md` (the extension's port origin); Wave 3 handoff fixes both.

**Data-integrity finding on 8600 Clemet Dr.**

MLS listing sheet uploaded during Wave 2 investigation showed `Agt Related to Seller: Yes` on a Lennar listing where the standard is always No. Not a bug the Wave 3 handoff causes or fixes — a data-entry issue predating the current work. Flagged for Andrew to correct in Matrix and to spot-check 2-3 other recent Lennar listings against.

**Aframe connector live-verified end-to-end.**

Confirmed authenticated and functional via `list_participant_roles` (22 roles including the intentional splits like Buyer/Buyer (Other Side), Lender/Lender Processor, TC (Other Side), Referral Agent), `search_transactions`, `get_transaction`, and `search_tasks` on the 1 POC Lane test file (xactionId 551669). File was in Draft state with 8 visible tasks; Andrew added acceptance date and close date live during the session, then re-queried — task list expanded to 41 (33 previously-invisible "waiting" tasks materialized). Confirmed the API behavior Andrew flagged: `search_tasks` does not return tasks in waiting status. The API returns only tasks whose anchor merge fields have been populated.

**Two project-hygiene issues surfaced during Wave 3 authoring.**

`Lennar_New_Listing_Protocol.md` in the authoring project's uploaded file set is a GitHub 500 error page (HTML starting with `<!DOCTYPE html><html><head>`), not the actual doc content — a silent sync failure at upload time. `Lennar_Payload_Schema.md` in the same file set is v1.5 at 1054 lines, appearing to be the pre-trim frozen `docs/lennar/` version rather than the operational `docs/operational/lennar/` trimmed version (630 lines per Session 015). Both required Andrew to re-upload the correct files mid-authoring; both are worth flagging as failure modes to check for when seeding the new operational project.

### Decisions Made

- **Directions field: stub as always-manual with community-static future-use note** rather than immediately reversing its exclusion. Historically framed as address-specific in `CVRMLS_Bookmarklet_Build.md`; reframing to community-static (highway/main-road directions to the community entrance) would make it a candidate for community-lookup treatment alongside Subdivision and Post Office. Stubbed with a documented reactivation trigger — capture Input ID and 215-char content on a future live DOM inspection when sales reps request it. Preserves current behavior without prematurely committing engineering budget.
- **Column A hyperlink source: resolved to Matrix-exported MLS PDF, saved to Drive post-activation.** Fully manual step outside session scope. Session responsibility limited to including a post-activation reminder line in the Step 10 handoff checklist. Wave 3 handoff patches both Step 6 (resolves the open item) and Step 10 (adds the reminder).
- **PandaDoc activation deferred until after the 3 queued listings run.** Rationale: variable isolation during operational project smoke-test period; retrieval-side is manual regardless of PandaDoc state so send-side automation isn't a full close-the-loop win; friction data from running 3 listings manually will empirically justify (or not) the subscription cost.
- **Wave 3 handoff bundling** — six files in one handoff, deliberate exception to the standing one-file-per-handoff rule. Rationale captured in the handoff's own "What This Is / Why It Exists" and "Note on Bundling" sections: the silent-write fixes in extension and CVRMLS source must land together to keep source and port aligned; the always-manual list reductions across three docs must be consistent; individual changes are surgical enough that failure isolation is preserved by rollback rather than by file splitting.

### Documents Created / Updated

None directly this session. All doc updates are staged for Wave 3 Cursor apply.

### Cursor Handoffs Produced

| Handoff | Target Files | Purpose |
|---|---|---|
| `HANDOFF-2026-08-20-operational-preseed-closeout.md` | `extension/content.js`; `docs/cvrmls/CVRMLS_Bookmarklet_Source.md`; `docs/operational/lennar/Lennar_Payload_Schema.md`; `docs/operational/lennar/Lennar_New_Listing_Protocol.md`; `docs/operational/lennar/Lennar_Project_Protocol.md`; `docs/operational/lennar/Lennar_Extension_Reference.md` | Wave 3 preseed closeout — silent-write fixes, always-manual list corrections, Session 015 post-execution report doc-fixes, Directions stub |
| `HANDOFF-2026-08-20-session-log-v2-016.md` | `docs/project/Project_Session_Log_v2.md` | This entry |

### Discrepancies Surfaced (Not Fixed This Session)

- **`Lennar_New_Listing_Protocol.md` in authoring project file set is a GitHub 500 error page.** Silent upload failure. Andrew re-uploaded mid-session. Worth adding a `head`-check discipline to the operational project seeding procedure (Wave 4) — any file that came in as an HTML error page would break session behavior invisibly on first use.
- **`Lennar_Payload_Schema.md` in authoring project file set appears to be pre-trim v1.5** (1054 lines), not the operational trimmed version (630 lines). Also re-uploaded mid-session. Related to the same class of sync issue.
- **8600 Clemet Dr Matrix listing has `Agt Related to Seller: Yes`** where the Lennar standard is always No. Not a Wave 3 code fix — a data-entry issue on that specific listing. Andrew to correct in Matrix and spot-check 2-3 other recent Lennar listings.
- **`CURSOR-HANDOFF-PROTOCOL-001` still describes flat `handoffs/`** vs. `REPO_STRUCTURE.md`'s `handoffs/incoming/` and `handoffs/applied/`. Carried forward unchanged from Session 015 §5.
- **`CURSOR-HANDOFF-PROTOCOL-001` still missing the "What This Is / Why It Exists" standing addition for generative handoffs.** Applied ad hoc in the Wave 3 handoff (used for the bundling rationale). Carried forward unchanged from Session 015 §5.
- **`docs/lennar/` frozen-as-historical convention** still not codified in `CURSOR-HANDOFF-PROTOCOL-001`. Carried forward unchanged from Session 015 §6.

### Open Verification Items

- Wave 3 Cursor apply pending — Andrew to run.
- Post-Wave 3 verification: extension write log should no longer report `Input_102_POTCLZ` as missing on General Info fills.
- 8600 Clemet Dr data-integrity fix, plus spot-check of 2-3 other recent Lennar listings for the same "Yes" mistake.
- New operational Lennar Claude.ai project seeding (Wave 4) — carried forward from Session 015. Now unblocked by Wave 3 landing.
- Three Lennar listings queued to run through the operational project once seeded — deferred smoke-test-first (Wave 4 will run one light smoke-test session before touching the queue).

### Key References

- Wave 3 handoff: `HANDOFF-2026-08-20-operational-preseed-closeout.md`
- Aframe test file: 1 POC Lane, Richmond VA (xactionId 551669); Buyer side; Cash; $250,000; effective 2026-08-20, closing 2026-09-30
- Aframe live behavior confirmed: `search_tasks` filters out waiting-status tasks; task materialization is driven by anchor merge field population (`d_ClosingDate`, `d_EarnestMoneyDue`, `d_inspectiondeadline`)
- Buyer-side session protocol (surfaced late in session): `docs/protocols/New_Buyer_Side_Session_Protocol.md` (WORKFLOWS-BUYER-001) v1.3
- Companion seller-side protocol: `docs/protocols/Seller_Under_Contract_Session_Protocol.md` (WORKFLOWS-SELLER-001) v1.2+
- Priority use case reference: `docs/project/PROJECT_VISION.md` — buyer-side contract intake as Priority 1 for the current connector tool set

### Philosophical / Architectural Discussion — High-Level Notes

An extended discussion about the shape of AI-assisted work in this project ran alongside the operational threads. High-level takeaways:

- **The Lennar operational project is the "training wheels" case, not the point of the whole exercise.** Its value is proving out the harness patterns (Payload Envelope, session lifecycle, Issue Reports, authoring/operational split, Airtable-as-truth, extension write log) against a stripped-down deterministic slice, so those patterns can be applied to harder cases with confidence.
- **The Aframe file, once dates are populated, functions as the transaction's own KB.** Templates encode conditional workflow at file-creation time; the file's task list is the deterministic per-transaction workflow already resolved. A session reading a live file isn't reasoning about "what TC work looks like generally" — it's reading pre-computed state that Aframe already scoped down. This substantially reduces the doc-set burden compared to encoding TC domain knowledge from scratch.
- **The API's "waiting-status invisibility" property has real harness implications.** A session hitting a file at intake time (dates not set) sees ~20% of the actual workflow; a session hitting after date population sees the full picture. Harness must teach sessions to check whether anchor dates are set before drawing conclusions about task list completeness, and to re-query on every beat rather than caching prior context.
- **Lifecycle-assistance for TC work is not viable given current Aframe API constraints.** Read-only + advice against a rapidly-changing operational surface, combined with the mode-switch cost of dropping into a Claude session, produces net-negative value. Watch the Aframe API roadmap for `complete_task`, `send_task_letter`, and merge-field write access before revisiting.
- **Setup-assistance IS viable, high-leverage, and shape-compatible with the Lennar operational pattern.** File creation, participant tree population, template selection based on deal type, merge field population, initial attachment routing — all deterministic transformations of structured input (Cognito form + contract PDF + email intake) into structured Aframe file state. Every action needed for setup has a real API endpoint (`create_transaction`, `bulk_add_transaction_participants`, `apply_task_templates`, `bulk_update_custom_fields`, `upload_transaction_attachment_file`). Doesn't require the write-access limitations to be fixed because setup is the intake beat, not lifecycle assistance.
- **`New_Buyer_Side_Session_Protocol.md` v1.3 already exists and covers this use case.** Surfaced late in the discussion — session was speculating from first principles when a real, actively-maintained protocol was 2 tool calls away. `PROJECT_VISION.md` names buyer-side contract intake as Priority 1 for the current connector tool set for the same reasons the session independently derived. Reinforces the standing rule: search project knowledge before reasoning from first principles about workflow shape.

None of the above generated documents this session — the discussion was scoping context, not authoring work. Captured here for continuity into whatever future authoring session picks up the TC-setup thread.

### Session Handoff Produced

None. Session closes with clear next actions in the operational thread (Andrew runs Wave 3 in Cursor → seeds the operational Lennar Claude.ai project per Wave 4 → runs light smoke-test session → runs the 3 queued listings). No bridge doc needed.

---

## Session 017 — Lennar Email/Labels Overhaul + Gmail Threads Ledger + Doc Refresh
**Date:** August 27, 2026

### Focus
Redesign the Gmail label and thread-tracking strategy for the Lennar Operational Project after a recent ops-session brief documented the cost of the existing per-address labeling scheme against a mailbox carrying 665 labels with no batch-modify tool. Design the new scheme, prove it end-to-end on one live listing, sync the operational protocol and payload docs to the new state, and roll in a personnel refresh from Andrew's weekly Thursday Lennar meeting held earlier the same day.

### What Was Accomplished

**Design — Lennar email/labels overhaul (Findings 4 and 5 from the ops brief, resolved this session):**
- Four fixed status labels replace per-address labeling: `Lennar/New Listings` (`Label_8162379569998573615`), `Lennar/Active` (`Label_8433040405042272049`), `Lennar/Pending` (`Label_1922509537569469064`), `Lennar/Closed` (`Label_7877946473296994946`). IDs hardcoded in the operational Protocol so sessions never call `list_labels`.
- Five functional labels documented and scope-bounded (`My Invoices to Gary`, `Notices`, `Open House`, `Price Adjustments`, `Reverse Prospecting`). Session touches `Price Adjustments` only during Price Adjustment beats; Andrew maintains the rest.
- `Lennar Archive` accepted as terminal home for ~91 pre-existing per-address labels Andrew swept out via Gmail UI before this session began. Sessions never touch this tree.
- Withdrawn from MLS folds into Closed (same Gmail label, same Airtable Status). Session Notes documents the actual outcome.
- New `Gmail Threads` field on the Airtable Lennar Listings table (Andrew created in UI as `fldDeQrtsbcLndcRn`, multilineText). Ledger format: `YYYY-MM-DD | thread_id | brief note`, oldest-first, `(also [address])` cross-references for shared threads. Non-overlapping with existing `Gmail Thread ID` (which continues to hold the intake thread only, unchanged historical meaning).
- Session/Andrew Gmail discovery contract: session scans `in:inbox` filtered to Lennar as its entire discovery scope; the `Gmail Threads` field is source of truth for "captured"; session never archives; Andrew archives at his own discretion based on personal follow-up state, not "processed by session" state.
- Delta-sync-first standing behavior added to every lifecycle beat (previously new-intake-only). Rationale: the Thursday-11am Lennar operational meeting and ad-hoc rep emails between meetings both push price/status/close-date changes to the Google Sheet without a session-triggering email, so a session may open on a Sheet that's ahead of Airtable. Delta-sync early.

**Live implementation and end-to-end proof on one listing:**
- 6128 Hull Street Rd (`rec6ehG55dE6tWDQx`) — Airtable: Current Price → $399,990 (was $390,990); Last Price Change Date → 8/27/26; `Gmail Threads` populated with the addendum thread. Gmail: `Lennar/Active` and `Lennar/Price Adjustments` labels applied to the intake thread using hardcoded IDs — no `list_labels` call.
- 6122 Hull Street Rd (`recxIg2z3Skfq5q3a`) — `Gmail Threads` populated with three entries: photos-request thread to Marketing (Aug 25 → 27), Authentisign addendum (Aug 26, cross-referenced as `(also 6128 Hull)`), and Izaiah's direct-photos thread (Aug 27). Confirmed the shared-thread cross-reference convention works cleanly on both records.
- 15912 Greenhart Dr and 8748 Whitman Dr — settled per Michelle Eke's Aug 26 emails; MLS and Google Sheet updated by Andrew directly. Intentionally not added to Airtable — both closed without ever being mirrored, and per protocol the Sheet remains authoritative. Reasoning documented so a future session doesn't try to backfill.

**Personnel refresh from Thursday meeting (protocol roster stub replaced with confirmed 2026-08-27 roster):**
- Chris MacLaird — new Area Sales Manager, Richmond/Williamsburg hub. Fills Carly Evans's old position. Addendum signatory going forward (Andrew updating TransactionDesk form on his side). Email `christopher.maclaird@lennar.com`.
- Megan Cook title confirmed: Director of Sales, Mid-Atlantic Division. Higher than the ASM role Chris fills; not being replaced by Chris.
- Michelle Eke and Mercedes Creech confirmed as active NHCs. Stefanie Nayder has departed.
- Marketing contacts captured for the first time: Dianna Sherrod (Regional Marketing Field Coordinator, first-line for marketing coordination) and Danielle Kefauver (Regional Sr Integrated Marketing Specialist, owns photo assets and resizing).

### Decisions Made
- **Four-label Lennar Gmail scheme with hardcoded IDs.** Sessions transition labels via `label_thread`/`unlabel_thread` against known IDs; never call `list_labels`.
- **`Gmail Threads` ledger on Airtable is the durable capture record.** Session appends new threads; Andrew's inbox state (labeled/unlabeled/archived) does not signal "processed" to a session.
- **Session/Andrew Gmail discovery contract locked.** Session-scans-inbox-only; Andrew-archives-on-personal-follow-up. Generalizes to all future builder workflows through Gmail.
- **Withdrawn from MLS folds into Closed.** No separate label, no separate Airtable Status option.
- **Delta-sync first behavior extended to all lifecycle beats.** Any Lennar beat (Thursday-onward especially) opens with a delta-sync of the Sheet against Airtable before acting on whatever email brought the session in.
- **Parking, Fireplace, and Porch default to `[]` for Lennar.** Form 17 does not source these three fields; existing code resolution note stays as edge-case fallback. Resolves the ambiguity Session 026 of the operational project flagged on 6128 Hull's intake payload.
- **Standing rule for handoff-authoring sessions: consult `REPO_STRUCTURE.md` for repo-relative paths before authoring Find/Replace targets.** Added mid-session after Cursor rejected two handoffs pointed at `docs/lennar/` (frozen authoring source) when they should have been pointed at `docs/operational/lennar/` (current edit target). A `supersedes:` reference in frontmatter is a pointer to a related file, never the location of the file being edited. Belongs in `CURSOR-HANDOFF-PROTOCOL-001` on a future pass.
- **NHC roster should migrate out of the operational Protocol doc into a new Airtable table.** Deferred to next session; too much design (schema, join model to POC single-select, generalization to future builders) to bolt on late in this one.

### Documents Created / Updated

| Document | ID | Version | Change Summary |
|---|---|---|---|
| Lennar New Listing Protocol (operational) | LENNAR-OPS-PROTOCOL-002 | 1.0 → 1.1 | Email overhaul + rep roster refresh + delta-sync-first + Gmail discovery contract. Retired per-address label steps; new four-label status scheme with hardcoded IDs; new Gmail Labels subsection documenting the status labels, functional labels, `Lennar Archive`, and session/Andrew discovery contract; `Gmail Threads` ledger added to Step 7 and to every lifecycle beat; Lifecycle Updates section rewritten with new Withdrawn and Activation subsections; rep roster stub replaced with confirmed 2026-08-27 roster; marketing contacts added; Cognito `take=N` intake pattern and Gmail `label:` display-name-not-ID rule added to Connector notes. |
| Lennar Payload Schema (operational) | LENNAR-OPS-SCHEMA-001 | 1.1 → 1.2 | §5.4 explicit Lennar defaults for Parking, Fireplace, Porch (`default []` — Form 17 does not source these fields); code resolution note kept as edge-case fallback. Resolves ops brief Finding 2. |
| Lennar Payload Examples (operational) | LENNAR-OPS-EXAMPLES-001 | (unchanged/next) | Removed misleading `Input_519_02` (Carport) from `features_a.parking` in the Harpers Mill TH taxid example — companion to the Schema fix above. |
| Airtable — Lennar Listings table | — | — | New `Gmail Threads` field added by Andrew in UI (`fldDeQrtsbcLndcRn`, multilineText). Populated on 6128 Hull Street Rd and 6122 Hull Street Rd this session as end-to-end proof. |
| Airtable — Lennar Listings records | — | — | 6128 Hull: Current Price and Last Price Change Date updated, Gmail Threads populated. 6122 Hull: Gmail Threads populated. |
| Gmail (labels) | — | — | Four Lennar status labels created in UI by Andrew (New Listings recycled from a pre-existing empty label, with a standout blue `#1e53b8` color; Active, Pending, Closed created fresh). Pre-existing per-address labels swept into `Lennar Archive` before this session began. |

### Cursor Handoffs Produced This Session

| Handoff | Target File | Purpose |
|---|---|---|
| `HANDOFF-2026-08-27-lennar-new-listing-protocol.md` | `docs/operational/lennar/Lennar_New_Listing_Protocol.md` | v1.0 → v1.1 email overhaul + rep roster + delta-sync + Gmail discovery contract |
| `HANDOFF-2026-08-27-lennar-payload-schema.md` | `docs/operational/lennar/Lennar_Payload_Schema.md` | v1.1 → v1.2 explicit Lennar defaults for Parking/Fireplace/Porch (Finding 2 resolution) |
| `HANDOFF-2026-08-27-lennar-payload-examples.md` | `docs/operational/lennar/Lennar_Payload_Examples.md` | Carport removal in Harpers Mill TH taxid example (Finding 2 resolution) |
| `HANDOFF-2026-08-27-session-log-v2.md` | `docs/project/Project_Session_Log_v2.md` | This entry |

### Discrepancies Surfaced (Not Fixed This Session)
- **Lucas Clark email/community placeholder in the new rep roster.** Change 4 of the Protocol handoff carries a placeholder for Lucas's email since it wasn't recoverable from any of the threads inspected this session. If he's still active, needs a follow-up backfill.
- **Currency-mirror drift in Airtable Lennar Listings.** `fldT6CrqfiJQ6SE4F` (currency Current Price) and `fldmfUZaDOtgWMYa9` (currency, likely CC assistance / closing costs) populate on some records and not others. Decide: protocol maintains going forward, or treat as legacy fields.
- **`Input_570_03` (Boat Lift) in the Harpers Mill TH taxid example's `features_a.exterior`.** Same class of misleading illustrative placeholder as the Carport value the Examples handoff fixes this session. Not scoped in — flagged for a follow-up sweep of the example against Form 17 crosswalk reality.
- **Two path-related handoff rejections mid-session** — payload Schema and Examples handoffs first pointed at `docs/lennar/` (frozen authoring source) instead of `docs/operational/lennar/`. Root cause: I inferred paths from the operational doc's `supersedes:` metadata rather than consulting `REPO_STRUCTURE.md`. Corrected in-session; standing rule added under Decisions Made.
- **Project knowledge sync drift** — second time this session where project-knowledge state lagged behind the repo state (`Lennar_Payload_Schema.md` was three days out of date). Same underlying pattern as flagged in previous log entries. No fix; ongoing.

### Open Verification Items (Carried Forward)
- Chris MacLaird's addendum signing scope — whether he signs for all Lennar Andrew handles, or only Richmond/Williamsburg. Andrew asked Megan mid-session; awaiting confirmation.
- Mercedes Creech's confirmed community assignment — currently "likely Harpers Mill, pending confirmation from Chris."
- Lucas Clark — see Discrepancies above.
- Whether NHC roster migration to Airtable should also absorb the Marketing contacts (Dianna, Danielle) or keep them separate. Design question deferred to next session.
- 6122 Hull Street Rd photo processing — Danielle's Box link and Izaiah's direct PNGs are in the inbox. Andrew handles MLS upload + Drive save when ready; not urgent, not session work.
- Findings brief (`Lennar_Session_Findings_Brief_2026-08-26.md`) resolution artifact — brief was uploaded to this session as a one-time artifact; whether it lives in the ops project knowledge or just as an artifact wasn't determined. Decide next session whether a resolution doc is warranted.

### Key References
- Airtable Lennar Listings: base `app78fMUwDNBHUZ6r`, table `tbllTArjNE464zFGi`, new `Gmail Threads` field `fldDeQrtsbcLndcRn`
- Gmail label IDs (hardcoded in Protocol v1.1): New Listings `Label_8162379569998573615` · Active `Label_8433040405042272049` · Pending `Label_1922509537569469064` · Closed `Label_7877946473296994946`
- Live records exercising the new scheme: 6128 Hull Street Rd (`rec6ehG55dE6tWDQx`), 6122 Hull Street Rd (`recxIg2z3Skfq5q3a`)
- Live threads referenced: intake `1a02f7c239cf20fa` (shared), Authentisign addendum `1a03e2bb5a33549a` (shared), 6122 photos hunt `1a038f3b599acc9f`, 6122 direct photos from Izaiah `1a043c48f99e6ee9`
- Source ops brief: `Lennar_Session_Findings_Brief_2026-08-26.md`

### Session Handoff Produced
`SESSION-HANDOFF-2026-08-27-nhc-roster-airtable-migration.md` — bridge doc for the next session. Primary task: design and build the NHC Personnel Roster Airtable table, populate from the roster now inline in Protocol v1.1, and cut the Protocol over to point at the table. Plus smaller carryforward items (findings brief resolution, currency-mirror drift decision, AAR-TC-level pattern generalizations, remaining ops brief cleanup).

---

*Next session: NHC Personnel Roster → new Airtable table design and cutover. Includes decisions on join model to Lennar Listings POC field, whether Marketing contacts share the table, and generalization to future builders. See `SESSION-HANDOFF-2026-08-27-nhc-roster-airtable-migration.md` for full scope, open questions, and smaller carryforward items.*

---

## Session 018 — 2026-08-31 — Lennar Ops persona, workflow reorder, and automation philosophy

### Context

Discussion session on the Lennar Ops project doc set, focused on two threads Andrew opened: dialing in the user-side workflow (particularly the session-open pacing) and formalizing the tone/persona of Ops sessions. Prompted by a recent listing where the session felt like it was slowing Andrew down rather than moving in parallel with him, plus longer-term planning for Liz taking over Lennar workflow execution as AAR-TC scales to additional builder collaborations.

### Key decisions

**Session-open reordered around a lightweight handshake (Step 0).** Sessions now open with a narrow Cognito read — community and property type only, from the newest entry via `get_entries_in_view` on view `17-3` with `take=1` — then state back to the user what they're seeing, ask whether the Matrix incomplete listing exists yet, and hand the user something concrete to do (create the listing, get the MLS#) while the session pulls the full intake in parallel. Both parties advance during the same span of time. The "quick" part of the read is Claude-side discipline about which fields to look at; the tool returns the full entry either way.

**Path is community-driven, not home-type-driven.** Path (`taxid` vs `new`) reflects parcel-data availability in Matrix, not property type — Everstone was `new` because streets weren't in Google Maps yet, not because it's single-family. Property type is read in the handshake for secondary reasons (sanity check the user hears back, Harpers Mill TH vs SF selection in later steps).

**MLS# is intake-time data now, not later.** Matrix generates the MLS# on the first save of an Incomplete listing, so it's available before the session finishes intake — folded into Step 7's Airtable row-add, removed from the Step 10 handoff Airtable-save line.

**Photo source resolution promoted to Step 4a.** Previously a passing note at the bottom of the doc; now an owned session step that sits between parsing and payload generation. Establishes the multitask handoff point of the intake beat — user starts photo upload while the session builds the payload.

**Addendum trigger rewritten from "send early" to "send only when launch-ready."** Two conditions required: photos secured (from Step 4a) and no open NHC blockers. The old "send early to overlap the signature turnaround" rationale was calibrated for a slower-signer era that no longer applies; a signed addendum in hand for a listing that can't actually go active is worse than a small delay starting the signature clock.

**Persona codified as §4.5 in the Project Protocol.** Two threads: pacing (structure work so the session's next task and the user's next action run in parallel and meet back in the middle) and voice register (confident, directive, guides without being terse, tolerant of hand-holding when it helps). Motivated by the pacing issue Andrew flagged and by planning for Liz as a future operator who won't carry Andrew's mental model of the workflow.

**User-Side Workflow SOP stubbed in §5.3.** Placeholder for a future reference doc capturing manual Matrix/CVRMLS navigation and lifecycle-entry procedures currently held in Andrew's head. Not authored; sessions coordinate with the user directly on how-to questions until it exists.

### Workflow philosophy — captured for cross-project applicability

The discussion surfaced a design discipline that is not Lennar-specific and applies to everything AAR-TC builds with AI — the Aframe connector work, future buyer- and seller-side contract protocol automation, additional builder onboardings, and any future AAR-TC AI initiative.

**Automate the tedious, repetitive, high-volume mechanical work.** Matrix input, addendum sending, record-keeping infrastructure. This is where automation clears its cost — the tedium tax on hundreds of fields per listing across dozens of listings per year is real, and the mechanical nature of the work means the automation stays predictable and maintainable.

**Leave the judgment work, the relationship work, and the low-frequency high-stakes work with the human.** Reading an NHC's email to determine intent, deciding whether an intake anomaly needs a rep conversation or a workaround, activating a listing in Matrix, entering price and status changes. These stay with the user because the human touchpoints are what keep the automation trustworthy and the liability picture clean.

**Automation needs to earn its keep.** Complexity has costs: more surface area to maintain, more potential gaps and unseen failure points, harder for a new operator to hold in their head. Every proposed extension of the harness gets scrutinized against those costs, not just "does it save time in theory." Sounding neat is not a reason to build.

**Not every automation needs to live inside the session's execution surface.** Adjacent tools — the Chrome extension, Cursor-run local Python scripts (Reverse Prospecting is one example), the frozen photo preprocessing tool — stay in the toolbox next to Claude rather than being pulled into Claude's workflow. Coordination around them is fine; absorbing them into the session's scope isn't. This is a specific instance of the earn-its-keep rule: pulling an already-solved adjacent automation into the session adds surface area without proportionate benefit.

**AOR (area of responsibility) framing.** The Ops project stays balanced when user AOR and session AOR are explicit and the boundary between them is maintained by rules rather than vibes. Currently held implicitly across procedural notes in the New Listing Protocol; a candidate for explicit codification in a future protocol revision once the concept has earned enough operational use to name plainly. Applies equally to future Aframe workflow docs and any other operational project.

### Business context

The harness enables scale: four to five builder/agent clients at ~$1,500/mo of largely automated work yields real annual recurring revenue on manageable volume — the target that lets Liz leave her current job. The persona and pacing rules are not polish; they're the difference between "harness that scales" and "harness that becomes a second full-time job for Liz." Every friction point smoothed out compounds over hundreds of listings per year across multiple builders.

The architecture — SOP docs as first-class artifacts, authoring/operational split, versioned specs with Cursor handoffs, formal escalation via Issue Reports, explicit human-in-the-loop for high-stakes actions — matches what enterprise AI teams converge on as they mature past the chatbot phase. Real Broker's Leo CoPilot (in reZEN) sits in the earlier chatbot-over-knowledge-base pattern; what AAR-TC is building sits in the workflow-encoded-agent pattern that is the next shape. Arriving there via solo-operator necessity means the discipline is baked in from the start rather than retrofitted.

Named in-session: "harness engineering" as the term for the scaffolding around the model that turns raw capability into reliable execution — tools, docs, pacing rules, state, boundaries between session decisions and human decisions. This session's philosophy captures apply to the harness discipline in general, not to Lennar specifically.

### Artifacts produced

- `docs/operational/lennar/Lennar_Project_Protocol.md` v1.1 → v1.2 (added §4.5 Session Voice and Pacing; added User-Side Workflow SOP stub to §5.3)
- `docs/operational/lennar/Lennar_New_Listing_Protocol.md` v1.4 → v1.5 (added Step 0 Opening Handshake; added Step 4a Resolve Photo Source; revised Step 5 fill flow to remove Matrix creation; added MLS# to Step 7 Airtable row-add; revised Step 9 addendum trigger; adjusted Step 10 handoff item; Step 1 now reuses Step 0's Cognito response object)
- Cursor handoffs (deleted post-commit per handoff protocol)
- This session log entry

### What we intentionally didn't do

- Didn't rename "Andrew" to "the user" throughout the New Listing Protocol; the persona doc's user-agnostic framing plus new-section language sits alongside existing Andrew-specific procedural text. A rename pass would be a bigger revision than this session's scope and can happen when Liz's onboarding is closer.
- Didn't add forward references from other docs to the yet-unauthored SOP ref doc. When the SOP is authored, cross-references get added then — including likely shortening Step 0's inline taxid/new prereq walkthrough to point at the SOP.
- Didn't extend the automation surface — no changes to what the session does end-to-end, only how it opens, paces, and hands off work. This session was about tuning the human/AI interface, not adding new automation capabilities.
- Didn't pull the Reverse Prospecting solution into the Ops session's scope. It exists as a separate Cursor-run local Python script solved in another project, and stays there.

---

*Log started July 15, 2026. Post-realignment doc architecture in effect. Old log (`docs/project/Project_Session_Log.md`) preserved as pre-realignment archive.*

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Each session adds one entry; version_date is not maintained (chronology is captured in the entries themselves).*

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

*Log started July 15, 2026. Post-realignment doc architecture in effect. Old log (`docs/project/Project_Session_Log.md`) preserved as pre-realignment archive.*

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Each session adds one entry; version_date is not maintained (chronology is captured in the entries themselves).*

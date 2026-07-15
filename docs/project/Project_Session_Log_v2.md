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

*Log started July 15, 2026. Post-realignment doc architecture in effect. Old log (`docs/project/Project_Session_Log.md`) preserved as pre-realignment archive.*

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Each session adds one entry; version_date is not maintained (chronology is captured in the entries themselves).*

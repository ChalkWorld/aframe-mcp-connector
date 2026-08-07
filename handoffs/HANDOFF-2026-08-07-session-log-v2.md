---
title: Cursor Handoff — Project_Session_Log_v2.md — 2026-08-07
document_id: HANDOFF-2026-08-07-session-log-v2
date: 2026-08-07
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to `docs/project/Project_Session_Log_v2.md`. Do not modify anything not listed here.

## Change 1

Add a new Session 004 entry. This does not touch Session 003 — that entry is explicitly a placeholder reserved for the Lennar smoke-test addendum content and is unrelated to this session's work, so it's left exactly as-is. The new entry is inserted after Session 003's closing separator and before the document's closing footer.

**Find**
```
The Step 4 recommendation from this entry gates the next migration handoff.

---

*Log started July 15, 2026. Post-realignment doc architecture in effect. Old log (`docs/project/Project_Session_Log.md`) preserved as pre-realignment archive.*
```

**Replace with**
```
The Step 4 recommendation from this entry gates the next migration handoff.

---

## Session 004 — Aframe Role/Category Audit + Batching Design Refinement
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

*Log started July 15, 2026. Post-realignment doc architecture in effect. Old log (`docs/project/Project_Session_Log.md`) preserved as pre-realignment archive.*
```

No other changes to `Project_Session_Log_v2.md`.

```bash
git add -A
git commit -m "docs: add Session 004 log entry — Aframe role/category audit + batching design refinement"
git push origin main
```

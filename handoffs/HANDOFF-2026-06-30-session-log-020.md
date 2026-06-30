---
title: Cursor Handoff — Project_Session_Log.md — Session 020
document_id: HANDOFF-2026-06-30-session-log-020
date: 2026-06-30
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to `docs/project/Project_Session_Log.md`. Do not modify anything not listed here.

## Change 1 — Append Session 020 entry

Adds the Session 020 log entry directly after the Session 019 entry's closing line, following the established log structure.

**Find**
```
---
*Next session: Listing Info bookmarklet update (Item 1 from Session 019 agenda); non-Lennar Phase 1 payload JSON schema; Project Vision doc update.*
```

**Replace with**
```
---
*Next session: Listing Info bookmarklet update (Item 1 from Session 019 agenda); non-Lennar Phase 1 payload JSON schema; Project Vision doc update.*

---

## Session 020 — June 30, 2026

### Focus
Built `WORKFLOWS-SELLER-001` (Seller Under Contract — Session Protocol) from scratch, then mirrored its structure back into a v1.2 update of the buyer-side protocol so both docs follow the same shape going forward. A live working file (7113 Deer Run Ln, Kelly Painschab) was used as the worked example throughout — it surfaced most of the real decisions below, but isn't itself the subject of this entry.

### Why This Session Happened
`WORKFLOWS-SELLER-001` was a named placeholder in `TRANSACTION_WORKFLOWS_FRAMEWORK.md` ("Workflow 2 — Seller-Side Contract Intake," status "Not started") and had been carried forward as an open item since Session 001. The trigger was a real seller-side contract coming in on an existing listing — the first time this workflow needed to run for real rather than be planned.

### How the Protocol Was Built
Rather than draft the doc speculatively, it was built live against the Deer Run file: read the actual contract, find the existing Aframe transaction, work through contacts/merge fields/templates in real order, and write each protocol section immediately after the corresponding step was figured out. This meant several points where the "obvious" approach turned out to be wrong and had to be corrected before being written down — those corrections are most of what's worth recording here.

### Decisions Made — Protocol Content

- **Seller-side is always an update, never a create.** Unlike buyer-side, the Aframe transaction already exists from listing intake. The protocol opens by searching for the existing transaction and explicitly instructs stopping rather than creating a new one if it isn't found.
- **The Closer role inverts on seller-side files.** `Closer` always means Andrew's own side's settlement company (already on the file from listing setup); the settlement company named in the contract is the *buyer's* side and belongs in `Closer (Other Side)` — the opposite of how it reads on a buyer-side file. This was a live misread during the Deer Run session, caught and corrected before any contact was created.
- **Seller-side commission has no delta scenario.** Confirmed directly rather than assumed: just the single `f_SellerSideCommission` rate, no buyer-covers-the-delta math like buyer-side's `f_CommissioncoveredbytheBuyer`. The seller-side Commission and Payout section was written simpler than buyer-side's on purpose, not as an oversight.
- **Multi-buyer grouping needs judgment, not a fixed rule.** When a contract has more than two buyers, whether they group into one contact (with the second as alt-contact) or split into separate contacts depends on the actual relationship shown on the contract — not a count-based rule. Deer Run's three purchasers split two ways (a couple as one record, a third buyer separate) and that became the documented example rather than a formula.
- **Land contracts are a subset, not a parallel workflow.** Fewer contingencies (no home inspection, well/septic/WDI, or home warranty in the residential sense), one addition (Soil and Feasibility Study Due Diligence Date), fewer tasks. Existing land task templates already cover both sides (buyer-side 22937, seller-side 42120). Both protocol docs got a short Land section rather than a duplicated workflow — this was a deliberate scope decision, not a placeholder for future expansion.
- **Gmail label handling needed its own section in both docs.** New-listing labels live under `! Future and Active Listings/[Address]`; going under contract moves the label up to live directly under the top-level transaction folder. This is process knowledge that existed only as something Andrew did manually — it had never been written into either protocol before this session.

### Decisions Made — What the Session Cannot Do (and why that matters)

Three hard API limitations were confirmed directly rather than assumed, each with a different cause:

- **Task omission is permanently UI-only as of an Aframe API changelog dated 2026-05-29** — the `omitted` field was removed from all Task/Event/Transaction Attachment DTOs; `PATCH /tasks/{taskId}` now 404s on an omitted task. This closes an open question that `PREAUTOMATION-001` had flagged as "field name TBD, pending an extraction session" — the real answer is that the capability was removed entirely, not that the field name was unknown. `PREAUTOMATION-001` itself still describes this as open research and needs a follow-up correction (see Gaps).
- **Date and attachment templates have no API endpoint at all** — distinct from task omission. This was never a connector capability to begin with, not something that got taken away.
- **Transaction events are read-only** — no create/update/omit tool exists, only a read via `search_transactions` with `includes: ["EVENTS"]`. That read still has real value: during the Deer Run session it caught a wrong dates-template application (standard instead of cash) before it went unnoticed in the file.

A fourth limitation was found in the course of writing the label-handling guidance above: **Gmail label creation and renaming have no tool at all** — only add-existing-label/remove-existing-label exist. This was caught the hard way: an early draft of the label-move instructions asserted a "rename the label's path" capability before it had actually been checked against the real tool surface. Re-verifying before finalizing caught it, and the language was corrected in both docs before being shown rather than after.

All four limitations, plus the resulting session/Andrew division of labor, were written into both protocol docs as a named "Known Limitations" section — not buried in individual steps — so neither doc has to be re-discovered from scratch later.

A related pattern that came out of identifying task-omit candidates: not every "thing that gets omitted" has the same reason or the same shelf-life. Four categories were named explicitly rather than left as a flat list — contract-driven (the logic is standing, only the contract fact is file-specific), agent-preference (the fact belongs to the agent and should prompt an Agent Profiles update if it isn't documented yet), standing process rule (applies company-wide regardless of file), and temporarily parked (blocked on something outside the file's control, stays open rather than getting omitted). This taxonomy is now in both docs.

### How the Two Protocols Were Aligned

Once `WORKFLOWS-SELLER-001` existed, it was compared section-by-section against the buyer-side protocol and both were revised so they'd mirror each other in structure, not just share a topic. Buyer-side gained: the Land section, the four-item Known Limitations block, the division-of-labor table, the omit-reason taxonomy, and a missing-signatures compliance rule. Seller-side gained: full Standard + Native merge field tables, a Commission and Payout section, and a Services Requested table, matching buyer-side's existing depth.

Genuine differences were kept rather than forced to match — buyer-side keeps its commission delta worked examples because that scenario is real there; seller-side stays single-rate because it isn't. The Closer-role-inversion note stays seller-side-only, since it's only a source of confusion read in that direction.

### Gaps Identified
- [ ] **`PREAUTOMATION-001`** still frames the task-omit field name as an open research question pending an extraction session. Now resolved (capability removed entirely, per the changelog) — needs a small update so a future session doesn't re-investigate something already answered.
- [ ] **`TRANSACTION_WORKFLOWS_FRAMEWORK.md`** still lists Workflow 2 (`WORKFLOWS-SELLER-001`) as a placeholder, status "Not started." Needs an update reflecting that it's built.
- [ ] **Agent Profiles** has no field for agent-specific vendor/signage preferences. This surfaced as a documentation gap while working through omit-candidate reasoning on a live file, but the fix belongs in Agent Profiles, not in either protocol doc.
- [ ] **`New_Seller_Side_Session_Protocol.md` (`AAR-TC-SELLER-PROTO-001`, from Session 019) and `WORKFLOWS-SELLER-001` are sibling documents, not duplicates** — confirmed this session, worth stating plainly here so it doesn't get re-litigated later. The former covers MLS listing input (getting a property listed); the latter covers what happens once that listing goes under contract. Different lifecycle stages of a seller-side file.

### Cursor Handoffs Produced This Session

| Handoff | Target File | Purpose |
|---|---|---|
| `HANDOFF-v1.2-buyer-side-protocol.md` | `docs/protocols/New_Buyer_Side_Session_Protocol.md` | 7-change surgical update mirroring the seller-side protocol's structure into buyer-side. Applied this session — confirmed complete. |
| `HANDOFF-2026-06-30-session-log-020.md` | `docs/project/Project_Session_Log.md` | This entry |

### Documents Created This Session

| Document | ID | Version | Location |
|---|---|---|---|
| Seller Under Contract — Session Protocol | WORKFLOWS-SELLER-001 | 1.1 | `docs/protocols/Seller_Under_Contract_Session_Protocol.md` (Andrew placed directly — no handoff) |

### Documents Updated This Session

| Document | ID | Version | Changes |
|---|---|---|---|
| New Buyer Side Session Protocol | — | 1.1 → 1.2 | Land Contracts section added; Known Limitations (4 items) + division-of-labor table + omit-reason taxonomy ported from seller-side; Step 1 label-creation language corrected to reflect no create-label tool exists; missing-signatures rule added |

---
*Next session: Close out the two flagged stale-reference gaps (`PREAUTOMATION-001`, `TRANSACTION_WORKFLOWS_FRAMEWORK.md`); add a signage/vendor-preference field to Agent Profiles.*
```

---

No other changes to `Project_Session_Log.md`.

```bash
git add -A
git commit -m "Session 020 log entry: WORKFLOWS-SELLER-001 created, buyer-side protocol mirrored to v1.2, 4 Aframe API limitations confirmed (task omission, date/attachment templates, transaction events, Gmail label create/rename)"
git push origin main
```

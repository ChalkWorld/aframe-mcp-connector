---
title: Cursor Handoff — New_Buyer_Side_Session_Protocol.md — v1.2
document_id: HANDOFF-v1.2-buyer-side-protocol
date: 2026-06-30
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to `docs/protocols/New_Buyer_Side_Session_Protocol.md`. Do not modify anything not listed here.

## Change 1 — Version header bump

Updates the version number and date to reflect this revision.

**Find**
```
# New Buyer Side Session Protocol
**Version 1.1** | *Last Updated: June 23, 2026*
*Claude-facing SOP | Generic — applies to all agents and file types*
```

**Replace with**
```
# New Buyer Side Session Protocol
**Version 1.2** | *Last Updated: June 30, 2026*
*Claude-facing SOP | Generic — applies to all agents and file types*
```

---

## Change 2 — Correct Step 1 label-creation language

There is no Gmail create-label tool available to a session — `label_thread`/`unlabel_thread` and the message-level equivalents only add or remove an existing label. This corrects the step to reflect that boundary instead of asserting a capability that doesn't exist.

**Find**
```
4. Create a Gmail label following the naming convention: `Lennar/[Address]` or the applicable parent label structure
5. Apply the label to all relevant threads found
```

**Replace with**
```
4. **Label creation is UI-only.** There is no create-label tool available to a session — `label_thread`/`unlabel_thread` and their message-level equivalents only add or remove an *existing* label. If the address label doesn't already exist (check via `list_labels`), flag it for Andrew to create in the handoff summary (Step 10) following the naming convention: `Lennar/[Address]` or the applicable parent label structure
5. If the label already exists, apply it to all relevant threads found via `label_thread`
```

---

## Change 3 — Add Land Contracts section after Step 3

Land contracts are a subset of standard contracts, not a parallel workflow. This section scopes the differences (fewer contingencies, one added date, fewer tasks) rather than duplicating the full extraction list.

**Find**
```
**Signature Verification**
Review all required signatures at intake and flag any that are missing or incomplete. *(See sub-protocol: Signature Verification — to be developed)*

---

## Step 4 — Extract & Present Participant Data
```

**Replace with**
```
**Signature Verification**
Review all required signatures at intake and flag any that are missing or incomplete. *(See sub-protocol: Signature Verification — to be developed)*

---

## Land Contracts — What's Different

A land contract is a subset of the standard contract, not a parallel workflow — most of Step 3's extraction list still applies. The differences:

- **Fewer contingencies** — no home inspection paragraph, no well/septic/WDI in the residential sense (a land deal may still have soil-related contingencies, see below), no home warranty
- **One addition: Soil and Feasibility Study Due Diligence Date** — extract this date from the contract the same way EMD due date or inspection deadline is extracted on a standard contract. This is the land-specific deadline that doesn't exist on residential contracts and needs its own entry once the dates template is applied.
- **Fewer tasks** — the land task template (`New Pending Buyer - Land`, ID 22937 — confirm current ID via `list_task_templates` before applying, template IDs can change) reflects the reduced contingency set; do not also apply the standard inspection checklist templates (29492/40225) unless the land contract specifically includes a property inspection contingency

Everything else in this protocol — contact rules, merge field formatting, participant roles, the Known Limitations section — applies the same way to a land file as a standard one.

---

## Step 4 — Extract & Present Participant Data
```

---

## Change 4 — Add land row to Step 9 task template table

Surfaces the land template choice at the point templates are actually applied, alongside the standard template.

**Find**
```
| New Pending Buyer - color coded for stages | 29491 | Always |
```

**Replace with**
```
| New Pending Buyer - color coded for stages | 29491 | Always (standard, non-land contracts) |
| New Pending Buyer - Land | 22937 | Land contracts only — replaces 29491, see Land Contracts section above |
```

---

## Change 5 — Add Known Limitations, division of labor, and Step 9b before the handoff summary

Ports the four confirmed API boundaries (date/attachment templates, task omission, transaction events, Gmail label creation) and the omit-reason taxonomy from the seller-side protocol (`WORKFLOWS-SELLER-001`), since these are connector-wide limitations that apply equally to buyer-side files.

**Find**
```
**Notes:**
- Informational-only inspections (waived repair rights) do not trigger an inspection checklist
- Template 29819 (Buyer Side New In-take Checklist) is triggered automatically by Zapier — do not apply manually
- If inspection repairs are later requested, the inspection checklist can be added at that time

---

## Step 10 — Session Handoff Summary
```

**Replace with**
```
**Notes:**
- Informational-only inspections (waived repair rights) do not trigger an inspection checklist
- Template 29819 (Buyer Side New In-take Checklist) is triggered automatically by Zapier — do not apply manually
- If inspection repairs are later requested, the inspection checklist can be added at that time

---

## Known Limitations — What This Session Cannot Do

These are hard boundaries as of 2026-06-30, not pending build items. Each has a different cause and a different chance of changing:

**1. Date templates and attachment templates — no API endpoint exists at all.** There is no `list_date_templates` or `apply_date_template` equivalent to `apply_task_templates`. Same for attachment templates. This is a permanent UI-only action unless Aframe adds these endpoints — not a gated/future-tool situation like task omission below. Andrew applies the correct template (Standard / AS-IS / CASH / AS-IS+CASH / Land / New Construction) directly in the Aframe UI.

**2. Task omission — endpoint exists, capability was removed.** As of the Aframe API changelog dated 2026-05-29, the `omitted` field was removed from all Task, Event, and Transaction Attachment request/response DTOs. `PATCH /tasks/{taskId}` rejects an omitted task with `404`, and omitted tasks are filtered from all GET responses, matching the Aframe web app's own behavior. **This means a session can identify which tasks should be omitted and why, but cannot execute the omit itself, full stop.** This used to be an open question; it's now answered, in the negative — financing, HOA, well, septic, and admin-fee conditional tasks all fall under this limit.

**3. Transaction events — read-only.** Events (the items populated by a dates template) can be read via `search_transactions` with `includes: ["EVENTS"]`, which is genuinely useful for verification — it can catch a wrong-template application (e.g. standard applied instead of cash, leaving appraisal/loan-application events present on a cash deal) before it sits unnoticed in the file. But there is no write tool of any kind for Aframe transaction events — no create, no update, no omit. All event entry and correction is Andrew's work in the UI.

**4. Gmail label creation and renaming — no tool exists.** `label_thread`/`unlabel_thread` and the message-level equivalents only add or remove an *existing* label from a thread or message. There is no tool to create a new label or rename/move an existing one. A session can find, apply, and remove existing labels — it cannot create or restructure them (see Step 1).

### Division of labor that follows from these limits

| Who | Owns |
|---|---|
| Session | Contacts, participants, merge fields, transaction core fields (price/dates/status), task template application, verification reads, applying existing Gmail labels to relevant threads |
| Andrew | Date template selection and application, attachment template application, event entry/correction, task omission in the UI, Gmail label creation |
| Joint | Final review pass over the complete file before considering it done |

---

## Step 9b — Identify Tasks for Omission (Flag, Don't Execute)

Since task omission is UI-only (see Known Limitations), the session's job is to identify candidates and the reason for each — not to act on them. Reasons fall into different categories with different shelf-lives, and the protocol should preserve that distinction rather than flattening every omit into the same bucket:

- **Contract-driven, file-specific but logic is standing** — e.g. a financing-flag task when the deal is cash, a well/septic task when the property has neither. The same logic re-applies to every future file; only the contract fact changes.
- **Agent-preference, file-specific because of who the agent is** — e.g. a task omitted because a specific agent self-handles something a task assumes Andrew or the agent does generically. The fact belongs to the agent, not the file; check Agent Profiles first, and flag for an Agent Profiles update if the preference isn't documented yet.
- **Standing process rule, applies to every file regardless of contract or agent** — e.g. a step that's paused company-wide pending a template or process Andrew hasn't built yet, or a courtesy step Andrew has decided isn't worth doing for established agent relationships anymore.
- **Temporarily parked, not actually omitted** — blocked on something outside the file's control (e.g. waiting on portal access or a missing credential). These should stay open, not be omitted, since the work still needs to happen once the blocker clears.

Present the list with reasons in the session handoff (Step 10) rather than as a flat checklist of task names.

---

## Step 10 — Session Handoff Summary
```

---

## Change 6 — Update Step 10 handoff checklist

Replaces the two vague template-application bullets with explicit UI-only framing matching the seller-side protocol, and adds the Gmail label, event-entry, and task-omission-list items surfaced by Change 5.

**Find**
```
- [ ] Apply date template and enter all key dates
- [ ] Apply attachment template
```

**Replace with**
```
- [ ] Create the Gmail label if it didn't already exist (UI-only — no create-label tool available)
- [ ] Apply the correct dates template (Standard / AS-IS / CASH / AS-IS+CASH / Land / New Construction) — UI-only, no API endpoint
- [ ] Apply the correct attachments template — UI-only, no API endpoint
- [ ] Enter or correct any transaction events not auto-calculated by the dates template (UI-only)
- [ ] List of tasks identified for omission, with reasons (see Step 9b) — Andrew actions these in the UI
```

---

## Change 7 — Add missing-signatures rule to General Rules & Notes

**Find**
```
- **Ratification date = task template start date** — always use the contract's effective/ratification date, not today's date
```

**Replace with**
```
- **Ratification date = task template start date** — always use the contract's effective/ratification date, not today's date
- **Check for missing signatures** — every signature line on the contract and every required addendum should be reviewed at intake; a missing or incomplete signature is a compliance issue, not a cosmetic one, and gets flagged in the handoff summary (Step 10) regardless of how minor it looks
```

---

No other changes to `New_Buyer_Side_Session_Protocol.md`.

```bash
git add -A
git commit -m "Buyer-side protocol v1.2: add Land Contracts section, port Known Limitations (incl. Gmail label creation) / omit-taxonomy / division-of-labor from seller-side protocol, correct Step 1 label-creation overclaim, add missing-signatures rule"
git push origin main
```

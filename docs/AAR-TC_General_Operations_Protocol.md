# AAR-TC General Operations Protocol
**Document ID:** AAR-TC-OPS-PROTO-001
**Version:** 1.0 | *Last Updated: June 24, 2026*
*Claude-facing SOP | Non-file-specific business operations*

---

## Purpose

This document governs session behavior for tasks that are not tied to a specific transaction or listing workflow. Where the buyer-side, seller-side, and Lennar protocols govern file-triggered work, this document governs everything else — recurring maintenance tasks, inbox management, and general business operations that fall outside the other protocol documents.

---

## Document Index

| Section | Topic | Status |
|---|---|---|
| 1 | Sent Folder Label Sweep | Active |
| 2 | Inbox Triage and Labeling | Stub — to be documented |
| 3 | General Guidance and Best Practices | Active |

---

## Section 1 — Sent Folder Label Sweep

### Purpose

Gmail does not auto-label outgoing emails. The sent folder sweep is a recurring maintenance task that finds sent emails with no file label and applies the correct label so that every property address folder shows a complete email record — including outgoing correspondence that never received a reply.

This matters for two reasons: it keeps the file record complete for compliance and reference, and it surfaces unanswered sent emails that may need a follow-up.

### Frequency

Once daily or every couple of days. Never skip more than 5 days — the 5-day search window is a hard limit and exists to prevent token-expensive full-inbox sweeps. Sweeps that fall behind more than 5 days risk gaps in coverage.

### The ! Stages Label System

Andrew's Gmail includes a parallel label set — `! Stages` — designed for batching emails by workflow stage and time-blocking when they get dealt with. The stages are:

- `1 New Contracts`
- `2 New Listings`
- `3 Compliance`
- `4 Lending/Finance`
- `5 Pre-Closing`
- `6 Post-Closing`
- `7 Emergency`
- `8 30 seconds or less`

This system was developed based on recommendations from David Breckheimer — coach, consultant, and founder of [Cultivate Wins](https://www.cultivatewins.com), a coaching and training resource for real estate agents and independent TCs — for managing inbox volume through time-blocking. **The Stages labels are not currently in active use** and should not be applied during sweeps. They are documented here because they may be integrated into the inbox triage workflow in the future (see Section 2).

---

### Step-by-Step Protocol

---

#### Step 1 — Check for Label List in Session Context

Before running any Gmail calls, check whether the full Gmail label list has already been loaded in the current session context. If it is present, use it — do not re-fetch it.

If the label list is not in context, run:

```
Gmail:list_labels (pageSize: 500)
```

Store the result mentally for the duration of the session. The label list is the map — every subsequent matching decision depends on it.

---

#### Step 2 — Fetch Unlabeled Sent Threads

Search for sent threads with no user labels, limited to the past 5 days:

```
Gmail:search_threads
  query: "from:me newer_than:5d -has:userlabels"
  view: THREAD_VIEW_METADATA_ONLY
  pageSize: 50
```

`THREAD_VIEW_METADATA_ONLY` returns subject lines and recipient data without body content. This is the correct view for this step — subject lines resolve the majority of threads and body content is only needed for exceptions.

**The 5-day window is non-negotiable.** Do not widen it. Do not run without a date constraint. A full sent-folder sweep without a time filter burns tokens unnecessarily and is not authorized.

---

#### Step 3 — Match Threads to Labels

Work through each thread returned. For each thread:

**Primary signal — subject line.** The address will be in the subject line the majority of the time. Match the address in the subject line to the corresponding label in the label list. Active file labels follow the pattern:

- `@ TC Transaction Folder/[address]` — standard TC files
- `@ TC Transaction Folder/! Future and Active Listings/[address]` — listing-side pre-contract
- `Lennar/[address]` — Lennar listings

**Secondary signal — recipients.** If the subject line does not contain an address, look at the To and CC recipient list. Familiar combinations (e.g., kelly.asmartmove + lance.taylorrealtyteam + a third party) often identify the file. Cross-reference against known active files.

**Tertiary signal — full thread content.** If subject and recipients are not sufficient, fetch the full thread:

```
Gmail:get_thread (threadId: [id])
```

These emails are typically short. Read the content and identify the property address or file context.

**Cannot identify — flag for Andrew.** If none of the above resolves the file, add the thread to the ambiguous list. Do not guess. Do not skip.

---

#### Step 4 — Apply Labels

For all threads with a confirmed match, apply the label at the thread level:

```
Gmail:label_thread
  threadId: [id]
  labelIds: ["[label_id]"]
```

Labels always apply to the entire thread — never to individual messages. A labeled thread covers all messages in it, past and future.

Process all confident matches before moving to ambiguous cases.

---

#### Step 5 — Handle Errors

If a `label_thread` call returns a "not found" error:

1. Check whether the thread ID has merged into a parent thread that is already labeled
2. If the parent thread is labeled, the file is covered — log it and move on
3. If the parent thread cannot be identified, add it to the ambiguous list for Andrew

Do not stall the sweep on a single error. Continue processing remaining threads.

---

#### Step 6 — Present Ambiguous Threads to Andrew

After all confident labels have been applied, present any unresolved threads in a clean list:

- Thread subject line (or best description if no subject)
- Sender and primary recipients
- A one-line summary of what the email appears to be about
- Ask Andrew which label to apply

Apply Andrew's answers and label those threads before closing the sweep.

---

#### Step 7 — Sweep Summary

Close the sweep with a brief summary:

- Total threads found
- Total labeled automatically
- Total flagged and resolved with Andrew's input
- Any errors encountered and how they were handled

---

### Key Rules (Quick Reference)

- **Label list first** — check session context before fetching; only fetch if not already loaded
- **5-day window hard limit** — never run without `newer_than:5d`
- **Metadata view first** — use `THREAD_VIEW_METADATA_ONLY`; only fetch full thread if subject and recipients don't resolve the file
- **Thread-level labeling only** — always `label_thread`, never `label_message`
- **Batch ambiguous cases** — flag unknowns, finish confident labels, then ask Andrew at the end
- **Never guess** — if the file can't be identified confidently, it goes to Andrew

---

## Section 2 — Inbox Triage and Labeling

*Stub — to be documented in a future session.*

This section will cover the protocol for sweeping the inbox (rather than the sent folder) and applying file labels to incoming emails. Topics to address will include:

- Search query and scope for inbox sweeps
- Handling emails that arrive mid-thread on already-labeled threads
- Handling new threads that open a new file or conversation
- Integration with the `! Stages` label system (time-blocking workflow) if and when that system is activated
- Rules for emails that don't belong to any file (vendor emails, referrals, general TC comms)

---

## Section 3 — General Guidance and Best Practices

### Token Efficiency

Search scope should always be as narrow as the task requires. Time-bounded queries (`newer_than:Xd`) are mandatory for any recurring sweep. Open-ended searches of the full inbox or sent folder are not authorized without explicit instruction from Andrew.

### Label List Reuse

The Gmail label list is large and expensive to fetch. Within a session, always check context before fetching it again. If it was loaded earlier in the same conversation, use it.

### Confidence Threshold

When matching a thread to a label, the standard is confident identification — not best guess. An address match in the subject line is confident. A recipient pattern that clearly points to one file is confident. An inference from body content that could apply to more than one file is not confident — flag it.

### When to Stop and Ask

A session should not barrel through ambiguous cases to avoid interrupting the sweep. Unidentified threads go to the ambiguous list. The cost of a wrong label is higher than the cost of asking.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

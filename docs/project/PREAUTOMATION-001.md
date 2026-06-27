---
title: Pre-Automation Cleanup Checklist — Aframe UI Task List Redesign
document_id: PREAUTOMATION-001
version: 1.1
version_date: 2026-06-17
status: Active — Actionable Checklist
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted planning
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Pre-Automation Cleanup Checklist
### Aframe UI Task List Redesign | Document ID: PREAUTOMATION-001

---

## Why This Exists

The `search_tasks` and `update_task` connector tools — which enable conditional task omitting after template application — are **gated** on this cleanup work being done first. Building task management automation against the current templates would be writing protocol against the wrong structure. Once templates are redesigned and the omit conditions are documented here, the buyer-side workflow protocol (`WORKFLOWS-BUYER-001`) can be written and the gated tools can be built.

**This is Andrew's work in the Aframe UI.** It does not require a Claude session. Bring the completed documentation back to a session when done.

**Reference:** `VISION-001 § 5` ("Fix It First") and `CONNECTOR-ROAD-001` v2.0 (Tier 2, Cluster B gating note).

---

## The Structural Pattern to Implement

The existing financing flag in Aframe task templates is the model. There is currently a parent task like **"Financing: YES / NO"** — and the way it works in practice (and in the protocol) is:

- **Marking the flag task complete = YES.** The condition is present; child tasks are active and should be worked.
- **Omitting the flag task = NO.** The condition is absent; the flag task and all its children get omitted together.

Every other conditional task cluster needs to follow this exact same pattern. The flag task is both the switch and the signal — completing it confirms the condition is present, omitting it suppresses the entire cluster.

The goal is: **every task that is not always applicable has a boolean flag parent task**, and the flag name + its child tasks are documented in the omit map at the end of this checklist.

> **⚠️ Prerequisite — `PATCH /v1/tasks/{taskId}` must be extracted before the protocol can be written.**
>
> The connector's `update_task` tool will need to set a task's omit status programmatically, but `PATCH /v1/tasks/{taskId}` has not yet been extracted from Swagger — the field name for omitting a task (e.g. `isOmitted`, `status: "omitted"`, or similar) is unknown. A dedicated extraction session is needed before `WORKFLOWS-BUYER-001` can specify the omit behavior precisely. This does not block Andrew's UI work in Sections 1–3, but it does mean the protocol spec cannot be finalized until that extraction is done. Add it to the extraction queue alongside the participant endpoints.

---

## Section 1 — Task List Redesign (Highest Priority)

Work through each buyer-side task template. The steps below apply to each one.

### Step 1.1 — Audit for conditional tasks

Open the template in the Aframe UI. Go through every task and classify it:

- **Always applicable** — task applies to every transaction regardless of property or deal type. No flag needed.
- **Conditionally applicable** — task only applies when a specific property feature or deal condition is present.

Mark every conditional task. If you are unsure whether a task is conditional, assume it is and document the condition. You can always promote it to "always applicable" later; it is harder to add the condition logic retroactively.

### Step 1.2 — Define the boolean flag for each condition

For each conditional task (or group of related conditional tasks), name the boolean flag it depends on. Flags should be:

- A simple YES/NO question about the property or deal
- Phrased consistently (e.g., "HOA: YES / NO", not "HOA exists" in one template and "HOA required" in another)
- As few flags as possible — if two tasks depend on the same condition, they share one flag

**Expected flags (confirm, revise, or add to this list as you audit):**

| Flag | Condition it represents |
|---|---|
| Financing: YES / NO | Deal involves a financed purchase (already exists — verify it covers all financing-related tasks) |
| HOA: YES / NO | Property is in an HOA |
| Well: YES / NO | Property has a private well |
| Septic: YES / NO | Property has a private septic system |
| Admin Fee: YES / NO | Deal involves an admin or transaction fee payable to the brokerage |
| Survey: YES / NO | Survey is required or ordered (if survey tasks vary by deal — confirm) |
| *(Add others as discovered during audit)* | |

> **Note:** If a task depends on a combination of flags (e.g., "only if HOA AND seller is providing resale cert"), use the more specific flag as the parent and note the secondary condition in the task description. Do not create compound flags.

### Step 1.3 — Add flag tasks at the top of each template

For each flag identified in Step 1.2, add a parent task at the top of the template (or in a clearly labeled "PROPERTY FLAGS" group at the top). The task should be structured identically to the existing financing flag. Suggested format:

```
[ ] HOA: YES (complete this task if property is in an HOA; omit to suppress all HOA tasks)
      [ ] Order HOA Documents
      [ ] Verify HOA Resale Certificate received
      [ ] *(other HOA tasks as children)*
```

The flag task's completion state is the switch: **complete = condition present**, **omit = condition absent, suppress all children**. The flag task description should make this clear so it's self-explanatory to anyone working the file manually.

### Step 1.4 — Make conditional tasks children of their flag

For each conditional task, move it to be a child of its parent flag task. If it is already in the right location but not a child (i.e., it is a sibling at the same level as the flag), restructure it.

Verify: omitting the flag task omits the entire cluster with it. That is the behavior the protocol will rely on.

### Step 1.5 — Document the omit map

For each flag, record the complete omit logic in the table in **Section 4** of this document. This table becomes the protocol spec for `update_task` omit behavior in `WORKFLOWS-BUYER-001`.

---

## Section 2 — Date Template Cleanup

### Step 2.1 — Audit each date in each dates template

Open the dates template(s) for buyer-side transactions. Go through every date field and classify it:

- **Always present** — this date applies to every transaction. Should always be entered (or left blank if unknown at time of setup, but never omitted).
- **Conditional** — this date only applies when a specific condition is true.

### Step 2.2 — Name the condition for each conditional date

For each conditional date, record: what condition makes it applicable? Use the same flag vocabulary from Section 1 where possible. Examples:

- "Financing Contingency Deadline" — conditional on Financing: YES
- "Well Inspection Deadline" — conditional on Well: YES
- "HOA Document Review Deadline" — conditional on HOA: YES
- "Survey Deadline" — conditional on Survey: YES

### Step 2.3 — Replace the generic omit instruction with a per-date condition list

The current template likely includes a generic instruction like "MARK ANY DATES NOT NEEDED AS OMITTED." Replace this (or document alongside it) with an explicit per-date condition list. Format:

```
Date: Financing Contingency Deadline
  Applicable when: Financing = YES
  Omit when: Financing = NO (cash deal)

Date: HOA Document Review Deadline
  Applicable when: HOA = YES
  Omit when: HOA = NO

Date: Well Inspection Deadline
  Applicable when: Well = YES
  Omit when: Well = NO
  
*(etc.)*
```

Record the complete list in **Section 5** of this document. This becomes the protocol spec for date omit logic in `WORKFLOWS-BUYER-001`.

### Step 2.4 — Note the date template ID

> **Known gap:** There is no Aframe API endpoint for listing date templates. The template ID must be documented manually here so it can be hardcoded into `WORKFLOWS-BUYER-001`.

Find the date template ID(s) in Aframe. Record them in **Section 5** alongside the per-date condition list.

---

## Section 3 — Attachment Template Review

### Step 3.1 — Verify HOA Resale Certificate omit condition

Confirm the HOA Resale Certificate attachment slot has a clear omit condition: omit when HOA = NO.

Is the omit condition currently documented or enforced in the template? **[ ] Yes / [ ] No / [ ] Needs clarification**

If no: add a note to the attachment slot description stating the condition.

### Step 3.2 — Verify Well/Septic report omit condition

Confirm the Well inspection report and Septic inspection report attachment slots each have a clear omit condition: omit when Well = NO or Septic = NO, respectively.

Well report slot:  **[ ] Has clear omit condition / [ ] Missing / [ ] N/A**
Septic report slot: **[ ] Has clear omit condition / [ ] Missing / [ ] N/A**

### Step 3.3 — Verify WDI (Wood-Destroying Insect) report omit condition

Confirm the WDI report attachment slot has a clear omit condition. (WDI may be always required in VA — confirm whether this is "always applicable" or conditional on deal terms.)

WDI slot:  **[ ] Always required / [ ] Conditional — condition: ________________**

### Step 3.4 — Verify alignment with task and date flags

The attachment template omit conditions should use the same boolean flags as the task and date templates. Confirm that HOA, Well, and Septic flags are consistent across all three template types.

**[ ] Aligned / [ ] Inconsistency found — note: ________________**

---

## Section 4 — Task Omit Map (fill in after audit)

*Complete this section as you work through Section 1. This table is the input for the `update_task` protocol spec in `WORKFLOWS-BUYER-001`.*

| Flag | Flag value | Tasks to omit |
|---|---|---|
| Financing | NO (cash deal) | *(list tasks)* |
| HOA | NO | *(list tasks)* |
| Well | NO | *(list tasks)* |
| Septic | NO | *(list tasks)* |
| Admin Fee | NO | *(list tasks)* |
| Survey | NO | *(list tasks — if applicable)* |
| *(add rows as needed)* | | |

---

## Section 5 — Date Omit Map and Template IDs (fill in after audit)

*Complete this section as you work through Section 2.*

### Date template IDs

| Template name | Aframe template ID |
|---|---|
| *(buyer-side dates template name)* | *(ID)* |
| *(add rows as needed)* | |

### Per-date condition list

| Date field | Always / Conditional | Applicable when | Omit when |
|---|---|---|---|
| *(date name)* | *(always / conditional)* | *(condition or "always")* | *(condition or "never")* |
| *(add rows for each date in the template)* | | | |

---

## Done-When

This document is complete and ready to hand back to a session when:

- [ ] Every conditional task in every buyer-side task template has a boolean flag parent
- [ ] The task omit map in Section 4 is fully filled in
- [ ] The date omit map in Section 5 is fully filled in, including template IDs
- [ ] Attachment template slots for HOA, Well, Septic, and WDI have documented omit conditions
- [ ] All three template types (tasks, dates, attachments) use consistent flag names

When done, bring this document back to a session. That session will write `WORKFLOWS-BUYER-001` using Section 4 and Section 5 as the protocol spec inputs — **and** will need the `PATCH /v1/tasks/{taskId}` endpoint extracted so the omit field name is known before the protocol can be finalized.

---

## After This Checklist Is Complete

Two things happen in parallel:

- **Extract `PATCH /v1/tasks/{taskId}`** from Swagger (using `EXTRACTION-PROC-001`) to confirm the field name for omitting a task. This is required before `WORKFLOWS-BUYER-001` can specify the omit behavior precisely.
- **Write `WORKFLOWS-BUYER-001`** using Sections 4 and 5 as the protocol spec inputs.

Then the gated tools (`search_tasks`, `update_task`) get built. Then a full end-to-end buyer-side intake session runs without manual UI steps.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Fill in Sections 4 and 5 in the Aframe UI, then bring this back to a session.*

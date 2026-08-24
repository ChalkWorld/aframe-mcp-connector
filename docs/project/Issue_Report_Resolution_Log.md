---
title: Issue Report Resolution Log
document_id: AAR-TC-PROJ-IR-LOG-001
version: 1.1
version_date: 2026-08-24
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Transaction Services (Authoring Project)
---

# Issue Report Resolution Log

*Durable record of Issue Reports received from operational Claude projects, the triage decisions made against them, and the resolutions that landed.*

---

## Purpose

Operational Claude projects (Lennar, and future builders/deal types) escalate to the authoring project via Issue Reports — the single defined channel for surfacing schema gaps, doc ambiguities, extension bugs, DOM drift, or any situation where a documented pattern didn't cover what the session encountered. This document is the authoring project's inbound-side counterpart: the log of what those reports contained, what root cause was identified, and what changed in response.

Issue Reports themselves are ephemeral. They arrive as markdown files, get triaged in an authoring session, and are discarded once the resolution (or deferral) is captured here. The value of an Issue Report is not the ticket — it is the shift in the doc set or the code it triggered. This log captures that shift durably; the ticket does not need to.

---

## Relationship to Existing Docs

- **Operational-side rules** for producing Issue Reports live in `docs/operational/lennar/Lennar_Project_Protocol.md` §4.2 (and equivalent sections in future operational projects). Those rules are not restated here.
- **`docs/project/Project_Session_Log_v2.md`** captures what an authoring session did. This log captures what an incoming ticket triggered. They complement each other — a resolution that lands via a Cursor handoff will appear in the session log (as a handoff produced) and here (as a resolution logged), cross-referenced.
- **`CURSOR-HANDOFF-PROTOCOL-001`** governs the mechanics of any handoff that carries a resolution. This log tracks the *reason* for the handoff; the handoff itself follows normal protocol.

---

## What This Doc Is / Is Not

**Is:**
- The durable record of Issue Reports received, triaged, and resolved or deferred
- A pattern-recognition tool — repeat classes of issue become visible over time by scanning entries
- The inbound counterpart to the outbound Issue Report rules in the operational protocols

**Is not:**
- A ticket tracker — Issue Report .md files themselves are not committed to the repo and not preserved after resolution
- A general-purpose bug log — only Issue Reports from operational sessions land here, not issues discovered inside authoring sessions (those go in the session log)
- A replacement for the session log — the session log records what the authoring session did; this log records what triggered it

---

## Ticket-Handling Workflow

1. **Ticket arrives.** Andrew receives an Issue Report .md file from an operational session and uploads it to the authoring project when ready to triage.
2. **Triage.** An authoring session reads the ticket, discusses root cause and resolution options with Andrew, and produces either:
   - **A resolution plan** — typically one or more Cursor handoffs for code/schema/doc changes, following normal handoff protocol
   - **A deferral decision** — with a documented reason (blocked on an external dependency, low-severity, requires a separate authoring pass, etc.)
3. **Resolution lands.** When the handoff commits (or the deferral is finalized), a log entry gets added to this doc via the same handoff run, or a small follow-up handoff.
4. **Ticket discarded.** The Issue Report .md file is not committed to the repo. Andrew may keep local copies if useful, but the durable artifact is this log entry.

---

## Log Entry Structure

Each entry captures:

- **Date** — when the resolution (or deferral) landed
- **Title** — short descriptive phrase; entries share dates get distinguished by title
- **Source** — which operational project, which session/beat/listing surfaced it
- **Ticket ID or reference** — if the ticket carried one; otherwise a brief identifier
- **Issue summary** — what the operational session encountered, in a sentence or two, paraphrased not verbatim
- **Root cause** — what was actually wrong (schema gap, extension bug, doc ambiguity, DOM drift, tool limitation, etc.)
- **Resolution** — what changed, with commit reference and/or Cursor handoff name; if deferred, the deferral decision and the trigger for revisiting
- **Pattern / lesson** *(optional)* — the durable insight, if any. Not every ticket teaches something beyond itself. When one does, name it here so the pattern is discoverable later.
- **Related** *(optional)* — links to the session log entry, related Cursor handoffs, or other resolution log entries in the same class

Empty sections are omitted from the entry rather than left blank.

---

## Entry Convention

- Entries are ordered chronologically (oldest first, newest at the bottom).
- Entries are identified by date and title, not by sequential number. Multiple entries on the same date are permitted and distinguished by their titles.
- Entry heading format: `## YYYY-MM-DD — Short descriptive title`

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-08-20 | Initial version. Written to receive the first Issue Reports from the operational Lennar project once it stands up. |
| 1.1 | 2026-08-24 | First two entries logged — Creekside Run TH Listing Info cascade failure and Heating/Heat Fuel wrong-code bug, both from the 6122 Hull Street Road intake. File added to the repo for the first time this revision (previously existed only as a project-attached file, per `REPO_STRUCTURE.md`'s 2026-08-24 regeneration). |

---

## 2026-08-24 — Creekside Run TH Listing Info blank cascade (county_city display-text mismatch)

- **Source:** Operational Lennar project, live session, 6122 Hull Street Road (Creekside Run TH), MLS# 2623026.
- **Ticket:** `ISSUE-2026-08-24-creekside-run-th-listing-info-path-mismatch.md`
- **Issue summary:** Every Lennar-scoped Matrix tab filled cleanly via the extension except Listing Info, which came back entirely blank and had to be entered manually. The session's initial hypothesis was a path mismatch — that Matrix had actually run the "new" flow instead of the documented `taxid` path for this community.
- **Root cause:** Not a path mismatch — Andrew confirmed Matrix genuinely presented the Tax ID path. The Airtable Community Reference DB's `County` column held `"Richmond City"` (display text) instead of the CVRMLS stored value `Input_29` expects, `"Richmond"` (per `docs/cvrmls/CVRMLS_County_City_Reference.md`). Because `listing.county_city` is the one field the extension actively writes on every path — needed to fire the location cascade even when Matrix has already pre-populated it from the tax record — the invalid value silently clobbered Matrix's own pre-population. Assigning an unmatched value to a `<select>` fails with no thrown error, so the cascade (Area/ZIP/Post Office/Subdivision/Schools) went blank with nothing logged, matching the reported symptom exactly. Cross-check: the same payload's school values were correctly translated to their stored form (`"RiverCity"` not `"River City"`), showing the translation step is understood and applied elsewhere but was missed for this one field.
- **Resolution:** Corrected the single Airtable record for Creekside Run TH (`County`: `"Richmond City"` → `"Richmond"`). No schema/column change — every other active community's `County` value already matched its CVRMLS stored value exactly (Chesterfield, Henrico). `Lennar_Payload_Schema.md` (operational, `docs/operational/lennar/`, `LENNAR-OPS-SCHEMA-001`) §4.1 updated to v1.1, stating the requirement explicitly for any future community.
- **Pattern / lesson:** The Airtable Community Reference DB is meant to hold the exact value Matrix needs, not a human-readable label requiring a translation step — a translation step is exactly the kind of thing a session can silently skip under load. The same pattern caused the Heating/Heat Fuel issue found the same day (see next entry). Separately, this ticket's resolution was drafted twice — the first draft targeted the frozen authoring-lineage schema doc (`docs/lennar/Lennar_Payload_Schema.md`, superseded) before the operational doc's real location (`docs/operational/lennar/`) was confirmed against a freshly regenerated `REPO_STRUCTURE.md`. Worth checking which doc lineage is actually live before drafting a fix, not just which one is attached to the authoring project.
- **Related:** `ISSUE-2026-08-24-creekside-run-th-heating-fuel-code-gap.md` (same intake, same root pattern).

---

## 2026-08-24 — Creekside Run TH Features B wrong Heating/Heat Fuel codes

- **Source:** Operational Lennar project, live session, 6122 Hull Street Road (Creekside Run TH), MLS# 2623026.
- **Ticket:** `ISSUE-2026-08-24-creekside-run-th-heating-fuel-code-gap.md`
- **Issue summary:** Session needed CVRMLS option codes for Heating (`Input_86_*`) and Heat Fuel (`Input_87_*`) for Creekside Run TH. Airtable held only display values ("Heat Pump" / "Electric"), and no crosswalk existed anywhere in the doc set from those display values to Input IDs — the only codes documented anywhere were two unexplained examples in `Lennar_Payload_Examples.md`. Andrew approved proceeding with those example codes (`Input_86_07`/`Input_87_05`) as a working assumption, pending verification in Matrix.
- **Root cause:** `Input_86_07`/`Input_87_05` are the correct codes for "Forced Hot Air"/"Natural Gas" — but Creekside Run TH's actual Airtable values are "Heat Pump"/"Electric", which map to `Input_86_08`/`Input_87_02`. The example payloads in `Lennar_Payload_Examples.md` happened to both be Forced-Hot-Air/Natural-Gas communities (Harpers Mill TH, Watermark SF), so the codes were correct for their own listings but got reused as a generic template without verifying against Creekside Run TH's actual values. Confirmed against the live Airtable table: all 5 active communities resolve to exactly one of two pairs (Forced Hot Air/Natural Gas, or Heat Pump/Electric); Creekside Run TH and Everstone SF are the Heat Pump/Electric pair.
- **Resolution:** The wrong codes had already been written to the live Matrix listing; Andrew corrected it directly. Added `Heating Codes` and `Heating Fuel Codes` columns to the Airtable Community Reference DB table (same pattern as the existing `Community Amenities Codes` column), populated for all 5 active communities with the verified correct Input IDs. `Heating`/`Heating Fuel` display-text columns retained for human reference. `Lennar_Payload_Schema.md` (operational, `docs/operational/lennar/`, `LENNAR-OPS-SCHEMA-001`) §5.2 updated to v1.1 to point sessions at the new columns instead of the unsourced "write the matching code" instruction.
- **Pattern / lesson:** Same as the county_city entry above — a per-community Airtable field holding display text that requires an external crosswalk lookup is a standing risk; the fix in both cases was to make the stored value itself the thing Airtable holds, closing the lookup step rather than documenting it more clearly.
- **Related:** `ISSUE-2026-08-24-creekside-run-th-listing-info-path-mismatch.md` (same intake, same root pattern).

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Log started August 20, 2026 — Issue Report Resolution Log.*

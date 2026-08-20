---
handoff_id: HANDOFF-2026-08-19-operational-doc-set-rewrite
date: 2026-08-19
author: Andrew Rich / Claude
target_agent: Cursor
scope: Three new files in `docs/operational/lennar/` — New Listing Protocol (rewrite from `docs/lennar/` source), Payload Schema (trim from `docs/lennar/` source), Payload Examples (split from Schema §8).
depends_on: HANDOFF-2026-08-19-operational-folder-standup (must land first)
supersedes: None
---

# Handoff: Operational Doc Set Rewrite — Part 2 of 2

## What This Is / Why It Exists

This handoff completes the Lennar operational doc set standup by landing the three remaining files in `docs/operational/lennar/`:

1. `Lennar_New_Listing_Protocol.md` — a rewrite of the authoring source (`docs/lennar/Lennar_New_Listing_Protocol.md` v2.9) scoped for operational use
2. `Lennar_Payload_Schema.md` — a trim of the authoring source (`docs/lennar/Lennar_Payload_Schema.md` v1.5), authoring cruft removed
3. `Lennar_Payload_Examples.md` — a new file containing the two complete payload examples split out from the Schema's §8

The first handoff (`HANDOFF-2026-08-19-operational-folder-standup`) created the folder and landed the Project Protocol and Extension Reference. This handoff builds on those; the operational set is complete once this handoff lands.

**Design context Cursor should understand before executing:**

The operational Lennar project is a downstream Claude.ai project that **executes** Lennar listing intakes using this doc set. It is scope-bound: it does not fix, refine, or extend the workflow — that work happens in the authoring project. Every editorial decision in the rewrites below is oriented toward what the operational session needs to know to do its work, not what an authoring session needs to understand the workflow's history.

The Project Protocol landed in Part 1 (`docs/operational/lennar/Lennar_Project_Protocol.md`) is the **authority** for session lifecycle, behavioral rules, coherency context, and scope boundaries. The New Listing Protocol rewrite references the Project Protocol for those items rather than restating them. This is a deliberate separation of concerns: Project Protocol governs how sessions run; New Listing Protocol governs the workflow steps.

## Files In This Handoff

| File | Action | Source |
|---|---|---|
| `docs/operational/lennar/Lennar_New_Listing_Protocol.md` | Create (rewrite) | Derived from `docs/lennar/Lennar_New_Listing_Protocol.md` v2.9 per §Change 1 spec |
| `docs/operational/lennar/Lennar_Payload_Schema.md` | Create (trim) | Derived from `docs/lennar/Lennar_Payload_Schema.md` v1.5 per §Change 2 spec |
| `docs/operational/lennar/Lennar_Payload_Examples.md` | Create (split) | Extracted from Schema §8, per §Change 3 spec |

The authoring source files under `docs/lennar/` are **not modified** in this handoff — they remain frozen as historical reference per the convention established in Part 1.

---

## Change 1 — Create `docs/operational/lennar/Lennar_New_Listing_Protocol.md` v1.0

### Approach

Read `docs/lennar/Lennar_New_Listing_Protocol.md` v2.9. Produce a rewritten operational version that carries forward what the operational session needs while dropping, tightening, or rewriting per the spec below. The operational version is **not** a diff of v2.9 — it is a fresh derivative doc that starts at v1.0.

### Frontmatter

```
---
title: Lennar New Listing Protocol
document_id: LENNAR-OPS-PROTOCOL-002
version: 1.0
version_date: 2026-08-19
status: Active
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar Operational Project
supersedes: docs/lennar/Lennar_New_Listing_Protocol.md v2.9 (authoring source, frozen)
---
```

### Standing Rules Section — Rewrite Entirely

The authoring source has a set of standing rules including "Session Review Beat," "Surface Ambiguity, Don't Guess," "Activation Double-Check," and various others. In the operational version, this section is rewritten as follows:

- **Session lifecycle behavior** — do not restate. Reference `Lennar_Project_Protocol.md` §3 (Session Lifecycle) as the authority for Intake Beat, Working Beats, Resume Beat, and Session Close. One or two sentences pointing there is sufficient.

- **Ambiguity behavior** — do not restate. Reference `Lennar_Project_Protocol.md` §4.1 (Work Within Documented Patterns, Surface Real Ambiguity) as the authority. Do not carry over v2.9's stricter "Surface Ambiguity, Don't Guess" language — the operational calibration is deliberately different and lives in the Project Protocol.

- **Escalation behavior** — add a new standing rule referencing `Lennar_Project_Protocol.md` §4.2 (Escalation via Issue Report) as the authority. This is net-new to the operational version and did not exist in v2.9.

- **Activation Double-Check** — carry forward. This is a workflow-specific rule (surface ShowingTime, active-listing rep email, and any other post-activation tasks when Andrew reports Active) that lives naturally in the New Listing Protocol, not the Project Protocol. Update the language to reflect current reality: Aframe is out (see Step 9 below), so any Aframe-related reminders drop; ShowingTime toggle reminder stays; Active Listing Email stays (per Step 13 below).

- **Any other authoring-project standing rules** (e.g., rules about Cursor handoffs, doc versioning, session logs) — strip. The operational project has no equivalent activities.

### Systems & Reference Section — Rewrite For Operational Scope

The authoring source's Systems & Reference section carries doc IDs, authoring-context references, and details relevant to authoring workflow. The operational version's Systems & Reference includes only what an operational session actually needs to know:

- **Airtable** — base `app78fMUwDNBHUZ6r`. Community Reference DB table `tbleMbM1WgY8Si2t7`. Listings table — confirm on first access; note in the doc as "TBD — confirm on first access" if the table ID is not available at rewrite time.
- **Google Drive** — folder ID(s) currently used for Lennar property folders. Carry forward from v2.9 if present.
- **Google Sheet** — Sheet ID currently used for the Lennar main tab. Carry forward from v2.9 if present.
- **Cognito Forms** — Form 17 (`LennarNewListingIntake`) as primary intake source.
- **Gmail** — thread ID pattern or label(s) for Lennar rep emails. Carry forward from v2.9 if present.
- **PandaDoc** — current status per Step 10 (see below).

Strip:
- References to `CURSOR-HANDOFF-PROTOCOL-001`
- References to session log documents (`docs/project/Project_Session_Log_v2.md`, etc.)
- References to authoring-only docs under `docs/cvrmls/`, `docs/protocols/`, `docs/project/`
- References to `Payload_Envelope.md` (the envelope contract now lives in the Schema §2)
- References to `Agent_Profiles.md` (Gary is handled by the Matrix account per Project Protocol §2.1)
- References to `Lennar_Community_Reference_Database.md` (Airtable is the authority per Project Protocol §4.3)
- Any references to the retired `Lennar_MLS_DataSheet_TEMPLATE.md` or its `AAR-TC-LENNAR-DS-TPL-001` document ID
- References to `Lennar_Extension_Build.md` (that doc is authoring-only; operational sessions consult `Lennar_Extension_Reference.md` instead)

### Step-By-Step Workflow — Retain With Edits

Carry the step sequence from v2.9 forward with the following changes:

**Step 9 (Create Aframe Transaction) — strip entirely.** Aframe is out of the Lennar workflow per Project Protocol §5.2. Do not carry any Aframe-related steps, task template application logic, or Aframe field-mapping content. Renumber subsequent steps to close the gap.

**Step 10 (PandaDoc Addendum) — tighten significantly.** Current operational state: PandaDoc paid tier is inactive; addendum is sent manually via TransactionDesk. Documented PandaDoc integration exists and is ready to resume when the tier is reactivated. The rewritten Step 10 should state the current-state approach (manual via TransactionDesk) in plain language, and note that PandaDoc automation is available to resume. Strip: full PandaDoc build documentation, historical toggling detail, authoring commentary on why the tier was suspended.

**Step 12 (Session Handoff Summary) — retain with minor updates.** The ShowingTime "No" toggle reminder stays (it exists because Aframe creation is not automating this). If v2.9 lists any Aframe-adjacent handoff items, strip those. Add the manual-Matrix-fields flag (Map, Directions, Subdivision, Post Office) as a standing handoff item, per `Lennar_Extension_Reference.md` §5.

**Step 13 (Active Listing Email) — carry the stub forward, updated.** v2.9 has this as a stub. The operational version keeps it as a stub, updated to reflect the current shape:
- Trigger: when Andrew reports the listing has gone Active
- Recipient roster: TBD
- Content: notify Lennar reps that the listing is active
- Attachment: MLS listing PDF (source TBD — previously the retired DataSheet template, now likely a Matrix-exported listing PDF)
- Note explicitly that this replaces functionality previously handled through Aframe

**Fill Mechanism references — language sweep.** Throughout the doc, replace "bookmarklet(s)" with "extension" where the reference is to the current fill mechanism. Where v2.9 describes the mechanics of clicking a bookmarklet per tab, rewrite to describe the extension flow (paste payload once into side panel, click through tabs, extension fills per tab). Cross-reference `Lennar_Extension_Reference.md` for detail rather than restating.

**References to `Lennar_MLS_DataSheet_TEMPLATE.md` — strip.** This doc is retired per the Session 015 design decision. Anywhere the workflow references generating a data sheet, saving it to Drive, hyperlinking from the Sheet — rewrite for the current reality: session generates payload directly, Andrew reviews field fills in Matrix as the extension populates them, no intermediate data sheet artifact.

**Path Rules by Community — carry forward.** The Matrix Entry Path Rules by Community section (or wherever v2.9 documents which communities use `taxid` vs. `new` path) is operationally live. Carry forward as-is, subject to the language sweep and cross-reference updates above. Path assignments themselves are not changing in this handoff; the schema remains the authority for path values.

**Payload Format Conventions — carry forward.** The format conventions section (checkbox arrays, suffix-only vs. full-ID patterns per target tab, other conventions) is operationally live. Cross-reference to `Lennar_Payload_Schema.md §Format Conventions` remains valid — but update "bookmarklet" language throughout to "extension" where the underlying tool has shifted.

### Version History Section — Fresh Start

Strip the v2.0–v2.9 version history entirely. Replace with:

```
| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-08-19 | Initial operational version. Derived from `docs/lennar/Lennar_New_Listing_Protocol.md` v2.9 (frozen as historical reference). Rewritten for operational scope per Session 015 design. |
```

### Cross-Reference Style

When referencing sibling operational docs, use the pattern:

> `Lennar_Project_Protocol.md` §4.1
> `Lennar_Payload_Schema.md` §Format Conventions
> `Lennar_Extension_Reference.md` §5

Use full filename with `.md`, then §, then the section number or name. No absolute paths (all operational docs live in the same folder). No "the" before doc names.

### Trim Depth

**To the bone.** Where v2.9 carries authoring commentary, historical rationale, session-log references, or explanations of *how the workflow came to be* — strip. The operational doc explains only what the operational session needs to execute the workflow. If content is ambiguous between "operationally needed" and "historically explanatory," err toward strip and rely on the authoring source as the historical record.

### Verification After Commit

- File exists at `docs/operational/lennar/Lennar_New_Listing_Protocol.md`
- Frontmatter version reads `version: 1.0` and `version_date: 2026-08-19`
- No references to Aframe (search: `aframe`, case-insensitive — should return zero matches)
- No references to bookmarklets as the current fill mechanism (search: `bookmarklet` — the word may appear in historical context only, and should be rare or absent)
- No references to Cursor, session logs, `docs/cvrmls/`, `docs/protocols/`, `docs/project/`, `CURSOR-HANDOFF-PROTOCOL-001`, `Payload_Envelope.md`, `Agent_Profiles.md`, `Lennar_Community_Reference_Database.md`, `Lennar_Extension_Build.md`, `Lennar_MLS_DataSheet_TEMPLATE.md`, or `AAR-TC-LENNAR-DS-TPL-001`
- Cross-references to `Lennar_Project_Protocol.md` present for session lifecycle (§3), ambiguity rule (§4.1), Issue Report (§4.2)

---

## Change 2 — Create `docs/operational/lennar/Lennar_Payload_Schema.md` v1.0

### Approach

Read `docs/lennar/Lennar_Payload_Schema.md` v1.5. Produce a trimmed operational version. This is more mechanical than the New Listing Protocol rewrite — most of the schema's content is operationally live and carries forward. The trim is specific to authoring cruft and drift-carrying sections.

### Frontmatter

```
---
title: Lennar Payload Schema
document_id: LENNAR-OPS-SCHEMA-001
version: 1.0
version_date: 2026-08-19
status: Active
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar Operational Project
supersedes: docs/lennar/Lennar_Payload_Schema.md v1.5 (authoring source, frozen)
---
```

### Sections to Carry Forward As-Is (Subject to Language Sweep)

- §1 Purpose — reframe per the "Purpose Rewrite" below
- §2 Payload Envelope for Lennar — carry forward, with the addition described below
- §2.1 The community key — carry forward
- §3 Path Decision by Community — carry forward
- §3.1 Path-specific behavior summary — carry forward
- §4.1 through §4.12 (all tab-by-tab payload shapes) — carry forward
- §5 through §5.5 (Features subset for Lennar) — carry forward
- §5.4.1 Cognito Form 17 mapping — carry forward
- §6 Community Lookup Pointer — carry forward
- §8 Complete Payload Examples — **do not carry forward** — see Change 3
- §Format Conventions (checkbox array format section) — carry forward

### Sections to Strip

- §2.2 Retired `"lennar": true` flag — remove entirely
- §7 Open Verification Items (7.1, 7.2, 7.3) — remove entirely
- §Retirement Notes — remove entirely
- §Format Conventions "Carry-forward for Standard listing schema work" subsection — remove
- §Version History — remove; replaced with a fresh v1.0 entry (see below)

### Purpose Rewrite (§1)

The current §1 references the authoring context (upstream CVRMLS schema, historical community DB, migration notes). Rewrite as follows (adapt language to fit; content is what matters):

> **Purpose.** Runtime source of truth for the payload generated by Lennar operational sessions. Every field a session writes to Matrix via the extension is defined here — payload key, Matrix Input ID, static or resolved value, path-specific behavior, exclusions. This schema is self-sufficient for operational use; sessions do not consult any upstream CVRMLS or universal schema doc.
>
> **Community lookup source.** Airtable base `app78fMUwDNBHUZ6r`, table `tbleMbM1WgY8Si2t7`. Sessions read community reference data (fee_includes, MLS Area, heating, fuel, cooling, pool, community amenities, schools, HOA) directly from Airtable at payload-generation time. See §6.
>
> **Companion doc.** For complete payload examples across the path × home-type matrix, see `Lennar_Payload_Examples.md`.

### Addition to §2 (Envelope)

Add a note within or immediately after §2 stating:

> **Note.** The payload envelope is also read by the Chrome extension at runtime. The envelope contract (keys and values) is stable; extension behavior depends on it.

### §4.8 Cleanup (Agent/Office Info)

The Co-List Agent Code exclusion note currently references `New_Seller_Side_Session_Protocol.md`. Rewrite to remove that reference:

> Co-List Agent Code (`Input_170`) — not in the payload. Gary Martin (the primary Lennar agent) has no standing co-list agent.

### Language Sweep

Throughout the schema, replace "bookmarklet(s)" with "extension" where the reference is to the current fill mechanism. Where the reference is to a specific historical mechanism (e.g., "the bookmarklet writes to..."), reword to describe current behavior ("the extension writes to..."). If a reference to a bookmarklet is genuinely historical and cutting the sentence entirely would lose no operational content, cut it.

### Cross-Reference Cleanup

Strip:
- References to `docs/cvrmls/CVRMLS_Payload_Schema.md` and similar upstream authoring docs
- The "Base upstream" reference in the frontmatter of v1.5 (already dropped by the new frontmatter above)
- References to session log documents
- References to the retired `Lennar_Community_Reference_Database.md`

### Version History Section — Fresh Start

Strip v1.0–v1.5 version history. Replace with:

```
| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-08-19 | Initial operational version. Derived from `docs/lennar/Lennar_Payload_Schema.md` v1.5 (frozen as historical reference). Payload examples split to `Lennar_Payload_Examples.md`. |
```

### Verification After Commit

- File exists at `docs/operational/lennar/Lennar_Payload_Schema.md`
- Frontmatter version reads `version: 1.0` and `version_date: 2026-08-19`
- §7 (Open Verification Items) is absent
- §Retirement Notes is absent
- §2.2 (Retired flag section) is absent
- §8 (Complete Payload Examples) is either absent or replaced with a short pointer to `Lennar_Payload_Examples.md`
- All tab-by-tab payload shapes (§4.1–§4.12) are present
- Features subset (§5) is present in full including Cognito Form 17 mapping subsection
- The extension-runtime note is present in or after §2

---

## Change 3 — Create `docs/operational/lennar/Lennar_Payload_Examples.md` v1.0

### Approach

Extract the two complete payload examples from `docs/lennar/Lennar_Payload_Schema.md` v1.5 §8 (Harpers Mill TH taxid and Watermark SF new). Create a standalone examples doc containing both, with a brief preamble.

### Frontmatter

```
---
title: Lennar Payload Examples
document_id: LENNAR-OPS-EXAMPLES-001
version: 1.0
version_date: 2026-08-19
status: Active
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar Operational Project
---
```

### Content Structure

```
# Lennar Payload Examples

Companion to `Lennar_Payload_Schema.md`. Contains complete, concrete
payload examples for Lennar listings across the path × home-type
matrix. Loaded by sessions on fresh new-listing intakes as a
shape reference; the schema remains authoritative for field-level
detail and rules.

---

## 1. Harpers Mill TH — taxid path

[Extract from v1.5 §8.1 — verbatim]

---

## 2. Watermark SF — new path

[Extract from v1.5 §8.2 — verbatim]

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-08-19 | Initial version. Examples extracted from `docs/lennar/Lennar_Payload_Schema.md` v1.5 §8 during the operational doc set standup. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
```

### Verification After Commit

- File exists at `docs/operational/lennar/Lennar_Payload_Examples.md`
- Frontmatter version reads `version: 1.0` and `version_date: 2026-08-19`
- Both payload examples are present (Harpers Mill TH taxid, Watermark SF new)
- Preamble references the schema as authoritative
- The corresponding §8 content is either absent from `Lennar_Payload_Schema.md` or replaced with a pointer paragraph per Change 2

---

## Commit Message

Suggested commit message for the whole handoff:

```
Complete Lennar operational doc set

- Rewrite New Listing Protocol for operational scope (v1.0)
- Trim Payload Schema for operational scope (v1.0)
- Split Payload Examples to standalone file (v1.0)

Sources under docs/lennar/ remain frozen as historical reference
per convention established in previous handoff.

Part 2 of 2 in the operational Lennar doc set standup.
Depends on HANDOFF-2026-08-19-operational-folder-standup.

Ref: Session 015 (design), HANDOFF-2026-08-19-operational-doc-set-rewrite
```

Single commit for all three changes — the three new files are interdependent (schema references examples doc; examples doc references schema; New Listing Protocol references schema's Format Conventions).

## Do Not Modify

- Any file under `docs/lennar/` — the authoring source stays frozen
- The two Part 1 files (`Lennar_Project_Protocol.md`, `Lennar_Extension_Reference.md`) — already landed
- Any file under `docs/cvrmls/`, `docs/connector/`, `docs/protocols/`, `docs/project/`
- Any file under `extension/`, `bookmarklets/`, `src/`
- Any file under `handoffs/` other than moving this handoff document per project convention after commit
- `REPO_STRUCTURE.md` — already updated in Part 1
- `CURSOR-HANDOFF-PROTOCOL-001.md` — separate doc-fix items carried forward

## Post-Commit

Once this handoff lands, `docs/operational/lennar/` contains all five intended docs:

1. `Lennar_Project_Protocol.md` (Part 1)
2. `Lennar_Extension_Reference.md` (Part 1)
3. `Lennar_New_Listing_Protocol.md` (this handoff)
4. `Lennar_Payload_Schema.md` (this handoff)
5. `Lennar_Payload_Examples.md` (this handoff)

The operational Lennar project standup is complete on the docs side. Remaining items — the two pre-split closeout items (`Input_102_POTCLZ` DOM inspection, `owner.agent_related` verification) and the parked Subdivision/Post Office schema-and-extension update — are handled in a subsequent authoring session, not in this handoff.

## Deviations From CURSOR-HANDOFF-PROTOCOL-001

- **Multiple new files in one handoff:** Three new files in one atomic commit, per the Session 014 precedent for interdependent multi-file work.
- **"What This Is / Why It Exists" section:** Present at the top of this handoff per the Session 014 practice.
- **Judgment-heavy rewrite:** Change 1 (New Listing Protocol) is a substantial editorial rewrite rather than a surgical edit. The spec above is comprehensive, but Cursor will encounter local editorial calls the spec does not explicitly address. When in doubt, err toward: (a) operational scope, (b) trim-to-bone, (c) reference Project Protocol rather than restate, (d) drop rather than carry forward. If a judgment call has meaningful ambiguity that the spec truly doesn't cover, flag it in the commit message or as an inline note rather than guessing silently.

No other deviations.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

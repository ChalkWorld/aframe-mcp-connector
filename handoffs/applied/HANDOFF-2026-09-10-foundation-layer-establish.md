---
title: Cursor Handoff — Establish docs/foundation/ Layer with Charter and Phase Tracker (v0.2 Session Close)
document_id: HANDOFF-2026-09-10-foundation-layer-establish
date: 2026-09-10
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to the repo. This handoff establishes a new `docs/foundation/` layer for cross-cutting architecture and governance docs from the AAR-TC Lennar Operational Project restructure. It moves two payload files staged in `handoffs/incoming/` into their permanent locations, updates the Phase Tracker to v0.2 (session close for the 2026-09-10 Charter drafting session), and adds a new layer section to `REPO_STRUCTURE.md`.

Do not modify anything not listed here.

Payload files staged in `handoffs/incoming/` for this handoff:

- `handoffs/incoming/FOUND-CHARTER-001-lennar-restructure-charter.md` (new file — Restructure Charter)
- `handoffs/incoming/Lennar_Restructure_Phase_Tracker.md` (existing v0.1; will be moved and surgically updated to v0.2 in this same handoff)

Note on folders: Git tracks files, not directories. The `docs/foundation/` folder does not currently exist and is created implicitly by the file moves in Changes 1 and 2 — no separate folder-creation step is required.

---

## Change 1 — Move Charter into `docs/foundation/` with corrected filename

Move the Charter payload file into the new `docs/foundation/` layer. The filename shortens during the move to match existing repo naming conventions (human-readable filename; doc_id lives in frontmatter).

**Move:**

```
handoffs/incoming/FOUND-CHARTER-001-lennar-restructure-charter.md
```

**To:**

```
docs/foundation/Lennar_Restructure_Charter.md
```

Do not modify the file contents.

---

## Change 2 — Move Phase Tracker into `docs/foundation/`

Move the Phase Tracker payload file into the new `docs/foundation/` layer. Filename unchanged. The file will be surgically updated in place by Changes 3 through 7 below.

**Move:**

```
handoffs/incoming/Lennar_Restructure_Phase_Tracker.md
```

**To:**

```
docs/foundation/Lennar_Restructure_Phase_Tracker.md
```

---

## Change 3 — Update Phase Tracker frontmatter `document_id` to final `FOUND-` prefix

The Phase Tracker was authored with an interim doc_id pending confirmation of the foundation-layer prefix. That prefix is now confirmed as `FOUND-`.

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

**Find:**

```yaml
document_id: AAR-TC-LENNAR-PHASE-TRACKER-001
```

**Replace with:**

```yaml
document_id: FOUND-PHASE-TRACKER-001
```

---

## Change 4 — Update Phase Tracker frontmatter `version` and `version_date` to v0.2 / 2026-09-10

Session-close version bump for the 2026-09-10 Charter drafting session.

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

**Find:**

```yaml
version: 0.1
version_date: 2026-09-09
```

**Replace with:**

```yaml
version: 0.2
version_date: 2026-09-10
```

---

## Change 5 — Reset Decisions Parked for Next Session

The three 2026-09-09 parked decisions (base and table naming, primary field on Matrix Fields, docs folder and doc-ID prefix) were all resolved in the 2026-09-10 session. The Vision/Charter drafting item is also resolved with the Charter landing in this handoff. Clear the parked list.

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

**Find:**

```markdown
### Decisions Parked for Next Session

**Base and table naming.** Working defaults: Base = `CVRMLS Matrix Fields`. Tables = `Residential Input Form`, `Field Types`, `Field Options`, `Sections`. Confirm or push back at session open.

**Primary field on Matrix Fields.** Working default: Input ID (stable identifier — display labels can change without breaking the extension; ID changes break it). Display Label as secondary field.

**Docs folder and doc-ID prefix.** Working proposal: `docs/foundation/` folder with `FOUND-` doc-ID prefix. Makes the new architecture visible in the repo tree and separates it from operational docs. Open to a different convention if there is one already established for cross-cutting infrastructure work.

**Vision/charter doc drafting.** Deferred to next session, once naming and location are confirmed.
```

**Replace with:**

```markdown
### Decisions Parked for Next Session

None at this time.
```

---

## Change 6 — Replace Next Session Opening Move content

The 2026-09-09 opening move (confirm parked decisions, draft Charter) is complete. Advance to the Base Schema Specification.

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

**Find:**

```markdown
## Next Session Opening Move

1. Read this tracker first.
2. Confirm the parked decisions (base and table naming, primary field, docs folder and prefix).
3. Draft the Vision/Charter doc for the restructure. This is the frame that all subsequent docs inherit; author it first, review live, revise, finalize.
4. If time permits: begin the Base Schema Specification doc, capturing the Airtable structure decisions landed above as an authored spec — so when Airtable base setup begins, it follows the spec rather than being invented at build time.

Not for next session: any actual Airtable population, any script code, any Payload Schema audit work. Those come after the authored docs land.

At session close: update this tracker's Decisions Landed / Decisions Parked / Next Session Opening Move sections. Bump version.
```

**Replace with:**

```markdown
## Next Session Opening Move

1. Read this tracker first.
2. Draft the Base Schema Specification. Captures the CVRMLS Matrix Fields base structure decisions from the Decisions Landed section above as an authored spec, so Airtable buildout follows the spec rather than being invented at build time. As those decisions migrate into the Spec, prune them from this tracker.
3. If time permits after the Base Schema Specification lands: begin drafts of the maintenance protocol and/or builder-onboarding protocol.

Not for next session: any Airtable population, any script code, any Payload Schema audit work. Those come after the authored Phase 0 docs land.

At session close: bump version and date, refresh Decisions Parked and Next Session Opening Move to current state, and add a Version History row. Substantive decisions migrate to canonical foundation docs, not into this tracker.
```

---

## Change 7 — Add v0.2 row to Phase Tracker Version History

Target file: `docs/foundation/Lennar_Restructure_Phase_Tracker.md`

**Find:**

```markdown
| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-09-09 | Initial authoring at close of the restructure alignment session. Captures phase structure, session decisions landed, decisions parked for next session, and next-session opening move. Doc ID uses `AAR-TC-LENNAR-` prefix as interim; final prefix and location parked for next session decision. |
```

**Replace with:**

```markdown
| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-09-09 | Initial authoring at close of the restructure alignment session. Captures phase structure, session decisions landed, decisions parked for next session, and next-session opening move. Doc ID uses `AAR-TC-LENNAR-` prefix as interim; final prefix and location parked for next session decision. |
| 0.2 | 2026-09-10 | Session close after Restructure Charter drafting. Charter (`FOUND-CHARTER-001` v0.1) landed at `docs/foundation/Lennar_Restructure_Charter.md`. Doc_id updated from interim `AAR-TC-LENNAR-PHASE-TRACKER-001` to confirmed `FOUND-PHASE-TRACKER-001`. All three 2026-09-09 parked decisions confirmed; two-audience principle canonized as Charter Principle 6. |
```

---

## Change 8 — Add `docs/foundation/` section to `REPO_STRUCTURE.md`

Add a new layer description for `docs/foundation/` to `REPO_STRUCTURE.md`, placed immediately before the `docs/mls-input/` section header.

Target file: `REPO_STRUCTURE.md`

**Add** — insert the following block immediately before the `**`docs/mls-input/`**` section header. Preserve the existing blank-line spacing between sections.

```markdown
**`docs/foundation/`** — cross-cutting architecture and governance for the restructured AAR-TC Lennar Operational Project. Contains the Restructure Charter (`FOUND-CHARTER-001`), the Phase Tracker (`FOUND-PHASE-TRACKER-001`), and Phase 0 foundation docs as they land (Base Schema Specification, maintenance protocol, builder-onboarding protocol, and a short exclusion reference for hidden Matrix infrastructure fields). Distinct from any single MLS or builder layer — this layer governs the shape of the stack itself. Doc IDs use the `FOUND-` prefix. Foundation docs are engineer-facing; SOP and help-desk artifacts for the operator live in the corresponding operational set.

```

---

## Commit

Commit all eight changes as a single commit.

**Commit message:**

```
Establish docs/foundation/ layer; bump Phase Tracker to v0.2

Adds a new docs/foundation/ layer for cross-cutting architecture and
governance docs from the AAR-TC Lennar Operational Project restructure.
Lands the Restructure Charter (FOUND-CHARTER-001 v0.1) at
docs/foundation/Lennar_Restructure_Charter.md. Moves the Phase Tracker
into docs/foundation/ and surgically updates it to v0.2 for session
close: doc_id finalized to FOUND-PHASE-TRACKER-001, Decisions Parked
reset, next-session opening move advanced to Base Schema Specification.
Updates REPO_STRUCTURE.md with the new layer description.
```

Then push.

---

## Cleanup

After commit and push, move this handoff file from `handoffs/incoming/` to `handoffs/applied/` per repo convention for executed handoffs.

The two payload files no longer exist in `handoffs/incoming/` after Changes 1 and 2 — no additional cleanup needed there.

---
handoff_id: HANDOFF-2026-08-19-operational-folder-standup
date: 2026-08-19
author: Andrew Rich / Claude
target_agent: Cursor
scope: New directory `docs/operational/lennar/`; two new files committed verbatim; one-line update to `REPO_STRUCTURE.md`.
depends_on: None
supersedes: None
---

# Handoff: Operational Folder Standup — Part 1 of 2

## What This Is / Why It Exists

This handoff creates the new `docs/operational/lennar/` directory and lands the first two of the Lennar operational doc set: `Lennar_Project_Protocol.md` and `Lennar_Extension_Reference.md`. Both are committed verbatim from artifacts drafted during Session 015.

The operational Lennar project is a separate Claude.ai project (not this authoring project) that will execute Lennar listing intakes end to end using a scoped set of docs derived from `docs/lennar/`. This handoff lands the first two of those docs. A second handoff (`HANDOFF-2026-08-19-operational-doc-set-rewrite.md`, forthcoming) will land the remaining three by rewriting the New Listing Protocol, trimming the Payload Schema, and splitting the Payload Examples into its own file.

Important architectural note for future handoffs and edits: once this operational set is stood up, `docs/lennar/` (the authoring source that this operational set derives from) is **frozen as historical reference**. All future Lennar protocol and schema edits from this authoring project target `docs/operational/lennar/` directly. `docs/lennar/` is not deleted — it remains for lineage and context recovery — but no further edits land there. This convention is not codified in `CURSOR-HANDOFF-PROTOCOL-001` yet; that update is a separate small doc-fix carried forward, not part of this handoff.

## Files In This Handoff

| File | Action | Source |
|---|---|---|
| `docs/operational/lennar/Lennar_Project_Protocol.md` | Create | Attached artifact — commit verbatim |
| `docs/operational/lennar/Lennar_Extension_Reference.md` | Create | Attached artifact — commit verbatim |
| `REPO_STRUCTURE.md` | Edit (one-line addition) | See §Change 3 below |

## Change 1 — Create `docs/operational/lennar/Lennar_Project_Protocol.md`

**Action:** Create the file. Contents are the attached `Lennar_Project_Protocol.md` artifact, committed verbatim with no edits.

**Directory creation:** If `docs/operational/` does not exist, create it. If `docs/operational/lennar/` does not exist, create it.

**Verification after commit:**
- File exists at `docs/operational/lennar/Lennar_Project_Protocol.md`
- File contents match the attached artifact byte-for-byte
- Frontmatter version reads `version: 1.0` and `version_date: 2026-08-19`

## Change 2 — Create `docs/operational/lennar/Lennar_Extension_Reference.md`

**Action:** Create the file. Contents are the attached `Lennar_Extension_Reference.md` artifact, committed verbatim with no edits.

**Verification after commit:**
- File exists at `docs/operational/lennar/Lennar_Extension_Reference.md`
- File contents match the attached artifact byte-for-byte
- Frontmatter version reads `version: 1.0` and `version_date: 2026-08-19`

## Change 3 — Update `REPO_STRUCTURE.md`

**Action:** Add `docs/operational/` to the repo's documented top-level structure so the new directory is discoverable in the standard reference.

**Approach:** Locate the section of `REPO_STRUCTURE.md` that describes the `docs/` subdirectories. Add a new entry for `docs/operational/` in that section. The exact insertion point depends on the current file's structure (alphabetized, categorized, or sequential); insert consistent with the existing pattern.

**Suggested text for the new entry** (adapt phrasing to match `REPO_STRUCTURE.md`'s existing style):

> **`docs/operational/`** — Operational doc sets for downstream Claude projects that execute (rather than author) builder-specific workflows. Each subdirectory (`docs/operational/lennar/`, future `docs/operational/<builder>/`) contains a scoped, self-contained set of docs derived from the corresponding authoring folder. Operational sets are the current edit target once created; corresponding authoring folders (e.g. `docs/lennar/`) freeze as historical reference after their operational counterpart stands up.

**If the file's existing pattern is one-line entries only**, condense to:

> **`docs/operational/`** — Operational doc sets for downstream Claude projects (execute, not author). Each subdirectory (e.g. `docs/operational/lennar/`) is a scoped derivative of the corresponding authoring folder.

**Verification after commit:**
- `REPO_STRUCTURE.md` contains a reference to `docs/operational/` in its `docs/` structure section
- No other lines in `REPO_STRUCTURE.md` are modified

## Commit Message

Suggested commit message for the whole handoff:

```
Stand up docs/operational/lennar/ with initial two docs

- Create docs/operational/lennar/Lennar_Project_Protocol.md v1.0
- Create docs/operational/lennar/Lennar_Extension_Reference.md v1.0
- Add docs/operational/ to REPO_STRUCTURE.md

Part 1 of 2 in the operational Lennar doc set standup.
Second handoff will land the New Listing Protocol rewrite,
Payload Schema trim, and Payload Examples split.

Ref: Session 015 (design), HANDOFF-2026-08-19-operational-folder-standup
```

Single commit for all three changes — the files are interdependent (the two operational docs cross-reference each other, and `REPO_STRUCTURE.md` documents where they live).

## Do Not Modify

- Any file under `docs/lennar/` — the authoring source stays frozen from this point forward
- Any file under `docs/cvrmls/`, `docs/connector/`, `docs/protocols/`, `docs/project/`
- Any file under `extension/` or `bookmarklets/` or `src/`
- Any file under `handoffs/`
- Any file under `docs/` other than `REPO_STRUCTURE.md`
- `CURSOR-HANDOFF-PROTOCOL-001.md` — the flat-vs-`incoming/`-`applied/` split reconciliation and the "What This Is / Why It Exists" standing addition are separate doc-fix items carried forward, not part of this handoff

## Post-Commit

Once this handoff lands, `docs/operational/lennar/` will exist with two of its five intended docs. The second handoff (`HANDOFF-2026-08-19-operational-doc-set-rewrite.md`) picks up from there — it depends on this one landing first so it can commit against the created directory.

## Deviations From CURSOR-HANDOFF-PROTOCOL-001

- **Multiple new files in one handoff:** Two new docs plus one edit, per the Session 014 precedent for interdependent multi-file work. The three changes are one atomic commit.
- **"What This Is / Why It Exists" section:** Present at the top of this handoff per the Session 014 practice for generative (net-new build) handoffs, though the protocol doc itself hasn't yet been updated to require it.

No other deviations.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

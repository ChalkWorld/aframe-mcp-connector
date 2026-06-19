---
title: Aframe Connector — Cursor Handoff Protocol
document_id: CURSOR-HANDOFF-PROTOCOL-001
version: 1.0
version_date: 2026-06-19
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Aframe Connector
---

# Aframe Connector — Cursor Handoff Protocol
### AAR-TC Transaction Services | Document ID: CURSOR-HANDOFF-PROTOCOL-001

---

## Purpose

This document is the **procedure for authoring and executing surgical updates to any project file** via Cursor. It applies to connector source files (`src/aframe.js`, `src/index.js`), documentation (`docs/`), roadmap updates, workflow protocol docs, and any other file in the repo.

It is not a one-time procedure — it is the repeating pattern used whenever a Claude session produces changes that Cursor needs to apply.

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-19 | Andrew Rich / Claude | Initial document. Extracted from v0.4.0 build session pattern. Document ID: CURSOR-HANDOFF-PROTOCOL-001. |

---

## Reference Documents

| Doc | ID | Purpose |
|---|---|---|
| Aframe Connector Technical Reference | `CONNECTOR-REF-001` | Connector architecture and operational gotchas |
| Aframe Connector Tool Roadmap | `CONNECTOR-ROAD-001` | What tools exist and what's next |
| Aframe Swagger Endpoint Extraction Procedure | `EXTRACTION-PROC-001` | Separate procedure for extracting API schemas from Swagger |

---

## Core Principles

**Handoffs are instructions, not records.** Once Cursor executes a handoff and pushes the commit, the handoff file is deleted. The commit is the record of what changed. The roadmap is the record of what exists and why. There is no archive folder and no session log — those are redundant paper trails.

**One file per handoff.** Each handoff targets exactly one file in the repo. Multi-file updates use multiple handoff files, run in sequence. This keeps each handoff readable, testable, and independently re-runnable if something goes wrong.

**Surgical, not generative.** Handoffs tell Cursor exactly what to find and exactly what to replace. Cursor is not asked to interpret intent or make design decisions — it executes the handoff literally. All judgment happens in the Claude session that authors the handoff.

**Commit message is authored by the handoff.** The handoff specifies the exact commit message to use. Cursor does not write commit messages on its own for these updates.

---

## When This Procedure Applies

Use this procedure any time a Claude session produces changes to be applied to the repo — regardless of what kind of file is being updated:

- **Connector source** — adding tools to `src/aframe.js` and `src/index.js`, fixing bugs, bumping versions
- **API reference** — updating category files in `docs/aframe-api-reference/` (use `EXTRACTION-PROC-001` for the schema extraction step; this procedure covers everything after the schema is known)
- **Roadmap** — promoting tools between tiers, marking items complete, adding new scope to `CONNECTOR-ROAD-001`
- **Workflow protocol docs** — adding or revising sections in `WORKFLOWS-BUYER-001`, `WORKFLOWS-SELLER-001`, etc.
- **Technical reference** — updating `CONNECTOR-REF-001` to reflect new operational details
- **Any other repo file** — the pattern is the same regardless of file type

---

## Roles

| Role | Responsibility |
|---|---|
| Claude (this session) | Authors the handoff `.md` file(s) and presents the Cursor prompt |
| Andrew | Drops the handoff file(s) into `handoffs/` in the repo |
| Cursor | Reads the handoff, applies changes, commits, pushes, deletes the handoff file |

---

## Handoff File Structure

Every handoff file is a `.md` file with the following structure:

### Header block (YAML frontmatter)

```yaml
---
title: Cursor Handoff — <target filename> — <version or date>
document_id: HANDOFF-<descriptor>
date: YYYY-MM-DD
project: AAR-TC Aframe Connector
---
```

### Opening line

One sentence stating the target file and that changes should be applied surgically:

```
Apply the changes below surgically to `<path/to/file>`. Do not modify anything not listed here.
```

### Change blocks

Each change is a numbered section (`## Change 1`, `## Change 2`, etc.) containing:

- A plain-English description of what the change does and why (one or two sentences)
- A **Find** block — the exact string to locate in the target file, wrapped in a fenced code block with the correct language tag
- A **Replace with** block — the exact replacement string, same format

For additions with no replacement (appending to end of file, inserting a new section), use **Add** instead of **Find / Replace with** and specify the insertion point explicitly.

For deletions, use **Find** and **Delete** (omit the Replace with block).

### Closing line

```
No other changes to `<filename>`.
```

### Commit block

The final section of every handoff specifies the exact git commands to run:

```bash
git add -A
git commit -m "<commit message>"
git push origin main
```

For handoffs that are one of several in a sequence, only the **last** handoff in the sequence includes the commit block. Earlier handoffs in the sequence end with:

```
Do not commit yet. Changes for additional files follow in separate handoffs.
```

### Handoff deletion

The very last handoff in a sequence (the one with the commit block) also instructs Cursor to delete all handoff files used in the session before pushing:

```bash
git rm handoffs/HANDOFF-<name-1>.md handoffs/HANDOFF-<name-2>.md handoffs/HANDOFF-<name-3>.md
git add -A
git commit -m "<commit message>"
git push origin main
```

---

## What Makes a Good Find Target

The Find block must match exactly one location in the target file. Guidelines:

- **Include enough context to be unique.** A single line like `version: "0.3.0"` may match in multiple places. Wrap it in the surrounding lines that make it unambiguous.
- **Use the comment line as an anchor for code.** Function comments (`// PATCH /v1/...`) are stable and unique — include them in the Find block when targeting a specific function.
- **Never use line numbers.** Line numbers shift whenever the file changes. Find/replace on content only.
- **Match whitespace exactly.** Indentation is part of the match. Copy the string from the file as-is; do not reformat it in the Find block.
- **Prefer longer matches over shorter ones.** A 5-line Find block that is definitely unique is better than a 1-line block that might not be.

---

## Handoff Naming Convention

```
HANDOFF-<version-or-date>-<target-file-slug>.md
```

Examples:
- `HANDOFF-v0.4.0-aframe-js.md`
- `HANDOFF-v0.4.0-index-js.md`
- `HANDOFF-v0.4.0-deploy.md`
- `HANDOFF-2026-06-19-roadmap.md`
- `HANDOFF-2026-06-19-workflows-buyer-001.md`

Use the version number when the update is part of a versioned connector release. Use the date when the update is a documentation-only change with no version bump.

---

## The Cursor Prompt

After dropping the handoff file(s) into `handoffs/`, Andrew runs one prompt per file in Cursor. The prompt is always the same pattern:

```
Read handoffs/HANDOFF-<name>.md and apply every change it specifies to <path/to/target-file>. Do not modify any other files.
```

For the final handoff in a sequence (the one containing the commit block):

```
Read handoffs/HANDOFF-<name>.md and apply every change it specifies to <path/to/target-file>, then run the git commands exactly as written.
```

Claude presents each prompt as a fenced code block in the session so Andrew can copy it directly.

---

## Sequencing Multi-File Updates

When an update spans multiple files (e.g., a connector release touching `aframe.js`, `index.js`, and `package.json`):

1. Claude produces one handoff file per target file
2. Claude presents the Cursor prompts in the order they should be run, numbered clearly
3. Only the last handoff contains the commit block and handoff deletion commands
4. Andrew runs the prompts in sequence, confirming each succeeds before running the next

Do not batch all files into a single handoff. One file per handoff keeps failures isolated and re-runnable.

---

## What Claude Produces in the Session

At the end of any session that generates repo changes, Claude produces:

1. **Handoff `.md` file(s)** — presented as downloadable artifacts, one per target file
2. **Cursor prompts** — presented as numbered fenced code blocks in the chat, in run order

Claude does not produce a session log, a decisions doc, or an archive copy of the handoff. The commit history and roadmap carry that context forward.

---

## Post-Commit Checklist

After Cursor pushes:

- **For connector source changes:** Hit the Railway health URL and confirm the version number in the JSON response matches the new version. Railway deploys in ~30–60 seconds after push.
- **For tool list changes:** Reconnect the Claude.ai connector per `CONNECTOR-REF-001` § 6.1 before testing.
- **For documentation changes:** Open the updated file in GitHub and confirm the changes landed correctly.
- **For roadmap updates:** Verify version history row was added and tier tables reflect the change.

---

## Relationship to Extraction Procedure

`EXTRACTION-PROC-001` covers the specific case of extracting an Aframe API endpoint schema from the Swagger UI and installing it into `API-REF-001`. That procedure has its own handoff format (raw paste blocks with `<!-- TARGET -->` markers) optimized for schema content.

This procedure (`CURSOR-HANDOFF-PROTOCOL-001`) covers everything else — any surgical update to any file, including connector source builds, doc revisions, and roadmap updates. When a build session follows an extraction session, both procedures are in play: extraction first to get the schema into `API-REF-001`, then this procedure to turn that schema into a connector tool.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version_date with each revision.*

---
title: Cursor Handoff — Roster Write-Authority Carveout — Project Protocol v1.1 + New Listing Protocol v1.3
document_id: HANDOFF-2026-08-30-lennar-roster-write-authority
date: 2026-08-30
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to the two target files listed under each change. Do not modify anything not listed here.

**Target files:**

1. `docs/operational/lennar/Lennar_Project_Protocol.md` (Changes 1–3)
2. `docs/operational/lennar/Lennar_New_Listing_Protocol.md` (Changes 4–6)

**Ordering note:** Assumes the v1.2 handoff (`HANDOFF-2026-08-28-lennar-new-listing-protocol-v1-2.md`) has already been applied. If it has not, apply that one first.

---

## Change 1 — `Lennar_Project_Protocol.md`

Bump the frontmatter version from 1.0 to 1.1 and update version_date to reflect the §4.4 roster carveout amendment.

**Find:**

```markdown
version: 1.0
version_date: 2026-08-19
```

**Replace with:**

```markdown
version: 1.1
version_date: 2026-08-30
```

---

## Change 2 — `Lennar_Project_Protocol.md`

Add a roster carveout to §4.4. The roster is the one reference table sessions may modify in-band — this is deliberate, since routing every NHC change through Issue Reports would recreate the doc-edit latency the Airtable migration was meant to solve.

**Find:**

```markdown
When a session encounters a stale field ID, an outdated doc reference, a schema gap, a protocol conflict, an extension bug, or any other indication that the workflow's underlying artifacts need to change — the session flags to Andrew, files an Issue Report, and continues with the work at hand (or pauses if blocked). The session does not attempt to patch the docs, propose schema edits, modify community data, or troubleshoot extension internals.

Fix-and-improve work is the authoring project's responsibility. That separation is what makes both projects trustworthy in their own domain.
```

**Replace with:**

```markdown
When a session encounters a stale field ID, an outdated doc reference, a schema gap, a protocol conflict, an extension bug, or any other indication that the workflow's underlying artifacts need to change — the session flags to Andrew, files an Issue Report, and continues with the work at hand (or pauses if blocked). The session does not attempt to patch the docs, propose schema edits, modify community data, or troubleshoot extension internals.

**Roster carveout.** The `Lennar Personnel Roster` table (base `app78fMUwDNBHUZ6r`, table `tblYI2KodPRjk1dAO`) is the one reference table sessions may modify directly. This is deliberate — the roster was moved out of the Protocol doc specifically to absorb NHC churn without an authoring cycle, and routing every roster change through Issue Reports would recreate the friction that migration removed. Authorized in-band: adding a new NHC discovered in a Form 17 intake or an email signature, flipping Status to `Departed` on a clear departure signal, updating community assignments, backfilling missing contact info, correcting typos. Still Issue Report territory: adding a new Role select option that doesn't exist yet, modifying field structure, renaming the table or fields, deleting records. Update conventions are documented in `Lennar_New_Listing_Protocol.md`.

Fix-and-improve work is the authoring project's responsibility. That separation is what makes both projects trustworthy in their own domain.
```

---

## Change 3 — `Lennar_Project_Protocol.md`

Add a v1.1 row to the Version History table documenting the §4.4 amendment.

**Add** (insert on a new line immediately after the existing v1.0 row, which ends with "following the operational-project split design session. |"):

```markdown
| 1.1 | 2026-08-30 | Added §4.4 roster carveout — the `Lennar Personnel Roster` table is the one reference table sessions may modify in-band. Scoped explicitly: authorizes new NHC creation, departure marking, community reassignment, contact-info backfill, and typo correction; still routes role-option additions, schema changes, table/field renames, and record deletion through Issue Reports. Update conventions live in `Lennar_New_Listing_Protocol.md`. |
```

---

## Change 4 — `Lennar_New_Listing_Protocol.md`

Bump the frontmatter version from 1.2 to 1.3 and update version_date to reflect the Write patterns addition.

**Find:**

```markdown
version: 1.2
version_date: 2026-08-28
```

**Replace with:**

```markdown
version: 1.3
version_date: 2026-08-30
```

---

## Change 5 — `Lennar_New_Listing_Protocol.md`

Add a **Write patterns** subsection to the roster section, positioned between the existing Read patterns and Community-naming note. The subsection names the roster updates sessions may make in-band (per the new §4.4 carveout in the Project Protocol) and points to §4.1 for ambiguity handling.

**Add** (insert on a new line immediately before the existing paragraph that begins "**Community-naming note.**"):

```markdown
**Write patterns.** Per `Lennar_Project_Protocol.md` §4.4, the roster is the one reference table sessions may modify in-band. Common updates:

- **New NHC at intake or in an email signature** — create a roster record with name, email, Role = `New Home Consultant`, Status = `Active`, and community assignments if inferable from the intake or thread. Missing fields stay blank rather than guessed.
- **Departure signal** — a rep announcing they're leaving, an email bounce, a "no longer with Lennar" mention from another NHC. Update Status to `Departed` and set End Date. Preserve the record; historical POC links depend on it.
- **Community reassignment** — Chris (ASM) or the affected NHCs announce a shift. Update `Communities Assigned` on the relevant records.
- **Contact-info backfill** — email or phone appearing in a signature that wasn't previously captured. Update the field.
- **Typo correction** — fix in-band.

Ambiguity — a name that might or might not be a new NHC, a departure signal that's not clear, a role change that doesn't fit an existing select option — is governed by `Lennar_Project_Protocol.md` §4.1. Surface to Andrew rather than writing when the signal isn't clear.

Not authorized in-band: adding a new Role select option, modifying schema, renaming fields, deleting records. Those go to the authoring project via Issue Report per §4.4.

```

---

## Change 6 — `Lennar_New_Listing_Protocol.md`

Add a v1.3 row to the Version History table.

**Add** (insert on a new line immediately after the existing v1.2 row, which ends with "unlocking the parked Active Listing Email work. |"):

```markdown
| 1.3 | 2026-08-30 | Added a Write patterns subsection to the roster section, positioned between Read patterns and the Community-naming note. Names the roster updates sessions may make in-band (new NHC creation, departure marking, community reassignment, contact-info backfill, typo correction) per the new roster carveout in `Lennar_Project_Protocol.md` §4.4 (v1.1). Explicitly punts ambiguity to §4.1 and role-option additions / schema changes / deletions to Issue Reports. Closes the doc-edit-latency gap the v1.2 migration left implicit — the roster is now writable in-band with named scope. |
```

---

No other changes to `Lennar_Project_Protocol.md` or `Lennar_New_Listing_Protocol.md`.

```bash
git add -A
git commit -m "Lennar operational docs — roster write-authority carveout (Project Protocol v1.1, New Listing Protocol v1.3)"
git rm handoffs/HANDOFF-2026-08-30-lennar-roster-write-authority.md
git add -A
git commit -m "Remove applied handoff"
git push origin main
```

---
title: Cursor Handoff — Project_Session_Log.md — Session 016 entry
document_id: HANDOFF-2026-06-26-session-log-016
date: 2026-06-26
project: AAR-TC Lennar MLS Bookmarklet
---

Apply the changes below surgically to `docs/Project_Session_Log.md`. Do not modify anything not listed here.

---

## Change 1 — Add Session 016 log entry

Append the following new session entry at the end of the file, after the Session 015 entry, maintaining the existing session block format.

**Add at end of file:**

```markdown
---

## Session 016 — June 26, 2026

**Focus:** Cold run new listing test (8752 Whitman Dr), General Info bookmarklet bug investigation and fixes, protocol sync issue discovery, session log handoff pattern

**Note:** Session started without a handoff upload — intentional cold read test of the new listing protocol and bookmarklet workflow. Session 015 handoff uploaded mid-session to provide context for log entry and carry-forward.

---

### Accomplished

**1. Cold run new listing test — 8752 Whitman Dr (Harpers Mill TH)**

Full new listing intake run using Gmail (Carly's email, thread `19e898d10f9c86f5`), Community Reference Database, and MLS Data Sheet template. Address confirmed as a duplicate (already Active at MLS# 2615020) — test proceeded anyway for bookmarklet validation purposes; listing was not saved.

Data sheet and full JSON payload generated. Bookmarklet test run on Tax ID path produced two findings:

- **Features — Style field missed** — payload had `"style": []` (empty array); bookmarklet correctly skipped it. Root cause: session output rule gap — Style was not being populated. Fix: protocol rule added (see below).
- **General Info — two bugs found** (see item 2 below).

**2. General Info bookmarklet — three bugs identified and fixed**

Live bookmarklet test against Tax ID path listing revealed:

**Bug 1 — Input_246 / Input_248 label swap**
Extraction was originally run against a New path listing. On Tax ID path, Matrix shifts field IDs:
- `Input_246` = Tax Year (not Assd Improvement as previously mapped)
- `Input_248` = Assd Improvement (unmapped; not in original extraction)

Confirmed via live ES session DOM extraction against Tax ID path listing (June 26, 2026). This explains both symptoms: Tax Year was being overwritten to `"0"` and Assd Improvement was never being written.

**Bug 2 — Tax Year written on Tax ID path**
`Input_246` (Tax Year) was being written unconditionally. On Tax ID path it is pre-populated from the tax record and must not be overwritten. Fix: moved inside `path === "new"` block.

**Bug 3 — Assd Improvement never written on Tax ID path**
`Input_248` was not in the bookmarklet at all (wrong ID in original extraction). Fix: added unconditional write of `"0"` gated behind `isLennar` flag (see item 3).

**3. isLennar flag — new pattern introduced**

Non-Lennar listings are always Tax ID path and have Assd Improvement pre-populated from the tax record — it must not be touched. Lennar new construction never has a pre-populated Assd Improvement on either path.

Solution: top-level `"lennar": true` key added to all Lennar payloads. Bookmarklet reads `payload.lennar === true` as `isLennar` flag and gates the Assd Improvement write behind it. Non-Lennar payloads omit the key entirely — field is skipped.

Pattern is extensible: any future field with Lennar-vs-non-Lennar behavioral difference uses the same flag.

**4. Cursor handoffs produced and committed**

Four handoffs produced and committed this session:

| Handoff | Target | Changes |
|---|---|---|
| `HANDOFF-2026-06-26-general-info-source.md` | `docs/Lennar_MLS_Bookmarklet_Source.md` | Fix Input_246/248 swap; Tax Year to New path block; isLennar flag; Assd Improvement gated write |
| `HANDOFF-2026-06-26-general-info-launcher.md` | `bookmarklets/lennar_general_info.html` | Sync minified JS with source; update static-note and warning divs |
| `HANDOFF-2026-06-26-protocol-style-rule.md` | `docs/Lennar_New_Listing_Protocol.md` | Add features.style payload rule; add lennar flag requirement (committed via direct Cursor prompt due to sync issue — see item 5) |
| `HANDOFF-2026-06-26-non-lennar-payload-schema.md` | `docs/Non_Lennar_Payload_Schema.md` | New stub doc — non-Lennar payload schema with key behavioral distinctions documented |

**5. Project knowledge sync issue identified**

Protocol handoff (item 4, third row) failed twice because find strings written against the project knowledge copy of `Lennar_New_Listing_Protocol.md` did not match the actual repo file. The project knowledge copy was behind v2.0 (committed earlier in Session 015). Andrew uploaded the live file from GitHub mid-session; Cursor prompt was rewritten against real content and succeeded.

**Root cause:** Project knowledge is not auto-synced with repo commits. Any session that produces a handoff against a file that was also updated in the same or recent session is at risk of this mismatch.

**Mitigation going forward:** For files that have been recently updated, Andrew uploads the current version from GitHub before Claude writes find strings against them.

**6. General Info bookmarklet — confirmed passing**

After new bookmarklet installed in Chrome, re-tested against 8752 Whitman Tax ID path with minimal payload:
```json
{ "lennar": true, "path": "tax_id" }
```
Result: Tax Year held pre-populated value (2026), Assd Improvement correctly wrote `"0"`. Full pass.

---

### Key Decisions

- `isLennar` flag pattern (`payload.lennar === true`) is the standard mechanism for Lennar-vs-non-Lennar behavioral branching in all bookmarklets going forward
- Non-Lennar payloads omit `"lennar"` key entirely — do not include `"lennar": false`
- `features.style` must always be populated in session payload output — never left as `[]`
- Townhouse → `["Input_541_19"]`; SF style values confirmed from field map as they come up
- General Info minimal payload on Tax ID path is `{ "lennar": true, "path": "tax_id" }` — no `general` key needed; Acres is pre-populated and skipped
- Project knowledge sync is a known risk — upload live file from GitHub when writing find strings against recently-modified files

---

### Items Closed This Session

- General Info bookmarklet Input_246/248 swap — fixed and confirmed
- General Info Tax Year overwrite on Tax ID path — fixed and confirmed
- General Info Assd Improvement not writing on Tax ID path — fixed and confirmed
- features.style always-empty gap — protocol rule added

---

### Cursor Handoffs Produced This Session

| Handoff | Purpose |
|---|---|
| `HANDOFF-2026-06-26-general-info-source.md` | General Info source file fixes |
| `HANDOFF-2026-06-26-general-info-launcher.md` | General Info launcher HTML sync |
| `HANDOFF-2026-06-26-protocol-style-rule.md` | Protocol — style rule + lennar flag (committed via direct Cursor prompt) |
| `HANDOFF-2026-06-26-non-lennar-payload-schema.md` | New non-Lennar payload schema stub |
| `HANDOFF-2026-06-26-session-log-016.md` | This entry |

---

### Key References

| Item | Value |
|---|---|
| Bookmarklet Source File | `AAR-TC-LENNAR-BM-SRC-001` (`docs/Lennar_MLS_Bookmarklet_Source.md`) |
| Features Field Map | `AAR-TC-LENNAR-BM-001-FEA` (`docs/Lennar_MLS_Features_Field_Map.md`) |
| Full Payload Schema | `AAR-TC-LENNAR-BM-SCH-001` (`Lennar_Features_Payload_Schema.md`) |
| Non-Lennar Payload Schema | `AAR-TC-NONLENNAR-PL-001` (`docs/Non_Lennar_Payload_Schema.md`) |
| Lennar New Listing Protocol | `AAR-TC-LENNAR-PROTO-001` (`Lennar_New_Listing_Protocol.md`) |
| Google Sheet ID | `1fTapWU64r78Fyd8J-RM1Xh0z-fKo2y-wF9o6rtNJ5ME` |
| Google Drive — Properties folder | `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B` |
```

---

No other changes to `docs/Project_Session_Log.md`.

```bash
git add -A
git commit -m "docs: add Session 016 log entry — General Info bookmarklet fixes, isLennar flag, cold run test"
git push origin main
```

After pushing, delete this handoff file:

```bash
git rm handoffs/HANDOFF-2026-06-26-session-log-016.md
git add -A
git commit -m "chore: remove Session 016 log handoff"
git push origin main
```

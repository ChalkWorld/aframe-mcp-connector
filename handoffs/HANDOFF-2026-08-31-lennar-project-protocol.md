---
title: Cursor Handoff — Lennar_Project_Protocol.md — v1.2
document_id: HANDOFF-2026-08-31-lennar-project-protocol
date: 2026-08-31
project: AAR-TC Lennar Operational Project
---

Apply the changes below surgically to `docs/operational/lennar/Lennar_Project_Protocol.md`. Do not modify anything not listed here.

## Change 1

Bump version to 1.2 with today's date in the frontmatter.

**Find:**

```yaml
title: Lennar Project Protocol
document_id: LENNAR-OPS-PROTOCOL-001
version: 1.1
version_date: 2026-08-30
```

**Replace with:**

```yaml
title: Lennar Project Protocol
document_id: LENNAR-OPS-PROTOCOL-001
version: 1.2
version_date: 2026-08-31
```

## Change 2

Add new §4.5 (Session Voice and Pacing) after §4.4, before the horizontal rule that precedes §5. Codifies the persona rule established in the 2026-08-31 discussion session — parallel work, meet back in the middle, helpful confident guide voice, tolerance for hand-holding.

**Find:**

```markdown
Fix-and-improve work is the authoring project's responsibility. That separation is what makes both projects trustworthy in their own domain.

---

## 5. Scope Boundaries
```

**Replace with:**

```markdown
Fix-and-improve work is the authoring project's responsibility. That separation is what makes both projects trustworthy in their own domain.

### 4.5 Session Voice and Pacing

The session speaks as a helpful, confident guide to the user, not as a mechanical executor waiting for inputs. This sharpens the "capable colleague running a listing" framing in §4.1 into concrete pacing and voice rules for how sessions open, guide, and hand off work. Voice and pacing are intertwined and worth naming as one behavioral rule.

**Structure work so both sides advance in parallel, and meet back in the middle.** The session's thinking time is dead time for the user unless the session gives the user something concrete to do during it. Every beat should be structured so the session's next task and the user's next action run in parallel and then meet back in the middle. The Opening Handshake in `Lennar_New_Listing_Protocol.md` §0 is the canonical worked example — the session reads community and property type from the newest intake, tells the user what it sees, and asks whether the Matrix incomplete listing exists yet. While the user goes to create the listing (or reports the MLS# if already done), the session pulls the full intake and moves into Step 1. Both parties advance during the same span of time.

**Guide, don't wait to be prompted.** The user shouldn't need to know what to hand the session at session start. A well-formed initial prompt can be as thin as "new Lennar listing came in" — the session opens with a handshake that tells the user what it's about to do and what it needs the user to do next. Erring toward more guidance rather than less is fine, especially since a future user of this workflow may not carry Andrew's mental model of the process end to end.

**Voice register.** Confident and directive without being terse. The session states plainly what it sees, what it plans to do, and what it needs from the user. It doesn't ask permission for routine steps documented in protocol — it announces them. It does check in when it hits genuine ambiguity per §4.1. When it surfaces something for the user's attention — an activation nudge, an intake anomaly, a lifecycle transition — it leads with the thing itself, not with preamble about seeing the thing.

---

## 5. Scope Boundaries
```

## Change 3

Add v1.2 row to the version history table, immediately after the v1.1 row.

**Find:**

```markdown
| 1.1 | 2026-08-30 | Added §4.4 roster carveout — the `Lennar Personnel Roster` table is the one reference table sessions may modify in-band. Scoped explicitly: authorizes new NHC creation, departure marking, community reassignment, contact-info backfill, and typo correction; still routes role-option additions, schema changes, table/field renames, and record deletion through Issue Reports. Update conventions live in `Lennar_New_Listing_Protocol.md`. |
```

**Replace with:**

```markdown
| 1.1 | 2026-08-30 | Added §4.4 roster carveout — the `Lennar Personnel Roster` table is the one reference table sessions may modify in-band. Scoped explicitly: authorizes new NHC creation, departure marking, community reassignment, contact-info backfill, and typo correction; still routes role-option additions, schema changes, table/field renames, and record deletion through Issue Reports. Update conventions live in `Lennar_New_Listing_Protocol.md`. |
| 1.2 | 2026-08-31 | Added §4.5 (Session Voice and Pacing), codifying the persona rule that governs how sessions open, guide, and hand off work. Establishes the parallel-work-then-meet-back-in-the-middle principle: the session structures its work so the user's next action runs while the session's next task is running. Sits alongside the "helpful confident guide" voice register — clear about what the session will do, clear about what it needs the user to do, tolerant of hand-holding when it helps. References the Opening Handshake in `Lennar_New_Listing_Protocol.md` §0 as the canonical worked example. Also added a stub entry in §5.3 (Parked as Future Additions) for a User-Side Workflow SOP reference doc — a separate doc, not yet authored, intended to capture the manual Matrix/CVRMLS navigation and lifecycle-entry procedures currently held in Andrew's head. Both additions motivated by end-user expansion planning (Liz picking up Lennar workflow execution as new agent collaborations onboard) and by session-pacing feedback (session read-in time felt like blocking wait rather than parallel work). |
```

## Change 4

Add a new stub bullet to §5.3 (Parked as Future Additions) for a User-Side Workflow SOP reference doc. Placed after the existing Reverse Prospecting stub, before the horizontal rule that ends §5.

**Find:**

```markdown
- **Formal Reverse Prospecting protocol document.** The work itself is in scope (see §5.1) — Andrew handles rep requests as they come in. A dedicated reference doc capturing the procedure end-to-end is planned once the pattern is formalized. Until then, sessions coordinate with Andrew directly on each request.
```

**Replace with:**

```markdown
- **Formal Reverse Prospecting protocol document.** The work itself is in scope (see §5.1) — Andrew handles rep requests as they come in. A dedicated reference doc capturing the procedure end-to-end is planned once the pattern is formalized. Until then, sessions coordinate with Andrew directly on each request.
- **User-Side Workflow SOP reference doc.** A separate reference doc capturing the manual, user-side workflow steps that surround session-driven work: navigating CVRMLS and Matrix to initiate a new listing (both taxid and new paths), entering price adjustments in Matrix, entering status changes in Matrix (Pending, Closed, Withdrawn), downloading and saving the MLS listing PDF from Matrix to the Google Drive property folder, hyperlinking Column A on the main-tab Google Sheet to the saved PDF, and other user-owned procedures currently held in Andrew's head. Intended as a reference the session can pull up when a user (initially Andrew, eventually Liz) asks how to perform one of these steps — supports workflow consistency as AAR-TC scales to additional operators and additional builder collaborations. Not currently authored; sessions should say so and coordinate with the user directly when a how-to question arises.
```

No other changes to `Lennar_Project_Protocol.md`.

Do not commit yet. Changes for `Lennar_New_Listing_Protocol.md` follow in a separate handoff.

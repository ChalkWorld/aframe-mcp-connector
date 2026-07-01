---
title: Bookmarklet Unification + Chrome Extension Prep — Session Handoff
document_id: AAR-TC-BM-UNIFY-001
version: 1.1
version_date: 2026-06-30
status: New — scoped for a dedicated one-off session, not a standard project session
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC CVRMLS Matrix Bookmarklet
---

# Bookmarklet Unification + Chrome Extension Prep — Session Handoff
### AAR-TC Transaction Services | Document ID: AAR-TC-BM-UNIFY-001

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-06-30 | Initial handoff. Scoped the fix as merging Lennar + non-Lennar JS into one function per tab, gated by an `isLennar` branch inside the bookmarklet (modeled on the existing General Info pattern). |
| 1.1 | 2026-06-30 | **Architecture corrected before this handoff was ever used.** Andrew flagged that even the "merged with `isLennar` branch" target was wrong — bookmarklet files should contain zero builder-specific logic at all, not just a cleaner branch. Builder resolution (community lookup, hardcoded statics) moves entirely to session-time, before the payload is generated. The bookmarklet only ever reads final resolved values from the payload. This version reflects that correction throughout — the per-tab scope, canonical pattern, step-by-step flow, and Chrome Extension prep sections were all rewritten. `docs/lennar/Lennar_Bookmarklet_Customization.md` remains the correct standard location for builder-specific data — that part of the architecture (per-builder doc referencing the universal MLS layer) was already right and didn't need to change. |

---

## How To Use This Handoff

**This is not a standard project session.** It is scoped for one dedicated session focused entirely on the work below. Do not run the usual session-start agenda recap against the full project backlog — this handoff *is* the agenda. At session close, do not produce a full project session handoff; a short completion note appended to this same document (or a brief addendum, consistent with how the Session 019 addendum was handled) is sufficient, since this work doesn't carry forward open items the way a normal session does.

**Files needed at session start:** All 13 files currently in `bookmarklets/` (12 generic-named tab launchers + `lennar_features.html`), pulled fresh from GitHub. Andrew will upload them. Do not reconstruct any of them from `project_knowledge_search` fragments or from memory of past sessions — every prior instance of working from reconstructed fragments instead of the live file in this project has produced real, substantive errors (stale doc IDs, missed taxid skip logic, and now this entire unification gap). Treat every file in this batch as unseen until it is actually opened in this session.

---

## The Problem, In Plain Terms

During the Session 017 restructure, the bookmarklet HTML files in `bookmarklets/` were renamed — the `lennar_` prefix was dropped from all generic Matrix tab launchers, signaling that the architecture was now "universal." That rename was correct in *intent* but did not touch the actual JavaScript inside those files. The files that exist today still contain **only the Lennar-specific logic** — hardcoded community lookup tables, Lennar statics fired unconditionally, no clipboard-driven path for a standard (non-Lennar) listing. They were never actually merged into payload-driven, dual-mode logic. The rename created the appearance of a universal toolkit without the underlying code catching up.

Confirmed directly by inspecting `bookmarklets/listing_info.html` this session (uploaded from GitHub, not reconstructed): the file is titled "Lennar — Listing Info Bookmarklet," its `href` contains a hardcoded `COMMUNITIES` lookup table, and every location field is resolved from `comm.*` rather than `payload.listing.*`. There is no `isLennar` branch. This is the Lennar variant only, wearing the universal filename.

**This is not just a missed merge — it's the wrong target architecture, and the fix corrects both.** The original plan (per `Lennar_Bookmarklet_Customization.md`) was for bookmarklets to contain an `isLennar` branch that, when true, resolves values from a hardcoded `COMMUNITIES` table baked into the file. That's still builder-aware code living inside a file that's supposed to be MLS-scoped, not builder-scoped — every future builder would mean editing 12+ HTML files again to add another lookup table and another branch. **Corrected direction: the bookmarklet files should contain zero builder-specific logic, zero lookup tables, and zero `isLennar` branches.** Every field — including community-derived ones like county/city, zip, subdivision, and schools — is resolved to its final value *before* the payload is generated, during the session itself, using the builder's reference doc (`docs/lennar/Lennar_Bookmarklet_Customization.md` for Lennar). The bookmarklet's only job is: read `payload.listing.county_city`, write it to `Input_29`. It never knows or cares whether that value came from a community lookup, a tax record, or an agent's email — by the time it reaches the clipboard, it's just a value.

This means:
- **The `COMMUNITIES` table does not belong in any bookmarklet file at all.** It already lives, correctly, in `docs/lennar/Lennar_Bookmarklet_Customization.md` — that doc stays the authority for builder-specific lookups, and is unaffected by this session's work except where it needs updating to reflect that resolution now happens session-side rather than bookmarklet-side.
- **No `payload.lennar` flag is needed in the bookmarklet JS at all**, since there's nothing left for it to gate. (It may still be useful at the session-generation layer — e.g. so a future session knows "this is a Lennar listing, go look up the Lennar customization doc" — but that's a session/protocol-layer concern, not a bookmarklet-layer one. Flag this as an open question for the session rather than deciding it here.)
- **Per-builder statics** (Lennar's hardcoded Delayed Show, New/Resale, Year Built Desc, Expire Date, SqFt Source, etc.) also move out of the bookmarklet — the session resolves them into the payload using the builder doc, same as the community fields. The bookmarklet writes `payload.listing.delayed_show` unconditionally; it has no idea Lennar always sets that to `"0"`.

Separately, the *source documentation* (`docs/cvrmls/CVRMLS_Bookmarklet_Source.md`) has a parallel problem: for most tabs it documents Lennar and non-Lennar as **two separate, parallel JS code blocks** rather than one universal function. Under the corrected architecture, this collapses to something simpler than even a merge — there should be exactly **one JS block per tab**, with no `isLennar` branch in it at all, because the branching has moved entirely out of the bookmarklet and into the session-side resolution step.

**The fix has three layers, and all three need to happen this session:**
1. Strip every bookmarklet-layer `isLennar` branch, `COMMUNITIES` table, and hardcoded static out of `CVRMLS_Bookmarklet_Source.md` — collapse each tab down to one clean, fully payload-driven function.
2. Rebuild every HTML launcher in `bookmarklets/` from that single universal function — genuinely builder-agnostic, no Lennar references anywhere in the file.
3. Confirm `docs/lennar/Lennar_Bookmarklet_Customization.md` is updated to reflect that it's now a **session-time resolution reference** (i.e. "when generating a Lennar payload, here's what value to put in each field") rather than a description of bookmarklet-time branching logic. This doc's content mostly stays the same — the community table and statics are still exactly what a session needs to look up — but its framing needs a pass so it's clear the lookup happens before the payload exists, not inside the bookmarklet.

---

## The Canonical Pattern (Corrected)

Every tab collapses to one function like this — no builder awareness anywhere:

```javascript
navigator.clipboard.readText().then(function(text) {
  var payload = JSON.parse(text);
  var d = payload.listing;

  setField('Input_29', d.county_city);   // wherever this value came from — community lookup,
  setField('Input_94', d.waterfront);    // tax record, agent email — is irrelevant to the
  setField('Input_31', d.list_price);    // bookmarklet. It just writes what's in the payload.
  // ...
});
```

No `isLennar` checks. No `COMMUNITIES` object. No `payload.lennar` reads. If a field's value needs to differ by builder, that difference was already resolved by the session before the payload was copied to the clipboard. The bookmarklet's entire job is field-ID-to-payload-key mapping plus the existing path-based (`new`/`taxid`/`copy`) skip logic — which is a separate, legitimate kind of branching (it depends on which Matrix entry screen was used, not which builder) and stays exactly as already patched in this session's Listing Info / Fee Info work.

**Where the builder-specific values come from instead:** the session generating the payload (Claude, at listing intake) reads the relevant builder reference doc — `docs/lennar/Lennar_Bookmarklet_Customization.md` for Lennar — resolves every value that doc specifies (community lookup, hardcoded statics, whatever else), and writes the *resolved* value directly into the payload JSON before handing it to Andrew to copy. The builder doc's role doesn't go away; it just moves from "what the bookmarklet should branch on" to "what the session should look up."

---

## Per-Tab Scope

Pull the actual current state of each file before estimating effort — the list below is what's expected based on the source doc and prior session notes, not confirmed against the live HTML.

| # | Tab | Expected File | Known State |
|---|---|---|---|
| 1 | Listing Info | `bookmarklets/listing_info.html` | **Confirmed Lennar-only this session.** Strip the entire `COMMUNITIES` table and `isLennar` branch — collapse to one payload-driven function. Carry forward the Tax ID path patches already made to the source doc (street_dir always writes, year_built/rooms/levels/lot/bedrooms/zip gated to non-taxid, sqft_source defaults to "01"). |
| 2 | Room Info | `bookmarklets/room_info.html` (if it exists) | Non-Lennar only by design — Lennar skips this tab entirely, so there was never a builder-specific branch to strip here. Confirm whether this file was ever built; REPEAT0 open question (does the first row need `showAnotherRow()`?) is still unresolved and blocks this tab regardless. |
| 3 | Bath Info | `bookmarklets/bath_info.html` | Per source doc, "functionally identical" between variants already — likely already builder-agnostic or a near-trivial confirm. Verify the live file matches before assuming. |
| 4 | Features | `bookmarklets/features_a.html`, `bookmarklets/features_b.html`, `bookmarklets/lennar_features.html` | Three files currently, not one. Under the corrected architecture, `lennar_features.html` as a separate builder-named file is no longer the right end state — it should collapse into the same universal Features launcher(s) as Features A/B, with all Lennar defaults resolved session-side instead of hardcoded. This is a bigger lift than the other tabs (49 field groups) — confirm with Andrew whether Features is in-scope for this session or deferred to its own follow-up, given it was also never smoke-tested live (Features A/B open item from Session 019). |
| 5 | General Info | `bookmarklets/general_info.html` | Source doc currently has an `isLennar` branch (the one tab that was already "merged" under the old model) — this needs to be *unmerged* now, not just confirmed. Strip the `isLennar` check entirely; `Input_248` (Assd Improvement) becomes unconditionally payload-driven, with the session resolving it to `"0"` for Lennar payloads and to the tax-record value for standard taxid-path payloads. |
| 6 | Remarks | `bookmarklets/remarks.html` | Per source doc, "functionally identical" between variants — likely trivial, but confirm the Copyright Agreement hardcode (`"1"` always) is a genuine universal constant and not a Lennar-specific assumption that happened to also be true for the listings tested so far. |
| 7 | Fee Info | `bookmarklets/fee_info.html` | Strip the Lennar HOA/Membership/Fee Desc/Allow Onsite hardcodes — all become payload-driven, with the `hoa_condo`/`membership_required` fix already made to the source doc this session carrying forward unchanged (that fix was already correct under the new model — it just needs the remaining Lennar hardcodes in the same tab removed too). |
| 8 | Owner Info | `bookmarklets/owner_info.html` | Strip the Lennar fully-static block — becomes fully payload-driven. The Owner Name force-overwrite-on-taxid behavior (currently a Lennar-only exception) needs a decision: does the session just always resolve `owner_name` into the payload when an override is needed (Lennar or otherwise), making the bookmarklet's taxid-skip logic for this one field unconditional rather than builder-gated? Flag as a design question for the session, not a given. |
| 9 | Agent/Office Info | `bookmarklets/agent_office_info.html` | Strip the Lennar Type/Limited Rep hardcodes (`MO`/`Yes`) — both become payload-driven, resolved session-side per builder. |
| 10 | Showing Instructions | `bookmarklets/showing_instructions.html` | Strip the Lennar Accompany Show/Appt Required/Showing Instr 2/LockBox Type hardcodes — all become payload-driven. |
| 11 | Virtual Tour Info | `bookmarklets/virtual_tour_info.html` | Per source doc, single variant already serves both — likely already builder-agnostic. Verify. |
| 12 | Internet Display Info | `bookmarklets/internet_display_info.html` | Fully static either way (always Yes, for every builder) — this is a genuine universal constant, not a hidden Lennar assumption, since it reflects Matrix/MLS policy rather than builder preference. No change expected, but confirm the live file matches. |
| 13 | (n/a — only 12 Matrix tabs; the 13th file is `lennar_features.html`, counted separately above) | — | — |

**Net effect:** every file needs to at minimum be *opened and confirmed*, even the ones expected to already be builder-agnostic. Several need real surgery — not a merge into a branch, but removal of the branch entirely. Treat "should already be fine" as a hypothesis to check, not a fact.

---

## Step-By-Step Session Flow

1. **Andrew uploads all 13 current files from `bookmarklets/`.** Claude reads each one in full before doing anything else — no patching against assumptions.
2. **For each tab, compare the live HTML against the source doc's current state** (`CVRMLS_Bookmarklet_Source.md`, already patched for Listing Info and Fee Info this session — both fixes need to carry forward unchanged, since they were already correctly payload-driven under the old model and remain correct under the corrected one).
3. **Strip every builder-specific branch, lookup table, and hardcoded static out of each tab's JS** in `CVRMLS_Bookmarklet_Source.md` — collapse to one clean payload-driven function per tab, per the corrected canonical pattern above. Update the source doc first (it's the source of truth — never minified), then derive the minified HTML launcher from the stripped-down function.
4. **Rebuild each HTML launcher** using the existing launcher template (Bath Info is the canonical template per the Build doc) — keep the install instructions and payload reference panel, but the panel no longer needs a "Lennar vs standard" distinction in most cases; it should show one example payload with a note that builder-specific values (community, statics) are resolved by the session before the payload reaches the clipboard.
5. **Verify JS validity** before calling any file done — balanced braces/parens at minimum; a live Matrix test isn't expected to happen in this session unless Andrew wants to run one.
6. **Pass over `docs/lennar/Lennar_Bookmarklet_Customization.md`** to reframe it as a session-time resolution reference rather than a bookmarklet-branching spec. The actual data (community table, statics) likely doesn't change — only the framing of when/where it's consulted. Do not move this content anywhere else; it already lives in the correct standard location per the existing `docs/[builder]/` pattern.
7. **Check whether `New_Seller_Side_Session_Protocol.md` or the equivalent Lennar protocol need a note added** stating that payload generation now includes a builder-resolution step (look up the builder doc, resolve every builder-specific value, write final values into the payload) — this is a new explicit step in the session workflow that didn't need stating before, since the bookmarklet used to do this work itself.
8. **Batch Cursor handoffs where edits are light** — per Andrew's note, tabs that turn out to be already builder-agnostic or near-trivial (Bath Info, Remarks, Virtual Tour Info, Internet Display Info) can go in one batched handoff; tabs needing real surgery (Listing Info, General Info, Fee Info, Owner Info, Agent/Office Info, Showing Instructions) likely warrant individual handoffs given the one-file-per-handoff default, unless Andrew explicitly authorizes batching them too.
9. **Do not touch Room Info or Features** beyond confirming current state and flagging open blockers (REPEAT0, Features A/B smoke tests, and now also the Features `lennar_features.html`-as-separate-file question raised above) — these have unresolved prerequisites independent of this session's core fix and risk turning one dedicated session into an unbounded one if pulled in.

---

## Chrome Extension Prep — What "Prep" Means Here

The Build doc's Phase 4 already specifies the target state: a single toolbar button, auto-detecting the current Matrix tab, with `payload.mls` and `payload.builder` header keys routing to the correct field map and customization layer. This session is not building the extension. "Prep" means making decisions now that will make that build easier later, specifically:

- **The corrected architecture actually simplifies extension prep, not complicates it.** Since builder resolution now happens entirely session-side before the payload exists, the extension's job stays exactly what the Build doc already describes: detect the tab, read the payload, write fields. No builder-aware branching needs to exist inside the extension's field-writing logic at all — same as the bookmarklets. `payload.mls` and `payload.builder` are useful as informational header keys (so a session or future tooling can tell what kind of payload it's looking at), but neither key needs to be *read* by the extension's write logic, only by whatever generates the payload in the first place.
- **Note in each universal file's header comment which Input IDs the tab owns** — the extension will need to auto-detect "which Matrix tab am I on" via DOM signature; having each launcher's field ID list already documented (most files already have this in their payload reference panel) makes that detection logic easier to write later. No new work needed here beyond making sure the strip-down doesn't remove this documentation.
- **Do not build the `payload.mls` or `payload.builder` routing layer yet** — only one MLS (CVRMLS) and one builder (Lennar) exist today; designing routing for keys that have only one possible value each is premature. Leave this as a documented future step, not a session deliverable.
- **Flag, but do not resolve, the clipboard-vs-extension-popup question** — the current architecture assumes `navigator.clipboard.readText()`; the extension's stated design is to hold the payload internally instead. Each stripped-down bookmarklet's clipboard-read logic should stay as-is for now (it's correct for the bookmarklet era), but note in the source doc that this is the one piece of every tab's logic that will need to change when the extension is built — clipboard read replaced with reading from extension storage/popup state.

---

## Out of Scope For This Session

- Building the Chrome Extension itself (Phase 4 — future, separate dedicated session)
- Resolving Room Info's REPEAT0 open question
- Running Features A/B smoke tests
- Any work on the new listing file Andrew has queued up to run through the patched Listing Info bookmarklet — that's a separate, normal session
- Project Vision doc update (still carried from Session 019/020 agenda, still not started)
- Anything from the seller-side under-contract protocol track (`WORKFLOWS-SELLER-001`) — unrelated track, already closed out

---

## Session Close

This is a one-off session — no full project session handoff required. At close, append a short completion summary to this document (which tabs were merged, which were confirmed already-universal, which Cursor handoffs were produced and whether batched or individual, and what — if anything — got carried forward as still open). If anything significant changes about the broader project's open items as a side effect of this session, note it briefly so the next normal project session picks it up, but don't expand this into a full session log entry unless something genuinely warrants it.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*One-off dedicated session handoff — not part of the regular numbered session sequence.*

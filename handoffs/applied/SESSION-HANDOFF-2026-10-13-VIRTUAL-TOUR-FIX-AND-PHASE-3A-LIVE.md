---
title: Session Handoff — Virtual Tour fix + Phase 3a live
document_id: SESSION-HANDOFF-2026-10-13-VIRTUAL-TOUR-FIX-AND-PHASE-3A-LIVE
date_range: 2026-10-13 → 2026-10-14
project: AAR-TC Lennar Operational Project
related: FOUND-PHASE-TRACKER-001 (v0.18), SESSION-HANDOFF-2026-10-09-PHASE-2-EXTENSION-LIVE.md, HANDOFF-2026-10-13-virtual-tour-emission-fix.md, HANDOFF-2026-10-13-phase-3a-listing-prep.md
---

# Session Handoff — Virtual Tour fix + Phase 3a live
### AAR-TC Lennar Operational Project | 2026-10-13 → 2026-10-14

Full session detail. Session opened on what was supposed to be a Phase 3 kickoff per v0.17's parked next-session move, but a production-catch bug surfaced within the first exchange — Entry #21 (3435 Moonstone, first live run with a populated `VirtualTourLink`) blew up at the extension's Virtual Tour tab fill. The bug fix shipped as a one-file surgical handoff before any Phase 3 work started, closing out the Rule 17 populated-URL branch validation and the parked null-URL dispatcher crash risk in a single pass. Then the planned Phase 3 kickoup proceeded — six shape decisions, mockup pass with two iterations, scope reality-check against the actual operator-side workflow (which revealed the photo-sorter applet now holds a slot the charter didn't anticipate), PandaDoc end-to-end test attempted and blocked by the free-tier two-recipient cap, PandaDoc scoped out of this phase to defer the SaaS cost decision, and **Phase 3a** (Drive folder + prep email, without PandaDoc) shipped as a batched handoff with full GCP OAuth integration. Live operator-validated against a brand-new listing that arrived mid-session on 2026-10-14. OAuth consent screen published to production, closing the 7-day refresh-token expiry risk. **Phase 2 is now fully complete and Phase 3a is live.** Phase 3b (PandaDoc automation) is cleanly parked with all design work preserved. Referenced from `Lennar_Restructure_Phase_Tracker.md` v0.18. Read the tracker first — this doc is the supporting detail.

---

## What happened this session

1. **Session opened on Phase 3 kickoff per v0.17's parked queue, but a production-catch bug intervened.** Operator reported Virtual Tour tab fill threw an error on Entry #21 (3435 Moonstone Dr, submitted 2026-10-12 by TJ Hall, Everstone, Powell model, SF). Context from v0.17 made the diagnosis immediate: Entries #18 (Everstone Larimar) and #20 (Creekside 6136 Hull) both had `PhotosVirtualTour_VirtualTourLink: null`, so every prior pipeline run exercised the tab-skip branch of Rule 17 — the populated-URL branch had never run against the extension's dispatcher. Entry #21 was the first live run through it. The v0.15 production-catch pattern earned its keep again.

2. **Bug root-caused in `generate.py:1082` after reading the repo.** Script emitted the Virtual Tour section under the wrong keys — `payload["virtual_tour"] = {"url": vt_url}` — but `content.js:284-288` dispatcher reads `payload.tour.virtual_tour` and `payload.tour.additional_virtual_tour`. Two mismatches: top-level key (`virtual_tour` vs `tour`) and inner key (`url` vs `virtual_tour`). The dispatcher's `var d = payload.tour;` evaluated to `undefined`, then `d.virtual_tour` threw `Cannot read properties of undefined`. Dead OUTPUT_MAP entry at line 353 also surfaced during the read — unreachable because the router at line 948 short-circuits for Input_610 before OUTPUT_MAP is consulted.

3. **One-file surgical handoff drafted and shipped: `HANDOFF-2026-10-13-virtual-tour-emission-fix.md`.** Three changes to `extension/scripts/generate.py`:
   - **(1)** Rewrite emission block to `payload["tour"] = {"virtual_tour": vt_url, "additional_virtual_tour": ""}` — matches Schema §4.10 and dispatcher reads
   - **(2)** Always emit the `tour` section with empty-string defaults when URL is blank, mirroring the v0.14 Bath Info level sub-object pattern — closes the latent null-URL dispatcher-crash risk at the same time
   - **(3)** Delete the dead OUTPUT_MAP entry at line 353 (replaced with a two-line comment anchor)

   Cursor applied cleanly. Operator confirmed Virtual Tour tab now fills correctly for Entry #21 against the live extension. **The null-URL + populated-URL branches of Rule 17 are now both validated in production.**

4. **Pivoted to Phase 3 kickoff after the fix landed.** Six shape decisions settled one at a time (same style as v0.16 and v0.17 kickoffs). Preserved intact as architectural record even after the Phase 3b scope-out below, because Phase 3b is still committed future work:
   - **Q1 Trigger placement.** New button in the extension side panel, between the picker and the Clear-row. Full-width in its own row to signal it's heavier than Load/Fill-tab. Fires once per listing, extension exits after Matrix fill is done.
   - **Q2 Magic-link token design.** `GET /send-signing?token=X` on Railway, self-contained JWT (no server-side state table). Deferred to Phase 3b since PandaDoc was scoped out.
   - **Q3 Audit table.** Needs its own overhaul session before any write-path lands. Stubbed/deferred for Phase 3a per the v0.17 Lennar Listings table charter rework.
   - **Q4 Drive folder structure.** Per-listing folder in `Lennar/Properties`, named `{StreetNumber} {abbreviated StreetName}` (operator-established convention from prior manual folders). `Photos` subfolder nested inside at creation. Tax Record, Signed Addendum, Active MLS Sheet drop in later by operator hand. Skip-if-exists semantics (reuse existing folder, surface a notice, don't fail — v0.14 idempotency pattern applied to Drive).
   - **Q5 PandaDoc template.** Existing template `9DpcJ2wbwTkXvLh59aTPTn` ("Lennar Listing Addendum") pulled via the MCP connector. Three roles: Sender (preassigned to "document sender" = `agentandrewrich@gmail.com`), Agent (operator-as-Gary via `chalkworld.ai@gmail.com`, operator-TC-agreement covers this), Owner (`christopher.maclaird@lennar.com`, swap from the retired Megan contact). Two merge fields: `Property Address` and `Composed Clause` (both assigned to Sender, both API-writable, rendered to the signer as pre-filled text).
   - **Q6 Composed Clause authoring.** Script-side template string substitution — `"This addendum to the Master Listing Agreement serves as input for the following address - {address} at ${price:,.0f} in the {community} community."` All three values come from the Phase 1 payload the pipeline already produces. No per-community variation needed. No Community Reference DB additions.
   - **Q7 Error handling.** Same inline UI + console detail as Phase 2. Fail-loud per operator preference. Partial-success states surface as errors, no rollback, operator sorts manually.

5. **Mockup rendered as an HTML artifact (five states, iterated twice).** Phase 2 pattern repeated. States: no-payload disabled, payload-loaded idle, firing busy, success with reuse-notice, error (fail loud). Styles copied verbatim from `extension/sidepanel.html`. Operator iterations:
   - **Iteration 1 (artifact v2):** Button label change — from original "Generate signing email" to "Generate addendum for signing" (more accurate for the full Phase 3 scope).
   - **Iteration 2 (artifact v3):** Scope reality check (see item 7) collapsed to "Generate listing prep" after PandaDoc scoped out, with state notes updated to Phase 3a scope (no signing fire, stubbed email button). Error state reshaped from PandaDoc-realistic to Drive-realistic since Drive is the system most likely to misconfigure on first run.

6. **Workflow discussion surfaced a scope reality the v0.16 charter missed.** Operator walked through the actual working flow given the new photo-sorter Automator applet (local, M3 ML, standalone — not touched by the extension). Key realization: **photos are the hard prerequisite to firing the extension**. If photos can't be found or formatted correctly, there's no reason to open the extension at all. This cascades to the Phase 3 trigger — it cannot fire before the extension because at that point photos haven't been uploaded, so there's nothing for the audit row's "photos used / photo URLs" field to record. The extension-fires-after-photos sequencing was already true for Matrix fill; Phase 3 now inherits the same gate.

   Phase 3 trigger shape evolved into: new listing email → create Matrix listing → open extension → Load → **click Generate listing prep (one-way fire)** → the prep email parks in the inbox ready to go when photos are confirmed → auto-fill through Matrix tabs → upload photos → from the parked email, click Send signing (Phase 3b) → exit Matrix and extension → signing comes back later, operator activates on Status tab. One extension visit per listing. Signing is naturally gated behind photos-confirmed via operator judgment at email-button-click time, not via extension state.

7. **PandaDoc end-to-end test attempted via MCP connector; blocked by free-tier recipient cap.** Operator confirmed template preassignments (Sender → document-sender, Agent → `chalkworld.ai@gmail.com` as Gary, Owner → `drewnaut@gmail.com` as test stand-in for Chris). Fired `documents_create` against template `9DpcJ2wbwTkXvLh59aTPTn` with real Entry #21 merge values. Document creation accepted (ID `Nu5nsBJzkC59Yu2E7dJqTQ`) but polling returned HTTP 403: *"You have reached your recipient limit for this document. Please contact support or upgrade your plan to increase your limit."* Free tier caps at 2 recipients per document; the template has 3 (Sender + Agent + Owner).

   **Workaround discussion:** Collapsing Sender into Agent in the template would reduce recipient count but PandaDoc shows the Sender role as "Andrew" (locked to the registered user name), so from Chris's POV the signing request would appear to come from Andrew-not-Gary — breaks the agent-of-record presentation. Only clean fix is paying for Starter ($19/mo annual, $35/mo monthly), which operator declined for current volume. PandaDoc automation **scoped out of this phase, deferred to Phase 3b** when volume or budget shifts.

8. **Phase 3a scope settled.** Three of the four Phase 3 charter components ship today, one defers:
   - **Drive folder + Photos subfolder** ✓ (ships)
   - **Prep email to operator inbox** ✓ (ships, with stubbed-but-styled "Send signing request" button that Phase 3b wires up)
   - **PandaDoc addendum create + send** ✗ (deferred to Phase 3b)
   - **Audit row** ✗ (deferred pending Lennar Listings table overhaul)

   The one-visit-to-extension flow still works; Phase 3a hands operator the merge values and clause text to paste into PandaDoc manually, same workflow they do today, with the surrounding ceremony automated. All Phase 3b design work (template config, role mapping, Composed Clause string template, magic-link token, `/send-signing` endpoint) remains valid for whenever the operator pulls the trigger on paying.

9. **Phase 3a batched Cursor handoff drafted and shipped: `HANDOFF-2026-10-13-phase-3a-listing-prep.md`.** 10 files across the extension, with full GCP OAuth integration end-to-end. CURSOR-HANDOFF-PROTOCOL-001 batched-override invoked (same pattern as v0.14 pipeline-build and v0.16 FastAPI wrapper — one coherent feature, partial apply would ship a broken button). Changes:
   - **requirements.txt** — adds 4 google-api packages
   - **.env.example** — adds 4 new env var slots
   - **gcp_oauth_helper.py NEW** — one-time standalone utility for operator to mint refresh token locally
   - **google_services.py NEW** — OAuth credentials + Drive/Gmail service builders + `find_or_create_folder` (skip-if-exists) + `send_html_email`
   - **prep_email.py NEW** — Composed Clause template string + HTML email body builder with stubbed signing button
   - **app.py** — adds `POST /prepare-listing` endpoint with suffix abbreviator map (Drive→Dr, Road→Rd, etc.) and the full orchestration flow
   - **manifest.json** — bumped to `0.4.0`
   - **sidepanel.html** — adds Phase 3 section between picker and Clear-row
   - **sidepanel.js** — adds Phase 3 state helpers, fetch function, button wiring, Clear-also-resets-Phase 3
   - **Lennar_Extension_Build.md** — Phase 3a section appended

10. **Operator-side GCP setup done in parallel with Cursor's apply.** Google Cloud project ("Matrix Automation"), Drive + Gmail APIs enabled, OAuth consent screen (External, Testing status initially), Desktop App OAuth client credentials downloaded, `gcp_oauth_helper.py` run locally to mint refresh token (standalone version provided since Cursor hadn't applied yet), four env vars dropped into Railway (`GCP_CLIENT_ID`, `GCP_CLIENT_SECRET`, `GCP_REFRESH_TOKEN`, `LENNAR_PROPERTIES_FOLDER_ID` = `1EypC5Ep7VRMqwWcoMvUb5juVvJKAEi7B`).

11. **Cursor applied the Phase 3a handoff cleanly with four good adaptations.** All four deviations were judgment calls that matched existing codebase conventions better than the handoff's samples:
    - `requirements.txt` — appended new deps instead of re-ordering (preserved import order)
    - `.env.example` — appended Phase 3a section instead of replacing full content (preserved existing comments like PAT creation link, secret generation command)
    - `app.py` — used real symbol name `_cognito_fetch_entry(form_id, entry_id)` instead of the handoff's placeholder `_cognito_get_entry` (handoff explicitly flagged this risk); used existing `_check_api_key()` + `Header(None, alias="X-API-Key")` constant-time comparison pattern instead of plain `!=`; added matching `logger.info`/`logger.exception` calls
    - `sidepanel.js` — kept ES5 style and reused existing `CONFIG`/`railwayHeaders()` helpers instead of the handoff's `const`/destructuring sample

    None blocked. All reinforced the pattern that Cursor's own judgment against the real codebase beats a handoff's placeholder-driven sample code.

12. **Live end-to-end validated against a brand-new listing on 2026-10-14 morning.** Operator pulled a new submission that came in that morning (first fresh-folder create path — Entry #18 Larimar had been manually created on 2026-09-18, so Cursor's own smoke tests only exercised the reuse branch). Folder created correctly in `Lennar/Properties/{abbreviated address}/Photos`, prep email landed in operator's inbox with all three merge values + composed clause + Drive folder link + stubbed signing button. **This is the convergence proof** — the operator-facing UX now shifts from "do PandaDoc + Drive + mental tracking by hand" to "click Generate listing prep in the extension."

13. **Gmail self-send yellow warning banner surfaced as operational friction.** Prep emails arrive with Gmail's "Be careful with this message" banner because the from/to addresses match (`agentandrewrich@gmail.com` → `agentandrewrich@gmail.com`), which trips Gmail's heuristics even though DKIM/SPF are valid. **Option 1 mitigation attempted:** Gmail filter matching `from: agentandrewrich@gmail.com + subject: Listing prep:` with "Never send to Spam" + "Mark important." TBD whether the filter kills the banner itself. **Option 2 parked as a small follow-up handoff:** plus-aliasing — change the `to_address` in `app.py` from `agentandrewrich@gmail.com` to `agentandrewrich+listings@gmail.com`, which Gmail delivers to the same inbox but sidesteps the self-send heuristic because the addresses are formally different. Also gives a natural label hook for future filtering.

14. **OAuth consent screen published to production.** 7-day refresh-token expiry risk closed — if left in Testing status, Railway's refresh token would have expired next Wednesday with silent failure. Publishing journey had a sub-story worth capturing (see item 15 below). After publish, the refresh token already in Railway stays valid indefinitely; no code or re-oauth needed.

15. **Branding-requirements sub-story.** Publishing to production required consent-screen branding fields that weren't filled in. Operator's initial attempt with placeholder URLs failed Google's reverification when operator then uploaded a logo (which re-triggered the full branding check — "if it works, don't touch it" lesson learned). Working set: logo = AAR-TC logo; homepage = `https://www.aar-tc.com`; authorized domain = `aar-tc.com`; developer email = `agentandrewrich@gmail.com`; privacy policy = `https://www.aar-tc.com/privacy` (operator created a real privacy policy page in Squarespace with provided minimum-viable-privacy-policy draft text — turned a GCP friction into a business-hygiene win AAR-TC needed anyway). Reverification passed, publish succeeded.

16. **Session close spanned two days** (afternoon 2026-10-13, morning 2026-10-14). Longest single Lennar-project session to date. Three major moves landed: Phase 2 production bug fix + Phase 3a shipped + PandaDoc scoped and deferred. Phase 3a is live and operator-validated. Phase 3b is cleanly parked with design intact. Next-session opening move is the Lennar Listings table overhaul (operator-requested, pre-condition for audit row writes to make sense).

---

## Architectural decisions — resolutions this session

### Production-catch pattern vindicated again (Virtual Tour)

The v0.15 "parked branches get caught by production, not by preemptive testing" pattern held cleanly. Rule 17 populated-URL branch was explicitly parked in v0.17 as a low-priority production-catch item. Entry #21 caught it, the fix was one line, and the null-URL latent crash risk closed at the same time via the always-emit-with-defaults pattern (from v0.14 Bath Info levels). Parking production-catch items as explicit tracker entries continues to be the right call: the alternative (preemptive synthetic testing of every untested branch) would cost disproportionately more time than production catches when they land.

### Mockup-before-handoff pattern earned its keep for the third session running

Same decision as v0.17 Phase 2 kickoff. Two mockup iterations this session (button label, scope reshape) that would have been separate Cursor passes otherwise. The Phase 3a scope reshape in particular — rewriting the mockup's state notes when PandaDoc was scoped out — was ~5 minutes of edit work that would have required a full re-draft of the handoff if the mockup hadn't been iterable first. Pattern worth repeating.

### Scope-aggressively approach to Phase 3

Rather than deferring Phase 3 entirely when PandaDoc blocked, split it into Phase 3a (Drive + email, ships now) and Phase 3b (PandaDoc, deferred). Preserves momentum, delivers immediate value, and avoids throwing away any of the shape work already done. The stubbed signing button in the Phase 3a email is the forward-compatibility hook — Phase 3b swaps the `<span>` for an `<a href>` pointing at the magic-link endpoint, no other visual or UX change needed.

### Extension-contract knowledge still script-side

Phase 3a additions landed in `app.py` + two new Python modules + `sidepanel.html` + `sidepanel.js` + `config.js` + `manifest.json`. Rules table untouched. `content.js` untouched (no new tab dispatch). `background.js` untouched. The pattern from v0.14 — "the script carries responsibility for shape and contract knowledge unless Rules table intent is actually what's wrong" — survives Phase 3a intact. Virtual Tour fix also landed script-side only.

### Dev-time MCP vs. production REST split confirmed as architecturally correct

Original Phase 3 charter assumed MCP connectors would carry production traffic (Claude session fires PandaDoc, Gmail, Airtable). Restructure moved this to Railway REST. This session's PandaDoc exploration confirmed the split works well: MCP connector was useful for template inspection, documents_create test, debugging. Railway REST (via `google-api-python-client`) is what production will use. Vendor-neutral integration shape; no lock-in to PandaDoc specifically beyond the already-sunk template work.

### "If it works, don't touch it" (OAuth consent screen branding)

Operator had the branding form in a passing state, uploaded a logo, Google re-triggered full branding verification which then flagged previously-accepted placeholder URLs. The lesson is operational: once a Google Cloud Console form passes, don't re-open the editor for cosmetic improvements. Worth remembering for the next GCP-touching session.

### Operator-manual prep steps continue to be best surfaced in Cursor's apply summary

v0.17's doc-process note (template-copy operator step at top of handoff, not just at bottom) was followed by the Phase 3a handoff. Cursor's apply summary echoed the GCP setup steps even though operator had already completed them before Cursor started. Confirmed working. Pattern locked in for future handoffs with any operator-manual steps.

### Fresh-create vs. reuse-branch testing split

The folder create helper was first exercised in production only on the fresh-create path when a new listing arrived on 2026-10-14 morning — Cursor's own smoke tests had only hit the reuse branch (because every prior test entry had an operator-created folder from before Phase 3a existed). The reuse branch is actually the trickier of the two (query + match + fallback), so the live-create test on morning-of was mostly confirming the simpler path works. Pattern note for future production-catches: whichever branch is easier to hit in dev-testing is probably the simpler one; the branch that only hits in production is often the harder one.

---

## Doc state at close

- **Repo (`aframe-mcp-connector`)** — Virtual Tour emission fix committed and live. Phase 3a: `extension/scripts/requirements.txt` extended, `.env.example` extended, `gcp_oauth_helper.py` NEW, `google_services.py` NEW, `prep_email.py` NEW, `app.py` with `/prepare-listing` endpoint, `manifest.json` at `0.4.0`, `sidepanel.html` + `sidepanel.js` reshaped for Phase 3a, `Lennar_Extension_Build.md` with Phase 3a section appended. Commits for the Virtual Tour fix and Phase 3a feature + handoff moves all pushed to `main`.
- **Railway** — four new env vars live (`GCP_CLIENT_ID`, `GCP_CLIENT_SECRET`, `GCP_REFRESH_TOKEN`, `LENNAR_PROPERTIES_FOLDER_ID`). Existing Phase 2 vars unchanged. Service redeployed cleanly, `/`, `/recent-entries`, `/generate`, `/prepare-listing` all serving as of 2026-10-14.
- **Google Cloud Console** — "Matrix Automation" project. Drive + Gmail APIs enabled. OAuth consent screen: External, **Published to production** (no 7-day refresh-token expiry). AAR-TC privacy policy page created in Squarespace at `aar-tc.com/privacy`.
- **PandaDoc** — Template `9DpcJ2wbwTkXvLh59aTPTn` renamed to "Lennar Listing Addendum Chris MacLaird," preassignments set (Sender → document-sender, Agent → `chalkworld.ai@gmail.com`, Owner → `drewnaut@gmail.com` as test stand-in — needs swap back to `christopher.maclaird@lennar.com` when Phase 3b activates). No active documents in the account; failed test document (`Nu5nsBJzkC59Yu2E7dJqTQ`) was never materialized by PandaDoc and auto-discarded.
- **`Lennar_Restructure_Phase_Tracker.md`** — bumping v0.17 → v0.18 via a separate Cursor handoff accompanying this session doc.
- **`Payload_Rules_Conventions.md`** — unchanged at v0.6.
- **`Lennar_Community_Reference_Database.md`** — unchanged at v1.4.
- **`Lennar_Payload_Schema.md`** — unchanged at v1.3.
- **`Lennar_New_Listing_Protocol.md`** — unchanged at v1.7.
- **`Lennar_Payload_Examples.md`** — still stale on HM TH `taxid` example; Phase 4 refactor target.
- **`CURSOR-HANDOFF-PROTOCOL-001.md`** — still at v1.1, batched-handoff override invoked twice this session (Virtual Tour was single-file, Phase 3a was 10-file batched), `handoffs/incoming/` convention invoked again. Protocol-doc refresh still parked.

---

## Small parked items (post v0.18)

- **Lennar Listings table overhaul** (new, this session, Priority 1 next session). Pre-condition for audit row writes to make sense. Current table shape is a legacy of pre-automation workflow; needs refit to what the Phase 3 button actually produces and what post-intake queries actually need to answer. Scope decisions to settle at session open: field-by-field what stays/goes/gets added, relationship to Community Reference DB, interface views, and whether the audit row writes land as part of the overhaul or as a follow-up handoff. After the table lands, the small `/prepare-listing` additive handoff to wire in the Airtable write.
- **Phase 3b — PandaDoc addendum create + magic-link send** (new, this session, Priority 2 — unlocked by operator PandaDoc Starter subscription decision). All design work preserved: template config, three-role preassignments, Composed Clause template string, `GET /send-signing?token=X` magic-link JWT, email button swap from `<span>` to `<a href>`. When operator subscribes, Phase 3b is a small additive handoff — ~3 files touched (`app.py` new endpoint + updated `prep_email.py` button generator + requirements for `pyjwt` and `pandadoc-python-client`).
- **Gmail self-send yellow-banner mitigation** (new, this session, low priority). First mitigation (Gmail filter) attempted — TBD whether it kills the banner itself vs. just affecting spam routing. If filter doesn't work, apply Option 2: plus-aliasing fix as a tiny Cursor handoff — change `to_address` in `app.py` from `agentandrewrich@gmail.com` to `agentandrewrich+listings@gmail.com`. One-line change, Railway auto-redeploys, no extension changes.
- **Rule 111 Finished / Part Finished / Unfinished crosswalk branches untested** (unchanged from v0.15, low priority — production catch).
- **Rule 110 SF+No garage branch untested** (unchanged from v0.15, low priority — production catch).
- **Watermark SF `new`-path rules untested** (unchanged from v0.15, low priority — production catch).
- **Spot-check-before-fill pattern as operator hedge** (unchanged from v0.15, procedural).
- **Cognito form field-type standardization** (unchanged from v0.15, optional).
- **Rules-table Features-tab cleanup** (unchanged from v0.14, low priority).
- **`Lennar_Payload_Examples.md` v1.1 doc refresh** (unchanged from v0.14, low priority).
- **`_cognito_null_default` numeric-TEXT list hardcoded in the dispatcher** (unchanged from v0.14, low priority).
- **`CURSOR-HANDOFF-PROTOCOL-001` protocol-doc refresh** (unchanged from v0.14, low priority — batched-handoff override invoked twice more this session + `handoffs/incoming/` convention invoked again).
- **`SCRIPTS-*` doc_id convention decision** (unchanged from v0.14, low priority).
- **`Lennar_New_Listing_Protocol.md` `"17-3"` shorthand clarification** (unchanged from v0.16, low priority).
- **Cognito OData silently ignores `$top`** (unchanged from v0.16, informational).
- **`Entry_DateCreated` defensive fallback in `fetch_recent_entries`** (unchanged from v0.16, informational).
- **Doc-process note: template-copy operator step** (unchanged from v0.17, low priority — pattern reinforced again this session).
- **Post Office / Subdivision closure confirmation** (unchanged from v0.6).
- **Multi-Builder Pin phrasing correction** (unchanged from v0.7).
- **Payload Rules table description update via API blocked** (unchanged from v0.8, Conventions file now v0.6).
- **Property Type multi-select orphan option cleanup** (unchanged from v0.8).
- **`Payload_Rules_Conventions.md` ID prefix decision** (unchanged from v0.8).
- **HOA Fee / Additional Fee DB column split** (unchanged from v0.9, low priority).
- **Copyright Agreement multi-builder promotion decision** (unchanged from v0.9, low priority).
- **NumberOfCars form constraints** (unchanged from v0.11, low priority).
- **Features Matrix UI Section panels check** (unchanged from v0.6).

**Removed from queue this session:**
- Phase 2 extension-side build (completed in v0.17, confirmed working in production this session).
- Virtual Tour populated-URL branch untested (production-caught, fixed, both branches of Rule 17 now validated).
- Virtual Tour null-URL dispatcher-crash latent risk (closed in the same fix via always-emit-with-defaults pattern).
- Phase 3 kickoff (now split — Phase 3a shipped and live, Phase 3b parked as separate entry above).

---

## Next session opening move — Lennar Listings table overhaul + audit row wiring

**Phase 2 is fully complete and Phase 3a is live.** Operator UX for a new intake now looks like: new Cognito email → create Matrix listing → open extension → Load entry from picker → click Generate listing prep (fires Drive folder + prep email) → auto-fill through Matrix tabs → upload photos → from parked prep email, do PandaDoc manually with the provided merge values → exit extension → signing returns, activate on Status tab. The "surrounding ceremony" automation gap in the current protocol is the Lennar Listings table audit row, which is the next session's priority.

Sequencing (same style as prior kickoffs):

1. Read this handoff, `Lennar_Restructure_Phase_Tracker.md` v0.18, and the current Lennar Listings table in Airtable (base `app78fMUwDNBHUZ6r`). The overhaul isn't a greenfield design — the table already exists and has history. Start from what's there, decide what to keep.

2. **Shape-first decisions to settle at session open.** First-pass list to steer the opening:
   - **Current table audit.** What fields does the Lennar Listings table have today, which are actively used, which are stale legacy from pre-automation workflow? Which are maintained by operator by hand today?
   - **What the Phase 3 button naturally produces.** The `/prepare-listing` endpoint has `address, community, list_price, folder_id, folder_url, entry_id, timestamp` on hand at write time. More values are available from the Phase 1 payload (model, path, square footage, etc.) at the same moment. Decide which of these the audit row carries.
   - **Post-intake values.** MLS#, final list date, signed addendum PDF link, Active MLS Sheet PDF link, photo count, photo URL list — these aren't available at `/prepare-listing` fire-time. Decide which belong on the audit row and which belong elsewhere (separate records, computed views, or operator-maintained-later fields on the same row).
   - **Relationship to Community Reference DB.** Should audit rows link to the community record? Link to the Cognito entry (if that's stored anywhere)?
   - **Interface views.** What views does the operator actually need to query (upcoming listings, listings pending signing, listings with incomplete audit rows, listings by community, etc.)?
   - **Write timing.** Audit row writes at `/prepare-listing` fire (initial state captured), or at a different moment? Any updates after that initial write — Phase 3b signing-fired state, operator-side MLS# capture, etc.?

3. **No mockup pass needed** — this is a data-model session, not a UI session. Shape decisions drive directly into the Airtable table schema and a small additive handoff to wire the write into `/prepare-listing`.

4. **Operator-side table overhaul in Airtable UI.** Fields added/removed/renamed per settled schema. Operator does this directly; no handoff needed for the table itself.

5. **Small additive Cursor handoff** — add the Airtable write to the `/prepare-listing` endpoint. Expected scope: `app.py` + maybe a new small `airtable_services.py` + `requirements.txt` + `.env.example` if a new env var is needed. ~3-4 files, single-feature handoff, not batched-override territory.

6. **Live end-to-end test** on next intake. Confirm audit row writes correctly and the row shape is what the operator expected.

**Not for next session:**
- Phase 3b (PandaDoc automation) — operator-blocked on SaaS subscription decision, parked separately.
- Phase 4 (doc refactor, operational-session behavior retirement).
- Phase 2 refinements (fully complete).
- Remaining Phase 1 community validations (production-catch pattern per v0.15 still holds).
- Gmail self-send banner mitigation (parked as its own low-priority item; apply Option 2 as a one-off handoff if the filter doesn't kill the banner).

At session close: bump tracker version to v0.19, refresh Decisions Parked and Next Session Opening Move. Substantive decisions migrate to canonical foundation docs (the Lennar Listings table schema joins them), not into this tracker.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

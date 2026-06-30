# Cursor Handoff — Listing Info Tax ID Patch + Fee Info HOA Bug Fix

**Date:** 2026-06-30
**Target file:** `docs/cvrmls/CVRMLS_Bookmarklet_Source.md`
**Source of truth for this handoff:** Full replacement file attached separately (`CVRMLS_Bookmarklet_Source.md`, patched copy). Apply as a full file overwrite, not a diff — the canonical schema block was removed entirely (superseded by `CVRMLS_Payload_Schema.md` v1.0) and several surrounding sections were restructured, so a line-by-line diff isn't a reliable patch path for this one.

---

## What Changed

### 1. Document header corrected
- `document_id` changed from `AAR-TC-LENNAR-BM-SRC-001` → `AAR-TC-CVRMLS-BM-SRC-001`. The file's actual content (universal + Lennar variants for all 12 tabs) matches the CVRMLS doc, not a Lennar-only doc. This appears to have been missed during the Session 017 doc-split restructure.
- Version bumped 0.2 → 0.3. Version history entries added for both the 0.2 doc-ID note (retroactive) and this session's 0.3 patch.

### 2. Listing Info — Non-Lennar variant patched against `CVRMLS_Payload_Schema.md` v1.0

Reconciled against the confirmed Tax ID path findings from the live Matrix entry test (4508 Ridgecrest Ln, Colonial Heights, 2026-06-29):

| Field | Before | After |
|---|---|---|
| `street_dir` (`Input_35`) | Written only when `path === "new"` | Written on every path — confirmed not pre-populated by Matrix on any path |
| `year_built`, `rooms`, `levels`, `lot`, `bedrooms` | Written unconditionally | Gated to `path !== "taxid"` — confirmed pre-populated by Matrix from tax record |
| `zip` (`Input_635`) | Written unconditionally after cascade | Gated to `path !== "taxid"` — cascade still fires regardless of path, but payload value only overwrites on new/copy |
| `subdivision` (`Input_259`) | Written from payload (`d.subdivision`) | Removed entirely — MANUAL per schema v1.0, permanently out of bookmarklet scope |
| `post_office` (`Input_41`) | Written from payload (`d.post_office`) | Removed entirely — MANUAL per schema v1.0, permanently out of bookmarklet scope |
| `sqft_source` (`Input_97`) | Defaulted to `""` | Defaults to `"01"` (Per Tax) — standard listings always use Per Tax |

No change to: County/City cascade sequencing, Area, Schools (elementary/middle/high — confirmed DYN, write on every path), List Price/Date/Type/Attached, Delayed Show, New/Resale, Year Built Desc, PID skip logic (already correct), street_num/street_name/street_suffix skip logic (already correct), square footage fields (already correct).

**No changes made to the Lennar variant** — out of scope for this patch; Lennar Listing Info was not touched by the live Tax ID test since Lennar new construction doesn't have a comparable pre-population pattern.

### 3. Fee Info — Non-Lennar variant patched — closes Known Bug from schema v1.0

`CVRMLS_Payload_Schema.md` v1.0 flagged this explicitly under "Known Bugs — Pending Item 3":

- `Input_109` (HOA/Condo) was hardcoded to `"1"` unconditionally — now reads `d.hoa_condo || "0"`.
- `Input_112` (Membership Required) was hardcoded to `"1"` unconditionally — now reads `d.membership_required || "0"`.
- Added early return when `d.hoa_condo !== "1"`: bookmarklet sets HOA to No and stops, matching schema's "no-HOA case" behavior (all other fee keys omitted from payload, fields fall through to blank/unchecked defaults).

No change to: Lennar Fee Info variant (already correctly payload-driven for community-variable fields; HOA/Membership statics are intentional for Lennar and not part of this bug).

### 4. Canonical Payload Schema block removed

The embedded JSON schema block near the top of the file (previously ~100 lines, mixing non-Lennar and Lennar fields with several stale TODOs) has been replaced with a short pointer section explaining that `CVRMLS_Payload_Schema.md` (`AAR-TC-CVRMLS-PL-001`) v1.0 is now the sole authority for payload structure. This removes a drift risk — the embedded block predated the SKIP-TAXID/MANUAL classifications and was already inconsistent with the per-tab JS below it.

---

## What Was Not Touched

Room Info, Bath Info, Features, General Info, Remarks, Owner Info, Agent/Office Info, Showing Instructions, Virtual Tour Info, Internet Display Info — all unchanged. These tabs may still contain assumptions that predate schema v1.0 (the General Info non-Lennar variant in particular has a known TODO for the Lot Desc checkbox loop) but reconciling them is out of scope for this handoff. Flag for a future session pass if/when those tabs come up for build work.

---

## Verification Done

- All 21 JavaScript code blocks in the file checked for balanced braces/parens — all pass.
- All 12 tab section headers confirmed present and in original order after edit.
- Patch checked field-by-field against `CVRMLS_Payload_Schema.md` v1.0's Listing Info and Fee Info tables (uploaded directly from GitHub this session, not reconstructed from search).

## Verification Still Needed (live Matrix test)

- Confirm the patched Listing Info bookmarklet against a real Tax ID path listing in Matrix — the 4508 Ridgecrest test confirmed *which fields* pre-populate, but the bookmarklet code itself has not yet been run live since this patch.
- Confirm Fee Info no-HOA early-return path against a real no-HOA listing.

---

## Commit Message Suggestion

```
Patch CVRMLS_Bookmarklet_Source.md: Listing Info taxid skip logic + Fee Info HOA bug fix

- Correct doc ID (was mislabeled AAR-TC-LENNAR-BM-SRC-001)
- Listing Info non-Lennar: gate year_built/rooms/levels/lot/bedrooms/zip to
  new/copy paths per live Tax ID test (4508 Ridgecrest Ln, 2026-06-29);
  street_dir now writes on all paths; remove subdivision/post_office writes
  (MANUAL per schema v1.0); sqft_source defaults to Per Tax
- Fee Info non-Lennar: hoa_condo/membership_required now payload-driven,
  closes Known Bug flagged in CVRMLS_Payload_Schema.md v1.0
- Remove stale embedded canonical schema block; point to
  CVRMLS_Payload_Schema.md (AAR-TC-CVRMLS-PL-001) v1.0 as sole authority

Refs: AAR-TC-SELLER-PROTO-001, AAR-TC-CVRMLS-PL-001 v1.0
```

---

*AAR-TC Transaction Services | Cursor Handoff Protocol — CURSOR-HANDOFF-PROTOCOL-001*

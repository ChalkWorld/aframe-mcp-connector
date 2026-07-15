---
title: Cursor Handoff — CVRMLS_Bookmarklet_Source.md — 2026-07-15
document_id: HANDOFF-2026-07-15-cvrmls-bookmarklet-source
date: 2026-07-15
project: AAR-TC CVRMLS Matrix Bookmarklet
---

Apply the changes below surgically to `docs/cvrmls/CVRMLS_Bookmarklet_Source.md`. Do not modify anything not listed here.

Context: smoke test on 8720 Whitman Dr (Harpers Mill TH, taxid path) surfaced that the v0.5 Lennar carveout for Year Built / Rooms / Levels / Bedrooms no longer fires — the `payload.lennar` flag was retired by `Lennar_Payload_Schema.md` §2.2 in favor of the envelope's `payload.builder`, orphaning the check. Post Office (`Input_41`) was also missing entirely from the code despite the reference block claiming it was written. Fixing both here in the JS source of truth; deployed launcher (`bookmarklets/listing_info.html`) follows in a separate handoff.

## Change 1

Bump the version header to v0.6 and update the Last Updated date.

**Find:**
```
**Version:** 0.5 — Listing Info Lennar taxid-path fixes; Owner Info drift confirmed and closed
**Last Updated:** 2026-07-01
```

**Replace with:**
```
**Version:** 0.6 — Listing Info envelope migration (`payload.lennar` → `payload.builder`); Post Office write added; Lot fallback fix
**Last Updated:** 2026-07-15
```

## Change 2

Add a v0.6 row to the Version History table, immediately below the v0.5 row.

**Find:**
```
| 0.5 | 2026-07-01 | Andrew Rich / Claude | Session 023 live verification (15824 Greenhart Dr, Harpers Mill SF) surfaced two real bugs and confirmed a doc/live drift. Listing Info: Subdivision restored as a payload-driven write, gated correctly for Lennar; Year Built/Rooms/Levels/Bedrooms no longer skipped on taxid path when `payload.lennar` is true (Lot left as-is, unconfirmed). Owner Info: deployed launcher was missing Owner Phone/Owner Name 2/Occupant Phone writes that this doc already had — synced; resolves the "open design question" note as settled, not open. `bookmarklets/listing_info.html` and `bookmarklets/owner_info.html` updated to match via separate handoffs. |
```

**Replace with:**
```
| 0.5 | 2026-07-01 | Andrew Rich / Claude | Session 023 live verification (15824 Greenhart Dr, Harpers Mill SF) surfaced two real bugs and confirmed a doc/live drift. Listing Info: Subdivision restored as a payload-driven write, gated correctly for Lennar; Year Built/Rooms/Levels/Bedrooms no longer skipped on taxid path when `payload.lennar` is true (Lot left as-is, unconfirmed). Owner Info: deployed launcher was missing Owner Phone/Owner Name 2/Occupant Phone writes that this doc already had — synced; resolves the "open design question" note as settled, not open. `bookmarklets/listing_info.html` and `bookmarklets/owner_info.html` updated to match via separate handoffs. |
| 0.6 | 2026-07-15 | Andrew Rich / Claude | Listing Info smoke test (8720 Whitman Dr, Harpers Mill TH, taxid path) confirmed the v0.5 Lennar carveout no longer fires: `payload.lennar` was retired in favor of the envelope's `payload.builder` per `Lennar_Payload_Schema.md` §2.2, orphaning the check. Fixed by switching to `payload.builder === "lennar"` — restores Year Built / Rooms / Levels / Bedrooms writes on Lennar taxid path. Post Office (`Input_41`) added as an unconditional payload-driven write following the Subdivision pattern established in v0.4 — community-driven for Lennar, blank fallback for standard MLS (option list too large to parse per-listing; human still picks manually). Lot (`Input_622`) new/copy-path write gains a blank-string fallback per the same convention, preventing string coercion of `undefined` when Lennar payloads omit Lot on the new path (schema §4.1 explicitly allows this). Same-test finding on Lot tax-record autofill (confirmed working on Harpers Mill taxid) closes the v0.5 "left as-is, unconfirmed" note — SKIP-TAXID is correct for Lot for all builders. `bookmarklets/listing_info.html` updated to match via separate handoff. |
```

## Change 3

Add a new "Patched 2026-07-15" block immediately below the existing "Patched 2026-06-30" block in the Listing Info — Universal section.

**Find:**
```
**Patched 2026-06-30 against `CVRMLS_Payload_Schema.md` v1.0 (live Tax ID path test, 4508 Ridgecrest Ln, 2026-06-29):**
- `street_dir` now writes on every path — confirmed blank/non-pre-populated even on taxid
- `year_built`, `rooms`, `levels`, `lot`, `bedrooms` now gated to `new`/`copy` paths only — confirmed pre-populated by Matrix from the tax record on taxid path
- `zip` (`Input_635`) is set only to settle the cascade now — payload value is still written, but only on `new`/`copy`; on taxid path the cascade-populated value is left alone
- `sqft_source` now defaults to `"01"` (Per Tax) when the key is absent — standard listings always use Per Tax per protocol
```

**Replace with:**
```
**Patched 2026-06-30 against `CVRMLS_Payload_Schema.md` v1.0 (live Tax ID path test, 4508 Ridgecrest Ln, 2026-06-29):**
- `street_dir` now writes on every path — confirmed blank/non-pre-populated even on taxid
- `year_built`, `rooms`, `levels`, `lot`, `bedrooms` now gated to `new`/`copy` paths only — confirmed pre-populated by Matrix from the tax record on taxid path
- `zip` (`Input_635`) is set only to settle the cascade now — payload value is still written, but only on `new`/`copy`; on taxid path the cascade-populated value is left alone
- `sqft_source` now defaults to `"01"` (Per Tax) when the key is absent — standard listings always use Per Tax per protocol

**Patched 2026-07-15 against `Lennar_Payload_Schema.md` v1.0 (live smoke test, 8720 Whitman Dr, Harpers Mill TH, taxid path):**
- Lennar carveout check migrated from retired `payload.lennar` flag to envelope's `payload.builder === "lennar"` — restores Year Built / Rooms / Levels / Bedrooms writes on Lennar taxid path (dead-flag orphaning was invisible until first live use of the envelope pattern)
- Post Office (`Input_41`) now writes unconditionally with blank-string fallback — matches the Subdivision pattern; community-driven for Lennar, harmless blank for standard MLS where the field remains human-picked
- Lot (`Input_622`) new/copy-path write now uses blank-string fallback to prevent `undefined` string coercion when Lennar payloads omit Lot on the new path (schema §4.1 tolerance)
- Lot SKIP-TAXID behavior confirmed correct for all builders in the same test — Harpers Mill taxid autofills Lot from the tax record; the v0.5 "unconfirmed" note is now resolved
```

## Change 4

Update the Post Office / Subdivision comment block and add the new Post Office write line. The comment now covers both fields under the same pattern; Post Office joins Subdivision as payload-driven-with-blank-fallback for every builder.

**Find:**
```javascript
      // Post Office (Input_41) remains MANUAL — too many dropdown options to map reliably
      // for standard listings. Subdivision (Input_259) was also MANUAL under that same
      // reasoning until 2026-07-01: correct for the standard path (unbounded community count),
      // wrong for Lennar (small, fixed community set already resolved via the COMMUNITIES
      // table in Lennar_Bookmarklet_Customization.md). Now payload-driven for every builder —
      // harmless blank write for standard listings that don't provide it, correct write for
      // Lennar. Confirmed live: 15824 Greenhart Dr, 2026-07-01.
      setField('Input_259', d.subdivision || "");
      setField('Input_236', d.neighborhood || "");
      setField('Input_51',  d.elementary);
      setField('Input_53',  d.middle);
      setField('Input_52',  d.high);
```

**Replace with:**
```javascript
      // Post Office (Input_41) and Subdivision (Input_259) were both MANUAL under the
      // CVRMLS baseline — unbounded option lists too large to parse reliably per-listing
      // for standard MLS work. Subdivision moved to payload-driven for every builder on
      // 2026-07-01; Post Office followed on 2026-07-15 after the smoke test confirmed the
      // same rationale: for Lennar these values resolve at session time from a small fixed
      // community set (see Community Reference Database), while standard MLS payloads
      // simply omit the key and the write is a harmless blank no-op. Human still picks
      // the value manually for any standard listing. Live confirmations:
      //   - Subdivision (Input_259): 15824 Greenhart Dr, 2026-07-01
      //   - Post Office (Input_41): 8720 Whitman Dr, 2026-07-15
      setField('Input_259', d.subdivision  || "");
      setField('Input_236', d.neighborhood || "");
      setField('Input_41',  d.post_office  || "");
      setField('Input_51',  d.elementary);
      setField('Input_53',  d.middle);
      setField('Input_52',  d.high);
```

## Change 5

Update the property-details carveout block: migrate the flag check from `payload.lennar` to `payload.builder === "lennar"`, update the surrounding comment to note the envelope migration and the confirmed Lot autofill, and add the blank-string fallback to the Lot write.

**Find:**
```javascript
      // Step 6: Property detail fields
      // Confirmed pre-populated by Matrix from the tax record on taxid path for an
      // established resale property (live test, 4508 Ridgecrest Ln, 2026-06-29) — that
      // finding does not hold for Lennar new construction, where the tax record predates
      // the built structure and has no bedroom/room/level/year-built data yet. Corrected
      // 2026-07-01 after a live miss on 15824 Greenhart Dr: these four fields now write
      // whenever the listing is Lennar, regardless of path. Lot (Input_622) was NOT
      // reported missing on that same live test — left SKIP-TAXID for every builder
      // pending confirmation it needs the same carve-out.
      if (path !== "taxid" || payload.lennar) {
        setField('Input_44', d.year_built);
        setField('Input_48', d.rooms);
        setField('Input_49', d.levels);
        setField('Input_47', d.bedrooms);
      }
      if (path !== "taxid") {
        setField('Input_622', d.lot);
      }
```

**Replace with:**
```javascript
      // Step 6: Property detail fields
      // Confirmed pre-populated by Matrix from the tax record on taxid path for an
      // established resale property (live test, 4508 Ridgecrest Ln, 2026-06-29) — that
      // finding does not hold for Lennar new construction, where the tax record predates
      // the built structure and has no bedroom/room/level/year-built data yet. Corrected
      // 2026-07-01 after a live miss on 15824 Greenhart Dr: these four fields now write
      // whenever the listing is Lennar, regardless of path. Envelope migration 2026-07-15
      // (smoke test, 8720 Whitman Dr): flag check moved from the retired `payload.lennar`
      // boolean to `payload.builder === "lennar"` per `Lennar_Payload_Schema.md` §2.2.
      // Behavior unchanged; the check caught up to the envelope after the flag was retired.
      // Lot (Input_622) confirmed pre-populated by Matrix from the tax record on Harpers
      // Mill taxid path in that same test — SKIP-TAXID is correct for Lot for all builders.
      // New/copy-path write gains a blank-string fallback to handle Lennar payloads that
      // omit Lot on the new path per schema §4.1's explicit tolerance for missing data.
      if (path !== "taxid" || payload.builder === "lennar") {
        setField('Input_44', d.year_built);
        setField('Input_48', d.rooms);
        setField('Input_49', d.levels);
        setField('Input_47', d.bedrooms);
      }
      if (path !== "taxid") {
        setField('Input_622', d.lot || "");
      }
```

No other changes to `docs/cvrmls/CVRMLS_Bookmarklet_Source.md`.

Do not commit yet. Changes for `bookmarklets/listing_info.html` follow in a separate handoff.

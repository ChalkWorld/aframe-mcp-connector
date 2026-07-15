---
title: Cursor Handoff — bookmarklets/listing_info.html — 2026-07-15
document_id: HANDOFF-2026-07-15-listing-info-bookmarklet
date: 2026-07-15
project: AAR-TC CVRMLS Matrix Bookmarklet
---

Apply the changes below surgically to `bookmarklets/listing_info.html`. Do not modify anything not listed here.

Context: matches the JS source-of-truth updates in `HANDOFF-2026-07-15-cvrmls-bookmarklet-source.md`. Migrates the Lennar carveout to `payload.builder === "lennar"`, adds the Post Office (`Input_41`) write, and adds the `|| ""` fallback to the Lot (`Input_622`) write. Also corrects the reference block in the payload details section to reflect the actual grouping the code now uses.

## Change 1

Replace the drag-target `<a>` line with the updated URL-encoded bookmarklet. The new href contains: `payload.builder === "lennar"` (was `payload.lennar`), a new `setField('Input_41', d.post_office || "")` line between Neighborhood and Elementary School, and `d.lot || ""` in the Lot write.

**Find:**
```html
    <a class="drag-target" href="javascript:(function()%20%7Bfunction%20setField(id%2C%20value)%20%7Bvar%20el%20%3D%20document.getElementById(id)%3Bif%20(el)%20%7B%20el.value%20%3D%20value%3B%20%7D%7Dfunction%20fireChange(id)%20%7Bvar%20el%20%3D%20document.getElementById(id)%3Bif%20(el)%20%7B%20el.dispatchEvent(new%20Event('change'%2C%20%7Bbubbles%3A%20true%7D))%3B%20%7D%7Dfunction%20wait(ms)%20%7Breturn%20new%20Promise(function(resolve)%20%7B%20setTimeout(resolve%2C%20ms)%3B%20%7D)%3B%7Dnavigator.clipboard.readText().then(function(text)%20%7Bvar%20payload%20%3D%20JSON.parse(text)%3Bvar%20d%20%3D%20payload.listing%3Bvar%20path%20%3D%20payload.path%20%7C%7C%20%22new%22%3B(async%20function()%20%7BsetField('Input_29'%2C%20d.county_city)%3BfireChange('Input_29')%3Bawait%20wait(1500)%3BsetField('Input_30'%2C%20d.area)%3BfireChange('Input_30')%3Bawait%20wait(800)%3Bif%20(path%20!%3D%3D%20%22taxid%22)%20%7B%20setField('Input_635'%2C%20d.zip)%3B%20%7DsetField('Input_259'%2C%20d.subdivision%20%7C%7C%20%22%22)%3BsetField('Input_236'%2C%20d.neighborhood%20%7C%7C%20%22%22)%3BsetField('Input_51'%2C%20d.elementary)%3BsetField('Input_53'%2C%20d.middle)%3BsetField('Input_52'%2C%20d.high)%3BsetField('Input_31'%2C%20d.list_price)%3BsetField('Input_160'%2C%20d.list_date)%3BsetField('Input_849'%2C%20d.type)%3BsetField('Input_850'%2C%20d.attached_yn)%3BsetField('Input_162'%2C%20d.expire_date)%3BsetField('Input_32'%2C%20d.delayed_show%20%7C%7C%20%220%22)%3BsetField('Input_42'%2C%20d.new_resale%20%7C%7C%20%22%22)%3BsetField('Input_45'%2C%20d.year_built_desc%20%7C%7C%20%22%22)%3Bif%20(path%20!%3D%3D%20%22taxid%22)%20%7B%20setField('Input_99'%2C%20d.pid%20%7C%7C%20%22%22)%3B%20%7Dif%20(path%20%3D%3D%3D%20%22new%22)%20%7BsetField('Input_34'%2C%20d.street_num)%3BsetField('Input_36'%2C%20d.street_name)%3BsetField('Input_37'%2C%20d.street_suffix)%3B%7DsetField('Input_35'%2C%20d.street_dir%20%7C%7C%20%22%22)%3Bif%20(path%20!%3D%3D%20%22taxid%22%20%7C%7C%20payload.lennar)%20%7BsetField('Input_44'%2C%20d.year_built)%3BsetField('Input_48'%2C%20d.rooms)%3BsetField('Input_49'%2C%20d.levels)%3BsetField('Input_47'%2C%20d.bedrooms)%3B%7Dif%20(path%20!%3D%3D%20%22taxid%22)%20%7BsetField('Input_622'%2C%20d.lot)%3B%7DsetField('Input_97'%2C%20d.sqft_source%20%7C%7C%20%2201%22)%3BsetField('Input_879'%2C%20d.sqft_above_finished%20%7C%7C%20%220%22)%3BsetField('Input_882'%2C%20d.sqft_below_finished%20%7C%7C%20%220%22)%3BsetField('Input_880'%2C%20d.sqft_above_unfinished%20%7C%7C%20%220%22)%3BsetField('Input_883'%2C%20d.sqft_below_unfinished%20%7C%7C%20%220%22)%3B%7D)()%3B%7D).catch(function(e)%20%7Balert('Bookmarklet%20error%20%E2%80%94%20could%20not%20read%20clipboard%3A%20'%20%2B%20e.message)%3B%7D)%3B%7D)()%3B">Listing Info</a>
```

**Replace with:**
```html
    <a class="drag-target" href="javascript:(function()%20%7Bfunction%20setField(id%2C%20value)%20%7Bvar%20el%20%3D%20document.getElementById(id)%3Bif%20(el)%20%7B%20el.value%20%3D%20value%3B%20%7D%7Dfunction%20fireChange(id)%20%7Bvar%20el%20%3D%20document.getElementById(id)%3Bif%20(el)%20%7B%20el.dispatchEvent(new%20Event('change'%2C%20%7Bbubbles%3A%20true%7D))%3B%20%7D%7Dfunction%20wait(ms)%20%7Breturn%20new%20Promise(function(resolve)%20%7B%20setTimeout(resolve%2C%20ms)%3B%20%7D)%3B%7Dnavigator.clipboard.readText().then(function(text)%20%7Bvar%20payload%20%3D%20JSON.parse(text)%3Bvar%20d%20%3D%20payload.listing%3Bvar%20path%20%3D%20payload.path%20%7C%7C%20%22new%22%3B(async%20function()%20%7BsetField('Input_29'%2C%20d.county_city)%3BfireChange('Input_29')%3Bawait%20wait(1500)%3BsetField('Input_30'%2C%20d.area)%3BfireChange('Input_30')%3Bawait%20wait(800)%3Bif%20(path%20!%3D%3D%20%22taxid%22)%20%7B%20setField('Input_635'%2C%20d.zip)%3B%20%7DsetField('Input_259'%2C%20d.subdivision%20%7C%7C%20%22%22)%3BsetField('Input_236'%2C%20d.neighborhood%20%7C%7C%20%22%22)%3BsetField('Input_41'%2C%20d.post_office%20%7C%7C%20%22%22)%3BsetField('Input_51'%2C%20d.elementary)%3BsetField('Input_53'%2C%20d.middle)%3BsetField('Input_52'%2C%20d.high)%3BsetField('Input_31'%2C%20d.list_price)%3BsetField('Input_160'%2C%20d.list_date)%3BsetField('Input_849'%2C%20d.type)%3BsetField('Input_850'%2C%20d.attached_yn)%3BsetField('Input_162'%2C%20d.expire_date)%3BsetField('Input_32'%2C%20d.delayed_show%20%7C%7C%20%220%22)%3BsetField('Input_42'%2C%20d.new_resale%20%7C%7C%20%22%22)%3BsetField('Input_45'%2C%20d.year_built_desc%20%7C%7C%20%22%22)%3Bif%20(path%20!%3D%3D%20%22taxid%22)%20%7B%20setField('Input_99'%2C%20d.pid%20%7C%7C%20%22%22)%3B%20%7Dif%20(path%20%3D%3D%3D%20%22new%22)%20%7BsetField('Input_34'%2C%20d.street_num)%3BsetField('Input_36'%2C%20d.street_name)%3BsetField('Input_37'%2C%20d.street_suffix)%3B%7DsetField('Input_35'%2C%20d.street_dir%20%7C%7C%20%22%22)%3Bif%20(path%20!%3D%3D%20%22taxid%22%20%7C%7C%20payload.builder%20%3D%3D%3D%20%22lennar%22)%20%7BsetField('Input_44'%2C%20d.year_built)%3BsetField('Input_48'%2C%20d.rooms)%3BsetField('Input_49'%2C%20d.levels)%3BsetField('Input_47'%2C%20d.bedrooms)%3B%7Dif%20(path%20!%3D%3D%20%22taxid%22)%20%7B%20setField('Input_622'%2C%20d.lot%20%7C%7C%20%22%22)%3B%20%7DsetField('Input_97'%2C%20d.sqft_source%20%7C%7C%20%2201%22)%3BsetField('Input_879'%2C%20d.sqft_above_finished%20%7C%7C%20%220%22)%3BsetField('Input_882'%2C%20d.sqft_below_finished%20%7C%7C%20%220%22)%3BsetField('Input_880'%2C%20d.sqft_above_unfinished%20%7C%7C%20%220%22)%3BsetField('Input_883'%2C%20d.sqft_below_unfinished%20%7C%7C%20%220%22)%3B%7D)()%3B%7D).catch(function(e)%20%7Balert('Bookmarklet%20error%20%E2%80%94%20could%20not%20read%20clipboard%3A%20'%20%2B%20e.message)%3B%7D)%3B%7D)()%3B">Listing Info</a>
```

## Change 2

Update the reference block inside the payload details `<pre>` — the current block groups Year Built / Rooms / Levels / Bedrooms with Lot under a single "non-taxid paths only" heading, which no longer reflects the code. The four property-detail fields now write on Lennar taxid path too (via `payload.builder === "lennar"`); Lot remains SKIP-TAXID for all builders and gains an explicit blank-fallback note.

**Find:**
```
FROM PAYLOAD — non-taxid paths only (pre-populated on taxid path):
  Input_44  — Year Built
  Input_48  — Rooms
  Input_49  — Levels
  Input_622 — Lot
  Input_47  — Bedrooms
```

**Replace with:**
```
FROM PAYLOAD — non-taxid paths, OR taxid path when payload.builder === "lennar"
(standard taxid path pre-populates these from tax record; Lennar new-construction
parcels typically lack them, so payload writes them explicitly):
  Input_44  — Year Built
  Input_48  — Rooms
  Input_49  — Levels
  Input_47  — Bedrooms

FROM PAYLOAD — non-taxid paths only (pre-populated on taxid path for all builders):
  Input_622 — Lot                → falls back to "" if not in payload
```

No other changes to `bookmarklets/listing_info.html`.

## Commit

This is the final handoff in the 2026-07-15 listing-info smoke-test fix sequence. Delete both handoff files and commit:

```bash
git rm handoffs/HANDOFF-2026-07-15-cvrmls-bookmarklet-source.md handoffs/HANDOFF-2026-07-15-listing-info-bookmarklet.md
git add -A
git commit -m "listing_info: envelope migration + Post Office write + Lot fallback (smoke test 2026-07-15)

Fixes surfaced by live smoke test on 8720 Whitman Dr (Harpers Mill TH, taxid path).

- Migrate Lennar carveout from retired \`payload.lennar\` to envelope's
  \`payload.builder === \"lennar\"\` per Lennar_Payload_Schema.md §2.2.
  Restores Year Built / Rooms / Levels / Bedrooms writes on Lennar taxid path.

- Add Post Office (Input_41) as unconditional payload-driven write with
  blank fallback, matching the Subdivision pattern from v0.4. Community-driven
  for Lennar; harmless blank for standard MLS (field remains human-picked).

- Add blank-string fallback to Lot (Input_622) new/copy-path write to prevent
  undefined string coercion when Lennar payloads omit Lot per schema §4.1.

Confirms v0.5's 'Lot left as-is, unconfirmed' note: Harpers Mill taxid autofills
Lot from tax record, so SKIP-TAXID is correct for all builders.

CVRMLS_Bookmarklet_Source.md bumped to v0.6.
bookmarklets/listing_info.html reference block updated to match new grouping."
git push origin main
```

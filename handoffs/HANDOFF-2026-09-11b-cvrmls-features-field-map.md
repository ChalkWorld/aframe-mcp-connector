---
title: Cursor Handoff — CVRMLS_Features_Field_Map.md — 2026-09-11b
document_id: HANDOFF-2026-09-11b-cvrmls-features-field-map
date: 2026-09-11
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to `docs/cvrmls/CVRMLS_Features_Field_Map.md`. Do not modify anything not listed here.

This handoff assumes v1.1 (from `HANDOFF-2026-09-11-cvrmls-features-field-map.md`) has already landed — confirmed live on GitHub before authoring this handoff.

---

## Change 1 — Header block + Version History addition

Bumps version to 1.2, records completion of the remaining 18-group verification pass.

**Find:**
```
**Version:** 1.1
**Last Updated:** September 11, 2026
**Addendum to:** `CVRMLS_Bookmarklet_Build.md` (`AAR-TC-CVRMLS-BM-001`)

*Extraction complete — all 10 chunks documented. Ready for bookmarklet build.*

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-27 | Andrew Rich / Claude | Initial extraction — all 10 chunks, ~49 field groups. |
| 1.1 | 2026-09-11 | Andrew Rich / Claude | Live-extraction verification pass (Claude in Chrome ES session) on the 12 groups flagged as suffix-gap candidates during the AAR-TC Lennar Operational Project's Features pre-write checkpoint: Water Type, Disabl Feat, Style, Restrictions, Garage, Attic, Building/Structure, Siding, Structure, Roof, Basement/Foundation, Unit Placement. 11 of 12 confirmed exact matches with no changes. Siding was missing one option — Composite (`Input_71_26`) — added; count corrected 23 → 24. Each verified group's header now states its confirmed option count. Remaining Tier 1/Tier 3 groups (sequence-clean or small/unconfirmable, no proven gap) are not yet live-verified — see the session's Features pre-write checkpoint doc for the full tier breakdown. |
```

**Replace with:**
```
**Version:** 1.2
**Last Updated:** September 11, 2026
**Addendum to:** `CVRMLS_Bookmarklet_Build.md` (`AAR-TC-CVRMLS-BM-001`)

*Extraction complete — all 10 chunks documented. Ready for bookmarklet build.*

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-27 | Andrew Rich / Claude | Initial extraction — all 10 chunks, ~49 field groups. |
| 1.1 | 2026-09-11 | Andrew Rich / Claude | Live-extraction verification pass (Claude in Chrome ES session) on the 12 groups flagged as suffix-gap candidates during the AAR-TC Lennar Operational Project's Features pre-write checkpoint: Water Type, Disabl Feat, Style, Restrictions, Garage, Attic, Building/Structure, Siding, Structure, Roof, Basement/Foundation, Unit Placement. 11 of 12 confirmed exact matches with no changes. Siding was missing one option — Composite (`Input_71_26`) — added; count corrected 23 → 24. Each verified group's header now states its confirmed option count. Remaining Tier 1/Tier 3 groups (sequence-clean or small/unconfirmable, no proven gap) are not yet live-verified — see the session's Features pre-write checkpoint doc for the full tier breakdown. |
| 1.2 | 2026-09-11 | Andrew Rich / Claude | Live-extraction verification pass completed on the remaining 18 groups (the prior pass's Tier 1 "sequence-clean" and Tier 3 "small/named-suffix" candidates): Flooring, Golf View/Frontage, Parking, Currently Connected Internet, Water, Sewer/Septic, Fenced, Fireplace, Green Cert, Pool Description, Heating, Water Heater, Heat/Fuel, Porch, Cooling, Wall Type, Farm Type, Irrigation Source. All 18 confirmed exact matches — no additions, no removals. Every checkbox group in this document (30 of 30 previously unconfirmed groups, plus the 4 that already carried stated counts) now has a stated, live-confirmed option count. Field map is fully verified end to end as of this version. |
```

Do not commit yet. More changes follow.

---

## Change 2 — Flooring

**Find:**
```
### Flooring

Checkbox group.

| Label | Input ID |
|---|---|
| Bamboo | `Input_73_16` |
| Carpet-Part | `Input_73_01` |
| Carpet-W-W | `Input_73_02` |
| Concrete | `Input_73_03` |
| Cork | `Input_73_15` |
| Granite | `Input_73_04` |
| Laminate | `Input_73_12` |
| Linoleum | `Input_73_05` |
| Marble | `Input_73_06` |
| Slate | `Input_73_07` |
| Tile | `Input_73_08` |
| Tile-Ceramic | `Input_73_09` |
| Vinyl | `Input_73_10` |
| Vinyl - Plank/Tile/Stone | `Input_73_17` |
| Wood | `Input_73_11` |
| Wood-Parquet | `Input_73_13` |
| Wood-Part | `Input_73_14` |
```

**Replace with:**
```
### Flooring

Checkbox group (17 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Bamboo | `Input_73_16` |
| Carpet-Part | `Input_73_01` |
| Carpet-W-W | `Input_73_02` |
| Concrete | `Input_73_03` |
| Cork | `Input_73_15` |
| Granite | `Input_73_04` |
| Laminate | `Input_73_12` |
| Linoleum | `Input_73_05` |
| Marble | `Input_73_06` |
| Slate | `Input_73_07` |
| Tile | `Input_73_08` |
| Tile-Ceramic | `Input_73_09` |
| Vinyl | `Input_73_10` |
| Vinyl - Plank/Tile/Stone | `Input_73_17` |
| Wood | `Input_73_11` |
| Wood-Parquet | `Input_73_13` |
| Wood-Part | `Input_73_14` |
```

Do not commit yet. More changes follow.

---

## Change 3 — Golf View/Frontage

**Find:**
```
### Golf View/Frontage

Checkbox group. *Named suffixes, not numeric.*

| Label | Input ID |
|---|---|
| Cart Path Side | `Input_721_CartPath` |
| Fairway | `Input_721_Fairway` |
| Green | `Input_721_Green` |
| Tee | `Input_721_Tee` |
| View | `Input_721_View` |
```

**Replace with:**
```
### Golf View/Frontage

Checkbox group (5 options, confirmed via live extraction 2026-09-11). *Named suffixes, not numeric.*

| Label | Input ID |
|---|---|
| Cart Path Side | `Input_721_CartPath` |
| Fairway | `Input_721_Fairway` |
| Green | `Input_721_Green` |
| Tee | `Input_721_Tee` |
| View | `Input_721_View` |
```

Do not commit yet. More changes follow.

---

## Change 4 — Parking

**Find:**
```
### Parking

Checkbox group.

| Label | Input ID |
|---|---|
| Assigned | `Input_519_01` |
| Carport | `Input_519_02` |
| Circular Drive | `Input_519_03` |
| Common Drive | `Input_519_04` |
| Covered | `Input_519_05` |
| Double Width | `Input_519_06` |
| In Alley | `Input_519_07` |
| No Parking | `Input_519_08` |
| Off Street | `Input_519_09` |
| On Street | `Input_519_10` |
| Open Lot | `Input_519_11` |
| Paved Driveway | `Input_519_12` |
| Underground | `Input_519_13` |
| Unpaved Driveway | `Input_519_14` |
| Valet | `Input_519_15` |
| Visitor | `Input_519_16` |
```

**Replace with:**
```
### Parking

Checkbox group (16 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Assigned | `Input_519_01` |
| Carport | `Input_519_02` |
| Circular Drive | `Input_519_03` |
| Common Drive | `Input_519_04` |
| Covered | `Input_519_05` |
| Double Width | `Input_519_06` |
| In Alley | `Input_519_07` |
| No Parking | `Input_519_08` |
| Off Street | `Input_519_09` |
| On Street | `Input_519_10` |
| Open Lot | `Input_519_11` |
| Paved Driveway | `Input_519_12` |
| Underground | `Input_519_13` |
| Unpaved Driveway | `Input_519_14` |
| Valet | `Input_519_15` |
| Visitor | `Input_519_16` |
```

Do not commit yet. More changes follow.

---

## Change 5 — Currently Connected Internet

**Find:**
```
### Currently Connected Internet

Checkbox group. *Named suffixes, not numeric.*

| Label | Input ID |
|---|---|
| Addtl Info | `Input_845_ADDINFO` |
| Cable | `Input_845_CABLE` |
| DSL | `Input_845_DSL` |
| Fiber | `Input_845_FIBER` |
| Other | `Input_845_OTHER` |
| Satellite | `Input_845_SATELLITE` |
| Unknown | `Input_845_UNKNOWN` |
```

**Replace with:**
```
### Currently Connected Internet

Checkbox group (7 options, confirmed via live extraction 2026-09-11). *Named suffixes, not numeric.*

| Label | Input ID |
|---|---|
| Addtl Info | `Input_845_ADDINFO` |
| Cable | `Input_845_CABLE` |
| DSL | `Input_845_DSL` |
| Fiber | `Input_845_FIBER` |
| Other | `Input_845_OTHER` |
| Satellite | `Input_845_SATELLITE` |
| Unknown | `Input_845_UNKNOWN` |
```

Do not commit yet. More changes follow.

---

## Change 6 — Water

**Find:**
```
### Water

Checkbox group. *Named suffixes, not numeric.*

| Label | Input ID |
|---|---|
| Community Well | `Input_676_CW` |
| Other | `Input_676_OTHER` |
| Public Water | `Input_676_PW` |
| Well | `Input_676_WELL` |
```

**Replace with:**
```
### Water

Checkbox group (4 options, confirmed via live extraction 2026-09-11). *Named suffixes, not numeric.*

| Label | Input ID |
|---|---|
| Community Well | `Input_676_CW` |
| Other | `Input_676_OTHER` |
| Public Water | `Input_676_PW` |
| Well | `Input_676_WELL` |
```

Do not commit yet. More changes follow.

---

## Change 7 — Sewer/Septic

**Find:**
```
### Sewer/Septic

Checkbox group. *Named suffixes, not numeric.*

| Label | Input ID |
|---|---|
| Septic - Alternative | `Input_670_ALTSEPTC` |
| Septic - Conventional | `Input_670_COSEPTC` |
| Community - Sewer/Septic | `Input_670_COMSR` |
| Sewer - Public | `Input_670_PBLCSR` |
| None | `Input_670_NONE` |
| Other - See Remarks | `Input_670_OTHER` |
| Unknown | `Input_670_UNKNOWN` |
```

**Replace with:**
```
### Sewer/Septic

Checkbox group (7 options, confirmed via live extraction 2026-09-11). *Named suffixes, not numeric.*

| Label | Input ID |
|---|---|
| Septic - Alternative | `Input_670_ALTSEPTC` |
| Septic - Conventional | `Input_670_COSEPTC` |
| Community - Sewer/Septic | `Input_670_COMSR` |
| Sewer - Public | `Input_670_PBLCSR` |
| None | `Input_670_NONE` |
| Other - See Remarks | `Input_670_OTHER` |
| Unknown | `Input_670_UNKNOWN` |
```

Do not commit yet. More changes follow.

---

## Change 8 — Fenced

**Find:**
```
### Fenced

Checkbox group.

| Label | Input ID |
|---|---|
| All Fenced | `Input_79_01` |
| Barbed | `Input_79_02` |
| Board | `Input_79_03` |
| Cedar | `Input_79_04` |
| Chain Link | `Input_79_05` |
| Combination | `Input_79_06` |
| Decorative | `Input_79_07` |
| Electric | `Input_79_08` |
| Front Only | `Input_79_09` |
| Invisible | `Input_79_10` |
| No Fencing | `Input_79_11` |
| Part Fenced | `Input_79_12` |
| Picket | `Input_79_13` |
| Privacy | `Input_79_14` |
| Rear Only | `Input_79_15` |
| Security | `Input_79_16` |
| Split Rail | `Input_79_17` |
| Vinyl/PVC | `Input_79_20` |
| Wall | `Input_79_18` |
| Wrought Iron | `Input_79_19` |
```

**Replace with:**
```
### Fenced

Checkbox group (20 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| All Fenced | `Input_79_01` |
| Barbed | `Input_79_02` |
| Board | `Input_79_03` |
| Cedar | `Input_79_04` |
| Chain Link | `Input_79_05` |
| Combination | `Input_79_06` |
| Decorative | `Input_79_07` |
| Electric | `Input_79_08` |
| Front Only | `Input_79_09` |
| Invisible | `Input_79_10` |
| No Fencing | `Input_79_11` |
| Part Fenced | `Input_79_12` |
| Picket | `Input_79_13` |
| Privacy | `Input_79_14` |
| Rear Only | `Input_79_15` |
| Security | `Input_79_16` |
| Split Rail | `Input_79_17` |
| Vinyl/PVC | `Input_79_20` |
| Wall | `Input_79_18` |
| Wrought Iron | `Input_79_19` |
```

Do not commit yet. More changes follow.

---

## Change 9 — Fireplace

**Find:**
```
### Fireplace

Checkbox group.

| Label | Input ID |
|---|---|
| Brick | `Input_90_01` |
| Direct Vent | `Input_90_02` |
| Electric | `Input_90_09` |
| Gas | `Input_90_03` |
| Non-Vented | `Input_90_08` |
| Non-Working | `Input_90_04` |
| Prefabricate | `Input_90_05` |
| Stone | `Input_90_06` |
| Wood Burning | `Input_90_07` |
```

**Replace with:**
```
### Fireplace

Checkbox group (9 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Brick | `Input_90_01` |
| Direct Vent | `Input_90_02` |
| Electric | `Input_90_09` |
| Gas | `Input_90_03` |
| Non-Vented | `Input_90_08` |
| Non-Working | `Input_90_04` |
| Prefabricate | `Input_90_05` |
| Stone | `Input_90_06` |
| Wood Burning | `Input_90_07` |
```

Do not commit yet. More changes follow.

---

## Change 10 — Green Cert

**Find:**
```
### Green Cert

Checkbox group.

| Label | Input ID |
|---|---|
| EarthCraft | `Input_85_03` |
| Energy Star Appliances | `Input_85_06` |
| Energy Star/House | `Input_85_02` |
| Home Performance w/Energy Star (exist homes) | `Input_85_05` |
| Leed for Homes | `Input_85_07` |
| National Green Building Standard | `Input_85_01` |
| Other | `Input_85_04` |
```

**Replace with:**
```
### Green Cert

Checkbox group (7 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| EarthCraft | `Input_85_03` |
| Energy Star Appliances | `Input_85_06` |
| Energy Star/House | `Input_85_02` |
| Home Performance w/Energy Star (exist homes) | `Input_85_05` |
| Leed for Homes | `Input_85_07` |
| National Green Building Standard | `Input_85_01` |
| Other | `Input_85_04` |
```

Do not commit yet. More changes follow.

---

## Change 11 — Pool Description

**Find:**
```
### Pool Description

Checkbox group.

| Label | Input ID |
|---|---|
| Above Ground | `Input_91_01` |
| Community/Off Site | `Input_91_02` |
| Concrete | `Input_91_03` |
| Covered | `Input_91_04` |
| Fenced | `Input_91_05` |
| Gunite | `Input_91_06` |
| Heated | `Input_91_07` |
| Hot Tub | `Input_91_08` |
| In Ground | `Input_91_09` |
| Indoor | `Input_91_10` |
| Lap Pool | `Input_91_11` |
| Membership Req | `Input_91_12` |
| Other | `Input_91_13` |
| Outdoor | `Input_91_14` |
| Pool Equipment | `Input_91_15` |
| Pool House | `Input_91_16` |
| Self-Cleaner | `Input_91_17` |
| Vinyl | `Input_91_18` |
| With Spa | `Input_91_19` |
| Within Yard | `Input_91_20` |
```

**Replace with:**
```
### Pool Description

Checkbox group (20 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Above Ground | `Input_91_01` |
| Community/Off Site | `Input_91_02` |
| Concrete | `Input_91_03` |
| Covered | `Input_91_04` |
| Fenced | `Input_91_05` |
| Gunite | `Input_91_06` |
| Heated | `Input_91_07` |
| Hot Tub | `Input_91_08` |
| In Ground | `Input_91_09` |
| Indoor | `Input_91_10` |
| Lap Pool | `Input_91_11` |
| Membership Req | `Input_91_12` |
| Other | `Input_91_13` |
| Outdoor | `Input_91_14` |
| Pool Equipment | `Input_91_15` |
| Pool House | `Input_91_16` |
| Self-Cleaner | `Input_91_17` |
| Vinyl | `Input_91_18` |
| With Spa | `Input_91_19` |
| Within Yard | `Input_91_20` |
```

Do not commit yet. More changes follow.

---

## Change 12 — Heating

**Find:**
```
### Heating

Checkbox group.

| Label | Input ID |
|---|---|
| 2 Zoned Heat | `Input_86_01` |
| 3 Or More Zones | `Input_86_02` |
| Baseboard | `Input_86_03` |
| Coal Stove | `Input_86_04` |
| Electric | `Input_86_05` |
| Floor Furnace | `Input_86_06` |
| Forced Hot Air | `Input_86_07` |
| Geothermal | `Input_86_19` |
| Heat Pump | `Input_86_08` |
| Hot Water | `Input_86_09` |
| Hot Water Coil | `Input_86_10` |
| Other | `Input_86_11` |
| Radiant | `Input_86_12` |
| Radiator | `Input_86_13` |
| Space Heater | `Input_86_14` |
| Steam | `Input_86_15` |
| Timer Thermostat | `Input_86_16` |
| Wall Furnace | `Input_86_17` |
| Wood Stove | `Input_86_18` |
```

**Replace with:**
```
### Heating

Checkbox group (19 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| 2 Zoned Heat | `Input_86_01` |
| 3 Or More Zones | `Input_86_02` |
| Baseboard | `Input_86_03` |
| Coal Stove | `Input_86_04` |
| Electric | `Input_86_05` |
| Floor Furnace | `Input_86_06` |
| Forced Hot Air | `Input_86_07` |
| Geothermal | `Input_86_19` |
| Heat Pump | `Input_86_08` |
| Hot Water | `Input_86_09` |
| Hot Water Coil | `Input_86_10` |
| Other | `Input_86_11` |
| Radiant | `Input_86_12` |
| Radiator | `Input_86_13` |
| Space Heater | `Input_86_14` |
| Steam | `Input_86_15` |
| Timer Thermostat | `Input_86_16` |
| Wall Furnace | `Input_86_17` |
| Wood Stove | `Input_86_18` |
```

Do not commit yet. More changes follow.

---

## Change 13 — Water Heater

**Find:**
```
### Water Heater

Checkbox group.

| Label | Input ID |
|---|---|
| Central Source | `Input_571_12` |
| Electric | `Input_571_01` |
| Instant Hot | `Input_571_02` |
| Insulated | `Input_571_03` |
| Natural Gas | `Input_571_04` |
| Off Furnace | `Input_571_05` |
| Oil | `Input_571_06` |
| Other | `Input_571_07` |
| Propane Gas | `Input_571_08` |
| Recirculating | `Input_571_13` |
| Solar | `Input_571_09` |
| Tank | `Input_571_10` |
| Tankless | `Input_571_11` |
```

**Replace with:**
```
### Water Heater

Checkbox group (13 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Central Source | `Input_571_12` |
| Electric | `Input_571_01` |
| Instant Hot | `Input_571_02` |
| Insulated | `Input_571_03` |
| Natural Gas | `Input_571_04` |
| Off Furnace | `Input_571_05` |
| Oil | `Input_571_06` |
| Other | `Input_571_07` |
| Propane Gas | `Input_571_08` |
| Recirculating | `Input_571_13` |
| Solar | `Input_571_09` |
| Tank | `Input_571_10` |
| Tankless | `Input_571_11` |
```

Do not commit yet. More changes follow.

---

## Change 14 — Heat/Fuel

**Find:**
```
### Heat/Fuel

Checkbox group.

| Label | Input ID |
|---|---|
| Coal | `Input_87_01` |
| Electric | `Input_87_02` |
| Geothermal | `Input_87_03` |
| Multi-Fuel System | `Input_87_04` |
| Natural Gas | `Input_87_05` |
| None | `Input_87_06` |
| Oil | `Input_87_07` |
| Other | `Input_87_08` |
| Propane Gas | `Input_87_09` |
| Solar | `Input_87_10` |
| Wood | `Input_87_11` |
```

**Replace with:**
```
### Heat/Fuel

Checkbox group (11 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Coal | `Input_87_01` |
| Electric | `Input_87_02` |
| Geothermal | `Input_87_03` |
| Multi-Fuel System | `Input_87_04` |
| Natural Gas | `Input_87_05` |
| None | `Input_87_06` |
| Oil | `Input_87_07` |
| Other | `Input_87_08` |
| Propane Gas | `Input_87_09` |
| Solar | `Input_87_10` |
| Wood | `Input_87_11` |
```

Do not commit yet. More changes follow.

---

## Change 15 — Porch

**Find:**
```
### Porch

Checkbox group.

| Label | Input ID |
|---|---|
| Balcony | `Input_92_01` |
| Deck | `Input_92_02` |
| Front | `Input_92_03` |
| Front Country | `Input_92_05` |
| Front Full | `Input_92_04` |
| Glass | `Input_92_06` |
| Patio | `Input_92_07` |
| Rear | `Input_92_08` |
| Screened | `Input_92_09` |
| Side | `Input_92_10` |
| Sleeping Porch | `Input_92_11` |
| Stoop | `Input_92_12` |
| Wrap Around | `Input_92_13` |
```

**Replace with:**
```
### Porch

Checkbox group (13 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Balcony | `Input_92_01` |
| Deck | `Input_92_02` |
| Front | `Input_92_03` |
| Front Country | `Input_92_05` |
| Front Full | `Input_92_04` |
| Glass | `Input_92_06` |
| Patio | `Input_92_07` |
| Rear | `Input_92_08` |
| Screened | `Input_92_09` |
| Side | `Input_92_10` |
| Sleeping Porch | `Input_92_11` |
| Stoop | `Input_92_12` |
| Wrap Around | `Input_92_13` |
```

Do not commit yet. More changes follow.

---

## Change 16 — Cooling

**Find:**
```
### Cooling

Checkbox group. *`Input_88_13` (Geothermal) is non-sequential — do not assume suffix order matches display order.*

| Label | Input ID |
|---|---|
| 2 Zoned AC | `Input_88_01` |
| 3 Or More Zones | `Input_88_02` |
| Central Air | `Input_88_03` |
| Electric | `Input_88_04` |
| Gas A/C | `Input_88_05` |
| Geothermal | `Input_88_13` |
| Heat Pump | `Input_88_06` |
| Individual Wall Units | `Input_88_07` |
| Individual Window Units | `Input_88_08` |
| None | `Input_88_09` |
| Other | `Input_88_10` |
| Timer Thermostat | `Input_88_11` |
| Whole House Fan | `Input_88_12` |
```

**Replace with:**
```
### Cooling

Checkbox group (13 options, confirmed via live extraction 2026-09-11). *`Input_88_13` (Geothermal) is non-sequential — do not assume suffix order matches display order.*

| Label | Input ID |
|---|---|
| 2 Zoned AC | `Input_88_01` |
| 3 Or More Zones | `Input_88_02` |
| Central Air | `Input_88_03` |
| Electric | `Input_88_04` |
| Gas A/C | `Input_88_05` |
| Geothermal | `Input_88_13` |
| Heat Pump | `Input_88_06` |
| Individual Wall Units | `Input_88_07` |
| Individual Window Units | `Input_88_08` |
| None | `Input_88_09` |
| Other | `Input_88_10` |
| Timer Thermostat | `Input_88_11` |
| Whole House Fan | `Input_88_12` |
```

Do not commit yet. More changes follow.

---

## Change 17 — Wall Type

**Find:**
```
### Wall Type

Checkbox group.

| Label | Input ID |
|---|---|
| Block | `Input_254_09` |
| Brick | `Input_254_10` |
| Drywall | `Input_254_02` |
| Glass | `Input_254_07` |
| Glass Block | `Input_254_08` |
| Mixed | `Input_254_04` |
| Other | `Input_254_05` |
| Paneling | `Input_254_03` |
| Plaster | `Input_254_01` |
| Wood | `Input_254_06` |
```

**Replace with:**
```
### Wall Type

Checkbox group (10 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Block | `Input_254_09` |
| Brick | `Input_254_10` |
| Drywall | `Input_254_02` |
| Glass | `Input_254_07` |
| Glass Block | `Input_254_08` |
| Mixed | `Input_254_04` |
| Other | `Input_254_05` |
| Paneling | `Input_254_03` |
| Plaster | `Input_254_01` |
| Wood | `Input_254_06` |
```

Do not commit yet. More changes follow.

---

## Change 18 — Farm Type

**Find:**
```
### Farm Type

Checkbox group.

| Label | Input ID |
|---|---|
| Cattle | `Input_257_01` |
| Crops | `Input_257_02` |
| Dairy | `Input_257_03` |
| Horse | `Input_257_04` |
| Livestock | `Input_257_05` |
| Nursery | `Input_257_06` |
| Orchard | `Input_257_07` |
| Poultry | `Input_257_08` |
| Tree | `Input_257_09` |
```

**Replace with:**
```
### Farm Type

Checkbox group (9 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Cattle | `Input_257_01` |
| Crops | `Input_257_02` |
| Dairy | `Input_257_03` |
| Horse | `Input_257_04` |
| Livestock | `Input_257_05` |
| Nursery | `Input_257_06` |
| Orchard | `Input_257_07` |
| Poultry | `Input_257_08` |
| Tree | `Input_257_09` |
```

Do not commit yet. More changes follow.

---

## Change 19 — Irrigation Source

**Find:**
```
### Irrigation Source

Checkbox group.

| Label | Input ID |
|---|---|
| Creek/Stream | `Input_258_05` |
| Irrigated | `Input_258_01` |
| Lake | `Input_258_02` |
| Pond | `Input_258_03` |
| River | `Input_258_04` |
```

**Replace with:**
```
### Irrigation Source

Checkbox group (5 options, confirmed via live extraction 2026-09-11).

| Label | Input ID |
|---|---|
| Creek/Stream | `Input_258_05` |
| Irrigated | `Input_258_01` |
| Lake | `Input_258_02` |
| Pond | `Input_258_03` |
| River | `Input_258_04` |
```

No other changes to `docs/cvrmls/CVRMLS_Features_Field_Map.md`.

```bash
git rm handoffs/HANDOFF-2026-09-11b-cvrmls-features-field-map.md
git add -A
git commit -m "docs(cvrmls): Features field map v1.2 — remaining 18 groups live-verified, all clean, field map fully confirmed end to end"
git push origin main
```

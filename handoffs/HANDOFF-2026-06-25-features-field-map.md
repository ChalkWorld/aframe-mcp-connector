---
title: Cursor Handoff — Lennar_MLS_Features_Field_Map.md — second half append
document_id: HANDOFF-2026-06-25-features-field-map
date: 2026-06-25
project: AAR-TC Transaction Services
---

Apply the changes below surgically to `docs/Lennar_MLS_Features_Field_Map.md`. Do not modify anything not listed here.

---

## Change 1

Update the version header from draft to complete, and update the status note.

**Find:**
```
**Version:** 0.1 (draft — extraction in progress)
**Last Updated:** June 25, 2026
**Addendum to:** `Lennar_MLS_Bookmarklet_Build.md` (`AAR-TC-LENNAR-BM-001`)

*Living document — updated as extraction chunks are completed. Chunks 1–5 complete; Chunks 6–10 pending Session 011.*
```

**Replace with:**
```
**Version:** 1.0
**Last Updated:** June 25, 2026
**Addendum to:** `Lennar_MLS_Bookmarklet_Build.md` (`AAR-TC-LENNAR-BM-001`)

*Extraction complete — all 10 chunks documented. Ready for bookmarklet build.*
```

---

## Change 2

Replace the Extraction Status table and closing lines with the completed second-half field maps, a completed status table, and updated footer.

**Find:**
```
---

## Extraction Status

| Chunk | Groups | Status |
|---|---|---|
| 1 | Style, Structure, Siding, Roof, Flooring | ✅ Complete |
| 2 | Golf Frontage Y/N, Golf View/Frontage, Attic, Parking, Exterior | ✅ Complete |
| 3 | Currently Connected Internet, Internet Description, Garage Y/N, # Cars, ADU Y/N, Basement Y/N, ADU Description | ✅ Complete |
| 4 | Garage, Basement/Foundation, Interior, Water, Sewer/Septic | ✅ Complete |
| 5 | Fenced Y/N, Fenced, Restrictions, #FP, Fireplace | ✅ Complete |
| 6 | Community Amenities, Green Cert, Pool Y/N, Pool Description | ⬜ Session 011 |
| 7 | Appl/Equip, Heating, Other Heating Desc, Water Heater | ⬜ Session 011 |
| 8 | Disabl Equipd Y/N, Disabl Feat, Heat/Fuel, Other Heat/Fuel Desc, Porch | ⬜ Session 011 |
| 9 | Maintenance Contract Y/N, Unit Placement, Cooling, Other Cooling Desc | ⬜ Session 011 |
| 10 | Water Type, Wall Type, Building/Structure, Farm Type, Irrigation Source | ⬜ Session 011 |

---

*AAR-TC Transaction Services | Addendum to AAR-TC-LENNAR-BM-001*
*Version 0.1 draft — extraction in progress. Promote to v1.0 when all chunks complete and bookmarklet built.*
```

**Replace with:**
```
---

### Community Amenities — Chunk 6

Checkbox group. Dynamic for Lennar — varies by community (44 options).

| Label | Input ID |
|---|---|
| Association | `Input_534_01` |
| Basketball | `Input_534_02` |
| Beach | `Input_534_41` |
| Boat Ramp | `Input_534_45` |
| City View | `Input_534_33` |
| Clubhouse | `Input_534_03` |
| Common Area | `Input_534_04` |
| Common Laundry | `Input_534_05` |
| Community Room | `Input_534_06` |
| Controlled Access | `Input_534_07` |
| Deck | `Input_534_08` |
| Dock | `Input_534_09` |
| Elevator | `Input_534_10` |
| Exercise Room | `Input_534_11` |
| Extra Storage | `Input_534_12` |
| Fenced Complex | `Input_534_13` |
| Gated Community | `Input_534_31` |
| Golf Course | `Input_534_14` |
| Hot Tub | `Input_534_15` |
| Intercom | `Input_534_36` |
| Jogging Path | `Input_534_16` |
| Kiddie Pool | `Input_534_17` |
| Lake/Pond | `Input_534_42` |
| Landscaping | `Input_534_18` |
| Lifeguard | `Input_534_19` |
| Locked Storage | `Input_534_29` |
| Maintenance Free | `Input_534_40` |
| Marina | `Input_534_20` |
| Offsite Vehicle Storage | `Input_534_37` |
| On Bus Line | `Input_534_21` |
| Picnic Area | `Input_534_46` |
| Playground | `Input_534_22` |
| Pool | `Input_534_47` |
| Professional Management | `Input_534_23` |
| Putting Green | `Input_534_24` |
| Resident Manager | `Input_534_25` |
| Road Maintenance | `Input_534_26` |
| RV/Boat Storage | `Input_534_43` |
| Sauna | `Input_534_27` |
| Security Guard | `Input_534_28` |
| Sports Field | `Input_534_44` |
| Street Lights | `Input_534_32` |
| Tennis Court | `Input_534_30` |
| Water View | `Input_534_34` |

**Lennar use:** DYNAMIC — varies by community. Pulled from clipboard. Common Lennar values: Association, Clubhouse, Exercise Room, Jogging Path, Playground, Pool, Street Lights — confirm per community DB.

---

### Green Cert — Chunk 6

Checkbox group. Dynamic for Lennar — varies by community certification status.

| Label | Input ID |
|---|---|
| EarthCraft | `Input_85_03` |
| Energy Star Appliances | `Input_85_06` |
| Energy Star/House | `Input_85_02` |
| Home Performance w/Energy Star (exist homes) | `Input_85_05` |
| Leed for Homes | `Input_85_07` |
| National Green Building Standard | `Input_85_01` |
| Other | `Input_85_04` |

**Lennar use:** DYNAMIC — varies by community. Pulled from clipboard.

---

### Pool Y/N — Chunk 6

Select/dropdown. Dynamic for Lennar — varies by community.

| Input ID | Option Value | Display Text |
|---|---|---|
| `Input_244` | *(empty)* | *(blank)* |
| `Input_244` | `1` | Yes |
| `Input_244` | `0` | No |

**Lennar use:** DYNAMIC — driven by community DB. Communities with pool: Yes (`1`); without: No (`0`).

---

### Pool Description — Chunk 6

Checkbox group. Only relevant when Pool Y/N = Yes.

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

**Lennar use:** DYNAMIC — skip when Pool Y/N = No. When present, values vary by community. Pulled from clipboard.

---

### Appl/Equip — Chunk 7

Checkbox group. Dynamic for Lennar — varies by plan and community (39 options). This is the appliance list referenced in the listing session protocol formatting rules.

| Label | Input ID |
|---|---|
| Attic Fan | `Input_81_01` |
| Central Vac | `Input_81_02` |
| Compactor | `Input_81_03` |
| Countertop Range | `Input_81_04` |
| Dishwasher | `Input_81_05` |
| Disposal | `Input_81_06` |
| Downdraft Range | `Input_81_07` |
| Dryer | `Input_81_08` |
| Electric Cooking | `Input_81_09` |
| Electric Air Cln | `Input_81_10` |
| EV Charging Station | `Input_81_39` |
| Exhaust Fan | `Input_81_11` |
| Freezer | `Input_81_12` |
| Gas Cooking | `Input_81_13` |
| Gas Grill | `Input_81_14` |
| Humidifier | `Input_81_15` |
| Ice Maker | `Input_81_16` |
| Intercom | `Input_81_17` |
| Microwave | `Input_81_18` |
| Refrigerator | `Input_81_19` |
| Satellite Dish | `Input_81_20` |
| Self/Con Cleaning | `Input_81_21` |
| Smoke Alarm | `Input_81_22` |
| Stove | `Input_81_23` |
| Stove Hood | `Input_81_24` |
| Sump Pump | `Input_81_25` |
| Wall Oven | `Input_81_26` |
| Washer | `Input_81_27` |
| Water Purifier | `Input_81_28` |
| Water Softener | `Input_81_29` |
| Stack Washer/Dryer | `Input_81_30` |
| Drop-In Range | `Input_81_31` |
| Oven | `Input_81_32` |
| Double Oven | `Input_81_33` |
| Smooth Top Cooking | `Input_81_34` |
| Wine Cooler | `Input_81_35` |
| Generator | `Input_81_36` |
| Generator Wired | `Input_81_37` |
| Fire Sprinkler System | `Input_81_38` |

**Lennar use:** DYNAMIC — parsed from listing email per appliance formatting rules in `New_Lennar_Listing_Session_Protocol.md`. Pulled from clipboard.

---

### Heating — Chunk 7

Checkbox group. Dynamic for Lennar — varies by community (heat pump vs forced hot air).

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

**Lennar use:** DYNAMIC — driven by community DB. Pulled from clipboard.

---

### Other Heating Description — Chunk 7

Text input. Rarely used for Lennar.

| Input ID | Type |
|---|---|
| `Input_659` | text |

**Lennar use:** SKIP unless Heating = Other.

---

### Water Heater — Chunk 7

Checkbox group. Dynamic for Lennar — varies by plan and community.

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

**Lennar use:** DYNAMIC — driven by community DB. Pulled from clipboard.

---

### Disabl Equipd Y/N — Chunk 8

Select/dropdown. **Lennar static: No (`0`) — always.**

| Input ID | Option Value | Display Text |
|---|---|---|
| `Input_245` | *(empty)* | *(blank)* |
| `Input_245` | `1` | Yes |
| `Input_245` | `0` | No |

**Lennar use:** STATIC — `0` (No) always. Hardcoded in bookmarklet.

---

### Disabl Feat — Chunk 8

Checkbox group. Always skipped for Lennar (Disabl Equipd Y/N is No). Captured for non-Lennar use.

| Label | Input ID |
|---|---|
| Additional Features | `Input_83_18` |
| Auditory Alarms | `Input_83_19` |
| Chair Lift | `Input_83_20` |
| Comfort Height Switches | `Input_83_21` |
| Elevator | `Input_83_03` |
| Entry Level Accessible Full Bath | `Input_83_22` |
| Entry Level Accessible Kitchen | `Input_83_23` |
| Entry Level Bedrooms | `Input_83_24` |
| Entry Ramp | `Input_83_04` |
| Grab Bars | `Input_83_14` |
| Roll In Shower | `Input_83_09` |
| Roll Under Sink | `Input_83_25` |
| Shower Seat | `Input_83_13` |
| Stair Lift | `Input_83_07` |
| Stepless Entry | `Input_83_26` |
| Variable Height Cabinets | `Input_83_15` |
| Variable Height Counters | `Input_83_16` |
| Visual Alarms | `Input_83_27` |
| Wheelchair Adapted | `Input_83_08` |
| Wide Doorways or Min. 32" Wide Doors | `Input_83_17` |

**Lennar use:** SKIP — Disabl Equipd Y/N is always No. Captured for non-Lennar use.

---

### Heat/Fuel — Chunk 8

Checkbox group. Dynamic for Lennar — varies by community.

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

**Lennar use:** DYNAMIC — driven by community DB. Pulled from clipboard.

---

### Other Heat/Fuel Description — Chunk 8

Text input. Rarely used for Lennar.

| Input ID | Type |
|---|---|
| `Input_660` | text |

**Lennar use:** SKIP unless Heat/Fuel = Other.

---

### Porch — Chunk 8

Checkbox group. Dynamic for Lennar — varies by plan.

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

**Lennar use:** DYNAMIC — varies by plan. Pulled from clipboard.

---

### Maintenance Contract Y/N — Chunk 9

Select/dropdown. **Lennar static: No (`0`) — always.**

| Input ID | Option Value | Display Text |
|---|---|---|
| `Input_671` | *(empty)* | *(blank)* |
| `Input_671` | `1` | Yes |
| `Input_671` | `0` | No |

**Lennar use:** STATIC — `0` (No) always. Hardcoded in bookmarklet.

---

### Unit Placement — Chunk 9

Checkbox group. Dynamic for Lennar — relevant for townhomes only.

| Label | Input ID |
|---|---|
| Corner Unit | `Input_657_01` |
| End Unit | `Input_657_03` |
| Interior Unit | `Input_657_04` |
| Lower Level | `Input_657_05` |
| Middle Level | `Input_657_06` |
| Street Level | `Input_657_07` |
| Top Level | `Input_657_08` |
| Walkout | `Input_657_09` |

**Lennar use:** DYNAMIC — townhome plans only; skip for single-family. Pulled from clipboard.

---

### Cooling — Chunk 9

Checkbox group. Dynamic for Lennar — varies by community.

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

*Note: `Input_88_13` (Geothermal) is non-sequential — added later.*

**Lennar use:** DYNAMIC — driven by community DB. Pulled from clipboard.

---

### Other Cooling Description — Chunk 9

Text input. Rarely used for Lennar.

| Input ID | Type |
|---|---|
| `Input_661` | text |

**Lennar use:** SKIP unless Cooling = Other.

---

### Water Type — Chunk 10

Checkbox group. **Lennar static: none checked — always skipped.** Lennar communities are not waterfront. Captured for non-Lennar use.

| Label | Input ID |
|---|---|
| Access | `Input_542_20` |
| Bay Frontage | `Input_542_02` |
| Beach | `Input_542_03` |
| Creek Frontage | `Input_542_21` |
| Dock/Mooring | `Input_542_05` |
| Harbor Frontage | `Input_542_06` |
| Lake | `Input_542_07` |
| Lake Frontage | `Input_542_08` |
| Marsh | `Input_542_34` |
| MLW 0-2 Ft | `Input_542_33` |
| MLW 2-4 Ft | `Input_542_32` |
| MLW 4-6 Ft | `Input_542_31` |
| MLW 6+ Ft | `Input_542_30` |
| Navigable | `Input_542_26` |
| Ocean/Bay Frontage | `Input_542_22` |
| Pond | `Input_542_11` |
| Riparian Rights | `Input_542_12` |
| River | `Input_542_13` |
| River Frontage | `Input_542_14` |
| Sound Frontage | `Input_542_15` |
| Stream | `Input_542_23` |
| Walk To Water | `Input_542_17` |
| Water Access | `Input_542_18` |
| Whitewater | `Input_542_24` |

**Lennar use:** SKIP — no Lennar communities are waterfront. Captured for non-Lennar use.

---

### Wall Type — Chunk 10

Checkbox group. Dynamic for Lennar — varies by plan. Drywall standard.

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

**Lennar use:** DYNAMIC — Drywall (`Input_254_02`) likely always checked; confirm during bookmarklet build. Pulled from clipboard.

---

### Building/Structure — Chunk 10

Checkbox group. **Lennar static: none checked — always skipped.** Lennar new construction does not include outbuildings. Captured for non-Lennar use.

| Label | Input ID |
|---|---|
| Boathouse | `Input_256_24` |
| Barn | `Input_256_01` |
| Cabin | `Input_256_02` |
| Corn Crib | `Input_256_03` |
| Cottage | `Input_256_04` |
| Dairy | `Input_256_05` |
| Feed Barn | `Input_256_06` |
| Garage | `Input_256_07` |
| Greenhouse | `Input_256_08` |
| Hay Building | `Input_256_09` |
| Livestock | `Input_256_10` |
| Manufactured | `Input_256_22` |
| Modular | `Input_256_23` |
| Pump House | `Input_256_12` |
| Shed | `Input_256_13` |
| Smoke House | `Input_256_14` |
| Stable | `Input_256_15` |
| Storage | `Input_256_16` |
| Tack Room | `Input_256_17` |
| Tobacco Building | `Input_256_18` |
| Utility Building | `Input_256_19` |

**Lennar use:** SKIP — Lennar new construction does not include outbuildings. Captured for non-Lennar use.

---

### Farm Type — Chunk 10

Checkbox group. **Lennar static: none checked — always skipped.**

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

**Lennar use:** SKIP — not applicable to Lennar new construction. Captured for non-Lennar use.

---

### Irrigation Source — Chunk 10

Checkbox group. **Lennar static: none checked — always skipped.**

| Label | Input ID |
|---|---|
| Creek/Stream | `Input_258_05` |
| Irrigated | `Input_258_01` |
| Lake | `Input_258_02` |
| Pond | `Input_258_03` |
| River | `Input_258_04` |

**Lennar use:** SKIP — not applicable to Lennar new construction. Captured for non-Lennar use.

---

## Extraction Status

| Chunk | Groups | Status |
|---|---|---|
| 1 | Style, Structure, Siding, Roof, Flooring | ✅ Complete |
| 2 | Golf Frontage Y/N, Golf View/Frontage, Attic, Parking, Exterior | ✅ Complete |
| 3 | Currently Connected Internet, Internet Description, Garage Y/N, # Cars, ADU Y/N, Basement Y/N, ADU Description | ✅ Complete |
| 4 | Garage, Basement/Foundation, Interior, Water, Sewer/Septic | ✅ Complete |
| 5 | Fenced Y/N, Fenced, Restrictions, #FP, Fireplace | ✅ Complete |
| 6 | Community Amenities, Green Cert, Pool Y/N, Pool Description | ✅ Complete |
| 7 | Appl/Equip, Heating, Other Heating Desc, Water Heater | ✅ Complete |
| 8 | Disabl Equipd Y/N, Disabl Feat, Heat/Fuel, Other Heat/Fuel Desc, Porch | ✅ Complete |
| 9 | Maintenance Contract Y/N, Unit Placement, Cooling, Other Cooling Desc | ✅ Complete |
| 10 | Water Type, Wall Type, Building/Structure, Farm Type, Irrigation Source | ✅ Complete |

---

*AAR-TC Transaction Services | Addendum to AAR-TC-LENNAR-BM-001*
*Version 1.0 — extraction complete June 25, 2026. Next step: bookmarklet build.*
```

---

No other changes to `Lennar_MLS_Features_Field_Map.md`.

```bash
git add -A
git commit -m "docs: complete Features tab field map — all 10 chunks extracted (AAR-TC-LENNAR-BM-001-FEA v1.0)"
git push origin main
```

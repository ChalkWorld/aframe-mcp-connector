# Lennar MLS — Features Tab Field Map
**Document ID:** AAR-TC-LENNAR-BM-001-FEA
**Version:** 0.1 (draft — extraction in progress)
**Last Updated:** June 25, 2026
**Addendum to:** `Lennar_MLS_Bookmarklet_Build.md` (`AAR-TC-LENNAR-BM-001`)

*Living document — updated as extraction chunks are completed. Chunks 1–5 complete; Chunks 6–10 pending Session 011.*

---

## Overview

The Features tab is the most field-dense tab in CVRMLS Matrix. It contains ~49 field groups, the majority of which are checkbox groups with scrollable containers. Most fields are Lennar constants (same value on every listing); a small number are dynamic or always skipped.

**Extraction method:** Claude in Chrome extension — full DOM traversal per group, not visible-only.
**Bookmarklet approach:** Static Lennar constants hardcoded; dynamic fields pulled from clipboard payload under `"features"` key.

---

## Lennar Static Values — Quick Reference

The following are confirmed Lennar constants across all communities. These will be hardcoded in the bookmarklet and do not appear in the clipboard payload.

| Field Group | Lennar Value |
|---|---|
| Structure | Frame |
| Siding | Vinyl |
| Roof | Dimensional |
| Garage Y/N | Yes (`1`) |
| Basement Y/N | No (`0`) |
| ADU Y/N | No (`0`) |
| Golf Frontage Y/N | No (`0`) |
| Fenced Y/N | No (`0`) |
| Water | Public Water |
| Sewer/Septic | Sewer - Public |
| Restrictions | Assoc Restrictions |
| Garage | Attached, Auto Door Opener |
| Basement/Foundation | Slab |

*Additional static values to be confirmed during Session 011 extraction (Chunks 6–10) and bookmarklet build.*

---

## Field Map — Chunks 1–5

---

### Style — Chunk 1

Checkbox group. Dynamic for Lennar — varies by plan type (2-Story, Colonial, Transitional, etc.). Pulled from clipboard payload.

| Label | Input ID |
|---|---|
| 2-Story | `Input_541_27` |
| A-frame | `Input_541_01` |
| Cape | `Input_541_02` |
| Colonial | `Input_541_03` |
| Contemporary | `Input_541_04` |
| Cottage/Bungalow | `Input_541_05` |
| Craftsman | `Input_541_33` |
| Custom | `Input_541_06` |
| Dutch Colonial | `Input_541_07` |
| Farm House | `Input_541_09` |
| Gentleman Farm | `Input_541_10` |
| Green Certified Home | `Input_541_31` |
| Hi-Rise | `Input_541_30` |
| Log | `Input_541_11` |
| Low-Rise | `Input_541_28` |
| Manufactured Homes | `Input_541_32` |
| Mediterranean/Spanish | `Input_541_12` |
| Mid-Century Modern | `Input_541_36` |
| Mid-Rise | `Input_541_29` |
| Modern | `Input_541_34` |
| Modular | `Input_541_14` |
| Other | `Input_541_15` |
| Patio Home | `Input_541_16` |
| Ranch | `Input_541_18` |
| Rowhouse/Townhouse | `Input_541_19` |
| Saltbox | `Input_541_20` |
| Split Foyer | `Input_541_21` |
| Transitional | `Input_541_23` |
| Tri-Level/Quad Level | `Input_541_24` |
| Tudor | `Input_541_25` |
| Victorian | `Input_541_26` |

**Lennar use:** DYNAMIC — select per plan (e.g. Transitional, Colonial, 2-Story). Pulled from clipboard.

---

### Structure — Chunk 1

Checkbox group. **Lennar static: Frame (`Input_70_03`) — always.**

| Label | Input ID |
|---|---|
| Block | `Input_70_01` |
| Brick | `Input_70_02` |
| Concrete | `Input_70_11` |
| Frame | `Input_70_03` |
| Log | `Input_70_05` |
| Metal | `Input_70_06` |
| Other | `Input_70_07` |
| Stone | `Input_70_09` |
| Wood | `Input_70_10` |

**Lennar use:** STATIC — `Input_70_03` (Frame) always checked. Hardcoded in bookmarklet.

---

### Siding — Chunk 1

Checkbox group. **Lennar static: Vinyl (`Input_71_22`) — always.**

| Label | Input ID |
|---|---|
| Aluminum | `Input_71_01` |
| Asbestos | `Input_71_02` |
| Asphalt | `Input_71_03` |
| Block | `Input_71_04` |
| Brick | `Input_71_05` |
| Brick Veneer | `Input_71_06` |
| Cedar | `Input_71_07` |
| Cedar Shake | `Input_71_08` |
| Clapboard | `Input_71_10` |
| Glass | `Input_71_11` |
| Hardboard | `Input_71_12` |
| HardiPlank Type | `Input_71_25` |
| Log | `Input_71_13` |
| Other | `Input_71_14` |
| Redwood | `Input_71_15` |
| Shingle | `Input_71_16` |
| Steel | `Input_71_17` |
| Stone | `Input_71_18` |
| Stucco | `Input_71_19` |
| Synth Stucco | `Input_71_20` |
| T111 | `Input_71_21` |
| Vinyl | `Input_71_22` |
| Wood | `Input_71_23` |

**Lennar use:** STATIC — `Input_71_22` (Vinyl) always checked. Hardcoded in bookmarklet.

---

### Roof — Chunk 1

Checkbox group. **Lennar static: Dimensional (`Input_72_07`) — always.**

| Label | Input ID |
|---|---|
| Asbestos | `Input_72_02` |
| Asphalt | `Input_72_03` |
| Built-up | `Input_72_04` |
| Composition | `Input_72_05` |
| Concrete Com | `Input_72_06` |
| Dimensional | `Input_72_07` |
| Flat | `Input_72_08` |
| Metal | `Input_72_09` |
| Other | `Input_72_10` |
| Rubber | `Input_72_11` |
| Shingled | `Input_72_12` |
| Slate | `Input_72_13` |
| Slate-Manufactured | `Input_72_14` |
| Sloped | `Input_72_15` |
| Tar & Gravel | `Input_72_16` |
| Tile | `Input_72_17` |
| Wood | `Input_72_18` |

**Lennar use:** STATIC — `Input_72_07` (Dimensional) always checked. Hardcoded in bookmarklet.

---

### Flooring — Chunk 1

Checkbox group. Dynamic for Lennar — varies by plan and community. Pulled from clipboard payload.

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

**Lennar use:** DYNAMIC — varies by plan. Pulled from clipboard.

---

### Golf Frontage Y/N — Chunk 2

Select/dropdown. **Lennar static: No (`0`) — always.**

| Input ID | Option Value | Display Text |
|---|---|---|
| `Input_693` | *(empty)* | *(blank)* |
| `Input_693` | `1` | Yes |
| `Input_693` | `0` | No |

**Lennar use:** STATIC — `0` (No) always. Hardcoded in bookmarklet.

---

### Golf View/Frontage — Chunk 2

Checkbox group. **Lennar static: none checked — always skipped.**

| Label | Input ID |
|---|---|
| Cart Path Side | `Input_721_CartPath` |
| Fairway | `Input_721_Fairway` |
| Green | `Input_721_Green` |
| Tee | `Input_721_Tee` |
| View | `Input_721_View` |

*Note: uses named suffixes, not numeric.*

**Lennar use:** SKIP — no Lennar communities have golf frontage.

---

### Attic — Chunk 2

Checkbox group. Dynamic for Lennar — varies by plan.

| Label | Input ID |
|---|---|
| Access Panel | `Input_241_09` |
| Expandable | `Input_241_01` |
| Finished | `Input_241_07` |
| Floored | `Input_241_12` |
| No Attic | `Input_241_02` |
| Part Finished | `Input_241_08` |
| Pull Down | `Input_241_03` |
| Walk-In | `Input_241_05` |
| Walk-Up | `Input_241_06` |

**Lennar use:** DYNAMIC — varies by plan. Pulled from clipboard.

---

### Parking — Chunk 2

Checkbox group. Dynamic for Lennar — varies by plan (Paved Driveway standard; others vary).

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

**Lennar use:** DYNAMIC — Paved Driveway (`Input_519_12`) likely always checked; confirm. Pulled from clipboard.

---

### Exterior — Chunk 2

Checkbox group. Dynamic for Lennar — varies by plan and community (39 options).

| Label | Input ID |
|---|---|
| Awnings | `Input_570_01` |
| Barn/Stable | `Input_570_02` |
| Basketball Court | `Input_570_47` |
| Boat Lift | `Input_570_03` |
| Bulkhead/RIP | `Input_570_04` |
| Controlled Access | `Input_570_05` |
| Cul-de-sac | `Input_570_35` |
| Deck | `Input_570_43` |
| Dock/Pier | `Input_570_06` |
| Gazebo | `Input_570_07` |
| Green House Wn | `Input_570_08` |
| Guest House | `Input_570_09` |
| Horse Permitted | `Input_570_10` |
| Hot Tub | `Input_570_11` |
| Insulated Doors | `Input_570_12` |
| Irrigation System | `Input_570_31` |
| Lead Glass Windows | `Input_570_13` |
| Level Lot | `Input_570_36` |
| Out Building | `Input_570_14` |
| Outdoor Lighting | `Input_570_15` |
| Palladian Windows | `Input_570_16` |
| Porch | `Input_570_44` |
| Private Storage | `Input_570_17` |
| Public Park | `Input_570_18` |
| Sauna | `Input_570_19` |
| Screens | `Input_570_20` |
| Sliding Doors | `Input_570_21` |
| Solar Panels | `Input_570_45` |
| Solar Panels - Leased | `Input_570_46` |
| Stained Glass | `Input_570_23` |
| Storage Shed Attached | `Input_570_32` |
| Storage Shed Detached | `Input_570_33` |
| Storm Doors | `Input_570_25` |
| Storm Windows | `Input_570_26` |
| Swing Sets | `Input_570_27` |
| Tennis Court | `Input_570_28` |
| Thermal Windows | `Input_570_29` |
| Waterfront | `Input_570_22` |
| Waterview | `Input_570_24` |

**Lennar use:** DYNAMIC — varies by plan. Pulled from clipboard.

---

### Currently Connected Internet — Chunk 3

Checkbox group. Dynamic for Lennar — varies by community infrastructure.

| Label | Input ID |
|---|---|
| Addtl Info | `Input_845_ADDINFO` |
| Cable | `Input_845_CABLE` |
| DSL | `Input_845_DSL` |
| Fiber | `Input_845_FIBER` |
| Other | `Input_845_OTHER` |
| Satellite | `Input_845_SATELLITE` |
| Unknown | `Input_845_UNKNOWN` |

*Note: uses named suffixes, not numeric.*

**Lennar use:** DYNAMIC — varies by community. Pulled from clipboard.

---

### Internet Description — Chunk 3

Text input. Rarely used for Lennar.

| Input ID | Type |
|---|---|
| `Input_846` | text |

**Lennar use:** SKIP unless community has unusual internet situation.

---

### Garage Y/N — Chunk 3

Select/dropdown. **Lennar static: Yes (`1`) — always.**

| Input ID | Option Value | Display Text |
|---|---|---|
| `Input_150` | *(empty)* | *(blank)* |
| `Input_150` | `1` | Yes |
| `Input_150` | `0` | No |

**Lennar use:** STATIC — `1` (Yes) always. Hardcoded in bookmarklet.

---

### # Cars — Chunk 3

Select/dropdown. Dynamic for Lennar — varies by plan (1, 2, or 3 car garage).

| Input ID | Option Value | Display Text |
|---|---|---|
| `Input_226` | *(empty)* | *(blank)* |
| `Input_226` | `1` | 1 |
| `Input_226` | `15` | 1.5 |
| `Input_226` | `2` | 2 |
| `Input_226` | `25` | 2.5 |
| `Input_226` | `3` | 3 |
| `Input_226` | `4plus` | 4 + |

**Lennar use:** DYNAMIC — varies by plan. Pulled from clipboard.

---

### ADU Y/N — Chunk 3

Select/dropdown. **Lennar static: No (`0`) — always.**

| Input ID | Option Value | Display Text |
|---|---|---|
| `Input_861` | *(empty)* | *(blank)* |
| `Input_861` | `1` | Yes |
| `Input_861` | `0` | No |

**Lennar use:** STATIC — `0` (No) always. Hardcoded in bookmarklet.

---

### Basement Y/N — Chunk 3

Select/dropdown. **Lennar static: No (`0`) — always** *(Lennar builds slab foundation).*

| Input ID | Option Value | Display Text |
|---|---|---|
| `Input_153` | *(empty)* | *(blank)* |
| `Input_153` | `1` | Yes |
| `Input_153` | `0` | No |

**Lennar use:** STATIC — `0` (No) always. Hardcoded in bookmarklet.

---

### ADU Description — Chunk 3

Text input. Always skipped for Lennar.

| Input ID | Type |
|---|---|
| `Input_862` | text |

**Lennar use:** SKIP — ADU Y/N is always No.

---

### Garage — Chunk 4

Checkbox group. Dynamic for Lennar — Attached and Auto Door Opener always checked; others vary by plan.

| Label | Input ID |
|---|---|
| Apartment | `Input_539_01` |
| Attached | `Input_539_02` |
| Auto Door Opener | `Input_539_03` |
| Basement | `Input_539_15` |
| Detached | `Input_539_04` |
| Direct Entry | `Input_539_05` |
| Finished | `Input_539_13` |
| Golf Cart | `Input_539_16` |
| Heated | `Input_539_06` |
| No Garage | `Input_539_08` |
| Other | `Input_539_09` |
| Oversized | `Input_539_10` |
| Pedestrian Door | `Input_539_17` |
| RV Garage | `Input_539_21` |
| Side/Rear Load | `Input_539_18` |
| Storage Above | `Input_539_11` |
| Unfinished | `Input_539_14` |
| Workshop | `Input_539_12` |

**Lennar use:** STATIC base — `Input_539_02` (Attached) and `Input_539_03` (Auto Door Opener) always checked. Additional options (e.g. Direct Entry) may vary by plan — confirm during bookmarklet build.

---

### Basement/Foundation — Chunk 4

Checkbox group. **Lennar static: Slab (`Input_569_12`) — always.**

| Label | Input ID |
|---|---|
| Basement-Full | `Input_569_01` |
| Basement-Partial | `Input_569_02` |
| Crawl Space | `Input_569_03` |
| Dirt | `Input_569_04` |
| Finished-Com | `Input_569_05` |
| Finished-Part | `Input_569_06` |
| Floored | `Input_569_07` |
| Garage Access | `Input_569_08` |
| Heated | `Input_569_09` |
| Interior Access | `Input_569_19` |
| Locked Storage | `Input_569_10` |
| Other | `Input_569_11` |
| Roughed In | `Input_569_20` |
| Slab | `Input_569_12` |
| Tenant Access | `Input_569_17` |
| Tenant Storage | `Input_569_18` |
| Unfinished | `Input_569_13` |
| Walk-Out | `Input_569_14` |
| Workshop | `Input_569_15` |

**Lennar use:** STATIC — `Input_569_12` (Slab) always checked. Hardcoded in bookmarklet.

---

### Interior — Chunk 4

Checkbox group. Dynamic for Lennar — varies by plan (57 options; large scrollable group).

| Label | Input ID |
|---|---|
| 1st Floor Bedrm W/ Full Bath | `Input_568_49` |
| 1st Floor Bedroom | `Input_568_19` |
| 1st Floor Primary Bedroom | `Input_568_50` |
| 9 Ft + Ceilings | `Input_568_01` |
| Addl 1st Floor Primary BR | `Input_568_56` |
| Atrium | `Input_568_02` |
| Bay/Bow Window | `Input_568_03` |
| Beamed Ceiling | `Input_568_04` |
| Breakfast Nook | `Input_568_05` |
| Breezeway | `Input_568_06` |
| Built In Cabinet/Bookcases | `Input_568_07` |
| Butlers Pantry | `Input_568_08` |
| Cable TV | `Input_568_10` |
| Cathedral Ceiling | `Input_568_09` |
| Ceiling Fan | `Input_568_11` |
| Center Hall | `Input_568_12` |
| Countertops - Granite/Stone | `Input_568_57` |
| Countertops - Laminate | `Input_568_58` |
| Countertops - Solid Surface | `Input_568_59` |
| Countertops - Tile | `Input_568_60` |
| Dining Area | `Input_568_13` |
| Double Vanity | `Input_568_14` |
| Dryer Hookup | `Input_568_15` |
| DSL | `Input_568_46` |
| Eat-In-Kitchen | `Input_568_16` |
| Fire Sprinkler | `Input_568_17` |
| Fireplace | `Input_568_55` |
| Fireplace Insert | `Input_568_18` |
| Formal Dining Room | `Input_568_20` |
| French Doors | `Input_568_21` |
| Garden Tub | `Input_568_62` |
| Hot Tub | `Input_568_22` |
| Housekeepers Quarters | `Input_568_23` |
| Internal Balcony | `Input_568_24` |
| Internet Ready | `Input_568_48` |
| Island | `Input_568_25` |
| Jetted Tub | `Input_568_45` |
| Loft | `Input_568_26` |
| Pantry | `Input_568_28` |
| Primary Room Bath | `Input_568_27` |
| Recessed Lighting | `Input_568_29` |
| Rough-In Bath | `Input_568_30` |
| Satellite Dish | `Input_568_47` |
| Security System | `Input_568_31` |
| Separate Suite | `Input_568_32` |
| Skylight | `Input_568_33` |
| Solar Tube | `Input_568_61` |
| Stack Wshr/Dryer Hookup | `Input_568_34` |
| Steam Shower | `Input_568_35` |
| Sunken Tub | `Input_568_36` |
| Track Lighting | `Input_568_37` |
| Tray Ceiling | `Input_568_38` |
| Walk-In Closet | `Input_568_39` |
| Washer Hookup | `Input_568_40` |
| Wet Bar | `Input_568_41` |
| Window Treatment | `Input_568_43` |
| Workshop | `Input_568_44` |

**Lennar use:** DYNAMIC — varies by plan. Pulled from clipboard.

---

### Water — Chunk 4

Checkbox group. **Lennar static: Public Water (`Input_676_PW`) — always.**

| Label | Input ID |
|---|---|
| Community Well | `Input_676_CW` |
| Other | `Input_676_OTHER` |
| Public Water | `Input_676_PW` |
| Well | `Input_676_WELL` |

*Note: uses named suffixes, not numeric.*

**Lennar use:** STATIC — `Input_676_PW` (Public Water) always checked. Hardcoded in bookmarklet.

---

### Sewer/Septic — Chunk 4

Checkbox group. **Lennar static: Sewer - Public (`Input_670_PBLCSR`) — always.**

| Label | Input ID |
|---|---|
| Septic - Alternative | `Input_670_ALTSEPTC` |
| Septic - Conventional | `Input_670_COSEPTC` |
| Community - Sewer/Septic | `Input_670_COMSR` |
| Sewer - Public | `Input_670_PBLCSR` |
| None | `Input_670_NONE` |
| Other - See Remarks | `Input_670_OTHER` |
| Unknown | `Input_670_UNKNOWN` |

*Note: uses named suffixes, not numeric.*

**Lennar use:** STATIC — `Input_670_PBLCSR` (Sewer - Public) always checked. Hardcoded in bookmarklet.

---

### Fenced Y/N — Chunk 5

Select/dropdown. **Lennar static: No (`0`) — always.**

| Input ID | Option Value | Display Text |
|---|---|---|
| `Input_695` | *(empty)* | *(blank)* |
| `Input_695` | `1` | Yes |
| `Input_695` | `0` | No |

**Lennar use:** STATIC — `0` (No) always. Hardcoded in bookmarklet.

---

### Fenced — Chunk 5

Checkbox group. Always skipped for Lennar (Fenced Y/N is No).

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

**Lennar use:** SKIP — Fenced Y/N is always No; this group is irrelevant for Lennar. Captured for non-Lennar use.

---

### Restrictions — Chunk 5

Checkbox group. **Lennar static: Assoc Restrictions (`Input_540_02`) — always.**

| Label | Input ID |
|---|---|
| Age Qualified | `Input_540_25` |
| Age-Restricted Community | `Input_540_24` |
| Architec Des | `Input_540_01` |
| Assoc Restrictions | `Input_540_02` |
| Bldg Morator | `Input_540_03` |
| Bldg Restrictions | `Input_540_04` |
| Crops 2B Harv | `Input_540_05` |
| Deed Restrictions | `Input_540_06` |
| Easement | `Input_540_07` |
| Excluded Party | `Input_540_27` |
| Health Dept | `Input_540_09` |
| Historic | `Input_540_10` |
| Income Qualified | `Input_540_29` |
| Maintenance Free Living | `Input_540_26` |
| Mineral Rights | `Input_540_11` |
| No Mobile Homes | `Input_540_13` |
| Other | `Input_540_14` |
| Right Of Way | `Input_540_15` |
| RV/Boat Storage | `Input_540_28` |
| Subdiv Restr | `Input_540_16` |
| Variance Needed | `Input_540_17` |
| Waterfront Restrictions | `Input_540_18` |
| Wetlands | `Input_540_19` |
| Zoning Restrictions | `Input_540_21` |

**Lennar use:** STATIC — `Input_540_02` (Assoc Restrictions) always checked. Hardcoded in bookmarklet.

---

### #FP (Number of Fireplaces) — Chunk 5

Text input. Dynamic for Lennar — varies by plan.

| Input ID | Type |
|---|---|
| `Input_152` | text |

**Lennar use:** DYNAMIC — varies by plan (typically `0` or `1`). Pulled from clipboard.

---

### Fireplace — Chunk 5

Checkbox group. Dynamic for Lennar — only relevant when #FP > 0.

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

**Lennar use:** DYNAMIC — skip entirely when #FP = 0. When present, type varies by plan. Pulled from clipboard.

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

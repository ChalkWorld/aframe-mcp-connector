# Lennar MLS — Features Tab Field Map
**Document ID:** AAR-TC-LENNAR-BM-001-FEA
**Version:** 1.0
**Last Updated:** June 25, 2026
**Addendum to:** `Lennar_MLS_Bookmarklet_Build.md` (`AAR-TC-LENNAR-BM-001`)

*Extraction complete — all 10 chunks documented. Ready for bookmarklet build.*

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

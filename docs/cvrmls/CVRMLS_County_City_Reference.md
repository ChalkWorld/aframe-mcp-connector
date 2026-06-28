# CVRMLS County/City Reference
**Document ID:** AAR-TC-CVRMLS-CC-001
**Version:** 1.0
**Last Updated:** 2026-06-27
**Status:** Active — Living Document

---

## Purpose

This document contains confirmed stored option values for CVRMLS Matrix County/City (`Input_29`), Area (`Input_30`), and school dropdowns (`Input_51` Elementary, `Input_53` Middle, `Input_52` High) extracted via live ES session.

These values are required for the Listing Info bookmarklet — Matrix cascade dropdowns require exact stored `value` attributes, not display text. County/City must be set first to trigger the cascade that populates Area and school options.

**Not extracted here:** ZIP (`Input_635`), Post Office (`Input_41`), Subdivision (`Input_259`) — all three are payload-driven best-effort; bookmarklet attempts to set from payload, silently fails if option not present, falls back to manual entry.

**Extraction date:** 2026-06-27
**Coverage:** 11 jurisdictions in the greater Richmond metro CVRMLS area

---

## Extraction Notes

- Stored values and display text are identical for most jurisdictions (e.g. `Chesterfield` / `Chesterfield`)
- Multi-word jurisdiction names have no space in stored value (e.g. `NewKent`, `ColonialHeights`)
- School rename mismatches — stored value does not match current display name in two cases:
  - Hanover Middle: `StonewallJackson` → displays as "Bell Creek Middle"
  - Hanover High: `LeeDavis` → displays as "Mechanicsville"
- Ashland is a school name under Hanover County — not a separate County/City entry in Input_29
- School lists are the full option set for each jurisdiction; actual school zone depends on address

---

## County/City Stored Values (`Input_29`)

| Display Text | Stored Value |
|---|---|
| Chesterfield | `Chesterfield` |
| Colonial Heights | `ColonialHeights` |
| Dinwiddie | `Dinwiddie` |
| Goochland | `Goochland` |
| Hanover | `Hanover` |
| Henrico | `Henrico` |
| Hopewell | `Hopewell` |
| New Kent | `NewKent` |
| Petersburg | `Petersburg` |
| Powhatan | `Powhatan` |
| Richmond City | `Richmond` |

---

## Area Options (`Input_30`) by County/City

### Chesterfield

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `52` | 52 - Chesterfield |
| `54` | 54 - Chesterfield |
| `62` | 62 - Chesterfield |
| `64` | 64 - Chesterfield |

### Colonial Heights

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `55` | 55 - Colonial Heights |

### Dinwiddie

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `61` | 61 - Dinwiddie |

### Goochland

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `24` | 24 - Goochland |

### Hanover

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `36` | 36 - Hanover |
| `44` | 44 - Hanover |

### Henrico

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `22` | 22 - Henrico |
| `32` | 32 - Henrico |
| `34` | 34 - Henrico |
| `40` | 40 - Henrico |
| `42` | 42 - Henrico |

### Hopewell

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `56` | 56 - Hopewell |

### New Kent

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `46` | 46 - New Kent |

### Petersburg

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `57` | 57 - Petersburg |

### Powhatan

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `66` | 66 - Powhatan |

### Richmond City

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `10` | 10 - Richmond |
| `20` | 20 - Richmond |
| `30` | 30 - Richmond |
| `50` | 50 - Richmond |
| `60` | 60 - Richmond |

---

## School Options by County/City

### Chesterfield

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `AMDavis` | A. M. Davis |
| `AlbertaSmith` | Alberta Smith |
| `Bellwood` | Bellwood |
| `Bensley` | Bensley |
| `BettieWeaver` | Bettie Weaver |
| `Beulah` | Beulah |
| `BonAir` | Bon Air |
| `Chalkley` | Chalkley |
| `CloverHill` | Clover Hill |
| `Crenshaw` | Crenshaw |
| `Crestwood` | Crestwood |
| `Curtis` | Curtis |
| `DeepCreek` | Deep Creek |
| `Ecoff` | Ecoff |
| `ElizabethScott` | Elizabeth Scott |
| `Enon` | Enon |
| `Ettrick` | Ettrick |
| `Evergreen` | Evergreen |
| `FallingCreek` | Falling Creek |
| `Gates` | Gates |
| `Gordon` | Gordon |
| `GrangeHall` | Grange Hall |
| `Greenfield` | Greenfield |
| `Harrowgate` | Harrowgate |
| `Hening` | Hening |
| `Hopkins` | Hopkins |
| `JacobsRoad` | Jacobs Road |
| `MargueriteChristian` | Marguerite Christian |
| `Matoaca` | Matoaca |
| `Moseley` | Moseley |
| `OldHundred` | Old Hundred |
| `Providence` | Providence |
| `Reams` | Reams |
| `Robious` | Robious |
| `Salem` | Salem |
| `SpringRun` | Spring Run |
| `Swiftcreek` | Swift Creek |
| `Watkins` | Watkins |
| `Wells` | Wells |
| `Winterpock` | Winterpock |
| `Woolridge` | Woolridge |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `BaileyBridge` | Bailey Bridge |
| `Carver` | Carver |
| `DeepCreek` | Deep Creek |
| `ElizabethDavis` | Elizabeth Davis |
| `FallingCreek` | Falling Creek |
| `Manchester` | Manchester |
| `Matoaca` | Matoaca |
| `Midlothian` | Midlothian |
| `Providence` | Providence |
| `Robious` | Robious |
| `Salem` | Salem |
| `SwiftCreek` | Swift Creek |
| `TomahawkCreek` | Tomahawk Creek |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Bird` | Bird |
| `CloverHill` | Clover Hill |
| `Cosby` | Cosby |
| `JamesRiver` | James River |
| `Manchester` | Manchester |
| `Matoaca` | Matoaca |
| `Meadowbrook` | Meadowbrook |
| `Midlothian` | Midlothian |
| `Monacan` | Monacan |
| `ThomasDale` | Thomas Dale |

---

### Colonial Heights

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Lakeview` | Lakeview |
| `North` | North |
| `Tussing` | Tussing |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Colonial` | Colonial Heights |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Colonial` | Colonial Heights |

---

### Dinwiddie

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Dinwiddie` | Dinwiddie |
| `Midway` | Midway |
| `Southside` | Southside |
| `Sunnyside` | Sunnyside |
| `Sutherland` | Sutherland |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Dinwiddie` | Dinwiddie |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Dinwiddie` | Dinwiddie |

---

### Goochland

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Byrd` | Byrd |
| `Goochland` | Goochland |
| `Randolph` | Randolph |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Goochland` | Goochland |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Goochland` | Goochland |

---

### Hanover

⚠️ **Rename mismatches — stored value does not match current display name:**
- Middle: `StonewallJackson` → currently displays as "Bell Creek Middle"
- High: `LeeDavis` → currently displays as "Mechanicsville"

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Ashland` | Ashland |
| `Battlefield` | Battlefield |
| `Beaverdam` | Beaverdam |
| `ColdHarbor` | Cold Harbor |
| `CoolSpring` | Cool Spring |
| `Elmont` | Elmont |
| `KerseyCreek` | Kersey Creek |
| `LaurelMeadow` | Laurel Meadow |
| `Mechanicsville` | Mechanicsville |
| `PearsonsCorner` | Pearsons Corner |
| `PoleGreen` | Pole Green |
| `RiversEdge` | Rivers Edge |
| `RuralPoint` | Rural Point |
| `SouthAnna` | South Anna |
| `WashingtonHenry` | Washington Henry |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `StonewallJackson` | Bell Creek Middle ⚠️ renamed |
| `Chickahominy` | Chickahominy |
| `Liberty` | Liberty |
| `OakKnoll` | Oak Knoll |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Atlee` | Atlee |
| `Hanover` | Hanover |
| `LeeDavis` | Mechanicsville ⚠️ renamed |
| `PatrickHenry` | Patrick Henry |

---

### Henrico

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Adams` | Adams |
| `ArthurAshe` | Arthur Ashe |
| `Baker` | Baker |
| `Carver` | Carver |
| `Chamberlayne` | Chamberlayne |
| `ColonialTrail` | Colonial Trail |
| `Crestview` | Crestview |
| `Donahoe` | Donahoe |
| `Dumbarton` | Dumbarton |
| `EchoLake` | Echo Lake |
| `FairOaks` | Fair Oaks |
| `Gayton` | Gayton |
| `GlenAllen` | Glen Allen |
| `GlenLea` | Glen Lea |
| `Greenwood` | Greenwood |
| `Harvie` | Harvie |
| `HighlandSprings` | Highland Springs |
| `Holladay` | Holladay |
| `JacksonDavis` | Jackson Davis |
| `Johnson` | Johnson |
| `KaecheleElementary` | Kaechele Elementary |
| `Laburnum` | Laburnum |
| `Lakeside` | Lakeside |
| `Longan` | Longan |
| `Longdale` | Longdale |
| `Maybeury` | Maybeury |
| `Mehfoud` | Mehfoud |
| `Montrose` | Montrose |
| `NuckolsFarm` | Nuckols Farm |
| `Pemberton` | Pemberton |
| `Pinchbeck` | Pinchbeck |
| `Ratcliffe` | Ratcliffe |
| `Ridge` | Ridge |
| `RiversEdge` | Rivers Edge |
| `Sandston` | Sandston |
| `SevenPines` | Seven Pines |
| `ShadyGrove` | Shady Grove |
| `ShortPump` | Short Pump |
| `Skipwith` | Skipwith |
| `Springfield` | Springfield Park |
| `ThreeChopt` | Three Chopt |
| `Trevvett` | Trevvett |
| `Tuckahoe` | Tuckahoe |
| `TwinHickory` | Twin Hickory |
| `Varina` | Varina |
| `Ward` | Ward |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Brookland` | Brookland |
| `DouglasWilder` | Douglas Wilder |
| `Elko` | Elko |
| `Fairfield` | Fairfield |
| `Holman` | Holman |
| `HungaryCreek` | Hungary Creek |
| `Moody` | Moody |
| `Pocahontas` | Pocahontas |
| `Quioccasin` | Quioccasin |
| `Rolfe` | Rolfe |
| `ShortPump` | Short Pump |
| `Tuckahoe` | Tuckahoe |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `DeepRun` | Deep Run |
| `Freeman` | Freeman |
| `GlenAllen` | Glen Allen |
| `Godwin` | Godwin |
| `Henrico` | Henrico |
| `Hermitage` | Hermitage |
| `HighlandSprings` | Highland Springs |
| `Tucker` | Tucker |
| `Varina` | Varina |

---

### Hopewell

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Copeland` | Copeland |
| `Dupont` | Dupont |
| `HarryJames` | Harry James |
| `Woodlawn` | Woodlawn |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `CarterGWoodson` | Carter G. Woodson |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Hopewell` | Hopewell |

---

### New Kent

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `GWWatkins` | G. W. Watkins |
| `NewKent` | New Kent |
| `Quinton` | Quinton |
| `WestPoint` | West Point |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `GWWatkins` | G. W. Watkins |
| `NewKent` | New Kent |
| `WestPoint` | West Point |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `NewKent` | New Kent |
| `WestPoint` | West Point |

---

### Petersburg

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `CoolSpring` | Cool Spring |
| `Lakemont` | Lakemont |
| `PleasantLane` | Pleasants Lane |
| `Walnut` | Walnut Hill |
| `Westview` | Westview |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `VernonJohns` | Vernon Johns |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Petersburg` | Petersburg |

---

### Powhatan

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `FlatRock` | Flat Rock |
| `Pocahontas` | Pocahontas |
| `Powhatan` | Powhatan |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Powhatan` | Powhatan |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Powhatan` | Powhatan |

---

### Richmond City

**Elementary (`Input_51`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `BarackObama` | Barack Obama |
| `Bellevue` | Bellevue |
| `Blackwell` | Blackwell |
| `Broadrock` | Broadrock |
| `Cardinal` | Cardinal |
| `Carver` | Carver |
| `Chimborazo` | Chimborazo |
| `Fairfield` | Fairfield |
| `Fisher` | Fisher |
| `Fox` | Fox |
| `GinterPark` | Frances W. McClenney |
| `Francis` | Francis |
| `Greene` | Greene |
| `GeorgeMason` | Henry L. Marsh III |
| `Holton` | Holton |
| `JohnBCary` | Lois-Harrison Jones |
| `MilesJeromeJones` | Miles Jerome Jones |
| `Munford` | Munford |
| `OakGrove` | Oak Grove |
| `OverbySheppard` | Overby-Sheppard |
| `Redd` | Redd |
| `Reid` | Reid |
| `Southampton` | Southampton |
| `Swansboro` | Swansboro |
| `WestoverHills` | Westover Hills |
| `Woodville` | Woodville |

**Middle (`Input_53`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `AlbertHill` | Albert Hill |
| `Boushall` | Boushall |
| `Binford` | Dogwood |
| `Elkhardt` | Elkhardt |
| `Henderson` | Henderson |
| `LucilleBrown` | Lucille Brown |
| `MartinLutherKingJr` | Martin Luther King Jr. |
| `RiverCity` | River City |
| `Thompson` | Thompson |

**High (`Input_52`):**

| Value | Display Text |
|---|---|
| *(blank)* | *(blank)* |
| `Armstrong` | Armstrong |
| `Franklin` | Franklin |
| `Huguenot` | Huguenot |
| `JohnMarshall` | John Marshall |
| `Wythe` | Richmond High School for the Arts |
| `ThomasJefferson` | Thomas Jefferson |

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-27 | Andrew Rich / Claude | Initial document. 11 jurisdictions confirmed via live ES extraction. Street Suffix in `CVRMLS_Bookmarklet_Build.md`. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*CVRMLS Matrix extracted reference data — County/City stored values, Area options, and school dropdown options.*
*Universal layer — no builder-specific content. Add jurisdictions as needed.*
*Cross-reference: `docs/cvrmls/CVRMLS_Bookmarklet_Build.md` (AAR-TC-CVRMLS-BM-001)*

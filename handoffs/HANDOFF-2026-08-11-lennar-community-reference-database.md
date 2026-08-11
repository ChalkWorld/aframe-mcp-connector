---
title: Cursor Handoff — Lennar_Community_Reference_Database.md — v1.1 to v1.2
document_id: HANDOFF-2026-08-11-lennar-community-reference-database
date: 2026-08-11
project: AAR-TC Lennar CVRMLS Matrix Intake
---

Apply the changes below surgically to `docs/lennar/Lennar_Community_Reference_Database.md`. Do not modify anything not listed here.

## Change 1 — Version header bump

**Find:**
```
version: 1.1
version_date: 2026-07-15
```

**Replace with:**
```
version: 1.2
version_date: 2026-08-11
```

---

## Change 2 — Harpers Mill Townhome: add MLS Area

**Find:**
```
### Harpers Mill — Townhome
**County:** Chesterfield | **City:** Chesterfield | **Zip:** 23832 | **Property Type:** Condo/Townhome
```

**Replace with:**
```
### Harpers Mill — Townhome
**County:** Chesterfield | **City:** Chesterfield | **Zip:** 23832 | **Property Type:** Condo/Townhome | **MLS Area:** 54
```

---

## Change 3 — Harpers Mill Single Family: add MLS Area

**Find:**
```
### Harpers Mill — Single Family
**County:** Chesterfield | **City:** Chesterfield | **Zip:** 23832 | **Property Type:** Single Family
```

**Replace with:**
```
### Harpers Mill — Single Family
**County:** Chesterfield | **City:** Chesterfield | **Zip:** 23832 | **Property Type:** Single Family | **MLS Area:** 54
```

---

## Change 4 — Creekside Run: add MLS Area, resolve Fee Includes, confirm capital contribution routing

**Find:**
```
### Creekside Run — Townhome
**County:** Richmond City | **City:** Richmond | **Zip:** 23224 | **Property Type:** Condo/Townhome

#### Schools
| Level | School |
|---|---|
| Elementary | Reid |
| Middle | River City |
| High | Huguenot |

#### HOA
| Field | Value |
|---|---|
| HOA | Yes |
| Fee | $75.00 / Monthly |
| Initial Working Capital Contribution: $450 | |
| Fee Description | Condo Association |
| Fee Includes | *(blank on MLS sheet — confirm)* |
| Fee Includes Codes | *(pending — populate when display text confirmed on first Creekside Run listing)* |
| Trash by HOA | No |
```

**Replace with:**
```
### Creekside Run — Townhome
**County:** Richmond City | **City:** Richmond | **Zip:** 23224 | **Property Type:** Condo/Townhome | **MLS Area:** 60

#### Schools
| Level | School |
|---|---|
| Elementary | Reid |
| Middle | River City |
| High | Huguenot |

#### HOA
| Field | Value |
|---|---|
| HOA | Yes |
| Fee | $75.00 / Monthly |
| Initial Working Capital Contribution: $450 | Confirmed flows into payload `fee.addl_fee_desc` (Add'l Fee Dsc / Input_117) — 2026-08-11, 6039 Blue Iris Rd |
| Fee Description | Condo Association |
| Fee Includes | Comm Ar Mnt, Common Area, Snow Removal |
| Fee Includes Codes | `["01","25","14"]` — confirmed 2026-08-11 (6039 Blue Iris Rd, MLS# 2621807); sourced from internal HOA reference sheet, not yet cross-checked against a live MLS Fee Includes display |
| Trash by HOA | No |
```

---

## Change 5 — Everstone: add MLS Area

**Find:**
```
### Everstone — Single Family
**County:** Henrico | **City:** Richmond | **Zip:** 23223 | **Property Type:** Single Family
```

**Replace with:**
```
### Everstone — Single Family
**County:** Henrico | **City:** Richmond | **Zip:** 23223 | **Property Type:** Single Family | **MLS Area:** 42
```

---

## Change 6 — Watermark: add MLS Area

**Find:**
```
### Watermark — Single Family
**County:** Chesterfield | **City:** Chesterfield | **Zip:** 23234 | **Property Type:** Single Family
```

**Replace with:**
```
### Watermark — Single Family
**County:** Chesterfield | **City:** Chesterfield | **Zip:** 23234 | **Property Type:** Single Family | **MLS Area:** 54
```

---

## Change 7 — Wynwood: mark retired

**Find:**
```
### Wynwood at Fox Creek — Single Family
**County:** *(pending)* | **City:** *(pending)* | **Property Type:** Single Family

#### Schools
*(Pending — to be populated when next listing is received)*

#### HOA
*(Pending — to be populated when next listing is received)*
```

**Replace with:**
```
### Wynwood at Fox Creek — Single Family
**Status:** Retired — community sold out, no further listings expected (confirmed August 2026)
**County:** *(never populated)* | **City:** *(never populated)* | **Property Type:** Single Family

#### Schools
*(Not pursuing — community retired before data was collected)*

#### HOA
*(Not pursuing — community retired before data was collected)*
```

---

## Change 8 — Pending Items: remove resolved Creekside row, update Wynwood

**Find:**
```
| Community | Item Pending | Notes |
|---|---|---|
| Harpers Mill — Single Family | Fee Includes (exact MLS wording) | No SF example MLS sheet yet — confirm when available |
| Creekside Run — Townhome | Fee Includes | Field was blank on 6033 Blue Iris Rd MLS sheet — confirm |
| Wynwood at Fox Creek | All data | No recent listings — populate when next email received |
| Fawncrest | All data | Listed in HOA Quick Sheet but not currently active — add when needed |
```

**Replace with:**
```
| Community | Item Pending | Notes |
|---|---|---|
| Harpers Mill — Single Family | Fee Includes (exact MLS wording) | No SF example MLS sheet yet — confirm when available |
| Wynwood at Fox Creek | All data | **Retired 2026-08-11 — community sold out, no further listings expected.** Not pursuing further. |
| Fawncrest | All data | Listed in HOA Quick Sheet but not currently active — add when needed |
```

---

## Change 9 — Version History: add 1.2 row

**Find:**
```
| 1.1 | 2026-07-15 | Andrew Rich / Claude | Fee Includes numeric codes migrated from retired `Lennar_Bookmarklet_Build_Notes.md` (Step 4 of doc realignment execution). Codes format is suffix-only per `Lennar_Payload_Schema.md` §7 Format Conventions — Fee Info bookmarklet reconstructs `Input_576_XX` inline. Harpers Mill TH verified live 2026-07-15 (8720 Whitman Dr smoke test); Everstone and Watermark carry "interim mapping — verify at first live use"; Harpers Mill SF and Creekside Run remain pending display-text confirmation. |
```

**Replace with:**
```
| 1.1 | 2026-07-15 | Andrew Rich / Claude | Fee Includes numeric codes migrated from retired `Lennar_Bookmarklet_Build_Notes.md` (Step 4 of doc realignment execution). Codes format is suffix-only per `Lennar_Payload_Schema.md` §7 Format Conventions — Fee Info bookmarklet reconstructs `Input_576_XX` inline. Harpers Mill TH verified live 2026-07-15 (8720 Whitman Dr smoke test); Everstone and Watermark carry "interim mapping — verify at first live use"; Harpers Mill SF and Creekside Run remain pending display-text confirmation. |
| 1.2 | 2026-08-11 | Andrew Rich / Claude | MLS Area codes added for all 5 active communities — previously undocumented anywhere (Harpers Mill 54, Creekside Run 60, Everstone 42, Watermark 54). Creekside Run Fee Includes resolved: Comm Ar Mnt / Common Area / Snow Removal (`["01","25","14"]`), confirmed 6039 Blue Iris Rd (MLS# 2621807) — sourced from internal HOA reference sheet, not yet cross-checked against a live MLS Fee Includes display. Creekside Run capital contribution confirmed flowing into `fee.addl_fee_desc` — second community confirmed after Harpers Mill TH (see `Lennar_Payload_Schema.md` §7.1). Wynwood at Fox Creek marked retired — community sold out, removed from Pending Items. |
```

---

No other changes to `Lennar_Community_Reference_Database.md`.

```bash
git add -A
git commit -m "Lennar Community Reference DB v1.1 -> v1.2: MLS Area codes for all active communities, Creekside Fee Includes resolved, Wynwood retired"
git push origin main
```

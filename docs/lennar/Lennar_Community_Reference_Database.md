---
title: Lennar Community Reference Database
document_id: AAR-TC-LENNAR-DB-001
version: 1.1
version_date: 2026-07-15
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Claude (Anthropic) — AI-assisted data extraction and document assembly
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Lennar MLS Intake Workflow
---

# Lennar Community Reference Database
### AAR-TC Transaction Services | Document ID: AAR-TC-LENNAR-DB-001

---

## Purpose

This document serves as the authoritative community reference database for Lennar new construction listings managed by Gary Martin / Providence Hill Real Estate and coordinated through AAR-TC Transaction Services (Andrew Rich). It is used to auto-populate MLS property data sheets during the Lennar intake workflow, providing consistent school and HOA information for each community without requiring manual lookup.

---

## How to Use This Document

When a new Lennar listing email is received and processed:
1. Identify the community from the email (subdivision name, address, or Carly Evans' notes)
2. Match to the appropriate community section below — note that Harpers Mill has two variants (Townhome vs. Single Family) with different HOA structures
3. Copy school and HOA data directly into the MLS property data sheet
4. HOA Fee Includes values are formatted to match MLS checkbox labels exactly — copy as-is

---

## How This Information Was Collected

Data in this document was sourced and verified from the following:

- **MLS Agent Long Sheets** — pulled directly from CVRMLS (Central Virginia Regional MLS) for active Lennar listings. School and HOA information extracted verbatim from MLS records. Example properties used as source references are listed below.
- **Lennar HOA Quick Sheet** (Google Drive, Lennar folder) — a reference spreadsheet maintained by Andrew Rich containing HOA fee schedules and amenity details for each community.
- **AI-Assisted Extraction** — Claude (Anthropic) was used to extract, cross-reference, and format data from MLS sheets and the HOA Quick Sheet during the initial build of this document on June 12, 2026.

### Source MLS Reference Properties

| Community | Example Address | MLS# | Sheet Date |
|---|---|---|---|
| Harpers Mill — Townhome | 8776 Whitman Dr, Chesterfield, VA | 2612660 | 05/12/2026 |
| Creekside Run — Townhome | 6033 Blue Iris Rd, Richmond, VA | 2600343 | 01/06/2026 |
| Everstone — Single Family | 3312 Sunstone Dr, Richmond, VA | 2608398 | 04/03/2026 |
| Watermark — Single Family | 7018 Sanguine Mews, Chesterfield, VA | 2615386 | 06/09/2026 |
| Harpers Mill — Single Family | *(pending example MLS sheet)* | — | — |
| Wynwood at Fox Creek | *(pending — no recent listings)* | — | — |

---

## Version History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-06-12 | Andrew Rich / Claude | Initial document created. 4 of 6 communities fully populated. Harpers Mill SF Fee Includes and Creekside Run Fee Includes pending MLS verification. Wynwood at Fox Creek pending next listing. |
| 1.1 | 2026-07-15 | Andrew Rich / Claude | Fee Includes numeric codes migrated from retired `Lennar_Bookmarklet_Build_Notes.md` (Step 4 of doc realignment execution). Codes format is suffix-only per `Lennar_Payload_Schema.md` §7 Format Conventions — Fee Info bookmarklet reconstructs `Input_576_XX` inline. Harpers Mill TH verified live 2026-07-15 (8720 Whitman Dr smoke test); Everstone and Watermark carry "interim mapping — verify at first live use"; Harpers Mill SF and Creekside Run remain pending display-text confirmation. |

---

## Pending Items

| Community | Item Pending | Notes |
|---|---|---|
| Harpers Mill — Single Family | Fee Includes (exact MLS wording) | No SF example MLS sheet yet — confirm when available |
| Creekside Run — Townhome | Fee Includes | Field was blank on 6033 Blue Iris Rd MLS sheet — confirm |
| Wynwood at Fox Creek | All data | No recent listings — populate when next email received |
| Fawncrest | All data | Listed in HOA Quick Sheet but not currently active — add when needed |

---

## Communities

---

### Harpers Mill — Townhome
**County:** Chesterfield | **City:** Chesterfield | **Zip:** 23832 | **Property Type:** Condo/Townhome

#### Schools
| Level | School |
|---|---|
| Elementary | Winterpock |
| Middle | Deep Creek |
| High | Cosby |

#### HOA
| Field | Value |
|---|---|
| HOA | Yes |
| Fee | $800.00 / Yearly |
| Additional Fee | $70.00 / Monthly |
| Initial Working Capital Contribution: $350 | |
| Management Firm | ACS West Management |
| Fee Description | Community Association |
| Fee Includes | Clubhouse, Comm Ar Mnt, Common Area, Pool, Snow Removal, Trash Removal |
| Fee Includes Codes | `["19","01","25","10","14","15"]` — verified live 2026-07-15 (8720 Whitman Dr smoke test) |
| Trash by HOA | Yes |

---

### Harpers Mill — Single Family
**County:** Chesterfield | **City:** Chesterfield | **Zip:** 23832 | **Property Type:** Single Family

#### Schools
| Level | School |
|---|---|
| Elementary | Winterpock |
| Middle | Deep Creek |
| High | Cosby |

#### HOA
| Field | Value |
|---|---|
| HOA | Yes |
| Fee | $800.00 / Yearly |
| Initial Working Capital Contribution: $300 | |
| Management Firm | ACS West Management |
| Fee Description | Community Association |
| Fee Includes | *(confirm exact MLS wording — no SF example sheet yet)* |
| Fee Includes Codes | *(pending — populate when display text confirmed on first SF listing)* |
| Trash by HOA | No |

---

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

---

### Everstone — Single Family
**County:** Henrico | **City:** Richmond | **Zip:** 23223 | **Property Type:** Single Family

#### Schools
| Level | School |
|---|---|
| Elementary | Harvie |
| Middle | Fairfield |
| High | Highland Springs |

#### HOA
| Field | Value |
|---|---|
| HOA | Yes |
| Fee | $48.00 / Monthly |
| Initial Working Capital Contribution: $144 | |
| Management Firm | Everstone HOA Management |
| Fee Description | Community Association |
| Fee Includes | Comm Ar Mnt, Common Area |
| Fee Includes Codes | `["01","25"]` — interim mapping from retired Build Notes; verify at first live use |
| Trash by HOA | No |

---

### Watermark — Single Family
**County:** Chesterfield | **City:** Chesterfield | **Zip:** 23234 | **Property Type:** Single Family

#### Schools
| Level | School |
|---|---|
| Elementary | Hopkins |
| Middle | Falling Creek |
| High | Bird |

#### HOA
| Field | Value |
|---|---|
| HOA | Yes |
| Fee | $180.00 / Quarterly |
| Capital Contribution Fee: $275 | |
| Management Firm | ACS West Management |
| Fee Description | Community Association |
| Fee Includes | Clubhouse, Common Area, Pool, Recreational Facilities |
| Fee Includes Codes | `["19","25","10","11"]` — interim mapping from retired Build Notes; verify at first live use |
| Trash by HOA | No |

---

### Wynwood at Fox Creek — Single Family
**County:** *(pending)* | **City:** *(pending)* | **Property Type:** Single Family

#### Schools
*(Pending — to be populated when next listing is received)*

#### HOA
*(Pending — to be populated when next listing is received)*

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*This is a living document. Update version history and version date with each revision.*

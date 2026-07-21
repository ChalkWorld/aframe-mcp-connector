# Agent Profiles
**Version 1.5** | *Last Updated: July 18, 2026*
*Living document — update as agent preferences, contacts, and rules change*

---

## How to Use This Document

At the start of every session, reference the relevant agent's profile for file-specific rules, default contacts, preferred vendors, IDs, and any workflow quirks. This information does not live in the protocol docs — it lives here to keep protocols generic and reusable.

> **File Setup Rule (all file types):** The roster agent — whoever owns the file (Kelly, Gary, Liz, Bethanne, etc.) — is always the **Primary Agent** on the Aframe transaction. Andrew Rich is always **Assistant 1**. This applies to buyer-side, seller-side, and new listing files alike. Both fields are UI-only and cannot be written via the connector; they must be set manually in the Aframe UI at file creation. Sessions surface this in the handoff checklist for every file.

> **ID Rule:** Whenever an Aframe contact ID can be found or confirmed for any person or vendor referenced in this document, it must be recorded here. Always search Aframe before adding a new entry and populate the ID field at that time.

> **Admin Fee vs. Services Requested:** These are two different things. `f_AdminFee` reflects the fee the *agent* charges their client — found on the Buyer Agency Agreement (buyer-side) or Listing Agreement (seller-side) when it accompanies the contract. `f_ServiceRequested` reflects Andrew's pricing for services rendered per the AAR-TC website. They do not always match and should never be assumed to.

> **Invoicing & Payment (QuickBooks Online):** Andrew uses QBO for invoicing. Invoices include a 3% CC processing fee surcharge by default, with an opt-out path: agents who pay via Venmo or bank payment are not charged the surcharge. Bank payments incur a ~1% fee that Andrew absorbs. Each agent's preferred payment method and CC-surcharge handling is captured in their Payment Preferences section below.

> **Cognito Forms:** All agents access intake forms through the AAR-TC website. Form IDs and form-to-workflow mapping will be documented in a separate session.

---
---

## Kelly Painschab
**Brokerage:** Real Broker LLC (Taylor Realty Team) | 1765 Greensboro Station Place, McLean VA 22102
**Phone:** (804) 898-4943
**Email:** kelly.asmartmove@gmail.com
**DPOR License:** 0225240902 | **Firm License:** 226026755
**Aframe Contact ID:** 998471
**Agent Gender Fields:** `her` / `her`

### Default Co-Agent
| Name | Company | Email | Phone | Aframe Contact ID | MLS Co-List Code |
|---|---|---|---|---|---|
| Lance Taylor | Real Broker (Taylor Realty Team) | Lance.Taylorrealtyteam@gmail.com | (804) 912-0023 | 998469 | `82685` |

> **Co-list agent protocol:** An agent may have a standing co-list agent added to every seller-side listing. The MLS Co-List Code above is entered in the Co-List Agent Code field (`Input_170`) on the Agent/Office Info tab. Confirm whether a co-list agent applies at the start of every listing session, before payload creation. If there is any ambiguity — always ask.

### Preferred Settlement / Closer
| Name | Company | Email | Phone | Aframe Contact ID | Notes |
|---|---|---|---|---|---|
| Mary Bonniville (+ Heather Reid) | Lafayette Title & Escrow | mary@lafayettetitle.net / processor@lafayettetitle.net | (757) 345-3467 | 1010172 | Heather is Mary's assistant — emails come from both |

### Preferred Lenders
| Name | Company | Email | Phone | Aframe Contact ID |
|---|---|---|---|---|
| David Velazquez | Fidelity Direct Mortgage | david.velazquez@fdmhome.com | — | 2021433 |
| Carter Hall | — | — | — | *(to be confirmed)* |

### Preferred Termite Inspector
| Name | Company | Email | Phone | Aframe Contact ID |
|---|---|---|---|---|
| Rhonda Grubbs | PestNow | rgrubbs@pestnow.com | — | 1680401 |

### Services Requested (Andrew's Pricing)
- **Buyer-side:** `C2C - $395`
- **Listing:** `Listing Data Input - $100` *(data input only)*

### Admin Fee (Agent's Client Charge)
- **Buyer-side:** $395 — confirmed from Buyer Agency Agreement
- **Seller-side:** $425 — confirmed on Listing Agreement
- Check the Buyer Agency Agreement (buyer-side) or Listing Agreement (seller-side) at intake — these are the source for these values

### Payment Preferences
- **Payment method:** Bank routing (saved in QBO)
- **CC surcharge handling:** N/A — pays via bank, not credit card
- **Notes:** Andrew absorbs the ~1% bank processing fee on Kelly's payments. No surcharge applied to her invoices.

### Merge Field Defaults
| Field | Value |
|---|---|
| `f_Agentgender` | `her` |
| `f_Agentgender2hisher` | `her` |
| `f_ServiceRequested` | Buyer-side: `C2C - $395` <br>Listing: `Listing Data Input - $100` |
| `f_AdminFee` | Buyer-side: `395` <br>Seller-side: `425` |

### File Rules & Quirks

**Mike & Alex Mirzakandov — Investor Clients**
Kelly frequently has deals with these investor brothers. They buy under LLCs — the LLC name on the contract determines which contact record to use. All Mirzakandov deals go to Linda Roland at Apex Title, not Mary at Lafayette.

| Name | Legal Name | Company/LLC | Email | Phone | Aframe Contact ID |
|---|---|---|---|---|---|
| Mike Mirzakandov | Mikhail | Sim Investment LLC | mike1112m@gmail.com | (804) 516-5564 | 1022561 |
| Alex Mirzakandov | Aleksandr | BAIM 7 LLC | alex_m112@yahoo.com | (804) 339-3286 | 1085989 |
| Alex Mirzakandov | Aleksandr | Props 2 Baim | alex_m112@yahoo.com | (804) 339-3286 | 1352777 |

**Closer for Mirzakandov deals:**
| Name | Company | Email | Phone | Aframe Contact ID |
|---|---|---|---|---|
| Linda Roland | Apex Title & Settlement | lroland@apextss.com | (804) 521-8944 | 893902 |

> When a Mirzakandov deal comes in, check the contract for the LLC name and match to the correct contact record above. If a new LLC appears, create a new contact following the entity naming rules.

---
---

## Gary Martin
**Brokerage:** Providence Hill Real Estate
**Phone:** (804) 418-5509
**Email:** gary@gmartinproperties.com
**Aframe Contact ID:** 997562
**Agent Gender Fields:** `him` / `his`

### Notes
- Gary holds the limited rep agent role for the local Lennar sales group in Richmond, secured through his own connections. Lennar pays him a flat monthly fee to handle their new-construction listings.
- That same relationship covers a second, distinct deal type — Lennar corporate model home dispositions. See **File Rules & Quirks** below; do not assume every Lennar-seller file runs the standard Lennar New Listing Protocol pipeline.
- Lennar workflow for standard new-construction listings is governed by the Lennar New Listing Protocol (separate document).

### Preferred Settlement / Closer
| Name | Company | Email | Phone | Aframe Contact ID | Notes |
|---|---|---|---|---|---|
| Beth Proffitt | Fleckenstein & Associates | beth@pf-law.com | (804) 655-2648 | 1005240 | Buyer-side files |
| Cathy Linegar | Fleckenstein & Associates | cathy@pf-law.com | (804) 655-2622 | 1006897 | Seller-side files |

> ⚠️ **Duplicate Note:** A second Beth Proffitt record exists in Aframe (contact ID 2259743, no company, same email). Use 1005240 as the primary record.

### Preferred Lenders
*(to be confirmed)*

### Preferred Termite Inspector
| Name | Company | Email | Phone | Aframe Contact ID |
|---|---|---|---|---|
| Rhonda Grubbs | PestNow | rgrubbs@pestnow.com | — | 1680401 |

### Services Requested (Andrew's Pricing)
- **Buyer-side:** `C2C - $395`
- **Lennar new-construction listings:** `Listing Data Input - $100` *(data input only — Lennar pays Gary a flat monthly fee for this work, which Gary passes through to Andrew in full; Gary takes no cut)*
- **Lennar model home dispositions ("Gossamer-type" deals):** `Listing Data Input - $100` + `C2C - $395` *(standard listing fee structure — full listing-to-closing management, same rate as any standard listing)*
- **Non-Lennar Gary listings:** `Listing Data Input - $100`

### Admin Fee (Agent's Client Charge)
- Gary does not charge clients an admin fee — leave `f_AdminFee` blank on Gary's files

### Payment Preferences
- **Payment method:** Credit card
- **CC surcharge handling:** Pays the 3% surcharge himself — does not pass it through to clients
- **Notes:** No client passthrough; the surcharge is absorbed by Gary directly.

### Merge Field Defaults
| Field | Value |
|---|---|
| `f_Agentgender` | `him` |
| `f_Agentgender2hisher` | `his` |
| `f_ServiceRequested` | Buyer-side: `C2C - $395` <br>Lennar new-construction listing: `Listing Data Input - $100` <br>Gossamer-type model home disposition: `Listing Data Input - $100` + `C2C - $395` <br>Non-Lennar listing: `Listing Data Input - $100` |
| `f_AdminFee` | N/A |

### File Rules & Quirks

**Two Lennar deal types — do not assume every Lennar-seller file runs the Lennar New Listing Protocol pipeline.**

1. **Standard new-construction listings** — the listings Lennar sends through Carly/Megan. Full Lennar New Listing Protocol pipeline applies (Cognito intake, bookmarklet payloads, `Lennar/[Address]` Gmail label tree, etc.). Andrew's role is data-input only.

   **Flat fee mechanics:** Lennar corporate — not the local sales manager — sets the rate: $1,500/month flat for up to 15 new listings, plus $100 for each additional listing beyond 15 in a given month. Because this is treated as a commission, Lennar pays it to Gary's broker rather than to Gary directly. The broker deducts $150 off the top for E&O and other liabilities before it reaches Gary, leaving $1,350. Andrew invoices Gary $1,350 at the start of each month — Gary takes no cut of his own.

   > **Reference note:** This fee structure is being tracked as a baseline for evaluating future limited-rep-listing relationships with other agents/builders. Andrew is considering pricing his own monthly service at a flat $1,500 regardless of what a given builder pays the agent out. Note that the $150 E&O deduction is specific to how Lennar routes this payment through Gary's broker as a commission — other builder/agent/broker arrangements may not be structured the same way, so the amount that actually nets to Andrew per relationship may vary even at the same $1,500 headline rate.

2. **Model home dispositions ("Gossamer-type" deals)** — when Lennar corporate needs to sell one of their model homes, Gary is the agent they go to as part of his limited rep role. These do **not** go through the Lennar intake pipeline or bookmarklet system — they run as a standard TC file (standard `@ TC Transaction Folder/...` Gmail label tree, not `Lennar/...`; confirmed on 17206 Gossamer Dr, where the label history showed the standard tree used consistently from intake through closing). Andrew fully manages these listing-to-closing and charges his standard combined rate — `Listing Data Input - $100` + `C2C - $395` — the same as any standard listing, rather than the Lennar new-construction $100-only data-input rate. Infrequent, but otherwise run like any standard listing.
   - **Closing:** Model home dispositions always close with Lennar Title.

     | Name | Company | Email | Aframe Contact ID |
     |---|---|---|---|
     | Lory McCaffrey | Lennar Title | lory.mccaffrey@lennartitle.com | 1658156 |

---
---

## Liz Brown
**Brokerage:** Exp Realty
**Phone:** (503) 828-2173
**Email:** lbrealestate4u@gmail.com
**Aframe Contact ID:** 914153
**Agent Gender Fields:** `her` / `her`

> ⚠️ **Duplicate Contact Note:** Two Liz Brown records exist in Aframe — contact ID 914153 (Exp Realty) and 992951 (no company, Harry Brown as alt contact). Both share the same email and phone. Use 914153 as the primary agent record. The duplicate (992951) should be reviewed and merged or removed in the UI.

### Preferred Settlement / Closer
| Name | Company | Email | Phone | Aframe Contact ID | Notes |
|---|---|---|---|---|---|
| Faisal Qureshi | Chaplin and Qureshi | fqureshi@candqlaw.com | (804) 353-5800 | 798332 | Settlement attorney option |
| Bev MacDowell | Frontier Title II | bev@vatitles.com | (804) 330-8035 | 979102 | Title/settlement — lower cost option |
| Ilanna Corker | Frontier Title II | closing@vatitles.com | (804) 330-8035 | 1635325 | Also at Frontier Title II |

### Preferred Lenders
*(to be confirmed)*

### Preferred Termite Inspector
| Name | Company | Email | Phone | Aframe Contact ID |
|---|---|---|---|---|
| Rhonda Grubbs | PestNow | rgrubbs@pestnow.com | — | 1680401 |

### Services Requested (Andrew's Pricing)
- **Buyer-side:** `C2C - $395`
- **Listing:** `Listing Management - $200` *(full listing management)*

### Admin Fee (Agent's Client Charge)
- **Buyer-side:** $425
- **Seller-side:** $625
- Liz's admin fees are intentionally higher than Andrew's invoiced amounts — she passes the 3% CC processing fee through to her clients via the admin fee. Confirm values against the Buyer Agency Agreement / Listing Agreement at intake.

### Payment Preferences
- **Payment method:** Credit card
- **CC surcharge handling:** Passes the 3% surcharge through to her clients via inflated admin fees
- **Notes:** This is why her admin fees ($425 buyer-side / $625 seller-side) are higher than the corresponding `f_ServiceRequested` values. She collects more from the client than Andrew invoices her for, then uses the delta to cover the CC processing fee on Andrew's invoice.

### Merge Field Defaults
| Field | Value |
|---|---|
| `f_Agentgender` | `her` |
| `f_Agentgender2hisher` | `her` |
| `f_ServiceRequested` | Buyer-side: `C2C - $395` <br>Listing: `Listing Management - $200` |
| `f_AdminFee` | Buyer-side: `425` <br>Seller-side: `625` |

### File Rules & Quirks
*(to be confirmed)*

---
---

## Bethanne Elamghari
**Brokerage:** Exp Realty
**Phone:** (804) 247-6432
**Email:** bethanneyourrealtor@gmail.com
**Aframe Contact ID:** 1634568
**Agent Gender Fields:** *(to be confirmed)*

> ⚠️ **Note:** A second Aframe contact exists under the name Bethanne Elamghari at Frontier Title II (contact ID 2236845, email: realestate@vatitles.com). This is a separate individual — not the agent record. Use 1634568 for agent files.

### Preferred Settlement / Closer
*(to be confirmed)*

### Preferred Lenders
*(to be confirmed)*

### Preferred Termite Inspector
| Name | Company | Email | Phone | Aframe Contact ID |
|---|---|---|---|---|
| Rhonda Grubbs | PestNow | rgrubbs@pestnow.com | — | 1680401 |

### Services Requested (Andrew's Pricing)
- **Buyer-side:** `C2C - $395`
- **Listing:** *(to be confirmed — service level not yet established)*

### Admin Fee (Agent's Client Charge)
*(to be confirmed — check Buyer Agency Agreement / Listing Agreement at intake)*

### Payment Preferences
- **Payment method:** *(to be confirmed)*
- **CC surcharge handling:** *(to be confirmed)*
- **Notes:** *(to be confirmed)*

### Merge Field Defaults
| Field | Value |
|---|---|
| `f_Agentgender` | *(to be confirmed)* |
| `f_Agentgender2hisher` | *(to be confirmed)* |
| `f_ServiceRequested` | Buyer-side: `C2C - $395` <br>Listing: *(to be confirmed)* |
| `f_AdminFee` | *(to be confirmed)* |

### File Rules & Quirks
*(to be confirmed)*

---

*Add new agent sections as new agent relationships are onboarded.*
*Update version number and date at the top of this document with each revision.*
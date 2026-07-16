---
title: Cursor Handoff — Lennar_Payload_Schema.md — 2026-07-16
document_id: HANDOFF-2026-07-16-LENNAR-SCHEMA
date: 2026-07-16
project: AAR-TC Lennar CVRMLS Matrix Intake
---

Apply the changes below surgically to `docs/lennar/Lennar_Payload_Schema.md`. Do not modify anything not listed here.

## Change 1

Bump the frontmatter version and version_date.

**Find:**
```markdown
version: 1.1
version_date: 2026-07-15
```

**Replace with:**
```markdown
version: 1.2
version_date: 2026-07-16
```

## Change 2

Add a static Rooms fallback (TH="8", SF="10") to the §4.1 Listing Info field table. Andrew's standing default for when Carly's form doesn't include a Rooms field — non-critical data point but Matrix requires it regardless.

**Find:**
```markdown
| `listing.rooms` | `Input_48` | Dynamic (email) | Always written for Lennar — same reason |
```

**Replace with:**
```markdown
| `listing.rooms` | `Input_48` | Dynamic (email) — static fallback if absent | Always written for Lennar — same reason as year_built. **Standing default (added 2026-07-16):** if Rooms isn't stated in the email, use `"8"` for Townhouse / `"10"` for Single Family. Low-stakes field Matrix requires regardless. |
```

## Change 3

Add two new standing defaults to §4.2 Bath Info — the Lennar-TH structural rule (3-level slab, no Basement row) and the all-full-baths-TS rule — and update the illustrative config table with the confirmed Harpers Mill TH / Arcadia example.

**Find:**
```markdown
**Path-specific rules:** None. All fields always included on both paths.

**Typical Lennar bath configurations (confirm per email — do not assume):**

| Type | Basement | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|---|
| Townhouse | 0 / 0 | 0 / 1 | 2 / 0 (TS) | 0 / 0 | 0 / 0 |
| Single Family | 0 / 0 | 0 / 1 | 2 / 0 (TS) | 0 / 0 | 0 / 0 |

Configurations vary by plan; these are the most common defaults. See §7 Open Verification Items.
```

**Replace with:**
```markdown
**Path-specific rules:** None. All fields always included on both paths.

**Structural standing default — Townhomes (added 2026-07-16):** Until told otherwise, all Lennar townhomes are built 3 levels on a slab foundation — there is no true basement. Map the lowest livable level to `bath.level1` (never `bath.basement`); `bath.basement` stays `"0"`/`"0"` for every Lennar TH regardless of community. This is a structural rule, not a per-listing guess — it does not need re-confirming per email. The exact full/half bath counts at each level still vary by floor plan and must come from the email.

**Full bath descriptor standing default (added 2026-07-16):** All full baths use `"TS"` unless the email explicitly states otherwise. Applies to both Townhouse and Single Family.

**Typical Lennar bath configurations (illustrative — confirm counts per email):**

| Type | Basement | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|---|
| Townhouse (confirmed — Harpers Mill TH / Arcadia, 2026-07-16) | 0 / 0 | 1 / 0 (TS) | 0 / 1 | 2 / 0 (TS) | 0 / 0 |
| Single Family | 0 / 0 | 0 / 1 | 2 / 0 (TS) | 0 / 0 | 0 / 0 |

Bath counts vary by plan — confirm per email. The level *structure* (no Basement row for TH; TS on all full baths) is fixed per the standing defaults above. See §7 Open Verification Items.
```

## Change 4

Update the §7.1 Open Verification Items bullet to reflect partial resolution of the bath configuration question.

**Find:**
```markdown
- **Bath configuration confirmation.** The typical configurations in §4.2 are common defaults, not per-listing truth. Sessions must confirm bath counts from the actual email before writing to payload.
```

**Replace with:**
```markdown
- **Bath configuration confirmation.** *Partially resolved 2026-07-16 — 8724 Whitman Dr smoke re-test.* The level structure is now a fixed standing default: all Lennar townhomes are 3-level/slab with no Basement row (§4.2), and all full baths default to `"TS"` unless the email says otherwise. What's still open: exact full/half counts per level vary by floor plan and must be confirmed from the actual email before writing to payload; Single Family bath structure remains unconfirmed beyond the illustrative default in §4.2.
```

## Change 5

Add a version history row for v1.2.

**Find:**
```markdown
| 1.1 | 2026-07-15 | Andrew Rich / Claude | Step 4 of doc realignment complete + smoke-test findings captured. Added Format Conventions section documenting the checkbox array format split (suffix-only for Fee Info/Owner; full-ID for Features A/B) — first live surfacing on 8720 Whitman Dr. §4.1 Lot corrected to SKIP-TAXID for Lennar (smoke test confirmed tax-record autofill on Harpers Mill); Year Built/Rooms/Levels/Bedrooms/Post Office confirmed as NOT autofilled and remain in the Lennar-carveout write group. §4.6 fee_includes Notes and §6 Community Lookup Pointer updated to reflect Fee Includes codes now in Community DB. §7.1 Property Details item resolved; Fee Includes item removed (Step 4 closed it). §7.2 Property details structural decision updated with Lot exception. §7.3 Steps 3 & 4 marked complete; Step 5 gains Format Conventions carry-forward note. §8.1 and §8.2 example payloads corrected to suffix-only `fee_includes` format. Retirement Notes finalized — 4 source docs deleted this session. |
```

**Replace with:**
```markdown
| 1.1 | 2026-07-15 | Andrew Rich / Claude | Step 4 of doc realignment complete + smoke-test findings captured. Added Format Conventions section documenting the checkbox array format split (suffix-only for Fee Info/Owner; full-ID for Features A/B) — first live surfacing on 8720 Whitman Dr. §4.1 Lot corrected to SKIP-TAXID for Lennar (smoke test confirmed tax-record autofill on Harpers Mill); Year Built/Rooms/Levels/Bedrooms/Post Office confirmed as NOT autofilled and remain in the Lennar-carveout write group. §4.6 fee_includes Notes and §6 Community Lookup Pointer updated to reflect Fee Includes codes now in Community DB. §7.1 Property Details item resolved; Fee Includes item removed (Step 4 closed it). §7.2 Property details structural decision updated with Lot exception. §7.3 Steps 3 & 4 marked complete; Step 5 gains Format Conventions carry-forward note. §8.1 and §8.2 example payloads corrected to suffix-only `fee_includes` format. Retirement Notes finalized — 4 source docs deleted this session. |
| 1.2 | 2026-07-16 | Andrew Rich / Claude | 8724 Whitman Dr smoke re-test (second Harpers Mill TH taxid listing) ran clean against v1.1 — no new bugs, confirms Fixes 1 & 2 hold. Added three standing defaults: §4.1 `listing.rooms` static fallback when absent from email (TH="8", SF="10"); §4.2 structural rule that all Lennar TH are 3-level/slab with no Basement row (confirmed via Harpers Mill TH / Arcadia); §4.2 all-full-baths-`"TS"` default. §7.1 Bath configuration item updated to reflect partial resolution — level structure now fixed, per-level counts and SF still open. |
```

No other changes to `Lennar_Payload_Schema.md`.

Do not commit yet. Changes for additional files follow in a separate handoff.

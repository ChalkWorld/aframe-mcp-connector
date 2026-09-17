---
title: Payload Rules — Script-Author Conventions
document_id: PAYLOAD-RULES-CONVENTIONS-001
version: 0.1
date: 2026-09-17
project: AAR-TC Lennar Operational Project
related: Lennar_Payload_Schema.md, Lennar_Restructure_Charter.md, Lennar_Restructure_Phase_Tracker.md
---

# Payload Rules — Script-Author Conventions
### AAR-TC Lennar Operational Project

Living reference for the base-level conventions that govern how the Phase 1 script reads the **Payload Rules** table in the Lennar Airtable base (`app78fMUwDNBHUZ6r`). Rules in the table are authored assuming these conventions — they are not restated on individual rows. A script author implementing rule execution needs both this file and the Payload Rules table.

Expected to grow as new tabs are authored and new patterns emerge. Additions get logged in the Change Log at the bottom.

---

## Core philosophy

The rules table maps Form 17 fields to Matrix fields. Direct passthrough where they correspond. The script implements Matrix-quirk handling and static values as specified; it does NOT second-guess NHC input, error-correct for likely rep mistakes, or apply defensive derivations. Bad NHC input is a form-side or training concern, handled upstream — not in the script.

Concretely: if the NHC enters bath counts on a level and then unchecks that level in the multi-select gate, the resulting bad data is a Cognito form-visibility issue or an NHC-training issue, not a script-error-correction issue. If the NHC forgets to fill a Matrix-required field, Cognito's own required-field validation catches it at submit time. The script's job is to move data cleanly from Cognito to Matrix, honoring the payload contract, and to write the static/derived values the payload requires.

---

## Conventions

### 1. Numeric Matrix TEXT fields

Bath counts, room counts, etc. are Matrix TEXT fields that accept string representations of integers. The script writes them as strings (`"0"`, `"1"`, `"2"`, etc.).

**Universal convention:** when a Cognito source resolves to null / missing / empty, the script writes `"0"` to the corresponding numeric Matrix TEXT field. Individual rules do not restate this — treat it as a base-level guarantee.

The integer-to-string coercion is likewise implicit for these fields; Transform text does not need to spell it out.

### 2. The Cognito Field link is the primary source

When `Source Type = COGNITO`, the linked **Cognito Field** is the sole value source for that rule. If a rule needs to read a second Cognito field to gate or combine with the first, that is a `DERIVED` rule and the second field's read is spelled out in the **Transform / Logic** column.

The linked Cognito Field's own **Conditional Visibility** on the form is descriptive metadata about the form — it records what the form does. It is not a gate the script honors. If visibility behavior needs to be honored to prevent bad data, that is a form-side or NHC-training concern, handled upstream.

### 3. Transform / Logic is the definitive spec

Where a rule specifies a Transform, the Transform text is what the script implements. It is written in plain English but should be precise enough to translate directly to code:

- `"stringify integer"` means `str(value)`
- `"write '0'"` means literal `'0'`
- `"write empty string"` means `""` (not skip)
- `"write \"TS\""` means literal string `TS`

Where a rule has no Transform, the value comes verbatim from:

- the **Cognito Field** (when `Source Type = COGNITO`)
- the **Static Value** (when `Source Type = STATIC`)
- the **Community DB Column** (when `Source Type = COMMUNITY_DB`)
- the operator (when `Source Type = MANUAL_ENTRY`)

### 4. STATIC blank rows are deliberate empty writes

A `STATIC` row with **Static Value** = empty means the script writes an empty string to the Matrix field. This is distinct from a Matrix field that has no rule at all — no-rule means the script does not touch the field. Both produce a visibly-blank Matrix field, but the intent (and the extension behavior) differs.

### 5. Fields the script never touches have no row

The table covers only what the script writes. Fields Matrix defaults blank and the script leaves alone are absent from the table by design; their absence is not a gap.

Matrix-required fields that go missing at intake are enforced upstream (Cognito form required-field validation), not documented here. If a Matrix-required field somehow arrives blank, Matrix flags it when the listing is flipped to Active — this is a known escape hatch, not a script responsibility.

---

## Change Log

**v0.1 — 2026-09-17** — Initial conventions drafted during the Bath Info philosophy pass. Conventions 1–5 established. This file exists because the Airtable base's own table description could not be updated via the API (approval flow); conventions live here for now, mirrored into the Payload Rules table description manually when convenient.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

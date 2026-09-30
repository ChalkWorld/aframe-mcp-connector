---
title: Payload Rules — Script-Author Conventions
document_id: PAYLOAD-RULES-CONVENTIONS-001
version: 0.2
date: 2026-09-30
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

### 6. Community-name resolution and unresolved-lookup behavior

The payload's top-level `community` key is not a Matrix write; it's a session-side variable used to key every `COMMUNITY_DB` rule's lookup. Per convention #5 (no row for what the script doesn't write to Matrix), community-name resolution has no Payload Rules row.

The resolution combines two Cognito Form 17 fields to form the Community Reference DB lookup key:

- `Intake.Community` (closed enum: `Harpers Mill`, `Creekside Run`, `Everstone`, `Watermark`)
- `PropertyBasics.PropertyType` (`Single Family` or `Townhouse`)

Concatenated as `<Community> <TH|SF>` (e.g. `"Harpers Mill" + "Townhouse" → "Harpers Mill TH"`), then queried against the Community Reference DB's `Community` primary field.

**Unresolved lookup is a hard error at payload generation.** Some Community × PropertyType combinations have no DB record — `Creekside Run + Single Family`, `Everstone + Townhouse`, and `Watermark + Townhouse` are all currently invalid. When the lookup misses, the script fails loudly rather than fuzzy-matching, applying a default, or silently omitting community-driven fields. Bad NHC selection is caught by the operator at intake review, not by script-side error correction. This is the community-lookup extension of convention #5's absence-as-signal pattern.

### 7. DERIVED vs. COGNITO with Transform

When a rule reads a Cognito field and applies a Transform, the source-type classification depends on what the Transform does. The **Cognito Field** link on the rule is populated in both cases; the **Source Type** distinguishes them.

**Format shift preserving meaning → `COGNITO` with Transform.** The output represents the same underlying fact as the source, translated to the format Matrix expects. The source's semantic content is preserved; only the encoding changes.

- Type (`Input_849`) reads `PropertyBasics.PropertyType` with Transform `"Single Family" → "SFR"` / `"Townhouse" → "TOWN"` — property type stays property type.
- Attached Y/N (`Input_850`) reads the same field with Transform `"Townhouse" → "1"` / `"Single Family" → "0"` — attached-ness is derivable directly from home type without invention.

**Lossy inference (value invented from source) → `DERIVED`.** The output is a different fact from the source, produced by an authoring rule. The source is one input to the derivation, not the value carrier.

- Rooms (`Input_48`) reads `PropertyBasics.PropertyType` with Transform `SF → "10"` / `TH → "8"` — room count is not a property of home type; the Lennar-wide standing default assigns a plausible count per type.
- Bath Info's `Basement.desc` / `Level<n>.desc` rules (`IF FullBath > 0 → "TS", ELSE ""`) read the level's own `FullBath` count with an IF/ELSE — descriptor invented from count.

The distinction matters because a script author reading `COGNITO` with Transform expects the rule to preserve what the NHC submitted; `DERIVED` signals that the script is authoring the value from inputs, and misreads there produce values the NHC never confirmed.

---

## Change Log

**v0.2 — 2026-09-30** — Added convention #6 (community-name resolution and hard-fail on unresolved lookup) surfaced during v0.10's Listing Info authoring pass, and convention #7 (DERIVED vs. COGNITO with Transform classification) surfaced by the Rooms rule's classification decision in the same pass. Both codify script-contract behaviors previously implicit in prior rule authoring. Convention #6 is the community-lookup extension of #5's absence-as-signal pattern. Convention #7 is the operating principle behind why Type and Attached Y/N are `COGNITO` with Transform (format shifts) while Rooms is `DERIVED` (invention from source).

**v0.1 — 2026-09-17** — Initial conventions drafted during the Bath Info philosophy pass. Conventions 1–5 established. This file exists because the Airtable base's own table description could not be updated via the API (approval flow); conventions live here for now, mirrored into the Payload Rules table description manually when convenient.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*

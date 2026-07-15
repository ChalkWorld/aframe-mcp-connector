# Payload Envelope Specification
**Document ID:** AAR-TC-ENV-001
**Version:** 1.0 | *Prepared: July 15, 2026*
**Purpose:** Runtime contract between LLM sessions and the (future) Chrome extension. Defines the four envelope keys every payload carries and the session-pack lookup table that maps envelope values to the docs a session loads.

Companion artifact to `AAR-TC-DOC-REALIGN-TARGET-001` — extracted into its own doc as specified in that proposal's §2 and §4.

---

## 1. Purpose and Consumers

The payload envelope is a small self-describing header at the top level of every payload. It has two consumers:

- **The session (LLM) at start.** Once the envelope values are determined from the incoming work (email, human instruction, etc.), the session consults §3's lookup table to find the exact set of docs it should load. Nothing else. This is what makes "scope by path upfront" enforceable rather than aspirational.
- **The extension (future Chrome extension) at runtime.** The extension reads the same four keys to determine which MLS's field IDs to write to and which bookmarklet path logic to apply.

Both consumers read the same envelope keys. This doc is the single specification both depend on.

---

## 2. Envelope Keys

Every payload the session generates includes these top-level keys:

```json
{
  "mls": "cvrmls",
  "builder": "lennar",
  "path": "new",
  "listing": { "...": "..." },
  "bath":    { "...": "..." }
}
```

| Key | Values | When present |
|---|---|---|
| `mls` | `"cvrmls"` today; other MLS identifiers as added | Always |
| `builder` | `"lennar"` today; other builder identifiers as added. **Omit key entirely for standard listings.** | When the listing is a builder intake |
| `path` | `"new"` \| `"taxid"` | Always |
| `phase` | `"1"` (initial structural payload) \| `"2"` (Features-only update to an existing listing) | Standard listings only; builder listings omit (builder intakes are one-shot) |

**Notes on values:**

- **`path` canonical form is `taxid` — no underscore.** This reconciles drift found in previous docs where both `taxid` and `tax_id` appeared for the same value. Sessions and bookmarklets should treat any `tax_id` occurrence as legacy and update on contact.
- **Key absence carries meaning.** Absence of `builder` signals a standard listing. Absence of `phase` signals a one-shot builder payload. Neither should ever be present as `null` or `""` — either the key exists with a value, or it doesn't exist.
- **Additional path values (e.g., `copy` for the Copy Listing entry mode) can be added when needed** by adding rows to §3 and updating this table. Not currently in use.

### 2.1 Concrete examples

**Builder listing (Lennar, Harpers Mill TH — a Tax ID community):**

```json
{
  "mls": "cvrmls",
  "builder": "lennar",
  "path": "taxid",
  "listing": { "...": "..." },
  "bath":    { "...": "..." }
}
```

**Standard listing (Phase 1 initial creation):**

```json
{
  "mls": "cvrmls",
  "path": "taxid",
  "phase": "1",
  "listing": { "...": "..." },
  "bath":    { "...": "..." }
}
```

**Standard listing (Phase 2 Features update on an existing listing):**

```json
{
  "mls": "cvrmls",
  "path": "taxid",
  "phase": "2",
  "features_a": { "...": "..." },
  "features_b": { "...": "..." }
}
```

---

## 3. Session Pack Lookup Table

Maps envelope values to the exact list of files a session loads. This is the mechanism that enforces §1.3 of the target architecture proposal — scope by path upfront, no universal encyclopedias.

| `mls` | `builder` | `path` | `phase` | Session pack (files to load) |
|---|---|---|---|---|
| cvrmls | lennar | new | — | `docs/lennar/Lennar_New_Listing_Protocol.md`, `docs/lennar/Lennar_Payload_Schema.md`, `docs/lennar/Lennar_Community_Reference_Database.md` |
| cvrmls | lennar | taxid | — | Same as above |
| cvrmls | — | taxid | 1 | `docs/protocols/New_Seller_Side_Session_Protocol.md`, `docs/cvrmls/CVRMLS_Payload_Schema.md` |
| cvrmls | — | taxid | 2 | `docs/protocols/New_Seller_Side_Session_Protocol.md`, `docs/cvrmls/CVRMLS_Payload_Schema.md` (Features section only) |

### 3.1 How the session uses this table

1. From incoming work (email, instruction), determine the envelope values.
2. If the envelope values match a row, load the files listed. Nothing else.
3. If no row matches — new MLS, new builder, unfamiliar combination — **stop and surface to Andrew.** Do not infer. This is the "surface ambiguity, don't guess" rule (target architecture proposal §6) applied at the routing layer, before the session has even loaded a schema.
4. Proceed with the workflow described in the row's protocol doc.

### 3.2 The "Features section only" clause is doctrine

The Phase 2 row loads only the Features section of `CVRMLS_Payload_Schema.md`. This is §1.3's token-efficiency principle applied at the doc-loading step — a Phase 2 session doesn't need Listing Info, Bath Info, Fee Info, or any other section, so it doesn't load them.

The mechanics for enforcing partial-doc loading are the session's responsibility (locate the Features section header, load through the next `##` header, etc.). The doctrine is: the session honors the scope declared in the lookup table.

**Dependency:** this only works if `CVRMLS_Payload_Schema.md` has a clearly-delimited Features section with a stable, greppable header. If it doesn't yet, that's a small maintenance item on the CVRMLS Payload Schema, not on this envelope doc — but flag it here so it isn't forgotten.

---

## 4. Extending the Table

Two extension patterns cover every foreseeable addition.

### 4.1 New builder in an existing MLS (e.g., Pulte-CVRMLS)

1. Create `docs/pulte/` with the three-file builder pack: Pulte Listing Protocol, Pulte Payload Schema, Pulte Community Reference Database (or equivalent — whatever the builder's data structure actually looks like).
2. Add one row per envelope combination to §3's table. Typically one or two rows depending on how many paths the builder uses.
3. No changes to existing rows. No changes to CVRMLS docs. No changes to Lennar docs.

If step 2 requires touching an existing row or an existing doc, the change is out of pattern — surface it as a discussion, don't quietly ship it.

### 4.2 New MLS (e.g., REIN)

1. Create `docs/rein/` with the full standard-pack set: REIN Field Reference, REIN Standard Payload Schema, REIN Bookmarklet Source, plus supplemental references as needed.
2. Create `bookmarklets/rein/` with the REIN launcher HTML files. At the same time, migrate the current flat `bookmarklets/` to `bookmarklets/cvrmls/` (this restructure was deferred until a second MLS actually exists — that's now).
3. Add row(s) for `mls: "rein"` combinations to §3's table.
4. Any builder that also lists in REIN gets its own REIN-derived schema. Exact folder pattern (e.g., `docs/lennar/Lennar_REIN_Payload_Schema.md` vs. a nested `docs/lennar/rein/` subfolder) is TBD when the case arises; the target architecture proposal §3.2 flags this as a decision to make when Lennar-in-REIN or similar actually happens.

### 4.3 The acid tests

- **Adding a new builder-MLS pair is one new folder + N new rows.** If a proposed change breaks that, it's the wrong change.
- **Existing rows never change when new rows are added.** If they do, the model has a hole.

---

## 5. Non-Goals

This doc intentionally does not cover:

- **Payload contents.** Tab-by-tab field lists, stored values, cascade behavior. Those live in each MLS Standard Payload Schema or Builder Payload Schema.
- **Field IDs.** Those live in each MLS's Field Reference.
- **Session workflow.** That lives in each protocol doc.
- **Bookmarklet source code.** That lives in each MLS's Bookmarklet Source.
- **MLS-agnostic field abstraction.** Non-goal per `AAR-TC-DOC-REALIGN-BRIEF-001` §5.3 and reaffirmed in the target architecture proposal §7. The envelope routes to MLS-specific plumbing; it doesn't hide MLS differences.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-07-15 | Initial version. Extracted from `AAR-TC-DOC-REALIGN-TARGET-001` §2 into standalone envelope specification. Reconciles `taxid` canonical form. |

---

*This doc is the router. Everything else in the doc set is what the router points at.*

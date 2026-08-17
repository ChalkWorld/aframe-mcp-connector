# Lennar CVRMLS Matrix Extension (POC)

Chrome extension (Manifest V3) — consolidates the bookmarklet-per-tab system into one tool. Auto-detects the current Matrix tab and fills its fields on click, replacing the need to click a separate bookmark per tab.

Scoped to Lennar/CVRMLS only for the POC. The `payload.mls` / `payload.builder` envelope keys and multi-MLS/multi-builder routing (see `docs/Payload_Envelope.md`) are a later-phase decision, not built into this POC.

Internal layout, build notes, and field-fill logic are added here during the build session. Source logic to port from: `docs/cvrmls/CVRMLS_Bookmarklet_Source.md`.

---
title: Cursor Handoff — package.json + Commit & Deploy — v0.4.0
document_id: HANDOFF-v0.4.0-deploy
version: 0.4.0
date: 2026-06-19
project: AAR-TC Aframe Connector
---

# Cursor Handoff — `package.json` + Commit & Deploy — v0.4.0

Apply after `HANDOFF-v0.4.0-aframe-js.md` and `HANDOFF-v0.4.0-index-js.md` are complete.

---

## Change 1 — Bump package.json version

**Find:**

```json
"version": "0.3.0"
```

**Replace with:**

```json
"version": "0.4.0"
```

---

## Change 2 — Commit and push

```bash
git add -A
git commit -m "v0.4.0 — Cluster C tools + bug fixes (search_contacts category param, update_transaction_participant JSON Patch)"
git push origin main
```

---

## Post-deploy checklist

1. **Verify Railway deploy** — hit the health URL and confirm `"version": "0.4.0"` in the JSON response. Railway deploys in ~30–60 seconds after push.
2. **Reconnect the Claude.ai connector** — tool list has changed, so a reconnect is required per `CONNECTOR-REF-001` § 6.1:
   - Settings → Connectors → remove `aframe-connector`
   - Re-add with URL: `https://aframe-mcp-connector-production.up.railway.app/mcp`
3. **Run test sequence** against transaction 551669 (POC):

| Tool | Test |
|---|---|
| `list_custom_fields` | Call with no args — confirm field list returns |
| `list_custom_fields_tree` | Call with no args — confirm tree structure returns |
| `get_transaction_field_tree` | Call with `xactionId: 551669` — confirm field values visible |
| `search_transactions` | Search by address "1 POC Lane" — confirm transaction 551669 returns |
| `list_task_templates` | Call with `taskTemplateType: XACTION` — confirm templates return with IDs |
| `apply_task_templates` | Apply a template to 551669 using ID from above — confirm tasks created |
| `list_contact_categories` | Call with no args — confirm category list returns |
| `list_transaction_statuses` | Call with no args — confirm status list returns |
| `update_transaction_participant` (bug fix) | Toggle `buyerSellerVisible` on a participant — confirm no 400 error |

Note: `search_contacts` categories fix was already applied in v0.3.0 — no separate test needed unless you want to confirm.

---

*No other changes.*

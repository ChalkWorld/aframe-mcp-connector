---
title: Cursor Handoff — CONNECTOR_TOOL_ROADMAP.md — 2026-07-13
document_id: HANDOFF-2026-07-13-roadmap
date: 2026-07-13
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to `docs/connector/CONNECTOR_TOOL_ROADMAP.md`. Do not modify anything not listed here.

## Change 1 — Bump frontmatter version and version_date

**Find**
```
document_id: CONNECTOR-ROAD-001
version: 3.0
version_date: 2026-06-24
status: Active — Living Document
```

**Replace with**
```
document_id: CONNECTOR-ROAD-001
version: 3.1
version_date: 2026-07-13
status: Active — Living Document
```

Do not commit yet. Changes for additional files follow in separate handoffs.

## Change 2 — Log the addition in Version History

Adds a v3.1 row documenting the new Batch / Bulk Operations scope.

**Find**
```
| 3.0 | 2026-06-24 | Andrew Rich / Claude | Full rewrite to ground truth. Tier 1 updated to reflect all 34 tools shipped across v0.1.0–v0.5.0. Tier 2 cleared of all built items. Task tools gate lifted per Session 007 — `search_tasks`, `get_task`, `update_task`, `create_task` are now ungated Tier 2. Transaction Attachment tools (7) promoted from Tier 4 to Tier 1 on v0.5.0 build. |

---

## Tier 1 — Built
```

**Replace with**
```
| 3.0 | 2026-06-24 | Andrew Rich / Claude | Full rewrite to ground truth. Tier 1 updated to reflect all 34 tools shipped across v0.1.0–v0.5.0. Tier 2 cleared of all built items. Task tools gate lifted per Session 007 — `search_tasks`, `get_task`, `update_task`, `create_task` are now ungated Tier 2. Transaction Attachment tools (7) promoted from Tier 4 to Tier 1 on v0.5.0 build. |
| 3.1 | 2026-07-13 | Andrew Rich / Claude | Added Batch / Bulk Operations scope to Tier 2 — `bulk_update_custom_fields`, `bulk_create_contacts`, `bulk_add_transaction_participants`. Motivated by a live buyer-side intake session (7301 Karissa Farm Dr) that used ~25 individual write calls to build one file. Design and implementation deferred to a dedicated build session. |

---

## Tier 1 — Built
```

Do not commit yet. Changes for additional files follow in separate handoffs.

## Change 3 — Add the Batch / Bulk Operations subsection to Tier 2

Inserts the new subsection immediately after the existing Task Management table, before the Tier 3 divider.

**Find**
```
| `search_tasks` | `POST /v1/tasks/search` | Find tasks on a transaction by status, type, or assignee |
| `get_task` | `GET /v1/tasks/{taskId}` | Inspect a specific task |
| `update_task` | `PATCH /v1/tasks/{taskId}` | Mark complete, change due date, omit conditionally, reassign |
| `create_task` | `POST /v1/tasks` | One-off task creation outside of template application |

---

## Tier 3 — Planned
```

**Replace with**
```
| `search_tasks` | `POST /v1/tasks/search` | Find tasks on a transaction by status, type, or assignee |
| `get_task` | `GET /v1/tasks/{taskId}` | Inspect a specific task |
| `update_task` | `PATCH /v1/tasks/{taskId}` | Mark complete, change due date, omit conditionally, reassign |
| `create_task` | `POST /v1/tasks` | One-off task creation outside of template application |

### Batch / Bulk Operations

Added 2026-07-13, following a live buyer-side intake session that used ~25 individual write calls to build one file (7301 Karissa Farm Dr). Each bulk tool loops the existing single-entity function server-side and returns one aggregated result — Aframe still receives one HTTP call per entity (no batch endpoint exists on their side), but the loop moves below the LLM boundary instead of costing a tool-call round trip per entity. Partial-failure tolerance follows the same pattern already proven in `apply_task_templates`: a bad entry is skipped and reported, the whole batch only fails if every entry fails.

Design and implementation deferred to a dedicated session — see `SESSION-HANDOFF-2026-07-13-batch-tools.md`.

| Tool | Wraps | Notes |
|---|---|---|
| `bulk_update_custom_fields` | Loops `update_custom_field` | Input: array of `{mergeFieldCode, value}`. Highest-frequency case — 14 calls collapsed to 1 in the Karissa Farm session. |
| `bulk_create_contacts` | Loops `create_contact` | Input: array of contact objects (same shape as `create_contact` params). |
| `bulk_add_transaction_participants` | Loops `add_transaction_participant` | Input: array of participant objects (`xactionParticipantRoleId` + either `linkedContactId` or inline contact fields). Most logic of the three — each entry independently resolves to a linked or inline contact. |

Deliberately three composable tools, not one `create_full_file` mega-tool — per the same "one file per handoff, isolated and re-runnable" principle this project already applies to Cursor handoffs (`CURSOR-HANDOFF-PROTOCOL-001`). A partial failure in one bulk call (e.g. one bad merge field code) stays isolated and debuggable rather than buried in one opaque multi-resource blob.

---

## Tier 3 — Planned
```

No other changes to `CONNECTOR_TOOL_ROADMAP.md`.

```bash
git add -A
git commit -m "docs(roadmap): add Batch/Bulk Operations to Tier 2 (v3.1)"
git push origin main
```

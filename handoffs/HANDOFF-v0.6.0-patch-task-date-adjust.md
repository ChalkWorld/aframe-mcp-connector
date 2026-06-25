---
title: Cursor Handoff — index.js — task date-adjustment fields + version fix
document_id: HANDOFF-v0.6.0-patch-task-date-adjust
date: 2026-06-25
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to `src/index.js`. Do not modify anything not listed here.

---

## Change 1 — Add date-adjustment parameters to `create_task`

**Find:**

```js
    milestone: z
      .boolean()
      .optional()
      .describe("Whether the task is a milestone"),
  },
  async ({ appUserId, subject, xactionId, contactId, note, taskType, status, dueDate, dueTime, reminderSet, reminderDate, reminderTime, folderId, newFolderName, agentVisible, buyerSellerVisible, color, milestone }) => {
```

**Replace with:**

```js
    milestone: z
      .boolean()
      .optional()
      .describe("Whether the task is a milestone"),
    dueDateAdjustActive: z
      .boolean()
      .optional()
      .describe("Whether auto-adjusting due date is enabled"),
    dueDateAdjustType: z
      .enum([
        "TEMPLATE_START_DATE",
        "PARENT_TASK",
        "XACTION_LIST_DATE",
        "XACTION_ON_MARKET_DATE",
        "XACTION_EXPIRE_DATE",
        "XACTION_EFFECTIVE_DATE",
        "EVENT_MERGE_FIELD_CODE",
      ])
      .optional()
      .describe("Due date adjustment type — determines what the due date is anchored to"),
    dueDateAdjustRefTaskIdParent: z
      .number()
      .int()
      .optional()
      .describe("ID of the parent Task for due date adjustment (used with dueDateAdjustType PARENT_TASK)"),
    dueDateAdjustRefTaskParentContingent: z
      .boolean()
      .optional()
      .describe("Whether this task is hidden until the parent task is complete"),
    dateAdjustReferenceCode: z
      .string()
      .max(255)
      .optional()
      .describe("Merge field code for date adjustment (used with dueDateAdjustType EVENT_MERGE_FIELD_CODE, e.g. 'd_ClosingDate')"),
    dueDateAdjustDelta: z
      .number()
      .int()
      .optional()
      .describe("Number of days to offset the due date from the reference point (negative = before, positive = after)"),
    dueDateAdjustReminderDelta: z
      .number()
      .int()
      .optional()
      .describe("Number of days to offset the reminder date from the reference point"),
    dueDateAdjustmentRulesId: z
      .number()
      .int()
      .optional()
      .describe("ID of the date adjustment rules (date calculator). Use 6369 for Calendar Days."),
  },
  async ({ appUserId, subject, xactionId, contactId, note, taskType, status, dueDate, dueTime, reminderSet, reminderDate, reminderTime, folderId, newFolderName, agentVisible, buyerSellerVisible, color, milestone, dueDateAdjustActive, dueDateAdjustType, dueDateAdjustRefTaskIdParent, dueDateAdjustRefTaskParentContingent, dateAdjustReferenceCode, dueDateAdjustDelta, dueDateAdjustReminderDelta, dueDateAdjustmentRulesId }) => {
```

## Change 2 — Include date-adjustment fields in the `create_task` params object

**Find:**

```js
      ...(milestone !== undefined && { milestone }),
    };
    const result = await createTask(params);
```

**Replace with:**

```js
      ...(milestone !== undefined && { milestone }),
      ...(dueDateAdjustActive !== undefined && { dueDateAdjustActive }),
      ...(dueDateAdjustType !== undefined && { dueDateAdjustType }),
      ...(dueDateAdjustRefTaskIdParent !== undefined && { dueDateAdjustRefTaskIdParent }),
      ...(dueDateAdjustRefTaskParentContingent !== undefined && { dueDateAdjustRefTaskParentContingent }),
      ...(dateAdjustReferenceCode !== undefined && { dateAdjustReferenceCode }),
      ...(dueDateAdjustDelta !== undefined && { dueDateAdjustDelta }),
      ...(dueDateAdjustReminderDelta !== undefined && { dueDateAdjustReminderDelta }),
      ...(dueDateAdjustmentRulesId !== undefined && { dueDateAdjustmentRulesId }),
    };
    const result = await createTask(params);
```

## Change 3 — Add date-adjustment parameters to `update_task`

**Find:**

```js
    newFolderName: z
      .string()
      .max(255)
      .optional()
      .describe("Create a new folder with this name and assign the task to it (mutually exclusive with folderId)"),
  },
  async ({ taskId, ...changes }) => {
    const result = await updateTask(taskId, changes);
```

**Replace with:**

```js
    newFolderName: z
      .string()
      .max(255)
      .optional()
      .describe("Create a new folder with this name and assign the task to it (mutually exclusive with folderId)"),
    dueDateAdjustActive: z
      .boolean()
      .optional()
      .describe("Whether auto-adjusting due date is enabled"),
    dueDateAdjustType: z
      .enum([
        "TEMPLATE_START_DATE",
        "PARENT_TASK",
        "XACTION_LIST_DATE",
        "XACTION_ON_MARKET_DATE",
        "XACTION_EXPIRE_DATE",
        "XACTION_EFFECTIVE_DATE",
        "EVENT_MERGE_FIELD_CODE",
      ])
      .optional()
      .describe("Due date adjustment type — determines what the due date is anchored to"),
    dueDateAdjustRefTaskIdParent: z
      .number()
      .int()
      .optional()
      .describe("ID of the parent Task for due date adjustment (used with dueDateAdjustType PARENT_TASK)"),
    dueDateAdjustRefTaskParentContingent: z
      .boolean()
      .optional()
      .describe("Whether this task is hidden until the parent task is complete"),
    dateAdjustReferenceCode: z
      .string()
      .max(255)
      .optional()
      .describe("Merge field code for date adjustment (used with dueDateAdjustType EVENT_MERGE_FIELD_CODE, e.g. 'd_ClosingDate')"),
    dueDateAdjustDelta: z
      .number()
      .int()
      .optional()
      .describe("Number of days to offset the due date from the reference point (negative = before, positive = after)"),
    dueDateAdjustReminderDelta: z
      .number()
      .int()
      .optional()
      .describe("Number of days to offset the reminder date from the reference point"),
    dueDateAdjustmentRulesId: z
      .number()
      .int()
      .optional()
      .describe("ID of the date adjustment rules (date calculator). Use 6369 for Calendar Days."),
  },
  async ({ taskId, ...changes }) => {
    const result = await updateTask(taskId, changes);
```

## Change 4 — Fix version strings (missed in v0.6.0 build)

**Find:**

```js
    version: "0.5.0",
```

**Replace with:**

```js
    version: "0.6.0",
```

**Find:**

```js
  console.log(`Aframe MCP connector v0.5.0 listening on port ${PORT}`);
```

**Replace with:**

```js
  console.log(`Aframe MCP connector v0.6.0 listening on port ${PORT}`);
```

---

```bash
git add -A && git commit -m "v0.6.0 — add date-adjustment fields to create_task and update_task; fix version strings" && git push origin main
```

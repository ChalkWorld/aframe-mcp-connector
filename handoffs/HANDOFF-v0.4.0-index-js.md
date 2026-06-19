---
title: Cursor Handoff — src/index.js — v0.4.0
document_id: HANDOFF-v0.4.0-index-js
version: 0.4.0
date: 2026-06-19
project: AAR-TC Aframe Connector
---

# Cursor Handoff — `src/index.js` — v0.4.0

Apply the changes below **surgically**. Do not modify anything not listed here.

---

## Change 1 — Add 8 new imports

In the existing import block from `"./aframe.js"`, add the 8 new function names. The full updated import list should be:

```js
import {
  createTransaction,
  createTransactionNote,
  getTransaction,
  updateTransaction,
  updateCustomField,
  searchContacts,
  getContact,
  createContact,
  updateContact,
  listParticipantRoles,
  listTransactionParticipants,
  addTransactionParticipant,
  getTransactionParticipant,
  updateTransactionParticipant,
  removeTransactionParticipant,
  setParticipantLinkedContact,
  unlinkParticipantContact,
  updateParticipantLinkedContact,
  updateParticipantContactInfo,
  listCustomFields,
  listCustomFieldsTree,
  getTransactionFieldTree,
  searchTransactions,
  listTaskTemplates,
  applyTaskTemplates,
  listContactCategories,
  listTransactionStatuses,
} from "./aframe.js";
```

---

## Change 2 — Bump McpServer version

**Find:**

```js
const server = new McpServer({
  name: "aframe-connector",
  version: "0.3.0",
});
```

**Replace with:**

```js
const server = new McpServer({
  name: "aframe-connector",
  version: "0.4.0",
});
```

---

## Change 3 — Verify search_contacts categories fix (no-op if already correct)

In the `search_contacts` tool handler, confirm the body construction reads:

```js
...(categories !== undefined && { categories }),
```

If it already reads that way, no change is needed. If it reads `{ category }` or `{ category: categories }`, fix it to `{ categories }`.

---

## Change 4 — Add 8 new tool definitions

Add the following tool definitions immediately **before** the `// Express HTTP server` section comment. These are tools 20–27.

```js
// Tool 20: list_custom_fields
server.tool(
  "list_custom_fields",
  "List all custom Field definitions for the Team as a flat, alphabetically-sorted list. Returns each field's ID, merge field code, label, type, field group, and choice options (for CHOICE-type fields). Use this to discover available merge field codes for use with update_custom_field.",
  {},
  async () => {
    const result = await listCustomFields();
    return formatResult("Custom field definitions:", result);
  }
);

// Tool 21: list_custom_fields_tree
server.tool(
  "list_custom_fields_tree",
  "List all custom Field definitions for the Team grouped as Field Collections > Field Groups > Fields — preserving the structure the user sees on the Transaction page. Use this when you need to understand field organization, not just field codes.",
  {},
  async () => {
    const result = await listCustomFieldsTree();
    return formatResult("Custom field tree:", result);
  }
);

// Tool 22: get_transaction_field_tree
server.tool(
  "get_transaction_field_tree",
  "Get the full custom Field tree for a Transaction, with each field's current value on that Transaction merged in. Returns Field Collections > Field Groups > Fields, with the xactionField value object (value, color, omitted, required, agentVisible, buyerSellerVisible) nested alongside each field definition. Fields with no value on the transaction are included with an empty string value.",
  {
    xactionId: z.number().int().describe("The transaction ID"),
  },
  async ({ xactionId }) => {
    const result = await getTransactionFieldTree(xactionId);
    return formatResult(`Field tree for transaction ${xactionId}:`, result);
  }
);

// Tool 23: search_transactions
server.tool(
  "search_transactions",
  "Search for Transactions using flexible criteria: address, stage, date ranges, or specific IDs. Pagination is 0-based; default page size is 20, max is 100. Optionally eager-load related data by passing includes: PARTICIPANTS, EVENTS, and/or ATTACHMENTS. All search criteria are optional — omitting searchCriteria returns all transactions (paginated).",
  {
    xactionId: z
      .number()
      .int()
      .optional()
      .describe("Filter by a single transaction ID"),
    xactionIds: z
      .array(z.number().int())
      .optional()
      .describe("Filter by multiple transaction IDs (max 100)"),
    xactionStages: z
      .array(
        z.enum([
          "PRE_ACTIVE",
          "ACTIVE",
          "UNDER_CONTRACT",
          "SOLD",
          "NOT_SOLD",
          "NOT_ACTIVE",
        ])
      )
      .optional()
      .describe("Filter by one or more transaction stages"),
    searchAddress: z
      .string()
      .optional()
      .describe(
        "General address search across street number, direction, street name, and unit"
      ),
    propNum: z.string().optional().describe("Filter by street number"),
    propStreetDir: z.string().optional().describe("Filter by street direction"),
    propStreet: z.string().optional().describe("Filter by street name"),
    propStreetUnit: z.string().optional().describe("Filter by unit number"),
    city: z.string().optional().describe("Filter by city"),
    state: z.string().optional().describe("Filter by state abbreviation"),
    zip: z.string().optional().describe("Filter by zip code"),
    includes: z
      .array(z.enum(["PARTICIPANTS", "EVENTS", "ATTACHMENTS"]))
      .optional()
      .describe(
        "Eager-load related data: PARTICIPANTS, EVENTS, and/or ATTACHMENTS"
      ),
    page: z
      .number()
      .int()
      .min(0)
      .optional()
      .default(0)
      .describe("Page number, 0-based (default 0)"),
    pageSize: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .default(20)
      .describe("Page size, max 100 (default 20)"),
  },
  async ({
    xactionId,
    xactionIds,
    xactionStages,
    searchAddress,
    propNum,
    propStreetDir,
    propStreet,
    propStreetUnit,
    city,
    state,
    zip,
    includes,
    page,
    pageSize,
  }) => {
    const searchCriteria = {
      ...(xactionId !== undefined && { xactionId }),
      ...(xactionIds !== undefined && { xactionIds }),
      ...(xactionStages !== undefined && { xactionStages }),
      ...(searchAddress !== undefined && { searchAddress }),
      ...(propNum !== undefined && { propNum }),
      ...(propStreetDir !== undefined && { propStreetDir }),
      ...(propStreet !== undefined && { propStreet }),
      ...(propStreetUnit !== undefined && { propStreetUnit }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(zip !== undefined && { zip }),
    };
    const body = {
      searchCriteria,
      ...(includes !== undefined && { includes }),
      page: page ?? 0,
      pageSize: pageSize ?? 20,
    };
    const result = await searchTransactions(body);
    return formatResult("Transaction search results:", result);
  }
);

// Tool 24: list_task_templates
server.tool(
  "list_task_templates",
  "List all Task Templates defined for the Team. Optionally filter by taskTemplateType to return only CONTACT or XACTION templates. Returns each template's ID, name, description, type, and the folder name it creates when applied. Call this to discover template IDs before calling apply_task_templates.",
  {
    taskTemplateType: z
      .enum(["CONTACT", "XACTION"])
      .optional()
      .describe(
        "Filter to CONTACT or XACTION templates. Omit to return all templates."
      ),
  },
  async ({ taskTemplateType }) => {
    const result = await listTaskTemplates({ taskTemplateType });
    return formatResult("Task templates:", result);
  }
);

// Tool 25: apply_task_templates
server.tool(
  "apply_task_templates",
  "Apply one or more Task Templates to a Transaction, converting each template's entries into Tasks on the Transaction. Invalid template IDs are skipped with warnings; the request fails only if ALL supplied IDs are invalid. Use list_task_templates to discover template IDs. Optionally supply startDate (YYYY-MM-DD) to control due date calculation; defaults to today.",
  {
    xactionId: z.number().int().describe("The transaction ID to apply templates to"),
    taskTemplateIds: z
      .array(z.number().int())
      .describe("Array of Task Template IDs to apply"),
    startDate: z
      .string()
      .optional()
      .describe(
        "Start date for due date calculation, YYYY-MM-DD. Defaults to today if omitted."
      ),
  },
  async ({ xactionId, taskTemplateIds, startDate }) => {
    const result = await applyTaskTemplates(xactionId, { taskTemplateIds, startDate });
    return formatResult(
      `Task templates applied to transaction ${xactionId}.`,
      result
    );
  }
);

// Tool 26: list_contact_categories
server.tool(
  "list_contact_categories",
  "List all Contact Category tags defined on the Team (e.g. 'Sphere of Influence', 'Builder', 'COI'). Returns each category's ID and name. Use this to discover valid category names for use with search_contacts or create_contact.",
  {},
  async () => {
    const result = await listContactCategories();
    return formatResult("Contact categories:", result);
  }
);

// Tool 27: list_transaction_statuses
server.tool(
  "list_transaction_statuses",
  "List all Transaction Statuses defined for the Team. Optionally filter by one or more xactionStages (PRE_ACTIVE, ACTIVE, UNDER_CONTRACT, SOLD, NOT_SOLD, NOT_ACTIVE). Returns each status's ID, name, stage, color, system type, and visibility settings. Use this to discover valid xactionStatusId values for update_transaction.",
  {
    xactionStages: z
      .array(
        z.enum([
          "PRE_ACTIVE",
          "ACTIVE",
          "UNDER_CONTRACT",
          "SOLD",
          "NOT_SOLD",
          "NOT_ACTIVE",
        ])
      )
      .optional()
      .describe(
        "Filter to statuses belonging to the specified stage(s). Omit to return all statuses."
      ),
  },
  async ({ xactionStages }) => {
    const result = await listTransactionStatuses({ xactionStages });
    return formatResult("Transaction statuses:", result);
  }
);
```

---

## Change 5 — Update the health endpoint version

**Find:**

```js
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "aframe-mcp-connector",
    version: "0.3.0",
  });
});
```

**Replace with:**

```js
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "aframe-mcp-connector",
    version: "0.4.0",
  });
});
```

---

## Change 6 — Update the startup log

**Find:**

```js
  console.log(`Aframe MCP connector v0.3.0 listening on port ${PORT}`);
  console.log(`  Health check: GET  /`);
  console.log(`  MCP endpoint: POST /mcp`);
  console.log(`  Tools: create_transaction, get_transaction, update_transaction,`);
  console.log(`         update_custom_field, add_transaction_note,`);
  console.log(`         search_contacts, get_contact, create_contact, update_contact,`);
  console.log(`         list_participant_roles, list_transaction_participants,`);
  console.log(`         add_transaction_participant, get_transaction_participant,`);
  console.log(`         update_transaction_participant, remove_transaction_participant,`);
  console.log(`         set_participant_linked_contact, unlink_participant_contact,`);
  console.log(`         update_participant_linked_contact, update_participant_contact_info`);
```

**Replace with:**

```js
  console.log(`Aframe MCP connector v0.4.0 listening on port ${PORT}`);
  console.log(`  Health check: GET  /`);
  console.log(`  MCP endpoint: POST /mcp`);
  console.log(`  Tools: create_transaction, get_transaction, update_transaction,`);
  console.log(`         update_custom_field, add_transaction_note,`);
  console.log(`         search_contacts, get_contact, create_contact, update_contact,`);
  console.log(`         list_participant_roles, list_transaction_participants,`);
  console.log(`         add_transaction_participant, get_transaction_participant,`);
  console.log(`         update_transaction_participant, remove_transaction_participant,`);
  console.log(`         set_participant_linked_contact, unlink_participant_contact,`);
  console.log(`         update_participant_linked_contact, update_participant_contact_info,`);
  console.log(`         list_custom_fields, list_custom_fields_tree, get_transaction_field_tree,`);
  console.log(`         search_transactions, list_task_templates, apply_task_templates,`);
  console.log(`         list_contact_categories, list_transaction_statuses`);
```

---

*No other changes to `src/index.js`.*

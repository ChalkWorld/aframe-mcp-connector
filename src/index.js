import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import {
  createTransaction,
  createTransactionNote,
  getTransaction,
  updateTransaction,
  updateCustomField,
} from "./aframe.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Format an Aframe response ({ payload, warnings }) into a readable MCP tool
// result. Any warnings from the API (validation notices on 2xx responses) are
// surfaced at the top so the caller sees them without losing the payload.
function formatResult(header, { payload, warnings }) {
  const lines = [header];
  if (warnings && Object.keys(warnings).length > 0) {
    lines.push("");
    lines.push(`API notes: ${JSON.stringify(warnings)}`);
  }
  lines.push("");
  lines.push(JSON.stringify(payload, null, 2));
  return {
    content: [{ type: "text", text: lines.join("\n") }],
  };
}

// ---------------------------------------------------------------------------
// MCP server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "aframe-connector",
  version: "0.2.0",
});

// Tool 1: create_transaction
server.tool(
  "create_transaction",
  "Create a new transaction in Aframe. A full property address is required (street number, street, city, state, zip); all other fields use the Team defaults if omitted. Returns the created transaction object including the new xactionId.",
  {
    xactionSide: z
      .enum(["BUYER", "SELLER", "DUAL"])
      .describe("Which side of the deal — BUYER, SELLER, or DUAL"),
    propNum: z.string().describe("Street number, e.g. '1600'"),
    propStreet: z.string().describe("Street name, e.g. 'Pennsylvania Ave NW'"),
    city: z.string().describe("City"),
    state: z.string().length(2).describe("Two-letter state code, e.g. 'VA'"),
    zip: z.string().describe("ZIP code"),
    contractPrice: z
      .string()
      .optional()
      .describe("Contract price, formatted, e.g. '$500,000'"),
    effectiveDate: z
      .string()
      .optional()
      .describe("Effective date in YYYY-MM-DD format"),
    closingDate: z
      .string()
      .optional()
      .describe("Closing date in YYYY-MM-DD format"),
    note: z
      .string()
      .optional()
      .describe("Optional initial intake note for the transaction"),
  },
  async (params) => {
    const result = await createTransaction(params);
    return formatResult("Transaction created successfully.", result);
  }
);

// Tool 2: get_transaction
server.tool(
  "get_transaction",
  "Retrieve an existing Aframe transaction by ID. Returns the full transaction object including address, status, dates, participants, custom field values (xactionFieldData — a flat map keyed by merge field code such as 'f_EarnestMoney'), and assigned agents/assistants.",
  {
    xactionId: z.number().int().describe("The transaction ID to fetch"),
  },
  async ({ xactionId }) => {
    const result = await getTransaction(xactionId);
    return formatResult(`Transaction ${xactionId}:`, result);
  }
);

// Tool 3: update_transaction
server.tool(
  "update_transaction",
  "Update fields on an existing Aframe transaction (partial update). Include only the fields you want to change — everything else is left untouched. Uses JSON Patch (RFC 6902) internally, but you don't need to construct patch operations; just pass the field values directly. For custom/merge fields, use update_custom_field instead.",
  {
    xactionId: z.number().int().describe("The transaction ID to update"),
    xactionStatusId: z
      .number()
      .int()
      .optional()
      .describe("ID of the XactionStatus to assign"),
    propNum: z.string().optional().describe("Street number"),
    propStreetDir: z
      .string()
      .optional()
      .describe("Street direction (N, S, E, W, etc.)"),
    propStreet: z.string().optional().describe("Street name"),
    propStreetUnit: z
      .string()
      .optional()
      .describe("Unit number, e.g. 'Apt 4B'"),
    city: z.string().optional(),
    state: z.string().length(2).optional().describe("Two-letter state code"),
    zip: z.string().optional(),
    timeZone: z.string().optional().describe("Time zone for the transaction"),
    xactionSide: z.enum(["BUYER", "SELLER", "DUAL"]).optional(),
    listPrice: z
      .number()
      .optional()
      .describe("Listing price as a number (e.g. 500000), not a formatted string"),
    contractPrice: z
      .number()
      .optional()
      .describe("Contract price as a number, not a formatted string"),
    listDate: z.string().optional().describe("YYYY-MM-DD"),
    onMarketDate: z.string().optional().describe("YYYY-MM-DD"),
    expireDate: z.string().optional().describe("YYYY-MM-DD"),
    effectiveDate: z.string().optional().describe("YYYY-MM-DD"),
    closingDate: z.string().optional().describe("YYYY-MM-DD"),
    closedDate: z.string().optional().describe("YYYY-MM-DD"),
    percentageCommission: z
      .number()
      .optional()
      .describe("Decimal commission, e.g. 0.03 for 3%"),
    payoutEstimated: z.number().optional(),
    payoutActual: z.number().optional(),
  },
  async ({ xactionId, ...changes }) => {
    const result = await updateTransaction(xactionId, changes);
    return formatResult(`Transaction ${xactionId} updated.`, result);
  }
);

// Tool 4: update_custom_field
server.tool(
  "update_custom_field",
  "Update a custom/merge field on an Aframe transaction by its Merge Field Code (e.g. 'f_EarnestMoney'). If the field has no value on the transaction yet, one is created automatically. The 'value' is always passed as a string regardless of underlying field type (date, number, currency, text) — Aframe handles type coercion server-side.",
  {
    xactionId: z.number().int().describe("The transaction ID"),
    mergeFieldCode: z
      .string()
      .describe("Merge Field Code of the field to update, e.g. 'f_EarnestMoney'"),
    value: z
      .string()
      .optional()
      .describe("New value for the field, as a string"),
    color: z
      .enum([
        "NONE",
        "RED",
        "TANGERINE",
        "TAUPE",
        "YELLOW",
        "LIME",
        "GREEN",
        "CYAN",
        "TEAL",
        "COBALT",
        "PURPLE",
        "MAGENTA",
      ])
      .optional()
      .describe("Display color label for the field"),
    omitted: z
      .boolean()
      .optional()
      .describe("Omit the field from display on the transaction"),
    required: z.boolean().optional().describe("Mark the field as required"),
    agentVisible: z
      .boolean()
      .optional()
      .describe("Whether the field is visible to agents"),
    buyerSellerVisible: z
      .boolean()
      .optional()
      .describe("Whether the field is visible to buyers/sellers"),
  },
  async ({ xactionId, mergeFieldCode, ...changes }) => {
    const result = await updateCustomField(xactionId, mergeFieldCode, changes);
    return formatResult(
      `Custom field '${mergeFieldCode}' updated on transaction ${xactionId}.`,
      result
    );
  }
);

// Tool 5: add_transaction_note
server.tool(
  "add_transaction_note",
  "Add a note (XactionActivity) to an existing Aframe transaction. The note field supports HTML formatting (e.g. <strong>text</strong>, <br>).",
  {
    xactionId: z
      .number()
      .int()
      .describe("The transaction ID, typically returned from create_transaction"),
    note: z
      .string()
      .describe("Note content. HTML formatting is supported."),
  },
  async ({ xactionId, note }) => {
    const result = await createTransactionNote({ xactionId, note });
    return formatResult(`Note added to transaction ${xactionId}.`, result);
  }
);

// ---------------------------------------------------------------------------
// Express HTTP server
// ---------------------------------------------------------------------------

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "aframe-mcp-connector",
    version: "0.2.0",
  });
});

app.post("/mcp", async (req, res) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on("close", () => {
      transport.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("MCP request error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Aframe MCP connector v0.2.0 listening on port ${PORT}`);
  console.log(`  Health check: GET  /`);
  console.log(`  MCP endpoint: POST /mcp`);
  console.log(`  Tools: create_transaction, get_transaction, update_transaction,`);
  console.log(`         update_custom_field, add_transaction_note`);
});

import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { createTransaction, createTransactionNote } from "./aframe.js";

// ---------------------------------------------------------------------------
// MCP server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "aframe-connector",
  version: "0.1.0",
});

// Tool 1: create_transaction
server.tool(
  "create_transaction",
  "Create a new transaction in Aframe. A full property address is required (street number, street, city, state, zip); all other fields use the Team defaults if omitted. Returns the created transaction object including the new xactionId, which can be passed to add_transaction_note.",
  {
    xactionSide: z
      .enum(["BUYER", "SELLER"])
      .describe("Which side of the deal — BUYER or SELLER"),
    propNum: z.string().describe("Street number, e.g. '1600'"),
    propStreet: z
      .string()
      .describe("Street name, e.g. 'Pennsylvania Ave NW'"),
    city: z.string().describe("City"),
    state: z
      .string()
      .length(2)
      .describe("Two-letter state code, e.g. 'VA'"),
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
    return {
      content: [
        {
          type: "text",
          text:
            "Transaction created successfully.\n\n" +
            JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// Tool 2: add_transaction_note
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
    return {
      content: [
        {
          type: "text",
          text:
            `Note added to transaction ${xactionId}.\n\n` +
            JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Express HTTP server
// ---------------------------------------------------------------------------

const app = express();
app.use(express.json());

// Health check — useful for confirming the Railway deployment is up before
// pointing Claude at it.
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "aframe-mcp-connector",
    version: "0.1.0",
  });
});

// MCP endpoint — Streamable HTTP transport, stateless mode (new transport per
// request). Stateless is fine for a POC; if we later need server-initiated
// notifications or resumability, switch to a session-based setup.
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
  console.log(`Aframe MCP connector listening on port ${PORT}`);
  console.log(`  Health check: GET  /`);
  console.log(`  MCP endpoint: POST /mcp`);
});

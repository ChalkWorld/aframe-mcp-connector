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
  createTransactionAttachment,
  getTransactionAttachment,
  listTransactionAttachments,
  updateTransactionAttachment,
  uploadTransactionAttachmentFile,
  unassignTransactionAttachmentFile,
  assignTransactionAttachmentFile,
  searchTasks,
  getTask,
  updateTask,
  createTask,
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
  version: "0.5.0",
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

// Tool 6: search_contacts
server.tool(
  "search_contacts",
  "Search for Contacts in Aframe by name, email, company, or category. Returns a paged list of matching contact summaries. Use this before create_contact to check whether a contact already exists. Pagination is 0-based; default page size is 20, max is 100.",
  {
    firstName: z
      .string()
      .optional()
      .describe("Filter by first name ('starts with' matching)"),
    lastName: z
      .string()
      .optional()
      .describe("Filter by last name ('starts with' matching)"),
    company: z
      .string()
      .optional()
      .describe("Filter by company name ('starts with' matching)"),
    email: z
      .string()
      .optional()
      .describe("Filter by email address (exact matching)"),
    categories: z
      .string()
      .optional()
      .describe(
        "Comma-separated category filter. Prefix a token with '-' to exclude it. Example: 'Builder, COI, -Investor'"
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
  async ({ firstName, lastName, company, email, categories, page, pageSize }) => {
    const body = {
      contactSearchCriteriaDto: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(company !== undefined && { company }),
        ...(email !== undefined && { email }),
        ...(categories !== undefined && { categories }),
      },
      page: page ?? 0,
      pageSize: pageSize ?? 20,
    };
    const result = await searchContacts(body);
    return formatResult("Contact search results:", result);
  }
);

// Tool 7: get_contact
server.tool(
  "get_contact",
  "Retrieve a single Contact from Aframe by ID. Returns the full contact record including all phones, emails, addresses, categories, and alt-contact fields.",
  {
    contactId: z.number().int().describe("The ID of the Contact to retrieve"),
  },
  async ({ contactId }) => {
    const result = await getContact(contactId);
    return formatResult(`Contact ${contactId}:`, result);
  }
);

// Tool 8: create_contact
server.tool(
  "create_contact",
  "Create a new Contact in Aframe. A contact must have either firstName + lastName, or company — at least one is required. Salutations are auto-generated by Aframe if not supplied. Search for an existing contact first using search_contacts before creating a new one.",
  {
    firstName: z
      .string()
      .optional()
      .describe("First name. Required with lastName if company is not provided."),
    lastName: z
      .string()
      .optional()
      .describe("Last name. Required with firstName if company is not provided."),
    company: z
      .string()
      .optional()
      .describe("Company name. Required if firstName/lastName are not provided."),
    teamName: z.string().optional().describe("Team name"),
    title: z.string().optional().describe("Name title, e.g. 'Mr.'"),
    middleName: z.string().optional().describe("Middle name"),
    jobTitle: z.string().optional().describe("Job title"),
    email1: z.string().optional().describe("Primary email address"),
    email2: z.string().optional().describe("Email 2"),
    email3: z.string().optional().describe("Email 3"),
    phone1: z.string().optional().describe("Phone 1 number"),
    phone1Type: z
      .enum(["CELL", "HOME", "WORK", "COMPANY", "PAGER", "ASSISTANT", "FAX", "OTHER"])
      .optional()
      .describe("Phone 1 type"),
    phone1Desc: z.string().optional().describe("Phone 1 description / extension"),
    phone2: z.string().optional().describe("Phone 2 number"),
    phone2Type: z
      .enum(["CELL", "HOME", "WORK", "COMPANY", "PAGER", "ASSISTANT", "FAX", "OTHER"])
      .optional()
      .describe("Phone 2 type"),
    phone2Desc: z.string().optional().describe("Phone 2 description / extension"),
    altContactFirstName: z.string().optional().describe("Alt contact first name"),
    altContactLastName: z.string().optional().describe("Alt contact last name"),
    altContactEmail1: z.string().optional().describe("Alt contact primary email"),
    altContactPhone1: z.string().optional().describe("Alt contact phone 1"),
    altContactPhone1Type: z
      .enum(["CELL", "HOME", "WORK", "COMPANY", "PAGER", "ASSISTANT", "FAX", "OTHER"])
      .optional()
      .describe("Alt contact phone 1 type"),
    licenseNum: z.string().optional().describe("Contact license number"),
    brokerNum: z.string().optional().describe("Broker license number"),
    categories: z
      .array(z.string())
      .optional()
      .describe("Category names to associate with the contact (must already exist on the Team)"),
  },
  async (params) => {
    const result = await createContact(params);
    return formatResult("Contact created successfully.", result);
  }
);

// Tool 9: update_contact
server.tool(
  "update_contact",
  "Update fields on an existing Aframe Contact by ID. Include only the fields you want to change — everything else is left untouched. Uses JSON Patch internally. Common use: adding a missing phone number or email to a contact that was found via search_contacts.",
  {
    contactId: z.number().int().describe("The ID of the Contact to update"),
    firstName: z.string().optional().describe("First name"),
    lastName: z.string().optional().describe("Last name"),
    company: z.string().optional().describe("Company name"),
    teamName: z.string().optional().describe("Team name"),
    title: z.string().optional().describe("Name title, e.g. 'Mr.'"),
    middleName: z.string().optional().describe("Middle name"),
    jobTitle: z.string().optional().describe("Job title"),
    email1: z.string().optional().describe("Email 1 (primary)"),
    email2: z.string().optional().describe("Email 2"),
    email3: z.string().optional().describe("Email 3"),
    phone1: z.string().optional().describe("Phone 1 number"),
    phone1Type: z
      .enum(["CELL", "HOME", "WORK", "COMPANY", "PAGER", "ASSISTANT", "FAX", "OTHER"])
      .optional()
      .describe("Phone 1 type"),
    phone1Desc: z.string().optional().describe("Phone 1 description / extension"),
    phone2: z.string().optional().describe("Phone 2 number"),
    phone2Type: z
      .enum(["CELL", "HOME", "WORK", "COMPANY", "PAGER", "ASSISTANT", "FAX", "OTHER"])
      .optional()
      .describe("Phone 2 type"),
    phone2Desc: z.string().optional().describe("Phone 2 description / extension"),
    altContactFirstName: z.string().optional().describe("Alt contact first name"),
    altContactLastName: z.string().optional().describe("Alt contact last name"),
    altContactEmail1: z.string().optional().describe("Alt contact email 1 (primary)"),
    altContactPhone1: z.string().optional().describe("Alt contact phone 1"),
    altContactPhone1Type: z
      .enum(["CELL", "HOME", "WORK", "COMPANY", "PAGER", "ASSISTANT", "FAX", "OTHER"])
      .optional()
      .describe("Alt contact phone 1 type"),
    licenseNum: z.string().optional().describe("Contact license number"),
    brokerNum: z.string().optional().describe("Broker license number"),
  },
  async ({ contactId, ...changes }) => {
    const result = await updateContact(contactId, changes);
    return formatResult(`Contact ${contactId} updated.`, result);
  }
);

// Tool 10: list_participant_roles
server.tool(
  "list_participant_roles",
  "List all Transaction Participant Roles defined on the Team. Returns each role's ID, name, sort order, and merge field code prefix. Call this at the start of any intake session to discover the role IDs needed for add_transaction_participant (e.g. Buyer, Seller, Listing Agent, Lender, Closer).",
  {},
  async () => {
    const result = await listParticipantRoles();
    return formatResult("Transaction Participant Roles:", result);
  }
);

// Tool 11: list_transaction_participants
server.tool(
  "list_transaction_participants",
  "List all participants currently on a transaction. Returns each participant's role, contact info digest, linkedContactId, and visibility settings. Use this to see who is already on a transaction before adding or updating participants. Pagination is 0-based; default page size is 50.",
  {
    xactionId: z.number().int().describe("The transaction ID"),
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
      .default(50)
      .describe("Page size, max 100 (default 50)"),
  },
  async ({ xactionId, page, pageSize }) => {
    const result = await listTransactionParticipants(xactionId, { page, pageSize });
    return formatResult(`Participants on transaction ${xactionId}:`, result);
  }
);

// Tool 12: add_transaction_participant
server.tool(
  "add_transaction_participant",
  "Add a participant to a transaction with a specified role. Supply either linkedContactId (to link an existing Contact) or contactInfo fields (to create and link a new contact inline). If both are supplied, linkedContactId wins. Use list_participant_roles to get the correct xactionParticipantRoleId. Set onlySaveContactInTransaction=true for one-time participants who should not become a reusable Contact.",
  {
    xactionId: z.number().int().describe("The transaction ID"),
    xactionParticipantRoleId: z
      .number()
      .int()
      .describe("ID of the participant role to assign (from list_participant_roles)"),
    linkedContactId: z
      .number()
      .int()
      .optional()
      .describe("ID of an existing Contact to link. If provided, contactInfo fields are ignored."),
    // contactInfo fields — used when no linkedContactId is supplied
    firstName: z.string().optional().describe("Contact first name"),
    lastName: z.string().optional().describe("Contact last name"),
    company: z.string().optional().describe("Contact company name"),
    email1: z.string().optional().describe("Contact primary email"),
    phone1: z.string().optional().describe("Contact phone 1"),
    phone1Type: z
      .enum(["CELL", "HOME", "WORK", "COMPANY", "PAGER", "ASSISTANT", "FAX", "OTHER"])
      .optional()
      .describe("Contact phone 1 type"),
    phone2: z.string().optional().describe("Contact phone 2"),
    phone2Type: z
      .enum(["CELL", "HOME", "WORK", "COMPANY", "PAGER", "ASSISTANT", "FAX", "OTHER"])
      .optional()
      .describe("Contact phone 2 type"),
    altContactFirstName: z.string().optional().describe("Alt contact first name"),
    altContactLastName: z.string().optional().describe("Alt contact last name"),
    altContactEmail1: z.string().optional().describe("Alt contact primary email"),
    licenseNum: z.string().optional().describe("Contact license number"),
    onlySaveContactInTransaction: z
      .boolean()
      .optional()
      .describe(
        "If true, contact info is stored only on the participant snapshot — no standalone Contact entity is created."
      ),
    agentVisible: z
      .boolean()
      .optional()
      .describe("Visible on Agent portal (default true)"),
    buyerSellerVisible: z
      .boolean()
      .optional()
      .describe("Visible on Buyer/Seller portal (default true)"),
  },
  async ({
    xactionId,
    xactionParticipantRoleId,
    linkedContactId,
    firstName,
    lastName,
    company,
    email1,
    phone1,
    phone1Type,
    phone2,
    phone2Type,
    altContactFirstName,
    altContactLastName,
    altContactEmail1,
    licenseNum,
    onlySaveContactInTransaction,
    agentVisible,
    buyerSellerVisible,
  }) => {
    const body = {
      xactionId,
      xactionParticipantRoleId,
      ...(linkedContactId !== undefined && { linkedContactId }),
      ...(onlySaveContactInTransaction !== undefined && { onlySaveContactInTransaction }),
      ...(agentVisible !== undefined && { agentVisible }),
      ...(buyerSellerVisible !== undefined && { buyerSellerVisible }),
    };
    // Only include contactInfo if no linkedContactId is provided
    if (linkedContactId === undefined) {
      const contactInfo = {};
      if (firstName !== undefined) contactInfo.firstName = firstName;
      if (lastName !== undefined) contactInfo.lastName = lastName;
      if (company !== undefined) contactInfo.company = company;
      if (email1 !== undefined) contactInfo.email1 = email1;
      if (phone1 !== undefined) contactInfo.phone1 = phone1;
      if (phone1Type !== undefined) contactInfo.phone1Type = phone1Type;
      if (phone2 !== undefined) contactInfo.phone2 = phone2;
      if (phone2Type !== undefined) contactInfo.phone2Type = phone2Type;
      if (altContactFirstName !== undefined) contactInfo.altContactFirstName = altContactFirstName;
      if (altContactLastName !== undefined) contactInfo.altContactLastName = altContactLastName;
      if (altContactEmail1 !== undefined) contactInfo.altContactEmail1 = altContactEmail1;
      if (licenseNum !== undefined) contactInfo.licenseNum = licenseNum;
      if (Object.keys(contactInfo).length > 0) body.contactInfo = contactInfo;
    }
    const result = await addTransactionParticipant(body);
    return formatResult("Participant added to transaction.", result);
  }
);

// Tool 13: get_transaction_participant
server.tool(
  "get_transaction_participant",
  "Retrieve a single transaction participant by ID. Returns the participant's role, full contact info digest, linkedContactId (null if no linked Contact), and visibility settings. Check linkedContactId before deciding whether to use update_participant_linked_contact or update_participant_contact_info.",
  {
    xactionParticipantId: z
      .number()
      .int()
      .describe("The ID of the Transaction Participant to retrieve"),
  },
  async ({ xactionParticipantId }) => {
    const result = await getTransactionParticipant(xactionParticipantId);
    return formatResult(`Transaction Participant ${xactionParticipantId}:`, result);
  }
);

// Tool 14: update_transaction_participant
server.tool(
  "update_transaction_participant",
  "Update participant-level fields on a transaction participant — role, agent visibility, and buyer/seller visibility. This does NOT update contact info (name, phones, email, etc.). To update contact info, use update_participant_linked_contact (when linkedContactId is not null) or update_participant_contact_info (when linkedContactId is null).",
  {
    xactionParticipantId: z
      .number()
      .int()
      .describe("The ID of the Transaction Participant to update"),
    xactionParticipantRoleId: z
      .number()
      .int()
      .optional()
      .describe("New role ID to assign (from list_participant_roles)"),
    agentVisible: z
      .boolean()
      .optional()
      .describe("Whether the participant is visible on the Agent portal"),
    buyerSellerVisible: z
      .boolean()
      .optional()
      .describe("Whether the participant is visible on the Buyer/Seller portal"),
  },
  async ({ xactionParticipantId, ...changes }) => {
    const result = await updateTransactionParticipant(xactionParticipantId, changes);
    return formatResult(`Transaction Participant ${xactionParticipantId} updated.`, result);
  }
);

// Tool 15: remove_transaction_participant
server.tool(
  "remove_transaction_participant",
  "Remove a participant from a transaction. The linked Contact (if any) is NOT deleted — only the participant record is removed.",
  {
    xactionParticipantId: z
      .number()
      .int()
      .describe("The ID of the Transaction Participant to remove"),
  },
  async ({ xactionParticipantId }) => {
    const result = await removeTransactionParticipant(xactionParticipantId);
    return formatResult(
      `Transaction Participant ${xactionParticipantId} removed.`,
      result
    );
  }
);

// Tool 16: set_participant_linked_contact
server.tool(
  "set_participant_linked_contact",
  "Set or replace the linked Contact on a transaction participant. The participant's contact-info snapshot is re-synced from the new Contact. If a prior Contact was linked, it is replaced (not merged). The prior Contact entity is not modified or deleted.",
  {
    xactionParticipantId: z
      .number()
      .int()
      .describe("The ID of the Transaction Participant to update"),
    linkedContactId: z
      .number()
      .int()
      .describe("The ID of the Contact to link"),
  },
  async ({ xactionParticipantId, linkedContactId }) => {
    const result = await setParticipantLinkedContact(xactionParticipantId, linkedContactId);
    return formatResult(
      `Contact ${linkedContactId} linked to Participant ${xactionParticipantId}.`,
      result
    );
  }
);

// Tool 17: unlink_participant_contact
server.tool(
  "unlink_participant_contact",
  "Unlink the Contact from a transaction participant. The participant's contact-info snapshot is preserved after unlinking. Returns 409 if the participant has no linked Contact — check linkedContactId first using get_transaction_participant.",
  {
    xactionParticipantId: z
      .number()
      .int()
      .describe("The ID of the Transaction Participant to unlink"),
  },
  async ({ xactionParticipantId }) => {
    const result = await unlinkParticipantContact(xactionParticipantId);
    return formatResult(
      `Contact unlinked from Participant ${xactionParticipantId}.`,
      result
    );
  }
);

// Tool 18: update_participant_linked_contact
server.tool(
  "update_participant_linked_contact",
  "Update contact info fields on a transaction participant that HAS a linked Contact (linkedContactId is not null). Updates the linked Contact entity directly and re-syncs the participant snapshot. Returns 409 if no linked Contact exists — use update_participant_contact_info instead. Check linkedContactId via get_transaction_participant before calling.",
  {
    xactionParticipantId: z
      .number()
      .int()
      .describe("The ID of the Transaction Participant to update"),
    firstName: z.string().optional().describe("First name"),
    lastName: z.string().optional().describe("Last name"),
    company: z.string().optional().describe("Company name"),
    teamName: z.string().optional().describe("Team name"),
    jobTitle: z.string().optional().describe("Job title"),
    email1: z.string().optional().describe("Email 1 (primary)"),
    phone1: z.string().optional().describe("Phone 1 number"),
    phone1Type: z
      .enum(["CELL", "HOME", "WORK", "PAGER", "ASSISTANT", "COMPANY", "OTHER"])
      .optional()
      .describe("Phone 1 type"),
    phone1Desc: z.string().optional().describe("Phone 1 description / extension"),
    phone2: z.string().optional().describe("Phone 2 number"),
    phone2Type: z
      .enum(["CELL", "HOME", "WORK", "PAGER", "ASSISTANT", "COMPANY", "OTHER"])
      .optional()
      .describe("Phone 2 type"),
    phone2Desc: z.string().optional().describe("Phone 2 description / extension"),
    altContactFirstName: z.string().optional().describe("Alt contact first name"),
    altContactLastName: z.string().optional().describe("Alt contact last name"),
    altContactEmail1: z.string().optional().describe("Alt contact email 1 (primary)"),
    altContactPhone1: z.string().optional().describe("Alt contact phone 1"),
    altContactPhone1Type: z
      .enum(["CELL", "HOME", "WORK", "PAGER", "ASSISTANT", "COMPANY", "OTHER"])
      .optional()
      .describe("Alt contact phone 1 type"),
  },
  async ({ xactionParticipantId, ...changes }) => {
    const result = await updateParticipantLinkedContact(xactionParticipantId, changes);
    return formatResult(
      `Linked Contact on Participant ${xactionParticipantId} updated.`,
      result
    );
  }
);

// Tool 19: update_participant_contact_info
server.tool(
  "update_participant_contact_info",
  "Update contact info fields on a transaction participant that has NO linked Contact (linkedContactId is null). Updates the participant's snapshot only — does not create or modify a Contact entity. Returns 409 if a linked Contact exists — use update_participant_linked_contact instead. Check linkedContactId via get_transaction_participant before calling.",
  {
    xactionParticipantId: z
      .number()
      .int()
      .describe("The ID of the Transaction Participant to update"),
    firstName: z.string().optional().describe("First name"),
    lastName: z.string().optional().describe("Last name"),
    company: z.string().optional().describe("Company name"),
    teamName: z.string().optional().describe("Team name"),
    jobTitle: z.string().optional().describe("Job title"),
    email1: z.string().optional().describe("Email 1 (primary)"),
    phone1: z.string().optional().describe("Phone 1 number"),
    phone1Type: z
      .enum(["CELL", "HOME", "WORK", "PAGER", "ASSISTANT", "COMPANY", "OTHER"])
      .optional()
      .describe("Phone 1 type"),
    phone1Desc: z.string().optional().describe("Phone 1 description / extension"),
    phone2: z.string().optional().describe("Phone 2 number"),
    phone2Type: z
      .enum(["CELL", "HOME", "WORK", "PAGER", "ASSISTANT", "COMPANY", "OTHER"])
      .optional()
      .describe("Phone 2 type"),
    phone2Desc: z.string().optional().describe("Phone 2 description / extension"),
    altContactFirstName: z.string().optional().describe("Alt contact first name"),
    altContactLastName: z.string().optional().describe("Alt contact last name"),
    altContactEmail1: z.string().optional().describe("Alt contact email 1 (primary)"),
    altContactPhone1: z.string().optional().describe("Alt contact phone 1"),
    altContactPhone1Type: z
      .enum(["CELL", "HOME", "WORK", "PAGER", "ASSISTANT", "COMPANY", "OTHER"])
      .optional()
      .describe("Alt contact phone 1 type"),
  },
  async ({ xactionParticipantId, ...changes }) => {
    const result = await updateParticipantContactInfo(xactionParticipantId, changes);
    return formatResult(
      `Contact info on Participant ${xactionParticipantId} updated.`,
      result
    );
  }
);

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
      searchCriteriaXactionDto: searchCriteria,
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

// Tool 28: create_transaction_attachment
server.tool(
  "create_transaction_attachment",
  "Create a new Transaction Attachment record on an Aframe transaction (metadata only). Use attachmentType 'URL' to attach a Google Drive link or other web link — supply webLink when doing so. Use attachmentType 'FILE' to create a placeholder slot, then upload the binary via upload_transaction_attachment_file. Supply either folderId or newFolderName to place the attachment in a folder (mutually exclusive). Returns the created attachment object including the new xactionAttachmentId.",
  {
    xactionId: z.number().int().describe("ID of the Transaction to attach to"),
    attachmentType: z
      .enum(["FILE", "URL"])
      .describe("Attachment type — FILE for binary uploads, URL for web links"),
    title: z.string().optional().describe("Attachment title (max 300 chars)"),
    description: z.string().optional().describe("Attachment description"),
    webLink: z
      .string()
      .optional()
      .describe("URL link — required when attachmentType is 'URL'"),
    folderId: z
      .number()
      .int()
      .optional()
      .describe("ID of an existing folder to place the attachment in. Mutually exclusive with newFolderName."),
    newFolderName: z
      .string()
      .optional()
      .describe("Name of a new folder to create and place the attachment in. Mutually exclusive with folderId."),
    required: z.boolean().optional().describe("Whether the attachment is required"),
    completed: z.boolean().optional().describe("Whether the attachment is completed"),
    color: z
      .enum(["NONE", "RED", "TANGERINE", "TAUPE", "YELLOW", "LIME", "GREEN", "CYAN", "TEAL", "COBALT", "PURPLE", "MAGENTA"])
      .optional()
      .describe("Display color label (default NONE)"),
    agentVisible: z.boolean().optional().describe("Visible on Agent Portal"),
    buyerSellerVisible: z.boolean().optional().describe("Visible on Buyer/Seller Portal"),
    mergeFieldCode: z.string().optional().describe("Merge field code"),
    sort: z.number().int().optional().describe("Sort order within the folder"),
  },
  async (params) => {
    const result = await createTransactionAttachment(params);
    return formatResult("Transaction attachment created successfully.", result);
  }
);

// Tool 29: get_transaction_attachment
server.tool(
  "get_transaction_attachment",
  "Retrieve a single Transaction Attachment by ID. Returns the full attachment record including title, type, file metadata (fileName, contentType, fileSizeBytes), webLink, completion and visibility flags, folder, and audit timestamps. Use this to confirm state after a write operation.",
  {
    xactionAttachmentId: z
      .number()
      .int()
      .describe("ID of the Transaction Attachment to retrieve"),
  },
  async ({ xactionAttachmentId }) => {
    const result = await getTransactionAttachment(xactionAttachmentId);
    return formatResult(`Transaction Attachment ${xactionAttachmentId}:`, result);
  }
);

// Tool 30: list_transaction_attachments
server.tool(
  "list_transaction_attachments",
  "List all attachments on a Transaction. Returns a paged list of attachment records — title, type, file metadata, webLink, completion flags, folder, and sort order. Only non-omitted attachments are returned. Pagination is 0-based; default page size is 50, max 100. Use this to discover existing attachment IDs and slot structure before creating or updating attachments.",
  {
    xactionId: z.number().int().describe("The transaction ID"),
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
      .default(50)
      .describe("Page size, max 100 (default 50)"),
  },
  async ({ xactionId, page, pageSize }) => {
    const result = await listTransactionAttachments(xactionId, { page, pageSize });
    return formatResult(`Attachments on transaction ${xactionId}:`, result);
  }
);

// Tool 31: update_transaction_attachment
server.tool(
  "update_transaction_attachment",
  "Update metadata on an existing Transaction Attachment using JSON Patch. Include only the fields you want to change. Use this to patch a webLink into an existing URL-type slot, rename an attachment, toggle completion or visibility flags, or move the attachment to a different folder. To upload or manipulate the file binary, use the dedicated file tools instead.",
  {
    xactionAttachmentId: z
      .number()
      .int()
      .describe("ID of the Transaction Attachment to update"),
    attachmentType: z.enum(["FILE", "URL"]).optional().describe("Attachment type"),
    title: z.string().optional().describe("Attachment title (max 300 chars)"),
    description: z.string().optional().describe("Attachment description"),
    webLink: z
      .string()
      .optional()
      .describe("URL link — applicable when attachmentType is URL"),
    fileName: z
      .string()
      .optional()
      .describe("Rename the stored file — extension must match the existing file's extension"),
    required: z.boolean().optional().describe("Whether the attachment is required"),
    completed: z.boolean().optional().describe("Whether the attachment is completed"),
    color: z
      .enum(["NONE", "RED", "TANGERINE", "TAUPE", "YELLOW", "LIME", "GREEN", "CYAN", "TEAL", "COBALT", "PURPLE", "MAGENTA"])
      .optional()
      .describe("Display color label"),
    agentVisible: z.boolean().optional().describe("Visible on Agent Portal"),
    buyerSellerVisible: z.boolean().optional().describe("Visible on Buyer/Seller Portal"),
    mergeFieldCode: z.string().optional().describe("Merge field code"),
    sort: z.number().int().optional().describe("Sort order within the folder"),
    folderId: z
      .number()
      .int()
      .optional()
      .describe("Move to an existing folder by ID. Mutually exclusive with newFolderName."),
    newFolderName: z
      .string()
      .optional()
      .describe("Move to a new folder (created on the fly). Mutually exclusive with folderId."),
  },
  async ({ xactionAttachmentId, ...changes }) => {
    const result = await updateTransactionAttachment(xactionAttachmentId, changes);
    return formatResult(
      `Transaction Attachment ${xactionAttachmentId} updated.`,
      result
    );
  }
);

// Tool 32: upload_transaction_attachment_file
server.tool(
  "upload_transaction_attachment_file",
  "Upload or replace the binary file on a FILE-type Transaction Attachment. Sends the file as multipart/form-data. If a file is already present it is replaced. Supply fileBase64 as a base64-encoded string of the file content, along with fileName and mimeType. Optional newFileName overrides the stored file name (extension must match). Optional completeMode controls whether the attachment is auto-marked complete after upload (DEFAULT, COMPLETE, INCOMPLETE, UNCHANGED).",
  {
    xactionAttachmentId: z
      .number()
      .int()
      .describe("ID of the Transaction Attachment to upload to"),
    fileBase64: z
      .string()
      .describe("Base64-encoded file content"),
    fileName: z
      .string()
      .describe("File name including extension, e.g. 'contract.pdf'"),
    mimeType: z
      .string()
      .describe("MIME type of the file, e.g. 'application/pdf'"),
    newFileName: z
      .string()
      .optional()
      .describe("Override the stored file name after upload — extension must match the uploaded file"),
    completeMode: z
      .enum(["DEFAULT", "COMPLETE", "INCOMPLETE", "UNCHANGED"])
      .optional()
      .describe("Controls the completed flag after upload. DEFAULT applies system behavior; UNCHANGED leaves the flag as-is."),
  },
  async ({ xactionAttachmentId, fileBase64, fileName, mimeType, newFileName, completeMode }) => {
    const fileBuffer = Buffer.from(fileBase64, "base64");
    const result = await uploadTransactionAttachmentFile(
      xactionAttachmentId,
      fileBuffer,
      fileName,
      mimeType,
      { newFileName, completeMode }
    );
    return formatResult(
      `File uploaded to Transaction Attachment ${xactionAttachmentId}.`,
      result
    );
  }
);

// Tool 33: unassign_transaction_attachment_file
server.tool(
  "unassign_transaction_attachment_file",
  "Detach the file from a named (placeholder) Transaction Attachment slot, parking it as a new untitled attachment. The original slot is marked incomplete. Returns the newly created untitled attachment that now owns the file — not the original. Preconditions: the original attachment must have a file and must be a placeholder (non-blank title). Use this to free up a named slot before assigning a different file into it.",
  {
    xactionAttachmentId: z
      .number()
      .int()
      .describe("ID of the Transaction Attachment to unassign the file from"),
  },
  async ({ xactionAttachmentId }) => {
    const result = await unassignTransactionAttachmentFile(xactionAttachmentId);
    return formatResult(
      `File unassigned from Transaction Attachment ${xactionAttachmentId}. New untitled attachment:`,
      result
    );
  }
);

// Tool 34: assign_transaction_attachment_file
server.tool(
  "assign_transaction_attachment_file",
  "Move the file from a source Transaction Attachment into a target Transaction Attachment that has no file. The target is marked complete; if the source has a blank title (not a placeholder) it is deleted, otherwise it remains and is marked incomplete. Returns a plain confirmation string — fetch source/target attachments separately if post-op state is needed. Optional completeMode overrides the completion mutation on the target only.",
  {
    xactionAttachmentId: z
      .number()
      .int()
      .describe("ID of the source Transaction Attachment giving up its file"),
    targetXactionAttachmentId: z
      .number()
      .int()
      .describe("ID of the target Transaction Attachment receiving the file"),
    completeMode: z
      .enum(["DEFAULT", "COMPLETE", "INCOMPLETE", "UNCHANGED"])
      .optional()
      .describe("Override completion mutation on the target only. Does not affect the source."),
  },
  async ({ xactionAttachmentId, targetXactionAttachmentId, completeMode }) => {
    const result = await assignTransactionAttachmentFile(
      xactionAttachmentId,
      targetXactionAttachmentId,
      { completeMode }
    );
    return formatResult(
      `File moved from Attachment ${xactionAttachmentId} to Attachment ${targetXactionAttachmentId}.`,
      result
    );
  }
);

// Tool 35: search_tasks
server.tool(
  "search_tasks",
  "Search for Tasks using the supplied criteria. Filter by status, xactionId, contactId, assignees, completedBy, dueDate range, or completeDate range. Pagination is 0-based; default page size is 20, max is 100. All criteria are optional — omitting taskSearchCriteriaDto returns all tasks (paginated). Use xactionId to list all tasks on a specific transaction.",
  {
    taskStatuses: z
      .array(z.enum(["OPEN", "IN_PROGRESS", "COMPLETE"]))
      .optional()
      .describe("Filter by task statuses"),
    xactionId: z
      .number()
      .int()
      .optional()
      .describe("Filter by ID of the associated Transaction"),
    contactId: z
      .number()
      .int()
      .optional()
      .describe("Filter by ID of the associated Contact"),
    assignees: z
      .array(z.number().int())
      .optional()
      .describe("Filter by IDs of assignee AppUsers"),
    completedBy: z
      .array(z.number().int())
      .optional()
      .describe("Filter by IDs of AppUsers who completed the task"),
    dueDateFrom: z
      .string()
      .optional()
      .describe("Due date range start (inclusive), YYYY-MM-DD"),
    dueDateTo: z
      .string()
      .optional()
      .describe("Due date range end (inclusive), YYYY-MM-DD"),
    completeDateFrom: z
      .string()
      .optional()
      .describe("Complete date range start (inclusive), YYYY-MM-DD"),
    completeDateTo: z
      .string()
      .optional()
      .describe("Complete date range end (inclusive), YYYY-MM-DD"),
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
    taskStatuses,
    xactionId,
    contactId,
    assignees,
    completedBy,
    dueDateFrom,
    dueDateTo,
    completeDateFrom,
    completeDateTo,
    page,
    pageSize,
  }) => {
    const criteria = {
      ...(taskStatuses !== undefined && { taskStatuses }),
      ...(xactionId !== undefined && { xactionId }),
      ...(contactId !== undefined && { contactId }),
      ...(assignees !== undefined && { assignees }),
      ...(completedBy !== undefined && { completedBy }),
      ...((dueDateFrom !== undefined || dueDateTo !== undefined) && {
        dueDate: {
          ...(dueDateFrom !== undefined && { from: dueDateFrom }),
          ...(dueDateTo !== undefined && { to: dueDateTo }),
        },
      }),
      ...((completeDateFrom !== undefined || completeDateTo !== undefined) && {
        completeDate: {
          ...(completeDateFrom !== undefined && { from: completeDateFrom }),
          ...(completeDateTo !== undefined && { to: completeDateTo }),
        },
      }),
    };
    const body = {
      taskSearchCriteriaDto: criteria,
      page: page ?? 0,
      pageSize: pageSize ?? 20,
    };
    const result = await searchTasks(body);
    return formatResult("Task search results:", result);
  }
);

// Tool 36: get_task
server.tool(
  "get_task",
  "Retrieve a single Task by ID. Returns the full APITaskDto including subject, status, type, due date, assignee, associated transaction and contact, folder, recurring settings, reminder destinations, letter templates, and computed fields. Richer than the digest returned by update_task.",
  {
    taskId: z.number().int().describe("ID of the Task to retrieve"),
  },
  async ({ taskId }) => {
    const result = await getTask(taskId);
    return formatResult(`Task ${taskId}:`, result);
  }
);

// Tool 37: update_task
server.tool(
  "update_task",
  "Update a Task using JSON Patch (RFC 6902). Supply only the fields to change — all fields are optional. Common use cases: mark complete (status: 'COMPLETE', completeDate: 'YYYY-MM-DD'), change due date (dueDate), reassign (appUserId), omit from agent view (agentVisible: false). Returns APITaskDigestDto — an abbreviated view. Use get_task to read the full record afterward if needed.",
  {
    taskId: z
      .number()
      .int()
      .describe("ID of the Task to update"),
    status: z
      .enum(["OPEN", "IN_PROGRESS", "COMPLETE"])
      .optional()
      .describe("Task status"),
    taskType: z
      .enum(["TODO", "PHONE", "LETTER", "EMAIL"])
      .optional()
      .describe("Task type"),
    subject: z
      .string()
      .max(255)
      .optional()
      .describe("Task subject/title"),
    note: z
      .string()
      .optional()
      .describe("Task description/notes"),
    appUserId: z
      .number()
      .int()
      .optional()
      .describe("ID of the AppUser to assign the task to"),
    appUserIdCompletedBy: z
      .number()
      .int()
      .optional()
      .describe("ID of the AppUser who completed the task"),
    dueDate: z
      .string()
      .optional()
      .describe("Due date, YYYY-MM-DD"),
    dueTime: z
      .string()
      .optional()
      .describe("Due time, e.g. '14:30'"),
    completeDate: z
      .string()
      .optional()
      .describe("Completion date, YYYY-MM-DD"),
    reminderSet: z
      .boolean()
      .optional()
      .describe("Whether a reminder is set"),
    reminderDate: z
      .string()
      .optional()
      .describe("Reminder date, YYYY-MM-DD"),
    reminderTime: z
      .string()
      .optional()
      .describe("Reminder time, e.g. '09:00'"),
    agentVisible: z
      .boolean()
      .optional()
      .describe("Whether the task is visible on the agent portal"),
    buyerSellerVisible: z
      .boolean()
      .optional()
      .describe("Whether the task is visible on the buyer/seller portal"),
    prospecting: z
      .boolean()
      .optional()
      .describe("Whether the task is a prospecting task"),
    onCalendar: z
      .boolean()
      .optional()
      .describe("Whether the task is included in the calendar feed"),
    milestone: z
      .boolean()
      .optional()
      .describe("Whether the task is a milestone"),
    color: z
      .enum(["NONE", "RED", "TANGERINE", "TAUPE", "YELLOW", "LIME", "GREEN", "CYAN", "TEAL", "COBALT", "PURPLE", "MAGENTA"])
      .optional()
      .describe("Task color (default NONE)"),
    folderId: z
      .number()
      .int()
      .optional()
      .describe("ID of the folder to assign the task to"),
    newFolderName: z
      .string()
      .max(255)
      .optional()
      .describe("Create a new folder with this name and assign the task to it"),
  },
  async ({ taskId, ...changes }) => {
    const result = await updateTask(taskId, changes);
    return formatResult(`Task ${taskId} updated:`, result);
  }
);

// Tool 38: create_task
server.tool(
  "create_task",
  "Create a new Task assigned to a Team Member. Requires subject and appUserId (assignee). Optionally scope to a Transaction (xactionId) or Contact (contactId). Use folderId to place in an existing folder, or newFolderName to create a new folder in one step. Returns the full APITaskDto (HTTP 201).",
  {
    appUserId: z
      .number()
      .int()
      .describe("ID of the AppUser to assign the task to (required)"),
    subject: z
      .string()
      .max(255)
      .describe("Task subject/title (required)"),
    xactionId: z
      .number()
      .int()
      .optional()
      .describe("ID of the Transaction to associate the task with"),
    contactId: z
      .number()
      .int()
      .optional()
      .describe("ID of the Contact to associate the task with"),
    note: z
      .string()
      .optional()
      .describe("Task description/notes"),
    taskType: z
      .enum(["TODO", "PHONE", "LETTER", "EMAIL"])
      .optional()
      .describe("Task type (default TODO)"),
    status: z
      .enum(["OPEN", "IN_PROGRESS", "COMPLETE"])
      .optional()
      .describe("Task status (default OPEN)"),
    dueDate: z
      .string()
      .optional()
      .describe("Due date, YYYY-MM-DD"),
    dueTime: z
      .string()
      .optional()
      .describe("Due time, e.g. '14:30'"),
    reminderSet: z
      .boolean()
      .optional()
      .describe("Whether a reminder is set"),
    reminderDate: z
      .string()
      .optional()
      .describe("Reminder date, YYYY-MM-DD"),
    reminderTime: z
      .string()
      .optional()
      .describe("Reminder time, e.g. '09:00'"),
    folderId: z
      .number()
      .int()
      .optional()
      .describe("ID of an existing folder to place the task in"),
    newFolderName: z
      .string()
      .max(255)
      .optional()
      .describe("Create a new folder with this name and place the task in it (mutually exclusive with folderId)"),
    agentVisible: z
      .boolean()
      .optional()
      .describe("Whether the task is visible on the agent portal"),
    buyerSellerVisible: z
      .boolean()
      .optional()
      .describe("Whether the task is visible on the buyer/seller portal"),
    color: z
      .enum(["NONE", "RED", "TANGERINE", "TAUPE", "YELLOW", "LIME", "GREEN", "CYAN", "TEAL", "COBALT", "PURPLE", "MAGENTA"])
      .optional()
      .describe("Task color (default NONE)"),
    milestone: z
      .boolean()
      .optional()
      .describe("Whether the task is a milestone"),
  },
  async ({ appUserId, subject, xactionId, contactId, note, taskType, status, dueDate, dueTime, reminderSet, reminderDate, reminderTime, folderId, newFolderName, agentVisible, buyerSellerVisible, color, milestone }) => {
    const params = {
      appUserId,
      subject,
      ...(xactionId !== undefined && { xactionId }),
      ...(contactId !== undefined && { contactId }),
      ...(note !== undefined && { note }),
      ...(taskType !== undefined && { taskType }),
      ...(status !== undefined && { status }),
      ...(dueDate !== undefined && { dueDate }),
      ...(dueTime !== undefined && { dueTime }),
      ...(reminderSet !== undefined && { reminderSet }),
      ...(reminderDate !== undefined && { reminderDate }),
      ...(reminderTime !== undefined && { reminderTime }),
      ...(folderId !== undefined && { folderId }),
      ...(newFolderName !== undefined && { newFolderName }),
      ...(agentVisible !== undefined && { agentVisible }),
      ...(buyerSellerVisible !== undefined && { buyerSellerVisible }),
      ...(color !== undefined && { color }),
      ...(milestone !== undefined && { milestone }),
    };
    const result = await createTask(params);
    return formatResult("Task created:", result);
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
    version: "0.6.0",
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
  console.log(`Aframe MCP connector v0.6.0 listening on port ${PORT}`);
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
  console.log(`         list_contact_categories, list_transaction_statuses,`);
  console.log(`         create_transaction_attachment, get_transaction_attachment,`);
  console.log(`         list_transaction_attachments, update_transaction_attachment,`);
  console.log(`         upload_transaction_attachment_file, unassign_transaction_attachment_file,`);
  console.log(`         assign_transaction_attachment_file,`);
  console.log(`         search_tasks, get_task, update_task, create_task`);
});

import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";

import { listEditions, getEdition, putEdition } from "./editions.js";
import { listCards, putCards } from "./cards.js";
import {
  listPendingGenerationRequests,
  listGenerationRequests,
  updateGenerationRequest,
} from "./generation.js";
import { notifyEditionReady } from "./notify.js";
import { getSettings } from "./settings.js";

// Unwraps the JSON body from the existing REST handlers (which return Response
// objects) so an MCP tool can hand back plain data. Lets the MCP server reuse
// the exact same D1-backed logic the Telegram-auth REST API uses, instead of
// duplicating it.
async function data(responsePromise) {
  const res = await responsePromise;
  return res.json();
}

function toolResult(value) {
  return { content: [{ type: "text", text: JSON.stringify(value) }] };
}

// Builds a fresh McpServer for one request. Everything this server does is
// scoped to Sikke's own D1 data — no other capability is exposed.
export function buildMcpServer(env) {
  const server = new McpServer({ name: "sikke-newsroom", version: "1.0.0" });

  server.registerTool(
    "list_pending_generation_requests",
    { description: "List generation requests queued from the Mini App's Generate button that haven't been processed yet." },
    async () => toolResult(await data(listPendingGenerationRequests(env)))
  );

  server.registerTool(
    "list_recent_generation_requests",
    { description: "List the 10 most recent generation requests of any status, for status-checking." },
    async () => toolResult(await data(listGenerationRequests(env)))
  );

  server.registerTool(
    "update_generation_request",
    {
      description: "Update a generation request's status as you work through it: running, done (with edition_id), or failed (with a note).",
      inputSchema: z.object({
        id: z.string(),
        status: z.enum(["pending", "running", "done", "failed"]),
        edition_id: z.string().optional(),
        note: z.string().optional(),
      }),
    },
    async ({ id, status, edition_id, note }) =>
      toolResult(await data(updateGenerationRequest(env, id, { status, edition_id, note })))
  );

  server.registerTool(
    "get_settings",
    { description: "Read Sikke's standing editorial settings: editions_per_week, platforms, regional_politics_policy, default_desks." },
    async () => toolResult(await data(getSettings(env)))
  );

  server.registerTool(
    "list_editions",
    { description: "List all editions (without their full content) to check recent desk/category mix and find any with status 'changes'." },
    async () => toolResult(await data(listEditions(env)))
  );

  server.registerTool(
    "get_edition",
    {
      description: "Get one edition's full detail, including its trilingual content and notes.",
      inputSchema: z.object({ id: z.string() }),
    },
    async ({ id }) => toolResult(await data(getEdition(env, id)))
  );

  server.registerTool(
    "create_or_update_edition",
    {
      description:
        "Create a new edition or fully replace an existing one. Use status 'awaiting' for a new delivery. Matches the fields documented in references/newsroom.md.",
      inputSchema: z.object({
        id: z.string(),
        title: z.string(),
        publish_date: z.string(),
        created_at: z.string().optional(),
        status: z.string().optional(),
        lead_card: z.string(),
        why: z.string().optional(),
        judgment: z.array(z.string()).optional(),
        posting_notes: z.array(z.string()).optional(),
        sources: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
        content: z.record(z.string(), z.record(z.string(), z.string())),
        decided_by: z.string().optional(),
        decided_at: z.string().optional(),
        decided_via: z.string().optional(),
      }),
    },
    async (edition) => toolResult(await data(putEdition(env, edition.id, edition)))
  );

  server.registerTool(
    "list_cards",
    {
      description: "List fact-archive cards, optionally filtered by status or category, to check for duplicates and unused stock.",
      inputSchema: z.object({ status: z.string().optional(), category: z.string().optional() }),
    },
    async ({ status, category }) => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (category) params.set("category", category);
      const url = new URL(`https://x/api/cards?${params.toString()}`);
      return toolResult(await data(listCards(env, url)));
    }
  );

  server.registerTool(
    "file_cards",
    {
      description: "File one or more Verified/Needs-2nd-source/Myth fact cards into the archive (batch insert/update).",
      inputSchema: z.object({
        cards: z.array(
          z.object({
            id: z.string(),
            headline: z.string(),
            status: z.string(),
            category: z.string().optional(),
            era: z.string().optional(),
            date: z.string().optional(),
            region: z.string().optional(),
            country: z.string().optional(),
            tags: z.array(z.string()).optional(),
            wow: z.number().optional(),
            relevance: z.number().optional(),
            summary: z.string().optional(),
            sources: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
            used_in: z.array(z.string()).optional(),
            checked_on: z.string().optional(),
          })
        ),
      }),
    },
    async ({ cards }) => toolResult(await data(putCards(env, cards)))
  );

  server.registerTool(
    "notify_edition_ready",
    {
      description: "Ping Ardalan and Niloofar's Telegram with a 'Review edition' button into the Mini App.",
      inputSchema: z.object({ edition_id: z.string(), title: z.string() }),
    },
    async ({ edition_id, title }) => toolResult(await data(notifyEditionReady(env, edition_id, title)))
  );

  return server;
}

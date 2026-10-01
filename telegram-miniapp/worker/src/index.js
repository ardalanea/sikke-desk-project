import { OAuthProvider } from "@cloudflare/workers-oauth-provider";
import { createMcpHandler } from "@modelcontextprotocol/server";

import { requireTelegramUser, requireArtifactUser, requireServiceKey, json } from "./auth.js";

// Either human auth path: Telegram Mini App initData, or the Artifact passphrase.
async function resolveUser(request, env) {
  return (await requireTelegramUser(request, env)) || requireArtifactUser(request, env);
}
import { listEditions, getEdition, putEdition, decideEdition, updateContentField } from "./editions.js";
import { listCards, putCards } from "./cards.js";
import { notifyEditionReady } from "./notify.js";
import {
  requestGeneration,
  listGenerationRequests,
  listPendingGenerationRequests,
  updateGenerationRequest,
} from "./generation.js";
import { publishEditionToTelegram } from "./publish.js";
import { getSettings, putSettings } from "./settings.js";
import { buildMcpServer } from "./mcp-tools.js";
import { handleAuthorizeGet, handleAuthorizePost } from "./authorize.js";

// The original REST API (Telegram Mini App + service-key pipeline), unchanged.
// Reused as OAuthProvider's defaultHandler for every path other than /mcp.
async function legacyApi(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "content-type, authorization, x-telegram-init-data, x-artifact-passphrase, x-artifact-user",
        "access-control-allow-methods": "GET, POST, PATCH, OPTIONS",
      },
    });
  }

  if (path === "/authorize" && method === "GET") return handleAuthorizeGet(request, env);
  if (path === "/authorize" && method === "POST") return handleAuthorizePost(request, env);

  // --- Service-key routes (Claude Code's editorial pipeline) ---
  if (path === "/api/editions" && method === "POST") {
    if (!requireServiceKey(request, env)) return json({ error: "unauthorized" }, 401);
    const body = await request.json();
    if (!body.id) return json({ error: "missing id" }, 400);
    return putEdition(env, body.id, body);
  }
  if (path.match(/^\/api\/editions\/[^/]+$/) && method === "PATCH") {
    if (!requireServiceKey(request, env)) return json({ error: "unauthorized" }, 401);
    const id = path.split("/")[3];
    const body = await request.json();
    return putEdition(env, id, { ...(await getExisting(env, id)), ...body });
  }
  if (path === "/api/cards" && method === "POST") {
    if (!requireServiceKey(request, env)) return json({ error: "unauthorized" }, 401);
    const body = await request.json();
    const cards = Array.isArray(body) ? body : [body];
    return putCards(env, cards);
  }
  if (path === "/api/notify" && method === "POST") {
    if (!requireServiceKey(request, env)) return json({ error: "unauthorized" }, 401);
    const body = await request.json();
    return notifyEditionReady(env, body.edition_id, body.title);
  }
  if (path === "/api/generation-requests" && method === "GET") {
    if (!requireServiceKey(request, env)) return json({ error: "unauthorized" }, 401);
    return listPendingGenerationRequests(env);
  }
  if (path.match(/^\/api\/generation-requests\/[^/]+$/) && method === "PATCH") {
    if (!requireServiceKey(request, env)) return json({ error: "unauthorized" }, 401);
    const id = path.split("/")[3];
    const body = await request.json();
    return updateGenerationRequest(env, id, body);
  }

  // --- Reads usable by either the service key (Claude's pipeline) or a human (Telegram/Artifact) ---
  const serviceAuthed = requireServiceKey(request, env);
  if (path === "/api/editions" && method === "GET") {
    if (!serviceAuthed && !(await resolveUser(request, env))) return json({ error: "unauthorized" }, 403);
    return listEditions(env);
  }
  if (path.match(/^\/api\/editions\/[^/]+$/) && method === "GET") {
    if (!serviceAuthed && !(await resolveUser(request, env))) return json({ error: "unauthorized" }, 403);
    const id = path.split("/")[3];
    return getEdition(env, id);
  }
  if (path === "/api/cards" && method === "GET") {
    if (!serviceAuthed && !(await resolveUser(request, env))) return json({ error: "unauthorized" }, 403);
    return listCards(env, url);
  }
  if (path === "/api/settings" && method === "GET") {
    if (!serviceAuthed && !(await resolveUser(request, env))) return json({ error: "unauthorized" }, 403);
    return getSettings(env);
  }

  // --- Human-auth only routes (need a real identity: Telegram or Artifact) ---
  const user = await resolveUser(request, env);

  if (path.match(/^\/api\/editions\/[^/]+\/decision$/) && method === "POST") {
    if (!user) return json({ error: "unauthorized" }, 403);
    const id = path.split("/")[3];
    const body = await request.json();
    return decideEdition(env, id, body, user);
  }
  if (path === "/api/generate" && method === "POST") {
    if (!user) return json({ error: "unauthorized" }, 403);
    const body = await request.json();
    return requestGeneration(env, body, user);
  }
  if (path === "/api/generation-requests/mine" && method === "GET") {
    if (!user) return json({ error: "unauthorized" }, 403);
    return listGenerationRequests(env);
  }
  if (path.match(/^\/api\/editions\/[^/]+\/publish-telegram$/) && method === "POST") {
    if (!user) return json({ error: "unauthorized" }, 403);
    const id = path.split("/")[3];
    const body = await request.json();
    return publishEditionToTelegram(env, id, body.lang || "EN", user);
  }
  if (path.match(/^\/api\/editions\/[^/]+\/content$/) && method === "PATCH") {
    if (!user) return json({ error: "unauthorized" }, 403);
    const id = path.split("/")[3];
    const body = await request.json();
    return updateContentField(env, id, body, user);
  }
  if (path === "/api/settings" && method === "PUT") {
    if (!user) return json({ error: "unauthorized" }, 403);
    const body = await request.json();
    return putSettings(env, body);
  }

  return json({ error: "not found" }, 404);
}

async function getExisting(env, id) {
  const row = await env.DB.prepare("SELECT * FROM editions WHERE id = ?").bind(id).first();
  if (!row) return {};
  return {
    title: row.title,
    publish_date: row.publish_date,
    created_at: row.created_at,
    status: row.status,
    lead_card: row.lead_card,
    why: row.why,
    judgment: JSON.parse(row.judgment_json),
    posting_notes: JSON.parse(row.posting_notes_json),
    sources: JSON.parse(row.sources_json),
    content: JSON.parse(row.content_json),
    decided_by: row.decided_by,
    decided_at: row.decided_at,
    decided_via: row.decided_via,
  };
}

// The MCP surface: OAuth-protected, used by the scheduled routine instead of
// the raw service-key REST calls. Same underlying D1 data as /api/*.
async function mcpApiHandler(request, env, ctx) {
  const mcpHandler = createMcpHandler(() => buildMcpServer(env), { responseMode: "json" });
  return mcpHandler.fetch(request, { authInfo: ctx.auth });
}

const RESOURCE_URL = "https://sikke-newsroom-api.etemadansari-ardalan.workers.dev/mcp";

export default new OAuthProvider({
  apiRoute: "/mcp",
  apiHandler: { fetch: mcpApiHandler },
  defaultHandler: { fetch: legacyApi },
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/oauth/token",
  clientRegistrationEndpoint: "/oauth/register",
  scopesSupported: ["sikke:all"],
  resourceMetadata: {
    resource: RESOURCE_URL,
    authorization_servers: [RESOURCE_URL.replace(/\/mcp$/, "")],
  },
  requiredScopes: ["sikke:all"],
});

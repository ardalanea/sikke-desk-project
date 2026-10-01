import { AuthorizationError } from "@cloudflare/workers-oauth-provider";

const SCOPE = "sikke:all";

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function page(body) {
  return `<!doctype html>
<meta charset="utf-8">
<title>Sikke Newsroom</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 420px; margin: 60px auto; padding: 0 20px; color: #17262A; }
  h1 { font-size: 20px; }
  input[type=password] { width: 100%; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; margin: 12px 0; }
  button { padding: 10px 18px; font-size: 15px; border: none; border-radius: 8px; cursor: pointer; }
  button[name=decision][value=approve] { background: #0D5E57; color: white; }
  button[name=decision][value=deny] { background: #eee; margin-left: 8px; }
  .err { color: #a0322c; font-size: 14px; }
  p.hint { color: #666; font-size: 13px; }
</style>
${body}`;
}

// GET /authorize — show the consent + passphrase form.
export async function handleAuthorizeGet(request, env) {
  const oauth = env.OAUTH_PROVIDER;
  let oauthRequest;
  try {
    oauthRequest = await oauth.parseAuthRequest(request);
  } catch (error) {
    if (!(error instanceof AuthorizationError)) throw error;
    if (error.redirectTo) return Response.redirect(error.redirectTo, 302);
    return new Response(error.description, { status: 400 });
  }

  const details = await oauth.describeConsent(oauthRequest);
  const consent = await oauth.beginConsent(oauthRequest);
  consent.headers.set("Content-Type", "text/html; charset=utf-8");

  const name = escapeHtml(details.clientName || "This app");
  const origin = details.clientDomain
    ? `Published by <strong>${escapeHtml(details.clientDomain)}</strong>.`
    : "This app registered itself; its name is not independently verified.";

  return new Response(
    page(`
<h1>Allow ${name} to access the Sikke newsroom?</h1>
<p>${origin} Access will be sent to <strong>${escapeHtml(details.redirectHost)}</strong>.</p>
${details.redirectIsLoopback ? "<p><strong>This sends access to an app on a computer.</strong> Continue only if this is expected.</p>" : ""}
<form method="post">
  <input type="hidden" name="handle" value="${escapeHtml(consent.handle)}">
  <label for="pass">Passphrase</label>
  <input type="password" id="pass" name="passphrase" autofocus required>
  <p class="hint">The passphrase you set with <code>wrangler secret put MCP_AUTH_PASSPHRASE</code>.</p>
  <button name="decision" value="approve">Allow</button>
  <button name="decision" value="deny">Deny</button>
</form>`),
    { headers: consent.headers }
  );
}

// POST /authorize — verify the passphrase, then complete or deny.
export async function handleAuthorizePost(request, env) {
  const oauth = env.OAUTH_PROVIDER;
  const form = await request.formData();
  const handle = String(form.get("handle") || "");

  if (form.get("decision") !== "approve") {
    try {
      const denied = await oauth.denyConsent(request, handle);
      return new Response(null, { status: 302, headers: denied.headers });
    } catch (error) {
      if (error instanceof AuthorizationError) return new Response(escapeHtml(error.description), { status: 400 });
      throw error;
    }
  }

  const passphrase = String(form.get("passphrase") || "");
  if (!env.MCP_AUTH_PASSPHRASE || passphrase !== env.MCP_AUTH_PASSPHRASE) {
    return new Response(
      page(`<h1>Incorrect passphrase</h1><p class="err">Go back and try again.</p>`),
      { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  try {
    const approved = await oauth.approveConsent(request, handle, { scope: [SCOPE] });
    const { redirectTo } = await oauth.completeAuthorization({
      request: approved.request,
      userId: "ardalan",
      metadata: {},
      scope: approved.request.scope,
      props: { userId: "ardalan" },
    });
    approved.headers.set("Location", redirectTo);
    return new Response(null, { status: 302, headers: approved.headers });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return new Response(
        page(`<h1>This link expired</h1><p class="err">${escapeHtml(error.description)}</p><p>Go back to Claude and try adding the connector again.</p>`),
        { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
    throw error;
  }
}

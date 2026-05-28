/**
 * /gracias — Cloudflare Pages Function
 *
 * Flow sometimes delivers the user back to urlReturn via a form POST
 * (auto-submit) instead of a plain 302 GET redirect, which causes a
 * 405 on static files.  This function:
 *   GET  → passes through to the static HTML (gracias/index.html)
 *   POST → extracts the token from form data and does a 302 GET redirect
 *          so the static page can read it from the query string.
 */

export async function onRequestGet(context) {
  // Serve the static Next.js export normally
  return context.next();
}

export async function onRequestPost(context) {
  let token = null;

  try {
    const form = await context.request.formData();
    token = form.get("token");
  } catch {
    // Body could not be parsed as form data — redirect without token
  }

  const dest = token
    ? `/gracias?token=${encodeURIComponent(token)}`
    : "/gracias";

  return Response.redirect(new URL(dest, context.request.url).toString(), 302);
}

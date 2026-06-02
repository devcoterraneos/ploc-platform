/**
 * GET /api/analytics?days=30
 * Proxies Cloudflare Web Analytics GraphQL API.
 * Requires CF_API_TOKEN env var set in Cloudflare Pages.
 */

const ACCOUNT_ID = "5c328d7f3a73137c548333105c06041b";
const SITE_TAG   = "7771499b07fc4098bd1fd38315ce4510";

export async function onRequestGet(context) {
  const { request, env } = context;

  const token = env.CF_API_TOKEN;
  if (!token) {
    return ok({ error: "CF_API_TOKEN no configurado en variables de entorno" });
  }

  const url   = new URL(request.url);
  const days  = Math.min(parseInt(url.searchParams.get("days") ?? "30"), 30);
  const now   = new Date();
  const since = new Date(now.getTime() - days * 86400000).toISOString().split("T")[0];
  const until = now.toISOString().split("T")[0];

  // Run 4 separate queries to avoid alias issues
  const makeQuery = (orderBy, dimensions, limit) => ({
    query: `{
      viewer {
        accounts(filter: {accountTag: "${ACCOUNT_ID}"}) {
          result: rumPageloadEventsAdaptiveGroups(
            filter: {AND: [{siteTag: "${SITE_TAG}"}, {date_geq: "${since}"}, {date_leq: "${until}"}]}
            limit: ${limit}
            orderBy: [${orderBy}]
          ) {
            sum { visits pageViews }
            dimensions { ${dimensions} }
          }
        }
      }
    }`,
  });

  async function gql(body) {
    const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method:  "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { return { error: `HTTP ${res.status}: ${text.slice(0, 300)}` }; }
  }

  try {
    const [resDate, resPath, resCountry, resDevice] = await Promise.all([
      gql(makeQuery("date_ASC",           "date",        31)),
      gql(makeQuery("sum_visits_DESC",    "requestPath", 8)),
      gql(makeQuery("sum_visits_DESC",    "countryName", 8)),
      gql(makeQuery("sum_visits_DESC",    "deviceType",  5)),
    ]);

    // Extract helper
    const rows = (r) => r?.data?.viewer?.accounts?.[0]?.result ?? [];

    // Check for GraphQL errors in any response
    const anyError = [resDate, resPath, resCountry, resDevice]
      .map(r => r?.errors?.[0]?.message)
      .find(Boolean);

    if (anyError) {
      return ok({ error: `GraphQL: ${anyError}`, byDate: [], byPath: [], byCountry: [], byDevice: [] });
    }

    return ok({
      byDate:    rows(resDate),
      byPath:    rows(resPath),
      byCountry: rows(resCountry),
      byDevice:  rows(resDevice),
    });

  } catch (err) {
    return ok({ error: `Error interno: ${err.message}`, byDate: [], byPath: [], byCountry: [], byDevice: [] });
  }
}

function ok(data) {
  return new Response(JSON.stringify(data), {
    status:  200,  // always 200 so CF Pages doesn't serve its own error page
    headers: { "Content-Type": "application/json", "Cache-Control": "s-maxage=120" },
  });
}

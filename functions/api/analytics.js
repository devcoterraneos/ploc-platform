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
    return json({ error: "CF_API_TOKEN not configured" }, 500);
  }

  const url    = new URL(request.url);
  const days   = Math.min(parseInt(url.searchParams.get("days") ?? "30"), 30);
  const now    = new Date();
  const since  = new Date(now - days * 86400000).toISOString().split("T")[0];
  const until  = now.toISOString().split("T")[0];

  const filter = `{AND: [{siteTag: "${SITE_TAG}"}, {date_geq: "${since}"}, {date_leq: "${until}"}]}`;

  const query = `{
    viewer {
      accounts(filter: {accountTag: "${ACCOUNT_ID}"}) {
        byDate: rumPageloadEventsAdaptiveGroups(
          filter: ${filter}
          limit: 31
          orderBy: [date_ASC]
        ) {
          sum { visits pageViews }
          dimensions { date }
        }
        byPath: rumPageloadEventsAdaptiveGroups(
          filter: ${filter}
          limit: 8
          orderBy: [sum_visits_DESC]
        ) {
          sum { visits }
          dimensions { requestPath }
        }
        byCountry: rumPageloadEventsAdaptiveGroups(
          filter: ${filter}
          limit: 8
          orderBy: [sum_visits_DESC]
        ) {
          sum { visits }
          dimensions { countryName }
        }
        byDevice: rumPageloadEventsAdaptiveGroups(
          filter: ${filter}
          limit: 5
          orderBy: [sum_visits_DESC]
        ) {
          sum { visits }
          dimensions { deviceType }
        }
      }
    }
  }`;

  try {
    const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const text = await res.text();
      return json({ error: `Cloudflare API error ${res.status}: ${text}` }, 502);
    }

    const data = await res.json();

    if (data.errors) {
      return json({ error: data.errors[0]?.message ?? "GraphQL error" }, 502);
    }

    const account = data?.data?.viewer?.accounts?.[0];
    if (!account) {
      return json({ byDate: [], byPath: [], byCountry: [], byDevice: [] }, 200);
    }

    return json({
      byDate:    account.byDate    ?? [],
      byPath:    account.byPath    ?? [],
      byCountry: account.byCountry ?? [],
      byDevice:  account.byDevice  ?? [],
    }, 200);

  } catch (err) {
    return json({ error: err.message ?? "Unknown error" }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=300", // cache 5 min
    },
  });
}

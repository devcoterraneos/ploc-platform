/**
 * POST /api/flow/create
 * Creates a Flow payment order and saves a pending donation to Supabase.
 *
 * Body: { amount, campaignId, campaignName, donorName, donorEmail }
 * Returns: { redirectUrl }
 */

async function computeSignature(params, secretKey) {
  const sorted = Object.keys(params).sort();
  const toSign = sorted.map((k) => `${k}${params[k]}`).join("");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(toSign));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const { amount, campaignId, campaignName, donorName, donorEmail } = await request.json();

    if (!amount || !donorEmail) {
      return new Response(JSON.stringify({ error: "Faltan datos requeridos" }), { status: 400, headers: corsHeaders });
    }

    const apiKey    = env.FLOW_API_KEY;
    const secretKey = env.FLOW_SECRET_KEY;
    const baseUrl   = env.NEXT_PUBLIC_BASE_URL ?? "https://corporacionploc.pages.dev";
    const commerceOrder = `PLOC-${Date.now()}`;

    // ── 1. Save pending donation in Supabase ──────────────────────────────────
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: "Variables de entorno de Supabase no configuradas" }), { status: 500, headers: corsHeaders });
    }

    const sbRes = await fetch(`${supabaseUrl}/rest/v1/donations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        commerce_order: commerceOrder,
        campaign_id:    campaignId   ?? null,
        campaign_name:  campaignName ?? null,
        donor_name:     donorName    ?? null,
        donor_email:    donorEmail,
        amount,
        status:         "pending",
      }),
    });

    if (!sbRes.ok) {
      const sbErr = await sbRes.text();
      console.error("Supabase error:", sbRes.status, sbErr);
      return new Response(JSON.stringify({ error: `Supabase error ${sbRes.status}: ${sbErr}` }), { status: 500, headers: corsHeaders });
    }

    // ── 2. Create Flow payment order ──────────────────────────────────────────
    const params = {
      apiKey,
      commerceOrder,
      subject:        `Donación PLOC${campaignName ? " — " + campaignName : ""}`,
      currency:       "CLP",
      amount:         String(amount),
      email:          donorEmail,
      paymentMethod:  "9",
      urlConfirmation: `${baseUrl}/api/flow/confirm`,
      urlReturn:       `${baseUrl}/gracias`,
    };

    const signature = await computeSignature(params, secretKey);

    const form = new URLSearchParams({ ...params, s: signature });
    const flowRes  = await fetch("https://www.flow.cl/api/payment/create", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    form,
    });

    const data = await flowRes.json();

    if (!data.url || !data.token) {
      console.error("Flow error:", data);
      return new Response(JSON.stringify({ error: data.message ?? "Error al crear el pago" }), { status: 502, headers: corsHeaders });
    }

    return new Response(
      JSON.stringify({ redirectUrl: `${data.url}?token=${data.token}` }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error("create.js error:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers: corsHeaders });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

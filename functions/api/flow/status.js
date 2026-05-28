/**
 * GET /api/flow/status?token=TOKEN
 * Queries Flow directly to get the real payment status.
 * Called from the /gracias page after redirect.
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

// Flow status codes: 1=pending 2=paid 3=rejected 4=cancelled
const STATUS_MAP = { 1: "pending", 2: "completed", 3: "rejected", 4: "cancelled" };

export async function onRequestGet(context) {
  const { request, env } = context;

  const origin      = request.headers.get("Origin") ?? "";
  const allowOrigin = origin.includes("corporacionploc") ? origin : "https://corporacionploc.pages.dev";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Content-Type": "application/json",
  };

  const url   = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), { status: 400, headers: corsHeaders });
  }

  const apiKey    = env.FLOW_API_KEY;
  const secretKey = env.FLOW_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.error("status.js: Flow credentials missing");
    return new Response(JSON.stringify({ error: "Config error" }), { status: 500, headers: corsHeaders });
  }

  try {
    const params    = { apiKey, token };
    const signature = await computeSignature(params, secretKey);
    const query     = new URLSearchParams({ ...params, s: signature });

    const flowBase = env.FLOW_MODE === "sandbox"
      ? "https://sandbox.flow.cl/api"
      : "https://www.flow.cl/api";

    const flowRes = await fetch(`${flowBase}/payment/getStatus?${query}`);

    if (!flowRes.ok) {
      console.error("status.js: Flow getStatus error", flowRes.status);
      return new Response(JSON.stringify({ error: `Flow error ${flowRes.status}` }), { status: 502, headers: corsHeaders });
    }

    const payment = await flowRes.json();
    const status  = STATUS_MAP[payment.status] ?? "pending";

    return new Response(
      JSON.stringify({
        status,
        flowOrder:    payment.flowOrder    ?? null,
        amount:       payment.amount       ?? null,
        commerceOrder: payment.commerceOrder ?? null,
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error("status.js error:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions(context) {
  const origin      = context.request.headers.get("Origin") ?? "";
  const allowOrigin = origin.includes("corporacionploc") ? origin : "https://corporacionploc.pages.dev";
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":  allowOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

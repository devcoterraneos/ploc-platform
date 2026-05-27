/**
 * POST /api/flow/confirm
 * Webhook called by Flow after a payment is processed.
 * Verifies payment status and updates the donation in Supabase.
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

// Flow payment status codes
// 1 = pendiente  2 = pagado  3 = rechazado  4 = anulado
const STATUS_MAP = { 1: "pending", 2: "completed", 3: "rejected", 4: "cancelled" };

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const form  = await request.formData();
    const token = form.get("token");

    if (!token) return new Response("Missing token", { status: 400 });

    const apiKey    = env.FLOW_API_KEY;
    const secretKey = env.FLOW_SECRET_KEY;

    // ── 1. Get payment status from Flow ──────────────────────────────────────
    const params    = { apiKey, token };
    const signature = await computeSignature(params, secretKey);
    const query     = new URLSearchParams({ ...params, s: signature });

    const flowRes = await fetch(`https://www.flow.cl/api/payment/getStatus?${query}`);
    const payment = await flowRes.json();

    const status = STATUS_MAP[payment.status] ?? "unknown";

    // ── 2. Update donation in Supabase ────────────────────────────────────────
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = env.SUPABASE_SERVICE_ROLE_KEY;

    const updateBody = {
      status,
      flow_token:    token,
      flow_order:    payment.flowOrder      ?? null,
      payment_date:  payment.paymentDate    ?? null,
      payer_email:   payment.payer          ?? null,
      flow_raw:      payment,
    };

    // Only mark paid_at for completed payments
    if (status === "completed") {
      updateBody.paid_at = new Date().toISOString();
    }

    await fetch(
      `${supabaseUrl}/rest/v1/donations?commerce_order=eq.${encodeURIComponent(payment.commerceOrder)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(updateBody),
      }
    );

    return new Response("OK", { status: 200 });

  } catch (err) {
    console.error("confirm.js error:", err);
    return new Response("Error", { status: 500 });
  }
}

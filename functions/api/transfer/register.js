/**
 * POST /api/transfer/register
 * Registers a pending bank transfer donation submitted by the donor via the modal.
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const { campaignId, campaignName, donorName, donorEmail, amount } =
      await request.json();

    if (!campaignId || !donorName?.trim() || !amount || amount < 1) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl = env.SUPABASE_URL;
    const serviceKey  = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Configuración del servidor incompleta" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/donations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey:          serviceKey,
        Authorization:  `Bearer ${serviceKey}`,
        Prefer:         "return=minimal",
      },
      body: JSON.stringify({
        commerce_order: `TRANSFER-${Date.now()}`,
        campaign_id:    campaignId,
        campaign_name:  campaignName ?? null,
        donor_name:     donorName.trim(),
        donor_email:    donorEmail?.trim() || null,
        amount:         Number(amount),
        status:         "transfer_pending",
        payment_date:   new Date().toISOString().split("T")[0],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(
        JSON.stringify({ error: `DB error: ${err}` }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message ?? "Error interno" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

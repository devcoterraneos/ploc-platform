/**
 * POST /api/upload
 * Uploads a file to Supabase Storage using service role key (bypasses RLS).
 * Multipart form: file field = "file", optional field = "bucket"
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const supabaseUrl = env.SUPABASE_URL;
    const serviceKey  = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: "Storage no configurado" }), { status: 500, headers: corsHeaders });
    }

    const formData = await request.formData();
    const file     = formData.get("file");
    const bucket   = formData.get("bucket") ?? "campaign-images";

    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ error: "No se recibió archivo" }), { status: 400, headers: corsHeaders });
    }

    const ext      = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${Date.now()}.${ext}`;

    // Upload via Supabase Storage REST API (service role bypasses RLS)
    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/${bucket}/${filename}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceKey}`,
          "apikey": serviceKey,
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "true",
        },
        body: await file.arrayBuffer(),
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return new Response(JSON.stringify({ error: `Upload error: ${err}` }), { status: 502, headers: corsHeaders });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
    return new Response(JSON.stringify({ url: publicUrl }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ error: `Error interno: ${err.message}` }), { status: 500, headers: corsHeaders });
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

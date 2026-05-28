import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isConfigured = () => Boolean(supabaseUrl && supabaseKey);

// Use placeholder values during static export build (when env vars are absent).
// isConfigured() guards all actual API calls so placeholders are never used at runtime.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-anon-key",
);

export default supabase;

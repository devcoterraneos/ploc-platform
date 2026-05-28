import { createClient } from "@supabase/supabase-js";

// Public values — anon key is safe to expose (protected by RLS policies).
// Used as fallback when NEXT_PUBLIC_* vars are not injected during build.
const FALLBACK_URL = "https://rypnsrviavrvwwbfncdc.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5cG5zcnZpYXZydnd3YmZuY2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDg1NTEsImV4cCI6MjA5NTQ4NDU1MX0.V-JbeoZsHZA8DoUj2IOdWGYSWf7uh4i4sxaGuPBocWE";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL  || FALLBACK_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const isConfigured = () => true;
export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

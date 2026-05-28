import { createClient } from "@supabase/supabase-js";

// Public values — anon key is safe to hardcode (designed to be public, protected by RLS).
const supabaseUrl = "https://rypnsrviavrvwwbfncdc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5cG5zcnZpYXZydnd3YmZuY2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDg1NTEsImV4cCI6MjA5NTQ4NDU1MX0.V-JbeoZsHZA8DoUj2IOdWGYSWf7uh4i4sxaGuPBocWE";

export const isConfigured = () => true;
export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

/**
 * Supabase client — connect after creating your project at supabase.com
 *
 * Required env vars (add to .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 *   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  (server-side only)
 *
 * Suggested tables:
 *   campaigns, donations, members, transactions, site_settings,
 *   testimonials, metrics, project_categories, admins, flow_config,
 *   news, documents, team_members, pages, media_library
 */

// Uncomment and install @supabase/supabase-js when ready:
// import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Placeholder — replace with real client when Supabase is connected
export const supabase = {
  _url: supabaseUrl,
  _key: supabaseAnonKey,
  isConfigured: () => Boolean(supabaseUrl && supabaseAnonKey),
};

export default supabase;

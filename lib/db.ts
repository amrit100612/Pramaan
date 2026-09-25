import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Public/Browser Supabase client (client-safe)
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin/Server Supabase client using Service Role key
 * WARNING: Never import or use in client components!
 */
export function getAdminDb() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // Return standard client if service role not provided (e.g. initial dev/mock mode)
    return supabaseClient;
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

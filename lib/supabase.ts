import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * IMPORTANT: This direct Supabase client should only be used in:
 * - Server components
 * - API routes
 * - Server actions
 *
 * For client components, use the useSupabase hook instead:
 *
 * import { useSupabase } from "@/components/providers/supabase-provider";
 *
 * function YourComponent() {
 *   const { supabase } = useSupabase();
 *   // Use supabase client here
 * }
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função de utilidade para buscar o perfil do usuário
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("username, id")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

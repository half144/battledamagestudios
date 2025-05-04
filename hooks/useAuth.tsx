// hooks/useAuth.tsx
import { useEffect, useState } from "react";
import { Profile } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useProfileStore } from "@/store/profile";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const { profile } = useProfileStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { supabase } = useSupabase();

  useEffect(() => {
    // Verificar a sessão atual
    const checkSession = async () => {
      setLoading(true);

      try {
        const { data: sessionData, error } = await supabase.auth.getSession();

        console.log("useAuth", { sessionData });

        if (error) {
          console.error("Error getting session:", error);
          setUser(null);

          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setUser(null);
      }

      setLoading(false);
    };

    // Verificar a sessão atual
    checkSession();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  // Definindo isAdmin: só é true se tiver um profile com role 'admin'
  const isAdmin = profile?.role === "admin";

  console.log("Auth state:", { user, profile, isAdmin, loading });

  return { user, profile, isAdmin, loading };
}

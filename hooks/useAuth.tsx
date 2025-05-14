import { useEffect, useState } from "react";
import { getUserProfileApi } from "@/lib/authApi";
import { useProfileStore } from "@/store/profile";

export function useAuth() {
  const { profile, setProfile, setLoading, clearProfile } = useProfileStore();
  const [loading, setLocalLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      setLocalLoading(true);

      try {
        // Buscar o perfil do usuário usando a API REST
        // Esta função já verifica a autenticação internamente
        const userProfile = await getUserProfileApi();

        if (userProfile) {
          // Atualizar o perfil no store
          setProfile(userProfile);
        } else {
          // Falha ao buscar perfil, limpar estado
          clearProfile();
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        clearProfile();
      } finally {
        setLocalLoading(false);
      }
    };

    // Verificar autenticação ao montar o componente
    checkAuth();

    // Configurar um evento de verificação periódica (a cada 5 minutos)
    // ou quando a página voltar a ficar ativa
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    // Limpar listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [setProfile, setLoading, clearProfile]);

  // Definindo isAdmin: só é true se tiver um perfil com role 'admin'
  const isAdmin = profile?.role === "admin";

  return { profile, isAdmin, loading };
}

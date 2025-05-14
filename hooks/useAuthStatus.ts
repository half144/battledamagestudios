import { useAuth } from "@/components/providers/auth-provider";
import { useProfileStore } from "@/store/profile";

/**
 * Hook simplificado para verificar o status de autenticação
 * Combina o contexto de autenticação com os dados de perfil da store
 */
export function useAuthStatus() {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const { profile } = useProfileStore();

  return {
    isAuthenticated,
    profile,
    isLoading,
    checkAuth,
  };
}

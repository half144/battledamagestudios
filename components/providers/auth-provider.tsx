"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useProfileStore } from "@/store/profile";

// Tipo para o contexto de autenticação
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
};

// Criar o contexto com valores padrão
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  checkAuth: async () => {},
});

/**
 * Provider de autenticação simplificado que faz uma única requisição para o servidor
 * Evita tentar acessar cookies httpOnly diretamente
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { profile, setProfile, clearProfile, isAuthenticated } =
    useProfileStore();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Função para verificar a autenticação com o servidor
   */
  const checkAuth = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Fazer uma única requisição para o endpoint de verificação
      const response = await fetch("/api/auth/check", {
        cache: "no-store", // Sempre buscar dados frescos
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await response.json();

      console.log("[Auth Provider] Data received from API:", data); // Debug log

      if (data.authenticated && data.user) {
        console.log("[Auth Provider] User data:", data.user); // Debug log
        // Usuário autenticado, atualizar o perfil na store
        setProfile({
          id: data.user.id,
          email: data.user.email,
          username:
            data.user.username || data.user.email?.split("@")[0] || "Usuário",
          role: data.user.role || "user",
          avatar_url: data.user.avatar_url,
          full_name: data.user.full_name,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at,
          total_spent: data.user.total_spent || 0,
          total_orders: data.user.total_orders || 0,
          member_since: data.user.member_since || data.user.created_at,
        });
      } else {
        // Usuário não está autenticado, limpar o perfil
        clearProfile();
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      // Em caso de erro, assumir que não está autenticado
      clearProfile();
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    checkAuth();

    // Verificar novamente quando a página voltar a ficar visível
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para uso do contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

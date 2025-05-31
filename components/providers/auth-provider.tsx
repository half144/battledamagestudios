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

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

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
    console.log("[Auth Provider] Checking authentication...");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/check", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();
      console.log("[Auth Provider] Auth status response:", data);

      if (data.authenticated && data.user) {
        console.log("[Auth Provider] User authenticated, updating profile");
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
          member_since: data.user.member_since || data.user.created_at,
        });
      } else {
        console.log("[Auth Provider] User not authenticated, clearing profile");
        // Usuário não está autenticado, limpar o perfil
        clearProfile();
      }
    } catch (error) {
      console.error("[Auth Provider] Error checking authentication:", error);
      // Em caso de erro, só limpar se não houver perfil válido no storage
      if (!profile) {
        clearProfile();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    // Se já temos um perfil no storage, não precisamos fazer loading
    if (profile) {
      console.log(
        "[Auth Provider] Profile found in storage, skipping initial loading"
      );
      setIsLoading(false);
      // Ainda assim, verificar em background para garantir que está atualizado
      checkAuth();
    } else {
      console.log("[Auth Provider] No profile in storage, checking auth");
      checkAuth();
    }

    // Verificar novamente quando a página voltar a ficar visível
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("[Auth Provider] Page became visible, checking auth");
        checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Remover profile da dependência para evitar loops

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

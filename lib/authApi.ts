import { SUPABASE_URL, SUPABASE_API_KEY } from "./supabaseApi";
import { ProfileData } from "@/store/profile";

// Nome do cookie de autenticação do Supabase (apenas para referência)
const AUTH_COOKIE_NAME = "sb-rnqhnainrwsbyeyvttcm-auth-token";

/**
 * Obtém os dados do usuário autenticado diretamente do servidor Next.js
 * @returns Dados do usuário ou null se não estiver autenticado
 */
export const getUserProfileApi = async (): Promise<ProfileData | null> => {
  try {
    // Fazer a requisição para o endpoint que verifica a autenticação
    const response = await fetch("/api/auth/check");

    if (!response.ok) {
      throw new Error("Falha ao obter dados do usuário");
    }

    const data = await response.json();

    if (!data.authenticated || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email,
      username: data.user.username || data.user.email?.split("@")[0] || "user",
      role: data.user.role || "user",
    };
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }
};

/**
 * Realiza login usando a API REST do Supabase
 * @param email Email do usuário
 * @param password Senha do usuário
 * @returns Sucesso ou erro da operação
 */
export const signInWithEmailApi = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Endpoint padrão de autorização do Supabase
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_API_KEY || "",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error_description || "Falha na autenticação",
      };
    }

    const authData = await response.json();

    // Configurar cookies de sessão no servidor
    const cookieSetSuccess = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: {
          access_token: authData.access_token,
          refresh_token: authData.refresh_token,
        },
      }),
    });

    if (!cookieSetSuccess.ok) {
      console.error("Erro ao configurar cookies de sessão no servidor");
      return {
        success: false,
        error: "Erro ao configurar a sessão",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro no processo de login:", error);
    return {
      success: false,
      error: "Erro inesperado durante o login",
    };
  }
};

/**
 * Realiza logout usando a API REST do Supabase
 * @returns Sucesso ou erro da operação
 */
export const signOutApi = async (): Promise<boolean> => {
  try {
    // Remover os cookies de sessão no servidor
    const response = await fetch("/api/auth/session", {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return false;
  }
};

/**
 * Registra um novo usuário usando a API REST do Supabase
 * @param email Email do usuário
 * @param password Senha do usuário
 * @param username Nome de usuário
 * @returns Resultado da operação
 */
export const signUpWithEmailApi = async (
  email: string,
  password: string,
  username: string
): Promise<{ success: boolean; error?: string; userId?: string }> => {
  try {
    // Endpoint padrão de registro do Supabase
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_API_KEY || "",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error_description || "Falha no registro",
      };
    }

    const userData = await response.json();

    // Criar perfil associado ao usuário
    if (userData && userData.id) {
      const accessToken = userData.access_token;

      if (accessToken) {
        // Criar perfil na tabela profiles
        const profileResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              apikey: SUPABASE_API_KEY || "",
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              id: userData.id,
              username,
              role: "user",
              created_at: new Date().toISOString(),
            }),
          }
        );

        if (!profileResponse.ok) {
          console.error(
            "Erro ao criar perfil para o usuário:",
            await profileResponse.text()
          );
        }
      }

      return {
        success: true,
        userId: userData.id,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro no processo de registro:", error);
    return {
      success: false,
      error: "Erro inesperado durante o registro",
    };
  }
};

/**
 * Sincroniza a sessão com o servidor
 * @returns Sucesso ou falha da operação
 */
export const syncSessionApi = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const response = await fetch("/api/auth/check");

    if (!response.ok) {
      return { success: false, error: "Erro ao verificar sessão" };
    }

    const data = await response.json();

    return {
      success: data.authenticated,
      error: data.authenticated ? undefined : "Sessão inválida ou expirada",
    };
  } catch (error) {
    console.error("Erro ao sincronizar sessão:", error);
    return {
      success: false,
      error: "Erro inesperado durante a sincronização",
    };
  }
};

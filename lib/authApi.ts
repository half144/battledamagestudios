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
    const response = await fetch("/api/auth/sync-session", { method: "POST" });
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Session sync failed",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error syncing session:", error);
    return { success: false, error: "Unexpected error during session sync" };
  }
};

// Tipagem para os pedidos e seus itens
export interface OrderItemProduct {
  name: string;
  image_url?: string | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number; // Preço no momento da compra do item
  products: OrderItemProduct | null; // Nome do produto e imagem
}

export interface UserOrder {
  id: string; // Order ID
  created_at: string; // Data do pedido
  payment_status: string | null; // Status do pagamento (ex: 'paid', 'unpaid')
  total_price: number; // Total do pedido
  order_items: OrderItem[]; // Itens do pedido
  // Adicionar quaisquer outros campos de 'orders' que você queira exibir
}

/**
 * Busca os pedidos de um usuário específico, incluindo os itens de cada pedido e nome/imagem dos produtos.
 * @param userId ID do usuário
 * @returns Array de pedidos do usuário ou null em caso de erro.
 */
export const getUserOrders = async (
  userId: string
): Promise<UserOrder[] | null> => {
  if (!userId) return null;

  try {
    const response = await fetch(`/api/users/${userId}/orders`);

    if (!response.ok) {
      console.error(
        `Failed to fetch orders for user ${userId}: ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    return data.orders as UserOrder[];
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    return null;
  }
};

/**
 * Atualiza os dados do perfil do usuário
 * @param profileData Dados do perfil a serem atualizados
 * @returns Resultado da operação
 */
export const updateUserProfileApi = async (profileData: {
  full_name?: string;
  avatar_url?: string;
}): Promise<{ success: boolean; error?: string; profile?: any }> => {
  try {
    const response = await fetch("/api/profile/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to update profile",
      };
    }

    return {
      success: true,
      profile: data.profile,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: "Unexpected error during profile update",
    };
  }
};

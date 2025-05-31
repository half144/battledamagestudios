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
    const response = await fetch("/api/auth/check", { cache: "no-store" });

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
      avatar_url: data.user.avatar_url,
      full_name: data.user.full_name,
      created_at: data.user.created_at,
      updated_at: data.user.updated_at,
      total_spent: data.user.total_spent || 0,
      member_since: data.user.member_since || data.user.created_at,
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
    console.log(
      "[SignUp] Starting registration process for:",
      email,
      "with username:",
      username
    );

    // Endpoint padrão de registro do Supabase
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_API_KEY || "",
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          username: username,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[SignUp] Auth signup failed:", errorData);
      return {
        success: false,
        error: errorData.error_description || "Registration failed",
      };
    }

    const userData = await response.json();
    console.log("[SignUp] Auth signup successful:", userData);

    // Check if user was created successfully
    if (userData && userData.user && userData.user.id) {
      const userId = userData.user.id;
      console.log("[SignUp] User created successfully with ID:", userId);

      // The profile should be created automatically by the database trigger
      // Wait a moment for the trigger to execute
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify that the profile was created
      try {
        const profileCheck = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=id,username`,
          {
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_API_KEY || "",
            },
          }
        );

        if (profileCheck.ok) {
          const profiles = await profileCheck.json();
          if (profiles && profiles.length > 0) {
            console.log(
              "[SignUp] Profile created successfully by trigger:",
              profiles[0]
            );
          } else {
            console.warn("[SignUp] Profile not found after trigger execution");
          }
        }
      } catch (profileError) {
        console.warn(
          "[SignUp] Could not verify profile creation:",
          profileError
        );
      }

      return {
        success: true,
        userId: userId,
      };
    }

    console.error("[SignUp] Invalid user data received:", userData);
    return {
      success: false,
      error: "Invalid response from authentication service.",
    };
  } catch (error) {
    console.error("[SignUp] Unexpected error during registration:", error);
    return {
      success: false,
      error: "Unexpected error during registration. Please try again.",
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

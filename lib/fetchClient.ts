import { SUPABASE_URL, SUPABASE_API_KEY } from "./supabaseApi";

// Tipos
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
  noAuth?: boolean; // Se true, não tenta verificar autenticação para chamadas Supabase
};

// Função para obter a URL base do ambiente atual (browser ou server)
function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Garante que NEXT_PUBLIC_SITE_URL tenha um fallback para desenvolvimento local se não estiver definida
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/**
 * Função para buscar o token de autenticação da API interna.
 * Usa o fetch nativo para evitar recursão com o fetchClient.
 */
async function getApiAuthToken(): Promise<string | null> {
  try {
    const baseUrl = getBaseUrl();
    // Usa fetch nativo aqui para evitar chamar o próprio fetchClient em loop
    const response = await fetch(`${baseUrl}/api/auth/token`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        // Não precisa de 'Content-Type' para GET sem corpo
      },
      cache: "no-store", // Garante que a chamada não seja cacheada
      credentials: "include", // Essencial para enviar cookies para a API interna
    });

    if (!response.ok) {
      // Não é necessariamente um erro se o token não for encontrado (ex: usuário não logado)
      // A API /api/auth/token deve retornar 404 nesse caso, que é tratado aqui.
      // console.warn(`[fetchClient:getApiAuthToken] Falha ao buscar token: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data.token || null; // Espera que a API retorne { token: "valor" }
  } catch (error) {
    console.error(
      "[fetchClient:getApiAuthToken] Erro ao buscar token da API:",
      error
    );
    return null;
  }
}

/**
 * Função para verificar se o usuário está autenticado (chamada internamente)
 */
async function isUserAuthenticated(): Promise<boolean> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/check`, {
      method: "GET",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      cache: "no-store",
      credentials: "include",
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error(
      "[isUserAuthenticated] Erro ao verificar autenticação:",
      error
    );
    return false;
  }
}

const fetchClient = {
  async request<T = any>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const isInternalApiCall = endpoint.startsWith("/api/");
    let url: string;

    if (isInternalApiCall) {
      const baseUrl = getBaseUrl();
      url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;
    } else {
      url = endpoint.startsWith("http")
        ? endpoint
        : `${SUPABASE_URL}${endpoint}`;
    }

    const headers: Record<string, string> = { ...options.headers };
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Adicionar token de autenticação para chamadas de API internas,
    // exceto para a própria rota de obtenção de token e se noAuth for true.
    if (endpoint !== "/api/auth/token" && endpoint !== "/api/auth/check") {
      const authToken = await getApiAuthToken();
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
    }

    if (!isInternalApiCall && !endpoint.startsWith("http")) {
      headers["apikey"] = SUPABASE_API_KEY as string;
      // Não adicionamos 'Authorization: Bearer' aqui diretamente.
      // Se RLS estiver ativa, o Supabase JS client (se usado) deve cuidar de enviar o token JWT.
      // Ou, para algumas APIs, pode não ser necessário se a apikey for suficiente e RLS permitir.
    }

    let bodyToUse: string | FormData | undefined = undefined;
    if (options.body) {
      if (options.body instanceof FormData) {
        bodyToUse = options.body;
        delete headers["Content-Type"];
      } else {
        bodyToUse = JSON.stringify(options.body);
      }
    }

    const credentialsSetting: RequestCredentials = isInternalApiCall
      ? "include"
      : "omit";

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: bodyToUse,
        signal: options.signal,
        cache: "no-store",
        credentials: credentialsSetting,
      });

      const responseBodyText = await response.text();

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = JSON.parse(responseBodyText);
        } catch (e) {
          errorData = responseBodyText || response.statusText;
        }
        console.error(
          `[fetchClient] Erro HTTP ${response.status} para ${url}. Detalhes:`,
          errorData
        );
        throw {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          message:
            (typeof errorData === "object" &&
              errorData !== null &&
              (errorData.message || errorData.error)) ||
            (typeof errorData === "string" && errorData) ||
            `Erro ${response.status}: ${response.statusText}`,
        };
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          return JSON.parse(responseBodyText);
        } catch (e) {
          console.warn(
            `[fetchClient] Resposta OK para ${url} (JSON), mas falha ao analisar. Corpo (parcial):`,
            responseBodyText.substring(0, 200)
          );
          return responseBodyText as T;
        }
      } else {
        return (responseBodyText ? responseBodyText : { success: true }) as T;
      }
    } catch (error: any) {
      if (!error.status) {
        // Se não for um erro HTTP já processado
        console.error(
          `[fetchClient] Erro crítico na requisição para ${url}:`,
          error
        );
      }
      throw error;
    }
  },

  get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", endpoint, options);
  },
  post<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("POST", endpoint, { ...options, body: data });
  },
  put<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, { ...options, body: data });
  },
  patch<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("PATCH", endpoint, { ...options, body: data });
  },
  delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", endpoint, options);
  },
  upload<T = any>(
    endpoint: string,
    file: File,
    path?: string,
    options?: RequestOptions
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);
    if (path) formData.append("path", path);
    return this.request<T>("POST", endpoint, { ...options, body: formData });
  },
};

export default fetchClient;

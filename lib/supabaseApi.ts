// lib/supabaseApi.ts
// Utilitários para trabalhar com a API REST do Supabase

// URL base da API do Supabase e chave API
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificar se as variáveis de ambiente estão configuradas
if (!SUPABASE_URL || !SUPABASE_API_KEY) {
  console.error("Supabase environment variables are not set properly");
}

/**
 * Gera os cabeçalhos padrão para requisições à API REST do Supabase (acesso anônimo)
 * @returns Objeto com os cabeçalhos necessários
 */
export const getApiHeaders = () => {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_API_KEY as string,
    Authorization: `Bearer ${SUPABASE_API_KEY}`,
    Prefer: "return=representation",
  };
};

/**
 * Gera os cabeçalhos para requisições autenticadas à API REST do Supabase
 * @param accessToken Token de acesso do usuário autenticado
 * @returns Objeto com os cabeçalhos necessários incluindo o token de autenticação
 */
export const getAuthenticatedHeaders = (accessToken: string) => {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_API_KEY as string,
    Authorization: `Bearer ${accessToken}`,
    Prefer: "return=representation",
  };
};

import { StoreProduct } from "@/types/store-item";
import { v4 as uuidv4 } from "uuid";
import fetchClient from "./fetchClient";
import { SUPABASE_URL, SUPABASE_API_KEY } from "./supabaseApi";

/**
 * Função para fazer requisições públicas ao Supabase (sem autenticação)
 */
async function publicSupabaseRequest<T = any>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
  } = {}
): Promise<T> {
  const { method = "GET", body } = options;

  const headers: Record<string, string> = {
    apikey: SUPABASE_API_KEY as string,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`Supabase API Error: ${response.status}`, errorData);
    throw new Error(`Supabase API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Busca todos os produtos da loja (PÚBLICO - sem autenticação)
 * @param filters Filtros opcionais para a busca
 * @returns Array de produtos encontrados ou array vazio em caso de erro
 */
export async function fetchProductsPublicApi(filters?: {
  category?: string;
  active?: boolean;
}): Promise<StoreProduct[]> {
  try {
    // Construir a URL com os filtros
    let url = `/rest/v1/products?order=created_at.desc`;

    if (filters?.category) {
      url += `&category=eq.${filters.category}`;
    }

    if (filters?.active !== undefined) {
      url += `&active=eq.${filters.active}`;
    }

    const products = await publicSupabaseRequest<StoreProduct[]>(url);
    return products;
  } catch (err) {
    console.error("Erro ao buscar produtos (público):", err);
    return [];
  }
}

/**
 * Busca um produto pelo ID (PÚBLICO - sem autenticação)
 * @param productId ID do produto a ser buscado
 * @returns Produto encontrado ou null em caso de erro
 */
export async function fetchProductByIdPublicApi(
  productId: string
): Promise<StoreProduct | null> {
  try {
    const url = `/rest/v1/products?id=eq.${productId}`;
    const products = await publicSupabaseRequest<StoreProduct[]>(url);

    if (!products || products.length === 0) {
      console.log(`Nenhum produto encontrado com ID ${productId}`);
      return null;
    }

    return products[0];
  } catch (err) {
    console.error(`Erro ao buscar produto ${productId} (público):`, err);
    return null;
  }
}

// === FUNÇÕES ADMINISTRATIVAS (requerem autenticação) ===

/**
 * Cria um novo produto na loja usando a API REST do Supabase
 * @param productData Dados do produto a ser criado
 * @returns ID do produto criado ou null em caso de erro
 */
export async function createProductApi(
  productData: Omit<StoreProduct, "id" | "created_at">
): Promise<string | null> {
  try {
    // Gerar um ID para o novo produto
    const productId = uuidv4();

    // Criar o objeto com todos os campos necessários
    const completeData = {
      ...productData,
      id: productId,
      created_at: new Date().toISOString(),
    };

    // Enviar a requisição para a API REST
    await fetchClient.post("/rest/v1/products", completeData);

    console.log("Produto criado com sucesso!");
    return productId;
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    return null;
  }
}

/**
 * Atualiza um produto existente usando a API REST do Supabase
 * @param productId ID do produto a ser atualizado
 * @param productData Dados do produto a serem atualizados
 * @returns true se a operação foi bem-sucedida, false caso contrário
 */
export async function updateProductApi(
  productId: string,
  productData: Partial<StoreProduct>
): Promise<boolean> {
  try {
    await fetchClient.patch(
      `/rest/v1/products?id=eq.${productId}`,
      productData
    );
    return true;
  } catch (err) {
    console.error(`Erro ao atualizar produto ${productId}:`, err);
    return false;
  }
}

/**
 * Busca todos os produtos da loja usando a API REST do Supabase (ADMIN)
 * @param filters Filtros opcionais para a busca
 * @returns Array de produtos encontrados ou array vazio em caso de erro
 */
export async function fetchProductsApi(filters?: {
  category?: string;
  active?: boolean;
}): Promise<StoreProduct[]> {
  try {
    // Construir a URL com os filtros
    let url = `/rest/v1/products?order=created_at.desc`;

    if (filters?.category) {
      url += `&category=eq.${filters.category}`;
    }

    if (filters?.active !== undefined) {
      url += `&active=eq.${filters.active}`;
    }

    // Query com o cliente fetch
    const products = await fetchClient.get(url);
    return products as StoreProduct[];
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return [];
  }
}

/**
 * Busca um produto pelo ID usando a API REST do Supabase (ADMIN)
 * @param productId ID do produto a ser buscado
 * @returns Produto encontrado ou null em caso de erro
 */
export async function fetchProductByIdApi(
  productId: string
): Promise<StoreProduct | null> {
  try {
    const url = `/rest/v1/products?id=eq.${productId}`;
    const products = await fetchClient.get(url);

    if (!products || products.length === 0) {
      console.log(`Nenhum produto encontrado com ID ${productId}`);
      return null;
    }

    return products[0] as StoreProduct;
  } catch (err) {
    console.error(`Erro ao buscar produto ${productId}:`, err);
    return null;
  }
}

/**
 * Exclui um produto usando a API REST do Supabase
 * @param productId ID do produto a ser excluído
 * @returns true se a operação foi bem-sucedida, false caso contrário
 */
export async function deleteProductApi(productId: string): Promise<boolean> {
  try {
    await fetchClient.delete(`/rest/v1/products?id=eq.${productId}`);
    return true;
  } catch (err) {
    console.error(`Erro ao excluir produto ${productId}:`, err);
    return false;
  }
}

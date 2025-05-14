import { Media } from "@/types/media";
import { SUPABASE_URL } from "./supabaseApi";
import { v4 as uuidv4 } from "uuid";
import fetchClient from "./fetchClient";

/**
 * Cria uma nova mídia usando a API REST do Supabase
 * @param mediaData Dados da mídia a ser criada
 * @returns ID da mídia criada ou null em caso de erro
 */
export async function createMediaApi(
  mediaData: Omit<Media, "id" | "data_criacao" | "visualizacoes">
): Promise<string | null> {
  try {
    // Gerar um ID para a nova mídia
    const mediaId = uuidv4();

    // Adicionar campos adicionais necessários
    const completeMediaData = {
      ...mediaData,
      id: mediaId,
      data_criacao: new Date().toISOString(),
      visualizacoes: 0,
    };

    // Enviar a requisição para a API REST
    await fetchClient.post("/rest/v1/medias", completeMediaData);

    console.log("Media created successfully!");
    return mediaId;
  } catch (err) {
    console.error("Unexpected error creating media:", err);
    return null;
  }
}

/**
 * Atualiza uma mídia existente usando a API REST do Supabase
 * @param mediaId ID da mídia a ser atualizada
 * @param mediaData Dados da mídia a serem atualizados
 * @returns true se a operação foi bem-sucedida, false caso contrário
 */
export async function updateMediaApi(
  mediaId: string,
  mediaData: Partial<Media>
): Promise<boolean> {
  try {
    await fetchClient.patch(`/rest/v1/medias?id=eq.${mediaId}`, mediaData);
    return true;
  } catch (err) {
    console.error(`Unexpected error updating media ${mediaId}:`, err);
    return false;
  }
}

/**
 * Busca todas as mídias usando a API REST do Supabase
 * @param filters Filtros opcionais para a busca
 * @returns Array de mídias encontradas ou array vazio em caso de erro
 */
export async function fetchMediasApi(filters?: {
  tipo_media?: string;
  categoria?: string;
}): Promise<Media[]> {
  try {
    // Construir a URL com os filtros
    let url = `/rest/v1/medias?order=data_criacao.desc`;

    if (filters?.tipo_media) {
      url += `&tipo_media=eq.${filters.tipo_media}`;
    }

    if (filters?.categoria) {
      url += `&categoria=eq.${filters.categoria}`;
    }

    // Query com o cliente fetch
    const medias = await fetchClient.get(url);
    return medias as Media[];
  } catch (err) {
    console.error("Unexpected error fetching medias:", err);
    return [];
  }
}

/**
 * Busca uma mídia pelo ID usando a API REST do Supabase
 * @param mediaId ID da mídia a ser buscada
 * @returns Mídia encontrada ou null em caso de erro
 */
export async function fetchMediaByIdApi(
  mediaId: string
): Promise<Media | null> {
  try {
    const url = `/rest/v1/medias?id=eq.${mediaId}`;
    const medias = await fetchClient.get(url);

    if (!medias || medias.length === 0) {
      console.log(`No media found with ID ${mediaId}`);
      return null;
    }

    return medias[0] as Media;
  } catch (err) {
    console.error(`Unexpected error fetching media ${mediaId}:`, err);
    return null;
  }
}

/**
 * Exclui uma mídia usando a API REST do Supabase
 * @param mediaId ID da mídia a ser excluída
 * @returns true se a operação foi bem-sucedida, false caso contrário
 */
export async function deleteMediaApi(mediaId: string): Promise<boolean> {
  try {
    await fetchClient.delete(`/rest/v1/medias?id=eq.${mediaId}`);
    return true;
  } catch (err) {
    console.error(`Unexpected error deleting media ${mediaId}:`, err);
    return false;
  }
}

/**
 * Incrementa o contador de visualizações de uma mídia
 * @param mediaId ID da mídia a ter visualizações incrementadas
 * @returns true se a operação foi bem-sucedida, false caso contrário
 */
export async function incrementViewsApi(mediaId: string): Promise<boolean> {
  try {
    // Primeiro, buscar a mídia para obter o número atual de visualizações
    const media = await fetchMediaByIdApi(mediaId);

    if (!media) {
      return false;
    }

    // Incrementar visualizações
    const updatedViews = (media.visualizacoes || 0) + 1;

    // Atualizar a mídia
    return await updateMediaApi(mediaId, { visualizacoes: updatedViews });
  } catch (err) {
    console.error(
      `Unexpected error incrementing views for media ${mediaId}:`,
      err
    );
    return false;
  }
}

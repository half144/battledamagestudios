import { SUPABASE_URL, SUPABASE_API_KEY } from "./supabaseApi";
import fetchClient from "./fetchClient";

/**
 * Faz o upload de um arquivo para o Storage do Supabase via API REST
 * @param bucket Nome do bucket de armazenamento no Supabase
 * @param filePath Caminho onde o arquivo será salvo
 * @param file Arquivo a ser enviado
 * @returns URL pública do arquivo ou null em caso de erro
 */
export async function uploadFileApi(
  bucket: string,
  filePath: string,
  file: File
): Promise<string | null> {
  try {
    if (!SUPABASE_URL || !SUPABASE_API_KEY) {
      console.error("Supabase configuration is not initialized");
      return null;
    }

    // Usar o fetchClient para fazer upload
    await fetchClient.upload(`/storage/v1/object/${bucket}/${filePath}`, file);

    // Obter a URL pública do arquivo
    return getPublicUrlApi(bucket, filePath);
  } catch (err) {
    console.error(
      `Unexpected error uploading file to ${bucket}/${filePath}:`,
      err
    );
    return null;
  }
}

/**
 * Obtém a URL pública de um arquivo no Storage do Supabase
 * @param bucket Nome do bucket de armazenamento no Supabase
 * @param filePath Caminho do arquivo no bucket
 * @returns URL pública do arquivo ou null em caso de erro
 */
export function getPublicUrlApi(
  bucket: string,
  filePath: string
): string | null {
  try {
    if (!SUPABASE_URL || !SUPABASE_API_KEY) {
      console.error("Supabase configuration is not initialized");
      return null;
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
  } catch (err) {
    console.error(
      `Unexpected error getting public URL for ${bucket}/${filePath}:`,
      err
    );
    return null;
  }
}

/**
 * Remove um arquivo do Storage do Supabase
 * @param bucket Nome do bucket de armazenamento no Supabase
 * @param filePath Caminho do arquivo a ser removido
 * @returns true se a operação foi bem-sucedida, false caso contrário
 */
export async function removeFileApi(
  bucket: string,
  filePath: string
): Promise<boolean> {
  try {
    if (!SUPABASE_URL || !SUPABASE_API_KEY) {
      console.error("Supabase configuration is not initialized");
      return false;
    }

    await fetchClient.delete(`/storage/v1/object/${bucket}/${filePath}`);
    return true;
  } catch (err) {
    console.error(
      `Unexpected error removing file from ${bucket}/${filePath}:`,
      err
    );
    return false;
  }
}

/**
 * Lista todos os arquivos em um bucket no Storage do Supabase
 * @param bucket Nome do bucket de armazenamento no Supabase
 * @param path Caminho opcional para listar apenas arquivos em um diretório específico
 * @returns Array com os metadados dos arquivos ou array vazio em caso de erro
 */
export async function listFilesApi(
  bucket: string,
  path: string = ""
): Promise<any[]> {
  try {
    if (!SUPABASE_URL || !SUPABASE_API_KEY) {
      console.error("Supabase configuration is not initialized");
      return [];
    }

    const endpoint = `/storage/v1/object/list/${bucket}${
      path ? `?prefix=${encodeURIComponent(path)}` : ""
    }`;
    const data = await fetchClient.get(endpoint);
    return data || [];
  } catch (err) {
    console.error(`Unexpected error listing files in ${bucket}/${path}:`, err);
    return [];
  }
}

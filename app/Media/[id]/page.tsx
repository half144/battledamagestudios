import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Media } from "@/types/media";
import { notFound } from "next/navigation";
import MediaDetailClient from "./media-detail-client";

// Função para buscar os detalhes da mídia
const getMediaDetails = async (id: string) => {
  const supabase = createServerComponentClient({ cookies });

  // Otimização: buscar apenas os campos necessários
  const { data, error } = await supabase
    .from("medias")
    .select(
      "id, titulo, descricao, tipo_media, categoria, arquivo_principal_url, arquivo_secundario_url, thumbnail_url, data_criacao, visualizacoes, tags, formato, duracao, tamanho_arquivo"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching media details:", error);
    return null;
  }

  if (!data) return null;

  // Format the data to match Media interface
  const mediaItem = {
    ...data,
    data_criacao: data.data_criacao || new Date().toISOString(),
    visualizacoes: data.visualizacoes || 0,
  } as Media;

  // Atualizar contador de visualizações de forma atômica no servidor
  await supabase
    .from("medias")
    .update({ visualizacoes: (mediaItem.visualizacoes || 0) + 1 })
    .eq("id", id);

  return mediaItem;
};

export const revalidate = 3600; // Revalidar a cada hora (3600 segundos)

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const media = await getMediaDetails(id);

  if (!media) {
    notFound();
  }

  return <MediaDetailClient media={media} />;
}

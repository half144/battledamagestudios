import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Media } from "@/types/media";
import { notFound } from "next/navigation";
import MediaDetailClient from "./media-detail-client";

// Function to fetch media details
const getMediaDetails = async (id: string) => {
  const supabase = createServerComponentClient({ cookies });

  // Optimization: fetch only necessary fields
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

  // Update view count atomically on the server
  await supabase
    .from("medias")
    .update({ visualizacoes: (mediaItem.visualizacoes || 0) + 1 })
    .eq("id", id);

  return mediaItem;
};

// Disable static rendering for this page
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour (3600 seconds)

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

import { cookies } from "next/headers";
import MediaClient from "./media-client";
import { Media } from "@/types/media";
import { fetchMediasApi } from "@/lib/mediaApi";

// Cache-enabled fetch function
const getMediaData = async () => {
  try {
    // Buscar mídias usando a API REST
    const medias = await fetchMediasApi();

    // Extrair jogos únicos (do campo categoria)
    const games = Array.from(new Set(medias.map((item) => item.categoria)));

    // Extrair todas as tags únicas
    const allTags = Array.from(
      new Set(medias.flatMap((item) => item.tags || []))
    );

    return { medias, games, allTags };
  } catch (error) {
    console.error("Error fetching media:", error);
    throw new Error("Failed to load media data");
  }
};

// Disable static rendering for this page
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour (3600 seconds)

export default async function MediaPage() {
  const { medias, games, allTags } = await getMediaData();

  return <MediaClient medias={medias} games={games} allTags={allTags} />;
}

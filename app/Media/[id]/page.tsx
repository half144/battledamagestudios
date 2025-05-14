import { cookies } from "next/headers";
import { Media } from "@/types/media";
import { notFound } from "next/navigation";
import MediaDetailClient from "./media-detail-client";
import { fetchMediaByIdApi, incrementViewsApi } from "@/lib/mediaApi";

// Function to fetch media details
const getMediaDetails = async (id: string) => {
  // Buscar mídia usando a API REST
  const media = await fetchMediaByIdApi(id);

  if (!media) return null;

  // Incrementar contador de visualizações
  await incrementViewsApi(id);

  return media;
};

// Disable static rendering for this page
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour (3600 seconds)

interface PageParams {
  id: string;
}

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const media = await getMediaDetails(id);

  if (!media) {
    notFound();
  }

  return <MediaDetailClient media={media} />;
}

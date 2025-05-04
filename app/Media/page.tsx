import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import MediaClient from "./media-client";
import { Media } from "@/types/media";

// Cache-enabled fetch function
const getMediaData = async () => {
  const supabase = createServerComponentClient({ cookies });

  // Fetch medias from Supabase
  const { data, error } = await supabase.from("medias").select("*");

  if (error) {
    console.error("Error fetching media:", error);
    throw new Error("Failed to load media data");
  }

  // Convert data to match Media interface
  const medias = data?.map((item) => ({
    ...item,
    // Ensure data_criacao is a string
    data_criacao: item.data_criacao || new Date().toISOString(),
    // Initialize visualizacoes if not present
    visualizacoes: item.visualizacoes || 0,
  })) as Media[];

  // Extract unique games (from categoria field)
  const games = Array.from(new Set(data.map((item) => item.categoria)));

  // Extract all unique tags
  const allTags = Array.from(new Set(data.flatMap((item) => item.tags || [])));

  return { medias, games, allTags };
};

// Disable static rendering for this page
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour (3600 seconds)

export default async function MediaPage() {
  const { medias, games, allTags } = await getMediaData();

  return <MediaClient medias={medias} games={games} allTags={allTags} />;
}

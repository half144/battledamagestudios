"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ImageIcon,
  VideoIcon,
  Music2Icon,
  Box,
  ClockIcon,
  FileIcon,
  EyeIcon,
  TagIcon,
  CalendarIcon,
  DownloadIcon,
} from "lucide-react";
import { Media } from "../page";
import { STLViewer } from "@/components/media/stl-viewer";
import Image from "next/image";

export default function MediaDetailPage() {
  const params = useParams();
  const { id } = params;
  const { supabase } = useSupabase();
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);

        // Fetch data from Supabase
        const { data, error } = await supabase
          .from("medias")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          // Format the data to match Media interface
          const mediaItem = {
            ...data,
            // Ensure data_criacao is a string
            data_criacao: data.data_criacao || new Date().toISOString(),
            // Initialize visualizacoes if not present
            visualizacoes: data.visualizacoes || 0,
          };

          setMedia(mediaItem as Media);

          // Update view count
          const { error: updateError } = await supabase
            .from("medias")
            .update({ visualizacoes: (mediaItem.visualizacoes || 0) + 1 })
            .eq("id", id);

          if (updateError) {
            console.error("Error updating view count:", updateError);
          }
        } else {
          setError("Media not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMediaDetails();
    }
  }, [id, supabase]);

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";

    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(2) + " GB";
  };

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";

    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // Render the media content based on type
  const renderMediaContent = () => {
    if (!media) return null;

    switch (media.tipo_media) {
      case "imagem":
        return (
          <div className="relative w-full aspect-video bg-black flex items-center justify-center">
            <Image
              src={media.arquivo_principal_url}
              alt={media.titulo}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
        );

      case "video":
        return (
          <div className="relative w-full aspect-video bg-black">
            <video
              src={media.arquivo_principal_url}
              controls
              className="w-full h-full"
              poster={media.thumbnail_url}
              preload="metadata"
            />
          </div>
        );

      case "musica":
        return (
          <div className="w-full bg-gradient-to-r from-primary/5 to-primary/10 p-8">
            <div className="mb-6 max-w-md mx-auto">
              <Image
                src={media.thumbnail_url}
                alt={media.titulo}
                width={400}
                height={400}
                className="rounded-xl shadow-lg mx-auto"
              />
            </div>
            <div className="max-w-2xl mx-auto">
              <audio
                src={media.arquivo_principal_url}
                controls
                className="w-full"
                preload="metadata"
              />
            </div>
          </div>
        );

      case "stl":
        return (
          <div className="w-full aspect-video bg-gradient-to-r from-primary/5 to-primary/10 p-4">
            <STLViewer url={media.arquivo_principal_url} />
          </div>
        );

      default:
        return null;
    }
  };

  // Get icon for media type
  const getMediaTypeIcon = () => {
    if (!media) return null;

    switch (media.tipo_media) {
      case "imagem":
        return <ImageIcon className="h-5 w-5" />;
      case "video":
        return <VideoIcon className="h-5 w-5" />;
      case "musica":
        return <Music2Icon className="h-5 w-5" />;
      case "stl":
        return <Box className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Loading media details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!media) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Media not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button
          variant="link"
          asChild
          className="p-0 h-auto text-muted-foreground hover:text-primary"
        >
          <Link href="/Media" className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Media Library
          </Link>
        </Button>
      </div>

      {/* Title and metadata */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {media.titulo}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Badge variant="outline" className="flex items-center gap-1">
            {getMediaTypeIcon()}
            <span className="capitalize">{media.tipo_media}</span>
          </Badge>
          <span>•</span>
          <span>{new Date(media.data_criacao).toLocaleDateString()}</span>
          <span>•</span>
          <span>{media.visualizacoes} views</span>
          <span>•</span>
          <span>{media.categoria}</span>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Media content - Left column */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="rounded-xl overflow-hidden shadow-md border border-border">
            {renderMediaContent()}
          </div>

          {/* Description */}
          {media.descricao && (
            <div className="mt-6 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground">{media.descricao}</p>
            </div>
          )}
        </div>

        {/* Metadata - Right column */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-xl font-semibold mb-4">Media Information</h2>

            <div className="space-y-4">
              {/* File size */}
              {media.tamanho_arquivo && (
                <div className="flex items-start gap-3">
                  <FileIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">File Size</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(media.tamanho_arquivo)}
                    </p>
                  </div>
                </div>
              )}

              {/* Duration (for music and video) */}
              {media.duracao && (
                <div className="flex items-start gap-3">
                  <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Duration</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(media.duracao)}
                    </p>
                  </div>
                </div>
              )}

              {/* Format */}
              {media.formato && (
                <div className="flex items-start gap-3">
                  <FileIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Format</h3>
                    <p className="text-sm text-muted-foreground">
                      {media.formato.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Date Added</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(media.data_criacao).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Views */}
              <div className="flex items-start gap-3">
                <EyeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Views</h3>
                  <p className="text-sm text-muted-foreground">
                    {media.visualizacoes.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {media.tags && media.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <TagIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {media.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Download button */}
            <Button className="w-full mt-6 flex items-center gap-2" asChild>
              <a
                href={media.arquivo_principal_url}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon className="h-4 w-4" />
                Download{" "}
                {media.tipo_media === "stl" ? "3D Model" : media.tipo_media}
              </a>
            </Button>

            {/* Secondary file download if available */}
            {media.arquivo_secundario_url && (
              <Button
                variant="outline"
                className="w-full mt-3 flex items-center gap-2"
                asChild
              >
                <a
                  href={media.arquivo_secundario_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download Additional Files
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
import { mockMedias } from "../mock-data"; // Importar os dados mock

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

        // Usar dados mock em vez de buscar do Supabase
        const mediaItem = mockMedias.find((item) => item.id === id);

        if (mediaItem) {
          setMedia(mediaItem);
          // Não precisamos atualizar visualizações quando usamos dados mock
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
  }, [id]);

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

        {/* Details - Right column */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Game Information */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-border">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-primary" />
              Game
            </h2>
            <p className="text-muted-foreground">
              This media is part of our{" "}
              <span className="font-medium">{media.categoria}</span> game
              collection.
            </p>
          </div>

          {/* Media Details */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Date</span>
                </div>
                <span>
                  {new Date(media.data_criacao).toLocaleDateString("en-US")}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Views</span>
                </div>
                <span>{media.visualizacoes.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Format</span>
                </div>
                <span>{media.formato?.toUpperCase() || "Unknown"}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-border">
                <div className="flex items-center gap-2">
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
                    className="text-primary"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.29 7 12 12 20.71 7" />
                    <line x1="12" y1="22" x2="12" y2="12" />
                  </svg>
                  <span className="text-muted-foreground">Size</span>
                </div>
                <span>{formatFileSize(media.tamanho_arquivo)}</span>
              </div>

              {media.duracao && (
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Duration</span>
                  </div>
                  <span>{formatDuration(media.duracao)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {media.tags && media.tags.length > 0 && (
            <div className="p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-primary" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {media.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Download buttons */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-xl font-semibold mb-4">Downloads</h2>
            <div className="space-y-3">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all"
                onClick={() =>
                  window.open(media.arquivo_principal_url, "_blank")
                }
              >
                <DownloadIcon className="h-4 w-4" />
                Download{" "}
                {media.tipo_media === "stl" ? "3D Model" : media.tipo_media}
              </Button>

              {media.arquivo_secundario_url && (
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 transition-all"
                  onClick={() =>
                    window.open(media.arquivo_secundario_url, "_blank")
                  }
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download Additional Files
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

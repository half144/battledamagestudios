"use client";

import { useState, Suspense, lazy } from "react";
import { Media } from "@/types/media";
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
  YoutubeIcon,
} from "lucide-react";
import Image from "next/image";
import { MediaDetailSkeleton } from "@/components/media/media-detail-skeleton";
import YouTube from "react-youtube";

// Components loaded on demand with lazy loading
const MediaDescription = lazy(
  () => import("@/components/media/media-description")
);
const MediaMetadata = lazy(() => import("@/components/media/media-metadata"));

interface MediaDetailClientProps {
  media: Media;
}

export default function MediaDetailClient({ media }: MediaDetailClientProps) {
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
    switch (media.tipo_media) {
      case "imagem":
        return (
          <div className="relative w-full aspect-video bg-black flex items-center justify-center">
            <Image
              src={media.arquivo_principal_url || "/placeholder-image.jpg"}
              alt={media.titulo}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              priority
              loading="eager"
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
              controlsList="nodownload"
            />
          </div>
        );

      case "musica":
        return (
          <div className="w-full bg-gradient-to-r from-primary/5 to-primary/10 p-8">
            <div className="mb-6 max-w-md mx-auto">
              <Image
                src={media.thumbnail_url || "/placeholder-image.jpg"}
                alt={media.titulo}
                width={400}
                height={400}
                className="rounded-xl shadow-lg mx-auto"
                quality={80}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
            <div className="max-w-2xl mx-auto">
              <audio
                src={media.arquivo_principal_url}
                controls
                className="w-full"
                preload="metadata"
                controlsList="nodownload"
              />
            </div>
          </div>
        );

      case "stl":
        return (
          <div className="w-full aspect-video bg-gradient-to-r from-primary/5 to-primary/10 p-4 flex flex-col items-center justify-center">
            <div className="mb-4">
              <Box className="h-12 w-12 text-primary/50" />
            </div>
            <h3 className="text-xl font-medium mb-2">3D Model</h3>
            <p className="text-center text-muted-foreground max-w-md">
              Download the file to view the complete 3D model in your preferred
              software
            </p>
            <div className="mt-6 relative w-full max-w-md h-60 mx-auto">
              <Image
                src={media.thumbnail_url || "/placeholder-image.jpg"}
                alt={media.titulo}
                fill
                className="object-contain rounded-md shadow-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={80}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                priority
              />
            </div>
          </div>
        );

      case "youtube_embed":
        const getYouTubeVideoId = (url: string): string | null => {
          let videoId = null;
          try {
            const urlObj = new URL(url);
            if (urlObj.hostname === "youtu.be") {
              videoId = urlObj.pathname.slice(1);
            } else if (
              urlObj.hostname.includes("youtube.com") &&
              urlObj.pathname === "/watch"
            ) {
              videoId = urlObj.searchParams.get("v");
            } else if (
              urlObj.hostname.includes("youtube.com") &&
              urlObj.pathname.startsWith("/embed/")
            ) {
              videoId = urlObj.pathname.split("/embed/")[1];
            }
            // Remover quaisquer parâmetros adicionais do videoId, como playlist
            if (videoId) {
              videoId = videoId.split("?")[0].split("&")[0];
            }
          } catch (e) {
            console.error("Invalid URL for YouTube video", e);
            return null;
          }
          return videoId;
        };

        const videoId = getYouTubeVideoId(media.arquivo_principal_url);

        if (!videoId) {
          return (
            <div className="relative w-full aspect-video bg-black flex items-center justify-center text-white">
              Invalid or unsupported YouTube URL
            </div>
          );
        }

        const opts = {
          height: "100%", // Ajustado para preencher o container
          width: "100%", // Ajustado para preencher o container
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            modestbranding: 1, // Oculta o logo do YouTube o máximo possível
            rel: 0, // Não mostrar vídeos relacionados ao final
          },
        };

        return (
          <div className="relative w-full aspect-video bg-black">
            <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
          </div>
        );

      default:
        return null;
    }
  };

  // Get icon for media type
  const getMediaTypeIcon = () => {
    switch (media.tipo_media) {
      case "imagem":
        return <ImageIcon className="h-5 w-5" />;
      case "video":
        return <VideoIcon className="h-5 w-5" />;
      case "musica":
        return <Music2Icon className="h-5 w-5" />;
      case "stl":
        return <Box className="h-5 w-5" />;
      case "youtube_embed":
        return <YoutubeIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

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
        <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
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

          {/* Description (lazy loaded) */}
          {media.descricao && (
            <Suspense
              fallback={
                <div className="mt-6 p-6 rounded-xl bg-card border border-border h-40 animate-pulse">
                  <div className="h-4 w-1/3 bg-primary/10 rounded mb-4"></div>
                  <div className="h-3 w-full bg-muted/50 rounded mb-3"></div>
                  <div className="h-3 w-full bg-muted/50 rounded mb-3"></div>
                  <div className="h-3 w-2/3 bg-muted/50 rounded"></div>
                </div>
              }
            >
              <MediaDescription description={media.descricao} />
            </Suspense>
          )}
        </div>

        {/* Metadata - Right column */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Suspense
            fallback={
              <div className="p-6 rounded-xl bg-card border border-border h-96 animate-pulse">
                <div className="h-5 w-1/2 bg-primary/10 rounded mb-6"></div>
                <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-5 w-5 bg-muted/50 rounded-full mt-0.5"></div>
                      <div className="flex-1">
                        <div className="h-4 w-1/3 bg-muted/50 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-muted/50 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-10 w-full bg-primary/20 rounded mt-6"></div>
              </div>
            }
          >
            <MediaMetadata
              media={media}
              formatFileSize={formatFileSize}
              formatDuration={formatDuration}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

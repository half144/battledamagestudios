import React from "react";
import {
  ClockIcon,
  FileIcon,
  EyeIcon,
  TagIcon,
  CalendarIcon,
  DownloadIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Media } from "@/types/media";

interface MediaMetadataProps {
  media: Media;
  formatFileSize: (bytes?: number) => string;
  formatDuration: (seconds?: number) => string;
}

export default function MediaMetadata({
  media,
  formatFileSize,
  formatDuration,
}: MediaMetadataProps) {
  return (
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
          Download {media.tipo_media === "stl" ? "3D Model" : media.tipo_media}
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
  );
}

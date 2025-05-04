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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">File Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium mb-1">Upload Date</p>
              <p className="text-sm text-muted-foreground">
                {new Date(media.data_criacao).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <EyeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium mb-1">Views</p>
              <p className="text-sm text-muted-foreground">
                {media.visualizacoes}
              </p>
            </div>
          </div>

          {media.formato && (
            <div className="flex gap-3">
              <FileIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium mb-1">Format</p>
                <p className="text-sm text-muted-foreground">{media.formato}</p>
              </div>
            </div>
          )}

          {media.tamanho_arquivo !== undefined && (
            <div className="flex gap-3">
              <FileIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium mb-1">Size</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(media.tamanho_arquivo)}
                </p>
              </div>
            </div>
          )}

          {media.duracao !== undefined && (
            <div className="flex gap-3">
              <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium mb-1">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(media.duracao)}
                </p>
              </div>
            </div>
          )}

          {media.tags && media.tags.length > 0 && (
            <div className="flex gap-3">
              <TagIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {media.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-muted px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Button className="w-full mt-6" asChild>
          <a
            href={media.arquivo_principal_url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <DownloadIcon className="h-4 w-4" />
            Download
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

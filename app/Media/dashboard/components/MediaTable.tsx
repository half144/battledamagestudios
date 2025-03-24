import { useState } from "react";
import { useRouter } from "next/navigation";
import { Media } from "@/types/media";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileImage, FileVideo, Music, Box } from "lucide-react";
import Image from "next/image";
import { formatBytes } from "@/lib/utils";
import { format } from "date-fns";
import { MediaActions } from "./MediaActions";

interface MediaTableProps {
  medias: Media[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function MediaTable({ medias, loading, onDelete }: MediaTableProps) {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<string>("data_criacao");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Safely format file size
  const safeFormatBytes = (size?: number) => {
    if (size === undefined || size === null || isNaN(size)) {
      return "Unknown";
    }
    return formatBytes(size);
  };

  // Render media type icon
  const renderTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "image":
      case "imagem":
        return <FileImage className="h-3.5 w-3.5 mr-1" />;
      case "video":
        return <FileVideo className="h-3.5 w-3.5 mr-1" />;
      case "music":
      case "musica":
        return <Music className="h-3.5 w-3.5 mr-1" />;
      case "model":
      case "stl":
        return <Box className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  // Render thumbnail with fallback for undefined thumbnail_url
  const renderThumbnail = (media: Media) => {
    return (
      <div className="relative w-20 h-12 overflow-hidden rounded-md bg-muted">
        <Image
          src={media.thumbnail_url || "/images/placeholder.jpg"}
          alt={media.titulo}
          fill
          className="object-cover"
        />
      </div>
    );
  };

  // Sort media items
  const sortedMedias = [...medias].sort((a, b) => {
    let valueA, valueB;

    switch (sortColumn) {
      case "titulo":
        valueA = a.titulo?.toLowerCase() || "";
        valueB = b.titulo?.toLowerCase() || "";
        break;
      case "tipo_media":
        valueA = a.tipo_media || "";
        valueB = b.tipo_media || "";
        break;
      case "categoria":
        valueA = a.categoria || "";
        valueB = b.categoria || "";
        break;
      case "visualizacoes":
        valueA = a.visualizacoes || 0;
        valueB = b.visualizacoes || 0;
        break;
      case "tamanho_arquivo":
        valueA = a.tamanho_arquivo || 0;
        valueB = b.tamanho_arquivo || 0;
        break;
      case "data_criacao":
      default:
        valueA = new Date(a.data_criacao || Date.now()).getTime();
        valueB = new Date(b.data_criacao || Date.now()).getTime();
    }

    const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Toggle sort order
  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Render skeleton loader
  if (loading) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-12 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Render empty state message
  if (medias.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          No media found. Try changing the filters or add new media items.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Thumbnail</TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("titulo")}
            >
              Title{" "}
              {sortColumn === "titulo" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("tipo_media")}
            >
              Type{" "}
              {sortColumn === "tipo_media" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("categoria")}
            >
              Category{" "}
              {sortColumn === "categoria" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("data_criacao")}
            >
              Date{" "}
              {sortColumn === "data_criacao" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("visualizacoes")}
            >
              Views{" "}
              {sortColumn === "visualizacoes" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("tamanho_arquivo")}
            >
              Size{" "}
              {sortColumn === "tamanho_arquivo" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMedias.map((media) => (
            <TableRow
              key={media.id}
              className="transition-colors hover:bg-muted/30 cursor-pointer"
              onClick={() => router.push(`/Media/${media.id}`)}
            >
              <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                {renderThumbnail(media)}
              </TableCell>
              <TableCell className="font-medium truncate max-w-[200px]">
                {media.titulo}
              </TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(media.tipo_media)}>
                  {renderTypeIcon(media.tipo_media)}
                  <span className="capitalize">{media.tipo_media}</span>
                </Badge>
              </TableCell>
              <TableCell>{media.categoria || "—"}</TableCell>
              <TableCell>{formatDate(media.data_criacao)}</TableCell>
              <TableCell>{media.visualizacoes || 0}</TableCell>
              <TableCell>{safeFormatBytes(media.tamanho_arquivo)}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <MediaActions media={media} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getBadgeVariant(
  type: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (type?.toLowerCase()) {
    case "imagem":
    case "image":
      return "default";
    case "video":
      return "secondary";
    case "musica":
    case "music":
      return "outline";
    case "model":
    case "stl":
      return "destructive";
    default:
      return "outline";
  }
}

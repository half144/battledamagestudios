import { Media } from "@/types/media";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  VideoIcon,
  Music2Icon,
  Box,
  CalendarIcon,
  EyeIcon,
  TagIcon,
  ArrowRightIcon,
} from "lucide-react";

interface MediaCardProps {
  media: Media;
  index?: number;
}

export function MediaCard({ media, index = 0 }: MediaCardProps) {
  // Define icon based on media type
  const getMediaIcon = () => {
    switch (media.tipo_media) {
      case "imagem":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <VideoIcon className="h-4 w-4" />;
      case "musica":
        return <Music2Icon className="h-4 w-4" />;
      case "stl":
        return <Box className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  // Define gradient colors based on media type
  const getGradientColors = () => {
    switch (media.tipo_media) {
      case "imagem":
        return { from: "rgb(239 68 68)", to: "rgb(185 28 28)" };
      case "video":
        return { from: "rgb(59 130 246)", to: "rgb(37 99 235)" };
      case "musica":
        return { from: "rgb(139 92 246)", to: "rgb(124 58 237)" };
      case "stl":
        return { from: "rgb(16 185 129)", to: "rgb(5 150 105)" };
      default:
        return { from: "rgb(239 68 68)", to: "rgb(185 28 28)" };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const { from, to } = getGradientColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="w-full h-full"
    >
      <MagicCard
        className="flex flex-col h-full w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden rounded-xl border border-border"
        gradientFrom={from}
        gradientTo={to}
        gradientOpacity={0.15}
      >
        {/* Media Type Badge */}
        <Badge
          className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm"
          variant="outline"
        >
          {getMediaIcon()}
          <span className="capitalize">{media.tipo_media}</span>
        </Badge>

        {/* Game Badge */}
        <Badge className="absolute top-3 right-3 z-20 bg-primary/80 text-primary-foreground backdrop-blur-sm">
          {media.categoria}
        </Badge>

        {/* Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transform transition-all duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${media.thumbnail_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/Media/${media.id}`}>{media.titulo}</Link>
          </h3>

          {/* Description */}
          {media.descricao && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {media.descricao}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-auto space-y-2 pt-2 border-t border-border">
            {/* Date and Views */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>{formatDate(media.data_criacao)}</span>
              </div>
              <div className="flex items-center gap-1">
                <EyeIcon className="h-3 w-3" />
                <span>{media.visualizacoes.toLocaleString()} views</span>
              </div>
            </div>

            {/* Tags */}
            {media.tags && media.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <TagIcon className="h-3 w-3 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {media.tags.slice(0, 3).map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs px-1.5 py-0 h-5"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {media.tags.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0 h-5"
                    >
                      +{media.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pt-0">
          <Button
            asChild
            variant="outline"
            className="w-full group-hover:bg-primary/10 transition-colors flex justify-between"
          >
            <Link href={`/media/${media.id}`}>
              <span>View Details</span>
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </MagicCard>
    </motion.div>
  );
}

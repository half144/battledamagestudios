"use client";

import { useState, useEffect } from "react";
import { useProfileStore } from "@/store/profile";
import { MediaCard } from "@/components/media/media-card";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaListSkeleton } from "@/components/media/media-list-skeleton";
import { Media } from "@/types/media";

interface MediaClientProps {
  medias: Media[];
  games: string[];
  allTags: string[];
}

export default function MediaClient({
  medias,
  games,
  allTags,
}: MediaClientProps) {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [filteredMedias, setFilteredMedias] = useState<Media[]>(medias);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Apply filters
  useEffect(() => {
    let result = [...medias];

    // Filter by media type (tab)
    if (activeTab !== "all") {
      result = result.filter((media) => media.tipo_media === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (media) =>
          media.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (media.descricao &&
            media.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by game (categoria)
    if (selectedGame && selectedGame !== "all") {
      result = result.filter((media) => media.categoria === selectedGame);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(
        (media) =>
          media.tags && selectedTags.every((tag) => media.tags?.includes(tag))
      );
    }

    setFilteredMedias(result);
  }, [medias, searchTerm, selectedGame, selectedTags, activeTab]);

  // Add a tag to filter
  const addTagFilter = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Remove a tag from filter
  const removeTagFilter = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Group media by game (categoria)
  const mediaByGame = filteredMedias.reduce((acc, media) => {
    const gameKey = media.categoria;
    if (!acc[gameKey]) {
      acc[gameKey] = [];
    }
    acc[gameKey].push(media);
    return acc;
  }, {} as Record<string, Media[]>);

  const renderError = () => {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  };

  const renderFilters = () => {
    return (
      <div className="mb-8 space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by game" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Games</SelectItem>
                {games.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => addTagFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Add tag filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTagFilter(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMediaGrid = () => {
    if (Object.keys(mediaByGame).length === 0) {
      return (
        <div className="text-center py-12">
          No media found matching your filters.
        </div>
      );
    }

    return Object.keys(mediaByGame).map((game) => (
      <div key={game} className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{game}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaByGame[game].map((media, index) => (
            <MediaCard key={media.id} media={media} index={index} />
          ))}
        </div>
      </div>
    ));
  };

  const renderContent = () => {
    if (loading) {
      return <MediaListSkeleton />;
    }

    if (error) {
      return renderError();
    }

    return (
      <>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <PageHeader
            heading="Media Library"
            text="Explore images, videos, music, and 3D models from Battle Damage Studios games"
          />

          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            {profile?.role === "admin" && (
              <>
                <Button
                  onClick={() => router.push("/Media/dashboard")}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <span>Dashboard</span>
                </Button>
                <Button
                  onClick={() => router.push("/Media/criar")}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Media</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {renderFilters()}

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="imagem">Images</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="musica">Music</TabsTrigger>
            <TabsTrigger value="stl">3D Models</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-4 text-muted-foreground">
          Showing {filteredMedias.length} of {medias.length} items
        </div>

        {renderMediaGrid()}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      {renderContent()}
    </div>
  );
}

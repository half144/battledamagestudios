"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { MediaCard } from "@/components/media/media-card";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaListSkeleton } from "@/components/media/media-list-skeleton";
import { Media } from "@/types/media";

export default function MediaPage() {
  const { supabase } = useSupabase();
  const [medias, setMedias] = useState<Media[]>([]);
  const [filteredMedias, setFilteredMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch medias from Supabase
  useEffect(() => {
    const fetchMedias = async () => {
      try {
        setLoading(true);

        // Fetch data from Supabase
        const { data, error } = await supabase.from("medias").select("*");

        if (error) {
          throw error;
        }

        if (data) {
          // Convert data to match Media interface
          const formattedData = data.map((item) => ({
            ...item,
            // Ensure data_criacao is a string
            data_criacao: item.data_criacao || new Date().toISOString(),
            // Initialize visualizacoes if not present
            visualizacoes: item.visualizacoes || 0,
          }));

          setMedias(formattedData as Media[]);
          setFilteredMedias(formattedData as Media[]);

          // Extract unique games (from categoria field)
          const uniqueGames = Array.from(
            new Set(data.map((item) => item.categoria))
          );
          setGames(uniqueGames);

          // Extract all unique tags
          const allUniqueTags = Array.from(
            new Set(data.flatMap((item) => item.tags || []))
          );
          setAllTags(allUniqueTags);
        }
      } catch (error) {
        console.error("Error fetching media:", error);
        setError("Failed to load media data");
      } finally {
        setLoading(false);
      }
    };

    fetchMedias();
  }, [supabase]);

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
        <PageHeader
          heading="Game Media Library"
          text="Explore our collection of images, videos, music, and 3D models from our games"
        />

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

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { MediaTable } from "./components/MediaTable";
import { MediaFilters } from "./components/MediaFilters";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Media } from "@/types/media";
import { fetchMediasApi, deleteMediaApi } from "@/lib/mediaApi";

export default function MediaDashboard() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [allMedias, setAllMedias] = useState<Media[]>([]);
  const [filteredMedias, setFilteredMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Extract unique categories from data
  const categories = useMemo(() => {
    if (!allMedias.length) return [];

    const uniqueCategories = Array.from(
      new Set(allMedias.map((item) => item.categoria).filter(Boolean))
    );

    return uniqueCategories as string[];
  }, [allMedias]);

  // Load data once
  useEffect(() => {
    const fetchMedias = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchMediasApi();

        if (!data) {
          throw new Error("Failed to fetch media data");
        }

        setAllMedias(data);
        setFilteredMedias(data);
      } catch (error) {
        console.error("Error loading media:", error);
        setError("Error loading media: " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedias();
  }, []);

  // Apply in-memory filters when filters change
  useEffect(() => {
    // If no active filters, use all data
    if (
      searchQuery === "" &&
      typeFilter === "all" &&
      categoryFilter === "all"
    ) {
      setFilteredMedias(allMedias);
      return;
    }

    let filtered = [...allMedias];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (media) =>
          media.titulo?.toLowerCase().includes(query) ||
          media.descricao?.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter((media) => media.tipo_media === typeFilter);
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((media) => media.categoria === categoryFilter);
    }

    setFilteredMedias(filtered);
  }, [allMedias, searchQuery, typeFilter, categoryFilter]);

  // Handle media deletion
  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Do you want to delete this media item?")) return;

    try {
      const success = await deleteMediaApi(id);

      if (!success) {
        throw new Error("Failed to delete media");
      }

      setAllMedias((prev) => prev.filter((media) => media.id !== id));
      toast.success("Media deleted successfully");
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Failed to delete media");
    }
  };

  // Check if user is logged in and admin
  if (!profile) {
    return <div className="container py-12">Loading profile...</div>;
  }

  // Redirect if user is not admin
  if (profile.role !== "admin") {
    toast.error("You don't have permission to access the media dashboard");
    router.push("/");
    return null;
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="container py-24 max-w-7xl mx-auto">
        <PageHeader
          heading="Media Dashboard"
          text="Manage all media files on the platform"
        />
        <div className="mt-8 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-2 text-muted-foreground">Loading media data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container py-24 max-w-7xl mx-auto">
        <PageHeader
          heading="Media Dashboard"
          text="Manage all media files on the platform"
        />
        <div className="mt-8 p-4 bg-destructive/10 text-destructive rounded-md">
          <p>Failed to load media data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-24 max-w-7xl mx-auto">
      <PageHeader
        heading="Media Dashboard"
        text="Manage all media files on the platform"
      />

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <MediaFilters
            onSearchChange={setSearchQuery}
            onTypeChange={setTypeFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />

          <Button
            onClick={() => router.push("/Media/criar")}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add New Media</span>
          </Button>
        </div>

        <div className="bg-card rounded-md border shadow-sm">
          <MediaTable
            medias={filteredMedias}
            loading={loading}
            onDelete={handleDeleteMedia}
          />
        </div>
      </div>
    </div>
  );
}

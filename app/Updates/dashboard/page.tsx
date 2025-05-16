"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { UpdatesTable, UpdatesFilters } from "./components";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { BlogPost } from "@/types/blog";
import { fetchPostsApi, deletePostApi } from "@/lib/postsApi";

export default function UpdatesDashboard() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Extract unique categories from data
  const categories = useMemo(() => {
    if (!allPosts.length) return [];

    const uniqueCategories = Array.from(
      new Set(
        allPosts
          .map((item) => {
            // Extract category from the content if it exists
            const categoryMatch = item.content.match(
              /<category>([^<]+)<\/category>/
            );
            return categoryMatch ? categoryMatch[1] : null;
          })
          .filter(Boolean)
      )
    );

    return uniqueCategories as string[];
  }, [allPosts]);

  // Load data once
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPostsApi();

        if (!data) {
          throw new Error("Failed to fetch posts data");
        }

        setAllPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error loading posts:", error);
        setError("Error loading posts: " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Apply in-memory filters when filters change
  useEffect(() => {
    // If no active filters, use all data
    if (searchQuery === "" && categoryFilter === "all") {
      setFilteredPosts(allPosts);
      return;
    }

    let filtered = [...allPosts];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((post) => {
        const categoryMatch = post.content.match(
          /<category>([^<]+)<\/category>/
        );
        return categoryMatch && categoryMatch[1] === categoryFilter;
      });
    }

    setFilteredPosts(filtered);
  }, [allPosts, searchQuery, categoryFilter]);

  // Handle post deletion
  const handleDeletePost = async (id: string) => {
    if (!confirm("Do you want to delete this post?")) return;

    try {
      const success = await deletePostApi(id);

      if (!success) {
        throw new Error("Failed to delete post");
      }

      setAllPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  // Check if user is logged in and admin
  if (!profile) {
    return <div className="container py-12">Loading profile...</div>;
  }

  // Redirect if user is not admin
  if (profile.role !== "admin") {
    toast.error("You don't have permission to access the updates dashboard");
    router.push("/");
    return null;
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="container py-24 max-w-7xl mx-auto">
        <PageHeader
          heading="Updates Dashboard"
          text="Manage all posts and updates on the platform"
        />
        <div className="mt-8 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-2 text-muted-foreground">Loading posts data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container py-24 max-w-7xl mx-auto">
        <PageHeader
          heading="Updates Dashboard"
          text="Manage all posts and updates on the platform"
        />
        <div className="mt-8 p-4 bg-destructive/10 text-destructive rounded-md">
          <p>Failed to load posts data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-24 max-w-7xl mx-auto">
      <PageHeader
        heading="Updates Dashboard"
        text="Manage all posts and updates on the platform"
      />

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <UpdatesFilters
            onSearchChange={setSearchQuery}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />

          <Button
            onClick={() => router.push("/Updates/editor")}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add New Post</span>
          </Button>
        </div>

        <div className="bg-card rounded-md border shadow-sm">
          <UpdatesTable
            posts={filteredPosts}
            loading={loading}
            onDelete={handleDeletePost}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile";
import { PageHeader } from "@/components/page-header";
import { MediaFormApi } from "@/components/media/media-form-api";
import { Media } from "@/types/media";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { fetchMediaByIdApi } from "@/lib/mediaApi";

export default function EditMediaPage() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;

  // Load media data
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const data = await fetchMediaByIdApi(id);

        if (!data) {
          throw new Error("Media not found");
        }

        setMedia(data);
      } catch (error) {
        console.error("Error fetching media:", error);
        toast.error("Could not load media data");
        router.push("/Media/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [id, router]);

  // Check if user is logged in and admin
  if (!profile) {
    return <div className="container py-12">Loading profile...</div>;
  }

  // Redirect if user is not admin
  if (profile.role !== "admin") {
    toast.error("You don't have permission to access this page");
    router.push("/Media");
    return null;
  }

  if (loading) {
    return (
      <div className="container py-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading media data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="container py-24 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Media not found</h2>
          <p className="text-muted-foreground mb-4">
            The media you're trying to edit couldn't be found.
          </p>
          <button
            onClick={() => router.push("/Media/dashboard")}
            className="text-primary hover:underline"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-24 max-w-7xl mx-auto">
      <PageHeader heading="Edit Media" text={`Editing: ${media.titulo}`} />

      <div className="max-w-3xl mx-auto mt-8 p-6 bg-card rounded-lg shadow-md">
        <MediaFormApi
          mode="edit"
          existingMedia={media}
          onComplete={() => router.push("/Media/dashboard")}
        />
      </div>
    </div>
  );
}

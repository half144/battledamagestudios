"use client";

import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile";
import { PageHeader } from "@/components/page-header";
import { MediaForm } from "@/components/media/media-form";
import { toast } from "sonner";

export default function CreateMediaPage() {
  const router = useRouter();
  const { profile } = useProfileStore();

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

  return (
    <div className="container py-24 max-w-7xl mx-auto">
      <PageHeader
        heading="Create New Media"
        text="Add a new item to the media library"
      />

      <div className="max-w-3xl mx-auto mt-8 p-6 bg-card rounded-lg shadow-md">
        <MediaForm mode="create" />
      </div>
    </div>
  );
}

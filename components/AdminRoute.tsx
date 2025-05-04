"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { profile, isLoading } = useProfileStore();
  const router = useRouter();

  useEffect(() => {
    console.log("isAdmin", profile);
    if (!isLoading && profile?.role !== "admin") {
      router.push("/Updates");
    }
  }, [profile, isLoading, router]);

  console.log("isAdmin", profile);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24">Loading...</div>;
  }

  return profile?.role === "admin" ? <>{children}</> : null;
}

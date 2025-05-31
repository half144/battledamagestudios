"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { profile, isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || profile?.role !== "admin") {
        router.push("/");
      }
    }
  }, [isAuthenticated, profile, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || profile?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}

"use client";

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/Updates');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return <div className="container mx-auto px-4 py-24">Loading...</div>;
  }

  return isAdmin ? <>{children}</> : null;
}
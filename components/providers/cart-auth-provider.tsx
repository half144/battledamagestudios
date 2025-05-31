"use client";

import { useCartAuth } from "@/hooks/useCartAuth";

export function CartAuthProvider({ children }: { children: React.ReactNode }) {
  useCartAuth();
  return <>{children}</>;
}

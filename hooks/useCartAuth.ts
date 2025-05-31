import { useEffect } from "react";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useCartStore } from "@/store/cart";

export function useCartAuth() {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      clearCart();
    }
  }, [isAuthenticated, isLoading, clearCart]);
}

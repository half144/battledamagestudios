import { cache } from "react";
import "server-only";
import { StripeProduct } from "@/types/stripe";

export const preloadStripeProducts = () => {
  void getStripeProducts();
};

export const getStripeProducts = cache(async (): Promise<StripeProduct[]> => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/stripe/products`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.products;
    } else {
      throw new Error(data.error || "Failed to fetch products");
    }
  } catch (error) {
    console.error("Error fetching Stripe products:", error);
    return [];
  }
});

export const getStripeProduct = cache(
  async (productId: string): Promise<StripeProduct | null> => {
    const products = await getStripeProducts();
    return products.find((product) => product.id === productId) || null;
  }
);

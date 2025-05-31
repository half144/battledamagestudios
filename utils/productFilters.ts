import { StripeProduct } from "@/types/stripe";

export const PRICE_RANGES = {
  ALL: "all",
  UNDER_10: "under10",
  BETWEEN_10_25: "10to25",
  OVER_25: "over25",
} as const;

export const SORT_OPTIONS = {
  FEATURED: "featured",
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc",
  NEWEST: "newest",
} as const;

export type PriceRange = (typeof PRICE_RANGES)[keyof typeof PRICE_RANGES];
export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export const getProductPrice = (product: StripeProduct): number => {
  return product.default_price.unit_amount / 100;
};

export const getProductCategory = (product: StripeProduct): string => {
  return product.unit_label || "Uncategorized";
};

export const extractCategories = (products: StripeProduct[]): string[] => {
  return Array.from(new Set(products.map(getProductCategory).filter(Boolean)));
};

export const filterProducts = (
  products: StripeProduct[],
  filters: {
    searchQuery: string;
    selectedCategory: string | "all";
    showActiveOnly: boolean;
    priceRange: string;
    sortBy: string;
  }
): StripeProduct[] => {
  const { searchQuery, selectedCategory, showActiveOnly, priceRange, sortBy } =
    filters;

  return products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const productCategory = getProductCategory(product);
      const matchesCategory =
        selectedCategory === "all" || productCategory === selectedCategory;

      const matchesActive = !showActiveOnly || product.active;

      const price = getProductPrice(product);
      const matchesPriceRange =
        priceRange === PRICE_RANGES.ALL ||
        (priceRange === PRICE_RANGES.UNDER_10 && price < 10) ||
        (priceRange === PRICE_RANGES.BETWEEN_10_25 &&
          price >= 10 &&
          price <= 25) ||
        (priceRange === PRICE_RANGES.OVER_25 && price > 25);

      return (
        matchesSearch && matchesCategory && matchesActive && matchesPriceRange
      );
    })
    .sort((a, b) => {
      const priceA = getProductPrice(a);
      const priceB = getProductPrice(b);

      switch (sortBy) {
        case SORT_OPTIONS.PRICE_ASC:
          return priceA - priceB;
        case SORT_OPTIONS.PRICE_DESC:
          return priceB - priceA;
        case SORT_OPTIONS.NEWEST:
          return b.created - a.created;
        default:
          return b.active ? 1 : -1;
      }
    });
};

"use client";

import { useState } from "react";
import { StripeProduct } from "@/types/stripe";
import { useCartStore } from "@/store/cart";
import { FiltersSidebar } from "@/components/filters-sidebar";
import { StoreSearchAndSort } from "@/components/store/StoreSearchAndSort";
import { StoreProductGrid } from "@/components/store/StoreProductGrid";
import { StoreEmptyState } from "@/components/store/StoreEmptyState";
import {
  filterProducts,
  extractCategories,
  SortOption,
  PriceRange,
} from "@/utils/productFilters";

interface StoreClientProps {
  products: StripeProduct[];
}

export const StoreClient = ({ products }: StoreClientProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [priceRange, setPriceRange] = useState<PriceRange>("all");

  const addToCart = useCartStore((state) => state.addItem);
  const categories = extractCategories(products);

  const filteredProducts = filterProducts(products, {
    searchQuery,
    selectedCategory,
    showActiveOnly,
    priceRange,
    sortBy,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 mb-8">
      <FiltersSidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        showFeaturedOnly={showActiveOnly}
        setShowFeaturedOnly={setShowActiveOnly}
        categories={categories}
      />

      <div className="space-y-6">
        <StoreSearchAndSort
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {filteredProducts.length > 0 ? (
          <StoreProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
          />
        ) : (
          <StoreEmptyState hasProducts={products.length > 0} />
        )}
      </div>
    </div>
  );
};

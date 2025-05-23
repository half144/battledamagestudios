"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useProfileStore } from "@/store/profile";
import { StoreProduct } from "@/types/store-item";
import { fetchProductsPublicApi } from "@/lib/storeApi";
import { StoreHeader } from "@/components/store-header";
import { FiltersSidebar } from "@/components/filters-sidebar";
import { StoreItemCard } from "@/components/store-item-card";
import { useRouter } from "next/navigation";

const PRICE_RANGES = {
  ALL: "all",
  UNDER_10: "under10",
  BETWEEN_10_25: "10to25",
  OVER_25: "over25",
} as const;

const SORT_OPTIONS = {
  FEATURED: "featured",
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc",
  NEWEST: "newest",
} as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Store() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<keyof typeof SORT_OPTIONS>("FEATURED");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [priceRange, setPriceRange] = useState<
    "all" | "under10" | "10to25" | "over25"
  >("all");
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCartStore((state) => state.addItem);
  const { profile } = useProfileStore();

  // Fetch products from Supabase (public API)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProductsPublicApi({ active: showActiveOnly });
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showActiveOnly]);

  // Extract unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  );

  const filterItems = (
    items: StoreProduct[],
    searchQuery: string,
    selectedCategory: string | "all",
    showActiveOnly: boolean,
    priceRange: (typeof PRICE_RANGES)[keyof typeof PRICE_RANGES],
    sortBy: (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]
  ) => {
    return items
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || item.category === selectedCategory;
        const matchesActive = !showActiveOnly || item.active;
        const matchesPriceRange =
          priceRange === PRICE_RANGES.ALL ||
          (priceRange === PRICE_RANGES.UNDER_10 && item.price < 10) ||
          (priceRange === PRICE_RANGES.BETWEEN_10_25 &&
            item.price >= 10 &&
            item.price <= 25) ||
          (priceRange === PRICE_RANGES.OVER_25 && item.price > 25);

        return (
          matchesSearch && matchesCategory && matchesActive && matchesPriceRange
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case SORT_OPTIONS.PRICE_ASC:
            return a.price - b.price;
          case SORT_OPTIONS.PRICE_DESC:
            return b.price - a.price;
          case SORT_OPTIONS.NEWEST:
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          default:
            // Featured: active products first
            return b.active ? 1 : -1;
        }
      });
  };

  const filteredItems = filterItems(
    products,
    searchQuery,
    selectedCategory,
    showActiveOnly,
    priceRange,
    sortBy as (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <StoreHeader />
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-2 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <StoreHeader />
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <StoreHeader />

          {/* Admin Dashboard Button */}
          {profile?.role === "admin" && (
            <Button
              onClick={() => router.push("/store/dashboard")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          )}
        </div>

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

          {/* Main Content */}
          <div className="space-y-6">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: keyof typeof SORT_OPTIONS) =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEATURED">Featured</SelectItem>
                  <SelectItem value="PRICE_ASC">Price: Low to High</SelectItem>
                  <SelectItem value="PRICE_DESC">Price: High to Low</SelectItem>
                  <SelectItem value="NEWEST">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items Grid */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item) => (
                <motion.div key={item.id}>
                  <StoreItemCard
                    item={{
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image_url,
                      description: item.description,
                      featured: item.active,
                      tags: [item.category],
                      category: item.category as any,
                      rating: 4.5,
                    }}
                    addToCart={addToCart}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">
                  No products found matching your criteria.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

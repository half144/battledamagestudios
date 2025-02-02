"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cart";
import { StoreItem, storeItems, ItemCategory } from "@/data/store";
import { StoreHeader } from "@/components/store-header";
import { FiltersSidebar } from "@/components/filters-sidebar";
import { StoreItemCard } from "@/components/store-item-card";

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
  RATING: "rating",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ItemCategory | "all"
  >("all");
  const [sortBy, setSortBy] = useState<keyof typeof SORT_OPTIONS>("FEATURED");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<
    "all" | "under10" | "10to25" | "over25"
  >("all");

  const addToCart = useCartStore((state) => state.addItem);

  const filterItems = (
    items: StoreItem[],
    searchQuery: string,
    selectedCategory: ItemCategory | "all",
    showFeaturedOnly: boolean,
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
        const matchesFeatured = !showFeaturedOnly || item.featured;
        const matchesPriceRange =
          priceRange === PRICE_RANGES.ALL ||
          (priceRange === PRICE_RANGES.UNDER_10 && item.price < 10) ||
          (priceRange === PRICE_RANGES.BETWEEN_10_25 &&
            item.price >= 10 &&
            item.price <= 25) ||
          (priceRange === PRICE_RANGES.OVER_25 && item.price > 25);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesFeatured &&
          matchesPriceRange
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case SORT_OPTIONS.PRICE_ASC:
            return a.price - b.price;
          case SORT_OPTIONS.PRICE_DESC:
            return b.price - a.price;
          case SORT_OPTIONS.RATING:
            return b.rating - a.rating;
          default:
            return b.featured ? 1 : -1;
        }
      });
  };

  const filteredItems = filterItems(
    storeItems,
    searchQuery,
    selectedCategory,
    showFeaturedOnly,
    priceRange,
    sortBy as (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]
  );

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <StoreHeader />

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 mb-8">
          <FiltersSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            showFeaturedOnly={showFeaturedOnly}
            setShowFeaturedOnly={setShowFeaturedOnly}
          />

          {/* Main Content */}
          <div className="space-y-6">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search items..."
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
                  <SelectItem value="RATING">Rating</SelectItem>
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
                  <StoreItemCard item={item} addToCart={addToCart} />
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
                  No items found matching your criteria.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

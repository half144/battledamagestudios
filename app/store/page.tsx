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
  const [sortBy, setSortBy] = useState("featured");
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
    priceRange: typeof PRICE_RANGES[keyof typeof PRICE_RANGES],
    sortBy: typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS]
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
          matchesSearch && matchesCategory && matchesFeatured && matchesPriceRange
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
    sortBy
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
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
                  <Link href={`/store/${item.id}`}>
                    <MagicCard
                      className="relative overflow-hidden group h-full"
                      gradientFrom="rgb(239 68 68)"
                      gradientTo="rgb(185 28 28)"
                      gradientOpacity={0.2}
                    >
                      {item.featured && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className="bg-red-500">Featured</Badge>
                        </div>
                      )}
                      <div className="p-4 space-y-4 h-full flex flex-col">
                        <div className="aspect-square relative bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{item.name}</h3>
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="space-y-1">
                            <span className="text-2xl font-bold">
                              ${item.price}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-red-500 text-red-500" />
                              <span className="text-sm text-muted-foreground">
                                {item.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <Button
                            className="bg-red-500 hover:bg-red-600"
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                image: item.image,
                              });
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </MagicCard>
                  </Link>
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

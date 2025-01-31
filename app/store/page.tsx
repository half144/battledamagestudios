"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/ui/text-animate";
import {
  ShoppingCart,
  Star,
  Sparkles,
  Shield,
  Sword,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/store/cart";
import { Cart } from "@/components/cart";
import { StoreItem, storeItems, categories, ItemCategory } from "@/data/store";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
} as const;

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

  const filteredItems = storeItems
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesFeatured = !showFeaturedOnly || item.featured;
      const matchesPriceRange =
        priceRange === "all" ||
        (priceRange === "under10" && item.price < 10) ||
        (priceRange === "10to25" && item.price >= 10 && item.price <= 25) ||
        (priceRange === "over25" && item.price > 25);

      return (
        matchesSearch && matchesCategory && matchesFeatured && matchesPriceRange
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.featured ? 1 : -1;
      }
    });

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Store Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
              Battle Store
            </h1>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 mb-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 bg-background/50 p-6 rounded-lg border border-red-500/20"
          >
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) =>
                      setSelectedCategory(value as ItemCategory | "all")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range
                  </label>
                  <Select
                    value={priceRange}
                    onValueChange={(
                      value: "all" | "under10" | "10to25" | "over25"
                    ) => setPriceRange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under10">Under $10</SelectItem>
                      <SelectItem value="10to25">$10 - $25</SelectItem>
                      <SelectItem value="over25">Over $25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={showFeaturedOnly}
                    onCheckedChange={() =>
                      setShowFeaturedOnly(!showFeaturedOnly)
                    }
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Featured Items Only
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

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
                    <MagicCard className="relative overflow-hidden group h-full">
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

"use client";

import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { ItemCategory } from "@/data/store";
import { categories } from "@/data/store";

type PriceRange = "all" | "under10" | "10to25" | "over25";

type FiltersSidebarProps = {
  selectedCategory: ItemCategory | "all";
  setSelectedCategory: (value: ItemCategory | "all") => void;
  priceRange: PriceRange;
  setPriceRange: (value: PriceRange) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (value: boolean) => void;
};

export function FiltersSidebar({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  showFeaturedOnly,
  setShowFeaturedOnly,
}: FiltersSidebarProps) {
  return (
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
            <label className="text-sm font-medium mb-2 block">Category</label>
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
              onValueChange={(value) => setPriceRange(value as PriceRange)}
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
              onCheckedChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
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
  );
}

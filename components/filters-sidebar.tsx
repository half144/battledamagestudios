"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ItemCategory } from "@/data/store";

type FiltersSidebarProps = {
  selectedCategory: ItemCategory | "all";
  setSelectedCategory: (value: ItemCategory | "all") => void;
  priceRange: "all" | "under10" | "10to25" | "over25";
  setPriceRange: (value: "all" | "under10" | "10to25" | "over25") => void;
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
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="mb-4 font-semibold">Category</h3>
        <RadioGroup
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as ItemCategory | "all")}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Bickering Bunch" id="Bickering Bunch" />
              <Label htmlFor="Bickering Bunch">Bickering Bunch</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Legends of Terrestria" id="Legends of Terrestria" />
              <Label htmlFor="Legends of Terrestria">Legends of Terrestria</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Terrestria At War" id="Terrestria At War" />
              <Label htmlFor="equipment">Terrestria At War</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ChatFishes" id="ChatFishes" />
              <Label htmlFor="ChatFishes">ChatFishes</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="mb-4 font-semibold">Price Range</h3>
        <RadioGroup
          value={priceRange}
          onValueChange={(value) =>
            setPriceRange(value as "all" | "under10" | "10to25" | "over25")
          }
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="price-all" />
              <Label htmlFor="price-all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="under10" id="under10" />
              <Label htmlFor="under10">Under $10</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10to25" id="10to25" />
              <Label htmlFor="10to25">$10 - $25</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="over25" id="over25" />
              <Label htmlFor="over25">Over $25</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Featured Filter */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={showFeaturedOnly}
            onCheckedChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
          />
          <Label htmlFor="featured">Show featured only</Label>
        </div>
      </div>
    </div>
  );
}

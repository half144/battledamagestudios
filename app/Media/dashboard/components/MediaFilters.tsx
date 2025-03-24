import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface MediaFiltersProps {
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  categories?: string[];
}

export function MediaFilters({
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  categories = [],
}: MediaFiltersProps) {
  const [localSearch, setLocalSearch] = useState("");

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or description..."
          className="pl-8"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <Select onValueChange={onTypeChange} defaultValue="all">
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Media type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="model">3D Model (STL)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={onCategoryChange} defaultValue="all">
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Category (Game)" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

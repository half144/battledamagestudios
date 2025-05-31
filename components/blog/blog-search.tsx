import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface BlogSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function BlogSearch({ searchQuery, onSearchChange }: BlogSearchProps) {
  return (
    <div className="relative">
      <div className="flex items-center border-b border-zinc-700 focus-within:border-red-500 pb-1 transition-colors duration-200">
        <Search className="text-zinc-400 w-5 h-5 flex-shrink-0" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-base placeholder:text-zinc-500"
        />
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-red-500"
        initial={{ width: 0 }}
        animate={{ width: searchQuery ? "100%" : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

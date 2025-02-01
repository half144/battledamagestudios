import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface BlogSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function BlogSearch({ searchQuery, onSearchChange }: BlogSearchProps) {
  return (
    <motion.div
      className="max-w-xl mx-auto w-full relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
      <Input
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 py-6 text-lg border-red-500/20"
      />
    </motion.div>
  );
}

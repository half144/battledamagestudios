import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BlogHeaderProps {
  title: string;
  description: string;
}

export function BlogHeader({ title, description }: BlogHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Sparkles className="w-8 h-8 text-red-500" />
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
          {title}
        </h1>
      </div>
      <motion.p
        className="text-muted-foreground max-w-[600px] text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {description}
      </motion.p>
    </div>
  );
}

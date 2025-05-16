import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface BlogHeaderProps {
  title: string;
  description: string;
}

export function BlogHeader({ title, description }: BlogHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-5">
      <motion.span
        className="inline-flex items-center justify-center bg-red-500/10 text-red-500 rounded-full px-3 py-1 text-sm font-medium"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Sparkles className="w-4 h-4 mr-1" />
        Updates
      </motion.span>

      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="text-zinc-400 max-w-[800px] text-base md:text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {description}
      </motion.p>
    </div>
  );
}

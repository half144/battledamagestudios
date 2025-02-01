"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function StoreHeader() {
  return (
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
  );
}

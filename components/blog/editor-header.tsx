import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface EditorHeaderProps {
  backLink: string;
  title: string;
}

export function EditorHeader({ backLink, title }: EditorHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-12"
    >
      <Link href={backLink} className="flex items-center text-red-500 hover:text-red-600 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Blogs
      </Link>
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-red-500" />
        {title}
      </h2>
    </motion.div>
  );
}

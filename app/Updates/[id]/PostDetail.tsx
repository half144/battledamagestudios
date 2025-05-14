"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import type { BlogPost } from "@/types/blog";
import { useAuth } from "@/hooks/useAuth";

interface PostDetailProps {
  post: BlogPost;
}

export default function PostDetail({ post }: PostDetailProps) {
  const { isAdmin } = useAuth();

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        className="max-w-4xl mx-auto space-y-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="ghost"
              asChild
              className="group hover:text-red-500"
            >
              <Link href="/Updates" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Blogs
              </Link>
            </Button>
          </motion.div>

          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                variant="outline"
                asChild
                className="group hover:text-red-500 hover:border-red-500"
              >
                <Link
                  href={`/Updates/editor?edit=${post.id}`}
                  className="flex items-center gap-2"
                >
                  Edit Post
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
              {post.title}
            </h1>
          </div>

          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative h-[500px] w-full rounded-xl overflow-hidden border border-red-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transform transition-all duration-500 hover:scale-105"
            style={{ backgroundImage: `url(${post.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <MagicCard
            className="p-8 group overflow-hidden"
            gradientFrom="rgb(239 68 68)"
            gradientTo="rgb(185 28 28)"
            gradientOpacity={0.2}
          >
            {post.author && (
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-red-500/20">
                  <div
                    className="w-full h-full bg-cover bg-center transform transition-all duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${
                        post.author.avatar || "/default-avatar.png"
                      })`,
                    }}
                  />
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {post.author.name || "Anonymous"}
                  </div>
                  <div className="text-sm text-red-500">Author</div>
                </div>
              </div>
            )}

            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-red-500"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </MagicCard>
        </motion.div>
      </motion.div>
    </div>
  );
}

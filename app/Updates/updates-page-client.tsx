"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BlogPost } from "@/lib/supabase";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogSearch } from "@/components/blog/blog-search";
import { BlogCard } from "@/components/blog/blog-card";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface UpdatesPageClientProps {
  blogs: BlogPost[];
}

export default function UpdatesPageClient({ blogs }: UpdatesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin } = useAuth();

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        className="space-y-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header centralizado */}
        <div className="text-center">
          <BlogHeader
            title="Mixers Updates"
            description="Stay updated with the latest news, development insights, and community stories"
          />

          {/* Botão New Post centralizado e apenas para admin */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Button
                asChild
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
              >
                <Link href="/Updates/editor">
                  <PlusCircle className="w-5 h-5" />
                  New Post
                </Link>
              </Button>
            </motion.div>
          )}
        </div>

        <BlogSearch
          searchQuery={searchQuery}
          onSearchChange={(value) => setSearchQuery(value)}
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-xl text-gray-500">No posts found</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

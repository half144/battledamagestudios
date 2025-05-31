"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BlogPost } from "@/types/blog";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogSearch } from "@/components/blog/blog-search";
import { BlogCard } from "@/components/blog/blog-card";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Layout } from "lucide-react";

interface UpdatesPageClientProps {
  blogs: BlogPost[];
}

export default function UpdatesPageClient({ blogs }: UpdatesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { profile, isAuthenticated, isLoading } = useAuthStatus();

  // Definir isAdmin baseado no perfil
  const isAdmin = profile?.role === "admin";

  // Debug log para a página Updates
  useEffect(() => {
    console.log("[UpdatesPageClient] Component mounted/updated:", {
      profile: profile
        ? {
            id: profile.id,
            username: profile.username,
            avatar_url: profile.avatar_url,
          }
        : null,
      isAuthenticated,
      isLoading,
      isAdmin,
    });
  }, [profile, isAuthenticated, isLoading, isAdmin]);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Hero section com background escuro */}
      <div className="bg-gradient-to-b from-black via-zinc-900 to-black border-b border-zinc-800">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <BlogHeader
              title="Mixers Updates"
              description="Stay updated with the latest news, development insights, and community stories"
            />

            {/* Admin actions */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center gap-3 mt-8"
              >
                <Button
                  asChild
                  variant="default"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Link
                    href="/Updates/editor"
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Post
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <Link
                    href="/Updates/dashboard"
                    className="flex items-center gap-2"
                  >
                    <Layout className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search section em fundo contrastante */}
        <div className="max-w-3xl mx-auto -mt-6 mb-12">
          <motion.div
            className="bg-zinc-900 rounded-xl p-4 shadow-lg border border-zinc-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BlogSearch
              searchQuery={searchQuery}
              onSearchChange={(value) => setSearchQuery(value)}
            />
          </motion.div>
        </div>

        {/* Blog posts grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
      </div>
    </div>
  );
}

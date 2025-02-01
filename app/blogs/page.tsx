"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BlogPost } from "@/data/store";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogSearch } from "@/components/blog/blog-search";
import { BlogCard } from "@/components/blog/blog-card";

const sampleBlogs: BlogPost[] = [
  {
    id: "1",
    title: "The Evolution of Anime Gaming",
    description:
      "Exploring how anime games have transformed the gaming industry over the past decade, from simple adaptations to complex narrative experiences.",
    date: "January 31, 2025",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
    content: "Full article content will be loaded dynamically.",
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
    },
  },
  {
    id: "2",
    title: "Behind the Scenes: Character Design",
    description:
      "A deep dive into our character design process and what makes our characters unique. Learn about our inspiration and creative process.",
    date: "January 30, 2025",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=1000&auto=format&fit=crop",
    content: "Full article content will be loaded dynamically.",
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
    },
  },
  {
    id: "3",
    title: "The Future of Gaming Technology",
    description:
      "Discover the latest trends in gaming technology and how they're shaping the future of interactive entertainment.",
    date: "January 29, 2025",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    content: "Full article content will be loaded dynamically.",
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
    },
  },
  {
    id: "4",
    title: "Community Spotlight: Player Stories",
    description:
      "Highlighting amazing stories from our community members and their experiences in the world of Battle Damage Studios.",
    date: "January 28, 2025",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1000&auto=format&fit=crop",
    content: "Full article content will be loaded dynamically.",
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
    },
  },
  {
    id: "5",
    title: "Art Direction in Modern Gaming",
    description:
      "An in-depth look at how art direction shapes the gaming experience and creates immersive worlds.",
    date: "January 27, 2025",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    content: "Full article content will be loaded dynamically.",
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
    },
  },
];

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = sampleBlogs.filter(
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
        <BlogHeader 
          title="Battle Damage Blog"
          description="Stay updated with the latest news, development insights, and community stories"
        />

        <BlogSearch 
          searchQuery={searchQuery}
          onSearchChange={(value) => setSearchQuery(value)}
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredBlogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

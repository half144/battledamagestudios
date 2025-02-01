'use client';

import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { MagicCard } from "@/components/ui/magic-card";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
}

const sampleBlogs: BlogPost[] = [
  {
    id: "1",
    title: "The Evolution of Anime Gaming",
    description: "Exploring how anime games have transformed the gaming industry over the past decade, from simple adaptations to complex narrative experiences.",
    date: "January 31, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Behind the Scenes: Character Design",
    description: "A deep dive into our character design process and what makes our characters unique. Learn about our inspiration and creative process.",
    date: "January 30, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "The Future of Gaming Technology",
    description: "Discover the latest trends in gaming technology and how they're shaping the future of interactive entertainment.",
    date: "January 29, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Community Spotlight: Player Stories",
    description: "Highlighting amazing stories from our community members and their experiences in the world of Battle Damage Studios.",
    date: "January 28, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Art Direction in Modern Gaming",
    description: "An in-depth look at how art direction shapes the gaming experience and creates immersive worlds.",
    date: "January 27, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredBlogs = sampleBlogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div 
        className="space-y-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-red-500" />
            <h1 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600"
            >
              Battle Damage Blog
            </h1>
          </div>
          <motion.p 
            className="text-muted-foreground max-w-[600px] text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Stay updated with the latest news, development insights, and community stories
          </motion.p>
        </div>

        <motion.div 
          className="max-w-xl mx-auto w-full relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-6 text-lg border-red-500/20"
          />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <MagicCard 
                className="flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden"
                gradientFrom="rgb(239 68 68)"
                gradientTo="rgb(185 28 28)"
                gradientOpacity={0.2}
              >
                <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform transition-all duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${blog.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardHeader className="relative z-10 -mt-6">
                  <CardTitle className="line-clamp-2 text-xl">
                    <Link href={`/blogs/${blog.id}`} className="hover:text-red-500 transition-colors">
                      {blog.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <span className="text-red-500">{blog.date}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{blog.readTime}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">
                    {blog.description}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-6">
                  <Button asChild variant="default" className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                    <Link href={`/blogs/${blog.id}`}>
                      Read More
                    </Link>
                  </Button>
                </CardFooter>
              </MagicCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

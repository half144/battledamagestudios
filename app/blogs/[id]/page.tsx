"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import { use } from "react";
import { BlogPost as IBlogPost } from "@/data/store";

const getBlogPost = (id: string): IBlogPost => ({
  id,
  title: "The Evolution of Anime Gaming",
  description: "Exploring how anime games have transformed the gaming industry over the past decade, from simple adaptations to complex narrative experiences.",
  date: "January 31, 2025",
  readTime: "5 min read",
  image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
  content: `
    <p>The world of anime gaming has undergone a remarkable transformation over the past decade. From simple 2D fighters to complex, narrative-driven experiences, the evolution has been nothing short of extraordinary.</p>
    
    <h2>The Early Days</h2>
    <p>In the beginning, anime games were primarily simple adaptations of popular series, often lacking in depth and merely serving as fan service. However, as technology advanced and gaming audiences matured, developers began to see the potential for more sophisticated experiences.</p>
    
    <h2>The Modern Era</h2>
    <p>Today's anime games are pushing boundaries in both visual fidelity and gameplay mechanics. At Battle Damage Studios, we're proud to be at the forefront of this evolution, creating experiences that honor the anime aesthetic while delivering compelling gameplay.</p>
    
    <h2>Looking to the Future</h2>
    <p>As we look ahead, the possibilities are endless. With advancing technology and growing global appreciation for anime aesthetics, we're entering a golden age of anime gaming.</p>
  `,
  author: {
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop"
  }
});

export default function BlogPost({ params }: any) {
  const resolvedParams: any = use(params);
  const post = getBlogPost(resolvedParams.id);

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        className="max-w-4xl mx-auto space-y-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button variant="ghost" asChild className="group hover:text-red-500">
            <Link href="/blogs" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Blogs
            </Link>
          </Button>
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
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-red-500/20">
                <div
                  className="w-full h-full bg-cover bg-center transform transition-all duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${post.author.avatar})` }}
                />
              </div>
              <div>
                <div className="font-semibold text-lg">{post.author.name}</div>
                <div className="text-sm text-red-500">Author</div>
              </div>
            </div>

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

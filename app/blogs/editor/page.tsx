'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { addBlogPost } from "@/data/store";

export default function BlogEditorPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: `${Math.ceil(formData.content.length / 1000)} min read`,
      image: formData.image || 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?q=80&w=2070&auto=format&fit=crop'
    };
    addBlogPost(newPost);
    window.location.href = '/blogs';
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-12">
          <Link href="/blogs" className="flex items-center text-red-500 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blogs
          </Link>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-500" />
            New Blog Post
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Image URL</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Paste image URL here"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Write a short description"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Write your post content here..."
              required
              rows={12}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/blogs">
                Cancel
              </Link>
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              Publish Post
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

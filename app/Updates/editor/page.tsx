"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import { useState } from "react";
import { addBlogPost } from "@/data/store";
import { EditorHeader } from "@/components/blog/editor-header";
import { EditorControls } from "@/components/blog/editor-controls";
import { EditorActions } from "@/components/blog/editor-actions";
import { motion } from "framer-motion";

interface BlogFormData {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  author?: {
    name: string;
    avatar: string;
  };
}

export default function BlogEditorPage() {
  const [formData, setFormData] = useState<BlogFormData>({
    id: new Date().getTime().toString(),
    title: "",
    description: "",
    content: "",
    image: "",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: "5 min read",
    author: {
      name: "Kibs",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      ...formData,
      readTime: `${Math.ceil(formData.content.length / 1000)} min read`,
    };
    addBlogPost(newPost);
    window.location.href = "/blogs";
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <EditorHeader backLink="/blogs" title="New Blog Post" />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Image URL</label>
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="Paste image URL here"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Write a short description"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <div className="rounded-lg border p-4 focus-within:ring-2 focus-within:ring-red-500">
              <EditorControls editor={editor} />
              <EditorContent
                editor={editor}
                className="prose max-w-none dark:prose-invert focus:outline-none min-h-[400px] p-2"
              />
            </div>
          </div>

          <EditorActions onCancel="/blogs" submitLabel="Publish Post" />
        </form>
      </motion.div>
    </div>
  );
}

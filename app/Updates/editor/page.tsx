"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import { useState, useEffect } from "react";
import { BlogPost, convertBlogPostToPost } from "@/lib/supabase";
import { EditorHeader } from "@/components/blog/editor-header";
import { EditorControls } from "@/components/blog/editor-controls";
import { EditorActions } from "@/components/blog/editor-actions";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { createPost, fetchPostById, updatePost } from "@/lib/posts";
import { AdminRoute } from "@/components/AdminRoute";

export default function BlogEditorPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogPost>({
    id: "",
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
      name: "",
      avatar: "/default-avatar.png",
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Carregar post para edição
  useEffect(() => {
    if (editId) {
      const loadPost = async () => {
        setLoading(true);
        try {
          const post = await fetchPostById(editId);
          if (post) {
            setFormData(post);
            editor?.commands.setContent(post.content);
          }
        } catch (error) {
          console.error("Error loading post for edit:", error);
        } finally {
          setLoading(false);
        }
      };

      loadPost();
    }
  }, [editId, editor]);

  // Carregar informações do usuário
  useEffect(() => {
    if (user && !authLoading) {
      setFormData(prev => ({
        ...prev,
        author: {
          name: user.user_metadata?.username || user.email || "Anonymous",
          avatar: user.user_metadata?.avatar_url || "/default-avatar.png",
        }
      }));
    }
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    
    setLoading(true);
    
    try {
      // Calcular tempo de leitura
      const wordCount = formData.content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      
      const updatedPost = {
        ...formData,
        readTime: `${readTime} min read`,
      };
      
      // Converter para o formato do Supabase
      const postData = convertBlogPostToPost(updatedPost, user.id);
      
      if (editId) {
        // Atualizar post existente
        await updatePost(editId, postData);
      } else {
        // Criar novo post
        await createPost(postData);
      }
      
      // Redirecionar para a página de blogs
      router.push('/Updates');
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error saving post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <EditorHeader 
            backLink="/Updates" 
            title={editId ? "Edit Blog Post" : "New Blog Post"} 
          />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          ) : (
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
                  required
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

              <EditorActions 
                onCancel="/Updates"  // Passando uma string em vez de uma função
                submitLabel={editId ? "Update Post" : "Publish Post"} 
              />
            </form>
          )}
        </motion.div>
      </div>
    </AdminRoute>
  );
}
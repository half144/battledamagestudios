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
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";

interface EditorPageClientProps {
  editId: string | null;
  initialData: BlogPost | null;
}

export default function EditorPageClient({
  editId,
  initialData,
}: EditorPageClientProps) {
  const { profile } = useAuth();
  const router = useRouter();
  const { supabase } = useSupabase();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogPost>({
    id: initialData?.id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    date:
      initialData?.date ||
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    readTime: initialData?.readTime || "5 min read",
    author: initialData?.author || {
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

  // Configurar o conteúdo do editor quando os dados iniciais estiverem disponíveis
  useEffect(() => {
    if (initialData && editor && !editor.isDestroyed) {
      editor.commands.setContent(initialData.content);
    }
  }, [initialData, editor]);

  // Atualizar informações do autor quando o usuário estiver disponível
  useEffect(() => {
    if (profile && !initialData?.author) {
      setFormData((prev) => ({
        ...prev,
        author: {
          name: profile.username,
          avatar: "/default-avatar.png",
        },
      }));
    }
  }, [profile, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) {
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

      // Dados para enviar ao Supabase
      const postData = {
        title: updatedPost.title,
        content: updatedPost.content,
        image_url: updatedPost.image,
        author_id: profile.id,
      };

      if (editId) {
        // Atualizar post existente
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", editId);

        if (error) throw error;
      } else {
        // Criar novo post
        const { error } = await supabase.from("posts").insert([postData]);

        if (error) throw error;
      }

      // Redirecionar para a página de blogs
      router.push("/Updates");
    } catch (error) {
      console.error("Error saving post:", error);
      setLoading(false);
    }
  };

  return (
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
              onCancel="/Updates"
              submitLabel={editId ? "Update Post" : "Publish Post"}
            />
          </form>
        )}
      </motion.div>
    </div>
  );
}

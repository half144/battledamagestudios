"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import { useState, useEffect } from "react";
import { BlogPost } from "@/types/blog";
import { EditorHeader } from "@/components/blog/editor-header";
import { EditorControls } from "@/components/blog/editor-controls";
import { EditorActions } from "@/components/blog/editor-actions";
import { motion } from "framer-motion";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";
import { createPostApi, updatePostApi } from "@/lib/postsApi";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EditorPageClientProps {
  editId: string | null;
  initialData: BlogPost | null;
}

export default function EditorPageClient({
  editId,
  initialData,
}: EditorPageClientProps) {
  const { profile } = useAuthStatus();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogPost & { error?: string }>({
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
          name: profile.full_name || profile.username,
          avatar: profile.avatar_url || "/default-avatar.png",
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

      // Dados para enviar à API REST
      const postData = {
        title: updatedPost.title,
        content: updatedPost.content,
        image_url: updatedPost.image,
        author_id: profile.id,
      };

      let success = false;
      let errorMessage = "";

      if (editId) {
        // Atualizar post existente usando a API REST
        success = await updatePostApi(editId, postData);
        if (!success) {
          errorMessage = "Falha ao atualizar o post";
        }
      } else {
        // Criar novo post usando a API REST
        const newPostId = await createPostApi(postData);
        if (newPostId) {
          success = true;
          console.log("Post criado com ID:", newPostId);
        } else {
          errorMessage = "Falha ao criar novo post";
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      // Aqui você poderia adicionar um estado para exibir o erro na interface
      setFormData((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao salvar o post",
      }));
    } finally {
      window.location.href = "/Updates";
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

        {formData.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{formData.error}</AlertDescription>
          </Alert>
        )}

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

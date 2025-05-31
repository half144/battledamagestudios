import { cookies } from "next/headers";
import { BlogPost } from "@/types/blog";
import EditorPageClient from "./editor-page-client";
import { redirect } from "next/navigation";
import {
  SUPABASE_URL,
  SUPABASE_API_KEY,
  getApiHeaders,
} from "@/lib/supabaseApi";

// Função para buscar post para edição usando a API REST
async function getPostForEdit(id: string | null): Promise<BlogPost | null> {
  if (!id) return null;

  if (!SUPABASE_URL || !SUPABASE_API_KEY) {
    console.error("As variáveis de ambiente Supabase não estão configuradas");
    return null;
  }

  try {
    // Buscar o post por ID
    const postResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`,
      {
        method: "GET",
        headers: getApiHeaders(),
      }
    );

    if (!postResponse.ok) {
      console.error(
        `Error fetching post with ID ${id}:`,
        postResponse.statusText
      );
      return null;
    }

    const posts = await postResponse.json();

    if (!posts || posts.length === 0) {
      console.log(`No post found with ID ${id}`);
      return null;
    }

    const post = posts[0];

    // Buscar o perfil do autor
    let author = undefined;
    if (post.author_id) {
      const authorResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${post.author_id}&select=id,username,avatar_url,full_name`,
        {
          method: "GET",
          headers: getApiHeaders(),
        }
      );

      if (!authorResponse.ok) {
        console.error(
          "Error fetching author profile:",
          authorResponse.statusText
        );
      } else {
        const authors = await authorResponse.json();
        if (authors && authors.length > 0) {
          author = {
            name: authors[0].full_name || authors[0].username,
            avatar: authors[0].avatar_url || "/default-avatar.png",
          };
        }
      }
    }

    // Converter para o formato BlogPost
    const wordCount = post.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      id: post.id,
      title: post.title,
      description: post.description || "",
      content: post.content,
      image: post.image_url,
      date: new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: `${readTime} min read`,
      author,
    };
  } catch (err) {
    console.error(`Unexpected error fetching post ${id}:`, err);
    return null;
  }
}

// Desativar renderização estática para esta página
export const dynamic = "force-dynamic";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Simplificar temporariamente para permitir acesso
  const isAdmin = true;

  const editId = resolvedSearchParams.edit || null;
  const postToEdit = editId ? await getPostForEdit(editId) : null;

  return <EditorPageClient editId={editId} initialData={postToEdit} />;
}

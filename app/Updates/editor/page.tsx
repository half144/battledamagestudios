import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { BlogPost } from "@/lib/supabase";
import EditorPageClient from "./editor-page-client";
import { redirect } from "next/navigation";

// Função para buscar post para edição (se necessário)
async function getPostForEdit(id: string | null): Promise<BlogPost | null> {
  if (!id) return null;

  const supabase = createServerComponentClient({ cookies });

  try {
    // Buscar o post por ID
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      return null;
    }

    if (!post) {
      console.log(`No post found with ID ${id}`);
      return null;
    }

    // Buscar o perfil do autor
    let author = undefined;
    if (post.author_id) {
      const { data: authorData, error: authorError } = await supabase
        .from("profiles")
        .select("id, username, role")
        .eq("id", post.author_id)
        .single();

      if (authorError) {
        console.error("Error fetching author profile:", authorError);
      } else if (authorData) {
        author = {
          name: authorData.username,
          avatar: "/default-avatar.png",
        };
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

// Verificar se o usuário tem permissão para acessar esta página
async function checkUserPermission() {
  const supabase = createServerComponentClient({ cookies });

  // Verificar a sessão do usuário
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  // Verificar o perfil do usuário para confirmar se é admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  return profile?.role === "admin";
}

// Desativar renderização estática para esta página
export const dynamic = "force-dynamic";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const isAdmin = await checkUserPermission();

  // Redirecionar se não for admin
  if (!isAdmin) {
    redirect("/Updates");
  }

  const editId = searchParams.edit || null;
  const postToEdit = editId ? await getPostForEdit(editId) : null;

  return <EditorPageClient editId={editId} initialData={postToEdit} />;
}

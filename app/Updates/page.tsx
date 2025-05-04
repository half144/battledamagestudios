import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { BlogPost } from "@/lib/supabase";
import UpdatesPageClient from "./updates-page-client";

// Função para buscar os posts no servidor
async function getPosts(): Promise<BlogPost[]> {
  const supabase = createServerComponentClient({ cookies });

  try {
    console.log("Fetching posts from Supabase (server)...");

    // Buscar posts
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      console.error("Error details:", JSON.stringify(error));
      return [];
    }

    if (!posts || posts.length === 0) {
      console.log("No posts found in the database");
      return [];
    }

    // Coletar todos os IDs de autores para buscar perfis
    const authorIds = posts.map((post) => post.author_id).filter(Boolean);

    // Buscar perfis de autores
    let profilesMap: Record<string, any> = {};
    if (authorIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, role")
        .in("id", authorIds);

      if (profilesError) {
        console.error("Error fetching author profiles:", profilesError);
      } else if (profilesData) {
        // Converter array de perfis para objeto mapeado por ID
        profilesMap = profilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // Converter para o formato BlogPost
    const blogPosts = posts.map((post) => {
      const author = profilesMap[post.author_id];

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
        author: author
          ? {
              name: author.username,
              avatar: "/default-avatar.png",
            }
          : undefined,
      };
    });

    return blogPosts;
  } catch (err) {
    console.error("Unexpected error fetching posts:", err);
    return [];
  }
}

// Desativar renderização estática para esta página
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidar a cada hora (3600 segundos)

export default async function UpdatesPage() {
  const blogs = await getPosts();

  return <UpdatesPageClient blogs={blogs} />;
}

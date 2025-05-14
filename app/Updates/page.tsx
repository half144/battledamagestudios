import { cookies } from "next/headers";
import { BlogPost } from "@/types/blog";
import UpdatesPageClient from "./updates-page-client";
import { fetchPostsApi } from "@/lib/postsApi";

// Função para buscar os posts no servidor
async function getPosts(): Promise<BlogPost[]> {
  try {
    // Usar a API REST para buscar os posts
    return await fetchPostsApi();
  } catch (err) {
    console.error("Erro ao buscar posts:", err);
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

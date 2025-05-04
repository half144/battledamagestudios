import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { BlogPost } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PostDetail from "./PostDetail";
import { fetchPostById } from "@/lib/posts";

// Desativar renderização estática para esta página
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidar a cada hora (3600 segundos)

interface PageParams {
  id: string;
}

export default async function PostPage({ params }: { params: PageParams }) {
  const post = await fetchPostById(params.id);

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} />;
}

import { cookies } from "next/headers";
import { BlogPost } from "@/types/blog";
import { notFound } from "next/navigation";
import PostDetail from "./PostDetail";
import { fetchPostByIdApi } from "@/lib/postsApi";

// Desativar renderização estática para esta página
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidar a cada hora (3600 segundos)

interface PageParams {
  id: string;
}

export default async function PostPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = await params;
  const post = await fetchPostByIdApi(resolvedParams.id);

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} />;
}

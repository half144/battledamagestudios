import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * IMPORTANT: This direct Supabase client should only be used in:
 * - Server components
 * - API routes
 * - Server actions
 *
 * For client components, use the useSupabase hook instead:
 *
 * import { useSupabase } from "@/components/providers/supabase-provider";
 *
 * function YourComponent() {
 *   const { supabase } = useSupabase();
 *   // Use supabase client here
 * }
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função de utilidade para buscar o perfil do usuário
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, id")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

// Tipo para post
export interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  author_id: string;
  description?: string; // Adicionando para compatibilidade com a interface BlogPost
}

export interface Profile {
  id: string;
  username: string;
  role: "admin" | "user";
}

export interface BlogPost {
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

export function convertPostToBlogPost(post: Post, author?: Profile): BlogPost {
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
}

export function convertBlogPostToPost(
  blogPost: BlogPost,
  authorId: string
): Omit<Post, "id" | "created_at"> {
  return {
    title: blogPost.title,
    content: blogPost.content,
    image_url: blogPost.image,
    author_id: authorId,
    description: blogPost.description,
  };
}

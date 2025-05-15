// types/blog.ts
// Tipo para post
export interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  author_id: string;
  description?: string;
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

export function convertPostToBlogPost(
  post: Post,
  author?: { username: string; id: string; avatar_url?: string; role?: string }
): BlogPost {
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
          avatar: author.avatar_url || "/default-avatar.png",
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

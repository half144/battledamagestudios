// lib/posts.ts
import {
  supabase,
  Post,
  Profile,
  BlogPost,
  convertPostToBlogPost,
} from "./supabase";

// Buscar todos os posts
export async function fetchPosts(): Promise<BlogPost[]> {
  try {
    console.log("Fetching posts from Supabase...");

    // Verificar se o cliente Supabase está disponível
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return [];
    }

    // Log das variáveis de ambiente (sem mostrar valores completos por segurança)
    console.log(
      "NEXT_PUBLIC_SUPABASE_URL is set:",
      !!process.env.NEXT_PUBLIC_SUPABASE_URL
    );
    console.log(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is set:",
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Tentar buscar apenas os posts primeiro para verificar a conexão
    const { data: postsTest, error: errorTest } = await supabase
      .from("posts")
      .select("*")
      .limit(1);

    if (errorTest) {
      console.error("Error testing posts table connection:", errorTest);
      // Se houver erro, retornar dados de exemplo para não quebrar a UI
      return getSamplePosts();
    }

    console.log(
      "Connection test successful. Fetching all posts with author data..."
    );

    // Buscar posts e depois buscar os autores separadamente
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      console.error("Error details:", JSON.stringify(error));
      return getSamplePosts();
    }

    if (!posts || posts.length === 0) {
      console.log("No posts found in the database");
      return getSamplePosts();
    }

    console.log(`Successfully fetched ${posts.length} posts`);

    // Coletar todos os IDs de autores para buscar perfis
    const authorIds = posts.map((post) => post.author_id).filter(Boolean);

    // Buscar perfis de autores
    let profiles: Record<string, Profile> = {};
    if (authorIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, role")
        .in("id", authorIds);

      if (profilesError) {
        console.error("Error fetching author profiles:", profilesError);
      } else if (profilesData) {
        // Converter array de perfis para objeto mapeado por ID
        profiles = profilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, Profile>);
      }
    }

    // Converter para o formato BlogPost
    return posts
      .map((post) => {
        try {
          const author = profiles[post.author_id];
          const postData = post as unknown as Post;

          return convertPostToBlogPost(postData, author);
        } catch (err) {
          console.error("Error converting post:", err, post);
          return null;
        }
      })
      .filter(Boolean) as BlogPost[];
  } catch (err) {
    console.error("Unexpected error fetching posts:", err);
    return getSamplePosts();
  }
}

// Buscar post por ID
export async function fetchPostById(postId: string): Promise<BlogPost | null> {
  try {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return null;
    }

    // Buscar o post por ID
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error(`Error fetching post with ID ${postId}:`, error);
      return null;
    }

    if (!post) {
      console.log(`No post found with ID ${postId}`);
      return null;
    }

    // Buscar o perfil do autor
    let author: Profile | undefined;
    if (post.author_id) {
      const { data: authorData, error: authorError } = await supabase
        .from("profiles")
        .select("id, username, role")
        .eq("id", post.author_id)
        .single();

      if (authorError) {
        console.error(`Error fetching author for post ${postId}:`, authorError);
      } else {
        author = authorData;
      }
    }

    const postData = post as unknown as Post;
    return convertPostToBlogPost(postData, author);
  } catch (err) {
    console.error(`Unexpected error fetching post ${postId}:`, err);
    return null;
  }
}

// Criar novo post
export async function createPost(
  postData: Omit<Post, "id" | "created_at">
): Promise<string | null> {
  try {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return null;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([postData])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating post:", error);
      return null;
    }

    return data.id;
  } catch (err) {
    console.error("Unexpected error creating post:", err);
    return null;
  }
}

// Atualizar post existente
export async function updatePost(
  postId: string,
  postData: Omit<Post, "id" | "created_at">
): Promise<boolean> {
  try {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return false;
    }

    const { error } = await supabase
      .from("posts")
      .update(postData)
      .eq("id", postId);

    if (error) {
      console.error(`Error updating post ${postId}:`, error);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Unexpected error updating post ${postId}:`, err);
    return false;
  }
}

// Excluir post
export async function deletePost(postId: string): Promise<boolean> {
  try {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return false;
    }

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error(`Error deleting post ${postId}:`, error);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Unexpected error deleting post ${postId}:`, err);
    return false;
  }
}

// Dados de exemplo para usar em caso de falha na conexão
function getSamplePosts(): BlogPost[] {
  return [
    {
      id: "sample-1",
      title: "Sample Post (Database Connection Issue)",
      description:
        "This is a sample post shown because there was a problem connecting to the database.",
      content:
        "<p>Please check your Supabase connection and database configuration.</p>",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: "1 min read",
      author: {
        name: "System",
        avatar: "/default-avatar.png",
      },
    },
  ];
}

// O resto das funções permanece igual...

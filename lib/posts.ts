// lib/posts.ts
import { supabase, Post, Profile, BlogPost, convertPostToBlogPost } from './supabase';

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
    console.log("NEXT_PUBLIC_SUPABASE_URL is set:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY is set:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Tentar buscar apenas os posts primeiro para verificar a conexão
    const { data: postsTest, error: errorTest } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
      
    if (errorTest) {
      console.error('Error testing posts table connection:', errorTest);
      // Se houver erro, retornar dados de exemplo para não quebrar a UI
      return getSamplePosts();
    }
    
    console.log("Connection test successful. Fetching all posts with author data...");
    
    // Buscar posts com join na tabela profile para informações do autor
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        profile:author_id (id, username, role, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts with author data:', error);
      console.error('Error details:', JSON.stringify(error));
      return getSamplePosts();
    }

    if (!posts || posts.length === 0) {
      console.log("No posts found in the database");
      return getSamplePosts();
    }

    console.log(`Successfully fetched ${posts.length} posts`);
    
    // Converter para o formato BlogPost
    return posts.map(post => {
      try {
        const { profile } = post as unknown as { profile: Profile };
        const postData = post as unknown as Post;
        
        return convertPostToBlogPost(postData, profile);
      } catch (err) {
        console.error("Error converting post:", err, post);
        return null;
      }
    }).filter(Boolean) as BlogPost[];
  } catch (err) {
    console.error('Unexpected error fetching posts:', err);
    return getSamplePosts();
  }
}

// Dados de exemplo para usar em caso de falha na conexão
function getSamplePosts(): BlogPost[] {
  return [
    {
      id: "sample-1",
      title: "Sample Post (Database Connection Issue)",
      description: "This is a sample post shown because there was a problem connecting to the database.",
      content: "<p>Please check your Supabase connection and database configuration.</p>",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
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
    }
  ];
}

// O resto das funções permanece igual...
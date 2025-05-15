import { Post, BlogPost, convertPostToBlogPost } from "@/types/blog";
import fetchClient from "./fetchClient";

// Função de fallback movida para o topo para evitar "Cannot find name" errors.
function getSamplePosts(): BlogPost[] {
  return [
    {
      id: "sample-1",
      title: "Exemplo de Post (Problema de Conexão)",
      description:
        "Este é um post de exemplo exibido porque houve um problema na conexão com o banco de dados.",
      content:
        "<p>Por favor, verifique a configuração da conexão com o Supabase.</p>",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: "1 min read",
      author: { name: "Sistema", avatar: "/default-avatar.png" },
    },
  ];
}

// Interface para o perfil do autor, como retornado pelo Supabase com o select
interface AuthorProfileFromSupabase {
  id: string;
  username: string;
  avatar_url?: string;
  role?: string; // Adicionando role se vier do Supabase e for usado
}

// Modificando o tipo Post para refletir que a FK do autor (ex: author_id)
// pode ser substituída pelo objeto AuthorProfileFromSupabase quando usamos o select
interface PostWithInlinedAuthor extends Post {
  // Se sua FK for 'author_id' e você usar select=*,author_id:profiles(...)
  // o Supabase aninhará o perfil DENTRO de uma propriedade chamada 'author_id'.
  // Se você usar um alias no select como select=*,author:author_id:profiles(...)
  // então virá em 'author'. Vamos assumir que a FK é 'author_id' e você quer os dados do autor em 'author_id_data'
  // ou, mais comum, o Supabase substitui a FK pelo objeto se o nome da relação for igual ao campo da FK.
  // Para maior clareza, vamos usar um alias no select: `author:author_id(id,username,avatar_url)`
  // Assim, esperamos `post.author` ser do tipo `AuthorProfileFromSupabase`.
  author?: AuthorProfileFromSupabase; // Esta propriedade será populada pelo Supabase com o select
}

// Criar novo post usando o acesso direto
export async function createPostApi(
  postData: Omit<Post, "id" | "created_at">
): Promise<string | null> {
  try {
    const newPostArray = await fetchClient.post<PostWithInlinedAuthor[]>(
      "/rest/v1/posts",
      postData
    );
    return newPostArray && newPostArray.length > 0 ? newPostArray[0].id : null;
  } catch (err) {
    console.error("Erro ao criar post:", err);
    return null;
  }
}

// Atualizar post existente usando o acesso direto
export async function updatePostApi(
  postId: string,
  postData: Omit<Post, "id" | "created_at">
): Promise<boolean> {
  try {
    await fetchClient.patch(`/rest/v1/posts?id=eq.${postId}`, postData);
    return true;
  } catch (err) {
    console.error(`Erro ao atualizar post ${postId}:`, err);
    return false;
  }
}

async function fetchAuthorsByIds(
  authorIds: string[]
): Promise<Record<string, AuthorProfileFromSupabase>> {
  if (authorIds.length === 0) return {};
  try {
    const uniqueAuthorIds = [...new Set(authorIds)].filter((id) => id);
    if (uniqueAuthorIds.length === 0) return {};

    const profiles = await fetchClient.get<AuthorProfileFromSupabase[]>(
      `/rest/v1/profiles?id=in.(${uniqueAuthorIds.join(
        ","
      )})&select=id,username,role`
    );
    const profilesMap: Record<string, AuthorProfileFromSupabase> = {};
    profiles.forEach((profile) => {
      profilesMap[profile.id] = profile;
    });
    return profilesMap;
  } catch (error) {
    console.error("Erro ao buscar perfis de autores:", error);
    return {}; // Retornar mapa vazio em caso de erro
  }
}

// Buscar todos os posts usando o acesso direto
export async function fetchPostsApi(): Promise<BlogPost[]> {
  try {
    const postsRaw = await fetchClient.get<Post[]>(
      "/rest/v1/posts?select=*&order=created_at.desc"
    );

    if (!postsRaw || postsRaw.length === 0) {
      console.log("Nenhum post encontrado no banco de dados.");
      return getSamplePosts();
    }

    const authorIds = postsRaw.map((post) => post.author_id).filter((id) => id);
    const authorsMap = await fetchAuthorsByIds(authorIds);

    return postsRaw.map((post) => {
      const authorProfile = authorsMap[post.author_id];
      return convertPostToBlogPost(post, authorProfile);
    });
  } catch (err) {
    console.error("Erro ao buscar posts:", err);
    return getSamplePosts();
  }
}

// Buscar post por ID
export async function fetchPostByIdApi(
  postId: string
): Promise<BlogPost | null> {
  try {
    // Busca o post específico. O tipo Post já tem author_id.
    const postsRaw = await fetchClient.get<Post[]>(
      `/rest/v1/posts?id=eq.${postId}&select=*`
    );

    if (!postsRaw || postsRaw.length === 0) {
      console.log(`Post com ID ${postId} não encontrado.`);
      return null;
    }
    const post = postsRaw[0];

    let authorProfile: AuthorProfileFromSupabase | undefined = undefined;
    if (post.author_id) {
      const authorsMap = await fetchAuthorsByIds([post.author_id]);
      authorProfile = authorsMap[post.author_id];
    }

    return convertPostToBlogPost(post, authorProfile);
  } catch (err) {
    console.error(`Erro ao buscar post ${postId}:`, err);
    return null;
  }
}

// Excluir post usando o acesso direto
export async function deletePostApi(postId: string): Promise<boolean> {
  try {
    await fetchClient.delete(`/rest/v1/posts?id=eq.${postId}`);
    return true;
  } catch (err) {
    console.error(`Erro ao deletar post ${postId}:`, err);
    return false;
  }
}

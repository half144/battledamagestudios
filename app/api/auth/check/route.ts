import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_API_KEY } from "@/lib/supabaseApi";

// Nome do cookie de autenticação do Supabase
const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME ||
  "sb-rnqhnainrwsbyeyvttcm-auth-token";

/**
 * Endpoint para verificar a autenticação do usuário usando o Supabase Auth REST API
 * O cookie httpOnly é enviado automaticamente nas requisições
 */
export async function GET(request: NextRequest) {
  try {
    // Obter o cookie de autenticação
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    // Se não houver cookie, o usuário não está autenticado
    if (!authCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    try {
      // Extrair o token do cookie (formato padrão do Supabase)
      const tokenData = JSON.parse(decodeURIComponent(authCookie));
      const accessToken = tokenData[0]; // O primeiro item é o token de acesso

      if (!accessToken) {
        return NextResponse.json(
          { authenticated: false, message: "Token não encontrado no cookie" },
          { status: 200 }
        );
      }

      console.log("[Auth Check] Access token:", accessToken);

      // Verificar o token usando a API do Supabase
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: SUPABASE_API_KEY || "",
        },
        cache: "no-store",
      });

      // Se o token não for válido, retornar não autenticado
      if (!response.ok) {
        return NextResponse.json(
          { authenticated: false, message: "Sessão inválida ou expirada" },
          { status: 200 }
        );
      }

      // Obter dados do usuário
      const userData = await response.json();

      // Buscar perfil personalizado do usuário na tabela profiles
      const profileResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userData.id}&select=id,username,role,avatar_url,full_name,created_at,updated_at,total_spent,member_since`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: SUPABASE_API_KEY || "",
          },
          cache: "no-store",
        }
      );

      // Se tiver perfil, combinar dados
      let profileData = {};
      if (profileResponse.ok) {
        const profiles = await profileResponse.json();
        if (profiles && profiles.length > 0) {
          profileData = profiles[0];
          console.log("[Auth Check] Profile data from DB:", profileData); // Debug log
        }
      }

      // Se não tiver um perfil, criar um padrão
      if (!profileData || Object.keys(profileData).length === 0) {
        profileData = {
          username: userData.email?.split("@")[0] || "user",
          role: "user",
        };
      }

      const finalUserData = {
        id: userData.id,
        email: userData.email,
        ...profileData,
      };

      console.log(
        "[Auth Check] Final user data being returned:",
        finalUserData
      ); // Debug log

      // Responder com os dados do usuário autenticado
      return NextResponse.json(
        {
          authenticated: true,
          user: finalUserData,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("[API] Erro ao processar token:", error);
      return NextResponse.json(
        { authenticated: false, message: "Erro ao processar token" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[API] Erro ao verificar autenticação:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}

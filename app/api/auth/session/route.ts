import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_API_KEY } from "@/lib/supabaseApi";

// Nome do cookie de autenticação do Supabase
const AUTH_COOKIE_NAME = "sb-rnqhnainrwsbyeyvttcm-auth-token";

/**
 * Endpoint para definir cookies de sessão após login bem-sucedido
 * Implementação seguindo a documentação do Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const { session } = await request.json();

    if (!session || !session.access_token) {
      return NextResponse.json(
        { error: "Token de acesso ausente" },
        { status: 400 }
      );
    }

    // Criar resposta indicando sucesso
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Definir cookies de acordo com o formato padrão Supabase
    // O formato é um array JSON [access_token, refresh_token]
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: JSON.stringify([
        session.access_token,
        session.refresh_token || "",
      ]),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("[API] Erro ao definir cookies de sessão:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}

/**
 * Endpoint para verificar a sessão atual do usuário
 */
export async function GET(request: NextRequest) {
  try {
    // Obter token do cookie
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!authCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    try {
      // Extrair o token do cookie
      const tokenData = JSON.parse(decodeURIComponent(authCookie));
      const accessToken = tokenData[0];

      if (!accessToken) {
        return NextResponse.json(
          { authenticated: false, message: "Token não encontrado no cookie" },
          { status: 200 }
        );
      }

      // Verificar o token chamando a API Supabase
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: SUPABASE_API_KEY || "",
        },
      });

      if (!response.ok) {
        // Token inválido ou expirado
        return NextResponse.json(
          { authenticated: false, message: "Sessão expirada ou inválida" },
          { status: 200 }
        );
      }

      // Obter dados do usuário
      const userData = await response.json();

      return NextResponse.json(
        {
          authenticated: true,
          user: {
            id: userData.id,
            email: userData.email,
          },
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("[API] Erro ao processar token:", err);
      return NextResponse.json(
        { authenticated: false, message: "Erro ao processar token" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[API] Erro ao verificar sessão:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}

/**
 * Endpoint para remover cookies de sessão (logout)
 */
export async function DELETE() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logout realizado com sucesso" },
      { status: 200 }
    );

    // Remover o cookie de autenticação
    response.cookies.delete(AUTH_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error("[API] Erro ao fazer logout:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}

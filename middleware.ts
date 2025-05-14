import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_API_KEY } from "@/lib/supabaseApi";

// Nome do cookie de autenticação do Supabase
const AUTH_COOKIE_NAME = "sb-rnqhnainrwsbyeyvttcm-auth-token";

// Rotas públicas que não requerem autenticação
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/register",
  "/about",
  "/Updates",
  "/api/auth/session",
  "/api/auth/check",
  "/reset-password",
  "/forgot-password",
];

// Rotas de recursos estáticos que devem ser ignoradas
const staticRoutes = [
  "/_next",
  "/static",
  "/favicon.ico",
  "/robots.txt",
  "/manifest.json",
  "/images",
];

// Rotas protegidas que requerem autenticação
const protectedRoutes = [
  "/profile",
  "/admin",
  "/dashboard",
  "/settings",
  "/Updates/editor",
];

/**
 * Middleware de autenticação Supabase
 * Verificação padrão de tokens conforme documentação: https://supabase.com/docs/guides/auth
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar rotas públicas
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    ) &&
    !protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    )
  ) {
    return NextResponse.next();
  }

  // Ignorar rotas de recursos estáticos
  if (
    staticRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Verificar se o cookie de autenticação existe
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Se não houver cookie, redirecionar para o login
  if (!authCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Extrair o token do cookie (formato padrão do Supabase)
    const tokenData = JSON.parse(decodeURIComponent(authCookie.value));
    const accessToken = tokenData[0]; // O primeiro item é o token de acesso

    if (!accessToken) {
      throw new Error("Token não encontrado");
    }

    // Verificar o token usando a API Supabase
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: SUPABASE_API_KEY || "",
      },
    });

    if (!response.ok) {
      // Token inválido ou expirado
      throw new Error("Token inválido ou expirado");
    }

    // Token válido, permitir acesso
    return NextResponse.next();
  } catch (error) {
    console.error("Erro de autenticação:", error);
    // Redirecionar para o login em caso de erro
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("error", "session_expired");
    return NextResponse.redirect(loginUrl);
  }
}

// Configurar o matcher para as rotas que devem passar pelo middleware
export const config = {
  // Aplicar o middleware apenas às rotas protegidas
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/Updates/editor/:path*",
  ],
};

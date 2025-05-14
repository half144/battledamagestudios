import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("[API Test] Rota de teste foi acessada!");
  return NextResponse.json({
    message: "API de teste funcionando!",
    timestamp: new Date().toISOString(),
    url: request.url,
  });
}

export async function POST(request: NextRequest) {
  console.log("[API Test] POST na rota de teste!");
  return NextResponse.json({
    message: "POST na API de teste funcionando!",
    timestamp: new Date().toISOString(),
  });
}

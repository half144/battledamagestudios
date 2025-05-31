import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Buscando produtos do Stripe...");

    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    console.log("📦 Produtos encontrados:", products.data.length);

    return NextResponse.json({
      success: true,
      count: products.data.length,
      products: products.data,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar produtos do Stripe:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar produtos do Stripe",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

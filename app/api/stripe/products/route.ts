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

    products.data.forEach((product, index) => {
      console.log(`\n--- Produto ${index + 1} ---`);
      console.log("ID:", product.id);
      console.log("Nome:", product.name);
      console.log("Descrição:", product.description);
      console.log("Ativo:", product.active);
      console.log(
        "Criado em:",
        new Date(product.created * 1000).toLocaleString()
      );

      if (product.default_price && typeof product.default_price === "object") {
        console.log("Preço ID:", product.default_price.id);
        console.log(
          "Preço:",
          product.default_price.unit_amount
            ? product.default_price.unit_amount / 100
            : "N/A"
        );
        console.log("Moeda:", product.default_price.currency);
      }

      if (product.images && product.images.length > 0) {
        console.log("Imagens:", product.images);
      }

      if (product.metadata && Object.keys(product.metadata).length > 0) {
        console.log("Metadados:", product.metadata);
      }
    });

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

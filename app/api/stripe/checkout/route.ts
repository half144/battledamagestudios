import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    console.log("🛒 Criando sessão de checkout para:", items.length, "itens");

    // Obter userId da sessão Supabase
    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get(
      process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME ||
        "sb-rnqhnainrwsbyeyvttcm-auth-token"
    );

    let userId = null;
    if (authTokenCookie) {
      try {
        const tokenData = JSON.parse(decodeURIComponent(authTokenCookie.value));
        const accessToken = tokenData[0];
        if (accessToken) {
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          const {
            data: { user },
          } = await supabase.auth.getUser(accessToken);
          if (user) {
            userId = user.id;
          }
        }
      } catch (e) {
        console.error("Error getting user from token for Stripe checkout:", e);
      }
    }

    if (!userId) {
      // Se não conseguir o userId, não prosseguir com o checkout autenticado.
      // Poderia retornar um erro ou permitir checkout como convidado (se implementado).
      console.error(
        "User ID not found for Stripe checkout. User might not be authenticated."
      );
      return NextResponse.json(
        { error: "User authentication required for checkout." },
        { status: 401 }
      );
    }

    // Criar line items para o Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Converter para centavos
      },
      quantity: item.quantity,
    }));

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/checkout/cancel`,
      metadata: {
        userId: userId,
        items: JSON.stringify(
          items.map((item: any) => ({
            stripe_product_id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
    });

    console.log("✅ Sessão de checkout criada:", session.id);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("❌ Erro ao criar sessão de checkout:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar sessão de checkout",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

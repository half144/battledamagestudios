import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_API_KEY } from "@/lib/supabaseApi";
import Stripe from "stripe";

const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME ||
  "sb-rnqhnainrwsbyeyvttcm-auth-token";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET(request: NextRequest) {
  try {
    // Obter o cookie de autenticação
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!authCookie) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      // Extrair o token do cookie
      const tokenData = JSON.parse(decodeURIComponent(authCookie));
      const accessToken = tokenData[0];

      if (!accessToken) {
        return NextResponse.json(
          { error: "Invalid authentication token" },
          { status: 401 }
        );
      }

      // Verificar o token e obter o user_id
      const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: SUPABASE_API_KEY || "",
        },
      });

      if (!userResponse.ok) {
        return NextResponse.json(
          { error: "Invalid or expired session" },
          { status: 401 }
        );
      }

      const userData = await userResponse.json();
      const userId = userData.id;

      // Buscar os pedidos do usuário com JOIN para obter detalhes dos itens
      const ordersResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?user_id=eq.${userId}&select=*,order_items(*)&order=created_at.desc&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: SUPABASE_API_KEY || "",
          },
        }
      );

      if (!ordersResponse.ok) {
        throw new Error("Failed to fetch user orders");
      }

      const orders = await ordersResponse.json();

      // Coletar todos os product_ids únicos para buscar no Stripe
      const productIds = new Set<string>();
      for (const order of orders) {
        for (const item of order.order_items || []) {
          if (item.product_id) {
            productIds.add(item.product_id);
          }
        }
      }

      // Buscar informações dos produtos no Stripe
      const productNames: Record<string, string> = {};
      for (const productId of productIds) {
        try {
          const product = await stripe.products.retrieve(productId);
          productNames[productId] = product.name;
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error);
          productNames[productId] = `Product ${productId}`;
        }
      }

      // Transformar os dados para o formato esperado
      const purchases = [];
      for (const order of orders) {
        for (const item of order.order_items || []) {
          if (item.product_id) {
            // Só incluir itens com product_id válido
            purchases.push({
              id: `${order.id}-${item.id}`,
              user_id: order.user_id,
              product_id: item.product_id,
              product_name:
                productNames[item.product_id] || `Product ${item.product_id}`,
              quantity: item.quantity || 1,
              unit_price: parseFloat(item.price || 0),
              total_amount: parseFloat(item.price || 0) * (item.quantity || 1),
              purchase_date: order.created_at,
              stripe_payment_intent_id: order.stripe_payment_intent_id,
              order_id: order.id,
              order_total: parseFloat(order.total_price || 0),
              payment_status: order.payment_status,
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        purchases: purchases,
      });
    } catch (error) {
      console.error("[API] Error processing token:", error);
      return NextResponse.json(
        { error: "Error processing authentication" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("[API] Error fetching user purchases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

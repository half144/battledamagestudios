import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Etapa 1: Buscar todos os pedidos do usuário
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        created_at,
        payment_status,
        total_price,
        stripe_checkout_id
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      return NextResponse.json(
        { error: "Failed to fetch orders", details: ordersError.message },
        { status: 500 }
      );
    }

    if (!ordersData || ordersData.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Etapa 2: Para cada pedido, buscar seus itens e os detalhes dos produtos associados
    const enrichedOrders = [];
    for (const order of ordersData) {
      const { data: orderItemsData, error: orderItemsError } =
        await supabaseAdmin
          .from("order_items")
          .select(
            `
          id,
          quantity,
          price,
          products (id, name, image_url)
        `
          )
          .eq("order_id", order.id);

      if (orderItemsError) {
        console.error(
          `Error fetching order items for order ${order.id}:`,
          orderItemsError
        );
        // Pular este pedido ou retornar erro geral? Por enquanto, vamos pular itens problemáticos.
        enrichedOrders.push({ ...order, order_items: [] });
        continue;
      }

      enrichedOrders.push({ ...order, order_items: orderItemsData || [] });
    }

    return NextResponse.json({ orders: enrichedOrders });
  } catch (error: any) {
    console.error("Unexpected error fetching user orders:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // Precisaremos de um cliente admin do Supabase

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const relevantEvents = new Set([
  "checkout.session.completed",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
]);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.log("Webhook secret or signature missing.");
      return NextResponse.json(
        { error: "Webhook secret or signature missing." },
        { status: 400 }
      );
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          console.log("🛒 Checkout Session Completed:", checkoutSession.id);
          console.log("Checkout Session Metadata:", checkoutSession.metadata);

          const userId = checkoutSession.metadata?.userId;
          const itemsString = checkoutSession.metadata?.items;

          if (!userId || !itemsString) {
            console.error(
              "User ID or items metadata missing from checkout session",
              checkoutSession.id
            );
            return NextResponse.json(
              { error: "User ID or items metadata missing." },
              { status: 400 }
            );
          }

          const itemsFromMetadata = JSON.parse(itemsString) as Array<{
            stripe_product_id: string; // This is the Stripe Product ID (e.g., prod_...)
            name: string;
            quantity: number;
            price: number;
          }>;

          // 1. Criar o registro na tabela 'orders'
          const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .insert({
              user_id: userId,
              total_price: checkoutSession.amount_total! / 100,
              stripe_checkout_id: checkoutSession.id,
              stripe_payment_intent_id:
                typeof checkoutSession.payment_intent === "string"
                  ? checkoutSession.payment_intent
                  : null,
              payment_status: checkoutSession.payment_status,
            })
            .select()
            .single();

          if (orderError) {
            console.error("Error creating order:", orderError);
            return NextResponse.json(
              { error: "Failed to create order." },
              { status: 500 }
            );
          }
          console.log("Order created:", order.id);

          for (const itemData of itemsFromMetadata) {
            // Nao ha mais busca pelo product_id interno. Usaremos o stripe_product_id diretamente.
            // Certifique-se que as colunas product_id em order_items e user_purchases sao do tipo TEXT.

            const { error: itemError } = await supabaseAdmin
              .from("order_items")
              .insert({
                order_id: order.id,
                product_id: itemData.stripe_product_id, // Usando o ID do produto do Stripe
                price: itemData.price,
                quantity: itemData.quantity,
              });
            if (itemError) {
              console.error(
                `Error creating order item for Stripe product ${itemData.stripe_product_id}:`,
                itemError
              );
            }

            const { error: purchaseError } = await supabaseAdmin
              .from("user_purchases")
              .insert({
                user_id: userId,
                product_id: itemData.stripe_product_id, // Usando o ID do produto do Stripe
                purchase_date: new Date().toISOString(),
                stripe_payment_intent_id:
                  typeof checkoutSession.payment_intent === "string"
                    ? checkoutSession.payment_intent
                    : null,
              });
            if (purchaseError) {
              console.error(
                `Error creating user purchase for Stripe product ${itemData.stripe_product_id}:`,
                purchaseError
              );
            }
          }
          console.log(
            "Order items and user purchases created for order:",
            order.id
          );

          // 4. Atualizar 'profiles' (total_spent, total_orders)
          if (checkoutSession.amount_total) {
            const { error: profileError } = await supabaseAdmin.rpc(
              "increment_user_stats",
              {
                p_user_id: userId,
                p_amount_spent: checkoutSession.amount_total / 100,
              }
            );
            if (profileError) {
              console.error("Error updating profile stats:", profileError);
              // Não retornar erro aqui necessariamente, mas logar
            }
            console.log("Profile stats updated for user:", userId);
          }

          break;
        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data
            .object as Stripe.PaymentIntent;
          console.log("✅ PaymentIntent Succeeded:", paymentIntentSucceeded.id);
          // Lógica para lidar com pagamento bem-sucedido (pode ser redundante se já tratado no checkout.session.completed)
          // Útil para pagamentos diretos sem checkout session, ou para reconciliação.
          break;
        case "payment_intent.payment_failed":
          const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
          console.log("❌ PaymentIntent Failed:", paymentIntentFailed.id);
          // Lógica para lidar com falha no pagamento (ex: notificar usuário, atualizar status do pedido)
          break;
        default:
          console.warn(`Unhandled relevant event type: ${event.type}`);
      }
    } catch (error) {
      console.error("Error handling webhook event:", error);
      return NextResponse.json(
        { error: "Webhook handler failed. View logs." },
        { status: 500 }
      );
    }
  } else {
    console.log(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

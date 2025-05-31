import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // Precisaremos de um cliente admin do Supabase
import { sendPurchaseConfirmationEmail } from "@/lib/email";

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

          // Verificar se já processamos este checkout session (proteção contra duplicatas)
          const { data: existingOrder } = await supabaseAdmin
            .from("orders")
            .select("id")
            .eq("stripe_checkout_id", checkoutSession.id)
            .single();

          if (existingOrder) {
            console.log(
              `✅ Evento duplicado ignorado - Order já existe para checkout: ${checkoutSession.id}`
            );
            return NextResponse.json({ received: true });
          }

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
            // Criar order_item
            const { error: itemError } = await supabaseAdmin
              .from("order_items")
              .insert({
                order_id: order.id,
                product_id: itemData.stripe_product_id,
                quantity: itemData.quantity,
                price: itemData.price,
              });
            if (itemError) {
              console.error(
                `Error creating order item for Stripe product ${itemData.stripe_product_id}:`,
                itemError
              );
              // Don't continue if order_item creation fails
              throw new Error(
                `Failed to create order item: ${itemError.message}`
              );
            }
          }
          console.log("Order items created for order:", order.id);

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
            }
            console.log("Profile stats updated for user:", userId);
          }

          // Buscar dados do usuário para envio do email
          const { data: userData, error: userError } = await supabaseAdmin
            .from("profiles")
            .select("username, full_name")
            .eq("id", userId)
            .single();

          if (userError) {
            console.error("Error fetching user data for email:", userError);
          }

          // Buscar email do usuário através da auth
          const { data: authUser, error: authError } =
            await supabaseAdmin.auth.admin.getUserById(userId);

          if (authError) {
            console.error(
              "Error fetching user auth data for email:",
              authError
            );
          }

          // Enviar email de confirmação de compra
          if (authUser?.user?.email && checkoutSession.amount_total) {
            try {
              const emailSuccess = await sendPurchaseConfirmationEmail({
                customerEmail: authUser.user.email,
                customerName:
                  userData?.full_name || userData?.username || undefined,
                orderId: order.id,
                orderTotal: checkoutSession.amount_total / 100,
                items: itemsFromMetadata.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                })),
                paymentIntentId:
                  typeof checkoutSession.payment_intent === "string"
                    ? checkoutSession.payment_intent
                    : undefined,
              });

              if (emailSuccess) {
                console.log(
                  "✅ Purchase confirmation email sent to:",
                  authUser.user.email
                );
              } else {
                console.error("❌ Failed to send purchase confirmation email");
              }
            } catch (emailError) {
              console.error(
                "❌ Error sending purchase confirmation email:",
                emailError
              );
            }
          } else {
            console.error(
              "❌ No email found for user or invalid amount:",
              userId
            );
          }

          break;
        /* case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data
            .object as Stripe.PaymentIntent;
          console.log("✅ PaymentIntent Succeeded:", paymentIntentSucceeded.id);
          // Lógica para lidar com pagamento bem-sucedido (pode ser redundante se já tratado no checkout.session.completed)
          // Útil para pagamentos diretos sem checkout session, ou para reconciliação.
          break; */
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

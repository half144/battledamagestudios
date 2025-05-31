import PQueue from "p-queue";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendPurchaseConfirmationEmail } from "@/lib/email";
import Stripe from "stripe";

const webhookQueue = new PQueue({
  concurrency: 1,
  interval: 1000,
  intervalCap: 1,
});

webhookQueue.on("active", () => {
  console.log(
    `🔄 Queue ativa - Size: ${webhookQueue.size}, Pending: ${webhookQueue.pending}`
  );
});

webhookQueue.on("idle", () => {
  console.log("✅ Queue idle - todos os jobs processados");
});

webhookQueue.on("error", (error) => {
  console.error("❌ Erro na queue:", error);
});

interface WebhookJob {
  event: Stripe.Event;
  timestamp: number;
}

async function processCheckoutSessionCompleted(
  checkoutSession: Stripe.Checkout.Session,
  eventId: string
) {
  console.log("🔄 Processando checkout session:", checkoutSession.id);

  const userId = checkoutSession.metadata?.userId;
  const itemsString = checkoutSession.metadata?.items;

  if (!userId || !itemsString) {
    throw new Error(
      `User ID ou items metadata ausentes para checkout: ${checkoutSession.id}`
    );
  }

  const itemsFromMetadata = JSON.parse(itemsString) as Array<{
    stripe_product_id: string;
    name: string;
    quantity: number;
    price: number;
  }>;

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
    throw new Error(`Erro ao criar order: ${orderError.message}`);
  }

  console.log("✅ Order criada:", order.id);

  for (const itemData of itemsFromMetadata) {
    const { error: itemError } = await supabaseAdmin
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: itemData.stripe_product_id,
        quantity: itemData.quantity,
        price: itemData.price,
      });

    if (itemError) {
      throw new Error(`Erro ao criar order item: ${itemError.message}`);
    }
  }

  console.log("✅ Order items criados para order:", order.id);

  if (checkoutSession.amount_total) {
    const { error: profileError } = await supabaseAdmin.rpc(
      "increment_user_stats",
      {
        p_user_id: userId,
        p_amount_spent: checkoutSession.amount_total / 100,
      }
    );

    if (profileError) {
      console.error("⚠️ Erro ao atualizar stats do perfil:", profileError);
    } else {
      console.log("✅ Stats do perfil atualizadas para usuário:", userId);
    }
  }

  const { data: userData } = await supabaseAdmin
    .from("profiles")
    .select("username, full_name")
    .eq("id", userId)
    .single();

  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (authUser?.user?.email && checkoutSession.amount_total) {
    try {
      const emailSuccess = await sendPurchaseConfirmationEmail({
        customerEmail: authUser.user.email,
        customerName: userData?.full_name || userData?.username || undefined,
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
          "✅ Email de confirmação enviado para:",
          authUser.user.email
        );
      } else {
        console.error("❌ Falha ao enviar email de confirmação");
      }
    } catch (emailError) {
      console.error("❌ Erro ao enviar email de confirmação:", emailError);
    }
  }

  return order;
}

async function processWebhookEvent(job: WebhookJob): Promise<void> {
  const { event } = job;

  try {
    console.log(`🔄 Processando evento da fila: ${event.id} (${event.type})`);

    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        await processCheckoutSessionCompleted(checkoutSession, event.id);
        break;

      case "payment_intent.payment_failed":
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        console.log("❌ PaymentIntent Failed:", paymentIntentFailed.id);
        break;

      default:
        console.log(`ℹ️ Evento processado sem ação específica: ${event.type}`);
    }

    console.log(`🔄 Tentando marcar evento como processado: ${event.id}`);

    const { error: insertError } = await supabaseAdmin
      .from("processed_stripe_events")
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
      });

    if (insertError) {
      console.error(`❌ Erro ao inserir evento processado:`, insertError);
      throw insertError;
    }

    console.log(`✅ Evento processado e marcado como concluído: ${event.id}`);
  } catch (error) {
    console.error(`❌ Erro ao processar evento ${event.id}:`, error);
    throw error;
  }
}

export async function addEventToQueue(event: Stripe.Event): Promise<void> {
  console.log(`📥 Adicionando evento à fila: ${event.id} (${event.type})`);

  const job: WebhookJob = {
    event,
    timestamp: Date.now(),
  };

  try {
    await webhookQueue.add(() => processWebhookEvent(job));
    console.log(
      `✅ Evento adicionado à fila com sucesso: ${event.id} (${event.type})`
    );
  } catch (error) {
    console.error(`❌ Erro ao adicionar evento à fila:`, error);
    throw error;
  }
}

export function getQueueStatus() {
  return {
    size: webhookQueue.size,
    pending: webhookQueue.pending,
    isPaused: webhookQueue.isPaused,
  };
}

setInterval(() => {
  const status = getQueueStatus();
  if (status.size > 0 || status.pending > 0) {
    console.log(
      `📊 Queue Status - Size: ${status.size}, Pending: ${status.pending}`
    );
  }
}, 30000);

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { addEventToQueue } from "@/lib/webhook-queue";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const relevantEvents = new Set([
  "checkout.session.completed",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
]);

export async function POST(request: NextRequest) {
  console.log("🚀 Webhook recebido - iniciando processamento");

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
    console.log(`✅ Evento validado: ${event.id} (${event.type})`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    const { data: processedEvent } = await supabaseAdmin
      .from("processed_stripe_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .single();

    if (processedEvent) {
      console.log(
        `✅ Evento duplicado ignorado - Event ID: ${event.id}, Type: ${event.type}`
      );
      return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.log(`🔍 Evento novo detectado: ${event.id}`);
  }

  try {
    if (relevantEvents.has(event.type)) {
      console.log(`📋 Evento relevante detectado: ${event.type}`);
      await addEventToQueue(event);
      console.log(
        `⚡ Evento ${event.id} (${event.type}) adicionado à fila - Retornando 200`
      );
    } else {
      await supabaseAdmin.from("processed_stripe_events").insert({
        stripe_event_id: event.id,
        event_type: event.type,
      });
      console.log(`ℹ️ Evento não relevante marcado como visto: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed. View logs." },
      { status: 500 }
    );
  }
}

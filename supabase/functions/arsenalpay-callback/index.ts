
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ARSENALPAY_CLIENT_SECRET = Deno.env.get("ARSENALPAY_CLIENT_SECRET") || "";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const TELEGRAM_ADMIN_IDS = Deno.env.get("TELEGRAM_ADMIN_IDS") || "";

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Send Telegram notification
async function sendTelegramNotification(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_IDS) {
    console.log("Telegram not configured, skipping notification");
    return;
  }

  const adminIds = TELEGRAM_ADMIN_IDS.split(',').map(id => id.trim());
  
  for (const adminId of adminIds) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminId,
          text: message,
          parse_mode: 'HTML'
        })
      });
    } catch (error) {
      console.error(`Failed to send Telegram notification to ${adminId}:`, error);
    }
  }
}

// Verify callback signature (implement based on ArsenalPay documentation)
function verifySignature(data: any, signature: string): boolean {
  // This should be implemented based on ArsenalPay's signature verification method
  // For now, returning true - you should implement proper signature verification
  console.log("Signature verification needed - implement based on ArsenalPay docs");
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST is allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const callbackData = await req.json();
    console.log("ArsenalPay callback received:", callbackData);

    // Verify signature (implement based on ArsenalPay documentation)
    const signature = req.headers.get("X-Signature") || callbackData.signature;
    if (!verifySignature(callbackData, signature)) {
      console.error("Invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { payment_id, order_id, status, amount } = callbackData;

    if (!payment_id || !order_id) {
      console.error("Missing required fields:", { payment_id, order_id });
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find the order by ArsenalPay payment ID or order ID
    const { data: order, error: findError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .or(`arsenalpay_payment_id.eq.${payment_id},id.eq.${order_id}`)
      .single();

    if (findError || !order) {
      console.error("Order not found:", findError);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map ArsenalPay status to our payment status
    let paymentStatus = "pending";
    let orderStatus = order.status;

    switch (status?.toLowerCase()) {
      case "success":
      case "succeeded":
      case "paid":
        paymentStatus = "paid";
        orderStatus = "confirmed";
        break;
      case "failed":
      case "cancelled":
        paymentStatus = "failed";
        orderStatus = "cancelled";
        break;
      case "pending":
      case "processing":
        paymentStatus = "pending";
        break;
      default:
        paymentStatus = status || "unknown";
    }

    // Update order status
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        arsenalpay_payment_id: payment_id,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send Telegram notification for successful payments
    if (paymentStatus === "paid") {
      const message = `🎉 <b>Новый оплаченный заказ!</b>\n\n` +
        `📦 Заказ: ${order.reference || order.id}\n` +
        `👤 Клиент: ${order.customer_name}\n` +
        `📱 Телефон: ${order.customer_phone}\n` +
        `💰 Сумма: ${amount || order.total_amount} ₽\n` +
        `🔢 ID платежа: ${payment_id}`;
      
      await sendTelegramNotification(message);
    }

    console.log(`Order ${order.id} updated: payment_status=${paymentStatus}, status=${orderStatus}`);

    return new Response(JSON.stringify({ 
      success: true, 
      order_id: order.id,
      payment_status: paymentStatus 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("arsenalpay-callback error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

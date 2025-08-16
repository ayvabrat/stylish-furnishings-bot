
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let callbackData: any = {};

    if (req.method === "POST") {
      const contentType = req.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        callbackData = await req.json();
      } else if (contentType?.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        for (const [key, value] of formData.entries()) {
          callbackData[key] = value;
        }
      }
    } else if (req.method === "GET") {
      const url = new URL(req.url);
      for (const [key, value] of url.searchParams.entries()) {
        callbackData[key] = value;
      }
    }

    console.log("ArsenalPay callback received:", callbackData);

    // ArsenalPay typically sends these parameters
    const { account, sum, status, widget_id, payment_id } = callbackData;
    const orderId = account || payment_id;

    if (!orderId) {
      console.error("Missing orderId in callback:", callbackData);
      return new Response("OK", {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    // Find the order
    const { data: order, error: findError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (findError || !order) {
      console.error("Order not found:", findError);
      return new Response("OK", {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    // Map ArsenalPay status to our payment status
    let paymentStatus = "pending";
    let orderStatus = order.status;

    // ArsenalPay typically uses status codes or text
    if (status === "1" || status === "success" || status === "paid") {
      paymentStatus = "paid";
      orderStatus = "confirmed";
    } else if (status === "0" || status === "failed" || status === "cancelled") {
      paymentStatus = "failed";
      orderStatus = "cancelled";
    }

    // Update order status
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        arsenalpay_payment_id: payment_id || orderId,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to update order:", updateError);
    }

    // Send Telegram notification for successful payments
    if (paymentStatus === "paid") {
      const message = `🎉 <b>Новый оплаченный заказ!</b>\n\n` +
        `📦 Заказ: ${order.reference || order.id}\n` +
        `👤 Клиент: ${order.customer_name}\n` +
        `📱 Телефон: ${order.customer_phone}\n` +
        `💰 Сумма: ${sum || order.total_amount} ₽\n` +
        `🔢 ID платежа: ${payment_id || orderId}`;
      
      await sendTelegramNotification(message);
    }

    console.log(`Order ${order.id} updated: payment_status=${paymentStatus}, status=${orderStatus}`);

    return new Response("OK", {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  } catch (e) {
    console.error("arsenalpay-callback error:", e);
    return new Response("OK", {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});

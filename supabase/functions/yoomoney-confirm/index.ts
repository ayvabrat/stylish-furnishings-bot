
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://cfsqxwxstvcfwefhqvjt.supabase.co";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmc3F4d3hzdHZjZndlZmhxdmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTY2ODYsImV4cCI6MjA3MDIzMjY4Nn0.V-obmReB3ANDg6uxIVbsrFTYVAaSCoBMD--CvbBJ6e4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const YOOMONEY_TOKEN = Deno.env.get("YOOMONEY_TOKEN") || "";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const TELEGRAM_ADMIN_IDS = (Deno.env.get("TELEGRAM_ADMIN_IDS") || "").split(",").map(s => s.trim()).filter(Boolean);

serve(async (req) => {
  // CORS preflight
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
    if (!YOOMONEY_TOKEN) {
      return new Response(JSON.stringify({ error: "YOOMONEY_TOKEN is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_ADMIN_IDS.length === 0) {
      return new Response(JSON.stringify({ error: "TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_IDS not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId, paymentId: inputPaymentId } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load order to get payment id if not provided
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      console.error("Order not found:", orderErr);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paymentId = inputPaymentId || order.yoomoney_payment_id;
    if (!paymentId) {
      return new Response(JSON.stringify({ error: "paymentId missing on order" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check payment status on YooMoney
    const statusResp = await fetch(`https://api.yoomoney.ru/payments/v2/payment-orders/${encodeURIComponent(paymentId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YOOMONEY_TOKEN}`,
      },
    });

    const statusData = await statusResp.json();
    if (!statusResp.ok) {
      console.error("YooMoney check status error:", statusData);
      return new Response(JSON.stringify({ error: statusData }), {
        status: statusResp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paymentStatus: string = statusData?.status || "unknown";

    // If succeeded, mark order paid and notify Telegram
    if (paymentStatus === "succeeded" || paymentStatus === "success") {
      const { error: updErr } = await supabase
        .from("orders")
        .update({ status: "paid", payment_status: "succeeded" })
        .eq("id", orderId);

      if (updErr) {
        console.error("Failed to update order status:", updErr);
      }

      // Fetch order items
      const { data: items, error: itemsErr } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemsErr) {
        console.error("Failed to fetch order items:", itemsErr);
      }

      // Prepare Telegram message
      const lines: string[] = [];
      lines.push(`<b>Новая оплата (YooMoney)</b>`);
      lines.push(`Статус: <b>успешно</b>`);
      lines.push(`Номер заказа: <code>${order.reference || orderId}</code>`);
      lines.push(`Сумма: <b>${order.total_amount}₽</b>`);
      lines.push("");
      lines.push(`<b>Клиент</b>`);
      lines.push(`Имя: ${order.customer_name || "-"}`);
      lines.push(`Телефон: ${order.customer_phone || "-"}`);
      if (order.customer_email) lines.push(`Email: ${order.customer_email}`);
      if (order.city) lines.push(`Город: ${order.city}`);
      if (order.delivery_address) lines.push(`Адрес: ${order.delivery_address}`);
      if (order.postal_code) lines.push(`Индекс: ${order.postal_code}`);
      if (order.additional_notes) lines.push(`Комментарий: ${order.additional_notes}`);
      lines.push("");
      lines.push(`<b>Товары</b>`);
      (items || []).forEach((it: any, idx: number) => {
        lines.push(`${idx + 1}. ${it.product_name} × ${it.quantity} — ${it.price}₽`);
      });

      const text = lines.join("\n");

      // Send to all admins
      await Promise.allSettled(
        TELEGRAM_ADMIN_IDS.map((chatId) =>
          fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "HTML",
              disable_web_page_preview: true,
            }),
          })
        )
      );
    }

    return new Response(JSON.stringify({ status: paymentStatus }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("yoomoney-confirm unexpected error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

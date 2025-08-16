
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
const ARSENALPAY_CLIENT_ID = Deno.env.get("ARSENALPAY_CLIENT_ID") || "";
const ARSENALPAY_CLIENT_SECRET = Deno.env.get("ARSENALPAY_CLIENT_SECRET") || "";
const BASE_URL = Deno.env.get("BASE_URL") || "";

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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
    const { orderId, amount, description, customerEmail } = await req.json();

    if (!orderId || typeof orderId !== "string") {
      return new Response(JSON.stringify({ error: "orderId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!amount || isNaN(Number(amount))) {
      return new Response(JSON.stringify({ error: "Valid amount is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ArsenalPay API payment creation (using direct API approach)
    const paymentData = {
      widget_id: ARSENALPAY_CLIENT_ID,
      amount: Number(amount),
      account: orderId,
      desc: description || `Оплата заказа ${orderId}`,
      currency: "RUB",
      check_key: ARSENALPAY_CLIENT_SECRET,
      success_url: BASE_URL ? `${BASE_URL}/checkout-success?orderId=${encodeURIComponent(orderId)}` : undefined,
      fail_url: BASE_URL ? `${BASE_URL}/checkout-cancel` : undefined,
    };

    console.log("Creating ArsenalPay payment with data:", paymentData);

    // Create payment URL
    const params = new URLSearchParams();
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const paymentUrl = `https://arsenalpay.ru/payform/pay.php?${params.toString()}`;

    console.log("Generated payment URL:", paymentUrl);

    // Update order with payment status
    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({ 
        arsenalpay_payment_id: orderId,
        payment_status: "pending" 
      })
      .eq("id", orderId);

    if (updErr) {
      console.error("Failed to update order:", updErr);
      return new Response(JSON.stringify({ error: "Failed to update order with payment ID" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      payment_url: paymentUrl,
      payment_id: orderId,
      order_id: orderId 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("arsenalpay-create error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});


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
const ARSENALPAY_MERCHANT_ID = Deno.env.get("ARSENALPAY_MERCHANT_ID") || "";
const ARSENALPAY_SECRET_KEY = Deno.env.get("ARSENALPAY_SECRET_KEY") || "";
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
    if (!SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!ARSENALPAY_MERCHANT_ID || !ARSENALPAY_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Missing ArsenalPay credentials" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    // Create payment request to ArsenalPay
    const paymentData = {
      merchant_id: ARSENALPAY_MERCHANT_ID,
      amount: amount,
      order_id: orderId,
      description: description || `Оплата заказа ${orderId}`,
      currency: "RUB",
      success_url: BASE_URL ? `${BASE_URL}/checkout-success?orderId=${encodeURIComponent(orderId)}` : undefined,
      fail_url: BASE_URL ? `${BASE_URL}/checkout-cancel` : undefined,
      customer_email: customerEmail || 'guest@example.com',
    };

    // Create signature for ArsenalPay
    const signatureString = `${paymentData.merchant_id}:${paymentData.amount}:${paymentData.order_id}:${paymentData.currency}:${ARSENALPAY_SECRET_KEY}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    paymentData.signature = signature;

    // Update order status to pending
    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({ 
        arsenalpay_payment_id: orderId, 
        payment_status: "pending" 
      })
      .eq("id", orderId);

    if (updErr) {
      console.error("Failed to set pending status:", updErr);
      return new Response(JSON.stringify({ error: "Failed to prepare order for payment" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create payment URL
    const params = new URLSearchParams();
    Object.entries(paymentData).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    const payment_url = `https://arsenalpay.ru/payform/index.php?${params.toString()}`;

    return new Response(JSON.stringify({ payment_url, order_id: orderId }), {
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

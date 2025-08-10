
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
const BASE_URL = Deno.env.get("BASE_URL") || "https://mykimmy.ru";

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
    const { orderId, amount, description } = await req.json();

    if (!YOOMONEY_TOKEN) {
      return new Response(JSON.stringify({ error: "YOOMONEY_TOKEN is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!orderId || typeof amount !== "number") {
      return new Response(JSON.stringify({ error: "orderId and numeric amount are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build request for YooMoney API (per user's spec)
    const payload = {
      amount: { value: amount.toFixed(2), currency: "RUB" },
      confirmation: {
        type: "redirect",
        return_url: `${BASE_URL}/checkout/success?orderId=${encodeURIComponent(orderId)}`,
      },
      capture: true,
      description: description || `Оплата заказа ${orderId}`,
      payment_method_data: { type: "bank_card" },
    };

    const resp = await fetch("https://api.yoomoney.ru/payments/v2/payment-orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YOOMONEY_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("YooMoney create payment error:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paymentId = data.id || data.payment_id || null;
    const confirmationUrl =
      data?.confirmation?.confirmation_url || data?.confirmation?.url || null;

    // Store payment id on order for later confirmation
    if (paymentId) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ yoomoney_payment_id: paymentId, payment_status: "pending" })
        .eq("id", orderId);

      if (updateError) {
        console.error("Error updating order with payment id:", updateError);
      }
    }

    return new Response(
      JSON.stringify({
        confirmation_url: confirmationUrl,
        payment_id: paymentId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("yoomoney-create-payment unexpected error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

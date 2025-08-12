
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://cfsqxwxstvcfwefhqvjt.supabase.co";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const BASE_URL = Deno.env.get("BASE_URL") || "";
const YOOMONEY_RECEIVER = Deno.env.get("YOOMONEY_RECEIVER") || "";

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
    if (!YOOMONEY_RECEIVER) {
      return new Response(JSON.stringify({ error: "Missing YOOMONEY_RECEIVER secret" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId, amount, description } = await req.json();

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

    // Store pending status and the Yandex label (use orderId as label)
    const label = orderId;
    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({ yoomoney_payment_id: label, payment_status: "pending" })
      .eq("id", orderId);

    if (updErr) {
      console.error("Failed to set pending status:", updErr);
      return new Response(JSON.stringify({ error: "Failed to prepare order for payment" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build Quickpay link
    const successURL = BASE_URL ? `${BASE_URL}/checkout-success?orderId=${encodeURIComponent(orderId)}` : undefined;
    const params = new URLSearchParams();
    params.set("receiver", YOOMONEY_RECEIVER);
    params.set("quickpay-form", "shop");
    params.set("paymentType", "AC"); // bank cards by default
    params.set("sum", String(amount));
    params.set("label", label);
    params.set("targets", description || `Оплата заказа ${orderId}`);
    if (successURL) params.set("successURL", successURL);

    const confirmation_url = `https://yoomoney.ru/quickpay/confirm.xml?${params.toString()}`;

    return new Response(JSON.stringify({ confirmation_url, label }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("yoomoney-quickpay error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

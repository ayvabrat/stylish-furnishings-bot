
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

// Get OAuth 2.0 access token
async function getAccessToken() {
  const tokenResponse = await fetch("https://arsenalpay.ru/api/oauth/v2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: ARSENALPAY_CLIENT_ID,
      client_secret: ARSENALPAY_CLIENT_SECRET,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Token request failed:", errorText);
    throw new Error(`Failed to get access token: ${tokenResponse.status}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
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
    if (!SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!ARSENALPAY_CLIENT_ID || !ARSENALPAY_CLIENT_SECRET) {
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

    // Get access token
    const accessToken = await getAccessToken();

    // Create payment request to ArsenalPay API
    const paymentData = {
      amount: Number(amount),
      currency: "RUB",
      description: description || `Оплата заказа ${orderId}`,
      order_id: orderId,
      success_url: BASE_URL ? `${BASE_URL}/checkout-success?orderId=${encodeURIComponent(orderId)}` : undefined,
      fail_url: BASE_URL ? `${BASE_URL}/checkout-cancel` : undefined,
      callback_url: BASE_URL ? `${BASE_URL}/functions/v1/arsenalpay-callback` : undefined,
      customer_email: customerEmail || 'guest@example.com',
    };

    console.log("Creating payment with data:", paymentData);

    const paymentResponse = await fetch("https://arsenalpay.ru/api/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error("Payment creation failed:", errorText);
      return new Response(JSON.stringify({ error: `Payment creation failed: ${paymentResponse.status}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paymentResult = await paymentResponse.json();
    console.log("Payment created:", paymentResult);

    // Update order with ArsenalPay payment ID and set status to pending
    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({ 
        arsenalpay_payment_id: paymentResult.id || paymentResult.payment_id,
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
      payment_url: paymentResult.payment_url || paymentResult.redirect_url,
      payment_id: paymentResult.id || paymentResult.payment_id,
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

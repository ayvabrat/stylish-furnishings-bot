import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const adminChatId = '67486304'; // Make sure this is correct

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface OrderNotificationRequest {
  orderId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const { orderId }: OrderNotificationRequest = await req.json();

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing order notification for order ID:', orderId);
    console.log('Telegram bot token exists:', !!telegramBotToken);
    console.log('Admin chat ID:', adminChatId);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch order items' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format order message - use plain text instead of HTML to avoid parsing issues
    const itemsList = orderItems?.map((item, index) => 
      `${index + 1}. ${item.product_name} - ${item.quantity} шт. × ${item.price}₽ = ${(item.quantity * item.price)}₽`
    ).join('\n') || 'Нет товаров';

    const message = `🆕 НОВЫЙ ЗАКАЗ #${order.reference}

👤 Покупатель: ${order.customer_name}
📱 Телефон: ${order.customer_phone}
${order.customer_email ? `📧 Email: ${order.customer_email}` : ''}

🛍️ Товары:
${itemsList}

💰 Итого: ${order.total_amount}₽
${order.discount_amount ? `💸 Скидка: ${order.discount_amount}₽` : ''}
${order.promotion_code ? `🎫 Промокод: ${order.promotion_code}` : ''}

📍 Адрес доставки:
${order.delivery_address || 'Не указан'}
${order.city ? `Город: ${order.city}` : ''}
${order.postal_code ? `Индекс: ${order.postal_code}` : ''}

${order.additional_notes ? `📝 Дополнительные заметки: ${order.additional_notes}` : ''}

💳 Способ оплаты: Банковский перевод
📄 Чек: ${order.receipt_url ? 'Прикреплен' : 'Не прикреплен'}

🕐 Дата заказа: ${new Date(order.created_at).toLocaleString('ru-RU')}`;

    // Send message to Telegram
    console.log('Sending message to Telegram...');
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    
    console.log('Telegram URL (without token):', telegramUrl.replace(telegramBotToken, '[TOKEN]'));
    console.log('Message length:', message.length);
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: message,
      }),
    });

    console.log('Telegram response status:', telegramResponse.status);
    
    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('Telegram API error:', errorText);
      console.error('Response status:', telegramResponse.status);
      return new Response(JSON.stringify({ error: 'Failed to send Telegram message', details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If there's a receipt, send it as a photo
    if (order.receipt_url) {
      console.log('Sending receipt photo:', order.receipt_url);
      const photoUrl = `https://api.telegram.org/bot${telegramBotToken}/sendPhoto`;
      
      try {
        const photoResponse = await fetch(photoUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: adminChatId,
            photo: order.receipt_url,
            caption: `📄 Чек для заказа #${order.reference}`,
          }),
        });

        if (!photoResponse.ok) {
          const errorText = await photoResponse.text();
          console.error('Failed to send receipt photo to Telegram:', errorText);
        } else {
          console.log('Receipt photo sent successfully to Telegram');
        }
      } catch (photoError: any) {
        console.error('Error sending receipt photo:', photoError.message);
      }
    }

    console.log('Main message sent successfully to Telegram');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in send-order-notification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
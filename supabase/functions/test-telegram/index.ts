import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const adminChatId = '67486304';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Testing Telegram bot...');
    console.log('Bot token exists:', !!telegramBotToken);
    console.log('Chat ID:', adminChatId);

    const testMessage = `🤖 Тест бота - ${new Date().toLocaleString('ru-RU')}`;
    
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    
    console.log('Sending test message to Telegram...');
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: testMessage,
      }),
    });

    console.log('Telegram response status:', telegramResponse.status);
    
    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('Telegram API error:', errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Telegram API error', 
        status: telegramResponse.status,
        details: errorText 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const responseData = await telegramResponse.json();
    console.log('Telegram response:', responseData);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Test message sent successfully',
      telegramResponse: responseData
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in test-telegram function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
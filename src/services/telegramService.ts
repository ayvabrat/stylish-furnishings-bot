
import { supabase } from '@/integrations/supabase/client';

// Save Telegram settings 
export const saveTelegramSettings = async (botToken: string, adminId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key: 'telegram_settings',
        value: JSON.stringify({ botToken, adminId })
      });

    if (error) {
      console.error('Error saving Telegram settings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to save Telegram settings:', error);
    return false;
  }
};

// Send order notification to Telegram
export const sendOrderNotification = async (orderInfo: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  items: { productName: string; quantity: number; price: number }[];
  promoCode: string | null;
}): Promise<boolean> => {
  try {
    // Get Telegram settings from database
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_settings')
      .single();

    if (error || !data) {
      console.error('Error retrieving Telegram settings:', error);
      return false;
    }

    let settings;
    try {
      settings = JSON.parse(data.value);
    } catch (e) {
      console.error('Error parsing Telegram settings:', e);
      return false;
    }

    if (!settings.botToken || !settings.adminId) {
      console.log('Telegram settings not configured');
      return false;
    }

    // Create message text
    let messageText = `🛍️ *НОВЫЙ ЗАКАЗ!* 🛍️\n\n`;
    messageText += `*ID заказа:* ${orderInfo.orderId}\n`;
    messageText += `*Имя клиента:* ${orderInfo.customerName}\n`;
    messageText += `*Телефон:* ${orderInfo.customerPhone}\n\n`;
    
    messageText += `*Товары:*\n`;
    orderInfo.items.forEach(item => {
      messageText += `- ${item.productName} x${item.quantity} - ${item.price.toLocaleString()} ₸\n`;
    });
    
    messageText += `\n*Итого:* ${orderInfo.totalAmount.toLocaleString()} ₸`;
    
    if (orderInfo.promoCode) {
      messageText += `\n*Промокод:* ${orderInfo.promoCode}`;
    }

    // Use fetch to send the message
    const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.adminId,
        text: messageText,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();
    
    if (!result.ok) {
      console.error('Telegram API error:', result);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
};

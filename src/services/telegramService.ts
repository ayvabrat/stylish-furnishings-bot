
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/utils';

type TelegramNotificationData = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

// Save Telegram settings
export const saveTelegramSettings = async (botToken: string, adminId: string): Promise<boolean> => {
  console.log('Saving Telegram settings:', { botToken, adminId });
  
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
  } catch (err) {
    console.error('Error in saveTelegramSettings:', err);
    return false;
  }
};

// Send notification via Telegram
export const sendTelegramNotification = async (data: TelegramNotificationData): Promise<boolean> => {
  try {
    // Get Telegram settings
    const { data: telegramData, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_settings')
      .single();
      
    if (error || !telegramData) {
      console.log('No Telegram settings found, skipping notification');
      return false;
    }
    
    try {
      const settings = JSON.parse(telegramData.value);
      const { botToken, adminId } = settings;
      
      if (!botToken || !adminId) {
        console.log('Incomplete Telegram settings, skipping notification');
        return false;
      }
      
      // Format message
      const items = data.items.map(item => 
        `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
      ).join('\n');
      
      const message = `
🛒 *Новый заказ #${data.orderNumber}*

👤 *Клиент:* ${data.customerName}
📞 *Телефон:* ${data.customerPhone}

*Товары:*
${items}

💰 *Итого:* ${formatPrice(data.totalAmount)}
      `.trim();
      
      // Send message
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: adminId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      
      const result = await response.json();
      console.log('Telegram notification sent:', result);
      
      return result.ok;
    } catch (e) {
      console.error('Error parsing Telegram settings:', e);
      return false;
    }
  } catch (err) {
    console.error('Error sending Telegram notification:', err);
    return false;
  }
};

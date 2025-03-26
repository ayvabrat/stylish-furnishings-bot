
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

    // After saving, set default token if none provided
    if (!botToken) {
      const defaultToken = '7739882869:AAHyIqZ5nOTHJcmeCoN-z9QoGnOW-go0Rjk';
      const { error: updateError } = await supabase
        .from('settings')
        .upsert({
          key: 'telegram_settings',
          value: JSON.stringify({ botToken: defaultToken, adminId })
        });
      
      if (updateError) {
        console.error('Error setting default token:', updateError);
      }
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
      console.log('No Telegram settings found, using default token');
      
      // Use default token if no settings found
      const botToken = '7739882869:AAHyIqZ5nOTHJcmeCoN-z9QoGnOW-go0Rjk';
      const adminId = '687301214'; // Default admin ID - update with your actual default
      
      return await sendWithToken(botToken, adminId, data);
    }
    
    try {
      const settings = JSON.parse(telegramData.value);
      let { botToken, adminId } = settings;
      
      // Use default token if token is missing or empty
      if (!botToken || botToken.trim() === '') {
        console.log('Using default Telegram bot token');
        botToken = '7739882869:AAHyIqZ5nOTHJcmeCoN-z9QoGnOW-go0Rjk';
      }
      
      if (!adminId || adminId.trim() === '') {
        console.log('No admin ID found, using default');
        adminId = '687301214'; // Default admin ID - update with your actual default
      }
      
      return await sendWithToken(botToken, adminId, data);
    } catch (e) {
      console.error('Error parsing Telegram settings, using default token:', e);
      // Use default token if parsing error
      const botToken = '7739882869:AAHyIqZ5nOTHJcmeCoN-z9QoGnOW-go0Rjk';
      const adminId = '687301214'; // Default admin ID - update with your actual default
      
      return await sendWithToken(botToken, adminId, data);
    }
  } catch (err) {
    console.error('Error sending Telegram notification:', err);
    return false;
  }
};

// Helper function to send notification with given token and admin ID
const sendWithToken = async (botToken: string, adminId: string, data: TelegramNotificationData): Promise<boolean> => {
  try {
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
    
    console.log('Sending Telegram notification with token', botToken.substring(0, 5) + '...');
    
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
    console.log('Telegram notification result:', result);
    
    return result.ok;
  } catch (e) {
    console.error('Error in sendWithToken:', e);
    return false;
  }
};

import { supabase } from '@/integrations/supabase/client';

// Save Telegram settings
export const saveTelegramSettings = async (botToken: string, adminId: string): Promise<boolean> => {
  console.log('Saving Telegram settings:', { botToken, adminId });
  
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
};

// Fetch Telegram settings
export const fetchTelegramSettings = async (): Promise<{ botToken: string; adminId: string }> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'telegram_settings')
    .single();

  if (error || !data) {
    console.log('No Telegram settings found, returning defaults');
    return { botToken: '', adminId: '' };
  }

  try {
    const settings = JSON.parse(data.value);
    return { 
      botToken: settings.botToken || '', 
      adminId: settings.adminId || '' 
    };
  } catch (e) {
    console.error('Error parsing Telegram settings:', e);
    return { botToken: '', adminId: '' };
  }
};

// Send order notification to Telegram
export const sendOrderNotification = async (orderData: any): Promise<boolean> => {
  const { botToken, adminId } = await fetchTelegramSettings();

  if (!botToken || !adminId) {
    console.warn('Telegram bot token or admin ID not configured.');
    return false;
  }

  const message = `
Новый заказ!
--------------------------------
Имя: ${orderData.customerName}
Телефон: ${orderData.customerPhone}
Город: ${orderData.city}
Адрес: ${orderData.deliveryAddress}
Сумма заказа: ${orderData.totalAmount} ₸
--------------------------------
Состав заказа:
${orderData.items.map((item: any) => `- ${item.productName} (${item.quantity} шт.)`).join('\n')}
`;

  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminId,
        text: message,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram message:', response.status, response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

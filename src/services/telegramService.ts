
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface OrderRequest {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  paymentMethod: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  discount: {
    code: string | null;
    percentage: number;
    amount: number;
  };
  total: number;
}

// Get Telegram settings from Supabase
const getTelegramSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'telegram_settings')
    .single();
    
  if (error || !data) {
    console.error('Error fetching Telegram settings:', error);
    return {
      botToken: "7298747039:AAHqz3SqQkSyL24b_SYuM0cW9mp7kNeGXo8",
      adminId: "7145565433"
    };
  }
  
  try {
    const settings = JSON.parse(data.value);
    return {
      botToken: settings.botToken || "7298747039:AAHqz3SqQkSyL24b_SYuM0cW9mp7kNeGXo8",
      adminId: settings.adminId || "7145565433"
    };
  } catch (e) {
    console.error('Error parsing Telegram settings:', e);
    return {
      botToken: "7298747039:AAHqz3SqQkSyL24b_SYuM0cW9mp7kNeGXo8",
      adminId: "7145565433"
    };
  }
};

export const sendOrderToTelegram = async (
  order: OrderRequest
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get Telegram settings
    const { botToken, adminId } = await getTelegramSettings();
    
    // Format items list
    const itemsList = order.items
      .map(
        (item) =>
          `${item.name} x${item.quantity} - ${item.price.toLocaleString()} тг = ${item.total.toLocaleString()} тг`
      )
      .join("\n");

    // Format message
    const message = `
🛒 *НОВЫЙ ЗАКАЗ*
🆔 ID заказа: \`${order.orderId}\`
👤 Имя: ${order.customerName}
📱 Телефон: ${order.customerPhone}
📧 Email: ${order.customerEmail}
🏠 Адрес доставки: ${order.deliveryAddress}
💳 Способ оплаты: ${order.paymentMethod}

📝 *Товары*:
${itemsList}

💰 *Сумма*: ${order.subtotal.toLocaleString()} тг
${
  order.discount.code
    ? `🏷️ *Скидка*: ${order.discount.code} (${order.discount.percentage}%) - ${order.discount.amount.toLocaleString()} тг`
    : ""
}
💵 *Итого*: ${order.total.toLocaleString()} тг

📝 *Примечания*: ${order.notes}
    `;

    // Send message to Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: adminId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram API error:", data);
      return { success: false, error: data.description };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return { success: false, error: "Failed to send message to Telegram" };
  }
};

// Save Telegram settings
export const saveTelegramSettings = async (
  botToken: string,
  adminId: string
): Promise<boolean> => {
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
    console.error('Error saving Telegram settings:', error);
    return false;
  }
};

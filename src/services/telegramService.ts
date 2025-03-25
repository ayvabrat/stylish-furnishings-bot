
const TELEGRAM_BOT_TOKEN = "7298747039:AAHqz3SqQkSyL24b_SYuM0cW9mp7kNeGXo8";
const TELEGRAM_ADMIN_ID = "7145565433";

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

export const sendOrderToTelegram = async (
  order: OrderRequest
): Promise<{ success: boolean; error?: string }> => {
  try {
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
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_ADMIN_ID,
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

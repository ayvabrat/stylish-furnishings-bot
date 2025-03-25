
interface OrderData {
  customerName: string;
  customerSurname: string;
  customerPhone: string;
  customerEmail: string;
  customerCity: string;
  customerStreet: string;
  customerHouse: string;
  customerApartment: string;
  customerComment: string;
  orderItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
}

interface PaymentInfo {
  bankAccount: string;
  bankName: string;
  recipientName: string;
  amount: number;
  reference: string;
}

const BOT_TOKEN = '7298747039:AAHqz3SqQkSyL24b_SYuM0cW9mp7kNeGXo8';
const ADMIN_CHAT_ID = '7145565433';

/**
 * Sends order notification to admin via Telegram bot
 */
export const sendOrderNotification = async (orderData: OrderData): Promise<boolean> => {
  try {
    // Construct order message
    const itemsList = orderData.orderItems
      .map(item => `- ${item.name} x${item.quantity} = ${item.price * item.quantity} тг`)
      .join('\n');

    const message = `
🛒 *НОВЫЙ ЗАКАЗ!* 🛒

*Данные покупателя:*
Имя: ${orderData.customerName} ${orderData.customerSurname}
Телефон: ${orderData.customerPhone}
Email: ${orderData.customerEmail}

*Адрес доставки:*
Город: ${orderData.customerCity}
Улица: ${orderData.customerStreet}
Дом: ${orderData.customerHouse}
Квартира: ${orderData.customerApartment}

*Комментарий:* 
${orderData.customerComment || 'Нет'}

*Заказанные товары:*
${itemsList}

*Общая сумма:* ${orderData.totalPrice} тг

*ID заказа:* ${generateOrderId()}
    `;

    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const params = new URLSearchParams({
      chat_id: ADMIN_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    const response = await fetch(`${apiUrl}?${params}`);
    const data = await response.json();

    return data.ok;
  } catch (error) {
    console.error('Error sending order notification to Telegram:', error);
    return false;
  }
};

/**
 * Generates a mock payment information from admin (simulates admin response)
 */
export const generatePaymentInfo = (amount: number): PaymentInfo => {
  return {
    bankAccount: 'KZ1234567890123456',
    bankName: 'Народный Банк Казахстана',
    recipientName: 'ТОО "ProMebel"',
    amount: amount,
    reference: `Оплата заказа ${generateOrderId()}`
  };
};

/**
 * Generates a unique order ID
 */
export const generateOrderId = (): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

/**
 * Simulates sending a receipt to admin
 */
export const sendReceiptToAdmin = async (
  orderId: string, 
  receiptImage: File, 
  customerPhone: string
): Promise<boolean> => {
  try {
    // Create form data for sending image
    const formData = new FormData();
    formData.append('chat_id', ADMIN_CHAT_ID);
    formData.append('photo', receiptImage);
    formData.append('caption', `📝 Чек для заказа: ${orderId}\n📱 Телефон клиента: ${customerPhone}`);

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Error sending receipt to admin:', error);
    return false;
  }
};

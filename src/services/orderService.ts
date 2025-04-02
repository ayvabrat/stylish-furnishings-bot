
import { supabase } from '@/integrations/supabase/client';
import { CartItemType } from '@/types/product';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  city: string;
  deliveryAddress: string;
  postalCode: string | null;
  paymentMethod: string;
  additionalNotes: string | null;
  totalAmount: number;
  items: OrderItem[];
  promoCode: string | null;
  discountAmount: number | 0;
}

interface PaymentDetails {
  recipient: string;
  bankAccount: string;
  bankName: string;
  amount: number;
  reference: string;
}

interface CreateOrderResponse {
  orderId: string;
  paymentDetails: PaymentDetails;
}

// Create order
export const createOrder = async (orderData: OrderData): Promise<CreateOrderResponse> => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail,
        city: orderData.city,
        delivery_address: orderData.deliveryAddress,
        postal_code: orderData.postalCode,
        payment_method: orderData.paymentMethod,
        additional_notes: orderData.additionalNotes,
        total_amount: orderData.totalAmount,
        promo_code: orderData.promoCode,
        discount_amount: orderData.discountAmount,
        status: 'pending'
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    const orderId = order.id;

    // Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError);
      throw new Error('Failed to create order items');
    }

    // Payment details
    const paymentDetails: PaymentDetails = {
      recipient: 'Alexandr Ferber',
      bankAccount: 'KZ44004300223375964',
      bankName: 'Kaspi Bank',
      amount: orderData.totalAmount,
      reference: `Order #${orderId} from ${orderData.customerName}`
    };

    return {
      orderId: orderId.toString(),
      paymentDetails: paymentDetails
    };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

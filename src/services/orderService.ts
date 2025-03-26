
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sendOrderNotification } from '@/services/telegramService';

// Create a new order
export const createOrder = async (orderData: {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  city: string;
  deliveryAddress: string;
  postalCode: string | null;
  additionalNotes: string | null;
  paymentMethod: string;
  totalAmount: number;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  discountApplied: boolean;
  promoCode: string | null;
  discountAmount: number;
}) => {
  console.log('Creating order with data:', orderData);
  
  try {
    // First, create the order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail,
        city: orderData.city,
        delivery_address: orderData.deliveryAddress,
        postal_code: orderData.postalCode,
        additional_notes: orderData.additionalNotes,
        payment_method: orderData.paymentMethod,
        total_amount: orderData.totalAmount,
        status: 'pending'
      })
      .select()
      .single();
      
    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error(orderError.message);
    }
    
    if (!order) {
      throw new Error('Failed to create order');
    }
    
    // Then, create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      price: item.price,
      quantity: item.quantity
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw new Error(itemsError.message);
    }
    
    // Send order notification to Telegram if function exists
    try {
      await sendOrderNotification({
        orderId: order.id,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        totalAmount: orderData.totalAmount,
        items: orderData.items,
        promoCode: orderData.promoCode
      });
    } catch (telegramError) {
      // Log the error but don't fail the order creation
      console.error('Failed to send Telegram notification:', telegramError);
    }
    
    return order;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

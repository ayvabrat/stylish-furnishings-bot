
import { supabase } from '@/integrations/supabase/client';
import { sendOrderToTelegram } from '@/services/telegramService';

// Define PaymentResponse type
interface PaymentResponse {
  orderId: string;
  bankName: string;
  accountNumber: string;
  recipientName: string;
}

// Send payment details to the customer
export const sendPaymentDetails = async (telegramPayload: {
  orderId: string;
  payment: {
    bankName: string;
    accountNumber: string;
    recipientName: string;
  };
  orderDetails: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Update order status in Supabase
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'awaiting_payment' })
      .eq('id', telegramPayload.orderId);
      
    if (updateError) {
      console.error('Error updating order status:', updateError);
      return { success: false, error: updateError.message };
    }
    
    // Here you would implement the actual logic to send the payment details
    // to the customer via the Telegram bot
    
    return { success: true };
  } catch (error) {
    console.error('Error sending payment details:', error);
    return { success: false, error: 'Failed to send payment details' };
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'awaiting_payment' | 'paid' | 'completed' | 'cancelled'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
      
    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

// Get order details
export const getOrderDetails = async (orderId: string) => {
  try {
    // Get order data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return null;
    }
    
    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
      
    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return null;
    }
    
    return {
      order,
      items: orderItems || []
    };
  } catch (error) {
    console.error('Error getting order details:', error);
    return null;
  }
};

// Get allowed payment methods
export const getAllowedPaymentMethods = () => {
  // Return only bank transfer as a payment method, cash payments disabled
  return ['card'];
};

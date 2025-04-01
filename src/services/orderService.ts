
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sendTelegramNotification } from '@/services/telegramService';

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
  promoCode: string | null;
  discountAmount: number;
}) => {
  console.log('Creating order with data:', orderData);
  
  try {
    // First, create the order record with snake_case keys
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
      throw new Error('Failed to create order - no order data returned');
    }
    
    console.log('Order created successfully:', order);
    
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
    
    // Generate a shortened order ID for display
    const shortOrderId = order.id.substring(0, 8);
    
    // Send notification via Telegram
    try {
      console.log('Sending Telegram notification for order:', shortOrderId);
      
      await sendTelegramNotification({
        orderNumber: shortOrderId,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        totalAmount: orderData.totalAmount,
        items: orderData.items.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price
        }))
      });
    } catch (telegramError) {
      // Log the error but don't fail the order creation
      console.error('Failed to send Telegram notification:', telegramError);
    }
    
    return order.id;
  } catch (error: any) {
    console.error('Error in createOrder:', error);
    const errorMessage = error.message || 'Unknown error occurred';
    
    // Provide more detailed logging
    if (error.details) {
      console.error('Error details:', error.details);
    }
    
    throw new Error(`Failed to create order: ${errorMessage}`);
  }
};


import { supabase } from '@/integrations/supabase/client';
import { CartItemType } from '@/types/product';
import { sendTelegramNotification } from './telegramService';

// Define the OrderItem interface to match what telegramService expects
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Function to create a new order
export const createOrder = async (orderData: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  city?: string;
  postalCode?: string;
  items: CartItemType[];
  totalAmount: number;
  paymentMethod: string;
  promotionCode?: string;
  discountAmount?: number;
  additionalNotes?: string;
}): Promise<{ orderId: string; reference: string; paymentDetails: any }> => {
  try {
    // Generate a unique order ID
    const orderId = crypto.randomUUID();

    // Generate a human-readable reference number
    const reference = Math.random().toString(36).substring(2, 15).toUpperCase();

    // Insert order into the database
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        reference: reference,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail,
        delivery_address: orderData.deliveryAddress,
        city: orderData.city,
        postal_code: orderData.postalCode,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        promotion_code: orderData.promotionCode,
        discount_amount: orderData.discountAmount,
        additional_notes: orderData.additionalNotes,
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    // Create order items for database
    const orderItems = orderData.items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    // Batch insert order items
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError);
      throw new Error('Failed to create order items');
    }

    // Prepare items for Telegram notification
    const telegramItems: OrderItem[] = orderData.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    // Send notification to Telegram
    await sendTelegramNotification({
      orderNumber: reference,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      totalAmount: orderData.totalAmount,
      discount: orderData.discountAmount,
      promotionCode: orderData.promotionCode,
      items: telegramItems
    });
    
    // Fetch payment details from admin settings
    const { data: settingsData } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['payment_recipient_name', 'payment_account_number', 'payment_bank_name']);
    
    const paymentDetails = {
      recipient: settingsData?.find(s => s.key === 'payment_recipient_name')?.value || '',
      bankAccount: settingsData?.find(s => s.key === 'payment_account_number')?.value || '',
      bankName: settingsData?.find(s => s.key === 'payment_bank_name')?.value || '',
      amount: orderData.totalAmount
    };

    return { orderId, reference, paymentDetails };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

// Function to upload receipt image for an order
export const uploadReceiptImage = async (orderId: string, file: File): Promise<{ success: boolean; error?: string }> => {
  try {
    // Generate a unique file name
    const fileName = `${orderId}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `receipts/${fileName}`;
    
    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('order_receipts')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading receipt:', uploadError);
      return { success: false, error: uploadError.message };
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('order_receipts')
      .getPublicUrl(filePath);
    
    // Update the order with the receipt URL
    const { error: updateError } = await supabase
      .from('orders')
      .update({ receipt_url: urlData.publicUrl })
      .eq('id', orderId);
    
    if (updateError) {
      console.error('Error updating order with receipt URL:', updateError);
      return { success: false, error: updateError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in uploadReceiptImage:', error);
    return { success: false, error: error.message };
  }
};

// Function to fetch order details by order ID
export const getOrderDetails = async (orderId: string) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      throw new Error('Failed to fetch order');
    }

    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (orderItemsError) {
      console.error('Error fetching order items:', orderItemsError);
      throw new Error('Failed to fetch order items');
    }

    return { ...order, items: orderItems };
  } catch (error) {
    console.error('Error in getOrderDetails:', error);
    throw error;
  }
};

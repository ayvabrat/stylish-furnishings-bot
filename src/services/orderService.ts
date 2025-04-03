
import { supabase } from '@/integrations/supabase/client';
import { CartItemType } from '@/types/product';
import { fetchAdminSettings } from './adminService';

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
  receiptImage?: File | null;
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
    // Get admin settings for payment details
    const adminSettings = await fetchAdminSettings();
    
    // Insert order into database
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
        status: 'pending'
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      
      // Even if there's an error, return payment details with a temporary ID
      const paymentDetails: PaymentDetails = {
        recipient: adminSettings.paymentDetails.recipientName,
        bankAccount: adminSettings.paymentDetails.accountNumber,
        bankName: adminSettings.paymentDetails.bankName,
        amount: orderData.totalAmount,
        reference: `Order from ${orderData.customerName}`
      };
      
      return {
        orderId: 'temporary',
        paymentDetails: paymentDetails
      };
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
      // Continue despite the error - we still want to show payment details
    }

    // Payment details
    const paymentDetails: PaymentDetails = {
      recipient: adminSettings.paymentDetails.recipientName,
      bankAccount: adminSettings.paymentDetails.accountNumber,
      bankName: adminSettings.paymentDetails.bankName,
      amount: orderData.totalAmount,
      reference: `Order #${orderId} from ${orderData.customerName}`
    };

    return {
      orderId: orderId.toString(),
      paymentDetails: paymentDetails
    };
  } catch (error) {
    console.error('Error in createOrder:', error);
    
    // Get admin settings for payment details even in case of error
    try {
      const adminSettings = await fetchAdminSettings();
      
      // Return fallback payment details
      const paymentDetails: PaymentDetails = {
        recipient: adminSettings.paymentDetails.recipientName,
        bankAccount: adminSettings.paymentDetails.accountNumber,
        bankName: adminSettings.paymentDetails.bankName,
        amount: 0, // We don't know the amount in this case
        reference: 'Order processing error'
      };
      
      return {
        orderId: 'error',
        paymentDetails: paymentDetails
      };
    } catch (settingsError) {
      console.error('Error fetching admin settings:', settingsError);
      
      // Ultimate fallback if we can't even get admin settings
      return {
        orderId: 'error',
        paymentDetails: {
          recipient: 'ALEXANDR FERBER',
          bankAccount: 'KZ44004300223375964',
          bankName: 'Kaspi Bank',
          amount: 0,
          reference: 'Order processing error'
        }
      };
    }
  }
};

// Upload receipt image
export const uploadReceiptImage = async (orderId: string, file: File): Promise<{ success: boolean, error?: string }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;
    
    const { error } = await supabase.storage
      .from('order-receipts')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading receipt:', error);
      return { success: false, error: error.message };
    }
    
    // Update the order with receipt URL
    const { error: updateError } = await supabase
      .from('orders')
      .update({ receipt_url: filePath })
      .eq('id', orderId);
      
    if (updateError) {
      console.error('Error updating order with receipt URL:', updateError);
      return { success: false, error: updateError.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in uploadReceiptImage:', error);
    return { success: false, error: error.message };
  }
};

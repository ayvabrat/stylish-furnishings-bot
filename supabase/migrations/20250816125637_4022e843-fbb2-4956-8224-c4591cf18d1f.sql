
-- Add arsenalpay_payment_id column to orders table
ALTER TABLE public.orders 
ADD COLUMN arsenalpay_payment_id text;

-- Add index for faster lookups by ArsenalPay payment ID
CREATE INDEX idx_orders_arsenalpay_payment_id ON public.orders(arsenalpay_payment_id);

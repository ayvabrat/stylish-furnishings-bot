
-- Add receipt_url column to orders table
ALTER TABLE IF EXISTS public.orders
ADD COLUMN receipt_url text;

-- Create storage bucket for order receipts if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'order-receipts', 'Order Receipts', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'order-receipts');

-- Create storage policy for authenticated users to upload receipts
CREATE POLICY "Anyone can upload receipts" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'order-receipts');

-- Create storage policy for viewing receipts (admin only, would need more secure implementation for production)
CREATE POLICY "Anyone can view receipts" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'order-receipts');

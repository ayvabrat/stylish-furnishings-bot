-- Update order_receipts storage bucket to be public so Telegram can access images
UPDATE storage.buckets 
SET public = true 
WHERE id = 'order_receipts';
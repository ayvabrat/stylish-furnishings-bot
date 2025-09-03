-- Update admin settings with new payment details
INSERT INTO public.settings (key, value) 
VALUES ('admin_settings', '{"paymentDetails":{"bankName":"Сбер","accountNumber":"2202208115189566","recipientName":"Ким Анастасия Алексеевна"},"contactInfo":{"phone":"+7 777 123 4567","email":"info@pro-mebel.shop","address":"г. Алматы, ул. Достык, 123"}}')
ON CONFLICT (key) 
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();
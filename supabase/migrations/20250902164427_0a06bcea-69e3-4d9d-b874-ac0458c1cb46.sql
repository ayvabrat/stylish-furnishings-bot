-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT,
  city TEXT,
  postal_code TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  promotion_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  additional_notes TEXT,
  receipt_url TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table for admin configuration
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for order receipts
INSERT INTO storage.buckets (id, name, public) VALUES ('order_receipts', 'order_receipts', false);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders (public access for order creation)
CREATE POLICY "Allow order creation" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow order updates" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow order reading" ON public.orders FOR SELECT USING (true);

-- Create RLS policies for order_items
CREATE POLICY "Allow order_items creation" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow order_items reading" ON public.order_items FOR SELECT USING (true);

-- Create RLS policies for settings (public read access)
CREATE POLICY "Allow settings reading" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow settings management" ON public.settings FOR ALL USING (true);

-- Create RLS policies for storage
CREATE POLICY "Allow receipt uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'order_receipts');
CREATE POLICY "Allow receipt reading" ON storage.objects FOR SELECT USING (bucket_id = 'order_receipts');
CREATE POLICY "Allow receipt updates" ON storage.objects FOR UPDATE USING (bucket_id = 'order_receipts');

-- Insert default payment settings
INSERT INTO public.settings (key, value) VALUES 
('payment_recipient_name', 'Ким Анастасия Алексеевна'),
('payment_account_number', '2202208115189566'),
('payment_bank_name', 'Сбер');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
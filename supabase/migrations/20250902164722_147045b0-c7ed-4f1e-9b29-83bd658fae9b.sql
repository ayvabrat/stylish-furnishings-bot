-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ru TEXT NOT NULL,
  name_kk TEXT,
  price DECIMAL(10,2) NOT NULL,
  description_ru TEXT,
  description_kk TEXT,
  category_id TEXT,
  images TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ru TEXT NOT NULL,
  name_kk TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin functionality
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (public read access)
CREATE POLICY "Allow products reading" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow products management" ON public.products FOR ALL USING (true);

-- Create RLS policies for categories (public read access)
CREATE POLICY "Allow categories reading" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow categories management" ON public.categories FOR ALL USING (true);

-- Create RLS policies for user_roles
CREATE POLICY "Allow user_roles reading" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Allow user_roles management" ON public.user_roles FOR ALL USING (true);

-- Create storage bucket for products
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Create RLS policies for products storage
CREATE POLICY "Allow product images reading" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Allow product images upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "Allow product images update" ON storage.objects FOR UPDATE USING (bucket_id = 'products');

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert test product for payments
INSERT INTO public.products (id, name_ru, name_kk, price, description_ru) VALUES 
('test-product-1', 'Тестовый товар', 'Тест өнім', 1.00, 'Тестовый товар для проверки оплаты');
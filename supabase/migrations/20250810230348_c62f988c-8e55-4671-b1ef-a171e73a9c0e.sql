
-- Добавить тестовый товар за 1₽, если такого ещё нет
INSERT INTO public.products (name_ru, name_kk, price, images, is_popular, is_new)
SELECT 'Тестовый товар', 'Сынақ тауары', 1, ARRAY['/placeholder.svg']::text[], false, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.products 
  WHERE price = 1 AND name_ru = 'Тестовый товар'
);

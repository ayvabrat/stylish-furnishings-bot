-- Fix order_items table - add missing foreign key reference
ALTER TABLE public.order_items 
ADD CONSTRAINT fk_order_items_order_id 
FOREIGN KEY (order_id) 
REFERENCES public.orders(id) 
ON DELETE CASCADE;
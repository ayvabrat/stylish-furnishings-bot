
-- 1) Расширение для UUID
create extension if not exists "pgcrypto";

-- 2) Таблица settings (key/value), хранит как отдельные ключи, так и целиком JSON admin_settings
create table if not exists public.settings (
  key text primary key,
  value text
);

alter table public.settings enable row level security;

-- Политики (временно публичные: чтение, вставка, обновление) — т.к. админки без реальной аутентификации
drop policy if exists "Public can read settings" on public.settings;
drop policy if exists "Public can insert settings" on public.settings;
drop policy if exists "Public can update settings" on public.settings;

create policy "Public can read settings"
  on public.settings for select
  using (true);

create policy "Public can insert settings"
  on public.settings for insert
  with check (true);

create policy "Public can update settings"
  on public.settings for update
  using (true);

-- 3) Категории
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_ru text not null,
  name_kk text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  using (true);

-- 4) Товары
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name_ru text not null,
  name_kk text,
  price numeric(10,2) not null check (price >= 0),
  description_ru text,
  description_kk text,
  category_id uuid references public.categories(id) on delete set null,
  images text[] not null default '{}',
  is_popular boolean not null default false,
  is_new boolean not null default false,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Публичные политики (временно, чтобы админ-страницы работали без auth)
drop policy if exists "Public can read products" on public.products;
drop policy if exists "Public can insert products" on public.products;
drop policy if exists "Public can update products" on public.products;
drop policy if exists "Public can delete products" on public.products;

create policy "Public can read products"
  on public.products for select
  using (true);

create policy "Public can insert products"
  on public.products for insert
  with check (true);

create policy "Public can update products"
  on public.products for update
  using (true);

create policy "Public can delete products"
  on public.products for delete
  using (true);

-- 5) Заказы
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address text,
  city text,
  postal_code text,
  total_amount numeric(10,2) not null check (total_amount >= 0),
  payment_method text not null,
  promotion_code text,
  discount_amount numeric(10,2) not null default 0,
  additional_notes text,
  status text not null default 'pending',
  receipt_url text,
  yoomoney_payment_id text,
  payment_status text,
  payment_purpose text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Политики: вставка, чтение и обновление (для загрузки чека и смены статуса без auth)
drop policy if exists "Public can insert orders" on public.orders;
drop policy if exists "Public can read orders" on public.orders;
drop policy if exists "Public can update orders" on public.orders;

create policy "Public can insert orders"
  on public.orders for insert
  with check (true);

create policy "Public can read orders"
  on public.orders for select
  using (true);

create policy "Public can update orders"
  on public.orders for update
  using (true);

-- 6) Позиции заказа
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  quantity int not null check (quantity > 0),
  price numeric(10,2) not null check (price >= 0)
);

alter table public.order_items enable row level security;

drop policy if exists "Public can insert order_items" on public.order_items;
drop policy if exists "Public can read order_items" on public.order_items;

create policy "Public can insert order_items"
  on public.order_items for insert
  with check (true);

create policy "Public can read order_items"
  on public.order_items for select
  using (true);

-- 7) Начальные данные: категория + тестовый товар 1₽
-- Категория
insert into public.categories (id, name_ru, name_kk, image_url)
values (
  gen_random_uuid(),
  'Тест',
  'Тест',
  null
)
on conflict do nothing;

-- Возьмём любую существующую категорию (например, только что созданную)
-- и добавим тестовый товар за 1₽
with first_cat as (
  select id from public.categories limit 1
)
insert into public.products (name_ru, name_kk, price, description_ru, description_kk, category_id, images, is_popular, is_new, in_stock)
select
  'Тестовый товар 1₽',
  'Тестілік тауар 1₽',
  1.00,
  'Тестовый товар для проверки онлайн-оплаты YooMoney.',
  'YooMoney онлайн төлемін тексеруге арналған тестілік тауар.',
  id,
  '{}',
  true,
  true,
  true
from first_cat
on conflict do nothing;

-- 8) Настройки по умолчанию:
-- a) JSON с админ-настройками (как в UI)
insert into public.settings (key, value) values
('admin_settings', json_build_object(
  'paymentDetails', json_build_object(
    'bankName', 'HALYK BANK',
    'accountNumber', '4146 2130 0468 9747',
    'recipientName', 'ANDREY SHALNEV'
  ),
  'contactInfo', json_build_object(
    'phone', '+7 777 123 4567',
    'email', 'info@pro-mebel.shop',
    'address', 'г. Алматы, ул. Достык, 123'
  )
)::text
)
on conflict (key) do update set value = excluded.value;

-- b) Ключи, которые читает orderService
insert into public.settings (key, value) values
('payment_recipient_name', 'ANDREY SHALNEV'),
('payment_account_number', '4146 2130 0468 9747'),
('payment_bank_name', 'HALYK BANK')
on conflict (key) do update set value = excluded.value;

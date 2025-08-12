
-- 1) Роли и вспомогательная функция

-- Enum ролей приложения
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'moderator', 'user');
  end if;
end$$;

-- Таблица ролей пользователей
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Функция проверки роли (SECURITY DEFINER, стабильная)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- 2) Политики для products:
-- Сначала удаляем существующие слишком широкие политики
drop policy if exists "Public can delete products" on public.products;
drop policy if exists "Public can insert products" on public.products;
drop policy if exists "Public can read products" on public.products;
drop policy if exists "Public can update products" on public.products;

-- Чтение каталога — публично (нужно для витрины)
create policy "Public read products"
  on public.products
  for select
  using (true);

-- Изменения каталога — только админы
create policy "Admins insert products"
  on public.products
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins update products"
  on public.products
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins delete products"
  on public.products
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 3) Политики для settings:
drop policy if exists "Public can insert settings" on public.settings;
drop policy if exists "Public can read settings" on public.settings;
drop policy if exists "Public can update settings" on public.settings;

-- Чтение настроек (например, контакты, реквизиты) — публично
create policy "Public read settings"
  on public.settings
  for select
  using (true);

-- Изменять настройки — только админы
create policy "Admins insert settings"
  on public.settings
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins update settings"
  on public.settings
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 4) Политики для orders:
drop policy if exists "Public can insert orders" on public.orders;
drop policy if exists "Public can read orders" on public.orders;
drop policy if exists "Public can update orders" on public.orders;

-- Создание заказа — публично (нужно оформить заказ до оплаты)
create policy "Public create orders"
  on public.orders
  for insert
  with check (true);

-- Читать/обновлять заказы — только админы
create policy "Admins read orders"
  on public.orders
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins update orders"
  on public.orders
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 5) Политики для order_items:
drop policy if exists "Public can insert order_items" on public.order_items;
drop policy if exists "Public can read order_items" on public.order_items;

-- Добавление позиций — публично (как часть оформления заказа)
create policy "Public create order_items"
  on public.order_items
  for insert
  with check (true);

-- Чтение позиций — только админы
create policy "Admins read order_items"
  on public.order_items
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));


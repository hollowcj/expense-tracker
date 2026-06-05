-- ========================================================
-- FUNDLY BACKEND DATABASE INITIALIZATION SCHEMA
-- FEATURING ROW LEVEL SECURITY (RLS) & CASCADE RELATIONSHIPS
-- ========================================================

-- 1. Create Core Profiles Table (Links to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  currency_preference text default '₦',
  monthly_budget numeric default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Dynamic Expenses Ledger Table
create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  amount numeric not null,
  description text not null,
  category text not null,
  expense_date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Custom Categories Definition Table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text default '💰' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Global Row Level Security Policies
alter table public.profiles enable row level security;
alter table public.expenses enable row level security;
alter table public.categories enable row level security;

-- 5. Establish Access Control Security Isolation Lines
create policy "Users can modify their own profile data" on public.profiles
  for all using (auth.uid() = id);

create policy "Users can modify their own ledger expenses" on public.expenses
  for all using (auth.uid() = user_id);

create policy "Users can modify their own custom categories" on public.categories
  for all using (auth.uid() = user_id);
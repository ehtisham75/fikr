export const SUPABASE_TABLES = {
    BUDGETS: 'budgets',
};

export const BUDGETS_SELECT_COLUMNS = 'id,title,amount,budget_month,created_at';

export const CREATE_BUDGETS_TABLE_SQL = `
create extension if not exists pgcrypto;

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric not null check (amount > 0),
  budget_month text not null,
  created_at timestamptz not null default now()
);

create index if not exists budgets_budget_month_created_at_idx
  on public.budgets (budget_month, created_at desc);

alter table public.budgets enable row level security;

drop policy if exists "Allow anon read budgets" on public.budgets;
create policy "Allow anon read budgets"
  on public.budgets
  for select
  to anon
  using (true);

drop policy if exists "Allow anon insert budgets" on public.budgets;
create policy "Allow anon insert budgets"
  on public.budgets
  for insert
  to anon
  with check (true);
`.trim();

export const isMissingSupabaseTableError = error => {
    const message = String(error?.message || '').toLowerCase();

    return (
        error?.code === 'PGRST205' ||
        error?.code === '42P01' ||
        message.includes('could not find the table') ||
        message.includes('schema cache') ||
        message.includes('relation "public.budgets" does not exist')
    );
};

export const isSupabasePolicyError = error => {
    const message = String(error?.message || '').toLowerCase();

    return (
        error?.code === '42501' ||
        message.includes('row-level security policy') ||
        message.includes('permission denied')
    );
};

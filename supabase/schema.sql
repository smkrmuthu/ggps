-- GGPS schema. Run once in the Supabase SQL editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','master'))
);

create table if not exists public.entries (
  id bigint generated always as identity primary key,
  ym text not null check (ym ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  oem numeric(14,2) not null default 0,
  avs numeric(14,2) not null default 0,
  oth numeric(14,2) not null default 0,
  inc numeric(16,2),
  exp numeric(16,2),
  created_at timestamptz not null default now()
);
create index if not exists entries_ym_idx on public.entries (ym);

create or replace function public.is_master() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'master');
$$;

alter table public.profiles enable row level security;
alter table public.entries  enable row level security;

create policy "own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "read entries" on public.entries for select to authenticated using (true);
create policy "master insert" on public.entries for insert to authenticated with check (public.is_master());
create policy "master update" on public.entries for update to authenticated using (public.is_master());
create policy "master delete" on public.entries for delete to authenticated using (public.is_master());

alter publication supabase_realtime add table public.entries;

-- Create users in Auth > Users, then promote one:
-- insert into public.profiles (id, role) select id, 'master' from auth.users where email = 'you@company.com'
--   on conflict (id) do update set role = 'master';
-- Other users: insert with role 'admin' (a missing profile row is treated as admin).

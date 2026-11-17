-- P.K. Auto Deals schema
-- Run in Supabase SQL Editor. Never put the service-role key in frontend code.

create extension if not exists pgcrypto;

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  category text not null,
  year integer,
  registration_year integer,
  price numeric(12,2),
  km integer,
  fuel text not null default 'Petrol',
  transmission text not null default 'Manual',
  ownership text not null default 'To be verified',
  registration text not null default 'To be verified',
  insurance text not null default 'To be verified',
  service_history text not null default 'To be verified',
  condition text not null default 'To be inspected',
  warranty text not null default 'Not specified',
  status text not null default 'Available' check (status in ('Available','Reserved','Sold')),
  featured boolean not null default false,
  image_url text not null default '',
  demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  interested_vehicle text,
  preferred_date date,
  preferred_time text,
  message text,
  type text not null default 'General enquiry',
  status text not null default 'New' check (status in ('New','Contacted','Qualified','Closed')),
  created_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;
alter table public.leads enable row level security;

-- Public visitors can see only non-demo listings. Demo data lives in frontend fallback.
drop policy if exists "Public can read available vehicles" on public.vehicles;
create policy "Public can read available vehicles"
on public.vehicles for select to anon, authenticated
using (status <> 'Sold');

drop policy if exists "Authenticated admins manage vehicles" on public.vehicles;
create policy "Authenticated admins manage vehicles"
on public.vehicles for all to authenticated
using (true) with check (true);

drop policy if exists "Visitors can submit enquiries" on public.leads;
create policy "Visitors can submit enquiries"
on public.leads for insert to anon, authenticated
with check (char_length(name) between 2 and 100 and char_length(phone) between 10 and 20);

drop policy if exists "Authenticated admins read leads" on public.leads;
create policy "Authenticated admins read leads"
on public.leads for select to authenticated using (true);

drop policy if exists "Authenticated admins update leads" on public.leads;
create policy "Authenticated admins update leads"
on public.leads for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins delete leads" on public.leads;
create policy "Authenticated admins delete leads"
on public.leads for delete to authenticated using (true);

-- Storage bucket: create a PUBLIC bucket named vehicle-images in Storage UI.
-- Public read is required for image display; authenticated users only can upload/update/delete.
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read vehicle images" on storage.objects;
create policy "Public read vehicle images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'vehicle-images');

drop policy if exists "Authenticated upload vehicle images" on storage.objects;
create policy "Authenticated upload vehicle images"
on storage.objects for insert to authenticated
with check (bucket_id = 'vehicle-images');

drop policy if exists "Authenticated update vehicle images" on storage.objects;
create policy "Authenticated update vehicle images"
on storage.objects for update to authenticated
using (bucket_id = 'vehicle-images') with check (bucket_id = 'vehicle-images');

drop policy if exists "Authenticated delete vehicle images" on storage.objects;
create policy "Authenticated delete vehicle images"
on storage.objects for delete to authenticated
using (bucket_id = 'vehicle-images');

create index if not exists vehicles_status_created_idx on public.vehicles(status, created_at desc);
create index if not exists leads_created_idx on public.leads(created_at desc);

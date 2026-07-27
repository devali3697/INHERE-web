-- INHERE website CMS schema
-- Safe to run in the Supabase SQL Editor for this project.

create extension if not exists pgcrypto;

create or replace function public.is_inhere_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() ->> 'email') = 'devalihassan01@gmail.com', false);
$$;

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.page_content (
  id uuid primary key default gen_random_uuid(),
  page_key text unique not null,
  title_en text not null default '',
  title_vi text not null default '',
  subtitle_en text not null default '',
  subtitle_vi text not null default '',
  body_en text not null default '',
  body_vi text not null default '',
  hero_image text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_vi text not null default '',
  description_en text not null default '',
  description_vi text not null default '',
  image_url text,
  price_label text,
  inclusions jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_vi text not null default '',
  category_en text not null default '',
  category_vi text not null default '',
  description_en text not null default '',
  description_vi text not null default '',
  cover_image text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  image_url text not null,
  alt_en text not null default '',
  alt_vi text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_vi text not null default '',
  excerpt_en text not null default '',
  excerpt_vi text not null default '',
  content_en text not null default '',
  content_vi text not null default '',
  category_en text not null default '',
  category_vi text not null default '',
  cover_image text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote_en text not null,
  quote_vi text not null default '',
  author_name text not null,
  author_title_en text not null default '',
  author_title_vi text not null default '',
  avatar_url text,
  rating integer not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.rentals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  type text not null default 'outfit' check (type in ('outfit','accessory','makeup')),
  title_en text not null,
  title_vi text not null default '',
  description_en text not null default '',
  description_vi text not null default '',
  image_url text,
  price_label text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_vi text not null default '',
  description_en text not null default '',
  description_vi text not null default '',
  category_en text not null default '',
  category_vi text not null default '',
  duration_label text,
  price_label text,
  image_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  preferred_date date,
  guest_count integer not null default 1,
  customer_name text not null,
  email text,
  phone text,
  notes text,
  status text not null default 'new' check (status in ('new','contacted','confirmed','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security.
alter table public.site_settings enable row level security;
alter table public.page_content enable row level security;
alter table public.services enable row level security;
alter table public.albums enable row level security;
alter table public.album_photos enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.rentals enable row level security;
alter table public.experiences enable row level security;
alter table public.booking_requests enable row level security;

-- Public visitors may only read published website content.
drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings" on public.site_settings for select using (true);
drop policy if exists "public read pages" on public.page_content;
create policy "public read pages" on public.page_content for select using (is_published or public.is_inhere_admin());
drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select using (is_published or public.is_inhere_admin());
drop policy if exists "public read albums" on public.albums;
create policy "public read albums" on public.albums for select using (is_published or public.is_inhere_admin());
drop policy if exists "public read album photos" on public.album_photos;
create policy "public read album photos" on public.album_photos for select using (exists(select 1 from public.albums a where a.id=album_id and (a.is_published or public.is_inhere_admin())));
drop policy if exists "public read blogs" on public.blog_posts;
create policy "public read blogs" on public.blog_posts for select using (status='published' or public.is_inhere_admin());
drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (is_published or public.is_inhere_admin());
drop policy if exists "public read rentals" on public.rentals;
create policy "public read rentals" on public.rentals for select using (is_published or public.is_inhere_admin());
drop policy if exists "public read experiences" on public.experiences;
create policy "public read experiences" on public.experiences for select using (is_published or public.is_inhere_admin());

-- Only the configured admin may manage CMS records.
do $$
declare t text;
begin
  foreach t in array array['site_settings','page_content','services','albums','album_photos','blog_posts','testimonials','rentals','experiences','booking_requests'] loop
    execute format('drop policy if exists "admin manage %1$s" on public.%1$I', t);
    execute format('create policy "admin manage %1$s" on public.%1$I for all to authenticated using (public.is_inhere_admin()) with check (public.is_inhere_admin())', t);
  end loop;
end $$;

-- Anyone may submit a booking request, but cannot read requests.
drop policy if exists "public create booking" on public.booking_requests;
create policy "public create booking" on public.booking_requests for insert to anon, authenticated with check (true);

-- Public image bucket; uploads/deletes remain admin-only.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('inhere-media','inhere-media',true,10485760,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public=true, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "public view inhere media" on storage.objects;
create policy "public view inhere media" on storage.objects for select using (bucket_id='inhere-media');
drop policy if exists "admin manage inhere media" on storage.objects;
create policy "admin manage inhere media" on storage.objects for all to authenticated using (bucket_id='inhere-media' and public.is_inhere_admin()) with check (bucket_id='inhere-media' and public.is_inhere_admin());

-- Add CMS tables to Supabase Realtime once.
do $$
declare t text;
begin
  foreach t in array array['site_settings','page_content','services','albums','album_photos','blog_posts','testimonials','rentals','experiences'] loop
    if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then
      execute format('alter publication supabase_realtime add table public.%I',t);
    end if;
  end loop;
end $$;

-- Initial global settings. Existing website content will be migrated next.
insert into public.site_settings(key,value) values
('contact', jsonb_build_object('whatsapp','+84 898 199 099','location','Hội An, Vietnam','admin_email','devalihassan01@gmail.com')),
('branding', jsonb_build_object('name','INHERE','tagline','AO DAI · MAKEUP · PHOTOSHOOT'))
on conflict (key) do nothing;

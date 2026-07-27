-- Run once in Supabase SQL Editor to enable homepage Studio Reels management.

create table if not exists public.studio_reels (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_vi text,
  category_en text,
  category_vi text,
  video_url text not null,
  poster_url text,
  instagram_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.studio_reels enable row level security;

drop policy if exists "public read studio reels" on public.studio_reels;
create policy "public read studio reels"
on public.studio_reels for select
using (is_published or public.is_inhere_admin());

drop policy if exists "admin manage studio reels" on public.studio_reels;
create policy "admin manage studio reels"
on public.studio_reels for all to authenticated
using (public.is_inhere_admin())
with check (public.is_inhere_admin());

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'studio_reels'
  ) then
    alter publication supabase_realtime add table public.studio_reels;
  end if;
end $$;

insert into public.studio_reels
  (title_en, title_vi, category_en, category_vi, video_url, poster_url, instagram_url, sort_order)
select * from (values
  ('Silk in motion', 'Lụa chuyển động', 'Áo Dài Portrait', 'Chân dung Áo dài',
   'https://videos.pexels.com/video-files/3015510/3015510-hd_1080_1920_24fps.mp4',
   'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=900&q=88',
   'https://www.instagram.com/', 1),
  ('Old Town light', 'Ánh sáng Phố Cổ', 'Golden Hour', 'Giờ vàng',
   'https://videos.pexels.com/video-files/4763824/4763824-hd_1080_1920_24fps.mp4',
   'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=88',
   'https://www.instagram.com/', 2),
  ('A quiet love story', 'Một câu chuyện tình dịu dàng', 'Couple Session', 'Buổi chụp cặp đôi',
   'https://videos.pexels.com/video-files/4065218/4065218-hd_1080_1920_25fps.mp4',
   'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=900&q=88',
   'https://www.instagram.com/', 3),
  ('Lantern evenings', 'Đêm đèn lồng', 'Hội An After Dark', 'Hội An về đêm',
   'https://videos.pexels.com/video-files/3571264/3571264-hd_1080_1920_30fps.mp4',
   'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=88',
   'https://www.instagram.com/', 4)
) as seed(title_en, title_vi, category_en, category_vi, video_url, poster_url, instagram_url, sort_order)
where not exists (select 1 from public.studio_reels);

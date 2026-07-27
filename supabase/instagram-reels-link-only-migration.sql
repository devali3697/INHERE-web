-- Run once after studio-reels-migration.sql.
-- Enables Instagram-link-only reels and keeps admin access after email changes.

alter table public.studio_reels
  alter column video_url drop not null;

create or replace function public.is_inhere_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    auth.uid() = '898ab6ad-3306-44ba-bfd4-99a0f3c29d58'::uuid,
    false
  );
$$;

revoke all on function public.is_inhere_admin() from public;
grant execute on function public.is_inhere_admin() to anon, authenticated;

drop policy if exists "public read studio reels" on public.studio_reels;
create policy "public read studio reels"
on public.studio_reels for select
using (is_published or public.is_inhere_admin());

drop policy if exists "admin manage studio reels" on public.studio_reels;
create policy "admin manage studio reels"
on public.studio_reels for all to authenticated
using (public.is_inhere_admin())
with check (public.is_inhere_admin());

-- Run once in Supabase SQL Editor before changing the admin login email.
-- Authorization is tied to the immutable Auth user ID, so email changes do not
-- remove CMS or media access.

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

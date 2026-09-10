-- Admin CMS fields. Public queries must continue to omit manager_name and drafts.

alter table if exists public.creators
  add column if not exists short_bio text;

alter table if exists public.creators
  add column if not exists seo_title text;

alter table if exists public.creators
  add column if not exists seo_description text;

update public.creators
  set short_bio = headline
  where short_bio is null and headline is not null;

alter table if exists public.site_settings
  add column if not exists office_location text;

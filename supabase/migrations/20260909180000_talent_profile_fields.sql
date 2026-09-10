-- Public roster and profile fields. manager_name is internal-only.
-- Public app queries must select published rows and omit manager_name.

alter table if exists public.creators
  add column if not exists display_name text;

update public.creators
  set display_name = name
  where display_name is null or btrim(display_name) = '';

alter table if exists public.creators
  add column if not exists city text;

update public.creators
  set city = location
  where city is null and location is not null;

alter table if exists public.creators
  add column if not exists primary_category text;

update public.creators
  set primary_category = categories[1]
  where (primary_category is null or btrim(primary_category) = '')
    and cardinality(categories) > 0;

alter table if exists public.creators
  add column if not exists sort_order integer not null default 0;

alter table if exists public.creators
  add column if not exists manager_name text;

alter table if exists public.creators
  add column if not exists tiktok_url text;

alter table if exists public.creators
  add column if not exists twitter_url text;

alter table if exists public.creators
  add column if not exists linkedin_url text;

alter table if exists public.creators
  add column if not exists instagram_followers integer;

alter table if exists public.creators
  add column if not exists youtube_followers integer;

alter table if exists public.creators
  add column if not exists tiktok_followers integer;

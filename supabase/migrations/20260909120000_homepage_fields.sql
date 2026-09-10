-- Homepage fields used by the public site.
-- Apply in the linked Supabase project before featuring creators.

alter table if exists public.creators
  add column if not exists featured boolean not null default false;

alter table if exists public.creators
  add column if not exists hero_image_path text;

alter table if exists public.site_settings
  add column if not exists contact_phone text;

alter table if exists public.site_settings
  add column if not exists youtube_url text;

alter table if exists public.site_settings
  add column if not exists twitter_url text;

alter table if exists public.site_settings
  add column if not exists linkedin_url text;

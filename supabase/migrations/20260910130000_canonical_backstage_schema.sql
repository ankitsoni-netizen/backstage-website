-- Canonical Backstage schema.
-- Safe to apply on the existing production database (39 creators, 1 profile,
-- 1 site_settings row, 0 enquiries) and on a brand-new Supabase project.
--
-- Data rules:
--   never DROP/TRUNCATE tables
--   never DELETE rows
--   never overwrite creator, profile, or settings content
--   CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS
--   constraints and indexes added only when missing
--   CREATE OR REPLACE for functions
--   DROP POLICY IF EXISTS only for the named Backstage policies below

-- ---------------------------------------------------------------------------
-- Tables (empty database). Existing databases keep their current rows.
-- gen_random_uuid() is available on hosted Supabase.
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  display_name text,
  primary_category text,
  categories text[] not null default '{}'::text[],
  city text,
  full_bio text,
  short_bio text,
  profile_image_path text,
  hero_image_path text,
  instagram_url text,
  instagram_handle text,
  instagram_followers integer,
  youtube_url text,
  youtube_subscribers integer,
  other_social_links jsonb not null default '{}'::jsonb,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  manager_name text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  work_email text not null,
  campaign_brief text not null,
  company text,
  phone text,
  creator_id uuid,
  creator_name text,
  enquiry_type text,
  budget_range text,
  campaign_timeline text,
  preferred_meeting_date date,
  status text not null default 'new',
  assigned_to uuid,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  setting_key text primary key,
  setting_value jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  updated_by uuid,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Columns for databases created before this canonical definition.
-- ---------------------------------------------------------------------------

alter table if exists public.profiles
  add column if not exists full_name text;
alter table if exists public.profiles
  add column if not exists role text;
alter table if exists public.profiles
  add column if not exists is_active boolean;
alter table if exists public.profiles
  add column if not exists created_at timestamptz;
alter table if exists public.profiles
  add column if not exists updated_at timestamptz;

alter table if exists public.creators
  add column if not exists slug text;
alter table if exists public.creators
  add column if not exists display_name text;
alter table if exists public.creators
  add column if not exists primary_category text;
alter table if exists public.creators
  add column if not exists categories text[];
alter table if exists public.creators
  add column if not exists city text;
alter table if exists public.creators
  add column if not exists full_bio text;
alter table if exists public.creators
  add column if not exists short_bio text;
alter table if exists public.creators
  add column if not exists profile_image_path text;
alter table if exists public.creators
  add column if not exists hero_image_path text;
alter table if exists public.creators
  add column if not exists instagram_url text;
alter table if exists public.creators
  add column if not exists instagram_handle text;
alter table if exists public.creators
  add column if not exists instagram_followers integer;
alter table if exists public.creators
  add column if not exists youtube_url text;
alter table if exists public.creators
  add column if not exists youtube_subscribers integer;
alter table if exists public.creators
  add column if not exists other_social_links jsonb;
alter table if exists public.creators
  add column if not exists featured boolean;
alter table if exists public.creators
  add column if not exists sort_order integer;
alter table if exists public.creators
  add column if not exists status text;
alter table if exists public.creators
  add column if not exists published_at timestamptz;
alter table if exists public.creators
  add column if not exists seo_title text;
alter table if exists public.creators
  add column if not exists seo_description text;
alter table if exists public.creators
  add column if not exists manager_name text;
alter table if exists public.creators
  add column if not exists created_by uuid;
alter table if exists public.creators
  add column if not exists updated_by uuid;
alter table if exists public.creators
  add column if not exists created_at timestamptz;
alter table if exists public.creators
  add column if not exists updated_at timestamptz;

alter table if exists public.enquiries
  add column if not exists name text;
alter table if exists public.enquiries
  add column if not exists work_email text;
alter table if exists public.enquiries
  add column if not exists campaign_brief text;
alter table if exists public.enquiries
  add column if not exists company text;
alter table if exists public.enquiries
  add column if not exists phone text;
alter table if exists public.enquiries
  add column if not exists creator_id uuid;
alter table if exists public.enquiries
  add column if not exists creator_name text;
alter table if exists public.enquiries
  add column if not exists enquiry_type text;
alter table if exists public.enquiries
  add column if not exists budget_range text;
alter table if exists public.enquiries
  add column if not exists campaign_timeline text;
alter table if exists public.enquiries
  add column if not exists preferred_meeting_date date;
alter table if exists public.enquiries
  add column if not exists status text;
alter table if exists public.enquiries
  add column if not exists assigned_to uuid;
alter table if exists public.enquiries
  add column if not exists internal_notes text;
alter table if exists public.enquiries
  add column if not exists created_at timestamptz;
alter table if exists public.enquiries
  add column if not exists updated_at timestamptz;

alter table if exists public.site_settings
  add column if not exists setting_value jsonb;
alter table if exists public.site_settings
  add column if not exists is_public boolean;
alter table if exists public.site_settings
  add column if not exists updated_by uuid;
alter table if exists public.site_settings
  add column if not exists updated_at timestamptz;

-- Defaults for new rows only. Existing values are left untouched.
alter table if exists public.profiles
  alter column role set default 'editor';
alter table if exists public.profiles
  alter column is_active set default true;
alter table if exists public.profiles
  alter column created_at set default now();
alter table if exists public.profiles
  alter column updated_at set default now();

alter table if exists public.creators
  alter column id set default gen_random_uuid();
alter table if exists public.creators
  alter column categories set default '{}'::text[];
alter table if exists public.creators
  alter column other_social_links set default '{}'::jsonb;
alter table if exists public.creators
  alter column featured set default false;
alter table if exists public.creators
  alter column sort_order set default 0;
alter table if exists public.creators
  alter column status set default 'draft';
alter table if exists public.creators
  alter column created_at set default now();
alter table if exists public.creators
  alter column updated_at set default now();

alter table if exists public.enquiries
  alter column id set default gen_random_uuid();
alter table if exists public.enquiries
  alter column status set default 'new';
alter table if exists public.enquiries
  alter column created_at set default now();
alter table if exists public.enquiries
  alter column updated_at set default now();

alter table if exists public.site_settings
  alter column setting_value set default '{}'::jsonb;
alter table if exists public.site_settings
  alter column is_public set default true;
alter table if exists public.site_settings
  alter column updated_at set default now();

-- Fill newly added null defaults without changing populated cells.
update public.profiles
  set is_active = true
  where is_active is null;

update public.creators
  set categories = '{}'::text[]
  where categories is null;

update public.creators
  set other_social_links = '{}'::jsonb
  where other_social_links is null;

update public.creators
  set featured = false
  where featured is null;

update public.creators
  set sort_order = 0
  where sort_order is null;

update public.creators
  set status = 'draft'
  where status is null;

-- Tighten NOT NULL only when every existing row already satisfies it.
do $$
begin
  if not exists (select 1 from public.profiles where role is null) then
    alter table public.profiles alter column role set not null;
  end if;

  if not exists (select 1 from public.profiles where is_active is null) then
    alter table public.profiles alter column is_active set not null;
  end if;

  if not exists (select 1 from public.creators where categories is null) then
    alter table public.creators alter column categories set not null;
  end if;

  if not exists (select 1 from public.creators where other_social_links is null) then
    alter table public.creators alter column other_social_links set not null;
  end if;

  if not exists (select 1 from public.creators where featured is null) then
    alter table public.creators alter column featured set not null;
  end if;

  if not exists (select 1 from public.creators where sort_order is null) then
    alter table public.creators alter column sort_order set not null;
  end if;

  if not exists (select 1 from public.creators where status is null) then
    alter table public.creators alter column status set not null;
  end if;

  if not exists (select 1 from public.enquiries where name is null) then
    alter table public.enquiries alter column name set not null;
  end if;

  if not exists (select 1 from public.enquiries where work_email is null) then
    alter table public.enquiries alter column work_email set not null;
  end if;

  if not exists (select 1 from public.enquiries where campaign_brief is null) then
    alter table public.enquiries alter column campaign_brief set not null;
  end if;

  if not exists (select 1 from public.enquiries where status is null) then
    alter table public.enquiries alter column status set not null;
  end if;

  if not exists (select 1 from public.site_settings where setting_value is null) then
    alter table public.site_settings alter column setting_value set not null;
  end if;

  if not exists (select 1 from public.site_settings where is_public is null) then
    alter table public.site_settings alter column is_public set not null;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Constraints and indexes (added only when missing).
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('admin', 'editor'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'creators_status_check'
      and conrelid = 'public.creators'::regclass
  ) then
    alter table public.creators
      add constraint creators_status_check
      check (status in ('draft', 'published', 'archived'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'enquiries_status_check'
      and conrelid = 'public.enquiries'::regclass
  ) then
    alter table public.enquiries
      add constraint enquiries_status_check
      check (status in ('new', 'contacted', 'qualified', 'closed', 'spam'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'enquiries_enquiry_type_check'
      and conrelid = 'public.enquiries'::regclass
  ) then
    alter table public.enquiries
      add constraint enquiries_enquiry_type_check
      check (
        enquiry_type is null
        or enquiry_type in (
          'book_talent',
          'brand_partnership',
          'join_roster',
          'press',
          'general'
        )
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'enquiries_budget_range_check'
      and conrelid = 'public.enquiries'::regclass
  ) then
    alter table public.enquiries
      add constraint enquiries_budget_range_check
      check (
        budget_range is null
        or budget_range in ('under_5l', '5l_15l', '15l_50l', '50l_plus', 'tbd')
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'enquiries_campaign_timeline_check'
      and conrelid = 'public.enquiries'::regclass
  ) then
    alter table public.enquiries
      add constraint enquiries_campaign_timeline_check
      check (
        campaign_timeline is null
        or campaign_timeline in ('asap', '1_2_months', '3_6_months', 'flexible')
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_id_fkey'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users (id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'creators_created_by_fkey'
      and conrelid = 'public.creators'::regclass
  ) then
    alter table public.creators
      add constraint creators_created_by_fkey
      foreign key (created_by) references auth.users (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'creators_updated_by_fkey'
      and conrelid = 'public.creators'::regclass
  ) then
    alter table public.creators
      add constraint creators_updated_by_fkey
      foreign key (updated_by) references auth.users (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'enquiries_creator_id_fkey'
      and conrelid = 'public.enquiries'::regclass
  ) then
    alter table public.enquiries
      add constraint enquiries_creator_id_fkey
      foreign key (creator_id) references public.creators (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'enquiries_assigned_to_fkey'
      and conrelid = 'public.enquiries'::regclass
  ) then
    alter table public.enquiries
      add constraint enquiries_assigned_to_fkey
      foreign key (assigned_to) references auth.users (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'site_settings_updated_by_fkey'
      and conrelid = 'public.site_settings'::regclass
  ) then
    alter table public.site_settings
      add constraint site_settings_updated_by_fkey
      foreign key (updated_by) references auth.users (id) on delete set null;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from public.creators
    where slug is null or btrim(slug) = ''
  ) then
    begin
      alter table public.creators alter column slug set not null;
    exception
      when others then
        null;
    end;
  end if;
end
$$;

create unique index if not exists creators_slug_key on public.creators (slug);
create index if not exists creators_status_idx on public.creators (status);
create index if not exists creators_featured_idx on public.creators (featured);
create index if not exists creators_sort_order_idx on public.creators (sort_order);
create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- ---------------------------------------------------------------------------
-- Functions and updated_at triggers.
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_backstage_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_active = true
      and role in ('admin', 'editor')
  );
$$;

revoke all on function public.is_backstage_admin() from public;
grant execute on function public.is_backstage_admin() to anon, authenticated, service_role;

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_creators_set_updated_at on public.creators;
create trigger trg_creators_set_updated_at
  before update on public.creators
  for each row execute function public.set_updated_at();

drop trigger if exists trg_enquiries_set_updated_at on public.enquiries;
create trigger trg_enquiries_set_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

drop trigger if exists trg_site_settings_set_updated_at on public.site_settings;
create trigger trg_site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS. Only the named Backstage policies are dropped and recreated.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists backstage_profiles_select on public.profiles;
create policy backstage_profiles_select
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_backstage_admin());

drop policy if exists backstage_profiles_admin_update on public.profiles;
create policy backstage_profiles_admin_update
  on public.profiles
  for update
  to authenticated
  using (public.is_backstage_admin())
  with check (public.is_backstage_admin());

drop policy if exists backstage_creators_public_select on public.creators;
create policy backstage_creators_public_select
  on public.creators
  for select
  to anon
  using (status = 'published');

drop policy if exists backstage_creators_admin_select on public.creators;
create policy backstage_creators_admin_select
  on public.creators
  for select
  to authenticated
  using (public.is_backstage_admin());

drop policy if exists backstage_creators_admin_insert on public.creators;
create policy backstage_creators_admin_insert
  on public.creators
  for insert
  to authenticated
  with check (public.is_backstage_admin());

drop policy if exists backstage_creators_admin_update on public.creators;
create policy backstage_creators_admin_update
  on public.creators
  for update
  to authenticated
  using (public.is_backstage_admin())
  with check (public.is_backstage_admin());

drop policy if exists backstage_creators_admin_delete on public.creators;
create policy backstage_creators_admin_delete
  on public.creators
  for delete
  to authenticated
  using (public.is_backstage_admin());

drop policy if exists backstage_enquiries_anon_insert on public.enquiries;
create policy backstage_enquiries_anon_insert
  on public.enquiries
  for insert
  to anon
  with check (
    status = 'new'
    and assigned_to is null
    and internal_notes is null
    and char_length(btrim(coalesce(name, ''))) > 0
    and work_email is not null
    and position('@' in work_email) > 1
  );

drop policy if exists backstage_enquiries_admin_select on public.enquiries;
create policy backstage_enquiries_admin_select
  on public.enquiries
  for select
  to authenticated
  using (public.is_backstage_admin());

drop policy if exists backstage_enquiries_admin_insert on public.enquiries;
create policy backstage_enquiries_admin_insert
  on public.enquiries
  for insert
  to authenticated
  with check (public.is_backstage_admin());

drop policy if exists backstage_enquiries_admin_update on public.enquiries;
create policy backstage_enquiries_admin_update
  on public.enquiries
  for update
  to authenticated
  using (public.is_backstage_admin())
  with check (public.is_backstage_admin());

drop policy if exists backstage_enquiries_admin_delete on public.enquiries;
create policy backstage_enquiries_admin_delete
  on public.enquiries
  for delete
  to authenticated
  using (public.is_backstage_admin());

drop policy if exists backstage_site_settings_public_select on public.site_settings;
create policy backstage_site_settings_public_select
  on public.site_settings
  for select
  to anon
  using (is_public = true);

drop policy if exists backstage_site_settings_admin_select on public.site_settings;
create policy backstage_site_settings_admin_select
  on public.site_settings
  for select
  to authenticated
  using (public.is_backstage_admin());

drop policy if exists backstage_site_settings_admin_insert on public.site_settings;
create policy backstage_site_settings_admin_insert
  on public.site_settings
  for insert
  to authenticated
  with check (public.is_backstage_admin());

drop policy if exists backstage_site_settings_admin_update on public.site_settings;
create policy backstage_site_settings_admin_update
  on public.site_settings
  for update
  to authenticated
  using (public.is_backstage_admin())
  with check (public.is_backstage_admin());

-- ---------------------------------------------------------------------------
-- Grants. Anon cannot read staff-only creator/enquiry columns.
-- ---------------------------------------------------------------------------

revoke all on table public.profiles from public, anon;
revoke all on table public.creators from public, anon;
revoke all on table public.enquiries from public, anon;
revoke all on table public.site_settings from public, anon;

grant select (
  id,
  slug,
  display_name,
  primary_category,
  categories,
  city,
  full_bio,
  short_bio,
  profile_image_path,
  hero_image_path,
  instagram_url,
  instagram_handle,
  instagram_followers,
  youtube_url,
  youtube_subscribers,
  other_social_links,
  featured,
  sort_order,
  status,
  published_at,
  seo_title,
  seo_description,
  created_at,
  updated_at
) on table public.creators to anon;

grant insert (
  name,
  work_email,
  campaign_brief,
  company,
  phone,
  creator_id,
  creator_name,
  enquiry_type,
  budget_range,
  campaign_timeline,
  preferred_meeting_date,
  status
) on table public.enquiries to anon;

grant select (setting_key, setting_value, is_public)
  on table public.site_settings to anon;

grant select, insert, update, delete on table public.creators to authenticated;
grant select, insert, update, delete on table public.enquiries to authenticated;
grant select, insert, update, delete on table public.site_settings to authenticated;
grant select, update on table public.profiles to authenticated;

grant all on table public.profiles to service_role;
grant all on table public.creators to service_role;
grant all on table public.enquiries to service_role;
grant all on table public.site_settings to service_role;

-- ---------------------------------------------------------------------------
-- Storage: create the public bucket without touching existing objects.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('creator-media', 'creator-media', true)
on conflict (id) do update
set public = true;

drop policy if exists backstage_creator_media_public_select on storage.objects;
create policy backstage_creator_media_public_select
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'creator-media');

drop policy if exists backstage_creator_media_admin_insert on storage.objects;
create policy backstage_creator_media_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'creator-media'
    and public.is_backstage_admin()
  );

drop policy if exists backstage_creator_media_admin_update on storage.objects;
create policy backstage_creator_media_admin_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'creator-media'
    and public.is_backstage_admin()
  )
  with check (
    bucket_id = 'creator-media'
    and public.is_backstage_admin()
  );

drop policy if exists backstage_creator_media_admin_delete on storage.objects;
create policy backstage_creator_media_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'creator-media'
    and public.is_backstage_admin()
  );

-- Default public settings row. Existing content is never overwritten.
insert into public.site_settings (setting_key, setting_value, is_public)
values (
  'general',
  jsonb_build_object('companyName', 'Backstage'),
  true
)
on conflict (setting_key) do nothing;

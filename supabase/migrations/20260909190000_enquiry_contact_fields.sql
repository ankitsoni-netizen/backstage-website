-- Public enquiry fields and a public meeting URL on site settings.
-- assigned_to and internal_notes are staff-only; public inserts must omit them.

alter table if exists public.enquiries
  add column if not exists enquiry_type text;

alter table if exists public.enquiries
  add column if not exists work_email text;

alter table if exists public.enquiries
  add column if not exists phone text;

alter table if exists public.enquiries
  add column if not exists creator_name text;

alter table if exists public.enquiries
  add column if not exists campaign_brief text;

alter table if exists public.enquiries
  add column if not exists budget_range text;

alter table if exists public.enquiries
  add column if not exists campaign_timeline text;

alter table if exists public.enquiries
  add column if not exists preferred_meeting_date date;

alter table if exists public.enquiries
  add column if not exists assigned_to uuid references public.profiles (id);

alter table if exists public.enquiries
  add column if not exists internal_notes text;

update public.enquiries
  set work_email = email
  where work_email is null;

update public.enquiries
  set campaign_brief = message
  where campaign_brief is null and message is not null;

alter table if exists public.site_settings
  add column if not exists meeting_url text;

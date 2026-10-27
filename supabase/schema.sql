create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  mobile_number text,
  company text,
  service text not null,
  project_budget text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_inquiries
  add column if not exists mobile_number text;

alter table public.contact_inquiries
  add column if not exists project_budget text;

alter table public.contact_inquiries
  add column if not exists submission_type text not null default 'contact'
    check (submission_type in ('contact', 'enquiry')),
  add column if not exists status text not null default 'new'
    check (status in ('new', 'read', 'pending', 'contacted', 'in_progress', 'completed', 'archived')),
  add column if not exists internal_note text;

alter table public.contact_inquiries enable row level security;

revoke all on table public.contact_inquiries from anon, authenticated;
grant insert (name, email, mobile_number, company, service, project_budget, message, submission_type)
  on table public.contact_inquiries to service_role;
grant select, update on table public.contact_inquiries to service_role;

create table if not exists public.whatsapp_click_events (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  device_type text not null check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  browser text not null,
  created_at timestamptz not null default now()
);

alter table public.whatsapp_click_events enable row level security;
revoke all on table public.whatsapp_click_events from anon, authenticated;
grant select, insert on table public.whatsapp_click_events to service_role;

create table if not exists public.request_rate_limits (
  id bigint generated always as identity primary key,
  identity_hash text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists request_rate_limits_identity_time_idx
  on public.request_rate_limits (identity_hash, attempted_at desc);
create index if not exists request_rate_limits_attempted_at_idx
  on public.request_rate_limits (attempted_at);

alter table public.request_rate_limits enable row level security;
revoke all on table public.request_rate_limits from anon, authenticated;
grant select, insert, delete on table public.request_rate_limits to service_role;

create or replace function public.consume_request_rate_limit(
  p_identity_hash text,
  p_max_attempts integer default 5,
  p_window_seconds integer default 900
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_identity_hash));

  delete from public.request_rate_limits
  where attempted_at < now() - interval '1 day';

  select count(*) into v_attempt_count
  from public.request_rate_limits
  where identity_hash = p_identity_hash
    and attempted_at >= now() - make_interval(secs => p_window_seconds);

  if v_attempt_count >= p_max_attempts then
    return false;
  end if;

  insert into public.request_rate_limits (identity_hash) values (p_identity_hash);
  return true;
end;
$$;

revoke all on function public.consume_request_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_request_rate_limit(text, integer, integer) to service_role;

create table if not exists public.client_feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  service text not null,
  feedback text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.client_feedback enable row level security;

revoke all on table public.client_feedback from anon, authenticated;
grant insert (name, email, service, feedback)
  on table public.client_feedback to service_role;

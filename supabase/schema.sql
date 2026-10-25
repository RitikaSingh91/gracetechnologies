create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  mobile_number text,
  company text,
  service text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_inquiries
  add column if not exists mobile_number text;

alter table public.contact_inquiries enable row level security;

revoke all on table public.contact_inquiries from anon, authenticated;
grant insert (name, email, mobile_number, company, service, message)
  on table public.contact_inquiries to service_role;

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

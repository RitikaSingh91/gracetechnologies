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

create extension if not exists pgcrypto;

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text,
  contact_name text,
  email text,
  status text default 'active',
  plan text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text default 'admin' check (role in ('admin', 'partner')),
  partner_id uuid references partners(id),
  created_at timestamptz default now()
);

create table if not exists gap_projects (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id),
  company_name text not null,
  project_name text,
  ceo_name text,
  ceo_email text,
  project_token text unique not null,
  status text default 'open',
  expected_leader_count integer,
  response_deadline timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists gap_invitations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references gap_projects(id) on delete cascade,
  respondent_type text check (respondent_type in ('ceo', 'executive', 'manager')),
  name text,
  email text,
  token text unique not null,
  expires_at timestamptz,
  used_at timestamptz,
  revoked_at timestamptz,
  email_sent_at timestamptz,
  email_send_count integer default 0,
  created_at timestamptz default now()
);

alter table gap_invitations add column if not exists revoked_at timestamptz;
alter table gap_invitations add column if not exists email_sent_at timestamptz;
alter table gap_invitations add column if not exists email_send_count integer default 0;

create table if not exists gap_responses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references gap_projects(id) on delete cascade,
  invitation_id uuid references gap_invitations(id),
  respondent_type text check (respondent_type in ('ceo', 'executive', 'manager')),
  name text,
  email text,
  employment_type text,
  department text,
  tenure text,
  position text,
  answers jsonb not null,
  scores jsonb,
  total_score numeric,
  created_at timestamptz default now()
);

create table if not exists gap_feedback_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references gap_projects(id) on delete cascade,
  summary text,
  result_overview text,
  max_gap text,
  low_gap_strength text,
  gap_factors text,
  executive_view text,
  field_view text,
  short_term_action text,
  mid_term_action text,
  notes text,
  snapshot jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists gap_feedback_reports_project_id_key
  on gap_feedback_reports(project_id);

create index if not exists gap_invitations_project_id_idx on gap_invitations(project_id);
create index if not exists gap_responses_project_id_idx on gap_responses(project_id);
create index if not exists gap_projects_partner_id_idx on gap_projects(partner_id);

alter table partners enable row level security;
alter table admin_profiles enable row level security;
alter table gap_projects enable row level security;
alter table gap_invitations enable row level security;
alter table gap_responses enable row level security;
alter table gap_feedback_reports enable row level security;

create policy "admins read partners" on partners for select
  using (exists (select 1 from admin_profiles where id = auth.uid()));
create policy "admins manage partners" on partners for all
  using (exists (select 1 from admin_profiles where id = auth.uid()))
  with check (exists (select 1 from admin_profiles where id = auth.uid()));

create policy "admins read profiles" on admin_profiles for select
  using (exists (select 1 from admin_profiles where id = auth.uid()));

create policy "admins manage projects" on gap_projects for all
  using (exists (select 1 from admin_profiles where id = auth.uid()))
  with check (exists (select 1 from admin_profiles where id = auth.uid()));

create policy "admins manage invitations" on gap_invitations for all
  using (exists (select 1 from admin_profiles where id = auth.uid()))
  with check (exists (select 1 from admin_profiles where id = auth.uid()));

create policy "admins manage responses" on gap_responses for all
  using (exists (select 1 from admin_profiles where id = auth.uid()))
  with check (exists (select 1 from admin_profiles where id = auth.uid()));

create policy "admins manage reports" on gap_feedback_reports for all
  using (exists (select 1 from admin_profiles where id = auth.uid()))
  with check (exists (select 1 from admin_profiles where id = auth.uid()));

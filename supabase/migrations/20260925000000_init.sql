-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- 1. PROJECT
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sdg_tags text[] default '{}',
  geofence jsonb, -- polygon or center/radius
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. ASSET
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  cloudinary_public_id text not null unique,
  secure_url text not null,
  asset_type text default 'image' not null, -- 'image' | 'video'
  exif jsonb default '{}'::jsonb,
  latitude double precision,
  longitude double precision,
  captured_at timestamptz,
  phash text,
  quality_score double precision default 1.0,
  caption text,
  ai_tags text[] default '{}',
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index if not exists idx_assets_project_id on public.assets(project_id);
create index if not exists idx_assets_phash on public.assets(phash);
create index if not exists idx_assets_captured_at on public.assets(captured_at);

-- 3. ASSET_PAIR (Before/After)
create table if not exists public.asset_pairs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  before_asset_id uuid references public.assets(id) on delete cascade not null,
  after_asset_id uuid references public.assets(id) on delete cascade not null,
  similarity double precision,
  change_score double precision, -- ExG or diff metric
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index if not exists idx_asset_pairs_project on public.asset_pairs(project_id);

-- 4. TRUST_RECORD
create table if not exists public.trust_records (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets(id) on delete cascade not null unique,
  geofence_ok boolean default true not null,
  timestamp_ok boolean default true not null,
  duplicate_flag boolean default false not null,
  base_trust double precision default 1.0 not null,
  details jsonb default '{}'::jsonb,
  updated_at timestamptz default now() not null
);

-- 5. CLAIM
create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  text text not null,
  category text, -- 'activity' | 'environment' | 'scale' | 'timeline'
  cited_asset_ids uuid[] default '{}' not null,
  created_at timestamptz default now() not null
);

-- 6. VERDICT
create table if not exists public.verdicts (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid references public.claims(id) on delete cascade not null unique,
  jev_answers jsonb default '{}'::jsonb,
  survival_score double precision not null,
  status text not null check (status in ('verified', 'review', 'contradicted', 'processing')),
  escalated_to_vlm boolean default false,
  evaluated_at timestamptz default now() not null
);

-- 7. LEDGER_ENTRY (Decision Ledger - append only)
create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  verdict_id uuid references public.verdicts(id) on delete cascade not null,
  claim_id uuid references public.claims(id) on delete cascade not null,
  state_hash text not null,
  question text not null,
  probability double precision not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_ledger_entries_verdict on public.ledger_entries(verdict_id);
create index if not exists idx_ledger_entries_state_hash on public.ledger_entries(state_hash);

-- 8. REPORT
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  claim_ids uuid[] default '{}' not null,
  pdf_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.assets enable row level security;
alter table public.asset_pairs enable row level security;
alter table public.trust_records enable row level security;
alter table public.claims enable row level security;
alter table public.verdicts enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.reports enable row level security;

-- Public read policies for verify page & reports
create policy "Allow public read access to assets" on public.assets for select using (true);
create policy "Allow public read access to trust_records" on public.trust_records for select using (true);
create policy "Allow public read access to verdicts" on public.verdicts for select using (true);
create policy "Allow public read access to ledger_entries" on public.ledger_entries for select using (true);
create policy "Allow public read access to claims" on public.claims for select using (true);
create policy "Allow public read access to projects" on public.projects for select using (true);
create policy "Allow public read access to asset_pairs" on public.asset_pairs for select using (true);
create policy "Allow public read access to reports" on public.reports for select using (true);

-- Authenticated / Service role write policies
create policy "Allow insert on assets" on public.assets for insert with check (true);
create policy "Allow update on assets" on public.assets for update using (true);

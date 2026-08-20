create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null check (category in ('digital','management')),
  location text not null,
  year text not null,
  name jsonb not null,
  services jsonb not null,
  strategy jsonb not null,
  what_we_did jsonb not null,
  description jsonb not null,
  results jsonb not null,
  hero_image text not null,
  gallery text[] not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on projects (category, sort_order);

create table page_assets (
  id uuid primary key default gen_random_uuid(),
  page text not null check (page in ('home','digital','management')),
  slot text not null,
  media_type text not null check (media_type in ('image','video')),
  public_id text not null,
  updated_at timestamptz not null default now(),
  unique (page, slot)
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  source text not null default 'investments',
  created_at timestamptz not null default now()
);

alter table projects enable row level security;
alter table page_assets enable row level security;
alter table leads enable row level security;

create policy "public read projects"    on projects    for select using (published = true);
create policy "public read page_assets" on page_assets for select using (true);

create policy "admin write projects"    on projects    for all to authenticated using (true) with check (true);
create policy "admin write page_assets" on page_assets for all to authenticated using (true) with check (true);

create policy "public insert leads" on leads for insert to anon        with check (true);
create policy "admin read leads"    on leads for select to authenticated using (true);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger t_projects_updated    before update on projects    for each row execute function set_updated_at();
create trigger t_page_assets_updated before update on page_assets for each row execute function set_updated_at();

create table packages (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null,
  description jsonb not null,
  features jsonb not null,
  popular boolean not null default false,
  sort_order int not null default 1,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on packages (sort_order);

alter table packages enable row level security;

create policy "public read packages" on packages for select using (published = true);
create policy "admin write packages" on packages for all to authenticated using (true) with check (true);

create trigger t_packages_updated before update on packages for each row execute function set_updated_at();

insert into packages (name, description, features, popular, sort_order, published) values
(
  '{"pt":"Essential","en":"Essential"}',
  '{"pt":"Gestão de arrendamento de longa duração","en":"Long-term rental management"}',
  '[
    {"pt":"Gestão de inquilinos","en":"Tenant management"},
    {"pt":"Cobrança de rendas","en":"Rent collection"},
    {"pt":"Relatório mensal","en":"Monthly report"},
    {"pt":"Suporte por email e telefone","en":"Email & phone support"}
  ]',
  false, 1, true
),
(
  '{"pt":"Premium","en":"Premium"}',
  '{"pt":"Gestão completa e dedicada","en":"Full dedicated management"}',
  '[
    {"pt":"Tudo do Essential MAIS:","en":"Everything in Essential PLUS:"},
    {"pt":"Manutenção e reparações","en":"Maintenance & repairs"},
    {"pt":"Gestão legal e fiscal","en":"Legal & tax management"},
    {"pt":"Fotografia profissional do imóvel","en":"Professional property photography"},
    {"pt":"Gestor dedicado","en":"Dedicated manager"}
  ]',
  true, 2, true
),
(
  '{"pt":"Concierge","en":"Concierge"}',
  '{"pt":"Serviço personalizado premium","en":"Premium personalised service"}',
  '[
    {"pt":"Tudo do Premium MAIS:","en":"Everything in Premium PLUS:"},
    {"pt":"Serviço personalizado 24/7","en":"Personalised 24/7 service"},
    {"pt":"Home staging completo","en":"Full home staging"},
    {"pt":"Gestão de múltiplos imóveis","en":"Multiple property management"},
    {"pt":"Relatórios personalizados","en":"Custom reporting"}
  ]',
  false, 3, true
);

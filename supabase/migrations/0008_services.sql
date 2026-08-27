create table services (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name jsonb not null,
  "desc" jsonb not null,
  sort_order int not null default 1,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_category_check check (category in ('media', 'ondemand'))
);
create index on services (category, sort_order);

alter table services enable row level security;

create policy "public read services" on services for select using (published = true);
create policy "admin write services" on services for all to authenticated using (true) with check (true);

create trigger t_services_updated before update on services for each row execute function set_updated_at();

-- The 12 entries previously hardcoded in src/data/services.ts, in their
-- existing order. sort_order restarts at 1 for each category.
insert into services (category, name, "desc", sort_order, published) values
(
  'media',
  '{"pt": "Fotografia HDR", "en": "HDR Photography"}',
  '{"pt": "Fotografia de interiores e exteriores com precisão e detalhe.", "en": "Interior and exterior photography with precision and detail."}', 1, true
),
(
  'media',
  '{"pt": "Vídeos Promocionais", "en": "Promotional Videos"}',
  '{"pt": "Vídeos verticais curtos para Reels, TikTok e Facebook.", "en": "Short vertical videos built for Reels, TikTok and Facebook."}', 2, true
),
(
  'media',
  '{"pt": "Vídeo Cinematográfico", "en": "Cinematic Video"}',
  '{"pt": "Tours horizontais completos com gradação de cor profissional.", "en": "Full horizontal property tours with professional colour grading."}', 3, true
),
(
  'media',
  '{"pt": "Drone e Fotografia Aérea", "en": "Drone & Aerial Photography"}',
  '{"pt": "Fotografia e vídeo aéreo que revelam o que o solo não consegue.", "en": "Aerial photo and video that reveal what ground level can''t."}', 4, true
),
(
  'media',
  '{"pt": "Integração de IA", "en": "AI Integration"}',
  '{"pt": "Home staging e acabamentos fotorrealistas com IA.", "en": "Photorealistic staging and finishing for empty or unfinished spaces."}', 5, true
),
(
  'media',
  '{"pt": "Gestão de Redes Sociais", "en": "Social Media Management"}',
  '{"pt": "Estratégia, publicação e agendamento de conteúdo imobiliário.", "en": "Strategy, posting and scheduling for your property content."}', 6, true
),
(
  'ondemand',
  '{"pt": "Home Staging com IA", "en": "AI Home Staging"}',
  '{"pt": "Mobilar digitalmente espaços vazios com IA fotorrealista.", "en": "Digitally furnish empty rooms with photorealistic AI staging."}', 1, true
),
(
  'ondemand',
  '{"pt": "Construção Avançada com IA", "en": "Advanced AI Construction"}',
  '{"pt": "Visualizações fotorrealistas para imóveis ainda em construção.", "en": "Photorealistic visualisations for properties still under construction."}', 2, true
),
(
  'ondemand',
  '{"pt": "Moodboard", "en": "Moodboard"}',
  '{"pt": "Um painel visual com a direção criativa do imóvel ou marca.", "en": "A curated visual direction board for your property or brand."}', 3, true
),
(
  'ondemand',
  '{"pt": "Renders 3D", "en": "3D Renders"}',
  '{"pt": "Renders 3D completos de interiores, exteriores e plantas.", "en": "Full 3D renders of interiors, exteriors and floor plans."}', 4, true
),
(
  'ondemand',
  '{"pt": "Plantas 2D", "en": "2D Plans"}',
  '{"pt": "Plantas 2D precisas para anúncios e brochuras.", "en": "Clean, accurate 2D floor plans for listings and brochures."}', 5, true
),
(
  'ondemand',
  '{"pt": "Brochuras", "en": "Brochures"}',
  '{"pt": "Brochuras premium, digitais ou impressas, para os seus imóveis.", "en": "Premium printed or digital brochures for your listings."}', 6, true
);

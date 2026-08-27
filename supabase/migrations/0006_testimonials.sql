create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  quote jsonb not null,
  job jsonb not null,
  sort_order int not null default 1,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on testimonials (sort_order);

alter table testimonials enable row level security;

create policy "public read testimonials" on testimonials for select using (published = true);
create policy "admin write testimonials" on testimonials for all to authenticated using (true) with check (true);

create trigger t_testimonials_updated before update on testimonials for each row execute function set_updated_at();

insert into testimonials (author, quote, job, sort_order, published) values
(
  'Maria Santos',
  '{"pt":"A qualidade do trabalho superou todas as nossas expectativas. As fotografias e vídeos transformaram completamente os nossos anúncios.","en":"The quality of their work exceeded all our expectations. The photos and videos completely transformed our listings."}',
  '{"pt":"Diretora, RE/MAX Cascais","en":"Director, RE/MAX Cascais"}',
  1, true
),
(
  'João Ferreira',
  '{"pt":"Profissionalismo impecável desde o primeiro contacto. Os vídeos cinematográficos são simplesmente extraordinários.","en":"Impeccable professionalism from first contact. The cinematic videos are simply extraordinary."}',
  '{"pt":"Consultor, Keller Williams Lisboa","en":"Consultant, Keller Williams Lisbon"}',
  2, true
),
(
  'Ana Costa',
  '{"pt":"O drone footage e o virtual staging com IA fizeram toda a diferença. Vendemos o imóvel em tempo recorde.","en":"The drone footage and AI virtual staging made all the difference. We sold the property in record time."}',
  '{"pt":"CEO, Costa Properties","en":"CEO, Costa Properties"}',
  3, true
),
(
  'Carla Mendes',
  '{"pt":"Tempo de entrega excecional. Tivemos as fotos e vídeo prontos a publicar em menos de 48 horas após a sessão.","en":"Outstanding turnaround time. We had the photos and video ready to publish within 48 hours of the shoot."}',
  '{"pt":"Consultora, ERA Cascais","en":"Agent, ERA Cascais"}',
  4, true
),
(
  'David Miller',
  '{"pt":"A equipa bilingue foi perfeita para os nossos clientes internacionais. Comunicação fluida em inglês e português.","en":"The bilingual team was perfect for our international clients. Seamless communication in English and Portuguese."}',
  '{"pt":"Managing Partner, The Agency Algarve","en":"Managing Partner, The Agency Algarve"}',
  5, true
),
(
  'Sofia Oliveira',
  '{"pt":"Os vídeos para redes sociais geraram mais engagement do que qualquer conteúdo que já publicámos. Resultados incríveis.","en":"The social media videos generated more engagement than any content we have ever posted. Incredible results."}',
  '{"pt":"Marketing Director, Century 21 Estoril","en":"Marketing Director, Century 21 Estoril"}',
  6, true
);

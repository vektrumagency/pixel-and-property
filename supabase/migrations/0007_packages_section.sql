alter table packages
  add column section text not null default 'management';

alter table packages
  add constraint packages_section_check check (section in ('management', 'digital'));

insert into packages (name, description, features, popular, sort_order, published, section) values
(
  '{"pt":"Essence","en":"Essence"}',
  '{"pt":"5 Imóveis","en":"5 Properties"}',
  '[
    {"pt":"HDR Interior","en":"HDR Interior"},
    {"pt":"HDR Exterior","en":"HDR Exterior"},
    {"pt":"Fotos de Drone","en":"Drone Photos"}
  ]',
  false, 1, true, 'digital'
),
(
  '{"pt":"Signature","en":"Signature"}',
  '{"pt":"Por Imóvel","en":"Per Property"}',
  '[
    {"pt":"HDR Interior","en":"HDR Interior"},
    {"pt":"HDR Exterior","en":"HDR Exterior"},
    {"pt":"Fotos de Drone","en":"Drone Photos"},
    {"pt":"Vídeo Cinematográfico (Horizontal)","en":"Cinematic Video (Horizontal)"}
  ]',
  true, 2, true, 'digital'
),
(
  '{"pt":"Prestige","en":"Prestige"}',
  '{"pt":"Por Imóvel","en":"Per Property"}',
  '[
    {"pt":"HDR Interior","en":"HDR Interior"},
    {"pt":"HDR Exterior","en":"HDR Exterior"},
    {"pt":"Fotos de Drone","en":"Drone Photos"},
    {"pt":"Vídeo Cinematográfico (Horizontal)","en":"Cinematic Video (Horizontal)"},
    {"pt":"Vídeo Promocional (Redes Sociais)","en":"Promotional Video (Social Media)"}
  ]',
  false, 3, true, 'digital'
),
(
  '{"pt":"Enquire","en":"Enquire"}',
  '{"pt":"Sob Pedido","en":"On Demand"}',
  '[
    {"pt":"Home Staging com IA","en":"AI Home Staging"},
    {"pt":"Construção Avançada com IA","en":"Advanced AI Construction"},
    {"pt":"Moodboard","en":"Moodboard"},
    {"pt":"Renders 3D","en":"3D Renders"},
    {"pt":"Plantas 2D","en":"2D Plans"},
    {"pt":"Brochuras","en":"Brochures"},
    {"pt":"Mais","en":"More"}
  ]',
  false, 4, true, 'digital'
);

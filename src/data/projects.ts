import { PLACEHOLDER_IMAGES } from "@/lib/assets";

type Localized = { pt: string; en: string };

export type Project = {
  slug: string;
  name: Localized;
  location: string;
  year: string;
  services: Localized;
  heroImage: string;
  gallery: [string, string, string, string];
  description: Localized[];
  strategy: Localized;
  whatWeDid: Localized;
  results: { value: string; label: Localized }[];
};

const p = PLACEHOLDER_IMAGES.portfolio;
const g = PLACEHOLDER_IMAGES.gallery;

export const projects: Project[] = [
  {
    slug: "villa-moderna",
    name: { pt: "Villa Moderna", en: "Modern Villa" },
    location: "Cascais",
    year: "2024",
    services: { pt: "Vídeo, Fotografia HDR", en: "Video, HDR Photography" },
    heroImage: p[0],
    gallery: [g[0], g[1], p[2], g[2]],
    description: [
      {
        pt: "Uma villa contemporânea de linhas curvas suspensa sobre um jardim de cactos, com vista para a serra. O desafio: comunicar uma arquitetura pouco convencional sem a tornar fria.",
        en: "A contemporary curved-line villa set above a cactus garden, with hillside views. The challenge: communicate an unconventional architecture without making it feel cold.",
      },
      {
        pt: "Trabalhámos com o agente durante a hora dourada para captar a luz a entrar pelas envidraçadas, e usámos drone para mostrar a relação entre a casa e o terreno em socalcos.",
        en: "We worked with the agent during golden hour to capture the light pouring through the glass walls, and used drone footage to show the relationship between the house and its terraced grounds.",
      },
    ],
    strategy: {
      pt: "Imóveis de arquitetura de autor vendem-se pela experiência, não pela lista de divisões. Construímos uma narrativa visual centrada no percurso — da entrada à piscina — para que quem visse o anúncio sentisse que já tinha caminhado pela casa.",
      en: "Architect-designed properties sell on experience, not room lists. We built a visual narrative centred on the journey — from entrance to pool — so anyone viewing the listing felt like they had already walked through the house.",
    },
    whatWeDid: {
      pt: "Sessão de fotografia HDR de interiores e exteriores, vídeo horizontal cinematográfico de 2 minutos, e imagens de drone para captar a implantação do terreno. Entrega em 48 horas para aproveitar o fim de semana de lançamento.",
      en: "HDR interior and exterior photography, a 2-minute cinematic horizontal video, and drone footage to capture the plot's layout. Delivered within 48 hours to catch the launch weekend.",
    },
    results: [
      { value: "12", label: { pt: "Dias até à primeira proposta", en: "Days to first offer" } },
      { value: "3.4x", label: { pt: "Mais visualizações que a média", en: "More views than average" } },
      { value: "48h", label: { pt: "Da sessão à publicação", en: "From shoot to publish" } },
    ],
  },
  {
    slug: "apartamento-contemporaneo",
    name: { pt: "Apartamento Contemporâneo", en: "Contemporary Apartment" },
    location: "Estoril",
    year: "2024",
    services: { pt: "Fotografia HDR, Drone", en: "HDR Photography, Drone" },
    heroImage: p[1],
    gallery: [p[3], g[3], p[5], g[4]],
    description: [
      {
        pt: "Um T3 renovado de raiz junto à linha de Estoril, vendido a um comprador internacional que nunca visitou o imóvel presencialmente antes da oferta.",
        en: "A fully renovated 3-bedroom apartment near the Estoril coastal line, sold to an international buyer who never viewed the property in person before making an offer.",
      },
      {
        pt: "Com um prazo apertado de duas semanas, priorizámos fotografia de altíssima qualidade sobre vídeo, para garantir que cada imagem funcionava sozinha nos portais internacionais.",
        en: "With a tight two-week deadline, we prioritised very high-quality photography over video, ensuring every image worked on its own across international listing portals.",
      },
    ],
    strategy: {
      pt: "Compradores remotos decidem em segundos. A nossa aposta foi eliminar qualquer ambiguidade visual — luz consistente, linhas verticais corrigidas, e uma sequência de fotos que segue o percurso natural de quem entra em casa.",
      en: "Remote buyers decide in seconds. Our focus was eliminating any visual ambiguity — consistent light, corrected verticals, and a photo sequence that follows the natural path of someone walking into the home.",
    },
    whatWeDid: {
      pt: "32 fotografias HDR de interior e exterior, mais imagens de drone da fachada e da proximidade ao mar. Tratamento de cor uniforme em toda a galeria para reforçar a coerência da marca do agente.",
      en: "32 HDR interior and exterior photographs, plus drone imagery of the façade and proximity to the sea. Uniform colour grading across the gallery to reinforce the agent's brand consistency.",
    },
    results: [
      { value: "9", label: { pt: "Dias até à venda", en: "Days to sale" } },
      { value: "0", label: { pt: "Visitas presenciais antes da oferta", en: "In-person viewings before the offer" } },
      { value: "32", label: { pt: "Fotografias entregues", en: "Photos delivered" } },
    ],
  },
  {
    slug: "quinta-dos-pinheiros",
    name: { pt: "Quinta dos Pinheiros", en: "Pine Tree Estate" },
    location: "Cascais",
    year: "2023",
    services: { pt: "Vídeo Cinematográfico, Drone", en: "Cinematic Video, Drone" },
    heroImage: p[2],
    gallery: [g[1], p[6], g[2], p[0]],
    description: [
      {
        pt: "Uma quinta de 2 hectares com pinhal centenário, piscina natural e casa principal do séc. XIX recuperada — um imóvel que precisava de escala para se fazer entender.",
        en: "A 2-hectare estate with a century-old pine forest, a natural pool, and a restored 19th-century main house — a property that needed scale to be understood.",
      },
      {
        pt: "Nenhuma fotografia isolada conseguia comunicar a dimensão do terreno, por isso o vídeo com drone tornou-se a peça central da campanha, não um extra.",
        en: "No single photograph could communicate the scale of the grounds, so the drone video became the centrepiece of the campaign, not an add-on.",
      },
    ],
    strategy: {
      pt: "Para propriedades de grande dimensão, a proposta de valor está na relação entre os espaços — casa, terreno, piscina, acessos. Estruturámos o vídeo como uma progressão: do portão à vista final sobre o pinhal.",
      en: "For large-scale properties, the value proposition lies in the relationship between spaces — house, land, pool, access. We structured the video as a progression: from the gate to the final view over the pine forest.",
    },
    whatWeDid: {
      pt: "Vídeo cinematográfico horizontal de 3 minutos com drone e captação ao solo, fotografia HDR da casa principal e anexos, e um vídeo vertical de resumo para redes sociais.",
      en: "A 3-minute horizontal cinematic video combining drone and ground footage, HDR photography of the main house and outbuildings, and a vertical highlight video for social media.",
    },
    results: [
      { value: "1.2k+", label: { pt: "Visualizações no primeiro fim de semana", en: "Views in the first weekend" } },
      { value: "6", label: { pt: "Visitas qualificadas geradas", en: "Qualified viewings generated" } },
      { value: "3min", label: { pt: "Vídeo cinematográfico entregue", en: "Cinematic video delivered" } },
    ],
  },
  {
    slug: "villa-contemporanea",
    name: { pt: "Villa Contemporânea", en: "Contemporary Villa" },
    location: "Cascais",
    year: "2023",
    services: { pt: "Fotografia HDR, Home Staging IA", en: "HDR Photography, AI Home Staging" },
    heroImage: p[3],
    gallery: [p[4], g[0], p[7], g[3]],
    description: [
      {
        pt: "Um imóvel novo, ainda sem mobília, à venda antes da conclusão da obra. O objetivo era fazer os compradores visualizarem-se a viver ali, não a olhar para paredes vazias.",
        en: "A brand-new property, still unfurnished, listed for sale before construction was even finished. The goal was to get buyers to picture themselves living there, not staring at empty walls.",
      },
      {
        pt: "Recorremos ao nosso serviço de Home Staging com IA para mobilar digitalmente as divisões principais, mantendo a estrutura e a luz reais captadas em sessão.",
        en: "We used our AI Home Staging service to digitally furnish the main rooms, while keeping the real structure and light captured on set.",
      },
    ],
    strategy: {
      pt: "Espaços vazios geram dúvida, não desejo. Em vez de esperar pela decoração final do proprietário, avançámos com staging virtual para colocar o imóvel no mercado seis semanas mais cedo.",
      en: "Empty spaces create doubt, not desire. Rather than waiting for the owner's final decorating decisions, we moved ahead with virtual staging to bring the listing to market six weeks earlier.",
    },
    whatWeDid: {
      pt: "Fotografia HDR de todas as divisões, mobiladas digitalmente com IA em 5 espaços-chave, e uma versão \"antes/depois\" usada como conteúdo de redes sociais do agente.",
      en: "HDR photography of every room, digitally furnished with AI in 5 key spaces, and a \"before/after\" version used as social content for the agent.",
    },
    results: [
      { value: "6", label: { pt: "Semanas ganhas no lançamento", en: "Weeks gained on launch" } },
      { value: "5", label: { pt: "Divisões com home staging IA", en: "Rooms with AI home staging" } },
      { value: "+58%", label: { pt: "Cliques no anúncio vs. sem staging", en: "Listing clicks vs. no staging" } },
    ],
  },
  {
    slug: "moradia-com-piscina",
    name: { pt: "Moradia com Piscina", en: "Poolside Villa" },
    location: "Estoril",
    year: "2023",
    services: { pt: "Vídeo, Fotografia HDR", en: "Video, HDR Photography" },
    heroImage: p[4],
    gallery: [g[4], p[1], g[1], p[6]],
    description: [
      {
        pt: "Moradia familiar de 4 frentes a poucos minutos da praia, com piscina e jardim orientados a poente — perfeita para uma sessão ao final da tarde.",
        en: "A 4-façade family home minutes from the beach, with a west-facing pool and garden — ideal for a late-afternoon shoot.",
      },
      {
        pt: "Planeámos a sessão em torno do pôr do sol, garantindo que a imagem principal do anúncio captava exatamente a experiência que atraiu os proprietários originais.",
        en: "We planned the shoot around sunset, making sure the listing's lead image captured exactly the experience that attracted the original owners.",
      },
    ],
    strategy: {
      pt: "Para famílias, o critério de decisão raramente é racional — é sentir que os filhos vão ser felizes ali. Priorizámos luz quente, água em movimento e planos que sugerem vida ao ar livre.",
      en: "For families, the deciding factor is rarely rational — it's the feeling that the kids will be happy there. We prioritised warm light, moving water, and shots that suggest outdoor living.",
    },
    whatWeDid: {
      pt: "Sessão fotográfica HDR completa ao final do dia, vídeo horizontal de tour à casa e jardim, e conjunto de imagens verticais otimizadas para partilha em grupos de família no WhatsApp.",
      en: "A full late-afternoon HDR photo session, a horizontal house-and-garden tour video, and a set of vertical images optimised for sharing in family WhatsApp groups.",
    },
    results: [
      { value: "14", label: { pt: "Dias até à venda", en: "Days to sale" } },
      { value: "2", label: { pt: "Propostas em simultâneo", en: "Simultaneous offers" } },
      { value: "24h", label: { pt: "Entrega da galeria completa", en: "Full gallery turnaround" } },
    ],
  },
  {
    slug: "villa-branca",
    name: { pt: "Villa Branca", en: "White Villa" },
    location: "Estoril",
    year: "2022",
    services: { pt: "Fotografia HDR, Drone", en: "HDR Photography, Drone" },
    heroImage: p[5],
    gallery: [p[7], g[2], p[3], g[0]],
    description: [
      {
        pt: "Uma moradia minimalista de fachada branca, com vista de mar parcial — o tipo de imóvel em que o exterior vende antes de se abrir a porta.",
        en: "A minimalist white-façade villa with a partial sea view — the kind of property where the exterior sells before the front door even opens.",
      },
      {
        pt: "Usámos o drone não só para mostrar a vista, mas para revelar a relação entre a casa, a piscina infinita e o horizonte, algo impossível de captar ao nível do solo.",
        en: "We used drone footage not just to show the view, but to reveal the relationship between the house, the infinity pool, and the horizon — something impossible to capture at ground level.",
      },
    ],
    strategy: {
      pt: "Quando a vista é o principal argumento de venda, cada imagem tem de reforçar essa promessa. Organizámos a galeria para que a vista de mar aparecesse logo na segunda fotografia, não escondida a meio do álbum.",
      en: "When the view is the main selling point, every image has to reinforce that promise. We structured the gallery so the sea view appeared as early as the second photo, not buried mid-album.",
    },
    whatWeDid: {
      pt: "Fotografia HDR de exteriores e interiores, imagens aéreas com drone da piscina e vista de mar, e uma foto de capa otimizada especificamente para os portais imobiliários mais usados pelo agente.",
      en: "HDR interior and exterior photography, drone imagery of the pool and sea view, and a cover photo specifically optimised for the property portals the agent uses most.",
    },
    results: [
      { value: "4.1x", label: { pt: "Mais cliques que a média do agente", en: "More clicks than the agent's average" } },
      { value: "19", label: { pt: "Dias até à primeira proposta", en: "Days to first offer" } },
      { value: "18", label: { pt: "Fotografias + drone entregues", en: "Photos + drone shots delivered" } },
    ],
  },
  {
    slug: "villa-panorama",
    name: { pt: "Villa Panorama", en: "Panorama Villa" },
    location: "Estoril",
    year: "2022",
    services: { pt: "Vídeo Cinematográfico", en: "Cinematic Video" },
    heroImage: p[6],
    gallery: [g[3], p[4], g[4], p[2]],
    description: [
      {
        pt: "Situada no ponto mais alto de um condomínio privado, esta villa foi comercializada quase exclusivamente através de vídeo, dado o perfil de comprador internacional e remoto.",
        en: "Set at the highest point of a private condominium, this villa was marketed almost entirely through video, given the international, remote buyer profile.",
      },
      {
        pt: "O agente pediu um único vídeo capaz de substituir uma visita guiada presencial — foi isso que construímos, plano a plano.",
        en: "The agent asked for a single video capable of replacing an in-person guided tour — that's exactly what we built, shot by shot.",
      },
    ],
    strategy: {
      pt: "Sem visita presencial prevista antes da oferta, o vídeo tinha de fazer o trabalho todo: mostrar circulação, escala, luz e vizinhança. Estruturámo-lo como um percurso guiado, com narração implícita no ritmo da câmara.",
      en: "With no in-person viewing planned before the offer, the video had to do all the work: showing flow, scale, light, and neighbourhood. We structured it as a guided walkthrough, with implicit narration in the camera's pacing.",
    },
    whatWeDid: {
      pt: "Vídeo cinematográfico horizontal de 4 minutos com gradação de cor profissional, servindo como principal — e praticamente único — material de venda do imóvel.",
      en: "A 4-minute horizontal cinematic video with professional colour grading, serving as the primary — and practically only — sales material for the property.",
    },
    results: [
      { value: "1", label: { pt: "Visita presencial antes da venda", en: "In-person viewing before the sale" } },
      { value: "22", label: { pt: "Dias até à venda", en: "Days to sale" } },
      { value: "4min", label: { pt: "Vídeo usado como material único", en: "Video used as the sole sales asset" } },
    ],
  },
  {
    slug: "condominio-de-luxo",
    name: { pt: "Condomínio de Luxo", en: "Luxury Development" },
    location: "Cascais",
    year: "2022",
    services: { pt: "Drone e Fotografia Aérea", en: "Drone & Aerial Photography" },
    heroImage: p[7],
    gallery: [p[0], g[1], p[5], g[2]],
    description: [
      {
        pt: "Um novo condomínio de 6 moradias ainda em fase de acabamentos, comercializado por um promotor que precisava de material de vendas antes da entrega da primeira unidade.",
        en: "A new 6-villa development still in the finishing stages, marketed by a developer who needed sales material before the first unit was even handed over.",
      },
      {
        pt: "Sem interiores prontos para fotografar, o foco passou para o exterior, a implantação e a relação com a envolvente — o argumento de venda de um projeto em fase de pré-comercialização.",
        en: "With no finished interiors to photograph, the focus shifted to the exterior, the site layout, and the relationship with the surroundings — the selling proposition for a project in pre-sale.",
      },
    ],
    strategy: {
      pt: "Em pré-comercialização, o comprador está a investir numa promessa. Usámos imagens aéreas para mostrar o conjunto como um todo — algo que nenhuma planta 2D consegue comunicar com a mesma força.",
      en: "In pre-sale, the buyer is investing in a promise. We used aerial imagery to show the development as a whole — something no 2D floor plan can communicate with the same impact.",
    },
    whatWeDid: {
      pt: "Cobertura aérea completa do condomínio com drone, incluindo tomadas de vídeo e still, entregue como pacote de material de vendas para os 6 lotes.",
      en: "Full aerial drone coverage of the development, including both video and still shots, delivered as a sales material package for all 6 units.",
    },
    results: [
      { value: "4", label: { pt: "Das 6 moradias reservadas em pré-venda", en: "Of 6 villas reserved in pre-sale" } },
      { value: "1", label: { pt: "Sessão para todo o condomínio", en: "Single shoot for the whole development" } },
      { value: "6", label: { pt: "Unidades cobertas no mesmo material", en: "Units covered in the same asset package" } },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

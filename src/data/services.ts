type Localized = { pt: string; en: string };

export type ServiceCategory = "media" | "ondemand";

export type ServiceItem = {
  id: string;
  category: ServiceCategory;
  name: Localized;
  desc: Localized;
};

export const services: ServiceItem[] = [
  {
    id: "hdr-photography",
    category: "media",
    name: { pt: "Fotografia HDR", en: "HDR Photography" },
    desc: {
      pt: "Fotografia de interiores e exteriores com precisão e detalhe.",
      en: "Interior and exterior photography with precision and detail.",
    },
  },
  {
    id: "promotional-videos",
    category: "media",
    name: { pt: "Vídeos Promocionais", en: "Promotional Videos" },
    desc: {
      pt: "Vídeos verticais curtos para Reels, TikTok e Facebook.",
      en: "Short vertical videos built for Reels, TikTok and Facebook.",
    },
  },
  {
    id: "cinematic-video",
    category: "media",
    name: { pt: "Vídeo Cinematográfico", en: "Cinematic Video" },
    desc: {
      pt: "Tours horizontais completos com gradação de cor profissional.",
      en: "Full horizontal property tours with professional colour grading.",
    },
  },
  {
    id: "drone-aerial",
    category: "media",
    name: { pt: "Drone e Fotografia Aérea", en: "Drone & Aerial Photography" },
    desc: {
      pt: "Fotografia e vídeo aéreo que revelam o que o solo não consegue.",
      en: "Aerial photo and video that reveal what ground level can't.",
    },
  },
  {
    id: "ai-integration",
    category: "media",
    name: { pt: "Integração de IA", en: "AI Integration" },
    desc: {
      pt: "Home staging e acabamentos fotorrealistas com IA.",
      en: "Photorealistic staging and finishing for empty or unfinished spaces.",
    },
  },
  {
    id: "social-media-management",
    category: "media",
    name: { pt: "Gestão de Redes Sociais", en: "Social Media Management" },
    desc: {
      pt: "Estratégia, publicação e agendamento de conteúdo imobiliário.",
      en: "Strategy, posting and scheduling for your property content.",
    },
  },
  {
    id: "ai-home-staging",
    category: "ondemand",
    name: { pt: "Home Staging com IA", en: "AI Home Staging" },
    desc: {
      pt: "Mobilar digitalmente espaços vazios com IA fotorrealista.",
      en: "Digitally furnish empty rooms with photorealistic AI staging.",
    },
  },
  {
    id: "advanced-ai-construction",
    category: "ondemand",
    name: { pt: "Construção Avançada com IA", en: "Advanced AI Construction" },
    desc: {
      pt: "Visualizações fotorrealistas para imóveis ainda em construção.",
      en: "Photorealistic visualisations for properties still under construction.",
    },
  },
  {
    id: "moodboard",
    category: "ondemand",
    name: { pt: "Moodboard", en: "Moodboard" },
    desc: {
      pt: "Um painel visual com a direção criativa do imóvel ou marca.",
      en: "A curated visual direction board for your property or brand.",
    },
  },
  {
    id: "3d-renders",
    category: "ondemand",
    name: { pt: "Renders 3D", en: "3D Renders" },
    desc: {
      pt: "Renders 3D completos de interiores, exteriores e plantas.",
      en: "Full 3D renders of interiors, exteriors and floor plans.",
    },
  },
  {
    id: "2d-plans",
    category: "ondemand",
    name: { pt: "Plantas 2D", en: "2D Plans" },
    desc: {
      pt: "Plantas 2D precisas para anúncios e brochuras.",
      en: "Clean, accurate 2D floor plans for listings and brochures.",
    },
  },
  {
    id: "brochures",
    category: "ondemand",
    name: { pt: "Brochuras", en: "Brochures" },
    desc: {
      pt: "Brochuras premium, digitais ou impressas, para os seus imóveis.",
      en: "Premium printed or digital brochures for your listings.",
    },
  },
];

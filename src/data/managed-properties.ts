import { PLACEHOLDER_IMAGES } from "@/lib/assets";

type Localized = { pt: string; en: string };

export type ManagedProperty = {
  slug: string;
  name: Localized;
  location: string;
  tags: Localized[];
  heroImage: string;
  gallery: [string, string, string, string];
  description: Localized[];
  amenities: Localized[];
};

const p = PLACEHOLDER_IMAGES.portfolio;
const g = PLACEHOLDER_IMAGES.gallery;

export const managedProperties: ManagedProperty[] = [
  {
    slug: "villa-moderna",
    name: { pt: "Villa Moderna", en: "Modern Villa" },
    location: "Cascais",
    tags: [
      { pt: "4 quartos", en: "4 bedrooms" },
      { pt: "Piscina", en: "Pool" },
      { pt: "Jardim", en: "Garden" },
    ],
    heroImage: p[0],
    gallery: [g[0], g[1], p[2], g[2]],
    description: [
      {
        pt: "Villa contemporânea de 4 quartos com piscina e jardim privado, gerida pela Pixel & Property Management desde 2023. Localizada numa das zonas mais procuradas de Cascais.",
        en: "A contemporary 4-bedroom villa with a private pool and garden, managed by Pixel & Property Management since 2023. Located in one of Cascais's most sought-after areas.",
      },
      {
        pt: "O proprietário reside no estrangeiro e acompanha a gestão do imóvel à distância através do nosso sistema de reporte digital, com relatórios mensais detalhados.",
        en: "The owner lives abroad and follows the property's management remotely through our digital reporting system, with detailed monthly reports.",
      },
    ],
    amenities: [
      { pt: "4 quartos, 3 casas de banho", en: "4 bedrooms, 3 bathrooms" },
      { pt: "Piscina privada", en: "Private pool" },
      { pt: "Jardim paisagístico", en: "Landscaped garden" },
      { pt: "Estacionamento para 2 viaturas", en: "Parking for 2 cars" },
    ],
  },
  {
    slug: "apartamento-contemporaneo",
    name: { pt: "Apartamento Contemporâneo", en: "Contemporary Apartment" },
    location: "Estoril",
    tags: [
      { pt: "3 quartos", en: "3 bedrooms" },
      { pt: "Vista mar", en: "Sea view" },
      { pt: "Garagem", en: "Garage" },
    ],
    heroImage: p[1],
    gallery: [p[3], g[3], p[5], g[4]],
    description: [
      {
        pt: "T3 renovado com vista mar, junto à linha de Estoril. Sob gestão completa da Pixel & Property Management, incluindo seleção de inquilinos e manutenção.",
        en: "A renovated 3-bedroom apartment with sea views, near the Estoril coastal line. Under full management by Pixel & Property Management, including tenant selection and maintenance.",
      },
      {
        pt: "Arrendado a um inquilino de longa duração desde 2023, com renovação automática e reporte financeiro mensal ao proprietário.",
        en: "Leased to a long-term tenant since 2023, with automatic renewal and monthly financial reporting to the owner.",
      },
    ],
    amenities: [
      { pt: "3 quartos, 2 casas de banho", en: "3 bedrooms, 2 bathrooms" },
      { pt: "Vista mar", en: "Sea view" },
      { pt: "Garagem privada", en: "Private garage" },
      { pt: "Varanda ampla", en: "Spacious balcony" },
    ],
  },
  {
    slug: "quinta-dos-pinheiros",
    name: { pt: "Quinta dos Pinheiros", en: "Pine Tree Estate" },
    location: "Cascais",
    tags: [
      { pt: "5 quartos", en: "5 bedrooms" },
      { pt: "Piscina", en: "Pool" },
      { pt: "1.200m²", en: "1,200m²" },
    ],
    heroImage: p[2],
    gallery: [g[1], p[6], g[2], p[0]],
    description: [
      {
        pt: "Propriedade de 1.200m² com pinhal centenário e piscina natural, gerida como arrendamento sazonal de longa duração para proprietários internacionais.",
        en: "A 1,200m² property with a century-old pine forest and natural pool, managed as long-term seasonal rental for international owners.",
      },
      {
        pt: "A gestão inclui manutenção do jardim e piscina, segurança e um plano de ocupação otimizado para maximizar o rendimento ao longo do ano.",
        en: "Management includes garden and pool maintenance, security, and an occupancy plan optimised to maximise returns throughout the year.",
      },
    ],
    amenities: [
      { pt: "5 quartos, 4 casas de banho", en: "5 bedrooms, 4 bathrooms" },
      { pt: "Piscina natural", en: "Natural pool" },
      { pt: "1.200m² de terreno", en: "1,200m² of grounds" },
      { pt: "Manutenção de jardim incluída", en: "Garden maintenance included" },
    ],
  },
  {
    slug: "condominio-de-luxo",
    name: { pt: "Condomínio de Luxo", en: "Luxury Development" },
    location: "Cascais",
    tags: [
      { pt: "Condomínio", en: "Development" },
      { pt: "Segurança 24h", en: "24h Security" },
      { pt: "Ginásio", en: "Gym" },
    ],
    heroImage: p[7],
    gallery: [p[0], g[1], p[5], g[2]],
    description: [
      {
        pt: "Condomínio fechado de 6 moradias com segurança 24 horas e ginásio comum. Gerimos 4 das 6 unidades em nome de diferentes proprietários.",
        en: "A gated development of 6 villas with 24-hour security and a shared gym. We manage 4 of the 6 units on behalf of different owners.",
      },
      {
        pt: "A gestão partilhada de várias unidades no mesmo condomínio permite-nos negociar melhores condições de manutenção e segurança para todos os proprietários.",
        en: "Managing several units within the same development lets us negotiate better maintenance and security terms for all owners involved.",
      },
    ],
    amenities: [
      { pt: "Condomínio fechado", en: "Gated development" },
      { pt: "Segurança 24 horas", en: "24-hour security" },
      { pt: "Ginásio comum", en: "Shared gym" },
      { pt: "Manutenção de áreas comuns incluída", en: "Common area maintenance included" },
    ],
  },
];

export function getManagedProperty(slug: string) {
  return managedProperties.find((property) => property.slug === slug);
}

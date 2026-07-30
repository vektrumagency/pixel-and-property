export const LEGACY_ASSETS = "https://pixelandproperty.netlify.app";

export function legacyAsset(path: string) {
  return `${LEGACY_ASSETS}/${path}`;
}

/**
 * Placeholder real estate photography (Unsplash) until the client provides
 * real shoot assets. The original HTML/live site's image paths are broken
 * (Netlify serves its SPA fallback instead of the actual files), so these
 * stand in for now — swap for Cloudinary-hosted real assets later.
 */
export function unsplash(id: string, params = "w=1600&q=80&auto=format&fit=crop") {
  return `https://images.unsplash.com/photo-${id}?${params}`;
}

/**
 * Placeholder hero video (Pexels, royalty-free) — swap for a real Pixel &
 * Property shoot (ideally Cloudinary-hosted, transcoded/compressed) later.
 */
export const PLACEHOLDER_HERO_VIDEO =
  "https://videos.pexels.com/video-files/4407791/4407791-uhd_2732_1440_25fps.mp4";

export const PLACEHOLDER_IMAGES = {
  homeHero: "1613977257592-4871e5fcd7c4",
  digitalHero: "1728049006379-f1f2c3dbb910",
  about: "1642976975710-1d8890dbf5ab",
  portfolio: [
    "1622015663319-e97e697503ee",
    "1533044309907-0fa3413da946",
    "1685514823717-7e1ff6ee0563",
    "1670589953882-b94c9cb380f5",
    "1669123547602-b85454d7ee84",
    "1602343168117-bb8ffe3e2e9f",
    "1616012760010-8da02da071fd",
    "1711110065918-388182f86e00",
  ],
  gallery: [
    "1766848834872-fa8158c94a5d",
    "1757439402359-aed14d39fc1b",
    "1551524164-6bb6236c70fb",
    "1762117360890-5eacdbb07b04",
    "1783935936220-ab15c75dc94f",
  ],
};

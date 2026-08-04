import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { projects } from "@/data/projects";
import { managedProperties } from "@/data/managed-properties";

function localizedUrls(path: string) {
  const clean = path === "/" ? "" : path;
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, absoluteUrl(`/${locale}${clean}`)]),
  );
}

function entriesFor(
  path: string,
  priority: number,
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
): MetadataRoute.Sitemap {
  const languages = localizedUrls(path);
  return routing.locales.map((locale) => ({
    url: languages[locale],
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entriesFor("/", 1, "monthly"),
    ...entriesFor("/digital", 0.8, "monthly"),
    ...entriesFor("/management", 0.8, "monthly"),
    ...entriesFor("/contact", 0.6, "yearly"),
    ...projects.flatMap((project) => entriesFor(`/digital/${project.slug}`, 0.7, "monthly")),
    ...managedProperties.flatMap((property) =>
      entriesFor(`/management/${property.slug}`, 0.7, "monthly"),
    ),
  ];
}

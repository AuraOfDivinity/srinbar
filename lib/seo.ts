import type { Metadata } from "next";

export const SITE_NAME = "SRINBAR";
export const ORGANISATION_NAME = "Lanka Network for Bamboo and Rattan";
export const HOME_TITLE = "SRINBAR — Bamboo & Rattan Network in Sri Lanka";
export const SITE_DESCRIPTION = "Discover SRINBAR, Sri Lanka’s bamboo and rattan network. Explore land restoration, sustainable livelihoods, research, events and membership.";

const configuredUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://srinbar.com");
if (!["http:", "https:"].includes(configuredUrl.protocol)) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTP(S) URL.");
}
export const SITE_URL = configuredUrl.origin;
export const INDEXABLE = process.env.SITE_NOINDEX !== "true" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function metaDescription(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 160) return cleaned;
  const excerpt = cleaned.slice(0, 157);
  const boundary = excerpt.lastIndexOf(" ");
  return `${excerpt.slice(0, boundary > 100 ? boundary : 157).trimEnd()}…`;
}

export function socialImage(title: string) {
  return absoluteUrl(`/opengraph-image?title=${encodeURIComponent(title.slice(0, 140))}`);
}

export function pageMetadata({ title, description, path, image, article }: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string; width?: number; height?: number };
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[]; section?: string; tags?: string[] };
}): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const summary = metaDescription(description);
  const shareImage = image ? { ...image, url: absoluteUrl(image.url) } : {
    url: socialImage(title), width: 1200, height: 630, alt: `${title} — ${ORGANISATION_NAME}`,
  };
  return {
    title: { absolute: fullTitle },
    description: summary,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: fullTitle, description: summary, url: absoluteUrl(path),
      siteName: SITE_NAME, locale: "en_LK", images: [shareImage],
      ...(article ? { type: "article" as const, ...article } : { type: "website" as const }),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: summary, images: [shareImage] },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path),
    })),
  };
}

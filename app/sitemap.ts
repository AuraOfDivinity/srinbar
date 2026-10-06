import type { MetadataRoute } from "next";
import { client, fetchOptions } from "@/sanity/client";
import { BLOG_ENABLED } from "@/lib/features";
import { absoluteUrl, INDEXABLE } from "@/lib/seo";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!INDEXABLE) return [];
  // Do not silently publish a partial sitemap when the CMS is unavailable.
  const entries = await client.withConfig({ useCdn: false }).fetch<{
    _type: "post" | "event"; slug: string; _updatedAt: string;
  }[]>(`*[( _type == "event" || ($blogEnabled && _type == "post")) && archived != true && defined(slug.current)]{
    _type, "slug": slug.current, _updatedAt
  }`, { blogEnabled: BLOG_ENABLED }, fetchOptions);
  return [
    ...["/", "/about", "/events", "/contact", ...(BLOG_ENABLED ? ["/blog"] : [])].map(path => ({ url: absoluteUrl(path) })),
    ...entries.map(entry => ({
      url: absoluteUrl(`/${entry._type === "post" ? "blog" : "events"}/${encodeURIComponent(entry.slug)}`),
      lastModified: entry._updatedAt,
    })),
  ];
}

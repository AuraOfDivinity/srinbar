import type { MetadataRoute } from "next";
import { absoluteUrl, INDEXABLE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Let crawlers read the studio's noindex directive; robots.txt is not access control.
    rules: { userAgent: "*", ...(INDEXABLE ? { allow: "/", disallow: ["/api/"] } : { disallow: "/" }) },
    ...(INDEXABLE ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}

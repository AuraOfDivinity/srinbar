export const metadata = { robots: { index: false, follow: false } };

import { BLOG_ENABLED } from "@/lib/features";
import { notFound, permanentRedirect } from "next/navigation";

// The static /article page has been replaced by Sanity-backed /blog/[slug] routes.
export default function ArticleRedirect() {
  if (!BLOG_ENABLED) notFound();
  permanentRedirect("/blog");
}

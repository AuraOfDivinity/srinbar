import { BLOG_ENABLED } from "@/lib/features";
import { notFound, redirect } from "next/navigation";

// The static /article page has been replaced by Sanity-backed /blog/[slug] routes.
export default function ArticleRedirect() {
  if (!BLOG_ENABLED) notFound();
  redirect("/blog");
}

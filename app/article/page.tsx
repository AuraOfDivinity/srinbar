import { redirect } from "next/navigation";

// The static /article page has been replaced by Sanity-backed /blog/[slug] routes.
export default function ArticleRedirect() {
  redirect("/blog");
}

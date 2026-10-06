import { BLOG_ENABLED } from "@/lib/features";
import { notFound } from "next/navigation";
import { pageMetadata, breadcrumbs } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlogIndex from "./BlogIndex";
import { client, fetchOptions } from "@/sanity/client";
import {
  BLOG_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  POSTS_QUERY,
  FEATURED_POST_QUERY,
  CATEGORIES_QUERY,
} from "@/sanity/queries";
import type {
  BlogPageDoc,
  SiteSettings,
  PostCard,
  FeaturedPost,
  Category,
} from "@/sanity/types";

export const revalidate = 60;

export const metadata = BLOG_ENABLED ? pageMetadata({
  title: "Bamboo & Rattan Field Notes", path: "/blog",
  description: "Read SRINBAR field notes on bamboo and rattan in Sri Lanka, from restoration sites and workshops to research and sustainable livelihoods.",
}) : { robots: { index: false, follow: false } };

export default async function BlogPageRoute() {
  if (!BLOG_ENABLED) notFound();
  const [page, settings, posts, featured, categories] = await Promise.all([
    client.fetch<BlogPageDoc>(BLOG_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
    client.fetch<PostCard[]>(POSTS_QUERY, {}, fetchOptions),
    client.fetch<FeaturedPost | null>(FEATURED_POST_QUERY, {}, fetchOptions),
    client.fetch<Category[]>(CATEGORIES_QUERY, {}, fetchOptions),
  ]);

  return (
    <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <JsonLd data={breadcrumbs([{ name: "Blog", path: "/blog" }])} />
      <SiteNav active="Blog" />
      <BlogIndex
        page={page}
        posts={posts ?? []}
        featured={featured}
        categories={categories ?? []}
      />
      <SiteFooter settings={settings} />
    </div>
  );
}

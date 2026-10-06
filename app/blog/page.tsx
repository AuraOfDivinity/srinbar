import { BLOG_ENABLED } from "@/lib/features";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

export const metadata: Metadata = BLOG_ENABLED ? {
  title: "Blog — SRINBAR",
  description:
    "Field notes & updates from restoration sites, workshops, and the entrepreneurs of the bamboo & rattan value chain.",
} : {};

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

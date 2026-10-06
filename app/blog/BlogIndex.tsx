"use client";

import { Link } from "next-view-transitions";
import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import { urlFor } from "@/sanity/client";
import { formatDate } from "@/lib/format";
import type {
  BlogPageDoc,
  PostCard,
  FeaturedPost,
  Category,
} from "@/sanity/types";

type BlogIndexProps = {
  page: BlogPageDoc | null;
  posts: PostCard[];
  featured: FeaturedPost | null;
  categories: Category[];
};

export default function BlogIndex({
  page,
  posts,
  featured,
  categories,
}: BlogIndexProps) {
  const [category, setCategory] = useState("All");

  const categoryNames = ["All", ...categories.map((c) => c.title)];
  const showFeatured = category === "All" && !!featured;
  const nonFeatured = posts.filter((p) => p._id !== featured?._id);
  const filtered =
    category === "All"
      ? nonFeatured
      : posts.filter((p) => p.category === category);

  return (
    <>
      <section
        aria-label="Blog header"
        style={{ padding: "clamp(48px, 6vw, 80px) clamp(20px, 4vw, 32px) 0" }}
      >
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
            {page?.eyebrow}
          </p>
          <h1
            style={{
              font: "var(--type-h1)",
              fontSize: "clamp(34px, 4.5vw, 48px)",
              color: "var(--text-body)",
              marginBottom: "var(--space-4)",
            }}
          >
            {page?.heading}
          </h1>
          <p
            style={{
              font: "var(--type-body-lg)",
              color: "var(--text-muted)",
              maxWidth: 560,
              marginBottom: "var(--space-6)",
              textWrap: "pretty",
            }}
          >
            {page?.intro}
          </p>
          <div
            role="group"
            aria-label="Filter posts by category"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
              marginBottom: "clamp(32px, 4vw, 48px)",
            }}
          >
            {categoryNames.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                aria-pressed={name === category}
                className="filter-pill"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {showFeatured && featured && (
        <section
          aria-label="Featured post"
          style={{ padding: "0 clamp(20px, 4vw, 32px) clamp(40px, 5vw, 64px)" }}
        >
          <div
            style={{
              maxWidth: "var(--container-max)",
              margin: "0 auto",
              background: "var(--surface-card)",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
              alignItems: "stretch",
            }}
          >
            <Link
              href={`/blog/${featured.slug}`}
              tabIndex={-1}
              aria-hidden="true"
              style={{ display: "block", minHeight: 280 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlFor(featured.mainImage.asset).width(1200).url()}
                alt={featured.mainImage.alt}
                className="img-dim"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Link>
            <div
              style={{
                padding: "clamp(24px, 4vw, 48px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "var(--space-3)",
              }}
            >
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <span className="chip chip--featured">Featured</span>
                <span className="chip">{featured.category}</span>
              </div>
              <h2
                style={{
                  font: "var(--type-h2)",
                  fontSize: "clamp(24px, 2.5vw, 36px)",
                  textWrap: "balance",
                }}
              >
                <Link
                  href={`/blog/${featured.slug}`}
                  className="title-link title-link--lg"
                >
                  {featured.title}
                </Link>
              </h2>
              <p
                style={{
                  font: "var(--type-body)",
                  color: "var(--text-muted)",
                  maxWidth: 480,
                  textWrap: "pretty",
                }}
              >
                {featured.excerpt}
              </p>
              <p style={{ font: "var(--type-caption)", color: "var(--text-muted)" }}>
                {[featured.author?.name, formatDate(featured.publishedAt)]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <Link
                href={`/blog/${featured.slug}`}
                className="arrow-link"
                style={{ marginTop: "var(--space-2)", marginLeft: -6 }}
              >
                Read the article →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section
        aria-label="All posts"
        style={{ padding: "0 clamp(20px, 4vw, 32px) clamp(64px, 8vw, 96px)" }}
      >
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          {filtered.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(270px, 100%), 1fr))",
                gap: "var(--space-6) var(--space-6)",
              }}
            >
              {filtered.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div
              role="status"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-hairline)",
                borderRadius: "var(--radius-lg)",
                padding: "clamp(48px, 6vw, 80px) var(--space-6)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "var(--space-3)",
              }}
            >
              <h2
                style={{
                  font: "var(--type-h3)",
                  fontSize: "var(--text-xl)",
                  color: "var(--text-body)",
                }}
              >
                {page?.emptyStateHeading ?? "No posts in this category yet"}
              </h2>
              <p
                style={{
                  font: "var(--type-body)",
                  color: "var(--text-muted)",
                  maxWidth: 440,
                  textWrap: "pretty",
                }}
              >
                {page?.emptyStateBody}
              </p>
              <button
                type="button"
                onClick={() => setCategory("All")}
                className="btn btn--outline"
                style={{
                  marginTop: "var(--space-2)",
                  padding: "11px 24px",
                  fontSize: "var(--text-sm)",
                }}
              >
                View all posts
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

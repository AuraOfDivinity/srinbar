import { Link } from "next-view-transitions";
import { urlFor } from "@/sanity/client";
import { formatDate } from "@/lib/format";
import type { PostCard } from "@/sanity/types";

export default function BlogCard({ post }: { post: PostCard }) {
  const href = `/blog/${post.slug}`;
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans-body)",
      }}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          display: "block",
          aspectRatio: "4 / 3",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          marginBottom: "var(--space-4)",
          background: "var(--hairline-green)",
          outline: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlFor(post.mainImage.asset).width(800).height(600).url()}
          alt={post.mainImage.alt}
          className="img-dim"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Link>
      <span className="chip">{post.category}</span>
      <h3
        style={{
          font: "var(--type-h3)",
          fontSize: "var(--text-lg)",
          margin: "var(--space-3) 0 var(--space-2)",
        }}
      >
        <Link href={href} className="title-link">
          {post.title}
        </Link>
      </h3>
      <p
        style={{
          font: "var(--type-body)",
          color: "var(--text-muted)",
          marginBottom: "var(--space-3)",
        }}
      >
        {post.excerpt}
      </p>
      <span style={{ font: "var(--type-caption)", color: "var(--text-muted)" }}>
        {formatDate(post.publishedAt)}
      </span>
    </article>
  );
}

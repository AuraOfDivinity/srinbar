import { pageMetadata, breadcrumbs, absoluteUrl, ORGANISATION_NAME } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { BLOG_ENABLED } from "@/lib/features";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { PortableText, type PortableTextComponents } from "next-sanity";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlogCard from "@/components/BlogCard";
import { client, urlFor, fetchOptions } from "@/sanity/client";
import {
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/queries";
import { formatDate } from "@/lib/format";
import type { Post, SiteSettings } from "@/sanity/types";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  if (!BLOG_ENABLED) return [];
  const slugs = await client.fetch<string[]>(POST_SLUGS_QUERY);
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!BLOG_ENABLED) notFound();
  const { slug } = await params;
  const post = await client.fetch<Post | null>(
    POST_BY_SLUG_QUERY,
    { slug },
    fetchOptions,
  );
  if (!post) notFound();
  return pageMetadata({
    title: post.title, description: post.excerpt || post.title, path: `/blog/${encodeURIComponent(post.slug)}`,
    image: post.mainImage?.asset ? {
      url: urlFor(post.mainImage.asset).width(1200).height(630).fit("crop").url(),
      alt: post.mainImage.alt || post.title, width: 1200, height: 630,
    } : undefined,
    article: { publishedTime: post.publishedAt, modifiedTime: post._updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined, section: post.category, tags: post.tags },
  });
}

const bodyText: React.CSSProperties = {
  font: "var(--type-body)",
  color: "var(--text-body)",
  textWrap: "pretty",
};

const h2Style: React.CSSProperties = {
  font: "var(--type-h2)",
  fontSize: "clamp(26px, 3vw, 36px)",
  color: "var(--text-body)",
  marginTop: "var(--space-4)",
};

const captionStyle: React.CSSProperties = {
  font: "var(--type-caption)",
  color: "var(--text-muted)",
  marginTop: "var(--space-3)",
  fontFamily: "var(--font-sans-body)",
};

const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p style={bodyText}>{children}</p>,
    lead: ({ children }) => (
      <p
        style={{
          font: "var(--type-body-lg)",
          color: "var(--text-body)",
          textWrap: "pretty",
        }}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => <h2 style={h2Style}>{children}</h2>,
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: "3px solid var(--rattan-gold)",
          padding: "var(--space-2) 0 var(--space-2) var(--space-5)",
          margin: "var(--space-3) 0",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif-display)",
            fontSize: "clamp(20px, 2.2vw, 26px)",
            lineHeight: 1.4,
            color: "var(--forest-green)",
            textWrap: "pretty",
          }}
        >
          {children}
        </p>
      </blockquote>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure style={{ margin: "var(--space-3) 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlFor(value.asset).width(1600).url()}
          alt={value.alt ?? ""}
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            objectFit: "cover",
            borderRadius: "var(--radius-md)",
          }}
        />
        {value.caption && (
          <figcaption style={captionStyle}>{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
};

export default async function ArticlePage({ params }: Props) {
  if (!BLOG_ENABLED) notFound();
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    client.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug }, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
  ]);
  if (!post) notFound();

  return (
    <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <JsonLd data={[
        breadcrumbs([{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${encodeURIComponent(post.slug)}` }]),
        { "@context": "https://schema.org", "@type": "BlogPosting",
          headline: post.title, description: post.excerpt,
          mainEntityOfPage: absoluteUrl(`/blog/${encodeURIComponent(post.slug)}`),
          datePublished: post.publishedAt, dateModified: post._updatedAt,
          image: post.mainImage?.url ? [post.mainImage.url] : undefined,
          author: post.author?.name ? { "@type": "Person", name: post.author.name } : undefined,
          publisher: { "@type": "Organization", "@id": absoluteUrl("/#organization"),
            name: ORGANISATION_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/srinbar-full.png") } },
          inLanguage: "en-LK",
        },
      ]} />
      <SiteNav active="Blog" />

      <article>
        <header
          style={{ padding: "clamp(48px, 6vw, 80px) clamp(20px, 4vw, 32px) 0" }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <Link href="/blog" className="arrow-link" style={{ marginLeft: -6 }}>
              ← All posts
            </Link>
            <div style={{ margin: "var(--space-5) 0 var(--space-4)" }}>
              <span className="chip">{post.category}</span>
            </div>
            <h1
              style={{
                font: "var(--type-h1)",
                fontSize: "clamp(32px, 4.5vw, 48px)",
                color: "var(--text-body)",
                marginBottom: "var(--space-4)",
                textWrap: "balance",
              }}
            >
              {post.title}
            </h1>
            <p
              style={{
                font: "var(--type-caption)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-sans-body)",
              }}
            >
              {post.author && (
                <>
                  By{" "}
                  <span
                    style={{
                      color: "var(--text-body)",
                      fontWeight:
                        "var(--weight-semibold)" as React.CSSProperties["fontWeight"],
                    }}
                  >
                    {post.author.name}
                  </span>{" "}
                  ·{" "}
                </>
              )}
              {formatDate(post.publishedAt)}
              {post.readTime ? ` · ${post.readTime}` : null}
            </p>
          </div>
        </header>

        <div style={{ padding: "clamp(32px, 4vw, 48px) clamp(20px, 4vw, 32px) 0" }}>
          <figure style={{ maxWidth: 980, margin: "0 auto" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(post.mainImage.asset).width(2000).url()}
              alt={post.mainImage.alt}
              style={{
                width: "100%",
                aspectRatio: "21 / 9",
                objectFit: "cover",
                borderRadius: "var(--radius-md)",
              }}
            />
            {post.mainImageCaption && (
              <figcaption style={captionStyle}>{post.mainImageCaption}</figcaption>
            )}
          </figure>
        </div>

        <div style={{ padding: "clamp(40px, 5vw, 64px) clamp(20px, 4vw, 32px) 0" }}>
          <div
            style={{
              maxWidth: "68ch",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}
          >
            {post.body && (
              <PortableText value={post.body} components={portableComponents} />
            )}
          </div>
        </div>

        <div style={{ padding: "clamp(40px, 5vw, 64px) clamp(20px, 4vw, 32px) 0" }}>
          <div style={{ maxWidth: "68ch", margin: "0 auto" }}>
            {!!post.tags?.length && (
              <div
                aria-label="Tags"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                  paddingBottom: "var(--space-6)",
                  borderBottom: "1px solid var(--border-hairline)",
                }}
              >
                {post.tags.map((tag) => (
                  <Link key={tag} href="/blog" className="chip">
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            {post.author && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                  padding: "var(--space-6) 0",
                }}
              >
                {post.author.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(post.author.image.asset).width(128).height(128).url()}
                    alt={post.author.image.alt}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "var(--radius-pill)",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div>
                  <p
                    style={{
                      font: "var(--type-h3)",
                      fontSize: "var(--text-md)",
                      fontFamily: "var(--font-serif-display)",
                      color: "var(--text-body)",
                    }}
                  >
                    {post.author.name}
                  </p>
                  <p
                    style={{
                      font: "var(--type-caption)",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-sans-body)",
                      textWrap: "pretty",
                    }}
                  >
                    {post.author.bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {!!post.related?.length && (
          <section
            aria-label="Related posts"
            style={{
              padding:
                "clamp(40px, 5vw, 64px) clamp(20px, 4vw, 32px) clamp(64px, 8vw, 96px)",
            }}
          >
            <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
              <h2
                style={{
                  font: "var(--type-h2)",
                  fontSize: "clamp(28px, 3vw, 36px)",
                  color: "var(--text-body)",
                  marginBottom: "var(--space-6)",
                }}
              >
                Related reading
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(270px, 100%), 1fr))",
                  gap: "var(--space-6)",
                }}
              >
                {post.related.map((related) => (
                  <BlogCard key={related._id} post={related} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <SiteFooter settings={settings} />
    </div>
  );
}

import { pageMetadata, absoluteUrl, HOME_TITLE, SITE_DESCRIPTION, SITE_NAME, ORGANISATION_NAME } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { BLOG_ENABLED } from "@/lib/features";
import { Link } from "next-view-transitions";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlogCard from "@/components/BlogCard";
import ProgrammeDescription from "@/components/ProgrammeDescription";
import EventCard from "@/components/EventCard";
import { client, urlFor, fetchOptions } from "@/sanity/client";
import {
  HOME_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  LATEST_POSTS_QUERY,
} from "@/sanity/queries";
import { getEvents, sortEvents } from "@/lib/events";
import type {
  HomePage,
  SiteSettings,
  PostCard,
} from "@/sanity/types";

const fixHomepageCopy = (text?: string) => text?.replace(/\bLankaa\b/gi, "Lanka");

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions);
  return pageMetadata({ title: HOME_TITLE, description: settings?.seoDescription || SITE_DESCRIPTION, path: "/" });
}

export default async function HomePage() {
  const [home, settings, posts, events] = await Promise.all([
    client.fetch<HomePage>(HOME_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
    BLOG_ENABLED ? client.fetch<PostCard[]>(LATEST_POSTS_QUERY, {}, fetchOptions) : Promise.resolve([]),
    getEvents(),
  ]);

  const { upcoming, past } = sortEvents(events);
  const displayedEvents = [...upcoming, ...past];
  const programmes = home?.programmes ?? [];
  const heroWidths = [640, 960, 1280, 1600, 1920];
  const heroImageSrcSet = home?.heroImage
    ? heroWidths.map((width) => `${urlFor(home.heroImage.asset).width(width).quality(76).url()} ${width}w`).join(", ")
    : undefined;
  const heroImageSrc = home?.heroImage ? urlFor(home.heroImage.asset).width(1920).quality(76).url() : undefined;

  return (
    <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Organization", "@id": absoluteUrl("/#organization"), name: settings?.organisationName || ORGANISATION_NAME,
            alternateName: SITE_NAME, url: absoluteUrl(), logo: absoluteUrl("/brand/srinbar-full.webp"),
            description: settings?.footerBlurb || SITE_DESCRIPTION },
          { "@type": "WebSite", "@id": absoluteUrl("/#website"), name: SITE_NAME,
            alternateName: settings?.organisationName || ORGANISATION_NAME, url: absoluteUrl(),
            inLanguage: "en-LK", publisher: { "@id": absoluteUrl("/#organization") } },
        ],
      }} />
      <SiteNav active="Home" overlay position="fixed" />

      <main>
      {heroImageSrc && heroImageSrcSet && (
        <link rel="preload" as="image" href={heroImageSrc} imageSrcSet={heroImageSrcSet} imageSizes="100vw" fetchPriority="high" />
      )}
      <section
        className="home-hero"
        aria-label="Introduction"
        style={{
          position: "relative",
          minHeight: "clamp(560px, 88svh, 720px)",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {home?.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImageSrc}
            alt={home.heroImage.alt || "Bamboo restoration in Sri Lanka"}
            loading="eager"
            fetchPriority="high"
            srcSet={heroImageSrcSet}
            sizes="100vw"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(20, 41, 31, 0.25) 0%, rgba(20, 41, 31, 0.78) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "120px clamp(20px, 4vw, 32px) clamp(40px, 8svh, 96px)",
            width: "100%",
          }}
        >
          <p className="eyebrow" style={{ marginBottom: "var(--space-4)" }}>
            {fixHomepageCopy(home?.heroEyebrow)}
          </p>
          <h1
            style={{
              font: "var(--type-hero)",
              fontSize: "clamp(32px, 5vw, 64px)",
              color: "var(--text-on-brand)",
              maxWidth: 820,
              marginBottom: "var(--space-4)",
              textWrap: "balance",
            }}
          >
            Building Sri Lanka’s Bamboo Future
          </h1>
          <p
            style={{
              font: "var(--type-body-lg)",
              color: "var(--text-on-brand-muted)",
              maxWidth: 560,
              marginBottom: "var(--space-6)",
              textWrap: "pretty",
            }}
          >
            Connecting knowledge, people and industry to build a thriving bamboo and rattan sector in Sri Lanka.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            {home?.heroPrimaryCta && (
              <Link
                href={home.heroPrimaryCta.href}
                className="btn btn--accent btn--lg"
              >
                {fixHomepageCopy(home.heroPrimaryCta.label)}
              </Link>
            )}
            <Link href="/events" className="btn btn--ghost btn--lg">
              Events
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-label="About Us"
        style={{ padding: "clamp(64px, 8vw, 96px) clamp(20px, 4vw, 32px) 0" }}
      >
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <h2
            style={{
              font: "var(--type-h1)",
              fontSize: "clamp(32px, 4vw, 48px)",
              color: "var(--text-body)",
              marginBottom: "var(--space-4)",
            }}
          >
            About Us
          </h2>
          <p
            style={{
              font: "var(--type-body-lg)",
              color: "var(--text-muted)",
              maxWidth: 900,
              textWrap: "pretty",
            }}
          >
            SRINBAR is Sri Lanka’s network for advancing bamboo and rattan as sustainable, versatile resources. We bring together researchers, professionals, industry, government and communities to share knowledge, encourage innovation and create opportunities across cultivation, design, construction, enterprise and beyond. By connecting ideas, expertise and action, SRINBAR works towards a stronger and more sustainable bamboo and rattan sector in Sri Lanka.
          </p>
        </div>
      </section>

      <section
        id="programmes"
        aria-label="What we do"
        style={{ padding: "clamp(64px, 8vw, 96px) clamp(20px, 4vw, 32px)" }}
      >
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <h2
            style={{
              font: "var(--type-h1)",
              fontSize: "clamp(32px, 4vw, 48px)",
              color: "var(--text-body)",
              marginBottom: "var(--space-3)",
            }}
          >
            What We Do
          </h2>
          <p className="eyebrow" style={{ marginBottom: "clamp(32px, 4vw, 48px)", maxWidth: 900 }}>
            {fixHomepageCopy(home?.programmesHeading)}
          </p>
          <div className="programmes-grid">
            {programmes.map(({ image, title, body }) => (
              <article key={title} className="programme-card">
                <h3
                  style={{
                    font: "var(--type-h3)",
                    fontSize: "var(--text-lg)",
                    color: "var(--text-body)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  {fixHomepageCopy(title)}
                </h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {image?.asset && <img
                  src={urlFor(image.asset).width(600).height(300).url()}
                  alt={image.alt || title}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={300}
                  style={{
                    height: 180,
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "var(--space-4)",
                  }}
                />}
                <ProgrammeDescription body={fixHomepageCopy(body) ?? ""} title={fixHomepageCopy(title) ?? title} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog paused; retained for the future launch. */}
      {BLOG_ENABLED && (
      <section
        aria-label="From the blog"
        style={{ padding: "0 clamp(20px, 4vw, 32px) clamp(64px, 8vw, 96px)" }}
      >
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "var(--space-3)",
              marginBottom: "var(--space-6)",
            }}
          >
            <h2
              style={{
                font: "var(--type-h1)",
                fontSize: "clamp(32px, 4vw, 48px)",
                color: "var(--text-body)",
              }}
            >
              {fixHomepageCopy(home?.blogSectionHeading)}
            </h2>
            <Link
              href="/blog"
              className="arrow-link"
              style={{ margin: "-4px -6px" }}
            >
              View all →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(270px, 100%), 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {(posts ?? []).map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

      )}

      <section
        aria-label="Events and conversations"
        style={{ padding: "0 clamp(20px, 4vw, 32px) clamp(64px, 8vw, 96px)" }}
      >
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "var(--space-3)",
              marginBottom: "var(--space-6)",
            }}
          >
            <h2
              style={{
                font: "var(--type-h1)",
                fontSize: "clamp(32px, 4vw, 48px)",
                color: "var(--text-body)",
              }}
            >
              Events
            </h2>
            <Link
              href="/events"
              className="arrow-link"
              style={{ margin: "-4px -6px" }}
            >
              View all →
            </Link>
          </div>
          <div className="home-events-grid">
            {displayedEvents.map(event => <EventCard key={event._id} event={event} />)}
          </div>
        </div>
      </section>

      <section
        aria-label="Membership"
        style={{ padding: "0 clamp(20px, 4vw, 32px) clamp(64px, 8vw, 96px)" }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            background: "var(--surface-card)",
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(20px, 5vw, 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-6)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <h2
              style={{
                font: "var(--type-h2)",
                fontSize: "clamp(28px, 3vw, 36px)",
                color: "var(--text-body)",
                marginBottom: "var(--space-3)",
              }}
            >
              {fixHomepageCopy(home?.membershipHeading)}
            </h2>
            <p
              style={{
                font: "var(--type-body)",
                color: "var(--text-muted)",
                textWrap: "pretty",
              }}
            >
              Be part of Sri Lanka’s growing bamboo and rattan community. Connect with researchers, professionals, entrepreneurs, growers, makers and others working towards the future of the sector.
            </p>
          </div>
          {home?.membershipCta && (
            <Link
              href={home.membershipCta.href}
              className="btn btn--primary btn--lg"
            >
              {fixHomepageCopy(home.membershipCta.label)}
            </Link>
          )}
        </div>
      </section>

      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

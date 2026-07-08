import { Link } from "next-view-transitions";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StatsBand from "@/components/StatsBand";
import BlogCard from "@/components/BlogCard";
import EventCard from "@/components/EventCard";
import NewsletterForm from "@/components/NewsletterForm";
import { client, urlFor, fetchOptions } from "@/sanity/client";
import {
  HOME_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  LATEST_POSTS_QUERY,
  UPCOMING_EVENTS_QUERY,
} from "@/sanity/queries";
import { eventMonthDay } from "@/lib/format";
import type {
  HomePage,
  SiteSettings,
  PostCard,
  EventDoc,
} from "@/sanity/types";

export const revalidate = 60;

export default async function HomePage() {
  const [home, settings, posts, events] = await Promise.all([
    client.fetch<HomePage>(HOME_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
    client.fetch<PostCard[]>(LATEST_POSTS_QUERY, {}, fetchOptions),
    client.fetch<EventDoc[]>(UPCOMING_EVENTS_QUERY, {}, fetchOptions),
  ]);

  return (
    <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <SiteNav active="Home" overlay position="fixed" />

      <section
        aria-label="Introduction"
        style={{
          position: "relative",
          height: "clamp(560px, 88vh, 720px)",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {home?.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={urlFor(home.heroImage.asset).width(2000).url()}
            alt={home.heroImage.alt}
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
            padding: "0 clamp(20px, 4vw, 32px) clamp(48px, 8vh, 96px)",
            width: "100%",
          }}
        >
          <p className="eyebrow" style={{ marginBottom: "var(--space-4)" }}>
            {home?.heroEyebrow}
          </p>
          <h1
            style={{
              font: "var(--type-hero)",
              fontSize: "clamp(40px, 5vw, 64px)",
              color: "var(--text-on-brand)",
              maxWidth: 820,
              marginBottom: "var(--space-4)",
              textWrap: "balance",
            }}
          >
            {home?.heroHeading}
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
            {home?.heroSubheading}
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            {home?.heroPrimaryCta && (
              <Link
                href={home.heroPrimaryCta.href}
                className="btn btn--accent btn--lg"
              >
                {home.heroPrimaryCta.label}
              </Link>
            )}
            {home?.heroSecondaryCta && (
              <a href={home.heroSecondaryCta.href} className="btn btn--ghost btn--lg">
                {home.heroSecondaryCta.label}
              </a>
            )}
          </div>
        </div>
      </section>

      <StatsBand stats={settings?.stats} />

      <section
        id="programmes"
        aria-label="What we do"
        style={{ padding: "clamp(64px, 8vw, 96px) clamp(20px, 4vw, 32px)" }}
      >
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
            {home?.programmesEyebrow}
          </p>
          <h2
            style={{
              font: "var(--type-h1)",
              fontSize: "clamp(32px, 4vw, 48px)",
              color: "var(--text-body)",
              marginBottom: "clamp(32px, 4vw, 48px)",
              maxWidth: 640,
              textWrap: "balance",
            }}
          >
            {home?.programmesHeading}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {(home?.programmes ?? []).map(({ image, title, body }) => (
              <article key={title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlFor(image.asset).width(800).height(600).url()}
                  alt={image.alt}
                  style={{
                    aspectRatio: "4 / 3",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "var(--space-4)",
                  }}
                />
                <h3
                  style={{
                    font: "var(--type-h3)",
                    fontSize: "var(--text-lg)",
                    color: "var(--text-body)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    font: "var(--type-body)",
                    color: "var(--text-muted)",
                    textWrap: "pretty",
                  }}
                >
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
              {home?.blogSectionHeading}
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
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {(posts ?? []).map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section
        aria-label="Upcoming events"
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
              {home?.eventsSectionHeading}
            </h2>
            <Link
              href="/events"
              className="arrow-link"
              style={{ margin: "-4px -6px" }}
            >
              View all →
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
              maxWidth: 860,
            }}
          >
            {(events ?? []).slice(0, 3).map((event) => {
              const { month, day } = eventMonthDay(event.date);
              return (
                <EventCard
                  key={event._id}
                  month={month}
                  day={day}
                  title={event.title}
                  location={event.location}
                  time={event.timeLabel}
                />
              );
            })}
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
            padding: "clamp(32px, 5vw, 64px)",
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
              {home?.membershipHeading}
            </h2>
            <p
              style={{
                font: "var(--type-body)",
                color: "var(--text-muted)",
                textWrap: "pretty",
              }}
            >
              {home?.membershipBody}
            </p>
          </div>
          {home?.membershipCta && (
            <Link
              href={home.membershipCta.href}
              className="btn btn--primary btn--lg"
            >
              {home.membershipCta.label}
            </Link>
          )}
        </div>
      </section>

      <section
        id="newsletter"
        aria-label="Newsletter"
        style={{
          background: "var(--surface-card)",
          borderTop: "1px solid var(--border-hairline)",
          padding: "clamp(48px, 6vw, 64px) clamp(20px, 4vw, 32px)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-6)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <h2
              style={{
                font: "var(--type-h3)",
                fontSize: "var(--text-lg)",
                color: "var(--text-body)",
                marginBottom: "var(--space-1)",
              }}
            >
              {settings?.newsletterHeading}
            </h2>
            <p style={{ font: "var(--type-caption)", color: "var(--text-muted)" }}>
              {settings?.newsletterBody}
            </p>
          </div>
          <NewsletterForm variant="home" inputId="home-newsletter-email" />
        </div>
      </section>

      <SiteFooter settings={settings} />
    </div>
  );
}

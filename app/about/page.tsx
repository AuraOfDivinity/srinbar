import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StatsBand from "@/components/StatsBand";
import { client, urlFor, fetchOptions } from "@/sanity/client";
import {
  ABOUT_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  TEAM_QUERY,
} from "@/sanity/queries";
import type { AboutPage, SiteSettings, TeamMember } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us — SRINBAR",
  description:
    "SRINBAR — the Lanka Network for Bamboo and Rattan — a network of scientists, growers, and artisans founded in Kandy in 2005.",
};

export default async function AboutPageRoute() {
  const [about, settings, team] = await Promise.all([
    client.fetch<AboutPage>(ABOUT_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
    client.fetch<TeamMember[]>(TEAM_QUERY, {}, fetchOptions),
  ]);

  return (
    <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <SiteNav active="About Us" />

      <section
        aria-label="About SRINBAR"
        style={{
          position: "relative",
          height: "clamp(320px, 45vh, 420px)",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {about?.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={urlFor(about.heroImage.asset).width(2000).url()}
            alt={about.heroImage.alt}
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
              "linear-gradient(180deg, rgba(20, 41, 31, 0.25) 0%, rgba(20, 41, 31, 0.8) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 clamp(20px, 4vw, 32px) clamp(40px, 6vh, 64px)",
            width: "100%",
          }}
        >
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
            {about?.heroEyebrow}
          </p>
          <h1
            style={{
              font: "var(--type-h1)",
              fontSize: "clamp(34px, 4.5vw, 48px)",
              color: "var(--text-on-brand)",
              maxWidth: 700,
              textWrap: "balance",
            }}
          >
            {about?.heroHeading}
          </h1>
        </div>
      </section>

      <section
        aria-label="Our story"
        style={{ padding: "clamp(64px, 8vw, 96px) clamp(20px, 4vw, 32px)" }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(32px, 5vw, 64px)",
          }}
        >
          <div>
            <h2
              style={{
                font: "var(--type-h2)",
                fontSize: "clamp(28px, 3vw, 36px)",
                color: "var(--text-body)",
                marginBottom: "var(--space-4)",
              }}
            >
              {about?.storyHeading}
            </h2>
            {(about?.storyParagraphs ?? []).map((text, i) => (
              <p
                key={i}
                style={{
                  font: i === 0 ? "var(--type-body-lg)" : "var(--type-body)",
                  color: i === 0 ? "var(--text-body)" : "var(--text-muted)",
                  marginBottom: "var(--space-4)",
                  textWrap: "pretty",
                }}
              >
                {text}
              </p>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}
          >
            {[
              { label: "Mission", text: about?.mission },
              { label: "Vision", text: about?.vision },
            ].map(({ label, text }) => (
              <div
                key={label}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-6)",
                }}
              >
                <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
                  {label}
                </p>
                <p
                  style={{
                    font: "var(--type-body-lg)",
                    fontFamily: "var(--font-serif-display)",
                    color: "var(--text-body)",
                    textWrap: "pretty",
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsBand stats={settings?.stats} />

      <section
        id="team"
        aria-label="Advisory committee"
        style={{ padding: "clamp(64px, 8vw, 96px) clamp(20px, 4vw, 32px)" }}
      >
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
            {about?.teamEyebrow}
          </p>
          <h2
            style={{
              font: "var(--type-h1)",
              fontSize: "clamp(32px, 4vw, 48px)",
              color: "var(--text-body)",
              marginBottom: "var(--space-4)",
              maxWidth: 640,
            }}
          >
            {about?.teamHeading}
          </h2>
          <p
            style={{
              font: "var(--type-body)",
              color: "var(--text-muted)",
              maxWidth: 620,
              marginBottom: "clamp(32px, 4vw, 48px)",
              textWrap: "pretty",
            }}
          >
            {about?.teamIntro}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {(team ?? []).map(({ _id, image, name, role }) => (
              <div key={_id}>
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(image.asset).width(600).height(600).url()}
                    alt={image.alt}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "var(--space-3)",
                    }}
                  />
                )}
                <h3
                  style={{
                    font: "var(--type-h3)",
                    fontSize: "var(--text-md)",
                    color: "var(--text-body)",
                  }}
                >
                  {name}
                </h3>
                <p style={{ font: "var(--type-caption)", color: "var(--text-muted)" }}>
                  {role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="inbar"
        aria-label="INBAR affiliation"
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
          <div style={{ maxWidth: 640 }}>
            <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
              {about?.inbarEyebrow}
            </p>
            <h2
              style={{
                font: "var(--type-h2)",
                fontSize: "clamp(28px, 3vw, 36px)",
                color: "var(--text-body)",
                marginBottom: "var(--space-3)",
              }}
            >
              {about?.inbarHeading}
            </h2>
            <p
              style={{
                font: "var(--type-body)",
                color: "var(--text-muted)",
                textWrap: "pretty",
              }}
            >
              {about?.inbarBody}
            </p>
          </div>
          {about?.inbarCta && (
            <Link href={about.inbarCta.href} className="btn btn--outline btn--md">
              {about.inbarCta.label}
            </Link>
          )}
        </div>
      </section>

      <SiteFooter settings={settings} />
    </div>
  );
}

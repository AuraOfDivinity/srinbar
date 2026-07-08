import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import MembershipForm from "@/components/MembershipForm";
import NewsletterForm from "@/components/NewsletterForm";
import { client, fetchOptions } from "@/sanity/client";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { ContactPageDoc, SiteSettings } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact & Membership — SRINBAR",
  description:
    "Join the network. Whether you grow, craft, or trade bamboo and rattan — or simply have a question — this is the place to reach us.",
};

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    client.fetch<ContactPageDoc>(CONTACT_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
  ]);

  return (
    <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <SiteNav active="Contact" />

      <section
        aria-label="Contact header"
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
              maxWidth: 620,
              textWrap: "pretty",
            }}
          >
            {page?.intro}
          </p>
        </div>
      </section>

      <section
        id="membership"
        aria-label="Membership application"
        style={{
          padding:
            "clamp(40px, 5vw, 64px) clamp(20px, 4vw, 32px) clamp(64px, 8vw, 96px)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(32px, 5vw, 80px)",
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-lg)",
              padding: "clamp(24px, 3.5vw, 48px)",
            }}
          >
            <h2
              style={{
                font: "var(--type-h2)",
                fontSize: "clamp(24px, 2.5vw, 28px)",
                color: "var(--text-body)",
                marginBottom: "var(--space-2)",
              }}
            >
              {page?.formHeading}
            </h2>
            <p
              style={{
                font: "var(--type-caption)",
                color: "var(--text-muted)",
                marginBottom: "var(--space-5)",
                textWrap: "pretty",
              }}
            >
              {page?.formNote}
            </p>
            <MembershipForm />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-6)",
            }}
          >
            <div>
              <h2
                style={{
                  font: "var(--type-h3)",
                  fontSize: "var(--text-lg)",
                  color: "var(--text-body)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Visit or write
              </h2>
              <p style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>
                {(settings?.addressLines ?? []).map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
              <p
                style={{
                  font: "var(--type-body)",
                  color: "var(--text-muted)",
                  marginTop: "var(--space-3)",
                }}
              >
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="text-link">
                    {settings.email}
                  </a>
                )}
                <br />
                {settings?.phone}
              </p>
              <p
                style={{
                  font: "var(--type-caption)",
                  color: "var(--text-muted)",
                  marginTop: "var(--space-3)",
                }}
              >
                {settings?.officeHours}
              </p>
            </div>

            <div
              role="img"
              aria-label={settings?.mapNote ?? "Map placeholder"}
              style={{
                height: 260,
                border: "1px solid var(--border-hairline)",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-card)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-2)",
                textAlign: "center",
                padding: "var(--space-5)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif-display)",
                  fontSize: "var(--text-lg)",
                  color: "var(--sage-grey)",
                }}
              >
                Map
              </span>
              <span
                style={{
                  font: "var(--type-caption)",
                  color: "var(--text-muted)",
                  maxWidth: 280,
                }}
              >
                {settings?.mapNote}
              </span>
            </div>

            <div
              id="newsletter"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-hairline)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
              }}
            >
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
              <p
                style={{
                  font: "var(--type-caption)",
                  color: "var(--text-muted)",
                  marginBottom: "var(--space-4)",
                }}
              >
                {settings?.newsletterBody}
              </p>
              <NewsletterForm variant="contact" inputId="contact-newsletter-email" />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </div>
  );
}

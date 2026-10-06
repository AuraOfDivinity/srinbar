import { BLOG_ENABLED, isBlogLink } from "@/lib/features";
import { Link } from "next-view-transitions";
import type { SiteSettings } from "@/sanity/types";

export default function SiteFooter({ settings }: { settings?: SiteSettings | null }) {
  // Reject the retired affiliation link even when cached CMS data contains it.
  const columns = (settings?.footerColumns ?? []).map((column) => ({
    ...column,
    links: (column.links ?? []).filter(({ label, href }) => {
      if (/\binbar\b/i.test(label)) return false;
      try {
        const url = new URL(href, "https://srinbar.invalid");
        return url.hash.toLowerCase() !== "#inbar" && !(url.pathname === "/contact" && url.hash === "#newsletter");
      } catch {
        return true;
      }
    }),
  }));
  return (
    <footer
      style={{
        background: "var(--surface-brand-dark)",
        color: "var(--text-on-brand)",
        fontFamily: "var(--font-sans-body)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "var(--space-8) clamp(20px, 4vw, 32px) var(--space-6)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          <div style={{ gridColumn: "span 1" }}>
            <div
              style={{
                fontFamily: "var(--font-serif-display)",
                fontSize: 28,
                fontWeight: 500,
                marginBottom: "var(--space-3)",
              }}
            >
              SRINBAR
            </div>
            <p
              style={{
                font: "var(--type-body)",
                color: "var(--text-on-brand-muted)",
                maxWidth: 320,
              }}
            >
              {settings?.footerBlurb}
            </p>
          </div>
          {columns.map(({ heading, links }) => (
            <nav
              key={heading}
              aria-label={heading}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
              }}
            >
              <div
                style={{
                  font: "var(--type-eyebrow)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-widest)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-accent)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {heading}
              </div>
              {(links ?? []).filter(({ label, href }) => BLOG_ENABLED || !isBlogLink(href, label)).map(({ label, href }) => (
                <Link key={label} href={href} className="footer-link">
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div
          style={{
            marginTop: "var(--space-8)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid rgba(255, 253, 247, 0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-on-brand-muted)",
            }}
          >
            {settings?.copyright}
          </span>
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-on-brand-muted)",
            }}
          >
            {settings?.footerTagline}
          </span>
        </div>
      </div>
    </footer>
  );
}

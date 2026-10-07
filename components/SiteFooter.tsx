import { BLOG_ENABLED, isBlogLink } from "@/lib/features";
import { Link } from "next-view-transitions";
import type { SiteSettings } from "@/sanity/types";

export default function SiteFooter({ settings }: { settings?: SiteSettings | null }) {
  // Reject the retired affiliation link even when cached CMS data contains it.
  const columns = (settings?.footerColumns ?? [])
    .filter((column) => !/^programmes$/i.test(column.heading.trim()))
    .map((column) => ({
    ...column,
    links: (column.links ?? []).filter(({ label, href }) => {
      if (/\binbar\b/i.test(label)) return false;
      try {
        const url = new URL(href, "https://srinbar.invalid");
        return url.hash.toLowerCase() !== "#inbar" && !(url.pathname === "/contact" && url.hash === "#newsletter");
      } catch {
        return true;
      }
    }).map((item) => /^advisory committee$/i.test(item.label.trim())
      ? { ...item, label: "People", href: "/people" }
      : item),
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
          className="footer-content-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
            gap: "var(--space-4)",
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
              className="footer-blurb"
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
          <nav
            aria-label="Social media"
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
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
              Follow Us
            </div>
            <a
              href="https://www.instagram.com/srinbar?stkn=eGgweHhsMW14b3Br"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link footer-social-link"
              aria-label="Instagram (opens in a new tab)"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.5" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a
              href="https://www.facebook.com/share/1bXvfLMMwr/?mibextid=wwXIfr&ref=1"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link footer-social-link"
              aria-label="Facebook (opens in a new tab)"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H7v3.2h2.8V21h3.7Z" />
              </svg>
              Facebook
            </a>
            <a
              href="https://www.youtube.com/@SRINBAR"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link footer-social-link"
              aria-label="YouTube (opens in a new tab)"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
              </svg>
              YouTube
            </a>
          </nav>
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
            <span className="footer-location">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" fill="currentColor" />
                <circle cx="12" cy="10" r="2.5" fill="var(--surface-brand-dark)" />
              </svg>
              Sri Lanka
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

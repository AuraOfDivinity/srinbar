"use client";

import { BLOG_ENABLED, isBlogLink } from "@/lib/features";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const PAGES: [string, string][] = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Blog", "/blog"],
  ["Events", "/events"],
  ["Contact", "/contact"],
];

type SiteNavProps = {
  active: string;
  /** Transparent over the hero until the page scrolls (Home). */
  overlay?: boolean;
  /** "fixed" on Home (hero runs underneath), "sticky" elsewhere. */
  position?: "fixed" | "sticky";
};

export default function SiteNav({
  active,
  overlay = false,
  position = "sticky",
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoIntro, setLogoIntro] = useState<"pending" | "playing" | "shown">("pending");
  const introInitialized = useRef(false);

  useLayoutEffect(() => {
    // The home nav can mount after another page has already mounted its nav.
    // Keep the intro tied to the hero overlay so it still plays on home entry.
    if (introInitialized.current) return;
    introInitialized.current = true;
    setLogoIntro(overlay ? "playing" : "shown");
  }, [overlay]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const mq = window.matchMedia("(max-width: 767px)");
    const onMq = () => {
      setIsMobile(mq.matches);
      setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (mq.addEventListener) mq.addEventListener("change", onMq);
    setScrolled(window.scrollY > 24);
    setIsMobile(mq.matches);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (mq.removeEventListener) mq.removeEventListener("change", onMq);
    };
  }, []);

  const open = isMobile && menuOpen;
  const transparent = overlay && !scrolled && !open;

  const positionStyle: React.CSSProperties =
    position === "fixed"
      ? { position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }
      : { position: "sticky", top: 0, zIndex: 50 };

  return (
    <header
      role="banner"
      className={`site-nav-anchor${transparent ? " site-nav-anchor--overlay" : ""}`}
      style={{
        ...positionStyle,
        background: transparent ? "rgba(18, 39, 29, 0.82)" : "var(--surface-page)",
        borderBottom: `1px solid ${transparent ? "rgba(255, 255, 255, 0.16)" : "var(--border-hairline)"}`,
        color: transparent ? "var(--text-on-brand)" : "var(--text-body)",
        fontFamily: "var(--font-sans-body)",
        transition:
          "background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: transparent ? "0 8px 24px rgba(7, 20, 13, 0.12)" : "none",
        backdropFilter: transparent ? "blur(10px)" : "none",
        ["--nav-hover" as string]: transparent
          ? "var(--rattan-gold-light)"
          : "var(--bamboo-green)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 32px)",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-4)",
        }}
      >
        <Link href="/" aria-label="SRINBAR — home" className="nav-brand">
          <img className="nav-brand-symbol" src="/brand/srinbar-symbol.png" width={58} height={51} alt="" fetchPriority="high" />
          <span className="nav-brand-wordmark" data-intro={logoIntro} onAnimationEnd={() => setLogoIntro("shown")} aria-hidden="true">
            <img src="/brand/srinbar-wordmark.png" width={180} height={60} alt="" fetchPriority="high" />
          </span>
        </Link>
        {!isMobile && (
          <nav
            aria-label="Primary"
            style={{ display: "flex", alignItems: "center", gap: 32 }}
          >
            {PAGES.filter(([label, href]) => BLOG_ENABLED || !isBlogLink(href, label)).map(([label, href]) => (
              <Link
                key={label}
                href={href}
                aria-current={label === active ? "page" : undefined}
                className="nav-link"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
        {isMobile && (
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="srinbar-mobile-menu"
            className="nav-toggle"
          >
            {open ? "Close" : "Menu"}
          </button>
        )}
      </div>
      {open && (
        <nav
          id="srinbar-mobile-menu"
          aria-label="Primary"
          style={{
            display: "flex",
            flexDirection: "column",
            background: "var(--surface-page)",
            borderTop: "1px solid var(--border-hairline)",
            borderBottom: "1px solid var(--border-hairline)",
            padding: "var(--space-2) clamp(20px, 4vw, 32px) var(--space-5)",
            color: "var(--text-body)",
          }}
        >
          {PAGES.filter(([label, href]) => BLOG_ENABLED || !isBlogLink(href, label)).map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              aria-current={label === active ? "page" : undefined}
              className="mobile-link"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact#membership"
            onClick={() => setMenuOpen(false)}
            className="btn btn--accent btn--md"
            style={{ marginTop: "var(--space-5)", minHeight: 48 }}
          >
            Become a Member
          </Link>
        </nav>
      )}
    </header>
  );
}

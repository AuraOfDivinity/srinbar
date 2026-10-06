"use client";

import { Link } from "next-view-transitions";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const NAV_LINKS: [string, string | null][] = [
  ["Home", "/"],
  ["Our Story", "/about#story-heading"],
  ["Avenues", "/#programmes"],
  ["People", "/people"],
  ["Events", "/events"],
  ["Articles and Research", null],
  ["Find Us", null],
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
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = menuOpen;

  const closeForNavigation = () => {
    // Restore the page before Next.js calculates the destination's scroll position.
    dialogRef.current?.close();
    flushSync(() => setMenuOpen(false));
  };

  const closeMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closeTimer.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }
    dialog.dataset.closing = "true";
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      dialog.close();
    }, 240);
  };
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
      if (!mq.matches) dialogRef.current?.close();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (mq.addEventListener) mq.addEventListener("change", onMq);
    setScrolled(window.scrollY > 24);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (mq.removeEventListener) mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    delete dialog.dataset.closing;
    dialog.showModal();
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: "fixed", top: `-${scrollY}px`, width: "100%", overflow: "hidden" });
    return () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
      closeTimer.current = null;
      Object.assign(body.style, previous);
      window.scrollTo({ top: scrollY, behavior: "instant" });
      if (dialog.open) dialog.close();
    };
  }, [open]);

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
      <div className="site-nav-inner">
        <Link href="/" aria-label="SRINBAR — home" className="nav-brand">
          <img className="nav-brand-symbol" src="/brand/srinbar-symbol.webp" width={58} height={51} alt="" fetchPriority="high" />
          <span className="nav-brand-wordmark" data-intro={logoIntro} onAnimationEnd={() => setLogoIntro("shown")} aria-hidden="true">
            <img src="/brand/srinbar-wordmark.webp" width={180} height={60} alt="" fetchPriority="high" />
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="desktop-nav"
        >
          {NAV_LINKS.map(([label, href]) => href ? (
            <Link
              key={label}
              href={href}
              aria-current={label === active || (active === "About Us" && label === "Our Story") ? "page" : undefined}
              className="nav-link"
            >
              {label}
            </Link>
          ) : <span key={label} className="nav-link nav-link--disabled" aria-disabled="true">{label}</span>)}
        </nav>
        <Link href="/contact#membership" className="btn btn--accent btn--sm desktop-membership-cta">Become a Member</Link>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="srinbar-mobile-menu"
          className="nav-toggle"
        >
          <span className="nav-toggle-icon" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>
      <dialog
        ref={dialogRef}
        id="srinbar-mobile-menu"
        aria-labelledby="mobile-menu-title"
        className="mobile-menu-drawer"
        onClose={() => {
          if (closeTimer.current !== null) clearTimeout(closeTimer.current);
          closeTimer.current = null;
          setMenuOpen(false);
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button");
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeMenu();
        }}
      >
        <div className="mobile-menu-toolbar">
          <div className="mobile-menu-brand" aria-label="SRINBAR">
            <img src="/brand/srinbar-symbol.webp" width={48} height={43} alt="" />
            <img src="/brand/srinbar-wordmark.webp" width={150} height={50} alt="" />
          </div>
          <button type="button" autoFocus className="mobile-menu-close" onClick={closeMenu} aria-label="Close navigation menu">
            <span className="mobile-close-icon" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
        <div className="mobile-menu-heading">
          <span id="mobile-menu-title" className="eyebrow">Explore SRINBAR</span>
          <span className="mobile-menu-rule" aria-hidden="true" />
        </div>
        <nav aria-label="Primary" className="mobile-menu-links">
          {NAV_LINKS.map(([label, href]) => href ? (
            <Link
              key={label}
              href={href}
              onClick={closeForNavigation}
              aria-current={label === active || (active === "About Us" && label === "Our Story") ? "page" : undefined}
              className="mobile-link"
            >
              {label}
            </Link>
          ) : (
            <span key={label} className="mobile-link mobile-link--disabled" aria-disabled="true">
              {label}
            </span>
          ))}
        </nav>
        <Link
          href="/contact#membership"
          onClick={closeForNavigation}
          className="btn btn--accent btn--md mobile-menu-cta"
        >
          Become a Member
        </Link>
      </dialog>
    </header>
  );
}

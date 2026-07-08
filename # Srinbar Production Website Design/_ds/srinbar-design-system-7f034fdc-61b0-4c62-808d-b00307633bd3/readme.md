# SRINBAR Design System

**SRINBAR — Lanka Network for Bamboo and Rattan** is a Sri Lankan non-profit network (est. 2005, founded by scientists from the National Institute of Fundamental Studies, Kandy) that promotes bamboo cultivation for land restoration, riverbank stabilisation and degraded-soil recovery, and networks entrepreneurs working in bamboo/rattan crafts, charcoal, timber substitutes, edible shoots and textiles. It is connected to the broader INBAR (International Network for Bamboo and Rattan) ecosystem.

This project is a from-scratch design system built for a five-page marketing site: **Home, About Us, Blog, Events, Contact.**

## Source material

- `srinbar/srinbar-design-brief.md` — the only attached source, a design brief (no codebase, no Figma). It specifies three palette options, three font pairings, a Dilmah-tea-inspired visual direction, and the component list this system implements.
- No logo, icon set, or product screenshots were provided. Nothing was recreated from a real product — this is an original system built to the brief's spec.
- Style inspiration referenced in the brief: [dilmahtea.com](https://www.dilmahtea.com/) (heritage serif headlines, cream backgrounds, deep greens, full-bleed nature photography).
- Background/team photography is hotlinked from Wikimedia Commons (bamboo groves + real Sri Lankan forest reserves — Ella Valley, Bodinagala, Labugama-Kalatuwawa — credited to their original photographers, CC BY 4.0 / public domain). These are **placeholders**; swap in SRINBAR's own photography when available.

## Decisions made (brief left these open)

- **Palette:** Option A, "Bamboo Grove" — forest green `#1E3D2F` primary, bamboo green `#6E9B5E` secondary, rattan gold `#C99A3C` accent, cane cream `#F7F3E8` background.
- **Type pairing:** Pairing 1 — Fraunces (serif display/headings) + Inter (sans body/UI), sourced live from Google Fonts.

## Index

```
tokens/            colors.css, typography.css, spacing.css, radii.css, fonts.css
styles.css         root stylesheet — @import list only
guidelines/        foundation specimen cards (Design System tab)
components/
  core/            Button, Badge, DateBadge
  navigation/      Nav, Footer
  marketing/       Hero, ImpactStatsBand, MembershipCTA, TeamMember
  blog/            BlogCard
  events/          EventCard
  forms/           NewsletterSignup
ui_kits/website/    click-through recreation of the 5-page site
SKILL.md           Claude-Code-portable skill file
```

## Components

| Component | Directory | Notes |
|---|---|---|
| Button | `components/core/` | primary / secondary / accent / ghost, 3 sizes — *intentional addition* (not named in brief, but required by every CTA it lists) |
| Badge / DateBadge | `components/core/` | status pill + the stacked date badge the brief calls for on event cards — *intentional addition* for Badge as a general primitive |
| Nav | `components/navigation/` | 5-page primary nav, transparent-over-hero or solid |
| Footer | `components/navigation/` | mega-footer per brief |
| Hero | `components/marketing/` | full-bleed photo hero + tagline + CTA |
| ImpactStatsBand | `components/marketing/` | impact stats band per brief |
| MembershipCTA | `components/marketing/` | membership CTA per brief |
| TeamMember | `components/marketing/` | supports the brief's "about/team section" |
| BlogCard | `components/blog/` | blog card grid per brief |
| EventCard | `components/events/` | event card with date badge per brief |
| NewsletterSignup | `components/forms/` | newsletter signup per brief |

## Content fundamentals

**Voice:** grounded and scientific, but warm — never corporate-NGO jargon, never salesy. SRINBAR speaks as a network of practitioners (scientists, growers, artisans), not a marketing department.

**Person:** mostly first-person-plural ("we restore", "our network") for organisational statements; switches to direct address ("you") in CTAs and membership copy ("Join the Network", "Whether you grow, craft, or trade…").

**Casing:** sentence case for body copy and nav labels; headlines and CTA buttons use title case ("Growing a Greener Lanka", "Become a Member"). No all-caps body text — only small eyebrow labels and badges use uppercase + wide letter-spacing.

**Tone examples:**
- Hero tagline: *"Restoring degraded land, stabilising riverbanks, and building bamboo livelihoods across Sri Lanka."* — concrete outcomes, no adjectives like "innovative" or "world-class."
- Membership CTA: *"Whether you grow, craft, or trade bamboo and rattan — SRINBAR membership connects you to training, markets, and a community of practice."* — names the actual audience segments rather than generic "stakeholders."
- Newsletter: *"Stay Rooted"* — the one place a plant-pun is allowed; used exactly once, as the newsletter module's name, not repeated elsewhere.

**Emoji:** never used. **Punctuation:** em dashes for asides (matching this brief's own style); periods, not exclamation points, even in CTAs.

**Vibe:** purpose-driven, patient, credible — closer to a research institute's public face than a startup's. Copy should always be able to answer "restoration/livelihoods for whom, where" — vague impact language is avoided in favour of named districts, numbers, and species-specific detail (bamboo, rattan, riverbank, degraded soil).

## Visual foundations

**Colors:** Bamboo Grove palette (see `guidelines/`) — deep forest green anchors nav, footer, and primary buttons; bamboo green is reserved for hover states and secondary highlights; rattan gold is used sparingly and specifically for event dates, badges, and registration CTAs (never as a general accent). Backgrounds are warm cream, never pure white or grey. 2–3 colors per view, matching the brief's restraint.

**Type:** Fraunces serif for all headings/hero copy (weight 400–500, generous size — hero headline up to 64px), Inter sans for body/UI/nav. Scale: 12/14/16/18/22/28/36/48/64px. Line-height 1.6 for body, 1.15 for headings. Headings are never bold-weight; boldness comes from size, not weight.

**Spacing:** 4px base scale (4/8/12/16/24/32/48/64/96/128). Sections breathe with 64–96px vertical padding; content max-width 1200px.

**Backgrounds:** full-bleed nature photography for heroes (bamboo groves, forest reserves, riverbanks) with a dark forest-green gradient scrim for text legibility — no illustration, no repeating pattern, no gradients used decoratively (gradients exist only as photo scrims). Cards sit on cream/warm-white, never on photos directly.

**Animation:** minimal and quiet — 150–200ms ease transitions on hover/press only. No entrance animations, no bounce, no parallax. This is a heritage/institutional brand, not a product demo.

**Hover states:** primary buttons darken (forest green → forest-green-dark); accent (gold) buttons darken slightly; secondary/outline buttons gain a faint tinted fill; ghost buttons (on photo) gain a faint white fill. Links get no underline by default; nav's active link carries a permanent gold underline.

**Press states:** no scale/shrink effects used; color darkening only (kept subtle and calm, consistent with the brand's understated motion language).

**Borders:** thin 1px hairline borders in muted sage-green (`--hairline-green`), used on cards and inputs — never a heavy or colored (non-green) border.

**Shadows:** very soft, low-contrast card shadow (`--shadow-card`) for elevated cards; most cards use a hairline border instead of a shadow. No hard drop shadows.

**Corner radii:** soft rounding throughout — 6px small controls, 10px cards/photos, 16px large CTA banners, pill-shaped (999px) for buttons and inputs — matching the brief's "soft rounded corners (8–12px)" direction, extended to a small consistent scale.

**Transparency/blur:** used only for the hero's photo-legibility gradient scrim and for translucent ghost-button fills on photos; no frosted-glass/backdrop-blur UI anywhere else.

**Imagery color vibe:** warm, natural daylight; greens and earth tones; no black-and-white, no heavy grain or filter — photography should look observational/documentary, not stylised.

**Cards:** warm-white surface, 1px hairline border (or no border for image-led blog cards, where the photo itself provides the edge), 10–16px radius, no colored left-border accent (explicitly avoided as an AI-slop trope).

## Iconography

**No icon set was provided or invented.** The brief does not define an icon system, and no icon assets exist in the attached brief file. This system deliberately ships **no icon font, SVG set, or icon component** — none is drawn or approximated. If/when SRINBAR provides brand icons (or a preferred library like Lucide/Heroicons), add them under `assets/icons/` and register an `Icon` component here. Until then, UI kit screens use plain type, the `DateBadge` (typographic, not iconographic), and photography rather than icon glyphs. No emoji, no unicode-glyph icons are used anywhere in this system.

**Logo:** no SRINBAR logo file was provided. Per policy, none was drawn or reconstructed. Every place a mark would appear (nav, footer, favicon) instead shows the wordmark **"SRINBAR"** set in Fraunces — see `guidelines/brand-wordmark.card.html`.

## Fonts

Fraunces and Inter are both open-source Google Fonts — no substitution was needed, and no local binaries were bundled; `tokens/fonts.css` pulls them live via `@import url(fonts.googleapis.com/...)`. If the project later needs to work fully offline, download the two woff2 families and replace this import with local `@font-face` rules.

## Caveats

- No codebase, Figma file, or real photography/logo was attached — everything here is built directly from the text brief plus original component/copy decisions layered on top. Treat this as v1 scaffolding, not a locked brand system.
- Hero/team/blog imagery is hotlinked Wikimedia Commons stock, not SRINBAR's own photography.
- Font delivery depends on a live Google Fonts CDN import rather than bundled local files.

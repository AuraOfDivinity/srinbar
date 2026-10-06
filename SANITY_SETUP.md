# SRINBAR × Sanity — setup

The site now reads all content from Sanity: page copy, blog posts, events, team, contact details, footer, and every image (uploaded to Sanity's asset CDN).

## 1. Create the Sanity project (one time)

1. Go to [sanity.io](https://www.sanity.io/) and sign in (Google/GitHub works).
2. Create a new project at [sanity.io/manage](https://www.sanity.io/manage) — note the **Project ID**.
3. In the project: **API → Tokens → Add API token**, name it `seed`, permissions **Editor**. Copy the token.
4. In **API → CORS origins**, add `http://localhost:3000` (with credentials) so the embedded Studio works.

## 2. Configure env vars

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your project id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=<the editor token>
```

## 3. Populate with the current static content

```bash
npm run seed
```

This uploads the 6 site images to Sanity's asset store and writes ~30 documents (site settings, all 5 page singletons, 6 categories, 7 posts including the full riverbanks article as Portable Text, 9 events, 4 team members, 1 author). It's idempotent — re-running overwrites the seeded documents, no duplicates.

## 4. Run

```bash
npm run dev
```

- Site: http://localhost:3000 — now fully Sanity-driven (ISR, revalidates every 60 s).
- Admin: http://localhost:3000/studio — sign in with your Sanity account; edit anything and it appears on the site within a minute.

## Content model

| Type | Kind | Drives |
|---|---|---|
| `siteSettings` | singleton | Footer, contact info, newsletter copy, SEO defaults |
| `homePage` | singleton | Hero, programmes, section headings, membership CTA |
| `aboutPage` | singleton | About hero, story, team & INBAR sections |
| `blogPage`, `eventsPage`, `contactPage` | singletons | Page headers & microcopy |
| `post` | collection | Blog cards + full articles (`/blog/[slug]`, Portable Text body) |
| `category` | collection | Blog filter pills |
| `author` | collection | Article bylines & bio card |
| `event` | collection | Upcoming/past events (split automatically by date) |
| `teamMember` | collection | Advisory committee grid |

## For your custom admin dashboard

Your dashboard can talk to the same dataset via `@sanity/client` with a write token, or you can keep using the embedded Studio at `/studio`. Sanity handles auth (invite admins under **Members** at sanity.io/manage). The schemas above are the contract — any document your dashboard writes in these shapes renders on the site.

Notes:
- Upcoming vs past events is just `date >= now()` — no flag to maintain.
- The featured blog post is the newest post with `featured: true`.
- `/article` now redirects to `/blog`; article URLs are `/blog/<slug>`.

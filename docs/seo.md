# Search and sharing setup

Every public page has a unique title, description, absolute canonical URL, Open Graph metadata and a Twitter large-image preview. Event posters and article cover images are used when available; otherwise `/opengraph-image?title=…` creates a branded 1200 × 630 card. The square favicon and Apple icon use the existing SRINBAR symbol.

`lib/seo.ts` holds shared configuration. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before building (currently defaults to `https://srinbar.com`). Redirect any alternate hostnames to that origin in the hosting provider. Do not change this value to a preview URL. Set `SITE_NOINDEX=true` for staging; Vercel non-production deployments also disable indexing automatically.

`/sitemap.xml` refreshes every 60 seconds and includes published, non-archived event and article URLs. The paused blog is excluded until `BLOG_ENABLED` is enabled. CMS modification dates are used for dynamic entries; static pages omit modification dates rather than inventing freshness. CMS failures surface as errors instead of replacing the sitemap with a partial list.

The home page supplies Organization and WebSite JSON-LD. Other public pages include breadcrumbs, and article and event details include content-specific structured data. CMS text is safely escaped. Event venue addresses, ticket prices, status, online attendance links and exact timestamps are not inferred from incomplete data. Current event records have free-text venues and times; full venue addresses and precise start/end timestamps should be added as structured CMS fields before pursuing Google Event rich-result eligibility. Structured data does not guarantee a rich result.

The studio has a server-rendered `noindex, nofollow` directive and remains crawlable so search engines can see it. It is excluded from the sitemap. Disabled blog and missing content routes return 404 with `noindex`. Robots rules are not authentication or access control.

## Before and after deployment

1. Confirm the production origin and deploy the changes.
2. Verify the domain in Google Search Console and Bing Webmaster Tools. DNS verification works independently of the app. Optional HTML-token verification uses `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` (rebuild after changing).
3. Submit the production `/sitemap.xml`; inspect the home page and an event URL with Search Console URL Inspection and Google's Rich Results Test.
4. Review social previews using the sharing debuggers of the platforms you use; platforms may retain old images until re-scraped.
5. Monitor indexing, search queries, impressions and Core Web Vitals. Continue publishing original, useful bamboo and rattan content and earn relevant links. Metadata alone cannot guarantee rankings.

## Verification

Run `npm run check:seo` for shared metadata checks, `npx tsc --noEmit` for type checking, and `npm run build` for the production build. With a production server running, use `SEO_TEST_URL=http://localhost:3200 npm run check:seo` to inspect every sitemap page, metadata, structured data, missing/disabled routes, studio indexing and generated PNG dimensions.

References: [Google title links](https://developers.google.com/search/docs/appearance/title-link), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Organization data](https://developers.google.com/search/docs/appearance/structured-data/organization), [Event data](https://developers.google.com/search/docs/appearance/structured-data/event), and [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

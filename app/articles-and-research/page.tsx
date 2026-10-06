import { breadcrumbs, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { client } from "@/sanity/client";
import { RESEARCH_ITEMS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { ResearchItem, SiteSettings } from "@/sanity/types";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "Articles and Research | SRINBAR",
  description: "Articles and research on bamboo and rattan, collected by SRINBAR.",
  path: "/articles-and-research",
});

export default async function ArticlesAndResearchPage() {
  const liveClient = client.withConfig({ useCdn: false });
  const [items, settings] = await Promise.all([
    liveClient.fetch<ResearchItem[]>(RESEARCH_ITEMS_QUERY),
    liveClient.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
  ]);

  return (
    <div className="research-page">
      <JsonLd data={breadcrumbs([{ name: "Articles and Research", path: "/articles-and-research" }])} />
      <SiteNav active="Articles and Research" />
      <main className="research-shell">
        <header className="research-heading">
          <h1>Articles and Research</h1>
          <p>A collection of independently published articles, research and conversations by, about and featuring SRINBAR members, exploring bamboo, rattan and related fields.</p>
        </header>
        {items?.length ? (
          <div className="research-grid">
            {items.map((item) => (
              <article key={item._id} className="research-card">
                <div className="research-card-meta">
                  {item.publisher && <span>{item.publisher}</span>}
                  {item.accessLabel && <span className="research-access">{item.accessLabel}</span>}
                </div>
                <h2>{item.title}</h2>
                {item.authors && <p className="research-authors">By {item.authors}</p>}
                <a className="research-card-link" href={item.url} target="_blank" rel="noopener noreferrer">
                  Read article <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className="research-empty">Articles and research will be added here.</p>
        )}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

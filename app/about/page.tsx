import { pageMetadata, breadcrumbs } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { client, urlFor, fetchOptions } from "@/sanity/client";
import {
  ABOUT_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/queries";
import type { AboutPage, SiteSettings } from "@/sanity/types";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "About SRINBAR & Our Bamboo and Rattan Mission",
  description: "Learn about SRINBAR’s story and work advancing bamboo and rattan in Sri Lanka.",
  path: "/about",
});

export default async function AboutPageRoute() {
  const [about, settings] = await Promise.all([
    client.fetch<AboutPage>(ABOUT_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
  ]);

  return (
    <div className="about-page">
      <JsonLd data={breadcrumbs([{ name: "About Us", path: "/about" }])} />
      <SiteNav active="About Us" />
      <main className="about-shell">
        <header className="about-hero">
          {about?.heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlFor(about.heroImage.asset).width(1800).url()}
              alt={about.heroImage.alt}
              className="about-hero-image"
              fetchPriority="high"
            />
          )}
          <div className="about-hero-shade" aria-hidden="true" />
          <div className="about-hero-copy">
            <h1>{about?.heroHeading}</h1>
          </div>
        </header>

        <section className="about-story" aria-labelledby="story-heading">
          <div className="about-section-label">
            <span className="about-heading-accent" aria-hidden="true" />
            <h2 id="story-heading">{about?.storyHeading}</h2>
          </div>
          <div className="about-story-copy">
            {(about?.storyParagraphs ?? []).map((text, index) => (
              <p key={index} className={index === 0 ? "about-story-lead" : undefined}>{text}</p>
            ))}
          </div>
        </section>

      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

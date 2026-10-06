import { pageMetadata, breadcrumbs } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdvisoryCard from "@/components/AdvisoryCard";
import { client, urlFor, fetchOptions } from "@/sanity/client";
import {
  ABOUT_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  TEAM_QUERY,
} from "@/sanity/queries";
import type { AboutPage, SiteSettings, TeamMember } from "@/sanity/types";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "About SRINBAR & Our Bamboo and Rattan Mission",
  description: "Meet Sri Lanka’s network of bamboo and rattan scientists, growers and artisans. Learn about SRINBAR’s mission, history and executive committee.",
  path: "/about",
});

export default async function AboutPageRoute() {
  const [about, settings, team] = await Promise.all([
    client.fetch<AboutPage>(ABOUT_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
    client.fetch<TeamMember[]>(TEAM_QUERY, {}, fetchOptions),
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
            <p className="eyebrow">{about?.heroEyebrow}</p>
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

        <section id="team" className="about-committee" aria-labelledby="committee-heading">
          <div className="about-committee-heading">
            <div>
              <p className="eyebrow">{about?.teamEyebrow}</p>
              <h2 id="committee-heading">{about?.teamHeading}</h2>
            </div>
            {about?.teamIntro && <p className="about-section-intro">{about.teamIntro}</p>}
          </div>
          <div className="advisory-grid">
            {(team ?? []).map(({ _id, image, name, role, bio, expertise }) => (
              <AdvisoryCard
                key={_id}
                name={name}
                role={role}
                bio={bio}
                expertise={expertise}
                imageUrl={image?.asset ? urlFor(image.asset).width(480).height(600).url() : undefined}
                imageAlt={image?.alt}
              />
            ))}
          </div>
        </section>


      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

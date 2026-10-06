import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "About Us — SRINBAR",
  description:
    "SRINBAR — the Lanka Network for Bamboo and Rattan — a network of scientists, growers, and artisans founded in Kandy in 2005.",
};

export default async function AboutPageRoute() {
  const [about, settings, team] = await Promise.all([
    client.fetch<AboutPage>(ABOUT_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
    client.fetch<TeamMember[]>(TEAM_QUERY, {}, fetchOptions),
  ]);

  return (
    <div className="about-page">
      <SiteNav active="About Us" />
      <main className="about-shell">
        <header className="about-hero">
          {about?.heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlFor(about.heroImage.asset).width(1800).url()}
              alt={about.heroImage.alt}
              className="about-hero-image"
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

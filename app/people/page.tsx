import { pageMetadata, breadcrumbs } from "@/lib/seo";
import AdvisoryCard from "@/components/AdvisoryCard";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { client, fetchOptions, urlFor } from "@/sanity/client";
import { FOUNDING_MEMBERS_QUERY, PEOPLE_SECTIONS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { PeopleSection, SiteSettings, TeamMember } from "@/sanity/types";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "People | SRINBAR",
  description: "Meet the people advancing bamboo and rattan in Sri Lanka through SRINBAR.",
  path: "/people",
});

export default async function PeoplePage() {
  const [sections, foundingMembers, settings] = await Promise.all([
    client.fetch<PeopleSection[]>(PEOPLE_SECTIONS_QUERY, {}, fetchOptions),
    client.fetch<TeamMember[]>(FOUNDING_MEMBERS_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
  ]);
  const peopleSections = [
    ...(foundingMembers.length ? [{ _id: "founding-members", title: "Founding Members", members: foundingMembers }] : []),
    ...(sections ?? []),
  ];

  return (
    <div className="about-page">
      <JsonLd data={breadcrumbs([{ name: "People", path: "/people" }])} />
      <SiteNav active="People" />
      <main className="about-shell people-shell">
        <header className="people-page-heading">
          <p className="eyebrow">SRINBAR</p>
          <h1>People</h1>
        </header>
        {peopleSections.map(({ _id, title, members }) => (
          <section key={_id} className="about-committee people-member-section" aria-labelledby={`people-section-${_id}`}>
            <div className="about-committee-heading">
              <h2 id={`people-section-${_id}`}>{title}</h2>
            </div>
            <div className="advisory-grid">
              {members.map(({ _id: memberId, image, name, role, bio, expertise }) => (
                <AdvisoryCard
                  key={memberId}
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
        ))}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

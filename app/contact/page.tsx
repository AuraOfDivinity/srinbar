import { pageMetadata, breadcrumbs } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import InterestForm from "@/components/InterestForm";
import { client, fetchOptions } from "@/sanity/client";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { ContactPageDoc, SiteSettings } from "@/sanity/types";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Contact & Interest",
  description: "Become a SRINBAR member or share your questions and interest in bamboo with Sri Lanka’s bamboo and rattan community.",
  path: "/contact",
});

const DEFAULT_MEMBERSHIP_FORM_URL = "https://forms.gle/sZh9EoQJVEUQrsPT7";

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch<ContactPageDoc>(CONTACT_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
  ]);
  const membershipFormUrl = page?.membershipFormUrl || DEFAULT_MEMBERSHIP_FORM_URL;

  return (
    <div className="contact-page">
      <JsonLd data={breadcrumbs([{ name: "Contact & Interest", path: "/contact" }])} />
      <SiteNav active="Contact" />
      <main className="contact-shell">
        <section id="membership" className="contact-membership-cta" aria-labelledby="membership-cta-heading">
          <h2 id="membership-cta-heading">
            <a
              href={membershipFormUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {page?.membershipHeading || "Become a member"}
            </a>
          </h2>
          <p>
            <a href={membershipFormUrl} target="_blank" rel="noopener noreferrer">
              Click here to become a member.
            </a>
          </p>
        </section>
        <header className="contact-heading">
          <p className="eyebrow">{page?.eyebrow}</p>
          <h1>Queries</h1>
          <p>{page?.intro}</p>
        </header>
        <section id="queries" className="contact-form-panel" aria-labelledby="queries-heading">
          <header>
            <h2 id="queries-heading">{page?.formHeading}</h2>
            <p>Tell us a little about yourself and your interest in bamboo. Required fields are marked with an asterisk.</p>
          </header>
          <InterestForm preview={!process.env.GOOGLE_APPS_SCRIPT_URL} />
        </section>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

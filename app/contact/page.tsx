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
  description: "Connect with SRINBAR. Share your questions and interest in bamboo with Sri Lanka’s bamboo and rattan community.",
  path: "/contact",
});

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch<ContactPageDoc>(CONTACT_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
  ]);

  return (
    <div className="contact-page">
      <JsonLd data={breadcrumbs([{ name: "Contact & Interest", path: "/contact" }])} />
      <SiteNav active="Contact" />
      <main className="contact-shell">
        <header className="contact-heading">
          <p className="eyebrow">{page?.eyebrow}</p>
          <h1>{page?.heading}</h1>
          <p>{page?.intro}</p>
        </header>
        <section id="membership" className="contact-form-panel" aria-labelledby="membership-heading">
          <header>
            <h2 id="membership-heading">{page?.formHeading}</h2>
            <p>{page?.formNote}</p>
          </header>
          <InterestForm preview={!process.env.GOOGLE_APPS_SCRIPT_URL} />
        </section>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

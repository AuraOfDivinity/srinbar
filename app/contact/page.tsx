import { pageMetadata, breadcrumbs } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import MembershipForm from "@/components/MembershipForm";
import MembershipInformation from "@/components/MembershipInformation";
import { client, fetchOptions } from "@/sanity/client";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { ContactPageDoc, SiteSettings } from "@/sanity/types";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Contact & Membership",
  description: "Join or renew your SRINBAR membership. Connect with Sri Lanka’s bamboo and rattan community and find membership fees, application details and contacts.",
  path: "/contact",
});

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch<ContactPageDoc>(CONTACT_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
  ]);

  return (
    <div className="contact-page">
      <JsonLd data={breadcrumbs([{ name: "Contact & Membership", path: "/contact" }])} />
      <SiteNav active="Contact" />
      <main className="contact-shell">
        <header className="contact-heading">
          <p className="eyebrow">{page?.eyebrow}</p>
          <h1>{page?.heading}</h1>
          <p>{page?.intro}</p>
        </header>
        <MembershipInformation information={page?.membershipInformation} />
        <section id="membership" className="contact-form-panel" aria-labelledby="membership-heading">
          <header>
            <h2 id="membership-heading">{page?.formHeading}</h2>
            <p>{page?.formNote}</p>
          </header>
          <MembershipForm page={page} preview={!process.env.GOOGLE_APPS_SCRIPT_URL} />
        </section>
        <aside className="contact-membership-help" aria-label="Membership enquiries">
          <h2>Need help with your application?</h2>
          <p>{page?.membershipContactName}{page?.membershipContactRole && ` · ${page.membershipContactRole}`}</p>
          <div>
            {page?.membershipContactPhone && <a href={`tel:${page.membershipContactPhone.replace(/\s/g, "")}`}>{page.membershipContactPhone}</a>}
            {page?.membershipContactEmail && <a href={`mailto:${page.membershipContactEmail}`}>{page.membershipContactEmail}</a>}
          </div>
        </aside>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

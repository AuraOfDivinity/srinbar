import { pageMetadata, breadcrumbs } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import EventCard from "@/components/EventCard";
import { client, fetchOptions } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { getEvents, sortEvents } from "@/lib/events";
import type { SiteSettings } from "@/sanity/types";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Bamboo & Rattan Events in Sri Lanka",
  description: "Explore SRINBAR’s bamboo and rattan exhibitions, lectures and discussions in Sri Lanka. Find upcoming gatherings, past events and available recordings.",
  path: "/events",
});

export default async function EventsPage() {
  const [settings, events] = await Promise.all([
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions), getEvents(),
  ]);
  const { upcoming, past } = sortEvents(events);
  return (
    <div className="events-page">
      <JsonLd data={breadcrumbs([{ name: "Events", path: "/events" }])} />
      <SiteNav active="Events" />
      <main className="events-shell">
        <header className="events-heading">
          <p className="eyebrow">Gather • Learn • Grow</p>
          <h1>Events & conversations</h1>
          <p>Meet the people and ideas shaping Sri Lanka’s bamboo and rattan community. Explore our exhibitions and revisit the SRINBAR lecture series.</p>
        </header>
        <section className="events-section" aria-labelledby="upcoming-heading">
          <div className="events-section-heading"><h2 id="upcoming-heading">Coming together</h2><span className="event-category">Upcoming & ongoing</span></div>
          {upcoming.length ? <div className="events-featured">{upcoming.map(event => <EventCard key={event._id} event={event} featured />)}</div> : <p className="events-empty">New events will be announced here. In the meantime, explore our past gatherings below.</p>}
        </section>
        {past.length > 0 && <section className="events-section" aria-labelledby="past-heading">
          <div className="events-section-heading"><h2 id="past-heading">Past events</h2><span className="event-category">From our community</span></div>
          <div className="events-grid">{past.map(event => <EventCard key={event._id} event={event} />)}</div>
        </section>}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

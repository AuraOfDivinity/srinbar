import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { client, fetchOptions } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { SiteSettings } from "@/sanity/types";
import { getEvents, eventDateLabel, eventStatus } from "@/lib/events";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = (await getEvents()).find(event => event.slug === slug);
  if (!event) return { title: "Event not found — SRINBAR" };
  return { title: `${event.title} — SRINBAR`, description: event.description?.split("\n\n")[0] || event.subtitle || `${event.title} · ${eventDateLabel(event)}`, openGraph: { images: event.poster?.url ? [event.poster.url] : [] } };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = (await getEvents()).find(event => event.slug === slug);
  if (!event) notFound();
  const settings = await client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions);
  const status = eventStatus(event);
  const recordingUrl = event.recordingUrl && /^https?:\/\//i.test(event.recordingUrl) ? event.recordingUrl : undefined;
  return (
    <div className="events-page">
      <SiteNav active="Events" />
      <main className="events-shell">
        <Link href="/events" className="arrow-link event-back">← All events</Link>
        <article className={`event-detail${event.poster?.url ? "" : " event-detail--no-poster"}`}>
          {event.poster?.url && <div className="event-detail-poster">
            <a href={event.poster.url} target="_blank" rel="noreferrer" aria-label={`Open full-size poster for ${event.title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.poster.url} alt={event.poster.alt || `${event.title} event poster`} />
            </a>
            <p>Event poster · Select to view full size</p>
          </div>}
          <div className="event-detail-copy">
            <div className="event-card-topline">{event.category && <p className="event-category">{event.category}</p>}<span className={`chip${status === "Past event" ? " chip--muted" : ""}`}>{status}</span></div>
            <h1>{event.title}</h1>
            {event.subtitle && <p className="event-detail-subtitle">{event.subtitle}</p>}
            <dl className="event-facts">
              <div><dt>Date</dt><dd>{eventDateLabel(event)}</dd></div>
              {event.timeLabel && <div><dt>Time</dt><dd>{event.timeLabel} <span className="event-timezone">(Sri Lanka time)</span></dd></div>}
              {event.location && <div><dt>Venue</dt><dd>{event.location}</dd></div>}
              {event.speaker && <div><dt>Speaker</dt><dd>{event.speaker}{event.speakerRole && <span className="event-speaker-role">{event.speakerRole}</span>}</dd></div>}
            </dl>
            {event.description && <section className="event-description" aria-labelledby="about-event"><h2 id="about-event">About this event</h2>{event.description.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>}
            {event.contactPhone && <div className="event-inquiries"><h2>For inquiries</h2><a className="text-link" href={`tel:${event.contactPhone.replace(/[^+\d]/g, "")}`}>{event.contactName ? `${event.contactName} · ` : ""}{event.contactPhone}</a></div>}
            {recordingUrl && <section className="event-recording"><h2>Event recording</h2><a className="btn btn--primary" href={recordingUrl} target="_blank" rel="noreferrer">Watch recording ↗</a></section>}
          </div>
        </article>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

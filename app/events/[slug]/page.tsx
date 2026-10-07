import { pageMetadata, breadcrumbs, absoluteUrl, metaDescription } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { client, fetchOptions } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { SiteSettings } from "@/sanity/types";
import { youtubeVideoId } from "@/lib/youtube";
import { getEvents, eventDateLabel, eventStatus } from "@/lib/events";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = (await getEvents()).find(event => event.slug === slug);
  if (!event) notFound();
  return pageMetadata({
    title: event.title,
    description: event.description || `${event.title}${event.subtitle ? `: ${event.subtitle}` : ""}. ${eventDateLabel(event)}${event.location ? ` at ${event.location}` : ""}. Explore this SRINBAR bamboo and rattan event.`,
    path: `/events/${encodeURIComponent(event.slug)}`,
    image: event.poster?.url ? { url: event.poster.url, alt: event.poster.alt || `${event.title} event poster` } : undefined,
  });
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = (await getEvents()).find(event => event.slug === slug);
  if (!event) notFound();
  const settings = await client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions);
  const status = eventStatus(event);
  const recordingUrl = event.recordingUrl && /^https?:\/\//i.test(event.recordingUrl) ? event.recordingUrl : undefined;
  const videoId = youtubeVideoId(recordingUrl);
  return (
    <div className="events-page">
      <JsonLd data={[
        breadcrumbs([{ name: "Events", path: "/events" }, { name: event.title, path: `/events/${encodeURIComponent(event.slug)}` }]),
        { "@context": "https://schema.org", "@type": "Event",
          "@id": absoluteUrl(`/events/${encodeURIComponent(event.slug)}#event`),
          name: event.title, url: absoluteUrl(`/events/${encodeURIComponent(event.slug)}`),
          description: metaDescription(event.description || event.subtitle || event.title),
          startDate: event.date, endDate: event.endDate || undefined,
          image: event.poster?.url ? [absoluteUrl(event.poster.url)] : undefined,
          // Do not infer addresses, ticket prices or online attendance URLs.
          location: event.location && !/online|virtual|zoom/i.test(event.location)
            ? { "@type": "Place", name: event.location } : undefined,
        },
      ]} />
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
            {recordingUrl && <section className="event-recording" aria-labelledby="event-recording-heading">
              <h2 id="event-recording-heading">Event recording</h2>
              {videoId ? <a className="event-recording-card" href={recordingUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${event.title} recording on YouTube (opens in a new tab)`}>
                <div className="event-recording-thumbnail">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt={`Session recording: ${event.title}`} width={480} height={360} loading="lazy" />
                  <span className="event-recording-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m9 5 11 7-11 7V5Z" /></svg></span>
                </div>
                <span className="event-recording-caption">Watch recording on YouTube ↗</span>
              </a> : <a className="btn btn--primary" href={recordingUrl} target="_blank" rel="noopener noreferrer">Watch recording ↗</a>}
            </section>}
          </div>
        </article>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

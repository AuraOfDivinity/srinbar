import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import EventCard from "@/components/EventCard";
import { client, fetchOptions } from "@/sanity/client";
import {
  EVENTS_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  UPCOMING_EVENTS_QUERY,
  PAST_EVENTS_QUERY,
} from "@/sanity/queries";
import { eventMonthDay } from "@/lib/format";
import type { EventsPageDoc, SiteSettings, EventDoc } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events — SRINBAR",
  description:
    "Workshops, field days & assemblies. Most events are free for members and open to the public.",
};

export default async function EventsPage() {
  const [page, settings, upcoming, past] = await Promise.all([
    client.fetch<EventsPageDoc>(EVENTS_PAGE_QUERY, {}, fetchOptions),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, fetchOptions),
    client.fetch<EventDoc[]>(UPCOMING_EVENTS_QUERY, {}, fetchOptions),
    client.fetch<EventDoc[]>(PAST_EVENTS_QUERY, {}, fetchOptions),
  ]);

  return (
    <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <SiteNav active="Events" />

      <section
        aria-label="Events header"
        style={{ padding: "clamp(48px, 6vw, 80px) clamp(20px, 4vw, 32px) 0" }}
      >
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
            {page?.eyebrow}
          </p>
          <h1
            style={{
              font: "var(--type-h1)",
              fontSize: "clamp(34px, 4.5vw, 48px)",
              color: "var(--text-body)",
              marginBottom: "var(--space-4)",
            }}
          >
            {page?.heading}
          </h1>
          <p
            style={{
              font: "var(--type-body-lg)",
              color: "var(--text-muted)",
              maxWidth: 620,
              textWrap: "pretty",
            }}
          >
            {page?.intro}
          </p>
        </div>
      </section>

      <section
        aria-label="Upcoming events"
        style={{ padding: "clamp(40px, 5vw, 64px) clamp(20px, 4vw, 32px) 0" }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2
            style={{
              font: "var(--type-h2)",
              fontSize: "clamp(26px, 3vw, 36px)",
              color: "var(--text-body)",
              marginBottom: "var(--space-5)",
            }}
          >
            Upcoming
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {(upcoming ?? []).map((event) => {
              const { month, day } = eventMonthDay(event.date);
              return (
                <EventCard
                  key={event._id}
                  month={month}
                  day={day}
                  title={event.title}
                  location={event.location}
                  time={event.timeLabel}
                />
              );
            })}
          </div>
          <p
            style={{
              font: "var(--type-caption)",
              color: "var(--text-muted)",
              marginTop: "var(--space-4)",
              textWrap: "pretty",
            }}
          >
            {page?.registrationNote}
          </p>
        </div>
      </section>

      <section
        aria-label="Past events"
        style={{
          padding:
            "clamp(48px, 6vw, 80px) clamp(20px, 4vw, 32px) clamp(64px, 8vw, 96px)",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2
            style={{
              font: "var(--type-h2)",
              fontSize: "clamp(26px, 3vw, 36px)",
              color: "var(--text-body)",
              marginBottom: "var(--space-2)",
            }}
          >
            Past events
          </h2>
          <p
            style={{
              font: "var(--type-caption)",
              color: "var(--text-muted)",
              marginBottom: "var(--space-5)",
            }}
          >
            {page?.pastEventsNote}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {(past ?? []).map((event) => {
              const { month, day } = eventMonthDay(event.date);
              return (
                <EventCard
                  key={event._id}
                  month={month}
                  day={day}
                  title={event.title}
                  location={event.location}
                  time={event.timeLabel}
                  past
                />
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </div>
  );
}

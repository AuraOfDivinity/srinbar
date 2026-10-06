import { Link } from "next-view-transitions";
import { eventDateLabel, eventStatus } from "@/lib/events";
import type { EventDoc } from "@/sanity/types";

export default function EventCard({ event, featured = false }: { event: EventDoc; featured?: boolean }) {
  const status = eventStatus(event);
  const isPast = status === "Past event";
  return (
    <Link href={`/events/${event.slug}`} className={`event-card${featured ? " event-card--featured" : ""}`}>
      {event.poster?.url && (
        <div className="event-card-poster">
          {/* Posters contain text: preserve the entire artwork. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.poster.url} alt={event.poster.alt || `${event.title} event poster`} loading="lazy" width={1080} height={1350} />
        </div>
      )}
      <div className="event-card-copy">
        <div className="event-card-topline">
          {event.category && <span className="event-category">{event.category}</span>}
          <span className={`chip ${isPast ? "chip--past" : "chip--upcoming"}`}>{status}</span>
        </div>
        <p className="event-card-date">{eventDateLabel(event)}</p>
        <h3>{event.title}</h3>
        {event.subtitle && <p className="event-card-subtitle">{event.subtitle}</p>}
        {event.speaker && <p className="event-card-meta">With {event.speaker}</p>}
        {event.location && <p className="event-card-meta">{event.location}</p>}
        {event.timeLabel && <p className="event-card-meta">{event.timeLabel}</p>}
        {featured && event.description && <p className="event-card-summary">{event.description.split("\n\n")[0]}</p>}
        <span className="event-card-link">View event <span aria-hidden="true">↗</span></span>
      </div>
    </Link>
  );
}

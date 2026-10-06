import { cache } from "react";
import { client, fetchOptions } from "@/sanity/client";
import { EVENTS_QUERY } from "@/sanity/queries";
import type { EventDoc } from "@/sanity/types";

export const getEvents = cache(() => client.withConfig({ useCdn: false }).fetch<EventDoc[]>(EVENTS_QUERY, {}, fetchOptions));

export function eventStatus(event: Pick<EventDoc, "date" | "endDate">, now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  if ((event.endDate || event.date) < today) return "Past event";
  return event.date > today ? "Upcoming" : "Happening now";
}

export function sortEvents(events: EventDoc[], now = new Date()) {
  const upcoming = events.filter(event => eventStatus(event, now) !== "Past event").sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter(event => eventStatus(event, now) === "Past event").sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

export function eventDateLabel(event: Pick<EventDoc, "date" | "endDate">) {
  const format = (date: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Colombo" }).format(new Date(`${date}T00:00:00+05:30`));
  if (!event.endDate || event.endDate === event.date) return format(event.date);
  if (event.date.slice(0, 7) === event.endDate.slice(0, 7)) return `${Number(event.date.slice(-2))}–${format(event.endDate)}`;
  return `${format(event.date)} – ${format(event.endDate)}`;
}

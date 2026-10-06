import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { projectId, dataset, apiVersion } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Revalidate all Sanity-backed pages every 60s; drop to 0 while developing.
  perspective: "published",
});

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").quality(80);
}

/** Shared fetch options — ISR every 60 seconds. */
export const fetchOptions = { next: { revalidate: 60 } };

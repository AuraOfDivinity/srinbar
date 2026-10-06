/** Targeted event import: preserves unrelated content and archives only known sample events. */
import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'node:fs';
import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
// SDK errors include request headers; never print raw errors with credentials.
process.on('uncaughtException', error => { console.error(`Event import failed: ${error.message}`); process.exit(1); });
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2026-07-06', useCdn: false,
});
if (!process.env.SANITY_WRITE_TOKEN) throw new Error('SANITY_WRITE_TOKEN is required');
const events = JSON.parse(readFileSync(new URL('../lib/events-content.json', import.meta.url), 'utf8'));
const sampleTitles = [
  'Bamboo Nursery & Planting Workshop', "Annual Members' Assembly", 'Riverbank Restoration Field Day',
  'Entrepreneurship Clinic: Pricing & Markets', 'Craft Cooperative Showcase',
  'Bamboo Charcoal Production Demonstration', 'Community Riverbank Planting Day', 'Rattan Weaving Skills Workshop',
];
const sampleIds = sampleTitles.map(title => `event-${title.toLowerCase().replace(/[^a-z]+/g, '-').slice(0, 60)}`);
const oldEvents = await client.fetch('*[_type == "event" && _id in $ids]{_id}', { ids: sampleIds });
let transaction = client.transaction();
for (const { slug, posterFile, ...event } of events) {
  const file = new URL(`../public/events/${posterFile}`, import.meta.url);
  if (!existsSync(file)) throw new Error(`Missing poster: ${posterFile}`);
  const asset = await client.assets.upload('image', readFileSync(file), { filename: posterFile });
  transaction = transaction.createIfNotExists({
    _id: `event-${slug}`, _type: 'event', ...event, slug: { _type: 'slug', current: slug },
    poster: { _type: 'image', alt: `${event.title} — SRINBAR event poster`, asset: { _type: 'reference', _ref: asset._id } },
  });
}
for (const event of oldEvents) transaction = transaction.patch(event._id, patch => patch.set({ archived: true }));
await transaction.commit();
console.log(`Imported ${events.length} events; archived ${oldEvents.length} sample events. Existing real events are preserved.`);

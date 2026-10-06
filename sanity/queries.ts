import { groq } from "next-sanity";

const IMAGE = `{ "url": asset->url + "?auto=format", alt, hotspot, crop, asset }`;

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  siteTitle, seoDescription, organisationName,
  addressLines, email, phone, officeHours, mapNote,
  footerBlurb, copyright, footerTagline,
  footerColumns[]{ heading, links[]{ label, href } },
  newsletterHeading, newsletterBody
}`;

export const HOME_PAGE_QUERY = groq`*[_type == "homePage"][0]{
  heroEyebrow, heroHeading, heroSubheading,
  heroImage ${IMAGE},
  heroPrimaryCta{ label, href }, heroSecondaryCta{ label, href },
  programmesEyebrow, programmesHeading,
  programmes[]{ title, body, image ${IMAGE} },
  blogSectionHeading, eventsSectionHeading,
  membershipHeading, membershipBody, membershipCta{ label, href }
}`;

export const ABOUT_PAGE_QUERY = groq`*[_type == "aboutPage"][0]{
  heroEyebrow, heroHeading, heroImage ${IMAGE},
  storyHeading, storyParagraphs
}`;

export const BLOG_PAGE_QUERY = groq`*[_type == "blogPage"][0]{
  eyebrow, heading, intro, emptyStateHeading, emptyStateBody
}`;

export const EVENTS_PAGE_QUERY = groq`*[_type == "eventsPage"][0]{
  eyebrow, heading, intro, registrationNote, pastEventsNote
}`;

export const CONTACT_PAGE_QUERY = groq`*[_type == "contactPage"][0]{
  eyebrow, heading, intro, formHeading, formNote,
  membershipInformation[]{ language, title, body },
  fees[]{ category, currency, enrollment, annual }, paymentNote,
  bankAccountName, bankAccountNumber, bankName, bankBranch,
  membershipContactName, membershipContactRole, membershipContactPhone, membershipContactEmail
}`;

export const PEOPLE_SECTIONS_QUERY = groq`*[_type == "peopleSection" && active != false] | order(order asc){
  _id, title, order,
  "members": *[_type == "teamMember" && active != false && section._ref == ^._id] | order(order asc){
    _id, name, role, bio, expertise, image ${IMAGE}
  }
}`;

export const FOUNDING_MEMBERS_QUERY = groq`*[_type == "teamMember" && active != false && !defined(section)] | order(order asc){
  _id, name, role, bio, expertise, image ${IMAGE}
}`;

export const RESEARCH_ITEMS_QUERY = groq`*[_type == "researchItem" && active != false] | order(order asc, publishedAt desc){
  _id, title, authors, publisher, url, accessLabel, publishedAt
}`;

export const CATEGORIES_QUERY = groq`*[_type == "category"] | order(order asc){
  _id, title
}`;

const POST_CARD = `{
  _id, title, "slug": slug.current, excerpt, publishedAt, featured, readTime,
  "category": category->title,
  mainImage ${IMAGE}
}`;

export const POSTS_QUERY = groq`*[_type == "post" && archived != true] | order(publishedAt desc) ${POST_CARD}`;

export const LATEST_POSTS_QUERY = groq`*[_type == "post" && archived != true] | order(publishedAt desc)[0...3] ${POST_CARD}`;

export const FEATURED_POST_QUERY = groq`*[_type == "post" && archived != true && featured == true] | order(publishedAt desc)[0] {
  _id, title, "slug": slug.current, excerpt, publishedAt, readTime,
  "category": category->title,
  mainImage ${IMAGE},
  author->{ name }
}`;

export const POST_BY_SLUG_QUERY = groq`*[_type == "post" && archived != true && slug.current == $slug][0]{
  _id, _updatedAt, title, "slug": slug.current, excerpt, publishedAt, readTime, tags,
  "category": category->title,
  mainImage ${IMAGE}, mainImageCaption,
  author->{ name, bio, image ${IMAGE} },
  body[]{
    ...,
    _type == "image" => { "url": asset->url, alt, caption, asset }
  },
  "related": *[_type == "post" && archived != true && slug.current != $slug] | order(publishedAt desc)[0...3] ${POST_CARD}
}`;

export const POST_SLUGS_QUERY = groq`*[_type == "post" && archived != true && defined(slug.current)][].slug.current`;

// Date-only events are classified in Sri Lanka time by the shared event helper.
export const EVENTS_QUERY = groq`*[_type == "event" && archived != true && defined(slug.current)] | order(date desc){
  _id, title, "slug": slug.current, subtitle, category, date, endDate,
  timeLabel, location, description, speaker, speakerRole, recordingUrl,
  contactName, contactPhone, poster ${IMAGE}
}`;

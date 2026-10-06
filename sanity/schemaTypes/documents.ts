import { defineField, defineType } from "sanity";

/* ---------- Site-wide (singleton) ---------- */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand & SEO" },
    { name: "contact", title: "Contact info" },
    { name: "footer", title: "Footer" },
    { name: "shared", title: "Shared sections" },
  ],
  fields: [
    defineField({ name: "siteTitle", type: "string", group: "brand", validation: (r) => r.required() }),
    defineField({ name: "seoDescription", type: "text", rows: 2, group: "brand" }),
    defineField({ name: "organisationName", type: "string", group: "brand", description: "e.g. Lanka Network for Bamboo and Rattan" }),

    defineField({ name: "addressLines", type: "array", of: [{ type: "string" }], group: "contact" }),
    defineField({ name: "email", type: "string", group: "contact" }),
    defineField({ name: "phone", type: "string", group: "contact" }),
    defineField({ name: "officeHours", type: "string", group: "contact" }),
    defineField({ name: "mapNote", type: "string", group: "contact", description: "Text shown in the map placeholder" }),

    defineField({ name: "footerBlurb", type: "text", rows: 2, group: "footer" }),
    defineField({ name: "footerColumns", type: "array", of: [{ type: "footerColumn" }], group: "footer" }),
    defineField({ name: "copyright", type: "string", group: "footer" }),
    defineField({ name: "footerTagline", type: "string", group: "footer", description: "e.g. Kandy, Sri Lanka" }),

    defineField({ name: "newsletterHeading", type: "string", group: "shared" }),
    defineField({ name: "newsletterBody", type: "text", rows: 2, group: "shared" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

/* ---------- Pages (singletons) ---------- */

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "programmes", title: "Programmes" },
    { name: "sections", title: "Other sections" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroHeading", type: "string", group: "hero", validation: (r) => r.required() }),
    defineField({ name: "heroSubheading", type: "text", rows: 2, group: "hero" }),
    defineField({ name: "heroImage", type: "siteImage", group: "hero", validation: (r) => r.required() }),
    defineField({ name: "heroPrimaryCta", type: "cta", group: "hero" }),
    defineField({ name: "heroSecondaryCta", type: "cta", group: "hero" }),

    defineField({ name: "programmesEyebrow", type: "string", group: "programmes" }),
    defineField({ name: "programmesHeading", type: "string", group: "programmes" }),
    defineField({ name: "programmes", type: "array", of: [{ type: "programme" }], group: "programmes" }),

    defineField({ name: "blogSectionHeading", type: "string", group: "sections" }),
    defineField({ name: "eventsSectionHeading", type: "string", group: "sections" }),
    defineField({ name: "membershipHeading", type: "string", group: "sections" }),
    defineField({ name: "membershipBody", type: "text", rows: 3, group: "sections" }),
    defineField({ name: "membershipCta", type: "cta", group: "sections" }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "story", title: "Our story" },
    { name: "team", title: "Team section" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroHeading", type: "string", group: "hero", validation: (r) => r.required() }),
    defineField({ name: "heroImage", type: "siteImage", group: "hero" }),

    defineField({ name: "storyHeading", type: "string", group: "story" }),
    defineField({ name: "storyParagraphs", type: "array", of: [{ type: "text", rows: 4 }], group: "story" }),

    defineField({ name: "teamEyebrow", type: "string", group: "team" }),
    defineField({ name: "teamHeading", type: "string", group: "team" }),
    defineField({ name: "teamIntro", type: "text", rows: 3, group: "team" }),

  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({ name: "emptyStateHeading", type: "string" }),
    defineField({ name: "emptyStateBody", type: "text", rows: 2 }),
  ],
  preview: { prepare: () => ({ title: "Blog Page" }) },
});

export const eventsPage = defineType({
  name: "eventsPage",
  title: "Events Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({ name: "registrationNote", type: "text", rows: 3 }),
    defineField({ name: "pastEventsNote", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Events Page" }) },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({ name: "formHeading", type: "string" }),
    defineField({ name: "formNote", type: "text", rows: 2 }),
    defineField({ name: "membershipInformation", type: "array", of: [{ type: "object", name: "membershipInformation", fields: [
      defineField({ name: "language", type: "string", options: { list: ["en", "si", "ta"] } }),
      defineField({ name: "title", type: "string" }),
      defineField({ name: "body", type: "text", rows: 8 }),
    ] }] }),
    defineField({ name: "fees", type: "array", of: [{ type: "object", name: "membershipFee", fields: [
      defineField({ name: "category", type: "string", options: { list: ["Individual", "Corporate", "SME", "International"] } }),
      defineField({ name: "currency", type: "string", options: { list: ["LKR", "USD"] } }),
      defineField({ name: "enrollment", type: "number", validation: (r) => r.min(0) }),
      defineField({ name: "annual", type: "number", validation: (r) => r.min(0) }),
    ] }] }),
    defineField({ name: "paymentNote", type: "text", rows: 3 }),
    defineField({ name: "bankAccountName", type: "string" }),
    defineField({ name: "bankAccountNumber", type: "string" }),
    defineField({ name: "bankName", type: "string" }),
    defineField({ name: "bankBranch", type: "string" }),
    defineField({ name: "membershipContactName", type: "string" }),
    defineField({ name: "membershipContactRole", type: "string" }),
    defineField({ name: "membershipContactPhone", type: "string" }),
    defineField({ name: "membershipContactEmail", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});

/* ---------- Collections ---------- */

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", description: "Sort order for the filter pills" }),
  ],
});

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "bio", type: "text", rows: 3 }),
    defineField({ name: "image", type: "siteImage" }),
  ],
  preview: { select: { title: "name", media: "image" } },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "image", type: "siteImage" }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "bio", title: "Biography", type: "text", rows: 8 }),
    defineField({ name: "expertise", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "active", title: "Show on website", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "archived", type: "boolean", initialValue: false, description: "Hide this entry from the website while preserving its content." }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }], validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "publishedAt", type: "date", validation: (r) => r.required() }),
    defineField({ name: "mainImage", type: "siteImage", validation: (r) => r.required() }),
    defineField({ name: "mainImageCaption", type: "string" }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "featured", type: "boolean", initialValue: false, description: "Show as the featured post on the blog index" }),
    defineField({ name: "readTime", type: "string", description: "e.g. 6 min read" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "body", type: "postBody" }),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "mainImage" },
  },
});

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "archived", type: "boolean", initialValue: false, description: "Hide this entry from the website while preserving its content." }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "timeLabel", type: "string", description: 'e.g. "9:00 AM – 3:00 PM" or "All day"' }),
    defineField({ name: "location", type: "string", validation: (r) => r.required() }),
  ],
  orderings: [
    {
      title: "Date, soonest first",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "date" } },
});

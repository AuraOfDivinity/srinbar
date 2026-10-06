import type { SanityImageSource } from "@sanity/image-url";

export type SiteImage = {
  url: string;
  alt: string;
  asset: SanityImageSource;
  hotspot?: unknown;
  crop?: unknown;
};

export type Cta = { label: string; href: string };
export type LinkItem = { label: string; href: string };
export type FooterColumn = { heading: string; links: LinkItem[] };

export type SiteSettings = {
  siteTitle: string;
  seoDescription?: string;
  organisationName?: string;
  addressLines?: string[];
  email?: string;
  phone?: string;
  officeHours?: string;
  mapNote?: string;
  footerBlurb?: string;
  footerColumns?: FooterColumn[];
  copyright?: string;
  footerTagline?: string;
  newsletterHeading?: string;
  newsletterBody?: string;
};

export type Programme = { title: string; body: string; image: SiteImage };

export type HomePage = {
  heroEyebrow?: string;
  heroHeading: string;
  heroSubheading?: string;
  heroImage: SiteImage;
  heroPrimaryCta?: Cta;
  heroSecondaryCta?: Cta;
  programmesEyebrow?: string;
  programmesHeading?: string;
  programmes?: Programme[];
  blogSectionHeading?: string;
  eventsSectionHeading?: string;
  membershipHeading?: string;
  membershipBody?: string;
  membershipCta?: Cta;
};

export type AboutPage = {
  heroEyebrow?: string;
  heroHeading: string;
  heroImage?: SiteImage;
  storyHeading?: string;
  storyParagraphs?: string[];
  teamEyebrow?: string;
  teamHeading?: string;
  teamIntro?: string;
};

export type BlogPageDoc = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  emptyStateHeading?: string;
  emptyStateBody?: string;
};

export type EventsPageDoc = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  registrationNote?: string;
  pastEventsNote?: string;
};

export type MembershipFee = { category: string; currency: string; enrollment: number; annual: number };

export type ContactPageDoc = {
  membershipInformation?: { language: string; title: string; body: string }[];
  fees?: MembershipFee[];
  paymentNote?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  membershipContactName?: string;
  membershipContactRole?: string;
  membershipContactPhone?: string;
  membershipContactEmail?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  formHeading?: string;
  formNote?: string;
};

export type TeamMember = {
  bio?: string;
  expertise?: string[];
  _id: string;
  name: string;
  role: string;
  image?: SiteImage;
};

export type Category = { _id: string; title: string };

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  featured?: boolean;
  readTime?: string;
  category: string;
  mainImage: SiteImage;
};

export type FeaturedPost = PostCard & { author?: { name: string } };

export type PortableBlock = Record<string, unknown> & { _type: string; _key: string };

export type Post = PostCard & {
  _updatedAt?: string;
  mainImageCaption?: string;
  tags?: string[];
  author?: { name: string; bio?: string; image?: SiteImage };
  body?: PortableBlock[];
  related?: PostCard[];
};

export type EventDoc = {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  date: string;
  endDate?: string;
  timeLabel?: string;
  location?: string;
  poster?: SiteImage;
  description?: string;
  speaker?: string;
  speakerRole?: string;
  recordingUrl?: string;
  contactName?: string;
  contactPhone?: string;
};

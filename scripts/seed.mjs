/**
 * Seed script — populates Sanity with the site's current static content,
 * including uploading all images to Sanity's asset store.
 *
 * Usage:
 *   SANITY_PROJECT_ID=xxx SANITY_DATASET=production SANITY_WRITE_TOKEN=sk... node scripts/seed.mjs
 * (or put those in .env.local and run: npm run seed)
 *
 * Idempotent: uses fixed _ids + createOrReplace, so re-running overwrites
 * the seeded documents instead of duplicating them.
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const programmeContent = JSON.parse(readFileSync(new URL("../lib/programmes.json", import.meta.url), "utf8"));

// --- lightweight .env.local loader (no dotenv dependency) ---
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const projectId =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing config. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN (in .env.local or the environment).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-06",
  useCdn: false,
});

/* ------------------------------------------------------------------ */
/* 1. Upload images                                                    */
/* ------------------------------------------------------------------ */

const IMAGES = {
  bodinagala: {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Bodinagala_Forest_Reserve%2C_Sri_Lanka.jpg",
    filename: "bodinagala-forest-reserve.jpg",
    alt: "Sunlit forest canopy at Bodinagala Forest Reserve, Sri Lanka",
  },
  labugama: {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Labugama_-_Kalatuwawa_Forest_Reserve%2C_Sri_Lanka.jpg",
    filename: "labugama-kalatuwawa-forest-reserve.jpg",
    alt: "Riverbank vegetation at Labugama–Kalatuwawa Forest Reserve under soft daylight",
  },
  bambooPlum: {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Bamboo_and_plum_tree.jpg",
    filename: "bamboo-and-plum-tree.jpg",
    alt: "Slender bamboo culms beside a flowering plum tree in warm afternoon light",
  },
  arashiyamaTall: {
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Bamboo_forest_arashiyama.jpg",
    filename: "bamboo-forest-tall.jpg",
    alt: "Tall bamboo culms rising toward soft daylight in a dense grove",
  },
  arashiyamaPath: {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/83/Arashiyama_Bamboo_Forest_(11096493983).jpg",
    filename: "bamboo-forest-footpath.jpg",
    alt: "A footpath winding through a sun-dappled bamboo forest",
  },
  ellaValley: {
    url: "https://upload.wikimedia.org/wikipedia/commons/9/98/Ella_Valley%2C_Sri_Lanka%2C_Cloud_forest_in_fog.jpg",
    filename: "ella-valley-cloud-forest.jpg",
    alt: "Cloud forest in warm morning fog above Ella Valley, Sri Lanka",
  },
};

const assets = {}; // key -> asset _id

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Download with retries — Wikimedia rate-limits bursts with 429. */
async function download(url, attempts = 5) {
  for (let i = 1; i <= attempts; i++) {
    const res = await fetch(url, {
      headers: { "User-Agent": "srinbar-seed/1.0 (one-time content migration; contact: info@srinbar.org)" },
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if ((res.status === 429 || res.status >= 500) && i < attempts) {
      const retryAfter = Number(res.headers.get("retry-after")) || 0;
      const waitMs = Math.max(retryAfter * 1000, 2000 * 2 ** (i - 1)); // 2s, 4s, 8s, 16s
      console.log(`  ${res.status} received, waiting ${Math.round(waitMs / 1000)}s before retry ${i}/${attempts - 1} ...`);
      await sleep(waitMs);
      continue;
    }
    throw new Error(`Failed to download ${url}: ${res.status}`);
  }
}

async function uploadImages() {
  for (const [key, { url, filename }] of Object.entries(IMAGES)) {
    // Skip if an asset with this original filename already exists
    const existing = await client.fetch(
      `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
      { filename },
    );
    if (existing) {
      assets[key] = existing;
      console.log(`✓ image already uploaded: ${filename}`);
      continue;
    }
    console.log(`↑ uploading ${filename} ...`);
    const buffer = await download(url);
    const asset = await client.assets.upload("image", buffer, { filename });
    assets[key] = asset._id;
    console.log(`✓ uploaded ${filename} → ${asset._id}`);
    await sleep(1500); // be polite to Wikimedia between downloads
  }
}

const img = (key, altOverride) => ({
  _type: "siteImage",
  asset: { _type: "reference", _ref: assets[key] },
  alt: altOverride || IMAGES[key].alt,
});

const plainImg = (key, alt, caption) => ({
  _type: "image",
  _key: `img-${key}-${Math.random().toString(36).slice(2, 8)}`,
  asset: { _type: "reference", _ref: assets[key] },
  alt,
  caption,
});

let keyCounter = 0;
const k = () => `k${(keyCounter++).toString(36).padStart(4, "0")}`;

const block = (text, { style = "normal", children } = {}) => ({
  _type: "block",
  _key: k(),
  style,
  markDefs: [],
  children: children || [{ _type: "span", _key: k(), text, marks: [] }],
});

const span = (text, marks = []) => ({ _type: "span", _key: k(), text, marks });

/* ------------------------------------------------------------------ */
/* 2. Documents                                                        */
/* ------------------------------------------------------------------ */

function buildDocuments() {
  const categories = [
    "Land Restoration",
    "Research",
    "Entrepreneurship",
    "Training",
    "Partnerships",
    "Policy",
  ].map((title, i) => ({
    _id: `category-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`,
    _type: "category",
    title,
    order: i + 1,
  }));

  const catRef = (title) => ({
    _type: "reference",
    _ref: `category-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`,
  });

  const author = {
    _id: "author-a-perera",
    _type: "author",
    name: "Dr. A. Perera",
    bio: "Founding scientist of SRINBAR and plant ecologist at the National Institute of Fundamental Studies, Kandy. Leads the riverbank monitoring programme.",
    image: img("bambooPlum", "Portrait placeholder for Dr. A. Perera"),
  };

  const siteSettings = {
    _id: "siteSettings",
    _type: "siteSettings",
    siteTitle: "SRINBAR — Lanka Network for Bamboo and Rattan",
    seoDescription:
      "Restoring degraded land, stabilising riverbanks, and building bamboo livelihoods across Sri Lanka.",
    organisationName: "Lanka Network for Bamboo and Rattan",
    addressLines: ["National Institute of Fundamental Studies", "Hantana Road, Kandy, Sri Lanka"],
    email: "info@srinbar.org",
    phone: "+94 81 2 232 002",
    officeHours: "Office hours: Monday–Friday, 8:30 AM – 4:30 PM.",
    mapNote: "Embed placeholder — NIFS, Hantana Road, Kandy (7.2716° N, 80.6034° E)",
    footerBlurb:
      "Lanka Network for Bamboo and Rattan — growing a greener, more resilient Sri Lanka since 2005.",
    copyright: "© 2026 SRINBAR — Lanka Network for Bamboo and Rattan",
    footerTagline: "Kandy, Sri Lanka · Member of INBAR",
    footerColumns: [
      {
        _type: "footerColumn",
        _key: k(),
        heading: "About",
        links: [
          { _type: "linkItem", _key: k(), label: "Our Story", href: "/about" },
          { _type: "linkItem", _key: k(), label: "Advisory Committee", href: "/about#team" },
          { _type: "linkItem", _key: k(), label: "INBAR Affiliation", href: "/about#inbar" },
          { _type: "linkItem", _key: k(), label: "Contact", href: "/contact" },
        ],
      },
      {
        _type: "footerColumn",
        _key: k(),
        heading: "Programmes",
        links: [
          { _type: "linkItem", _key: k(), label: "Land Restoration", href: "/#programmes" },
          { _type: "linkItem", _key: k(), label: "Entrepreneurship", href: "/#programmes" },
          { _type: "linkItem", _key: k(), label: "Research & Advocacy", href: "/#programmes" },
          { _type: "linkItem", _key: k(), label: "Training Workshops", href: "/events" },
        ],
      },
      {
        _type: "footerColumn",
        _key: k(),
        heading: "Get Involved",
        links: [
          { _type: "linkItem", _key: k(), label: "Membership", href: "/contact#membership" },
          { _type: "linkItem", _key: k(), label: "Events", href: "/events" },
          { _type: "linkItem", _key: k(), label: "Blog", href: "/blog" },
          { _type: "linkItem", _key: k(), label: "Newsletter", href: "/contact#newsletter" },
        ],
      },
    ],
    stats: [
      { _type: "stat", _key: k(), value: "1,200+", label: "Hectares under bamboo restoration" },
      { _type: "stat", _key: k(), value: "45", label: "Rural entrepreneurs networked" },
      { _type: "stat", _key: k(), value: "18", label: "Districts with active programmes" },
      { _type: "stat", _key: k(), value: "2005", label: "Founded, Kandy" },
    ],
    newsletterHeading: "Stay Rooted",
    newsletterBody:
      "Field updates, events, and entrepreneurship stories — twice a month.",
  };

  const homePage = {
    _id: "homePage",
    _type: "homePage",
    heroEyebrow: "Lanka Network for Bamboo and Rattan",
    heroHeading: "Growing a Greener Lanka",
    heroSubheading:
      "Restoring degraded land, stabilising riverbanks, and building bamboo livelihoods across Sri Lanka.",
    heroImage: img(
      "bodinagala",
      "Dense green canopy of Bodinagala Forest Reserve in warm natural light, Sri Lanka",
    ),
    heroPrimaryCta: { _type: "cta", label: "Become a Member", href: "/contact#membership" },
    heroSecondaryCta: { _type: "cta", label: "Our Programmes", href: "#programmes" },
    programmesEyebrow: programmeContent.eyebrow,
    programmesHeading: programmeContent.heading,
    programmes: programmeContent.items.map((programme, index) => ({
      _type: "programme",
      _key: k(),
      ...programme,
      image: img(["labugama", "bambooPlum", "bodinagala", "labugama"][index]),
    })),
    blogSectionHeading: "From the Blog",
    eventsSectionHeading: "Upcoming Events",
    membershipHeading: "Join the Network",
    membershipBody:
      "Whether you grow, craft, or trade bamboo and rattan — SRINBAR membership connects you to training, markets, and a community of practice.",
    membershipCta: { _type: "cta", label: "Apply for Membership", href: "/contact#membership" },
  };

  const aboutPage = {
    _id: "aboutPage",
    _type: "aboutPage",
    heroEyebrow: "About Us",
    heroHeading: "A network of scientists, growers, and artisans",
    heroImage: img("ellaValley", "Cloud forest in warm morning fog above Ella Valley, Sri Lanka"),
    storyHeading: "Our Story",
    storyParagraphs: [
      "SRINBAR — the Lanka Network for Bamboo and Rattan — was founded in 2005 by scientists at the National Institute of Fundamental Studies, Kandy, to answer a simple question: could bamboo restore Sri Lanka’s degraded land while also building rural livelihoods?",
      "The first plantings went into eroding riverbanks and abandoned chena land in the Kegalle and Ratnapura districts. The bamboo held. Topsoil returned. And the culms it produced found buyers — weavers, furniture makers, charcoal producers.",
      "Two decades on, we are a network connecting researchers, riverbank-restoration teams, and bamboo & rattan entrepreneurs across 18 districts — linked to the wider INBAR community.",
    ],
    mission:
      "To restore degraded land and stabilise riverbanks with bamboo, and to build fair, lasting livelihoods along the bamboo and rattan value chain.",
    vision:
      "A Sri Lanka where bamboo is recognised as a plantation crop — and where every district that grows it also earns from it.",
    teamEyebrow: "Advisory Committee",
    teamHeading: "The people behind the network",
    teamIntro:
      "SRINBAR is guided by an advisory committee of scientists, field coordinators, and entrepreneurs — most of whom have been planting, studying, or weaving bamboo far longer than the network has existed.",
    inbarEyebrow: "Affiliation",
    inbarHeading: "Part of the INBAR community",
    inbarBody:
      "SRINBAR is connected to INBAR — the International Network for Bamboo and Rattan, an intergovernmental organisation of some 50 member states. The affiliation gives Sri Lankan growers and researchers access to regional trials, technical standards, and a market network far beyond the island.",
    inbarCta: { _type: "cta", label: "Work With Us", href: "/contact" },
  };

  const blogPage = {
    _id: "blogPage",
    _type: "blogPage",
    eyebrow: "Blog",
    heading: "Field notes & updates",
    intro:
      "Dispatches from restoration sites, workshops, and the entrepreneurs of the bamboo & rattan value chain.",
    emptyStateHeading: "No posts in this category yet",
    emptyStateBody:
      "New field notes are published every month. Check back soon — or browse everything we have written so far.",
  };

  const eventsPage = {
    _id: "eventsPage",
    _type: "eventsPage",
    eyebrow: "Events",
    heading: "Workshops, field days & assemblies",
    intro:
      "Most events are free for members and open to the public. Registration closes one week before each date — seats at hands-on workshops are limited.",
    registrationNote:
      "Registration is handled through the membership office — the register button will take you to the contact form. Mention the event name in your message.",
    pastEventsNote: "Write-ups and photos from past events appear on the blog.",
  };

  const contactPage = {
    _id: "contactPage",
    _type: "contactPage",
    eyebrow: "Contact & Membership",
    heading: "Join the network",
    intro:
      "Whether you grow, craft, or trade bamboo and rattan — or simply have a question — this is the place to reach us. Membership applications are reviewed monthly.",
    formHeading: "Membership application",
    formNote:
      "All fields except phone are required. We reply to every application, usually within two weeks.",
  };

  const teamMembers = [
    ["Dr. A. Perera", "Founding Scientist, NIFS Kandy", "bambooPlum", "Portrait placeholder — bamboo culms in warm natural light"],
    ["N. Wickramasinghe", "Programme Director", "arashiyamaTall", "Portrait placeholder — tall bamboo grove in soft daylight"],
    ["S. Fernando", "Entrepreneurship Lead", "arashiyamaPath", "Portrait placeholder — footpath through a bamboo forest"],
    ["K. Jayasuriya", "Field Coordinator, Kegalle", "labugama", "Portrait placeholder — riverbank forest at Labugama–Kalatuwawa"],
  ].map(([name, role, imageKey, alt], i) => ({
    _id: `teamMember-${name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
    _type: "teamMember",
    name,
    role,
    order: i + 1,
    image: img(imageKey, alt),
  }));

  /* --- Blog posts --- */

  const featuredBody = [
    block(
      "Every monsoon, the Kalu Ganga takes a little more of its banks with it. Paddy bunds slump, footpaths disappear, and in the worst years whole home gardens slide into the river. Since 2021, SRINBAR’s riverbank programme has been testing a quieter defence: bamboo.",
      { style: "lead" },
    ),
    block(null, {
      children: [
        span("Unlike hard revetments of stone or concrete, a bamboo hedge does not resist the river so much as hold the soil together against it. A single mature clump of "),
        span("Bambusa vulgaris", ["em"]),
        span(" anchors a root-and-rhizome mat several metres across, laced through the top half-metre of soil — exactly the layer that monsoon flow strips first."),
      ],
    }),
    block("Fourteen kilometres of riverbank", { style: "h2" }),
    block(null, {
      children: [
        span("The programme began with a two-kilometre trial reach near Ratnapura, planted by village societies with nursery stock raised in SRINBAR workshops. Today the network maintains roughly fourteen kilometres of planted bank across the Kalu Ganga and its tributaries, using three species matched to bank height and soil: "),
        span("Bambusa vulgaris", ["em"]),
        span(" on low, frequently flooded benches; "),
        span("Dendrocalamus giganteus", ["em"]),
        span(" where banks rise steeply; and rattan interplanted in the shaded gaps between clumps."),
      ],
    }),
    block(
      "Each planting is surveyed twice a year — once before and once after the south-west monsoon. Field teams measure bank retreat against fixed pegs, photograph the toe of the bank, and record culm counts per clump.",
    ),
    block(
      "On the trial reach, measured bank retreat fell from just over a metre a year to under fifteen centimetres — after only two growing seasons.",
      { style: "blockquote" },
    ),
    block("What the pegs are telling us", { style: "h2" }),
    block(
      "The early numbers are cautious but encouraging. Across the monitored reaches, average bank retreat has fallen by more than three-quarters where clumps have closed canopy. Sediment is beginning to accrete on the inside of two planted bends — new land, in effect, where the river used to take it away.",
    ),
    block(
      "Just as important, the plantings are paying their keep. Village societies harvest mature culms on a three-year rotation for weaving stock and charcoal, which is what keeps the hedges maintained without a project budget behind them. Restoration that earns is restoration that lasts.",
    ),
    plainImg(
      "labugama",
      "Dense riverbank vegetation in warm daylight at Labugama–Kalatuwawa Forest Reserve",
      "A closed bamboo canopy on a planted reach. Clumps are harvested on rotation, never clear-felled. Photo: Wikimedia Commons (placeholder).",
    ),
    block("Where the programme goes next", { style: "h2" }),
    block(
      "The next phase extends the survey network to the Kelani basin and adds two more village societies as planting partners. If you farm or live along an eroding bank and want a planting assessed, our field coordinators run site visits every quarter — the fastest way to reach them is through the membership form.",
    ),
  ];

  const posts = [
    {
      _id: "post-riverbanks",
      title: "How Bamboo Roots Are Stabilising Sri Lanka’s Riverbanks",
      slug: "bamboo-roots-stabilising-riverbanks",
      category: "Land Restoration",
      excerpt:
        "A look at the network’s five-year riverbank planting programme along the Kalu Ganga — and what early monitoring shows for erosion control after two monsoon seasons.",
      publishedAt: "2026-06-12",
      imageKey: "ellaValley",
      mainImageCaption:
        "Morning fog over the Kalu Ganga basin, where the network’s first riverbank plantings went in five years ago. Photo: Wikimedia Commons (placeholder).",
      featured: true,
      readTime: "6 min read",
      tags: ["Riverbanks", "Erosion Control", "Kalu Ganga"],
      withAuthor: true,
      body: featuredBody,
    },
    {
      _id: "post-bamboo-charcoal",
      title: "Bamboo Charcoal: A Cleaner Fuel for Rural Kitchens",
      slug: "bamboo-charcoal-cleaner-fuel",
      category: "Entrepreneurship",
      excerpt:
        "Producers in Matale are turning thinned culms into charcoal briquettes — and finding steady urban buyers.",
      publishedAt: "2026-06-08",
      imageKey: "bambooPlum",
    },
    {
      _id: "post-weavers-kegalle",
      title: "Meet the Weavers of Kegalle",
      slug: "meet-the-weavers-of-kegalle",
      category: "Entrepreneurship",
      excerpt: "Three artisans on turning rattan craft into a full-time livelihood.",
      publishedAt: "2026-05-02",
      imageKey: "arashiyamaPath",
    },
    {
      _id: "post-plantation-crop-status",
      title: "Why Bamboo Deserves Plantation-Crop Status",
      slug: "bamboo-plantation-crop-status",
      category: "Research",
      excerpt:
        "Notes from SRINBAR's latest submission to national land-use policy makers.",
      publishedAt: "2026-04-28",
      imageKey: "arashiyamaTall",
    },
    {
      _id: "post-nursery-workshops",
      title: "Inside Our Nursery & Planting Workshops",
      slug: "inside-nursery-planting-workshops",
      category: "Training",
      excerpt:
        "What growers learn in their first season, from soil preparation to culm spacing.",
      publishedAt: "2026-03-15",
      imageKey: "labugama",
    },
    {
      _id: "post-degraded-soil",
      title: "Degraded Soil, Two Years Later",
      slug: "degraded-soil-two-years-later",
      category: "Land Restoration",
      excerpt:
        "A before-and-after look at a restoration site in Kegalle District.",
      publishedAt: "2026-02-20",
      imageKey: "bodinagala",
    },
    {
      _id: "post-inbar-working-group",
      title: "SRINBAR Joins Regional INBAR Working Group",
      slug: "srinbar-joins-inbar-working-group",
      category: "Partnerships",
      excerpt: "What the partnership means for cross-border knowledge sharing.",
      publishedAt: "2026-01-03",
      imageKey: "bambooPlum",
    },
  ].map((p) => ({
    _id: p._id,
    _type: "post",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    category: catRef(p.category),
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    mainImage: img(p.imageKey),
    ...(p.mainImageCaption ? { mainImageCaption: p.mainImageCaption } : {}),
    featured: !!p.featured,
    ...(p.readTime ? { readTime: p.readTime } : {}),
    ...(p.tags ? { tags: p.tags } : {}),
    ...(p.withAuthor ? { author: { _type: "reference", _ref: author._id } } : {}),
    ...(p.body ? { body: p.body } : {}),
  }));

  /* --- Events --- */

  const events = [
    // upcoming
    ["2026-09-14", "Bamboo Nursery & Planting Workshop", "Kegalle District", "9:00 AM – 3:00 PM"],
    ["2026-10-02", "Annual Members' Assembly", "Kandy", "10:00 AM – 1:00 PM"],
    ["2026-10-21", "Riverbank Restoration Field Day", "Kalu Ganga Basin", "8:00 AM – 12:00 PM"],
    ["2026-11-09", "Entrepreneurship Clinic: Pricing & Markets", "Colombo", "2:00 PM – 5:00 PM"],
    ["2026-12-05", "Craft Cooperative Showcase", "Kandy", "All day"],
    // past
    ["2026-06-21", "Bamboo Charcoal Production Demonstration", "Matale", "9:00 AM – 1:00 PM"],
    ["2026-05-17", "Community Riverbank Planting Day", "Ratnapura", "8:00 AM – 12:00 PM"],
    ["2026-03-08", "Rattan Weaving Skills Workshop", "Kegalle District", "10:00 AM – 4:00 PM"],
    ["2026-01-25", "Bamboo Policy Roundtable with INBAR", "Colombo", "2:00 PM – 5:00 PM"],
  ].map(([date, title, location, timeLabel]) => ({
    _id: `event-${title.toLowerCase().replace(/[^a-z]+/g, "-").slice(0, 60)}`,
    _type: "event",
    title,
    date,
    location,
    timeLabel,
  }));

  return [
    ...categories,
    author,
    siteSettings,
    homePage,
    aboutPage,
    blogPage,
    eventsPage,
    contactPage,
    ...teamMembers,
    ...posts,
    ...events,
  ];
}

/* ------------------------------------------------------------------ */
/* 3. Run                                                              */
/* ------------------------------------------------------------------ */

async function run() {
  console.log(`Seeding project ${projectId}, dataset ${dataset}\n`);
  await uploadImages();

  const docs = buildDocuments();
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
  await tx.commit();
  console.log(`\n✓ ${docs.length} documents written.`);
  console.log("Done. Open /studio to review the content.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

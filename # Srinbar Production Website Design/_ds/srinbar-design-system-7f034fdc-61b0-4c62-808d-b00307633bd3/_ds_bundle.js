/* @ds-bundle: {"format":4,"namespace":"SRINBARDesignSystem_7f034f","components":[{"name":"BlogCard","sourcePath":"components/blog/BlogCard.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"DateBadge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"EventCard","sourcePath":"components/events/EventCard.jsx"},{"name":"NewsletterSignup","sourcePath":"components/forms/NewsletterSignup.jsx"},{"name":"Hero","sourcePath":"components/marketing/Hero.jsx"},{"name":"ImpactStatsBand","sourcePath":"components/marketing/ImpactStatsBand.jsx"},{"name":"MembershipCTA","sourcePath":"components/marketing/MembershipCTA.jsx"},{"name":"TeamMember","sourcePath":"components/marketing/TeamMember.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"Nav","sourcePath":"components/navigation/Nav.jsx"}],"sourceHashes":{"components/blog/BlogCard.jsx":"31200173a411","components/core/Badge.jsx":"f79198f259ed","components/core/Button.jsx":"636ef62a2e7e","components/events/EventCard.jsx":"d998ff08e81c","components/forms/NewsletterSignup.jsx":"a9b3ab902d35","components/marketing/Hero.jsx":"89e2e08d2d52","components/marketing/ImpactStatsBand.jsx":"7be4df1417bb","components/marketing/MembershipCTA.jsx":"d0d7868680f8","components/marketing/TeamMember.jsx":"fa48e5c93ed7","components/navigation/Footer.jsx":"28e982326475","components/navigation/Nav.jsx":"d739b729b4a8","ui_kits/website/About.jsx":"0067a6f92656","ui_kits/website/Blog.jsx":"6e00b2ea290d","ui_kits/website/Contact.jsx":"5033fab49316","ui_kits/website/Events.jsx":"baeef4477cc5","ui_kits/website/Home.jsx":"55c36a470f99"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SRINBARDesignSystem_7f034f = window.SRINBARDesignSystem_7f034f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
const toneStyles = {
  gold: {
    background: "var(--rattan-gold)",
    color: "var(--forest-green-dark)"
  },
  green: {
    background: "var(--surface-brand)",
    color: "var(--text-on-brand)"
  },
  outline: {
    background: "transparent",
    color: "var(--text-body)",
    border: "1px solid var(--border-hairline)"
  }
};

/**
 * Badge — small label; also the base for the EventCard date badge.
 */
function Badge({
  children,
  tone = "green"
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-sans-body)",
      fontWeight: "var(--weight-semibold)",
      fontSize: "var(--text-xs)",
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase",
      borderRadius: "var(--radius-pill)",
      padding: "6px 14px",
      ...toneStyles[tone]
    }
  }, children);
}

/**
 * DateBadge — the stacked month/day badge used on EventCard.
 */
function DateBadge({
  month,
  day
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "64px",
      height: "64px",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-brand)",
      color: "var(--text-on-brand)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans-body)",
      fontSize: "11px",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-widest)",
      textTransform: "uppercase",
      color: "var(--text-accent)"
    }
  }, month), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif-display)",
      fontSize: "26px",
      lineHeight: 1
    }
  }, day));
}
Object.assign(__ds_scope, { Badge, DateBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/blog/BlogCard.jsx
try { (() => {
/**
 * BlogCard — image, category tag, serif title, excerpt, and date; used in the blog grid.
 */
function BlogCard({
  imageUrl = "https://upload.wikimedia.org/wikipedia/commons/9/98/Ella_Valley%2C_Sri_Lanka%2C_Cloud_forest_in_fog.jpg",
  category = "Land Restoration",
  title = "How Bamboo Roots Are Stabilising Sri Lanka's Riverbanks",
  excerpt = "A look at the network's five-year riverbank planting programme and what early results show for erosion control.",
  date = "12 June 2026"
}) {
  return /*#__PURE__*/React.createElement("article", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "4/3",
      borderRadius: "var(--radius-md)",
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginBottom: "var(--space-4)"
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "outline"
  }, category), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h3)",
      fontSize: "var(--text-lg)",
      color: "var(--text-body)",
      margin: "var(--space-3) 0 var(--space-2)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)",
      marginBottom: "var(--space-3)"
    }
  }, excerpt), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-caption)",
      color: "var(--text-muted)"
    }
  }, date));
}
Object.assign(__ds_scope, { BlogCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blog/BlogCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const base = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontFamily: "var(--font-sans-body)",
  fontWeight: "var(--weight-semibold)",
  fontSize: "var(--text-base)",
  borderRadius: "var(--radius-pill)",
  padding: "13px 28px",
  border: "1px solid transparent",
  cursor: "pointer",
  textDecoration: "none",
  transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.15s ease"
};
const variants = {
  primary: {
    background: "var(--action-primary)",
    color: "var(--text-on-brand)"
  },
  secondary: {
    background: "transparent",
    color: "var(--action-secondary-border)",
    borderColor: "var(--action-secondary-border)"
  },
  accent: {
    background: "var(--action-accent)",
    color: "var(--forest-green-dark)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-on-brand)",
    borderColor: "rgba(255,253,247,0.4)"
  }
};
const sizes = {
  sm: {
    padding: "9px 20px",
    fontSize: "var(--text-sm)"
  },
  md: {},
  lg: {
    padding: "16px 34px",
    fontSize: "var(--text-md)"
  }
};

/**
 * Button — SRINBAR's primary call-to-action primitive.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  disabled = false,
  onClick,
  href
}) {
  const style = {
    ...base,
    ...variants[variant],
    ...sizes[size],
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? "none" : "auto"
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = hover ? variant === "primary" ? {
    background: "var(--action-primary-hover)"
  } : variant === "accent" ? {
    background: "var(--action-accent-hover)"
  } : variant === "secondary" ? {
    background: "rgba(30,61,47,0.06)"
  } : {
    background: "rgba(255,253,247,0.12)"
  } : {};
  const Tag = href ? "a" : as;
  return /*#__PURE__*/React.createElement(Tag, {
    href: href,
    onClick: onClick,
    disabled: as === "button" ? disabled : undefined,
    style: {
      ...style,
      ...hoverStyle
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/events/EventCard.jsx
try { (() => {
/**
 * EventCard — horizontal card with a stacked date badge, used on the Events listing.
 */
function EventCard({
  month = "SEP",
  day = "14",
  title = "Bamboo Nursery & Planting Workshop",
  location = "Kegalle District",
  time = "9:00 AM – 3:00 PM"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-5)",
      alignItems: "center",
      padding: "var(--space-5)",
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-lg)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.DateBadge, {
    month: month,
    day: day
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h3)",
      fontSize: "var(--text-lg)",
      color: "var(--text-body)",
      marginBottom: "var(--space-1)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-caption)",
      color: "var(--text-muted)"
    }
  }, location, " \xB7 ", time)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "accent",
    size: "sm"
  }, "Register"));
}
Object.assign(__ds_scope, { EventCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/events/EventCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/NewsletterSignup.jsx
try { (() => {
/**
 * NewsletterSignup — inline email capture, used in the footer area or as a section band.
 */
function NewsletterSignup({
  headline = "Stay Rooted",
  body = "Field updates, events, and entrepreneurship stories — twice a month."
}) {
  const [email, setEmail] = React.useState("");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      maxWidth: "420px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-h3)",
      fontSize: "var(--text-lg)",
      color: "var(--text-body)",
      marginBottom: "var(--space-1)"
    }
  }, headline), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-caption)",
      color: "var(--text-muted)"
    }
  }, body)), /*#__PURE__*/React.createElement("form", {
    style: {
      display: "flex",
      gap: "var(--space-2)"
    },
    onSubmit: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "you@email.com",
    value: email,
    onChange: e => setEmail(e.target.value),
    style: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "var(--radius-pill)",
      border: "1px solid var(--border-hairline)",
      background: "var(--surface-card)",
      font: "var(--type-body)",
      color: "var(--text-body)",
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    as: "button"
  }, "Subscribe")));
}
Object.assign(__ds_scope, { NewsletterSignup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/NewsletterSignup.jsx", error: String((e && e.message) || e) }); }

// components/marketing/Hero.jsx
try { (() => {
/**
 * Hero — full-bleed photographic hero with eyebrow, serif headline, tagline and CTA(s).
 */
function Hero({
  eyebrow = "Lanka Network for Bamboo and Rattan",
  headline = "Growing a Greener Lanka",
  tagline = "Restoring degraded land, stabilising riverbanks, and building bamboo livelihoods across Sri Lanka.",
  imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ab/Bodinagala_Forest_Reserve%2C_Sri_Lanka.jpg",
  primaryCta = "Become a Member",
  secondaryCta = "Our Programmes",
  height = "640px"
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      height,
      display: "flex",
      alignItems: "flex-end",
      backgroundImage: `linear-gradient(180deg, rgba(20,41,31,0.15) 0%, rgba(20,41,31,0.75) 100%), url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-padding-x) var(--space-9)",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      color: "var(--text-accent)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-widest)",
      marginBottom: "var(--space-4)"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-hero)",
      color: "var(--text-on-brand)",
      maxWidth: "820px",
      marginBottom: "var(--space-4)"
    }
  }, headline), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body-lg)",
      color: "var(--text-on-brand-muted)",
      maxWidth: "560px",
      marginBottom: "var(--space-6)"
    }
  }, tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "accent",
    size: "lg"
  }, primaryCta), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "lg"
  }, secondaryCta))));
}
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/Hero.jsx", error: String((e && e.message) || e) }); }

// components/marketing/ImpactStatsBand.jsx
try { (() => {
/**
 * ImpactStatsBand — a horizontal band of large serif stats with supporting labels.
 */
function ImpactStatsBand({
  stats = [{
    value: "1,200+",
    label: "Hectares under bamboo restoration"
  }, {
    value: "45",
    label: "Rural entrepreneurs networked"
  }, {
    value: "18",
    label: "Districts with active programmes"
  }, {
    value: "2005",
    label: "Founded, Kandy"
  }]
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-brand)",
      padding: "var(--space-8) var(--container-padding-x)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
      gap: "var(--space-6)"
    }
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      textAlign: "left",
      borderLeft: "1px solid rgba(255,253,247,0.25)",
      paddingLeft: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-accent)",
      marginBottom: "var(--space-2)"
    }
  }, s.value), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption)",
      color: "var(--text-on-brand-muted)"
    }
  }, s.label)))));
}
Object.assign(__ds_scope, { ImpactStatsBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/ImpactStatsBand.jsx", error: String((e && e.message) || e) }); }

// components/marketing/MembershipCTA.jsx
try { (() => {
/**
 * MembershipCTA — banner inviting entrepreneurs/growers to join the network.
 */
function MembershipCTA({
  headline = "Join the Network",
  body = "Whether you grow, craft, or trade bamboo and rattan — SRINBAR membership connects you to training, markets, and a community of practice.",
  ctaLabel = "Apply for Membership"
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-8)",
      maxWidth: "var(--container-max)",
      margin: "var(--space-8) auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "560px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h2)",
      color: "var(--text-body)",
      marginBottom: "var(--space-3)"
    }
  }, headline), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, body)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "lg"
  }, ctaLabel));
}
Object.assign(__ds_scope, { MembershipCTA });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/MembershipCTA.jsx", error: String((e && e.message) || e) }); }

// components/marketing/TeamMember.jsx
try { (() => {
/**
 * TeamMember — headshot + name/role card, used in the About Us team grid.
 */
function TeamMember({
  name = "Dr. A. Perera",
  role = "Founding Scientist",
  photoUrl = "https://upload.wikimedia.org/wikipedia/commons/2/29/Bamboo_and_plum_tree.jpg"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      aspectRatio: "1",
      borderRadius: "var(--radius-md)",
      backgroundImage: `url(${photoUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginBottom: "var(--space-3)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-h3)",
      color: "var(--text-body)",
      fontSize: "var(--text-md)"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-caption)",
      color: "var(--text-muted)"
    }
  }, role));
}
Object.assign(__ds_scope, { TeamMember });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/TeamMember.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
const columns = [{
  title: "About",
  links: ["Our Story", "Team", "Partners", "Annual Reports"]
}, {
  title: "Programmes",
  links: ["Land Restoration", "Entrepreneurship", "Research", "Training"]
}, {
  title: "Get Involved",
  links: ["Membership", "Volunteer", "Donate", "Events"]
}];

/**
 * Footer — mega-footer with newsletter, link columns, and legal row.
 */
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-brand-dark)",
      color: "var(--text-on-brand)",
      fontFamily: "var(--font-sans-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-9) var(--container-padding-x) var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif-display)",
      fontSize: "28px",
      marginBottom: "var(--space-3)"
    }
  }, "SRINBAR"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-on-brand-muted)",
      maxWidth: "320px"
    }
  }, "Lanka Network for Bamboo and Rattan \u2014 growing a greener, more resilient Sri Lanka since 2005.")), columns.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      color: "var(--text-accent)",
      marginBottom: "var(--space-3)"
    }
  }, col.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, col.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: "var(--text-on-brand-muted)",
      textDecoration: "none",
      fontSize: "var(--text-sm)"
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-8)",
      paddingTop: "var(--space-5)",
      borderTop: "1px solid rgba(255,253,247,0.15)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-on-brand-muted)"
    }
  }, "\xA9 ", new Date().getFullYear(), " SRINBAR \u2014 Lanka Network for Bamboo and Rattan"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-on-brand-muted)"
    }
  }, "Kandy, Sri Lanka \xB7 Member of INBAR"))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Nav.jsx
try { (() => {
const links = ["Home", "About Us", "Blog", "Events", "Contact"];

/**
 * Nav — primary site navigation. Transparent-over-hero by default, solid on scroll.
 */
function Nav({
  active = "Home",
  transparent = false,
  logoText = "SRINBAR"
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px var(--container-padding-x)",
      background: transparent ? "transparent" : "var(--surface-page)",
      borderBottom: transparent ? "none" : "1px solid var(--border-hairline)",
      color: transparent ? "var(--text-on-brand)" : "var(--text-body)",
      fontFamily: "var(--font-sans-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif-display)",
      fontSize: "22px",
      fontWeight: 500,
      letterSpacing: "0.02em"
    }
  }, logoText), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: "32px"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      textDecoration: "none",
      color: "inherit",
      fontSize: "var(--text-sm)",
      fontWeight: l === active ? 600 : 400,
      borderBottom: l === active ? "2px solid var(--rattan-gold)" : "2px solid transparent",
      paddingBottom: "4px"
    }
  }, l))));
}
Object.assign(__ds_scope, { Nav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/About.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  ImpactStatsBand,
  TeamMember,
  Button
} = window.SRINBARDesignSystem_7f034f;
const team = [{
  name: "Dr. A. Perera",
  role: "Founding Scientist",
  photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Bamboo_and_plum_tree.jpg"
}, {
  name: "N. Wickramasinghe",
  role: "Programme Director",
  photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Bamboo_forest_arashiyama.jpg"
}, {
  name: "S. Fernando",
  role: "Entrepreneurship Lead",
  photoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Arashiyama_Bamboo_Forest_(11096493983).jpg"
}, {
  name: "K. Jayasuriya",
  role: "Field Coordinator",
  photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Labugama_-_Kalatuwawa_Forest_Reserve%2C_Sri_Lanka.jpg"
}];
function Section({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-padding-x)",
      ...style
    }
  }, children);
}
function About() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "360px",
      backgroundImage: "linear-gradient(180deg, rgba(20,41,31,0.25) 0%, rgba(20,41,31,0.8) 100%), url('https://upload.wikimedia.org/wikipedia/commons/9/98/Ella_Valley%2C_Sri_Lanka%2C_Cloud_forest_in_fog.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingBottom: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      color: "var(--text-accent)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-widest)",
      marginBottom: "var(--space-3)"
    }
  }, "About Us"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-on-brand)",
      maxWidth: "700px"
    }
  }, "A network of scientists, growers, and artisans"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-9) 0"
    }
  }, /*#__PURE__*/React.createElement(Section, {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h2)",
      color: "var(--text-body)",
      marginBottom: "var(--space-4)"
    }
  }, "Our Story"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body-lg)",
      color: "var(--text-muted)",
      marginBottom: "var(--space-4)"
    }
  }, "SRINBAR \u2014 the Lanka Network for Bamboo and Rattan \u2014 was founded in 2005 by scientists at the National Institute of Fundamental Studies, Kandy, to answer a simple question: could bamboo restore Sri Lanka's degraded land while also building rural livelihoods?"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, "Two decades on, we're a network connecting researchers, riverbank-restoration teams, and bamboo & rattan entrepreneurs \u2014 linked to the wider INBAR (International Network for Bamboo and Rattan) community.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h2)",
      color: "var(--text-body)",
      marginBottom: "var(--space-4)"
    }
  }, "Our Approach"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, "We advocate for bamboo's recognition as a plantation crop \u2014 one with environmental, social, and economic returns \u2014 and provide training, market connections, and technical support to everyone from smallholder growers to craft cooperatives.")))), /*#__PURE__*/React.createElement(ImpactStatsBand, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-9) 0"
    }
  }, /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-body)",
      marginBottom: "var(--space-7)"
    }
  }, "Our Team"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--space-6)"
    }
  }, team.map(t => /*#__PURE__*/React.createElement(TeamMember, _extends({
    key: t.name
  }, t)))))));
}
window.About = About;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Blog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  BlogCard
} = window.SRINBARDesignSystem_7f034f;
const posts = [{
  category: "Land Restoration",
  title: "How Bamboo Roots Are Stabilising Sri Lanka's Riverbanks",
  excerpt: "A look at the network's five-year riverbank planting programme and what early results show for erosion control.",
  date: "12 June 2026",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/98/Ella_Valley%2C_Sri_Lanka%2C_Cloud_forest_in_fog.jpg"
}, {
  category: "Research",
  title: "Why Bamboo Deserves Plantation-Crop Status",
  excerpt: "Notes from SRINBAR's latest submission to national land-use policy makers.",
  date: "28 April 2026",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Bamboo_forest_arashiyama.jpg"
}, {
  category: "Entrepreneurship",
  title: "Meet the Weavers of Kegalle",
  excerpt: "Three artisans on turning rattan craft into a full-time livelihood.",
  date: "2 May 2026",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Arashiyama_Bamboo_Forest_(11096493983).jpg"
}, {
  category: "Training",
  title: "Inside Our Nursery & Planting Workshops",
  excerpt: "What growers learn in their first season, from soil prep to spacing.",
  date: "15 March 2026",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Labugama_-_Kalatuwawa_Forest_Reserve%2C_Sri_Lanka.jpg"
}, {
  category: "Land Restoration",
  title: "Degraded Soil, Two Years Later",
  excerpt: "A before-and-after look at a restoration site in Kegalle District.",
  date: "20 February 2026",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Bodinagala_Forest_Reserve%2C_Sri_Lanka.jpg"
}, {
  category: "Partnerships",
  title: "SRINBAR Joins Regional INBAR Working Group",
  excerpt: "What the partnership means for cross-border knowledge sharing.",
  date: "3 January 2026",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Bamboo_and_plum_tree.jpg"
}];
function Section({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-padding-x)",
      ...style
    }
  }, children);
}
function Blog() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-9) 0"
    }
  }, /*#__PURE__*/React.createElement(Section, {
    style: {
      marginBottom: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      color: "var(--text-accent)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-widest)",
      marginBottom: "var(--space-3)"
    }
  }, "Blog"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-body)"
    }
  }, "Field notes & updates")), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-6)"
    }
  }, posts.map(p => /*#__PURE__*/React.createElement(BlogCard, _extends({
    key: p.title
  }, p))))));
}
window.Blog = Blog;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Blog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
const {
  NewsletterSignup,
  Button
} = window.SRINBARDesignSystem_7f034f;
function Section({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-padding-x)",
      ...style
    }
  }, children);
}
function Field({
  label,
  type = "text",
  area = false
}) {
  const Tag = area ? "textarea" : "input";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      font: "var(--type-caption)",
      color: "var(--text-muted)"
    }
  }, label, /*#__PURE__*/React.createElement(Tag, {
    type: type,
    rows: area ? 5 : undefined,
    style: {
      padding: "12px 16px",
      borderRadius: area ? "var(--radius-md)" : "var(--radius-pill)",
      border: "1px solid var(--border-hairline)",
      background: "var(--surface-card)",
      font: "var(--type-body)",
      color: "var(--text-body)",
      outline: "none",
      resize: area ? "vertical" : "none"
    }
  }));
}
function Contact() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-9) 0"
    }
  }, /*#__PURE__*/React.createElement(Section, {
    style: {
      marginBottom: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      color: "var(--text-accent)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-widest)",
      marginBottom: "var(--space-3)"
    }
  }, "Contact"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-body)",
      maxWidth: "600px"
    }
  }, "Get in touch")), /*#__PURE__*/React.createElement(Section, {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement("form", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    },
    onSubmit: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    type: "email"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Message",
    area: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    as: "button"
  }, "Send Message"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h3)",
      fontSize: "var(--text-lg)",
      color: "var(--text-body)",
      marginBottom: "var(--space-3)"
    }
  }, "Visit or write"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, "National Institute of Fundamental Studies", /*#__PURE__*/React.createElement("br", null), "Hantana Road, Kandy, Sri Lanka", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "info@srinbar.org (placeholder)")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(NewsletterSignup, null)))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Events.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  EventCard
} = window.SRINBARDesignSystem_7f034f;
const events = [{
  month: "SEP",
  day: "14",
  title: "Bamboo Nursery & Planting Workshop",
  location: "Kegalle District",
  time: "9:00 AM – 3:00 PM"
}, {
  month: "OCT",
  day: "02",
  title: "Annual Members' Assembly",
  location: "Kandy",
  time: "10:00 AM – 1:00 PM"
}, {
  month: "OCT",
  day: "21",
  title: "Riverbank Restoration Field Day",
  location: "Kalu Ganga Basin",
  time: "8:00 AM – 12:00 PM"
}, {
  month: "NOV",
  day: "09",
  title: "Entrepreneurship Clinic: Pricing & Markets",
  location: "Colombo",
  time: "2:00 PM – 5:00 PM"
}, {
  month: "DEC",
  day: "05",
  title: "Craft Cooperative Showcase",
  location: "Kandy",
  time: "All day"
}];
function Section({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-padding-x)",
      ...style
    }
  }, children);
}
function Events() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-9) 0"
    }
  }, /*#__PURE__*/React.createElement(Section, {
    style: {
      marginBottom: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      color: "var(--text-accent)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-widest)",
      marginBottom: "var(--space-3)"
    }
  }, "Events"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-body)"
    }
  }, "Upcoming events")), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      maxWidth: "760px"
    }
  }, events.map(e => /*#__PURE__*/React.createElement(EventCard, _extends({
    key: e.title
  }, e))))));
}
window.Events = Events;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Events.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Hero,
  ImpactStatsBand,
  MembershipCTA,
  BlogCard,
  EventCard,
  Button,
  Badge
} = window.SRINBARDesignSystem_7f034f;
const programmes = [{
  title: "Land Restoration",
  body: "Bamboo planting on degraded soil and riverbanks to stop erosion and rebuild topsoil.",
  img: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Labugama_-_Kalatuwawa_Forest_Reserve%2C_Sri_Lanka.jpg"
}, {
  title: "Entrepreneurship",
  body: "Networking growers, weavers, and traders across the bamboo & rattan value chain.",
  img: "https://upload.wikimedia.org/wikipedia/commons/2/29/Bamboo_and_plum_tree.jpg"
}, {
  title: "Research & Advocacy",
  body: "Elevating bamboo to a recognised plantation crop, in partnership with INBAR.",
  img: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Bodinagala_Forest_Reserve%2C_Sri_Lanka.jpg"
}];
function ProgrammeCard({
  title,
  body,
  img
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "4/3",
      borderRadius: "var(--radius-md)",
      backgroundImage: `url(${img})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginBottom: "var(--space-4)"
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h3)",
      fontSize: "var(--text-lg)",
      color: "var(--text-body)",
      marginBottom: "var(--space-2)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, body));
}
function Section({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-padding-x)",
      ...style
    }
  }, children);
}
function Home({
  goTo
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(ImpactStatsBand, null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-9) 0"
    }
  }, /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      color: "var(--text-accent)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-widest)",
      marginBottom: "var(--space-3)"
    }
  }, "What We Do"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-body)",
      marginBottom: "var(--space-7)",
      maxWidth: "640px"
    }
  }, "Three ways bamboo builds a greener Lanka"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-6)"
    }
  }, programmes.map(p => /*#__PURE__*/React.createElement(ProgrammeCard, _extends({
    key: p.title
  }, p)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 0 var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(MembershipCTA, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 0 var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-body)"
    }
  }, "From the Blog"), /*#__PURE__*/React.createElement("a", {
    onClick: () => goTo("Blog"),
    style: {
      cursor: "pointer",
      font: "var(--type-button)",
      fontSize: "var(--text-sm)",
      color: "var(--text-link)"
    }
  }, "View all \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(BlogCard, null), /*#__PURE__*/React.createElement(BlogCard, {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Bamboo_forest_arashiyama.jpg",
    category: "Research",
    title: "Why Bamboo Deserves Plantation-Crop Status",
    excerpt: "Notes from SRINBAR's latest submission to national land-use policy makers.",
    date: "28 April 2026"
  }), /*#__PURE__*/React.createElement(BlogCard, {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Arashiyama_Bamboo_Forest_(11096493983).jpg",
    category: "Entrepreneurship",
    title: "Meet the Weavers of Kegalle",
    excerpt: "Three artisans on turning rattan craft into a full-time livelihood.",
    date: "2 May 2026"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 0 var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-body)"
    }
  }, "Upcoming Events"), /*#__PURE__*/React.createElement("a", {
    onClick: () => goTo("Events"),
    style: {
      cursor: "pointer",
      font: "var(--type-button)",
      fontSize: "var(--text-sm)",
      color: "var(--text-link)"
    }
  }, "View all \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(EventCard, {
    month: "SEP",
    day: "14",
    title: "Bamboo Nursery & Planting Workshop",
    location: "Kegalle District",
    time: "9:00 AM \u2013 3:00 PM"
  }), /*#__PURE__*/React.createElement(EventCard, {
    month: "OCT",
    day: "02",
    title: "Annual Members' Assembly",
    location: "Kandy",
    time: "10:00 AM \u2013 1:00 PM"
  })))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BlogCard = __ds_scope.BlogCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.DateBadge = __ds_scope.DateBadge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.NewsletterSignup = __ds_scope.NewsletterSignup;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.ImpactStatsBand = __ds_scope.ImpactStatsBand;

__ds_ns.MembershipCTA = __ds_scope.MembershipCTA;

__ds_ns.TeamMember = __ds_scope.TeamMember;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Nav = __ds_scope.Nav;

})();

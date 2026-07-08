import { Link } from "next-view-transitions";

type EventCardProps = {
  month?: string;
  day?: string;
  title?: string;
  location?: string;
  time?: string;
  past?: boolean;
  registerHref?: string;
};

export default function EventCard({
  month = "SEP",
  day = "14",
  title = "Bamboo Nursery & Planting Workshop",
  location = "Kegalle District",
  time = "9:00 AM – 3:00 PM",
  past = false,
  registerHref = "/contact#membership",
}: EventCardProps) {
  const meta = time ? `${location} · ${time}` : location;
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-5)",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "var(--space-5)",
        background: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-lg)",
        fontFamily: "var(--font-sans-body)",
        opacity: past ? 0.75 : 1,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "var(--radius-md)",
          background: past ? "transparent" : "var(--surface-brand)",
          color: past ? "var(--text-muted)" : "var(--text-on-brand)",
          border: `1px solid ${past ? "var(--border-hairline)" : "transparent"}`,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans-body)",
            fontSize: 11,
            fontWeight: "var(--weight-semibold)" as React.CSSProperties["fontWeight"],
            letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase",
            color: past ? "var(--text-muted)" : "var(--text-accent)",
          }}
        >
          {month}
        </span>
        <span
          style={{
            fontFamily: "var(--font-serif-display)",
            fontSize: 26,
            lineHeight: 1,
          }}
        >
          {day}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <h3
          style={{
            font: "var(--type-h3)",
            fontSize: "var(--text-lg)",
            color: "var(--text-body)",
            marginBottom: "var(--space-1)",
          }}
        >
          {title}
        </h3>
        <p style={{ font: "var(--type-caption)", color: "var(--text-muted)" }}>
          {meta}
        </p>
      </div>
      {past ? (
        <span className="chip chip--muted">Past</span>
      ) : (
        <Link href={registerHref} className="btn btn--accent btn--sm">
          Register
        </Link>
      )}
    </div>
  );
}

import type { Stat } from "@/sanity/types";

export default function StatsBand({ stats }: { stats?: Stat[] }) {
  if (!stats?.length) return null;
  return (
    <section
      aria-label="Impact"
      style={{
        background: "var(--surface-brand)",
        padding: "var(--space-8) clamp(20px, 4vw, 32px)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-6)",
        }}
      >
        {stats.map(({ value, label }) => (
          <div
            key={label}
            style={{
              borderLeft: "1px solid rgba(255, 253, 247, 0.25)",
              paddingLeft: "var(--space-5)",
            }}
          >
            <div
              style={{
                font: "var(--type-h1)",
                fontSize: "clamp(36px, 3.5vw, 48px)",
                color: "var(--text-accent)",
                marginBottom: "var(--space-2)",
              }}
            >
              {value}
            </div>
            <div
              style={{
                font: "var(--type-caption)",
                color: "var(--text-on-brand-muted)",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

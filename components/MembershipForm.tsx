"use client";

import { useState } from "react";

const DISTRICTS = ["Kandy", "Kegalle", "Ratnapura", "Matale", "Colombo", "Other"];
const MEMBER_TYPES = ["Grower", "Artisan", "Trader", "Researcher"];

export default function MembershipForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        role="status"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          padding: "var(--space-6)",
          background: "var(--surface-page)",
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <h3
          style={{
            font: "var(--type-h3)",
            fontSize: "var(--text-xl)",
            color: "var(--forest-green)",
          }}
        >
          Application received
        </h3>
        <p
          style={{
            font: "var(--type-body)",
            color: "var(--text-muted)",
            textWrap: "pretty",
          }}
        >
          Thank you. The membership office reviews applications monthly — you
          will hear from us by email, usually within two weeks.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn btn--outline"
          style={{
            alignSelf: "flex-start",
            padding: "9px 20px",
            fontSize: "var(--text-sm)",
          }}
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
    >
      <label className="field">
        Full name
        <input type="text" name="name" required autoComplete="name" className="input" />
      </label>
      <label className="field">
        Email
        <input type="email" name="email" required autoComplete="email" className="input" />
      </label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <label className="field">
          Phone (optional)
          <input type="tel" name="phone" autoComplete="tel" className="input" />
        </label>
        <label className="field">
          District
          <select name="district" required defaultValue="" className="input input--select">
            <option value="">Select district</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset
        style={{
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          margin: 0,
        }}
      >
        <legend
          style={{
            font: "var(--type-caption)",
            fontWeight: "var(--weight-semibold)" as React.CSSProperties["fontWeight"],
            color: "var(--text-body)",
            fontFamily: "var(--font-sans-body)",
            padding: "0 var(--space-2)",
          }}
        >
          I am joining as a
        </legend>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3) var(--space-5)",
          }}
        >
          {MEMBER_TYPES.map((type, i) => (
            <label
              key={type}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                font: "var(--type-body)",
                color: "var(--text-body)",
                fontFamily: "var(--font-sans-body)",
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              <input
                type="radio"
                name="memberType"
                value={type}
                required={i === 0}
              />
              {type}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field">
        Message
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell us what you grow, make, or trade — or what you'd like to learn."
          className="input input--area"
        />
      </label>
      <div>
        <button
          type="submit"
          className="btn btn--primary btn--md"
          style={{ minHeight: 48 }}
        >
          Submit Application
        </button>
      </div>
    </form>
  );
}

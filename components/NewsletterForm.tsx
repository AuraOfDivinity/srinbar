"use client";

import { useState } from "react";

type NewsletterFormProps = {
  /** "home" — wide band form; "contact" — compact card form. */
  variant: "home" | "contact";
  inputId: string;
};

export default function NewsletterForm({ variant, inputId }: NewsletterFormProps) {
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return variant === "home" ? (
      <p
        role="status"
        style={{
          font: "var(--type-body)",
          color: "var(--success)",
          border: "1px solid var(--border-hairline)",
          background: "var(--surface-page)",
          borderRadius: "var(--radius-pill)",
          padding: "13px 24px",
        }}
      >
        Thank you — you&rsquo;re on the list. See you in your inbox.
      </p>
    ) : (
      <p role="status" style={{ font: "var(--type-body)", color: "var(--success)" }}>
        Thank you — you&rsquo;re on the list. See you in your inbox.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubscribed(true);
      }}
      style={
        variant === "home"
          ? {
              display: "flex",
              gap: "var(--space-2)",
              flexWrap: "wrap",
              flex: 1,
              maxWidth: 480,
              minWidth: 280,
            }
          : { display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }
      }
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        required
        placeholder="you@email.com"
        className="input"
        style={{ flex: 1, minWidth: variant === "home" ? 200 : 180 }}
      />
      <button
        type="submit"
        className="btn btn--primary"
        style={
          variant === "home"
            ? { padding: "13px 28px", fontSize: "var(--text-base)" }
            : { padding: "12px 24px", fontSize: "var(--text-sm)" }
        }
      >
        Subscribe
      </button>
    </form>
  );
}

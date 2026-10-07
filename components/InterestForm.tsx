"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { INTEREST_FIELDS, validateInterest } from "@/lib/interest";

type Toast = { kind: "success" | "error"; message: string };

export default function InterestForm({ preview }: { preview: boolean }) {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const [receipt, setReceipt] = useState<{ message: string; id: string } | null>(null);
  const submissionId = useRef<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (toast?.kind !== "success") return;
    const timer = setTimeout(() => setToast(null), 10000);
    return () => clearTimeout(timer);
  }, [toast]);

  function resetForm() {
    formRef.current?.reset();
    setErrors({}); setReceipt(null); submissionId.current = null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const problems = validateInterest(data);
    setErrors(problems); setToast(null);
    if (Object.keys(problems).length) {
      setToast({ kind: "error", message: "Please check the highlighted fields before submitting." });
      (form.querySelector(`[name="${Object.keys(problems)[0]}"]`) as HTMLElement | null)?.focus();
      return;
    }
    busyRef.current = true; setBusy(true);
    submissionId.current ??= crypto.randomUUID();
    controller.current = new AbortController();
    const timeout = setTimeout(() => controller.current?.abort(), 35000);
    try {
      const response = await fetch("/api/membership", { method: "POST", body: data, headers: { "Idempotency-Key": submissionId.current }, signal: controller.current.signal });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.message || "We couldn’t submit your interest. Please try again.");
      }
      const message = result.message as string;
      setToast({ kind: "success", message });
      setReceipt({ message, id: result.submissionId });
      form.reset(); submissionId.current = null;
    } catch (error) {
      setToast({ kind: "error", message: error instanceof Error && error.name !== "AbortError" && error.name !== "TypeError" ? error.message : "We couldn’t confirm your submission. Your details are still here; please check your connection and try again." });
    } finally { clearTimeout(timeout); busyRef.current = false; setBusy(false); }
  }

  function fieldError(name: string) {
    return errors[name] ? <span id={`${name}-error`} className="membership-error">{errors[name]}</span> : null;
  }

  function fields() {
    return INTEREST_FIELDS.map((field) => (
      <label key={field.name} className={`field ${field.type === "textarea" ? "membership-wide" : ""}`}>
        <span>{field.label} {field.required ? <span className="membership-required" aria-hidden="true">*</span> : <span className="membership-optional">(optional)</span>}</span>
        {field.type === "textarea" ? (
          <textarea name={field.name} rows={4} required={field.required} maxLength={field.maxLength} autoComplete={field.autoComplete} className="input input--area" aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />
        ) : (
          <input name={field.name} type={field.type} required={field.required} maxLength={field.maxLength} autoComplete={field.autoComplete} className="input" aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />
        )}
        {fieldError(field.name)}
      </label>
    ));
  }

  return (
    <>
      {receipt ? (
        <div className="membership-receipt" role="status">
          <p className="eyebrow">{preview ? "Preview complete" : "Thank you"}</p>
          <h3>{preview ? "Your form is ready to connect" : "Interest submitted"}</h3>
          <p>{receipt.message}</p>
          <button type="button" className="btn btn--outline btn--md" onClick={resetForm}>Submit another response</button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={submit} noValidate aria-busy={busy} onChange={() => { submissionId.current = null; }}>
          <fieldset className="membership-all" disabled={busy}>
            <div className="membership-fields">{fields()}</div>
            <div className="membership-submit">
              <button type="submit" className="btn btn--primary btn--md">{busy ? "Submitting…" : "Submit interest"}</button>
              <button type="button" className="membership-clear" onClick={() => { if (window.confirm("Clear all entered details?")) resetForm(); }}>Clear form</button>
            </div>
          </fieldset>
        </form>
      )}
      <div className="membership-toast-region" aria-live="polite" aria-atomic="true">
        {toast && <div className={`membership-toast membership-toast--${toast.kind}`} role={toast.kind === "error" ? "alert" : "status"}>
          <span className="membership-toast-icon" aria-hidden="true">{toast.kind === "success" ? "✓" : "!"}</span>
          <div><strong>{toast.kind === "success" ? "Submission successful" : "Unable to submit"}</strong><p>{toast.message}</p></div>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification">×</button>
        </div>}
      </div>
    </>
  );
}

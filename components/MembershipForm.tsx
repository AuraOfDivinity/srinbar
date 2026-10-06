"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MAX_PAYMENT_SLIP_BYTES, MEMBERSHIP_CATEGORIES, MEMBERSHIP_FIELDS, MEMBERSHIP_STATUSES, validateMembership } from "@/lib/membership";
import type { ContactPageDoc } from "@/sanity/types";

type Toast = { kind: "success" | "error"; message: string };

export default function MembershipForm({ page, preview }: { page: ContactPageDoc | null; preview: boolean }) {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const [receipt, setReceipt] = useState<{ message: string; id: string } | null>(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const submissionId = useRef<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (toast?.kind !== "success") return;
    const timer = setTimeout(() => setToast(null), 10000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fee = page?.fees?.find((item) => item.category === category);
  const formatFee = (amount: number, currency: string) => `${currency === "USD" ? "US$" : "Rs."} ${amount.toLocaleString("en-US")}`;

  function resetForm() {
    formRef.current?.reset();
    setErrors({}); setReceipt(null); setFileName(""); setStatus(""); setCategory(""); submissionId.current = null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const problems = validateMembership(data);
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
        throw new Error(result.message || "We couldn’t submit your application. Please try again.");
      }
      const message = result.message as string;
      setToast({ kind: "success", message });
      setReceipt({ message, id: result.submissionId });
      form.reset(); setFileName(""); setStatus(""); setCategory(""); submissionId.current = null;
    } catch (error) {
      setToast({ kind: "error", message: error instanceof Error && error.name !== "AbortError" && error.name !== "TypeError" ? error.message : "We couldn’t confirm your submission. Your details are still here; please check your connection and try again." });
    } finally { clearTimeout(timeout); busyRef.current = false; setBusy(false); }
  }

  function fieldError(name: string) {
    return errors[name] ? <span id={`${name}-error`} className="membership-error">{errors[name]}</span> : null;
  }

  function fields(section: string) {
    return MEMBERSHIP_FIELDS.filter((field) => field.section === section).map((field) => (
      <label key={field.name} className={`field ${field.type === "textarea" || field.name === "fullName" ? "membership-wide" : ""}`}>
        <span>{field.label} {field.required ? <span className="membership-required" aria-hidden="true">*</span> : <span className="membership-optional">(optional)</span>}</span>
        {field.type === "textarea" ? (
          <textarea name={field.name} rows={field.name === "description" ? 4 : 2} required={field.required} maxLength={field.maxLength} autoComplete={field.autoComplete} className="input input--area" aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />
        ) : (
          <input name={field.name} type={field.type} required={field.required} maxLength={field.maxLength} autoComplete={field.autoComplete} className="input" aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />
        )}
        {fieldError(field.name)}
      </label>
    ));
  }

  return (
    <>
      {preview && <p className="membership-preview">Preview mode — submissions and payment slips are not saved yet. Use sample details to try the form.</p>}
      {receipt ? (
        <div className="membership-receipt" role="status">
          <p className="eyebrow">{preview ? "Preview complete" : "Thank you"}</p>
          <h3>{preview ? "Your form is ready to connect" : "Application submitted"}</h3>
          <p>{receipt.message}</p>
          <button type="button" className="btn btn--outline btn--md" onClick={resetForm}>Submit another application</button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={submit} noValidate aria-busy={busy} onChange={() => { submissionId.current = null; }}>
          <fieldset className="membership-all" disabled={busy}>
            {[["personal", "01", "Personal details"], ["contact", "02", "Contact details"], ["interests", "03", "Your work & interests"]].map(([section, number, title]) => (
              <fieldset key={section} className="membership-section">
                <legend><span>{number}</span>{title}</legend>
                <div className="membership-fields">{fields(section)}</div>
              </fieldset>
            ))}
            <fieldset className="membership-section">
              <legend><span>04</span>Membership & payment</legend>
              <fieldset className="membership-choices" aria-describedby={errors.membershipStatus ? "membershipStatus-error" : undefined}>
                <legend>Membership <span className="membership-required">*</span></legend>
                <div className="membership-options">
                  {MEMBERSHIP_STATUSES.map((value) => <label key={value}><input type="radio" name="membershipStatus" value={value} required checked={status === value} onChange={() => setStatus(value)} />{value}</label>)}
                </div>
                {fieldError("membershipStatus")}
              </fieldset>
              <fieldset className="membership-choices" aria-describedby={errors.category ? "category-error" : undefined}>
                <legend>Category of membership you belong to / wish to apply for <span className="membership-required">*</span></legend>
                <div className="membership-options">
                  {MEMBERSHIP_CATEGORIES.map((value) => <label key={value}><input type="radio" name="category" value={value} required checked={category === value} onChange={() => setCategory(value)} />{value}</label>)}
                </div>
                {fieldError("category")}
              </fieldset>
              <div className="membership-payment">
                <h3>Membership fees</h3>
                <div className="membership-table-scroll"><table>
                  <caption className="sr-only">Enrollment and annual membership fees</caption>
                  <thead><tr><th scope="col">Category</th><th scope="col">Enrollment</th><th scope="col">Annual</th></tr></thead>
                  <tbody>{page?.fees?.map((item) => <tr key={item.category}><th scope="row">{item.category}</th><td>{formatFee(item.enrollment, item.currency)}</td><td>{formatFee(item.annual, item.currency)}</td></tr>)}</tbody>
                </table></div>
                <p className="membership-help">{page?.paymentNote}</p>
                {fee && status && <p className="membership-total" role="status">{status === "New" ? "Enrollment + annual fee" : "Annual renewal"}<strong>{formatFee(fee.annual + (status === "New" ? fee.enrollment : 0), fee.currency)}</strong></p>}
                <div className="membership-bank">
                  <h3>Bank details</h3>
                  <dl>{[["Account name", page?.bankAccountName], ["Account number", page?.bankAccountNumber], ["Bank", page?.bankName], ["Branch", page?.bankBranch]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                </div>
              </div>
              <label className="field membership-upload">
                <span>Attach payment slip <span className="membership-required" aria-hidden="true">*</span></span>
                <span id="payment-slip-help" className="membership-help">Upload one file. Maximum 10 MB.</span>
                <input type="file" name="paymentSlip" required aria-invalid={!!errors.paymentSlip} aria-describedby={`payment-slip-help${errors.paymentSlip ? " paymentSlip-error" : ""}`} onChange={(event) => {
                  const file = event.target.files?.[0]; setFileName(file?.name || "");
                  setErrors((current) => ({ ...current, paymentSlip: file && file.size > MAX_PAYMENT_SLIP_BYTES ? "The payment slip must be 10 MB or smaller." : "" }));
                }} />
                {fileName && <span className="membership-file-name">Selected: {fileName}</span>}
                {fieldError("paymentSlip")}
              </label>
              <div className="membership-fields">{fields("membership")}</div>
            </fieldset>
            <div className="membership-submit">
              <button type="submit" className="btn btn--primary btn--md">{busy ? "Submitting…" : "Submit application"}</button>
              <button type="button" className="membership-clear" onClick={() => { if (window.confirm("Clear all entered details and the selected payment slip?")) resetForm(); }}>Clear form</button>
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

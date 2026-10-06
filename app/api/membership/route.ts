import { NextResponse } from "next/server";
import { MAX_PAYMENT_SLIP_BYTES, MEMBERSHIP_FIELDS, validateMembership } from "@/lib/membership";

export const runtime = "nodejs";
const MAX_REQUEST_BYTES = MAX_PAYMENT_SLIP_BYTES + 128 * 1024;
const json = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

// Bound the actual stream, not just Content-Length, before parsing the upload.
async function readForm(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("EMPTY_BODY");
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new Error("TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return new Response(Buffer.concat(chunks), { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData();
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    // Next may use its internal hostname in request.url behind a proxy or in dev.
    // Compare against the actual incoming Host header instead.
    try {
      if (new URL(origin).host !== (request.headers.get("host") || new URL(request.url).host)) {
        return json({ success: false, message: "Please submit the form from this website." }, 403);
      }
    } catch { return json({ success: false, message: "Invalid request origin." }, 403); }
  }
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return json({ success: false, message: "Please submit the application with its payment slip." }, 415);
  if (Number(request.headers.get("content-length")) > MAX_REQUEST_BYTES) return json({ success: false, message: "The payment slip must be 10 MB or smaller." }, 413);
  let form: FormData;
  try { form = await readForm(request); }
  catch (error) { return json({ success: false, message: error instanceof Error && error.message === "TOO_LARGE" ? "The payment slip must be 10 MB or smaller." : "We couldn’t read the upload. Please select the file again." }, error instanceof Error && error.message === "TOO_LARGE" ? 413 : 400); }
  const errors = validateMembership(form);
  if (Object.keys(errors).length) return json({ success: false, message: "Please check the highlighted fields.", errors }, 400);
  const file = form.get("paymentSlip") as File;
  const submissionId = request.headers.get("idempotency-key");
  if (!submissionId || !/^[a-zA-Z0-9-]{16,80}$/.test(submissionId)) return json({ success: false, message: "Please refresh the page and try again." }, 400);
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!endpoint) {
    // Dummy Apps Script API: validate and acknowledge, but never save personal data.
    if (process.env.MEMBERSHIP_MOCK_FAIL === "true") return json({ success: false, message: "We couldn’t submit your application. Your details are still here; please try again." }, 503);
    return json({ success: true, mode: "mock", submissionId, message: "Preview submission successful. Your details and payment slip have not been saved or sent to Google." });
  }

  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" || url.hostname !== "script.google.com" || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) throw new Error("INVALID_ENDPOINT");
    const fields = Object.fromEntries([...MEMBERSHIP_FIELDS.map(({ name }) => [name, String(form.get(name) || "").trim()]), ["membershipStatus", String(form.get("membershipStatus"))], ["category", String(form.get("category"))]]);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version: 1, action: "submitMembership", submissionId, fields, paymentSlip: { filename: file.name, mimeType: file.type || "application/octet-stream", base64: Buffer.from(await file.arrayBuffer()).toString("base64") }, ...(process.env.GOOGLE_APPS_SCRIPT_SECRET ? { secret: process.env.GOOGLE_APPS_SCRIPT_SECRET } : {}) }),
      signal: AbortSignal.timeout(25000),
      cache: "no-store",
      redirect: "follow",
    });
    const result = await response.json();
    // Apps Script must confirm BOTH the saved form response and the Drive file.
    if (!response.ok || result.success !== true || result.submissionId !== submissionId || typeof result.fileId !== "string" || !result.fileId) throw new Error("UPSTREAM_FAILURE");
    return json({ success: true, mode: "live", submissionId, message: "Application submitted. Thank you—your details and payment slip have been received for review." });
  } catch {
    // Never log or expose identity details, payment files, secrets, or upstream errors.
    return json({ success: false, message: "We couldn’t confirm your submission. Your details are still here; please try again." }, 502);
  }
}

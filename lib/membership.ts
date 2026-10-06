export const MAX_PAYMENT_SLIP_BYTES = 10 * 1024 * 1024;
export const MEMBERSHIP_CATEGORIES = ["Individual", "Corporate", "SME", "International"] as const;
export const MEMBERSHIP_STATUSES = ["New", "Existing"] as const;

// Names are also the stable keys in the Apps Script request contract.
export const MEMBERSHIP_FIELDS = [
  { name: "fullName", label: "Full name with title", required: true, type: "text", autoComplete: "name", section: "personal", maxLength: 200 },
  { name: "dateOfBirth", label: "Date of birth", required: true, type: "date", autoComplete: "bday", section: "personal", maxLength: 10 },
  { name: "nationality", label: "Nationality", required: true, type: "text", autoComplete: "off", section: "personal", maxLength: 100 },
  { name: "identityNumber", label: "NIC / Passport number", required: true, type: "text", autoComplete: "off", section: "personal", maxLength: 100 },
  { name: "email", label: "Email", required: true, type: "email", autoComplete: "email", section: "contact", maxLength: 254 },
  { name: "phone", label: "Phone number", required: true, type: "tel", autoComplete: "tel", section: "contact", maxLength: 50 },
  { name: "postalAddress", label: "Postal address", required: true, type: "textarea", autoComplete: "street-address", section: "contact", maxLength: 1500 },
  { name: "city", label: "Current city / Location", required: true, type: "text", autoComplete: "address-level2", section: "contact", maxLength: 200 },
  { name: "profession", label: "Profession / Type of business", required: true, type: "text", autoComplete: "organization-title", section: "interests", maxLength: 300 },
  { name: "interests", label: "Areas of interest / Projects involved in", required: true, type: "textarea", autoComplete: "off", section: "interests", maxLength: 5000 },
  { name: "links", label: "Website / Social media links", required: false, type: "textarea", autoComplete: "off", section: "interests", maxLength: 2000 },
  { name: "description", label: "Short description about you and your interest in bamboo and rattan", required: false, type: "textarea", autoComplete: "off", section: "interests", maxLength: 5000 },
  { name: "comments", label: "Comments", required: false, type: "textarea", autoComplete: "off", section: "membership", maxLength: 5000 },
] as const;

export function validateMembership(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of MEMBERSHIP_FIELDS) {
    const raw = data.get(field.name);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (field.required && !value) errors[field.name] = `Enter your ${field.label.toLowerCase()}.`;
    else if (value.length > field.maxLength) errors[field.name] = `Use ${field.maxLength} characters or fewer.`;
  }
  const email = String(data.get("email") || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  const dob = String(data.get("dateOfBirth") || "");
  if (dob) {
    const parsed = new Date(`${dob}T00:00:00Z`);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dob || dob > today) errors.dateOfBirth = "Enter a valid date of birth that is not in the future.";
  }
  if (!MEMBERSHIP_STATUSES.includes(data.get("membershipStatus") as typeof MEMBERSHIP_STATUSES[number])) errors.membershipStatus = "Select New or Existing.";
  if (!MEMBERSHIP_CATEGORIES.includes(data.get("category") as typeof MEMBERSHIP_CATEGORIES[number])) errors.category = "Select your membership category.";
  const uploads = data.getAll("paymentSlip");
  const file = uploads[0];
  if (uploads.length !== 1 || !(file instanceof File) || !file.size) errors.paymentSlip = "Attach one payment slip.";
  else if (file.size > MAX_PAYMENT_SLIP_BYTES) errors.paymentSlip = "The payment slip must be 10 MB or smaller.";
  return errors;
}

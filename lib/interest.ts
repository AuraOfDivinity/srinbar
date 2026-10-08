// Stable field keys shared by the form and submission endpoint.
export const INTEREST_FIELDS = [
  { name: "firstName", label: "First name", required: true, type: "text", autoComplete: "given-name", maxLength: 100 },
  { name: "lastName", label: "Last name", required: true, type: "text", autoComplete: "family-name", maxLength: 100 },
  { name: "occupation", label: "Occupation", required: true, type: "text", autoComplete: "organization-title", maxLength: 300 },
  { name: "email", label: "Email", required: true, type: "email", autoComplete: "email", maxLength: 254 },
  { name: "phone", label: "Phone number", required: false, type: "tel", autoComplete: "tel", maxLength: 50 },
  { name: "description", label: "Queries / interest in bamboo", required: true, type: "textarea", autoComplete: "off", maxLength: 5000 },
] as const;

export function validateInterest(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of INTEREST_FIELDS) {
    const raw = data.get(field.name);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value && field.required) errors[field.name] = `Enter your ${field.label.toLowerCase()}.`;
    else if (value.length > field.maxLength) errors[field.name] = `Use ${field.maxLength} characters or fewer.`;
  }
  const email = String(data.get("email") || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  const phone = String(data.get("phone") || "").trim();
  if (phone && (!/^[+\d\s().-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7 || phone.replace(/\D/g, "").length > 15)) errors.phone = "Enter a valid phone number.";
  return errors;
}

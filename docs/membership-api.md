# Interest form integration

The contact page now contains an interest form. The existing `POST /api/membership` URL is retained for compatibility; it accepts only the six interest fields. No payment, identity document, or membership category is required. Actual request size is limited to 64 KiB before multipart parsing.

## Fields

All fields are required: `firstName`, `lastName`, `occupation`, `email`, `phone`, and `description` (queries / interest in bamboo). Shared limits and validation are in `lib/interest.ts`. The form preserves entered details on failure and reuses its idempotency key when retrying unchanged data.

## Preview

Without `GOOGLE_APPS_SCRIPT_URL`, submissions are validated but **not saved or sent**. Both the form and receipt disclose preview mode. Set `MEMBERSHIP_MOCK_FAIL=true` to simulate a service failure. Validation errors return 400; oversized requests return 413.

## Live integration

Configure the server-only `GOOGLE_APPS_SCRIPT_URL` with the deployed HTTPS `script.google.com/macros/s/.../exec` endpoint and optionally `GOOGLE_APPS_SCRIPT_SECRET`. Redeploy after changing configuration. Existing membership handlers must be updated for this new contract before enabling the form:

```json
{
  "version": 2,
  "action": "submitInterest",
  "submissionId": "a-client-generated-uuid",
  "secret": "only-present-when-configured",
  "fields": {
    "firstName": "",
    "lastName": "",
    "occupation": "",
    "email": "",
    "phone": "",
    "description": ""
  }
}
```

The handler must validate the configured secret and fields, save the response, and use the submission ID with locking to prevent duplicate entries. No Drive file upload is needed. Return only after the response is saved:

```json
{ "success": true, "submissionId": "same-client-generated-uuid" }
```

On failure return `{ "success": false }`. The website rejects non-success responses, invalid JSON, mismatched submission IDs, and timeouts. The server waits up to 25 seconds and the browser up to 35 seconds. Personal details and secrets are never logged.

Contact headings and the form introduction remain editable in Sanity’s Contact Page. Legacy membership information and bank details are preserved in Sanity but no longer displayed on the contact page. The `#membership` anchor remains valid for existing links.

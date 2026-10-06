# Membership form integration

The contact page posts one multipart request to `POST /api/membership`. The route validates all required fields and a single, nonempty payment slip up to 10 MiB. Actual request bytes are bounded to 10 MiB + 128 KiB before multipart parsing. Personal data and payment files are never logged or stored by this website.

## Preview / dummy API

With `GOOGLE_APPS_SCRIPT_URL` unset, `/api/membership` acts as the dummy Apps Script API. It validates the full request and returns `{ success: true, mode: "mock", submissionId, message }`. Nothing is saved to Google Drive, Google Forms, or a database. The page and success toast explicitly identify preview mode.

To exercise the failure toast, set the server-only variable `MEMBERSHIP_MOCK_FAIL=true` and restart the development server. Valid preview requests will return HTTP 503. Remove it after testing. Validation failures always return HTTP 400 plus field errors. Oversize requests return HTTP 413. No special applicant email or personal-data value is used to trigger failures.

## Connect Apps Script later

Set in `.env.local` (or deployment environment):

```dotenv
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
# Optional shared secret, validated by your script before accepting data:
GOOGLE_APPS_SCRIPT_SECRET=your-shared-secret
```

Keep these server-only: never add the `NEXT_PUBLIC_` prefix. Restart/redeploy after configuration changes. The route forwards JSON server-to-server, follows Google’s response redirect, and times out after 25 seconds. The browser times out after 35 seconds and retains entered values on failure.

Apps Script receives:

```json
{
  "version": 1,
  "action": "submitMembership",
  "submissionId": "a-client-generated-uuid",
  "secret": "only-present-when-configured",
  "fields": {
    "fullName": "",
    "dateOfBirth": "YYYY-MM-DD",
    "nationality": "",
    "identityNumber": "",
    "email": "",
    "phone": "",
    "postalAddress": "",
    "city": "",
    "profession": "",
    "interests": "",
    "links": "",
    "description": "",
    "comments": "",
    "membershipStatus": "New",
    "category": "Individual"
  },
  "paymentSlip": {
    "filename": "payment.pdf",
    "mimeType": "application/pdf",
    "base64": "base64-encoded-file-bytes"
  }
}
```

`membershipStatus` accepts `New` or `Existing` (single choice); `category` accepts `Individual`, `Corporate`, `SME`, or `International`. Website/social links, description, and comments are optional; the other fields and payment slip are required. A file-type restriction was not visible in the supplied screenshots, so all file types are accepted, within the one-file/10 MiB limit. Do not render uploaded files as executable website content.

Your `doPost(e)` handler should:

1. Validate the shared secret if configured and validate the incoming fields/file.
2. Use `submissionId` as an idempotency key, with locking to prevent duplicate writes. Retrying unchanged browser data reuses that key.
3. Decode the base64 file and create a private file in your configured Drive folder.
4. Save the application response and its Drive file ID. Map these named fields to your destination form's real item IDs, or record them in your chosen response sheet. Those IDs and the Drive folder are not configured here. A Google Forms file-upload item may require a different response-storage approach; do not treat a Drive upload alone as a completed form submission.
5. Return a JSON response only after BOTH operations succeed:

```json
{ "success": true, "submissionId": "same-client-generated-uuid", "fileId": "actual-drive-file-id" }
```

On failure return `{ "success": false }`. The website treats malformed JSON, non-2xx responses, missing Drive file IDs, mismatched submission IDs, timeouts, and explicit failures as errors. It does not show an unverified success. Handle partial uploads in the script by reusing or removing orphaned files during retries.

Deploy the script with appropriate execution/access settings and keep uploads private. The hosting platform must support multipart requests above 10 MiB and requests lasting at least 35 seconds; if it imposes a lower body limit, implement a direct/resumable upload flow before enabling live mode. Google integration is intentionally unconnected until you supply the deployed script.

## Editable content

Contact-page headings, explanatory text in English/Sinhala/Tamil, fees, bank details, and the membership contact are in Sanity’s Contact Page. The matching seed snapshot is `lib/contact-content.json`; field names and required rules are in `lib/membership.ts`. The Google-specific sign-in/account-recording notice is omitted because this form does not sign applicants into Google.

# How the lead flow works

1. A visitor selects a goal in the service finder, or uses a project CTA.
2. The contact page preselects the recommended service.
3. Step 1 qualifies service, project stage, timeline and indicative budget.
4. Step 2 gathers the location and project brief.
5. Step 3 gathers contact details, preferred channel and explicit enquiry consent.
6. The browser posts JSON to `/api/enquiries/` with a random submission token.
7. Django validates and persists the enquiry, then returns a reference. Repeating the token returns the same reference without adding another lead.
8. Staff sign in to `/admin/`, review the request, add notes and set a follow-up date.
9. Move the lead through New → Contacted → Qualified → Proposal sent → Won/Lost.

Follow-up dates are stored for staff to review; there is no automatic reminder scheduler.

Campaign attribution uses first-visit values within the browser tab's session. Contact data is held only in the form's React state until submission; it is not placed in browser storage. Closing or refreshing the page clears the contact draft. Session storage failure disables attribution but does not prevent enquiries.

The same submission token remains during retries after a timeout. After a successful submission, starting another project creates a new token. Spam honeypot, choice validation, short-brief rejection, contact validation and a 20/hour IP throttle are included. Use Redis across workers.

## API example

POST /api/enquiries/ with Content-Type: application/json:

```json
{
  "submission_id": "ee081346-cd07-4762-83c1-5ed48f5a38e6",
  "full_name": "Test Client",
  "phone": "+252630000000",
  "email": "",
  "service": "Architectural design",
  "location": "Hargeisa",
  "brief": "A four-bedroom family home on an existing plot.",
  "budget": "$50,000–$100,000",
  "timeline": "Within 3 months",
  "project_stage": "Land secured",
  "contact_preference": "whatsapp",
  "consent": true,
  "utm_source": "instagram",
  "utm_medium": "social",
  "utm_campaign": "launch",
  "landing_path": "/",
  "website": ""
}
```

Generate a new UUID for each new enquiry. Response 201 contains reference and message only. Validation errors return 400 with field errors; throttling returns 429. There is no public read endpoint and no client-supplied status/notes field.

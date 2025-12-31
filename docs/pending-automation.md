# Email Automation Engine - Implementation Guide

This document describes the pending work needed to complete the email automation system for Verified.Doctor.

## Overview

The infrastructure for email automation has been set up. This includes:
- Database tables for templates, queue, logs, and lifecycle events
- API endpoints for managing the queue
- Default email templates

What remains is the **automation engine** that actually sends emails.

---

## Current Infrastructure

### Database Tables

| Table | Purpose |
|-------|---------|
| `automation_email_templates` | Email templates with subject/body |
| `automation_email_queue` | Pending/scheduled emails |
| `automation_email_log` | Sent email history with open/click tracking |
| `user_lifecycle_events` | User actions (signup, verified, frozen, etc.) |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/automation/templates` | GET | List all email templates |
| `/api/automation/queue` | GET, POST | List/queue emails |
| `/api/automation/queue/[id]` | GET, PATCH, DELETE | Manage specific queued email |
| `/api/automation/lifecycle` | GET, POST | View/log lifecycle events |
| `/api/automation/logs` | GET | View sent email history |
| `/api/automation/process` | GET, POST | Process queue (stub) |

### Default Templates

1. **welcome** - Sent after signup
2. **verification_reminder** - Nudge to verify credentials
3. **frozen_nudge** - Remind users with frozen profiles
4. **incomplete_profile** - Nudge users who haven't completed profile

---

## Implementation Steps

### Step 1: Set Up Resend

1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain (verified.doctor)
3. Get API key and add to `.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```

4. Install Resend SDK:
   ```bash
   pnpm add resend
   ```

### Step 2: Create Email Sender Utility

Create `src/lib/email/send.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Verified.Doctor <noreply@verified.doctor>',
      to,
      subject,
      html,
      text,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
```

### Step 3: Create Template Processor

Create `src/lib/email/templates.ts`:

```typescript
interface TemplateVars {
  name: string;
  handle: string;
  profileUrl: string;
  dashboardUrl: string;
  [key: string]: string;
}

export function processTemplate(
  template: string,
  vars: TemplateVars
): string {
  let processed = template;

  for (const [key, value] of Object.entries(vars)) {
    processed = processed.replace(
      new RegExp(`{{${key}}}`, 'g'),
      value
    );
  }

  return processed;
}
```

### Step 4: Update Process Endpoint

Update `/api/automation/process/route.ts` to actually send emails:

```typescript
import { sendEmail } from '@/lib/email/send';
import { processTemplate } from '@/lib/email/templates';

// In POST handler:
for (const email of pendingEmails) {
  const { profile, template } = email;

  // Get user email from auth system
  const userEmail = await getUserEmail(profile.user_id);

  // Process template variables
  const vars = {
    name: profile.full_name,
    handle: profile.handle,
    profileUrl: `https://verified.doctor/${profile.handle}`,
    dashboardUrl: 'https://verified.doctor/dashboard',
  };

  const subject = processTemplate(template.subject, vars);
  const html = processTemplate(template.body_html, vars);
  const text = processTemplate(template.body_text, vars);

  // Send email
  const result = await sendEmail({
    to: userEmail,
    subject,
    html,
    text,
  });

  // Update queue status
  await supabase
    .from('automation_email_queue')
    .update({
      status: result.success ? 'sent' : 'failed',
      sent_at: result.success ? new Date().toISOString() : null,
      error_message: result.error?.message,
    })
    .eq('id', email.id);

  // Log the email
  await supabase
    .from('automation_email_log')
    .insert({
      profile_id: profile.id,
      template_slug: template.slug,
      recipient_email: userEmail,
      subject,
      status: result.success ? 'sent' : 'failed',
      sent_at: new Date().toISOString(),
    });
}
```

### Step 5: Set Up Cron Job

Use Vercel Cron or an external service to call the process endpoint regularly.

**Option A: Vercel Cron (Recommended)**

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/automation/process",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

**Option B: External Service**

Use services like:
- [cron-job.org](https://cron-job.org) (free)
- [EasyCron](https://www.easycron.com)
- GitHub Actions scheduled workflow

Set up to POST to `/api/automation/process` every 15 minutes with:
```
Authorization: Bearer {AUTOMATION_SECRET_KEY}
```

### Step 6: Add Lifecycle Event Triggers

Add automatic queueing when events happen:

**On Signup (incomplete_profile reminder)**:
```typescript
// In signup/onboarding flow
await fetch('/api/automation/queue', {
  method: 'POST',
  body: JSON.stringify({
    profileId: profile.id,
    templateSlug: 'incomplete_profile',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  }),
});
```

**On Profile Complete (verification_reminder)**:
```typescript
// After profile creation
await fetch('/api/automation/queue', {
  method: 'POST',
  body: JSON.stringify({
    profileId: profile.id,
    templateSlug: 'verification_reminder',
    scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
  }),
});
```

**On Freeze (already implemented)**:
The freeze API at `/api/profile/freeze` already queues `frozen_nudge` emails for 7 days later.

---

## Monitoring & Analytics

### Queue Dashboard

Consider adding an admin page at `/admin/automation` to view:
- Queue statistics (pending, sent, failed counts)
- Recent sent emails
- Failed emails for retry
- Template management

### Email Open/Click Tracking

To track opens and clicks:

1. **Open Tracking**: Add a tracking pixel:
   ```html
   <img src="https://verified.doctor/api/track/open?id={{emailId}}" />
   ```

2. **Click Tracking**: Wrap links:
   ```html
   <a href="https://verified.doctor/api/track/click?id={{emailId}}&url={{encodedUrl}}">
   ```

3. Create tracking endpoints that:
   - Update `automation_email_log` with `opened_at` or `clicked_at`
   - Redirect to actual URL (for clicks)

---

## Template Customization

### Current Templates

The default templates use placeholder HTML. Update them in Supabase with proper styled HTML.

**Example: Welcome Email HTML**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { width: 40px; height: 40px; }
    .button {
      display: inline-block;
      background: #0099F7;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://verified.doctor/verified-doctor-logo.svg" class="logo" />
    </div>
    <h1>Welcome to Verified.Doctor, {{name}}!</h1>
    <p>Your profile is now live at:</p>
    <p><a href="{{profileUrl}}">{{profileUrl}}</a></p>
    <p>Complete your profile and get verified to stand out:</p>
    <a href="{{dashboardUrl}}" class="button">Go to Dashboard</a>
  </div>
</body>
</html>
```

### Adding New Templates

1. Insert into `automation_email_templates`:
   ```sql
   INSERT INTO automation_email_templates
   (slug, name, subject, body_html, body_text, description)
   VALUES (
     'new_recommendation',
     'New Recommendation Received',
     'You received a new recommendation!',
     '<html>...</html>',
     'Plain text version...',
     'Sent when someone recommends the doctor'
   );
   ```

2. Queue emails when the event happens in your code.

---

## Security Considerations

1. **Rate Limiting**: The process endpoint should have rate limiting to prevent abuse.

2. **Secret Key**: Set `AUTOMATION_SECRET_KEY` in production to protect the process endpoint.

3. **Email Validation**: Validate email addresses before sending.

4. **Unsubscribe**: Consider adding unsubscribe links and respecting user preferences.

---

## Testing

### Manual Testing

1. Queue a test email:
   ```bash
   curl -X POST http://localhost:3000/api/automation/queue \
     -H "Content-Type: application/json" \
     -d '{"profileId": "...", "templateSlug": "welcome"}'
   ```

2. Check queue status:
   ```bash
   curl http://localhost:3000/api/automation/process
   ```

3. Trigger processing:
   ```bash
   curl -X POST http://localhost:3000/api/automation/process
   ```

### Resend Test Mode

Resend has a test mode that logs emails without actually sending them. Use this during development.

---

## Future Enhancements

1. **React Email Templates**: Use [react-email](https://react.email) for type-safe, component-based email templates.

2. **A/B Testing**: Test different subject lines and content.

3. **Smart Scheduling**: Send emails at optimal times based on user timezone.

4. **Drip Campaigns**: Multi-email sequences based on user behavior.

5. **Webhooks**: Use Resend webhooks for bounce/complaint handling.

---

## Summary Checklist

- [ ] Set up Resend account and verify domain
- [ ] Add `RESEND_API_KEY` to environment
- [ ] Install Resend SDK (`pnpm add resend`)
- [ ] Create email sender utility
- [ ] Create template processor
- [ ] Update process endpoint to actually send
- [ ] Set up cron job (Vercel Cron or external)
- [ ] Add lifecycle event triggers in app code
- [ ] Test email delivery
- [ ] Create styled HTML templates
- [ ] Add admin dashboard for monitoring
- [ ] Set up `AUTOMATION_SECRET_KEY` for production

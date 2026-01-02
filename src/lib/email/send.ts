import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// For development, use Resend's test domain
// For production, verify your domain at resend.com and use noreply@verified.doctor
const FROM_EMAIL = process.env.NODE_ENV === "production"
  ? "Verified.Doctor <noreply@verified.doctor>"
  : "Verified.Doctor <onboarding@resend.dev>";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailParams): Promise<SendEmailResult> {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not configured, skipping email send");
    return { success: false, error: "Email not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
      replyTo,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`[email] Sent to ${to}: ${subject} (ID: ${data?.id})`);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("[email] Send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(
  to: string,
  name: string,
  handle: string
): Promise<SendEmailResult> {
  const profileUrl = `https://verified.doctor/${handle}`;
  const dashboardUrl = "https://verified.doctor/dashboard";

  const subject = `Welcome to Verified.Doctor, ${name}!`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { width: 48px; height: 48px; }
    h1 { color: #0f172a; font-size: 24px; margin: 0 0 16px 0; }
    p { color: #475569; line-height: 1.6; margin: 0 0 16px 0; }
    .profile-url { background: #f1f5f9; padding: 12px 16px; border-radius: 8px; font-family: monospace; color: #0099F7; text-decoration: none; display: block; margin: 16px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #0099F7 0%, #0080CC 100%); color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 14px; }
    .steps { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .step { display: flex; align-items: flex-start; margin-bottom: 12px; }
    .step:last-child { margin-bottom: 0; }
    .step-num { background: #0099F7; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
    .step-text { color: #475569; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <img src="https://verified.doctor/verified-doctor-logo.svg" alt="Verified.Doctor" class="logo" />
      </div>

      <h1>Welcome to Verified.Doctor, ${name}!</h1>

      <p>Your professional profile is now live. Patients can find you at:</p>

      <a href="${profileUrl}" class="profile-url">${profileUrl}</a>

      <div class="steps">
        <p style="font-weight: 600; margin-bottom: 16px; color: #0f172a;">Next steps to maximize your profile:</p>
        <div class="step">
          <span class="step-num">1</span>
          <span class="step-text">Complete your profile with photo, bio, and qualifications</span>
        </div>
        <div class="step">
          <span class="step-num">2</span>
          <span class="step-text">Upload verification documents to get your verified badge</span>
        </div>
        <div class="step">
          <span class="step-num">3</span>
          <span class="step-text">Invite colleagues to grow your professional network</span>
        </div>
      </div>

      <center>
        <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
      </center>
    </div>

    <div class="footer">
      <p>Verified.Doctor - Your Digital Identity, Verified.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Welcome to Verified.Doctor, ${name}!

Your professional profile is now live at: ${profileUrl}

Next steps:
1. Complete your profile with photo, bio, and qualifications
2. Upload verification documents to get your verified badge
3. Invite colleagues to grow your professional network

Go to your dashboard: ${dashboardUrl}

- The Verified.Doctor Team
  `.trim();

  return sendEmail({ to, subject, html, text });
}

/**
 * Send a verification approved email
 */
export async function sendVerificationApprovedEmail(
  to: string,
  name: string,
  handle: string
): Promise<SendEmailResult> {
  const profileUrl = `https://verified.doctor/${handle}`;

  const subject = `Congratulations! You're now a Verified Physician`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .badge { width: 80px; height: 80px; margin: 0 auto 20px; }
    h1 { color: #0f172a; font-size: 24px; margin: 0 0 16px 0; text-align: center; }
    p { color: #475569; line-height: 1.6; margin: 0 0 16px 0; }
    .highlight { background: linear-gradient(135deg, #0099F7 0%, #0080CC 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0; }
    .highlight p { color: white; margin: 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #0099F7 0%, #0080CC 100%); color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <img src="https://verified.doctor/verified-doctor-logo.svg" alt="Verified Badge" class="badge" />
      </div>

      <h1>Congratulations, Dr. ${name}!</h1>

      <p>Your credentials have been verified. You now have the <strong>Verified Physician</strong> badge on your profile.</p>

      <div class="highlight">
        <p>Your verified profile is live at:</p>
        <p style="font-size: 18px; font-weight: 600; margin-top: 8px;">${profileUrl}</p>
      </div>

      <p>The verified badge helps patients trust your credentials and distinguishes you as a legitimate medical professional.</p>

      <center>
        <a href="${profileUrl}" class="button">View Your Profile</a>
      </center>
    </div>

    <div class="footer">
      <p>Verified.Doctor - Your Digital Identity, Verified.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Congratulations, Dr. ${name}!

Your credentials have been verified. You now have the Verified Physician badge on your profile.

Your verified profile is live at: ${profileUrl}

The verified badge helps patients trust your credentials and distinguishes you as a legitimate medical professional.

- The Verified.Doctor Team
  `.trim();

  return sendEmail({ to, subject, html, text });
}

/**
 * Send an invite email to a colleague
 */
export async function sendInviteEmail(
  to: string,
  inviterName: string,
  inviterHandle: string,
  inviteUrl: string
): Promise<SendEmailResult> {
  const inviterProfileUrl = `https://verified.doctor/${inviterHandle}`;

  const subject = `${inviterName} invited you to join Verified.Doctor`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { width: 48px; height: 48px; }
    h1 { color: #0f172a; font-size: 24px; margin: 0 0 16px 0; }
    p { color: #475569; line-height: 1.6; margin: 0 0 16px 0; }
    .inviter-card { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; }
    .inviter-name { font-size: 18px; font-weight: 600; color: #0369a1; margin-bottom: 4px; }
    .inviter-handle { font-size: 14px; color: #0284c7; }
    .button { display: inline-block; background: linear-gradient(135deg, #0099F7 0%, #0080CC 100%); color: white !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; }
    .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 14px; }
    .benefits { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .benefit { display: flex; align-items: flex-start; margin-bottom: 12px; }
    .benefit:last-child { margin-bottom: 0; }
    .benefit-icon { color: #0099F7; margin-right: 12px; font-weight: bold; }
    .benefit-text { color: #475569; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <img src="https://verified.doctor/verified-doctor-logo.svg" alt="Verified.Doctor" class="logo" />
      </div>

      <h1>You've been invited!</h1>

      <p>${inviterName} has invited you to join Verified.Doctor, the professional network for verified medical professionals.</p>

      <div class="inviter-card">
        <div class="inviter-name">${inviterName}</div>
        <div class="inviter-handle">verified.doctor/${inviterHandle}</div>
      </div>

      <div class="benefits">
        <p style="font-weight: 600; margin-bottom: 16px; color: #0f172a;">Why join Verified.Doctor?</p>
        <div class="benefit">
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">Get your own verified profile URL</span>
        </div>
        <div class="benefit">
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">Build your professional network with peers</span>
        </div>
        <div class="benefit">
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">Receive patient recommendations (no negative reviews)</span>
        </div>
        <div class="benefit">
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">Automatically connect with ${inviterName}</span>
        </div>
      </div>

      <center>
        <a href="${inviteUrl}" class="button">Accept Invitation</a>
      </center>

      <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
        By accepting this invitation, you'll automatically be connected with ${inviterName} on Verified.Doctor.
      </p>
    </div>

    <div class="footer">
      <p>Verified.Doctor - Your Digital Identity, Verified.</p>
      <p style="font-size: 12px; margin-top: 8px;">
        <a href="${inviterProfileUrl}" style="color: #0099F7;">View ${inviterName}'s profile</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
${inviterName} has invited you to join Verified.Doctor!

Verified.Doctor is the professional network for verified medical professionals.

Why join?
- Get your own verified profile URL
- Build your professional network with peers
- Receive patient recommendations (no negative reviews)
- Automatically connect with ${inviterName}

Accept the invitation: ${inviteUrl}

By accepting, you'll automatically be connected with ${inviterName}.

- The Verified.Doctor Team
  `.trim();

  return sendEmail({ to, subject, html, text });
}

/**
 * Send a new message notification email
 */
export async function sendNewMessageEmail(
  to: string,
  doctorName: string,
  senderName: string,
  messagePreview: string
): Promise<SendEmailResult> {
  const dashboardUrl = "https://verified.doctor/dashboard/messages";

  const subject = `New inquiry from ${senderName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { color: #0f172a; font-size: 20px; margin: 0 0 16px 0; }
    p { color: #475569; line-height: 1.6; margin: 0 0 16px 0; }
    .message-box { background: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #0099F7; margin: 20px 0; }
    .message-box p { margin: 0; color: #334155; }
    .sender { font-weight: 600; color: #0f172a; margin-bottom: 8px; }
    .button { display: inline-block; background: linear-gradient(135deg, #0099F7 0%, #0080CC 100%); color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>New inquiry for Dr. ${doctorName}</h1>

      <p>You received a new message from a patient:</p>

      <div class="message-box">
        <p class="sender">${senderName}</p>
        <p>${messagePreview}${messagePreview.length >= 100 ? "..." : ""}</p>
      </div>

      <center>
        <a href="${dashboardUrl}" class="button">View & Reply</a>
      </center>
    </div>

    <div class="footer">
      <p>Verified.Doctor - Your Digital Identity, Verified.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
New inquiry for Dr. ${doctorName}

You received a new message from ${senderName}:

"${messagePreview}${messagePreview.length >= 100 ? "..." : ""}"

View and reply: ${dashboardUrl}

- The Verified.Doctor Team
  `.trim();

  return sendEmail({ to, subject, html, text });
}

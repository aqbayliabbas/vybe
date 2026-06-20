import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_TO   = process.env.WAITLIST_NOTIFY_EMAIL  ?? 'hello@vybe.app';
const FROM        = process.env.WAITLIST_FROM_EMAIL    ?? 'Vybe Waitlist <onboarding@resend.dev>';
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;    // required for audience sync

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // ── 1. Add contact to Resend Audience ───────────────────────────────────
    if (AUDIENCE_ID) {
      const { error: contactError } = await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        unsubscribed: false,
      });

      if (contactError) {
        // Log but don't block — notification email is more critical
        console.error('[waitlist] Failed to add contact to audience:', contactError);
      }
    } else {
      console.warn('[waitlist] RESEND_AUDIENCE_ID is not set — skipping audience sync.');
    }

    // ── 2. Send notification email to your inbox ─────────────────────────────
    const { error: emailError } = await resend.emails.send({
      from: FROM,
      to: [NOTIFY_TO],
      replyTo: email,
      subject: `🎉 New brand waitlist signup: ${email}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
            <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#f7931e,#ea2d3e);display:inline-flex;align-items:center;justify-content:center;">
              <span style="color:#fff;font-size:18px;">⚡</span>
            </div>
            <span style="font-size:20px;font-weight:700;color:#111;">Vybe</span>
          </div>
          <h2 style="font-size:18px;font-weight:700;color:#111;margin:0 0 8px;">New brand waitlist signup</h2>
          <p style="font-size:14px;color:#666;margin:0 0 24px;">Someone just joined the Vybe for Brands waitlist and was added to your Resend audience.</p>
          <div style="background:#f5f5f5;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <p style="font-size:12px;color:#999;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.08em;">Email</p>
            <p style="font-size:15px;font-weight:600;color:#111;margin:0;">${email}</p>
          </div>
          <p style="font-size:12px;color:#bbb;margin:0;">Sent by Vybe waitlist · ${new Date().toUTCString()}</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('[waitlist] Resend email error:', emailError);
      return NextResponse.json({ error: 'Failed to send notification email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[waitlist] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

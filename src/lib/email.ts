/**
 * Shared email sending utility for Hofherr Meat Co.
 *
 * Supports Resend and SendGrid. Falls back to console logging if
 * neither RESEND_API_KEY nor SENDGRID_API_KEY is configured.
 *
 * Usage:
 *   import { sendEmail } from '@/lib/email';
 *   await sendEmail({
 *       to: 'customer@example.com',
 *       subject: 'Welcome!',
 *       html: '<h1>Hello</h1>',
 *       text: 'Hello',
 *       from: 'Hofherr Meat Co. <noreply@hofherrmeatco.com>',
 *   });
 */

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text: string;
    from?: string;
    replyTo?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<{ success: boolean; provider?: string }> {
    const { to, subject, html, text, from = 'Hofherr Meat Co. <onboarding@resend.dev>', replyTo } = opts;

    const resendKey = process.env.RESEND_API_KEY;
    const sendgridKey = process.env.SENDGRID_API_KEY;

    // ── Resend ─────────────────────────────────────────────────────────────
    if (resendKey) {
        try {
            const body: Record<string, any> = { from, to, subject, html, text };
            if (replyTo) body.reply_to = replyTo;

            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[Email/Resend] Error:', data);
                return { success: false, provider: 'resend' };
            }
            console.log(`[Email/Resend] Sent to ${to}: "${subject}" (id: ${data.id})`);
            return { success: true, provider: 'resend' };
        } catch (err) {
            console.error('[Email/Resend] Exception:', err);
            return { success: false, provider: 'resend' };
        }
    }

    // ── SendGrid ───────────────────────────────────────────────────────────
    if (sendgridKey) {
        try {
            const fromParsed = from.match(/(.*)\s*<(.+)>/) || [, undefined, from];
            const sgBody: Record<string, any> = {
                personalizations: [{ to: [{ email: to }] }],
                from: { email: fromParsed[2], name: fromParsed[1]?.trim() || 'Hofherr Meat Co.' },
                subject,
                content: [
                    { type: 'text/plain', value: text },
                    { type: 'text/html', value: html },
                ],
            };
            if (replyTo) sgBody.reply_to = { email: replyTo };

            const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sendgridKey}` },
                body: JSON.stringify(sgBody),
            });
            if (!res.ok) {
                console.error('[Email/SendGrid] Error:', await res.text());
                return { success: false, provider: 'sendgrid' };
            }
            console.log(`[Email/SendGrid] Sent to ${to}: "${subject}"`);
            return { success: true, provider: 'sendgrid' };
        } catch (err) {
            console.error('[Email/SendGrid] Exception:', err);
            return { success: false, provider: 'sendgrid' };
        }
    }

    // ── No provider ────────────────────────────────────────────────────────
    console.warn('[Email] No provider configured (set RESEND_API_KEY or SENDGRID_API_KEY)');
    console.log(`[Email] Would send to ${to}: "${subject}"`);
    return { success: false };
}

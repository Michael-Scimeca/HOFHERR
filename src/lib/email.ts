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
    scheduledAt?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<{ success: boolean; provider?: string; error?: string }> {
    const defaultFrom = process.env.EMAIL_FROM || 'Hofherr Meat Co. <onboarding@resend.dev>';
    const { to, subject, html, text, from = defaultFrom, replyTo, scheduledAt } = opts;

    const resendKey = process.env.RESEND_API_KEY;
    const sendgridKey = process.env.SENDGRID_API_KEY;

    // ── Resend ─────────────────────────────────────────────────────────────
    if (resendKey) {
        try {
            const body: Record<string, unknown> = { from, to, subject, html, text };
            if (replyTo) body.reply_to = replyTo;
            if (scheduledAt) body.scheduled_at = scheduledAt;

            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
                body: JSON.stringify(body),
            });
            const data = (await res.json()) as { id?: string; message?: string };
            if (!res.ok) {
                console.error('[Email/Resend] Error:', data);
                return { success: false, provider: 'resend', error: data?.message || `Resend HTTP ${res.status}` };
            }
            console.log(`[Email/Resend] Sent to ${to}: "${subject}" (id: ${data.id})`);
            return { success: true, provider: 'resend' };
        } catch (err) {
            console.error('[Email/Resend] Exception:', err);
            return { success: false, provider: 'resend', error: err instanceof Error ? err.message : 'Resend request failed' };
        }
    }

    // ── SendGrid ───────────────────────────────────────────────────────────
    if (sendgridKey) {
        try {
            const fromParsed = from.match(/(.*)\s*<(.+)>/) || [, undefined, from];
            const sgBody: Record<string, unknown> = {
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
                const errText = await res.text();
                console.error('[Email/SendGrid] Error:', errText);
                return { success: false, provider: 'sendgrid', error: errText || `SendGrid HTTP ${res.status}` };
            }
            console.log(`[Email/SendGrid] Sent to ${to}: "${subject}"`);
            return { success: true, provider: 'sendgrid' };
        } catch (err) {
            console.error('[Email/SendGrid] Exception:', err);
            return { success: false, provider: 'sendgrid', error: err instanceof Error ? err.message : 'SendGrid request failed' };
        }
    }

    // ── No provider ────────────────────────────────────────────────────────
    console.warn('[Email] No provider configured (set RESEND_API_KEY or SENDGRID_API_KEY)');
    console.log(`[Email] Would send to ${to}: "${subject}"`);
    return {
        success: false,
        error: 'No email API key configured. Add RESEND_API_KEY (free at resend.com) or SENDGRID_API_KEY to .env.local and restart the dev server.',
    };
}

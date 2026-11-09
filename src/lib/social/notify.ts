import { sendEmail } from '@/lib/email';
import { siteUrl } from './sign';
import type { SocialPost, SocialSettings, SocialWeek } from './types';

const when = (iso?: string) =>
    iso ? new Date(iso).toLocaleString('en-US', { timeZone: 'America/Chicago', weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function shell(title: string, inner: string) {
    return `<div style="font-family:Arial,sans-serif;background:#1c1614;padding:24px;color:#f3ead8">
<div style="max-width:560px;margin:0 auto;background:#241d1a;border-radius:12px;padding:24px">
<p style="margin:0 0 4px;color:#f59b1a;font-size:12px;letter-spacing:2px;text-transform:uppercase">Hofherr Meat Co. · Social</p>
<h1 style="margin:0 0 16px;font-size:22px">${esc(title)}</h1>${inner}
<p style="margin:24px 0 0"><a href="${siteUrl()}/admin/social" style="display:inline-block;background:#cc0e1d;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Review &amp; approve</a></p>
<p style="margin:16px 0 0;color:#9a8f86;font-size:12px">Nothing posts until it's approved. Spelling is checked automatically.</p></div></div>`;
}

const row = (p: SocialPost) =>
    `<tr><td style="padding:8px 0;color:#f59b1a;font-weight:bold;width:90px;vertical-align:top">${esc(when(p.scheduledFor).split(',')[0])}</td><td style="padding:8px 0">${esc(p.label)}<br><span style="color:#9a8f86;font-size:12px">${esc(when(p.scheduledFor))}</span></td></tr>`;

/** Sent when a new week is generated. */
export async function notifyWeekReady(week: SocialWeek, settings: SocialSettings) {
    if (!settings.notifyEmails.length) return { sent: 0 };
    const html = shell(`This week's ${week.posts.length} posts are ready to review`, `<table style="width:100%;border-collapse:collapse;font-size:14px">${week.posts.map(row).join('')}</table>`);
    const text = `This week's posts are ready to review:\n\n${week.posts.map((p) => `${when(p.scheduledFor)} — ${p.label}`).join('\n')}\n\nReview: ${siteUrl()}/admin/social`;
    await Promise.all(settings.notifyEmails.map((to) => sendEmail({ to, subject: `📸 ${week.posts.length} social posts ready for the week of ${week.weekOf}`, html, text })));
    return { sent: settings.notifyEmails.length };
}

/** Sent ~24h before a post goes out if it still hasn't been approved. */
export async function notifyNeedsApproval(posts: SocialPost[], settings: SocialSettings) {
    if (!settings.notifyEmails.length || !posts.length) return { sent: 0 };
    const html = shell(`${posts.length} post${posts.length > 1 ? 's' : ''} going out soon need${posts.length > 1 ? '' : 's'} your OK`, `<table style="width:100%;border-collapse:collapse;font-size:14px">${posts.map(row).join('')}</table>`);
    const text = `These posts need approval before they go out:\n\n${posts.map((p) => `${when(p.scheduledFor)} — ${p.label}`).join('\n')}\n\nReview: ${siteUrl()}/admin/social`;
    await Promise.all(settings.notifyEmails.map((to) => sendEmail({ to, subject: `⏰ Approve tomorrow's social post`, html, text })));
    return { sent: settings.notifyEmails.length };
}

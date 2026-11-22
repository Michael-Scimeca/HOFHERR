import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { sendEmail } from '@/lib/email';

type EmailTheme = 'butcher' | 'depot' | 'gold';

function escapeHtml(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

interface EmailHighlight {
    tag: string;
    title: string;
    note: string;
}

function formatItemList(items: string[]): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} & ${items[1]}`;
    return `${items.slice(0, -1).join(', ')} & ${items[items.length - 1]}`;
}

function buildBrandedHtml(params: {
    previewText: string;
    headline: string;
    body: string;
    ctaLabel: string;
    ctaUrl: string;
    theme: EmailTheme;
    isTest: boolean;
    psNote?: string;
    showQr?: boolean;
    highlights?: EmailHighlight[];
    quickItems?: string;
}): string {
    const palette =
        params.theme === 'depot'
            ? { headerBg: '#1e3a5f', accent: '#2563eb', badge: 'THE DEPOT · WINNETKA METRA STATION' }
            : params.theme === 'gold'
              ? { headerBg: '#3b2f1c', accent: '#A8905F', badge: 'HOFHERR MEAT CO. · EST. 1903' }
              : { headerBg: '#8B0A10', accent: '#CC0E1D', badge: 'HOFHERR MEAT CO. · NORTHFIELD, IL' };

    const safeHeadline = escapeHtml(params.headline);
    const safePreview = escapeHtml(params.previewText);
    const safeCtaLabel = escapeHtml(params.ctaLabel);
    const rawBaseCtaUrl = /^https?:\/\//i.test(params.ctaUrl)
        ? params.ctaUrl
        : `https://hofherrmeatco.com${params.ctaUrl.startsWith('/') ? params.ctaUrl : `/${params.ctaUrl}`}`;
    const baseCtaUrl =
        params.theme === 'depot' && rawBaseCtaUrl.includes('/online-orders')
            ? rawBaseCtaUrl.includes('store=butcher')
                ? rawBaseCtaUrl.replace('store=butcher', 'store=depot')
                : rawBaseCtaUrl.includes('store=')
                  ? rawBaseCtaUrl
                  : `${rawBaseCtaUrl}${rawBaseCtaUrl.includes('?') ? '&' : '?'}store=depot`
            : rawBaseCtaUrl;
    const quickList = (params.quickItems ?? '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    const safeCtaUrl =
        quickList.length > 0 && !baseCtaUrl.includes('quickOrder=')
            ? `${baseCtaUrl}${baseCtaUrl.includes('?') ? '&' : '?'}quickOrder=${encodeURIComponent(quickList.join(','))}`
            : baseCtaUrl;
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&bgcolor=ffffff&color=111111&data=${encodeURIComponent(safeCtaUrl)}`;
    const safePs = (params.psNote ?? '').trim();
    const featuredLabel = formatItemList(quickList);

    const paragraphs = params.body
        .split(/\n{2,}/)
        .map(p => p.trim())
        .filter(Boolean)
        .map(
            p =>
                `<p class="hm-text" style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:#e5e5e5 !important;">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`
        )
        .join('');

    const highlightsHtml =
        params.highlights && params.highlights.length > 0
            ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#18181b" style="margin:20px 0 22px 0;background-color:#18181b;background-image:linear-gradient(#18181b,#18181b);border:1px solid #27272a;border-radius:10px;overflow:hidden;">
                ${params.highlights
                    .map(
                        (item, idx) => `<tr>
                  <td style="padding:12px 16px;${idx > 0 ? 'border-top:1px solid #27272a;' : ''}">
                    <div style="font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#fde68a !important;margin-bottom:3px;">${escapeHtml(item.tag)}</div>
                    <div style="font-size:15px;font-weight:800;color:#ffffff !important;margin-bottom:2px;">${escapeHtml(item.title)}</div>
                    <div style="font-size:13px;color:#a1a1aa !important;line-height:1.45;">${escapeHtml(item.note)}</div>
                  </td>
                </tr>`
                    )
                    .join('')}
              </table>`
            : '';

    const qrHtml =
        params.showQr !== false
            ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#18181b" style="margin:22px 0 0 0;background-color:#18181b;background-image:linear-gradient(#18181b,#18181b);border:1px solid #2e2e33;border-radius:12px;">
                <tr>
                  <td width="118" valign="middle" style="padding:14px 0 14px 14px;">
                    <a href="${escapeHtml(safeCtaUrl)}" style="display:inline-block;background-color:#ffffff;padding:7px;border-radius:8px;text-decoration:none;">
                      <img src="${qrSrc}" width="96" height="96" alt="Scan to order from Hofherr Meat Co." style="display:block;width:96px;height:96px;border:0;" />
                    </a>
                  </td>
                  <td valign="middle" style="padding:14px 16px;">
                    <div style="font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#fde68a !important;margin-bottom:4px;">${featuredLabel ? 'SCAN TO QUICK-ORDER THIS EMAIL’S CUTS' : 'QUICK PHONE ORDER'}</div>
                    <div style="font-size:16px;font-weight:800;color:#ffffff !important;line-height:1.25;margin-bottom:4px;">${featuredLabel ? escapeHtml(featuredLabel) : 'Scan to Order in Seconds'}</div>
                    <div style="font-size:13px;color:#b4b4bc !important;line-height:1.45;">${featuredLabel ? 'Point your phone camera at this code to pull up these exact cuts pre-loaded for 1-tap pickup ordering.' : 'Reading on desktop? Point your phone camera at the code to jump straight to pickup ordering.'}</div>
                  </td>
                </tr>
              </table>`
            : '';

    const psHtml = safePs
        ? `<div style="margin:20px 0 0 0;padding:12px 14px;background-color:#161619;background-image:linear-gradient(#161619,#161619);border-left:3px solid ${palette.accent};border-radius:0 8px 8px 0;font-size:13px;line-height:1.55;color:#d4d4d8 !important;"><strong style="color:#ffffff !important;">P.S.</strong> ${escapeHtml(safePs)}</div>`
        : '';

    const testRibbon = params.isTest
        ? `<tr><td bgcolor="#261c06" style="background-color:#261c06;background-image:linear-gradient(#261c06,#261c06);color:#fbbf24;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;text-align:center;padding:8px 12px;border-bottom:1px solid #45320a;">TEST EMAIL PREVIEW — NOT SENT TO SUBSCRIBERS</td></tr>`
        : '';

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark only" />
  <meta name="supported-color-schemes" content="dark only" />
  <style>
    :root { color-scheme: dark only; supported-color-schemes: dark only; }
    body, .hm-outer { background-color: #09090b !important; color: #e5e5e5 !important; }
    .hm-card { background-color: #121214 !important; }
    .hm-header { background-color: ${palette.headerBg} !important; }
    .hm-headline { color: #ffffff !important; }
    .hm-badge { color: #fde68a !important; }
    .hm-text { color: #e5e5e5 !important; }
    .hm-cta { background-color: ${palette.accent} !important; color: #ffffff !important; }
    .hm-footer { background-color: #0c0c0e !important; color: #a1a1aa !important; }
    @media (prefers-color-scheme: light) {
      body, .hm-outer { background-color: #09090b !important; }
      .hm-card { background-color: #121214 !important; }
      .hm-header { background-color: ${palette.headerBg} !important; }
      .hm-headline { color: #ffffff !important; }
      .hm-badge { color: #fde68a !important; }
      .hm-text { color: #e5e5e5 !important; }
      .hm-cta { background-color: ${palette.accent} !important; color: #ffffff !important; }
      .hm-footer { background-color: #0c0c0e !important; color: #a1a1aa !important; }
    }
    @media (prefers-color-scheme: dark) {
      body, .hm-outer { background-color: #09090b !important; }
      .hm-card { background-color: #121214 !important; }
      .hm-header { background-color: ${palette.headerBg} !important; }
      .hm-headline { color: #ffffff !important; }
      .hm-badge { color: #fde68a !important; }
      .hm-text { color: #e5e5e5 !important; }
      .hm-cta { background-color: ${palette.accent} !important; color: #ffffff !important; }
      .hm-footer { background-color: #0c0c0e !important; color: #a1a1aa !important; }
    }
  </style>
</head>
<body bgcolor="#09090b" style="margin:0;padding:0;background-color:#09090b;background-image:linear-gradient(#09090b,#09090b);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreview}</div>
  <table class="hm-outer" role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#09090b" style="background-color:#09090b;background-image:linear-gradient(#09090b,#09090b);padding:24px 12px;">
    <tr>
      <td align="center">
        <table class="hm-card" role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#121214" style="max-width:600px;background-color:#121214;background-image:linear-gradient(#121214,#121214);border:1px solid #27272a;border-radius:14px;overflow:hidden;">
          ${testRibbon}
          <tr>
            <td class="hm-header" bgcolor="${palette.headerBg}" style="background-color:${palette.headerBg};background-image:linear-gradient(${palette.headerBg},${palette.headerBg});padding:28px 32px;border-bottom:3px solid ${palette.accent};">
              <div class="hm-badge" style="font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#fde68a !important;margin-bottom:8px;">${palette.badge}</div>
              <h1 class="hm-headline" style="margin:0;font-family:'Oswald','Arial Narrow','Helvetica Condensed',Impact,Arial,sans-serif;font-size:30px;line-height:1.08;font-weight:900;text-transform:uppercase;color:#ffffff !important;letter-spacing:0.02em;">${safeHeadline}</h1>
            </td>
          </tr>
          <tr>
            <td bgcolor="#121214" style="background-color:#121214;background-image:linear-gradient(#121214,#121214);padding:28px 32px;">
              ${paragraphs}
              ${highlightsHtml}
              ${
                  safeCtaLabel
                      ? `<div style="margin:22px 0 6px 0;">
                  <a class="hm-cta" href="${escapeHtml(safeCtaUrl)}" style="display:inline-block;background-color:${palette.accent};background-image:linear-gradient(${palette.accent},${palette.accent});color:#ffffff !important;text-decoration:none;font-size:15px;font-weight:800;padding:14px 26px;border-radius:8px;letter-spacing:0.03em;">${safeCtaLabel}</a>
                </div>
                <div style="font-size:12px;color:#8e8e98 !important;margin:6px 0 0 0;">Custom hand-trimming free · Exact 15-min pickup windows · Curbside trunk drop-off</div>`
                      : ''
              }
              ${qrHtml}
              ${psHtml}
            </td>
          </tr>
          <tr>
            <td class="hm-footer" bgcolor="#0c0c0e" style="padding:20px 32px;background-color:#0c0c0e;background-image:linear-gradient(#0c0c0e,#0c0c0e);border-top:1px solid #27272a;font-size:12px;line-height:1.6;color:#a1a1aa !important;">
              <strong style="color:#f4f4f5 !important;">Hofherr Meat Co.</strong> · 300 Happ Rd, Northfield · 754 Elm St, Winnetka · (847) 441-MEAT
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function GET() {
    const provider = process.env.RESEND_API_KEY
        ? 'resend'
        : process.env.SENDGRID_API_KEY
          ? 'sendgrid'
          : null;
    return NextResponse.json({
        configured: Boolean(provider),
        provider,
        from: process.env.EMAIL_FROM || 'Hofherr Meat Co. <onboarding@resend.dev>',
    });
}

const CT_PARTS_FMT = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
});

function computeNextOptimalSendIso(): { iso: string; label: string } | null {
    // Research-backed peak open windows for North Shore butcher & café:
    // Tue 10:00 AM CT, Wed 10:00 AM CT, Thu 10:30 AM CT, or next day 10:00 AM CT (must be within Resend's 72h limit).
    const now = new Date();
    const maxHorizonMs = 70 * 60 * 60 * 1000; // stay safely under Resend's 72h cap
    for (let dayOffset = 0; dayOffset <= 3; dayOffset++) {
        const candidate = new Date(now.getTime() + dayOffset * 86400000);
        // 10:00 AM America/Chicago is 16:00 UTC (CST) or 15:00 UTC (CDT)
        const ctParts = CT_PARTS_FMT.formatToParts(candidate);
        const y = ctParts.find(p => p.type === 'year')?.value;
        const m = ctParts.find(p => p.type === 'month')?.value;
        const d = ctParts.find(p => p.type === 'day')?.value;
        const weekday = ctParts.find(p => p.type === 'weekday')?.value ?? '';
        if (!y || !m || !d) continue;
        // Prefer Tue/Wed/Thu 10:00 AM CT; if none within 70h, fall back to next morning 10:00 AM CT
        const isPeakDay = weekday === 'Tue' || weekday === 'Wed' || weekday === 'Thu';
        const targetUtc = new Date(`${y}-${m}-${d}T16:00:00.000Z`); // ~10 AM CT
        const diff = targetUtc.getTime() - now.getTime();
        if (diff > 15 * 60 * 1000 && diff <= maxHorizonMs && (isPeakDay || dayOffset >= 1)) {
            return {
                iso: targetUtc.toISOString(),
                label: `${weekday} 10:00 AM CT`,
            };
        }
    }
    return null;
}

export async function POST(req: NextRequest) {
    try {
        const [session, cookieStore] = await Promise.all([auth(), cookies()]);
        const isGodMode =
            process.env.NODE_ENV !== 'production' &&
            cookieStore.get('hofherr_god_mode')?.value === 'true';

        if (!session?.user?.isAdmin && !isGodMode) {
            return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
        }

        const payload = (await req.json()) as {
            mode?: 'test' | 'broadcast';
            testEmail?: string;
            recipients?: string[];
            subject?: string;
            previewText?: string;
            headline?: string;
            body?: string;
            ctaLabel?: string;
            ctaUrl?: string;
            theme?: EmailTheme;
            psNote?: string;
            showQr?: boolean;
            highlights?: EmailHighlight[];
            quickItems?: string;
            autoSchedule?: boolean;
        };

        const mode = payload.mode === 'broadcast' ? 'broadcast' : 'test';
        const subject = (payload.subject ?? '').trim();
        const headline = (payload.headline ?? subject).trim();
        const previewText = (payload.previewText ?? '').trim();
        const body = (payload.body ?? '').trim();
        const ctaLabel = (payload.ctaLabel ?? '').trim();
        const ctaUrl = (payload.ctaUrl ?? '/online-orders').trim();
        const theme: EmailTheme =
            payload.theme === 'depot' || payload.theme === 'gold' ? payload.theme : 'butcher';
        const psNote = (payload.psNote ?? '').trim();
        const showQr = payload.showQr !== false;
        const quickItems = (payload.quickItems ?? '').trim();
        const autoSchedule = mode === 'broadcast' && payload.autoSchedule !== false;
        const optimalWindow = autoSchedule ? computeNextOptimalSendIso() : null;
        const highlights = Array.isArray(payload.highlights)
            ? payload.highlights.filter(h => h && typeof h.title === 'string' && h.title.trim())
            : [];

        if (!subject || !body) {
            return NextResponse.json({ error: 'Subject and email body are required.' }, { status: 400 });
        }

        const targets: string[] =
            mode === 'test'
                ? [(payload.testEmail ?? '').trim()].filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
                : (payload.recipients ?? [])
                      .map(e => String(e).trim())
                      .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

        if (targets.length === 0) {
            return NextResponse.json(
                { error: mode === 'test' ? 'Enter a valid test email address.' : 'No valid subscriber emails selected.' },
                { status: 400 }
            );
        }

        const html = buildBrandedHtml({
            previewText,
            headline,
            body,
            ctaLabel,
            ctaUrl,
            theme,
            isTest: mode === 'test',
            psNote,
            showQr,
            highlights,
            quickItems,
        });
        const text = `${headline}\n\n${body}${highlights.length ? `\n\n${highlights.map(h => `• ${h.tag}: ${h.title} — ${h.note}`).join('\n')}` : ''}${ctaLabel ? `\n\n${ctaLabel}: https://hofherrmeatco.com${ctaUrl.startsWith('/') ? ctaUrl : `/${ctaUrl}`}` : ''}${psNote ? `\n\nP.S. ${psNote}` : ''}\n\n— Hofherr Meat Co. · (847) 441-MEAT`;

        const finalSubject = mode === 'test' ? `[TEST] ${subject}` : subject;
        let sentCount = 0;
        let provider: string | undefined;
        let lastError: string | undefined;

        const results = await Promise.all(
            targets.map(to =>
                sendEmail({
                    to,
                    subject: finalSubject,
                    html,
                    text,
                    replyTo: 'butcher@hofherrmeatco.com',
                    scheduledAt: optimalWindow?.iso,
                })
            )
        );
        for (const result of results) {
            if (result.success) {
                sentCount += 1;
                provider = result.provider;
            } else if (result.error) {
                lastError = result.error;
            }
        }

        if (sentCount === 0) {
            return NextResponse.json(
                {
                    error:
                        lastError ||
                        'Email provider not configured or rejected send. Set RESEND_API_KEY or SENDGRID_API_KEY in .env.local.',
                },
                { status: 502 }
            );
        }

        return NextResponse.json({
            ok: true,
            mode,
            sentCount,
            totalTargets: targets.length,
            provider: provider ?? 'email',
            scheduledFor: optimalWindow?.label ?? null,
        });
    } catch (err) {
        console.error('[admin/newsletter/send] Error:', err);
        return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }
}


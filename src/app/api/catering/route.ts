import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

/* ── Foundation for Emails — inlined CSS reset (critical subset) ──────────── */
const FOUNDATION_RESET = `
body { width:100%!important; min-width:100%; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; }
table { border-spacing:0; border-collapse:collapse; }
td { word-wrap:break-word; border-collapse:collapse!important; }
table,tr,td { padding:0; vertical-align:top; text-align:left; }
img { outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; width:auto; max-width:100%; clear:both; display:block; }
`;

const BRAND = {
    red: '#CC0E1D',
    dark: '#111111',
    bg: '#f3f3f3',
    white: '#ffffff',
    muted: '#999999',
    gold: '#A8905F',
    green: '#2ecc71',
    font: "Arial, Helvetica, sans-serif",
};

/* ── Foundation for Emails helper: wrap content in a proper email document ── */
function emailDocument(title: string, preheader: string, bodyContent: string): string {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>${title}</title>
  <style>${FOUNDATION_RESET}
    body, .body { background:${BRAND.bg}!important; }
    table.body { background:${BRAND.bg}; height:100%; width:100%; }
    table.container { background:${BRAND.white}; width:580px; margin:0 auto; text-align:inherit; }
    table.row { padding:0; width:100%; position:relative; }
    td.columns, th.columns { margin:0 auto; padding-left:16px; padding-bottom:16px; }
    @media only screen and (max-width:596px) {
      table.body .container { width:95%!important; }
      table.body .columns { height:auto!important; padding-left:16px!important; padding-right:16px!important; }
      .responsive-img { width:100%!important; height:auto!important; }
    }
  </style>
</head>
<body>
  <span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;color:${BRAND.bg};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
  <table class="body" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.bg};">
    <tr>
      <td align="center" valign="top">
        <!-- Spacer -->
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>

        ${bodyContent}

        <!-- Spacer -->
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── Foundation table row helper ── */
function row(content: string, bgColor = BRAND.white): string {
    return `
    <table class="container" width="580" cellpadding="0" cellspacing="0" role="presentation" style="background:${bgColor};margin:0 auto;">
      <tr>
        <td>
          <table class="row" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <th class="columns" style="padding:0 24px;font-family:${BRAND.font};">
                ${content}
              </th>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

/* ── Foundation divider ── */
function divider(color = '#e0e0e0'): string {
    return `<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:${color};font-size:1px;line-height:1px;">&nbsp;</td></tr></table>`;
}

/* ── Line item row for the receipt ── */
function lineItem(label: string, value: string, bold = false): string {
    const fw = bold ? 'font-weight:700;' : '';
    const fs = bold ? 'font-size:18px;' : 'font-size:14px;';
    const color = bold ? `color:${BRAND.green};` : 'color:#333;';
    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:8px;">
      <tr>
        <td style="${fs}${fw}color:#333;font-family:${BRAND.font};padding:4px 0;">${label}</td>
        <td align="right" style="${fs}${fw}${color}font-family:${BRAND.font};padding:4px 0;white-space:nowrap;">${value}</td>
      </tr>
    </table>`;
}

/* ── Build the customer receipt email ── */
function buildCustomerReceipt(data: {
    name: string;
    date: string;
    guests: number;
    packageName: string;
    total: number;
    meats: string[];
    sides: string[];
}): string {
    const totalFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.total);

    const meatChips = data.meats.map(m =>
        `<span style="display:inline-block;background:#fde8e8;color:${BRAND.red};padding:4px 10px;border-radius:4px;font-size:13px;font-weight:600;margin:2px 4px 2px 0;font-family:${BRAND.font};">${m}</span>`
    ).join('');

    const sideChips = data.sides.map(s =>
        `<span style="display:inline-block;background:#e8f5e9;color:#2e7d32;padding:4px 10px;border-radius:4px;font-size:13px;font-weight:600;margin:2px 4px 2px 0;font-family:${BRAND.font};">${s}</span>`
    ).join('');

    const body = [
        // Header banner
        `<table class="container" width="580" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;overflow:hidden;border-radius:8px 8px 0 0;">
          <tr><td style="background:${BRAND.red};padding:32px 24px;text-align:center;">
            <h1 style="color:#fff;font-family:${BRAND.font};font-size:32px;margin:0;">✓ Inquiry Received</h1>
            <p style="color:rgba(255,255,255,0.8);font-family:${BRAND.font};font-size:14px;margin:8px 0 0;">We'll be in touch shortly to confirm your date.</p>
          </td></tr>
        </table>`,

        // Greeting
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:24px;">&nbsp;</td></tr></table>
          <p style="font-size:16px;color:#333;font-family:${BRAND.font};margin:0 0 8px;">Hi ${data.name.split(' ')[0]},</p>
          <p style="font-size:14px;color:#666;font-family:${BRAND.font};line-height:1.6;margin:0 0 20px;">
            Thank you for your catering inquiry. Here's a summary of your request:
          </p>
        `),

        // Event details
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 12px;font-weight:700;">Event Details</p>
          ${lineItem('📅 Date', data.date || 'To be confirmed')}
          ${lineItem('👥 Guests', String(data.guests))}
          ${lineItem('📦 Package', data.packageName)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `),

        // Meats
        data.meats.length > 0 ? row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 8px;font-weight:700;">🔥 Selected Meats</p>
          <div style="line-height:2;">${meatChips}</div>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `) : '',

        // Sides
        data.sides.length > 0 ? row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 8px;font-weight:700;">🥗 Selected Sides</p>
          <div style="line-height:2;">${sideChips}</div>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `) : '',

        // Total
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:12px;">&nbsp;</td></tr></table>
          ${divider(BRAND.gold)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:16px;">&nbsp;</td></tr></table>
          ${lineItem('Estimated Total', totalFormatted, true)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:16px;">&nbsp;</td></tr></table>
        `),

        // Note + CTA
        row(`
          <p style="font-size:13px;color:#666;font-family:${BRAND.font};line-height:1.6;margin:0 0 20px;">
            Sean and the team will review your inquiry and reach out to confirm availability, finalize your menu, and discuss any dietary needs or special requests.
          </p>
          <table class="button" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="background:${BRAND.red};border-radius:6px;">
                      <a href="tel:8474416328" style="color:#fff;font-family:${BRAND.font};font-size:16px;font-weight:700;text-decoration:none;display:inline-block;padding:14px 32px;">
                        📞 Call (847) 441-MEAT
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `),

        // Footer
        `<table class="container" width="580" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;border-radius:0 0 8px 8px;overflow:hidden;">
          <tr><td style="background:${BRAND.dark};padding:20px 24px;text-align:center;">
            <p style="color:rgba(255,255,255,0.5);font-family:${BRAND.font};font-size:12px;margin:0;line-height:1.6;">
              Hofherr Meat Co. · 807 Happ Rd, Northfield, IL 60093 · (847) 441-MEAT<br/>
              <span style="color:rgba(255,255,255,0.3);">* Pricing does not include sales tax. Your date is not reserved until confirmed by Sean.</span>
            </p>
          </td></tr>
        </table>`,
    ].join('');

    return emailDocument(
        `Your Catering Inquiry — Hofherr Meat Co.`,
        `Hi ${data.name.split(' ')[0]}, we received your catering inquiry for ${data.date}. Estimated total: ${totalFormatted}.`,
        body
    );
}

/* ── Build the internal team notification email ── */
function buildTeamNotification(data: {
    name: string;
    email: string;
    phone: string;
    date: string;
    guests: number;
    packageName: string;
    total: number;
    meats: string[];
    sides: string[];
}): string {
    const totalFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.total);

    const meatsList = data.meats.map(m => `<li style="font-size:14px;color:#333;font-family:${BRAND.font};padding:2px 0;">${m}</li>`).join('');
    const sidesList = data.sides.map(s => `<li style="font-size:14px;color:#333;font-family:${BRAND.font};padding:2px 0;">${s}</li>`).join('');

    const body = [
        // Header
        `<table class="container" width="580" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;overflow:hidden;border-radius:8px 8px 0 0;">
          <tr><td style="background:${BRAND.dark};padding:24px;border-bottom:3px solid ${BRAND.red};">
            <h1 style="color:#fff;font-family:${BRAND.font};font-size:28px;margin:0;">🔔 New Catering Inquiry</h1>
          </td></tr>
        </table>`,

        // Customer info
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 12px;font-weight:700;">Customer Info</p>
          ${lineItem('Name', data.name)}
          ${lineItem('Email', `<a href="mailto:${data.email}" style="color:${BRAND.red};">${data.email}</a>`)}
          ${lineItem('Phone', data.phone || 'Not provided')}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `),

        row(`${divider()}`),

        // Event details
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:16px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 12px;font-weight:700;">Event Details</p>
          ${lineItem('📅 Date', data.date || 'TBD')}
          ${lineItem('👥 Guests', String(data.guests))}
          ${lineItem('📦 Package', data.packageName)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `),

        // Meats + Sides
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="vertical-align:top;width:50%;padding-right:12px;">
                <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 8px;font-weight:700;">🔥 Meats</p>
                <ul style="margin:0;padding-left:18px;">${meatsList || '<li style="color:#999;">None</li>'}</ul>
              </td>
              <td style="vertical-align:top;width:50%;padding-left:12px;">
                <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 8px;font-weight:700;">🥗 Sides</p>
                <ul style="margin:0;padding-left:18px;">${sidesList || '<li style="color:#999;">None</li>'}</ul>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:16px;">&nbsp;</td></tr></table>
        `),

        // Total
        row(`
          ${divider(BRAND.gold)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:12px;">&nbsp;</td></tr></table>
          ${lineItem('Estimated Total', totalFormatted, true)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:12px;">&nbsp;</td></tr></table>
        `),

        // Reply CTA
        row(`
          <table class="button" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="background:${BRAND.red};border-radius:6px;">
                      <a href="mailto:${data.email}?subject=Re: Your Hofherr Catering Inquiry" style="color:#fff;font-family:${BRAND.font};font-size:14px;font-weight:700;text-decoration:none;display:inline-block;padding:12px 28px;">
                        Reply to ${data.name.split(' ')[0]}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:16px;">&nbsp;</td></tr></table>
        `),
    ].join('');

    return emailDocument(
        `New Inquiry: ${data.name} — ${data.date || 'TBD'}`,
        `New catering inquiry from ${data.name} for ${data.guests} guests on ${data.date}. Total: ${totalFormatted}`,
        body
    );
}

/* ── API Route ── */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, cateringData } = body;

        if (!name || !email || !cateringData) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || 'patience.schmeler48@ethereal.email',
                pass: process.env.SMTP_PASS || '6hTNRXUzv3QZ2n5W5a',
            },
        });

        const emailData = {
            name,
            email,
            phone: phone || '',
            date: cateringData.date || 'TBD',
            guests: cateringData.guests,
            packageName: cateringData.packageName,
            total: cateringData.total,
            meats: cateringData.meats || [],
            sides: cateringData.sides || [],
        };

        // Send to Hofherr team
        await transporter.sendMail({
            from: '"Hofherr Website" <catering@hofherrmeats.com>',
            to: 'catering@hofherrmeats.com',
            replyTo: email,
            subject: `Catering Inquiry: ${name} — ${emailData.date}`,
            html: buildTeamNotification(emailData),
        });

        // Send receipt to customer
        await transporter.sendMail({
            from: '"Hofherr Meat Co." <catering@hofherrmeats.com>',
            to: email,
            subject: `Your Hofherr Catering Inquiry — Confirmation`,
            html: buildCustomerReceipt(emailData),
        });

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Inquiry Hub Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

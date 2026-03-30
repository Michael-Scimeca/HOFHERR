import { NextResponse } from 'next/server';

/* ── Copy of the email builder from the parent route (for preview only) ── */

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

const FOUNDATION_RESET = `
body { width:100%!important; min-width:100%; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; }
table { border-spacing:0; border-collapse:collapse; }
td { word-wrap:break-word; border-collapse:collapse!important; }
table,tr,td { padding:0; vertical-align:top; text-align:left; }
img { outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; width:auto; max-width:100%; clear:both; display:block; }
`;

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
    }
  </style>
</head>
<body>
  <span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;color:${BRAND.bg};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
  <table class="body" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.bg};">
    <tr>
      <td align="center" valign="top">
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
        ${bodyContent}
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

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

function divider(color = '#e0e0e0'): string {
    return `<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:${color};font-size:1px;line-height:1px;">&nbsp;</td></tr></table>`;
}

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

/* ── Sample data ── */
const SAMPLE = {
    name: 'Mike Scimeca',
    email: 'mike@example.com',
    phone: '(847) 555-1234',
    date: 'Saturday, April 12, 2026',
    guests: 50,
    packageName: 'BBQ Catering (3 Meats, 2 Sides)',
    total: 1490,
    meats: ['Smoked Brisket', 'BBQ Pulled Pork', 'Smoked Ribs'],
    sides: ['Pimento Mac n Cheese', 'North Shore Baked Beans'],
};

function buildCustomerReceipt(data: typeof SAMPLE): string {
    const totalFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.total);

    const meatChips = data.meats.map(m =>
        `<span style="display:inline-block;background:#fde8e8;color:${BRAND.red};padding:4px 10px;border-radius:4px;font-size:13px;font-weight:600;margin:2px 4px 2px 0;font-family:${BRAND.font};">${m}</span>`
    ).join('');

    const sideChips = data.sides.map(s =>
        `<span style="display:inline-block;background:#e8f5e9;color:#2e7d32;padding:4px 10px;border-radius:4px;font-size:13px;font-weight:600;margin:2px 4px 2px 0;font-family:${BRAND.font};">${s}</span>`
    ).join('');

    const body = [
        `<table class="container" width="580" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;overflow:hidden;border-radius:8px 8px 0 0;">
          <tr><td style="background:${BRAND.red};padding:32px 24px;text-align:center;">
            <h1 style="color:#fff;font-family:${BRAND.font};font-size:32px;margin:0;">✓ Inquiry Received</h1>
            <p style="color:rgba(255,255,255,0.8);font-family:${BRAND.font};font-size:14px;margin:8px 0 0;">We'll be in touch shortly to confirm your date.</p>
          </td></tr>
        </table>`,
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:24px;">&nbsp;</td></tr></table>
          <p style="font-size:16px;color:#333;font-family:${BRAND.font};margin:0 0 8px;">Hi ${data.name.split(' ')[0]},</p>
          <p style="font-size:14px;color:#666;font-family:${BRAND.font};line-height:1.6;margin:0 0 20px;">
            Thank you for your catering inquiry. Here's a summary of your request:
          </p>
        `),
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 12px;font-weight:700;">Event Details</p>
          ${lineItem('📅 Date', data.date)}
          ${lineItem('👥 Guests', String(data.guests))}
          ${lineItem('📦 Package', data.packageName)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `),
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 8px;font-weight:700;">🔥 Selected Meats</p>
          <div style="line-height:2;">${meatChips}</div>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `),
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 8px;font-weight:700;">🥗 Selected Sides</p>
          <div style="line-height:2;">${sideChips}</div>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `),
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:12px;">&nbsp;</td></tr></table>
          ${divider(BRAND.gold)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:16px;">&nbsp;</td></tr></table>
          ${lineItem('Estimated Total', totalFormatted, true)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:16px;">&nbsp;</td></tr></table>
        `),
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
        `<table class="container" width="580" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;border-radius:0 0 8px 8px;overflow:hidden;">
          <tr><td style="background:${BRAND.dark};padding:20px 24px;text-align:center;">
            <p style="color:rgba(255,255,255,0.5);font-family:${BRAND.font};font-size:12px;margin:0;line-height:1.6;">
              Hofherr Meat Co. · 807 Happ Rd, Northfield, IL 60093 · (847) 441-MEAT<br/>
              <span style="color:rgba(255,255,255,0.3);">* Pricing does not include sales tax. Your date is not reserved until confirmed by Sean.</span>
            </p>
          </td></tr>
        </table>`,
    ].join('');

    return emailDocument('Your Catering Inquiry — Hofherr Meat Co.', `Hi Mike, we received your catering inquiry for April 12. Total: ${totalFormatted}`, body);
}

function buildTeamNotification(data: typeof SAMPLE): string {
    const totalFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.total);
    const meatsList = data.meats.map(m => `<li style="font-size:14px;color:#333;font-family:${BRAND.font};padding:2px 0;">${m}</li>`).join('');
    const sidesList = data.sides.map(s => `<li style="font-size:14px;color:#333;font-family:${BRAND.font};padding:2px 0;">${s}</li>`).join('');

    const body = [
        `<table class="container" width="580" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;overflow:hidden;border-radius:8px 8px 0 0;">
          <tr><td style="background:${BRAND.dark};padding:24px;border-bottom:3px solid ${BRAND.red};">
            <h1 style="color:#fff;font-family:${BRAND.font};font-size:28px;margin:0;">🔔 New Catering Inquiry</h1>
          </td></tr>
        </table>`,
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:20px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 12px;font-weight:700;">Customer Info</p>
          ${lineItem('Name', data.name)}
          ${lineItem('Email', `<a href="mailto:${data.email}" style="color:${BRAND.red};">${data.email}</a>`)}
          ${lineItem('Phone', data.phone)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `),
        row(`${divider()}`),
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:16px;">&nbsp;</td></tr></table>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 12px;font-weight:700;">Event Details</p>
          ${lineItem('📅 Date', data.date)}
          ${lineItem('👥 Guests', String(data.guests))}
          ${lineItem('📦 Package', data.packageName)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
        `),
        row(`
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:8px;">&nbsp;</td></tr></table>
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="vertical-align:top;width:50%;padding-right:12px;">
                <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 8px;font-weight:700;">🔥 Meats</p>
                <ul style="margin:0;padding-left:18px;">${meatsList}</ul>
              </td>
              <td style="vertical-align:top;width:50%;padding-left:12px;">
                <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND.muted};font-family:${BRAND.font};margin:0 0 8px;font-weight:700;">🥗 Sides</p>
                <ul style="margin:0;padding-left:18px;">${sidesList}</ul>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:16px;">&nbsp;</td></tr></table>
        `),
        row(`
          ${divider(BRAND.gold)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:12px;">&nbsp;</td></tr></table>
          ${lineItem('Estimated Total', totalFormatted, true)}
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:12px;">&nbsp;</td></tr></table>
        `),
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

    return emailDocument(`New Inquiry: ${data.name}`, `New catering inquiry from ${data.name} for ${data.guests} guests`, body);
}

/* ── Side-by-side preview shell ── */
function buildBothPreview(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Email Preview — Hofherr Catering</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',system-ui,sans-serif; background:#0a0a0a; color:#fff; min-height:100vh; }
    
    .toolbar {
      position:sticky; top:0; z-index:100;
      background:rgba(17,17,17,0.92); backdrop-filter:blur(12px);
      border-bottom:1px solid rgba(255,255,255,0.08);
      padding:12px 24px; display:flex; align-items:center; gap:16px;
    }
    .toolbar h1 {
      font-size:15px; font-weight:600; color:#fff;
      display:flex; align-items:center; gap:8px;
    }
    .toolbar h1 span { color:${BRAND.red}; }
    .toolbar .badge {
      font-size:11px; font-weight:500; letter-spacing:0.05em;
      text-transform:uppercase; color:${BRAND.gold};
      background:rgba(168,144,95,0.12); border:1px solid rgba(168,144,95,0.2);
      padding:3px 10px; border-radius:100px;
    }

    .tabs {
      display:flex; gap:4px; margin-left:auto;
    }
    .tab {
      font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
      padding:7px 16px; border-radius:6px; cursor:pointer;
      border:1px solid rgba(255,255,255,0.1); background:transparent; color:#999;
      transition:all 0.2s;
    }
    .tab:hover { color:#fff; border-color:rgba(255,255,255,0.2); }
    .tab.active { background:${BRAND.red}; color:#fff; border-color:${BRAND.red}; }

    .preview-grid {
      display:grid; grid-template-columns:1fr 1fr; gap:24px;
      padding:24px; max-width:1400px; margin:0 auto; min-height:calc(100vh - 60px);
    }
    .preview-grid.single { grid-template-columns:1fr; max-width:700px; }

    .preview-pane {
      background:#1a1a1a; border-radius:12px; overflow:hidden;
      border:1px solid rgba(255,255,255,0.06);
      display:flex; flex-direction:column;
    }
    .pane-header {
      padding:14px 20px; display:flex; align-items:center; gap:10px;
      background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.06);
    }
    .pane-dot { width:8px; height:8px; border-radius:50%; }
    .pane-dot.green { background:#2ecc71; }
    .pane-dot.blue { background:#3498db; }
    .pane-label {
      font-size:12px; font-weight:600; text-transform:uppercase;
      letter-spacing:0.08em; color:#888;
    }
    .pane-sublabel {
      font-size:11px; color:#555; margin-left:auto;
    }

    .pane-iframe {
      flex:1; width:100%; border:none; background:${BRAND.bg};
      min-height:700px;
    }

    @media (max-width:900px) {
      .preview-grid { grid-template-columns:1fr; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>📧 <span>Hofherr</span> Email Preview</h1>
    <span class="badge">Dev Only</span>
    <div class="tabs">
      <button class="tab active" onclick="showView('both')">Both</button>
      <button class="tab" onclick="showView('customer')">Customer</button>
      <button class="tab" onclick="showView('team')">Team</button>
    </div>
  </div>

  <div class="preview-grid" id="grid">
    <div class="preview-pane" id="pane-customer">
      <div class="pane-header">
        <div class="pane-dot green"></div>
        <span class="pane-label">Customer Receipt</span>
        <span class="pane-sublabel">Sent to mike@example.com</span>
      </div>
      <iframe class="pane-iframe" src="/api/catering/preview?type=customer" title="Customer Email Preview"></iframe>
    </div>
    <div class="preview-pane" id="pane-team">
      <div class="pane-header">
        <div class="pane-dot blue"></div>
        <span class="pane-label">Team Notification</span>
        <span class="pane-sublabel">Sent to catering@hofherrmeats.com</span>
      </div>
      <iframe class="pane-iframe" src="/api/catering/preview?type=team" title="Team Email Preview"></iframe>
    </div>
  </div>

  <script>
    function showView(view) {
      const grid = document.getElementById('grid');
      const customer = document.getElementById('pane-customer');
      const team = document.getElementById('pane-team');
      
      // Update tabs
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.tab[onclick*="' + view + '"]').classList.add('active');

      if (view === 'both') {
        grid.classList.remove('single');
        customer.style.display = '';
        team.style.display = '';
      } else if (view === 'customer') {
        grid.classList.add('single');
        customer.style.display = '';
        team.style.display = 'none';
      } else {
        grid.classList.add('single');
        customer.style.display = 'none';
        team.style.display = '';
      }
    }
  </script>
</body>
</html>`;
}

/* ── GET handler: ?type=customer | ?type=team | ?type=both (default) ── */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'both';

    if (type === 'customer') {
        return new NextResponse(buildCustomerReceipt(SAMPLE), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    }

    if (type === 'team') {
        return new NextResponse(buildTeamNotification(SAMPLE), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    }

    // Default: show both in a split-view shell
    return new NextResponse(buildBothPreview(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}

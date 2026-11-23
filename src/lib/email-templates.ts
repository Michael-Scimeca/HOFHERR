/**
 * Hofherr Meat Co. — Branded Editorial Steakhouse Email Templates
 *
 * Unified design system:
 * - Obsidian outer canvas (#070707) & card surface (#111111)
 * - 5px signature crimson left rail (#cc0e1d) & subtle hairline border (#242424)
 * - Brushed gold eyebrow & numbered editorial steps (#c9a96e)
 * - Bold 2-line white + crimson uppercase display headlines
 * - Full-width crimson uppercase CTA button
 * - Anti-inversion dark-mode meta tags for Apple Mail, Gmail & Outlook
 */

import { resolveOrderCutPieces, type OrderCutPiece } from '@/lib/cutCollector';

function safeEsc(raw: string): string {
    return String(raw)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function parsePriceValue(price: string | number | undefined): number {
    if (typeof price === 'number') return price;
    const m = String(price || '').match(/\$([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
}

/* ── Shared Editorial Steakhouse Wrapper ─────────────────────────────── */
function wrapEditorial(params: {
    title: string;
    eyebrow?: string;
    headlineWhite: string;
    headlineRed: string;
    leadHtml: string;
    bodyRowsHtml: string;
    ctaLabel: string;
    ctaUrl: string;
    secondaryNoteHtml?: string;
}): string {
    const eyebrow = params.eyebrow || 'HOFHERR MEAT CO.';
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark only" />
    <meta name="supported-color-schemes" content="dark only" />
    <title>${safeEsc(params.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#070707;padding:24px 12px;">
        <tr><td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border:1px solid #242424;border-left:5px solid #cc0e1d;border-radius:8px;overflow:hidden;">
                <!-- Editorial Masthead -->
                <tr>
                    <td style="padding:32px 34px 24px;border-bottom:1px solid #222222;background-color:#111111;">
                        <div style="font-size:11px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:#c9a96e;">
                            ${eyebrow}
                        </div>
                        <h1 style="margin:12px 0 12px;font-size:32px;line-height:1.05;font-weight:900;text-transform:uppercase;letter-spacing:-0.01em;color:#ffffff;">
                            ${params.headlineWhite}<br /><span style="color:#cc0e1d;">${params.headlineRed}</span>
                        </h1>
                        <p style="margin:0;font-size:15px;line-height:1.6;color:#b8b2a8;">
                            ${params.leadHtml}
                        </p>
                    </td>
                </tr>

                <!-- Dynamic Body -->
                ${params.bodyRowsHtml}

                <!-- Full-Width Crimson CTA -->
                <tr>
                    <td style="padding:6px 34px 28px;background-color:#111111;">
                        <a href="${params.ctaUrl}" style="display:block;text-align:center;background-color:#cc0e1d;color:#ffffff;text-decoration:none;font-weight:800;font-size:15px;letter-spacing:0.08em;text-transform:uppercase;padding:15px 24px;border-radius:6px;">
                            ${params.ctaLabel}
                        </a>
                        ${params.secondaryNoteHtml ? `<div style="margin-top:14px;text-align:center;font-size:12px;line-height:1.5;color:#888178;">${params.secondaryNoteHtml}</div>` : ''}
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="padding:18px 34px;background-color:#0c0c0c;border-top:1px solid #222222;text-align:center;">
                        <div style="font-size:11px;font-weight:700;color:#8e877e;">
                            Hofherr Meat Co. · 300 Happ Rd, Northfield · 754 Elm St, Winnetka
                        </div>
                        <div style="font-size:11px;color:#666058;margin-top:4px;">
                            (847) 441-MEAT · <a href="https://hofherrmeatco.com" style="color:#c9a96e;text-decoration:none;font-weight:700;">hofherrmeatco.com</a>
                        </div>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;
}

function buildNumberedStepsHtml(steps: { num: string; title: string; desc: string }[]): string {
    const rows = steps
        .map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const borderCss = isLast ? '' : 'border-bottom:1px solid #222222;';
            return `
                <tr>
                    <td width="44" valign="top" style="padding:12px 0;font-size:18px;font-weight:900;color:#c9a96e;">${step.num}</td>
                    <td style="padding:12px 0;${borderCss}">
                        <div style="font-size:15px;font-weight:800;color:#ffffff;">${step.title}</div>
                        <div style="font-size:13px;color:#999289;margin-top:3px;line-height:1.5;">${step.desc}</div>
                    </td>
                </tr>`;
        })
        .join('');

    return `
                <tr>
                    <td style="padding:20px 34px 22px;background-color:#111111;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            ${rows}
                        </table>
                    </td>
                </tr>`;
}

/* ═══════════════════════════════════════════════════════════════════════
   1. WELCOME EMAIL — sent after account registration
   ═══════════════════════════════════════════════════════════════════════ */

export function buildWelcomeEmail(name: string, email: string) {
    const firstName = safeEsc(name.split(' ')[0] || 'Neighbor');
    const safeEmail = safeEsc(email);
    const subject = `Quality Meats. No Compromise. Welcome, ${name.split(' ')[0] || 'Neighbor'}.`;

    const bodyRowsHtml = buildNumberedStepsHtml([
        {
            num: '01',
            title: 'Reserve Before Friday Rush',
            desc: 'Lock in a 15-minute pickup slot or Curbside Trunk Drop-Off at Northfield or Winnetka.',
        },
        {
            num: '02',
            title: 'Unlock Your 7-Animal Cut Collector',
            desc: 'Every order logs your cuts automatically on your personal Butcher Chart.',
        },
        {
            num: '03',
            title: 'Free Hand-Trimming to Spec',
            desc: 'Add inch thickness or French-trim notes to any cut — never an upcharge.',
        },
    ]);

    const html = wrapEditorial({
        title: subject,
        headlineWhite: 'QUALITY MEATS.',
        headlineRed: 'NO COMPROMISE.',
        leadHtml: `Welcome, ${firstName}. Your member profile (<strong style="color:#ffffff;">${safeEmail}</strong>) is ready for custom butcher orders and 1-tap reorders.`,
        bodyRowsHtml,
        ctaLabel: 'SHOP THE BUTCHER CASE →',
        ctaUrl: 'https://hofherrmeatco.com/online-orders',
        secondaryNoteHtml: `or <a href="https://hofherrmeatco.com/dashboard" style="color:#c9a96e;text-decoration:underline;">visit your member dashboard</a>`,
    });

    const text = [
        `HOFHERR MEAT CO. — QUALITY MEATS. NO COMPROMISE.`,
        ``,
        `Welcome, ${name.split(' ')[0] || 'Neighbor'}. Your member profile (${email}) is ready.`,
        ``,
        `01 · Reserve Before Friday Rush — Lock in a 15-minute pickup slot or Curbside Trunk Drop-Off.`,
        `02 · Unlock Your 7-Animal Cut Collector — Every order logs your cuts automatically.`,
        `03 · Free Hand-Trimming to Spec — Add thickness or trim notes with zero upcharge.`,
        ``,
        `Shop the Butcher Case: https://hofherrmeatco.com/online-orders`,
        `Member Dashboard: https://hofherrmeatco.com/dashboard`,
        ``,
        `— Hofherr Meat Co. · (847) 441-MEAT`,
    ].join('\n');

    return { subject, html, text };
}

/* ═══════════════════════════════════════════════════════════════════════
   2. EMAIL VERIFICATION — sent on registration to confirm the email
   ═══════════════════════════════════════════════════════════════════════ */

export function buildVerifyEmail(name: string, email: string, verifyUrl: string) {
    const firstName = safeEsc(name.split(' ')[0] || 'Neighbor');
    const safeEmail = safeEsc(email);
    const subject = `Confirm your email — Hofherr Meat Co.`;

    const bodyRowsHtml = buildNumberedStepsHtml([
        {
            num: '01',
            title: 'Verify Your Email Address',
            desc: `Click the crimson button below to activate <strong style="color:#ffffff;">${safeEmail}</strong>.`,
        },
        {
            num: '02',
            title: 'Start Custom Butcher Ordering',
            desc: 'Reserve dry-aged steaks, Winnetka Depot hot lunches, and holiday roasts with 15-min pickup windows.',
        },
    ]);

    const html = wrapEditorial({
        title: subject,
        eyebrow: 'HOFHERR MEAT CO. · ACCOUNT VERIFICATION',
        headlineWhite: 'CONFIRM YOUR',
        headlineRed: 'ACCOUNT.',
        leadHtml: `Hi ${firstName}, one quick click and you&apos;re all set at the counter. This verification link stays active for <strong style="color:#ffffff;">24 hours</strong>.`,
        bodyRowsHtml,
        ctaLabel: 'VERIFY MY EMAIL →',
        ctaUrl: verifyUrl,
        secondaryNoteHtml: `Didn&apos;t create an account? You can safely ignore this email.`,
    });

    const text = [
        `CONFIRM YOUR ACCOUNT — HOFHERR MEAT CO.`,
        ``,
        `Hi ${name.split(' ')[0] || 'Neighbor'},`,
        `Click the link below to verify ${email} and activate your account (valid for 24 hours):`,
        ``,
        verifyUrl,
        ``,
        `Didn't create an account? You can safely ignore this email.`,
        `— Hofherr Meat Co. · (847) 441-MEAT`,
    ].join('\n');

    return { subject, html, text };
}

/* ═══════════════════════════════════════════════════════════════════════
   3. PASSWORD RESET EMAIL — sent from /api/auth/forgot-password
   ═══════════════════════════════════════════════════════════════════════ */

export function buildPasswordResetEmail(email: string, resetUrl: string) {
    const safeEmail = safeEsc(email);
    const subject = `Reset Your Password — Hofherr Meat Co.`;

    const bodyRowsHtml = buildNumberedStepsHtml([
        {
            num: '01',
            title: 'Link Expires in 1 Hour',
            desc: `We received a password reset request for <strong style="color:#ffffff;">${safeEmail}</strong>. Set your new password using the button below.`,
        },
        {
            num: '02',
            title: 'Didn’t Request This?',
            desc: 'Your current password remains unchanged — simply ignore this email or reply if you need help.',
        },
    ]);

    const html = wrapEditorial({
        title: subject,
        eyebrow: 'HOFHERR MEAT CO. · ACCOUNT RECOVERY',
        headlineWhite: 'RESET YOUR',
        headlineRed: 'PASSWORD.',
        leadHtml: `Use the secure button below to choose a new password for your Hofherr Meat Co. member account.`,
        bodyRowsHtml,
        ctaLabel: 'SET NEW PASSWORD →',
        ctaUrl: resetUrl,
        secondaryNoteHtml: `Need help? Reply to this email or call <strong style="color:#c9a96e;">(847) 441-MEAT</strong>.`,
    });

    const text = [
        `RESET YOUR PASSWORD — HOFHERR MEAT CO.`,
        ``,
        `We received a password reset request for ${email}.`,
        `Set your new password (link expires in 1 hour):`,
        ``,
        resetUrl,
        ``,
        `If you didn't request this, you can safely ignore this email.`,
        `— Hofherr Meat Co. · (847) 441-MEAT`,
    ].join('\n');

    return { subject, html, text };
}

/* ═══════════════════════════════════════════════════════════════════════
   4. NEWSLETTER WELCOME EMAIL — sent after newsletter signup
   ═══════════════════════════════════════════════════════════════════════ */

export function buildNewsletterWelcomeEmail(email: string, name?: string) {
    const firstName = name ? safeEsc(name.split(' ')[0]) : 'Neighbor';
    const safeEmail = safeEsc(email);
    const subject = `You're on the List — Hofherr Meat Co. Butcher Dispatch`;

    const bodyRowsHtml = buildNumberedStepsHtml([
        {
            num: '01',
            title: 'Weekly Butcher Block Drops',
            desc: 'First look at dry-aged USDA Prime cuts, house-made sausages, and counter specials before Friday rush.',
        },
        {
            num: '02',
            title: 'Winnetka Depot Hot Case',
            desc: 'Daily Italian Beef, herb-roasted rotisserie chickens, kettle soups, and seasonal pop-ups at 754 Elm St.',
        },
        {
            num: '03',
            title: 'Holiday Roast Reservations',
            desc: 'Priority booking for Thanksgiving heritage turkeys, Christmas Prime Rib, and Easter rack of lamb.',
        },
    ]);

    const html = wrapEditorial({
        title: subject,
        eyebrow: 'HOFHERR MEAT CO. · BUTCHER DISPATCH',
        headlineWhite: 'YOU&apos;RE ON',
        headlineRed: 'THE LIST.',
        leadHtml: `Welcome, ${firstName}. <strong style="color:#ffffff;">${safeEmail}</strong> is now subscribed to our weekly Northfield &amp; Winnetka counter dispatch.`,
        bodyRowsHtml,
        ctaLabel: 'SEE THIS WEEK&apos;S SPECIALS →',
        ctaUrl: 'https://hofherrmeatco.com/specials',
        secondaryNoteHtml: `Unsubscribe anytime from any dispatch — zero spam, just great meat.`,
    });

    const text = [
        `YOU'RE ON THE LIST — HOFHERR MEAT CO.`,
        ``,
        `Welcome, ${name ? name.split(' ')[0] : 'Neighbor'}! ${email} is subscribed to the weekly Butcher Dispatch.`,
        ``,
        `01 · Weekly Butcher Block Drops`,
        `02 · Winnetka Depot Hot Case`,
        `03 · Priority Holiday Roast Reservations`,
        ``,
        `See this week's specials: https://hofherrmeatco.com/specials`,
        `— Hofherr Meat Co. · (847) 441-MEAT`,
    ].join('\n');

    return { subject, html, text };
}

/* ═══════════════════════════════════════════════════════════════════════
   5. ORDER CONFIRMATION EMAIL — includes Butcher's Guide to Cuts pieces
   ═══════════════════════════════════════════════════════════════════════ */

export interface OrderConfirmationItemInput {
    name: string;
    price: string;
    qty: number;
    note?: string;
}

export interface OrderConfirmationEmailPayload {
    orderNumber?: string;
    items: OrderConfirmationItemInput[];
    contact: { name: string; email: string; phone: string; pickup: string };
    orderNote?: string;
    storeId: string;
    tipAmount?: number;
    coupon?: { code: string; type: 'percent' | 'fixed'; value: number } | null;
    baseUrl?: string;
}

export function buildOrderConfirmationEmail(payload: OrderConfirmationEmailPayload): {
    subject: string;
    html: string;
    text: string;
    cutPieces: OrderCutPiece[];
} {
    const { items, contact, orderNote, storeId, tipAmount, coupon } = payload;
    const baseUrl = payload.baseUrl !== undefined ? payload.baseUrl : '';
    const storeName = storeId === 'depot' ? 'The Depot (Winnetka)' : 'The Butcher Shop (Northfield)';
    const storeAddr = storeId === 'depot' ? '754 Elm St, Winnetka, IL' : '300 Happ Rd, Northfield, IL';
    const orderNum =
        payload.orderNumber ||
        Math.floor(10000000 + Math.random() * 90000000)
            .toString(16)
            .toUpperCase();

    const subtotal = items.reduce((s, i) => s + parsePriceValue(i.price) * i.qty, 0);
    let discountAmt = 0;
    if (coupon) {
        discountAmt = coupon.type === 'percent' ? subtotal * (coupon.value / 100) : coupon.value;
    }
    const afterDiscount = Math.max(0, subtotal - discountAmt);
    const tax = afterDiscount * 0.0225;
    const tip = tipAmount || 0;
    const total = afterDiscount + tax + tip;

    const cutPieces = resolveOrderCutPieces(items);

    const itemRows = items
        .map((i) => {
            const lineTotal = parsePriceValue(i.price) * i.qty;
            return `
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #222222;color:#ffffff;font-size:14px;font-weight:700;">
                ${safeEsc(i.name)}${i.note ? `<br/><span style="font-size:11px;color:#999289;font-weight:400;font-style:italic;">Note: ${safeEsc(i.note)}</span>` : ''}
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #222222;color:#999289;font-size:13px;text-align:center;">×${i.qty}</td>
            <td style="padding:10px 0;border-bottom:1px solid #222222;color:#b8b2a8;font-size:13px;text-align:right;">${safeEsc(i.price)}</td>
            <td style="padding:10px 0;border-bottom:1px solid #222222;color:#c9a96e;font-size:14px;text-align:right;font-weight:800;">$${lineTotal.toFixed(2)}</td>
        </tr>`;
        })
        .join('');

    const butcherGuideRows =
        cutPieces.length > 0
            ? `
                <tr>
                    <td style="padding:0 34px 22px;background-color:#111111;">
                        <div style="background-color:#171311;border:1px solid #33251d;border-left:3px solid #c9a96e;border-radius:6px;padding:16px 18px;">
                            <div style="font-size:10px;font-weight:800;color:#c9a96e;letter-spacing:0.16em;text-transform:uppercase;">CUT COLLECTOR UNLOCKED (${cutPieces.length})</div>
                            <div style="font-size:15px;font-weight:800;color:#ffffff;margin-top:4px;">Primal Cuts Logged on Your Butcher Chart</div>
                            ${cutPieces
                                .map((piece) => {
                                    const matchedNames = piece.matchedItems
                                        .map((m) => `${safeEsc(m.orderedName)} ×${m.qty}`)
                                        .join(', ');
                                    return `
                                    <div style="margin-top:10px;padding-top:10px;border-top:1px solid #2a211b;font-size:13px;color:#d6cec4;">
                                        <strong style="color:#c9a96e;">${safeEsc(piece.animalName)} · ${safeEsc(piece.cutName)}</strong>
                                        <span style="color:#888178;"> — ${matchedNames}</span>
                                    </div>`;
                                })
                                .join('')}
                        </div>
                    </td>
                </tr>`
            : '';

    const subject = `Order Confirmed — ${storeName} #${orderNum}`;

    const bodyRowsHtml = `
                <!-- Pickup & Order Number Strip -->
                <tr>
                    <td style="padding:20px 34px 0;background-color:#111111;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#181818;border:1px solid #262626;border-radius:6px;">
                            <tr>
                                <td width="50%" valign="top" style="padding:14px 16px;border-right:1px solid #262626;">
                                    <div style="font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c9a96e;">PICKUP LOCATION</div>
                                    <div style="font-size:14px;font-weight:800;color:#ffffff;margin-top:4px;">${safeEsc(storeName)}</div>
                                    <div style="font-size:12px;color:#999289;margin-top:2px;">${safeEsc(storeAddr)}</div>
                                </td>
                                <td width="50%" valign="top" style="padding:14px 16px;">
                                    <div style="font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c9a96e;">SCHEDULED PICKUP</div>
                                    <div style="font-size:15px;font-weight:800;color:#ffffff;margin-top:4px;">${safeEsc(contact.pickup)}</div>
                                    <div style="font-size:12px;color:#999289;margin-top:2px;">Order #${safeEsc(orderNum)}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Itemized Order Table -->
                <tr>
                    <td style="padding:22px 34px 18px;background-color:#111111;">
                        <div style="font-size:10px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#c9a96e;margin-bottom:10px;">YOUR CUT TICKET</div>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <th style="text-align:left;font-size:10px;color:#777068;text-transform:uppercase;letter-spacing:0.08em;padding-bottom:8px;border-bottom:1px solid #242424;">Item</th>
                                <th style="text-align:center;font-size:10px;color:#777068;text-transform:uppercase;letter-spacing:0.08em;padding-bottom:8px;border-bottom:1px solid #242424;">Qty</th>
                                <th style="text-align:right;font-size:10px;color:#777068;text-transform:uppercase;letter-spacing:0.08em;padding-bottom:8px;border-bottom:1px solid #242424;">Price</th>
                                <th style="text-align:right;font-size:10px;color:#777068;text-transform:uppercase;letter-spacing:0.08em;padding-bottom:8px;border-bottom:1px solid #242424;">Est.</th>
                            </tr>
                            ${itemRows}
                        </table>

                        ${orderNote ? `<div style="margin-top:12px;padding:10px 12px;background-color:#181818;border-radius:6px;font-size:12px;color:#b8b2a8;"><strong style="color:#c9a96e;">Order Note:</strong> ${safeEsc(orderNote)}</div>` : ''}

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#999289;">Subtotal</td>
                                <td style="padding:4px 0;font-size:13px;color:#ffffff;text-align:right;">$${subtotal.toFixed(2)}</td>
                            </tr>
                            ${discountAmt > 0 && coupon ? `<tr><td style="padding:4px 0;font-size:13px;color:#16a34a;">Discount (${safeEsc(coupon.code)})</td><td style="padding:4px 0;font-size:13px;color:#16a34a;text-align:right;">-$${discountAmt.toFixed(2)}</td></tr>` : ''}
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#999289;">Estimated Tax (2.25%)</td>
                                <td style="padding:4px 0;font-size:13px;color:#ffffff;text-align:right;">$${tax.toFixed(2)}</td>
                            </tr>
                            ${tip > 0 ? `<tr><td style="padding:4px 0;font-size:13px;color:#999289;">Butcher Team Tip</td><td style="padding:4px 0;font-size:13px;color:#c9a96e;text-align:right;">$${tip.toFixed(2)}</td></tr>` : ''}
                            <tr>
                                <td style="padding:12px 0 0;font-size:16px;font-weight:900;color:#ffffff;border-top:1px solid #242424;">Estimated Total</td>
                                <td style="padding:12px 0 0;font-size:20px;font-weight:900;color:#cc0e1d;text-align:right;border-top:1px solid #242424;">$${total.toFixed(2)}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                ${butcherGuideRows}`;

    const html = wrapEditorial({
        title: subject,
        eyebrow: `HOFHERR MEAT CO. · TICKET #${safeEsc(orderNum)}`,
        headlineWhite: 'ORDER CONFIRMED.',
        headlineRed: 'IN THE QUEUE.',
        leadHtml: `Thank you, <strong style="color:#ffffff;">${safeEsc(contact.name)}</strong>. Our butchers have your ticket and will hand-cut and wrap your order in kraft paper for pickup.`,
        bodyRowsHtml,
        ctaLabel: 'VIEW ORDER & TRACK PICKUP →',
        ctaUrl: `${baseUrl || 'https://hofherrmeatco.com'}/dashboard`,
        secondaryNoteHtml: `*Final total is determined by exact scale weight at pickup. Need Curbside Trunk Drop-Off? Call (847) 441-MEAT when you pull up.`,
    });

    const text = [
        `ORDER CONFIRMED — ${storeName} #${orderNum}`,
        ``,
        `Hi ${contact.name},`,
        `Our butchers have your ticket and are preparing your order for pickup.`,
        ``,
        ...items.map((i) => `• ${i.name} ×${i.qty} — ${i.price}${i.note ? ` (${i.note})` : ''}`),
        ``,
        `Subtotal: $${subtotal.toFixed(2)}`,
        ...(discountAmt > 0 && coupon ? [`Discount (${coupon.code}): -$${discountAmt.toFixed(2)}`] : []),
        `Tax (2.25%): $${tax.toFixed(2)}`,
        ...(tip > 0 ? [`Tip: $${tip.toFixed(2)}`] : []),
        `Estimated Total: $${total.toFixed(2)}`,
        ``,
        `Pickup: ${storeName} (${storeAddr}) · ${contact.pickup}`,
        `*Final total determined by exact scale weight at pickup.`,
        ``,
        `— Hofherr Meat Co. · (847) 441-MEAT`,
    ].join('\n');

    return { subject, html, text, cutPieces };
}

/* ═══════════════════════════════════════════════════════════════════════
   6. RESTOCK FILLED EMAIL — sent when a requested cut is back in stock
   ═══════════════════════════════════════════════════════════════════════ */

export function buildRestockFilledEmail(params: {
    customerName: string;
    item: string;
    qty: number;
    store: string;
    baseUrl?: string;
}) {
    const firstName = safeEsc((params.customerName || '').trim().split(' ')[0] || 'Neighbor');
    const storeName = params.store === 'depot' ? 'The Depot (Winnetka)' : 'The Butcher Shop (Northfield)';
    const storeAddr =
        params.store === 'depot'
            ? '754 Elm St, Winnetka, IL 60093'
            : '300 Happ Rd, Northfield, IL 60093';
    const orderUrl = `${params.baseUrl || 'https://hofherrmeatco.com'}/online-orders`;

    const subject = `Back in Stock: ${params.item} is Ready at Hofherr Meat Co.`;

    const bodyRowsHtml = buildNumberedStepsHtml([
        {
            num: '01',
            title: `${params.qty}× ${safeEsc(params.item)}`,
            desc: `Freshly cut and restocked at <strong style="color:#ffffff;">${safeEsc(storeName)}</strong> (${safeEsc(storeAddr)}).`,
        },
        {
            num: '02',
            title: '1-Click Add From Your Profile',
            desc: 'We also posted this alert on your Butcher Guild Dashboard so you can reserve it before today’s batch sells out.',
        },
    ]);

    const html = wrapEditorial({
        title: subject,
        eyebrow: 'HOFHERR MEAT CO. · RESTOCK ALERT',
        headlineWhite: 'BACK ON',
        headlineRed: 'THE BLOCK.',
        leadHtml: `Good news, ${firstName} — your requested cut <strong style="color:#ffffff;">${safeEsc(params.item)}</strong> is back in the case and ready to order.`,
        bodyRowsHtml,
        ctaLabel: `ORDER ${safeEsc(params.item).toUpperCase()} NOW →`,
        ctaUrl: orderUrl,
        secondaryNoteHtml: `Small-batch cuts move quickly — reserve online to lock in your pickup window.`,
    });

    const text = [
        `BACK ON THE BLOCK — HOFHERR MEAT CO.`,
        ``,
        `Good news, ${params.customerName || 'Neighbor'}!`,
        `Your requested cut is back in stock:`,
        `• ${params.qty}× ${params.item}`,
        `• Location: ${storeName} (${storeAddr})`,
        ``,
        `Order online now: ${orderUrl}`,
        `— Hofherr Meat Co. · (847) 441-MEAT`,
    ].join('\n');

    return { subject, html, text };
}

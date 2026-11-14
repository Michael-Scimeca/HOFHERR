/**
 * Hofherr Meat Co. — Branded Email Templates
 *
 * All templates output table-based HTML for universal email client compatibility.
 * Brand colors: #800020 (maroon), #c5a255 (gold), #111 (dark bg), #0a0a0a (outer bg)
 */

/* ── Shared wrapper around all email content ─────────────────────────── */
function wrap(title: string, innerHtml: string): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
        <tr><td align="center" style="padding:20px 16px;">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                <!-- Header -->
                <tr>
                    <td style="background:#111;border-radius:12px 12px 0 0;padding:24px 30px;text-align:center;border-bottom:2px solid #800020;">
                        <div style="font-family:'Yanone Kaffeesatz','Georgia',serif;font-size:28px;font-weight:700;color:#fff;letter-spacing:1px;">HOFHERR MEAT CO.</div>
                        <div style="font-size:11px;color:#c5a255;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Craft Butchery · Northfield & Winnetka</div>
                    </td>
                </tr>

                ${innerHtml}

                <!-- Footer -->
                <tr>
                    <td style="background:#0d0d0d;border-radius:0 0 12px 12px;padding:20px 30px;text-align:center;">
                        <div style="font-size:11px;color:#555;">Hofherr Meat Co. • 300 Happ Rd, Northfield, IL 60093</div>
                        <div style="font-size:11px;color:#555;margin-top:4px;">📞 (847) 441-6328 • info@hofherrmeatco.com</div>
                        <div style="margin-top:12px;">
                            <a href="https://hofherrmeatco.com" style="color:#800020;font-size:11px;text-decoration:none;font-weight:600;">hofherrmeatco.com</a>
                        </div>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;
}

/* ═══════════════════════════════════════════════════════════════════════
   1. WELCOME EMAIL — sent after account registration
   ═══════════════════════════════════════════════════════════════════════ */

export function buildWelcomeEmail(name: string, email: string) {
    const firstName = name.split(' ')[0] || 'there';

    const subject = `Welcome to the Hofherr Family, ${firstName}! 🥩`;

    const inner = `
                <!-- Hero Banner -->
                <tr>
                    <td style="background:linear-gradient(135deg,#800020,#5c0018);padding:32px 30px;text-align:center;">
                        <div style="font-size:36px;margin-bottom:8px;">🔥</div>
                        <div style="font-size:24px;font-weight:700;color:#fff;">Welcome to Hofherr Meat Co.</div>
                        <div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:8px;">Your account is all set, ${firstName}.</div>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="background:#111;padding:28px 30px;">
                        <div style="font-size:15px;color:#ddd;line-height:1.7;">
                            Thanks for joining! As a member, here's what you can enjoy:
                        </div>

                        <!-- Perks Grid -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                            <tr>
                                <td width="50%" style="padding:8px 6px 8px 0;vertical-align:top;">
                                    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:14px;">
                                        <div style="font-size:20px;margin-bottom:4px;">🛒</div>
                                        <div style="font-size:13px;font-weight:700;color:#fff;">Order Online</div>
                                        <div style="font-size:11px;color:#888;margin-top:2px;">Skip the line — pickup ready</div>
                                    </div>
                                </td>
                                <td width="50%" style="padding:8px 0 8px 6px;vertical-align:top;">
                                    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:14px;">
                                        <div style="font-size:20px;margin-bottom:4px;">🔥</div>
                                        <div style="font-size:13px;font-weight:700;color:#fff;">Save Favorites</div>
                                        <div style="font-size:11px;color:#888;margin-top:2px;">Quick reorder your go-tos</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="50%" style="padding:8px 6px 8px 0;vertical-align:top;">
                                    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:14px;">
                                        <div style="font-size:20px;margin-bottom:4px;">📋</div>
                                        <div style="font-size:13px;font-weight:700;color:#fff;">Order History</div>
                                        <div style="font-size:11px;color:#888;margin-top:2px;">Track past & current orders</div>
                                    </div>
                                </td>
                                <td width="50%" style="padding:8px 0 8px 6px;vertical-align:top;">
                                    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:14px;">
                                        <div style="font-size:20px;margin-bottom:4px;">🎁</div>
                                        <div style="font-size:13px;font-weight:700;color:#fff;">Member Perks</div>
                                        <div style="font-size:11px;color:#888;margin-top:2px;">Exclusive deals & early access</div>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Account details -->
                        <div style="margin-top:24px;padding:14px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;">
                            <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Your Account</div>
                            <div style="font-size:13px;color:#f2f2f2;">📧 ${email}</div>
                        </div>
                    </td>
                </tr>

                <!-- CTA -->
                <tr>
                    <td style="background:#111;padding:0 30px 28px;text-align:center;">
                        <a href="https://hofherrmeatco.com/online-orders" style="display:inline-block;background:#800020;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 36px;border-radius:8px;">Start Shopping</a>
                        <div style="font-size:11px;color:#666;margin-top:12px;">or <a href="https://hofherrmeatco.com/dashboard" style="color:#c5a255;text-decoration:none;">visit your dashboard</a></div>
                    </td>
                </tr>`;

    const text = `Welcome to Hofherr Meat Co., ${firstName}!

Your account is all set. Here's what you can do:

• Order Online — skip the line, pickup ready
• Save Favorites — quick reorder your go-tos
• Order History — track past and current orders
• Member Perks — exclusive deals and early access

Your account email: ${email}

Start shopping: https://hofherrmeatco.com/online-orders
Dashboard: https://hofherrmeatco.com/dashboard

— Hofherr Meat Co.
300 Happ Rd, Northfield, IL 60093
(847) 441-6328`;

    return { subject, html: wrap(subject, inner), text };
}

/* ═══════════════════════════════════════════════════════════════════════
   2. NEWSLETTER WELCOME — sent after newsletter signup
   ═══════════════════════════════════════════════════════════════════════ */

export function buildNewsletterWelcomeEmail(email: string, name?: string) {
    const firstName = name?.split(' ')[0] || '';
    const greeting = firstName ? `Hey ${firstName}` : `Hey there`;

    const subject = `You're on the list! 🔥 Hofherr Meat Co.`;

    const inner = `
                <!-- Hero Banner -->
                <tr>
                    <td style="background:linear-gradient(135deg,#800020,#5c0018);padding:32px 30px;text-align:center;">
                        <div style="font-size:36px;margin-bottom:8px;">📬</div>
                        <div style="font-size:22px;font-weight:700;color:#fff;">You're On The List!</div>
                        <div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:8px;">${greeting} — welcome to the Hofherr newsletter.</div>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="background:#111;padding:28px 30px;">
                        <div style="font-size:15px;color:#ddd;line-height:1.7;">
                            You'll be the first to hear about:
                        </div>

                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;">
                                    <span style="font-size:16px;margin-right:10px;">🔥</span>
                                    <span style="font-size:14px;color:#f2f2f2;font-weight:600;">Weekly Specials & Flash Sales</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;">
                                    <span style="font-size:16px;margin-right:10px;">🥩</span>
                                    <span style="font-size:14px;color:#f2f2f2;font-weight:600;">New Cuts & Seasonal Products</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;">
                                    <span style="font-size:16px;margin-right:10px;">🌡️</span>
                                    <span style="font-size:14px;color:#f2f2f2;font-weight:600;">BBQ Tips & Recipes from the Butcher</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;">
                                    <span style="font-size:16px;margin-right:10px;">🎉</span>
                                    <span style="font-size:14px;color:#f2f2f2;font-weight:600;">Events, Tastings & Community News</span>
                                </td>
                            </tr>
                        </table>

                        <div style="margin-top:20px;font-size:13px;color:#888;line-height:1.6;">
                            We keep it short, useful, and no spam — just the good stuff from behind the counter.
                        </div>
                    </td>
                </tr>

                <!-- CTA -->
                <tr>
                    <td style="background:#111;padding:0 30px 28px;text-align:center;">
                        <a href="https://hofherrmeatco.com/specials" style="display:inline-block;background:#800020;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 36px;border-radius:8px;">See This Week's Specials</a>
                    </td>
                </tr>`;

    const text = `${greeting} — You're on the list!

Welcome to the Hofherr Meat Co. newsletter. You'll be the first to hear about:

• Weekly Specials & Flash Sales
• New Cuts & Seasonal Products
• BBQ Tips & Recipes from the Butcher
• Events, Tastings & Community News

We keep it short, useful, and no spam — just the good stuff from behind the counter.

See this week's specials: https://hofherrmeatco.com/specials

— Hofherr Meat Co.
300 Happ Rd, Northfield, IL 60093
(847) 441-6328`;

    return { subject, html: wrap(subject, inner), text };
}

import { resolveOrderCutPieces, OrderCutPiece } from '@/lib/cutCollector';

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

/* ═══════════════════════════════════════════════════════════════════════
   3. EMAIL VERIFICATION — sent on registration to confirm the email
   ═══════════════════════════════════════════════════════════════════════ */

export function buildVerifyEmail(name: string, email: string, verifyUrl: string) {
    const firstName = name.split(' ')[0] || 'there';

    const subject = `Confirm your email — Hofherr Meat Co.`;

    const inner = `
                <!-- Hero Banner -->
                <tr>
                    <td style="background:linear-gradient(135deg,#800020,#5c0018);padding:32px 30px;text-align:center;">
                        <div style="font-size:36px;margin-bottom:8px;">📧</div>
                        <div style="font-size:24px;font-weight:700;color:#fff;">Almost There, ${firstName}!</div>
                        <div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:8px;">Just one more step to activate your account.</div>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="background:#111;padding:28px 30px;">
                        <div style="font-size:15px;color:#ddd;line-height:1.7;">
                            We received a sign-up request for <strong style="color:#fff;">${email}</strong>. If this was you, click the button below to verify your email and finish setting up your account.
                        </div>

                        <div style="margin-top:8px;font-size:13px;color:#888;line-height:1.5;">
                            If you didn't create this account, you can safely ignore this email.
                        </div>
                    </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                    <td style="background:#111;padding:0 30px 12px;text-align:center;">
                        <a href="${verifyUrl}" style="display:inline-block;background:#800020;color:#fff;text-decoration:none;font-weight:700;font-size:16px;padding:16px 48px;border-radius:8px;letter-spacing:0.5px;">Verify My Email</a>
                    </td>
                </tr>

                <!-- Fallback link -->
                <tr>
                    <td style="background:#111;padding:0 30px 28px;text-align:center;">
                        <div style="font-size:11px;color:#666;margin-top:8px;">Or copy and paste this link into your browser:</div>
                        <div style="font-size:11px;color:#c5a255;word-break:break-all;margin-top:6px;">${verifyUrl}</div>
                        <div style="font-size:11px;color:#555;margin-top:12px;">This link expires in 24 hours.</div>
                    </td>
                </tr>`;

    const text = `Almost there, ${firstName}!

We received a sign-up request for ${email}. If this was you, click the link below to verify your email:

${verifyUrl}

If you didn't create this account, you can safely ignore this email.

This link expires in 24 hours.

— Hofherr Meat Co.
300 Happ Rd, Northfield, IL 60093
(847) 441-6328`;

    return { subject, html: wrap(subject, inner), text };
}

/* ═══════════════════════════════════════════════════════════════════════
   4. ORDER CONFIRMATION EMAIL — includes Butcher's Guide to Cuts pieces
   ═══════════════════════════════════════════════════════════════════════ */

export function buildOrderConfirmationEmail(payload: OrderConfirmationEmailPayload): {
    subject: string;
    html: string;
    text: string;
    cutPieces: OrderCutPiece[];
} {
    const { items, contact, orderNote, storeId, tipAmount, coupon } = payload;
    const baseUrl = payload.baseUrl !== undefined ? payload.baseUrl : '';
    const storeName = storeId === 'depot' ? 'The Depot' : 'The Butcher Shop';
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
            <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#f2f2f2;font-size:14px;">
                ${safeEsc(i.name)}${i.note ? `<br/><span style="font-size:11px;color:#888;font-style:italic;">📝 ${safeEsc(i.note)}</span>` : ''}
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#999;font-size:13px;text-align:center;">×${i.qty}</td>
            <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#f2f2f2;font-size:14px;text-align:right;font-weight:600;">${safeEsc(i.price)}</td>
            <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#c5a255;font-size:14px;text-align:right;font-weight:700;">$${lineTotal.toFixed(2)}</td>
        </tr>`;
        })
        .join('');

    const butcherGuideRows =
        cutPieces.length > 0
            ? `
                <!-- Butcher's Guide to Cuts — Unlocked Pieces -->
                <tr>
                    <td style="background:#111;padding:0 30px 24px;">
                        <div style="background:#171311;border:1px solid #4a2c18;border-radius:10px;padding:18px 20px;">
                            <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #332015;padding-bottom:12px;margin-bottom:14px;">
                                <div>
                                    <div style="font-size:10px;font-weight:800;color:#f59b1a;letter-spacing:1.5px;text-transform:uppercase;">🥩 Butcher's Guide to Cuts</div>
                                    <div style="font-size:17px;font-weight:800;color:#faf0e6;margin-top:2px;">Pieces Unlocked in Your Order (${cutPieces.length})</div>
                                    <div style="font-size:12px;color:#b8a99a;margin-top:2px;">Each primal section below is now lit up in gold on your 7-Animal Butcher Chart.</div>
                                </div>
                            </div>
                            ${cutPieces
                                .map((piece) => {
                                    const pieceImgUrl = `${baseUrl}/api/butcher-cut-piece?animal=${encodeURIComponent(piece.animalId)}&cuts=${encodeURIComponent(piece.cutId)}&zoom=piece`;
                                    const fullImgUrl = `${baseUrl}/api/butcher-cut-piece?animal=${encodeURIComponent(piece.animalId)}&cuts=${encodeURIComponent(piece.cutId)}&zoom=full`;
                                    const matchedNames = piece.matchedItems
                                        .map((m) => `${safeEsc(m.orderedName)} ×${m.qty}`)
                                        .join(', ');
                                    return `
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#120f0d;border:1px solid #3a2416;border-radius:8px;margin-bottom:12px;overflow:hidden;">
                                <tr>
                                    <td width="46%" valign="middle" style="padding:10px;background:#f3ead8;border-right:2px solid #6b070b;text-align:center;">
                                        <img src="${pieceImgUrl}" alt="${safeEsc(piece.animalName)} — ${safeEsc(piece.cutName)} Cut Piece" width="210" style="width:100%;max-width:210px;height:auto;display:block;margin:0 auto;border-radius:4px;border:1px solid #6b070b;" />
                                        <div style="font-size:9px;font-weight:800;color:#6b070b;letter-spacing:1px;text-transform:uppercase;margin-top:4px;">▲ Zoomed Cut Piece (${safeEsc(piece.cutName)})</div>
                                    </td>
                                    <td width="54%" valign="top" style="padding:12px 14px;">
                                        <div style="display:inline-block;background:rgba(245,155,26,0.16);border:1px solid rgba(245,155,26,0.5);color:#f59b1a;font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:2px 8px;border-radius:999px;">
                                            ★ ${safeEsc(piece.animalName)} Guide · Cut #${piece.cutOrderIndex} of ${piece.totalAnimalCuts}
                                        </div>
                                        <div style="font-size:17px;font-weight:800;color:#fff;margin-top:6px;letter-spacing:0.3px;">
                                            ${safeEsc(piece.animalName)}: ${safeEsc(piece.cutName)} Section
                                        </div>
                                        <div style="font-size:12px;color:#d6c7b8;margin-top:4px;">
                                            Ordered Cut: <strong style="color:#f59b1a;">${matchedNames}</strong>
                                        </div>
                                        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #2b1d14;">
                                            <img src="${fullImgUrl}" alt="Full ${safeEsc(piece.animalName)} Butcher Guide" width="170" style="width:100%;max-width:170px;height:auto;display:block;border-radius:4px;border:1px solid #4a2c18;" />
                                            <div style="font-size:9px;color:#9c8d7e;margin-top:3px;">Full ${safeEsc(piece.wholeTitle)} chart with ${safeEsc(piece.cutName)} highlighted</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>`;
                                })
                                .join('')}
                            <div style="text-align:center;margin-top:14px;">
                                <a href="${baseUrl || 'https://hofherrmeatco.com'}/dashboard#cut-collection" style="display:inline-block;background:#f59b1a;color:#140d08;text-decoration:none;font-weight:800;font-size:12px;padding:9px 20px;border-radius:6px;letter-spacing:0.5px;text-transform:uppercase;">
                                    View Your 7-Animal Butcher Guide →
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>`
            : '';

    const subject = `Order Confirmed — ${storeName} #${orderNum}`;

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${safeEsc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
        <tr><td align="center" style="padding:20px 16px;">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                <!-- Header -->
                <tr>
                    <td style="background:#111;border-radius:12px 12px 0 0;padding:24px 30px;text-align:center;border-bottom:2px solid #800020;">
                        <div style="font-family:'Yanone Kaffeesatz','Georgia',serif;font-size:28px;font-weight:700;color:#fff;letter-spacing:1px;">HOFHERR MEAT CO.</div>
                        <div style="font-size:11px;color:#c5a255;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Premium Butcher • Since 1906</div>
                    </td>
                </tr>

                <!-- Confirmation Banner -->
                <tr>
                    <td style="background:linear-gradient(135deg,#800020,#5c0018);padding:28px 30px;text-align:center;">
                        <div style="font-size:32px;margin-bottom:8px;">✅</div>
                        <div style="font-size:22px;font-weight:700;color:#fff;">Order Confirmed!</div>
                        <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:6px;">Thank you, ${safeEsc(contact.name)}. We're preparing your order.</div>
                        <div style="margin-top:12px;display:inline-block;background:rgba(0,0,0,0.3);border-radius:6px;padding:6px 16px;">
                            <span style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:1px;">ORDER #</span>
                            <span style="font-size:16px;font-weight:800;color:#fff;margin-left:4px;">${safeEsc(orderNum)}</span>
                        </div>
                    </td>
                </tr>

                <!-- Pickup Info -->
                <tr>
                    <td style="background:#111;padding:20px 30px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="50%" style="padding:10px 0;">
                                    <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">📍 Pickup Location</div>
                                    <div style="font-size:15px;font-weight:700;color:#fff;">${safeEsc(storeName)}</div>
                                    <div style="font-size:12px;color:#999;">${safeEsc(storeAddr)}</div>
                                </td>
                                <td width="50%" style="padding:10px 0;text-align:right;">
                                    <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">🕐 Pickup Time</div>
                                    <div style="font-size:15px;font-weight:700;color:#c5a255;">${safeEsc(contact.pickup || 'To be confirmed')}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Items Table -->
                <tr>
                    <td style="background:#111;padding:0 30px 20px;">
                        <div style="font-size:11px;font-weight:800;color:#888;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;padding-top:16px;border-top:1px solid #2a2a2a;">Your Order</div>
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <th style="text-align:left;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:6px;">Item</th>
                                <th style="text-align:center;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:6px;">Qty</th>
                                <th style="text-align:right;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:6px;">Price</th>
                                <th style="text-align:right;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:6px;">Total</th>
                            </tr>
                            ${itemRows}
                        </table>
                        ${orderNote ? `<div style="margin-top:12px;padding:10px;background:#1a1a1a;border-radius:6px;font-size:12px;color:#999;">📝 <em>${safeEsc(orderNote)}</em></div>` : ''}
                    </td>
                </tr>

                ${butcherGuideRows}

                <!-- Totals -->
                <tr>
                    <td style="background:#111;padding:0 30px 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2a2a2a;padding-top:12px;">
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#999;">Subtotal</td>
                                <td style="padding:4px 0;font-size:13px;color:#f2f2f2;text-align:right;">$${subtotal.toFixed(2)}</td>
                            </tr>
                            ${discountAmt > 0 ? `
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#16a34a;">Discount (${safeEsc(coupon?.code || '')})</td>
                                <td style="padding:4px 0;font-size:13px;color:#16a34a;text-align:right;">-$${discountAmt.toFixed(2)}</td>
                            </tr>` : ''}
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#999;">Tax (2.25%)</td>
                                <td style="padding:4px 0;font-size:13px;color:#f2f2f2;text-align:right;">$${tax.toFixed(2)}</td>
                            </tr>
                            ${tip > 0 ? `
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#999;">Tip 💝</td>
                                <td style="padding:4px 0;font-size:13px;color:#c5a255;text-align:right;">$${tip.toFixed(2)}</td>
                            </tr>` : ''}
                            <tr>
                                <td style="padding:12px 0 0;font-size:18px;font-weight:800;color:#fff;border-top:1px solid #2a2a2a;">Estimated Total</td>
                                <td style="padding:12px 0 0;font-size:22px;font-weight:800;color:#800020;text-align:right;border-top:1px solid #2a2a2a;">$${total.toFixed(2)}</td>
                            </tr>
                        </table>
                        <div style="font-size:11px;color:#666;margin-top:8px;text-align:center;">*Final total is determined by exact scale weight at pickup.</div>
                    </td>
                </tr>

                <!-- CTA -->
                <tr>
                    <td style="background:#111;padding:0 30px 24px;text-align:center;">
                        <a href="${baseUrl || 'https://hofherrmeatco.com'}/online-orders" style="display:inline-block;background:#800020;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 32px;border-radius:8px;">Order Again</a>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background:#0d0d0d;border-radius:0 0 12px 12px;padding:20px 30px;text-align:center;">
                        <div style="font-size:11px;color:#555;">Hofherr Meat Co. • ${safeEsc(storeAddr)}</div>
                        <div style="font-size:11px;color:#555;margin-top:4px;">📞 (847) 441-6328 • info@hofherrmeatco.com</div>
                        <div style="font-size:10px;color:#444;margin-top:8px;">You received this email because you placed an order at Hofherr Meat Co.</div>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;

    const butcherGuideText =
        cutPieces.length > 0
            ? [
                  '',
                  "BUTCHER'S GUIDE TO CUTS — PIECES UNLOCKED IN THIS ORDER:",
                  ...cutPieces.map(
                      (p) =>
                          `  ★ ${p.animalName.toUpperCase()} — ${p.cutName.toUpperCase()} SECTION (Cut #${p.cutOrderIndex}/${p.totalAnimalCuts}): ${p.matchedItems.map((m) => `${m.orderedName} x${m.qty}`).join(', ')}`
                  ),
              ]
            : [];

    const text = [
        `ORDER CONFIRMED — #${orderNum}`,
        `Thank you, ${contact.name}!`,
        '',
        `Pickup Location: ${storeName} (${storeAddr})`,
        `Pickup Time: ${contact.pickup || 'To be confirmed'}`,
        '',
        'Items:',
        ...items.map(
            (i) =>
                `  • ${i.name} ×${i.qty} — ${i.price} ($${(parsePriceValue(i.price) * i.qty).toFixed(2)})${i.note ? ` [${i.note}]` : ''}`
        ),
        ...(orderNote ? ['', `Order Note: ${orderNote}`] : []),
        ...butcherGuideText,
        '',
        `Subtotal: $${subtotal.toFixed(2)}`,
        ...(discountAmt > 0 ? [`Discount (${coupon?.code}): -$${discountAmt.toFixed(2)}`] : []),
        `Tax (2.25%): $${tax.toFixed(2)}`,
        ...(tip > 0 ? [`Tip: $${tip.toFixed(2)}`] : []),
        `Estimated Total: $${total.toFixed(2)}`,
        '',
        '*Final total is determined by exact scale weight at pickup.',
        '',
        'Hofherr Meat Co. • (847) 441-6328',
    ].join('\n');

    return { subject, html, text, cutPieces };
}

/* ═══════════════════════════════════════════════════════════════════════
   4. RESTOCK FILLED EMAIL — sent to customer when their requested item is back in stock
   ═══════════════════════════════════════════════════════════════════════ */

export function buildRestockFilledEmail(params: {
    customerName: string;
    item: string;
    qty: number;
    store: string;
    baseUrl?: string;
}) {
    const firstName = (params.customerName || '').trim().split(' ')[0] || 'there';
    const storeName = params.store === 'depot' ? 'The Depot (Winnetka)' : 'The Butcher Shop (Northfield)';
    const storeAddr =
        params.store === 'depot'
            ? '754 Elm St, Winnetka, IL 60093'
            : '300 Happ Rd, Northfield, IL 60093';
    const orderUrl = `${params.baseUrl || 'https://hofherrmeatco.com'}/online-orders`;

    const subject = `🔔 Back in Stock: ${params.item} is Ready at Hofherr Meat Co.!`;

    const inner = `
                <!-- Hero Banner -->
                <tr>
                    <td style="background:linear-gradient(135deg,#800020,#5c0018);padding:32px 30px;text-align:center;">
                        <div style="font-size:36px;margin-bottom:8px;">🔔</div>
                        <div style="font-size:11px;font-weight:800;color:#c5a255;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Restock Request Filled</div>
                        <div style="font-size:24px;font-weight:700;color:#fff;">Good News, ${firstName}! It&apos;s Back on the Block.</div>
                        <div style="font-size:14px;color:rgba(255,255,255,0.8);margin-top:8px;">Your requested cut has just been restocked and is available to order.</div>
                    </td>
                </tr>

                <!-- Item Highlight Card -->
                <tr>
                    <td style="background:#111;padding:28px 30px;">
                        <div style="background:#1a1a1a;border:1px solid #2e2e2e;border-left:4px solid #c5a255;border-radius:8px;padding:18px 20px;">
                            <div style="font-size:10px;color:#c5a255;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin-bottom:6px;">Ready to Order</div>
                            <div style="font-size:18px;font-weight:700;color:#fff;">${params.qty}× ${params.item}</div>
                            <div style="font-size:13px;color:#aaa;margin-top:6px;">📍 ${storeName} • ${storeAddr}</div>
                        </div>

                        <div style="font-size:14px;color:#ccc;line-height:1.6;margin-top:20px;">
                            We&apos;ve also posted a notification on your <strong>Butcher Guild Profile Page</strong> so you can add <strong>${params.item}</strong> straight to your bag in one click before today&apos;s batch sells out.
                        </div>
                    </td>
                </tr>

                <!-- CTA -->
                <tr>
                    <td style="background:#111;padding:0 30px 28px;text-align:center;">
                        <a href="${orderUrl}" style="display:inline-block;background:#800020;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:8px;letter-spacing:0.5px;">Order ${params.item} Now →</a>
                    </td>
                </tr>`;

    const text = [
        `RESTOCK REQUEST FILLED — HOFHERR MEAT CO.`,
        ``,
        `Good news, ${firstName}!`,
        `Your requested cut is back in stock and ready to order:`,
        ``,
        `  • Item: ${params.qty}× ${params.item}`,
        `  • Location: ${storeName} (${storeAddr})`,
        ``,
        `Order online now before today's batch sells out: ${orderUrl}`,
        `A notification has also been added to your Butcher Guild Profile page.`,
        ``,
        `Hofherr Meat Co. • (847) 441-6328`,
    ].join('\n');

    return {
        subject,
        html: wrap(subject, inner),
        text,
    };
}


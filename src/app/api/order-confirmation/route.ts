import { NextResponse } from 'next/server';

/**
 * Order Confirmation Email API
 * Sends a branded HTML confirmation email to the customer after order placement.
 */

interface OrderItem {
    name: string;
    price: string;
    qty: number;
    note?: string;
}

interface OrderPayload {
    items: OrderItem[];
    contact: { name: string; email: string; phone: string; pickup: string };
    orderNote?: string;
    storeId: string;
    tipAmount?: number;
    coupon?: { code: string; type: 'percent' | 'fixed'; value: number } | null;
}

function parsePriceNum(price: string): number {
    const m = String(price).match(/\$([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
}

function buildConfirmationEmail(payload: OrderPayload): { subject: string; html: string; text: string } {
    const { items, contact, orderNote, storeId, tipAmount, coupon } = payload;
    const storeName = storeId === 'depot' ? 'The Depot' : 'The Butcher Shop';
    const storeAddr = storeId === 'depot' ? '780 Elm St, Winnetka, IL' : '300 Happ Rd, Northfield, IL';
    const orderNum = Math.floor(10000000 + Math.random() * 90000000).toString(16).toUpperCase();

    const subtotal = items.reduce((s, i) => s + parsePriceNum(i.price) * i.qty, 0);
    let discountAmt = 0;
    if (coupon) {
        discountAmt = coupon.type === 'percent' ? subtotal * (coupon.value / 100) : coupon.value;
    }
    const afterDiscount = Math.max(0, subtotal - discountAmt);
    const tax = afterDiscount * 0.0225;
    const tip = tipAmount || 0;
    const total = afterDiscount + tax + tip;

    const itemRows = items.map(i => {
        const lineTotal = parsePriceNum(i.price) * i.qty;
        return `
        <tr>
            <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#f2f2f2;font-size:14px;">
                ${i.name}${i.note ? `<br/><span style="font-size:11px;color:#888;font-style:italic;">📝 ${i.note}</span>` : ''}
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#999;font-size:13px;text-align:center;">×${i.qty}</td>
            <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#f2f2f2;font-size:14px;text-align:right;font-weight:600;">${i.price}</td>
            <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#c5a255;font-size:14px;text-align:right;font-weight:700;">$${lineTotal.toFixed(2)}</td>
        </tr>`;
    }).join('');

    const subject = `Order Confirmed — ${storeName} #${orderNum}`;

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${subject}</title>
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
                        <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:6px;">Thank you, ${contact.name}. We're preparing your order.</div>
                        <div style="margin-top:12px;display:inline-block;background:rgba(0,0,0,0.3);border-radius:6px;padding:6px 16px;">
                            <span style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:1px;">ORDER #</span>
                            <span style="font-size:16px;font-weight:800;color:#fff;margin-left:4px;">${orderNum}</span>
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
                                    <div style="font-size:15px;font-weight:700;color:#fff;">${storeName}</div>
                                    <div style="font-size:12px;color:#999;">${storeAddr}</div>
                                </td>
                                <td width="50%" style="padding:10px 0;text-align:right;">
                                    <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">🕐 Pickup Time</div>
                                    <div style="font-size:15px;font-weight:700;color:#c5a255;">${contact.pickup || 'To be confirmed'}</div>
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
                        ${orderNote ? `<div style="margin-top:12px;padding:10px;background:#1a1a1a;border-radius:6px;font-size:12px;color:#999;">📝 <em>${orderNote}</em></div>` : ''}
                    </td>
                </tr>

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
                                <td style="padding:4px 0;font-size:13px;color:#27ae60;">Discount (${coupon?.code})</td>
                                <td style="padding:4px 0;font-size:13px;color:#27ae60;text-align:right;">-$${discountAmt.toFixed(2)}</td>
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
                        <a href="https://hofherrmeatco.com/online-orders" style="display:inline-block;background:#800020;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 32px;border-radius:8px;">Order Again</a>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background:#0d0d0d;border-radius:0 0 12px 12px;padding:20px 30px;text-align:center;">
                        <div style="font-size:11px;color:#555;">Hofherr Meat Co. • ${storeAddr}</div>
                        <div style="font-size:11px;color:#555;margin-top:4px;">📞 (847) 441-6328 • info@hofherrmeatco.com</div>
                        <div style="font-size:10px;color:#444;margin-top:8px;">You received this email because you placed an order at Hofherr Meat Co.</div>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;

    const text = `Order Confirmed — ${storeName} #${orderNum}

Hi ${contact.name},

Thank you for your order! Here's your summary:

${items.map(i => `• ${i.name} ×${i.qty} — ${i.price}${i.note ? ` (${i.note})` : ''}`).join('\n')}
${orderNote ? `\nOrder Note: ${orderNote}` : ''}

Subtotal: $${subtotal.toFixed(2)}
${discountAmt > 0 ? `Discount (${coupon?.code}): -$${discountAmt.toFixed(2)}\n` : ''}Tax: $${tax.toFixed(2)}
${tip > 0 ? `Tip: $${tip.toFixed(2)}\n` : ''}Estimated Total: $${total.toFixed(2)}

Pickup at: ${storeName} — ${storeAddr}
Pickup time: ${contact.pickup || 'To be confirmed'}

*Final total determined by exact scale weight at pickup.

— Hofherr Meat Co.`;

    return { subject, html, text };
}

export async function POST(req: Request) {
    try {
        const payload: OrderPayload = await req.json();

        if (!payload.contact?.email) {
            return NextResponse.json({ error: 'No email provided' }, { status: 400 });
        }

        const { subject, html, text } = buildConfirmationEmail(payload);

        // Log the email for debugging
        console.log('[Order Confirmation] Email prepared for:', payload.contact.email);
        console.log('[Order Confirmation] Subject:', subject);

        // Send via shared email utility (supports Resend, SendGrid, fallback to console)
        const { sendEmail } = await import('@/lib/email');
        const result = await sendEmail({
            to: payload.contact.email,
            subject,
            html,
            text,
            from: undefined,
        });

        if (result.success) {
            console.log(`[Order Confirmation] Email sent via ${result.provider}`);
        } else {
            console.log('[Order Confirmation] Email not sent — no provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY in .env.local');
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[Order Confirmation] Error:', err);
        return NextResponse.json({ error: 'Failed to send confirmation' }, { status: 500 });
    }
}

import type { Metadata } from 'next';
import { buildWelcomeEmail, buildNewsletterWelcomeEmail, buildVerifyEmail } from '@/lib/email-templates';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Email Template Preview' };

/* ── Sample order confirmation (self-contained for preview) ──────────── */
function buildSampleOrderConfirmation() {
    const items = [
        { name: 'Bone-In Ribeye (16 oz)', price: '$24.99', qty: 2, note: 'Extra marbled please' },
        { name: 'Baby Back Ribs (Full Rack)', price: '$19.99', qty: 1 },
        { name: 'Hofherr Signature Burger Blend', price: '$8.99', qty: 3 },
        { name: 'Fresh Italian Sausage (1 lb)', price: '$7.49', qty: 2 },
    ];
    const contact = { name: 'Sean Hofherr', email: 'sean@hofherrmeatco.com', phone: '(847) 555-0100', pickup: 'Mon, Mar 31 at 2:30 PM' };
    const storeName = 'The Butcher Shop';
    const storeAddr = '300 Happ Rd, Northfield, IL';
    const orderNum = 'A7F3BC21';
    const tipAmount = 5.00;
    const coupon = { code: 'SPRING10', type: 'percent' as const, value: 10 };

    const subtotal = items.reduce((s, i) => {
        const m = i.price.match(/\$([\d.]+)/);
        return s + (m ? parseFloat(m[1]) : 0) * i.qty;
    }, 0);
    const discountAmt = coupon.type === 'percent' ? subtotal * (coupon.value / 100) : coupon.value;
    const afterDiscount = Math.max(0, subtotal - discountAmt);
    const tax = afterDiscount * 0.0225;
    const total = afterDiscount + tax + tipAmount;

    const itemRows = items.map(i => {
        const m = i.price.match(/\$([\d.]+)/);
        const lineTotal = (m ? parseFloat(m[1]) : 0) * i.qty;
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
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
        <tr><td align="center" style="padding:20px 16px;">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                <tr>
                    <td style="background:#111;border-radius:12px 12px 0 0;padding:24px 30px;text-align:center;border-bottom:2px solid #800020;">
                        <div style="font-family:'Yanone Kaffeesatz','Georgia',serif;font-size:28px;font-weight:700;color:#fff;letter-spacing:1px;">HOFHERR MEAT CO.</div>
                        <div style="font-size:11px;color:#c5a255;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Premium Butcher • Since 1906</div>
                    </td>
                </tr>
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
                                    <div style="font-size:15px;font-weight:700;color:#c5a255;">${contact.pickup}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
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
                    </td>
                </tr>
                <tr>
                    <td style="background:#111;padding:0 30px 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2a2a2a;padding-top:12px;">
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#999;">Subtotal</td>
                                <td style="padding:4px 0;font-size:13px;color:#f2f2f2;text-align:right;">$${subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#27ae60;">Discount (${coupon.code})</td>
                                <td style="padding:4px 0;font-size:13px;color:#27ae60;text-align:right;">-$${discountAmt.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#999;">Tax (2.25%)</td>
                                <td style="padding:4px 0;font-size:13px;color:#f2f2f2;text-align:right;">$${tax.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0;font-size:13px;color:#999;">Tip 💝</td>
                                <td style="padding:4px 0;font-size:13px;color:#c5a255;text-align:right;">$${tipAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding:12px 0 0;font-size:18px;font-weight:800;color:#fff;border-top:1px solid #2a2a2a;">Estimated Total</td>
                                <td style="padding:12px 0 0;font-size:22px;font-weight:800;color:#800020;text-align:right;border-top:1px solid #2a2a2a;">$${total.toFixed(2)}</td>
                            </tr>
                        </table>
                        <div style="font-size:11px;color:#666;margin-top:8px;text-align:center;">*Final total is determined by exact scale weight at pickup.</div>
                    </td>
                </tr>
                <tr>
                    <td style="background:#111;padding:0 30px 24px;text-align:center;">
                        <a href="https://hofherrmeatco.com/online-orders" style="display:inline-block;background:#800020;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 32px;border-radius:8px;">Order Again</a>
                    </td>
                </tr>
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

Subtotal: $${subtotal.toFixed(2)}
Discount (${coupon.code}): -$${discountAmt.toFixed(2)}
Tax: $${tax.toFixed(2)}
Tip: $${tipAmount.toFixed(2)}
Estimated Total: $${total.toFixed(2)}

Pickup at: ${storeName} — ${storeAddr}
Pickup time: ${contact.pickup}

*Final total determined by exact scale weight at pickup.

— Hofherr Meat Co.`;

    return { subject, html, text };
}

/* ── Page Component ──────────────────────────────────────────────────── */

const TEMPLATE_NAMES: Record<string, string> = {
    verify: '📧 Verify Email',
    welcome: '🔥 Welcome',
    newsletter: '📬 Newsletter',
    order: '✅ Order Confirmation',
};

export default async function EmailPreviewPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
    const params = await searchParams;
    const template = params.template || 'welcome';

    const templates: Record<string, { subject: string; html: string; text: string }> = {
        verify: buildVerifyEmail('Sean Hofherr', 'sean@hofherrmeatco.com', 'https://hofherrmeatco.com/verify-email?token=abc123def456'),
        welcome: buildWelcomeEmail('Sean Hofherr', 'sean@hofherrmeatco.com'),
        newsletter: buildNewsletterWelcomeEmail('sean@hofherrmeatco.com', 'Sean'),
        order: buildSampleOrderConfirmation(),
    };

    const selected = templates[template] || templates.welcome;

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📧 Email Template Preview</h1>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {Object.entries(TEMPLATE_NAMES).map(([key, label]) => (
                    <a
                        key={key}
                        href={`/debug-email/preview?template=${key}`}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            background: template === key ? '#800020' : '#eee',
                            color: template === key ? '#fff' : '#333',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: 13,
                        }}
                    >
                        {label}
                    </a>
                ))}
            </div>

            <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 20, color: '#333' }}>
                <strong style={{ color: '#111' }}>Subject:</strong> <span style={{ color: '#555' }}>{selected.subject}</span>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                <div dangerouslySetInnerHTML={{ __html: selected.html }} />
            </div>

            <details style={{ marginTop: 24 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Plain Text Version</summary>
                <pre style={{ background: '#f0f0f0', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap', fontSize: 13, marginTop: 8 }}>
                    {selected.text}
                </pre>
            </details>
        </div>
    );
}

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

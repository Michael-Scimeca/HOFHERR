import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// ─── Twilio client (lazy — only created when route is hit) ───────────────────
function getClient() {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    if (!sid || !token || sid.startsWith('AC')) {
        // Credentials not yet configured — still return a stub so the UI works
        return null;
    }
    return twilio(sid, token);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function normalizePhone(raw: string): string {
    // Strip everything except digits and leading +
    const digits = raw.replace(/[^\d]/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return `+${digits}`;
}

function isValidPhone(phone: string): boolean {
    return /^\+1\d{10}$/.test(phone);
}

// ─── Welcome message ─────────────────────────────────────────────────────────
const WELCOME_MSG = `🥩 Welcome to Hofherr Meat Co. text alerts!

You'll be the first to know about:
• Weekly cut specials
• Holiday pre-orders
• Butcher's picks & limited deals

Reply STOP anytime to unsubscribe.
— Sean & the Hofherr team
📍 300 Happ Rd, Northfield, IL`;

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, name } = body;

        // Validate
        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
        }

        const normalized = normalizePhone(phone);
        if (!isValidPhone(normalized)) {
            return NextResponse.json(
                { error: 'Please enter a valid US phone number.' },
                { status: 400 }
            );
        }

        // Try to send welcome text
        const client = getClient();

        if (!client) {
            // Twilio not yet configured — simulate success so UI can be tested
            console.log(`[SMS Signup — dev mode] Would text ${normalized}${name ? ` (${name})` : ''}`);
            return NextResponse.json({
                success: true,
                dev: true,
                message: 'Signup recorded (Twilio credentials not yet configured).',
                phone: normalized,
            });
        }

        const from =
            process.env.TWILIO_MESSAGING_SERVICE_SID
                ? undefined
                : process.env.TWILIO_PHONE_NUMBER;

        const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

        await client.messages.create({
            body: name
                ? `Hi ${name.trim()}! ${WELCOME_MSG}`
                : WELCOME_MSG,
            to: normalized,
            ...(messagingServiceSid
                ? { messagingServiceSid }
                : { from }),
        });

        return NextResponse.json({ success: true, phone: normalized });
    } catch (err: unknown) {
        console.error('[SMS Signup Error]', err);

        // Surface friendly Twilio errors
        const twilioErr = err as { code?: number; message?: string };
        if (twilioErr.code === 21211) {
            return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
        }
        if (twilioErr.code === 21614) {
            return NextResponse.json(
                { error: 'This number cannot receive SMS messages.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

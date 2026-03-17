import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import fs from 'fs';
import path from 'path';

// ─── Weekly counter helpers ───────────────────────────────────────────────────
const STATS_PATH = path.join(process.cwd(), 'data', 'chat-stats.json');

/** Returns "YYYY-Www" — changes every Monday */
function getWeekKey(): string {
    const now = new Date();
    // ISO week: shift so Monday=0
    const day = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - day);
    const y = monday.getFullYear();
    const start = new Date(y, 0, 1);
    const week = Math.ceil(((monday.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
    return `${y}-W${String(week).padStart(2, '0')}`;
}

/** Seeded random 14–38 from a string key so it's stable for the same week */
function seededBase(key: string): number {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
    return 14 + Math.abs(h) % 25; // 14..38
}

interface Stats { week: string; base: number; sends: number; }

function readStats(): Stats {
    try {
        if (fs.existsSync(STATS_PATH)) {
            const raw = JSON.parse(fs.readFileSync(STATS_PATH, 'utf8')) as Partial<Stats>;
            const currentWeek = getWeekKey();
            if (raw.week === currentWeek) {
                return { week: currentWeek, base: raw.base ?? seededBase(currentWeek), sends: raw.sends ?? 0 };
            }
        }
    } catch { }
    // New week — generate fresh base
    const week = getWeekKey();
    return { week, base: seededBase(week), sends: 0 };
}

function saveStats(stats: Stats) {
    try {
        fs.mkdirSync(path.dirname(STATS_PATH), { recursive: true });
        fs.writeFileSync(STATS_PATH, JSON.stringify(stats));
    } catch { }
}

// ─── GET — return current count ───────────────────────────────────────────────
export async function GET() {
    const stats = readStats();
    return NextResponse.json({ count: stats.base + stats.sends });
}

// ─── POST — send SMS + increment counter ─────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const { name, phone, message } = await req.json();

        if (!message?.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const stats = readStats();
        stats.sends += 1;
        saveStats(stats);
        const count = stats.base + stats.sends;

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_FROM_NUMBER;
        const toNumber = process.env.SEAN_PHONE_NUMBER;

        if (!accountSid || !authToken || !fromNumber || !toNumber) {
            console.log('[CHAT] Message received (Twilio not configured):', { name, phone, message });
            return NextResponse.json({ ok: true, dev: true, count });
        }

        const client = twilio(accountSid, authToken);

        const smsBody = [
            `📬 New message from Hofherr website`,
            `Name: ${name || 'Anonymous'}`,
            phone ? `Phone: ${phone}` : null,
            ``,
            message,
        ].filter(Boolean).join('\n');

        await client.messages.create({ body: smsBody, from: fromNumber, to: toNumber });

        return NextResponse.json({ ok: true, count });
    } catch (err) {
        console.error('[CHAT] Error sending SMS:', err);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';

function sanitize(s: unknown, max = 300): string {
    if (typeof s !== 'string') return '';
    return s.trim().slice(0, max);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const name      = sanitize(body?.name);
        const email     = sanitize(body?.email, 254);
        const phone     = sanitize(body?.phone, 30);
        const eventDate = sanitize(body?.eventDate, 20);
        const eventType = sanitize(body?.eventType, 50);
        const guestCount = Number(body?.guestCount) || 0;
        const notes     = sanitize(body?.notes, 1000);

        if (!name || !eventDate || !eventType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const doc = {
            _type: 'cateringLead',
            name,
            email,
            phone,
            eventDate,
            eventType,
            guestCount: guestCount > 0 ? guestCount : undefined,
            notes,
            status: 'new',
            submittedAt: new Date().toISOString(),
        };

        const created = await adminClient.create(doc);
        console.log('[Catering Lead] Saved:', created._id, name, eventDate);

        return NextResponse.json({ success: true, id: created._id });

    } catch (err) {
        console.error('[Catering Lead] Error:', err);
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

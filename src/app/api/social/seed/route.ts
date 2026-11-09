import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { isAuthorized } from '@/lib/social/auth';
import { seedDocs } from '@/lib/social/plan';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST — load the starter how-tos, facts, trivia, tips and cut guides into the content bank (idempotent). */
export async function POST(request: Request) {
    if (!(await isAuthorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const docs = seedDocs();
    const tx = adminClient.transaction();
    docs.forEach((d) => tx.createIfNotExists({ _id: `socialContent-${d.seedKey}`, _type: 'socialContent', ...d }));
    await tx.commit();
    return NextResponse.json({ ok: true, seeded: docs.length });
}

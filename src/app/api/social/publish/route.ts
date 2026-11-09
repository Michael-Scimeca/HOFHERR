import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { isAuthorized } from '@/lib/social/auth';
import { executeScheduledPublish } from '@/lib/social/publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * GET / POST /api/social/publish — Vercel Cron, hourly.
 *  1. Publishes every APPROVED post whose time has come (spelling re-checked first).
 *  2. Emails a reminder for unapproved posts due in the next 24h (once per post).
 */
export async function GET(request: Request) {
    if (!(await isAuthorized(request, true))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json(await executeScheduledPublish(adminClient));
}

export async function POST(request: Request) {
    if (!(await isAuthorized(request, true))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json(await executeScheduledPublish(adminClient));
}

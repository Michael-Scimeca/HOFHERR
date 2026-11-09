import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { buildWeek, getSettings, mondayOf, saveWeek, weekDocId } from '@/lib/social/plan';
import { notifyWeekReady } from '@/lib/social/notify';
import { isAuthorized } from '@/lib/social/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET  /api/social/generate               — Vercel Cron (Mondays). Skips if the week exists; emails reviewers.
 * POST /api/social/generate { weekOf? }   — admin Generate / Regenerate button.
 */
export async function GET(request: Request) {
    if (!(await isAuthorized(request, true))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const weekOf = mondayOf();
    const existing = await adminClient.fetch(`*[_id == $id][0]._id`, { id: weekDocId(weekOf) });
    if (existing) return NextResponse.json({ ok: true, skipped: true, weekOf });
    try {
        const week = await saveWeek(adminClient, await buildWeek(adminClient, weekOf));
        const notified = await notifyWeekReady(week, await getSettings(adminClient));
        return NextResponse.json({ ok: true, weekOf, posts: week.posts.length, notified });
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await isAuthorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = (await request.json().catch(() => ({}))) as { weekOf?: string; notify?: boolean };
    const weekOf = body.weekOf ? mondayOf(new Date(`${body.weekOf}T12:00:00`)) : mondayOf();
    try {
        const week = await saveWeek(adminClient, await buildWeek(adminClient, weekOf));
        if (body.notify) await notifyWeekReady(week, await getSettings(adminClient));
        return NextResponse.json({ ok: true, week });
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}

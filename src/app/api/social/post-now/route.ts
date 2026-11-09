import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { isAuthorized } from '@/lib/social/auth';
import { getSettings } from '@/lib/social/plan';
import { publishPost } from '@/lib/social/publish';
import { checkPost } from '@/lib/social/spell';
import type { SocialWeek } from '@/lib/social/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** POST { weekId, postKey } — approve-and-post immediately (still requires clean spelling). */
export async function POST(request: Request) {
    if (!(await isAuthorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { weekId, postKey } = (await request.json()) as { weekId: string; postKey: string };
    const [settings, week] = await Promise.all([
        getSettings(adminClient),
        adminClient.fetch<SocialWeek | null>(`*[_id == $id][0]`, { id: weekId }),
    ]);
    const post = week?.posts.find((p) => p._key === postKey);
    if (!week || !post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const issues = checkPost(post, settings.customWords);
    if (issues.length) return NextResponse.json({ error: 'Fix spelling before posting', issues }, { status: 422 });

    const approvedWeek = { ...week, posts: week.posts.map((p) => (p._key === postKey ? { ...p, approved: true, status: 'approved' as const } : p)) };
    const r = await publishPost(adminClient, approvedWeek, { ...post, approved: true, status: 'approved' }, settings);
    return NextResponse.json({ ok: true, ...r });
}

import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { isAuthorized } from '@/lib/social/auth';
import { getSettings } from '@/lib/social/plan';
import { checkPost } from '@/lib/social/spell';
import type { SocialPost, SocialWeek } from '@/lib/social/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const withIssues = (posts: SocialPost[], words: string[]) => posts.map((p) => ({ ...p, issues: checkPost(p, words) }));

/** GET — recent weeks (each post annotated with spelling issues) + content bank size. */
export async function GET(request: Request) {
    if (!(await isAuthorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const [weeks, bank, settings] = await Promise.all([
        adminClient.fetch<SocialWeek[]>(`*[_type == "socialWeek"] | order(weekOf desc)[0...8]{ _id, weekOf, generatedAt, posts }`),
        adminClient.fetch(`{ "total": count(*[_type == "socialContent"]), "active": count(*[_type == "socialContent" && active != false]),
            "fresh": count(*[_type == "socialContent" && active != false && !defined(lastUsed)]) }`),
        getSettings(adminClient),
    ]);
    return NextResponse.json({ weeks: weeks.map((w) => ({ ...w, posts: withIssues(w.posts, settings.customWords) })), bank });
}

/**
 * PATCH { weekId, postKey, post }    — save edits / approve / unapprove one post
 * PATCH { weekId, approveAll: true }  — approve every post with clean spelling
 * Approval is refused while a post has spelling issues.
 */
export async function PATCH(request: Request) {
    if (!(await isAuthorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = (await request.json()) as { weekId: string; postKey?: string; post?: Partial<SocialPost>; approveAll?: boolean; verifiedBy?: string };
    const [settings, week] = await Promise.all([
        getSettings(adminClient),
        adminClient.fetch<{ posts: SocialPost[] } | null>(`*[_id == $id][0]{ posts }`, { id: body.weekId }),
    ]);
    if (!week) return NextResponse.json({ error: 'Week not found' }, { status: 404 });

    const verifierName = body.verifiedBy || body.post?.verifiedBy || settings.defaultVerifier || 'Sean Hofherr';
    const nowIso = new Date().toISOString();

    let refused: string | null = null;
    const posts = week.posts.map((p) => {
        if (p.status === 'posted') return p;
        if (body.approveAll) {
            return checkPost(p, settings.customWords).length
                ? p
                : { ...p, approved: true, verifiedBy: verifierName, verifiedAt: nowIso, status: 'approved' as const };
        }
        if (p._key !== body.postKey || !body.post) return p;
        const { slides, caption, captionX, hashtags, approved, scheduledFor } = body.post;
        const next: SocialPost = {
            ...p,
            ...(slides ? { slides } : {}),
            ...(caption !== undefined ? { caption } : {}),
            ...(captionX !== undefined ? { captionX } : {}),
            ...(hashtags !== undefined ? { hashtags } : {}),
            ...(scheduledFor !== undefined ? { scheduledFor } : {}),
            version: (p.version ?? 1) + (slides ? 1 : 0),
        };
        if (approved === true) {
            if (checkPost(next, settings.customWords).length) { refused = 'Fix the spelling issues before approving.'; return next; }
            return { ...next, approved: true, verifiedBy: verifierName, verifiedAt: nowIso, status: 'approved' as const };
        }
        if (approved === false) return { ...next, approved: false, verifiedBy: undefined, verifiedAt: undefined, status: 'draft' as const };
        // Editing an approved post keeps it approved only if it's still clean.
        if (next.approved && checkPost(next, settings.customWords).length) return { ...next, approved: false, status: 'draft' as const };
        return next;
    });
    await adminClient.patch(body.weekId).set({ posts }).commit();
    return NextResponse.json({ ok: !refused, error: refused, posts: withIssues(posts, settings.customWords) }, { status: refused ? 422 : 200 });
}

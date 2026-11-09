import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { isAuthorized } from '@/lib/social/auth';
import { renderSlide } from '@/lib/social/render';
import { verifyImage } from '@/lib/social/sign';
import type { SocialPost } from '@/lib/social/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/social/image?week=&post=&slide=&v=&format=portrait|landscape[&download=1][&sig=]
 * Admin session OR a valid signature (used by Instagram/Facebook/X to fetch the image).
 */
export async function GET(request: Request) {
    const url = new URL(request.url);
    const weekId = url.searchParams.get('week') ?? '';
    const postKey = url.searchParams.get('post') ?? '';
    const n = Number(url.searchParams.get('slide') ?? 0);
    const v = Number(url.searchParams.get('v') ?? 1);
    const format = url.searchParams.get('format') === 'landscape' ? 'landscape' : 'portrait';

    const signed = verifyImage(url.searchParams.get('sig'), weekId, postKey, n, v, format);
    if (!signed && !(await isAuthorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const week = await adminClient.fetch<{ weekOf: string; posts: SocialPost[] } | null>(`*[_id == $id][0]{ weekOf, posts }`, { id: weekId });
    const post = week?.posts.find((p) => p._key === postKey);
    const slide = post?.slides?.[n];
    if (!week || !post || !slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const rendered = await renderSlide(slide, format);
    let body: BodyInit | null = rendered.body;
    const headers = new Headers(rendered.headers);
    if (url.searchParams.get('type') === 'jpg') {
        // Instagram's API only accepts JPEG.
        const sharp = (await import('sharp')).default;
        const jpg = await sharp(Buffer.from(await rendered.arrayBuffer())).flatten({ background: '#1c1614' }).jpeg({ quality: 90 }).toBuffer();
        body = new Uint8Array(jpg);
        headers.set('Content-Type', 'image/jpeg');
    }
    headers.set('Cache-Control', signed ? 'public, max-age=31536000, immutable' : 'private, max-age=31536000, immutable');
    if (url.searchParams.get('download')) {
        const name = `hofherr-${week.weekOf}-${post.day.toLowerCase()}-${post.kind}${format === 'landscape' ? '-x' : ''}-${n + 1}.png`;
        headers.set('Content-Disposition', `attachment; filename="${name}"`);
    }
    return new Response(body, { status: 200, headers });
}

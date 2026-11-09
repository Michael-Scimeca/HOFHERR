import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Signed, public image URLs. Instagram/Facebook fetch images by URL, so the image route must be
 * reachable without a login — but only for exact (week, post, slide, version, format) combos we signed.
 */
const secret = () => process.env.SOCIAL_IMAGE_SECRET || process.env.AUTH_SECRET || 'dev-only-secret';

const payload = (week: string, post: string, slide: number, v: number, format: string) => `${week}|${post}|${slide}|${v}|${format}`;

export function signImage(week: string, post: string, slide: number, v: number, format: string) {
    return createHmac('sha256', secret()).update(payload(week, post, slide, v, format)).digest('hex').slice(0, 32);
}

export function verifyImage(sig: string | null, week: string, post: string, slide: number, v: number, format: string) {
    if (!sig) return false;
    const want = Buffer.from(signImage(week, post, slide, v, format));
    const got = Buffer.from(sig);
    return want.length === got.length && timingSafeEqual(want, got);
}

export function siteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL || process.env.AUTH_URL || 'http://localhost:2000').replace(/\/$/, '');
}

export function publicImageUrl(week: string, post: string, slide: number, v: number, format: 'portrait' | 'landscape') {
    const sig = signImage(week, post, slide, v, format);
    return `${siteUrl()}/api/social/image?week=${encodeURIComponent(week)}&post=${post}&slide=${slide}&v=${v}&format=${format}&sig=${sig}`;
}

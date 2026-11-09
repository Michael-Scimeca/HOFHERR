import { createHmac, randomBytes } from 'node:crypto';
import type { SanityClient } from 'next-sanity';
import { getSettings } from './plan';
import { notifyNeedsApproval } from './notify';
import { checkPost } from './spell';
import { publicImageUrl } from './sign';
import { renderSlide } from './render';
import type { Platform, PublishResult, SocialPost, SocialSettings, SocialWeek } from './types';

/**
 * Publishing to Facebook Page, Instagram Business and X.
 * Each platform runs in DRY-RUN mode until its credentials are set, so the whole flow can be
 * tested end-to-end before connecting real accounts.
 *
 *   Facebook:  META_PAGE_ID, META_PAGE_ACCESS_TOKEN
 *   Instagram: META_IG_USER_ID (+ META_PAGE_ACCESS_TOKEN)
 *   X:         X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
 */

const GRAPH = 'https://graph.facebook.com/v21.0';
const key = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

const fullCaption = (p: SocialPost) => `${p.caption}\n\n${p.hashtags}`.trim();
const imgUrls = (w: SocialWeek, p: SocialPost, format: 'portrait' | 'landscape', jpg = false) =>
    p.slides.map((_, i) => publicImageUrl(w._id, p._key, i, p.version ?? 1, format) + (jpg ? '&type=jpg' : ''));

async function graph(path: string, params: Record<string, string>) {
    const res = await fetch(`${GRAPH}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(params),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error?.message ?? `Graph API ${res.status}`);
    return data as { id: string; post_id?: string };
}

/* ── Facebook Page ─────────────────────────────────────── */
async function postFacebook(w: SocialWeek, p: SocialPost): Promise<PublishResult> {
    const page = process.env.META_PAGE_ID;
    const token = process.env.META_PAGE_ACCESS_TOKEN;
    if (!page || !token) return { _key: key(), platform: 'facebook', ok: true, dryRun: true, at: now() };
    const urls = imgUrls(w, p, 'portrait');
    if (urls.length === 1) {
        const r = await graph(`${page}/photos`, { url: urls[0], caption: fullCaption(p), access_token: token });
        return { _key: key(), platform: 'facebook', ok: true, id: r.post_id ?? r.id, url: `https://www.facebook.com/${r.post_id ?? r.id}`, at: now() };
    }
    const ids = await Promise.all(
        urls.map(async (u) => (await graph(`${page}/photos`, { url: u, published: 'false', access_token: token })).id)
    );
    const r = await graph(`${page}/feed`, {
        message: fullCaption(p),
        attached_media: JSON.stringify(ids.map((id) => ({ media_fbid: id }))),
        access_token: token,
    });
    return { _key: key(), platform: 'facebook', ok: true, id: r.id, url: `https://www.facebook.com/${r.id}`, at: now() };
}

async function waitForIgContainer(creation: string, token: string, attemptsLeft = 10): Promise<void> {
    if (attemptsLeft <= 0) return;
    const res = await fetch(`${GRAPH}/${creation}?fields=status_code&access_token=${token}`);
    if (!res.ok) throw new Error(`Instagram container status HTTP ${res.status}`);
    const s = (await res.json()) as { status_code?: string };
    if (s.status_code === 'FINISHED') return;
    if (s.status_code === 'ERROR') throw new Error('Instagram could not process the image');
    await new Promise((r) => setTimeout(r, 2000));
    return waitForIgContainer(creation, token, attemptsLeft - 1);
}

/* ── Instagram (Business account linked to the Page) ───── */
async function postInstagram(w: SocialWeek, p: SocialPost): Promise<PublishResult> {
    const ig = process.env.META_IG_USER_ID;
    const token = process.env.META_PAGE_ACCESS_TOKEN;
    if (!ig || !token) return { _key: key(), platform: 'instagram', ok: true, dryRun: true, at: now() };
    const urls = imgUrls(w, p, 'portrait', true); // Instagram only accepts JPEG
    let creation: string;
    if (urls.length === 1) {
        creation = (await graph(`${ig}/media`, { image_url: urls[0], caption: fullCaption(p), access_token: token })).id;
    } else {
        const children = await Promise.all(
            urls.map(async (u) => (await graph(`${ig}/media`, { image_url: u, is_carousel_item: 'true', access_token: token })).id)
        );
        creation = (await graph(`${ig}/media`, { media_type: 'CAROUSEL', children: children.join(','), caption: fullCaption(p), access_token: token })).id;
    }
    await waitForIgContainer(creation, token);
    const r = await graph(`${ig}/media_publish`, { creation_id: creation, access_token: token });
    return { _key: key(), platform: 'instagram', ok: true, id: r.id, at: now() };
}

/* ── X (OAuth 1.0a user context) ───────────────────────── */
const pct = (s: string) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

function oauthHeader(method: string, url: string, extra: Record<string, string> = {}) {
    const o: Record<string, string> = {
        oauth_consumer_key: process.env.X_API_KEY!,
        oauth_nonce: randomBytes(16).toString('hex'),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: String(Math.floor(Date.now() / 1000)),
        oauth_token: process.env.X_ACCESS_TOKEN!,
        oauth_version: '1.0',
    };
    const all = { ...o, ...extra };
    const base = [method, pct(url), pct(Object.keys(all).sort().map((k) => `${pct(k)}=${pct(all[k])}`).join('&'))].join('&');
    const signingKey = `${pct(process.env.X_API_SECRET!)}&${pct(process.env.X_ACCESS_SECRET!)}`;
    o.oauth_signature = createHmac('sha1', signingKey).update(base).digest('base64');
    return 'OAuth ' + Object.keys(o).sort().map((k) => `${pct(k)}="${pct(o[k])}"`).join(', ');
}

async function postX(w: SocialWeek, p: SocialPost): Promise<PublishResult> {
    const ready = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_SECRET'].every((k) => process.env[k]);
    if (!ready) return { _key: key(), platform: 'x', ok: true, dryRun: true, at: now() };

    const mediaIds = await Promise.all(
        p.slides.slice(0, 4).map(async (slide) => {
            const slideResp = await renderSlide(slide, 'landscape');
            const png = Buffer.from(await slideResp.arrayBuffer());
            const uploadUrl = 'https://upload.twitter.com/1.1/media/upload.json';
            const form = { media_data: png.toString('base64'), media_category: 'tweet_image' };
            const res = await fetch(uploadUrl, {
                method: 'POST',
                headers: { Authorization: oauthHeader('POST', uploadUrl, form), 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.errors?.[0]?.message ?? `X media upload ${res.status}`);
            return data.media_id_string as string;
        })
    );
    const tweetUrl = 'https://api.twitter.com/2/tweets';
    const res = await fetch(tweetUrl, {
        method: 'POST',
        headers: { Authorization: oauthHeader('POST', tweetUrl), 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: p.captionX || p.caption.slice(0, 270), media: { media_ids: mediaIds } }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail ?? data.title ?? `X post ${res.status}`);
    return { _key: key(), platform: 'x', ok: true, id: data.data.id, url: `https://x.com/i/web/status/${data.data.id}`, at: now() };
}

const PUBLISHERS: Record<Platform, (w: SocialWeek, p: SocialPost) => Promise<PublishResult>> = {
    instagram: postInstagram,
    facebook: postFacebook,
    x: postX,
};

/** Publish one post to every enabled platform (skipping ones that already succeeded) and save the outcome. */
export async function publishPost(client: SanityClient, week: SocialWeek, post: SocialPost, settings: SocialSettings) {
    const done = new Set((post.results ?? []).filter((r) => r.ok && !r.dryRun).map((r) => r.platform));
    const pendingPlatforms = settings.platforms.filter((platform) => !done.has(platform));
    const freshResults = await Promise.all(
        pendingPlatforms.map(async (platform): Promise<PublishResult> => {
            try {
                return await PUBLISHERS[platform](week, post);
            } catch (e) {
                return { _key: key(), platform, ok: false, error: (e as Error).message, at: now() };
            }
        })
    );
    const results: PublishResult[] = [...(post.results ?? []).filter((r) => r.ok && !r.dryRun), ...freshResults];
    const status: SocialPost['status'] = results.some((r) => !r.ok) ? 'failed' : 'posted';
    const posts: SocialPost[] = week.posts.map((p) => (p._key === post._key ? { ...p, results, status } : p));
    await client.patch(week._id).set({ posts }).commit();
    return { status, results, posts };
}

/** Run scheduled hourly publish & 24h approval reminders. */
export async function executeScheduledPublish(client: SanityClient) {
    const [settings, weeks] = await Promise.all([
        getSettings(client),
        client.fetch<SocialWeek[]>(`*[_type == "socialWeek"] | order(weekOf desc)[0...2]`),
    ]);
    const nowMs = Date.now();
    const published: string[] = [];
    const reminders: { week: SocialWeek; post: SocialWeek['posts'][number] }[] = [];

    const dueItems: { week: SocialWeek; post: SocialWeek['posts'][number] }[] = [];
    for (const week of weeks) {
        for (const post of week.posts) {
            const due = post.scheduledFor && new Date(post.scheduledFor).getTime() <= nowMs;
            if (due && post.status === 'approved' && post.approved) {
                if (!checkPost(post, settings.customWords).length) {
                    dueItems.push({ week, post });
                }
            }
            const soon = post.scheduledFor && new Date(post.scheduledFor).getTime() - nowMs < 24 * 3600e3 && !due;
            if (soon && !post.approved && !post.notifiedAt) reminders.push({ week, post });
        }
    }

    const publishResults = await Promise.all(
        dueItems.map(async ({ week, post }) => {
            const r = await publishPost(client, week, post, settings);
            return `${post.day} ${post.label}: ${r.status}`;
        })
    );
    published.push(...publishResults);

    if (reminders.length) {
        await notifyNeedsApproval(reminders.map((r) => r.post), settings);
        await Promise.all(
            reminders.map(async ({ week, post }) => {
                const fresh: SocialWeek = await client.fetch(`*[_id == $id][0]`, { id: week._id });
                const posts = fresh.posts.map((p) => (p._key === post._key ? { ...p, notifiedAt: new Date().toISOString() } : p));
                await client.patch(week._id).set({ posts }).commit();
            })
        );
    }

    return { ok: true, published, reminded: reminders.length };
}

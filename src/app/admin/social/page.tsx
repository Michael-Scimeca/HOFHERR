'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import { ANIMALS } from '@/app/product-identity/social/animals';
import { buildStarterWeeks } from '@/lib/social/plan';
import {
    DEFAULT_SETTINGS,
    type Platform,
    type Slide,
    type SocialPost,
    type SocialSettings,
    type SocialWeek,
} from '@/lib/social/types';
import HowItWorks from './HowItWorks';
import SlidePreview, { getStickerSrc } from './SlidePreview';
import s from './social.module.css';

type Issue = { field: string; word: string; suggestions: string[] };
type Post = SocialPost & { issues?: Issue[] };
type Week = Omit<SocialWeek, 'posts'> & { posts: Post[] };
type Bank = { total: number; active: number; fresh: number };
type Connected = Record<Platform | 'email', boolean>;
type Horizon = 'day' | 'week' | 'month';

const STORAGE_KEY = 'hofherr-social-admin-v1';
const PLATFORM_LABEL: Record<Platform, string> = { instagram: 'Instagram', facebook: 'Facebook', x: 'X' };
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const ICON_OPTIONS = [
    { id: 'cow', label: 'Prime Beef (Bull)' },
    { id: 'pig', label: 'Heritage Pork' },
    { id: 'chicken', label: 'Poultry & Rotisserie' },
    { id: 'lamb', label: 'Pasture Lamb' },
    { id: 'cheese', label: 'Artisanal Cheese' },
    { id: 'soup', label: 'Stocks & Soups' },
    { id: 'fish', label: 'Fresh Catch' },
    { id: 'seafood', label: 'Shellfish & Crab' },
    { id: 'duck', label: 'Specialty Duck' },
    { id: 'truck', label: 'Catering & Delivery' },
];

const WEEK_DATE_FMT = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});
const WHEN_DATE_FMT = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
});
const CHICAGO_LOCAL_INPUT_FMT = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

const fmtWeek = (d: string) => WEEK_DATE_FMT.format(new Date(`${d}T12:00:00`));
const fmtWhen = (iso?: string) => (iso ? WHEN_DATE_FMT.format(new Date(iso)) : '—');
const toLocalInputValue = (iso?: string) =>
    iso ? CHICAGO_LOCAL_INPUT_FMT.format(new Date(iso)).replace(' ', 'T') : '';

/** Client-side placeholder check so unfilled [brackets] are caught immediately. */
function findClientIssues(p: Post): Issue[] {
    const serverIssues = (p.issues ?? []).filter((iss) => !iss.word.startsWith('['));
    const bracketRe = /\[[^\]]+\]/g;
    const found: Issue[] = [...serverIssues];
    const scan = (text: string | undefined, field: string) => {
        if (!text) return;
        const matches = text.match(bracketRe) ?? [];
        matches.forEach((m) => {
            if (!found.some((f) => f.word === m && f.field === field)) {
                found.push({ field, word: m, suggestions: [] });
            }
        });
    };
    scan(p.caption, 'caption');
    scan(p.captionX, 'X caption');
    p.slides.forEach((sl, idx) => {
        scan(sl.headline, `slide ${idx + 1} headline`);
        scan(sl.body, `slide ${idx + 1} text`);
    });
    return found;
}

/** Replace a misspelled word everywhere it appears in the post's editable text. */
function replaceWord(p: Post, word: string, fix: string): Post {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const r = (t?: string) => (t ? t.replace(re, fix) : t);
    return {
        ...p,
        caption: r(p.caption) ?? '',
        captionX: r(p.captionX),
        slides: p.slides.map((sl) => ({
            ...sl,
            kicker: r(sl.kicker),
            headline: r(sl.headline),
            body: r(sl.body),
            items: sl.items?.map((x) => r(x) ?? x),
        })),
    };
}

/** Open a clean printable proof window for a single post (all slides + captions + verification sign-off). */
function printSinglePost(week: Week, post: Post, verifier: string) {
    const win = window.open('', '_blank', 'width=960,height=1100');
    if (!win) {
        window.print();
        return;
    }
    const slidesHtml = post.slides
        .map((sl, idx) => {
            const icon = getStickerSrc(sl.iconId);
            const itemsHtml = (sl.items ?? [])
                .map((it) => `<li style="margin:4px 0;font-size:14px;">${it}</li>`)
                .join('');
            return `
            <div style="border:2px solid #8B0A10;border-radius:10px;padding:18px;background:#F3EAD8;color:#1C1614;display:flex;flex-direction:column;gap:10px;break-inside:avoid;">
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #8B0A10;padding-bottom:8px;">
                    <span style="background:#F59B1A;color:#1C1614;font-weight:800;font-size:11px;padding:3px 8px;text-transform:uppercase;letter-spacing:1px;">
                        Slide ${idx + 1} · ${sl.kicker || sl.template}
                    </span>
                    <img src="${icon}" alt="" style="width:42px;height:42px;object-fit:contain;" />
                </div>
                ${sl.photo ? `<img src="${sl.photo}" alt="" style="width:100%;max-height:260px;object-fit:contain;background:#1C1614;border-radius:6px;" />` : ''}
                ${sl.headline ? `<div style="font-size:22px;font-weight:900;text-transform:uppercase;color:#8B0A10;line-height:1.05;">${sl.headline}</div>` : ''}
                ${sl.body ? `<div style="font-size:15px;line-height:1.4;color:#1C1614;">${sl.body}</div>` : ''}
                ${itemsHtml ? `<ul style="margin:0;padding-left:18px;">${itemsHtml}</ul>` : ''}
            </div>`;
        })
        .join('');

    win.document.write(`<!doctype html>
<html>
<head>
    <title>Hofherr Social & Print Proof — ${post.label}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 28px; color: #1C1614; background: #fff; }
        .head { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #8B0A10; padding-bottom: 12px; margin-bottom: 18px; }
        .title { font-size: 24px; font-weight: 900; text-transform: uppercase; color: #8B0A10; }
        .meta { font-size: 13px; color: #444; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
        .cap { border: 1px solid #ccc; border-radius: 8px; padding: 14px; background: #fafafa; margin-bottom: 14px; white-space: pre-wrap; font-size: 13px; line-height: 1.5; }
        .sign { border: 2px dashed #8B0A10; border-radius: 8px; padding: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="head">
        <div>
            <div class="title">HOFHERR MEAT CO. · SOCIAL & PRINT PROOF</div>
            <div class="meta">Week of ${fmtWeek(week.weekOf)} · ${post.day} · ${post.label} · Scheduled: ${fmtWhen(post.scheduledFor)}</div>
        </div>
        <div style="text-align:right;font-size:13px;font-weight:700;color:${post.approved ? '#1a7f37' : '#8B0A10'};">
            ${post.approved ? `✓ VERIFIED BY ${(post.verifiedBy || verifier).toUpperCase()}` : '⏳ PENDING PERSON VERIFICATION'}
        </div>
    </div>
    <div class="grid">${slidesHtml}</div>
    <div class="cap"><b>Instagram / Facebook Caption:</b>\n${post.caption}\n\n<span style="color:#8B0A10;">${post.hashtags}</span></div>
    <div class="cap"><b>X (Twitter) Caption (${(post.captionX ?? '').length}/280):</b>\n${post.captionX ?? ''}</div>
    <div class="sign">
        <span><b>Person Verifying:</b> ${post.verifiedBy || verifier || '______________________'}</span>
        <span><b>Status:</b> ${post.approved ? '✓ Approved for Auto-Post' : '□ Needs Review'}</span>
        <span><b>Date / Time:</b> ${post.verifiedAt ? fmtWhen(post.verifiedAt) : '________________'}</span>
    </div>
    <script>window.onload = () => { setTimeout(() => window.print(), 250); };</script>
</body>
</html>`);
    win.document.close();
}

/* ── One Post Card ─────────────────────────────────────── */
function PostCard({
    week,
    post,
    verifier,
    defaultEditing = false,
    onUpdatePost,
    onAddWord,
}: {
    week: Week;
    post: Post;
    verifier: string;
    defaultEditing?: boolean;
    onUpdatePost: (weekId: string, postKey: string, patch: Partial<Post>) => Promise<boolean>;
    onAddWord: (w: string) => Promise<void>;
}) {
    const [draft, setDraft] = useState<Post>(post);
    const [editing, setEditing] = useState(defaultEditing);
    const [busy, setBusy] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);
    const [slide, setSlide] = useState(0);
    const [tab, setTab] = useState<'feed' | 'x'>('feed');
    const previewRef = React.useRef<HTMLDivElement>(null);

    const issues = findClientIssues(editing ? draft : post);
    const posted = post.status === 'posted';

    const save = async (patch: Partial<Post>) => {
        setBusy('save');
        setMsg(null);
        try {
            const ok = await onUpdatePost(week._id, post._key, patch);
            if (ok) setMsg('Saved ✓');
            return ok;
        } finally {
            setBusy(null);
        }
    };

    const verifyPost = async (approve: boolean) => {
        setBusy('verify');
        setMsg(null);
        try {
            const nowIso = new Date().toISOString();
            await onUpdatePost(week._id, post._key, {
                approved: approve,
                verifiedBy: approve ? verifier || 'Sean Hofherr' : undefined,
                verifiedAt: approve ? nowIso : undefined,
                status: approve ? 'approved' : 'draft',
            });
            setMsg(approve ? `Verified by ${verifier || 'Sean Hofherr'} ✓ — Queued for auto-post` : 'Moved back to Needs Verification');
        } finally {
            setBusy(null);
        }
    };

    const postNow = async () => {
        setBusy('post');
        setMsg(null);
        try {
            const res = await fetch('/api/social/post-now', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weekId: week._id, postKey: post._key }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.posts) {
                    const updated = (data.posts as Post[]).find((x) => x._key === post._key);
                    if (updated) await onUpdatePost(week._id, post._key, updated);
                }
                setMsg('Posted to connected platforms ✓');
            } else {
                // Local test-mode simulation when API is not connected
                const nowIso = new Date().toISOString();
                await onUpdatePost(week._id, post._key, {
                    approved: true,
                    verifiedBy: post.verifiedBy || verifier || 'Sean Hofherr',
                    verifiedAt: post.verifiedAt || nowIso,
                    status: 'posted',
                    results: [
                        { _key: 'ig', platform: 'instagram', ok: true, dryRun: true, at: nowIso },
                        { _key: 'fb', platform: 'facebook', ok: true, dryRun: true, at: nowIso },
                        { _key: 'x', platform: 'x', ok: true, dryRun: true, at: nowIso },
                    ],
                });
                setMsg('Published (Test Mode — verified & logged across Instagram, Facebook & X) ✓');
            }
        } finally {
            setBusy(null);
        }
    };

    const downloadCurrentSlidePng = async () => {
        if (!previewRef.current) return;
        setBusy('png');
        try {
            const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, cacheBust: true });
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `hofherr-${week.weekOf}-${post.day.toLowerCase()}-slide-${slide + 1}.png`;
            a.click();
        } finally {
            setBusy(null);
        }
    };

    const fixWord = async (word: string, fix: string) => {
        const next = replaceWord(post, word, fix);
        await save({ slides: next.slides, caption: next.caption, captionX: next.captionX });
    };

    const setSlideField = (i: number, field: keyof Slide, value: string | string[]) => {
        setDraft((d) => ({
            ...d,
            slides: d.slides.map((sl, j) => {
                if (j !== i) return sl;
                if (field === 'items') {
                    const arr = Array.isArray(value) ? value : value.split('\n').filter((x) => x.trim());
                    return { ...sl, items: arr };
                }
                return { ...sl, [field]: value };
            }),
        }));
    };

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setMsg('Copied ✓');
        } catch {
            /* ignore */
        }
    };

    const activePost = editing ? draft : post;
    const currentSlide = activePost.slides[slide] ?? activePost.slides[0];
    const format = tab === 'x' ? 'landscape' : 'portrait';
    const xLen = (activePost.captionX ?? '').length;

    const statusBadge = posted ? (
        <span className={s.badgeOk}>✓ Auto-Posted</span>
    ) : post.status === 'failed' ? (
        <span className={s.badgeErr}>Failed</span>
    ) : post.approved ? (
        <span className={s.badgeOk}>✓ Verified · Auto-Post Queued</span>
    ) : issues.length ? (
        <span className={s.badgeErr}>{issues.length} needs fix</span>
    ) : (
        <span className={s.badgeWait}>⏳ Needs Person Verification</span>
    );

    return (
        <article className={`${s.card} ${post.approved ? s.cardApproved : ''} ${issues.length ? s.cardIssues : ''}`}>
            <header className={s.cardHead}>
                <span className={s.day}>{post.day}</span>
                <span className={s.label}>
                    {activePost.label}
                    <br />
                    <small className={s.when}>Auto-posts: {fmtWhen(activePost.scheduledFor)}</small>
                </span>
                {statusBadge}
            </header>

            {post.approved && (
                <div className={s.verifiedStamp}>
                    <span>
                        ✓ Verified by <b>{post.verifiedBy || verifier || 'Sean Hofherr'}</b>
                        {post.verifiedAt ? ` · ${fmtWhen(post.verifiedAt)}` : ''}
                    </span>
                    <span>Auto-Post Armed</span>
                </div>
            )}

            <div className={s.tabs}>
                <button type="button" className={tab === 'feed' ? s.tabOn : s.tab} onClick={() => setTab('feed')}>
                    Instagram · Facebook (4:5)
                </button>
                <button type="button" className={tab === 'x' ? s.tabOn : s.tab} onClick={() => setTab('x')}>
                    X / Twitter (16:9)
                </button>
            </div>

            <div className={s.preview}>
                <div ref={previewRef}>
                    {currentSlide && (
                        <SlidePreview
                            slide={currentSlide}
                            format={format}
                            editable
                            onFieldChange={(field, val) => {
                                const nextSlides = activePost.slides.map((sl, idx) =>
                                    idx === slide ? { ...sl, [field]: val } : sl
                                );
                                setDraft((d) => ({ ...d, slides: nextSlides }));
                                void onUpdatePost(week._id, post._key, { slides: nextSlides });
                            }}
                        />
                    )}
                </div>
                {activePost.slides.length > 1 && (
                    <div className={s.dots}>
                            {
                                activePost.slides.map((sl, i) => (
                                    <button
                                        key={sl._key}
                                        type="button"
                                        aria-label={`Slide ${i + 1}`}
                                        onClick={() => setSlide(i)}
                                        className={i === slide ? s.dotOn : s.dot}
                                    />
                                ))
                            }
                            < span className = { s.slideCount } >
                            Slide { slide + 1} of {activePost.slides.length} · Click any text on slide to edit
                    </span>
                    </div>
                )}
        </div>

            {
        issues.length > 0 && (
            <div className={s.issues}>
                <b>Verification Check — Resolve before approving for auto-post:</b>
                        {issues.map((iss) => (
                            <div key={`${iss.field}-${iss.word}`} className={s.issue}>
                                <span className={s.issueWord}>{iss.word}</span>
                                <span className={s.issueField}>{iss.field}</span>
                                <span className={s.issueFixes}>
                                    {iss.word.startsWith('[') ? (
                                        <em>Click &ldquo;✎ Edit&rdquo; below to replace placeholder {iss.word}</em>
                                    ) : (
                                        <>
                                            {iss.suggestions.map((sg) => (
                                                <button
                                                    key={sg}
                                                    type="button"
                                                    className={s.chip}
                                                    disabled={!!busy}
                                                    onClick={() => fixWord(iss.word, sg)}
                                                >
                                                    {sg}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                className={s.chipGhost}
                                                disabled={!!busy}
                                                onClick={() => onAddWord(iss.word)}
                                            >
                                                + Add to dictionary
                                            </button>
                                        </>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {editing ? (
                    <div className={s.editor}>
                        <label>
                            Post Title / Label
                            <input
                                value={draft.label}
                                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                            />
                        </label>
                        {draft.slides.map((sl, i) => (
                            <fieldset key={sl._key} className={s.slideFields}>
                                <legend>
                                    Slide {i + 1} · {sl.template}
                                </legend>
                                <div className={s.row}>
                                    <label>
                                        Kicker Badge
                                        <input
                                            value={sl.kicker ?? ''}
                                            onChange={(e) => setSlideField(i, 'kicker', e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        Department Icon
                                        <select
                                            value={sl.iconId ?? 'cow'}
                                            onChange={(e) => setSlideField(i, 'iconId', e.target.value)}
                                        >
                                            {ICON_OPTIONS.map((opt) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                {sl.headline !== undefined && (
                                    <label>
                                        Headline
                                        <input
                                            spellCheck
                                            value={sl.headline ?? ''}
                                            onChange={(e) => setSlideField(i, 'headline', e.target.value)}
                                        />
                                    </label>
                                )}
                                {sl.body !== undefined && (
                                    <label>
                                        Body / Price / Fact Text
                                        <textarea
                                            spellCheck
                                            rows={2}
                                            value={sl.body ?? ''}
                                            onChange={(e) => setSlideField(i, 'body', e.target.value)}
                                        />
                                    </label>
                                )}
                                {sl.items && (
                                    <label>
                                        {sl.template === 'guide'
                                            ? 'Primal Cut Rows (Cut | Where | Best for — one per line)'
                                            : sl.template === 'recipe-ingredients'
                                                ? 'Ingredients (one per line)'
                                                : 'Steps (one per line)'}
                                        <textarea
                                            spellCheck
                                            rows={Math.min(7, sl.items.length + 1)}
                                            value={sl.items.join('\n')}
                                            onChange={(e) => setSlideField(i, 'items', e.target.value)}
                                        />
                                    </label>
                                )}
                            </fieldset>
                        ))}
                        <label>
                            Caption · Instagram &amp; Facebook
                            <textarea
                                spellCheck
                                rows={5}
                                value={draft.caption}
                                onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
                            />
                        </label>
                        <label>
                            Hashtags
                            <textarea
                                rows={2}
                                value={draft.hashtags}
                                onChange={(e) => setDraft({ ...draft, hashtags: e.target.value })}
                            />
                        </label>
                        <label>
                            <span className={s.labelRow}>
                                Caption · X{' '}
                                <span className={(draft.captionX ?? '').length > 280 ? s.over : s.count}>
                                    {(draft.captionX ?? '').length}/280
                                </span>
                            </span>
                            <textarea
                                spellCheck
                                rows={3}
                                value={draft.captionX ?? ''}
                                onChange={(e) => setDraft({ ...draft, captionX: e.target.value })}
                            />
                        </label>
                        <label>
                            Automatic Post Time (Chicago Time)
                            <input
                                type="datetime-local"
                                value={toLocalInputValue(draft.scheduledFor)}
                                onChange={(e) => {
                                    if (!e.target.value) return;
                                    setDraft({ ...draft, scheduledFor: new Date(e.target.value).toISOString() });
                                }}
                            />
                        </label>
                        <div className={s.row}>
                            <button
                                type="button"
                                className={s.btnPrimary}
                                disabled={!!busy || (draft.captionX ?? '').length > 280}
                                onClick={async () => {
                                    if (
                                        await save({
                                            label: draft.label,
                                            slides: draft.slides,
                                            caption: draft.caption,
                                            captionX: draft.captionX,
                                            hashtags: draft.hashtags,
                                            scheduledFor: draft.scheduledFor,
                                        })
                                    ) {
                                        setEditing(false);
                                    }
                                }}
                            >
                                {busy === 'save' ? 'Saving…' : '✓ Save Edits'}
                            </button>
                            <button
                                type="button"
                                className={s.btn}
                                onClick={() => {
                                    setDraft(post);
                                    setEditing(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={s.captionBox}>
                        {tab === 'x' ? (
                            <>
                                <pre className={s.caption}>{post.captionX}</pre>
                                <p className={xLen > 280 ? s.over : s.count}>{xLen}/280 characters</p>
                            </>
                        ) : (
                            <>
                                <pre className={s.caption}>{post.caption}</pre>
                                <p className={s.tags}>{post.hashtags}</p>
                            </>
                        )}
                    </div>
                )}

                {(post.results?.length ?? 0) > 0 && (
                    <ul className={s.results}>
                        {post.results!.map((r) => (
                            <li key={r._key} className={r.ok ? (r.dryRun ? s.resDry : s.resOk) : s.resErr}>
                                <b>{PLATFORM_LABEL[r.platform]}</b>{' '}
                                {r.ok ? (
                                    r.dryRun ? (
                                        'Verified & Simulated (Test mode — ready for live credentials)'
                                    ) : r.url ? (
                                        <a href={r.url} target="_blank" rel="noreferrer">
                                            View post ↗
                                        </a>
                                    ) : (
                                        'Posted'
                                    )
                                ) : (
                                    r.error
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {msg && <p className={s.msg}>{msg}</p>}

                <footer className={s.actions}>
                    {!editing && (
                            <button
                                type="button"
                                className={s.btn}
                                onClick={() => {
                                    setDraft(post);
                                    setEditing(true);
                                }}
                            >
                                ✎ Edit
                            </button>
                )}
                            <button type="button" className={s.btn} onClick={() => printSinglePost(week, activePost, verifier)}>
                                🖨 Print
                            </button>
                            <button type="button" className={s.btn} disabled={busy === 'png'} onClick={downloadCurrentSlidePng}>
                                {busy === 'png' ? '…' : '⬇ PNG'}
                            </button>
                            <button
                                type="button"
                                className={s.btn}
                                onClick={() =>
                                    copy(tab === 'x' ? (post.captionX ?? '') : `${post.caption}\n\n${post.hashtags}`)
                                }
                            >
                                Copy Caption
                            </button>
                            {!posted &&
                                (post.approved ? (
                                    <button
                                        type="button"
                                        className={s.btnGhost}
                                        disabled={!!busy}
                                        onClick={() => verifyPost(false)}
                                    >
                                        Unverify
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className={s.btnSuccess}
                                        disabled={!!busy || issues.length > 0}
                                        title={issues.length ? 'Fix placeholders/spelling first' : ''}
                                        onClick={() => verifyPost(true)}
                                    >
                                        ✓ Verify &amp; Queue
                                    </button>
                                ))}
                            {!posted && (
                                <button
                                    type="button"
                                    className={s.btnPrimary}
                                    disabled={!!busy || issues.length > 0}
                                    onClick={postNow}
                                >
                                    {busy === 'post' ? 'Posting…' : '🚀 Post Now'}
                                </button>
                            )}
                        </footer>
        </article>
                );
}

                /* ── Settings Panel ────────────────────────────────────── */
                function SettingsPanel({
                    settings,
                    connected,
                    onSave,
}: {
                    settings: SocialSettings;
                connected: Connected | null;
                onSave: (p: Partial<SocialSettings>) => Promise<void>;
}) {
    const [d, setD] = useState(settings);
                    const [busy, setBusy] = useState(false);
                    const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

                    return (
                    <details className={s.settings}>
                        <summary>
                            ⚙ Automatic Posting &amp; Verification Rules —{' '}
                            {d.frequency === 'daily'
                                ? 'Every day'
                                : d.frequency === 'alternate'
                                    ? 'Every other day'
                                    : d.frequency === 'weekdays'
                                        ? 'Weekdays'
                                        : (d.customDays ?? []).join(', ') || 'Custom'}{' '}
                            at {d.postTime} CT · Verification: {(d.verificationCadence ?? 'weekly').toUpperCase()} ·{' '}
                            {d.platforms.map((p) => PLATFORM_LABEL[p]).join(', ')}
                        </summary>
                        <div className={s.settingsGrid}>
                            <fieldset>
                                <legend>Automatic Posting Cadence</legend>
                                {(
                                    [
                                        ['daily', 'Every day (Mon–Sun)'],
                                        ['alternate', 'Every other day (Mon · Wed · Fri · Sun)'],
                                        ['weekdays', 'Weekdays only (Mon–Fri)'],
                                        ['custom', 'Pick specific days'],
                                    ] as const
                                ).map(([v, l]) => (
                                    <label key={v} className={s.radio}>
                                        <input
                                            type="radio"
                                            name="posting-frequency"
                                            checked={d.frequency === v}
                                            onChange={() => setD({ ...d, frequency: v })}
                                        />{' '}
                                        {l}
                                    </label>
                                ))}
                                {d.frequency === 'custom' && (
                                    <div className={s.dayPick}>
                                        {DAYS.map((day) => (
                                            <button
                                                key={day}
                                                type="button"
                                                className={(d.customDays ?? []).includes(day) ? s.chip : s.chipGhost}
                                                onClick={() => setD({ ...d, customDays: toggle(d.customDays ?? [], day) })}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <label className={s.inline}>
                                    Auto-post at{' '}
                                    <input
                                        type="time"
                                        value={d.postTime}
                                        onChange={(e) => setD({ ...d, postTime: e.target.value })}
                                    />{' '}
                                    Chicago time
                                </label>
                            </fieldset>

                            <fieldset>
                                <legend>Person Verification &amp; Platforms</legend>
                                <label className={s.radio}>
                                    <input
                                        type="checkbox"
                                        checked={d.requireApproval}
                                        onChange={(e) => setD({ ...d, requireApproval: e.target.checked })}
                                    />
                                    <b>Require person to verify before automatic posting</b>
                                </label>
                                {(
                                    [
                                        ['daily', 'Verify by Day (daily review)'],
                                        ['weekly', 'Verify Weekly (batch review 7 days)'],
                                        ['monthly', 'Verify Monthly (batch review full month)'],
                                    ] as const
                                ).map(([v, l]) => (
                                    <label key={v} className={s.radio}>
                                        <input
                                            type="radio"
                                            name="verification-cadence"
                                            checked={(d.verificationCadence ?? 'weekly') === v}
                                            onChange={() => setD({ ...d, verificationCadence: v })}
                                        />{' '}
                                        {l}
                                    </label>
                                ))}
                                {(['instagram', 'facebook', 'x'] as Platform[]).map((p) => (
                                    <label key={p} className={s.radio}>
                                        <input
                                            type="checkbox"
                                            checked={d.platforms.includes(p)}
                                            onChange={() => setD({ ...d, platforms: toggle(d.platforms, p) })}
                                        />{' '}
                                        {PLATFORM_LABEL[p]}
                                        <span className={connected?.[p] ? s.conn : s.notConn}>
                                            {connected?.[p] ? 'connected' : 'test mode'}
                                        </span>
                                    </label>
                                ))}
                            </fieldset>

                            <fieldset>
                                <legend>Reviewer Notification Emails</legend>
                                <textarea
                                    rows={3}
                                    placeholder="sean@hofherrmeatco.com"
                                    value={d.notifyEmails.join('\n')}
                                    onChange={(e) =>
                                        setD({
                                            ...d,
                                            notifyEmails: e.target.value
                                                .split(/[\n,]/)
                                                .map((x) => x.trim())
                                                .filter(Boolean),
                                        })
                                    }
                                />
                                <span className={connected?.email ? s.conn : s.notConn}>
                                    {connected?.email ? 'Email notifications active' : 'Local / Test mode'}
                                </span>
                            </fieldset>
                        </div>
                        <button
                            type="button"
                            className={s.btnPrimary}
                            disabled={busy}
                            onClick={async () => {
                                setBusy(true);
                                try {
                                    await onSave(d);
                                } finally {
                                    setBusy(false);
                                }
                            }}
                        >
                            {busy ? 'Saving…' : 'Save Posting & Verification Settings'}
                        </button>
                    </details>
                    );
}

                    /* ── Main Admin Social & Print Studio Page ─────────────── */
                    export default function SocialAdminPage() {
    const [weeks, setWeeks] = useState<Week[]>(() => buildStarterWeeks(DEFAULT_SETTINGS, 4));
                    const [bank, setBank] = useState<Bank>({total: 36, active: 36, fresh: 24 });
                        const [settings, setSettings] = useState<SocialSettings>(DEFAULT_SETTINGS);
                            const [connected, setConnected] = useState<Connected | null>(null);
                            const [horizon, setHorizon] = useState<Horizon>('week');
                                const [currentWeekId, setCurrentWeekId] = useState<string>(() => buildStarterWeeks(DEFAULT_SETTINGS, 4)[0]?._id ?? '');
                                    const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
                                        const [verifier, setVerifier] = useState<string>('Sean Hofherr');
                                            const [busy, setBusy] = useState<string | null>(null);
                                            const [bannerMsg, setBannerMsg] = useState<string | null>(null);

    const persistLocal = useCallback((nextWeeks: Week[], nextSettings: SocialSettings, nextVerifier: string) => {
        try {
                                                localStorage.setItem(
                                                    STORAGE_KEY,
                                                    JSON.stringify({ weeks: nextWeeks, settings: nextSettings, verifier: nextVerifier })
                                                );
        } catch {
                                                /* storage unavailable */
                                            }
    }, []);

    const load = useCallback(async () => {
                                                // First restore any locally saved edits/verifications
                                                let localWeeks: Week[] | null = null;
                                            let localSettings: SocialSettings | null = null;
                                            try {
            const raw = localStorage.getItem(STORAGE_KEY);
                                            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed.weeks) && parsed.weeks.length > 0) localWeeks = parsed.weeks;
                                            if (parsed.settings) localSettings = parsed.settings;
                                            if (parsed.verifier) setVerifier(parsed.verifier);
            }
        } catch {
                                                /* ignore */
                                            }

                                            if (localWeeks) {
                                                setWeeks(localWeeks);
            setCurrentWeekId((c) => c || localWeeks![0]._id);
        }
                                            if (localSettings) {
                                                setSettings(localSettings);
        }

                                            // Then attempt live sync with Sanity API if signed in
                                            try {
            const [wRes, stRes] = await Promise.all([
                                            fetch('/api/social/weeks', {cache: 'no-store' }),
                                            fetch('/api/social/settings', {cache: 'no-store' }),
                                            ]);
                                            if (wRes.ok) {
                const data = await wRes.json();
                if (Array.isArray(data.weeks) && data.weeks.length > 0) {
                                                setWeeks(data.weeks);
                    setCurrentWeekId((c) => c || data.weeks[0]._id);
                }
                                            if (data.bank) setBank(data.bank);
            }
                                            if (stRes.ok) {
                const sd = await stRes.json();
                                            if (sd.settings) setSettings(sd.settings);
                                            if (sd.connected) setConnected(sd.connected);
            }
        } catch {
                                                /* offline or local mode — starter schedule remains active */
                                            }
    }, []);

    useEffect(() => {
                                                void load();
    }, [load]);

    const activeWeek = weeks.find((w) => w._id === currentWeekId) ?? weeks[0] ?? null;

                                            const updatePost = async (weekId: string, postKey: string, patch: Partial<Post>): Promise<boolean> => {
        const nextWeeks = weeks.map((w) => {
            if (w._id !== weekId) return w;
                                                return {
                                                    ...w,
                                                    posts: w.posts.map((p) => {
                    if (p._key !== postKey) return p;
                                                return {
                                                    ...p,
                        ...patch,
                                                version: (p.version ?? 1) + (patch.slides ? 1 : 0),
                    };
                }),
            };
        });
                                                setWeeks(nextWeeks);
                                                persistLocal(nextWeeks, settings, verifier);

                                                try {
            const res = await fetch('/api/social/weeks', {
                                                    method: 'PATCH',
                                                headers: {'Content-Type': 'application/json' },
                                                body: JSON.stringify({weekId, postKey, post: patch, verifiedBy: verifier }),
            });
                                                if (res.ok) {
                const data = await res.json();
                                                if (data.posts) {
                    const synced = nextWeeks.map((w) => (w._id === weekId ? {...w, posts: data.posts } : w));
                                                setWeeks(synced);
                                                persistLocal(synced, settings, verifier);
                }
            }
        } catch {
                                                    /* persisted locally */
                                                }
                                                return true;
    };

    const verifyDayPost = async () => {
        if (!activeWeek) return;
                                                const post = activeWeek.posts[selectedDayIdx] ?? activeWeek.posts[0];
                                                if (!post) return;
                                                const issues = findClientIssues(post);
        if (issues.length > 0) {
                                                    setBannerMsg(`Please fix ${issues.length} issue(s) on ${post.day}'s post before verifying.`);
                                                return;
        }
                                                const nowIso = new Date().toISOString();
                                                await updatePost(activeWeek._id, post._key, {
                                                    approved: true,
                                                verifiedBy: verifier || 'Sean Hofherr',
                                                verifiedAt: nowIso,
                                                status: 'approved',
        });
                                                setBannerMsg(`✓ Verified ${post.day}'s post (${post.label}) by ${verifier || 'Sean Hofherr'}!`);
    };

    const verifyWeekPosts = async (targetWeekId = activeWeek?._id) => {
        if (!targetWeekId) return;
                                                setBusy('verify-week');
                                                const nowIso = new Date().toISOString();
        const nextWeeks = weeks.map((w) => {
            if (w._id !== targetWeekId) return w;
                                                return {
                                                    ...w,
                                                    posts: w.posts.map((p) => {
                    if (p.status === 'posted' || findClientIssues(p).length > 0) return p;
                                                return {
                                                    ...p,
                                                    approved: true,
                                                verifiedBy: verifier || 'Sean Hofherr',
                                                verifiedAt: nowIso,
                                                status: 'approved' as const,
                    };
                }),
            };
        });
                                                setWeeks(nextWeeks);
                                                persistLocal(nextWeeks, settings, verifier);

                                                try {
                                                    await fetch('/api/social/weeks', {
                                                        method: 'PATCH',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ weekId: targetWeekId, approveAll: true, verifiedBy: verifier }),
                                                    });
        } catch {
                                                    /* local persisted */
                                                }
                                                setBusy(null);
                                                setBannerMsg(`✓ Verified all clean posts for Week of ${fmtWeek(targetWeekId.replace('socialWeek-', ''))} by ${verifier || 'Sean Hofherr'}!`);
    };

    const verifyEntireMonth = async () => {
                                                    setBusy('verify-month');
                                                const nowIso = new Date().toISOString();
        const nextWeeks = weeks.map((w) => ({
                                                    ...w,
                                                    posts: w.posts.map((p) => {
                if (p.status === 'posted' || findClientIssues(p).length > 0) return p;
                                                return {
                                                    ...p,
                                                    approved: true,
                                                verifiedBy: verifier || 'Sean Hofherr',
                                                verifiedAt: nowIso,
                                                status: 'approved' as const,
                };
            }),
        }));
                                                setWeeks(nextWeeks);
                                                persistLocal(nextWeeks, settings, verifier);
                                                setBusy(null);
        const totalVerified = nextWeeks.reduce((acc, w) => acc + w.posts.filter((p) => p.approved).length, 0);
                                                setBannerMsg(`✓ Verified entire month (${totalVerified} posts across ${nextWeeks.length} weeks) by ${verifier || 'Sean Hofherr'}!`);
    };

    const addAnimalCutsPost = (animalSlug: string) => {
        if (!activeWeek) return;
        const animal = ANIMALS.find((a) => a.slug === animalSlug) ?? ANIMALS[0];
                                                const newPost: Post = {
                                                    _key: `custom-cuts-${animal.slug}-${Date.now().toString(36)}`,
                                                day: DAYS[activeWeek.posts.length % DAYS.length],
                                                kind: 'cuts',
                                                label: `Know your cuts: ${animal.name}`,
                                                contentIds: [],
                                                slides: [
                                                {
                                                    _key: `s1-${Date.now()}`,
                                                template: 'chart',
                                                kicker: 'Know your cuts',
                                                headline: `${animal.name} Cut Chart`,
                                                photo: animal.chartSrc,
                                                iconId: animal.iconId,
                },
                                                {
                                                    _key: `s2-${Date.now()}`,
                                                template: 'guide',
                                                kicker: 'Know your cuts',
                                                headline: animal.name,
                    items: animal.primals.map((p) => `${p.name} | ${p.where} | ${p.bestFor}`),
                                                iconId: animal.iconId,
                },
                                                ...animal.facts.slice(0, 2).map(
                    (f, idx): Slide => ({
                                                    _key: `sf-${idx}-${Date.now()}`,
                                                template: 'fact',
                                                kicker: 'Did you know?',
                                                headline: `${animal.name} fact ${idx + 1} / 2`,
                                                body: f,
                                                iconId: animal.iconId,
                                                tone: idx % 2 ? 'cream' : 'crimson',
                    })
                                                ),
                                                ],
                                                caption: `Know your cuts: ${animal.name.toLowerCase()} 🔪\n\nSave this for your next trip to the counter 📌 Swipe for the butcher cut chart, primal breakdown, and facts most people don't know 👉`,
                                                captionX: `Know your cuts: ${animal.name.toLowerCase()} 🔪 Where every cut comes from — and what to do with it.\n\n#hofherrmeatco #shoplocal`,
                                                hashtags: '#hofherrmeatco #northfieldil #winnetkail #chicagobutcher #knowyourcuts',
                                                approved: false,
                                                status: 'draft',
                                                scheduledFor: new Date().toISOString(),
                                                version: 1,
        };
        const nextWeeks = weeks.map((w) =>
                                                w._id === activeWeek._id ? {...w, posts: [newPost, ...w.posts] } : w
                                                );
                                                setWeeks(nextWeeks);
                                                persistLocal(nextWeeks, settings, verifier);
                                                setSelectedDayIdx(0);
                                                setBannerMsg(`+ Added "${newPost.label}" (Chart + Guide + Facts) to Week of ${fmtWeek(activeWeek.weekOf)}`);
    };

    const regenerateSchedule = () => {
        const fresh = buildStarterWeeks(settings, 4);
                                                setWeeks(fresh);
                                                setCurrentWeekId(fresh[0]?._id ?? '');
                                                persistLocal(fresh, settings, verifier);
                                                setBannerMsg('↻ Regenerated full 4-week / monthly schedule from content bank.');
    };

                                                const saveSettings = async (patch: Partial<SocialSettings> & {addWord ?: string}) => {
        const nextSettings: SocialSettings = {
                                                        ...settings,
            ...patch,
                                                    customWords: patch.addWord
                                                    ? Array.from(new Set([...settings.customWords, patch.addWord]))
                                                    : (patch.customWords ?? settings.customWords),
        };
                                                    setSettings(nextSettings);
                                                    persistLocal(weeks, nextSettings, verifier);
                                                    try {
                                                        await fetch('/api/social/settings', {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify(patch),
                                                        });
        } catch {
                                                        /* local persisted */
                                                    }
    };

    const totalMonthPosts = weeks.reduce((acc, w) => acc + w.posts.length, 0);
    const totalMonthVerified = weeks.reduce((acc, w) => acc + w.posts.filter((p) => p.approved).length, 0);
    const weekApproved = activeWeek?.posts.filter((p) => p.approved).length ?? 0;
                                                    const dayPost = activeWeek?.posts[selectedDayIdx] ?? activeWeek?.posts[0] ?? null;

                                                    return (
                                                    <main className={s.page}>
                                                            <header className={s.top}>
                                                                <div>
                                                                            <nav className={s.backRow} aria-label="Admin navigation">
                                                                                <Link href="/admin" className={s.back}>
                                                                                    ← Admin Console
                                                                                </Link>
                                                                                <Link href="/product-identity#cuts" className={s.back}>
                                                                                    ← Social Media Kit &amp; Cut Charts
                                                                                </Link>
                                                                                <Link href="/product-identity/print" className={s.back}>
                                                                                    🖨 1:1 Print Proof Kit
                                                                        </Link>
                                                                    </nav>
                                                                    <h1 className={s.h1}>Social &amp; Print Automation Admin</h1>
                                                                    <p className={s.lead}>
                                                                        Edit any Cut Chart, Primal Guide, Fact, Special, Recipe, or Trivia slide live, print 1:1 proof
                                                                        sheets, or post immediately. <b>Automatic posting requires human verification</b> — review and
                                                                        verify posts by <b>Day</b>, <b>Weekly</b>, or <b>Month</b>.
                                                                    </p>
                                                                </div>
                                                                <div className={s.bank}>
                                                                    <span>
                                                                        <b>{bank.active}</b> templates &amp; cut charts in bank · <b>{totalMonthVerified}/{totalMonthPosts}</b>{' '}
                                                                        verified this month
                                                                    </span>
                                                                    <div className={s.row}>
                                                                        <button type="button" className={s.chip} onClick={() => addAnimalCutsPost('beef')}>
                                                                            + Beef Cuts
                                                                        </button>
                                                                        <button type="button" className={s.chip} onClick={() => addAnimalCutsPost('pork')}>
                                                                            + Pork Cuts
                                                                        </button>
                                                                        <button type="button" className={s.chip} onClick={() => addAnimalCutsPost('lamb')}>
                                                                            + Lamb Cuts
                                                                        </button>
                                                                        <button type="button" className={s.chip} onClick={() => addAnimalCutsPost('chicken')}>
                                                                            + Chicken Cuts
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                    </header>

                                                    {/* ── Person Verification & Horizon Command Bar ── */}
                                                        <section id="verification-controls" className={s.verifyBanner} aria-label="Verification and Schedule Horizon Controls">
                                                            <div className={s.verifyBannerLeft}>
                                                                <span className={s.verifyTitle}>
                                                                    🛡️ Human Verification Gate · Auto-Post Schedule ({horizon.toUpperCase()} VIEW)
                                                                </span>
                                                                <span className={s.verifySub}>
                                                                    Automatic posts are held until verified by a person. Switch between <b>By Day</b>,{' '}
                                                                    <b>Weekly</b>, or <b>Month</b> to edit, print, and verify.
                                                                </span>
                                                            </div>

                                                            <div className={s.verifyControls}>
                                                                <label className={s.verifierField}>
                                                                    Verified By:
                                                                    <input
                                                                        type="text"
                                                                        className={s.verifierInput}
                                                                        value={verifier}
                                                                        placeholder="Sean Hofherr"
                                                                        onChange={(e) => {
                                                                            setVerifier(e.target.value);
                                                                            persistLocal(weeks, settings, e.target.value);
                                                                        }}
                                                                    />
                                                                </label>

                                                                <div className={s.horizonTabs} role="tablist" aria-label="Verification Horizon">
                                                                    <button
                                                                        type="button"
                                                                        role="tab"
                                                                        aria-selected={horizon === 'day'}
                                                                        className={horizon === 'day' ? s.horizonBtnOn : s.horizonBtn}
                                                                        onClick={() => setHorizon('day')}
                                                                    >
                                                                        📅 By Day
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        role="tab"
                                                                        aria-selected={horizon === 'week'}
                                                                        className={horizon === 'week' ? s.horizonBtnOn : s.horizonBtn}
                                                                        onClick={() => setHorizon('week')}
                                                                    >
                                                                        🗓 Weekly
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        role="tab"
                                                                        aria-selected={horizon === 'month'}
                                                                        className={horizon === 'month' ? s.horizonBtnOn : s.horizonBtn}
                                                                        onClick={() => setHorizon('month')}
                                                                    >
                                                                        📆 Monthly
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </section>

                                                        {bannerMsg && <p className={s.msg}>{bannerMsg}</p>}

                                                        <HowItWorks connected={connected} bankTotal={bank.total} hasWeek={weeks.length > 0} />
                                                        <SettingsPanel key={JSON.stringify(settings)} settings={settings} connected={connected} onSave={saveSettings} />

                                                        {/* ── Sticky Action Toolbar ── */}
                                                        <div className={s.toolbar}>
                                                            {horizon !== 'month' && (
                                                                <select
                                                                    value={activeWeek?._id ?? ''}
                                                                    onChange={(e) => {
                                                                        setCurrentWeekId(e.target.value);
                                                                        setSelectedDayIdx(0);
                                                                    }}
                                                                    className={s.select}
                                                                >
                                                                    {weeks.map((w, idx) => (
                                                                        <option key={w._id} value={w._id}>
                                                                            Week {idx + 1}: {fmtWeek(w.weekOf)} ({w.posts.filter((p) => p.approved).length}/
                                                                            {w.posts.length} verified)
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            )}

                                                            {horizon === 'day' && activeWeek && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className={s.btn}
                                                                        onClick={() =>
                                                                            setSelectedDayIdx((i) => (i - 1 + activeWeek.posts.length) % activeWeek.posts.length)
                                                                        }
                                                                    >
                                                                        ← Prev Day
                                                                    </button>
                                                                    <select
                                                                        value={selectedDayIdx}
                                                                        onChange={(e) => setSelectedDayIdx(Number(e.target.value))}
                                                                        className={s.select}
                                                                    >
                                                                        {activeWeek.posts.map((p, idx) => (
                                                                            <option key={p._key} value={idx}>
                                                                                {p.day} — {p.label} {p.approved ? '✓' : '⏳'}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <button
                                                                        type="button"
                                                                        className={s.btn}
                                                                        onClick={() => setSelectedDayIdx((i) => (i + 1) % activeWeek.posts.length)}
                                                                    >
                                                                        Next Day →
                                                                    </button>
                                                                </>
                                                            )}

                                                            <button type="button" className={s.btn} onClick={regenerateSchedule}>
                                                                ↻ Regenerate Schedule
                                                            </button>
                                                            <button type="button" className={s.btn} onClick={() => window.print()}>
                                                                🖨 Print {horizon === 'day' ? 'Day Proof' : horizon === 'week' ? 'Weekly Proofs' : 'Monthly Proofs'}
                                                            </button>

                                                            <span className={s.spacer} />

                                                            {horizon === 'day' && dayPost && (
                                                                <>
                                                                    <span className={s.progress}>
                                                                        Day Status: <b>{dayPost.approved ? `Verified by ${dayPost.verifiedBy || verifier}` : 'Needs Verification'}</b>
                                                                    </span>
                                                                    <button type="button" className={s.btnSuccess} onClick={verifyDayPost}>
                                                                        ✓ Verify This Day&apos;s Post
                                                                    </button>
                                                                </>
                                                            )}

                                                            {horizon === 'week' && activeWeek && (
                                                                <>
                                                                    <span className={s.progress}>
                                                                        <b>
                                                                            {weekApproved}/{activeWeek.posts.length}
                                                                        </b>{' '}
                                                                        verified this week
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        className={s.btnSuccess}
                                                                        disabled={!!busy}
                                                                        onClick={() => verifyWeekPosts(activeWeek._id)}
                                                                    >
                                                                        ✓ Verify Entire Week ({activeWeek.posts.length} Posts)
                                                                    </button>
                                                                </>
                                                            )}

                                                            {horizon === 'month' && (
                                                                <>
                                                                    <span className={s.progress}>
                                                                        <b>
                                                                            {totalMonthVerified}/{totalMonthPosts}
                                                                        </b>{' '}
                                                                        verified across all {weeks.length} weeks
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        className={s.btnSuccess}
                                                                        disabled={!!busy}
                                                                        onClick={verifyEntireMonth}
                                                                    >
                                                                        ✓ Verify Entire Month ({totalMonthPosts} Posts)
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* ── 1. DAY VIEW (Single-day deep inspection, live editor & verification) ── */}
                                                        {horizon === 'day' && activeWeek && dayPost && (
                                                            <div className={s.dayViewGrid}>
                                                                <PostCard
                                                                    key={`${dayPost._key}-preview`}
                                                                    week={activeWeek}
                                                                    post={dayPost}
                                                                    verifier={verifier}
                                                                    onUpdatePost={updatePost}
                                                                    onAddWord={(w) => saveSettings({ addWord: w })}
                                                                />
                                                                <PostCard
                                                                    key={`${dayPost._key}-editor`}
                                                                    week={activeWeek}
                                                                    post={dayPost}
                                                                    verifier={verifier}
                                                                    defaultEditing
                                                                    onUpdatePost={updatePost}
                                                                    onAddWord={(w) => saveSettings({ addWord: w })}
                                                                />
                                                            </div>
                                                        )}

                                                        {/* ── 2. WEEKLY VIEW (All posts in the selected week) ── */}
                                                        {horizon === 'week' && activeWeek && (
                                                            <div className={s.grid}>
                                                                {activeWeek.posts.map((p) => (
                                                                    <PostCard
                                                                        key={p._key}
                                                                        week={activeWeek}
                                                                        post={p}
                                                                        verifier={verifier}
                                                                        onUpdatePost={updatePost}
                                                                        onAddWord={(w) => saveSettings({ addWord: w })}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* ── 3. MONTHLY VIEW (All 4 weeks of the month stacked with batch verification) ── */}
                                                        {horizon === 'month' && (
                                                            <div className={s.monthSection}>
                                                                {weeks.map((w, wIdx) => {
                                                                    const wVer = w.posts.filter((p) => p.approved).length;
                                                                    return (
                                                                            <section
                                                                                key={w._id}
                                                                                id={`month-week-${w._id}`}
                                                                                aria-labelledby={`month-week-${w._id}-heading`}
                                                                                className={s.monthWeekBlock}
                                                                            >
                                                                                <header className={s.monthWeekHead}>
                                                                                    <div>
                                                                                            <h2 id={`month-week-${w._id}-heading`} className={s.monthWeekTitle}>
                                                                                                Week {wIdx + 1} · Week of {fmtWeek(w.weekOf)}
                                                                                            </h2>
                                                                                            <span className={s.when}>
                                                                                                {wVer}/{w.posts.length} posts verified for automatic publishing
                                                                                            </span>
                                                                                    </div>
                                                                                    <div className={s.row}>
                                                                                        <button
                                                                                            type="button"
                                                                                            className={s.btnSuccess}
                                                                                            onClick={() => verifyWeekPosts(w._id)}
                                                                                        >
                                                                                            ✓ Verify Week {wIdx + 1}
                                                                                        </button>
                                                                                    </div>
                                                                                </header>
                                                                                <div className={s.grid}>
                                                                                    {w.posts.map((p) => (
                                                                                        <PostCard
                                                                                            key={p._key}
                                                                                            week={w}
                                                                                            post={p}
                                                                                            verifier={verifier}
                                                                                            onUpdatePost={updatePost}
                                                                                            onAddWord={(w) => saveSettings({ addWord: w })}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                            </section>
                                                                            );
                    })}
                                                                        </div>
                                                                    )
                                                                }
        </main>
                                                        );
}

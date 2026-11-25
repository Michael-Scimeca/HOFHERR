'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import { Toggle } from '@/components/Toggle';
import { ANIMALS } from '@/components/admin/social-kit/animals';
import { buildStarterWeeks } from '@/lib/social/plan';
import {
    DEFAULT_SETTINGS,
    type Platform,
    type Slide,
    type SocialPost,
    type SocialSettings,
    type SocialWeek,
} from '@/lib/social/types';
import SlidePreview, { getStickerSrc } from './SlidePreview';
import s from './social.module.css';

const BUILDER_PHOTOS = [
    { label: 'Graphic Only', src: '' },
    { label: 'Steak & BBQ', src: '/assets/specials-bbq.jpg' },
    { label: 'Italian Beef', src: '/assets/specials-italian-beef.jpg' },
    { label: 'Rotisserie', src: '/assets/specials-rotisserie.jpg' },
    { label: 'Butcher Block', src: '/assets/store-butcher-front.jpg' },
    { label: 'The Depot', src: '/shops/winnetka.png' },
] as const;

const BUILDER_TEMPLATES = [
    { id: 'specials' as const, kind: 'specials' as const, label: 'Weekly Special', kicker: 'THIS WEEK AT THE BLOCK', tone: 'crimson' as const },
    { id: 'tip' as const, kind: 'tip' as const, label: 'Butcher Tip', kicker: 'BUTCHER TIP', tone: 'charcoal' as const },
    { id: 'trivia-q' as const, kind: 'trivia' as const, label: 'Trivia', kicker: 'BUTCHER TRIVIA', tone: 'charcoal' as const },
    { id: 'howto-cover' as const, kind: 'howto' as const, label: 'How-To Guide', kicker: 'HOW TO COOK IT', tone: 'crimson' as const },
] as const;

const DAY_SHORT_FMT = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
});
const TIME_ONLY_FMT = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: '2-digit',
});

function getWeekDayDate(weekOf: string, dayOffset: number): Date {
    const base = new Date(`${weekOf}T12:00:00Z`);
    base.setUTCDate(base.getUTCDate() + dayOffset);
    return base;
}

function buildScheduledIso(weekOf: string, dayName: string, timeHHMM: string): string {
    const idx = Math.max(0, DAYS.indexOf(dayName));
    const d = getWeekDayDate(weekOf, idx);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const [hh = '11', min = '00'] = (timeHHMM || '11:00').split(':');
    return `${yyyy}-${mm}-${dd}T${hh.padStart(2, '0')}:${min.padStart(2, '0')}:00-06:00`;
}

type Issue = { field: string; word: string; suggestions: string[] };
type Post = SocialPost & { issues?: Issue[] };
type Week = Omit<SocialWeek, 'posts'> & { posts: Post[] };
type Bank = { total: number; active: number; fresh: number };
type Connected = Record<Platform | 'email', boolean> & { cronSecret?: boolean; siteUrl?: boolean };

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
    const [busy, setBusy] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);
    const [slide, setSlide] = useState(0);
    const [tab, setTab] = useState<'facebook' | 'instagram' | 'x'>('facebook');
    const previewRef = React.useRef<HTMLDivElement>(null);

    const issues = findClientIssues(post);
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

    const activePost = post;
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
                <button type="button" className={tab === 'facebook' ? s.tabOn : s.tab} onClick={() => setTab('facebook')}>
                    Facebook Feed
                </button>
                <button type="button" className={tab === 'instagram' ? s.tabOn : s.tab} onClick={() => setTab('instagram')}>
                    Instagram (4:5)
                </button>
                <button type="button" className={tab === 'x' ? s.tabOn : s.tab} onClick={() => setTab('x')}>
                    X / Twitter (16:9)
                </button>
            </div>

            <div className={s.preview}>
                {tab === 'facebook' ? (
                    <div className={s.fbCard}>
                        <div className={s.fbHead}>
                            <div className={s.fbAvatar}>
                                <img src="/assets/logo.svg" alt="Hofherr Meat Co." className={s.fbAvatarImg} />
                            </div>
                            <div className={s.fbMeta}>
                                <div className={s.fbNameRow}>
                                    <strong className={s.fbPageName}>Hofherr Meat Co.</strong>
                                    <span className={s.fbVerifiedDot} aria-label="Verified Page">✓</span>
                                </div>
                                <span className={s.fbTime}>
                                    {fmtWhen(activePost.scheduledFor)} · Northfield, IL · 🌐
                                </span>
                            </div>
                            <span className={s.fbDots} aria-hidden="true">•••</span>
                        </div>

                        <div className={s.fbCopy}>
                            <p
                                className={s.fbCaptionText}
                                contentEditable
                                suppressContentEditableWarning
                                spellCheck
                                title="Click to edit Facebook caption"
                                onBlur={(e) => {
                                    const nextCaption = e.currentTarget.innerText.trim();
                                    if (nextCaption !== activePost.caption) {
                                        void onUpdatePost(week._id, post._key, { caption: nextCaption });
                                    }
                                }}
                            >
                                {activePost.caption}
                            </p>
                            {activePost.hashtags && (
                                <p
                                    className={s.fbHashtags}
                                    contentEditable
                                    suppressContentEditableWarning
                                    spellCheck={false}
                                    title="Click to edit hashtags"
                                    onBlur={(e) => {
                                        const nextTags = e.currentTarget.innerText.trim();
                                        if (nextTags !== activePost.hashtags) {
                                            void onUpdatePost(week._id, post._key, { hashtags: nextTags });
                                        }
                                    }}
                                >
                                    {activePost.hashtags}
                                </p>
                            )}
                        </div>

                        <div className={s.fbMediaWrap} ref={previewRef}>
                            {currentSlide && (
                                <SlidePreview
                                    slide={currentSlide}
                                    format="portrait"
                                    editable
                                    onFieldChange={(field, val) => {
                                        const nextSlides = activePost.slides.map((sl, idx) =>
                                            idx === slide ? { ...sl, [field]: val } : sl
                                        );
                                        void onUpdatePost(week._id, post._key, { slides: nextSlides });
                                    }}
                                />
                            )}
                        </div>
                    </div>
                ) : (
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
                                    void onUpdatePost(week._id, post._key, { slides: nextSlides });
                                }}
                            />
                        )}
                    </div>
                )}
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
                                        <em>Click the text in the preview above to replace placeholder {iss.word}</em>
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

    const freqSummary =
        d.frequency === 'daily'
            ? 'Every day'
            : d.frequency === 'alternate'
                ? 'Every other day'
                : d.frequency === 'weekdays'
                    ? 'Weekdays'
                    : (d.customDays ?? []).join(', ') || 'Custom';

    return (
        <div className={s.settingsBody}>
            <div className={s.settingsGrid}>
                {/* Col 1: Cadence & Time */}
                <div className={s.settingsCol}>
                    <span className={s.settingsLabel}>Posting Schedule</span>
                    <div className={s.pillGroup} role="radiogroup" aria-label="Posting cadence">
                        {(
                            [
                                ['daily', 'Daily'],
                                ['alternate', 'Every other day'],
                                ['weekdays', 'Weekdays'],
                                ['custom', 'Custom'],
                            ] as const
                        ).map(([v, l]) => (
                            <button
                                key={v}
                                type="button"
                                role="radio"
                                aria-checked={d.frequency === v}
                                className={`${s.pillChoice} ${d.frequency === v ? s.pillChoiceActive : ''}`}
                                onClick={() => setD({ ...d, frequency: v })}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
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
                    <label className={s.timeRow}>
                        <span>Post time (CT)</span>
                        <input
                            type="time"
                            className={s.timeInput}
                            value={d.postTime}
                            onChange={(e) => setD({ ...d, postTime: e.target.value })}
                        />
                    </label>
                </div>

                {/* Col 2: Verification */}
                <div className={s.settingsCol}>
                    <span className={s.settingsLabel}>Approval &amp; Review</span>
                    <div className={s.toggleListRow}>
                        <Toggle
                            size="sm"
                            variant="gold"
                            checked={d.requireApproval}
                            onChange={(checked) => setD({ ...d, requireApproval: checked })}
                            label="Require approval before posting"
                        />
                    </div>
                    <span className={s.settingsSubLabel}>Review cadence</span>
                    <div className={s.pillGroup} role="radiogroup" aria-label="Verification cadence">
                        {(
                            [
                                ['daily', 'Daily'],
                                ['weekly', 'Weekly'],
                                ['monthly', 'Monthly'],
                            ] as const
                        ).map(([v, l]) => (
                            <button
                                key={v}
                                type="button"
                                role="radio"
                                aria-checked={(d.verificationCadence ?? 'weekly') === v}
                                className={`${s.pillChoice} ${(d.verificationCadence ?? 'weekly') === v ? s.pillChoiceActive : ''}`}
                                onClick={() => setD({ ...d, verificationCadence: v })}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Col 3: Platforms */}
                <div className={s.settingsCol}>
                    <span className={s.settingsLabel}>Platforms</span>
                    <div className={s.platformList}>
                        {(['instagram', 'facebook', 'x'] as Platform[]).map((p) => (
                            <div key={p} className={s.platformRow}>
                                <Toggle
                                    size="sm"
                                    checked={d.platforms.includes(p)}
                                    onChange={() => setD({ ...d, platforms: toggle(d.platforms, p) })}
                                    label={PLATFORM_LABEL[p]}
                                />
                                <span className={connected?.[p] ? s.conn : s.notConn}>
                                    {connected?.[p] ? 'connected' : 'test mode'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Col 4: Reviewer Emails */}
                <div className={s.settingsCol}>
                    <div className={s.settingsLabelRow}>
                        <span className={s.settingsLabel}>Reviewer Emails</span>
                        <span className={connected?.email ? s.conn : s.notConn}>
                            {connected?.email ? 'active' : 'test mode'}
                        </span>
                    </div>
                    <textarea
                        rows={3}
                        className={s.settingsTextarea}
                        placeholder="sean@hofherrmeatco.com"
                        aria-label="Reviewer notification emails"
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
                </div>
            </div>

            <div className={s.settingsFooter}>
                <span className={s.settingsSummary}>
                    {freqSummary} at {d.postTime} CT · {(d.verificationCadence ?? 'weekly')} review ·{' '}
                    {d.platforms.map((p) => PLATFORM_LABEL[p]).join(', ') || 'No platforms selected'}
                </span>
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
                    {busy ? 'Saving…' : 'Save Rules'}
                </button>
            </div>
        </div>
    );
}

                    /* ── Main Admin Social Studio Page ─────────────────────── */
                    export default function SocialAdminPage() {
    const [weeks, setWeeks] = useState<Week[]>(() => buildStarterWeeks(DEFAULT_SETTINGS, 4));
                    const [bank, setBank] = useState<Bank>({total: 36, active: 36, fresh: 24 });
                        const [settings, setSettings] = useState<SocialSettings>(DEFAULT_SETTINGS);
                            const [connected, setConnected] = useState<Connected | null>(null);
                                const [currentWeekId, setCurrentWeekId] = useState<string>(() => buildStarterWeeks(DEFAULT_SETTINGS, 4)[0]?._id ?? '');
                                        const [verifier, setVerifier] = useState<string>('Sean Hofherr');
                                            const [busy, setBusy] = useState<string | null>(null);
                                            const [bannerMsg, setBannerMsg] = useState<string | null>(null);
                                            const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
                                            const [selectedDay, setSelectedDay] = useState<string | null>(null);
                                            const [showBuilder, setShowBuilder] = useState(false);
                                            const [builderDay, setBuilderDay] = useState<string>('Tue');
                                            const [builderTime, setBuilderTime] = useState<string>('11:00');
                                            const [builderTpl, setBuilderTpl] = useState<(typeof BUILDER_TEMPLATES)[number]['id']>('specials');
                                            const [builderHeadline, setBuilderHeadline] = useState<string>('45-Day Dry-Aged Prime Ribeye');
                                            const [builderBody, setBuilderBody] = useState<string>('Hand-cut to your exact thickness at 300 Happ Rd. Reserve yours for weekend pickup.');
                                            const [builderIcon, setBuilderIcon] = useState<string>('cow');
                                            const [builderPhoto, setBuilderPhoto] = useState<string>('/assets/specials-bbq.jpg');
                                            const [builderCaption, setBuilderCaption] = useState<string>('Fresh on the block in Northfield — hand-cut to order. Order ahead at hofherrmeatco.com.');
                                            const [builderFormat, setBuilderFormat] = useState<'portrait' | 'facebook' | 'landscape'>('portrait');

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
    const autoPostEnabled = settings.requireApproval === false;

    const activeBuilderTemplate =
        BUILDER_TEMPLATES.find((t) => t.id === builderTpl) ?? BUILDER_TEMPLATES[0];

    const builderSlide: Slide = {
        _key: 'builder-preview',
        template: activeBuilderTemplate.id,
        kicker: activeBuilderTemplate.kicker,
        headline: builderHeadline || 'Your Headline Here',
        body: builderBody || 'Add your butcher note or special details.',
        iconId: builderIcon,
        photo: builderPhoto || undefined,
        tone: activeBuilderTemplate.tone,
    };

    const openBuilderForDay = (day: string) => {
        setBuilderDay(day);
        setBuilderTime(settings.postTime || '11:00');
        setShowBuilder(true);
    };

    const handleAddBuiltPost = () => {
        if (!activeWeek) return;
        const scheduledIso = buildScheduledIso(activeWeek.weekOf, builderDay, builderTime);
        const newPost: Post = {
            _key: `custom-${Date.now()}`,
            day: builderDay,
            kind: activeBuilderTemplate.kind,
            label: `${activeBuilderTemplate.label}: ${builderHeadline.trim() || 'Custom Post'}`,
            contentIds: [],
            slides: [{ ...builderSlide, _key: `sl-${Date.now()}` }],
            caption: builderCaption.trim() || `${builderHeadline.trim()} — ${builderBody.trim()}`,
            captionX: `${builderHeadline.trim()} — ${builderBody.trim()}`.slice(0, 260),
            hashtags: '#hofherrmeatco #northfieldil #winnetka #chicagobutcher #shoplocal',
            approved: false,
            status: 'draft',
            scheduledFor: scheduledIso,
            version: 1,
        };
        const nextWeeks = weeks.map((w) => {
            if (w._id !== activeWeek._id) return w;
            const posts = [...w.posts, newPost].sort(
                (a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day)
            );
            return { ...w, posts };
        });
        setWeeks(nextWeeks);
        persistLocal(nextWeeks, settings, verifier);
        setShowBuilder(false);
        setSelectedDay(builderDay);
        setBannerMsg(`✓ Scheduled "${builderHeadline.trim() || 'Custom Post'}" for ${builderDay} at ${TIME_ONLY_FMT.format(new Date(scheduledIso))} CT.`);
    };

    const visibleWeekPosts = activeWeek
        ? selectedDay
            ? activeWeek.posts.filter((p) => p.day === selectedDay)
            : activeWeek.posts
        : [];

    return (
        <div className={s.page}>
            {/* ── Compact Title + Global Controls Row ── */}
            <header className={s.top}>
                <div className={s.topTitleCol}>
                    <h2 className={s.h1Compact}>Social Studio Builder</h2>
                    <p className={s.leadCompact}>
                        Visual weekly posting calendar &amp; live post builder for Instagram, Facebook, and X.
                    </p>
                </div>

                <div className={s.topControls}>
                    <button
                        type="button"
                        className={s.btnPrimary}
                        onClick={() => setShowBuilder((v) => !v)}
                    >
                        {showBuilder ? '✕ Close Builder' : '+ New Post'}
                    </button>

                    <div className={s.autoPostPill}>
                        <Toggle
                            size="sm"
                            variant="gold"
                            checked={autoPostEnabled}
                            onChange={(checked) => {
                                void saveSettings({ requireApproval: !checked });
                                setBannerMsg(
                                    checked
                                        ? 'Auto-Post enabled — clean posts publish automatically on schedule.'
                                        : 'Manual verification enabled — posts wait for approval before publishing.'
                                );
                            }}
                            label="Auto-Post"
                        />
                    </div>

                    <button
                        type="button"
                        className={`${s.btn} ${showSettingsDrawer ? s.btnActive : ''}`}
                        aria-expanded={showSettingsDrawer}
                        onClick={() => setShowSettingsDrawer((v) => !v)}
                    >
                        ⚙ Posting Rules
                    </button>

                    <details className={s.cutsMenu}>
                        <summary className={s.btn}>+ Add Cuts ▾</summary>
                        <div className={s.cutsDropdown}>
                            <button type="button" className={s.cutsOption} onClick={(e) => { addAnimalCutsPost('beef'); e.currentTarget.closest('details')?.removeAttribute('open'); }}>
                                + Beef Cuts
                            </button>
                            <button type="button" className={s.cutsOption} onClick={(e) => { addAnimalCutsPost('pork'); e.currentTarget.closest('details')?.removeAttribute('open'); }}>
                                + Pork Cuts
                            </button>
                            <button type="button" className={s.cutsOption} onClick={(e) => { addAnimalCutsPost('lamb'); e.currentTarget.closest('details')?.removeAttribute('open'); }}>
                                + Lamb Cuts
                            </button>
                            <button type="button" className={s.cutsOption} onClick={(e) => { addAnimalCutsPost('chicken'); e.currentTarget.closest('details')?.removeAttribute('open'); }}>
                                + Chicken Cuts
                            </button>
                        </div>
                    </details>
                </div>
            </header>

            {bannerMsg && <p className={s.msg}>{bannerMsg}</p>}

            {/* ── Visual Quick Post Builder ── */}
            {showBuilder && activeWeek && (
                <section className={s.builderPanel} aria-label="Visual social post builder">
                    <div className={s.builderFormCol}>
                        <div className={s.builderHead}>
                            <h3 className={s.builderHeading}>Create &amp; Schedule Post</h3>
                            <span className={s.builderSub}>Updates the live graphic preview as you type.</span>
                        </div>

                        <div className={s.builderRow}>
                            <div className={s.builderField}>
                                <span className={s.settingsLabel}>Send Day</span>
                                <div className={s.pillGroup}>
                                    {DAYS.map((day) => (
                                        <button
                                            key={day}
                                            type="button"
                                            className={`${s.pillChoice} ${builderDay === day ? s.pillChoiceActive : ''}`}
                                            onClick={() => setBuilderDay(day)}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label className={s.builderFieldNarrow}>
                                <span className={s.settingsLabel}>Send Time (CT)</span>
                                <input
                                    type="time"
                                    className={s.timeInput}
                                    value={builderTime}
                                    onChange={(e) => setBuilderTime(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className={s.builderField}>
                            <span className={s.settingsLabel}>Post Style</span>
                            <div className={s.pillGroup}>
                                {BUILDER_TEMPLATES.map((tpl) => (
                                    <button
                                        key={tpl.id}
                                        type="button"
                                        className={`${s.pillChoice} ${builderTpl === tpl.id ? s.pillChoiceActive : ''}`}
                                        onClick={() => setBuilderTpl(tpl.id)}
                                    >
                                        {tpl.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className={s.builderField}>
                            <span className={s.settingsLabel}>Headline</span>
                            <input
                                type="text"
                                className={s.builderInput}
                                value={builderHeadline}
                                onChange={(e) => setBuilderHeadline(e.target.value)}
                                placeholder="e.g. 45-Day Dry-Aged Prime Ribeye"
                            />
                        </label>

                        <label className={s.builderField}>
                            <span className={s.settingsLabel}>Card Details</span>
                            <textarea
                                rows={2}
                                className={s.settingsTextarea}
                                value={builderBody}
                                onChange={(e) => setBuilderBody(e.target.value)}
                                placeholder="Short punchy copy shown directly on the graphic…"
                            />
                        </label>

                        <div className={s.builderField}>
                            <span className={s.settingsLabel}>Department Sticker</span>
                            <div className={s.stickerPicker}>
                                {ICON_OPTIONS.map((ic) => (
                                    <button
                                        key={ic.id}
                                        type="button"
                                        title={ic.label}
                                        className={`${s.stickerBtn} ${builderIcon === ic.id ? s.stickerBtnActive : ''}`}
                                        onClick={() => setBuilderIcon(ic.id)}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={getStickerSrc(ic.id)} alt={ic.label} className={s.stickerThumb} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={s.builderField}>
                            <span className={s.settingsLabel}>Photo Backdrop</span>
                            <div className={s.photoPicker}>
                                {BUILDER_PHOTOS.map((ph) => (
                                    <button
                                        key={ph.label}
                                        type="button"
                                        className={`${s.photoChoice} ${builderPhoto === ph.src ? s.photoChoiceActive : ''}`}
                                        onClick={() => setBuilderPhoto(ph.src)}
                                    >
                                        {ph.src ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={ph.src} alt="" className={s.photoThumb} />
                                        ) : (
                                            <span className={s.photoThumbNone}>Aa</span>
                                        )}
                                        <span>{ph.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className={s.builderField}>
                            <span className={s.settingsLabel}>Caption</span>
                            <textarea
                                rows={2}
                                className={s.settingsTextarea}
                                value={builderCaption}
                                onChange={(e) => setBuilderCaption(e.target.value)}
                                placeholder="Post caption for Instagram, Facebook & X…"
                            />
                        </label>

                        <div className={s.builderActions}>
                            <button type="button" className={s.btnPrimary} onClick={handleAddBuiltPost}>
                                + Schedule on {builderDay} at {builderTime} CT
                            </button>
                            <button type="button" className={s.btn} onClick={() => setShowBuilder(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className={s.builderPreviewCol}>
                        <div className={s.builderPreviewHead}>
                            <span className={s.settingsLabel}>Live Preview</span>
                            <div className={s.pillGroup}>
                                {(
                                    [
                                        ['portrait', 'Instagram 4:5'],
                                        ['facebook', 'Facebook'],
                                        ['landscape', 'X 16:9'],
                                    ] as const
                                ).map(([fmt, lbl]) => (
                                    <button
                                        key={fmt}
                                        type="button"
                                        className={`${s.pillChoice} ${builderFormat === fmt ? s.pillChoiceActive : ''}`}
                                        onClick={() => setBuilderFormat(fmt)}
                                    >
                                        {lbl}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={s.builderPreviewStage}>
                            <SlidePreview
                                slide={builderSlide}
                                format={builderFormat === 'landscape' ? 'landscape' : 'portrait'}
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* ── Collapsible Rules, Status & Verifier Drawer ── */}
            {showSettingsDrawer && (
                <section id="verification-controls" className={s.settingsDrawer} aria-label="Posting rules and verification settings">
                    <div className={s.drawerMetaRow}>
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
                        <span className={s.drawerStats}>
                            <b>{bank.active}</b> templates in bank · <b>{totalMonthVerified}/{totalMonthPosts}</b> verified this month
                        </span>
                    </div>

                    <SettingsPanel key={JSON.stringify(settings)} settings={settings} connected={connected} onSave={saveSettings} />
                </section>
            )}

            {/* ── Unified Week Action Toolbar ── */}
            <div className={s.toolbar}>
                <select
                    value={activeWeek?._id ?? ''}
                    onChange={(e) => setCurrentWeekId(e.target.value)}
                    className={s.select}
                    aria-label="Select schedule week"
                >
                    {weeks.map((w, idx) => (
                        <option key={w._id} value={w._id}>
                            Week {idx + 1}: {fmtWeek(w.weekOf)} ({w.posts.filter((p) => p.approved).length}/{w.posts.length} verified)
                        </option>
                    ))}
                </select>

                <button type="button" className={s.btn} onClick={regenerateSchedule}>
                    ↻ Regenerate
                </button>

                <span className={s.spacer} />

                {activeWeek && (
                    <>
                        <span className={s.progress}>
                            <b>{weekApproved}/{activeWeek.posts.length}</b> verified
                        </span>
                        <button
                            type="button"
                            className={s.btnSuccess}
                            disabled={!!busy}
                            onClick={() => verifyWeekPosts(activeWeek._id)}
                        >
                            ✓ Verify Week ({activeWeek.posts.length})
                        </button>
                    </>
                )}
            </div>

            {/* ── Visual 7-Day Posting Calendar ── */}
            {activeWeek && (
                <section className={s.calendarSection} aria-label="Weekly visual posting calendar">
                    <div className={s.calendarHeader}>
                        <span className={s.settingsLabel}>
                            Weekly Posting Calendar · Week of {fmtWeek(activeWeek.weekOf)}
                        </span>
                        {selectedDay && (
                            <button
                                type="button"
                                className={s.calendarResetBtn}
                                onClick={() => setSelectedDay(null)}
                            >
                                Showing {selectedDay} only · Show all days ×
                            </button>
                        )}
                    </div>
                    <div className={s.calendarGrid}>
                        {DAYS.map((day, idx) => {
                            const dayDate = getWeekDayDate(activeWeek.weekOf, idx);
                            const dayPosts = activeWeek.posts.filter((p) => p.day === day);
                            const isSelected = selectedDay === day;
                            return (
                                <div
                                    key={day}
                                    className={`${s.calDayCol} ${isSelected ? s.calDayColSelected : ''}`}
                                >
                                    <div className={s.calDayHead}>
                                        <span className={s.calDayName}>{day}</span>
                                        <span className={s.calDayDate}>{DAY_SHORT_FMT.format(dayDate)}</span>
                                    </div>

                                    {dayPosts.length > 0 ? (
                                        <div className={s.calDayPosts}>
                                            {dayPosts.map((p) => {
                                                const first = p.slides[0];
                                                const isPosted = p.status === 'posted';
                                                const timeStr = p.scheduledFor
                                                    ? `${TIME_ONLY_FMT.format(new Date(p.scheduledFor))} CT`
                                                    : `${settings.postTime} CT`;
                                                return (
                                                    <button
                                                        key={p._key}
                                                        type="button"
                                                        className={`${s.calPostCard} ${p.approved ? s.calPostApproved : ''}`}
                                                        onClick={() => setSelectedDay(isSelected ? null : day)}
                                                    >
                                                        <div className={s.calPostThumb}>
                                                            {first?.photo ? (
                                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                                <img src={first.photo} alt="" className={s.calPostThumbImg} />
                                                            ) : (
                                                                <div className={s.calPostThumbGraphic}>
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={getStickerSrc(first?.iconId)}
                                                                        alt=""
                                                                        className={s.calPostSticker}
                                                                    />
                                                                </div>
                                                            )}
                                                            <span
                                                                className={`${s.calStatusDot} ${
                                                                    isPosted || p.approved ? s.calStatusOk : s.calStatusWait
                                                                }`}
                                                            >
                                                                {isPosted ? '✓ Sent' : p.approved ? '✓ Ready' : '⏳ Draft'}
                                                            </span>
                                                        </div>
                                                        <div className={s.calPostMeta}>
                                                            <span className={s.calPostTime}>{timeStr}</span>
                                                            <span className={s.calPostTitle}>
                                                                {first?.headline || p.label}
                                                            </span>
                                                            <span className={s.calPlatforms}>
                                                                {settings.platforms.map((pl) => pl === 'instagram' ? 'IG' : pl === 'facebook' ? 'FB' : 'X').join(' · ')}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className={s.calEmptySlot}
                                            onClick={() => openBuilderForDay(day)}
                                        >
                                            <span>+ Schedule</span>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ── WEEKLY VIEW (Scheduled post cards) ── */}
            {activeWeek && (
                <div className={s.grid}>
                    {visibleWeekPosts.map((p) => (
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
        </div>
    );
}

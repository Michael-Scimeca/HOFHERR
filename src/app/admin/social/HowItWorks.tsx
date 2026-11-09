'use client';

import React, { useEffect, useState } from 'react';
import s from './social.module.css';

type Connected = { instagram: boolean; facebook: boolean; x: boolean; email: boolean };

const KEY = 'hofherr-social-guide-open-v1';

function Check({ done, children, note }: { done: boolean | null; children: React.ReactNode; note?: React.ReactNode }) {
    return (
        <li className={s.checkItem}>
            <span className={done ? s.checkDone : s.checkTodo}>{done ? '✓' : '○'}</span>
            <span>{children}{note && <span className={s.checkNote}>{note}</span>}</span>
        </li>
    );
}

/** "How it works & setup" guide pinned to the top of /admin/social. Remembers open/closed per browser. */
export default function HowItWorks({ connected, bankTotal, hasWeek }: { connected: Connected | null; bankTotal: number; hasWeek: boolean }) {
    const [open, setOpen] = useState(true);
    useEffect(() => {
        try {
            const v = localStorage.getItem(KEY);
            if (v !== null) setOpen(v === '1');
        } catch { /* storage unavailable */ }
    }, []);
    const toggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
        const next = (e.currentTarget as HTMLDetailsElement).open;
        setOpen(next);
        try { localStorage.setItem(KEY, next ? '1' : '0'); } catch { /* ignore */ }
    };

    return (
        <details className={s.guide} open={open} onToggle={toggle}>
            <summary>📖 How it works &amp; setup checklist</summary>

            <div className={s.guideGrid}>
                    <section id="social-how-it-works" aria-labelledby="social-how-it-works-heading">
                        <h3 id="social-how-it-works-heading">How it works</h3>
                        <ol className={s.guideList}>
                            <li>
                                <b>Content bank</b> (Sanity Studio → “Social Content Bank”) — the pool of ideas: recipes, how-tos, cut guides,
                                “did you know” facts, trivia and kitchen tricks. Each one records when it was last used, and staff can add new
                                ones in Studio without a developer.
                            </li>
                            <li>
                                <b>Every Monday at about 5–6am Chicago time</b> a Vercel Cron job builds the week, choosing the least recently
                                used ideas so nothing repeats until everything has had a turn. How often it posts — every day, every other day,
                                weekdays or chosen days — and at what time is set in <b>Posting settings</b> above. In priority order:
                                <ul>
                                    <li>This week’s special, pulled live from your Specials in Sanity (prices included)</li>
                                    <li>A recipe carousel (cover, ingredients, method) — twice a week when posting daily</li>
                                    <li>A “Know your cuts” carousel (guide and 2 facts about the same animal)</li>
                                    <li>A trivia carousel (question and answer)</li>
                                    <li>A how-to carousel (cover and steps)</li>
                                    <li>A kitchen trick or a “did you know” fact</li>
                                </ul>
                                Photos rotate week to week.
                            </li>
                            <li>
                                <b>Images are drawn on the server</b> in the brand fonts and colors — 4:5 for Instagram and Facebook, 16:9 for X —
                                so nobody has to design anything.
                            </li>
                            <li>
                                <b>Reviewers get an email</b> when the week is ready, and a reminder about 24 hours before any post that still
                                isn’t approved.
                            </li>
                            <li>
                                <b>This page is where staff work.</b> Each post shows its image (dots flip through carousel slides; tabs switch
                                between Instagram/Facebook and X), plus captions and hashtags already written. Staff can:
                                <ul>
                                    <li>Edit any text or the post time and hit Save — the image redraws itself</li>
                                    <li>Fix spelling with one click, or add a word to the dictionary</li>
                                    <li>Copy the caption, or download the PNGs</li>
                                    <li><b>Approve</b> — it posts itself at its scheduled time — or <b>Post now</b></li>
                                    <li>Approve all clean posts at once</li>
                                    <li>Regenerate this week, or generate next week early</li>
                                </ul>
                            </li>
                            <li>
                                <b>Spelling is checked on every post</b>, every save and again right before posting. Nothing with a spelling error
                                or an unfilled <code>[placeholder]</code> can be approved or posted. It can’t catch real words used wrongly
                                (“stake” for “steak”), so someone still needs to read each post.
                            </li>
                        </ol>
                    </section>

                        <section id="social-setup-checklist" aria-labelledby="social-setup-checklist-heading">
                            <h3 id="social-setup-checklist-heading">Setup checklist</h3>
                            <ul className={s.checklist}>
                                <Check done={bankTotal > 0} note={bankTotal > 0 ? ` — ${bankTotal} ideas loaded` : ' — click “Load starter content” below'}>
                                    Load the starter content
                                </Check>
                                <Check done={hasWeek} note={!hasWeek ? ' — click “Generate this week”' : undefined}>Generate a first week and try editing &amp; approving a post</Check>
                                <Check done={null} note=" — Posting settings → Notify for review">Add reviewer emails</Check>
                                <Check done={connected?.email ?? null} note={<> — add <code>RESEND_API_KEY</code></>}>Turn on email sending</Check>
                                <Check done={null} note=" — set each recipe’s photo in Studio (they borrow site photos for now)">Real photos for recipes</Check>
                            </ul>

                            <h4>Before it goes live (Vercel → Environment Variables)</h4>
                            <ul className={s.checklist}>
                                <Check done={null} note=" — any long random string. Vercel sends it with the scheduled jobs; they refuse to run without it. The stock-check job already uses it, so it may be set.">
                                    <code>CRON_SECRET</code>
                                </Check>
                                <Check done={null} note=" — your live domain. Instagram and Facebook download the images from it.">
                                    <code>NEXT_PUBLIC_SITE_URL</code>
                                </Check>
                                <Check done={null} note=" — the hourly posting job needs Vercel Pro; the free Hobby plan runs scheduled jobs once a day.">
                                    Vercel Pro plan
                                </Check>
                            </ul>

                            <h4>Connect the accounts (each runs in test mode until connected)</h4>
                            <ul className={s.checklist}>
                                <Check done={connected?.facebook ?? null} note={<> — Meta developer app linked to the Page: <code>META_PAGE_ID</code>, <code>META_PAGE_ACCESS_TOKEN</code>. Meta’s app review can take a while.</>}>
                                    Facebook
                                </Check>
                                <Check done={connected?.instagram ?? null} note={<> — Instagram Business account linked to the Page: <code>META_IG_USER_ID</code></>}>
                                    Instagram
                                </Check>
                                <Check done={connected?.x ?? null} note={<> — developer account with write access: <code>X_API_KEY</code>, <code>X_API_SECRET</code>, <code>X_ACCESS_TOKEN</code>, <code>X_ACCESS_SECRET</code>. Check X’s current API plans and limits.</>}>
                                    X
                                </Check>
                            </ul>
                            <p className={s.small}>
                                The posting code follows each platform’s documented API but hasn’t run against real accounts yet — expect small
                                fixes on the first real post to each. X has been changing how image uploads work.
                            </p>
                        </section>
                    </div>
                </details>
                );
}

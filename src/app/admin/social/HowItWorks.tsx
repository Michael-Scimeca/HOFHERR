'use client';

import React, { useEffect, useState } from 'react';
import s from './social.module.css';

type Connected = {
    instagram: boolean;
    facebook: boolean;
    x: boolean;
    email: boolean;
    cronSecret?: boolean;
    siteUrl?: boolean;
};

const KEY = 'hofherr-social-guide-open-v2';

function Check({ done, children, note }: { done: boolean | null; children: React.ReactNode; note?: React.ReactNode }) {
    return (
        <li className={s.checkItem}>
            <span className={done ? s.checkDone : s.checkTodo}>{done ? '✓' : '○'}</span>
            <span>{children}{note && <span className={s.checkNote}>{note}</span>}</span>
        </li>
    );
}

/** Compact setup & status bar at the top of /admin/social. Collapsed by default. */
export default function HowItWorks({
    connected,
    bankTotal,
    hasWeek,
    reviewerCount = 0,
}: {
    connected: Connected | null;
    bankTotal: number;
    hasWeek: boolean;
    reviewerCount?: number;
}) {
    const [open, setOpen] = useState(false);
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

    const readyCount = [
        bankTotal > 0,
        hasWeek,
        reviewerCount > 0,
        Boolean(connected?.email),
        Boolean(connected?.cronSecret),
        Boolean(connected?.siteUrl),
        Boolean(connected?.facebook),
        Boolean(connected?.instagram),
        Boolean(connected?.x),
    ].filter(Boolean).length;

    return (
        <details className={s.guide} open={open} onToggle={toggle}>
            <summary>
                📖 Setup &amp; Status ({readyCount}/9 · {bankTotal} ideas · Email {connected?.email ? '✓' : '○'} · FB {connected?.facebook ? '✓' : '○'} · IG {connected?.instagram ? '✓' : '○'} · X {connected?.x ? '✓' : '○'})
            </summary>

            <div className={s.guideGrid}>
                <section id="social-how-it-works" aria-labelledby="social-how-it-works-heading">
                    <h3 id="social-how-it-works-heading">Workflow</h3>
                    <ul className={s.checklist}>
                        <Check done={bankTotal > 0} note={` (${bankTotal} ideas in Sanity)`}>Content bank auto-rotates recipes, cuts &amp; trivia</Check>
                        <Check done={true}>HTML/CSS posters drawn automatically — $0, no AI plan</Check>
                        <Check done={hasWeek}>Edit any slide, fix spelling, then Approve or Post Now</Check>
                    </ul>
                </section>

                <section id="social-setup-checklist" aria-labelledby="social-setup-checklist-heading">
                    <h3 id="social-setup-checklist-heading">Connections</h3>
                    <ul className={s.checklist}>
                        <Check done={reviewerCount > 0 && Boolean(connected?.email)} note={reviewerCount > 0 ? ` (${reviewerCount} reviewer)` : undefined}>Email &amp; reviewers</Check>
                        <Check done={Boolean(connected?.cronSecret && connected?.siteUrl)}>Cron &amp; site URL</Check>
                        <Check done={connected?.facebook ?? false} note={<> (<code>META_PAGE_ID</code>, <code>META_PAGE_ACCESS_TOKEN</code>)</>}>Facebook</Check>
                        <Check done={connected?.instagram ?? false} note={<> (<code>META_IG_USER_ID</code>)</>}>Instagram</Check>
                        <Check done={connected?.x ?? false} note={<> (<code>X_API_KEY</code> + OAuth tokens)</>}>X (Twitter)</Check>
                    </ul>
                </section>
            </div>
        </details>
    );
}

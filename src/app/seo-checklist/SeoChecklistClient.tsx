'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { DONE_BASICS, SEO_GROUPS } from './seoData';

const STORAGE_KEY = 'hofherr_seo_checklist_v1';

export default function SeoChecklistClient() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [loaded, setLoaded] = useState(false);

    /* Restore saved progress after mount (avoids a hydration mismatch) */
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) setChecked(JSON.parse(raw));
        } catch {
            /* storage unavailable: progress just won't persist */
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
        } catch {
            /* ignore */
        }
    }, [checked, loaded]);

    const total = useMemo(() => SEO_GROUPS.reduce((n, g) => n + g.tasks.length, 0), []);
    const done = useMemo(
        () => SEO_GROUPS.reduce((n, g) => n + g.tasks.filter((t) => checked[t.id]).length, 0),
        [checked],
    );
    const pct = total ? Math.round((done / total) * 100) : 0;

    const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    const reset = () => setChecked({});

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                {/* ── Header ── */}
                <header className={styles.header}>
                    <p className={styles.eyebrow}>Internal · Dev only</p>
                    <h1 className={styles.title}>SEO &amp; Google Checklist</h1>
                    <p className={styles.subtitle}>
                        The technical basics are in place. For a two-location butcher shop, most of the remaining
                        gains are off the site. Work through these roughly in order.
                    </p>

                    <div className={styles.progressRow}>
                        <div
                            className={styles.progressTrack}
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={total}
                            aria-valuenow={done}
                            aria-label="Checklist progress"
                        >
                            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={styles.progressLabel}>
                            {done} of {total} done
                        </span>
                        <button type="button" className={styles.resetBtn} onClick={reset} disabled={done === 0}>
                            Reset
                        </button>
                    </div>
                </header>

                {/* ── Already covered ── */}
                <section className={styles.section} aria-labelledby="seo-done-heading">
                    <div className={styles.sectionHead}>
                        <span className={styles.sectionNum}>00</span>
                        <div>
                            <h2 id="seo-done-heading" className={styles.sectionTitle}>Already Covered</h2>
                            <p className={styles.sectionIntro}>Handled in the earlier technical pass.</p>
                        </div>
                    </div>
                    <ul className={styles.doneGrid}>
                        {DONE_BASICS.map((item) => (
                            <li key={item} className={styles.doneItem}>
                                <span className={styles.doneTick} aria-hidden="true">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── Task groups ── */}
                {SEO_GROUPS.map((group, i) => {
                    const groupDone = group.tasks.filter((t) => checked[t.id]).length;
                    return (
                        <section key={group.id} className={styles.section} aria-labelledby={`seo-${group.id}-heading`}>
                            <div className={styles.sectionHead}>
                                <span className={styles.sectionNum}>{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <div className={styles.sectionTitleRow}>
                                        <h2 id={`seo-${group.id}-heading`} className={styles.sectionTitle}>
                                            {group.title}
                                        </h2>
                                        <span className={group.where === 'On-site' ? styles.badgeOn : styles.badgeOff}>
                                            {group.where}
                                        </span>
                                        <span className={styles.count}>
                                            {groupDone}/{group.tasks.length}
                                        </span>
                                    </div>
                                    <p className={styles.sectionTag}>{group.tag}</p>
                                    <p className={styles.sectionIntro}>{group.intro}</p>
                                </div>
                            </div>

                            <ul className={styles.taskGrid}>
                                {group.tasks.map((task) => {
                                    const isDone = !!checked[task.id];
                                    return (
                                        <li key={task.id} className={`${styles.task} ${isDone ? styles.taskDone : ''}`}>
                                            <label className={styles.taskLabel}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkbox}
                                                    checked={isDone}
                                                    onChange={() => toggle(task.id)}
                                                />
                                                <span className={styles.taskTitle}>{task.title}</span>
                                            </label>
                                            <p className={styles.taskDetail}>{task.detail}</p>
                                            {task.links && task.links.length > 0 && (
                                                <div className={styles.taskLinks}>
                                                    {task.links.map((l) =>
                                                        l.external ? (
                                                            <a
                                                                key={l.href}
                                                                href={l.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.taskLink}
                                                            >
                                                                {l.label} ↗
                                                            </a>
                                                        ) : (
                                                            <Link key={l.href} href={l.href} className={styles.taskLink}>
                                                                {l.label} →
                                                            </Link>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    );
                })}
            </div>
        </main>
    );
}

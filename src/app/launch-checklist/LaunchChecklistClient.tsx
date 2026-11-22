'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export interface LaunchItem {
    id: string;
    title: string;
    detail: string;
    done: boolean;
    priority: 'required' | 'optional';
    envKeys?: string[];
    envSnippet?: string;
    externalHref?: string;
    externalLabel?: string;
    actionHref?: string;
    actionLabel?: string;
    steps?: string[];
}

export interface ManualTask {
    id: string;
    title: string;
    detail: string;
    href?: string;
    hrefLabel?: string;
}

interface LaunchChecklistClientProps {
    items: LaunchItem[];
    manualTasks: ManualTask[];
}

const STORAGE_KEY = 'hofherr-launch-manual-tasks-v1';

export default function LaunchChecklistClient({ items, manualTasks }: LaunchChecklistClientProps) {
    const [filter, setFilter] = useState<'needed' | 'required' | 'optional' | 'done'>('needed');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [checkedManual, setCheckedManual] = useState<Record<string, boolean>>({});

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) setCheckedManual(JSON.parse(raw) as Record<string, boolean>);
        } catch {
            // ignore storage errors
        }
    }, []);

    const toggleManual = (id: string) => {
        const next = { ...checkedManual, [id]: !checkedManual[id] };
        setCheckedManual(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // ignore storage errors
        }
    };

    const copySnippet = async (id: string, snippet: string) => {
        try {
            await navigator.clipboard.writeText(snippet);
            setCopiedId(id);
            window.setTimeout(() => setCopiedId(null), 2000);
        } catch {
            // clipboard unavailable
        }
    };

    const neededCount = items.filter(i => !i.done).length;
    const requiredNeededCount = items.filter(i => !i.done && i.priority === 'required').length;
    const optionalNeededCount = items.filter(i => !i.done && i.priority === 'optional').length;
    const doneCount = items.filter(i => i.done).length;
    const manualDoneCount = manualTasks.filter(t => checkedManual[t.id]).length;

    const visibleItems = items.filter(item => {
        if (filter === 'needed') return !item.done;
        if (filter === 'required') return !item.done && item.priority === 'required';
        if (filter === 'optional') return !item.done && item.priority === 'optional';
        return item.done;
    });

    return (
        <>
            <div className={styles.filterBar} role="tablist" aria-label="Filter launch items">
                <button
                    type="button"
                    role="tab"
                    aria-selected={filter === 'needed'}
                    className={`${styles.filterBtn} ${filter === 'needed' ? styles.filterBtnActive : ''}`}
                    onClick={() => setFilter('needed')}
                >
                    Still Needed ({neededCount})
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={filter === 'required'}
                    className={`${styles.filterBtn} ${filter === 'required' ? styles.filterBtnActive : ''}`}
                    onClick={() => setFilter('required')}
                >
                    Required for Launch ({requiredNeededCount})
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={filter === 'optional'}
                    className={`${styles.filterBtn} ${filter === 'optional' ? styles.filterBtnActive : ''}`}
                    onClick={() => setFilter('optional')}
                >
                    Optional Growth ({optionalNeededCount})
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={filter === 'done'}
                    className={`${styles.filterBtn} ${filter === 'done' ? styles.filterBtnActive : ''}`}
                    onClick={() => setFilter('done')}
                >
                    Already Live ✓ ({doneCount})
                </button>
            </div>

            {visibleItems.length === 0 ? (
                <div className={styles.emptyCard}>
                    ✓ Nothing left in this category!
                </div>
            ) : (
                <div className={styles.checkGrid}>
                    {visibleItems.map(item => (
                        <article
                            key={item.id}
                            className={`${styles.checkCard} ${item.done ? styles.checkCardDone : item.priority === 'required' ? styles.checkCardRequired : ''}`}
                        >
                            <div className={styles.checkTop}>
                                <span
                                    className={
                                        item.done
                                            ? styles.statusDone
                                            : item.priority === 'required'
                                              ? styles.statusReq
                                              : styles.statusOpt
                                    }
                                >
                                    {item.done
                                        ? '✓ LIVE'
                                        : item.priority === 'required'
                                          ? '● REQUIRED FOR LAUNCH'
                                          : '○ OPTIONAL / GROWTH'}
                                </span>
                                <div className={styles.cardLinks}>
                                    {item.externalHref && (
                                        <a
                                            href={item.externalHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.cardLink}
                                        >
                                            {item.externalLabel}
                                        </a>
                                    )}
                                    {item.actionHref && (
                                        <Link href={item.actionHref} className={styles.cardLink}>
                                            {item.actionLabel}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <h3 className={styles.checkTitle}>{item.title}</h3>
                            <p className={styles.checkDetail}>{item.detail}</p>

                            {item.steps && item.steps.length > 0 && (
                                <ol className={styles.stepsList}>
                                    {item.steps.map(step => (
                                        <li key={step}>{step}</li>
                                    ))}
                                </ol>
                            )}

                            {item.envSnippet && (
                                <div className={styles.snippetBox}>
                                    <pre className={styles.snippetCode}>{item.envSnippet}</pre>
                                    <button
                                        type="button"
                                        className={styles.copySnippetBtn}
                                        onClick={() => void copySnippet(item.id, item.envSnippet!)}
                                    >
                                        {copiedId === item.id ? '✓ Copied' : 'Copy .env'}
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}

            <div className={styles.preFlightBox}>
                <div className={styles.preFlightHead}>
                    <h3 className={styles.preFlightTitle}>
                        Manual Pre-Launch Tasks ({manualDoneCount}/{manualTasks.length} Done)
                    </h3>
                    <span className={styles.preFlightSub}>Click to check off as you finish each one</span>
                </div>
                <ul className={styles.manualList}>
                    {manualTasks.map(task => {
                        const checked = Boolean(checkedManual[task.id]);
                        return (
                            <li key={task.id} className={styles.manualItem}>
                                <label className={`${styles.manualLabel} ${checked ? styles.manualLabelDone : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleManual(task.id)}
                                        className={styles.manualCheckbox}
                                    />
                                    <span className={styles.manualBody}>
                                        <strong>{task.title}</strong>
                                        <span className={styles.manualDetail}>{task.detail}</span>
                                    </span>
                                </label>
                                {task.href && (
                                    <Link href={task.href} className={styles.cardLink}>
                                        {task.hrefLabel}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}


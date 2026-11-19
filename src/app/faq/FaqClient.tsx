'use client';

import { useState } from 'react';
import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './page.module.css';

type FaqGroup = { category: string; items: { q: string; a: string }[] };

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

export default function FaqClient({ faqs }: { faqs: FaqGroup[] }) {
    const [open, setOpen] = useState<string | null>(
        faqs[0]?.items[0] ? `${faqs[0].category}-0` : null
    );
    const toggle = (key: string) => setOpen((prev) => (prev === key ? null : key));

    return (
        <main className={styles.page}>
            {/* ── Hero ── */}
            <header className={styles.hero}>
                <h1 className={styles.headline}>
                    Frequently Asked <em>Questions</em>
                </h1>
                <p className={styles.sub}>
                    Can&apos;t find your answer? Call us at{' '}
                    <a href="tel:8474416328">(847) 441-MEAT</a> — a real person will pick up.
                </p>
            </header>

            {/* ── Editorial Split FAQ ── */}
            <section
                id="faq-content"
                aria-label="Frequently Asked Questions by Category"
                className={`section ${styles.faqSection}`}
            >
                <div className="container">
                    <div className={styles.splitWrap}>
                        {faqs.map((cat, gIdx) => (
                            <div key={cat.category} id={cat.category} className={styles.splitBand}>
                                <div className={styles.splitLeft}>
                                    <span className={styles.splitNum}>
                                        {String(gIdx + 1).padStart(2, '0')}
                                    </span>
                                    <h2 className={styles.splitTitle}>{cat.category}</h2>
                                    <span className={styles.splitMeta}>
                                        {cat.items.length} answers
                                    </span>
                                </div>
                                <div className={styles.splitRight}>
                                    {cat.items.map((item, i) => {
                                        const key = `${cat.category}-${i}`;
                                        const isOpen = open === key;
                                        return (
                                            <div
                                                key={key}
                                                className={`${styles.splitRow} ${isOpen ? styles.splitRowOpen : ''}`}
                                            >
                                                <button
                                                    type="button"
                                                    className={styles.splitTrigger}
                                                    onClick={() => toggle(key)}
                                                    aria-expanded={isOpen}
                                                >
                                                    <span>{item.q}</span>
                                                    <ChevronIcon open={isOpen} />
                                                </button>
                                                <div className={styles.answerOuter}>
                                                    <div className={styles.answerInner}>
                                                        <div className={styles.splitAnswer}>
                                                            <p>{item.a}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section id="faq-cta" aria-labelledby="faq-cta-heading" className={`section-sm ${styles.cta}`}>
                <div className="container">
                    <h2 id="faq-cta-heading">Ready to come in?</h2>
                    <p>300 Happ Rd, Northfield Square · Tue–Fri 10am–6pm · Sat 10am–5pm · Sun 10am–4pm</p>
                    <div className={styles.ctaBtns}>
                        <Link href="/online-orders" className="btn-hit">
                            <span className="btn btn-primary">
                                <FireBorder active={true} radius={6} />
                                Order Online
                            </span>
                        </Link>
                        <Link href="/visit" className="btn-hit">
                            <span className="btn btn-secondary">Get Directions</span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

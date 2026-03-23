'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

type FaqGroup = { category: string; items: { q: string; a: string }[] };

export default function FaqClient({ faqs }: { faqs: FaqGroup[] }) {
    const [open, setOpen] = useState<string | null>(null);
    const toggle = (key: string) => setOpen((prev) => (prev === key ? null : key));

    return (
        <main className={styles.page}>
            {/* ── Hero ── */}
            <section className={styles.hero}>
                <p className={styles.eyebrow}>Everything you need to know</p>
                <h1 className={styles.headline}>Frequently Asked Questions</h1>
                <p className={styles.sub}>
                    Can&apos;t find your answer? Call us at <a href="tel:8474416328">(847) 441-MEAT</a> — a real person will pick up.
                </p>
            </section>

            {/* ── FAQ accordion ── */}
            <section className={styles.faqSection}>
                <div className="container">
                    <div className={styles.faqGrid}>
                        {/* Sticky sidebar nav */}
                        <aside className={styles.sidebar}>
                            {faqs.map((cat) => (
                                <a key={cat.category} href={`#${cat.category}`} className={styles.sideLink}>
                                    {cat.category}
                                </a>
                            ))}
                            <div className={styles.sideCard}>
                                <p>Still have a question?</p>
                                <a
                                    href="tel:8474416328"
                                    className="btn btn-primary"
                                    style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}
                                >
                                    📞 Call Us
                                </a>
                                <Link
                                    href="/online-orders"
                                    className="btn btn-secondary"
                                    style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}
                                >
                                    Order Online
                                </Link>
                            </div>
                        </aside>

                        {/* Accordion */}
                        <div className={styles.accordion}>
                            {faqs.map((cat) => (
                                <div key={cat.category} id={cat.category} className={styles.group}>
                                    <h2 className={styles.groupTitle}>{cat.category}</h2>
                                    {cat.items.map((item, i) => {
                                        const key = `${cat.category}-${i}`;
                                        const isOpen = open === key;
                                        return (
                                            <div key={key} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                                                <button
                                                    className={styles.question}
                                                    onClick={() => toggle(key)}
                                                    aria-expanded={isOpen}
                                                >
                                                    <span>{item.q}</span>
                                                    <svg
                                                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M6 9l6 6 6-6" />
                                                    </svg>
                                                </button>
                                                {isOpen && (
                                                    <div className={styles.answer}>
                                                        <p>{item.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className={styles.cta}>
                <div className="container">
                    <h2>Ready to come in?</h2>
                    <p>300 Happ Rd, Northfield Square · Tue–Fri 10am–6pm · Sat 10am–5pm · Sun 10am–4pm</p>
                    <div className={styles.ctaBtns}>
                        <Link href="/visit" className="btn btn-primary">
                            Get Directions
                        </Link>
                        <Link href="/online-orders" className="btn btn-primary">
                            Order Online
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

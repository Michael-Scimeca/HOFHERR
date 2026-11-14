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
            <header className={styles.hero}>
                <h1 className={styles.headline}>Frequently Asked Questions</h1>
                <p className={styles.sub}>
                    Can&apos;t find your answer? Call us at <a href="tel:8474416328">(847) 441-MEAT</a> — a real person will pick up.
                </p>
            </header>

            {/* ── FAQ accordion ── */}
            <section id="faq-content" aria-label="Frequently Asked Questions by Category" className={`section ${styles.faqSection}`}>
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
                                    className={`btn-hit ${styles.sideBtn}`}
                                >
                                    <span className="btn btn-gold">📞 Call Us</span>
                                </a>
                                <Link
                                    href="/online-orders"
                                    className={`btn-hit ${styles.sideBtn}`}
                                >
                                    <span className="btn btn-gold">Order Online</span>
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
                                                <div className={styles.answerOuter}>
                                                    <div className={styles.answerInner}>
                                                        <div className={styles.answer}>
                                                            <p>{item.a}</p>
                                                        </div>
                                                    </div>
                                                </div>
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
            <section id="faq-cta" aria-labelledby="faq-cta-heading" className={`section-sm ${styles.cta}`}>
                <div className="container">
                    <h2 id="faq-cta-heading">Ready to come in?</h2>
                    <p>300 Happ Rd, Northfield Square · Tue–Fri 10am–6pm · Sat 10am–5pm · Sun 10am–4pm</p>
                    <div className={styles.ctaBtns}>
                        <Link href="/visit" className="btn-hit">
                            <span className="btn btn-gold">Get Directions</span>
                        </Link>
                        <Link href="/online-orders" className="btn-hit">
                            <span className="btn btn-gold">Order Online</span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

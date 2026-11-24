'use client';

import { useState } from 'react';
import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import ContactLink from '@/components/ContactLink';
import PageHero from '@/components/PageHero';
import legalStyles from '../(legal)/legal.module.css';
import styles from './page.module.css';

type FaqGroup = { category: string; items: { q: string; a: string }[] };

function toAnchorId(label: string): string {
    return label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

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

    const tocItems = [
        ...faqs.map((cat, idx) => ({
            id: toAnchorId(cat.category),
            index: `${idx + 1}.`,
            label: cat.category,
        })),
        {
            id: 'questions-contact',
            index: `${faqs.length + 1}.`,
            label: 'Questions & Contact',
        },
    ];

    return (
        <main className={legalStyles.pageWrap}>
            {/* ── Hero (Matches /terms & /privacy) ── */}
            <PageHero
                title={
                    <>
                        Frequently Asked <em>Questions</em>
                    </>
                }
                lead={
                    <>
                        Can&apos;t find your answer? Call us at{' '}
                        <ContactLink kind="phone" className={legalStyles.contactLink} /> — a real butcher behind the
                        counter will pick up.
                    </>
                }
            >
                <p className={legalStyles.effective}>
                    Northfield &amp; Winnetka, IL &middot; Ordering, Custom Cuts &amp; Catering
                </p>
            </PageHero>

            {/* ── Sticky Sidebar + Document Surface (Matches /terms) ── */}
            <section id="faq-content" aria-labelledby="faq-content-heading" className="section">
                <div className="container">
                    <div className={legalStyles.legalGrid}>
                        <aside className={legalStyles.sidebar} aria-label="FAQ navigation">
                            <nav className={legalStyles.sidebarPanel} aria-label="FAQ sections">
                                <h2 className={legalStyles.sidebarHeading}>On This Page</h2>
                                <ol className={legalStyles.tocList}>
                                    {tocItems.map((item) => (
                                        <li key={item.id}>
                                            <a href={`#${item.id}`} className={legalStyles.tocLink}>
                                                <span className={legalStyles.tocIndex}>{item.index}</span>
                                                <span>{item.label}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            <nav className={legalStyles.sidebarPanel} aria-label="Help and policies">
                                <h2 className={legalStyles.sidebarHeading}>Help &amp; Policies</h2>
                                <ul className={legalStyles.policyList}>
                                    <li>
                                        <Link
                                            href="/faq"
                                            aria-current="page"
                                            className={`${legalStyles.policyLink} ${legalStyles.policyLinkActive}`}
                                        >
                                            <span>FAQ</span>
                                            <span className={legalStyles.policyBadge}>Current</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/terms" className={legalStyles.policyLink}>
                                            <span>Terms of Service</span>
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/privacy" className={legalStyles.policyLink}>
                                            <span>Privacy Policy</span>
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </aside>

                        <article className={legalStyles.documentSurface} aria-labelledby="faq-content-heading">
                            <div className={legalStyles.docHeader}>
                                <h2 id="faq-content-heading" className={legalStyles.docHeading}>
                                    Counter, Ordering &amp; Catering Answers
                                </h2>
                                <span className={legalStyles.docMeta}>
                                    {faqs.reduce((sum, g) => sum + g.items.length, 0)} Answers
                                </span>
                            </div>

                            <div className={legalStyles.clauseListWrap}>
                                {faqs.map((cat, gIdx) => {
                                    const sectionId = toAnchorId(cat.category);
                                    return (
                                        <div key={cat.category} id={sectionId} className={legalStyles.clause}>
                                            <h3 className={legalStyles.clauseHeading}>
                                                {gIdx + 1}. {cat.category}
                                            </h3>
                                            <div className={styles.accordionList}>
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
                                    );
                                })}
                            </div>

                            <div id="questions-contact" className={legalStyles.contactBlock}>
                                <h3 className={legalStyles.contactTitle}>Still got questions? Just ask.</h3>
                                <p className={legalStyles.contactLead}>Hofherr Meat Co.</p>
                                <div className={legalStyles.contactDetails}>
                                    <div className={legalStyles.contactRow}>
                                        <span className={legalStyles.contactIcon} aria-hidden="true">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </span>
                                        <a
                                            href="https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={legalStyles.contactLink}
                                        >
                                            300 Happ Rd, Northfield, IL 60093
                                        </a>
                                    </div>

                                    <div className={legalStyles.contactRow}>
                                        <span className={legalStyles.contactIcon} aria-hidden="true">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </span>
                                        <a href="tel:8474416328" className={legalStyles.contactLink}>
                                            (847) 441-6328
                                        </a>
                                    </div>

                                    <div className={legalStyles.contactRow}>
                                        <span className={legalStyles.contactIcon} aria-hidden="true">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </span>
                                        <a href="mailto:butcher@hofherrmeatco.com" className={legalStyles.contactLink}>
                                            butcher@hofherrmeatco.com
                                        </a>
                                    </div>
                                </div>

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
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}

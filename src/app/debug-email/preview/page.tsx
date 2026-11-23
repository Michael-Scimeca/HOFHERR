import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    buildWelcomeEmail,
    buildNewsletterWelcomeEmail,
    buildVerifyEmail,
    buildPasswordResetEmail,
    buildOrderConfirmationEmail,
    buildRestockFilledEmail,
} from '@/lib/email-templates';
import SendTestBar from './SendTestBar';
import styles from './preview.module.css';

// Block access in production — debug tools should never be publicly accessible
const IS_DEV = process.env.NODE_ENV === 'development';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Email Template Preview', robots: { index: false, follow: false } };

export default async function EmailPreviewPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
    if (!IS_DEV) return notFound();
    const params = await searchParams;
    const template = params.template || 'all';

    const orderEmail = buildOrderConfirmationEmail({
        orderNumber: 'A7F3BC21',
        items: [
            { name: 'Bone-In Ribeye (16 oz)', price: '$24.99', qty: 2, note: 'Cut 1.5" thick, extra marbled' },
            { name: 'Baby Back Ribs (Full Rack)', price: '$19.99', qty: 1 },
            { name: 'Hofherr Signature Burger Blend', price: '$8.99', qty: 3 },
            { name: 'Fresh Italian Sausage (1 lb)', price: '$7.49', qty: 2 },
        ],
        contact: {
            name: 'Sean Hofherr',
            email: 'sean@hofherrmeatco.com',
            phone: '(847) 555-0100',
            pickup: 'Wed, Nov 25 at 3:00 PM',
        },
        storeId: 'butcher',
        tipAmount: 5,
        coupon: { code: 'SPRING10', type: 'percent', value: 10 },
        baseUrl: 'https://hofherrmeatco.com',
    });

    const allTemplates = [
        {
            id: 'welcome',
            label: '01 · Welcome Email',
            badge: 'NEW ACCOUNT',
            description: 'Sent right after a customer creates a Hofherr Meat Co. account.',
            ...buildWelcomeEmail('Sean Hofherr', 'sean@hofherrmeatco.com'),
        },
        {
            id: 'verify',
            label: '02 · Verify Email',
            badge: 'AUTH · SIGN UP',
            description: 'Sent on registration with a 24-hour verification link.',
            ...buildVerifyEmail('Sean Hofherr', 'sean@hofherrmeatco.com', 'https://hofherrmeatco.com/verify-email?token=abc123def456'),
        },
        {
            id: 'reset',
            label: '03 · Reset Password',
            badge: 'AUTH · RECOVERY',
            description: 'Sent from Forgot Password with a 1-hour secure reset button.',
            ...buildPasswordResetEmail('sean@hofherrmeatco.com', 'https://hofherrmeatco.com/reset-password?token=reset987xyz&email=sean%40hofherrmeatco.com'),
        },
        {
            id: 'order',
            label: '04 · Order Confirmation',
            badge: 'CHECKOUT RECEIPT',
            description: 'Itemized butcher ticket, pickup window, estimated total, and unlocked Cut Collector pieces.',
            subject: orderEmail.subject,
            html: orderEmail.html,
            text: orderEmail.text,
        },
        {
            id: 'restock',
            label: '05 · Restock Alert Filled',
            badge: 'BACK IN STOCK',
            description: 'Sent when an admin marks a customer’s requested cut back in stock.',
            ...buildRestockFilledEmail({
                customerName: 'Sean Hofherr',
                item: '45-Day Dry-Aged Bone-In Ribeye',
                qty: 2,
                store: 'butcher',
                baseUrl: 'https://hofherrmeatco.com',
            }),
        },
        {
            id: 'newsletter',
            label: '06 · Newsletter Welcome',
            badge: 'BUTCHER DISPATCH',
            description: 'Sent immediately when a visitor joins the weekly Butcher Dispatch.',
            ...buildNewsletterWelcomeEmail('sean@hofherrmeatco.com', 'Sean'),
        },
    ];

    const isAll = template === 'all';
    const selected = allTemplates.find(t => t.id === template) || allTemplates[0];

    return (
        <main className={styles.page}>
            <div className={styles.inner}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Live Transactional Email Suite</h1>
                    <p className={styles.sub}>
                        All 6 automated Hofherr Meat Co. emails unified in the Editorial Steakhouse style (obsidian card, 5px crimson left rail, gold numbered steps, full-width crimson CTA).
                    </p>
                </header>

                <SendTestBar activeTemplate={template} />

                <div className={styles.tabGroup}>
                    <span className={styles.tabGroupLabel}>All 6 Automated Email Templates</span>
                    <div className={styles.tabRow}>
                        <Link
                            href="/debug-email/preview?template=all"
                            className={`${styles.tab} ${isAll ? styles.tabActive : ''}`}
                        >
                            ✨ View All 6 Side-by-Side
                        </Link>
                        {allTemplates.map(t => (
                            <Link
                                key={t.id}
                                href={`/debug-email/preview?template=${t.id}`}
                                className={`${styles.tab} ${template === t.id ? styles.tabActive : ''}`}
                            >
                                {t.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {isAll ? (
                    <section aria-label="All 6 transactional email templates" className={styles.galleryGrid}>
                        {allTemplates.map(t => (
                            <article key={t.id} className={styles.galleryCard}>
                                <div className={styles.galleryCardHead}>
                                    <div className={styles.galleryCardTop}>
                                        <h2 className={styles.galleryCardTitle}>{t.label}</h2>
                                        <span className={styles.badge}>{t.badge}</span>
                                    </div>
                                    <p className={styles.galleryCardDesc}>{t.description}</p>
                                    <div className={styles.galleryCardActions}>
                                        <span>Subject: {t.subject}</span>
                                        <Link
                                            href={`/debug-email/preview?template=${t.id}`}
                                            className={styles.openFullLink}
                                        >
                                            Full Preview →
                                        </Link>
                                    </div>
                                </div>
                                <iframe
                                    title={t.label}
                                    sandbox="allow-same-origin"
                                    srcDoc={t.html}
                                    className={styles.emailIframe}
                                />
                            </article>
                        ))}
                    </section>
                ) : (
                    <>
                        <div className={styles.subjectBar}>
                            <div>
                                <strong>Subject:</strong> {selected.subject}
                            </div>
                            <span className={styles.badge}>{selected.badge}</span>
                        </div>

                        <div className={styles.singleFrame}>
                            <iframe
                                title={`Email preview: ${selected.subject}`}
                                sandbox="allow-same-origin"
                                srcDoc={selected.html}
                                className={styles.emailIframeTall}
                            />
                        </div>

                        <details className={styles.plainDetails}>
                            <summary>Plain Text Version</summary>
                            <pre className={styles.plainPre}>{selected.text}</pre>
                        </details>
                    </>
                )}
            </div>
        </main>
    );
}

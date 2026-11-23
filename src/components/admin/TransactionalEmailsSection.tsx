'use client';

import { useMemo, useState } from 'react';
import {
    buildWelcomeEmail,
    buildVerifyEmail,
    buildPasswordResetEmail,
    buildOrderConfirmationEmail,
    buildRestockFilledEmail,
    buildNewsletterWelcomeEmail,
} from '@/lib/email-templates';
import styles from './TransactionalEmailsSection.module.css';

export default function TransactionalEmailsSection() {
    const [activeId, setActiveId] = useState<string>('all');
    const [testTo, setTestTo] = useState('mikeyscimeca.dev@gmail.com');
    const [sending, setSending] = useState<'all' | 'one' | null>(null);
    const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

    const templates = useMemo(() => {
        const sampleEmail = 'sean@hofherrmeatco.com';
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
                email: sampleEmail,
                phone: '(847) 555-0100',
                pickup: 'Wed, Nov 25 at 3:00 PM',
            },
            storeId: 'butcher',
            tipAmount: 5,
            coupon: { code: 'SPRING10', type: 'percent', value: 10 },
            baseUrl: 'https://hofherrmeatco.com',
        });

        return [
            {
                id: 'welcome',
                label: '01 · Welcome Email',
                badge: 'NEW ACCOUNT',
                description: 'Sent right after a customer creates a Hofherr Meat Co. account.',
                ...buildWelcomeEmail('Sean Hofherr', sampleEmail),
            },
            {
                id: 'verify',
                label: '02 · Verify Email',
                badge: 'AUTH · SIGN UP',
                description: 'Sent on registration with a 24-hour verification button.',
                ...buildVerifyEmail('Sean Hofherr', sampleEmail, 'https://hofherrmeatco.com/verify-email?token=abc123def456'),
            },
            {
                id: 'reset',
                label: '03 · Reset Password',
                badge: 'AUTH · RECOVERY',
                description: 'Sent from Forgot Password with a 1-hour secure reset link.',
                ...buildPasswordResetEmail(sampleEmail, 'https://hofherrmeatco.com/reset-password?token=reset987xyz&email=sean%40hofherrmeatco.com'),
            },
            {
                id: 'order',
                label: '04 · Order Confirmation',
                badge: 'CHECKOUT RECEIPT',
                description: 'Itemized cut ticket, pickup window, estimated total, and unlocked Cut Collector pieces.',
                subject: orderEmail.subject,
                html: orderEmail.html,
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
                ...buildNewsletterWelcomeEmail(sampleEmail, 'Sean'),
            },
        ];
    }, []);

    const handleSendTest = async (mode: 'all' | 'one') => {
        if (!testTo.trim()) return;
        setSending(mode);
        setFeedback(null);
        try {
            const templateKey = mode === 'all' ? 'all' : activeId === 'all' ? 'all' : activeId;
            const res = await fetch('/api/debug-email/send-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: testTo.trim(), template: templateKey }),
            });
            const data = (await res.json()) as {
                ok?: boolean;
                sentCount?: number;
                total?: number;
                error?: string;
            };
            if (!res.ok) {
                setFeedback({ ok: false, text: data.error || 'Failed to send test email.' });
                return;
            }
            setFeedback({
                ok: Boolean(data.ok),
                text: data.ok
                    ? `Sent ${data.sentCount}/${data.total} real Resend test email${data.total === 1 ? '' : 's'} to ${testTo.trim()}.`
                    : `Sent ${data.sentCount}/${data.total} — check Resend configuration.`,
            });
        } catch {
            setFeedback({ ok: false, text: 'Network error while sending Resend test.' });
        } finally {
            setSending(null);
        }
    };

    const selected = templates.find(t => t.id === activeId) || templates[0];

    return (
        <section
            id="automated-emails-section"
            aria-labelledby="automated-emails-heading"
            className={styles.section}
        >
            <div className={styles.headerRow}>
                <div>
                    <h2 id="automated-emails-heading" className={styles.title}>
                        Automated Transactional Emails (6)
                    </h2>
                    <p className={styles.sub}>
                        Live Editorial Steakhouse templates sent automatically for signups, verifications, password resets, orders, restocks, and newsletter opt-ins.
                    </p>
                </div>
            </div>

            <div className={styles.sendBar}>
                <div className={styles.sendRow}>
                    <input
                        type="email"
                        value={testTo}
                        onChange={e => setTestTo(e.target.value)}
                        placeholder="Recipient email for Resend test…"
                        aria-label="Recipient email for automated email Resend test"
                        className={styles.sendInput}
                    />
                    {activeId !== 'all' && (
                        <button
                            type="button"
                            disabled={sending !== null || !testTo.trim()}
                            onClick={() => void handleSendTest('one')}
                            className={styles.sendBtnSecondary}
                        >
                            {sending === 'one' ? 'Sending…' : '✉️ Send Selected'}
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={sending !== null || !testTo.trim()}
                        onClick={() => void handleSendTest('all')}
                        className={styles.sendBtnPrimary}
                    >
                        {sending === 'all' ? 'Sending All 6…' : '🚀 Send All 6 via Resend'}
                    </button>
                </div>
                {feedback && (
                    <div className={feedback.ok ? styles.sendOk : styles.sendErr} role="status">
                        {feedback.text}
                    </div>
                )}
            </div>

            <div className={styles.tabRow} role="tablist" aria-label="Automated email templates">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeId === 'all'}
                    className={`${styles.tab} ${activeId === 'all' ? styles.tabActive : ''}`}
                    onClick={() => setActiveId('all')}
                >
                    ✨ View All 6 Side-by-Side
                </button>
                {templates.map(t => (
                    <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={activeId === t.id}
                        className={`${styles.tab} ${activeId === t.id ? styles.tabActive : ''}`}
                        onClick={() => setActiveId(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {activeId === 'all' ? (
                <div className={styles.galleryGrid}>
                    {templates.map(t => (
                        <article key={t.id} className={styles.card}>
                            <div className={styles.cardHead}>
                                <div className={styles.cardTop}>
                                    <h3 className={styles.cardTitle}>{t.label}</h3>
                                    <span className={styles.badge}>{t.badge}</span>
                                </div>
                                <p className={styles.cardDesc}>{t.description}</p>
                                <div className={styles.cardActions}>
                                    <span>Subject: {t.subject}</span>
                                    <button
                                        type="button"
                                        className={styles.openBtn}
                                        onClick={() => setActiveId(t.id)}
                                    >
                                        Full Preview →
                                    </button>
                                </div>
                            </div>
                            <iframe
                                title={t.label}
                                sandbox="allow-same-origin"
                                srcDoc={t.html}
                                className={styles.iframe}
                            />
                        </article>
                    ))}
                </div>
            ) : (
                <div className={styles.singleWrap}>
                    <iframe
                        title={selected.label}
                        sandbox="allow-same-origin"
                        srcDoc={selected.html}
                        className={styles.iframeTall}
                    />
                </div>
            )}
        </section>
    );
}

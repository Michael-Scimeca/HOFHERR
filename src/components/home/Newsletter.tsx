'use client';
import { useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
    // ── Email state ──────────────────────────────────────────────
    const [emailName, setEmailName] = useState('');
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [emailError, setEmailError] = useState('');

    // ── Handler ─────────────────────────────────────────────────
    const handleEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setEmailStatus('loading');
        setEmailError('');
        try {
            const res = await fetch('/api/newsletter-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name: emailName }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setEmailError(data.error || 'Something went wrong.');
                setEmailStatus('error');
            } else {
                setEmailStatus('success');
            }
        } catch {
            setEmailError('Network error — please try again.');
            setEmailStatus('error');
        }
    };

    return (
        <section className={styles.section}>
            <div className={`container ${styles.inner}`}>

                {/* ── Left copy ── */}
                <div className={styles.left}>
                    <div className="section-label">Stay in the Loop</div>
                    <h2 className={styles.title}>
                        Get Specials <em>Before</em><br />Anyone Else
                    </h2>
                    <p className={styles.sub}>
                        Weekly picks, limited-time deals, holiday pre-order alerts, and seasonal specials —
                        delivered straight to your inbox. No spam. Unsubscribe anytime.
                    </p>
                    <div className={styles.perks}>
                        {[
                            '🥩 Weekly cut specials',
                            '🎉 Holiday pre-order access',
                            '⭐ Butcher\'s picks first',
                            '🎁 Member-only deals',
                        ].map(p => (
                            <div key={p} className={styles.perk}>{p}</div>
                        ))}
                    </div>
                </div>

                {/* ── Right form ── */}
                <div className={styles.right}>
                    {emailStatus === 'success' ? (
                        <div className={styles.success}>
                            <div className={styles.successIcon}>✅</div>
                            <h3>You&apos;re in!</h3>
                            <p>Check your inbox for a welcome email from Sean. First picks go out this Friday.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleEmail} className={styles.form}>
                            <div className={styles.formLabel}>Join 1,200+ Northshore meat lovers</div>
                            <input
                                type="text"
                                placeholder="Your first name"
                                value={emailName}
                                onChange={e => setEmailName(e.target.value)}
                                className={styles.input}
                                autoComplete="given-name"
                            />
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className={styles.input}
                                autoComplete="email"
                            />
                            {emailStatus === 'error' && (
                                <div className={styles.errorMsg}>⚠️ {emailError}</div>
                            )}
                            <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={emailStatus === 'loading'}>
                                {emailStatus === 'loading' ? 'Subscribing…' : 'Get Weekly Specials'}
                            </button>
                            <p className={styles.privacy}>No spam. Unsubscribe anytime. Sent every Friday.</p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

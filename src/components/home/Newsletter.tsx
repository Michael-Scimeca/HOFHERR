'use client';

import { useState } from 'react';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './Newsletter.module.css';

export default function Newsletter() {
    const [emailName, setEmailName] = useState('');
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [emailError, setEmailError] = useState('');

    const handleEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setEmailStatus('loading');
        setEmailError('');
        try {
            const res = await fetch('/api/newsletter-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), name: emailName.trim() }),
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
        <section
            id="newsletter"
            aria-labelledby="newsletter-heading"
            className={`section-sm ${styles.section}`}
        >
            <div className={`container ${styles.inner}`}>
                <div className={styles.header}>
                    <h2 id="newsletter-heading" className={styles.title}>
                        Get Specials <em>Before</em> Anyone Else
                    </h2>
                    <p className={styles.sub}>
                        Weekly picks, limited-time deals, holiday pre-order alerts, and seasonal specials
                        — delivered straight to your inbox.
                    </p>
                </div>

                {emailStatus === 'success' ? (
                    <div className={styles.success} role="status">
                        <h3 className={styles.successTitle}>You&apos;re in!</h3>
                        <p className={styles.successCopy}>
                            Check your inbox for a welcome email from Sean. First picks go out this Friday.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleEmail} className={styles.form}>
                        <div className={styles.formRow}>
                            <input
                                type="text"
                                placeholder="Your first name"
                                aria-label="First name"
                                value={emailName}
                                onChange={(e) => setEmailName(e.target.value)}
                                className={`${styles.input} ${styles.inputName}`}
                                autoComplete="given-name"
                            />
                            <input
                                type="email"
                                placeholder="Your email address"
                                aria-label="Email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailStatus === 'error') {
                                        setEmailStatus('idle');
                                        setEmailError('');
                                    }
                                }}
                                required
                                className={`${styles.input} ${styles.inputEmail}`}
                                autoComplete="email"
                            />
                            <button
                                type="submit"
                                className={`btn-hit ${styles.submitHit}`}
                                disabled={emailStatus === 'loading'}
                            >
                                <span className={`btn btn-primary ${styles.submitBtn}`}>
                                    <FireBorder active={true} radius={6} />
                                    <span>
                                        {emailStatus === 'loading' ? 'Subscribing…' : 'Get Weekly Specials'}
                                    </span>
                                </span>
                            </button>
                        </div>

                        {emailStatus === 'error' && (
                            <p className={styles.errorMsg} role="alert">
                                {emailError}
                            </p>
                        )}

                        <p className={styles.note}>
                            Join 1,200+ North Shore meat lovers · No spam · Unsubscribe anytime · Sent every Friday.
                        </p>
                    </form>
                )}
            </div>
        </section>
    );
}

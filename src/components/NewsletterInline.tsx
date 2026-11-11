'use client';

import { useState } from 'react';
import styles from './NewsletterInline.module.css';

export default function NewsletterInline() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const validateEmail = (val: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(val.trim());
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) {
            setEmailError('Please enter your email address.');
            return;
        }
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setEmailError('');
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), name: firstName.trim() }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setEmailError(data.error || 'Something went wrong.');
            } else {
                setDone(true);
            }
        } catch {
            setEmailError('Network error — please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrap}>
            {done ? (
                <div className={styles.success}>
                    <span className={styles.successIcon}>✅</span>
                    <div>
                        <div className={styles.successTitle}>You&apos;re in{firstName ? `, ${firstName}` : ''}!</div>
                        <p>Look for this Tuesday&apos;s specials in your inbox.</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className={styles.input}
                        aria-label="First name"
                        autoComplete="given-name"
                    />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                        }}
                        onBlur={() => {
                            if (email && !validateEmail(email)) {
                                setEmailError('Please enter a valid email address.');
                            }
                        }}
                        className={`${styles.input} ${emailError ? styles.inputError : ''}`}
                        required
                        aria-label="Email address"
                        autoComplete="email"
                        aria-invalid={!!emailError}
                    />
                    {emailError && (
                        <div className={styles.crimsonError} role="alert">
                            <span>⚠</span> {emailError}
                        </div>
                    )}
                    <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={loading}>
                        {loading ? 'Subscribing…' : "Subscribe — It's Free"}
                    </button>
                    <p className={styles.note}>One email per week. Unsubscribe any time.</p>
                </form>
            )}
        </div>
    );
}

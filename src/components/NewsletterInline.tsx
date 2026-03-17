'use client';

import { useState } from 'react';
import styles from './NewsletterInline.module.css';

export default function NewsletterInline() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [done, setDone] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (email) setDone(true);
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
                    />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={styles.input}
                        required
                        aria-label="Email address"
                    />
                    <button type="submit" className={`btn btn-primary ${styles.submit}`}>
                        Subscribe — It&apos;s Free
                    </button>
                    <p className={styles.note}>One email per week. Unsubscribe any time.</p>
                </form>
            )}
        </div>
    );
}

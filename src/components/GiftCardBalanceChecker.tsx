'use client';

import { useState } from 'react';
import styles from './GiftCardBalanceChecker.module.css';

export default function GiftCardBalanceChecker() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;
        setLoading(true);
        setError('');
        setBalance(null);
        try {
            const res = await fetch('/api/gift-cards/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code.trim() }),
            });
            const data = await res.json();
            if (!res.ok || !data.valid) {
                setError(data.error || 'Gift card code not found.');
            } else {
                setBalance(data.balanceFormatted);
            }
        } catch {
            setError('Network error — please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Check Your Gift Card Balance</h2>
            <p className={styles.sub}>
                Enter your Hofherr Meat Co. gift card code to check your remaining balance — valid in-store and at online checkout.
            </p>
            <form onSubmit={handleCheck} className={styles.form}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="HMC-XXXX-XXXX"
                    aria-label="Gift card code"
                    className={styles.input}
                />
                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? 'Checking…' : 'Check Balance'}
                </button>
            </form>
            {balance && (
                <div className={styles.resultOk} role="status">
                    Remaining Balance: <strong>{balance}</strong> — apply this code at online checkout or show it at the counter.
                </div>
            )}
            {error && (
                <div className={styles.resultErr} role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}


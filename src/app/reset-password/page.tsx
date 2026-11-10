'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const urlToken = searchParams.get('token') || '';
    const urlEmail = searchParams.get('email') || '';

    const [emailInput, setEmailInput] = useState('');
    const [tokenInput, setTokenInput] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sendingLink, setSendingLink] = useState(false);

    const effectiveEmail = emailInput || urlEmail;
    const effectiveToken = tokenInput || urlToken;

    const isMinLength = password.length >= 8;
    const isMatching = password.length > 0 && password === confirm;

    const handleSendResetLink = async () => {
        setError('');
        setNotice('');
        if (!effectiveEmail.trim()) {
            setError('Please enter your email address first.');
            return;
        }
        setSendingLink(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: effectiveEmail.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Could not send reset link.');
                return;
            }
            if (data.devToken) {
                setTokenInput(data.devToken);
                setNotice('Reset token generated — enter your new password below.');
            } else {
                setNotice('Reset link sent if an account exists, or set your new password directly below.');
            }
        } catch {
            setError('Failed to request password reset link.');
        } finally {
            setSendingLink(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setNotice('');

        if (!effectiveEmail.trim() && !effectiveToken.trim()) {
            setError('Please enter your email address.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: effectiveEmail.trim(),
                    token: effectiveToken.trim(),
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to update password.');
            } else {
                setSuccess(true);
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.resetCard}>
            <div className={styles.header}>
                <div className={styles.wordmark}>
                    <img src="/assets/logo.svg" alt="Hofherr Meat Co." />
                </div>
                <h1 className={styles.subtitle}>Reset Your Password</h1>
                <div className={styles.divider} />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {notice && <div className={styles.notice}>{notice}</div>}

            {success ? (
                <div className={styles.successWrap}>
                    <h2 className={styles.successTitle}>Password Updated</h2>
                    <p className={styles.successText}>
                        Your password has been saved. You can now sign in with your new credentials.
                    </p>
                    <Link href="/online-orders?login=true" className={styles.button}>
                        Sign In to Account
                    </Link>
                </div>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="reset-email" className={styles.label}>
                                Email Address
                            </label>
                            {effectiveToken && <span className={styles.labelHint}>Token active</span>}
                        </div>
                        <div className={styles.inputWithBtn}>
                            <input
                                id="reset-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                className={styles.input}
                                placeholder="you@hofherrmeats.com"
                                value={effectiveEmail}
                                onChange={e => setEmailInput(e.target.value)}
                                required={!effectiveToken}
                            />
                            <button
                                type="button"
                                onClick={handleSendResetLink}
                                disabled={sendingLink}
                                className={styles.sendTokenBtn}
                            >
                                {sendingLink ? 'Sending…' : 'Send Link'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="reset-password" className={styles.label}>
                                New Password
                            </label>
                            <span className={styles.labelHint}>8+ characters</span>
                        </div>
                        <div className={styles.passwordWrap}>
                            <input
                                id="reset-password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                autoComplete="new-password"
                                className={styles.input}
                                placeholder="••••••••"
                                minLength={8}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className={styles.toggleVisBtn}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="reset-confirm" className={styles.label}>
                            Confirm New Password
                        </label>
                        <div className={styles.passwordWrap}>
                            <input
                                id="reset-confirm"
                                type={showConfirm ? 'text' : 'password'}
                                name="confirmPassword"
                                autoComplete="new-password"
                                className={styles.input}
                                placeholder="••••••••"
                                minLength={8}
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(v => !v)}
                                className={styles.toggleVisBtn}
                            >
                                {showConfirm ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.rulesRow}>
                        <span className={`${styles.rulePill} ${isMinLength ? styles.rulePillValid : ''}`}>
                            {isMinLength ? '✓' : '○'} 8+ Characters
                        </span>
                        <span className={`${styles.rulePill} ${isMatching ? styles.rulePillValid : ''}`}>
                            {isMatching ? '✓' : '○'} Passwords Match
                        </span>
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Saving…' : 'Save New Password'}
                    </button>
                </form>
            )}

            <div className={styles.footer}>
                <Link href="/" className={styles.backLink}>
                    ← Back to Website
                </Link>
                <Link href="/admin/login" className={styles.backLink}>
                    Admin Login →
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className={styles.resetContainer}>
            {/* ── Left: Illustration panel ─────────────────────────────── */}
            <div className={styles.illustrationPanel}>
                <Image
                    src="/assets/identity/hofherr-wrapping-paper-print-hd.jpg"
                    alt="Hofherr Meat Co. printed butcher wrapping paper"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.illustrationImg}
                    priority
                />
                <div className={styles.illustrationBadge}>
                    <h2>HOFHERR MEAT CO.</h2>
                    <p>Account Recovery</p>
                </div>
            </div>

            {/* ── Right: Reset Password form ───────────────────────────── */}
            <div className={styles.formPanel}>
                <Suspense fallback={<div className={styles.resetCard} />}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </main>
    );
}

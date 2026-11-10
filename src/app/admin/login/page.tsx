'use client';

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './login.module.css';

export default function AdminLoginPage() {
    const { status } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotMode, setForgotMode] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState(false);

    const router = useRouter();
    const callbackUrl = '/admin';

    if (status === 'loading') {
        return <main className={styles.loginContainer} />;
    }

    const handleGodMode = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                email: 'godmode@hofherrmeats.com',
                password: 'hofherr-dev-god-mode',
                redirect: false,
                callbackUrl,
            });
            if (result?.error) {
                setError('Could not activate God Mode.');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('Failed to activate God Mode.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await signIn('credentials', { email, password, redirect: false, callbackUrl });
            if (result?.error) {
                setError('Invalid email or password. Please try again.');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setForgotSuccess(false);
        if (!email) {
            setError('Please enter your email address first.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to send reset link.');
            } else {
                setForgotSuccess(true);
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.loginContainer}>
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
                    <p>Admin Console</p>
                </div>
            </div>

            {/* ── Right: Login form ────────────────────────────────────── */}
            <div className={styles.formPanel}>
                <div className={styles.loginCard}>
                    <div className={styles.header}>
                        <div className={styles.wordmark}>
                            <img src="/assets/logo.svg" alt="Hofherr Meat Co." />
                        </div>
                        <div className={styles.subtitle}>Admin Dashboard Access</div>
                        <div className={styles.divider} />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    {forgotMode ? (
                        forgotSuccess ? (
                            <div className={styles.successWrap}>
                                <h3 className={styles.successTitle}>Check Your Email</h3>
                                <p className={styles.successText}>
                                    If an account exists for {email}, we&apos;ve sent a password reset link.
                                    <br />
                                    Please check your inbox and spam folder.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForgotMode(false);
                                        setForgotSuccess(false);
                                    }}
                                    className={styles.forgotLink}
                                >
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleForgot}>
                                <p className={styles.successText}>
                                    Enter your email and we&apos;ll send a secure reset link.
                                </p>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="forgot-email" className={styles.label}>
                                        Email Address
                                    </label>
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        className={styles.input}
                                        placeholder="admin@hofherrmeats.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className={styles.button} disabled={loading}>
                                    {loading ? 'Sending…' : 'Send Reset Link'}
                                </button>
                                <div className={styles.centerRow}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForgotMode(false);
                                            setError('');
                                        }}
                                        className={styles.forgotLink}
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        )
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="login-email" className={styles.label}>
                                    Email Address
                                </label>
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    className={styles.input}
                                    placeholder="admin@hofherrmeats.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="login-password" className={styles.label}>
                                    Password
                                </label>
                                <input
                                    id="login-password"
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    className={styles.input}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <div className={styles.forgotRow}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForgotMode(true);
                                            setError('');
                                        }}
                                        className={styles.forgotLink}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className={styles.button} disabled={loading}>
                                {loading ? 'Authenticating…' : 'Sign In to Dashboard'}
                            </button>

                            <button
                                type="button"
                                className={styles.godModeBtn}
                                onClick={handleGodMode}
                                disabled={loading}
                            >
                                ⚡ Enter God Mode (No Login)
                            </button>
                        </form>
                    )}

                    <div className={styles.footer}>
                        <Link href="/" className={styles.backLink}>
                            ← Back to Website
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

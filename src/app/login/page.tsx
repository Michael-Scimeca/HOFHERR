'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from '../reset-password/page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                email: email.trim(),
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid email or password. Please try again.');
            } else {
                router.push('/dashboard');
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.resetContainer}>
            {/* ── Full-bleed butcher wrapping paper backdrop ───────────── */}
            <div className={styles.illustrationPanel}>
                <Image
                    src="/assets/identity/hofherr-wrapping-paper-print-hd.jpg"
                    alt="Hofherr Meat Co. printed butcher wrapping paper"
                    fill
                    sizes="100vw"
                    className={styles.illustrationImg}
                    priority
                />
            </div>

            {/* ── Centered Sign In card ────────────────────────────────── */}
            <div className={styles.formPanel}>
                <div className={styles.resetCard}>
                    <div className={styles.header}>
                        <div className={styles.wordmark}>
                            <img src="/assets/logo.svg" alt="Hofherr Meat Co." />
                        </div>
                        <h1 className={styles.subtitle}>Customer Sign In</h1>
                        <div className={styles.divider} />
                    </div>

                    {error && (
                        <div className={styles.error} role="alert">
                            {error}
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="login-email" className={styles.label}>
                                Email Address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder="you@hofherrmeats.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label htmlFor="login-password" className={styles.label}>
                                    Password
                                </label>
                                <Link href="/reset-password" className={styles.labelHint}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div className={styles.passwordWrap}>
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={styles.input}
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

                        <button type="submit" disabled={loading} className={styles.button}>
                            {loading ? 'Signing In…' : 'Sign In To Account'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <Link href="/" className={styles.backLink}>
                            ← Back to Website
                        </Link>
                        <Link href="/register" className={styles.backLink}>
                            Create Account →
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

'use client';

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function AdminLoginPage() {
    const { data: session, status } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Forgot password states
    const [forgotMode, setForgotMode] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    // If already logged in as admin, redirect to admin home
    React.useEffect(() => {
        if (status === 'authenticated' && session?.user?.isAdmin) {
            router.push('/admin');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return <div className={styles.loginContainer}><div className={styles.subtitle}>Checking authorization...</div></div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setError('Invalid email or password. Please try again.');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
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
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to send reset link.');
            } else {
                setForgotSuccess(true);
                setError('');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.logo}>HOFHERR MEAT CO.</div>
                    <div className={styles.subtitle}>Admin Dashboard Access</div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                {forgotMode ? (
                    forgotSuccess ? (
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <h3 style={{ color: '#ef4444', marginBottom: '12px' }}>Check Your Email</h3>
                            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                                If an account exists for {email}, we've sent a password reset link to it. <br/> Please check your inbox and spam folder.
                            </p>
                            <button
                                type="button"
                                className={styles.button}
                                onClick={() => { setForgotMode(false); setForgotSuccess(false); }}
                                style={{ width: '100%' }}
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={handleForgot}>
                            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Enter your email address and we will send you a secure link to reset your password.</p>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    className={styles.input}
                                    placeholder="admin@hofherrmeats.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={styles.button}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setForgotMode(false); setError(''); }} className={styles.forgotLink}>Back to Login</a>
                            </div>
                        </form>
                    )
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                className={styles.input}
                                placeholder="admin@hofherrmeats.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Password</label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                className={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setForgotMode(true); setError(''); }} className={styles.forgotLink}>Forgot password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.button}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
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
    );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                email,
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
        <main className={styles.page}>
            <header className={styles.hero}>
                <div className="container">
                    <h1 className={styles.headline}>
                        Customer <em>Sign In</em>
                    </h1>
                    <p className={styles.subtext}>
                        Access your active orders, personal butcher cuts, and member-only specials.
                    </p>
                </div>
            </header>

            <section className="section" aria-labelledby="login-form-heading">
                <h2 id="login-form-heading" className={styles.srOnly}>Sign In Form</h2>
                <div className={`container ${styles.formWrap}`}>
                    {error && <div className={styles.errorBanner} role="alert">⚠️ {error}</div>}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.field}>
                            <label htmlFor="login-email" className={styles.label}>Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="login-password" className={styles.label}>Password</label>
                            <input
                                id="login-password"
                                type="password"
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? 'Signing In…' : 'Sign In To Account'}
                        </button>
                    </form>

                    <div className={styles.switchAuth}>
                        Don&apos;t have an account yet?
                        <Link href="/register" className={styles.switchLink}>Create Account</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}


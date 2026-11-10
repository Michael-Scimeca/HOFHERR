'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './register.module.css';

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        favoriteCut: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
        setForm(prev => ({ ...prev, username: clean }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            if (data.requiresVerification) {
                setSuccessMessage('Account created! Please check your email to verify your address, then sign in.');
                return;
            }

            // Auto-login upon successful creation
            const signInRes = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (signInRes?.error) {
                router.push('/login');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.page}>
            {/* ── Hero Header ── */}
            <header className={styles.hero}>
                <div className="container">
                    <h1 className={styles.headline}>
                        Join the <em>Hofherr Guild</em>
                    </h1>
                    <p className={styles.subtext}>
                        Create your customer account to track live orders, reserve holiday roasts, and get your own verified Butcher Guild profile.
                    </p>
                </div>
            </header>

            {/* ── Registration Form Section ── */}
            <section className="section" aria-labelledby="register-form-heading">
                <h2 id="register-form-heading" className={styles.srOnly}>Registration Form</h2>
                <div className={`container ${styles.formWrap}`}>
                    {error && <div className={styles.errorBanner} role="alert">⚠️ {error}</div>}
                    {successMessage && <div className={styles.successBanner} role="status">✅ {successMessage}</div>}

                    {!successMessage && (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.field}>
                                    <label htmlFor="reg-name" className={styles.label}>Full Name *</label>
                                    <input
                                        id="reg-name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="reg-username" className={styles.label}>Username Handle</label>
                                    <div className={styles.usernameWrap}>
                                        <span className={styles.usernamePrefix}>@</span>
                                        <input
                                            id="reg-username"
                                            name="username"
                                            type="text"
                                            placeholder="johndoe"
                                            value={form.username}
                                            onChange={handleUsernameChange}
                                            className={`${styles.input} ${styles.usernameInput}`}
                                        />
                                    </div>
                                    <span className={styles.helpText}>Guild profile: /dashboard/{form.username || 'username'}</span>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.field}>
                                    <label htmlFor="reg-email" className={styles.label}>Email Address *</label>
                                    <input
                                        id="reg-email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="john@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="reg-phone" className={styles.label}>Primary Phone *</label>
                                    <input
                                        id="reg-phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        autoComplete="tel"
                                        placeholder="847-555-0199"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="reg-password" className={styles.label}>Password (8+ chars, upper, lower, number) *</label>
                                <input
                                    id="reg-password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="reg-address" className={styles.label}>Saved Pickup / Delivery Address</label>
                                <input
                                    id="reg-address"
                                    name="address"
                                    type="text"
                                    autoComplete="street-address"
                                    placeholder="300 Happ Rd, Northfield, IL"
                                    value={form.address}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="reg-favcut" className={styles.label}>Favorite Butcher Cut (Optional)</label>
                                <input
                                    id="reg-favcut"
                                    name="favoriteCut"
                                    type="text"
                                    placeholder="e.g. Dry-Aged Ribeye, Smoked Brisket"
                                    value={form.favoriteCut}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={styles.submitBtn}
                            >
                                {loading ? 'Creating Guild Profile…' : 'Create Customer Account'}
                            </button>
                        </form>
                    )}

                    <div className={styles.switchAuth}>
                        Already have an account?
                        <Link href="/login" className={styles.switchLink}>Sign In</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}


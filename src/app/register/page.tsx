'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './register.module.css';

function formatPhoneInput(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const GUILD_PERKS = [
    {
        title: 'Live Counter Tracking',
        detail: 'Follow custom cuts and daily orders from butcher block prep to pickup ready.',
    },
    {
        title: 'Holiday & Prime Roasts',
        detail: 'Reserve standing rib roasts, heritage turkeys, and smokehouse platters faster.',
    },
    {
        title: 'Saved Cuts & Trim Notes',
        detail: 'Keep your preferred steak thickness, grind specs, and Northfield or Depot pickup saved.',
    },
    {
        title: 'Personal Guild Hub',
        detail: 'Access past orders, one-tap restocks, and gift cards from your verified profile.',
    },
];

export default function RegisterPage() {
    const router = useRouter();
    const errorBannerRef = useRef<HTMLDivElement>(null);

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        favoriteCut: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const pwRules = {
        length: form.password.length >= 8,
        upper: /[A-Z]/.test(form.password),
        lower: /[a-z]/.test(form.password),
        number: /[0-9]/.test(form.password),
    };
    const allPwRulesMet = pwRules.length && pwRules.upper && pwRules.lower && pwRules.number;

    const validateField = (fieldName: string, value: string): string => {
        if (fieldName === 'name' && !value.trim()) {
            return 'Please enter your full name.';
        }
        if (fieldName === 'email') {
            if (!value.trim()) return 'Please enter your email address.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
        }
        if (fieldName === 'phone') {
            const digits = value.replace(/\D/g, '');
            if (!digits) return 'Please enter a phone number for pickup updates.';
            if (digits.length < 10) return 'Please enter a 10-digit phone number.';
        }
        if (fieldName === 'password') {
            if (!value) return 'Please choose a password.';
            if (value.length < 8 || !/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
                return 'Password needs 8+ characters with uppercase, lowercase, and a number.';
            }
        }
        return '';
    };

    const clearErrorIfFixed = (fieldName: string, nextValue: string) => {
        if (!fieldErrors[fieldName]) return;
        const msg = validateField(fieldName, nextValue);
        if (!msg) {
            setFieldErrors(prev => {
                const copy = { ...prev };
                delete copy[fieldName];
                return copy;
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        clearErrorIfFixed(name, value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneInput(e.target.value);
        setForm(prev => ({ ...prev, phone: formatted }));
        clearErrorIfFixed('phone', formatted);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
        setForm(prev => ({ ...prev, username: clean }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!value && !touched[name]) return;
        setTouched(prev => ({ ...prev, [name]: true }));
        const msg = validateField(name, value);
        setFieldErrors(prev => {
            const copy = { ...prev };
            if (msg) copy[name] = msg;
            else delete copy[name];
            return copy;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const requiredFields = ['name', 'email', 'phone', 'password'] as const;
        const nextErrors: Record<string, string> = {};
        for (const key of requiredFields) {
            const msg = validateField(key, form[key]);
            if (msg) nextErrors[key] = msg;
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            setTouched({ name: true, email: true, phone: true, password: true });
            const firstInvalidKey = requiredFields.find(k => Boolean(nextErrors[k]));
            if (firstInvalidKey) {
                const el = e.currentTarget.elements.namedItem(firstInvalidKey);
                if (el instanceof HTMLElement) el.focus();
            }
            return;
        }

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
                setSuccessMessage(
                    'Account created! Check your inbox to verify your email address, then sign in to your Guild dashboard.'
                );
                return;
            }

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
            requestAnimationFrame(() => {
                errorBannerRef.current?.focus();
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.page}>
            {/* ── Hero Header ── */}
            <header className={styles.hero}>
                <div className="container">
                    <div className={styles.heroInner}>
                        <h1 className={styles.headline}>
                            JOIN THE <em>HOFHERR GUILD</em>
                        </h1>
                        <p className={styles.subtext}>
                            Create your customer account to track live counter orders, reserve holiday roasts, and keep
                            your custom cut preferences ready across both North Shore shops.
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Registration Workspace ── */}
            <section id="register-account" aria-labelledby="register-account-heading" className="section">
                <div className="container">
                    <div className={styles.registerGrid}>
                        {/* ── Left Sidebar: Guild Benefits & Sign-In Prompt ── */}
                        <aside className={styles.sidebar} aria-label="Guild Member Perks">
                            <div className={styles.perksPanel}>
                                <h2 className={styles.sidebarHeading}>GUILD MEMBER PERKS</h2>
                                <ul className={styles.perksList}>
                                    {GUILD_PERKS.map(perk => (
                                        <li key={perk.title} className={styles.perkItem}>
                                            <span className={styles.perkIcon} aria-hidden="true">
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </span>
                                            <div className={styles.perkCopy}>
                                                <strong className={styles.perkTitle}>{perk.title}</strong>
                                                <p className={styles.perkDesc}>{perk.detail}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.signInCard}>
                                <h3 className={styles.signInTitle}>ALREADY IN THE GUILD?</h3>
                                <p className={styles.signInDesc}>
                                    Sign in to view active pickup slots, reorder past butcher parcels, or manage your
                                    saved cuts.
                                </p>
                                <Link href="/login" className={`btn-hit ${styles.fullHit}`}>
                                    <span className={`btn btn-secondary ${styles.fullBtn}`}>Sign In to Account</span>
                                </Link>
                            </div>
                        </aside>

                        {/* ── Right Column: Registration Card ── */}
                        <div className={styles.formCard}>
                            <div className={styles.cardHeader}>
                                <h2 id="register-account-heading" className={styles.cardTitle}>
                                    CREATE CUSTOMER ACCOUNT
                                </h2>
                                <span className={styles.requiredLegend}>* Required fields</span>
                            </div>

                            {error && (
                                <div
                                    ref={errorBannerRef}
                                    tabIndex={-1}
                                    className={styles.errorBanner}
                                    role="alert"
                                    aria-live="assertive"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                        className={styles.bannerIcon}
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {successMessage ? (
                                <div className={styles.successState} role="status" aria-live="polite">
                                    <div className={styles.successBadge} aria-hidden="true">
                                        <svg
                                            width="28"
                                            height="28"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <h3 className={styles.successTitle}>WELCOME TO THE GUILD</h3>
                                    <p className={styles.successCopy}>{successMessage}</p>
                                    <div className={styles.successActions}>
                                        <Link href="/login" className="btn-hit">
                                            <span className="btn btn-primary">Proceed to Sign In</span>
                                        </Link>
                                        <Link href="/online-orders" className="btn-hit">
                                            <span className="btn btn-secondary">Browse Butcher Case</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <form
                                    className={styles.form}
                                    method="POST"
                                    action="/api/auth/register"
                                    noValidate
                                    onSubmit={handleSubmit}
                                >
                                    <fieldset className={styles.fieldset}>
                                        <legend className={styles.legend}>01 · Account &amp; Sign-In</legend>
                                        <div className={styles.fieldsetBody}>
                                            <div className={styles.formRow}>
                                                <div className={styles.field}>
                                                    <label htmlFor="reg-name" className={styles.label}>
                                                        <span>
                                                            Full Name{' '}
                                                            <span className={styles.reqMark} aria-hidden="true">
                                                                *
                                                            </span>
                                                        </span>
                                                    </label>
                                                    <input
                                                        id="reg-name"
                                                        name="name"
                                                        type="text"
                                                        required
                                                        maxLength={100}
                                                        autoComplete="name"
                                                        enterKeyHint="next"
                                                        placeholder="Sean Hofherr"
                                                        value={form.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        aria-invalid={Boolean(fieldErrors.name)}
                                                        aria-describedby={fieldErrors.name ? 'err-name' : undefined}
                                                        className={styles.input}
                                                    />
                                                    {fieldErrors.name && (
                                                        <span id="err-name" className={styles.fieldError}>
                                                            {fieldErrors.name}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className={styles.field}>
                                                    <label htmlFor="reg-username" className={styles.label}>
                                                        <span>Guild Handle</span>
                                                        <span className={styles.optionalTag}>Optional</span>
                                                    </label>
                                                    <div className={styles.usernameWrap}>
                                                        <span className={styles.usernamePrefix} aria-hidden="true">
                                                            @
                                                        </span>
                                                        <input
                                                            id="reg-username"
                                                            name="username"
                                                            type="text"
                                                            autoComplete="off"
                                                            autoCorrect="off"
                                                            autoCapitalize="none"
                                                            spellCheck={false}
                                                            enterKeyHint="next"
                                                            placeholder="northshoregriller"
                                                            value={form.username}
                                                            onChange={handleUsernameChange}
                                                            aria-describedby="reg-username-hint"
                                                            className={styles.usernameInput}
                                                        />
                                                    </div>
                                                    <span id="reg-username-hint" className={styles.helpText}>
                                                        Profile URL: /dashboard/{form.username || 'your-handle'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.field}>
                                                    <label htmlFor="reg-email" className={styles.label}>
                                                        <span>
                                                            Email Address{' '}
                                                            <span className={styles.reqMark} aria-hidden="true">
                                                                *
                                                            </span>
                                                        </span>
                                                    </label>
                                                    <input
                                                        id="reg-email"
                                                        name="email"
                                                        type="email"
                                                        required
                                                        autoComplete="email"
                                                        spellCheck={false}
                                                        enterKeyHint="next"
                                                        placeholder="you@example.com"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        aria-invalid={Boolean(fieldErrors.email)}
                                                        aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                                                        className={styles.input}
                                                    />
                                                    {fieldErrors.email && (
                                                        <span id="err-email" className={styles.fieldError}>
                                                            {fieldErrors.email}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className={styles.field}>
                                                    <label htmlFor="reg-phone" className={styles.label}>
                                                        <span>
                                                            Primary Phone{' '}
                                                            <span className={styles.reqMark} aria-hidden="true">
                                                                *
                                                            </span>
                                                        </span>
                                                    </label>
                                                    <input
                                                        id="reg-phone"
                                                        name="phone"
                                                        type="tel"
                                                        inputMode="tel"
                                                        required
                                                        autoComplete="tel"
                                                        enterKeyHint="next"
                                                        placeholder="(847) 441-6328"
                                                        value={form.phone}
                                                        onChange={handlePhoneChange}
                                                        onBlur={handleBlur}
                                                        aria-invalid={Boolean(fieldErrors.phone)}
                                                        aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                                                        className={styles.input}
                                                    />
                                                    {fieldErrors.phone && (
                                                        <span id="err-phone" className={styles.fieldError}>
                                                            {fieldErrors.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.field}>
                                                <label htmlFor="reg-password" className={styles.label}>
                                                    <span>
                                                        Password{' '}
                                                        <span className={styles.reqMark} aria-hidden="true">
                                                            *
                                                        </span>
                                                    </span>
                                                </label>
                                                <div className={styles.passwordWrap}>
                                                    <input
                                                        id="reg-password"
                                                        name="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        required
                                                        minLength={8}
                                                        autoComplete="new-password"
                                                        enterKeyHint="next"
                                                        placeholder="Create a strong password"
                                                        value={form.password}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        aria-invalid={Boolean(fieldErrors.password)}
                                                        aria-describedby={
                                                            fieldErrors.password
                                                                ? 'password-rules err-password'
                                                                : 'password-rules'
                                                        }
                                                        className={styles.passwordInput}
                                                    />
                                                    <button
                                                        type="button"
                                                        className={styles.pwToggleBtn}
                                                        aria-pressed={showPassword}
                                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                        aria-describedby="toggle-pw-warning"
                                                        onClick={() => setShowPassword(prev => !prev)}
                                                    >
                                                        {showPassword ? (
                                                            <svg
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                aria-hidden="true"
                                                            >
                                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                                <line x1="1" y1="1" x2="23" y2="23" />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                aria-hidden="true"
                                                            >
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        )}
                                                        <span>{showPassword ? 'Hide' : 'Show'}</span>
                                                    </button>
                                                    <span id="toggle-pw-warning" className={styles.srOnly}>
                                                        Warning: this will display your password on the screen.
                                                    </span>
                                                </div>

                                                <ul
                                                    id="password-rules"
                                                    className={styles.pwChecklist}
                                                    aria-label="Password requirements"
                                                >
                                                    <li className={pwRules.length ? styles.pwRuleMet : styles.pwRule}>
                                                        <span className={styles.pwDot} aria-hidden="true" />
                                                        8+ characters
                                                    </li>
                                                    <li className={pwRules.upper ? styles.pwRuleMet : styles.pwRule}>
                                                        <span className={styles.pwDot} aria-hidden="true" />
                                                        Uppercase
                                                    </li>
                                                    <li className={pwRules.lower ? styles.pwRuleMet : styles.pwRule}>
                                                        <span className={styles.pwDot} aria-hidden="true" />
                                                        Lowercase
                                                    </li>
                                                    <li className={pwRules.number ? styles.pwRuleMet : styles.pwRule}>
                                                        <span className={styles.pwDot} aria-hidden="true" />
                                                        Number
                                                    </li>
                                                </ul>

                                                {fieldErrors.password && !allPwRulesMet && (
                                                    <span id="err-password" className={styles.fieldError}>
                                                        {fieldErrors.password}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset className={styles.fieldset}>
                                        <legend className={styles.legend}>02 · Butcher Counter Preferences</legend>
                                        <div className={styles.fieldsetBody}>
                                            <div className={styles.formRow}>
                                                <div className={styles.field}>
                                                    <label htmlFor="reg-address" className={styles.label}>
                                                        <span>Saved Address</span>
                                                        <span className={styles.optionalTag}>Optional</span>
                                                    </label>
                                                    <input
                                                        id="reg-address"
                                                        name="address"
                                                        type="text"
                                                        autoComplete="street-address"
                                                        enterKeyHint="next"
                                                        placeholder="300 Happ Rd, Northfield, IL"
                                                        value={form.address}
                                                        onChange={handleChange}
                                                        className={styles.input}
                                                    />
                                                </div>

                                                <div className={styles.field}>
                                                    <label htmlFor="reg-favcut" className={styles.label}>
                                                        <span>Favorite Cut</span>
                                                        <span className={styles.optionalTag}>Optional</span>
                                                    </label>
                                                    <input
                                                        id="reg-favcut"
                                                        name="favoriteCut"
                                                        type="text"
                                                        enterKeyHint="done"
                                                        placeholder="Dry-Aged Bone-In Ribeye"
                                                        value={form.favoriteCut}
                                                        onChange={handleChange}
                                                        className={styles.input}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <div className={styles.submitArea}>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`btn-hit ${styles.submitHit}`}
                                        >
                                            <span className={`btn btn-primary ${styles.submitBtnInner}`}>
                                                {loading ? 'Creating Guild Profile…' : 'Create Customer Account'}
                                            </span>
                                        </button>

                                        <p className={styles.switchAuth}>
                                            <span>Already have an account?</span>
                                            <Link href="/login" className={styles.switchLink}>
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

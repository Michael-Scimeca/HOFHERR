'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { signIn, useSession } from 'next-auth/react';
import { usePageTransition } from '@/components/PageTransition';
import BurnModalShell from '@/components/BurnModalShell';
import { lockScroll } from '@/lib/scrollLock';
import styles from './AuthModal.module.css';

/* ─────────────────────────────────────────────────────────────────────────
   Site-wide sign in / sign up modal.

   Opens over whatever page you are on (no navigation, no page transition) when
   something calls openAuthModal('login' | 'register'), e.g. the navbar's
   Sign In / Sign Up links. It uses the same API calls and the same markup as
   the auth step of the checkout modal on /online-orders, which still handles
   sign-in during checkout and the ?login=true / ?signup=true deep links.
   ───────────────────────────────────────────────────────────────────────── */

export type AuthMode = 'login' | 'register' | 'forgot';
const OPEN_EVENT = 'hofherr-open-auth-modal';

/** Open the modal from anywhere on the client. */
export function openAuthModal(mode: 'login' | 'register' = 'login') {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { mode } }));
}

const PROVIDERS: { id: string; label: string; icon: ReactNode }[] = [
    { id: 'google', label: 'Google', icon: <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg> },
    { id: 'apple', label: 'Apple', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.92 14c-.03-2.93 2.4-4.34 2.5-4.4-1.36-2-3.48-2.26-4.22-2.3-1.8-.18-3.52 1.05-4.44 1.05-.9 0-2.32-1-3.8-1-1.92 0-3.68 1.1-4.66 2.82C.3 13.62 1.55 19.38 3.5 22.18c1 1.44 2.18 3.03 3.75 3 1.5-.04 2.1-.96 3.9-.96 1.8 0 2.34.96 3.9.92 1.6-.04 2.6-1.46 3.56-2.88 1.12-1.62 1.58-3.2 1.6-3.28-.02-.02-2.3-1.02-2.3-3.98zm-3.3-8.8c.84-1 1.4-2.4 1.25-3.8-1.2.05-2.65.8-3.5 1.8-.75.86-1.4 2.3-1.2 3.66 1.34.1 2.6-.66 3.45-1.66z" /></svg> },
    { id: 'azure-ad', label: 'Microsoft', icon: <svg width="18" height="18" viewBox="0 0 20 20"><rect x="1" y="1" width="8.5" height="8.5" fill="#f25022" /><rect x="10.5" y="1" width="8.5" height="8.5" fill="#7fbb00" /><rect x="1" y="10.5" width="8.5" height="8.5" fill="#00a1f1" /><rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#ffbb00" /></svg> },
    { id: 'facebook', label: 'Facebook', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
];

const EMPTY_LOGIN = { email: '', password: '' };
const EMPTY_REGISTER = { name: '', email: '', phone: '', address: '', password: '' };

export default function AuthModal() {
    const { status } = useSession();
    const { navigateTo } = usePageTransition();
    const [mode, setMode] = useState<AuthMode | null>(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);
    const [loginData, setLoginData] = useState(EMPTY_LOGIN);
    const [registerData, setRegisterData] = useState(EMPTY_REGISTER);
    const [forgotEmail, setForgotEmail] = useState('');
    const panelRef = useRef<HTMLDialogElement>(null);
    const returnFocusRef = useRef<HTMLElement | null>(null);
    const open = mode !== null;

    const close = useCallback(() => {
        setMode(null);
        setError('');
        setNotice('');
        setLoading(false);
        setForgotSent(false);
    }, []);

    const switchMode = (next: AuthMode) => {
        setMode(next);
        setError('');
        setNotice('');
    };

    // Listen for open requests (navbar links, anything calling openAuthModal).
    useEffect(() => {
        const onOpen = (e: Event) => {
            if (status === 'authenticated') return;
            const requested = (e as CustomEvent<{ mode?: 'login' | 'register' }>).detail?.mode;
            returnFocusRef.current = document.activeElement as HTMLElement | null;
            setError('');
            setNotice('');
            setForgotSent(false);
            setMode(requested === 'register' ? 'register' : 'login');
        };
        window.addEventListener(OPEN_EVENT, onOpen);
        return () => window.removeEventListener(OPEN_EVENT, onOpen);
    }, [status]);

    // While open: lock page scroll, Escape to close, keep Tab inside.
    useEffect(() => {
        if (!open) return;
        const unlockScroll = lockScroll();

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close();
                return;
            }
            if (e.key !== 'Tab') return;
            const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button, input, a[href]') ?? []);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            unlockScroll();
            returnFocusRef.current?.focus();
        };
    }, [open, close]);

    // Put the cursor in the first field whenever the modal opens or switches view.
    useEffect(() => {
        if (!mode) return;
        const id = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLInputElement>('input')?.focus());
        return () => cancelAnimationFrame(id);
    }, [mode]);

    const finishSignedIn = () => {
        close();
        navigateTo('/dashboard');
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await signIn('credentials', { email: loginData.email, password: loginData.password, redirect: false });
            if (res?.error) throw new Error('Invalid email or password');
            finishSignedIn();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            if (data.requiresVerification) {
                setMode('login');
                setNotice('Account created. Check your email to verify it, then sign in.');
                return;
            }

            const signInRes = await signIn('credentials', { email: registerData.email, password: registerData.password, redirect: false });
            if (signInRes?.error) throw new Error('Could not automatically log in');
            finishSignedIn();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setForgotSent(false);
        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await res.json();
            if (!res.ok) setError(data.error || 'Failed to send reset link.');
            else setForgotSent(true);
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!open || typeof document === 'undefined') return null;

    const social = (lead: string) => (
        <>
            <div className={styles.dividerOr}><span>{lead}</span></div>
            <div className={styles.socialGrid}>
                {PROVIDERS.map((p) => (
                    <button key={p.id} type="button" className={styles.socialBtnFlat} onClick={() => signIn(p.id, { callbackUrl: window.location.pathname })}>
                        {p.icon}
                        {p.label}
                    </button>
                ))}
            </div>
        </>
    );

    const title = mode === 'forgot' ? 'Reset Password' : mode === 'register' ? 'Create An Account' : 'Welcome Back';
    const subtitle = mode === 'forgot' ? 'We will send you a reset link' : mode === 'register' ? 'Join for faster checkout & rewards' : 'Sign in to your account';

    return createPortal(
        <div
            className={styles.overlay}
            data-lenis-prevent
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !loading) close();
            }}
        >
            <BurnModalShell className={styles.modal} maxWidth={480} style={{ maxWidth: 480, position: 'relative' }}>
                <dialog ref={panelRef} open aria-modal="true" aria-labelledby="auth-modal-title" className={styles.choiceView}>
                    <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close">×</button>
                    <h2 id="auth-modal-title" className={styles.title}>{title}</h2>
                    <p className={styles.subtitle}>{subtitle}</p>

                    <div className={`${styles.choiceLayout} ${styles.choiceFocused}`}>
                        {mode === 'register' && (
                            <div className={styles.choiceColGuest}>
                                <div className={styles.guestContent}>
                                    <form className={styles.loginFields} onSubmit={handleRegister}>
                                        <div className={styles.authRow}>
                                            <div className={styles.authField}><label htmlFor="am-reg-name">Full Name</label><input required type="text" id="am-reg-name" name="name" autoComplete="name" className={styles.authInput} placeholder="John Doe" value={registerData.name} onChange={e => setRegisterData(d => ({ ...d, name: e.target.value }))} /></div>
                                            <div className={styles.authField}><label htmlFor="am-reg-phone">Phone</label><input required type="tel" id="am-reg-phone" name="tel" autoComplete="tel" className={styles.authInput} placeholder="555-555-5555" value={registerData.phone} onChange={e => setRegisterData(d => ({ ...d, phone: e.target.value }))} /></div>
                                        </div>
                                        <div className={styles.authRow}>
                                            <div className={styles.authField}><label htmlFor="am-reg-email">Email</label><input required type="email" id="am-reg-email" name="email" autoComplete="email" className={styles.authInput} placeholder="your@email.com" value={registerData.email} onChange={e => setRegisterData(d => ({ ...d, email: e.target.value }))} /></div>
                                            <div className={styles.authField}><label htmlFor="am-reg-password">Password</label><input required type="password" id="am-reg-password" name="new-password" autoComplete="new-password" className={styles.authInput} placeholder="••••••••" value={registerData.password} onChange={e => setRegisterData(d => ({ ...d, password: e.target.value }))} /></div>
                                        </div>
                                        <div className={styles.authField}><label htmlFor="am-reg-address">Address</label><input required type="text" id="am-reg-address" name="address" autoComplete="street-address" className={styles.authInput} placeholder="123 Meat St, Northfield, IL" value={registerData.address} onChange={e => setRegisterData(d => ({ ...d, address: e.target.value }))} /></div>

                                        {error && <p className={styles.authErrorLine} role="alert">⚠️ {error}</p>}
                                        <button type="submit" className={styles.loginBtn} style={{ marginTop: '4px', padding: '12px' }} disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
                                    </form>

                                    {social('or sign up with')}

                                    <div className={`${styles.switchAuth} ${styles.centered}`}>
                                        Already have an account? <button type="button" className={styles.linkBtn} onClick={() => switchMode('login')}>Log In</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mode === 'forgot' && (
                            <div className={styles.choiceColLogin}>
                                {forgotSent ? (
                                    <div className={styles.centered} style={{ padding: '20px 0' }}>
                                        <h3 style={{ color: 'var(--red)', marginBottom: '8px' }}>Check Your Email</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>If an account exists for that email, we&apos;ve sent a password reset link.</p>
                                        <button type="button" className={styles.loginBtn} onClick={() => { setForgotSent(false); switchMode('login'); }} style={{ marginTop: '24px' }}>Back to Login</button>
                                    </div>
                                ) : (
                                    <form className={styles.loginFields} onSubmit={handleForgot}>
                                        <div className={styles.authField}>
                                            <label htmlFor="am-forgot-email">Email Address</label>
                                            <input type="email" id="am-forgot-email" autoComplete="email" className={styles.authInput} placeholder="your@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                                        </div>
                                        {error && <p className={styles.authErrorLine} role="alert">⚠️ {error}</p>}
                                        <button type="submit" className={styles.loginBtn} disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
                                        <div className={`${styles.forgotPass} ${styles.centered}`} style={{ marginTop: '12px' }}>
                                            <button type="button" className={styles.linkBtn} onClick={() => switchMode('login')}>Nevermind, I remember it</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {mode === 'login' && (
                            <div className={styles.choiceColLogin}>
                                {notice && <p className={styles.notice} role="status">{notice}</p>}
                                <form className={styles.loginFields} onSubmit={handleLogin}>
                                    <div className={styles.authField}><label htmlFor="am-login-email">Email Address</label><input type="email" id="am-login-email" name="email" autoComplete="email" className={styles.authInput} placeholder="your@email.com" value={loginData.email} onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))} required /></div>
                                    <div className={styles.authField}><label htmlFor="am-login-password">Password</label><input type="password" id="am-login-password" name="password" autoComplete="current-password" className={styles.authInput} placeholder="••••••••" value={loginData.password} onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))} required /></div>
                                    <div className={styles.forgotPass}><button type="button" className={styles.linkBtn} onClick={() => switchMode('forgot')}>Forgot password?</button></div>
                                    {error && <p className={styles.authErrorLine} role="alert">⚠️ {error}</p>}
                                    <button type="submit" className={styles.loginBtn} disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
                                </form>

                                {social('or sign in with')}

                                <div className={`${styles.switchAuth} ${styles.centered}`}>
                                    Don&apos;t have an account? <button type="button" className={styles.linkBtn} onClick={() => switchMode('register')}>Sign Up</button>
                                </div>
                            </div>
                        )}
                    </div>
                </dialog>
            </BurnModalShell>
        </div>,
        document.body,
    );
}

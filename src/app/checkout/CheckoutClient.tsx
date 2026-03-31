'use client';

import { useState, useEffect, useCallback, useMemo, useRef, useTransition } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './checkout.module.css';

// ── Constants ──────────────────────────────────────────────────────────────
const TAX_RATE = 0.0225;

// ── Types ──────────────────────────────────────────────────────────────────
type CartItem = {
    name: string;
    price: string | number;
    qty: number;
    note?: string;
    desc?: string;
};

type Coupon = { code: string; type: 'percent' | 'fixed'; value: number } | null;

// ── Helpers ────────────────────────────────────────────────────────────────
function parseItemPrice(price: string | number): number {
    if (typeof price === 'number') return price;
    const m = String(price).match(/\$([\d.]+)/);
    return m ? parseFloat(m[1]) : parseFloat(String(price)) || 0;
}
function fmtTotal(n: number): string {
    return '$' + n.toFixed(2);
}
function formatPhoneNumber(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ── Date / time helpers ────────────────────────────────────────────────────
function getAvailablePickupDates(activeStore: string): Date[] {
    const dates: Date[] = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(now.getDate() + i);
        const day = d.getDay();
        let isPast = false;
        if (i === 0) {
            let lastH = 18;
            if (activeStore === 'butcher') {
                if (day === 6) lastH = 17;
                if (day === 0) lastH = 16;
            }
            if (now.getHours() >= lastH) isPast = true;
        }
        if (isPast) continue;
        if (activeStore === 'butcher') {
            if (day !== 1) dates.push(d);
        } else {
            if (day !== 0 && day !== 6) dates.push(d);
        }
    }
    return dates;
}

function getAvailableTimeSlots(date: Date | null, activeStore: string) {
    if (!date) return [];
    const slots: { label: string; value: string; disabled: boolean }[] = [];
    const day = date.getDay();
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    let start = 10, startMin = 0, end = 18;
    if (activeStore === 'butcher') {
        if (day === 6) end = 17;
        if (day === 0) end = 16;
    } else {
        startMin = 30;
    }
    for (let h = start; h < end; h++) {
        if (!(h === start && startMin === 30)) {
            const dis = isToday && (h < now.getHours() || (h === now.getHours() && now.getMinutes() + 15 > 0));
            slots.push({ label: '', value: `${h}:00`, disabled: dis });
        }
        const dis30 = isToday && (h < now.getHours() || (h === now.getHours() && now.getMinutes() + 15 > 30));
        slots.push({ label: '', value: `${h}:30`, disabled: dis30 });
    }
    let foundFirst = false;
    return slots.map(s => {
        const [h, m] = s.value.split(':');
        const hh = parseInt(h);
        const period = hh >= 12 ? 'PM' : 'AM';
        let dispH = hh > 12 ? hh - 12 : hh;
        if (dispH === 0) dispH = 12;
        const timeStr = `${dispH}:${m} ${period}`;
        let label = timeStr;
        if (isToday && !s.disabled && !foundFirst) {
            label = `${timeStr} (ASAP)`;
            foundFirst = true;
        }
        return { value: timeStr, label, disabled: s.disabled };
    });
}

// ── Component ──────────────────────────────────────────────────────────────
export default function CheckoutClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Cart & store (from localStorage)
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeStore, setActiveStore] = useState<'butcher' | 'depot'>('butcher');
    const [hydrated, setHydrated] = useState(false);

    // Checkout step
    const [step, setStep] = useState<'auth' | 'form'>('auth');

    // Form state
    const [form, setForm] = useState({ name: '', phone: '', email: '', pickup: '' });
    const [contactPref, setContactPref] = useState<'phone' | 'email'>('phone');
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'instore'>('stripe');
    const [orderNote, setOrderNote] = useState('');
    const [stripeError, setStripeError] = useState('');

    // Auth state
    const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', address: '', password: '' });
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState(false);

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon>(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    // Date / time
    const [selectedDateIdx, setSelectedDateIdx] = useState(0);
    const dateScrollRef = useRef<HTMLDivElement>(null);
    const dateThumbRef = useRef<HTMLDivElement>(null);
    const [dateThumbLeft, setDateThumbLeft] = useState(0);
    const [dateThumbWidth, setDateThumbWidth] = useState(0);

    // Load cart from localStorage
    useEffect(() => {
        try {
            const store = (localStorage.getItem('hofherr_active_store') as 'butcher' | 'depot') || 'butcher';
            setActiveStore(store);
            const key = store === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot';
            const saved = localStorage.getItem(key) || localStorage.getItem('hofherr_cart');
            if (saved) setCart(JSON.parse(saved));
        } catch { /* ignore */ }
        setHydrated(true);
    }, []);

    // If session loaded & user exists, skip auth step
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            const u = session.user as any;
            setForm(f => ({
                ...f,
                name: u.name || '',
                email: u.email || '',
                phone: u.phone ? formatPhoneNumber(u.phone) : '',
            }));
            setStep('form');
        }
    }, [status, session]);

    // Redirect to orders if cart is empty and page is loaded
    useEffect(() => {
        if (hydrated && cart.length === 0 && status !== 'loading') {
            // Give a brief moment so localStorage can hydrate
            const t = setTimeout(() => {
                if (cart.length === 0) router.push('/online-orders');
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [hydrated, cart.length, status, router]);

    // Dates & slots
    const availableDates = useMemo(() => getAvailablePickupDates(activeStore), [activeStore]);
    const availableSlots = useMemo(() => getAvailableTimeSlots(availableDates[selectedDateIdx] ?? null, activeStore), [availableDates, selectedDateIdx, activeStore]);

    // Auto-select first available slot
    useEffect(() => {
        const first = availableSlots.find(s => !s.disabled);
        if (first) {
            const dateStr = availableDates[selectedDateIdx]?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            setForm(f => ({ ...f, pickup: `${dateStr} at ${first.value}` }));
        }
    }, [selectedDateIdx, availableDates, availableSlots]);

    // Custom scrollbar for date strip
    const updateDateThumb = useCallback(() => {
        const el = dateScrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        if (scrollWidth <= clientWidth) { setDateThumbWidth(0); return; }
        const ratio = clientWidth / scrollWidth;
        const tw = Math.max(ratio * clientWidth, 32);
        const tl = (scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - tw);
        setDateThumbWidth(tw);
        setDateThumbLeft(tl);
    }, []);

    useEffect(() => {
        updateDateThumb();
        window.addEventListener('resize', updateDateThumb);
        return () => window.removeEventListener('resize', updateDateThumb);
    }, [updateDateThumb, availableDates]);

    // ── Auth handlers ──────────────────────────────────────────────────────
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        try {
            const res = await signIn('credentials', { email: loginData.email, password: loginData.password, redirect: false });
            if (res?.error) throw new Error('Invalid email or password');
            setStep('form');
        } catch (err: any) {
            setAuthError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        try {
            const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(registerData) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');
            
            // If email verification is required, show message instead of auto-login
            if (data.requiresVerification) {
                setAuthError('');
                setAuthLoading(false);
                alert('✅ Account created! Please check your email to verify your account before signing in.');
                setAuthMode('login');
                return;
            }

            const sr = await signIn('credentials', { email: registerData.email, password: registerData.password, redirect: false });
            if (sr?.error) throw new Error('Could not auto-login after registration');
            setStep('form');
        } catch (err: any) {
            setAuthError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: forgotEmail }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send reset link.');
            setForgotSuccess(true);
        } catch (err: any) {
            setAuthError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    // ── Coupon handler ─────────────────────────────────────────────────────
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponError('');
        setCouponLoading(true);
        try {
            const res = await fetch('/api/coupons/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: couponCode }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid coupon');
            setAppliedCoupon({ code: couponCode.toUpperCase(), type: data.discountType, value: data.discountValue });
            setCouponCode('');
        } catch (err: any) {
            setCouponError(err.message);
        } finally {
            setCouponLoading(false);
        }
    };

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStripeError('');
        startTransition(async () => {
            try {
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cart, contact: form, orderNote, customerId: (session?.user as any)?.id, coupon: appliedCoupon, storeId: activeStore, paymentMethod }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? 'Checkout failed');
                try {
                    localStorage.removeItem(activeStore === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot');
                    localStorage.removeItem('hofherr_cart');
                } catch { }
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    window.location.href = `/order/success?instore=true&pickupTime=${encodeURIComponent(form.pickup)}&name=${encodeURIComponent(form.name)}&storeId=${activeStore}&summary=${encodeURIComponent(cart.map(i => `${i.name} x${i.qty}`).join(', '))}`;
                }
            } catch (err) {
                setStripeError(err instanceof Error ? err.message : 'Something went wrong.');
            }
        });
    };

    // ── Derived ────────────────────────────────────────────────────────────
    const subtotal = cart.reduce((s, i) => s + parseItemPrice(i.price) * i.qty, 0);
    let discounted = subtotal;
    if (appliedCoupon) {
        discounted = appliedCoupon.type === 'percent' ? subtotal * (1 - appliedCoupon.value / 100) : Math.max(0, subtotal - appliedCoupon.value);
    }
    const tax = discounted * TAX_RATE;
    const total = discounted + tax;

    if (!hydrated) return null;

    return (
        <div className={styles.page}>
            {/* Back link */}
            <Link href="/online-orders" className={styles.backLink}>
                ← Back to Shop
            </Link>

            <div className={styles.layout}>
                {/* ── Left: Form ── */}
                <div className={styles.formCol}>
                    <h1 className={styles.heading}>Complete Your Order</h1>

                    {/* Store banner */}
                    <div className={styles.storeBanner}>
                        📍 Pickup at: {activeStore === 'butcher' ? 'The Butcher Shop (Northfield)' : 'The Depot (Winnetka)'}
                    </div>
                    <p className={styles.subtext}>
                        {activeStore === 'butcher' ? 'Just a few final details to get your prime cuts ready for pickup.' : 'Just a few final details to get your order ready for pickup.'}
                    </p>

                    {/* ── AUTH STEP ── */}
                    {step === 'auth' && (
                        <div className={styles.authBox}>
                            <h3 className={styles.authTitle}>
                                {authMode === 'forgot' ? 'Reset Password' : authMode === 'register' ? 'Create Account' : 'Sign In to Checkout'}
                            </h3>
                            <p className={styles.authSub}>
                                {authMode === 'forgot' ? "We'll send you a reset link." : authMode === 'register' ? 'Join for faster checkout & rewards.' : 'Sign in to continue.'}
                            </p>

                            {/* Social buttons */}
                            {authMode !== 'forgot' && (
                                <div className={styles.socialRow}>
                                    <button type="button" className={styles.socialBtn} onClick={() => signIn('google', { callbackUrl: '/checkout' })}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                                        Google
                                    </button>
                                </div>
                            )}

                            {authMode !== 'forgot' && <div className={styles.dividerOr}><span>or continue with email</span></div>}

                            {/* Forgot */}
                            {authMode === 'forgot' && (
                                <form onSubmit={handleForgot} className={styles.authForm}>
                                    {forgotSuccess ? (
                                        <p className={styles.successMsg}>✅ Reset link sent! Check your inbox.</p>
                                    ) : (
                                        <>
                                            <input className={styles.authInput} type="email" placeholder="Your email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                                            {authError && <p className={styles.authError}>⚠️ {authError}</p>}
                                            <button type="submit" className={styles.authBtn} disabled={authLoading}>{authLoading ? 'Sending…' : 'Send Reset Link'}</button>
                                        </>
                                    )}
                                    <button type="button" className={styles.switchLink} onClick={() => setAuthMode('login')}>← Back to sign in</button>
                                </form>
                            )}

                            {/* Register */}
                            {authMode === 'register' && (
                                <form onSubmit={handleRegister} className={styles.authForm}>
                                    <div className={styles.authGrid}>
                                        <input className={styles.authInput} type="text" placeholder="Full Name" value={registerData.name} onChange={e => setRegisterData(d => ({ ...d, name: e.target.value }))} required />
                                        <input className={styles.authInput} type="tel" placeholder="Phone" value={registerData.phone} onChange={e => setRegisterData(d => ({ ...d, phone: formatPhoneNumber(e.target.value) }))} required />
                                        <input className={styles.authInput} type="email" placeholder="Email" value={registerData.email} onChange={e => setRegisterData(d => ({ ...d, email: e.target.value }))} required />
                                        <input className={styles.authInput} type="password" placeholder="Password" value={registerData.password} onChange={e => setRegisterData(d => ({ ...d, password: e.target.value }))} required />
                                    </div>
                                    <input className={styles.authInput} type="text" placeholder="Address" value={registerData.address} onChange={e => setRegisterData(d => ({ ...d, address: e.target.value }))} required />
                                    {authError && <p className={styles.authError}>⚠️ {authError}</p>}
                                    <button type="submit" className={styles.authBtn} disabled={authLoading}>{authLoading ? 'Creating…' : 'Create Account'}</button>
                                    <div className={styles.switchRow}>
                                        <span>Already have an account?</span>
                                        <button type="button" className={styles.switchLink} onClick={() => setAuthMode('login')}>Sign in</button>
                                    </div>
                                </form>
                            )}

                            {/* Login */}
                            {authMode === 'login' && (
                                <form onSubmit={handleLogin} className={styles.authForm}>
                                    <input className={styles.authInput} type="email" placeholder="Email" value={loginData.email} onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))} required />
                                    <input className={styles.authInput} type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))} required />
                                    {authError && <p className={styles.authError}>⚠️ {authError}</p>}
                                    <button type="submit" className={styles.authBtn} disabled={authLoading}>{authLoading ? 'Signing in…' : 'Sign In'}</button>
                                    <div className={styles.switchRow}>
                                        <button type="button" className={styles.switchLink} onClick={() => setAuthMode('forgot')}>Forgot password?</button>
                                        <button type="button" className={styles.switchLink} onClick={() => setAuthMode('register')}>Create account</button>
                                    </div>
                                    <div className={styles.dividerOr}><span>or</span></div>
                                    <button type="button" className={styles.guestBtn} onClick={() => setStep('form')}>Continue as Guest →</button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* ── FORM STEP ── */}
                    {step === 'form' && (
                        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
                            {/* Contact info */}
                            <div className={styles.section}>
                                <div className={styles.contactGrid}>
                                    <div className={styles.contactLeft}>
                                        <input required name="name" id="checkout-name" autoComplete="name" className={styles.input} placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                        {contactPref === 'phone' ? (
                                            <input required name="tel" id="checkout-phone" autoComplete="tel" type="tel" className={styles.input} placeholder="(847) 555-0100" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: formatPhoneNumber(e.target.value) }))} />
                                        ) : (
                                            <input required name="email" id="checkout-email" autoComplete="email" type="email" className={styles.input} placeholder="Email Address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                        )}
                                    </div>
                                    <div className={styles.contactRight}>
                                        <p className={styles.reachLabel}>HOW SHOULD WE REACH YOU?</p>
                                        <div className={styles.prefRow}>
                                            <button type="button" className={`${styles.prefBtn} ${contactPref === 'phone' ? styles.prefBtnActive : ''}`} onClick={() => setContactPref('phone')}>📞 Call Me</button>
                                            <button type="button" className={`${styles.prefBtn} ${contactPref === 'email' ? styles.prefBtnActive : ''}`} onClick={() => setContactPref('email')}>✉️ Email Me</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Date & time picker */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionLabel}>SELECT PICKUP DAY &amp; TIME</h3>
                                <p className={styles.prepNote}>⚡ Orders generally take 20–40 minutes to prepare.</p>

                                {/* Date scroll */}
                                <div className={styles.dateSelectorContainer}>
                                    <div className={styles.dateScrollTrack}>
                                        {dateThumbWidth > 0 && (
                                            <div ref={dateThumbRef} className={styles.dateScrollThumb} style={{ left: dateThumbLeft, width: dateThumbWidth }} />
                                        )}
                                    </div>
                                    <div
                                        ref={dateScrollRef}
                                        onScroll={updateDateThumb}
                                        style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any, touchAction: 'pan-x', paddingBottom: '8px', scrollbarWidth: 'none' as any, msOverflowStyle: 'none', minWidth: 0, width: '100%' }}
                                    >
                                        <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
                                            {availableDates.map((date, idx) => (
                                                <button key={idx} type="button"
                                                    className={`${styles.dateBtn} ${selectedDateIdx === idx ? styles.dateBtnActive : ''}`}
                                                    onClick={() => setSelectedDateIdx(idx)}
                                                >
                                                    <span className={styles.dateDay}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                    <span className={styles.dateNum}>{date.toLocaleDateString('en-US', { day: 'numeric' })}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Time slots */}
                                <div className={styles.timeGrid}>
                                    {availableSlots.length > 0 ? availableSlots.map(slot => {
                                        const dateStr = availableDates[selectedDateIdx]?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                                        const fullSlot = `${dateStr} at ${slot.value}`;
                                        const isActive = form.pickup === fullSlot;
                                        if (slot.disabled) return (
                                            <button key={slot.value} type="button" disabled className={styles.timeSlotBtnDisabled}>
                                                {slot.label || slot.value}
                                            </button>
                                        );
                                        return (
                                            <button key={slot.value} type="button"
                                                className={`${styles.timeSlotBtn} ${isActive ? styles.timeSlotBtnActive : ''}`}
                                                onClick={() => setForm(f => ({ ...f, pickup: fullSlot }))}
                                            >
                                                {slot.label || slot.value}
                                            </button>
                                        );
                                    }) : (
                                        <p className={styles.noSlots}>No slots available for this day.</p>
                                    )}
                                </div>
                            </div>

                            {/* Order note */}
                            <div className={styles.section}>
                                <textarea className={styles.noteArea} placeholder="Special instructions (optional)…" value={orderNote} onChange={e => setOrderNote(e.target.value)} rows={2} />
                            </div>


                            {/* Payment method */}
                            <div className={styles.section}>
                                <div className={styles.payRow}>
                                    <label className={`${styles.payBtn} ${paymentMethod === 'stripe' ? styles.payBtnActive : ''}`}>
                                        <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} style={{ display: 'none' }} />
                                        💳 Pay Online
                                    </label>
                                    <label className={`${styles.payBtn} ${paymentMethod === 'instore' ? styles.payBtnActive : ''}`}>
                                        <input type="radio" name="paymentMethod" value="instore" checked={paymentMethod === 'instore'} onChange={() => setPaymentMethod('instore')} style={{ display: 'none' }} />
                                        🏪 Pay In-Store
                                    </label>
                                </div>
                            </div>

                            {stripeError && <p className={styles.stripeError}>⚠️ {stripeError}</p>}

                            <div className={styles.formActions}>
                                <button type="button" className={styles.backBtn} onClick={() => setStep('auth')}>← Back</button>
                                <button type="submit" className={styles.submitBtn} disabled={isPending || !form.pickup}>
                                    {isPending ? 'Processing…' : (paymentMethod === 'stripe' ? 'Continue to Payment' : 'Place Order')}
                                </button>
                            </div>
                            <p className={styles.secureNote}>🔒 Powered by Stripe · 256-bit SSL</p>
                        </form>
                    )}
                </div>

                {/* ── Right: Order Summary ── */}
                <div className={styles.summaryCol}>
                    <div className={styles.summaryCard}>
                        <h3 className={styles.summaryTitle}>Order Summary</h3>
                        <div className={styles.summaryItems}>
                            {cart.map((item, i) => (
                                <div key={i} className={styles.summaryItem}>
                                    <div className={styles.summaryItemLeft}>
                                        <span className={styles.summaryItemName}>{item.name}</span>
                                        {item.note && <span className={styles.summaryItemNote}>📝 {item.note}</span>}
                                    </div>
                                    <div className={styles.summaryItemRight}>
                                        <span className={styles.summaryItemQty}>×{item.qty}</span>
                                        <span className={styles.summaryItemPrice}>{fmtTotal(parseItemPrice(item.price) * item.qty)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryRow}><span>Subtotal</span><span>{fmtTotal(subtotal)}</span></div>
                        <div className={styles.summaryRow}><span>Tax (2.25%)</span><span>{fmtTotal(tax)}</span></div>
                        <div className={styles.summaryTotal}><span>Est. Total</span><span>{fmtTotal(total)}</span></div>
                        <p className={styles.summaryNote}>*Final total based on exact weight at pickup.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useCallback, useMemo, useRef, useTransition, useSyncExternalStore, type CSSProperties } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { usePageTransition } from '@/components/PageTransition';
import styles from './checkout.module.css';

// ── Constants ──────────────────────────────────────────────────────────────
const TAX_RATE = 0.0225;
const CUTOFF_BUFFER_HOURS = 2; // Stop same-day orders 2 hours before store closing
const STORAGE_VERSION = 'v1';

// ── Types ──────────────────────────────────────────────────────────────────
type StoreId = 'butcher' | 'depot';

type CartItem = {
    name: string;
    price: string | number;
    qty: number;
    note?: string;
    desc?: string;
};

type DaySchedule = {
    isClosed: boolean;
    openHour: number;
    openMin: number;
    closeHour: number;
    cutoffHour: number;
    openLabel: string;
    closeLabel: string;
    cutoffLabel: string;
};

type WeeklyScheduleGroup = {
    daysLabel: string;
    dayNums: number[];
    hoursLabel: string;
    cutoffLabel: string;
    isClosed: boolean;
};

const STORE_WEEKLY_GROUPS: Record<StoreId, WeeklyScheduleGroup[]> = {
    butcher: [
        {
            daysLabel: 'Tue – Fri',
            dayNums: [2, 3, 4, 5],
            hoursLabel: '10:00 AM – 6:00 PM',
            cutoffLabel: 'Cutoff 4:00 PM (2h buffer)',
            isClosed: false,
        },
        {
            daysLabel: 'Saturday',
            dayNums: [6],
            hoursLabel: '10:00 AM – 5:00 PM',
            cutoffLabel: 'Cutoff 3:00 PM (2h buffer)',
            isClosed: false,
        },
        {
            daysLabel: 'Sunday',
            dayNums: [0],
            hoursLabel: '10:00 AM – 4:00 PM',
            cutoffLabel: 'Cutoff 2:00 PM (2h buffer)',
            isClosed: false,
        },
        {
            daysLabel: 'Monday',
            dayNums: [1],
            hoursLabel: 'Closed',
            cutoffLabel: 'Ready Tue 10:00 AM',
            isClosed: true,
        },
    ],
    depot: [
        {
            daysLabel: 'Mon – Fri',
            dayNums: [1, 2, 3, 4, 5],
            hoursLabel: '10:30 AM – 6:00 PM',
            cutoffLabel: 'Cutoff 4:00 PM (2h buffer)',
            isClosed: false,
        },
        {
            daysLabel: 'Sat – Sun',
            dayNums: [6, 0],
            hoursLabel: 'Closed',
            cutoffLabel: 'Ready Mon 10:30 AM',
            isClosed: true,
        },
    ],
};

// ── Helpers ────────────────────────────────────────────────────────────────
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatShortDate(d: Date): string {
    return `${WEEKDAYS_SHORT[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function formatLongWeekdayDate(d: Date): string {
    return `${WEEKDAYS_LONG[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

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

function formatHour12(hour24: number, min = 0): string {
    const period = hour24 >= 12 ? 'PM' : 'AM';
    let dispH = hour24 > 12 ? hour24 - 12 : hour24;
    if (dispH === 0) dispH = 12;
    const minStr = min === 0 ? '00' : String(min).padStart(2, '0');
    return `${dispH}:${minStr} ${period}`;
}

function formatDurationMinutes(totalMins: number): string {
    const clamped = Math.max(1, Math.ceil(totalMins));
    const hrs = Math.floor(clamped / 60);
    const mins = clamped % 60;
    if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
    if (hrs > 0) return `${hrs} ${hrs === 1 ? 'hour' : 'hours'}`;
    return `${mins} min`;
}

function getStoreHoursForDay(dayOfWeek: number, activeStore: StoreId): DaySchedule {
    if (activeStore === 'butcher') {
        if (dayOfWeek === 1) {
            return {
                isClosed: true,
                openHour: 10,
                openMin: 0,
                closeHour: 18,
                cutoffHour: 16,
                openLabel: '',
                closeLabel: '',
                cutoffLabel: '',
            };
        }
        const closeHour = dayOfWeek === 6 ? 17 : dayOfWeek === 0 ? 16 : 18;
        const cutoffHour = closeHour - CUTOFF_BUFFER_HOURS;
        return {
            isClosed: false,
            openHour: 10,
            openMin: 0,
            closeHour,
            cutoffHour,
            openLabel: '10:00 AM',
            closeLabel: formatHour12(closeHour, 0),
            cutoffLabel: formatHour12(cutoffHour, 0),
        };
    }

    // The Depot (Winnetka) — Mon–Fri 10:30 AM – 6:00 PM
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return {
            isClosed: true,
            openHour: 10,
            openMin: 30,
            closeHour: 18,
            cutoffHour: 16,
            openLabel: '',
            closeLabel: '',
            cutoffLabel: '',
        };
    }
    const closeHour = 18;
    const cutoffHour = closeHour - CUTOFF_BUFFER_HOURS;
    return {
        isClosed: false,
        openHour: 10,
        openMin: 30,
        closeHour,
        cutoffHour,
        openLabel: '10:30 AM',
        closeLabel: formatHour12(closeHour, 0),
        cutoffLabel: formatHour12(cutoffHour, 0),
    };
}

// ── Date / time helpers ────────────────────────────────────────────────────
function getAvailablePickupDates(activeStore: StoreId, now: Date): Date[] {
    const dates: Date[] = [];
    for (let i = 0; i < 14; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        const sched = getStoreHoursForDay(d.getDay(), activeStore);
        if (sched.isClosed) continue;

        // Enforce 2-hour same-day cutoff buffer before store closing
        if (i === 0) {
            if (now.getHours() >= sched.cutoffHour) {
                continue;
            }
        }
        dates.push(d);
    }
    return dates;
}

function getAvailableTimeSlots(date: Date | null, activeStore: StoreId, now: Date) {
    if (!date) return [];
    const slots: { label: string; value: string; disabled: boolean }[] = [];
    const sched = getStoreHoursForDay(date.getDay(), activeStore);
    if (sched.isClosed) return [];

    const isToday = date.toDateString() === now.toDateString();
    const start = sched.openHour;
    const startMin = sched.openMin;
    const end = sched.closeHour;

    for (let h = start; h < end; h++) {
        if (!(h === start && startMin === 30)) {
            const dis = isToday && (h < now.getHours() || (h === now.getHours() && now.getMinutes() + 30 > 0));
            slots.push({ label: '', value: `${h}:00`, disabled: dis });
        }
        const dis30 = isToday && (h < now.getHours() || (h === now.getHours() && now.getMinutes() + 30 > 30));
        slots.push({ label: '', value: `${h}:30`, disabled: dis30 });
    }
    let foundFirst = false;
    return slots.map(s => {
        const [h, m] = s.value.split(':');
        const hh = parseInt(h, 10);
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

function getCutoffStatusInfo(activeStore: StoreId, now: Date, firstAvailableDate: Date | undefined) {
    const todaySched = getStoreHoursForDay(now.getDay(), activeStore);
    const nextDateLabel = firstAvailableDate
        ? formatLongWeekdayDate(firstAvailableDate)
        : 'next business day';
    const nextSched = firstAvailableDate
        ? getStoreHoursForDay(firstAvailableDate.getDay(), activeStore)
        : todaySched;
    const nextOpenLabel = nextSched.openLabel || (activeStore === 'butcher' ? '10:00 AM' : '10:30 AM');

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = todaySched.openHour * 60 + todaySched.openMin;
    const cutoffMinutes = todaySched.cutoffHour * 60;
    const closeMinutes = todaySched.closeHour * 60;

    if (todaySched.isClosed) {
        return {
            state: 'closed' as const,
            badgeText: 'Store Closed Today · Next Business Day Pickup',
            todayTag: 'Today: Closed',
            headline: `We're closed today — your order will be ready next business day (${nextDateLabel} starting at ${nextOpenLabel}).`,
            subtext: `Same-day pickup requires a ${CUTOFF_BUFFER_HOURS}-hour buffer before store closing. Orders placed while closed are prepared fresh first thing on our next open business day.`,
            isSameDayAvailable: false,
            nextDateLabel,
            nextOpenLabel,
        };
    }

    if (nowMinutes < cutoffMinutes) {
        const minsToCutoff = cutoffMinutes - nowMinutes;
        const minsToClose = closeMinutes - nowMinutes;
        const cutoffCountdown = formatDurationMinutes(minsToCutoff);
        const closeCountdown = formatDurationMinutes(minsToClose);

        const headline =
            nowMinutes < openMinutes
                ? `Opens today at ${todaySched.openLabel} — same-day orders close at ${todaySched.cutoffLabel} (${CUTOFF_BUFFER_HOURS} hours before our ${todaySched.closeLabel} close).`
                : `You have ${cutoffCountdown} left to order for same-day pickup (${closeCountdown} until store closes at ${todaySched.closeLabel}).`;

        return {
            state: 'open' as const,
            badgeText: `Same-Day Pickup Open · ${CUTOFF_BUFFER_HOURS}-Hr Closing Buffer`,
            todayTag: `Today: ${todaySched.openLabel} – ${todaySched.closeLabel} (Cutoff ${todaySched.cutoffLabel})`,
            headline,
            subtext: `We stop taking same-day orders ${CUTOFF_BUFFER_HOURS} hours before close (${todaySched.cutoffLabel} today) so our butchers have time to custom-cut and pack your order. Orders placed after ${todaySched.cutoffLabel} will come ready on the next business day.`,
            isSameDayAvailable: true,
            nextDateLabel,
            nextOpenLabel,
        };
    }

    if (nowMinutes < closeMinutes) {
        const minsToClose = closeMinutes - nowMinutes;
        const closeCountdown = formatDurationMinutes(minsToClose);

        return {
            state: 'buffer' as const,
            badgeText: `Within ${CUTOFF_BUFFER_HOURS}-Hr Closing Buffer · Ready Next Business Day`,
            todayTag: `Today: ${todaySched.openLabel} – ${todaySched.closeLabel} (Cutoff ${todaySched.cutoffLabel} Passed)`,
            headline: `Heads up: There is only ${closeCountdown} left before the store closes at ${todaySched.closeLabel} — same-day ordering ended at ${todaySched.cutoffLabel}.`,
            subtext: `Because we require a ${CUTOFF_BUFFER_HOURS}-hour buffer before closing to prepare fresh cuts, you can no longer order for pickup today. Your order will come ready on the next business day: ${nextDateLabel} starting at ${nextOpenLabel}.`,
            isSameDayAvailable: false,
            nextDateLabel,
            nextOpenLabel,
        };
    }

    return {
        state: 'closed' as const,
        badgeText: 'Closed for the Evening · Ready Next Business Day',
        todayTag: `Today's Hours (${todaySched.openLabel} – ${todaySched.closeLabel}) Have Ended`,
        headline: `The shop closed at ${todaySched.closeLabel} today — your order will come ready on the next business day (${nextDateLabel} starting at ${nextOpenLabel}).`,
        subtext: `Same-day online orders must be placed at least ${CUTOFF_BUFFER_HOURS} hours before store closing (${todaySched.cutoffLabel}). Orders placed within the 2-hour closing window or after hours are prepared fresh for the next business day.`,
        isSameDayAvailable: false,
        nextDateLabel,
        nextOpenLabel,
    };
}

function readInitialCheckoutState(): { store: StoreId; items: CartItem[] } {
    if (typeof window === 'undefined') {
        return { store: 'butcher', items: [] };
    }
    try {
        const rawStore = localStorage.getItem('hofherr_active_store');
        const store: StoreId = rawStore === 'depot' ? 'depot' : 'butcher';
        const key = store === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot';
        const saved =
            localStorage.getItem(`${key}_${STORAGE_VERSION}`) ||
            localStorage.getItem(key) ||
            localStorage.getItem('hofherr_cart');
        const items: CartItem[] = saved ? JSON.parse(saved) : [];
        return { store, items };
    } catch {
        return { store: 'butcher', items: [] };
    }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function CheckoutClient() {
    const { data: session, status } = useSession();
    const { navigateTo } = usePageTransition();
    const [isPending, startTransition] = useTransition();

    const [now, setNow] = useState<Date>(() => new Date());
    const [activeStore, setActiveStore] = useState<StoreId>(() => readInitialCheckoutState().store);
    const [cart, setCart] = useState<CartItem[]>(() => readInitialCheckoutState().items);

    const isGodModeClient = useSyncExternalStore(
        () => () => {},
        () => document.cookie.includes('hofherr_god_mode=true'),
        () => false
    );

    const sessionUser = useMemo(() => {
        if (session?.user) {
            return session.user as { id?: string; name?: string | null; email?: string | null; phone?: string | null };
        }
        if (isGodModeClient) {
            return {
                id: 'god-mode-user',
                name: 'Michael Scimeca',
                email: 'mikeyscimeca@gmail.com',
                phone: '847-441-6328',
            };
        }
        return undefined;
    }, [session?.user, isGodModeClient]);

    const isAuthenticated = Boolean(sessionUser);
    const [guestProceeded, setGuestProceeded] = useState(false);
    const step: 'auth' | 'form' = isAuthenticated || guestProceeded ? 'form' : 'auth';

    // Form state
    const [nameInput, setNameInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [addressInput, setAddressInput] = useState('');
    const [postalCodeInput, setPostalCodeInput] = useState('');
    const [selectedSlotValue, setSelectedSlotValue] = useState('');
    const [contactPref, setContactPref] = useState<'phone' | 'email'>('phone');
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'instore'>('stripe');
    const [orderNote, setOrderNote] = useState('');
    const [stripeError, setStripeError] = useState('');

    // Auth state
    const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authNotice, setAuthNotice] = useState('');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', address: '', postalCode: '', password: '' });
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState(false);

    // Date / time
    const [selectedDateIdx, setSelectedDateIdx] = useState(0);
    const dateScrollRef = useRef<HTMLDivElement>(null);
    const dateThumbRef = useRef<HTMLDivElement>(null);
    const [dateThumbLeft, setDateThumbLeft] = useState(0);
    const [dateThumbWidth, setDateThumbWidth] = useState(0);

    // Keep live clock ticked every 30s so countdowns & 2-hour cutoff stay accurate
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Redirect to orders if cart is empty
    useEffect(() => {
        if (cart.length === 0 && status !== 'loading') {
            const t = setTimeout(() => {
                navigateTo('/online-orders');
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [cart.length, status, navigateTo]);

    const handleStoreSwitch = (nextStore: StoreId) => {
        setActiveStore(nextStore);
        setSelectedDateIdx(0);
        setSelectedSlotValue('');
        try {
            localStorage.setItem(`hofherr_active_store_${STORAGE_VERSION}`, nextStore);
            localStorage.setItem('hofherr_active_store', nextStore);
            const key = nextStore === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot';
            const saved = localStorage.getItem(key) || localStorage.getItem('hofherr_cart');
            if (saved) {
                const parsed: CartItem[] = JSON.parse(saved);
                if (parsed.length > 0) setCart(parsed);
            }
        } catch {
            // ignore storage errors
        }
    };

    // Dates & slots
    const availableDates = useMemo(() => getAvailablePickupDates(activeStore, now), [activeStore, now]);
    const activeDate = availableDates[selectedDateIdx] ?? availableDates[0] ?? null;
    const availableSlots = useMemo(
        () => getAvailableTimeSlots(activeDate, activeStore, now),
        [activeDate, activeStore, now]
    );
    const cutoffInfo = useMemo(
        () => getCutoffStatusInfo(activeStore, now, availableDates[0]),
        [activeStore, now, availableDates]
    );

    const firstEnabledSlot = availableSlots.find(s => !s.disabled);
    const effectiveSlotValue =
        selectedSlotValue && availableSlots.some(s => !s.disabled && s.value === selectedSlotValue)
            ? selectedSlotValue
            : (firstEnabledSlot?.value ?? '');

    const activeDateLabel = activeDate ? formatShortDate(activeDate) : '';
    const pickupString = activeDateLabel && effectiveSlotValue ? `${activeDateLabel} at ${effectiveSlotValue}` : '';

    const resolvedName = nameInput || sessionUser?.name || (isAuthenticated ? 'Hofherr Customer' : '');
    const resolvedEmail = emailInput || sessionUser?.email || '';
    const resolvedPhone = phoneInput || (sessionUser?.phone ? formatPhoneNumber(sessionUser.phone) : '');

    // Custom scrollbar for date strip
    const updateDateThumb = useCallback(() => {
        const el = dateScrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        if (scrollWidth <= clientWidth) {
            setDateThumbWidth(0);
            return;
        }
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
        setAuthNotice('');
        setAuthLoading(true);
        try {
            const res = await signIn('credentials', {
                email: loginData.email,
                password: loginData.password,
                redirect: false,
            });
            if (res?.error) throw new Error('Invalid email or password');
            setGuestProceeded(true);
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : 'Sign-in failed');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthNotice('');
        setAuthLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            if (data.requiresVerification) {
                setAuthError('');
                setAuthNotice('Account created! Please check your email to verify your account before signing in.');
                setAuthLoading(false);
                setAuthMode('login');
                return;
            }

            const sr = await signIn('credentials', {
                email: registerData.email,
                password: registerData.password,
                redirect: false,
            });
            if (sr?.error) throw new Error('Could not auto-login after registration');
            setGuestProceeded(true);
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthNotice('');
        setAuthLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send reset link.');
            setForgotSuccess(true);
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : 'Failed to send reset link.');
        } finally {
            setAuthLoading(false);
        }
    };

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStripeError('');
        const contactPayload = {
            name: resolvedName,
            phone: resolvedPhone,
            email: resolvedEmail,
            address: addressInput,
            postalCode: postalCodeInput,
            pickup: pickupString,
        };
        startTransition(async () => {
            try {
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: cart,
                        contact: contactPayload,
                        orderNote,
                        customerId: sessionUser?.id,
                        coupon: null,
                        storeId: activeStore,
                        paymentMethod,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? 'Checkout failed');
                try {
                    const key = activeStore === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot';
                    localStorage.removeItem(`${key}_${STORAGE_VERSION}`);
                    localStorage.removeItem(key);
                    localStorage.removeItem('hofherr_cart');
                } catch {
                    // ignore storage errors
                }
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    navigateTo(
                        `/order/success?instore=true&pickupTime=${encodeURIComponent(pickupString)}&name=${encodeURIComponent(resolvedName)}&storeId=${activeStore}&summary=${encodeURIComponent(cart.map(i => `${i.name} x${i.qty}`).join(', '))}`
                    );
                }
            } catch (err) {
                setStripeError(err instanceof Error ? err.message : 'Something went wrong.');
            }
        });
    };

    // ── Derived ────────────────────────────────────────────────────────────
    const subtotal = cart.reduce((s, i) => s + parseItemPrice(i.price) * i.qty, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    const thumbVars = {
        '--thumb-left': `${dateThumbLeft}px`,
        '--thumb-width': `${dateThumbWidth}px`,
    } as CSSProperties;

    const cutoffCardClass =
        cutoffInfo.state === 'open'
            ? `${styles.hoursCutoffCard} ${styles.hoursCutoffCardOpen}`
            : cutoffInfo.state === 'buffer'
              ? `${styles.hoursCutoffCard} ${styles.hoursCutoffCardBuffer}`
              : `${styles.hoursCutoffCard} ${styles.hoursCutoffCardClosed}`;

    const badgeClass =
        cutoffInfo.state === 'open'
            ? `${styles.statusBadge} ${styles.statusBadgeOpen}`
            : cutoffInfo.state === 'buffer'
              ? `${styles.statusBadge} ${styles.statusBadgeBuffer}`
              : `${styles.statusBadge} ${styles.statusBadgeClosed}`;

    return (
        <main className={styles.page}>
            {/* Back link */}
            <Link href="/online-orders" className={styles.backLink}>
                ← Back to Shop
            </Link>

            <div className={styles.layout}>
                {/* ── Left: Form ── */}
                <div className={styles.formCol}>
                    <h1 className={styles.heading}>Complete Your Order</h1>

                    {/* Store banner + location switcher */}
                    <div className={styles.storeBanner}>
                        <span className={styles.storeBannerLocation}>
                            📍 Pickup at: {activeStore === 'butcher' ? 'The Butcher Shop (300 Happ Rd, Northfield)' : 'The Depot (600 Elm St, Winnetka)'}
                        </span>
                        <div className={styles.storeSwitchRow}>
                            <button
                                type="button"
                                className={`${styles.storeSwitchBtn} ${activeStore === 'butcher' ? styles.storeSwitchBtnActive : ''}`}
                                onClick={() => handleStoreSwitch('butcher')}
                            >
                                Northfield Butcher Shop
                            </button>
                            <button
                                type="button"
                                className={`${styles.storeSwitchBtn} ${activeStore === 'depot' ? styles.storeSwitchBtnActive : ''}`}
                                onClick={() => handleStoreSwitch('depot')}
                            >
                                Winnetka Depot
                            </button>
                        </div>
                    </div>

                    {/* ── Store Hours & 2-Hour Same-Day Cutoff Buffer Card ── */}
                    <section aria-labelledby="checkout-hours-heading" className={cutoffCardClass}>
                        <div className={styles.cutoffTopRow}>
                            <span id="checkout-hours-heading" className={badgeClass}>
                                {cutoffInfo.badgeText}
                            </span>
                            <span className={styles.todayHoursTag}>{cutoffInfo.todayTag}</span>
                        </div>

                        <p className={styles.cutoffHeadline}>{cutoffInfo.headline}</p>
                        <p className={styles.cutoffSubtext}>{cutoffInfo.subtext}</p>

                        <div className={styles.hoursScheduleGrid}>
                            {STORE_WEEKLY_GROUPS[activeStore].map(group => {
                                const isTodayGroup = group.dayNums.includes(now.getDay());
                                return (
                                    <div
                                        key={group.daysLabel}
                                        className={`${styles.hoursScheduleItem} ${isTodayGroup ? styles.hoursScheduleItemToday : ''}`}
                                    >
                                        <span className={styles.scheduleDay}>
                                            {group.daysLabel}
                                            {isTodayGroup && <span className={styles.todayPill}>TODAY</span>}
                                        </span>
                                        {group.isClosed ? (
                                            <span className={styles.scheduleClosed}>{group.hoursLabel}</span>
                                        ) : (
                                            <span className={styles.scheduleHours}>{group.hoursLabel}</span>
                                        )}
                                        <span className={styles.scheduleCutoff}>{group.cutoffLabel}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── AUTH STEP ── */}
                    {step === 'auth' && (
                        <div className={styles.authBox}>
                            <h2 className={styles.authTitle}>
                                {authMode === 'forgot' ? 'Reset Password' : authMode === 'register' ? 'Create Account' : 'Sign In to Checkout'}
                            </h2>
                            <p className={styles.authSub}>
                                {authMode === 'forgot' ? "We'll send you a reset link." : authMode === 'register' ? 'Join for faster checkout & rewards.' : 'Sign in to continue.'}
                            </p>

                            {authNotice && <p className={styles.successMsg}>✅ {authNotice}</p>}

                            {/* Social buttons */}
                            {authMode !== 'forgot' && (
                                <div className={styles.socialRow}>
                                    <button type="button" className={styles.socialBtn} onClick={() => signIn('google', { callbackUrl: '/checkout' })}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" /><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" /><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" /><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" /></svg>
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
                                            <input className={styles.authInput} type="email" placeholder="Your email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required autoComplete="email" />
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
                                        <input className={styles.authInput} type="text" placeholder="Full Name" value={registerData.name} onChange={e => setRegisterData(d => ({ ...d, name: e.target.value }))} required autoComplete="name" />
                                        <input className={styles.authInput} type="tel" placeholder="Phone" value={registerData.phone} onChange={e => setRegisterData(d => ({ ...d, phone: formatPhoneNumber(e.target.value) }))} required autoComplete="tel" />
                                        <input className={styles.authInput} type="email" placeholder="Email" value={registerData.email} onChange={e => setRegisterData(d => ({ ...d, email: e.target.value }))} required autoComplete="email" />
                                        <input className={styles.authInput} type="password" placeholder="Password" value={registerData.password} onChange={e => setRegisterData(d => ({ ...d, password: e.target.value }))} required autoComplete="new-password" />
                                    </div>
                                    <div className={styles.authGrid}>
                                        <input className={styles.authInput} type="text" placeholder="Street Address" value={registerData.address} onChange={e => setRegisterData(d => ({ ...d, address: e.target.value }))} required autoComplete="address-line1" />
                                        <input className={styles.authInput} type="text" placeholder="ZIP / Postal Code" value={registerData.postalCode} onChange={e => setRegisterData(d => ({ ...d, postalCode: e.target.value }))} autoComplete="postal-code" />
                                    </div>
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
                                    <input className={styles.authInput} type="email" placeholder="Email" value={loginData.email} onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))} required autoComplete="email" />
                                    <input className={styles.authInput} type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))} required autoComplete="current-password" />
                                    {authError && <p className={styles.authError}>⚠️ {authError}</p>}
                                    <button type="submit" className={styles.authBtn} disabled={authLoading}>{authLoading ? 'Signing in…' : 'Sign In'}</button>
                                    <div className={styles.switchRow}>
                                        <button type="button" className={styles.switchLink} onClick={() => setAuthMode('forgot')}>Forgot password?</button>
                                        <button type="button" className={styles.switchLink} onClick={() => setAuthMode('register')}>Create account</button>
                                    </div>
                                    <div className={styles.dividerOr}><span>or</span></div>
                                    <button type="button" className={styles.guestBtn} onClick={() => setGuestProceeded(true)}>Continue as Guest →</button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* ── FORM STEP ── */}
                    {step === 'form' && (
                        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
                            {/* Contact info */}
                            <div className={styles.section}>
                                {isAuthenticated ? (
                                    <div className={styles.signedInCard}>
                                        <div className={styles.signedInInfo}>
                                            <span className={styles.signedInTag}>Signed In Account</span>
                                            <span className={styles.signedInName}>{resolvedName}</span>
                                            <span className={styles.signedInDetails}>
                                                {[resolvedEmail, resolvedPhone].filter(Boolean).join(' · ')}
                                            </span>
                                        </div>
                                        <div className={styles.contactRight}>
                                            <p className={styles.reachLabel}>HOW SHOULD WE REACH YOU?</p>
                                            <div className={styles.prefRow}>
                                                <button type="button" className={`${styles.prefBtn} ${contactPref === 'phone' ? styles.prefBtnActive : ''}`} onClick={() => setContactPref('phone')}>📞 Call Me</button>
                                                <button type="button" className={`${styles.prefBtn} ${contactPref === 'email' ? styles.prefBtnActive : ''}`} onClick={() => setContactPref('email')}>✉️ Email Me</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.contactGrid}>
                                        <div className={styles.contactLeft}>
                                            <input
                                                required
                                                name="name"
                                                id="checkout-name"
                                                autoComplete="name"
                                                className={styles.input}
                                                placeholder="Full Name"
                                                value={resolvedName}
                                                onChange={e => setNameInput(e.target.value)}
                                            />
                                            <div className={styles.inputRow}>
                                                <input
                                                    required
                                                    name="tel"
                                                    id="checkout-phone"
                                                    autoComplete="tel"
                                                    type="tel"
                                                    className={styles.input}
                                                    placeholder="(847) 555-0100"
                                                    value={resolvedPhone}
                                                    onChange={e => setPhoneInput(formatPhoneNumber(e.target.value))}
                                                />
                                                <input
                                                    required
                                                    name="email"
                                                    id="checkout-email"
                                                    autoComplete="email"
                                                    type="email"
                                                    className={styles.input}
                                                    placeholder="Email Address"
                                                    value={resolvedEmail}
                                                    onChange={e => setEmailInput(e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.inputRow}>
                                                <input
                                                    name="address"
                                                    id="checkout-address"
                                                    autoComplete="address-line1"
                                                    type="text"
                                                    className={styles.input}
                                                    placeholder="Street Address (Optional / Billing)"
                                                    value={addressInput}
                                                    onChange={e => setAddressInput(e.target.value)}
                                                />
                                                <input
                                                    name="postalCode"
                                                    id="checkout-postal"
                                                    autoComplete="postal-code"
                                                    type="text"
                                                    className={styles.input}
                                                    placeholder="ZIP / Postal Code"
                                                    value={postalCodeInput}
                                                    onChange={e => setPostalCodeInput(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.contactRight}>
                                            <p className={styles.reachLabel}>HOW SHOULD WE REACH YOU?</p>
                                            <div className={styles.prefRow}>
                                                <button type="button" className={`${styles.prefBtn} ${contactPref === 'phone' ? styles.prefBtnActive : ''}`} onClick={() => setContactPref('phone')}>📞 Call Me</button>
                                                <button type="button" className={`${styles.prefBtn} ${contactPref === 'email' ? styles.prefBtnActive : ''}`} onClick={() => setContactPref('email')}>✉️ Email Me</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Date & time picker */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionLabel}>SELECT PICKUP DAY &amp; TIME</h2>
                                <p className={styles.prepNote}>
                                    ⚡ Orders require a {CUTOFF_BUFFER_HOURS}-hour buffer before store closing for same-day pickup.
                                </p>

                                {!cutoffInfo.isSameDayAvailable && (
                                    <div className={styles.nextBizBanner}>
                                        📅 <strong>Scheduled for Next Business Day:</strong> Because today&apos;s {CUTOFF_BUFFER_HOURS}-hour closing cutoff has passed (or the store is closed), your earliest pickup is <strong>{cutoffInfo.nextDateLabel} starting at {cutoffInfo.nextOpenLabel}</strong>.
                                    </div>
                                )}

                                {/* Date scroll */}
                                <div className={styles.dateSelectorContainer}>
                                    <div className={styles.dateScrollTrack}>
                                        {dateThumbWidth > 0 && (
                                            <div ref={dateThumbRef} className={styles.dateScrollThumb} style={thumbVars} />
                                        )}
                                    </div>
                                    <div
                                        ref={dateScrollRef}
                                        onScroll={updateDateThumb}
                                        className={styles.dateScrollViewport}
                                    >
                                        <div className={styles.dateScrollRow}>
                                            {availableDates.map((date, idx) => {
                                                const isDateToday = date.toDateString() === now.toDateString();
                                                return (
                                                    <button
                                                        key={date.toISOString()}
                                                        type="button"
                                                        className={`${styles.dateBtn} ${selectedDateIdx === idx ? styles.dateBtnActive : ''}`}
                                                        onClick={() => {
                                                            setSelectedDateIdx(idx);
                                                            setSelectedSlotValue('');
                                                        }}
                                                    >
                                                        <span className={styles.dateDay}>{WEEKDAYS_SHORT[date.getDay()]}</span>
                                                        <span className={styles.dateNum}>{date.getDate()}</span>
                                                        {idx === 0 && (
                                                            <span className={styles.dateTag}>
                                                                {isDateToday ? 'TODAY' : 'NEXT BIZ'}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Time slots */}
                                <div className={styles.timeGrid}>
                                    {availableSlots.length > 0 ? availableSlots.map(slot => {
                                        const isActive = effectiveSlotValue === slot.value;
                                        if (slot.disabled) return (
                                            <button key={slot.value} type="button" disabled className={styles.timeSlotBtnDisabled}>
                                                {slot.label || slot.value}
                                            </button>
                                        );
                                        return (
                                            <button
                                                key={slot.value}
                                                type="button"
                                                className={`${styles.timeSlotBtn} ${isActive ? styles.timeSlotBtnActive : ''}`}
                                                onClick={() => setSelectedSlotValue(slot.value)}
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
                                        <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className={styles.hiddenRadio} />
                                        💳 Pay Online
                                    </label>
                                    <label className={`${styles.payBtn} ${paymentMethod === 'instore' ? styles.payBtnActive : ''}`}>
                                        <input type="radio" name="paymentMethod" value="instore" checked={paymentMethod === 'instore'} onChange={() => setPaymentMethod('instore')} className={styles.hiddenRadio} />
                                        🏪 Pay In-Store
                                    </label>
                                </div>
                            </div>

                            {stripeError && <p className={styles.stripeError}>⚠️ {stripeError}</p>}

                            <div className={styles.formActions}>
                                {!isAuthenticated && (
                                    <button type="button" className={styles.backBtn} onClick={() => setGuestProceeded(false)}>← Back</button>
                                )}
                                <button type="submit" className={styles.submitBtn} disabled={isPending || !pickupString}>
                                    {isPending ? 'Processing…' : (paymentMethod === 'stripe' ? 'Continue to Payment' : 'Place Order')}
                                </button>
                            </div>
                            <p className={styles.secureNote}>🔒 Powered by Stripe · 256-bit SSL</p>
                        </form>
                    )}
                </div>

                {/* ── Right: Order Summary ── */}
                <aside className={styles.summaryCol} aria-label="Order Summary">
                    <div className={styles.summaryCard}>
                        <h2 className={styles.summaryTitle}>Order Summary</h2>
                        <div className={styles.summaryItems}>
                            {cart.map((item) => (
                                <div key={`${item.name}-${item.note || ''}`} className={styles.summaryItem}>
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
                </aside>
            </div>
        </main>
    );
}

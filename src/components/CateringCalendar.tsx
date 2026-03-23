'use client';

import { useState, useMemo } from 'react';
import styles from './CateringCalendar.module.css';

type CateringEvent = {
    _id: string;
    date: string;
    eventType: string;
    status: string;
    guestCount?: number;
};

interface Props {
    events: CateringEvent[];
    defaultPricing?: { label: string; price: string }[];
    externalSelectedDate?: string | null;
    onDateSelect?: (dateStr: string | null) => void;
    className?: string;
    hideDetailCTA?: boolean;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENT_LABELS: Record<string, string> = {
    'pig-roast': '🐷 Pig Roast',
    'bbq':       '🔥 BBQ Catering',
    'rotisserie':'🍗 Rotisserie',
    'custom':    '🥩 Custom Event',
};

const EVENT_EMOJI: Record<string, string> = {
    'pig-roast': '🐷',
    'bbq':       '🔥',
    'rotisserie':'🍗',
    'custom':    '🥩',
};

const PRICING: Record<string, { label: string; price: string }[]> = {
    'pig-roast': [
        { label: 'Just the Pig (50+ guests)', price: '$30/pp' },
        { label: 'Pig + 1 Side', price: '$32/pp' },
        { label: 'Pig + 2 Sides', price: '$34/pp' },
        { label: 'Pig + 3 Sides', price: '$36/pp' },
    ],
    'bbq': [
        { label: '1 Meat + 1 Side (20+ guests)', price: '$16/pp' },
        { label: 'Each Additional Meat', price: '+$4/pp' },
        { label: 'Each Additional Side', price: '+$2/pp' },
        { label: 'Charcuterie Add-on', price: '+$4/pp' },
    ],
    'rotisserie': [
        { label: 'Whole Chicken', price: 'Market price' },
        { label: 'With Schmaltzy Potatoes', price: 'Included' },
    ],
};

const DEFAULT_PRICING = [
    { label: 'Pig Roast (50+ guests)', price: 'From $30/pp' },
    { label: 'BBQ Catering (20+ guests)', price: 'From $16/pp' },
    { label: 'Ask us about custom options', price: 'Contact us' },
];

const LEAD_DAYS = 4;

type FormState = {
    name: string; email: string; phone: string;
    eventType: string; guestCount: string; notes: string;
};

export default function CateringCalendar({ events, defaultPricing, externalSelectedDate, onDateSelect, className, hideDetailCTA }: Props) {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());

    // Sync with external state if needed, but local fallback is okay if we use local for the click handler
    const selectedDate = externalSelectedDate ?? null;
    const [showForm, setShowForm] = useState(false);
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formError, setFormError] = useState('');
    const [form, setForm] = useState<FormState>({
        name: '', email: '', phone: '', eventType: 'pig-roast', guestCount: '', notes: '',
    });
    const [notifyEmail, setNotifyEmail] = useState('');
    const [notifySent, setNotifySent] = useState<Set<string>>(new Set());

    const minBookable = useMemo(() => {
        const d = new Date(today);
        d.setDate(d.getDate() + LEAD_DAYS);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }, []);

    const bookedDates = useMemo(() => {
        const map = new Map<string, CateringEvent>();
        for (const evt of events) map.set(evt.date, evt);
        return map;
    }, [events]);

    const calendarDays = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1);
        const lastDay  = new Date(viewYear, viewMonth + 1, 0);
        const startPad = firstDay.getDay();
        const totalDays = lastDay.getDate();
        const days: { date: number | null; dateStr: string; isPast: boolean; isTooSoon: boolean }[] = [];
        for (let i = 0; i < startPad; i++) days.push({ date: null, dateStr: '', isPast: false, isTooSoon: false });
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayDate = new Date(viewYear, viewMonth, d);
            const isPast  = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isTooSoon = !isPast && dayDate < minBookable;
            days.push({ date: d, dateStr, isPast, isTooSoon });
        }
        return days;
    }, [viewMonth, viewYear]);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };
    const canGoPrev = viewYear > today.getFullYear() ||
        (viewYear === today.getFullYear() && viewMonth > today.getMonth());

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const selectedEvent = selectedDate ? bookedDates.get(selectedDate) : null;

    const handleDateSelect = (dateStr: string, alreadySelected: boolean) => {
        const nextValue = alreadySelected ? null : dateStr;
        if (onDateSelect) {
            onDateSelect(nextValue);
        }
        setShowForm(false); 
        setFormStatus('idle');
    };

    const handleNotify = (dateStr: string) => {
        if (!notifyEmail.trim()) return;
        const d = new Date(dateStr + 'T12:00:00');
        const formatted = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const emailBody = `&body=Please%20add%20${encodeURIComponent(notifyEmail)}%20to%20the%20waitlist%20for%20${encodeURIComponent(formatted)}.`;
        window.location.href = `mailto:catering@hofherrmeatco.com?subject=Waitlist%20Request%20—%20${encodeURIComponent(formatted)}${emailBody}`;
        setNotifySent(prev => new Set([...prev, dateStr]));
        setNotifyEmail('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;
        setFormStatus('submitting');
        setFormError('');
        try {
            const res = await fetch('/api/catering-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    guestCount: form.guestCount ? parseInt(form.guestCount) : 0,
                    eventDate: selectedDate,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed');
            setFormStatus('success');
        } catch (err) {
            setFormStatus('error');
            setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
    };

    const upcomingCount = events.filter(e => e.status === 'confirmed').length;
    const selectedDateLabel = selectedDate
        ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        : '';

    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h3 className={styles.title}>Availability Calendar</h3>
                    <p className={styles.subtitle}>
                        Min. {LEAD_DAYS} days notice required &middot; Select a date to book
                    </p>
                </div>
                <div className={styles.legend}>
                    <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendAvailable}`} /> Available</span>
                    <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendTooSoon}`} /> Too soon</span>
                    <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendHold}`} /> On hold</span>
                    <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendBooked}`} /> Booked</span>
                </div>
            </div>

            {/* Month nav */}
            <div className={styles.monthNav}>
                <button onClick={prevMonth} disabled={!canGoPrev} className={styles.navBtn} aria-label="Previous month">‹</button>
                <span className={styles.monthLabel}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
                <button onClick={nextMonth} className={styles.navBtn} aria-label="Next month">›</button>
            </div>

            {/* Calendar grid */}
            <div className={styles.calendarGrid}>
                {DAY_LABELS.map(d => <div key={d} className={styles.dayLabel}>{d}</div>)}
                {calendarDays.map((day, i) => {
                    if (day.date === null) return <div key={`pad-${i}`} className={styles.dayEmpty} />;
                    const evt = bookedDates.get(day.dateStr);
                    const booked   = evt?.status === 'confirmed';
                    const hold     = evt?.status === 'tentative';
                    const past     = day.isPast;
                    const tooSoon  = day.isTooSoon;
                    const selected = selectedDate === day.dateStr;
                    const isToday  = day.dateStr === todayStr;
                    return (
                        <button
                            key={day.dateStr}
                            className={[
                                styles.dayCell,
                                booked   ? styles.booked   : '',
                                hold     ? styles.hold     : '',
                                past     ? styles.past     : '',
                                tooSoon  ? styles.tooSoon  : '',
                                selected ? styles.selected : '',
                                isToday  ? styles.today    : '',
                            ].join(' ')}
                            onClick={() => !(past || tooSoon) && handleDateSelect(day.dateStr, selected)}
                            disabled={past}
                            aria-label={`${day.date} ${MONTH_NAMES[viewMonth]} — ${booked ? 'booked' : hold ? 'on hold' : tooSoon ? 'too soon' : 'available'}`}
                        >
                            <span className={styles.dayNum}>{day.date}</span>
                            {evt && <span className={styles.cellEmoji} title={EVENT_LABELS[evt.eventType]}>{EVENT_EMOJI[evt.eventType] ?? '📅'}</span>}
                            {tooSoon && !evt && <span className={styles.tooSoonDot}></span>}
                        </button>
                    );
                })}
            </div>

            {/* Selected date panel */}
            {selectedDate && !hideDetailCTA && (
                <div className={styles.detail}>
                    <div className={styles.detailDate}>{selectedDateLabel}</div>

                    {selectedEvent ? (
                        /* Booked / On-Hold */
                        <div className={styles.detailBooked}>
                            <div className={styles.detailTopRow}>
                                <span className={`${styles.detailBadge} ${selectedEvent.status === 'tentative' ? styles.detailHold : ''}`}>
                                    {selectedEvent.status === 'confirmed' ? '🔒 Booked' : '🟡 On Hold'}
                                </span>
                                <span className={styles.detailType}>
                                    {EVENT_LABELS[selectedEvent.eventType] ?? selectedEvent.eventType}
                                    {selectedEvent.guestCount ? ` · ${selectedEvent.guestCount} guests` : ''}
                                </span>
                            </div>
                            <p className={styles.detailNote}>
                                This date is {selectedEvent.status === 'confirmed' ? 'already booked' : 'currently on hold'}. Join the waitlist and we&apos;ll reach out if it opens up.
                            </p>
                            {notifySent.has(selectedDate) ? (
                                <p className={styles.notifySent}>✅ You&apos;re on the waitlist — we&apos;ll reach out if this date opens.</p>
                            ) : (
                                <div className={styles.notifyRow}>
                                    <input type="email" placeholder="your@email.com" value={notifyEmail}
                                        onChange={e => setNotifyEmail(e.target.value)} className={styles.notifyInput}
                                        onKeyDown={e => e.key === 'Enter' && handleNotify(selectedDate)} />
                                    <button className={styles.notifyBtn} onClick={() => handleNotify(selectedDate)} disabled={!notifyEmail.trim()}>
                                        Notify Me
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : formStatus === 'success' ? (
                        /* Success */
                        <div className={styles.successState}>
                            <div className={styles.successIcon}>🎉</div>
                            <h4 className={styles.successTitle}>Request Received!</h4>
                            <p className={styles.successText}>
                                Thanks! We&apos;ll be in touch within 24 hours to confirm your event on <strong>{selectedDateLabel}</strong>.
                            </p>
                            <button className={styles.resetBtn} onClick={() => { if (onDateSelect) onDateSelect(null); setShowForm(false); setFormStatus('idle'); }}>
                                Book Another Date
                            </button>
                        </div>
                    ) : (
                        /* Available */
                        <div className={styles.detailAvailable}>
                            <span className={styles.detailBadgeOpen}>✅ Available</span>
                            <p className={styles.detailNote}>This date is open! Use the estimator to the left to build your menu and request a quote for this specific afternoon.</p>

                            {!hideDetailCTA && (
                                <>
                                    <div className={styles.pricingGrid}>
                                        {(defaultPricing ?? DEFAULT_PRICING).map(p => (
                                            <div key={p.label} className={styles.pricingRow}>
                                                <span>{p.label}</span><strong>{p.price}</strong>
                                            </div>
                                        ))}
                                    </div>

                                    {!showForm ? (
                                        <button className={`btn btn-primary ${styles.bookBtn}`} onClick={() => setShowForm(true)}>
                                            Book This Date
                                        </button>
                                    ) : (
                                        <form className={styles.bookingForm} onSubmit={handleSubmit}>
                                            {/* ... existing form ... */}
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

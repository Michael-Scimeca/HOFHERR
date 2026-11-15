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
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatShortDate(d: Date): string {
    return `${DAY_LABELS[d.getDay()]}, ${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const EVENT_LABELS: Record<string, string> = {
    'pig-roast': '🐷 Pig Roast',
    'bbq': '🔥 BBQ Catering',
    'rotisserie': '🍗 Rotisserie',
    'custom': '🥩 Custom Event',
};

const EVENT_EMOJI: Record<string, string> = {
    'pig-roast': '🐷',
    'bbq': '🔥',
    'rotisserie': '🍗',
    'custom': '🥩',
};

const DEFAULT_PRICING = [
    { label: 'Pig Roast (50+ guests)', price: 'From $30/pp' },
    { label: 'BBQ Catering (20+ guests)', price: 'From $16/pp' },
    { label: 'Ask us about custom options', price: 'Contact us' },
];

const LEAD_DAYS = 4;

export default function CateringCalendar({ events, defaultPricing, externalSelectedDate, onDateSelect, className, hideDetailCTA }: Props) {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());

    // Sync with external state if needed, but local fallback is okay if we use local for the click handler
    const selectedDate = externalSelectedDate ?? null;
    const [tooSoonClickedDate, setTooSoonClickedDate] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formError, setFormError] = useState('');
    const [notifyEmail, setNotifyEmail] = useState('');
    const [notifySent, setNotifySent] = useState<Set<string>>(new Set());

    const minBookable = useMemo(() => {
        const now = new Date();
        const d = new Date(now);
        d.setDate(d.getDate() + LEAD_DAYS);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }, []);

    const minBookableLabel = useMemo(
        () => formatShortDate(minBookable),
        [minBookable]
    );

    const tooSoonClickedLabel = useMemo(() => {
        if (!tooSoonClickedDate) return null;
        const [y, m, day] = tooSoonClickedDate.split('-').map(Number);
        return formatShortDate(new Date(y, m - 1, day));
    }, [tooSoonClickedDate]);

    const bookedDates = useMemo(() => {
        const map = new Map<string, CateringEvent>();
        for (const evt of events) map.set(evt.date, evt);
        return map;
    }, [events]);

    const calendarDays = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const firstDay = new Date(viewYear, viewMonth, 1);
        const lastDay = new Date(viewYear, viewMonth + 1, 0);
        const startPad = firstDay.getDay();
        const totalDays = lastDay.getDate();
        const days: { key: string; date: number | null; dateStr: string; isPast: boolean; isTooSoon: boolean }[] = [];
        for (let i = 0; i < startPad; i++) {
            days.push({ key: `pad-${DAY_LABELS[i]}`, date: null, dateStr: '', isPast: false, isTooSoon: false });
        }
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayDate = new Date(viewYear, viewMonth, d);
            const isPast = dayDate < todayStart;
            const isTooSoon = !isPast && dayDate < minBookable;
            days.push({ key: dateStr, date: d, dateStr, isPast, isTooSoon });
        }
        return days;
    }, [viewMonth, viewYear, minBookable]);

    const prevMonth = () => {
        setTooSoonClickedDate(null);
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        setTooSoonClickedDate(null);
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };
    const canGoPrev = viewYear > today.getFullYear() ||
        (viewYear === today.getFullYear() && viewMonth > today.getMonth());

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const selectedEvent = selectedDate ? bookedDates.get(selectedDate) : null;

    const handleDateSelect = (dateStr: string, alreadySelected: boolean) => {
        setTooSoonClickedDate(null);
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedDate) return;
        setFormStatus('submitting');
        setFormError('');
        try {
            const res = await fetch('/api/catering-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
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

    const selectedDateLabel = selectedDate ?? '';

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
                    <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendTooSoon}`} /> &lt;{LEAD_DAYS}d notice</span>
                    <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendHold}`} /> On hold</span>
                    <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendBooked}`} /> Booked</span>
                </div>
            </div>

            {/* Month nav */}
            <div className={styles.monthNav}>
                <button type="button" onClick={prevMonth} disabled={!canGoPrev} className={styles.navBtn} aria-label="Previous month">‹</button>
                <span className={styles.monthLabel}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
                <button type="button" onClick={nextMonth} className={styles.navBtn} aria-label="Next month">›</button>
            </div>

            {/* Calendar grid + 4-day advance minimum notice */}
            <div className={styles.calendarBody}>
                <div className={styles.calendarGrid}>
                    {DAY_LABELS.map(d => <div key={d} className={styles.dayLabel}>{d}</div>)}
                    {calendarDays.map(day => {
                        if (day.date === null) return <div key={day.key} className={styles.dayEmpty} />;
                        const evt = bookedDates.get(day.dateStr);
                        const booked = evt?.status === 'confirmed';
                        const hold = evt?.status === 'tentative';
                        const past = day.isPast;
                        const tooSoon = day.isTooSoon;
                        const selected = selectedDate === day.dateStr;
                        const isToday = day.dateStr === todayStr;
                        return (
                            <button
                                key={day.key}
                                type="button"
                                className={[
                                    styles.dayCell,
                                    booked ? styles.booked : '',
                                    hold ? styles.hold : '',
                                    past ? styles.past : '',
                                    tooSoon ? styles.tooSoon : '',
                                    selected ? styles.selected : '',
                                    isToday ? styles.today : '',
                                ].join(' ')}
                                onClick={() => {
                                    if (past) return;
                                    if (tooSoon) {
                                        setTooSoonClickedDate(day.dateStr);
                                        return;
                                    }
                                    handleDateSelect(day.dateStr, selected);
                                }}
                                disabled={past}
                                aria-disabled={tooSoon || undefined}
                                aria-describedby={tooSoon ? 'catering-lead-notice' : undefined}
                                title={tooSoon ? `Minimum ${LEAD_DAYS} days advance notice required (earliest: ${minBookableLabel})` : undefined}
                                aria-label={`${day.date} ${MONTH_NAMES[viewMonth]} — ${booked ? 'booked' : hold ? 'on hold' : tooSoon ? `unavailable, minimum ${LEAD_DAYS} days advance notice required` : 'available'}`}
                            >
                                <span className={styles.dayNum}>{day.date}</span>
                                {evt && <span className={styles.cellEmoji} title={EVENT_LABELS[evt.eventType]}>{EVENT_EMOJI[evt.eventType] ?? '📅'}</span>}
                                {tooSoon && !evt && <span className={styles.tooSoonDot} />}
                            </button>
                        );
                    })}
                </div>

                <div
                    id="catering-lead-notice"
                    role="status"
                    aria-live="polite"
                    className={`${styles.leadNotice} ${tooSoonClickedLabel ? styles.leadNoticeActive : ''}`}
                >
                    <span className={styles.leadNoticeIcon} aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </span>
                    <div className={styles.leadNoticeContent}>
                        <span className={styles.leadNoticeTitle}>
                            {LEAD_DAYS}-Day Minimum Advance Notice
                        </span>
                        <p className={styles.leadNoticeText}>
                            {tooSoonClickedLabel ? (
                                <>
                                    <strong>{tooSoonClickedLabel}</strong> is within our {LEAD_DAYS}-day prep window. Please select <strong>{minBookableLabel}</strong> or later.
                                </>
                            ) : (
                                <>
                                    Orders must be placed at least {LEAD_DAYS} days in advance for butcher &amp; smokehouse prep. Earliest available date: <strong>{minBookableLabel}</strong>.
                                </>
                            )}
                        </p>
                    </div>
                </div>
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
                                    <button type="button" className={styles.notifyBtn} onClick={() => handleNotify(selectedDate)} disabled={!notifyEmail.trim()}>
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
                            <button type="button" className={styles.resetBtn} onClick={() => { if (onDateSelect) onDateSelect(null); setShowForm(false); setFormStatus('idle'); }}>
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
                                        <button type="button" className={`btn btn-primary ${styles.bookBtn}`} onClick={() => setShowForm(true)}>
                                            Book This Date
                                        </button>
                                    ) : (
                                        <form className={styles.bookingForm} onSubmit={handleSubmit}>
                                            {formError && <p className={styles.formError}>{formError}</p>}
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

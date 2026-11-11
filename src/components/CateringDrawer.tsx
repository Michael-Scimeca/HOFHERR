'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from './CateringDrawer.module.css';

interface CateringDrawerProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function openCateringDrawer() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open_catering_drawer'));
    }
}

const GUEST_PRESETS = [25, 50, 75, 100, 150, 200];

const EVENT_TYPES = [
    { id: 'pig', name: 'Whole-Pig Roast', desc: 'Craft whole-animal roast, sides & carving' },
    { id: 'feast', name: 'BBQ Feast', desc: 'Prime brisket, pulled pork, ribs & house sides' },
    { id: 'backyard', name: 'Backyard BBQ', desc: 'Sausages, burgers, chicken & casual spread' },
    { id: 'custom', name: 'Corporate / Wedding', desc: 'Full custom chef menu, staffing & setup' },
];

const SERVICE_OPTIONS = [
    { id: 'onsite', title: '🔥 On-Site Pig Roast & Service', sub: 'Full setup, carving block, and live pitmaster service' },
    { id: 'northfield', title: '🥩 Northfield Shop Pickup', sub: 'Packed hot in thermo carriers at 300 Happ Rd' },
    { id: 'depot', title: '🏪 Winnetka Depot Pickup', sub: 'Convenient North Shore Metra station pickup at 754 Elm St' },
];

export default function CateringDrawer({ isOpen: controlledOpen, onClose: controlledClose }: CateringDrawerProps = {}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const onClose = controlledClose || (() => setInternalOpen(false));

    useEffect(() => {
        const handler = () => setInternalOpen(true);
        window.addEventListener('open_catering_drawer', handler);
        const checkHash = () => {
            if (window.location.hash === '#inquire' || window.location.hash === '#get-a-quote') {
                setInternalOpen(true);
            }
        };
        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => {
            window.removeEventListener('open_catering_drawer', handler);
            window.removeEventListener('hashchange', checkHash);
        };
    }, []);

    const [guests, setGuests] = useState(50);
    const [eventType, setEventType] = useState('pig');
    const [servicePref, setServicePref] = useState('onsite');
    
    // Earliest booking date: 4 days from now
    const minDateStr = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 4);
        return d.toISOString().split('T')[0];
    }, []);

    const defaultDateStr = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return d.toISOString().split('T')[0];
    }, []);

    const [date, setDate] = useState(defaultDateStr);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (!isOpen) return;
        const originalStyle = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [isOpen]);

    const activeEventObj = EVENT_TYPES.find(e => e.id === eventType) || EVENT_TYPES[0];
    const activeServiceObj = SERVICE_OPTIONS.find(s => s.id === servicePref) || SERVICE_OPTIONS[0];

    // Dynamic mailto link fallback
    const mailtoUrl = useMemo(() => {
        const subject = encodeURIComponent(`Catering Inquiry — ${activeEventObj.name} (${guests} Guests)`);
        const bodyLines = [
            `Name: ${name || '[Your Name]'}`,
            `Email: ${email || '[Your Email]'}`,
            `Phone: ${phone || '[Your Phone]'}`,
            `Event Type: ${activeEventObj.name}`,
            `Estimated Guests: ${guests}`,
            `Requested Date: ${date || 'Flexible'}`,
            `Service Option: ${activeServiceObj.title}`,
            `Notes / Special Requests: ${notes || 'None'}`,
        ];
        return `mailto:catering@hofherrmeatco.com?subject=${subject}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    }, [name, email, phone, activeEventObj, guests, date, activeServiceObj, notes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        if (!name.trim() || !email.trim()) {
            setErrorMsg('Please enter your name and email address.');
            return;
        }

        setIsSubmitting(true);
        try {
            const combinedNotes = [
                `Service Option: ${activeServiceObj.title}`,
                notes ? `Notes: ${notes}` : null,
            ].filter(Boolean).join('\n');

            const res = await fetch('/api/catering-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    eventDate: date,
                    eventType: activeEventObj.name,
                    guestCount: guests,
                    notes: combinedNotes,
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                setErrorMsg(data.error || 'Unable to submit inquiry. Please use the mail link below.');
            } else {
                setIsSuccess(true);
            }
        } catch {
            setErrorMsg('Network error. Please try again or use the email link below.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setIsSuccess(false);
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            {/* Drawer */}
            <aside
                className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="catering-drawer-title"
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h2 id="catering-drawer-title" className={styles.title}>
                            Catering Quick Quote
                        </h2>
                        <p className={styles.subtitle}>
                            Backyard pig roasts, BBQ feasts &amp; custom private events
                        </p>
                    </div>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Close inquiry drawer"
                    >
                        ✕
                    </button>
                </div>

                {isSuccess ? (
                    <div className={styles.successWrap}>
                        <div className={styles.successIcon}>✓</div>
                        <h3 className={styles.successTitle}>Inquiry Received!</h3>
                        <p className={styles.successText}>
                            Thanks, <strong>{name.split(' ')[0]}</strong>! Sean and our catering team review every inquiry personally. You will hear back with exact menu recommendations and a formal quote within 24 hours.
                        </p>
                        <button type="button" className={`btn btn-primary ${styles.submitBtn}`} onClick={handleReset}>
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.body}>
                        {/* Guest Count */}
                        <div className={styles.section}>
                            <label className={styles.sectionLabel}>Estimated Guest Count</label>
                            <div className={styles.guestGrid}>
                                {GUEST_PRESETS.map(count => (
                                    <button
                                        key={count}
                                        type="button"
                                        className={`${styles.guestBtn} ${guests === count ? styles.guestBtnActive : ''}`}
                                        onClick={() => setGuests(count)}
                                    >
                                        {count} guests
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Event Type */}
                        <div className={styles.section}>
                            <label className={styles.sectionLabel}>Event Style</label>
                            <div className={styles.eventTypeGrid}>
                                {EVENT_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        className={`${styles.eventTypeCard} ${eventType === type.id ? styles.eventTypeCardActive : ''}`}
                                        onClick={() => setEventType(type.id)}
                                    >
                                        <span className={styles.eventTypeName}>{type.name}</span>
                                        <span className={styles.eventTypeDesc}>{type.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Service / Pickup vs Onsite */}
                        <div className={styles.section}>
                            <label className={styles.sectionLabel}>Service Preference</label>
                            <div className={styles.serviceGrid}>
                                {SERVICE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        className={`${styles.serviceOption} ${servicePref === opt.id ? styles.serviceOptionActive : ''}`}
                                        onClick={() => setServicePref(opt.id)}
                                    >
                                        <div className={styles.serviceInfo}>
                                            <span className={styles.serviceTitle}>{opt.title}</span>
                                            <span className={styles.serviceSub}>{opt.sub}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date */}
                        <div className={styles.section}>
                            <label htmlFor="catering-date" className={styles.sectionLabel}>Target Event Date</label>
                            <input
                                id="catering-date"
                                type="date"
                                min={minDateStr}
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <p className={styles.dateNotice}>⚡ Catering bookings require at least 4 days notice.</p>
                        </div>

                        {/* Contact Fields */}
                        <div className={styles.section}>
                            <label className={styles.sectionLabel}>Your Details</label>
                            <div className={styles.inputGroup}>
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Name *"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={styles.input}
                                    autoComplete="name"
                                />
                            </div>
                            <div className={styles.inputGrid}>
                                <input
                                    required
                                    type="email"
                                    placeholder="Email Address *"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={styles.input}
                                    autoComplete="email"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone (Optional)"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className={styles.input}
                                    autoComplete="tel"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <textarea
                                    placeholder="Dietary requests, venue location, or specific questions…"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className={styles.textarea}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

                        {/* Actions */}
                        <div className={styles.footer}>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending Inquiry…' : 'Submit Catering Inquiry'}
                            </button>
                            <a
                                href={mailtoUrl}
                                className={styles.fallbackLink}
                            >
                                ✉️ Or open draft in Mail App
                            </a>
                        </div>
                    </form>
                )}
            </aside>
        </>
    );
}

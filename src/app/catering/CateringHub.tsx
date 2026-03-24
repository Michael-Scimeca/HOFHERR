'use client';

import { useState } from 'react';
import CateringCalendar from '@/components/CateringCalendar';
import styles from '../specials/CateringHub.module.css';

const PIG_PACKAGES = [
    { id: 'pig_0', label: 'Just the Pig', price: 30 },
    { id: 'pig_1s', label: 'Pig + 1 Side', price: 32 },
    { id: 'pig_2s', label: 'Pig + 2 Sides', price: 34 },
    { id: 'pig_3s', label: 'Pig + 3 Sides', price: 36 },
    { id: 'pig_1m_1s', label: "1 Add'l Meat + 1 Side", price: 36 },
    { id: 'pig_1m_2s', label: "1 Add'l Meat + 2 Sides", price: 38 },
    { id: 'pig_1m_3s', label: "1 Add'l Meat + 3 Sides", price: 40 },
];

type EventType = 'bbq' | 'pig';

interface Props {
    events: any[];
    calendarPricing: any[];
}

export default function CateringHub({ events, calendarPricing }: Props) {
    // Type Selection
    const [eventType, setEventType] = useState<EventType>('bbq');

    // Shared State
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [guests, setGuests] = useState(25);
    const [charcuterie, setCharcuterie] = useState(false);
    const [pimento, setPimento] = useState(0);
    const [delivery, setDelivery] = useState(false);
    const [notes, setNotes] = useState('');

    // BBQ State
    const [meats, setMeats] = useState(2);
    const [sides, setSides] = useState(2);

    // Pig Roast State
    const [pkgId, setPkgId] = useState('pig_0');

    // Inquiry Form
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Pricing Constants
    const BBQ_BASE_PP = 16;
    const ADD_MEAT_PP = 4;
    const ADD_SIDE_PP = 2;
    const ADD_CHARC_PP = 4;
    const PIMENTO_TRAY = 20;
    const DELIVERY_FEE = 50;

    const MIN_GUESTS = eventType === 'bbq' ? 20 : 50;
    const safeGuests = Math.max(MIN_GUESTS, guests);

    // Calculate total
    let costPerPerson: number;
    let packageName: string;

    if (eventType === 'bbq') {
        const additionalMeats = Math.max(0, meats - 1);
        const additionalSides = Math.max(0, sides - 1);
        costPerPerson = BBQ_BASE_PP + (additionalMeats * ADD_MEAT_PP) + (additionalSides * ADD_SIDE_PP) + (charcuterie ? ADD_CHARC_PP : 0);
        packageName = `BBQ Catering (${meats} Meats, ${sides} Sides)`;
    } else {
        const pkg = PIG_PACKAGES.find(p => p.id === pkgId) || PIG_PACKAGES[0];
        costPerPerson = pkg.price + (charcuterie ? ADD_CHARC_PP : 0);
        packageName = `Pig Roast — ${pkg.label}`;
    }

    const totalGuestsCost = safeGuests * costPerPerson;
    const totalPimento = pimento * PIMENTO_TRAY;
    const totalDelivery = delivery ? DELIVERY_FEE : 0;
    const finalEstimate = totalGuestsCost + totalPimento + totalDelivery;

    const dateLabel = selectedDate
        ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        : 'Select on calendar';

    const handleDateSelect = (date: string | null) => {
        setSelectedDate(date);
        if (date && typeof window !== 'undefined' && window.innerWidth < 1200) {
            const el = document.getElementById('catering-receipt');
            if (el) (window as any).lenis?.scrollTo(el, { offset: -100 });
        }
    };

    const handleTypeChange = (type: EventType) => {
        setEventType(type);
        if (type === 'pig' && guests < 50) setGuests(50);
        if (type === 'bbq' && guests < 20) setGuests(20);
    };

    const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuests(parseInt(e.target.value) || 0);
    };

    const handleGuestBlur = () => {
        if (guests < MIN_GUESTS) setGuests(MIN_GUESTS);
        if (guests > 500) setGuests(500);
    };

    const handleInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const cateringData = {
            date: dateLabel,
            guests: safeGuests,
            packageName,
            total: finalEstimate,
            type: eventType,
        };

        try {
            const res = await fetch('/api/catering', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, cateringData }),
            });

            if (res.ok) {
                setIsSuccess(true);
                setShowForm(false);
            } else {
                alert("Something went wrong. Please try again or call us!");
            }
        } catch (err) {
            console.error(err);
            alert("Connection error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const calcStyles = require('../bbq/CateringCalculator.module.css');

    return (
        <section className={styles.hubWrap}>
            <div className={styles.hubGrid}>

                {/* Column 1: Config */}
                <div className={styles.column}>
                    <div className={styles.colTitle}>
                        <span className={styles.activeStep}>1</span>
                        Choose Your Event
                    </div>
                    <div className={calcStyles.controls}>
                        <div className={calcStyles.header}>
                            <h3 className={calcStyles.title}>Build Your Catering Package</h3>
                            <p className={calcStyles.subtitle}>Select your event type and customize options below.</p>
                        </div>

                        {/* Event Type Toggle */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <button
                                onClick={() => handleTypeChange('bbq')}
                                style={{
                                    flex: 1,
                                    padding: '14px 16px',
                                    borderRadius: '10px',
                                    border: eventType === 'bbq' ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.12)',
                                    background: eventType === 'bbq' ? 'rgba(204, 13, 29, 0.1)' : 'rgba(255,255,255,0.04)',
                                    color: eventType === 'bbq' ? '#fff' : 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔥</div>
                                <div style={{ fontWeight: 700, fontSize: '14px' }}>BBQ Catering</div>
                                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>20+ guests · from $16/pp</div>
                            </button>
                            <button
                                onClick={() => handleTypeChange('pig')}
                                style={{
                                    flex: 1,
                                    padding: '14px 16px',
                                    borderRadius: '10px',
                                    border: eventType === 'pig' ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.12)',
                                    background: eventType === 'pig' ? 'rgba(204, 13, 29, 0.1)' : 'rgba(255,255,255,0.04)',
                                    color: eventType === 'pig' ? '#fff' : 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ fontSize: '20px', marginBottom: '4px' }}>🐷</div>
                                <div style={{ fontWeight: 700, fontSize: '14px' }}>Pig Roast</div>
                                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>50+ guests · from $30/pp</div>
                            </button>
                        </div>

                        {/* Guest Count */}
                        <div className={calcStyles.inputGroup}>
                            <label className={calcStyles.label}>Number of Guests <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 400 }}>({MIN_GUESTS} minimum)</span></label>
                            <div className={calcStyles.numberInputWrap}>
                                <button className={calcStyles.stepperBtn} onClick={() => setGuests(Math.max(MIN_GUESTS, guests - 5))} aria-label="Decrease guests">−</button>
                                <input type="number" className={calcStyles.numberInput} value={guests} onChange={handleGuestChange} onBlur={handleGuestBlur} />
                                <button className={calcStyles.stepperBtn} onClick={() => setGuests(Math.min(500, guests + 5))} aria-label="Increase guests">+</button>
                            </div>
                        </div>

                        {/* BBQ-specific: Meats & Sides */}
                        {eventType === 'bbq' && (
                            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                                <div className={calcStyles.inputGroup} style={{ flex: 1 }}>
                                    <label className={calcStyles.label}>Meats Selected</label>
                                    <div className={calcStyles.stepperWrap}>
                                        <button className={calcStyles.stepperBtnSm} onClick={() => setMeats(Math.max(1, meats - 1))}>−</button>
                                        <span className={calcStyles.stepperValue}>{meats}</span>
                                        <button className={calcStyles.stepperBtnSm} onClick={() => setMeats(Math.min(5, meats + 1))}>+</button>
                                    </div>
                                </div>
                                <div className={calcStyles.inputGroup} style={{ flex: 1 }}>
                                    <label className={calcStyles.label}>Sides Selected</label>
                                    <div className={calcStyles.stepperWrap}>
                                        <button className={calcStyles.stepperBtnSm} onClick={() => setSides(Math.max(1, sides - 1))}>−</button>
                                        <span className={calcStyles.stepperValue}>{sides}</span>
                                        <button className={calcStyles.stepperBtnSm} onClick={() => setSides(Math.min(6, sides + 1))}>+</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pig Roast-specific: Package Selection */}
                        {eventType === 'pig' && (
                            <div className={calcStyles.inputGroup} style={{ marginTop: '20px' }}>
                                <label className={calcStyles.label}>Catering Package</label>
                                <div className={calcStyles.packageList}>
                                    {PIG_PACKAGES.map(p => (
                                        <label key={p.id} className={`${calcStyles.packageOption} ${pkgId === p.id ? calcStyles.packageOptionActive : ''}`}>
                                            <input type="radio" value={p.id} checked={pkgId === p.id} onChange={() => setPkgId(p.id)} style={{ display: 'none' }} />
                                            <span>{p.label}</span>
                                            <span style={{ color: pkgId === p.id ? 'var(--red)' : '#fff', fontWeight: 600 }}>${p.price}/pp</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={calcStyles.divider}></div>

                        {/* Add-ons */}
                        <div className={calcStyles.toggleGroup}>
                            <label className={calcStyles.toggleLabel}>
                                <div>
                                    <span className={calcStyles.toggleTitle}>Add Charcuterie Platter</span>
                                    <span className={calcStyles.toggleSub}>+$4 per person</span>
                                </div>
                                <input type="checkbox" checked={charcuterie} onChange={e => setCharcuterie(e.target.checked)} className={calcStyles.checkbox} />
                                <span className={calcStyles.switch}></span>
                            </label>
                        </div>

                        <div className={calcStyles.inputGroup} style={{ marginTop: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className={calcStyles.label} style={{ marginBottom: 0 }}>Pimento Cheese Trays <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 400, marginLeft: 6 }}>$20/tray</span></label>
                                <div className={calcStyles.stepperWrap}>
                                    <button className={calcStyles.stepperBtnSm} onClick={() => setPimento(Math.max(0, pimento - 1))}>−</button>
                                    <span className={calcStyles.stepperValue}>{pimento}</span>
                                    <button className={calcStyles.stepperBtnSm} onClick={() => setPimento(pimento + 1)}>+</button>
                                </div>
                            </div>
                        </div>

                        <div className={calcStyles.divider}></div>

                        <div className={calcStyles.toggleGroup}>
                            <label className={calcStyles.toggleLabel}>
                                <div>
                                    <span className={calcStyles.toggleTitle}>Drop-Off Delivery</span>
                                    <span className={calcStyles.toggleSub}>+$50 flat rate (within 5 miles)</span>
                                </div>
                                <input type="checkbox" checked={delivery} onChange={e => setDelivery(e.target.checked)} className={calcStyles.checkbox} />
                                <span className={calcStyles.switch}></span>
                            </label>
                        </div>

                        <div className={calcStyles.inputGroup} style={{ marginTop: 24, marginBottom: 0 }}>
                            <label className={calcStyles.label}>Event Notes <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 400, marginLeft: 6 }}>(Optional)</span></label>
                            <textarea className={calcStyles.textarea} placeholder="Tell us about your event — dietary needs, venue info, timing..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Column 2: Date */}
                <div className={styles.column}>
                    <div className={styles.colTitle}>
                        <span className={selectedDate ? styles.activeStep : ''}>2</span>
                        Pick a Date
                    </div>
                    <CateringCalendar
                        className={styles.calendarEmbed}
                        events={events}
                        defaultPricing={calendarPricing}
                        externalSelectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        hideDetailCTA={true}
                    />
                </div>

                {/* Column 3: Receipt */}
                <div id="catering-receipt" className={styles.receiptCol}>
                    <div className={styles.colTitle} style={{ marginBottom: '16px' }}>
                        <span className={styles.activeStep}>3</span>
                        Your Estimate
                    </div>
                    <div className={styles.receiptInner}>
                        <h4 className={styles.receiptTitle}>Estimate Summary</h4>

                        {!isSuccess ? (
                            <>
                                <div className={styles.receiptItems}>
                                    <div className={styles.rItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Event Date</span>
                                            {selectedDate && (
                                                <span style={{ fontSize: '10px', color: '#16a34a', background: 'rgba(22, 163, 74, 0.1)', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, textTransform: 'uppercase' }}>
                                                    ✓ Available
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ color: selectedDate ? 'var(--red)' : 'var(--fg-muted)', fontSize: '15px', fontWeight: 600 }}>
                                            {dateLabel}
                                        </span>
                                    </div>

                                    <div style={{ margin: '12px 0', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                                    <div className={styles.rItem} style={{ marginBottom: '4px' }}>
                                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Event Type</span>
                                        <span style={{ fontSize: '12px', background: 'rgba(204,13,29,0.15)', color: 'var(--red)', padding: '2px 10px', borderRadius: '100px', fontWeight: 700 }}>
                                            {eventType === 'bbq' ? '🔥 BBQ' : '🐷 Pig Roast'}
                                        </span>
                                    </div>

                                    <div className={styles.rItem}>
                                        <span>{packageName} <small>× {safeGuests} guests</small></span>
                                        <span>${totalGuestsCost.toLocaleString()}</span>
                                    </div>

                                    {charcuterie && (
                                        <div className={styles.rItem}>
                                            <span>Charcuterie Platter</span>
                                            <span>${safeGuests * ADD_CHARC_PP}</span>
                                        </div>
                                    )}

                                    {pimento > 0 && (
                                        <div className={styles.rItem}>
                                            <span>{pimento}x Pimento Cheese Tray</span>
                                            <span>${totalPimento}</span>
                                        </div>
                                    )}

                                    {delivery && (
                                        <div className={styles.rItem}>
                                            <span>Local Delivery</span>
                                            <span>${DELIVERY_FEE}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', fontWeight: 800, color: '#fff', paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.2)', marginBottom: '16px' }}>
                                    <span>Estimated Total</span>
                                    <span style={{ fontSize: '24px', color: '#2ecc71' }}>${finalEstimate.toLocaleString()}</span>
                                </div>

                                {showForm ? (
                                    <form onSubmit={handleInquiry} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }}>
                                        <div style={{ marginBottom: '12px' }}>
                                            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Name</label>
                                            <input required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
                                        </div>
                                        <div style={{ marginBottom: '12px' }}>
                                            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Email</label>
                                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Phone</label>
                                            <input value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
                                        </div>
                                        <button className="btn btn-primary" type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
                                            {isSubmitting ? 'Sending...' : 'Confirm Inquiry'}
                                        </button>
                                        <button type="button" onClick={() => setShowForm(false)} style={{ width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '10px', cursor: 'pointer' }}>Cancel</button>
                                    </form>
                                ) : (
                                    <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ width: '100%' }}>
                                        Request This Quote
                                    </button>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <div style={{ width: '64px', height: '64px', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>✓</div>
                                <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>Thanks, {name.split(' ')[0]}!</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                                    Your {eventType === 'bbq' ? 'BBQ Catering' : 'Pig Roast'} inquiry for <strong>{dateLabel}</strong> has been sent to Sean and the team.
                                </p>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '20px' }}>
                                    We&apos;ve also sent a receipt to your email.
                                </p>
                                <button onClick={() => setIsSuccess(false)} style={{ marginTop: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontSize: '13px' }}>Start New Inquiry</button>
                            </div>
                        )}

                        {!isSuccess && (
                            <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', lineHeight: '1.5', margin: '24px 0 0', fontStyle: 'italic' }}>
                                * Pricing does not include sales tax. Submitting this form does not reserve your date until confirmed by Sean.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

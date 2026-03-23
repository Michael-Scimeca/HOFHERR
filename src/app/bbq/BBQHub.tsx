'use client';

import { useState } from 'react';
import CateringCalendar from '@/components/CateringCalendar';
import CateringCalculator from './CateringCalculator';
import styles from '../specials/CateringHub.module.css';

interface Props {
    events: any[];
    calendarPricing: any[];
}

export default function BBQHub({ events, calendarPricing }: Props) {
    // Shared State
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [guests, setGuests] = useState(25);
    const [meats, setMeats] = useState(2);
    const [sides, setSides] = useState(2);
    const [charcuterie, setCharcuterie] = useState(false);
    const [pimento, setPimento] = useState(0);
    const [delivery, setDelivery] = useState(false);
    const [notes, setNotes] = useState('');

    // Inquiry Form State
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Business Logic
    const MIN_GUESTS = 20;
    const BASE_PP = 16; 
    const ADD_MEAT_PP = 4;
    const ADD_SIDE_PP = 2;
    const ADD_CHARC_PP = 4;
    const PIMENTO_TRAY = 20;
    const DELIVERY_FEE = 50;

    const safeGuests = Math.max(MIN_GUESTS, guests);
    const additionalMeats = Math.max(0, meats - 1);
    const additionalSides = Math.max(0, sides - 1);

    const costPerPerson = BASE_PP + (additionalMeats * ADD_MEAT_PP) + (additionalSides * ADD_SIDE_PP) + (charcuterie ? ADD_CHARC_PP : 0);
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
            const el = document.getElementById('bbq-receipt');
            if (el) (window as any).lenis?.scrollTo(el, { offset: -100 });
        }
    };

    const handleInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const cateringData = {
            date: dateLabel,
            guests: safeGuests,
            packageName: `BBQ Catering (${meats} Meats, ${sides} Sides)`,
            total: finalEstimate,
            meats: [`${meats} Meats Selection`],
            sides: [`${sides} Sides Selection`],
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

    return (
        <section className={styles.hubWrap}>
            <div className={styles.hubGrid}>
                
                {/* Column 1: Config */}
                <div className={styles.column}>
                    <div className={styles.colTitle}>
                        <span className={styles.activeStep}>1</span>
                        Build Your Menu
                    </div>
                    <CateringCalculator 
                        showReceipt={false}
                        state={{ guests, meats, sides, charcuterie, pimento, delivery, notes }}
                        setState={{ setGuests, setMeats, setSides, setCharcuterie, setPimento, setDelivery, setNotes }}
                    />
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
                <div id="bbq-receipt" className={styles.receiptCol}>
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
                                    <div className={styles.divider} style={{ margin: '12px 0', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                    
                                    <div className={styles.rItem}>
                                        <span>Base Package <small>({meats} Meats, {sides} Sides)</small></span>
                                        <span>${totalGuestsCost}</span>
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
                                
                                <div className={styles.receiptTotal} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', fontWeight: 800, color: '#fff', paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.2)', marginBottom: '16px' }}>
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
                                        <button className={`btn btn-primary`} type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
                                            {isSubmitting ? 'Sending...' : 'Confirm Inquiry'}
                                        </button>
                                        <button type="button" onClick={() => setShowForm(false)} style={{ width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '10px', cursor: 'pointer' }}>Cancel</button>
                                    </form>
                                ) : (
                                    <button onClick={() => setShowForm(true)} className={`btn btn-primary`} style={{ width: '100%' }}>
                                        Request This Quote
                                    </button>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <div style={{ width: '64px', height: '64px', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>✓</div>
                                <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>Thanks, {name.split(' ')[0]}!</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                                    Your inquiry for BBQ Catering on <strong>{dateLabel}</strong> has been sent to Sean and the team.
                                </p>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '20px' }}>
                                    We&apos;ve also sent a receipt to your email address.
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

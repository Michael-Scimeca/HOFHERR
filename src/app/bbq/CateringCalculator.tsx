'use client';

import styles from './CateringCalculator.module.css';

interface Props {
    className?: string;
    showReceipt?: boolean;
    state?: {
        guests: number;
        meats: number;
        sides: number;
        charcuterie: boolean;
        pimento: number;
        delivery: boolean;
        notes: string;
    };
    setState?: {
        setGuests: (v: number) => void;
        setMeats: (v: number) => void;
        setSides: (v: number) => void;
        setCharcuterie: (v: boolean) => void;
        setPimento: (v: ((prev: number) => number) | number) => void;
        setDelivery: (v: boolean) => void;
        setNotes: (v: string) => void;
    };
}

export default function CateringCalculator({ 
    className, 
    showReceipt = true, 
    state, 
    setState 
}: Props) {
    // State (either from props or local if needed)
    const { guests, meats, sides, charcuterie, pimento, delivery, notes } = state || {
        guests: 25, meats: 2, sides: 2, charcuterie: false, pimento: 0, delivery: false, notes: ''
    };

    const MIN_GUESTS = 20;

    // Handlers
    const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState?.setGuests(parseInt(e.target.value) || 0);
    };
    const handleGuestBlur = () => {
        if (guests < MIN_GUESTS) setState?.setGuests(MIN_GUESTS);
        if (guests > 500) setState?.setGuests(500);
    };

    const controls = (
        <div className={styles.controls}>
            <div className={styles.header}>
                <h3 className={styles.title}>Estimate Your Catering</h3>
                <p className={styles.subtitle}>Instantly calculate the cost for your upcoming event. Minimum 20 guests.</p>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Number of Guests</label>
                <div className={styles.numberInputWrap}>
                    <button 
                        className={styles.stepperBtn} 
                        onClick={() => setState?.setGuests(Math.max(MIN_GUESTS, guests - 5))}
                        aria-label="Decrease guests"
                    >−</button>
                    <input 
                        type="number" 
                        className={styles.numberInput} 
                        value={guests} 
                        onChange={handleGuestChange}
                        onBlur={handleGuestBlur}
                    />
                    <button 
                        className={styles.stepperBtn} 
                        onClick={() => setState?.setGuests(Math.min(500, guests + 5))}
                        aria-label="Increase guests"
                    >+</button>
                </div>
            </div>

            <div className={styles.rowTwo} style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Meats Selected</label>
                    <div className={styles.stepperWrap}>
                        <button className={styles.stepperBtnSm} onClick={() => setState?.setMeats(Math.max(1, meats - 1))}>−</button>
                        <span className={styles.stepperValue}>{meats}</span>
                        <button className={styles.stepperBtnSm} onClick={() => setState?.setMeats(Math.min(5, meats + 1))}>+</button>
                    </div>
                </div>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Sides Selected</label>
                    <div className={styles.stepperWrap}>
                        <button className={styles.stepperBtnSm} onClick={() => setState?.setSides(Math.max(1, sides - 1))}>−</button>
                        <span className={styles.stepperValue}>{sides}</span>
                        <button className={styles.stepperBtnSm} onClick={() => setState?.setSides(Math.min(6, sides + 1))}>+</button>
                    </div>
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>
                    <div>
                        <span className={styles.toggleTitle}>Add Charcuterie Platter</span>
                        <span className={styles.toggleSub}>+$4 per person</span>
                    </div>
                    <input type="checkbox" checked={charcuterie} onChange={e => setState?.setCharcuterie(e.target.checked)} className={styles.checkbox} />
                    <span className={styles.switch}></span>
                </label>
            </div>

            <div className={styles.inputGroup} style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className={styles.label} style={{ marginBottom: 0 }}>Pimento Cheese Trays <span style={{fontSize: 12, color: 'var(--fg-muted)', fontWeight: 400, marginLeft: 6}}>$20/tray</span></label>
                    <div className={styles.stepperWrap}>
                        <button className={styles.stepperBtnSm} onClick={() => setState?.setPimento(Math.max(0, pimento - 1))}>−</button>
                        <span className={styles.stepperValue}>{pimento}</span>
                        <button className={styles.stepperBtnSm} onClick={() => setState?.setPimento(pimento + 1)}>+</button>
                    </div>
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>
                    <div>
                        <span className={styles.toggleTitle}>Drop-Off Delivery</span>
                        <span className={styles.toggleSub}>+$50 flat rate (within 5 miles)</span>
                    </div>
                    <input type="checkbox" checked={delivery} onChange={e => setState?.setDelivery(e.target.checked)} className={styles.checkbox} />
                    <span className={styles.switch}></span>
                </label>
            </div>

            <div className={styles.inputGroup} style={{ marginTop: 24, marginBottom: 0 }}>
                <label className={styles.label}>Event Notes <span style={{fontSize: 12, color: 'var(--fg-muted)', fontWeight: 400, marginLeft: 6}}>(Optional)</span></label>
                <textarea 
                    className={styles.textarea} 
                    placeholder="Tell us about your event..."
                    value={notes}
                    onChange={(e) => setState?.setNotes(e.target.value)}
                />
            </div>
        </div>
    );

    if (!showReceipt) return <div className={className}>{controls}</div>;

    // Standard receipt mode fallback
    return (
        <div className={`${styles.calculatorWrap} ${className || ''}`}>
            <div className={styles.calculatorGrid}>
                {controls}
                <div className={styles.receiptPan}>Legacy Mode - Please use Hub</div>
            </div>
        </div>
    );
}

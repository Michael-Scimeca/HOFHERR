'use client';

import styles from '../bbq/CateringCalculator.module.css';

const PACKAGES = [
    { id: 'pig_0', label: 'Just the Pig', price: 30 },
    { id: 'pig_1s', label: 'Pig + 1 Side', price: 32 },
    { id: 'pig_2s', label: 'Pig + 2 Sides', price: 34 },
    { id: 'pig_3s', label: 'Pig + 3 Sides', price: 36 },
    { id: 'pig_1m_1s', label: "1 Add'l Meat + 1 Side", price: 36 },
    { id: 'pig_1m_2s', label: "1 Add'l Meat + 2 Sides", price: 38 },
    { id: 'pig_1m_3s', label: "1 Add'l Meat + 3 Sides", price: 40 }
];

interface Props {
    selectedDate?: string | null;
    onDateChange?: (date: string | null) => void;
    className?: string;
    showReceipt?: boolean;
    state?: {
        guests: number;
        pkgId: string;
        charcuterie: boolean;
        pimento: number;
        delivery: boolean;
        notes: string;
    };
    setState?: {
        setGuests: (v: number) => void;
        setPkgId: (v: string) => void;
        setCharcuterie: (v: boolean) => void;
        setPimento: (v: ((prev: number) => number) | number) => void; // Support updater
        setDelivery: (v: boolean) => void;
        setNotes: (v: string) => void;
    };
}

export default function PigRoastCalculator({ 
    className, 
    showReceipt = true, 
    state, 
    setState 
}: Props) {
    // Current state (either from props or local if needed)
    const { guests, pkgId, charcuterie, pimento, delivery, notes } = state || {
        guests: 50, pkgId: 'pig_0', charcuterie: false, pimento: 0, delivery: false, notes: ''
    };
    
    const MIN_GUESTS = 50;

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
                <h3 className={styles.title}>Estimate Your Pig Roast</h3>
                <p className={styles.subtitle}>Instantly calculate the cost for your upcoming event.</p>
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

            <div className={styles.inputGroup}>
                <label className={styles.label}>Catering Package</label>
                <div className={styles.packageList}>
                    {PACKAGES.map(p => (
                        <label key={p.id} className={`${styles.packageOption} ${pkgId === p.id ? styles.packageOptionActive : ''}`}>
                            <input 
                                type="radio" 
                                value={p.id} 
                                checked={pkgId === p.id} 
                                onChange={() => setState?.setPkgId(p.id)} 
                                style={{ display: 'none' }} 
                            />
                            <span>{p.label}</span>
                            <span style={{color: pkgId === p.id ? 'var(--red)' : '#fff', fontWeight: 600}}>
                                ${p.price}/pp
                            </span>
                        </label>
                    ))}
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
                    placeholder="Add specific meats, sides, dietary restrictions..."
                    value={notes}
                    onChange={(e) => setState?.setNotes(e.target.value)}
                />
            </div>
        </div>
    );

    if (!showReceipt) {
        return <div className={`${styles.calculatorEmbed} ${className || ''}`}>{controls}</div>;
    }

    // Legacy fallback for receipt (if ever used standalone)
    return (
        <div className={`${styles.calculatorWrap} ${className || ''}`}>
            <div className={styles.calculatorGrid}>
                {controls}
                {/* Receipt part removed from here for brevity or can be restored if needed */}
                <div className={styles.receiptPan}>
                    Legacy Receipt Mode - Not Implemented for Full Refactor
                </div>
            </div>
        </div>
    );
}

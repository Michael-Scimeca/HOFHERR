'use client';

import styles from './CateringCalculator.module.css';

const MEAT_OPTIONS = [
    'Smoked Brisket',
    'BBQ Pulled Pork',
    'BBQ Pulled Chicken',
    'Rib Tips & Hot Links',
    'Smoked Ribs',
    'HMC Sausages',
];

const SIDE_OPTIONS = [
    'Pimento Mac n Cheese',
    'HMCo.leSlaw',
    'Potato Salad',
    'Grilled Portobellos',
    'Corn',
    'Three Bean Salad',
    'House Pasta Salad',
    'Collard Greens',
    'North Shore Baked Beans',
];

interface Props {
    className?: string;
    showReceipt?: boolean;
    state?: {
        guests: number;
        meats: number;
        sides: number;
        selectedMeats: string[];
        selectedSides: string[];
        charcuterie: boolean;
        pimento: number;
        delivery: boolean;
        notes: string;
    };
    setState?: {
        setGuests: (v: number) => void;
        setMeats: (v: number) => void;
        setSides: (v: number) => void;
        setSelectedMeats: (v: string[] | ((prev: string[]) => string[])) => void;
        setSelectedSides: (v: string[] | ((prev: string[]) => string[])) => void;
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
    const { guests, selectedMeats = [], selectedSides = [], charcuterie, pimento, delivery, notes } = state || {
        guests: 25, selectedMeats: ['Smoked Brisket', 'BBQ Pulled Pork'], selectedSides: ['Pimento Mac n Cheese', 'North Shore Baked Beans'], charcuterie: false, pimento: 0, delivery: false, notes: ''
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

    const toggleMeat = (item: string) => {
        setState?.setSelectedMeats((prev: string[]) =>
            prev.includes(item)
                ? prev.filter((m: string) => m !== item)
                : prev.length < 5 ? [...prev, item] : prev
        );
    };

    const toggleSide = (item: string) => {
        setState?.setSelectedSides((prev: string[]) =>
            prev.includes(item)
                ? prev.filter((s: string) => s !== item)
                : prev.length < 6 ? [...prev, item] : prev
        );
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

            {/* Meat Picker */}
            <div className={styles.inputGroup} style={{ marginTop: '20px' }}>
                <label className={styles.label}>
                    Pick Your Meats
                    <span style={{ fontSize: 11, color: selectedMeats.length >= 1 ? '#2ecc71' : 'var(--fg-muted)', fontWeight: 600, marginLeft: 8, letterSpacing: 0 }}>
                        {selectedMeats.length} selected
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 400, marginLeft: 6, letterSpacing: 0, textTransform: 'none' }}>
                        (1 included · +$4/pp each extra)
                    </span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {MEAT_OPTIONS.map(item => {
                        const isSelected = selectedMeats.includes(item);
                        return (
                            <button
                                key={item}
                                onClick={() => toggleMeat(item)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: isSelected ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.12)',
                                    background: isSelected ? 'rgba(204, 13, 29, 0.15)' : 'rgba(255,255,255,0.04)',
                                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: isSelected ? 700 : 500,
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <span style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '4px',
                                    border: isSelected ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.25)',
                                    background: isSelected ? 'var(--red)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    flexShrink: 0,
                                    transition: 'all 0.2s',
                                }}>
                                    {isSelected && '✓'}
                                </span>
                                {item}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Side Picker */}
            <div className={styles.inputGroup} style={{ marginTop: '8px' }}>
                <label className={styles.label}>
                    Pick Your Sides
                    <span style={{ fontSize: 11, color: selectedSides.length >= 1 ? '#2ecc71' : 'var(--fg-muted)', fontWeight: 600, marginLeft: 8, letterSpacing: 0 }}>
                        {selectedSides.length} selected
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 400, marginLeft: 6, letterSpacing: 0, textTransform: 'none' }}>
                        (1 included · +$2/pp each extra)
                    </span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SIDE_OPTIONS.map(item => {
                        const isSelected = selectedSides.includes(item);
                        return (
                            <button
                                key={item}
                                onClick={() => toggleSide(item)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: isSelected ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.12)',
                                    background: isSelected ? 'rgba(204, 13, 29, 0.15)' : 'rgba(255,255,255,0.04)',
                                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: isSelected ? 700 : 500,
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <span style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '4px',
                                    border: isSelected ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.25)',
                                    background: isSelected ? 'var(--red)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    flexShrink: 0,
                                    transition: 'all 0.2s',
                                }}>
                                    {isSelected && '✓'}
                                </span>
                                {item}
                            </button>
                        );
                    })}
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

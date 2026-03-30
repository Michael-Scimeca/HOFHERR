'use client';

import styles from '../bbq/CateringCalculator.module.css';

const PACKAGES = [
    { id: 'pig_0', label: 'Just the Pig', price: 30, sides: 0, meats: 0 },
    { id: 'pig_1s', label: 'Pig + 1 Side', price: 32, sides: 1, meats: 0 },
    { id: 'pig_2s', label: 'Pig + 2 Sides', price: 34, sides: 2, meats: 0 },
    { id: 'pig_3s', label: 'Pig + 3 Sides', price: 36, sides: 3, meats: 0 },
    { id: 'pig_1m_1s', label: "1 Add'l Meat + 1 Side", price: 36, sides: 1, meats: 1 },
    { id: 'pig_1m_2s', label: "1 Add'l Meat + 2 Sides", price: 38, sides: 2, meats: 1 },
    { id: 'pig_1m_3s', label: "1 Add'l Meat + 3 Sides", price: 40, sides: 3, meats: 1 }
];

export { PACKAGES as PIG_PACKAGES };

const MEAT_OPTIONS = [
    'Burnt Ends Brisket',
    'BBQ Pulled Chicken',
    'Rib Tips + Hot Links Combo',
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
    selectedDate?: string | null;
    onDateChange?: (date: string | null) => void;
    className?: string;
    showReceipt?: boolean;
    state?: {
        guests: number;
        pkgId: string;
        selectedMeats: string[];
        selectedSides: string[];
        charcuterie: boolean;
        pimento: number;
        delivery: boolean;
        notes: string;
    };
    setState?: {
        setGuests: (v: number) => void;
        setPkgId: (v: string) => void;
        setSelectedMeats: (v: string[] | ((prev: string[]) => string[])) => void;
        setSelectedSides: (v: string[] | ((prev: string[]) => string[])) => void;
        setCharcuterie: (v: boolean) => void;
        setPimento: (v: ((prev: number) => number) | number) => void;
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
    const { guests, pkgId, selectedMeats = [], selectedSides = [], charcuterie, pimento, delivery, notes } = state || {
        guests: 50, pkgId: 'pig_0', selectedMeats: [], selectedSides: [], charcuterie: false, pimento: 0, delivery: false, notes: ''
    };
    
    const MIN_GUESTS = 50;
    const activePkg = PACKAGES.find(p => p.id === pkgId) || PACKAGES[0];
    const needsMeats = activePkg.meats > 0;
    const needsSides = activePkg.sides > 0;

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
                : prev.length < activePkg.meats ? [...prev, item] : prev
        );
    };

    const toggleSide = (item: string) => {
        setState?.setSelectedSides((prev: string[]) =>
            prev.includes(item)
                ? prev.filter((s: string) => s !== item)
                : prev.length < activePkg.sides ? [...prev, item] : prev
        );
    };

    // When package changes, reset selections if they exceed new limits
    const handlePkgChange = (newPkgId: string) => {
        setState?.setPkgId(newPkgId);
        const newPkg = PACKAGES.find(p => p.id === newPkgId) || PACKAGES[0];
        // Trim selections to new package limits
        if (selectedMeats.length > newPkg.meats) {
            setState?.setSelectedMeats(selectedMeats.slice(0, newPkg.meats));
        }
        if (selectedSides.length > newPkg.sides) {
            setState?.setSelectedSides(selectedSides.slice(0, newPkg.sides));
        }
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
                                onChange={() => handlePkgChange(p.id)} 
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

            {/* Meat Picker - only shows when package includes meat */}
            {needsMeats && (
                <div className={styles.inputGroup} style={{ marginTop: '20px' }}>
                    <label className={styles.label}>
                        Pick Your Add&apos;l Meat
                        <span style={{ fontSize: 11, color: selectedMeats.length >= activePkg.meats ? '#2ecc71' : 'var(--fg-muted)', fontWeight: 600, marginLeft: 8, letterSpacing: 0 }}>
                            {selectedMeats.length}/{activePkg.meats} selected
                        </span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {MEAT_OPTIONS.map(item => {
                            const isSelected = selectedMeats.includes(item);
                            const isDisabled = !isSelected && selectedMeats.length >= activePkg.meats;
                            return (
                                <button
                                    key={item}
                                    onClick={() => toggleMeat(item)}
                                    disabled={isDisabled}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: isSelected ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.12)',
                                        background: isSelected ? 'rgba(204, 13, 29, 0.15)' : 'rgba(255,255,255,0.04)',
                                        color: isSelected ? '#fff' : isDisabled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)',
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        fontSize: '13px',
                                        fontWeight: isSelected ? 700 : 500,
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        opacity: isDisabled ? 0.5 : 1,
                                    }}
                                >
                                    <span style={{
                                        width: '18px', height: '18px', borderRadius: '4px',
                                        border: isSelected ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.25)',
                                        background: isSelected ? 'var(--red)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '11px', flexShrink: 0, transition: 'all 0.2s',
                                    }}>
                                        {isSelected && '✓'}
                                    </span>
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Side Picker - only shows when package includes sides */}
            {needsSides && (
                <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                    <label className={styles.label}>
                        Pick Your Sides
                        <span style={{ fontSize: 11, color: selectedSides.length >= activePkg.sides ? '#2ecc71' : 'var(--fg-muted)', fontWeight: 600, marginLeft: 8, letterSpacing: 0 }}>
                            {selectedSides.length}/{activePkg.sides} selected
                        </span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {SIDE_OPTIONS.map(item => {
                            const isSelected = selectedSides.includes(item);
                            const isDisabled = !isSelected && selectedSides.length >= activePkg.sides;
                            return (
                                <button
                                    key={item}
                                    onClick={() => toggleSide(item)}
                                    disabled={isDisabled}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: isSelected ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.12)',
                                        background: isSelected ? 'rgba(204, 13, 29, 0.15)' : 'rgba(255,255,255,0.04)',
                                        color: isSelected ? '#fff' : isDisabled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)',
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        fontSize: '13px',
                                        fontWeight: isSelected ? 700 : 500,
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        opacity: isDisabled ? 0.5 : 1,
                                    }}
                                >
                                    <span style={{
                                        width: '18px', height: '18px', borderRadius: '4px',
                                        border: isSelected ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.25)',
                                        background: isSelected ? 'var(--red)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '11px', flexShrink: 0, transition: 'all 0.2s',
                                    }}>
                                        {isSelected && '✓'}
                                    </span>
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

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

    if (!showReceipt) {
        return <div className={`${styles.calculatorEmbed} ${className || ''}`}>{controls}</div>;
    }

    return (
        <div className={`${styles.calculatorWrap} ${className || ''}`}>
            <div className={styles.calculatorGrid}>
                {controls}
                <div className={styles.receiptPan}>Legacy Mode</div>
            </div>
        </div>
    );
}

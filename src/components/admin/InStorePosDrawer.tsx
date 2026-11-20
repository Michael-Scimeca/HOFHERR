'use client';

import { useEffect, useState } from 'react';
import { normalizePhone } from '@/lib/phone';
import styles from './InStorePosDrawer.module.css';

const QUICK_CUTS = [
    { name: 'Boneless Ribeye', price: '$40.99/lb' },
    { name: 'Bone-In Ribeye', price: '$38.99/lb' },
    { name: 'New York Strip', price: '$42.99/lb' },
    { name: 'Filet Mignon', price: '$46.99/lb' },
    { name: 'Marinated Skirt Steak', price: '$30.99/lb' },
    { name: 'Italian Beef (1 lb)', price: '$18.99' },
    { name: 'Rotisserie Chicken', price: '$14.99' },
    { name: 'House Bratwurst', price: '$8.99/lb' },
    { name: 'Berkshire Bone-In Pork Chop', price: '$12.99/lb' },
];

interface PosItem {
    name: string;
    price: string;
    qty: number;
}

interface MatchedCustomer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    orderCount: number;
}

export default function InStorePosDrawer() {
    const [open, setOpen] = useState(false);
    const [phone, setPhone] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [storeId, setStoreId] = useState<'butcher' | 'depot'>('butcher');
    const [tender, setTender] = useState<'card' | 'cash'>('card');
    const [items, setItems] = useState<PosItem[]>([]);
    const [customName, setCustomName] = useState('');
    const [customPrice, setCustomPrice] = useState('');
    const [matched, setMatched] = useState<MatchedCustomer | null>(null);
    const [lookedUp, setLookedUp] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const digits = normalizePhone(phone);

    useEffect(() => {
        if (digits.length < 10) {
            setMatched(null);
            setLookedUp(false);
            return;
        }
        const controller = new AbortController();
        fetch(`/api/admin/instore-order?phone=${digits}`, { signal: controller.signal })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (controller.signal.aborted) return;
                setMatched(data?.customer ?? null);
                setLookedUp(true);
            })
            .catch(() => {});
        return () => controller.abort();
    }, [digits]);

    const addCut = (name: string, price: string) => {
        setItems((prev) => {
            const idx = prev.findIndex((i) => i.name === name);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
                return next;
            }
            return [...prev, { name, price, qty: 1 }];
        });
    };

    const addCustomCut = () => {
        if (!customName.trim()) return;
        const formattedPrice = customPrice.trim().startsWith('$')
            ? customPrice.trim()
            : `$${customPrice.trim() || '0.00'}`;
        addCut(customName.trim(), formattedPrice);
        setCustomName('');
        setCustomPrice('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/instore-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    customerName,
                    storeId,
                    tender,
                    items,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Could not log in-store order.');
            } else {
                setSuccess(
                    `Logged ${data.orderNumber} (${data.totalFormatted}) for ${data.customerName} — ${
                        data.linkedToProfile
                            ? 'linked directly to their web profile!'
                            : 'saved by phone (will auto-attach when they sign up).'
                    }`
                );
                setItems([]);
                setPhone('');
                setCustomerName('');
                setMatched(null);
                setLookedUp(false);
            }
        } catch {
            setError('Network error — please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className={styles.wrap} aria-label="In-Store Counter POS Order Logger">
            <button
                type="button"
                className={styles.header}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
            >
                <div>
                    <span className={styles.headerTitle}>🧾 In-Store Counter POS (Phone-Linked)</span>
                    <span className={styles.headerSub}>
                        Log walk-in counter purchases directly to a customer&apos;s profile by phone — zero Toast fees
                    </span>
                </div>
                <span>{open ? '▲ Hide' : '▼ Open Counter POS'}</span>
            </button>

            {open && (
                <form onSubmit={handleSubmit} className={styles.body}>
                    <div className={styles.row}>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Customer 10-digit phone (e.g. 847-555-0142)"
                            aria-label="Customer phone number"
                            className={styles.input}
                            required
                        />
                        {!matched && (
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Customer name (optional)"
                                aria-label="Customer name"
                                className={styles.input}
                            />
                        )}
                        <button
                            type="button"
                            className={`${styles.quickBtn} ${storeId === 'butcher' ? styles.pillActive : ''}`}
                            onClick={() => setStoreId('butcher')}
                        >
                            🥩 Butcher Shop
                        </button>
                        <button
                            type="button"
                            className={`${styles.quickBtn} ${storeId === 'depot' ? styles.pillActive : ''}`}
                            onClick={() => setStoreId('depot')}
                        >
                            🏪 The Depot
                        </button>
                        <button
                            type="button"
                            className={`${styles.quickBtn} ${tender === 'card' ? styles.pillActive : ''}`}
                            onClick={() => setTender('card')}
                        >
                            💳 Card / Tap
                        </button>
                        <button
                            type="button"
                            className={`${styles.quickBtn} ${tender === 'cash' ? styles.pillActive : ''}`}
                            onClick={() => setTender('cash')}
                        >
                            💵 Cash
                        </button>
                    </div>

                    {matched && (
                        <div className={styles.matchBadge}>
                            ✓ Matched Profile: <strong>{matched.name}</strong> ({matched.email || matched.phone}) · {matched.orderCount} past orders — this purchase will sync to their dashboard &amp; Cut Collector.
                        </div>
                    )}
                    {!matched && lookedUp && digits.length === 10 && (
                        <div className={styles.guestBadge}>
                            New walk-in phone — order will be saved under {phone} and automatically attached when they create a Hofherr web account.
                        </div>
                    )}

                    <div className={styles.quickGrid}>
                        {QUICK_CUTS.map((cut) => (
                            <button
                                key={cut.name}
                                type="button"
                                className={styles.quickBtn}
                                onClick={() => addCut(cut.name, cut.price)}
                            >
                                + {cut.name} ({cut.price})
                            </button>
                        ))}
                    </div>

                    <div className={styles.row}>
                        <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Custom cut / weight (e.g. 2.4lb Prime Ribeye)"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            placeholder="$ Price (e.g. 98.40)"
                            className={styles.input}
                        />
                        <button type="button" className={styles.quickBtn} onClick={addCustomCut}>
                            + Add Custom
                        </button>
                    </div>

                    {items.length > 0 && (
                        <div className={styles.ticketList}>
                            {items.map((it) => (
                                <div key={it.name} className={styles.ticketItem}>
                                    <span>
                                        <strong>{it.qty}×</strong> {it.name} ({it.price})
                                    </span>
                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={() => setItems((prev) => prev.filter((x) => x.name !== it.name))}
                                        aria-label={`Remove ${it.name}`}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && <div className={styles.errorMsg} role="alert">⚠️ {error}</div>}
                    {success && <div className={styles.successMsg} role="status">✓ {success}</div>}

                    <div className={styles.row}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={submitting || digits.length < 10 || items.length === 0}
                        >
                            {submitting ? 'Logging Order…' : `Log Walk-In Order (${items.reduce((s, i) => s + i.qty, 0)} items)`}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}

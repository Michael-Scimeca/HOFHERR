'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';

/* ─────────────────────────────────────────────────────────────────────────
   Order tracker prototype.

   Four customer-facing stages, driven by the SAME status values the Sanity
   `order` document already uses (see src/sanity/schemaTypes/order.ts), so
   wiring this to a real order later only means passing in `order.status`.
   ───────────────────────────────────────────────────────────────────────── */

type OrderStatus =
    | 'pending'
    | 'paid'
    | 'processing'
    | 'ready_paid'
    | 'ready_pending'
    | 'completed'
    | 'cancelled';

type StoreId = 'butcher' | 'depot';

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'Pending (pay at pickup)' },
    { value: 'paid', label: 'Paid (preparing)' },
    { value: 'processing', label: 'Processing' },
    { value: 'ready_paid', label: 'Ready (paid)' },
    { value: 'ready_pending', label: 'Ready (pay on pickup)' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const STAGES = [
    { key: 'placed', short: 'Placed', title: 'Order Placed', statuses: ['pending', 'paid'], minutesLeft: 25 },
    { key: 'prep', short: 'Cutting', title: 'On the Block', statuses: ['processing'], minutesLeft: 12 },
    { key: 'ready', short: 'Ready', title: 'Ready for Pickup', statuses: ['ready_paid', 'ready_pending'], minutesLeft: 0 },
    { key: 'done', short: 'Picked Up', title: 'Picked Up', statuses: ['completed'], minutesLeft: 0 },
] as const;

/** Order the auto-play demo walks through. */
const DEMO_SEQUENCE: OrderStatus[] = ['paid', 'processing', 'ready_paid', 'completed'];

const STORES: Record<StoreId, { name: string; address: string; mapsUrl: string }> = {
    butcher: {
        name: 'The Butcher Shop',
        address: '300 Happ Rd, Northfield, IL 60093',
        mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093',
    },
    depot: {
        name: 'The Depot',
        address: '754 Elm St, Winnetka, IL 60093',
        mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=754+Elm+St,+Winnetka,+IL+60093',
    },
};

const SAMPLE_ITEMS = [
    { name: 'Bone-In Ribeye (16 oz)', qty: 2, note: 'Extra marbled please' },
    { name: 'Baby Back Ribs (Full Rack)', qty: 1 },
    { name: 'Fresh Italian Sausage (1 lb)', qty: 2 },
];

function stageIndexFor(status: OrderStatus): number {
    return STAGES.findIndex((s) => (s.statuses as readonly string[]).includes(status));
}

function formatTime(d: Date): string {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function stageMessage(status: OrderStatus, storeName: string): string {
    switch (status) {
        case 'pending':
            return 'We have your ticket. A butcher will start on it shortly — you’ll pay when you pick up.';
        case 'paid':
            return 'Payment received and your ticket is in. A butcher will start on it shortly.';
        case 'processing':
            return 'Your order is on the block — being cut, trimmed, and wrapped to order.';
        case 'ready_paid':
            return `Wrapped and waiting for you at ${storeName}. Just give your name at the counter.`;
        case 'ready_pending':
            return `Wrapped and waiting for you at ${storeName}. You’ll pay at the counter.`;
        case 'completed':
            return 'Picked up. Thanks for shopping with us — enjoy.';
        case 'cancelled':
            return 'This order was cancelled. Call the shop if that’s a surprise.';
    }
}

export default function OrderTrackerClient() {
    const [status, setStatus] = useState<OrderStatus>('paid');
    const [store, setStore] = useState<StoreId>('butcher');
    const [autoPlay, setAutoPlay] = useState(false);
    // Set after mount so server and client render the same markup.
    const [placedAt, setPlacedAt] = useState<Date | null>(null);

    useEffect(() => {
        setPlacedAt(new Date());
    }, []);

    useEffect(() => {
        if (status === 'completed') {
            setAutoPlay(false);
        }
    }, [status]);

    // Auto-play: step through the demo sequence, then stop at "Picked Up".
    useEffect(() => {
        if (!autoPlay) return;
        const id = window.setInterval(() => {
            setStatus((current) => {
                const i = DEMO_SEQUENCE.indexOf(current);
                const next = DEMO_SEQUENCE[i + 1];
                return next || current;
            });
        }, 3500);
        return () => window.clearInterval(id);
    }, [autoPlay]);

    const cancelled = status === 'cancelled';
    const activeIndex = stageIndexFor(status);
    const activeStage = activeIndex >= 0 ? STAGES[activeIndex] : null;
    const storeInfo = STORES[store];

    const readyTime = useMemo(() => {
        if (!placedAt || !activeStage) return null;
        // Prototype estimate: fixed minutes-left per stage. A real version would
        // use the pickup slot chosen at checkout plus the shop's current prep load.
        return new Date(placedAt.getTime() + STAGES[0].minutesLeft * 60_000);
    }, [placedAt, activeStage]);

    const startDemo = () => {
        setStatus(DEMO_SEQUENCE[0]);
        setAutoPlay(true);
    };

    let etaLabel = 'Estimated ready time';
    let etaValue = readyTime ? formatTime(readyTime) : '—';
    if (cancelled) {
        etaLabel = 'Status';
        etaValue = 'Cancelled';
    } else if (activeStage?.key === 'ready') {
        etaLabel = 'Status';
        etaValue = 'Ready now';
    } else if (activeStage?.key === 'done') {
        etaLabel = 'Status';
        etaValue = 'Complete';
    }

    return (
        <main className={styles.page}>
            <div className={`container ${styles.inner}`}>
                <header className={styles.header}>
                    <div className="section-label">Prototype · Test Page</div>
                    <h1 className={styles.title}>
                        Track Your <em>Order</em>
                    </h1>
                    <p className={styles.sub}>Order #A7F3BC21 · Pickup at {storeInfo.name}</p>
                </header>

                {/* ── Tracker card ── */}
                <section className={`${styles.card} ${cancelled ? styles.cardCancelled : ''}`} aria-labelledby="tracker-stage">
                    <div className={styles.cardTop}>
                        <div>
                            <div className={styles.kicker}>{cancelled ? 'Order update' : `Step ${activeIndex + 1} of ${STAGES.length}`}</div>
                            <h2 id="tracker-stage" className={styles.stageTitle}>
                                {cancelled ? 'Order Cancelled' : activeStage?.title}
                            </h2>
                        </div>
                        <div className={styles.eta}>
                            <div className={styles.kicker}>{etaLabel}</div>
                            <div className={styles.etaValue}>{etaValue}</div>
                        </div>
                    </div>

                    <ol className={styles.bar} aria-label="Order progress">
                        {STAGES.map((stage, i) => {
                            const finished = status === 'completed';
                            const done = !cancelled && (i < activeIndex || finished);
                            const active = !cancelled && !finished && i === activeIndex;
                            const state = finished
                                ? styles.segPickedUp
                                : done
                                  ? styles.segDone
                                  : active
                                    ? styles.segActive
                                    : styles.segTodo;
                            return (
                                <li key={stage.key} className={`${styles.seg} ${state}`} aria-current={active || (finished && i === activeIndex) ? 'step' : undefined}>
                                    <span className={styles.segFill} aria-hidden="true" />
                                    <span className={styles.segNum} aria-hidden="true">
                                        {done ? '✓' : i + 1}
                                    </span>
                                    <span className={styles.segLabel}>{stage.short}</span>
                                </li>
                            );
                        })}
                    </ol>

                    <p className={styles.message} aria-live="polite">
                        {stageMessage(status, storeInfo.name)}
                    </p>

                    <div className={styles.details}>
                        <div className={styles.detailBlock}>
                            <div className={styles.kicker}>Pickup location</div>
                            <div className={styles.detailMain}>{storeInfo.name}</div>
                            <a className={styles.detailLink} href={storeInfo.mapsUrl} target="_blank" rel="noopener noreferrer">
                                {storeInfo.address}
                            </a>
                        </div>
                        <div className={styles.detailBlock}>
                            <div className={styles.kicker}>Your order</div>
                            <ul className={styles.items}>
                                {SAMPLE_ITEMS.map((item) => (
                                    <li key={item.name}>
                                        <span className={styles.qty}>{item.qty}×</span> {item.name}
                                        {item.note && <span className={styles.note}> — {item.note}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── Test controls ── */}
                <section className={styles.controls} aria-labelledby="controls-heading">
                    <h2 id="controls-heading" className={styles.controlsTitle}>Test Controls</h2>
                    <p className={styles.controlsSub}>
                        These use the same status values the admin dashboard sets on a real order.
                    </p>
                    <div className={styles.controlRow}>
                        <label className={styles.field}>
                            <span>Order status</span>
                            <select
                                value={status}
                                onChange={(e) => {
                                    setAutoPlay(false);
                                    setStatus(e.target.value as OrderStatus);
                                }}
                            >
                                {STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className={styles.field}>
                            <span>Pickup location</span>
                            <select value={store} onChange={(e) => setStore(e.target.value as StoreId)}>
                                <option value="butcher">The Butcher Shop (Northfield)</option>
                                <option value="depot">The Depot (Winnetka)</option>
                            </select>
                        </label>
                        <button type="button" className="btn btn-primary" onClick={autoPlay ? () => setAutoPlay(false) : startDemo}>
                            {autoPlay ? 'Stop demo' : 'Play demo'}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

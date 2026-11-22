'use client';

import { useEffect, useState } from 'react';
import styles from './KitchenThrottleBar.module.css';

const SLOT_CAP_OPTIONS = [4, 6, 8, 12] as const;

export default function KitchenThrottleBar() {
    const [maxCap, setMaxCap] = useState<number>(8);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function fetchStatus() {
            try {
                const res = await fetch('/api/kitchen-status');
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled && typeof data.maxOrdersPerSlot === 'number') {
                    setMaxCap(data.maxOrdersPerSlot);
                }
            } catch {
                // non-fatal
            }
        }
        void fetchStatus();
        return () => {
            cancelled = true;
        };
    }, []);

    const updateCap = async (nextCap: number) => {
        setSaving(true);
        setMaxCap(nextCap);
        try {
            await fetch('/api/kitchen-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ maxOrdersPerSlot: nextCap }),
            });
        } catch {
            // non-fatal
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className={styles.bar} aria-label="Pickup Slot Capacity Controls">
            <div className={styles.group}>
                <span className={styles.label}>Max Pickups / 15-Min Slot:</span>
                <div className={styles.pills}>
                    {SLOT_CAP_OPTIONS.map((cap) => (
                        <button
                            key={cap}
                            type="button"
                            disabled={saving}
                            className={`${styles.btn} ${maxCap === cap ? styles.activeCap : ''}`}
                            onClick={() => void updateCap(cap)}
                        >
                            {cap}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

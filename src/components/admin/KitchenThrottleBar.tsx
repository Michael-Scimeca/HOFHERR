'use client';

import { useEffect, useState } from 'react';
import type { KitchenLoadMode } from '@/app/api/kitchen-status/route';
import styles from './KitchenThrottleBar.module.css';

const SLOT_CAP_OPTIONS = [4, 6, 8, 12] as const;

export default function KitchenThrottleBar() {
    const [load, setLoad] = useState<KitchenLoadMode>('normal');
    const [maxCap, setMaxCap] = useState<number>(8);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function fetchStatus() {
            try {
                const res = await fetch('/api/kitchen-status');
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled) {
                    if (data.kitchenLoad) setLoad(data.kitchenLoad);
                    if (typeof data.maxOrdersPerSlot === 'number') setMaxCap(data.maxOrdersPerSlot);
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

    const updateStatus = async (nextLoad: KitchenLoadMode, nextCap: number) => {
        setSaving(true);
        setLoad(nextLoad);
        setMaxCap(nextCap);
        try {
            await fetch('/api/kitchen-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kitchenLoad: nextLoad, maxOrdersPerSlot: nextCap }),
            });
        } catch {
            // non-fatal
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className={styles.bar} aria-label="Live Kitchen Load and Holiday Pickup Slot Controls">
            <div className={styles.group}>
                <span className={styles.label}>Kitchen Load:</span>
                <div className={styles.pills}>
                    <button
                        type="button"
                        disabled={saving}
                        className={`${styles.btn} ${load === 'normal' ? styles.activeNormal : ''}`}
                        onClick={() => void updateStatus('normal', maxCap)}
                    >
                        🟢 Normal (15m)
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        className={`${styles.btn} ${load === 'busy' ? styles.activeBusy : ''}`}
                        onClick={() => void updateStatus('busy', maxCap)}
                    >
                        🟡 Lunch Rush (30m)
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        className={`${styles.btn} ${load === 'paused' ? styles.activePaused : ''}`}
                        onClick={() => void updateStatus('paused', maxCap)}
                    >
                        🔴 Pause Hot Orders (20m)
                    </button>
                </div>
            </div>

            <div className={styles.group}>
                <span className={styles.label}>Max Pickups / 15-Min Slot:</span>
                <div className={styles.pills}>
                    {SLOT_CAP_OPTIONS.map((cap) => (
                        <button
                            key={cap}
                            type="button"
                            disabled={saving}
                            className={`${styles.btn} ${maxCap === cap ? styles.activeCap : ''}`}
                            onClick={() => void updateStatus(load, cap)}
                        >
                            {cap}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}


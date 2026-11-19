'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Toggle } from '@/components/Toggle';
import styles from '../parcel-sheet.module.css';

const BwPrintContext = createContext<{
    bwPrintMode: boolean;
    setBwPrintMode: (val: boolean) => void;
}>({
    bwPrintMode: true,
    setBwPrintMode: () => {},
});

export function SheetsInkModeShell({ children }: { children: ReactNode }) {
    const [bwPrintMode, setBwPrintMode] = useState(true);

    return (
        <BwPrintContext.Provider value={{ bwPrintMode, setBwPrintMode }}>
            <main className={styles.indexMain} data-bw-print={bwPrintMode ? 'true' : 'false'}>
                {children}
            </main>
        </BwPrintContext.Provider>
    );
}

export function SheetsInkModeToggleBar() {
    const { bwPrintMode, setBwPrintMode } = useContext(BwPrintContext);

    return (
        <div className={styles.inkToggleBar}>
            <Toggle
                checked={bwPrintMode}
                onChange={setBwPrintMode}
                label="Single-Ink Black & White Print Mode"
                size="md"
            />
            <span className={styles.inkToggleNote}>
                {bwPrintMode
                    ? 'Active: 100% Monochrome Single-Ink Black (#111111) on White Paper'
                    : 'Previewing: Color Reference Mode (Print output remains B&W)'}
            </span>
        </div>
    );
}

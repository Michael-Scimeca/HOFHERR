'use client';

import styles from '../../parcel-sheet.module.css';

export default function PrintSheetButton() {
    return (
        <button
            type="button"
            className={styles.printBtn}
            onClick={() => window.print()}
            data-testid="trigger-print-sheet"
        >
            Print 12×16&quot; Sheet
        </button>
    );
}


'use client';

import type { ReactNode } from 'react';
import styles from './FilterPills.module.css';

export interface FilterPillOption<T extends string = string> {
    value: T;
    label: ReactNode;
    count?: number;
}

interface FilterPillsProps<T extends string = string> {
    options: readonly FilterPillOption<T>[];
    value: T;
    onChange: (next: T) => void;
    ariaLabel: string;
    className?: string;
}

/**
 * Shared horizontal filter / category pill bar built on site design tokens.
 */
export default function FilterPills<T extends string = string>({
    options,
    value,
    onChange,
    ariaLabel,
    className,
}: FilterPillsProps<T>) {
    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={className ? `${styles.bar} ${className}` : styles.bar}
        >
            {options.map((opt) => {
                const isActive = opt.value === value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        aria-pressed={isActive}
                        className={isActive ? `${styles.pill} ${styles.pillActive}` : styles.pill}
                        onClick={() => onChange(opt.value)}
                    >
                        <span>{opt.label}</span>
                        {opt.count !== undefined && (
                            <span className={styles.count}>{opt.count}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

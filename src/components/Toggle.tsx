'use client';

import React from 'react';
import styles from './Toggle.module.css';

export interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    hideLabel?: boolean;
    'aria-labelledby'?: string;
    size?: 'sm' | 'md';
    variant?: 'red' | 'gold';
    disabled?: boolean;
    title?: string;
    infoSnippet?: string;
}

export function Toggle({
    checked,
    onChange,
    label,
    hideLabel = false,
    'aria-labelledby': ariaLabelledBy,
    size = 'md',
    variant = 'red',
    disabled = false,
    title,
    infoSnippet,
}: ToggleProps) {
    const sizeClass = size === 'sm' ? styles.switchSm : styles.switchMd;
    const checkedClass = checked
        ? variant === 'gold'
            ? styles.switchCheckedGold
            : styles.switchChecked
        : '';

    return (
        <span className={`${styles.wrapper} ${disabled ? styles.wrapperDisabled : ''}`} title={title}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={hideLabel && label ? label : undefined}
                aria-labelledby={ariaLabelledBy}
                disabled={disabled}
                className={`${styles.switch} ${sizeClass} ${checkedClass}`}
                onClick={() => {
                    if (!disabled) onChange(!checked);
                }}
            >
                <span className={styles.thumb} />
            </button>
            {label && (
                <span className={hideLabel ? styles.srOnly : styles.label}>
                    {label}
                </span>
            )}
            {infoSnippet && (
                <span
                    className={styles.infoBadge}
                    tabIndex={0}
                    role="note"
                    aria-label={`${label ? label + ': ' : ''}${infoSnippet}`}
                    onClick={e => e.stopPropagation()}
                >
                    <span className={styles.infoIcon} aria-hidden="true">i</span>
                    <span className={styles.infoTooltip} role="tooltip">
                        {label && <span className={styles.infoSnippetTitle}>{label}</span>}
                        <span className={styles.infoSnippetText}>{infoSnippet}</span>
                    </span>
                </span>
            )}
        </span>
    );
}

export default Toggle;


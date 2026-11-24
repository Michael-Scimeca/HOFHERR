import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
    id?: string;
    title: ReactNode;
    subtitle?: ReactNode;
    align?: 'center' | 'left';
    className?: string;
    children?: ReactNode;
}

/**
 * Shared section heading block (h2 + optional subtitle + optional action slot).
 * Keeps section typography, spacing, and alignment consistent across pages.
 */
export default function SectionHeader({
    id,
    title,
    subtitle,
    align = 'center',
    className,
    children,
}: SectionHeaderProps) {
    const classes = [
        styles.header,
        align === 'left' ? styles.left : styles.center,
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            <h2 id={id} className={styles.title}>
                {title}
            </h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {children && <div className={styles.actions}>{children}</div>}
        </div>
    );
}

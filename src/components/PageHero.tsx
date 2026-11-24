import type { ReactNode } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
    id?: string;
    headingId?: string;
    title: ReactNode;
    lead?: ReactNode;
    children?: ReactNode;
    className?: string;
    innerClassName?: string;
}

export default function PageHero({
    id,
    headingId,
    title,
    lead,
    children,
    className,
    innerClassName,
}: PageHeroProps) {
    return (
        <header id={id} className={className ? `${styles.hero} ${className}` : styles.hero}>
            <div className="container">
                <div className={innerClassName ? `${styles.inner} ${innerClassName}` : styles.inner}>
                    <h1 id={headingId} className={styles.title}>
                        {title}
                    </h1>
                    {lead && <p className={styles.lead}>{lead}</p>}
                    {children && <div className={styles.actions}>{children}</div>}
                </div>
            </div>
        </header>
    );
}


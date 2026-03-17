"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './HiringChatbox.module.css';

export default function HiringChatbox() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    if (isDismissed) return null;

    return (
        <div className={styles.container}>
            <div className={`${styles.chatbox} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
                    <div className={styles.headerTitle}>
                        <span className={styles.statusDot}></span>
                        We're Hiring!
                    </div>
                    <button className={styles.closeBtn} onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}>
                        ×
                    </button>
                </div>
                {isOpen && (
                    <div className={styles.body}>
                        <p>We're looking to grow our team. Currently open positions:</p>
                        <ul>
                            <li>Meat Cutter</li>
                            <li>Cashier</li>
                            <li>Dishwasher</li>
                        </ul>
                        <Link href="/jobs" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', marginTop: '1rem', fontSize: '0.875rem' }}>
                            View Jobs & Apply
                        </Link>
                    </div>
                )}
            </div>
            {!isOpen && (
                <div className={styles.fabWrapper}>
                    <button className={styles.fab} onClick={() => setIsOpen(true)}>
                        <span className={styles.statusDot}></span>
                        <span>We're Hiring! 👋</span>
                    </button>
                    <button 
                        className={styles.fabClose} 
                        onClick={() => setIsDismissed(true)}
                        aria-label="Dismiss hiring alert"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}

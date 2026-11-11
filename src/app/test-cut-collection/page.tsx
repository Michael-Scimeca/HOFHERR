import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CutCollector from '@/components/dashboard/CutCollector';
import { DEMO_ORDERS } from '@/app/dashboard/demoData';
import styles from './test-page.module.css';

export const metadata: Metadata = {
    title: 'Cut Collection Test Bench | Hofherr Meat Co.',
    description: 'Gamified butcher cut collection test page for customer profile orders.',
    robots: { index: false, follow: false },
};

export default function CutCollectionTestPage() {
    return (
        <main className="section">
            <div className={`container ${styles.pageStack}`}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>
                            Cut Collection Interactive Test Bench
                        </h1>
                        <p className={styles.pageSubtitle}>
                            Standalone test environment for the gamified customer butcher chart. Loaded with sample customer orders and interactive dev simulation controls.
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        <Link href="/dashboard" className={styles.btnSecondary}>
                            Open Customer Profile →
                        </Link>
                        <Link href="/online-orders" className={styles.btnPrimary}>
                            Online Orders Catalog →
                        </Link>
                    </div>
                </header>

                <CutCollector
                    orders={DEMO_ORDERS}
                    isAuthenticated={true}
                    userName="Michael Scimeca"
                    isTestPage={true}
                />
            </div>
        </main>
    );
}

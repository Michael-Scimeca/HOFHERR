import type { Metadata } from 'next';
import SalesPsychologyClient from './SalesPsychologyClient';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Sales Psychology & Behavioral Studies | Hofherr Meat Co.',
    description:
        'Eight peer-reviewed consumer psychology and behavioral economics studies applied to craft butcher merchandising, menu copy, pricing, and checkout UX.',
    robots: { index: false, follow: false },
};

export default function SalesPsychologyPage() {
    return (
        <main className={styles.page}>
            <header className={styles.hero}>
                <div className="container">
                    <h1 className={styles.headline}>
                        The Psychology of <span className={styles.accent}>Selling Craft Meat</span>
                    </h1>
                    <p className={styles.lead}>
                        Customers don&apos;t evaluate a dry-aged USDA Prime ribeye with a spreadsheet—they evaluate it
                        through anchors, decoys, sensory cues, trust signals, and checkout friction. Here are 14
                        peer-reviewed studies and iconic pricing tricks (movie theaters, McDonald&apos;s, Starbucks,
                        Williams-Sonoma &amp; fine dining) mapped straight to Hofherr Meat Co.
                    </p>
                </div>
            </header>

            <SalesPsychologyClient />
        </main>
    );
}


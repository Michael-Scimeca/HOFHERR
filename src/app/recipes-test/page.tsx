import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RecipesBrowser from './RecipesBrowser';
import { COLLECTIONS } from './recipes';
import styles from './page.module.css';

/* ── Dev-only gate (same as /fire-test, /order-tracker-test) ── */
const IS_DEV = process.env.NODE_ENV === 'development';

/* The featured collection follows the calendar, so read the date on each request. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Beef Cut Recipes Test | Hofherr Meat Co.',
    description: 'Test page: recipes by cut, occasion and season.',
    robots: { index: false, follow: false },
};

export default function RecipesTestPage() {
    if (!IS_DEV) notFound();

    const now = new Date();
    const month = now.getMonth();
    const today = `${now.getFullYear()}-${String(month + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const featured = COLLECTIONS.find(c => c.months.includes(month)) ?? null;

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    Butcher&apos;s Cut <em>Recipes</em>
                </h1>
                <p className={styles.lede}>
                    A craft recipe for every primal cut on the beef map — plus pork, poultry, lamb, veal and holiday
                    centerpieces — built around daily cuts from the Hofherr counter. Pick an occasion or cut to
                    scale ingredients and add everything directly to your pickup order.
                </p>
            </header>

            <RecipesBrowser featuredCollectionId={featured?.id ?? null} today={today} />
        </main>
    );
}

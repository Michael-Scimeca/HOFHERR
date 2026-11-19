import type { Metadata } from 'next';
import Link from 'next/link';
import ParcelSheetsTeaser from '@/components/home/ParcelSheetsTeaser';
import RecipesBrowser from './RecipesBrowser';
import { COLLECTIONS } from './recipes';
import styles from './page.module.css';

/* The featured collection follows the calendar, so read the date on each request. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Butcher's Cut Recipes — Hofherr Meat Co. | Beef, Pork, Poultry & Lamb",
    description:
        'Craft butcher recipes for every primal cut of beef, pork, poultry, lamb, and holiday centerpieces — scale ingredients and add cuts directly to your Hofherr pickup order.',
    alternates: { canonical: 'https://hofherrmeatco.com/recipes' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: "Butcher's Cut Recipes | Hofherr Meat Co.",
        description:
            'Craft recipes built around daily cuts from the Hofherr counter — scale ingredients by servings and add cuts straight to your pickup order.',
        url: 'https://hofherrmeatco.com/recipes',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: "Butcher's Cut Recipes — Hofherr Meat Co." }],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Butcher's Cut Recipes | Hofherr Meat Co.",
        description:
            'Craft butcher recipes by cut, occasion, and season from Hofherr Meat Co. in Northfield & Winnetka, IL.',
    },
};

export default function RecipesPage() {
    const now = new Date();
    const month = now.getMonth();
    const today = `${now.getFullYear()}-${String(month + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const featured = COLLECTIONS.find((c) => c.months.includes(month)) ?? null;

    return (
        <main>
            <header className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <h1 className={styles.title}>
                        Butcher&apos;s Cut <em>Recipes</em>
                    </h1>
                    <p className={styles.lede}>
                        A craft recipe for every primal cut on the beef map — plus pork, poultry, lamb, veal and holiday
                        centerpieces — built around daily cuts from the Hofherr counter. Pick an occasion or cut to
                        scale ingredients and add everything directly to your pickup order.
                    </p>
                    <div className={styles.heroActionsRow}>
                        <Link href="/recipes/sheets" className={styles.sheetsIndexCta}>
                            Printable 12×16&quot; Parcel Cooking Sheets →
                        </Link>
                    </div>
                </div>
            </header>

            <div className={styles.page}>
                <RecipesBrowser featuredCollectionId={featured?.id ?? null} today={today} />
            </div>
            <ParcelSheetsTeaser />
        </main>
    );
}

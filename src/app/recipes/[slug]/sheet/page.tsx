import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ParcelSheetGraphic from '../../ParcelSheetGraphic';
import { RECIPES } from '../../recipes';
import { getAllSheetSlugs, resolveCookingSheet } from '../../sheets-data';
import styles from '../../parcel-sheet.module.css';
import PrintSheetButton from './PrintSheetButton';

const KNOWN_RECIPE_SLUGS = new Set(RECIPES.map(r => r.slug));

type PageProps = {
    params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
    return getAllSheetSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const sheet = resolveCookingSheet(slug);
    if (!sheet) {
        return { title: 'Cooking Sheet Not Found | Hofherr Meat Co.' };
    }
    return {
        title: `${sheet.sheetTitle} — 12×16" Parchment Cooking Sheet | Hofherr Meat Co.`,
        description: `Printable 12 by 16 inch half-sheet parchment parcel liner for ${sheet.sheetTitle} (Serves 2, ${sheet.ovenTemp}, ${sheet.bakeTime}) with life-size ingredient outlines.`,
        robots: { index: false, follow: true },
    };
}

export default async function RecipeCookingSheetPage({ params }: PageProps) {
    const { slug } = await params;
    const sheet = resolveCookingSheet(slug);
    if (!sheet) {
        notFound();
    }

    return (
        <main className={styles.sheetRouteMain}>
            <div className={`container ${styles.toolbarSection}`} data-no-print>
                <div className={styles.toolbarInner}>
                    <nav className={styles.toolbarNav} aria-label="Cooking sheet navigation">
                        <Link href="/recipes/sheets" className={styles.toolbarLink}>
                            ← All Cooking Sheets
                        </Link>
                        {KNOWN_RECIPE_SLUGS.has(sheet.recipe.slug) && (
                            <Link href={`/recipes#${sheet.recipe.slug}`} className={styles.toolbarLink}>
                                Full Recipe Card
                            </Link>
                        )}
                        <Link href={sheet.onlineOrderPath} className={styles.toolbarLink}>
                            {`Order ${sheet.primaryBuy.item.name} →`}
                        </Link>
                    </nav>

                    <div className={styles.toolbarRight}>
                        <span className={styles.printSpecHint}>
                            12 × 16 in Half-Sheet · 100% Scale · Conventional Oven Only (Max 425°F, No Broiler) · Place blank kitchen parchment over home toner prints
                        </span>
                        <PrintSheetButton />
                    </div>
                </div>
            </div>

            <section
                id="cooking-sheet-stage"
                aria-label="Printable 12 by 16 inch parchment cooking sheet"
                className={styles.sheetStageSection}
            >
                <ParcelSheetGraphic sheet={sheet} />
            </section>
        </main>
    );
}


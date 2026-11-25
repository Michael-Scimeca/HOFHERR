import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ALL_STYLE_CONCEPTS,
    DEFAULT_SAUSAGE_RECIPE_SIDEBAR,
    PARCEL_OVEN_SAFETY_WARNING,
    SHEET_STYLE_CONCEPTS,
    getSheetStyleConcept,
} from '../../../sheets-data';
import styles from '../../../parcel-sheet.module.css';

type PageProps = {
    params: Promise<{ styleSlug: string }>;
};

export function generateStaticParams() {
    return ALL_STYLE_CONCEPTS.map(item => ({ styleSlug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { styleSlug } = await params;
    const concept = getSheetStyleConcept(styleSlug);
    if (!concept) {
        return { title: 'Sheet Style Not Found | Hofherr Meat Co.' };
    }
    return {
        title: `Style ${concept.number} · ${concept.title} — 12×16" Sheet | Hofherr Meat Co.`,
        description: concept.summary,
        robots: { index: false, follow: true },
    };
}

export default async function SheetStyleConceptPage({ params }: PageProps) {
    const { styleSlug } = await params;
    const idx = ALL_STYLE_CONCEPTS.findIndex(item => item.slug === styleSlug);
    if (idx === -1) {
        notFound();
    }

    const concept = ALL_STYLE_CONCEPTS[idx];
    const prev = ALL_STYLE_CONCEPTS[(idx - 1 + ALL_STYLE_CONCEPTS.length) % ALL_STYLE_CONCEPTS.length];
    const next = ALL_STYLE_CONCEPTS[(idx + 1) % ALL_STYLE_CONCEPTS.length];
    const recipe = concept.recipeSidebar ?? DEFAULT_SAUSAGE_RECIPE_SIDEBAR;
    const sheetSrc = concept.bwImage ?? concept.image;
    const needsBwFilter = !concept.bwImage;

    return (
        <main className={styles.sheetRouteMain}>
            <div className={`container ${styles.toolbarSection}`} data-no-print>
                <div className={styles.toolbarInner}>
                    <nav className={styles.toolbarNav} aria-label="Sheet style concept navigation">
                        <Link href="/recipes/sheets" className={styles.toolbarLink}>
                            {`← All ${ALL_STYLE_CONCEPTS.length} Sheet Editions`}
                        </Link>
                        <Link href={`/recipes/sheets/styles/${prev.slug}`} className={styles.toolbarLink}>
                            {`← ${prev.number}`}
                        </Link>
                        <Link href={`/recipes/sheets/styles/${next.slug}`} className={styles.toolbarLink}>
                            {`${next.number} →`}
                        </Link>
                    </nav>

                    <div className={styles.toolbarRight}>
                        <span className={styles.printSpecHint}>
                            {`🔥 In-Shop Counter Exclusive · ${concept.number.startsWith('F') || concept.number.startsWith('SS') ? `Edition ${concept.number}` : `Style ${concept.number} of ${SHEET_STYLE_CONCEPTS.length}`} · Do not print at home for oven use`}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.printBlockedNotice} aria-hidden="true">
                <h2>Do Not Print for Oven Use — Fire &amp; Food Safety Notice</h2>
                <p>
                    Home printer paper and inkjet or laser toner are NOT oven-safe or food-safe and can ignite in an
                    oven. Authentic Hofherr Meat Co. 12×16&quot; FDA food-grade silicone parchment parcel cooking
                    sheets are available exclusively at our Northfield and Winnetka counters.
                </p>
            </div>

            <header className={styles.styleHeaderBar} data-no-print>
                <h1 className={styles.styleStageHeading}>{`Style ${concept.number} · ${concept.title}`}</h1>
                <p className={styles.styleStageSub}>{concept.summary}</p>
            </header>

            <section
                id="style-concept-stage"
                aria-label={`Style ${concept.number} ${concept.title} 12 by 16 inch parchment sheet preview`}
                className={styles.sheetStageSection}
            >
                <article
                    className={`${styles.sheetPaper} ${styles.styleSheetPaperFull}`}
                    data-testid="style-concept-paper"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={sheetSrc}
                        alt={`Style ${concept.number} ${concept.title} 12 by 16 inch black and white parchment sheet preview`}
                        className={`${styles.styleConceptStageImg} ${needsBwFilter ? styles.bwRasterFilter : ''}`}
                    />

                    <aside
                        className={needsBwFilter ? styles.sheetRecipePocketOverlay : styles.srOnly}
                        aria-label="Printed recipe ingredients and method"
                        data-testid="sheet-recipe-sidebar"
                    >
                        <span className={styles.recipePocketKicker}>Recipe · 2 Servings</span>
                        <span className={styles.recipePocketSpec}>{recipe.bakeSpec}</span>

                        <span className={styles.recipePocketHeading}>Ingredients</span>
                        <ul className={styles.recipePocketList}>
                            {recipe.ingredients.map(ing => (
                                <li key={ing}>{ing}</li>
                            ))}
                        </ul>

                        <span className={styles.recipePocketHeading}>Method</span>
                        <ol className={styles.recipePocketSteps}>
                            {recipe.method.map(step => (
                                <li key={step}>{step}</li>
                            ))}
                        </ol>
                    </aside>

                    <p className={styles.styleSheetSafetyStrip} data-testid="sheet-safety-warning">
                        {`${recipe.bakeSpec} · ${PARCEL_OVEN_SAFETY_WARNING}`}
                    </p>
                </article>
            </section>
        </main>
    );
}


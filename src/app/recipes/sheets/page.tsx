import type { Metadata } from 'next';
import Link from 'next/link';
import { ParcelSheetThumbnail } from '../ParcelSheetGraphic';
import { RECIPES } from '../recipes';
import {
    FEATURED_FUSION_CONCEPTS,
    PARCEL_OVEN_SAFETY_WARNING,
    SAFETY_SEAL_SHEET_CONCEPTS,
    SHEET_STYLE_CONCEPTS,
    SKIPPED_RECIPES,
    SKIP_CATEGORY_LABELS,
    getAllShowcaseCookingSheets,
    type SkipCategory,
} from '../sheets-data';
import styles from '../parcel-sheet.module.css';
import { SheetsInkModeShell, SheetsInkModeToggleBar } from './SheetsInkModeShell';

const KNOWN_RECIPE_SLUGS = new Set(RECIPES.map(r => r.slug));

export const metadata: Metadata = {
    title: "Butcher's Parcel Liners (12×16\") — Hofherr Meat Co.",
    description:
        'Single-ink black-and-white printable 12 by 16 inch half-sheet parchment parcel liners for 2 servings with right-hand recipe checklists.',
    robots: { index: false, follow: true },
};

const SKIP_ORDER: SkipCategory[] = [
    'grilled',
    'braised',
    'foil-broil',
    'high-heat-sear',
    'whole-roast',
    'stovetop-or-mixed',
];

export default function RecipeCookingSheetsIndexPage() {
    const sheets = getAllShowcaseCookingSheets();

    return (
        <SheetsInkModeShell>
            <header className={styles.indexHero}>
                <div className={`container ${styles.indexHeroGrid}`}>
                    <div className={styles.indexHeroCopy}>
                        <h1 className={styles.indexTitle}>
                            Butcher&apos;s Parcel <em>Liners</em>
                        </h1>
                        <p className={styles.indexLede}>
                            Single-ink black-and-white 12 × 16 inch parchment print plates calibrated for two servings —
                            strictly for <strong>oven-baked parcels at 425°F or below</strong>, with life-size 1:1
                            ingredient contours, USDA safe internal temperatures, and a scannable QR code back to
                            hofherrmeatco.com.
                        </p>
                        <SheetsInkModeToggleBar />
                        <div className={styles.indexMetaRow}>
                            <span className={styles.indexSpecStat}>
                                {`Baked Parcels Only (≤ 425°F) · ${SAFETY_SEAL_SHEET_CONCEPTS.length} Full 12×16" Sheets · ${SKIPPED_RECIPES.length} Off-Paper Recipes`}
                            </span>
                            <Link href="#baked-parcels-only" className={styles.indexBackLink}>
                                Baked Parcels Only Rules ↓
                            </Link>
                            <Link href="#safety-seal-sheets" className={styles.indexBackLink}>
                                {`Jump to ${SAFETY_SEAL_SHEET_CONCEPTS.length} B&W 12×16" Sheets ↓`}
                            </Link>
                            <Link href="#skipped-recipes" className={styles.indexBackLink}>
                                {`Recipes Off the Paper (${SKIPPED_RECIPES.length}) ↓`}
                            </Link>
                            <Link href="/recipes" className={styles.indexBackLink}>
                                {`← Browse All ${RECIPES.length} Butcher Recipes`}
                            </Link>
                        </div>
                    </div>

                    <div className={styles.indexHeroMedia}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/assets/recipes/sheets/how-it-works-sausage-triptych.jpg"
                            alt="Three-step progression showing Hofherr Italian sausages placed on a 12 by 16 inch parchment sheet, folded into a parcel on cast iron, and baked steaming hot"
                            className={styles.indexHeroImg}
                        />
                    </div>
                </div>
            </header>

            <section
                id="how-parcel-sheets-work"
                aria-labelledby="how-parcel-sheets-work-heading"
                className="section-sm"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="how-parcel-sheets-work-heading" className={styles.sectionHeading}>
                            How the Parcel Liner Works
                        </h2>
                        <p className={styles.sectionSub}>
                            No measuring cups, no guesswork, and zero pan scrubbing — lay your Hofherr cuts on the
                            1:1 outlines, fold along the numbered tracks, and bake.
                        </p>
                    </div>

                    <div className={styles.howGrid} data-testid="how-parcel-sheets-work-grid">
                        <article className={styles.howStep}>
                            <div className={styles.howStepMedia}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/assets/recipes/sheets/how-it-works-01-place.jpg"
                                    alt="Step 1: Center-cut salmon fillets, asparagus spears, lemon wheels, and butter placed on 1 to 1 printed parchment outlines while pouring sauce"
                                    className={styles.howStepImg}
                                    loading="eager"
                                />
                            </div>
                            <div className={styles.howStepCopy}>
                                <div className={styles.howStepHeaderRow}>
                                    <span className={styles.howStepNum}>01</span>
                                    <span className={styles.howStepTag}>Prep · 2 Min</span>
                                </div>
                                <h3 className={styles.howStepTitle}>Place on 1:1 Outlines</h3>
                                <p className={styles.howStepDesc}>
                                    Lay Hofherr cuts, butter pats, herbs, and aromatics directly onto their life-size
                                    contours and pour oil, wine, or sauce into the calibrated ring.
                                </p>
                            </div>
                        </article>

                        <article className={styles.howStep}>
                            <div className={styles.howStepMedia}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/assets/recipes/sheets/how-it-works-02-fold.jpg"
                                    alt="Step 2: Parchment sheet folded and double-creased into an airtight packet on a dark rimmed half-sheet baking pan"
                                    className={styles.howStepImg}
                                    loading="eager"
                                />
                            </div>
                            <div className={styles.howStepCopy}>
                                <div className={styles.howStepHeaderRow}>
                                    <span className={styles.howStepNum}>02</span>
                                    <span className={styles.howStepTag}>Seal · 30 Sec</span>
                                </div>
                                <h3 className={styles.howStepTitle}>Fold &amp; Crimp Airtight</h3>
                                <p className={styles.howStepDesc}>
                                    Bring the long edges together above the food and double-crease along Folds 01 → 03
                                    to lock natural juices and aromatics inside a sealed steam parcel.
                                </p>
                            </div>
                        </article>

                        <article className={styles.howStep}>
                            <div className={styles.howStepMedia}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/assets/recipes/sheets/how-it-works-03-bake.jpg"
                                    alt="Step 3: Baked parchment parcel opened on a dark sheet pan revealing golden roasted salmon fillets, tender asparagus, lemon wheels, and rising steam"
                                    className={styles.howStepImg}
                                    loading="eager"
                                />
                            </div>
                            <div className={styles.howStepCopy}>
                                <div className={styles.howStepHeaderRow}>
                                    <span className={styles.howStepNum}>03</span>
                                    <span className={styles.howStepTag}>Bake · Zero Cleanup</span>
                                </div>
                                <h3 className={styles.howStepTitle}>Bake, Tear Open &amp; Enjoy</h3>
                                <p className={styles.howStepDesc}>
                                    Bake on a rimmed half-sheet pan at 400°F–425°F, vent the top seam safely at the
                                    table, and toss the parchment liner — your pan stays spotless.
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section
                id="baked-parcels-only"
                aria-labelledby="baked-parcels-only-heading"
                className="section-sm"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="baked-parcels-only-heading" className={styles.sectionHeading}>
                            Baked Parcels Only — Max 425°F
                        </h2>
                        <p className={styles.sectionSub}>
                            Every printable Hofherr parchment liner follows strict culinary and food-safety rules
                            audited by hand from each recipe&apos;s actual cooking method (<code>parcelFriendly: true</code>).
                            High-heat steaks, live-fire grill cuts, long braises, and mixed sear-then-bake dishes stay
                            off the paper in our standard <Link href="/recipes">/recipes</Link> collection.
                        </p>
                    </div>

                    <div className={styles.specsGrid}>
                        <div className={styles.specCard}>
                            <span className={styles.specCardKicker}>Approved for Paper</span>
                            <h3 className={styles.specCardTitle}>100% Oven-Baked at 425°F or Below</h3>
                            <p className={styles.specCardBody}>
                                We only generate sheets for cuts that bake cleanly from start to finish sealed inside a
                                parchment packet at 425°F or below: fish and shellfish fillets, chicken pieces, fresh or
                                smoked sausages, pork chops and tenderloin, lamb chops, and vegetables.
                            </p>
                        </div>

                        <div className={styles.specCard}>
                            <span className={styles.specCardKicker}>Kept Off the Paper</span>
                            <h3 className={styles.specCardTitle}>Zero Grill, Sear, Broil, Braise, or Mixed Methods</h3>
                            <p className={styles.specCardBody}>
                                We never generate a sheet for anything grilled, broiled, smoked, pan-seared, pan-fried,
                                deep-fried, braised in liquid, slow-cooked, served raw, cooked above 425°F, or mixing
                                methods (such as sear in a skillet, then bake). Existing recipes are never rewritten to
                                force a parcel.
                            </p>
                        </div>

                        <div className={styles.specCard}>
                            <span className={styles.specCardKicker}>USDA Safe Internal Temps</span>
                            <h3 className={styles.specCardTitle}>165°F Poultry · 145°F Whole Cuts &amp; Fish · 160°F Sausage</h3>
                            <p className={styles.specCardBody}>
                                Every sheet prints the oven temperature, bake time, and USDA safe internal thermometer
                                target: <strong>165°F</strong> for poultry, <strong>145°F</strong> for whole cuts of
                                pork, beef, lamb, veal, and fish, and <strong>160°F</strong> for ground meat and fresh
                                sausage.
                            </p>
                        </div>

                        <div className={styles.specCard}>
                            <span className={styles.specCardKicker}>Printed on Every Sheet</span>
                            <h3 className={styles.specCardTitle}>Mandatory Oven Safety &amp; 1/4-Cup Splash Gauge</h3>
                            <p className={styles.specCardBody}>
                                Every liner prints: <strong>&ldquo;{PARCEL_OVEN_SAFETY_WARNING}&rdquo;</strong> — plus
                                a calibrated 90° quadrant dial (Zone 05) marking the exact 1/4-cup wine, cider, or stock
                                splash added right before sealing Fold 03.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="safety-seal-sheets"
                aria-labelledby="safety-seal-sheets-heading"
                className="section-sm"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="safety-seal-sheets-heading" className={styles.sectionHeading}>
                            {`Print-Ready 12×16" Full Sheets — Small Recipe Inside the Wrap Box (${SAFETY_SEAL_SHEET_CONCEPTS.length})`}
                        </h2>
                        <p className={styles.sectionSub}>
                            Single 12 × 16 inch (3:4) parchment sheets with a compact 2-serving ingredients &amp; method
                            checklist printed directly inside the perimeter fold lines — beneath the top-right medallion
                            and beside the center cut.
                        </p>
                    </div>

                    <div className={styles.safetySheetsFullGrid}>
                        {SAFETY_SEAL_SHEET_CONCEPTS.map((concept, idx) => (
                            <article
                                key={concept.slug}
                                className={styles.sheetCard}
                                data-testid={`safety-seal-sheet-card-${concept.number}`}
                            >
                                <Link
                                    href={`/recipes/sheets/styles/${concept.slug}`}
                                    className={styles.fullSheetCardLink}
                                    aria-label={`Open full-size ${concept.number}: ${concept.title}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={concept.bwImage ?? concept.image}
                                        alt={`${concept.number} ${concept.title} black and white 12 by 16 inch print plate`}
                                        className={`${styles.fullSheetCardImg} ${styles.onlyBwMode}`}
                                        loading={idx < 4 ? 'eager' : 'lazy'}
                                    />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={concept.image}
                                        alt={`${concept.number} ${concept.title} color parchment 12 by 16 inch reference`}
                                        className={`${styles.fullSheetCardImg} ${styles.onlyColorMode}`}
                                        loading="lazy"
                                    />
                                </Link>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{`${concept.number} · ${concept.title}`}</h3>
                                    <p className={styles.cardCutLabel}>{concept.register}</p>
                                    <p className={styles.cardSpecs}>{concept.summary}</p>

                                    {concept.recipeSidebar && (
                                        <div className={styles.cardRecipeBox}>
                                            <p className={styles.cardRecipeSpecBar}>
                                                {`RECIPE · 2 SERVINGS · ${concept.recipeSidebar.bakeSpec}`}
                                            </p>
                                            <div className={styles.cardRecipeCols}>
                                                <div>
                                                    <span className={styles.cardRecipeColTitle}>Ingredients</span>
                                                    <ul className={styles.cardRecipeList}>
                                                        {concept.recipeSidebar.ingredients.map(ing => (
                                                            <li key={ing}>{ing}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <span className={styles.cardRecipeColTitle}>Method</span>
                                                    <ol className={styles.cardRecipeList}>
                                                        {concept.recipeSidebar.method.map(step => (
                                                            <li key={step}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            </div>
                                            <p className={styles.cardSafetyFoot}>{PARCEL_OVEN_SAFETY_WARNING}</p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardActions}>
                                    <Link
                                        href={`/recipes/sheets/styles/${concept.slug}`}
                                        className={styles.cardPrimaryBtn}
                                    >
                                        {`Open ${concept.number} Full 12×16 Sheet →`}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="featured-fusion-sheets"
                aria-labelledby="featured-fusion-sheets-heading"
                className="section-sm"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="featured-fusion-sheets-heading" className={styles.sectionHeading}>
                            {`Featured Halved-Pepper × Flame Line-Art Plates (${FEATURED_FUSION_CONCEPTS.length})`}
                        </h2>
                        <p className={styles.sectionSub}>
                            Rendered in single-ink black &amp; white print mode by default, with full right-hand recipe
                            sidebar on each 12 × 16 inch stage page.
                        </p>
                    </div>

                    <div className={styles.sheetsGrid}>
                        {FEATURED_FUSION_CONCEPTS.map(concept => (
                            <article
                                key={concept.slug}
                                className={styles.sheetCard}
                                data-testid={`featured-fusion-card-${concept.number}`}
                            >
                                <Link
                                    href={`/recipes/sheets/styles/${concept.slug}`}
                                    className={styles.styleThumbLink}
                                    aria-label={`Open full-size Edition ${concept.number}: ${concept.title}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={concept.image}
                                        alt={`Edition ${concept.number} ${concept.title} 12 by 16 inch printable parchment sheet`}
                                        className={`${styles.styleThumbImg} ${styles.bwConvertibleImg}`}
                                        loading="lazy"
                                    />
                                </Link>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{`${concept.number} · ${concept.title}`}</h3>
                                    <p className={styles.cardCutLabel}>{concept.register}</p>
                                    <p className={styles.cardSpecs}>{concept.summary}</p>

                                    {concept.recipeSidebar && (
                                        <div className={styles.cardRecipeBox}>
                                            <p className={styles.cardRecipeSpecBar}>
                                                {`RECIPE · 2 SERVINGS · ${concept.recipeSidebar.bakeSpec}`}
                                            </p>
                                            <div className={styles.cardRecipeCols}>
                                                <div>
                                                    <span className={styles.cardRecipeColTitle}>Ingredients</span>
                                                    <ul className={styles.cardRecipeList}>
                                                        {concept.recipeSidebar.ingredients.map(ing => (
                                                            <li key={ing}>{ing}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <span className={styles.cardRecipeColTitle}>Method</span>
                                                    <ol className={styles.cardRecipeList}>
                                                        {concept.recipeSidebar.method.map(step => (
                                                            <li key={step}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            </div>
                                            <p className={styles.cardSafetyFoot}>{PARCEL_OVEN_SAFETY_WARNING}</p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardActions}>
                                    <Link
                                        href={`/recipes/sheets/styles/${concept.slug}`}
                                        className={styles.cardPrimaryBtn}
                                    >
                                        {`Open ${concept.number} Full 12×16 →`}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="sheet-style-directions"
                aria-labelledby="sheet-style-directions-heading"
                className="section-sm"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="sheet-style-directions-heading" className={styles.sectionHeading}>
                            {`Nano Banana Sheet Style Directions (${SHEET_STYLE_CONCEPTS.length})`}
                        </h2>
                        <p className={styles.sectionSub}>
                            Thirty print directions for our 12 × 16 inch Sweet Italian Sausage &amp; Sweet Bell Peppers
                            parchment liner — shown in monochrome print mode and paired with a right-hand recipe sidebar
                            at full 12 × 16 inch scale.
                        </p>
                    </div>

                    <div className={styles.sheetsGrid}>
                        {SHEET_STYLE_CONCEPTS.map(concept => (
                            <article
                                key={concept.slug}
                                className={styles.sheetCard}
                                data-testid={`sheet-style-card-${concept.number}`}
                            >
                                <Link
                                    href={`/recipes/sheets/styles/${concept.slug}`}
                                    className={styles.styleThumbLink}
                                    aria-label={`Open full-size Style ${concept.number}: ${concept.title}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={concept.image}
                                        alt={`Style ${concept.number} ${concept.title} 12 by 16 inch printable parchment sheet`}
                                        className={`${styles.styleThumbImg} ${styles.bwConvertibleImg}`}
                                        loading="lazy"
                                    />
                                </Link>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{`${concept.number} · ${concept.title}`}</h3>
                                    <p className={styles.cardCutLabel}>{concept.register}</p>
                                    <p className={styles.cardSpecs}>{concept.summary}</p>

                                    {concept.recipeSidebar && (
                                        <div className={styles.cardRecipeBox}>
                                            <p className={styles.cardRecipeSpecBar}>
                                                {`RECIPE · 2 SERVINGS · ${concept.recipeSidebar.bakeSpec}`}
                                            </p>
                                            <div className={styles.cardRecipeCols}>
                                                <div>
                                                    <span className={styles.cardRecipeColTitle}>Ingredients</span>
                                                    <ul className={styles.cardRecipeList}>
                                                        {concept.recipeSidebar.ingredients.map(ing => (
                                                            <li key={ing}>{ing}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <span className={styles.cardRecipeColTitle}>Method</span>
                                                    <ol className={styles.cardRecipeList}>
                                                        {concept.recipeSidebar.method.map(step => (
                                                            <li key={step}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            </div>
                                            <p className={styles.cardSafetyFoot}>{PARCEL_OVEN_SAFETY_WARNING}</p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardActions}>
                                    <Link
                                        href={`/recipes/sheets/styles/${concept.slug}`}
                                        className={styles.cardPrimaryBtn}
                                    >
                                        {`Open Style ${concept.number} Full 12×16 →`}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="printable-sheets" aria-labelledby="printable-sheets-heading" className="section-sm">
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="printable-sheets-heading" className={styles.sectionHeading}>
                            {`True-Scale Vector Parcel Sheets + Right Recipe Column (${sheets.length})`}
                        </h2>
                        <p className={styles.sectionSub}>
                            Every true-scale vector sheet below renders in single-color black ink with a 2-serving
                            ingredients &amp; method sidebar on the right and a QR code to /online-orders.
                        </p>
                    </div>

                    <div className={styles.sheetsGrid}>
                        {sheets.map(sheet => (
                            <article
                                key={sheet.slug}
                                className={styles.sheetCard}
                                data-testid={`sheet-index-card-${sheet.slug}`}
                            >
                                <div className={styles.cardVisualSplit}>
                                    <Link
                                        href={`/recipes/${sheet.slug}/sheet`}
                                        className={styles.thumbLink}
                                        aria-label={`Open printable sheet for ${sheet.sheetTitle}`}
                                    >
                                        <ParcelSheetThumbnail sheet={sheet} />
                                    </Link>
                                    <div className={styles.vignetteWrap}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={sheet.vignetteImage}
                                            alt={`${sheet.sheetTitle} parcel illustration`}
                                            className={styles.vignetteImg}
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <span className={styles.cardCutLabel}>
                                        {`${sheet.recipe.cut} · Serves 2`}
                                    </span>
                                    <h3 className={styles.cardTitle}>{sheet.sheetTitle}</h3>
                                    <p className={styles.cardSpecs}>
                                        {`Oven ${sheet.ovenTemp} · Bake ${sheet.bakeTime} · Safe Internal ${sheet.pullTemp}`}
                                    </p>
                                    <p className={styles.cardCutBuy}>
                                        {`Hofherr cut: ${sheet.primaryBuy.item.name} (${sheet.primaryBuy.label}, ${sheet.primaryBuy.item.price})`}
                                    </p>
                                    <p className={styles.cardSafetyFoot}>{PARCEL_OVEN_SAFETY_WARNING}</p>
                                </div>

                                <div className={styles.cardActions}>
                                    <Link
                                        href={`/recipes/${sheet.slug}/sheet`}
                                        className={styles.cardPrimaryBtn}
                                    >
                                        Open B&amp;W Print Sheet →
                                    </Link>
                                    {KNOWN_RECIPE_SLUGS.has(sheet.recipe.slug) ? (
                                        <Link
                                            href={`/recipes#${sheet.recipe.slug}`}
                                            className={styles.cardSecondaryLink}
                                        >
                                            Full Recipe
                                        </Link>
                                    ) : (
                                        <Link
                                            href={sheet.onlineOrderPath}
                                            className={styles.cardSecondaryLink}
                                        >
                                            Order Cut →
                                        </Link>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="parchment-material-specs"
                aria-labelledby="parchment-material-specs-heading"
                className="section-sm"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="parchment-material-specs-heading" className={styles.sectionHeading}>
                            Parchment, Ink &amp; Oven Specs
                        </h2>
                        <p className={styles.sectionSub}>
                            Physical kitchen standards for single-ink printed half-sheet cooking parchment — covering
                            food-contact coating, home-printer testing, oven temperature limits, and single-pan cleanup.
                        </p>
                    </div>

                    <div className={styles.specsGrid}>
                        <div className={styles.specCard}>
                            <span className={styles.specCardKicker}>Food-Contact Barrier</span>
                            <h3 className={styles.specCardTitle}>Single Black Ink Under Silicone · PFAS Free</h3>
                            <p className={styles.specCardBody}>
                                Counter-printed Hofherr parcel sheets seal single-color black linework beneath a
                                food-grade silicone release coating — free of PFAS and Quilon — minimizing ink density
                                and eliminating multi-pass color pigments.
                            </p>
                        </div>

                        <div className={styles.specCard}>
                            <span className={styles.specCardKicker}>Home Test Prints</span>
                            <h3 className={styles.specCardTitle}>Blank Parchment Overlay Method</h3>
                            <p className={styles.specCardBody}>
                                Standard desktop toner and inkjet dye are not food-safe. Set a blank sheet of kitchen
                                parchment over the high-contrast black-and-white printout on your tray — the 1:1
                                outlines and right-side recipe checklist read crisply right through the paper.
                            </p>
                        </div>

                        <div className={styles.specCard}>
                            <span className={styles.specCardKicker}>Heat &amp; Appliance Limits</span>
                            <h3 className={styles.specCardTitle}>Conventional Oven Up to 425°F · No Broiler</h3>
                            <p className={styles.specCardBody}>
                                Bake on a rimmed 13 × 18 in half-sheet pan in a conventional oven at 400°F–425°F. Never
                                expose parchment to broiler coils, toaster-oven elements, or open grill flames, and open
                                the top seam away from your face with tongs to vent 212°F steam safely.
                            </p>
                        </div>

                        <div className={styles.specCard}>
                            <span className={styles.specCardKicker}>Kitchen Workflow</span>
                            <h3 className={styles.specCardTitle}>1:1 Contours + Right-Side Checklist</h3>
                            <p className={styles.specCardBody}>
                                Calibrated circles replace measuring spoons (Ø 1.25 in = 1 tbsp butter pat; Ø 0.90 in =
                                1/2 tbsp) while the printed right-hand recipe column gives you every ingredient and bake
                                step at a glance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="skipped-recipes" aria-labelledby="skipped-recipes-heading" className="section-sm">
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="skipped-recipes-heading" className={styles.sectionHeading}>
                            {`Recipes Off the Paper — Not Parcel-Friendly (${SKIPPED_RECIPES.length} Skipped Recipes)`}
                        </h2>
                        <p className={styles.sectionSub}>
                            Steaks that demand dry smoking cast iron, live-fire grill cuts, 3-hour Dutch-oven collagen
                            braises, whole holiday birds, stovetop skillet recipes, and mixed sear-then-bake dishes are
                            marked <code>parcelFriendly: false</code> and stay off parchment in our{' '}
                            <Link href="/recipes">full butcher recipe index</Link>.
                        </p>
                    </div>

                    <div className={styles.skippedGrid}>
                        {SKIP_ORDER.map(cat => {
                            const items = SKIPPED_RECIPES.filter(item => item.category === cat);
                            return (
                                <div key={cat} className={styles.skippedGroup}>
                                    <h3 className={styles.skippedGroupTitle}>
                                        {`${SKIP_CATEGORY_LABELS[cat]} (${items.length})`}
                                    </h3>
                                    <ul className={styles.skippedList}>
                                        {items.map(item => (
                                            <li key={item.slug} className={styles.skippedItem}>
                                                <Link
                                                    href={`/recipes#${item.slug}`}
                                                    className={styles.skippedItemLink}
                                                >
                                                    {`${item.title} (${item.cut})`}
                                                </Link>
                                                <p className={styles.skippedReason}>{item.reason}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </SheetsInkModeShell>
    );
}

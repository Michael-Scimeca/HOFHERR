'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCartCount } from '@/context/CartContext';
import RecipeCard from './RecipeCard';
import {
    BUNDLES,
    COLLECTIONS,
    OCCASIONS,
    PRICES_AS_OF,
    RECIPES,
    TEMPERATURE_NOTE,
    type Bundle,
    type OccasionId,
} from './recipes';
import { formatEstimate } from './scale';
import styles from './page.module.css';

type Filter =
    | { kind: 'all' }
    | { kind: 'occasion'; id: OccasionId }
    | { kind: 'collection'; id: string };

const OCCASION_LABEL = Object.fromEntries(OCCASIONS.map(o => [o.id, o.label])) as Record<OccasionId, string>;

const bundleTotal = (bundle: Bundle) =>
    bundle.items.reduce((sum, item) => sum + item.unitPrice * (item.lb ?? item.qty), 0);

type Props = {
    featuredCollectionId: string | null;
    /** YYYY-MM-DD from the server. */
    today: string;
};

export default function RecipesBrowser({ featuredCollectionId, today }: Props) {
    const { addItem, openCart, triggerFlyAnimation } = useCartCount();
    const [filter, setFilter] = useState<Filter>({ kind: 'all' });
    const [addedBundle, setAddedBundle] = useState<string | null>(null);
    /* Start with the first recipe open so the user immediately sees the full layout + buy box. */
    const [openSlugs, setOpenSlugs] = useState<string[]>(['head']);
    const openSlugsSet = useMemo(() => new Set(openSlugs), [openSlugs]);

    const openRecipe = (slug: string) => setOpenSlugs(cur => (cur.includes(slug) ? cur : [...cur, slug]));
    const toggleRecipe = (slug: string) =>
        setOpenSlugs(cur => (cur.includes(slug) ? cur.filter(s => s !== slug) : [...cur, slug]));

    // A link such as /recipes-test#chuck opens that recipe.
    useEffect(() => {
        const openFromHash = () => {
            const slug = window.location.hash.slice(1);
            if (RECIPES.some(r => r.slug === slug)) {
                setOpenSlugs(cur => (cur.includes(slug) ? cur : [...cur, slug]));
            }
        };
        const timerId = window.setTimeout(openFromHash, 0);
        window.addEventListener('hashchange', openFromHash);
        return () => {
            window.clearTimeout(timerId);
            window.removeEventListener('hashchange', openFromHash);
        };
    }, []);

    const featured = COLLECTIONS.find(c => c.id === featuredCollectionId) ?? null;
    const featuredHeroRecipe = featured ? (RECIPES.find(r => r.slug === featured.recipes[0]) ?? null) : null;
    const activeCollection =
        filter.kind === 'collection' ? (COLLECTIONS.find(c => c.id === filter.id) ?? null) : null;

    // Collections keep their own order (centerpiece first); occasions keep cut order.
    const visible =
        filter.kind === 'occasion'
            ? RECIPES.filter(r => r.occasions.includes(filter.id))
            : activeCollection
              ? activeCollection.recipes.flatMap(slug => RECIPES.filter(r => r.slug === slug))
              : RECIPES;

    const filterLabel =
        filter.kind === 'occasion'
            ? OCCASION_LABEL[filter.id]
            : activeCollection
              ? activeCollection.label
              : null;

    const showCollection = (id: string) => setFilter({ kind: 'collection', id });

    const handleAddBundle = (bundle: Bundle, e: React.MouseEvent<HTMLButtonElement>) => {
        for (const item of bundle.items) {
            addItem({
                name: item.name,
                price: item.price,
                qty: item.qty,
                note: `${bundle.name}: ${item.label}`,
            });
        }
        const rect = e.currentTarget.getBoundingClientRect();
        triggerFlyAnimation({ x: rect.left + rect.width / 2 - 40, y: rect.top - 40 });
        setAddedBundle(bundle.id);
        window.setTimeout(() => setAddedBundle(current => (current === bundle.id ? null : current)), 2500);
    };

    return (
        <>
            {featured && (
                <section className={styles.featured} aria-label="Featured seasonal collection">
                    {featuredHeroRecipe?.image && (
                        <div className={styles.featuredMedia}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className={styles.featuredImg}
                                src={featuredHeroRecipe.image}
                                alt={`${featuredHeroRecipe.title} illustration`}
                            />
                        </div>
                    )}
                    <div className={styles.featuredText}>
                        <span className={styles.featuredKicker}>In season now · {featured.season}</span>
                        <h2 className={styles.featuredTitle}>{featured.label}</h2>
                        <p className={styles.featuredBlurb}>{featured.blurb}</p>
                        <div className={styles.featuredActions}>
                            <button
                                type="button"
                                className={styles.featuredBtn}
                                onClick={() => showCollection(featured.id)}
                            >
                                See the {featured.recipes.length} recipes
                            </button>
                            {featuredHeroRecipe && (
                                <a
                                    href={`#${featuredHeroRecipe.slug}`}
                                    className={styles.featuredSecondaryLink}
                                    onClick={() => openRecipe(featuredHeroRecipe.slug)}
                                >
                                    Jump to {featuredHeroRecipe.title} →
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.browse} aria-label="Browse recipes">
                <div className={styles.browseGroup}>
                    <h2 className={styles.browseLabel}>Browse by occasion</h2>
                    <div className={styles.chips}>
                        <button
                            type="button"
                            aria-pressed={filter.kind === 'all'}
                            className={`${styles.chip} ${filter.kind === 'all' ? styles.chipActive : ''}`}
                            onClick={() => setFilter({ kind: 'all' })}
                        >
                            All recipes
                        </button>
                        {OCCASIONS.map(o => {
                            const active = filter.kind === 'occasion' && filter.id === o.id;
                            return (
                                <button
                                    key={o.id}
                                    type="button"
                                    aria-pressed={active}
                                    className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                                    onClick={() => setFilter({ kind: 'occasion', id: o.id })}
                                >
                                    {o.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.browseGroup}>
                    <h2 className={styles.browseLabel}>Seasonal collections</h2>
                    <div className={styles.chips}>
                        {COLLECTIONS.map(c => {
                            const active = filter.kind === 'collection' && filter.id === c.id;
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    aria-pressed={active}
                                    className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                                    onClick={() => showCollection(c.id)}
                                >
                                    {c.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <details className={`${styles.fold} ${styles.bundles}`} open>
                <summary className={styles.foldSummary}>Dinner party bundles ({BUNDLES.length})</summary>
                <div className={styles.bundleGrid}>
                    {BUNDLES.map(bundle => {
                        const total = bundleTotal(bundle);
                        const bundleRecipe = RECIPES.find(r => r.slug === bundle.recipe);
                        return (
                            <div key={bundle.id} className={styles.bundle}>
                                {bundleRecipe?.image && (
                                    <div className={styles.bundleThumbWrap}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            className={styles.bundleThumb}
                                            src={bundleRecipe.image}
                                            alt={bundle.name}
                                        />
                                        <span className={styles.bundleServesBadge}>Serves {bundle.serves}</span>
                                    </div>
                                )}
                                <h3 className={styles.bundleName}>{bundle.name}</h3>
                                <p className={styles.bundleBlurb}>{bundle.blurb}</p>
                                <ul className={styles.bundleItems}>
                                    {bundle.items.map(item => (
                                        <li key={item.name}>
                                            <span>{item.name}</span>
                                            <span>{item.label}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className={styles.bundlePrice}>
                                    About <strong>{formatEstimate(total)}</strong> ·{' '}
                                    {formatEstimate(total / bundle.serves)} a person
                                </p>
                                <div className={styles.bundleActions}>
                                    <button
                                        type="button"
                                        className={styles.orderBtn}
                                        onClick={e => handleAddBundle(bundle, e)}
                                    >
                                        {addedBundle === bundle.id ? 'Added to cart' : 'Add bundle to cart'}
                                    </button>
                                    {addedBundle === bundle.id ? (
                                        <button type="button" className={styles.viewCartBtn} onClick={openCart}>
                                            View cart
                                        </button>
                                    ) : (
                                        <a
                                            href={`#${bundle.recipe}`}
                                            className={styles.bundleLink}
                                            onClick={() => {
                                                setFilter({ kind: 'all' });
                                                openRecipe(bundle.recipe);
                                            }}
                                        >
                                            See the recipe
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className={styles.finePrint}>
                    Bundle totals add up menu prices as of {PRICES_AS_OF}. The final total depends on the weight cut.
                </p>
            </details>

            <p className={styles.resultLine} role="status">
                {filterLabel ? (
                    <>
                        <span>
                            <strong>
                                {visible.length} {visible.length === 1 ? 'recipe' : 'recipes'}
                            </strong>{' '}
                            for {filterLabel}
                            {activeCollection ? ` · ${activeCollection.season}` : ''}
                        </span>
                        <button
                            type="button"
                            className={styles.clearBtn}
                            onClick={() => setFilter({ kind: 'all' })}
                        >
                            Show all recipes
                        </button>
                    </>
                ) : (
                    <span>
                        <strong>All {RECIPES.length} recipes</strong>: one for each cut on the beef map, plus
                        pork, poultry, lamb, veal and holiday centerpieces
                    </span>
                )}
            </p>

            <div className={styles.foldControls}>
                <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={() => setOpenSlugs(visible.map(r => r.slug))}
                >
                    Expand all
                </button>
                <button type="button" className={styles.clearBtn} onClick={() => setOpenSlugs([])}>
                    Collapse all
                </button>
            </div>

            <div className={styles.recipes}>
                {visible.map(r => (
                    <RecipeCard
                        key={r.slug}
                        recipe={r}
                        today={today}
                        onPickOccasion={id => setFilter({ kind: 'occasion', id })}
                        open={openSlugsSet.has(r.slug)}
                        onToggle={() => toggleRecipe(r.slug)}
                    />
                ))}
            </div>

            <p className={styles.tempNote}>{TEMPERATURE_NOTE}</p>
        </>
    );
}

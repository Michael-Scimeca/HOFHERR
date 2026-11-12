'use client';

import { useState } from 'react';
import { useCartCount } from '@/context/CartContext';
import { OCCASIONS, PRICES_AS_OF, type MenuPick, type OccasionId, type Recipe } from './recipes';
import { formatEstimate, pickupWindow, planBuy, scaleIngredient } from './scale';
import styles from './page.module.css';

const OCCASION_LABEL = Object.fromEntries(OCCASIONS.map(o => [o.id, o.label])) as Record<OccasionId, string>;
const DEFAULT_SERVINGS = [2, 4, 6, 8];

type Props = {
    recipe: Recipe;
    /** YYYY-MM-DD from the server, so pickup dates match on both sides. */
    today: string;
    onPickOccasion: (id: OccasionId) => void;
    /** Whether the full recipe is showing. Collapsed cards show only the summary line. */
    open: boolean;
    onToggle: () => void;
};

export default function RecipeCard({ recipe: r, today, onPickOccasion, open, onToggle }: Props) {
    const { addItem, openCart, triggerFlyAnimation } = useCartCount();
    const [selectedServings, setSelectedServings] = useState<number | null>(null);
    const [justAdded, setJustAdded] = useState<string | null>(null);

    const servings = selectedServings ?? r.baseServings;
    const options = r.servingOptions ?? DEFAULT_SERVINGS;
    const factor = servings / r.baseServings;
    const plans = r.buy.map(item => planBuy(item, factor));
    const total = plans.reduce((sum, p) => sum + p.cost, 0);
    const pickup = pickupWindow(today, r.leadDays);

    const flash = (key: string, source?: HTMLElement) => {
        if (source) {
            const rect = source.getBoundingClientRect();
            triggerFlyAnimation({ x: rect.left + rect.width / 2 - 40, y: rect.top - 40 });
        }
        setJustAdded(key);
        window.setTimeout(() => setJustAdded(current => (current === key ? null : current)), 2500);
    };

    const handleAddEverything = (e: React.MouseEvent<HTMLButtonElement>) => {
        for (const p of plans) {
            addItem({
                name: p.item.name,
                price: p.item.price,
                qty: p.qty,
                note:
                    p.lb !== null
                        ? `About ${p.lb} lb total for ${r.title} (serves ${servings})`
                        : `For ${r.title} (serves ${servings})`,
            });
        }
        flash('everything', e.currentTarget);
    };

    const handleAddPick = (pick: MenuPick, e: React.MouseEvent<HTMLButtonElement>) => {
        addItem({ name: pick.name, price: pick.price, qty: 1, note: '' });
        flash(pick.name, e.currentTarget);
    };

    const renderPicks = (picks: MenuPick[]) => (
        <ul className={styles.picks}>
            {picks.map(pick => (
                <li key={pick.name} className={styles.pick}>
                    <div className={styles.pickText}>
                        <span className={styles.pickName}>
                            {pick.name} <span className={styles.pickPrice}>{pick.price}</span>
                        </span>
                        <span className={styles.pickWhy}>{pick.why}</span>
                    </div>
                    <button
                        type="button"
                        className={styles.pickBtn}
                        aria-label={`Add ${pick.name} to cart`}
                        onClick={e => handleAddPick(pick, e)}
                    >
                        {justAdded === pick.name ? 'Added' : 'Add'}
                    </button>
                </li>
            ))}
        </ul>
    );

    return (
        <article id={r.slug} className={styles.recipe}>
            <header className={`${styles.recipeHeader} ${open ? '' : styles.recipeHeaderClosed}`}>
                <div className={styles.recipeHeaderText}>
                    <span className={styles.recipeCut}>{r.cut}</span>
                    <h2 className={styles.recipeTitle}>
                        <button
                            type="button"
                            className={styles.recipeToggle}
                            aria-expanded={open}
                            aria-controls={`${r.slug}-body`}
                            onClick={onToggle}
                        >
                            <span>{r.title}</span>
                            <span className={styles.recipeToggleHint}>{open ? 'Hide recipe' : 'Show recipe'}</span>
                        </button>
                    </h2>
                    <p className={styles.perfectFor}>
                        <span>Perfect for</span>
                        {r.perfectFor}
                    </p>
                    {!open && (
                        <p className={styles.closedMeta}>
                            {r.total} · {r.difficulty} · Hands-on {r.handsOn}
                        </p>
                    )}
                    {open && (
                        <>
                    <p className={styles.recipeIntro}>{r.intro}</p>
                    <div className={styles.tags} role="group" aria-label="Occasions for this recipe">
                        {r.occasions.map(id => (
                            <button key={id} type="button" className={styles.tag} onClick={() => onPickOccasion(id)}>
                                {OCCASION_LABEL[id]}
                            </button>
                        ))}
                    </div>
                    <div className={styles.badges}>
                        <span className={styles.badge}>
                            <span className={styles.badgeLabel}>Difficulty</span>
                            {r.difficulty}
                        </span>
                        <span className={styles.badge}>
                            <span className={styles.badgeLabel}>Hands-on</span>
                            {r.handsOn}
                        </span>
                    </div>
                    <dl className={styles.times}>
                        <div>
                            <dt>Serves</dt>
                            <dd>{servings}</dd>
                        </div>
                        <div>
                            <dt>Prep</dt>
                            <dd>{r.prep}</dd>
                        </div>
                        <div>
                            <dt>Cook</dt>
                            <dd>{r.cook}</dd>
                        </div>
                        <div>
                            <dt>Total</dt>
                            <dd>{r.total}</dd>
                        </div>
                    </dl>
                        </>
                    )}
                </div>
                {r.image ? (
                    <div className={open ? styles.photoFrame : styles.photoThumbFrame}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className={open ? styles.photo : styles.photoThumb}
                            src={r.image}
                            alt={`${r.title}, plated`}
                        />
                    </div>
                ) : (
                    open && (
                        <div className={styles.photoPlaceholder} role="img" aria-label="Photo placeholder">
                            <span>Finished-dish photo</span>
                            <small>{r.title}</small>
                        </div>
                    )
                )}
            </header>

            {open && (
            <div id={`${r.slug}-body`} className={styles.recipeBody}>
                <aside className={styles.side}>
                    <section className={styles.products}>
                        <h3 className={styles.sectionLabel}>Hofherr products required</h3>

                        <div className={styles.servingsRow}>
                            <span className={styles.servingsLabel} id={`${r.slug}-servings`}>
                                Servings
                            </span>
                            <div className={styles.servings} role="group" aria-labelledby={`${r.slug}-servings`}>
                                {options.map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        aria-pressed={servings === n}
                                        className={`${styles.servingBtn} ${servings === n ? styles.servingBtnActive : ''}`}
                                        onClick={() => setSelectedServings(n)}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ul className={styles.buyList}>
                            {plans.map(p => (
                                <li key={p.item.name}>
                                    <span>
                                        <strong>{p.item.name}</strong>
                                        <br />
                                        {p.label} <span className={styles.pickPrice}>· {p.item.price}</span>
                                    </span>
                                    <span className={styles.buyCost}>{formatEstimate(p.cost)}</span>
                                </li>
                            ))}
                        </ul>

                        <p className={styles.estimate}>
                            About <strong>{formatEstimate(total)}</strong> ·{' '}
                            <strong>{formatEstimate(total / servings)} a serving</strong>
                        </p>
                        <p className={styles.finePrint}>
                            Estimated from menu prices as of {PRICES_AS_OF}. The final total depends on the weight
                            cut.
                        </p>

                        <p className={styles.pickup}>
                            <span className={styles.badgeLabel}>Pickup timing</span>
                            {pickup.orderToday ? 'Order today' : `Order by ${pickup.orderBy}`} for{' '}
                            {pickup.pickup} pickup.
                        </p>

                        <button type="button" className={styles.orderBtn} onClick={handleAddEverything}>
                            {justAdded === 'everything' ? 'Added to cart' : 'Add everything to cart'}
                        </button>
                        {justAdded === 'everything' && (
                            <button type="button" className={styles.viewCartBtn} onClick={openCart}>
                                View cart
                            </button>
                        )}
                    </section>

                    <section>
                        <h3 className={styles.sectionLabel}>Ingredients for {servings}</h3>
                        <ul className={styles.list}>
                            {plans.map(p => (
                                <li key={p.item.name}>
                                    {p.item.name}, {p.label}
                                </li>
                            ))}
                            {r.ingredients.map(line => (
                                <li key={line}>{scaleIngredient(line, factor)}</li>
                            ))}
                        </ul>
                        {r.extraIngredients && (
                            <>
                                <h4 className={styles.subLabel}>{r.extraIngredients.title}</h4>
                                <ul className={styles.list}>
                                    {r.extraIngredients.items.map(line => (
                                        <li key={line}>{scaleIngredient(line, factor)}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </section>

                    <details className={styles.fold}>
                        <summary className={styles.foldSummary}>Tools needed ({r.tools.length})</summary>
                        <ul className={styles.list}>
                            {r.tools.map(t => (
                                <li key={t}>{t}</li>
                            ))}
                        </ul>
                    </details>
                </aside>

                <div className={styles.stepsCol}>
                    <section>
                        <h3 className={styles.sectionLabel}>Steps</h3>
                        {factor !== 1 && (
                            <p className={styles.scaleNote}>
                                The steps and times are written for {r.baseServings} servings. A larger or smaller
                                cut changes the cooking time, so go by the thermometer.
                            </p>
                        )}
                        <ol className={styles.steps}>
                            {r.steps.map(s => (
                                <li key={s}>{s}</li>
                            ))}
                        </ol>
                        {r.note && <p className={styles.note}>{r.note}</p>}
                    </section>

                    <section className={styles.tip}>
                        <h3 className={styles.sectionLabel}>Butcher&apos;s tip</h3>
                        <p>{r.butcherTip}</p>
                    </section>

                    {r.sides.length > 0 && (
                        <section>
                            <h3 className={styles.sectionLabel}>Complete the meal</h3>
                            {renderPicks(r.sides)}
                        </section>
                    )}

                    {r.upgrades.length > 0 && (
                        <details className={styles.fold}>
                            <summary className={styles.foldSummary}>Upgrade it ({r.upgrades.length})</summary>
                            {renderPicks(r.upgrades)}
                        </details>
                    )}
                </div>
            </div>
            )}
        </article>
    );
}

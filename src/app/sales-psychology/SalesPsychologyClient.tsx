'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PSYCH_CATEGORIES, PSYCH_STUDIES, SITE_BLUEPRINT, type PsychCategory } from './psychologyData';
import styles from './page.module.css';

export default function SalesPsychologyClient() {
    const [activeCategory, setActiveCategory] = useState<PsychCategory>('all');
    const [demoMode, setDemoMode] = useState<'plain' | 'psych'>('psych');
    const [decoyActive, setDecoyActive] = useState(true);
    const [decoyDomain, setDecoyDomain] = useState<'theater' | 'hofherr'>('theater');
    const [blueprintFilter, setBlueprintFilter] = useState<'all' | 'ready' | 'live'>('all');

    const filteredStudies =
        activeCategory === 'all'
            ? PSYCH_STUDIES
            : PSYCH_STUDIES.filter(s => s.category === activeCategory);

    const liveCount = PSYCH_STUDIES.filter(s => s.siteStatus === 'live').length;

    const filteredBlueprint =
        blueprintFilter === 'all'
            ? SITE_BLUEPRINT
            : SITE_BLUEPRINT.filter(item => item.status === blueprintFilter);

    const readyBlueprintCount = SITE_BLUEPRINT.filter(item => item.status === 'ready').length;

    return (
        <>
            {/* ── Interactive Before / After Psychology Lab ── */}
            <section id="psychology-lab" aria-labelledby="psychology-lab-heading" className="section">
                <div className="container">
                    <div className={styles.labHeader}>
                        <div>
                            <h2 id="psychology-lab-heading" className={styles.sectionTitle}>
                                Live Before &amp; After: Same Steak, Different Brain Response
                            </h2>
                            <p className={styles.sectionSub}>
                                Toggle between a standard commodity listing and a psychology-backed Hofherr listing to see how
                                anchoring, sensory provenance, per-serving framing, and social proof eliminate sticker shock.
                            </p>
                        </div>

                        <div className={styles.modeToggle} role="group" aria-label="Compare listing style">
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${demoMode === 'plain' ? styles.modeBtnActive : ''}`}
                                onClick={() => setDemoMode('plain')}
                                aria-pressed={demoMode === 'plain'}
                            >
                                Plain Listing
                            </button>
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${demoMode === 'psych' ? styles.modeBtnActivePsych : ''}`}
                                onClick={() => setDemoMode('psych')}
                                aria-pressed={demoMode === 'psych'}
                            >
                                Psychology-Backed
                            </button>
                        </div>
                    </div>

                    <div className={styles.labGrid}>
                        {/* Mock Product Card */}
                        <div className={`${styles.demoCard} ${demoMode === 'psych' ? styles.demoCardPsych : ''}`}>
                            {demoMode === 'plain' ? (
                                <>
                                    <div className={styles.demoTopRow}>
                                        <h3 className={styles.demoName}>Prime Ribeye Steak</h3>
                                        <span className={styles.demoPricePlain}>$48.99/lb</span>
                                    </div>
                                    <p className={styles.demoDesc}>
                                        USDA Prime ribeye steak. Cut to order. Final weight calculated at pickup.
                                    </p>
                                    <div className={styles.demoFoot}>
                                        <span className={styles.demoMetaMuted}>Triggers supermarket price comparison</span>
                                        <span className={styles.demoBtnPlain}>Add to Cart</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.demoAnchorBar}>
                                        <span>Steakhouse equivalent: ~$68/plate</span>
                                        <strong>Hofherr at home: ~$16/serving</strong>
                                    </div>
                                    <div className={styles.demoTopRow}>
                                        <div>
                                            <h3 className={styles.demoName}>45-Day Dry-Aged Midwest Prime Ribeye</h3>
                                            <div className={styles.demoProofLine}>
                                                ★ Northfield Top Seller · Hand-Trimmed &amp; Tied Free
                                            </div>
                                        </div>
                                        <div className={styles.demoPriceGroup}>
                                            <span className={styles.demoPriceCalm}>48.99 / lb</span>
                                            <span className={styles.demoPriceSub}>Zero water-weight shrinkage</span>
                                        </div>
                                    </div>
                                    <p className={styles.demoDesc}>
                                        Traceable to a named Midwest family farm, aged 45 days on the bone for deep nutty
                                        marbling, and hand-cut to your exact thickness. Includes our free Parcel Sheet sear guide.
                                    </p>
                                    <div className={styles.demoFoot}>
                                        <span className={styles.demoScarcity}>Small-batch Tuesday cut · 6 steaks left today</span>
                                        <span className={styles.demoBtnPsych}>+ Add (1-Tap)</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Active Triggers Breakdown */}
                        <div className={styles.triggerPanel}>
                            <h3 className={styles.triggerTitle}>
                                {demoMode === 'plain' ? 'Why Casual Shoppers Hesitate' : '5 Active Psychological Triggers'}
                            </h3>
                            {demoMode === 'plain' ? (
                                <ul className={styles.triggerList}>
                                    <li className={styles.triggerItemWeak}>
                                        <strong>Wrong Anchor:</strong> Without context, the brain compares $48.99/lb to a $16.99/lb grocery store Choice pack.
                                    </li>
                                    <li className={styles.triggerItemWeak}>
                                        <strong>Zero Sensory Cue:</strong> Plain labels miss the +27% Wansink sensory lift—buyers assume it tastes like regular beef.
                                    </li>
                                    <li className={styles.triggerItemWeak}>
                                        <strong>High Pain of Paying:</strong> Prominent dollar price with no per-serving frame or value explanation triggers hesitation.
                                    </li>
                                    <li className={styles.triggerItemWeak}>
                                        <strong>No Urgency or Proof:</strong> Nothing tells a first-timer why locals drive past three supermarkets for this cut.
                                    </li>
                                </ul>
                            ) : (
                                <ul className={styles.triggerList}>
                                    <li className={styles.triggerItemStrong}>
                                        <strong>Price Anchor (Ariely, 2008):</strong> Anchors against a $68 steakhouse plate instead of supermarket beef, turning $16/serving into a steal.
                                    </li>
                                    <li className={styles.triggerItemStrong}>
                                        <strong>Sensory &amp; Origin Copy (Wansink, 2005):</strong> &ldquo;45-Day Dry-Aged,&rdquo; &ldquo;Midwest family farm,&rdquo; and &ldquo;deep nutty marbling&rdquo; drive +27% lift.
                                    </li>
                                    <li className={styles.triggerItemStrong}>
                                        <strong>Softened Currency + Reciprocity (Cornell / Strohmetz):</strong> Calm price styling + free custom trim &amp; Parcel Sheet sear guide.
                                    </li>
                                    <li className={styles.triggerItemStrong}>
                                        <strong>Honest Scarcity + Social Proof (Cialdini / Worchel):</strong> Small-batch count + Northfield Top Seller removes first-timer doubt.
                                    </li>
                                    <li className={styles.triggerItemStrong}>
                                        <strong>Zero-Modal 1-Tap Add (Baymard, 2024):</strong> Cuts friction right at the moment of peak craving.
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Interactive Movie Theater Popcorn & Hofherr Decoy Simulator ── */}
            <section id="decoy-simulator" aria-labelledby="decoy-simulator-heading" className="section-sm">
                <div className="container">
                    <div className={styles.labHeader}>
                        <div>
                            <h2 id="decoy-simulator-heading" className={styles.sectionTitle}>
                                The Movie Theater Popcorn Trick (Interactive Decoy Simulator)
                            </h2>
                            <p className={styles.sectionSub}>
                                Toggle the &ldquo;useless&rdquo; middle option on and off to see how theaters—and craft
                                butchers—flip the majority of buyers into the highest-margin tier.
                            </p>
                        </div>

                        <div className={styles.decoyControls}>
                            <div className={styles.modeToggle} role="group" aria-label="Decoy example">
                                <button
                                    type="button"
                                    className={`${styles.modeBtn} ${decoyDomain === 'theater' ? styles.modeBtnActive : ''}`}
                                    onClick={() => setDecoyDomain('theater')}
                                >
                                    🍿 Movie Theater
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.modeBtn} ${decoyDomain === 'hofherr' ? styles.modeBtnActivePsych : ''}`}
                                    onClick={() => setDecoyDomain('hofherr')}
                                >
                                    🥩 Hofherr Holiday Box
                                </button>
                            </div>

                            <div className={styles.modeToggle} role="group" aria-label="Toggle decoy tier">
                                <button
                                    type="button"
                                    className={`${styles.modeBtn} ${!decoyActive ? styles.modeBtnActive : ''}`}
                                    onClick={() => setDecoyActive(false)}
                                >
                                    Without Decoy (2 Tiers)
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.modeBtn} ${decoyActive ? styles.modeBtnActivePsych : ''}`}
                                    onClick={() => setDecoyActive(true)}
                                >
                                    With Decoy (3 Tiers)
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.decoyGrid} ${decoyActive ? styles.decoyGridThree : styles.decoyGridTwo}`}>
                        <div className={`${styles.decoyCard} ${!decoyActive ? styles.decoyCardWinner : ''}`}>
                            <div className={styles.decoyCardTop}>
                                <span className={styles.decoyTierLabel}>
                                    {decoyDomain === 'theater' ? 'Small Popcorn' : 'Roast Only'}
                                </span>
                                {!decoyActive && <span className={styles.decoyWinTag}>Most Pick This (~65%)</span>}
                            </div>
                            <div className={styles.decoyPrice}>
                                {decoyDomain === 'theater' ? '$3.00' : '$95'}
                            </div>
                            <p className={styles.decoyDesc}>
                                {decoyDomain === 'theater'
                                    ? 'Standard small bag. Feels like the only sensible choice next to a $7 jump.'
                                    : 'Standalone holiday roast. Shoppers buy sides at the supermarket.'}
                            </p>
                        </div>

                        {decoyActive && (
                            <div className={`${styles.decoyCard} ${styles.decoyCardTrap}`}>
                                <div className={styles.decoyCardTop}>
                                    <span className={styles.decoyTierLabel}>
                                        {decoyDomain === 'theater' ? 'Medium Popcorn' : 'Roast + 2 Sides'}
                                    </span>
                                    <span className={styles.decoyTrapTag}>The Decoy</span>
                                </div>
                                <div className={styles.decoyPrice}>
                                    {decoyDomain === 'theater' ? '$6.50' : '$139'}
                                </div>
                                <p className={styles.decoyDesc}>
                                    {decoyDomain === 'theater'
                                        ? 'Not meant to sell! Its only job is to sit 50¢ below Large so Large feels like free popcorn.'
                                        : 'Sits just $10 below the Full Feast—making the upgrade feel like an obvious no-brainer.'}
                                </p>
                            </div>
                        )}

                        <div className={`${styles.decoyCard} ${decoyActive ? styles.decoyCardWinner : ''}`}>
                            <div className={styles.decoyCardTop}>
                                <span className={styles.decoyTierLabel}>
                                    {decoyDomain === 'theater' ? 'Large Bucket' : 'Full Holiday Feast'}
                                </span>
                                {decoyActive && <span className={styles.decoyWinTag}>Most Pick This (~80%+)</span>}
                            </div>
                            <div className={styles.decoyPrice}>
                                {decoyDomain === 'theater' ? '$7.00' : '$149'}
                            </div>
                            <p className={styles.decoyDesc}>
                                {decoyDomain === 'theater'
                                    ? decoyActive
                                        ? 'Only 50¢ more than Medium for a massive bucket—almost everyone upgrades.'
                                        : 'More than double the Small price ($4 jump)—most people say no.'
                                    : decoyActive
                                        ? 'Only $10 more than Tier 2 for the 3rd side + house gravy + carving guide.'
                                        : 'Feels like a steep $54 jump over Roast Only without the middle anchor.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Peer-Reviewed Studies Library ── */}
            <section id="studies-library" aria-labelledby="studies-library-heading" className="section">
                <div className="container">
                    <div className={styles.libraryHeader}>
                        <div>
                            <h2 id="studies-library-heading" className={styles.sectionTitle}>
                                {PSYCH_STUDIES.length} Peer-Reviewed Studies &amp; Real-World Pricing Classics
                            </h2>
                            <p className={styles.sectionSub}>
                                Every tactic below is backed by published behavioral economics or consumer psychology research—
                                <strong>{liveCount} of {PSYCH_STUDIES.length}</strong> are already live on this site.
                            </p>
                        </div>

                        <div className={styles.filterRow} role="tablist" aria-label="Filter studies by category">
                            {PSYCH_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeCategory === cat.id}
                                    className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterBtnActive : ''}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.studiesGrid}>
                        {filteredStudies.map(study => (
                            <article key={study.id} className={styles.studyCard}>
                                <div className={styles.studyTop}>
                                    <div className={styles.studyMetaRow}>
                                        <span className={styles.studyNum}>{study.number}</span>
                                        <span className={styles.studyCat}>{study.categoryLabel}</span>
                                        <span
                                            className={
                                                study.siteStatus === 'live'
                                                    ? styles.statusLive
                                                    : styles.statusReady
                                            }
                                        >
                                            {study.siteStatus === 'live' ? '● Live on Site' : '○ Ready to Add'}
                                        </span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statNum}>{study.headlineStat}</span>
                                        <span className={styles.statLabel}>{study.statLabel}</span>
                                    </div>
                                </div>

                                <h3 className={styles.studyPrinciple}>{study.principle}</h3>

                                <div className={styles.citationBlock}>
                                    <div className={styles.citationTitle}>{study.studyTitle}</div>
                                    <div className={styles.citationAuthors}>
                                        {study.researchers} · <em>{study.publication}</em> ({study.year})
                                    </div>
                                </div>

                                <p className={styles.studyFinding}>{study.finding}</p>

                                <div className={styles.hofherrBox}>
                                    <span className={styles.hofherrLabel}>Hofherr Meat Co. Playbook</span>
                                    <p className={styles.hofherrText}>{study.hofherrPlay}</p>
                                    <span className={styles.hofherrStatusNote}>{study.siteNote}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Site-Wide Implementation Blueprint ── */}
            <section id="site-blueprint" aria-labelledby="site-blueprint-heading" className="section">
                <div className="container">
                    <div className={styles.labHeader}>
                        <div>
                            <h2 id="site-blueprint-heading" className={styles.sectionTitle}>
                                How to Apply All {PSYCH_STUDIES.length} Studies Across Hofherr Meat Co.
                            </h2>
                            <p className={styles.sectionSub}>
                                Page-by-page rollout map pairing live behavioral triggers with{' '}
                                <strong>{readyBlueprintCount} high-leverage upgrades</strong> ready to ship across the
                                storefront, catering calculator, and Depot menu.
                            </p>
                        </div>

                        <div className={styles.modeToggle} role="group" aria-label="Filter blueprint by status">
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${blueprintFilter === 'all' ? styles.modeBtnActive : ''}`}
                                onClick={() => setBlueprintFilter('all')}
                                aria-pressed={blueprintFilter === 'all'}
                            >
                                All ({SITE_BLUEPRINT.length})
                            </button>
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${blueprintFilter === 'ready' ? styles.modeBtnActivePsych : ''}`}
                                onClick={() => setBlueprintFilter('ready')}
                                aria-pressed={blueprintFilter === 'ready'}
                            >
                                Ready to Ship ({readyBlueprintCount})
                            </button>
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${blueprintFilter === 'live' ? styles.modeBtnActive : ''}`}
                                onClick={() => setBlueprintFilter('live')}
                                aria-pressed={blueprintFilter === 'live'}
                            >
                                Live ({SITE_BLUEPRINT.length - readyBlueprintCount})
                            </button>
                        </div>
                    </div>

                    <div className={styles.blueprintGrid}>
                        {filteredBlueprint.map(item => (
                            <article key={item.id} className={styles.blueprintCard}>
                                <div className={styles.blueprintTop}>
                                    <div className={styles.studyMetaRow}>
                                        <span className={styles.blueprintRoute}>{item.route}</span>
                                        <span
                                            className={
                                                item.status === 'live' ? styles.statusLive : styles.statusReady
                                            }
                                        >
                                            {item.status === 'live' ? '● Live on Site' : '○ Ready to Ship'}
                                        </span>
                                        {item.impact === 'high' && (
                                            <span className={styles.impactTag}>High Impact</span>
                                        )}
                                    </div>
                                    <Link href={item.route} className={styles.blueprintLink}>
                                        {item.routeLabel} →
                                    </Link>
                                </div>

                                <h3 className={styles.blueprintTitle}>{item.tactic}</h3>
                                <p className={styles.blueprintRefs}>{item.studyRefs}</p>
                                <p className={styles.blueprintDetail}>{item.detail}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Bottom Action Strip ── */}
            <section id="apply-playbook" aria-labelledby="apply-playbook-heading" className="section-sm">
                <div className="container">
                    <div className={styles.ctaStrip}>
                        <div>
                            <h2 id="apply-playbook-heading" className={styles.ctaTitle}>
                                See These Principles Live in the Storefront
                            </h2>
                            <p className={styles.ctaText}>
                                Test the 1-tap inline cart, fixed right-side order rail, curated bundles, and two-location
                                color coding on the live ordering flow.
                            </p>
                        </div>
                        <div className={styles.ctaActions}>
                            <Link href="/online-orders" className="btn-hit">
                                <span className="btn btn-primary">Open Online Orders →</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}


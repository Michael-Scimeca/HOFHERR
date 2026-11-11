'use client';

import React, { useState } from 'react';
import styles from './ChicagoLockupsSection.module.css';

interface LockupOption {
    id: string;
    title: string;
    text: string;
    role: string;
    bestFor: string;
    keyAssociation: string;
    isTopPick?: boolean;
    isMottoPair?: boolean;
    stampTop: string;
    stampMid: string;
    stampBot: string;
}

const CHICAGO_LOCKUPS: LockupOption[] = [
    {
        id: 'top-pick',
        title: 'Top Recommendation',
        text: 'Born in the Stockyards. Cut for the North Shore.',
        role: 'Narrative Flagship Lockup',
        bestFor: 'Butcher Parcel Ribbons, Exterior Transom Signage & Website Hero Kicker',
        keyAssociation: 'Ties together Sean’s 1903 South Side roots with your Northfield and Winnetka locations in seven words.',
        isTopPick: true,
        stampTop: '• BORN IN THE STOCKYARDS •',
        stampMid: 'CUT FOR NORTH SHORE',
        stampBot: 'HOFHERR MEAT CO. · NORTHFIELD & WINNETKA',
    },
    {
        id: 'motto-pair',
        title: 'Universal Lockup',
        text: 'Chicago Butchery. No Compromise.',
        role: 'Motto Companion Lockup',
        bestFor: 'Counter Stickers, Delivery Boxes & Merchandising Tags',
        keyAssociation: 'Punchy, authentic pairing alongside the founding store motto: "Quality Meats. No Compromise."',
        isMottoPair: true,
        stampTop: '• CHICAGO BUTCHERY •',
        stampMid: 'NO COMPROMISE',
        stampBot: 'HOFHERR MEAT CO. · CRAFT BUTCHER',
    },
    {
        id: 'est-1903',
        title: 'Lockup 01',
        text: 'Chicago Butchery · Est. 1903',
        role: 'Heritage Stamp Lockup',
        bestFor: 'Turned-Wood Rocker Stamps, Parcel Tie Tags & Wax Seal Badges',
        keyAssociation: 'Emphasizes four generations of craft butchery heritage tracing back to the South Side wholesale origins.',
        stampTop: '• HOFHERR MEAT CO. •',
        stampMid: 'CHICAGO BUTCHERY',
        stampBot: '• EST. 1903 · NORTHFIELD & WINNETKA •',
    },
    {
        id: 'midwest-raised',
        title: 'Lockup 02',
        text: 'Chicago Made · Midwest Raised',
        role: 'Provenance & Sourcing Lockup',
        bestFor: 'Deli Scale Labels, Local Farm Source Signage & Dry-Aging Placards',
        keyAssociation: 'Highlights local Midwest family farm partnerships (IL, WI, IA) cut and smoked in-house daily.',
        stampTop: '• MIDWEST RAISED •',
        stampMid: 'CHICAGO MADE',
        stampBot: 'HOFHERR MEAT CO. · 100% TRACEABLE',
    },
    {
        id: 'chicago-heritage',
        title: 'Lockup 03',
        text: 'Craft Butchery. Chicago Heritage.',
        role: 'Social & Digital Bio Lockup',
        bestFor: 'Instagram / Facebook / Yelp Bios, Email Signatures & App Headers',
        keyAssociation: 'Elevated culinary authority meeting authentic 120+ year North Shore butcher tradition.',
        stampTop: '• CRAFT BUTCHERY •',
        stampMid: 'CHICAGO HERITAGE',
        stampBot: 'HOFHERR MEAT CO. · NORTH SHORE, IL',
    },
    {
        id: 'chicago-original',
        title: 'Lockup 04',
        text: 'A True Chicago Original.',
        role: 'Storefront Decal & Signage Lockup',
        bestFor: 'Gold-Leaf Window Decals, Sidewalk A-Frames & Gift Card Presentation Sleeves',
        keyAssociation: 'Bold North Shore identity declaring an authentic craft butchery impossible to replicate in supermarkets.',
        stampTop: '• A TRUE CHICAGO ORIGINAL •',
        stampMid: 'HAND CUT DAILY',
        stampBot: 'HOFHERR MEAT CO. · 300 HAPP RD & 754 ELM ST',
    },
];

type MediumType = 'stamp' | 'bio' | 'decal' | 'tape';

export default function ChicagoLockupsSection() {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [activeMedium, setActiveMedium] = useState<MediumType>('stamp');
    const [selectedLockupIdx, setSelectedLockupIdx] = useState<number>(0);

    const activeLockup = CHICAGO_LOCKUPS[selectedLockupIdx];

    const copyText = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            // Fallback
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    return (
        <section id="chicago-lockups" aria-labelledby="chicago-lockups-heading" className="section">
            <div className={`container ${styles.stack}`}>
                {/* Header */}
                <header className={styles.header}>
                    <span className={styles.kicker}>
                        Brand Identity System <span className={styles.kickerDot}>·</span> 4. Short Lockups
                    </span>
                    <h2 id="chicago-lockups-heading" className={styles.sectionTitle}>
                        Chicago Butchery <em>Tagline System &amp; Lockups</em>
                    </h2>
                    <p className={styles.sectionDesc}>
                        Authentic heritage lockups engineered specifically for hand-pressed rubber stamps, social media profiles (@hofherrmeatco),
                        gold-leaf storefront signage, and custom butcher wrap tape across Northfield and Winnetka.
                    </p>
                </header>

                {/* Top Recommendation Banner */}
                <article className={styles.topPickCard}>
                    <div className={styles.cardHeaderRow}>
                        <span className={styles.pickBadge}>★ Top Recommendation</span>
                        <span className={styles.lockupRoleTag}>{CHICAGO_LOCKUPS[0].role}</span>
                    </div>

                    <h3 className={styles.headlineLockup}>
                        &ldquo;Born in the Stockyards. <em>Cut for the North Shore.</em>&rdquo;
                    </h3>

                    <div className={styles.rationaleBox}>
                        <span className={styles.rationaleIcon}>🥩</span>
                        <span>{CHICAGO_LOCKUPS[0].keyAssociation}</span>
                    </div>

                    <div className={styles.actionsRow}>
                        <button
                            type="button"
                            onClick={() => copyText(CHICAGO_LOCKUPS[0].text, 'top-pick')}
                            className={`${styles.copyBtn} ${copiedId === 'top-pick' ? styles.copyBtnSuccess : ''}`}
                        >
                            {copiedId === 'top-pick' ? '✓ Copied to Clipboard' : 'Copy Lockup'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedLockupIdx(0);
                                const el = document.getElementById('chicago-simulator');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={styles.testInSimulatorBtn}
                        >
                            Preview on Mediums ↓
                        </button>
                    </div>
                </article>

                {/* Universal Motto Companion */}
                <article className={styles.universalMottoCard}>
                    <div className={styles.mottoLeft}>
                        <span className={styles.mottoCategory}>Universal Lockup · Motto Companion</span>
                        <h3 className={styles.mottoLockup}>
                            &ldquo;Chicago Butchery. No Compromise.&rdquo;
                        </h3>
                        <p className={styles.mottoDetail}>
                            {CHICAGO_LOCKUPS[1].keyAssociation}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => copyText(CHICAGO_LOCKUPS[1].text, 'motto-pair')}
                        className={`${styles.copyBtn} ${copiedId === 'motto-pair' ? styles.copyBtnSuccess : ''}`}
                    >
                        {copiedId === 'motto-pair' ? '✓ Copied' : 'Copy Lockup'}
                    </button>
                </article>

                {/* 4 Short Lockups Grid */}
                <div className={styles.shortLockupsSection}>
                    <div className={styles.shortLockupsTitleGroup}>
                        <h3 className={styles.shortLockupsTitle}>4. Short Lockups</h3>
                        <p className={styles.shortLockupsSub}>
                            Ideal for Turned-Wood Rubber Stamps, Social Bios &amp; In-Store Signage
                        </p>
                    </div>

                    <div className={styles.lockupsGrid}>
                        {CHICAGO_LOCKUPS.slice(2).map((item, idx) => (
                            <article key={item.id} className={styles.lockupCard}>
                                <div className={styles.lockupCardHeader}>
                                    <span className={styles.lockupIndex}>0{idx + 1}</span>
                                    <span className={styles.lockupUseBadge}>{item.role.replace(' Lockup', '')}</span>
                                </div>
                                <h4 className={styles.lockupMainText}>
                                    &ldquo;{item.text}&rdquo;
                                </h4>
                                <p className={styles.lockupApplicationNote}>
                                    <strong>Best For:</strong> {item.bestFor}
                                </p>
                                <div className={styles.lockupFooter}>
                                    <button
                                        type="button"
                                        onClick={() => copyText(item.text, item.id)}
                                        className={styles.quickCopyBtn}
                                    >
                                        {copiedId === item.id ? '✓ Copied' : 'Copy'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedLockupIdx(idx + 2);
                                            const el = document.getElementById('chicago-simulator');
                                            el?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={styles.quickSelectBtn}
                                    >
                                        Test in Simulator →
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Interactive Multi-Medium Live Tester */}
                <div id="chicago-simulator" className={styles.simulatorSection}>
                    <div className={styles.simulatorHeader}>
                        <div className={styles.simulatorTitleGroup}>
                            <h3 className={styles.simulatorTitle}>Live Multi-Medium Simulator</h3>
                            <p className={styles.simulatorSub}>
                                Switch between lockups and see how each renders across authentic physical and digital brand touchpoints.
                            </p>
                        </div>

                        {/* Medium Tabs */}
                        <div className={styles.mediumTabs}>
                            <button
                                type="button"
                                onClick={() => setActiveMedium('stamp')}
                                className={`${styles.mediumTab} ${activeMedium === 'stamp' ? styles.mediumTabActive : ''}`}
                            >
                                🖂 Rubber Stamp
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveMedium('bio')}
                                className={`${styles.mediumTab} ${activeMedium === 'bio' ? styles.mediumTabActive : ''}`}
                            >
                                📱 Social Bio
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveMedium('decal')}
                                className={`${styles.mediumTab} ${activeMedium === 'decal' ? styles.mediumTabActive : ''}`}
                            >
                                🏪 Window Decal
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveMedium('tape')}
                                className={`${styles.mediumTab} ${activeMedium === 'tape' ? styles.mediumTabActive : ''}`}
                            >
                                📦 Butcher Tape
                            </button>
                        </div>
                    </div>

                    {/* Lockup Selection Chips */}
                    <div className={styles.lockupSelectorBar}>
                        <span className={styles.selectorLabel}>Active Lockup:</span>
                        <div className={styles.lockupChipRow}>
                            {CHICAGO_LOCKUPS.map((l, i) => (
                                <button
                                    key={l.id}
                                    type="button"
                                    onClick={() => setSelectedLockupIdx(i)}
                                    className={`${styles.lockupChip} ${selectedLockupIdx === i ? styles.lockupChipActive : ''}`}
                                >
                                    {l.isTopPick ? '★ ' : ''}&ldquo;{l.text}&rdquo;
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Canvas Stage */}
                    <div className={styles.stageCanvas}>
                        {activeMedium === 'stamp' && (
                            <div className={styles.stampStage}>
                                <div className={styles.stampImpression}>
                                    <span className={styles.stampTopLine}>{activeLockup.stampTop}</span>
                                    <span className={styles.stampMidText}>{activeLockup.stampMid}</span>
                                    <span className={styles.stampBotLine}>{activeLockup.stampBot}</span>
                                </div>
                            </div>
                        )}

                        {activeMedium === 'bio' && (
                            <div className={styles.igBioStage}>
                                <div className={styles.igBioCard}>
                                    <div className={styles.igHeaderRow}>
                                        <div className={styles.igAvatarMini}>🥩</div>
                                        <div className={styles.igHandleMeta}>
                                            <span className={styles.igHandleText}>hofherrmeatco ✓</span>
                                            <span className={styles.igCategoryText}>Butcher Shop · North Shore, IL</span>
                                        </div>
                                    </div>
                                    <div className={styles.igBioContent}>
                                        <span className={styles.igHighlightTagline}>&ldquo;{activeLockup.text}&rdquo;</span>
                                        <br />
                                        🔥 Neighborhood craft butcher · Dry-aged beef &amp; whole-hog BBQ
                                        <br />
                                        📍 300 Happ Rd, Northfield + The Depot, Winnetka
                                        <br />
                                        🔗 hofherrmeatco.com/online-orders
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyText(`Hofherr Meat Co. · Butcher & Smokehouse\n"${activeLockup.text}"\n🔥 Neighborhood craft butcher · Dry-aged beef & whole-hog BBQ\n📍 300 Happ Rd, Northfield + The Depot, Winnetka\n🔗 hofherrmeatco.com/online-orders`, 'ig-bio-full')}
                                        className={styles.quickCopyBtn}
                                    >
                                        {copiedId === 'ig-bio-full' ? '✓ Copied Bio For Instagram' : 'Copy Formatted IG Bio'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeMedium === 'decal' && (
                            <div className={styles.windowDecalStage}>
                                <div className={styles.glassDecalFrame}>
                                    <span className={styles.decalHeaderKicker}>HOFHERR MEAT CO.</span>
                                    <h4 className={styles.decalGoldText}>{activeLockup.text}</h4>
                                    <span className={styles.decalSubText}>300 HAPP RD, NORTHFIELD · 754 ELM ST, WINNETKA</span>
                                </div>
                            </div>
                        )}

                        {activeMedium === 'tape' && (
                            <div className={styles.tapeStage}>
                                <div className={styles.tapeStrip}>
                                    <span className={styles.tapeRepeatText}>
                                        <span className={styles.tapeIcon}>🥩</span> {activeLockup.text}
                                    </span>
                                    <span className={styles.tapeRepeatText}>
                                        <span className={styles.tapeIcon}>🥩</span> {activeLockup.text}
                                    </span>
                                    <span className={styles.tapeRepeatText}>
                                        <span className={styles.tapeIcon}>🥩</span> {activeLockup.text}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

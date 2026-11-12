'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Process.module.css';

type LayoutId = 'cards' | 'strip' | 'editorial' | 'bento' | 'ledger';
type ImageSetId = 'butcher' | 'scenes' | 'flint';

type Step = {
    num: string;
    tag: string;
    title: string;
    desc: ReactNode;
    images: Record<ImageSetId, string>;
    alt: string;
};

const LAYOUT_OPTIONS: { id: LayoutId; label: string }[] = [
    { id: 'cards', label: '1. 4-Card Row' },
    { id: 'strip', label: '2. Open Embers Strip (Borderless)' },
    { id: 'editorial', label: '3. Editorial Story Cards (16:9)' },
    { id: 'bento', label: '4. Split Hero + 2×2 Bento' },
    { id: 'ledger', label: '5. Butcher Ticket Ledger' },
];

const IMAGE_SET_OPTIONS: { id: ImageSetId; label: string }[] = [
    { id: 'butcher', label: '🎨 Nano Banana Woodcut Icons' },
    { id: 'scenes', label: '🖼️ Nano Banana Editorial Scenes' },
    { id: 'flint', label: '🔥 Flint & Flame Icons' },
];

const STEPS: Step[] = [
    {
        num: '01',
        tag: 'STEP ONE · THE CASE',
        title: 'Choose Your Items',
        desc: (
            <>
                Browse all cuts, prepared foods, soups, and specials. Add exactly what you want to your cart.{' '}
                <Link href="/online-orders" className={styles.inlineLink}>
                    Order Online
                </Link>
            </>
        ),
        images: {
            butcher: '/assets/process/craft-butcher-step-cleaver.png',
            scenes: '/assets/process/editorial-scene-browse-case.jpg',
            flint: '/assets/process/flint-flame-step-cart.png',
        },
        alt: 'Butcher chopping block with carbon-steel cleaver and bone-in ribeye steak',
    },
    {
        num: '02',
        tag: 'STEP TWO · THE CLOCK',
        title: 'Pick a Pickup Time',
        desc: 'Select your preferred date and time window from available pickup slots at the shop.',
        images: {
            butcher: '/assets/process/craft-butcher-step-clock.png',
            scenes: '/assets/process/editorial-scene-reserve-window.jpg',
            flint: '/assets/process/flint-flame-step-calendar.png',
        },
        alt: 'Vintage brass butcher shop wall clock and stamped pickup ticket #17',
    },
    {
        num: '03',
        tag: 'STEP THREE · THE SCALE',
        title: 'Pay Online or at Pickup',
        desc: (
            <>
                Checkout with Visa, Apple Pay, Google Pay, PayPal, or{' '}
                <Link href="/gift-cards" className={styles.inlineLink}>
                    a gift card
                </Link>{' '}
                — or choose to pay at the store when you pick up.
            </>
        ),
        images: {
            butcher: '/assets/process/craft-butcher-step-scale.png',
            scenes: '/assets/process/editorial-scene-checkout-counter.jpg',
            flint: '/assets/process/flint-flame-step-payment.png',
        },
        alt: 'Antique brass butcher counter scale and contactless payment card',
    },
    {
        num: '04',
        tag: 'STEP FOUR · THE PARCEL',
        title: 'Pick Up at the Shop',
        desc: (
            <>
                Pull up curbside or walk in. Your order is packed and ready — no waiting around.{' '}
                <a
                    href="mailto:butcher@hofherrmeatco.com?subject=Pick up at the store"
                    className={styles.inlineLink}
                >
                    Questions about pick up at store
                </a>
            </>
        ),
        images: {
            butcher: '/assets/process/craft-butcher-step-parcel.png',
            scenes: '/assets/process/editorial-scene-curbside-pickup.jpg',
            flint: '/assets/process/flint-flame-step-pickup-car.png',
        },
        alt: 'Hands in butcher apron presenting twine-tied kraft paper butcher parcel with red wax seal',
    },
];

export default function Process() {
    const [layout, setLayout] = useState<LayoutId>('cards');
    const [imageSet, setImageSet] = useState<ImageSetId>('butcher');

    const handleSelectLayout = (nextLayout: LayoutId) => {
        setLayout(nextLayout);
        if (nextLayout === 'editorial') {
            setImageSet('scenes');
        } else if (imageSet === 'scenes') {
            setImageSet('butcher');
        }
    };

    return (
        <section id="how-it-works" aria-labelledby="how-it-works-heading" className={`section ${styles.section}`}>
            <div className="container">
                {/* ── Interactive Layout & Nano Banana Artwork Switcher Bar ── */}
                <div className={styles.switcherBar} role="region" aria-label="How It Works Layout Preview Controls">
                    <div className={styles.switcherGroup}>
                        <span className={styles.switcherLabel}>LAYOUT:</span>
                        <div className={styles.switcherPills}>
                            {LAYOUT_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    className={`${styles.switcherPill} ${layout === opt.id ? styles.switcherPillActive : ''}`}
                                    onClick={() => handleSelectLayout(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.switcherGroup}>
                        <span className={styles.switcherLabel}>NANO BANANA ART:</span>
                        <div className={styles.switcherPills}>
                            {IMAGE_SET_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    className={`${styles.switcherPill} ${imageSet === opt.id ? styles.switcherPillGold : ''}`}
                                    onClick={() => setImageSet(opt.id)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Standard Header (used by Layouts 1, 2, 3, 5) ── */}
                {layout !== 'bento' && (
                    <div className={styles.header}>
                        <h2 id="how-it-works-heading" className={styles.title}>
                            How It <em>Works</em>
                        </h2>
                        <p className={styles.subtitle}>
                            Order premium cuts online in four simple steps. Ready for pickup the same day.
                        </p>
                        <div className={styles.ctaWrap}>
                            <Link href="/online-orders" className={`btn btn-primary ${styles.ctaBtn}`}>
                                Order Online
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── LAYOUT 1: 4-Column Dark Card Row with Pointing Hand Connectors ── */}
                {layout === 'cards' && (
                    <div className={styles.grid}>
                        {STEPS.map((step, i) => (
                            <div key={step.num} className={styles.step}>
                                {i < STEPS.length - 1 && (
                                    <div className={styles.connector} aria-hidden="true">
                                        <div className={styles.connectorBadge}>
                                            <Image
                                                src="/assets/process/flint-flame-pointing-hand.png"
                                                alt=""
                                                width={64}
                                                height={64}
                                                className={styles.connectorHand}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className={styles.card}>
                                    <div className={styles.stepNum}>{step.num}</div>
                                    <div className={imageSet === 'scenes' ? styles.sceneThumbWrap : styles.iconWrap}>
                                        <Image
                                            src={step.images[imageSet]}
                                            alt={step.alt}
                                            width={imageSet === 'scenes' ? 360 : 168}
                                            height={imageSet === 'scenes' ? 202 : 168}
                                            className={imageSet === 'scenes' ? styles.sceneThumb : styles.icon}
                                        />
                                    </div>
                                    <h3 className={styles.cardTitle}>{step.title}</h3>
                                    <p className={styles.cardDesc}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── LAYOUT 2: Open Embers Strip (Borderless Floating Artwork + Track) ── */}
                {layout === 'strip' && (
                    <div className={styles.stripLayout}>
                        <div className={styles.stripTrackLine} aria-hidden="true" />
                        {STEPS.map((step, i) => (
                            <div key={step.num} className={styles.stripItem}>
                                <div className={styles.stripNode}>{step.num}</div>
                                <div className={styles.stripVisualRow}>
                                    <div className={imageSet === 'scenes' ? styles.stripSceneFrame : styles.stripIconFrame}>
                                        <Image
                                            src={step.images[imageSet]}
                                            alt={step.alt}
                                            width={imageSet === 'scenes' ? 360 : 196}
                                            height={imageSet === 'scenes' ? 202 : 196}
                                            className={imageSet === 'scenes' ? styles.sceneThumb : styles.icon}
                                        />
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={styles.stripHand} aria-hidden="true">
                                            <Image
                                                src="/assets/process/flint-flame-pointing-hand.png"
                                                alt=""
                                                width={56}
                                                height={56}
                                                className={styles.connectorHand}
                                            />
                                        </div>
                                    )}
                                </div>
                                <h3 className={styles.stripTitle}>{step.title}</h3>
                                <p className={styles.cardDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── LAYOUT 3: Editorial Story Cards (Wide 16:9 Lithograph Banner Cards) ── */}
                {layout === 'editorial' && (
                    <div className={styles.editorialGrid}>
                        {STEPS.map(step => (
                            <article key={step.num} className={styles.editorialCard}>
                                <div className={styles.editorialMedia}>
                                    <Image
                                        src={step.images[imageSet]}
                                        alt={step.alt}
                                        width={560}
                                        height={315}
                                        className={imageSet === 'scenes' ? styles.editorialImgCover : styles.editorialImgContain}
                                    />
                                    <span className={styles.editorialStepPill}>STEP {step.num}</span>
                                </div>
                                <div className={styles.editorialBody}>
                                    <h3 className={styles.cardTitle}>{step.title}</h3>
                                    <p className={styles.cardDesc}>{step.desc}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* ── LAYOUT 4: Asymmetric Split Left Hero + Right 2×2 Bento Matrix ── */}
                {layout === 'bento' && (
                    <div className={styles.bentoLayout}>
                        <div className={styles.bentoAside}>
                            <h2 id="how-it-works-heading" className={styles.bentoHeading}>
                                How It <em>Works</em>
                            </h2>
                            <p className={styles.bentoLead}>
                                Skip the line without skipping the craft. Every online order is hand-cut to your exact thickness and wrapped fresh in brown butcher paper the day you pick it up.
                            </p>
                            <div className={styles.bentoPerks}>
                                <div className={styles.bentoPerkItem}>
                                    <span className={styles.bentoPerkDot} />
                                    <span>Same-day pickup at Northfield &amp; Winnetka</span>
                                </div>
                                <div className={styles.bentoPerkItem}>
                                    <span className={styles.bentoPerkDot} />
                                    <span>Custom thickness &amp; trim notes on every cut</span>
                                </div>
                                <div className={styles.bentoPerkItem}>
                                    <span className={styles.bentoPerkDot} />
                                    <span>Pay online or settle at the counter on pickup</span>
                                </div>
                            </div>
                            <div className={styles.bentoActions}>
                                <Link href="/online-orders" className={`btn btn-primary ${styles.ctaBtn}`}>
                                    Order Online
                                </Link>
                            </div>
                        </div>

                        <div className={styles.bentoMatrix}>
                            {STEPS.map(step => (
                                <div key={step.num} className={styles.bentoCell}>
                                    <div className={styles.bentoCellTop}>
                                        <span className={styles.bentoCellNum}>{step.num}</span>
                                        <div className={imageSet === 'scenes' ? styles.bentoSceneWrap : styles.bentoArtWrap}>
                                            <Image
                                                src={step.images[imageSet]}
                                                alt={step.alt}
                                                width={imageSet === 'scenes' ? 240 : 120}
                                                height={imageSet === 'scenes' ? 135 : 120}
                                                className={imageSet === 'scenes' ? styles.sceneThumb : styles.icon}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.bentoCellCopy}>
                                        <h3 className={styles.cardTitle}>{step.title}</h3>
                                        <p className={styles.cardDesc}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── LAYOUT 5: Horizontal Butcher Ticket Ledger (2×2 Ticket Strips) ── */}
                {layout === 'ledger' && (
                    <div className={styles.ledgerGrid}>
                        {STEPS.map(step => (
                            <div key={step.num} className={styles.ledgerRow}>
                                <div className={styles.ledgerStub}>
                                    <span className={styles.ledgerStubLabel}>STEP</span>
                                    <span className={styles.ledgerStubNum}>{step.num}</span>
                                </div>
                                <div className={imageSet === 'scenes' ? styles.ledgerSceneWrap : styles.ledgerArtWrap}>
                                    <Image
                                        src={step.images[imageSet]}
                                        alt={step.alt}
                                        width={imageSet === 'scenes' ? 220 : 128}
                                        height={imageSet === 'scenes' ? 124 : 128}
                                        className={imageSet === 'scenes' ? styles.sceneThumb : styles.icon}
                                    />
                                </div>
                                <div className={styles.ledgerCopy}>
                                    <span className={styles.ledgerMeta}>{step.tag}</span>
                                    <h3 className={styles.ledgerTitle}>{step.title}</h3>
                                    <p className={styles.cardDesc}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

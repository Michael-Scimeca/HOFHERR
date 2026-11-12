'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './Process.module.css';

type LayoutId = 'cards' | 'strip' | 'editorial' | 'bento' | 'ledger';
type ImageSetId = 'flint' | 'butcher' | 'iron' | 'seal' | 'neon' | 'kraft' | 'brass' | 'scenes';

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
    { id: 'flint', label: '1. 🔥 Flint & Flame' },
    { id: 'iron', label: '2. ⚒️ Cast-Iron & Embers' },
    { id: 'seal', label: '3. 🏵️ Crimson & Gold Wax Seal' },
    { id: 'neon', label: '4. ⚡ Smokehouse Neon' },
    { id: 'kraft', label: '5. 📜 Kraft Paper Linocut' },
    { id: 'brass', label: '6. 🏅 3D Brass & Enamel Pin' },
    { id: 'butcher', label: '🪵 Woodcut Etchings' },
    { id: 'scenes', label: '🖼️ Editorial Scenes' },
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
            flint: '/assets/process/flint-flame-step-cart.png',
            butcher: '/assets/process/craft-butcher-step-cleaver.png',
            iron: '/assets/process/icon-style-iron-cart.png',
            seal: '/assets/process/icon-style-seal-cart.png',
            neon: '/assets/process/icon-style-neon-cart.png',
            kraft: '/assets/process/icon-style-kraft-cart.png',
            brass: '/assets/process/icon-style-brass-cart.png',
            scenes: '/assets/process/editorial-scene-browse-case.jpg',
        },
        alt: 'Butcher shopping cart with bone-in ribeye steak and twine-wrapped butcher parcel',
    },
    {
        num: '02',
        tag: 'STEP TWO · THE CLOCK',
        title: 'Pick a Pickup Time',
        desc: 'Select your preferred date and time window from available pickup slots at the shop.',
        images: {
            flint: '/assets/process/flint-flame-step-calendar.png',
            butcher: '/assets/process/craft-butcher-step-clock.png',
            iron: '/assets/process/icon-style-iron-calendar.png',
            seal: '/assets/process/icon-style-seal-calendar.png',
            neon: '/assets/process/icon-style-neon-calendar.png',
            kraft: '/assets/process/icon-style-kraft-calendar.png',
            brass: '/assets/process/icon-style-brass-calendar.png',
            scenes: '/assets/process/editorial-scene-reserve-window.jpg',
        },
        alt: 'Butcher shop pickup calendar showing day 17 and clock dial',
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
            flint: '/assets/process/flint-flame-step-payment.png',
            butcher: '/assets/process/craft-butcher-step-scale.png',
            iron: '/assets/process/icon-style-iron-payment.png',
            seal: '/assets/process/icon-style-seal-payment.png',
            neon: '/assets/process/icon-style-neon-payment.png',
            kraft: '/assets/process/icon-style-kraft-payment.png',
            brass: '/assets/process/icon-style-brass-payment.png',
            scenes: '/assets/process/editorial-scene-checkout-counter.jpg',
        },
        alt: 'Contactless payment and gift card with steer emblem and flames',
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
            flint: '/assets/process/flint-flame-step-pickup-car.png',
            butcher: '/assets/process/craft-butcher-step-parcel.png',
            iron: '/assets/process/icon-style-iron-pickup.png',
            seal: '/assets/process/icon-style-seal-pickup.png',
            neon: '/assets/process/icon-style-neon-pickup.png',
            kraft: '/assets/process/icon-style-kraft-pickup.png',
            brass: '/assets/process/icon-style-brass-pickup.png',
            scenes: '/assets/process/editorial-scene-curbside-pickup.jpg',
        },
        alt: 'Vintage 1950s butcher delivery pickup truck with flames',
    },
];

export default function Process() {
    const [layout, setLayout] = useState<LayoutId>('strip');
    const [imageSet, setImageSet] = useState<ImageSetId>('iron');

    const handleSelectLayout = (nextLayout: LayoutId) => {
        setLayout(nextLayout);
        if (nextLayout === 'editorial') {
            setImageSet('scenes');
        } else if (imageSet === 'scenes') {
            setImageSet('iron');
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
                                <FireBorder active={true} radius={8} />
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
                                    <FireBorder active={true} radius={8} />
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

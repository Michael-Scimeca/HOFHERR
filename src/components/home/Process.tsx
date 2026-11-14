'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import PointingHandLottie from './PointingHandLottie';
import styles from './Process.module.css';

type Step = {
    num: string;
    title: string;
    desc: ReactNode;
    image: string;
    alt: string;
};

const STEPS: Step[] = [
    {
        num: '01',
        title: 'Choose Your Items',
        desc: (
            <>
                Browse all cuts, prepared foods, soups, and specials. Add exactly what you want to your cart.{' '}
                <Link href="/online-orders" className={styles.inlineLink}>
                    Order Online
                </Link>
            </>
        ),
        image: '/assets/process/flint-flame-step-pick-items.png',
        alt: 'Online butcher menu showing beef, pork, and chicken categories with a hand clicking add on a steak item',
    },
    {
        num: '02',
        title: 'Pick a Pickup Time',
        desc: 'Select your preferred date and time window from available pickup slots at the shop.',
        image: '/assets/process/flint-flame-step-pickup-slots.png',
        alt: 'Pickup date and time slot selector showing Saturday 14 and 10:00 AM selected',
    },
    {
        num: '03',
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
        image: '/assets/process/flint-flame-step-payment.png',
        alt: 'Contactless payment and gift card with steer emblem and flames',
    },
    {
        num: '04',
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
        image: '/assets/process/flint-flame-step-store.svg',
        alt: 'Hofherr butcher shop storefront with striped awning, steer emblem, and flames',
    },
];

export default function Process() {
    return (
        <section id="how-it-works" aria-labelledby="how-it-works-heading" className={`section ${styles.section}`}>
            <div className="container">
                <div className={styles.header}>
                    <h2 id="how-it-works-heading" className={styles.title}>
                        How It <em>Works</em>
                    </h2>
                    <p className={styles.subtitle}>
                        Order premium cuts online in four simple steps. Ready for pickup the same day.
                    </p>
                    <div className={styles.ctaWrap}>
                        <Link href="/online-orders" className="btn-hit">
                            <span className={`btn btn-primary ${styles.ctaBtn}`}>
                                <FireBorder active={true} radius={8} />
                                Order Online
                            </span>
                        </Link>
                    </div>
                </div>

                <div className={styles.stripLayout}>
                    {STEPS.map((step, i) => (
                        <div key={step.num} className={styles.stripItem}>
                            <div className={styles.stripNode}>{step.num}</div>
                            <div className={styles.stripVisualRow}>
                                <div className={styles.stripIconFrame}>
                                    <Image
                                        src={step.image}
                                        alt={step.alt}
                                        width={196}
                                        height={196}
                                        unoptimized={step.image.endsWith('.svg')}
                                        className={styles.icon}
                                    />
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={styles.stripHand} aria-hidden="true">
                                        <PointingHandLottie
                                            size={96}
                                            stepIndex={i}
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
            </div>
        </section>
    );
}

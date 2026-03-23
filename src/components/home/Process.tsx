'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Process.module.css';

type Step = {
    num: string;
    title: string;
    desc: ReactNode;
    img?: string;
    alt?: string;
    customIcon?: ReactNode;
};

const STEPS: Step[] = [
    {
        num: '01',
        title: 'Choose Your Items',
        desc: (
            <>
                Browse all cuts, prepared foods, soups, and specials. Add exactly what you want to your cart.{' '}
                <a href="/online-orders" style={{ color: 'var(--gold, #A8905F)', fontWeight: 600, textDecoration: 'underline' }}>
                    Order Online
                </a>
            </>
        ),
        img: '/howitworks/cart_sketch.png',
        alt: 'Shopping cart',
    },
    {
        num: '02',
        title: 'Pick a Pickup Time',
        desc: 'Select your preferred date and time window from available pickup slots at the shop.',
        img: '/howitworks/calendar_sketch.png',
        alt: 'Calendar',
    },
    {
        num: '03',
        title: 'Pay Online or at Pickup',
        desc: (
            <>
                Checkout with Visa, Apple Pay, Google Pay, PayPal, or{' '}
                <a href="/gift-cards" style={{ color: 'var(--gold, #A8905F)', fontWeight: 600, textDecoration: 'underline' }}>
                    a gift card
                </a>
                — or choose to pay at the store when you pick up.
            </>
        ),
        img: '/howitworks/payment_sketch.jpg',
        alt: 'Payment card',
    },
    {
        num: '04',
        title: 'Pick Up at the Shop',
        desc: (
            <>
                Pull up curbside or walk in. Your order is packed and ready — no waiting around.{' '}
                <a href="mailto:butcher@hofherrmeatco.com?subject=Pick up at the store" style={{ color: 'var(--gold, #A8905F)', fontWeight: 600, textDecoration: 'underline' }}>
                    Questions about pick up at store
                </a>
            </>
        ),
        img: '/howitworks/car_sketch.png',
        alt: 'Curbside pickup car',
    },
];

export default function Process() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div className="section-label">PROCESS</div>
                    <h2 className={styles.title}>How It <em>Works</em></h2>
                    <p className={styles.subtitle}>Order premium cuts online in four simple steps. Ready for pickup the same day.</p>
                    <div style={{ marginTop: '32px' }}>
                        <Link href="/online-orders" className="btn btn-primary" style={{ display: 'inline-flex' }}>Order Online</Link>
                    </div>
                </div>

                <div className={styles.grid}>
                    {STEPS.map((step, i) => (
                        <div key={i} className={styles.step}>
                            {/* Connector arrow */}
                            {i < STEPS.length - 1 && (
                                <div className={styles.connector}>
                                    <Image
                                        src="/howitworks/pointing_hand.jpg"
                                        alt="pointing hand"
                                        width={80}
                                        height={53}
                                        className={styles.connectorHand}
                                    />
                                </div>
                            )}

                            <div className={styles.card}>
                                <div className={styles.stepNum}>{step.num}</div>
                                <div className={styles.iconWrap}>
                                    {step.customIcon ? (
                                        step.customIcon
                                    ) : (
                                        <Image
                                            src={step.img!}
                                            alt={step.alt!}
                                            width={120}
                                            height={120}
                                            className={styles.icon}
                                        />
                                    )}
                                </div>
                                <h3 className={styles.cardTitle}>{step.title}</h3>
                                <p className={styles.cardDesc}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

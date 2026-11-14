import type { Metadata } from 'next';
import Link from 'next/link';
import PressTicker from '@/components/PressTicker';
import { PRESS_ITEMS, IN_PRINT } from '@/lib/press';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Press | Hofherr Meat Co. — Northfield & Winnetka, IL',
    description:
        "Hofherr Meat Co. in the press: WTTW, NBC Chicago, ABC7, America's Test Kitchen, Cook's Country, and The Record North Shore on our butcher shop and Italian beef.",
    alternates: { canonical: 'https://hofherrmeatco.com/press' },
    openGraph: {
        title: 'Press | Hofherr Meat Co.',
        description: 'Stories about our butcher shop, our family history, and our Italian beef.',
        url: 'https://hofherrmeatco.com/press',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'Press — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Press | Hofherr Meat Co.',
        description: 'Stories about our butcher shop, our family history, and our Italian beef.',
    },
};

export default function PressPage() {
    const [featured, ...rest] = PRESS_ITEMS;

    const pressSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Hofherr Meat Co. press coverage',
        itemListElement: PRESS_ITEMS.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': item.kind === 'Podcast' ? 'PodcastEpisode' : 'NewsArticle',
                name: item.title,
                headline: item.title,
                url: item.url,
                datePublished: item.isoDate,
                publisher: { '@type': 'Organization', name: item.outlet },
                about: { '@type': 'Organization', name: 'Hofherr Meat Co.', sameAs: 'https://hofherrmeatco.com' },
            },
        })),
    };

    return (
        <main className={styles.page}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema) }} />

            {/* ── Hero ── */}
            <section className={styles.hero}>
                <p className={styles.eyebrow}>Press</p>
                <h1 className={styles.headline}>Find Us in the Press</h1>
                <p className={styles.sub}>
                    Stories about the shop, the family behind it, and the Italian beef that started a line out the door.
                </p>
            </section>

            {/* ── Logo ticker (shared component) ── */}
            <PressTicker />

            <div className="container">
                {/* ── Featured story ── */}
                <section className={styles.featuredWrap} aria-label="Latest coverage">
                    <a href={featured.url} target="_blank" rel="noreferrer" className={styles.featured}>
                        <div className={styles.meta}>
                            <span className={styles.outlet}>{featured.outlet}</span>
                            <span className={styles.date}>{featured.date}</span>
                        </div>
                        <h2 className={styles.featuredTitle}>{featured.title}</h2>
                        <p className={styles.featuredSummary}>{featured.summary}</p>
                        {featured.quote && (
                            <blockquote className={styles.quote}>
                                <p>&ldquo;{featured.quote.text}&rdquo;</p>
                                <cite>{featured.quote.by}</cite>
                            </blockquote>
                        )}
                        <span className={styles.cta}>
                            {featured.cta} <span aria-hidden="true">→</span>
                        </span>
                    </a>
                </section>

                {/* ── All coverage ── */}
                <section className={styles.listSection}>
                    <h2 className={styles.sectionTitle}>More Coverage</h2>
                    <ul className={styles.grid}>
                        {rest.map((item) => (
                            <li key={item.url}>
                                <a href={item.url} target="_blank" rel="noreferrer" className={styles.card}>
                                    <div className={styles.meta}>
                                        <span className={styles.outlet}>{item.outlet}</span>
                                        <span className={styles.date}>{item.date}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.cardSummary}>{item.summary}</p>
                                    {item.quote && (
                                        <blockquote className={styles.quoteSm}>
                                            <p>&ldquo;{item.quote.text}&rdquo;</p>
                                            <cite>{item.quote.by}</cite>
                                        </blockquote>
                                    )}
                                    <span className={styles.cta}>
                                        {item.cta} <span aria-hidden="true">→</span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── In print ── */}
                <section className={styles.print}>
                    <h2 className={styles.printTitle}>Also in Print</h2>
                    <ul className={styles.printList}>
                        {IN_PRINT.map((name) => (
                            <li key={name}>{name}</li>
                        ))}
                    </ul>
                </section>

                {/* ── Media contact ── */}
                <section className={styles.contact}>
                    <h2 className={styles.contactTitle}>Writing About Us?</h2>
                    <p className={styles.contactText}>
                        For interviews, photos, or a look behind the counter, reach out and we&apos;ll get back to you.
                    </p>
                    <div className={styles.contactActions}>
                        <a href="mailto:butcher@hofherrmeatco.com?subject=Press%20Inquiry" className="btn btn-primary">
                            Email Us
                        </a>
                        <Link href="/our-story" className="btn btn-secondary">
                            Our Story
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

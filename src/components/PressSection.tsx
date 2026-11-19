import Image from 'next/image';
import PressTicker from '@/components/PressTicker';
import { PRESS_ITEMS, IN_PRINT, PRESS_MEDIA_ASSETS } from '@/lib/press';
import styles from '@/app/press/page.module.css';

export default function PressSection() {
    const [featured, ...rest] = PRESS_ITEMS;

    const pressSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
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
            },
            {
                '@type': 'ImageGallery',
                name: 'Hofherr Meat Co. press & media assets',
                url: 'https://hofherrmeatco.com/our-story#media-assets',
                image: PRESS_MEDIA_ASSETS.map((asset) => ({
                    '@type': 'ImageObject',
                    name: asset.title,
                    description: asset.caption,
                    contentUrl: `https://hofherrmeatco.com${asset.src}`,
                    creditText: asset.credit,
                    width: asset.width,
                    height: asset.height,
                })),
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema) }} />

            {/* ── Press Intro ── */}
            <section id="press" aria-labelledby="press-heading" className={styles.hero}>
                <h2 id="press-heading" className={styles.headline}>
                    What They&apos;re <em>Saying</em>
                </h2>
                <p className={styles.sub}>
                    Stories about the shop, the family behind it, and the Italian beef that started a line out the door.
                </p>
            </section>

            {/* ── Logo ticker ── */}
            <PressTicker />

            {/* ── Featured story ── */}
            <section id="featured-coverage" aria-labelledby="featured-coverage-heading" className={styles.featuredWrap}>
                <div className="container">
                    <a href={featured.url} target="_blank" rel="noreferrer" className={styles.featured}>
                        <div className={styles.meta}>
                            <span className={styles.outlet}>{featured.outlet}</span>
                            <span className={styles.date}>{featured.date}</span>
                        </div>
                        <h3 id="featured-coverage-heading" className={styles.featuredTitle}>
                            {featured.title}
                        </h3>
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
                </div>
            </section>

            {/* ── All coverage ── */}
            <section id="more-coverage" aria-labelledby="more-coverage-heading" className={styles.listSection}>
                <div className="container">
                    <h2 id="more-coverage-heading" className={styles.sectionTitle}>
                        More Coverage
                    </h2>
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
                </div>
            </section>

            {/* ── Media assets ── */}
            <section id="media-assets" aria-labelledby="media-assets-heading" className={styles.mediaSection}>
                <div className={`container ${styles.mediaInner}`}>
                    <div className={styles.mediaHeader}>
                        <h2 id="media-assets-heading" className={styles.mediaHeading}>
                            Media Assets
                        </h2>
                        <p className={styles.mediaSub}>
                            Approved press photography from the butcher shop, kitchen, and smokehouse. Credit: Courtesy
                            of Hofherr Meat Co.
                        </p>
                    </div>

                    <ul className={styles.mediaGrid}>
                        {PRESS_MEDIA_ASSETS.map((asset) => (
                            <li
                                key={asset.id}
                                className={asset.wide ? `${styles.mediaItem} ${styles.mediaItemWide}` : styles.mediaItem}
                            >
                                <figure className={styles.mediaCard}>
                                    <div className={styles.mediaFrame}>
                                        <Image
                                            src={asset.src}
                                            alt={asset.alt}
                                            fill
                                            sizes={
                                                asset.wide
                                                    ? '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw'
                                                    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                            }
                                            className={
                                                asset.objectPosition === 'shop'
                                                    ? `${styles.mediaImg} ${styles.mediaImgShop}`
                                                    : styles.mediaImg
                                            }
                                        />
                                    </div>
                                    <figcaption className={styles.mediaBody}>
                                        <h3 className={styles.mediaTitle}>{asset.title}</h3>
                                        <p className={styles.mediaCaption}>{asset.caption}</p>
                                        <div className={styles.mediaFooter}>
                                            <span className={styles.mediaSpec}>
                                                {asset.context} · {asset.width}×{asset.height}
                                            </span>
                                        </div>
                                    </figcaption>
                                </figure>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── In print ── */}
            <section id="in-print" aria-labelledby="in-print-heading" className={styles.print}>
                <div className="container">
                    <h2 id="in-print-heading" className={styles.printTitle}>
                        Also in Print
                    </h2>
                    <ul className={styles.printList}>
                        {IN_PRINT.map((name) => (
                            <li key={name}>{name}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── Media contact ── */}
            <section id="press-contact" aria-labelledby="press-contact-heading" className={styles.contactWrap}>
                <div className="container">
                    <div className={styles.contact}>
                        <h2 id="press-contact-heading" className={styles.contactTitle}>
                            Writing About Us?
                        </h2>
                        <p className={styles.contactText}>
                            For interviews, photos, or a look behind the counter, reach out and we&apos;ll get back to
                            you.
                        </p>
                        <div className={styles.contactActions}>
                            <a
                                href="mailto:butcher@hofherrmeatco.com?subject=Press%20Inquiry"
                                className="btn btn-primary"
                            >
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}


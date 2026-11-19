import type React from 'react';
import { getClient } from '@/sanity/client';
import { SIGNATURE_PRODUCTS_QUERY, ROTISSERIE_STATUS_QUERY } from '@/sanity/queries';
import VideoCallout from '@/components/specials/VideoCalloutWrapper';
import ParallaxMedia from '@/components/ParallaxMedia';
import styles from '@/app/specials/page.module.css';

export type SignatureProduct = {
    _id: string;
    title: string;
    sectionLabel?: string | null;
    emoji?: string | null;
    description?: string | null;
    calloutTitle?: string | null;
    calloutSub?: string | null;
    calloutColor?: string | null;
    chips?: string[] | null;
    links?: { label: string; url: string; isPrimary?: boolean }[] | null;
    layout?: string | null;
    image?: string | null;
    video?: string | null;
};

export type RotisserieStatus = {
    status: string;
    birdsLeft?: number | null;
    nextAvailable?: string | null;
    note?: string | null;
    lastUpdated?: string | null;
};

export const FALLBACK_SIGNATURES: SignatureProduct[] = [
    {
        _id: 'fb-1',
        title: "The World's Greatest Italian Beef",
        sectionLabel: 'Chicago Classic · Depot Exclusive',
        emoji: '🥩',
        image: '/assets/italian-beef.jpg',
        description:
            "In November 2022, America's Test Kitchen challenged us to make the best Italian Beef sandwich in the city. We accepted, worked in secret for a month, and in December 2022 served the greatest beef Chicagoland has ever tasted.\n\nOur story became the season finale of their podcast, Proof on PBS — a deep dive from concept to first service. It's what happens when a 120-year-old butcher shop refuses to play it safe.\n\nThe sandwich is served exclusively at The Depot — our counter inside the Winnetka Elm St. Metra Station — Mon–Fri from 10:30am until we sell out. There is no substitute and no pre-order.\n\n🏪 Can't make it to The Depot? Order our house-roasted Italian beef by the pound and build the perfect sandwich at home.",
        calloutTitle: 'As Featured On',
        calloutSub: "America's Test Kitchen\nPodcast: Proof\nPBS Weekends",
        calloutColor: 'var(--red)',
        chips: ["America's Test Kitchen", '📻 Podcast: Proof', '📺 PBS Weekends'],
        links: [
            { label: 'Listen to the Podcast', url: 'http://bit.ly/3QTft4F', isPrimary: false },
            { label: 'Visit The Depot', url: '/visit#depot', isPrimary: false },
            { label: 'Order Beef by the Pound', url: '/online-orders', isPrimary: true },
        ],
        video: '/video-clips/beef.mp4',
        layout: 'callout-left',
    },
    {
        _id: 'fb-2',
        title: 'Rotisserie Chicken Dinners',
        sectionLabel: 'Ready Daily · Tue–Sun',
        emoji: '🍗',
        image: '/assets/rotisserie-chickens.jpg',
        video: '/video-clips/chicken.mp4',
        description:
            'These tasty, pasture-raised chickens come hot and ready with roasted schmaltzy potatoes. Slow-roasted on our floor-to-ceiling rotisserie — simple seasoning, perfect every time.\n\nAvailable for curbside pickup Tuesday through Sunday. Call ahead — they sell out most days.\n\n🏪 Depot Location: We are serving up beefs from 10:30am until sold out, Monday–Friday, inside the Winnetka Elm St. Metra Station.',
        calloutTitle: 'Hot & Ready',
        calloutSub: 'Tue–Sun\nStarting at noon\nWhile supplies last',
        calloutColor: '',
        chips: ['🐔 Pasture-Raised', '🥔 Schmaltzy Potatoes Included', '🚗 Curbside Pickup'],
        links: [{ label: '📞 Reserve at (847) 441-MEAT', url: 'tel:8474416328', isPrimary: true }],
        layout: 'callout-right',
    },
];

const HIGHLIGHT_TARGETS = [
    'Tuesday through Sunday',
    'Mon–Fri from 10:30am',
    'Mon-Fri from 10:30am',
    'Mon–Fri starting at 10:30am',
    'Mon-Fri starting at 10:30am',
] as const;

function normalizeQuotes(s: string) {
    return s.replace(/[\u2018\u2019\u201C\u201D]/g, (c) =>
        c === '\u2018' || c === '\u2019' ? "'" : '"',
    );
}

export function mergeSignatureFallbacks(rawSigs: SignatureProduct[]): SignatureProduct[] {
    return rawSigs.map((sig) => {
        const fallback = FALLBACK_SIGNATURES.find(
            (f) => normalizeQuotes(f.title) === normalizeQuotes(sig.title),
        );
        return {
            ...sig,
            image: sig.image || fallback?.image,
            video: sig.video || fallback?.video,
        };
    });
}

interface SignatureDishesSectionProps {
    signatures?: SignatureProduct[];
    rotisserie?: RotisserieStatus | null;
    preview?: boolean;
}

export default async function SignatureDishesSection({
    signatures: providedSignatures,
    rotisserie: providedRotisserie,
    preview = false,
}: SignatureDishesSectionProps) {
    let signatures = providedSignatures ?? FALLBACK_SIGNATURES;
    let rotisserie: RotisserieStatus | null = providedRotisserie ?? null;

    if (!providedSignatures) {
        try {
            const sanityClient = getClient(preview);
            const [rawSigs, rawRotisserie] = await Promise.all([
                sanityClient.fetch(SIGNATURE_PRODUCTS_QUERY),
                providedRotisserie === undefined
                    ? sanityClient.fetch(ROTISSERIE_STATUS_QUERY)
                    : Promise.resolve(providedRotisserie),
            ]);
            if (rawSigs?.length) {
                signatures = mergeSignatureFallbacks(rawSigs);
            }
            if (rawRotisserie?.status) {
                rotisserie = rawRotisserie;
            }
        } catch {
            // Fall back to static defaults above
        }
    }

    return (
        <>
            {signatures.map((product, idx) => {
                const isAlt = product.layout === 'callout-right';
                const sectionId = product.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                const headingId = `${sectionId}-heading`;
                const calloutVars = product.calloutColor
                    ? ({ '--callout-bg': product.calloutColor } as React.CSSProperties)
                    : undefined;

                const callout =
                    product.video && product.image ? (
                        <div className={styles.videoCalloutWrap}>
                            <VideoCallout
                                image={product.image}
                                video={product.video}
                                alt={product.title}
                                title={product.calloutTitle}
                                sub={product.calloutSub}
                            />
                        </div>
                    ) : product.image ? (
                        <div className={styles.imageCallout}>
                            <ParallaxMedia
                                src={product.image}
                                type="image"
                                alt={product.title}
                                className={styles.imageCalloutImg}
                            />
                        </div>
                    ) : (
                        <div
                            className={`${styles.featureCallout} ${product.calloutColor ? styles.featureCalloutColored : ''}`}
                            style={calloutVars}
                        >
                            {product.emoji && <div className={styles.calloutEmoji}>{product.emoji}</div>}
                            {product.calloutTitle && (
                                <div className={styles.calloutTitle}>{product.calloutTitle}</div>
                            )}
                            {product.calloutSub && (
                                <div className={styles.calloutSub}>
                                    {product.calloutSub.split('\n').map((line) => (
                                        <span key={line}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );

                const isChicken =
                    product._id === 'fb-2' || product.title?.toLowerCase().includes('rotisserie');
                const rStatus = isChicken ? rotisserie : null;
                const stockBadgeColor =
                    rStatus?.status === 'available'
                        ? { bg: '#16a34a', border: '#15803d' }
                        : rStatus?.status === 'low'
                            ? { bg: '#d97706', border: '#e85222' }
                            : rStatus?.status === 'sold_out'
                                ? { bg: '#dc2626', border: '#cc0e1d' }
                                : { bg: '#475569', border: '#334155' };

                const stockMessage = rStatus?.note
                    ? rStatus.note
                    : rStatus?.status === 'available'
                        ? rStatus.birdsLeft
                            ? `${rStatus.birdsLeft} bird${rStatus.birdsLeft !== 1 ? 's' : ''} left today — call to reserve!`
                            : 'Available today — call to reserve your bird'
                        : rStatus?.status === 'low'
                            ? rStatus.birdsLeft
                                ? `Only ${rStatus.birdsLeft} left — call now!`
                                : 'Almost sold out — call now!'
                            : rStatus?.status === 'sold_out'
                                ? `Sold out today${rStatus.nextAvailable ? ` · ${rStatus.nextAvailable}` : ''}`
                                : rStatus?.status === 'unavailable'
                                    ? `Not available today${rStatus.nextAvailable ? ` · ${rStatus.nextAvailable}` : ''}`
                                    : null;

                const text = (
                    <div className={styles.featureText}>
                        {product.sectionLabel && <div className="section-label">{product.sectionLabel}</div>}
                        <h2 id={headingId} className={styles.sectionTitle}>
                            {product.title}
                        </h2>
                        {product.description &&
                            product.description.split('\n\n').map((para) => {
                                let content: React.ReactNode = para;

                                for (const target of HIGHLIGHT_TARGETS) {
                                    if (typeof content === 'string' && content.includes(target)) {
                                        const textStr: string = content;
                                        const chunks: string[] = textStr.split(target);
                                        content = (
                                            <>
                                                {chunks[0]}
                                                <strong className={styles.highlightWhite}>{target}</strong>
                                                {chunks[1]}
                                            </>
                                        );
                                    }
                                }

                                return (
                                    <p key={para} className={para.startsWith('🏪') ? styles.depotNote : undefined}>
                                        {content}
                                    </p>
                                );
                            })}
                        {product.chips && product.chips.length > 0 && (
                            <div className={styles.chipRow}>
                                {product.chips.map((chip) => (
                                    <span key={chip} className={styles.chip}>
                                        {chip}
                                    </span>
                                ))}
                            </div>
                        )}
                        {rStatus && stockMessage && (
                            <div
                                className={styles.stockBadgeLive}
                                style={
                                    {
                                        '--badge-bg': stockBadgeColor.bg,
                                        '--badge-border': stockBadgeColor.border,
                                    } as React.CSSProperties
                                }
                            >
                                <span className={styles.stockBadgeEmoji}>
                                    {rStatus.status === 'available'
                                        ? '🟢'
                                        : rStatus.status === 'low'
                                            ? '🟡'
                                            : '🔴'}
                                </span>
                                <span>{stockMessage}</span>
                            </div>
                        )}
                        {(product.links || []).length > 0 && (
                            <div className={styles.btnRow}>
                                {[
                                    ...(product.links || []),
                                    {
                                        label: '💬 Order via Chatbox',
                                        url: `#chat?subject=${encodeURIComponent(product.title)}`,
                                        isPrimary: false,
                                    },
                                ]
                                    .filter((link) => {
                                        const lower = link.label.toLowerCase().trim();
                                        return !(
                                            lower.includes('order online') ||
                                            lower.includes('order beef by the pound')
                                        );
                                    })
                                    .concat(
                                        product.title.toLowerCase().includes('beef')
                                            ? [
                                                  {
                                                      label: '📞 RESERVE AT (847) 441-MEAT',
                                                      url: 'tel:8474416328',
                                                      isPrimary: true,
                                                  },
                                              ]
                                            : [],
                                    )
                                    .map((link) => {
                                        let primaryStatus = link.isPrimary;
                                        const lower = link.label.toLowerCase();
                                        if (lower.includes('podcast')) primaryStatus = false;
                                        if (lower.includes('order') || lower.includes('reserve')) {
                                            primaryStatus = true;
                                        }
                                        return { ...link, isPrimary: primaryStatus };
                                    })
                                    .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
                                    .map((link) => (
                                        <a
                                            key={link.url}
                                            href={link.url}
                                            target={link.url.startsWith('http') ? '_blank' : undefined}
                                            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="btn-hit"
                                        >
                                            <span className={`btn ${link.isPrimary ? 'btn-primary' : 'btn-secondary'}`}>
                                                {link.label.toLowerCase().includes('podcast') ? ' ' : ''}
                                                {link.label
                                                    .replace(/[\u2190-\u21FF]|[\u2700-\u27BF]|[\u2B00-\u2BFF]|\uFE0F/g, '')
                                                    .trim()}
                                            </span>
                                        </a>
                                    ))}
                            </div>
                        )}
                    </div>
                );

                return (
                    <section
                        key={product._id}
                        id={sectionId}
                        aria-labelledby={headingId}
                        className={`section ${idx % 2 === 0 ? styles.mainSection : styles.altSection}`}
                    >
                        <div className="container">
                            <div className={styles.featureGrid}>
                                {isAlt ? (
                                    <>
                                        {text}
                                        {callout}
                                    </>
                                ) : (
                                    <>
                                        {callout}
                                        {text}
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                );
            })}
        </>
    );
}

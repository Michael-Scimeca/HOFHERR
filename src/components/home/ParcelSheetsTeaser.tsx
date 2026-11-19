import Image from 'next/image';
import Link from 'next/link';
import styles from './ParcelSheetsTeaser.module.css';

const PREVIEW_SHEETS = [
    {
        src: '/assets/recipes/sheets/bw/sheets/bw-03-lamb-loin-chops.jpg',
        alt: 'Domestic Lamb Loin Chops 12 by 16 inch printable parcel liner with 1:1 salt and pepper measuring rings',
    },
    {
        src: '/assets/recipes/sheets/bw/sheets/bw-01-sausage-peppers.jpg',
        alt: 'Sweet Italian Sausage and Bell Peppers 12 by 16 inch printable butcher parcel liner',
    },
    {
        src: '/assets/recipes/sheets/bw/sheets/bw-05-salmon-fillets.jpg',
        alt: 'Center-Cut Salmon Fillets 12 by 16 inch printable parchment parcel liner',
    },
] as const;

export default function ParcelSheetsTeaser() {
    return (
        <section id="parcel-sheets-teaser" aria-labelledby="parcel-sheets-teaser-heading" className="section-sm">
            <div className="container">
                <div className={styles.banner}>
                    <div className={styles.copy}>
                        <h2 id="parcel-sheets-teaser-heading" className={styles.heading}>
                            Butcher&apos;s <em>Parcel Liners</em>
                        </h2>
                        <p className={styles.sub}>
                            Print a 12×16&quot; single-ink parchment guide, lay your Hofherr cuts directly on the
                            life-size outlines, pour salt and spices into the 1:1 grain rings, fold, and bake — zero
                            measuring spoons required.
                        </p>
                        <ul className={styles.specs} aria-label="Parcel liner highlights">
                            <li className={styles.specItem}>8 Print-Ready 12×16&quot; Sheets</li>
                            <li className={styles.specItem}>1:1 Grain &amp; Cut Targets</li>
                            <li className={styles.specItem}>Serves 2 · Oven ≤ 425°F</li>
                        </ul>
                        <div className={styles.actions}>
                            <Link href="/recipes/sheets" className="btn-hit">
                                <span className="btn btn-primary">Explore Parcel Sheets →</span>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.previewDeck}>
                        {PREVIEW_SHEETS.map((sheet) => (
                            <Link
                                key={sheet.src}
                                href="/recipes/sheets"
                                className={styles.sheetFrame}
                                aria-label={`View ${sheet.alt}`}
                            >
                                <Image
                                    src={sheet.src}
                                    alt={sheet.alt}
                                    width={240}
                                    height={320}
                                    className={styles.sheetImg}
                                    sizes="(max-width: 900px) 30vw, 180px"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}


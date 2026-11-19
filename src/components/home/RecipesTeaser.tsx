import Link from 'next/link';
import styles from './RecipesTeaser.module.css';

export default function RecipesTeaser() {
    return (
        <section id="recipes-teaser" aria-labelledby="recipes-teaser-heading" className="section-sm">
            <div className="container">
                <div className={styles.banner}>
                    <h2 id="recipes-teaser-heading" className={styles.heading}>
                        Cook It <em>Like We Do</em>
                    </h2>
                    <p className={styles.body}>
                        Recipes for every occasion and season, dinner bundles, and printable 12×16&quot; parcel
                        cooking sheets for your Hofherr cuts.
                    </p>
                    <Link href="/recipes" className="btn-hit">
                        <span className="btn btn-primary">Browse Recipes &amp; Parcel Sheets →</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

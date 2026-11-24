import ActionButton from '@/components/ActionButton';
import styles from './StoryTeaser.module.css';

export default function StoryTeaser() {
    return (
        <section id="story-teaser" aria-labelledby="story-teaser-heading" className="section-sm">
            <div className="container">
                <div className={styles.banner}>
                    <h2 id="story-teaser-heading" className={styles.heading}>
                        Respect for the Past, <em>Eye to the Future</em>
                    </h2>
                    <p className={styles.body}>
                        A village butcher in Germany, a meat packing company on Chicago&apos;s South Side, and in 2014,
                        Sean Hofherr bringing that family legacy back to the North Shore.
                    </p>
                    <ActionButton href="/our-story" variant="primary">
                        Read Our Story →
                    </ActionButton>
                </div>
            </div>
        </section>
    );
}

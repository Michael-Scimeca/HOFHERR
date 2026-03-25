import Link from 'next/link';
import styles from './Specials.module.css';
import ParallaxMedia from '@/components/ParallaxMedia';

const FEATURED: { video?: string; image?: string; title: string; desc: string; href: string }[] = [
    {
        video: '/video-clips/beef.mp4',
        title: "The World's Greatest Italian Beef",
        desc: "As featured on America's Test Kitchen (PBS). House-made and served daily at The Depot, Mon–Fri starting at 10:30am until sold out.",
        href: '/specials#the-world-s-greatest-italian-beef',
    },
    {
        video: '/video-clips/chicken.mp4',
        title: 'Rotisserie Chicken Dinners',
        desc: 'Pasture-raised chickens, slow-roasted on our floor-to-ceiling rotisserie. Served hot with schmaltzy potatoes. Available Tue–Sun.',
        href: '/specials#rotisserie-chicken-dinners',
    },
    {
        video: '/video-clips/cutmeat.mp4',
        title: 'BBQ Catering',
        desc: 'Competition-style BBQ for any event. Brisket, ribs, pulled pork — smoked low and slow. From 20 to 500+ guests.',
        href: '/specials#bbq-catering',
    },
    {
        video: '/video-clips/PIG-GRIL.mp4',
        title: 'Pig Roasts',
        desc: 'Full-service pig roasts for 50–300+ guests. We source, prep, cook, serve & clean up. The full experience.',
        href: '/specials#pig-roasts',
    },
];

export default function Specials() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div className="section-label">What We Offer</div>
                    <h2 className={styles.title}>Our <em>Specials</em></h2>
                    <p className={styles.sub}>The dishes and services that define Hofherr Meat Co.</p>
                </div>
                <div className={styles.grid}>
                    {FEATURED.map(item => (
                        <Link key={item.title} href={item.href} className={styles.card}>
                            <div className={styles.cardImg}>
                                <ParallaxMedia
                                    src={item.video ?? item.image ?? ''}
                                    type={item.video ? 'video' : 'image'}
                                    alt={item.title}
                                    className={styles.cardMedia}
                                />
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <p className={styles.cardDesc}>{item.desc}</p>
                                <span className={styles.cardLink}>Learn More</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

import Link from 'next/link';
import ParallaxMedia from '@/components/ParallaxMedia';
import ParallaxImg from '@/app/bbq/ParallaxImg';
import bbqStyles from '@/app/bbq/page.module.css';
import styles from '../specials/page.module.css';

const getThumb = (name: string) => {
    const safeName = (name || '').toLowerCase();
    if (safeName.includes('brisket')) return '/images/bbq/brisket.jpg';
    if (safeName.includes('pulled pork')) return '/images/bbq/pulled_pork.jpg';
    if (safeName.includes('pulled chicken')) return '/images/bbq/pulled_chicken.jpg';
    if (safeName.includes('tips')) return '/images/bbq/rib_tips.jpg';
    if (safeName.includes('ribs') && !safeName.includes('tips')) return '/images/bbq/ribs.jpg';
    if (safeName.includes('sausage')) return '/images/bbq/sausage.jpg';
    if (safeName.includes('dates')) return '/images/bbq/chorizo_dates.jpg';
    if (safeName.includes('charcuterie')) return '/images/bbq/charcuterie.jpg';
    if (safeName.includes('pimento cheese') && !safeName.includes('mac')) return '/images/bbq/pimento_cheese.jpg';
    if (safeName.includes('mac and cheese') || safeName.includes('mac & cheese') || (safeName.includes('pimento') && safeName.includes('mac')) || safeName.includes('mac n cheese')) return '/images/bbq/mac_cheese.jpg';
    if (safeName.includes('slaw')) return '/images/bbq/coleslaw.jpg';
    if (safeName.includes('beans')) return '/images/bbq/baked_beans.jpg';
    if (safeName.includes('collard')) return '/images/bbq/collard_greens.jpg';
    if (safeName.includes('lion')) return '/images/bbq/grilled-lions-mane-mushrooms.jpg';
    if (safeName.includes('portobello')) return '/images/bbq/portobellos.jpg';
    if (safeName.includes('bean salad')) return '/images/bbq/bean_salad.jpg';
    if (safeName.includes('pasta salad')) return '/images/bbq/pasta_salad.jpg';
    if (safeName.includes('potato salad')) return '/images/bbq/potato_salad.jpg';
    if (safeName.includes('corn')) return '/images/bbq/corn.jpg';
    return null;
};

export default function PigRoastsSection() {
    return (
        <section id="pig-roasts" aria-labelledby="pig-roasts-heading" className={styles.bbqSection}>
            <div className={styles.bbqHero}>
                <div className="container">
                    <span className={styles.bbqEyebrow}>🐷 Full Service · Min. 50 Guests</span>
                    <h2 id="pig-roasts-heading" className={styles.bbqHeadline}>Hofherr Pig Roasts</h2>
                    <p className={styles.bbqSub}>
                        Our team of butchers and BBQ experts arrive one hour before serving with a fully roasted whole hog. Guests watch the carving demonstration and sample as it&apos;s served.
                    </p>
                </div>
            </div>
            <div className="container">

                <div className={styles.sectionImageWrapper}>
                    <ParallaxMedia
                        src="/video-clips/PIG-GRIL.mp4"
                        type="video"
                        className={styles.sectionImage}
                    />
                </div>



                <div className={styles.pigMenuWrap}>
                    <div className={bbqStyles.menuBoard}>

                        {/* Left Column: Sides */}
                        <div className={`${bbqStyles.menuCategory} ${bbqStyles.sidesColumn}`}>
                            <h3 className={bbqStyles.catTitle}>🥗 Side Options</h3>
                            <p className={bbqStyles.catDesc}>Classic homemade sides designed to perfectly complement our low-and-slow BBQ.</p>
                            <ul className={bbqStyles.menuListDual}>
                                {[
                                    "Seasonal Pasta Salad",
                                    "Pimento Mac n Cheese",
                                    "Potato Salad",
                                    "Butchers Beans",
                                    "HMCo.Slaw",
                                    "Collard Greens",
                                    "Seasonal Salad",
                                    "Grilled Lion's Mane Mushrooms",
                                ].map(item => {
                                    const img = getThumb(item);
                                    return (
                                        <li key={item} className={img ? bbqStyles.hasThumb : ''}>
                                            {img && <ParallaxImg src={img} alt={item} className={bbqStyles.listThumb} />}
                                            <span>{item}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Right Column: Meats and Appetizers */}
                        <div className={`${bbqStyles.menuCategory} ${bbqStyles.meatCategory}`}>

                            {/* Meats */}
                            <h3 className={bbqStyles.catTitle}>🔥 Add&apos;l Meats Options</h3>
                            <p className={bbqStyles.catDesc}>All meats are slow-smoked in-house over authentic oak and cherry wood for up to 14 hours.</p>
                            <ul className={bbqStyles.menuListDual}>
                                {[
                                    "Burnt Ends Brisket",
                                    "BBQ Pulled Chicken",
                                    "Rib Tips + Hot Links Combo",
                                    "Smoked Ribs",
                                    "Any of our HMC Sausages"
                                ].map(item => {
                                    const img = getThumb(item);
                                    return (
                                        <li key={item} className={img ? bbqStyles.hasThumb : ''}>
                                            {img && <ParallaxImg src={img} alt={item} className={bbqStyles.listThumb} />}
                                            <span>{item}</span>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Appetizers */}
                            <h3 className={`${bbqStyles.catTitle} ${styles.appetizerTitleSpaced}`}>🧀 Appetizer Options</h3>
                            <ul className={`${bbqStyles.menuList} ${styles.appetizerBentoList}`}>
                                {[
                                    "Butcher's Charcuterie Board",
                                    "Bacon Wrapped Chorizo Dates",
                                    "Pimento Cheese + Crackers ($20/tray)"
                                ].map(item => {
                                    const img = getThumb(item);
                                    return (
                                        <li key={item} className={img ? bbqStyles.hasThumb : ''}>
                                            {img && <ParallaxImg src={img} alt={item} className={bbqStyles.listThumb} />}
                                            <span>{item}</span>
                                        </li>
                                    );
                                })}
                                <li className={styles.pigRoastCtaItem}>
                                    <div className={styles.pigRoastCtaSurface}>
                                        <div className={styles.pigRoastCtaContent}>
                                            <div className={styles.pigRoastCtaCopy}>
                                                <h4 className={styles.pigRoastCtaTitle}>Build Your Pig Roast Package</h4>
                                                <p className={styles.pigRoastCtaSub}>
                                                    Use our interactive calculator to customize your menu, pick a date, and send an inquiry.
                                                </p>
                                            </div>
                                            <Link
                                                href="/catering#build-your-package"
                                                className={`btn ${styles.pigRoastCtaBtn}`}
                                            >
                                                Start Building →
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

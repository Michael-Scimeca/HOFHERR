import type { Metadata } from 'next';
import Image from 'next/image';
import HoverVideo from '@/components/HoverVideo';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { TEAM_MEMBERS_QUERY, TIMELINE_QUERY, ACCOLADES_QUERY } from '@/sanity/queries';
import InteractiveTimeline from '@/components/InteractiveTimeline';
import AccoladesVariants from '@/components/AccoladesVariants';
import TeamBentoGrid from '@/components/TeamBentoGrid';
import TestimonialWall from '@/components/TestimonialWall';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import { getGoogleReviews } from '@/lib/googleReviews';

import styles from './page.module.css';

/** 5-star Yelp reviews supplied by the owner, shown in the moving wall at the bottom of the page. */
const REVIEWS = [
    { quote: "Meat is high quality. The staff is top notch. The shop is small, so phone in orders make your stop quick and easy.", name: "Bobblehead B.", meta: "Yelp \u00b7 Chicago, IL \u00b7 Dec 2025", rating: 5 },
    { quote: "This is my go to place for anything meat related. Great staff here, and the meat has always been fresh. Every time I host friends they always ask me where I source the food from. Look no further!", name: "Jack S.", meta: "Yelp \u00b7 Wilmette, IL \u00b7 Aug 2024", rating: 5 },
    { quote: "We ordered a BBQ dinner for a post-wedding party. Everything was delicious - especially the brisket and the delicious baked beans. The food was packaged well and was easy to heat. Glad to have this local business!", name: "Liz K.", meta: "Yelp \u00b7 Winnetka, IL \u00b7 Oct 2024", rating: 5 },
    { quote: "Highest quality great tasting products from wonderful and wildly talented people. Avoid this place at your own peril, i.e. go as soon as it opens.", name: "Joe D.", meta: "Yelp \u00b7 San Francisco, CA \u00b7 Nov 2023", rating: 5 },
    { quote: "The staff are amazing and their meat are even better. Our family loves dry aged beef, Hofherr always has a variety of cuts to choose from. The owner and his wife run their business like a family and treat every customer as if they were providing for their family bbq or special meal.", name: "Yelp reviewer", meta: "Yelp \u00b7 Feb 2023", rating: 5 },
    { quote: "Tonight we ate Hofherr's best in show sausages, they were 10/10 delicious, you must try them! Recently we ate the smoked lamb curry and the chicken pot pie all of which were sooooo good. We love this store and all the staff who are so helpful and friendly.", name: "Kath H.", meta: "Yelp \u00b7 Chicago, IL \u00b7 Feb 2024", rating: 5 },
    { quote: "Don't miss going to this fabulous butcher and gourmet store. Staff is local and very knowledgeable. Not just their excellent meat but other specialties. Try their soups and weekly meal specials. We have had them prepare everything from roasted pig to fresh oysters parties. Be sure to get on the email list to be tempted. Call them to find out what's special. They will bring your order to the car.", name: "Barbara S.", meta: "Yelp \u00b7 Winnetka, IL \u00b7 Feb 2021", rating: 5 },
    { quote: "Proprietors Sean and Arielle Hofherr present a spectacular array of exquisitely delicious prime meats, soups and chili, jerky, as well as other prepared dishes. They were tremendous in barbecuing for the VIP Tent at the Winnetka Music Festival, and have provided phenomenal catering for friends at other venues. A plus, pigs ears for dogs.", name: "Dave C.", meta: "Yelp \u00b7 Winnetka, IL \u00b7 May 2023", rating: 5 },
    { quote: "I love this butcher always the best service and high quality meat and the best house marinated skirt steaks I've had so far.", name: "Matt G.", meta: "Yelp \u00b7 Chicago, IL \u00b7 Jan 2023", rating: 5 },
    { quote: "I am sorry that I have not supported them for my butcher needs but I will now. The NTRFC (New Trier rugby) had a fundraiser for the fried chicken dinner! OMG. So good. Biscuits were amazing. Pickles!! I am looking forward to trying other items in their shop.", name: "Marjorie B.", meta: "Yelp \u00b7 Glenview, IL \u00b7 Feb 2020", rating: 5 },
    { quote: "Love this place. Emily gave me great advice on smoking my first brisket. She was very friendly and patient in explaining the process to me and took time to write down directions, which proved very helpful!", name: "Jonathan W.", meta: "Yelp \u00b7 Glencoe, IL \u00b7 Sep 2019", rating: 5 },
    { quote: "This place is the best!!! Skirt steak - AMAZING - bone-in pork chop - BEYOND AMAZING! Chi vops (sausages) wow, apple bratwurst, you won't forget them EVER. And the owners, beyond nice and accommodating through COVID too! You must pay a visit!", name: "Marianne V.", meta: "Yelp \u00b7 Riverwoods, IL \u00b7 Nov 2021", rating: 5 },
    { quote: "We catered some hot dogs and other appetizers for a Chicago themed birthday party and they were excellent! Everyone commented on how great they tasted and how cool it was to have gotten them from a local butcher shop. We've gotten other meat from here too that has been wonderful.", name: "Jen V.", meta: "Yelp \u00b7 Chicago, IL \u00b7 Jun 2019", rating: 5 },
];

export const metadata: Metadata = {
    title: 'Our Story & Team | Hofherr Meat Co. — 120+ Years of Craft Butchery',
    description: 'Meet the team behind Hofherr Meat Co.: Sean Hofherr (owner, head chef, 2009 North Shore Chili Cookoff winner), and a crew of dedicated butchers and chefs carrying 120+ years of family heritage. From a village butcher in Germany to Chicago\'s South Side to Northfield & Winnetka, IL.',
    keywords: ['Sean Hofherr', 'Hofherr Meat Co our story', 'craft butcher Northfield IL', 'North Shore butcher heritage', 'Hofherr family history', 'meet the team butcher shop', 'Northfield IL butcher'],
    alternates: { canonical: 'https://hofherrmeatco.com/our-story' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Our Story & Team | Hofherr Meat Co.',
        description: '120+ years of butchering heritage. Meet Sean Hofherr and the full HMC crew — butchers, chefs, and managers. Chicago South Side roots, now in Northfield & Winnetka, IL.',
        url: 'https://hofherrmeatco.com/our-story',
        images: [{ url: '/OG/og-our-story.jpg', width: 1200, height: 630, alt: 'Our Story — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Story & Team | Hofherr Meat Co.',
        description: '120+ years of craft butchery heritage. Meet Sean Hofherr & the HMC team in Northfield & Winnetka, IL.',
    },
};

/* ── Fallbacks ── */
const FALLBACK_TIMELINE = [
    { era: 'Late 1800s', title: 'The Old Country', body: 'A Hofherr great-great-grandfather plies his trade as a village butcher in Germany — a craft handed down and carried across the Atlantic.' },
    { era: 'Early 1900s', title: 'Chicago\'s South Side', body: 'His son, an immigrant, establishes the original Hofherr Meat Company on Chicago\'s storied South Side, building a name among the city\'s legendary stockyard community.' },
    { era: '2009 – 2013', title: 'Earning His Stripes', body: 'Sean sharpens his craft at Keefer\'s Restaurant in River North, then apprentices at Zier\'s Prime Meats in Wilmette. He wins the 2009 North Shore Chili Cookoff and the 2010 Lake Bluff Ribfest before directing the kitchen at Stormy\'s Tavern in Northfield.' },
    { era: 'March 2014', title: 'Hofherr Meat Co. Opens', body: '300 Happ Rd, Northfield. A new chapter — and a return to roots. Every cut made to order. Every animal traceable to a named family farm.', video: '/video-clips/stage-fire.mp4' },
    { era: '2024', title: 'The Depot Opens', body: 'Sean expands to a second location — The Depot, inside the historic Winnetka Elm Street Metra Train Station at 754 Elm St. A convenient pick-up spot bringing the same Hofherr quality to the North Shore commuter corridor.' },
];

const FALLBACK_TEAM = [
    {
        name: 'Sean Hofherr',
        role: 'Owner & Head Chef',
        photo: '/team/sean.jpg',
        bio: 'Sean carries on a legacy that began with a village butcher in Germany, brought to America by his immigrant great-grandfather who built the original Hofherr Meat Company on Chicago\'s South Side. After honing his craft at Keefer\'s Restaurant in River North, an apprenticeship at Zier\'s Prime Meats in Wilmette, and winning the 2009 North Shore Chili Cookoff, Sean opened Hofherr Meat Co. in 2014. He\'s an active member of the Butcher\'s Guild and the Illinois Barbecue Association.'
    },
    {
        name: 'Vincent Recaei',
        role: 'Manager',
        photo: '/team/vincent.jpg',
        bio: 'The guy behind the scenes who keeps the whole operation running. Vincent manages the day-to-day alongside Sean — from inventory and vendor relationships to making sure the cases are stocked and the shop floor stays spotless. He grew up in the neighborhood and started as a part-time hire before working his way into a leadership role. Vincent is the first one in and the last one out, and if you\'re a regular, he probably already knows your order.'
    },
    {
        name: 'Emily Cushing',
        role: 'Butcher',
        photo: '/team/emily.jpg',
        bio: 'Emily holds a degree in Meat Processing from the University of Wisconsin–Platteville — one of only a handful of programs like it in the country. She came to HMC because she wanted to work at a shop that values the craft the way she does. Whether she\'s breaking down a whole hog or helping a first-timer pick the right roast for Sunday dinner, Emily brings the same level of care and expertise. She\'s also the team\'s go-to for custom cuts and special requests.'
    },
    {
        name: 'Dan Blair',
        role: 'Butcher',
        photo: '/team/dan.jpg',
        bio: 'A Northfield native through and through, Dan spent years behind the meat counter at Mariano\'s before making the move to HMC. He brings decades of experience, a deep knowledge of every cut in the case, and the kind of old-school customer service that keeps people coming back. Dan is the guy who remembers what you bought last Thanksgiving and will talk you through the best way to cook it. His passion for quality and consistency is a big part of what makes HMC feel like a neighborhood institution.'
    },
    {
        name: 'Jamie Bisoulis',
        role: 'Head Chef',
        photo: '/team/jamie.jpg',
        bio: 'Jamie has been with the shop since the very beginning — she was one of Sean\'s first hires and helped build the prepared foods program from scratch. She runs the HMC kitchen with precision and heart, overseeing everything from the signature soups and sides to the sauces, marinades, and seasonal specials. Jamie\'s background is rooted in scratch cooking and home-style recipes made with real ingredients. If it\'s in the hot case or the grab-and-go cooler, chances are Jamie made it by hand that morning.'
    },
    {
        name: 'Steve Soler',
        role: 'Chef',
        photo: '/team/steve.jpg',
        bio: 'Steve met Sean at a charity event and they bonded over pork belly, sauerkraut, and a shared belief that food should be made the right way — no shortcuts. That conversation turned into a partnership, and Steve now plays a key role in developing new recipes, catering menus, and everything that comes out of the HMC kitchen alongside Jamie. With a background in both fine dining and comfort food, Steve brings a versatility that keeps the menu fresh and exciting. He\'s the creative force behind many of the shop\'s most popular seasonal dishes.'
    },
];

const FALLBACK_ACCOLADES = [
    '🏆 2009 North Shore Chili Cookoff — Winner',
    '🏆 2010 Lake Bluff Ribfest — Winner',
    '🥈 2008 Northfield Ribfest — Top 3',
    '🥈 2010 North Shore Chili Cookoff — Top 3',
    '🥈 2011 Des Plaines Rib, Chicken & Sausage Winter Burn Off — Top 3',
    '🔪 Member, Butcher\'s Guild',
    '🔥 Member, Illinois Barbecue Association',
    '🎙️ As Featured on America\'s Test Kitchen "Proof" Podcast',
];

type TeamMember = { name: string; role: string; photo?: string | null; bio?: string | null };
type TimelineItem = { era: string; title: string; body?: string | null };
type Accolade = { text: string };

export default async function OurStoryPage() {
    // 5-star Google reviews + overall rating (null until GOOGLE_PLACES_API_KEY is set — then Yelp-only).
    const google = await getGoogleReviews({ minRating: 5 });
    const wallReviews = [...(google?.reviews ?? []), ...REVIEWS];
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let team: TeamMember[] = FALLBACK_TEAM;
    let timeline: TimelineItem[] = FALLBACK_TIMELINE;
    let accolades: string[] = FALLBACK_ACCOLADES;

    try {
        const [rawTeam, rawTimeline, rawAccolades] = await Promise.all([
            sanityClient.fetch(TEAM_MEMBERS_QUERY),
            sanityClient.fetch(TIMELINE_QUERY),
            sanityClient.fetch(ACCOLADES_QUERY),
        ]);
        if (rawTeam?.length) {
            /* Merge local fallback photos for members missing a Sanity photo */
            const fallbackMap = new Map(FALLBACK_TEAM.map((m) => [m.name.toLowerCase(), m.photo]));
            team = rawTeam.map((m: TeamMember) => ({
                ...m,
                photo: m.photo || fallbackMap.get(m.name.toLowerCase()) || '/team/placeholder.jpg',
            }));
        }
        if (rawTimeline?.length) timeline = rawTimeline;
        if (rawAccolades?.length) accolades = rawAccolades.map((a: Accolade) => a.text);

        /* Always ensure The Depot entry exists in the timeline */
        const hasDepot = timeline.some((t) => /depot/i.test(t.title));
        if (!hasDepot) {
            timeline = [...timeline, FALLBACK_TIMELINE[FALLBACK_TIMELINE.length - 1]];
        }
    } catch {
        // fallback to hardcoded
    }

    return (
        <main className={styles.page}>

            {/* ── Hero ── */}
                <section id="our-story-hero" aria-labelledby="our-story-hero-heading" className={styles.hero}>
                    <video
                        src="/video-clips/meat-truck.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className={`${styles.heroBgVideo} mask-fade-bottom`}
                    />
                    <div className={`${styles.heroOverlay} mask-fade-bottom`} />
                    <div className={`container ${styles.heroInner}`}>
                            <h1 id="our-story-hero-heading" className={styles.headline}>
                                Respect For the Past.<br />
                                <em>With An Eye To The Future.</em>
                            </h1>
                            <p className={styles.sub}>
                                Sean Hofherr carries on a legacy that began with a village butcher in Germany, carried across the ocean by his immigrant great-grandfather who built the original Hofherr Meat Company on Chicago&apos;s South Side. Now Sean is bringing that name — and that heritage — back to Chicago&apos;s stockyard history.
                            </p>
                    </div>
                </section>

                {/* ── Heritage Gallery ── */}
                    <section id="heritage" aria-label="Hofherr heritage gallery" className={styles.heritage}>
                        <div className="container">
                            <div className={styles.heritageGrid}>
                                <HoverVideo src="/video-clips/storykeeper.mp4" caption="The original Hofherr Wholesale Meats storefront" />
                                <HoverVideo src="/video-clips/Photo_To_Video_Conversion.mp4" poster="/history/Photo_To_Video_Conversion.mp4.jpg" caption="The Hofherr family — brought to life" />
                                <HoverVideo src="/video-clips/inside.mp4" poster="/history/shop-interior.jpg" caption="Inside the original shop — Chicago&apos;s South Side" />
                                <HoverVideo src="/video-clips/truck.mp4" caption="Hofherr Meat Co. — on the road" />
                                <div className={styles.heritageFullWidth}>
                                    <HoverVideo src="/video-clips/more.mp4" caption="More from the Hofherr archives" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── The Man ── */}
                        <section id="founder" aria-labelledby="founder-heading" className={styles.bio}>
                            <div className={`container ${styles.founderHeader}`}>
                                <span className={styles.sectionLabelCentered}><span>—</span> Our Founder <span>—</span></span>
                                <h2 id="founder-heading" className={styles.founderTitle}>Meet Sean Hofherr</h2>
                                <p className={styles.founderSub}>Owner, head chef, and the driving force behind Hofherr Meat Co.</p>
                            </div>
                            <div className="container">
                                <div className={styles.seanCard}>
                                    <div className={styles.seanImagePart}>
                                        <Image
                                            src="/team/sean.jpg"
                                            alt="Sean Hofherr"
                                            fill
                                            sizes="(max-width: 900px) 100vw, 50vw"
                                            className={styles.avatarImg}
                                            data-parallax="inset"
                                        />
                                    </div>
                                    <div className={styles.seanContentPart}>
                                        <span className={styles.teamRole}>Owner &amp; Head Chef</span>
                                        <h3 className={styles.teamName}>Sean Hofherr</h3>
                                        <div className={styles.teamDivider} />
                                        <p className={styles.teamBio}>
                                            Sean honed his culinary and food preparation skills in numerous kitchens and cooking competitions over the years, winning a host of accolades for his many signature dishes. He began his career in the food industry at renowned steakhouse Keefer&apos;s Restaurant in Chicago&apos;s River North. He continued to nurture his passion at the cutting board during an apprenticeship at Zier&apos;s Prime Meats in Wilmette. Most recently, Sean served as kitchen director at Stormy&apos;s Tavern in Northfield, where his culinary creations garnered widespread acclaim from locals and the press alike.
                                        </p>
                                        <p className={`${styles.teamBio} ${styles.teamBioSpaced}`}>
                                            In March 2014, he opened Hofherr Meat Co. at 300 Happ Rd, Northfield. The mission is simple: <strong>Quality meats. No compromise.</strong>
                                        </p>
                                        <p className={`${styles.teamBio} ${styles.teamBioSpaced}`}>
                                            In 2024, Sean expanded the Hofherr footprint with <strong>The Depot</strong> — a second location inside the historic Winnetka Elm Street Metra Train Station.
                                        </p>
                                        <Link href="/visit" className={`btn btn-primary ${styles.seanVisitBtn}`}>
                                            Come Visit Us
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Meet the Team ── */}
                            <section id="team" aria-labelledby="team-heading" className={styles.team}>
                                <div className="container">
                                    <div className={styles.teamHeader}>
                                        <span className={styles.sectionLabelCentered}><span>—</span> The Crew <span>—</span></span>
                                        <h2 id="team-heading" className={styles.teamTitle}>Meet the Team</h2>
                                        <p className={styles.teamSub}>
                                            Every great butcher shop is built by its people. Here&apos;s the crew that makes HMC run.
                                        </p>
                                    </div>
                                    <TeamBentoGrid team={team} />
                                </div>
                            </section>

                            {/* ── Timeline ── */}
                            <InteractiveTimeline events={timeline} />

                            {/* ── Accolades — current version ── */}
                            <AccoladesVariants accolades={accolades} />


                            {/* ── Reviews wall — live 5-star Google reviews + Yelp reviews supplied by the owner (REVIEWS above). ── */}
                            <TestimonialWall
                                reviews={wallReviews}
                                summary={google ? { rating: google.rating, count: google.count, url: google.url, source: 'Google' } : null}
                            />

                            {/* ── CTA ── */}
                            <section id="visit-cta" aria-labelledby="visit-cta-heading" className={styles.cta}>
                                <div className="container">
                                    <h2 id="visit-cta-heading">Come see what a real butcher shop looks like.</h2>
                                    <p>
                                        <Image src="/icons/butcher-pin-sm.svg" alt="" aria-hidden="true" width={16} height={16} className={styles.ctaPinIcon} />
                                        <span>The Butcher Shop — 300 Happ Rd, Northfield</span>
                                        <span className={styles.ctaDividerDot}>·</span>
                                        <Image src="/icons/depot-pin-sm.svg" alt="" aria-hidden="true" width={16} height={16} className={styles.ctaPinIcon} />
                                        <span>The Depot — 754 Elm St, Winnetka</span>
                                    </p>
                                    <div className={styles.ctaBtns}>
                                        <Link href="/online-orders" className="btn btn-primary">
                                            <FireBorder active={true} radius={6} />
                                            <span>Order Online</span>
                                        </Link>
                                        <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                                    </div>
                                </div>
                            </section>

                            </main>
                            );
}

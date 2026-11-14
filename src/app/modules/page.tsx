import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Hero from '@/components/home/Hero';
import SeasonalBanner from '@/components/home/SeasonalBanner';
import Specials from '@/components/home/Specials';
import Process from '@/components/home/Process';
import AwardsSection from '@/components/home/AwardsSection';
import TrustBar from '@/components/home/TrustBar';
import WeeklyPicks from '@/components/home/WeeklyPicks';
import MenuHighlights from '@/components/home/MenuHighlights';
import StoryTeaser from '@/components/home/StoryTeaser';
import SourcingStrip from '@/components/home/SourcingStrip';
import CutGuide from '@/components/home/CutGuide';
import RecipeTeasers from '@/components/home/RecipeTeasers';
import GalleryStrip from '@/components/home/GalleryStrip';
import Reviews from '@/components/home/Reviews';
import OrderCTABanner from '@/components/home/OrderCTABanner';
import CateringCTA from '@/components/home/CateringCTA';
import QuotesSection from '@/components/home/QuotesSection';
import HiringChatbox from '@/components/home/HiringChatbox';
import Newsletter from '@/components/home/Newsletter';
import NewsletterInline from '@/components/NewsletterInline';
import TeamBentoGrid from '@/components/TeamBentoGrid';
import InteractiveTimeline from '@/components/InteractiveTimeline';
import AccoladesVariants from '@/components/AccoladesVariants';
import TestimonialWall from '@/components/TestimonialWall/TestimonialWall';
import CateringHeroAndProcess from '@/app/catering/CateringHeroAndProcess';
import CateringMarquee from '@/components/CateringMarquee';
import CateringHub from '@/app/catering/CateringHub';
import CateringCalendar from '@/components/CateringCalendar';
import BBQHub from '@/app/bbq/BBQHub';
import CateringCalculator from '@/app/bbq/CateringCalculator';
import MosaicServices from '@/app/bbq/MosaicServices';
import AccordionServices from '@/app/bbq/AccordionServices';
import CateringModule from '@/app/specials/CateringModule';
import PigRoastCalculator from '@/app/specials/PigRoastCalculator';
import VideoCallout from '@/components/specials/VideoCallout';
import HelpOrdering from '@/components/online-orders/HelpOrdering';
import CutCollector from '@/components/dashboard/CutCollector';
import FooterMap from '@/components/FooterMap';
import { DEMO_ORDERS } from '@/app/dashboard/demoData';
import styles from './page.module.css';

const IS_DEV = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
    title: 'All Modules Catalog | Hofherr Meat Co.',
    description: 'Live developer directory of all mounted and library UI modules across Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

const SAMPLE_TEAM = [
    {
        name: 'Sean Hofherr',
        role: 'Owner & Head Chef',
        photo: '/assets/team/sean-hofherr-safety-seal.jpg',
        bio: 'Carrying on 120+ years of family butchery heritage from Chicago’s South Side to Northfield & Winnetka.',
    },
    {
        name: 'Vincent Recaei',
        role: 'Manager',
        photo: '/team/vincent.jpg',
        bio: 'Manages daily shop operations, vendor relationships, and floor standards across Hofherr Meat Co.',
    },
    {
        name: 'Emily Cushing',
        role: 'Butcher',
        photo: '/team/emily.jpg',
        bio: 'UW–Platteville Meat Processing graduate specializing in whole-animal breakdown and custom cuts.',
    },
    {
        name: 'Dan Blair',
        role: 'Butcher',
        photo: '/team/dan.jpg',
        bio: 'Northfield native bringing decades of meat-counter craft and cooking guidance to every order.',
    },
];

const SAMPLE_TIMELINE = [
    {
        era: 'Late 1800s',
        title: 'The Old Country',
        body: 'A Hofherr great-great-grandfather plies his trade as a village butcher in Germany.',
    },
    {
        era: 'Early 1900s',
        title: "Chicago's South Side",
        body: 'Establishes the original Hofherr Meat Company among Chicago’s historic stockyard community.',
    },
    {
        era: 'March 2014',
        title: 'Hofherr Meat Co. Opens',
        body: '300 Happ Rd, Northfield — every cut made to order and traceable to a named Midwest family farm.',
        video: '/video-clips/stage-fire.mp4',
    },
    {
        era: '2024',
        title: 'The Depot Opens',
        body: 'Second location opens inside the historic Winnetka Elm Street Metra Station.',
    },
];

const SAMPLE_SERVICES = [
    {
        title: 'Whole-Pig Roasts',
        emoji: '🐖',
        description: 'Full-service on-site whole hog roast carved live by our pitmasters.',
        linkLabel: 'Build Package',
        linkUrl: '/catering#build-your-package',
    },
    {
        title: 'Game Day & Tailgate',
        emoji: '🏈',
        description: 'Rib tips, brisket sliders, house sausages, and wings hot-packed for kickoff.',
        linkLabel: 'Order Spread',
        linkUrl: '/catering',
    },
    {
        title: 'Business Buffets',
        emoji: '💼',
        description: 'Turnkey hot sandwich bars, charcuterie boards, and executive lunches.',
        linkLabel: 'Inquire',
        linkUrl: '/catering',
    },
    {
        title: 'Concert Picnic Baskets',
        emoji: '🧺',
        description: 'Ravinia-ready artisan charcuterie, cheeses, sandwiches, and sides.',
        linkLabel: 'Reserve Basket',
        linkUrl: '/specials',
    },
    {
        title: 'Private Meat Sessions',
        emoji: '🔪',
        description: 'Hands-on whole-animal butchery demonstrations and private tastings.',
        linkLabel: 'Ask Sean',
        linkUrl: 'tel:8474416328',
    },
];

interface ModuleEntry {
    id: string;
    name: string;
    file: string;
    liveRoute?: string;
    padded?: boolean;
    node: React.ReactNode;
}

const MODULES: ModuleEntry[] = [
    { id: 'mod-hero', name: 'Hero (Home)', file: 'src/components/home/Hero.tsx', liveRoute: '/', node: <Hero /> },
    { id: 'mod-seasonal-banner', name: 'SeasonalBanner', file: 'src/components/home/SeasonalBanner.tsx', liveRoute: '/', node: <SeasonalBanner /> },
    { id: 'mod-home-specials', name: 'Specials (Home)', file: 'src/components/home/Specials.tsx', liveRoute: '/', node: <Specials /> },
    { id: 'mod-process', name: 'Process (How It Works)', file: 'src/components/home/Process.tsx', liveRoute: '/#how-it-works', node: <Process /> },
    { id: 'mod-awards', name: 'AwardsSection', file: 'src/components/home/AwardsSection.tsx', node: <AwardsSection /> },
    { id: 'mod-trust-bar', name: 'TrustBar', file: 'src/components/home/TrustBar.tsx', node: <TrustBar /> },
    { id: 'mod-weekly-picks', name: 'WeeklyPicks', file: 'src/components/home/WeeklyPicks.tsx', node: <WeeklyPicks /> },
    { id: 'mod-menu-highlights', name: 'MenuHighlights', file: 'src/components/home/MenuHighlights.tsx', node: <MenuHighlights /> },
    { id: 'mod-story-teaser', name: 'StoryTeaser', file: 'src/components/home/StoryTeaser.tsx', node: <StoryTeaser /> },
    { id: 'mod-sourcing-strip', name: 'SourcingStrip', file: 'src/components/home/SourcingStrip.tsx', node: <SourcingStrip /> },
    { id: 'mod-home-cut-guide', name: 'CutGuide (Home)', file: 'src/components/home/CutGuide.tsx', node: <CutGuide /> },
    { id: 'mod-recipe-teasers', name: 'RecipeTeasers', file: 'src/components/home/RecipeTeasers.tsx', node: <RecipeTeasers /> },
    { id: 'mod-gallery-strip', name: 'GalleryStrip', file: 'src/components/home/GalleryStrip.tsx', node: <GalleryStrip /> },
    { id: 'mod-home-reviews', name: 'Reviews (Home)', file: 'src/components/home/Reviews.tsx', node: <Reviews /> },
    { id: 'mod-order-cta-banner', name: 'OrderCTABanner', file: 'src/components/home/OrderCTABanner.tsx', node: <OrderCTABanner /> },
    { id: 'mod-catering-cta', name: 'CateringCTA', file: 'src/components/home/CateringCTA.tsx', node: <CateringCTA /> },
    { id: 'mod-quotes-section', name: 'QuotesSection', file: 'src/components/home/QuotesSection.tsx', node: <QuotesSection /> },
    { id: 'mod-hiring-chatbox', name: 'HiringChatbox', file: 'src/components/home/HiringChatbox.tsx', padded: true, node: <HiringChatbox /> },
    { id: 'mod-newsletter', name: 'Newsletter (Full Section)', file: 'src/components/home/Newsletter.tsx', liveRoute: '/', node: <Newsletter /> },
    { id: 'mod-newsletter-inline', name: 'NewsletterInline', file: 'src/components/NewsletterInline.tsx', liveRoute: '/specials', padded: true, node: <NewsletterInline /> },
    { id: 'mod-team-bento', name: 'TeamBentoGrid', file: 'src/components/TeamBentoGrid.tsx', liveRoute: '/our-story#team', padded: true, node: <TeamBentoGrid team={SAMPLE_TEAM} /> },
    { id: 'mod-timeline', name: 'InteractiveTimeline', file: 'src/components/InteractiveTimeline.tsx', liveRoute: '/our-story', node: <InteractiveTimeline events={SAMPLE_TIMELINE} /> },
    { id: 'mod-accolades', name: 'AccoladesVariants', file: 'src/components/AccoladesVariants.tsx', liveRoute: '/our-story', node: <AccoladesVariants /> },
    { id: 'mod-testimonial-wall', name: 'TestimonialWall', file: 'src/components/TestimonialWall/TestimonialWall.tsx', liveRoute: '/our-story', node: <TestimonialWall /> },
    { id: 'mod-catering-hero-process', name: 'CateringHeroAndProcess', file: 'src/app/catering/CateringHeroAndProcess.tsx', node: <CateringHeroAndProcess /> },
    { id: 'mod-catering-marquee', name: 'CateringMarquee', file: 'src/components/CateringMarquee.tsx', liveRoute: '/catering', node: <CateringMarquee id="modules-catering-marquee" /> },
    { id: 'mod-catering-hub', name: 'CateringHub', file: 'src/app/catering/CateringHub.tsx', liveRoute: '/catering#build-your-package', padded: true, node: <CateringHub events={[]} calendarPricing={[]} /> },
    { id: 'mod-catering-calendar', name: 'CateringCalendar', file: 'src/components/CateringCalendar.tsx', liveRoute: '/catering', padded: true, node: <CateringCalendar events={[]} /> },
    { id: 'mod-bbq-hub', name: 'BBQHub', file: 'src/app/bbq/BBQHub.tsx', padded: true, node: <BBQHub events={[]} calendarPricing={[]} /> },
    { id: 'mod-bbq-calculator', name: 'CateringCalculator (BBQ)', file: 'src/app/bbq/CateringCalculator.tsx', padded: true, node: <CateringCalculator /> },
    { id: 'mod-mosaic-services', name: 'MosaicServices', file: 'src/app/bbq/MosaicServices.tsx', liveRoute: '/bbq', padded: true, node: <MosaicServices services={SAMPLE_SERVICES} /> },
    { id: 'mod-accordion-services', name: 'AccordionServices', file: 'src/app/bbq/AccordionServices.tsx', padded: true, node: <AccordionServices services={SAMPLE_SERVICES} /> },
    { id: 'mod-catering-module', name: 'CateringModule (Pig Roast Hub)', file: 'src/app/specials/CateringModule.tsx', padded: true, node: <CateringModule events={[]} calendarPricing={[]} /> },
    { id: 'mod-pig-roast-calculator', name: 'PigRoastCalculator', file: 'src/app/specials/PigRoastCalculator.tsx', padded: true, node: <PigRoastCalculator /> },
    {
        id: 'mod-video-callout',
        name: 'VideoCallout',
        file: 'src/components/specials/VideoCallout.tsx',
        liveRoute: '/specials',
        padded: true,
        node: (
            <VideoCallout
                image="/assets/specials-pig-roast.jpg"
                video="/video-clips/stage-fire.mp4"
                alt="Whole Hog Roast Over Hardwood Coals"
                title="Hardwood Pit Craft"
                sub="Slow-roasted whole hogs & smoked prime briskets"
            />
        ),
    },
    { id: 'mod-help-ordering', name: 'HelpOrdering', file: 'src/components/online-orders/HelpOrdering.tsx', liveRoute: '/online-orders#help-ordering', node: <HelpOrdering /> },
    {
        id: 'mod-cut-collector',
        name: 'CutCollector',
        file: 'src/components/dashboard/CutCollector.tsx',
        liveRoute: '/test-cut-collection',
        padded: true,
        node: <CutCollector orders={DEMO_ORDERS} isAuthenticated={true} userName="Dev Preview" isTestPage={true} />,
    },
    { id: 'mod-footer-map', name: 'FooterMap', file: 'src/components/FooterMap.tsx', liveRoute: '/', node: <FooterMap /> },
];

export default function AllModulesPage() {
    if (!IS_DEV) notFound();

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className={`container ${styles.headerInner}`}>
                    <h1 className={styles.title}>
                        ALL SITE <span className={styles.titleAccent}>MODULES</span> ({MODULES.length})
                    </h1>
                    <p className={styles.subtitle}>
                        Every mounted and library UI module rendered live on one page. Gold dots indicate modules currently mounted on live routes; red dots indicate standalone library modules.
                    </p>
                    <nav className={styles.jumpGrid} aria-label="Jump to module">
                        {MODULES.map((mod) => (
                            <a key={mod.id} href={`#${mod.id}`} className={styles.jumpPill}>
                                <span className={mod.liveRoute ? styles.jumpDotLive : styles.jumpDotLibrary} aria-hidden="true" />
                                <span>{mod.name}</span>
                            </a>
                        ))}
                    </nav>
                </div>
            </header>

            {MODULES.map((mod) => (
                <section
                    key={mod.id}
                    id={mod.id}
                    aria-labelledby={`${mod.id}-heading`}
                    className="section-sm"
                >
                    <div className="container">
                        <div className={styles.moduleFrame}>
                            <div className={styles.metaBar}>
                                <div className={styles.metaLeft}>
                                    <h2 id={`${mod.id}-heading`} className={styles.modTitle}>
                                        {mod.name}
                                    </h2>
                                    <span className={mod.liveRoute ? styles.statusLive : styles.statusUnmounted}>
                                        {mod.liveRoute ? 'Mounted Live' : 'Unmounted Module'}
                                    </span>
                                </div>
                                <div className={styles.metaRight}>
                                    <code className={styles.fileCode}>{mod.file}</code>
                                    {mod.liveRoute && (
                                        <Link href={mod.liveRoute} className={styles.routeLink}>
                                            Open on {mod.liveRoute} →
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className={mod.padded ? styles.paddedSurface : styles.previewSurface}>
                                {mod.node}
                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </main>
    );
}


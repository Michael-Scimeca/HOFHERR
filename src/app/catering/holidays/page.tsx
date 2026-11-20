import type { Metadata } from 'next';
import HolidayCateringClient from './HolidayCateringClient';

export const metadata: Metadata = {
    title: 'Holiday & Event Catering Guide | Thanksgiving Turkeys & Prime Rib | Hofherr Meat Co.',
    description:
        'Order fresh Thanksgiving turkeys, standing Prime rib roasts, and holiday catering in Northfield & Winnetka, IL. Signature cuts, lead times & event packages.',
    keywords: [
        'Thanksgiving turkey order Northfield',
        'holiday roast pre-order North Shore',
        'standing Prime rib roast Winnetka',
        'Passover brisket butcher Chicago North Shore',
        'holiday catering Northfield IL',
        'Hofherr Meat Co holidays',
    ],
    alternates: { canonical: 'https://hofherrmeatco.com/catering/holidays' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Holiday & Event Catering Guide | Hofherr Meat Co.',
        description:
            'Every holiday selling point plus the year-round occasions people come in to get catering from Hofherr Meat Co.',
        url: 'https://hofherrmeatco.com/catering/holidays',
        images: [{ url: '/OG/og-catering.jpg', width: 1200, height: 630, alt: 'Holiday & Event Catering Guide — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Holiday & Event Catering Guide | Hofherr Meat Co.',
        description:
            'Selling points for every major holiday plus the year-round occasions that drive catering at Hofherr Meat Co.',
    },
};

export default function HolidayCateringGuidePage() {
    return <HolidayCateringClient />;
}

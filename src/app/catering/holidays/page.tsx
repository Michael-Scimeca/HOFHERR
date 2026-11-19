import type { Metadata } from 'next';
import HolidayCateringClient from './HolidayCateringClient';

export const metadata: Metadata = {
    title: 'Holiday & Event Catering Guide | Hofherr Meat Co. — Northfield, IL',
    description:
        'Holiday selling points, signature cuts, lead times, and year-round North Shore catering occasions — from Thanksgiving turkeys and Prime rib roasts to graduations, Ravinia picnics, block parties, and corporate buffets.',
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

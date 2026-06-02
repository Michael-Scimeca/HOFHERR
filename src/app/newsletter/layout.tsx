import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Hofherr Weekly Newsletter | Hofherr Meat Co.',
    description:
        'Subscribe to The Hofherr Weekly — every Tuesday: featured cuts, butcher picks, seasonal arrivals, and first dibs on holiday pre-orders. One email, no spam.',
    alternates: { canonical: 'https://hofherrmeatco.com/newsletter' },
    openGraph: {
        title: 'The Hofherr Weekly Newsletter',
        description:
            'Weekly specials, butcher picks, and holiday pre-order access from Hofherr Meat Co. in Northfield, IL.',
        url: 'https://hofherrmeatco.com/newsletter',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'Newsletter — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Hofherr Weekly Newsletter',
        description: 'Weekly cuts, specials & holiday early access. Subscribe free.',
    },
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

import type { Metadata } from 'next';
import VisitClient from './VisitClient';

export const metadata: Metadata = {
    title: 'Hours & Directions | Butcher Shop Northfield & Winnetka, IL | Hofherr Meat Co.',
    description: 'Two locations: The Butcher Shop at 300 Happ Rd, Northfield IL (Tue–Sun) and The Depot at 754 Elm St inside the Winnetka Elm Street Metra Station (Mon–Fri). Get hours, directions, and parking info.',
    alternates: { canonical: 'https://hofherrmeatco.com/visit' },
    openGraph: {
        title: 'Visit Hofherr Meat Co. | Northfield & Winnetka, IL',
        description: 'The Butcher Shop: 300 Happ Rd, Northfield — Tue–Sun. The Depot: 754 Elm St, Winnetka Metra Station — Mon–Fri. Free parking at both.',
        url: 'https://hofherrmeatco.com/visit',
        images: [{ url: '/OG/og-visit.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Visit Hofherr Meat Co. | Two Locations',
        description: 'Northfield (Tue–Sun) & Winnetka Metra Station (Mon–Fri). Premium butcher shop on Chicago\'s North Shore.',
    },
};

export default function VisitPage() {
    return <VisitClient />;
}

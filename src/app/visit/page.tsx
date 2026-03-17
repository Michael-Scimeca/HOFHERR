import type { Metadata } from 'next';
import VisitClient from './VisitClient';

export const metadata: Metadata = {
    title: 'Visit Us | Two Locations — Northfield & Winnetka | Hofherr Meat Co.',
    description: 'Hofherr Meat Co. has two locations: The Butcher Shop at 300 Happ Rd, Northfield, and The Depot at 754 Elm St inside the Winnetka Elm Street Metra Station. Get hours, directions, and parking info.',
    alternates: { canonical: 'https://hofherrmeatco.com/visit' },
    openGraph: {
        title: 'Visit Hofherr Meat Co. | Two Locations in Northfield & Winnetka',
        description: 'Open Tuesday through Sunday at The Butcher Shop. Monday through Friday at The Depot. Free parking at both locations.',
        url: 'https://hofherrmeatco.com/visit',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export default function VisitPage() {
    return <VisitClient />;
}

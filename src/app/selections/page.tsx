import type { Metadata } from 'next';
import SelectionsClient from './SelectionsClient';

export const metadata: Metadata = {
    title: 'Our Selections & Butcher Boards — Hofherr Meat Co. | Northfield & Winnetka, IL',
    description:
        'Explore Hofherr Meat Co. selections: 100% vegetarian-fed, hormone- and antibiotic-free Midwest beef, heritage pork, pasture poultry, lamb, exotic game, 18+ housemade sausages, 6 signature sandwiches, 24-hour bone broths, prepared meals, and BBQ supplies.',
    alternates: { canonical: 'https://hofherrmeatco.com/selections' },
    openGraph: {
        title: 'Our Selections & Butcher Boards | Hofherr Meat Co.',
        description:
            'Custom-cut prime & dry-aged beef, heritage pork, pasture poultry, lamb, exotic game, house charcuterie, 6 signature sandwiches, and scratch soups.',
        url: 'https://hofherrmeatco.com/selections',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'Selections — Hofherr Meat Co.' }],
    },
};

export default function SelectionsPage() {
    return <SelectionsClient />;
}

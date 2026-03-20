import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'HOFHERR MEAT CO. — Order Online | Custom Cuts, Produce, Pantry & More',
    description:
        'Order premium custom-cut meat, produce, dairy, and pantry essentials online from Hofherr Meat Co. Dry-aged steaks, house-made sausage, Berkshire pork, specialty cuts — ready for pickup at our Northfield or Winnetka Depot location.',
    alternates: { canonical: 'https://hofherrmeatco.com/online-orders' },
    keywords: [
        'custom cut meat online', 'order butcher online Illinois',
        'dry aged steak order online', 'Northfield butcher shop',
        'Northfield IL meat', 'Winnetka Depot', 'online meat order pickup',
        'Hofherr Meat Co online orders', 'specialty cuts Chicago suburbs',
        'North Shore butcher', 'produce Winnetka', 'grab and go',
    ],
    openGraph: {
        title: 'Order Online | Hofherr Meat Co. — Northfield & Winnetka, IL',
        description:
            'Shop our full menu of premium cuts, produce & pantry items online. Dry-aged beef, Berkshire pork, lamb, house sausage & more — pick up at Northfield or The Depot in Winnetka.',
        url: 'https://hofherrmeatco.com/online-orders',
        images: [{ url: '/OG/og-image.png', width: 1200, height: 630, alt: 'Order Online — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Order Online | Hofherr Meat Co.',
        description: 'Dry-aged steaks, Berkshire pork, produce & pantry — order online, pick up at Northfield or The Depot in Winnetka.',
        images: ['/OG/og-image.png'],
    },
};

export default function OnlineOrdersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

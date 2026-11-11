import type { Metadata } from 'next';
import ProductIdentityClient from './ProductIdentityClient';

export const metadata: Metadata = {
    title: 'Brand Identity, Packaging & Website Production Kit | Hofherr Meat Co.',
    description:
        'Official brand identity, packaging standards, and digital production kit for Hofherr Meat Co. Features the physical packaging suite, 10-department vector marks, Gemini Nano Banana prompts, and brand guidelines.',
    alternates: {
        canonical: 'https://hofherrmeatco.com/product-identity',
    },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Brand Identity, Packaging & Website Production Kit | Hofherr Meat Co.',
        description:
            'Craft butchery brand standards since 1903. Complete packaging suite, 10-department vector marks, Gemini Nano Banana prompts, and website production kit.',
        url: 'https://hofherrmeatco.com/product-identity',
        images: [
            {
                url: '/assets/identity/butcher-complete-packaging-suite-10-icons.jpg',
                width: 1200,
                height: 630,
                alt: 'Hofherr Meat Co. — Brand Identity & Packaging Suite',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Brand Identity, Packaging & Website Production Kit | Hofherr Meat Co.',
        description:
            'Craft butchery brand standards since 1903. Complete packaging suite, 10-department vector marks, and website production kit.',
        images: ['/assets/identity/butcher-complete-packaging-suite-10-icons.jpg'],
    },
    robots: { index: false, follow: false },
};

export default function ProductIdentityPage() {
    return <ProductIdentityClient />;
}


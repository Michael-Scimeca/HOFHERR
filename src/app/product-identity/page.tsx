import type { Metadata } from 'next';
import ProductIdentityClient from './ProductIdentityClient';

export const metadata: Metadata = {
    title: 'Product Identity & Packaging System | Hofherr Meat Co.',
    description:
        'Explore the Hofherr Meat Co. physical product identity system: custom printed butcher wrapping paper, die-cut flame-linocut department stickers, counter scale seals, and turned-wood rubber ink stamps.',
    robots: { index: false, follow: false },
};

export default function ProductIdentityPage() {
    return <ProductIdentityClient />;
}


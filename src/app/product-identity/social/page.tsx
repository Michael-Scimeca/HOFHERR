import type { Metadata } from 'next';
import ProductIdentityClient from '../ProductIdentityClient';

export const metadata: Metadata = {
    title: 'Product Identity, Packaging & Social Media Kit | Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

export default function Page() {
    return <ProductIdentityClient />;
}

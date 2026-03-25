import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
    title: 'Checkout | Hofherr Meat Co.',
    description: 'Complete your order with Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

export default function CheckoutPage() {
    return <CheckoutClient />;
}

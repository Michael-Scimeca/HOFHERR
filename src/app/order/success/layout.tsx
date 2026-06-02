import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Order Success | Hofherr Meat Co.',
    description: 'Your order has been confirmed. Thank you for shopping at Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

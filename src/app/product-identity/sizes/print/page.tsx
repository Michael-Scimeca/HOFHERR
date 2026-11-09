import { Suspense } from 'react';
import type { Metadata } from 'next';
import PrintAtSize from './PrintAtSize';

export const metadata: Metadata = { title: 'Print at Size | Hofherr Meat Co.', robots: { index: false, follow: false } };

export default function Page() {
    return <Suspense fallback={<div className="route-loading" aria-busy="true" />}><PrintAtSize /></Suspense>;
}

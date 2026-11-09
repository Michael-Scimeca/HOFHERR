import type { Metadata } from 'next';
import SizeStudio from './SizeStudio';

export const metadata: Metadata = { title: 'Print Sizes | Hofherr Meat Co.', robots: { index: false, follow: false } };

export default function Page() {
    return <SizeStudio />;
}

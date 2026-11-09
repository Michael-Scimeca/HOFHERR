import type { Metadata } from 'next';
import PrintKit from './PrintKit';

export const metadata: Metadata = {
    title: 'Print Test Kit | Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

export default function Page() {
    return <PrintKit />;
}

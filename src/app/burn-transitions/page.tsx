import type { Metadata } from 'next';
import BurnTransitionsLab from './BurnTransitionsLab';

export const metadata: Metadata = {
    title: '20 Page Burn-Out Transitions Lab — Hofherr Meat Co.',
    description: 'Interactive showcase of 10 HTML/CSS/SVG and 10 Canvas procedural page burn-out transitions.',
    robots: { index: false, follow: false },
};

export default function BurnTransitionsPage() {
    return <BurnTransitionsLab />;
}


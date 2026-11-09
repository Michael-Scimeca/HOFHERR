import type { Metadata } from 'next';
import PitchDeckClient from './PitchDeckClient';

export const metadata: Metadata = {
    title: 'Review Audit & Growth Pitch Deck | Hofherr Meat Co.',
    description:
        'Strategic pitch deck analyzing Yelp and Facebook reviews for Hofherr Meat Co. — how to fix customer pain points and scale core strengths.',
    robots: { index: false, follow: false },
};

export default function PitchDeckPage() {
    return <PitchDeckClient />;
}

import type { Metadata } from 'next';
import TestimonialWall from './TestimonialWall';

export const metadata: Metadata = {
    title: 'Testimonial Wall (test) | Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

export default function Page() {
    return <TestimonialWall />;
}

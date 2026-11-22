import type { Metadata } from 'next';
import SocialKit from './SocialKit';

export const metadata: Metadata = {
    title: 'Social Media Profiles & Kit (IG · FB · X) | Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

export default function Page() {
    return <SocialKit />;
}

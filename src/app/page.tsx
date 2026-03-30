import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import SeasonalBanner from '@/components/home/SeasonalBanner';
import Specials from '@/components/home/Specials';
import Process from '@/components/home/Process';

import Newsletter from '@/components/home/Newsletter';
import dynamic from 'next/dynamic';

const AwardsSection = dynamic(() => import('@/components/home/AwardsSection'), { ssr: true });
export const metadata: Metadata = {
  title: 'Hofherr Meat Co. | Premium Butcher Shop — Northfield, IL',
  description:
    'Craft butchery since 1903. Order online for custom cuts, dry-aged USDA prime beef, rotisserie chicken, and world-class BBQ catering. 300 Happ Rd, Northfield & Winnetka Depot.',
  alternates: { canonical: 'https://hofherrmeatco.com' },
  openGraph: {
    title: 'Hofherr Meat Co. | Premium Butcher Shop — Northfield, IL',
    description:
      'Craft butchery since 1903. Custom cuts, dry-aged USDA prime beef, rotisserie chicken, pig roasts & full catering. Order online for curbside pickup.',
    url: 'https://hofherrmeatco.com',
    images: [{ url: '/OG/og-home.png', width: 1200, height: 630, alt: 'Hofherr Meat Co. — Premium Butcher Shop, Northfield IL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hofherr Meat Co. | Premium Butcher Shop — Northfield, IL',
    description: 'Craft butchery since 1903. Order online for custom cuts, dry-aged beef & catering. Northfield, IL.',
    images: ['/OG/og-home.png'],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SeasonalBanner />
      <Specials />
      <Process />

      <Newsletter />
    </>
  );
}

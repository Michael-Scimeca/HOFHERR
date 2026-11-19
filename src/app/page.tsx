import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import SeasonalBanner from '@/components/home/SeasonalBanner';
import SignatureDishesSection from '@/components/SignatureDishesSection';
import RecipesTeaser from '@/components/home/RecipesTeaser';
import StoryTeaser from '@/components/home/StoryTeaser';

import Newsletter from '@/components/home/Newsletter';

export const metadata: Metadata = {
  title: 'Hofherr Meat Co. | Premium Butcher Shop — Northfield, IL',
  description:
    'Craft butchery since 1903. Order online for custom cuts, dry-aged USDA prime beef, rotisserie chicken, and world-class BBQ catering. 300 Happ Rd, Northfield & Winnetka Depot.',
  alternates: { canonical: 'https://hofherrmeatco.com' },
  openGraph: {
    siteName: 'Hofherr Meat Co.',
    type: 'website',
    locale: 'en_US',
    title: 'Hofherr Meat Co. | Premium Butcher Shop — Northfield, IL',
    description:
      'Craft butchery since 1903. Custom cuts, dry-aged USDA prime beef, rotisserie chicken, pig roasts & full catering. Order online for curbside pickup.',
    url: 'https://hofherrmeatco.com',
    images: [{ url: '/OG/og-home.jpg', width: 1200, height: 630, alt: 'Hofherr Meat Co. — Premium Butcher Shop, Northfield IL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hofherr Meat Co. | Premium Butcher Shop — Northfield, IL',
    description: 'Craft butchery since 1903. Order online for custom cuts, dry-aged beef & catering. Northfield, IL.',
    images: ['/OG/og-home.jpg'],
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SeasonalBanner />
      <SignatureDishesSection />
      <RecipesTeaser />
      <StoryTeaser />
      <Newsletter />
    </main>
  );
}

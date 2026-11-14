import type { Metadata } from 'next';
import GreensAndEmblemsClient from './GreensAndEmblemsClient';

export const metadata: Metadata = {
  title: 'Site Greens & Emblems Inventory | Hofherr Meat Co.',
  description: 'Visual inventory of every green color token and every brand emblem, stamp, seal, and department icon across Hofherr Meat Co.',
};

export default function GreensAndEmblemsPage() {
  return <GreensAndEmblemsClient />;
}


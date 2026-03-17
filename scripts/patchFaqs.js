import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN
});

async function run() {
  const faqs = await client.fetch('*[_type == "faq"]');
  
  // delete related faqs
  const toDelete = faqs.filter(f => f.question.toLowerCase().includes('reward') || f.question.toLowerCase().includes('points') || f.question.toLowerCase().includes('tier'));
  for (const doc of toDelete) {
    console.log(`Deleting ${doc._id}`);
    await client.delete(doc._id);
  }

  // add new faqs about tiers
  console.log('Adding Tier FAQ 1...');
  await client.create({
    _type: 'faq',
    question: 'How does the Member Tier system work?',
    faqCategory: 'ordering',
    sortOrder: 100,
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Our Member Tier system rewards our most loyal customers. We use your total Lifetime Spend to calculate your Tier. There are four tiers: Apprentice Tier (🔪), Choice Tier (🥩), Prime Tier (🍗), and Wagyu Tier (👑). Each tier unlocks new exclusive perks like free local delivery, early access to restocks, and even an unconditional 10% off in-store!'
          }
        ]
      }
    ]
  });

  console.log('Adding Tier FAQ 2...');
  await client.create({
    _type: 'faq',
    question: 'Do my Member Tier points ever expire?',
    faqCategory: 'ordering',
    sortOrder: 101,
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "No! Unlike traditional 'points' that expire, our Tier system is based strictly on your total Lifetime Spend with Hofherr Meat Co. Once you unlock a higher tier, you stay there forever because your total lifetime spent will never go down."
          }
        ]
      }
    ]
  });

  console.log('Done!');
}

run().catch(console.error);

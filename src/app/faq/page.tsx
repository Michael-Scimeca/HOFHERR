import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { FAQS_QUERY } from '@/sanity/queries';
import FaqClient from './FaqClient';

export const metadata = {
    title: 'FAQ — Hofherr Meat Co.',
    description: 'Frequently asked questions about ordering, custom cuts, BBQ catering, gift cards, and more at Hofherr Meat Co. in Northfield, IL.',
};

type SanityFaq = {
    _id: string;
    question: string;
    answer: { _type: string; children: { text: string }[] }[];
    faqCategory: string;
};

export default async function FaqPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let faqs: SanityFaq[] = [];
    try {
        faqs = await sanityClient.fetch(FAQS_QUERY);
    } catch {
        faqs = [];
    }

    // Group FAQs by category
    const categoryLabels: Record<string, string> = {
        ordering: 'Shopping & Orders',
        products: 'Product & Quality',
        catering: 'BBQ Catering',
        delivery: 'Delivery & Pickup',
        general: 'Gift Cards & General',
    };

    const grouped = faqs.reduce(
        (acc, faq) => {
            const cat = faq.faqCategory ?? 'general';
            if (!acc[cat]) acc[cat] = [];
            const answerText = faq.answer
                ?.map((block) => block.children?.map((c) => c.text).join(''))
                .join('\n') ?? '';
            acc[cat].push({ q: faq.question, a: answerText });
            return acc;
        },
        {} as Record<string, { q: string; a: string }[]>,
    );

    const faqData = Object.entries(grouped).map(([key, items]) => ({
        category: categoryLabels[key] ?? key,
        items,
    }));

    return <FaqClient faqs={faqData} />;
}

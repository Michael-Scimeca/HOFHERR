import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { FAQS_QUERY } from '@/sanity/queries';
import FaqClient from './FaqClient';

export const metadata = {
    title: 'FAQ | Hofherr Meat Co. — Ordering, Catering & Custom Cuts',
    description: 'Frequently asked questions about ordering, custom cuts, BBQ catering, gift cards, curbside pickup, and more at Hofherr Meat Co. in Northfield & Winnetka, IL.',
    alternates: { canonical: 'https://hofherrmeatco.com/faq' },
    openGraph: {
        title: 'FAQ | Hofherr Meat Co.',
        description: 'Answers to common questions about orders, catering, custom cuts, and gift cards.',
        url: 'https://hofherrmeatco.com/faq',
        images: [{ url: '/OG/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FAQ | Hofherr Meat Co.',
        description: 'Ordering, catering, custom cuts, gift cards — all your questions answered.',
    },
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

import { HOLIDAY_SELLING_GUIDES, type HolidaySellingGuide } from '@/app/catering/holidays/holidayCateringData';

export interface HolidayHeroConfig {
    id: string;
    guide: HolidaySellingGuide;
    windowLabel: string;
    startMonth: number; // 1-12
    startDay: number;
    endMonth: number; // 1-12
    endDay: number;
    ctaLabel: string;
    ctaHref: string;
    accent: 'red' | 'gold';
}

const WINDOW_BY_ID: Record<
    string,
    {
        windowLabel: string;
        startMonth: number;
        startDay: number;
        endMonth: number;
        endDay: number;
        ctaLabel: string;
        ctaHref: string;
        accent: 'red' | 'gold';
    }
> = {
    'super-bowl': {
        windowLabel: 'Jan 20 – Feb 10',
        startMonth: 1,
        startDay: 20,
        endMonth: 2,
        endDay: 10,
        ctaLabel: 'Build Game-Day Spread →',
        ctaHref: '/catering#build-your-package',
        accent: 'red',
    },
    'valentines-day': {
        windowLabel: 'Feb 11 – Feb 15',
        startMonth: 2,
        startDay: 11,
        endMonth: 2,
        endDay: 15,
        ctaLabel: 'Reserve Prime Steaks →',
        ctaHref: '/online-orders?store=butcher',
        accent: 'red',
    },
    'st-patricks-day': {
        windowLabel: 'Feb 25 – Mar 18',
        startMonth: 2,
        startDay: 25,
        endMonth: 3,
        endDay: 18,
        ctaLabel: 'Order Corned Beef & Brisket →',
        ctaHref: '/online-orders?store=butcher',
        accent: 'gold',
    },
    'easter-passover': {
        windowLabel: 'Mar 19 – Apr 22',
        startMonth: 3,
        startDay: 19,
        endMonth: 4,
        endDay: 22,
        ctaLabel: 'Reserve Holiday Roasts →',
        ctaHref: '/catering/holidays#easter-passover',
        accent: 'gold',
    },
    'mothers-day': {
        windowLabel: 'Apr 23 – May 12',
        startMonth: 4,
        startDay: 23,
        endMonth: 5,
        endDay: 12,
        ctaLabel: 'Plan Mother’s Day Menu →',
        ctaHref: '/catering/holidays#mothers-day',
        accent: 'gold',
    },
    'memorial-day': {
        windowLabel: 'May 13 – May 28',
        startMonth: 5,
        startDay: 13,
        endMonth: 5,
        endDay: 28,
        ctaLabel: 'Build Memorial Day BBQ →',
        ctaHref: '/catering#build-your-package',
        accent: 'red',
    },
    'fathers-day': {
        windowLabel: 'May 29 – Jun 19',
        startMonth: 5,
        startDay: 29,
        endMonth: 6,
        endDay: 19,
        ctaLabel: 'Reserve Dry-Aged Steaks →',
        ctaHref: '/online-orders?store=butcher',
        accent: 'red',
    },
    'fourth-of-july': {
        windowLabel: 'Jun 20 – Jul 5',
        startMonth: 6,
        startDay: 20,
        endMonth: 7,
        endDay: 5,
        ctaLabel: 'Book July 4th BBQ & Pig Roast →',
        ctaHref: '/catering#build-your-package',
        accent: 'red',
    },
    'labor-day': {
        windowLabel: 'Aug 15 – Sep 7',
        startMonth: 8,
        startDay: 15,
        endMonth: 9,
        endDay: 7,
        ctaLabel: 'Build Labor Day Spread →',
        ctaHref: '/catering#build-your-package',
        accent: 'red',
    },
    'high-holidays': {
        windowLabel: 'Sep 8 – Oct 12',
        startMonth: 9,
        startDay: 8,
        endMonth: 10,
        endDay: 12,
        ctaLabel: 'Reserve Holiday Brisket →',
        ctaHref: '/catering/holidays#high-holidays',
        accent: 'gold',
    },
    thanksgiving: {
        windowLabel: 'Oct 25 – Nov 28',
        startMonth: 10,
        startDay: 25,
        endMonth: 11,
        endDay: 28,
        ctaLabel: 'Reserve Thanksgiving Turkey & Sides →',
        ctaHref: '/catering/holidays#thanksgiving',
        accent: 'gold',
    },
    'december-holidays': {
        windowLabel: 'Nov 29 – Dec 31',
        startMonth: 11,
        startDay: 29,
        endMonth: 12,
        endDay: 31,
        ctaLabel: 'Reserve Prime Rib & Standing Roasts →',
        ctaHref: '/catering/holidays#december-holidays',
        accent: 'gold',
    },
};

export const ALL_HOLIDAY_HEROES: HolidayHeroConfig[] = HOLIDAY_SELLING_GUIDES.map(guide => {
    const meta = WINDOW_BY_ID[guide.id] ?? {
        windowLabel: guide.timing,
        startMonth: 1,
        startDay: 1,
        endMonth: 12,
        endDay: 31,
        ctaLabel: 'View Holiday Catering →',
        ctaHref: `/catering/holidays#${guide.id}`,
        accent: 'gold' as const,
    };
    return {
        id: guide.id,
        guide,
        ...meta,
    };
});

function toDayOfYearKey(month: number, day: number): number {
    return month * 100 + day;
}

const CT_MONTH_DAY_FMT = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    month: 'numeric',
    day: 'numeric',
});

/** Returns the active Hofherr holiday for a given date (or an explicit override ID from ?holiday=...). */
export function getActiveHolidayHero(date = new Date(), overrideId?: string | null): HolidayHeroConfig | null {
    if (overrideId) {
        const match = ALL_HOLIDAY_HEROES.find(h => h.id === overrideId);
        if (match) return match;
    }

    const parts = CT_MONTH_DAY_FMT.formatToParts(date);
    const month = Number(parts.find(p => p.type === 'month')?.value ?? date.getMonth() + 1);
    const day = Number(parts.find(p => p.type === 'day')?.value ?? date.getDate());
    const key = toDayOfYearKey(month, day);

    for (const h of ALL_HOLIDAY_HEROES) {
        const start = toDayOfYearKey(h.startMonth, h.startDay);
        const end = toDayOfYearKey(h.endMonth, h.endDay);
        if (start <= end) {
            if (key >= start && key <= end) return h;
        } else {
            if (key >= start || key <= end) return h;
        }
    }
    return null;
}


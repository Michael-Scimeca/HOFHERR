'use client';
import { createContext, useContext, type ReactNode } from 'react';

/* ── Types ─────────────────────────────────────────────────────────────── */
export type StoreHourEntry = {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
};

export type SiteSettings = {
    shopName: string;
    phone: string;
    email: string;
    address: { street: string; city: string; state: string; zip: string } | null;
    butcherHours: StoreHourEntry[];
    depotHours: StoreHourEntry[];
    instagram: string;
    facebook: string;
    yelp: string;
    googleMaps: string;
    announcement: string;
    announcementActive: boolean;
    announcementColor: string;
};

/* ── Defaults (match current hardcoded values) ─────────────────────────── */
export const DEFAULT_SETTINGS: SiteSettings = {
    shopName: 'Hofherr Meat Co.',
    phone: '(847) 441-MEAT',
    email: 'butcher@hofherrmeatco.com',
    address: { street: '300 Happ Rd', city: 'Northfield', state: 'IL', zip: '60093' },
    butcherHours: [
        { day: 'Tuesday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
        { day: 'Wednesday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
        { day: 'Thursday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
        { day: 'Friday', open: '10:00 AM', close: '6:00 PM', isClosed: false },
        { day: 'Saturday', open: '10:00 AM', close: '5:00 PM', isClosed: false },
        { day: 'Sunday', open: '10:00 AM', close: '4:00 PM', isClosed: false },
        { day: 'Monday', open: '', close: '', isClosed: true },
    ],
    depotHours: [
        { day: 'Monday', open: '10:30 AM', close: '6:00 PM', isClosed: false },
        { day: 'Tuesday', open: '10:30 AM', close: '6:00 PM', isClosed: false },
        { day: 'Wednesday', open: '10:30 AM', close: '6:00 PM', isClosed: false },
        { day: 'Thursday', open: '10:30 AM', close: '6:00 PM', isClosed: false },
        { day: 'Friday', open: '10:30 AM', close: '6:00 PM', isClosed: false },
        { day: 'Saturday', open: '', close: '', isClosed: true },
        { day: 'Sunday', open: '', close: '', isClosed: true },
    ],
    instagram: 'https://www.instagram.com/hofherrmeatco',
    facebook: 'https://www.facebook.com/HofherrMeatCo',
    yelp: 'https://www.yelp.com/biz/hofherr-meat-co-northfield',
    googleMaps: 'https://g.page/hofherrmeatco',
    announcement: '',
    announcementActive: false,
    announcementColor: 'blue',
};

/* ── Context ───────────────────────────────────────────────────────────── */
const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SiteSettingsProvider({
    settings,
    children,
}: {
    settings: SiteSettings;
    children: ReactNode;
}) {
    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}

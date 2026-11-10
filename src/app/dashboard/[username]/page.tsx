import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { client } from '@/sanity/client';
import { CUSTOMER_BY_USERNAME_QUERY, ORDER_HISTORY_QUERY, SPECIALS_QUERY } from '@/sanity/queries';
import DashboardClient from '../DashboardClient';
import { DEMO_ORDERS, DEMO_SPECIALS } from '../demoData';
import styles from '../dashboard.module.css';

interface Props {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;
    const cleanUsername = decodeURIComponent(username).trim();
    return {
        title: `${cleanUsername} | Butcher Guild Member Dashboard | Hofherr Meat Co.`,
        description: `Manage your Hofherr Meat Co. Butcher Guild profile, order history, and exclusive member cuts for @${cleanUsername}.`,
        robots: { index: false, follow: false },
    };
}

export default async function CustomerDashboardPage({ params }: Props) {
    const { username: rawUsername } = await params;
    const cleanUsername = decodeURIComponent(rawUsername).trim();

    // If an admin attempts to visit /dashboard/admin, redirect to admin dashboard
    if (cleanUsername.toLowerCase() === 'admin') {
        redirect('/admin-dashboard/admin');
    }

    const session = await auth();
    const cookieStore = await cookies();
    const isGodMode =
        process.env.NODE_ENV !== 'production' &&
        cookieStore.get('hofherr_god_mode')?.value === 'true';

    // Fetch customer by username
    const customerRecord = await client.fetch(CUSTOMER_BY_USERNAME_QUERY, { username: cleanUsername }).catch(() => null);

    if (!customerRecord) {
        return (
            <main className={styles.notFoundContainer}>
                <div className={styles.notFoundCard}>
                    <h1 className={styles.notFoundTitle}>Butcher Guild Profile Not Found</h1>
                    <p className={styles.notFoundText}>
                        No Hofherr Butcher Guild member was found with handle <strong>@{cleanUsername}</strong>.
                    </p>
                    <div className={styles.notFoundActions}>
                        <Link href="/register" className={styles.notFoundBtnPrimary}>
                            Join the Butcher Guild →
                        </Link>
                        <Link href="/" className={styles.notFoundBtnSecondary}>
                            Return to Storefront
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const email = customerRecord.email || session?.user?.email || 'customer@hofherrmeats.com';
    const userName = customerRecord.name || cleanUsername;
    const initial = userName.charAt(0).toUpperCase();

    let orderHistory: typeof DEMO_ORDERS = [];
    if (customerRecord._id) {
        orderHistory = await client.fetch(ORDER_HISTORY_QUERY, { customerId: customerRecord._id }).catch(() => []);
    }

    const cmsSpecials = await client.fetch(SPECIALS_QUERY).catch(() => []);
    const hasRealOrders = Array.isArray(orderHistory) && orderHistory.length > 0;
    const finalOrders = hasRealOrders ? orderHistory : DEMO_ORDERS;
    const finalSpecials = Array.isArray(cmsSpecials) && cmsSpecials.length > 0 ? cmsSpecials : DEMO_SPECIALS;

    const address = customerRecord.address || '300 Happ Rd, Northfield, IL 60093';
    const phone = customerRecord.phone || '847-441-6328';
    const avatar = customerRecord.avatar || '/assets/avatars/avatar-angus-bull.jpg';
    const birthday = customerRecord.birthday || '1984-10-14';
    const newsletter = customerRecord.newsletter ?? true;
    const preferredPickupTime = customerRecord.preferredPickupTime || '2:00 PM';
    const displayUsername = customerRecord.username || cleanUsername;
    const bio = customerRecord.bio || '';
    const favoriteCut = customerRecord.favoriteCut || 'USDA Prime Dry-Aged Ribeye';
    const memberSince = customerRecord.createdAt ? new Date(customerRecord.createdAt).getFullYear().toString() : '2024';

    return (
        <DashboardClient
            userName={userName}
            username={displayUsername}
            email={email}
            phone={phone}
            address={address}
            initial={initial}
            initialOrders={finalOrders}
            specials={finalSpecials}
            avatar={avatar}
            birthday={birthday}
            newsletter={newsletter}
            preferredPickupTime={preferredPickupTime}
            bio={bio}
            favoriteCut={favoriteCut}
            memberSince={memberSince}
        />
    );
}

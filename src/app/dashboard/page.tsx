import React from 'react';
import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { client } from '@/sanity/client';
import { CUSTOMER_BY_EMAIL_QUERY, ORDER_HISTORY_QUERY, SPECIALS_QUERY } from '@/sanity/queries';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
    title: 'My Account',
    description: 'Manage your Hofherr Meat Co. account, view order history, and access exclusive member specials.',
    robots: { index: false, follow: false },
};

export default async function DashboardPage() {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect('/');
    }

    // Redirect admins to the admin console instead of the customer dashboard
    if (session.user.isAdmin) {
        redirect('/admin');
    }

    const userName = session.user?.name || 'Customer';
    const email = session.user.email;
    const initial = userName.charAt(0).toUpperCase();

    // Fetch customer from Sanity using email to get the ID
    const customerRecord = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, { email });

    let orderHistory: any[] = [];
    if (customerRecord?._id) {
        // Fetch historical orders for this customer ID
        orderHistory = await client.fetch(ORDER_HISTORY_QUERY, { customerId: customerRecord._id });
    }

    // Fetch active specials
    const specials = await client.fetch(SPECIALS_QUERY);

    const address = customerRecord?.address || '';
    const phone = customerRecord?.phone || '';
    const avatar = customerRecord?.avatar || '';
    const birthday = customerRecord?.birthday || '';
    const newsletter = customerRecord?.newsletter || false;
    const preferredPickupTime = customerRecord?.preferredPickupTime || '';

    return (
        <DashboardClient 
            userName={userName} 
            email={email} 
            phone={phone}
            address={address}
            initial={initial} 
            initialOrders={orderHistory}
            specials={specials || []}
            avatar={avatar}
            birthday={birthday}
            newsletter={newsletter}
            preferredPickupTime={preferredPickupTime}
        />
    );
}

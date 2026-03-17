import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { client } from '@/sanity/client';
import { CUSTOMER_BY_EMAIL_QUERY, ORDER_HISTORY_QUERY } from '@/sanity/queries';
import DashboardClient from './DashboardClient';

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

    const address = customerRecord?.address || '';
    const phone = customerRecord?.phone || '';

    return (
        <DashboardClient 
            userName={userName} 
            email={email} 
            phone={phone}
            address={address}
            initial={initial} 
            initialOrders={orderHistory} 
        />
    );
}

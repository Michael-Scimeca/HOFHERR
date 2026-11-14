import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { adminClient } from '@/sanity/adminClient';
import AdminDashboardClient, { type AdminInitialData } from '@/app/admin/AdminDashboardClient';

export const metadata: Metadata = {
    title: 'Admin Console | Hofherr Meat Co.',
    description: 'Hofherr Meat Co. Butcher Block Command Center, Live Queues & Store Operations',
    robots: { index: false, follow: false },
};

interface Props {
    params: Promise<{ username: string }>;
}

export default async function AdminDashboardUserPage({ params }: Props) {
    const [{ username }, session, cookieStore] = await Promise.all([
        params,
        auth(),
        cookies(),
    ]);
    const isGodMode =
        process.env.NODE_ENV !== 'production' &&
        cookieStore.get('hofherr_god_mode')?.value === 'true';

    if ((!session?.user || !session.user.isAdmin) && !isGodMode) {
        redirect('/admin/login');
    }

    const [orders, products, restocks, users] = await Promise.all([
        adminClient
            .fetch<AdminInitialData['orders']>(
                `*[_type == "order"] | order(createdAt desc) {
                    _id,
                    orderNumber,
                    customer->{name, email, phone},
                    items,
                    total,
                    status,
                    createdAt,
                    pickupTime,
                    couponCode,
                    metadata
                }`
            )
            .catch(() => []),
        adminClient
            .fetch<AdminInitialData['products']>(`*[_type == "product"] { _id, name, category->{name} }`)
            .catch(() => []),
        adminClient
            .fetch<AdminInitialData['restocks']>(`*[_type == "restockRequest"] | order(createdAt desc)`)
            .catch(() => []),
        adminClient
            .fetch<AdminInitialData['users']>(
                `*[_type == "customer"] | order(_createdAt desc) [0..49] {
                    _id,
                    name,
                    email,
                    phone,
                    "isAdmin": coalesce(isAdmin, false),
                    "hasPassword": defined(password),
                    "createdAt": _createdAt,
                    address
                }`
            )
            .catch(() => []),
    ]);

    const initialData: AdminInitialData = {
        orders: Array.isArray(orders) ? orders : [],
        products: Array.isArray(products) ? products : [],
        restocks: Array.isArray(restocks) ? restocks : [],
        users: Array.isArray(users) ? users : [],
    };

    return <AdminDashboardClient username={username} initialData={initialData} />;
}

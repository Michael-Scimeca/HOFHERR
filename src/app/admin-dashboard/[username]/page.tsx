import React from 'react';
import type { Metadata } from 'next';
import AdminDashboardClient from '@/app/admin/AdminDashboardClient';

export const metadata: Metadata = {
    title: 'Admin Console | Hofherr Meat Co.',
    description: 'Hofherr Meat Co. Butcher Block Command Center, Live Queues & Store Operations',
    robots: { index: false, follow: false },
};

interface Props {
    params: Promise<{ username: string }>;
}

export default async function AdminDashboardUserPage({ params }: Props) {
    const { username } = await params;
    return <AdminDashboardClient username={username} />;
}


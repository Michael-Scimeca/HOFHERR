import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { client } from '@/sanity/client';
import { CUSTOMER_BY_EMAIL_QUERY } from '@/sanity/queries';

export default async function DashboardIndexRedirectPage() {
    const session = await auth();
    const cookieStore = await cookies();
    const isGodMode =
        process.env.NODE_ENV !== 'production' &&
        cookieStore.get('hofherr_god_mode')?.value === 'true';

    // If an admin navigates to /dashboard, redirect them to their admin dashboard
    if (session?.user?.isAdmin) {
        const adminEmail = session.user.email || 'admin@hofherrmeats.com';
        const adminCustomer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, { email: adminEmail }).catch(() => null);
        const adminUsername = adminCustomer?.username || 'admin';
        redirect(`/admin-dashboard/${encodeURIComponent(adminUsername)}`);
    }

    if ((!session || !session.user?.email) && !isGodMode) {
        redirect('/login');
    }

    const email = session?.user?.email || 'mikeyscimeca@gmail.com';
    const customerRecord = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, { email }).catch(() => null);

    const username = customerRecord?.username || (email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '') : 'michaelscimeca');

    redirect(`/dashboard/${encodeURIComponent(username)}`);
}

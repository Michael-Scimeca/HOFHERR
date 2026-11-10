import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { client } from '@/sanity/client';
import { CUSTOMER_BY_EMAIL_QUERY } from '@/sanity/queries';

export default async function AdminDashboardIndexRedirect() {
    const session = await auth();
    const cookieStore = await cookies();
    const isGodMode =
        process.env.NODE_ENV !== 'production' &&
        cookieStore.get('hofherr_god_mode')?.value === 'true';

    if ((!session || !session.user) && !isGodMode) {
        redirect('/admin/login');
    }

    const email = session?.user?.email || 'admin@hofherrmeats.com';
    let username = 'admin';

    if (email) {
        const customer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, { email }).catch(() => null);
        if (customer?.username) {
            username = customer.username;
        } else if (email === 'admin@hofherrmeats.com') {
            username = 'admin';
        } else if (email.includes('@')) {
            username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
        }
    }

    redirect(`/admin-dashboard/${encodeURIComponent(username)}`);
}


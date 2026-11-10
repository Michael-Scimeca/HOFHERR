import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{ username: string }>;
}

export default async function AdminDashbaordTypoUserRedirect({ params }: Props) {
    const { username } = await params;
    redirect(`/admin-dashboard/${encodeURIComponent(username)}`);
}


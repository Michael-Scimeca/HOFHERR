import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!session.user.isAdmin && process.env.NODE_ENV !== 'development') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const query = searchParams.get('query') || '';
        
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        let filter = `*[_type == "customer"]`;
        if (query) {
            filter = `*[_type == "customer" && (name match "*${query}*" || email match "*${query}*" || phone match "*${query}*")]`;
        }

        const [users, total] = await Promise.all([
            adminClient.fetch(`${filter} | order(_createdAt desc) [${start}..${end}] {
                _id,
                name,
                email,
                phone,
                "hasPassword": defined(password),
                "createdAt": _createdAt,
                address
            }`),
            adminClient.fetch(`count(${filter})`)
        ]);

        return NextResponse.json({ users, total });

    } catch (error: any) {
        console.error('Customer fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

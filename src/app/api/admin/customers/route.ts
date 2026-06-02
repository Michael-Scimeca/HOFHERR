import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!session.user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const query = searchParams.get('query') || '';
        
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        // Use parameterized queries to prevent GROQ injection
        const hasQuery = !!query;
        const baseFilter = hasQuery
            ? `*[_type == "customer" && (name match $q || email match $q || phone match $q)]`
            : `*[_type == "customer"]`;
        const params = hasQuery ? { q: `*${query}*` } : {};

        const [users, total] = await Promise.all([
            adminClient.fetch(`${baseFilter} | order(_createdAt desc) [$start..$end] {
                _id,
                name,
                email,
                phone,
                "hasPassword": defined(password),
                "createdAt": _createdAt,
                address
            }`, { ...params, start, end }),
            adminClient.fetch(`count(${baseFilter})`, params)
        ]);

        return NextResponse.json({ users, total });

    } catch (error: any) {
        console.error('Customer fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

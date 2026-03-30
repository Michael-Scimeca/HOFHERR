import { NextResponse } from 'next/server';
import { getClient } from '@/sanity/client';
import { CATERING_QUERY } from '@/sanity/queries';

export async function GET() {
  try {
    const sanityClient = getClient(false);
    const packages = await sanityClient.fetch(CATERING_QUERY);
    // Return only id and name for simplicity
    const result = packages.map((p: any) => ({ id: p._id, name: p.name }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching catering packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
